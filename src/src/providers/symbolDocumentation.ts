import * as vscode from 'vscode';
import * as path from 'path';
import { UnifiedSymbol, SymbolKind } from '../parser';
import {
    SubroutineInfo,
    VariableInfo,
    ConstantInfo,
    Parameter,
    BlockInfo,
    ModuleInfo,
    formatSubroutineSignature
} from '../data/librarySymbolsHelpers';
import { BuiltinFunctionInfo } from '../data/builtinFunctions';
import { ImportedFileSymbols } from '../parser/importResolver';

// ---------------------------------------------------------------------------
//  Shared documentation-formatting helpers used by both the Hover and
//  Completion providers.  Every function returns a MarkdownString so that
//  each provider can wrap it as it sees fit (Hover, CompletionItem.documentation, …).
// ---------------------------------------------------------------------------

// ── Prog8 ↔ ProgB type / parameter conversion ────────────────────────

/**
 * Convert a Prog8 type name to its ProgB equivalent.
 * Handles special mappings (e.g. `str` → `STRING`) before uppercasing.
 */
export function progbType(type: string): string {
    // Strip leading pointer markers so we can map the base name
    const pointerPrefix = type.match(/^(\^+)/)?.[1] ?? '';
    const base = type.substring(pointerPrefix.length);
    const mapped = base.toLowerCase() === 'str' ? 'STRING' : base.toUpperCase();
    return pointerPrefix + mapped;
}

/**
 * Convert a prog8 parameter string ("type name, type2 name2") to ProgB
 * style ("name AS TYPE, name2 AS TYPE2").
 */
export function formatParamsProgB(params: string | undefined): string {
    if (!params) return '';
    return params.split(',').map(p => {
        const trimmed = p.trim();
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
            const type = parts[0];
            const rest = parts.slice(1).join(' ');
            const regMatch = rest.match(/^(\w+)\s*(@\w+)?$/);
            if (regMatch) {
                const name = regMatch[1];
                const reg = regMatch[2] || '';
                return `${name} AS ${progbType(type)}${reg ? ' ' + reg : ''}`;
            }
            return `${rest} AS ${progbType(type)}`;
        }
        return trimmed;
    }).join(', ');
}

// ── UnifiedSymbol → MarkdownString ─────────────────────────────────────

/**
 * Build rich documentation for a parsed `UnifiedSymbol`.
 *
 * Used by both hover (wrapped in `Hover`) and completion (assigned to
 * `CompletionItem.documentation`).
 */
export function formatUnifiedSymbolDoc(
    symbol: UnifiedSymbol,
    isProgB: boolean = false,
    isImported: boolean = false
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';

    switch (symbol.kind) {
        case SymbolKind.Block:
            if (isProgB) {
                markdown.appendCodeblock(`MODULE ${symbol.name}${symbol.detail ? ' ' + symbol.detail : ''} ... END MODULE`, langId);
            } else {
                markdown.appendCodeblock(`${symbol.name}${symbol.detail ? ' ' + symbol.detail : ''} { }`, langId);
            }
            markdown.appendMarkdown('\n\n*Block (namespace)*');
            break;

        case SymbolKind.Subroutine: {
            if (isProgB) {
                const sig = symbol.returnType
                    ? `FUNCTION ${symbol.name}(${formatParamsProgB(symbol.parameters)}) AS ${progbType(symbol.returnType)}`
                    : `SUB ${symbol.name}(${formatParamsProgB(symbol.parameters)})`;
                markdown.appendCodeblock(sig, langId);
            } else {
                const sig = `sub ${symbol.name}(${symbol.parameters || ''})${symbol.returnType ? ' -> ' + symbol.returnType : ''}`;
                markdown.appendCodeblock(sig, langId);
            }
            if (symbol.detail === 'inline') {
                markdown.appendMarkdown('\n\n*Inline subroutine*');
            }
            break;
        }

        case SymbolKind.AsmSubroutine: {
            if (isProgB) {
                markdown.appendCodeblock(`ASMSUB ${symbol.name}(${formatParamsProgB(symbol.parameters)})`, langId);
            } else {
                markdown.appendCodeblock(`asmsub ${symbol.name}(${symbol.parameters || ''})`, langId);
            }
            markdown.appendMarkdown('\n\n*Assembly subroutine*');
            break;
        }

        case SymbolKind.ExtSubroutine: {
            if (isProgB) {
                markdown.appendCodeblock(`EXTSUB ${symbol.detail} = ${symbol.name}(${formatParamsProgB(symbol.parameters)})`, langId);
            } else {
                markdown.appendCodeblock(`extsub ${symbol.detail} = ${symbol.name}(${symbol.parameters || ''})`, langId);
            }
            markdown.appendMarkdown('\n\n*External ROM/library routine*');
            break;
        }

        case SymbolKind.Constant:
            if (isProgB) {
                markdown.appendCodeblock(`CONST ${symbol.name} AS ${symbol.type ? progbType(symbol.type) : 'UBYTE'} = ${symbol.detail}`, langId);
            } else {
                markdown.appendCodeblock(`const ${symbol.type} ${symbol.name} = ${symbol.detail}`, langId);
            }
            markdown.appendMarkdown('\n\n*Constant*');
            break;

        case SymbolKind.Variable: {
            if (isProgB) {
                let varDecl = `DIM ${symbol.name} AS ${symbol.type ? progbType(symbol.type) : 'UBYTE'}`;
                if (symbol.detail) { varDecl += ` ${symbol.detail}`; }
                markdown.appendCodeblock(varDecl, langId);
            } else {
                let varDecl = `${symbol.type} ${symbol.name}`;
                if (symbol.detail) { varDecl += ` ${symbol.detail}`; }
                markdown.appendCodeblock(varDecl, langId);
            }
            if (symbol.type?.startsWith('&')) {
                markdown.appendMarkdown('\n\n*Memory-mapped variable*');
            } else {
                markdown.appendMarkdown('\n\n*Variable*');
            }
            break;
        }

        case SymbolKind.Parameter:
            if (isProgB) {
                markdown.appendCodeblock(`${symbol.name} AS ${symbol.type ? progbType(symbol.type) : 'UBYTE'}`, langId);
            } else {
                markdown.appendCodeblock(`${symbol.type} ${symbol.name}`, langId);
            }
            markdown.appendMarkdown('\n\n*Parameter*');
            break;

        case SymbolKind.Label:
            markdown.appendCodeblock(`${symbol.name}:`, langId);
            markdown.appendMarkdown('\n\n*Label*');
            break;

        case SymbolKind.Struct:
            if (isProgB) {
                markdown.appendCodeblock(`TYPE ${symbol.name} ... END TYPE`, langId);
            } else {
                markdown.appendCodeblock(`struct ${symbol.name} { }`, langId);
            }
            markdown.appendMarkdown('\n\n*Struct type*');
            break;

        case SymbolKind.Alias:
            if (isProgB) {
                markdown.appendCodeblock(`ALIAS ${symbol.name} = ${symbol.detail}`, langId);
            } else {
                markdown.appendCodeblock(`alias ${symbol.name} ${symbol.detail}`, langId);
            }
            markdown.appendMarkdown('\n\n*Alias*');
            break;

        case SymbolKind.StructField:
            if (isProgB) {
                markdown.appendCodeblock(`${symbol.name} AS ${symbol.type ? progbType(symbol.type) : 'UBYTE'}`, langId);
            } else {
                markdown.appendCodeblock(`${symbol.type} ${symbol.name}`, langId);
            }
            markdown.appendMarkdown('\n\n*Struct field*');
            break;
    }

    // Full path when nested
    if (symbol.parent) {
        markdown.appendMarkdown(`\n\n*Defined in:* \`${symbol.fullPath}\``);
    }

    // Source file for imported symbols
    if (isImported && symbol.uri) {
        const fileName = path.basename(symbol.uri.fsPath);
        markdown.appendMarkdown(`\n\n*From imported file:* \`${fileName}\``);
    }

    return markdown;
}

// ── Library symbols → MarkdownString ───────────────────────────────────

/**
 * Documentation for a library subroutine (from skeleton files).
 */
export function formatLibrarySubroutineDoc(
    sub: SubroutineInfo,
    qualifiedName: string,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';

    if (sub.isAlias) {
        markdown.appendCodeblock(`${qualifiedName}  (alias for ${sub.isAlias})`, langId);
        markdown.appendMarkdown(`\n\n*Library function alias*`);
    } else {
        let sig: string;

        if (isProgB) {
            const params = sub.parameters.map(p => {
                let s = `${p.name} AS ${progbType(p.type)}`;
                if (p.register) s += ` ${p.register}`;
                return s;
            }).join(', ');

            if (sub.returns.length > 0) {
                const rets = sub.returns.map(r => {
                    let s = progbType(r.type);
                    if (r.register) s += ` ${r.register}`;
                    return s;
                }).join(', ');
                sig = `FUNCTION ${qualifiedName}(${params}) AS ${rets}`;
            } else {
                sig = `SUB ${qualifiedName}(${params})`;
            }
        } else {
            const params = sub.parameters.map(p => {
                let s = `${p.type} ${p.name}`;
                if (p.register) s += ` ${p.register}`;
                return s;
            }).join(', ');

            sig = `${qualifiedName}(${params})`;

            if (sub.returns.length > 0) {
                const rets = sub.returns.map(r => {
                    let s = r.type;
                    if (r.register) s += ` ${r.register}`;
                    return s;
                }).join(', ');
                sig += ` -> ${rets}`;
            }
        }

        markdown.appendCodeblock(sig, langId);

        // Metadata
        const metadata: string[] = [];
        if (sub.clobbers.length > 0) {
            metadata.push(`Clobbers: ${sub.clobbers.join(', ')}`);
        }
        if (sub.address) {
            metadata.push(`ROM address: ${sub.address}`);
        }
        if (sub.bank !== undefined) {
            metadata.push(`Bank: ${sub.bank}`);
        }
        if (metadata.length > 0) {
            markdown.appendMarkdown(`\n\n${metadata.join(' | ')}`);
        }

        markdown.appendMarkdown(`\n\n*Library function*`);
    }

    return markdown;
}

/**
 * Documentation for a library variable.
 */
export function formatLibraryVariableDoc(
    variable: VariableInfo,
    qualifiedName: string,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';

    let decl: string;
    if (isProgB) {
        decl = `DIM ${qualifiedName} AS ${progbType(variable.type)}`;
    } else {
        decl = `${variable.type} ${qualifiedName}`;
    }
    markdown.appendCodeblock(decl, langId);

    const tags: string[] = [];
    if (variable.isMemoryMapped) tags.push('memory-mapped');
    if (variable.isShared) tags.push('shared');
    if (variable.isZeroPage) tags.push('zeropage');
    if (tags.length > 0) {
        markdown.appendMarkdown(`\n\n${tags.join(' | ')}`);
    }
    markdown.appendMarkdown('\n\n*Library variable*');
    return markdown;
}

/**
 * Documentation for a library constant.
 */
export function formatLibraryConstantDoc(
    constant: ConstantInfo,
    qualifiedName: string,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';

    let decl: string;
    if (isProgB) {
        decl = `CONST ${qualifiedName} AS ${progbType(constant.type)}`;
    } else {
        decl = `const ${constant.type} ${qualifiedName}`;
    }
    if (constant.value) {
        decl += ` = ${constant.value}`;
    }
    markdown.appendCodeblock(decl, langId);
    markdown.appendMarkdown('\n\n*Library constant*');
    return markdown;
}

/**
 * Documentation for a subroutine parameter accessed via scoped path.
 */
export function formatLibraryParameterDoc(
    parameter: Parameter,
    sub: SubroutineInfo,
    qualifiedName: string,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';

    let decl: string;
    if (isProgB) {
        decl = `${qualifiedName} AS ${progbType(parameter.type)}`;
    } else {
        decl = `${parameter.type} ${qualifiedName}`;
    }
    if (parameter.register) {
        decl += ` @${parameter.register}`;
    }
    markdown.appendCodeblock(decl, langId);
    markdown.appendMarkdown(`\n\n*Parameter of* \`${sub.name}()\``);
    markdown.appendMarkdown('\n\n*Library symbol*');
    return markdown;
}

// ── Built-in functions ─────────────────────────────────────────────────

/**
 * Documentation for a built-in compiler function (abs, len, peek, …).
 */
export function formatBuiltinDoc(
    info: BuiltinFunctionInfo,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';
    const signature = isProgB ? info.signature.toUpperCase() : info.signature;
    markdown.appendCodeblock(signature, langId);
    markdown.appendMarkdown(`\n\n${info.description}`);
    markdown.appendMarkdown(`\n\n*Built-in function* (${info.category})`);
    return markdown;
}

// ── Keywords ───────────────────────────────────────────────────────────

/**
 * Documentation for a language keyword.
 */
export function formatKeywordDoc(
    word: string,
    description: string,
    isProgB: boolean,
    category?: string
): vscode.MarkdownString {
    const langId = isProgB ? 'progb' : 'prog8';
    const markdown = new vscode.MarkdownString();
    const displayWord = isProgB ? word.toUpperCase() : word;
    markdown.appendCodeblock(displayWord, langId);
    markdown.appendMarkdown(`\n\n${description}`);
    if (category === 'type') {
        markdown.appendMarkdown('\n\n*Type*');
    } else if (category) {
        markdown.appendMarkdown(`\n\n*Keyword* (${category})`);
    } else {
        markdown.appendMarkdown('\n\n*Keyword*');
    }
    return markdown;
}

// ── Library modules & blocks ───────────────────────────────────────────

/**
 * Documentation for a library module (what you `%import`).
 */
export function formatLibraryModuleDoc(
    mod: ModuleInfo,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';
    const importSyntax = isProgB ? `IMPORT ${mod.name}` : `%import ${mod.name}`;
    markdown.appendCodeblock(importSyntax, langId);

    let totalSubs = 0;
    let totalVars = 0;
    let totalConsts = 0;
    for (const block of mod.blocks) {
        totalSubs += block.subroutines.length;
        totalVars += block.variables.length;
        totalConsts += block.constants.length;
    }

    markdown.appendMarkdown(`\n\n*Library module* with ${mod.blocks.length} block${mod.blocks.length !== 1 ? 's' : ''}`);
    markdown.appendMarkdown(`, ${totalSubs} subroutines`);
    if (totalVars > 0) {
        markdown.appendMarkdown(`, ${totalVars} variables`);
    }
    if (totalConsts > 0) {
        markdown.appendMarkdown(`, ${totalConsts} constants`);
    }

    const blockNames = mod.blocks.map(b => b.name);
    if (blockNames.length > 0) {
        markdown.appendMarkdown(`\n\n**Blocks:** \`${blockNames.join('`, `')}\``);
    }

    return markdown;
}

/**
 * Documentation for a library block (namespace inside a module).
 */
export function formatLibraryBlockDoc(
    block: BlockInfo,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';
    const blockSyntax = isProgB ? `MODULE ${block.name} ... END MODULE` : `${block.name} { }`;
    markdown.appendCodeblock(blockSyntax, langId);

    const subCount = block.subroutines.length;
    const varCount = block.variables.length;
    const constCount = block.constants.length;

    markdown.appendMarkdown(`\n\n*Library block* with ${subCount} subroutines`);
    if (varCount > 0) {
        markdown.appendMarkdown(`, ${varCount} variables`);
    }
    if (constCount > 0) {
        markdown.appendMarkdown(`, ${constCount} constants`);
    }

    const examples = block.subroutines.slice(0, 5).map(s => s.name);
    if (examples.length > 0) {
        markdown.appendMarkdown(`\n\n**Functions:** \`${examples.join('`, `')}\``);
        if (block.subroutines.length > 5) {
            markdown.appendMarkdown(`, ...`);
        }
    }

    return markdown;
}

/**
 * Documentation for a block from an imported local file.
 */
export function formatImportedBlockDoc(
    name: string,
    importedSymbols: UnifiedSymbol[],
    moduleName: string,
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';
    const blockSyntax = isProgB ? `MODULE ${name} ... END MODULE` : `${name} { }`;
    markdown.appendCodeblock(blockSyntax, langId);

    const subroutines = importedSymbols.filter(s =>
        (s.kind === SymbolKind.Subroutine || s.kind === SymbolKind.AsmSubroutine || s.kind === SymbolKind.ExtSubroutine) &&
        s.parent === name
    );
    const variables = importedSymbols.filter(s => s.kind === SymbolKind.Variable && s.parent === name);
    const constants = importedSymbols.filter(s => s.kind === SymbolKind.Constant && s.parent === name);

    markdown.appendMarkdown(`\n\n*Block from imported file* \`${moduleName}\``);

    if (subroutines.length > 0) {
        markdown.appendMarkdown(`\n\n${subroutines.length} subroutine${subroutines.length !== 1 ? 's' : ''}`);
    }
    if (variables.length > 0) {
        markdown.appendMarkdown(`, ${variables.length} variable${variables.length !== 1 ? 's' : ''}`);
    }
    if (constants.length > 0) {
        markdown.appendMarkdown(`, ${constants.length} constant${constants.length !== 1 ? 's' : ''}`);
    }

    const examples = subroutines.slice(0, 5).map(s => s.name);
    if (examples.length > 0) {
        markdown.appendMarkdown(`\n\n**Functions:** \`${examples.join('`, `')}\``);
        if (subroutines.length > 5) {
            markdown.appendMarkdown(`, ...`);
        }
    }

    return markdown;
}

// ── Local module imports ───────────────────────────────────────────────

/**
 * Documentation for a local (non-library) module import.
 */
export function formatLocalModuleDoc(
    moduleName: string,
    fileName: string,
    blocks: UnifiedSymbol[],
    isProgB: boolean
): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    const langId = isProgB ? 'progb' : 'prog8';
    const importSyntax = isProgB ? `IMPORT ${moduleName}` : `%import ${moduleName}`;
    markdown.appendCodeblock(importSyntax, langId);

    markdown.appendMarkdown(`\n\n*Local module* from \`${fileName}\``);

    if (blocks.length > 0) {
        markdown.appendMarkdown(`\n\n**Blocks:** \`${blocks.map(b => b.name).join('`, `')}\``);
    }

    return markdown;
}
