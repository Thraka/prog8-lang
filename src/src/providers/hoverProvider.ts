import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { findSubroutine, findVariable, findConstant, findSubroutineParameter, getAllBlocks, findModule, formatSubroutineSignature, SubroutineInfo, BlockInfo, ModuleInfo, VariableInfo, ConstantInfo, Parameter } from '../data/librarySymbolsHelpers';
import { getTargetPlatform, getTargetPlatformForDocument } from '../utils/targetPlatform';
import { parseImports, findSymbolInImports, ImportedFileSymbols, resolveLocalImport, getSrcDirsForDocument } from '../parser/importResolver';
import { getAllAccessibleSymbols, resolveStructMemberInAccessible } from '../parser/symbolAggregator';
import { isInImportStatement, getQualifiedNameAtPosition, isInComment } from './providerUtils';
import { getBuiltinFunction } from '../data/builtinFunctions';

/**
 * Provides hover information for Prog8 files.
 */
export class Prog8HoverProvider implements vscode.HoverProvider {

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        
        // Skip positions inside comments
        if (isInComment(document, position)) {
            return undefined;
        }

        // Determine if this is a ProgB document for syntax formatting
        const isProgB = unifiedParser.isProgB(document);

        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        // Check if we're in an import statement - if so, only show module info
        if (isInImportStatement(document, position)) {
            // Check library modules first
            const moduleHover = this.getLibraryModuleHover(word, isProgB);
            if (moduleHover) {
                return moduleHover;
            }
            // Check if it's a local module import
            const localModuleHover = await this.getLocalModuleHover(document, word, isProgB);
            if (localModuleHover) {
                return localModuleHover;
            }
            // In an import statement but not a known module - don't match anything else
            return undefined;
        }

        // Parse imported file symbols once via the unified aggregator and reuse throughout
        const accessible = await getAllAccessibleSymbols(document);
        const { localSymbols: symbols, importedFileSymbols, librarySymbols } = accessible;

        // Build filter sets so we only show library hovers for actually-imported items
        const importedLibBlockNames = new Set(
            librarySymbols.filter(s => s.kind === SymbolKind.Block).map(s => s.name)
        );
        const importedLibModuleNames = new Set(
            parseImports(document).filter(i => i.isLibrary).map(i => i.moduleName)
        );

        // Check if it's a qualified name (e.g., txt.print)
        const qualifiedName = getQualifiedNameAtPosition(document, position);
        if (qualifiedName && qualifiedName.includes('.')) {
            // First check library modules (from skeleton files) — only if the block is from an imported library
            const qualifiedBlockName = qualifiedName.split('.')[0];
            if (importedLibBlockNames.has(qualifiedBlockName)) {
                const libraryHover = this.getLibraryHover(qualifiedName, isProgB);
                if (libraryHover) {
                    return libraryHover;
                }
            }
            
            // If not a library, check local imports for qualified names
            // This handles cases like "localmodule.mysub" where localmodule is imported
            const importedSymbol = findSymbolInImports(qualifiedName, importedFileSymbols);
            if (importedSymbol) {
                return this.createHoverForSymbol(importedSymbol, isProgB, true);
            }
            
            // Also check current file for qualified names (e.g., myblock.mysub within same file)
            const localQualifiedSymbol = symbols.find(s => s.fullPath === qualifiedName);
            if (localQualifiedSymbol) {
                return this.createHoverForSymbol(localQualifiedSymbol, isProgB);
            }

            // Check for struct member access (e.g., variable.member where variable has a struct type)
            const currentScope = unifiedParser.getScopeAtPosition(symbols, position);
            const structMember = resolveStructMemberInAccessible(qualifiedName, accessible, currentScope);
            if (structMember) {
                return this.createHoverForSymbol(structMember, isProgB);
            }
        }

        // Check if it's a built-in function
        const builtinHover = this.getBuiltinHover(word, isProgB);
        if (builtinHover) {
            return builtinHover;
        }

        // Check if it's a keyword
        const keywordHover = this.getKeywordHover(word, isProgB);
        if (keywordHover) {
            return keywordHover;
        }

        // Check if it's a library module name (e.g., buffers, textio) — only if actually imported
        if (importedLibModuleNames.has(word)) {
            const moduleHover = this.getLibraryModuleHover(word, isProgB);
            if (moduleHover) {
                return moduleHover;
            }
        }

        // Check if it's a library block name (e.g., txt, sys, cx16) — only if from an imported library
        if (importedLibBlockNames.has(word)) {
            const blockHover = this.getLibraryBlockHover(word, isProgB);
            if (blockHover) {
                return blockHover;
            }
        }

        // Check if it's a block from an imported local file (e.g., helpers from %import myhelper)
        const importedBlockHover = this.getImportedBlockHover(word, importedFileSymbols, isProgB);
        if (importedBlockHover) {
            return importedBlockHover;
        }

        // Get current scope for context
        const currentScope = unifiedParser.getScopeAtPosition(symbols, position);

        // Find the symbol in current file
        const symbol = unifiedParser.findSymbol(symbols, word, currentScope);
        
        if (symbol) {
            return this.createHoverForSymbol(symbol, isProgB);
        }

        // Search in imported local files for unqualified names
        const importedSymbol = findSymbolInImports(qualifiedName || word, importedFileSymbols, currentScope);
        if (importedSymbol) {
            return this.createHoverForSymbol(importedSymbol, isProgB, true);
        }

        return undefined;
    }

    /**
     * Create a hover for a symbol
     * @param symbol The symbol to create a hover for
     * @param isProgB Whether to format in ProgB (BASIC-style) syntax
     * @param isImported Whether the symbol comes from an imported file
     */
    private createHoverForSymbol(symbol: UnifiedSymbol, isProgB: boolean = false, isImported: boolean = false): vscode.Hover {
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

            case SymbolKind.Subroutine:
                if (isProgB) {
                    const subSig = symbol.returnType 
                        ? `FUNCTION ${symbol.name}(${this.formatParamsProgB(symbol.parameters)}) AS ${symbol.returnType.toUpperCase()}`
                        : `SUB ${symbol.name}(${this.formatParamsProgB(symbol.parameters)})`;
                    markdown.appendCodeblock(subSig, langId);
                } else {
                    const subSig = `sub ${symbol.name}(${symbol.parameters || ''})${symbol.returnType ? ' -> ' + symbol.returnType : ''}`;
                    markdown.appendCodeblock(subSig, langId);
                }
                if (symbol.detail === 'inline') {
                    markdown.appendMarkdown('\n\n*Inline subroutine*');
                }
                break;

            case SymbolKind.AsmSubroutine:
                if (isProgB) {
                    const asmSig = `ASMSUB ${symbol.name}(${this.formatParamsProgB(symbol.parameters)})`;
                    markdown.appendCodeblock(asmSig, langId);
                } else {
                    const asmSig = `asmsub ${symbol.name}(${symbol.parameters || ''})`;
                    markdown.appendCodeblock(asmSig, langId);
                }
                markdown.appendMarkdown('\n\n*Assembly subroutine*');
                break;

            case SymbolKind.ExtSubroutine:
                if (isProgB) {
                    const extSig = `EXTSUB ${symbol.detail} = ${symbol.name}(${this.formatParamsProgB(symbol.parameters)})`;
                    markdown.appendCodeblock(extSig, langId);
                } else {
                    const extSig = `extsub ${symbol.detail} = ${symbol.name}(${symbol.parameters || ''})`;
                    markdown.appendCodeblock(extSig, langId);
                }
                markdown.appendMarkdown('\n\n*External ROM/library routine*');
                break;

            case SymbolKind.Constant:
                if (isProgB) {
                    markdown.appendCodeblock(`CONST ${symbol.name} AS ${symbol.type?.toUpperCase() || 'UBYTE'} = ${symbol.detail}`, langId);
                } else {
                    markdown.appendCodeblock(`const ${symbol.type} ${symbol.name} = ${symbol.detail}`, langId);
                }
                markdown.appendMarkdown('\n\n*Constant*');
                break;

            case SymbolKind.Variable:
                if (isProgB) {
                    let varDecl = `DIM ${symbol.name} AS ${symbol.type?.toUpperCase() || 'UBYTE'}`;
                    if (symbol.detail) {
                        varDecl += ` ${symbol.detail}`;
                    }
                    markdown.appendCodeblock(varDecl, langId);
                } else {
                    let varDecl = `${symbol.type} ${symbol.name}`;
                    if (symbol.detail) {
                        varDecl += ` ${symbol.detail}`;
                    }
                    markdown.appendCodeblock(varDecl, langId);
                }
                if (symbol.type?.startsWith('&')) {
                    markdown.appendMarkdown('\n\n*Memory-mapped variable*');
                } else {
                    markdown.appendMarkdown('\n\n*Variable*');
                }
                break;

            case SymbolKind.Parameter:
                if (isProgB) {
                    markdown.appendCodeblock(`${symbol.name} AS ${symbol.type?.toUpperCase() || 'UBYTE'}`, langId);
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
        }

        // Add full path if nested
        if (symbol.parent) {
            markdown.appendMarkdown(`\n\n*Defined in:* \`${symbol.fullPath}\``);
        }

        // Add source file info for imported symbols
        if (isImported && symbol.uri) {
            const fileName = path.basename(symbol.uri.fsPath);
            markdown.appendMarkdown(`\n\n*From imported file:* \`${fileName}\``);
        }

        return new vscode.Hover(markdown);
    }

    /**
     * Format prog8 parameter string to ProgB style (name AS TYPE)
     */
    private formatParamsProgB(params: string | undefined): string {
        if (!params) return '';
        // Convert "type name, type2 name2" to "name AS TYPE, name2 AS TYPE2"
        return params.split(',').map(p => {
            const trimmed = p.trim();
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2) {
                const type = parts[0];
                const rest = parts.slice(1).join(' ');
                // Handle register annotations like @A
                const regMatch = rest.match(/^(\w+)\s*(@\w+)?$/);
                if (regMatch) {
                    const name = regMatch[1];
                    const reg = regMatch[2] || '';
                    return `${name} AS ${type.toUpperCase()}${reg ? ' ' + reg : ''}`;
                }
                return `${rest} AS ${type.toUpperCase()}`;
            }
            return trimmed;
        }).join(', ');
    }

    /**
     * Get hover for built-in functions
     */
    private getBuiltinHover(word: string, isProgB: boolean): vscode.Hover | undefined {
        const info = getBuiltinFunction(word);
        if (info) {
            const markdown = new vscode.MarkdownString();
            const langId = isProgB ? 'progb' : 'prog8';
            // For progb, convert signature to uppercase style
            const signature = isProgB ? info.signature.toUpperCase() : info.signature;
            markdown.appendCodeblock(signature, langId);
            markdown.appendMarkdown(`\n\n${info.description}`);
            markdown.appendMarkdown('\n\n*Built-in function*');
            return new vscode.Hover(markdown);
        }

        return undefined;
    }

    /**
     * Get hover for keywords
     */
    private getKeywordHover(word: string, isProgB: boolean): vscode.Hover | undefined {
        const langId = isProgB ? 'progb' : 'prog8';
        const keywords: { [key: string]: string } = {
            // Types
            'ubyte': 'Unsigned 8-bit integer (0-255)',
            'byte': 'Signed 8-bit integer (-128 to 127)',
            'uword': 'Unsigned 16-bit integer (0-65535)',
            'word': 'Signed 16-bit integer (-32768 to 32767)',
            'ulong': 'Unsigned 32-bit integer',
            'long': 'Signed 32-bit integer',
            'float': 'Floating point number (5 bytes on CBM systems)',
            'bool': 'Boolean value (true or false)',
            'str': 'String (null-terminated)',
            
            // Control flow
            'if': 'Conditional statement',
            'else': 'Alternative branch of an if statement',
            'when': 'Multi-way branch (like switch/case)',
            'for': 'For loop - note: loop variable must be declared before the loop',
            'while': 'While loop - executes while condition is true',
            'do': 'Do-until loop - executes at least once',
            'until': 'Loop termination condition',
            'repeat': 'Repeat loop - executes a fixed number of times',
            'unroll': 'Unroll a loop at compile time',
            'break': 'Exit the current loop',
            'continue': 'Skip to the next iteration of the loop',
            
            // Subroutines
            'sub': 'Subroutine definition',
            'asmsub': 'Assembly subroutine with register parameters',
            'extsub': 'External subroutine (ROM or library)',
            'inline': 'Inline the subroutine at each call site',
            'return': 'Return from subroutine',
            'defer': 'Execute statement when leaving the current subroutine',
            
            // Other
            'const': 'Constant value (compile-time)',
            'struct': 'Structure type definition',
            'alias': 'Create an alias for another identifier',
            'goto': 'Jump to a label',
            'void': 'Discard the return value of a function',
            'on': 'On-goto computed jump',
            
            // Operators
            'and': 'Logical AND operator',
            'or': 'Logical OR operator',
            'xor': 'Logical XOR operator',
            'not': 'Logical NOT operator',
            'in': 'Check if value is in array or range',
            'to': 'Range specifier (ascending)',
            'downto': 'Range specifier (descending)',
            'step': 'Loop step value',
            
            // Literals
            'true': 'Boolean true value',
            'false': 'Boolean false value',
        };

        const description = keywords[word];
        if (description) {
            const markdown = new vscode.MarkdownString();
            // Display keyword in appropriate case for the language
            const displayWord = isProgB ? word.toUpperCase() : word;
            markdown.appendCodeblock(displayWord, langId);
            markdown.appendMarkdown(`\n\n${description}`);
            markdown.appendMarkdown('\n\n*Keyword*');
            return new vscode.Hover(markdown);
        }

        return undefined;
    }

    /**
     * Get hover for library symbols: subroutines, variables, constants,
     * and subroutine parameters accessed via scoped paths.
     * Handles 2-part (block.member) and 3-part (block.sub.param) names.
     */
    private getLibraryHover(qualifiedName: string, isProgB: boolean): vscode.Hover | undefined {
        const target = getTargetPlatform();
        const parts = qualifiedName.split('.');

        // 3-part name: block.sub.parameter (e.g., diskio.lf_start_list.pattern_ptr)
        if (parts.length === 3) {
            const paramResult = findSubroutineParameter(qualifiedName, target);
            if (paramResult) {
                return this.createHoverForLibraryParameter(paramResult.parameter, paramResult.sub, qualifiedName, isProgB);
            }
            return undefined;
        }

        // 2-part name: check subroutine, then variable, then constant
        const sub = findSubroutine(qualifiedName, target);
        if (sub) {
            return this.createHoverForLibrarySubroutine(sub, qualifiedName, isProgB);
        }

        const varResult = findVariable(qualifiedName, target);
        if (varResult) {
            return this.createHoverForLibraryVariable(varResult.variable, qualifiedName, isProgB);
        }

        const constResult = findConstant(qualifiedName, target);
        if (constResult) {
            return this.createHoverForLibraryConstant(constResult.constant, qualifiedName, isProgB);
        }

        return undefined;
    }

    /**
     * Get hover for library module names (e.g., buffers, textio, math)
     * Modules are what you %import - they contain one or more blocks
     */
    private getLibraryModuleHover(name: string, isProgB: boolean): vscode.Hover | undefined {
        const mod = findModule(name, getTargetPlatform());
        const langId = isProgB ? 'progb' : 'prog8';
        
        if (mod) {
            const markdown = new vscode.MarkdownString();
            // Use IMPORT for progb, %import for prog8
            const importSyntax = isProgB ? `IMPORT ${name}` : `%import ${name}`;
            markdown.appendCodeblock(importSyntax, langId);
            
            // Count total items across all blocks
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
            
            // Show the blocks this module provides
            const blockNames = mod.blocks.map(b => b.name);
            if (blockNames.length > 0) {
                markdown.appendMarkdown(`\n\n**Blocks:** \`${blockNames.join('`, `')}\``);
            }
            
            return new vscode.Hover(markdown);
        }
        
        return undefined;
    }

    /**
     * Get hover for library block names (e.g., txt, sys, cx16)
     * Blocks are namespaces inside modules that you access with qualified names
     */
    private getLibraryBlockHover(name: string, isProgB: boolean): vscode.Hover | undefined {
        const blocks = getAllBlocks(getTargetPlatform());
        const block = blocks.find(b => b.name === name);
        const langId = isProgB ? 'progb' : 'prog8';
        
        if (block) {
            const markdown = new vscode.MarkdownString();
            // Use MODULE syntax for progb, braces for prog8
            const blockSyntax = isProgB ? `MODULE ${name} ... END MODULE` : `${name} { }`;
            markdown.appendCodeblock(blockSyntax, langId);
            
            // Show a summary of what's in the block
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
            
            // Show some example functions
            const examples = block.subroutines.slice(0, 5).map(s => s.name);
            if (examples.length > 0) {
                markdown.appendMarkdown(`\n\n**Functions:** \`${examples.join('`, `')}\``);
                if (block.subroutines.length > 5) {
                    markdown.appendMarkdown(`, ...`);
                }
            }
            
            return new vscode.Hover(markdown);
        }
        
        return undefined;
    }

    /**
     * Get hover for blocks from imported local files
     * Shows information about blocks defined in imported files (not library modules)
     */
    private getImportedBlockHover(name: string, importedSymbols: ImportedFileSymbols[], isProgB: boolean): vscode.Hover | undefined {
        const langId = isProgB ? 'progb' : 'prog8';
        for (const imported of importedSymbols) {
            // Find a block with this name in the imported file
            const block = imported.symbols.find((s: UnifiedSymbol) => s.name === name && s.kind === SymbolKind.Block && !s.parent);
            if (block) {
                const markdown = new vscode.MarkdownString();
                // Use MODULE syntax for progb, braces for prog8
                const blockSyntax = isProgB ? `MODULE ${name} ... END MODULE` : `${name} { }`;
                markdown.appendCodeblock(blockSyntax, langId);
                
                // Count symbols in this block
                const subroutines = imported.symbols.filter((s: UnifiedSymbol) => 
                    (s.kind === SymbolKind.Subroutine || s.kind === SymbolKind.AsmSubroutine || s.kind === SymbolKind.ExtSubroutine) && 
                    s.parent === name
                );
                const variables = imported.symbols.filter((s: UnifiedSymbol) => s.kind === SymbolKind.Variable && s.parent === name);
                const constants = imported.symbols.filter((s: UnifiedSymbol) => s.kind === SymbolKind.Constant && s.parent === name);
                
                const fileName = path.basename(imported.filePath);
                markdown.appendMarkdown(`\n\n*Block from imported file* \`${fileName}\``);
                
                if (subroutines.length > 0) {
                    markdown.appendMarkdown(`\n\n${subroutines.length} subroutine${subroutines.length !== 1 ? 's' : ''}`);
                }
                if (variables.length > 0) {
                    markdown.appendMarkdown(`, ${variables.length} variable${variables.length !== 1 ? 's' : ''}`);
                }
                if (constants.length > 0) {
                    markdown.appendMarkdown(`, ${constants.length} constant${constants.length !== 1 ? 's' : ''}`);
                }
                
                // Show some example functions
                const examples = subroutines.slice(0, 5).map((s: UnifiedSymbol) => s.name);
                if (examples.length > 0) {
                    markdown.appendMarkdown(`\n\n**Functions:** \`${examples.join('`, `')}\``);
                    if (subroutines.length > 5) {
                        markdown.appendMarkdown(`, ...`);
                    }
                }
                
                return new vscode.Hover(markdown);
            }
        }
        
        return undefined;
    }

    /**
     * Get hover for local module imports (non-library modules)
     * Shows information about local files that can be imported
     */
    private async getLocalModuleHover(document: vscode.TextDocument, moduleName: string, isProgB: boolean): Promise<vscode.Hover | undefined> {
        const documentDir = path.dirname(document.uri.fsPath);
        const additionalDirs = getSrcDirsForDocument(document);
        const localFilePath = resolveLocalImport(documentDir, moduleName, additionalDirs);
        const langId = isProgB ? 'progb' : 'prog8';
        
        if (localFilePath) {
            try {
                const uri = vscode.Uri.file(localFilePath);
                const importedDoc = await vscode.workspace.openTextDocument(uri);
                const symbols = unifiedParser.parseDocument(importedDoc);
                
                const markdown = new vscode.MarkdownString();
                // Use IMPORT for progb, %import for prog8
                const importSyntax = isProgB ? `IMPORT ${moduleName}` : `%import ${moduleName}`;
                markdown.appendCodeblock(importSyntax, langId);
                
                const fileName = path.basename(localFilePath);
                markdown.appendMarkdown(`\n\n*Local module* from \`${fileName}\``);
                
                // Count blocks and their contents
                const blocks = symbols.filter((s: UnifiedSymbol) => s.kind === SymbolKind.Block && !s.parent);
                if (blocks.length > 0) {
                    markdown.appendMarkdown(`\n\n**Blocks:** \`${blocks.map((b: UnifiedSymbol) => b.name).join('`, `')}\``);
                }
                
                return new vscode.Hover(markdown);
            } catch (error) {
                // File might not be readable
            }
        }
        
        return undefined;
    }

    /**
     * Create hover for a library subroutine
     */
    private createHoverForLibrarySubroutine(sub: SubroutineInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        const langId = isProgB ? 'progb' : 'prog8';
        
        if (sub.isAlias) {
            markdown.appendCodeblock(`${qualifiedName}  (alias for ${sub.isAlias})`, langId);
            markdown.appendMarkdown(`\n\n*Library function alias*`);
        } else {
            let sig: string;
            
            if (isProgB) {
                // ProgB style: name(param AS TYPE) AS RETURNTYPE
                const params = sub.parameters.map(p => {
                    let s = `${p.name} AS ${p.type.toUpperCase()}`;
                    if (p.register) s += ` ${p.register}`;
                    return s;
                }).join(', ');
                
                if (sub.returns.length > 0) {
                    const rets = sub.returns.map(r => {
                        let s = r.type.toUpperCase();
                        if (r.register) s += ` ${r.register}`;
                        return s;
                    }).join(', ');
                    sig = `FUNCTION ${qualifiedName}(${params}) AS ${rets}`;
                } else {
                    sig = `SUB ${qualifiedName}(${params})`;
                }
            } else {
                // Prog8 style: name(type param) -> returntype
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
            
            // Add metadata
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
        
        return new vscode.Hover(markdown);
    }

    /**
     * Create hover for a library variable
     */
    private createHoverForLibraryVariable(variable: VariableInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        const langId = isProgB ? 'progb' : 'prog8';
        
        let decl: string;
        if (isProgB) {
            // ProgB style: DIM name AS TYPE
            decl = `DIM ${qualifiedName} AS ${variable.type.toUpperCase()}`;
        } else {
            // Prog8 style: type name
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
        return new vscode.Hover(markdown);
    }

    /**
     * Create hover for a library constant
     */
    private createHoverForLibraryConstant(constant: ConstantInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        const langId = isProgB ? 'progb' : 'prog8';
        
        let decl: string;
        if (isProgB) {
            // ProgB style: CONST name AS TYPE = value
            decl = `CONST ${qualifiedName} AS ${constant.type.toUpperCase()}`;
        } else {
            // Prog8 style: const type name
            decl = `const ${constant.type} ${qualifiedName}`;
        }
        if (constant.value) {
            decl += ` = ${constant.value}`;
        }
        markdown.appendCodeblock(decl, langId);
        markdown.appendMarkdown('\n\n*Library constant*');
        return new vscode.Hover(markdown);
    }

    /**
     * Create hover for a subroutine parameter accessed via scoped path
     */
    private createHoverForLibraryParameter(parameter: Parameter, sub: SubroutineInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        const langId = isProgB ? 'progb' : 'prog8';
        
        let decl: string;
        if (isProgB) {
            // ProgB style: name AS TYPE @register
            decl = `${qualifiedName} AS ${parameter.type.toUpperCase()}`;
        } else {
            // Prog8 style: type name @register
            decl = `${parameter.type} ${qualifiedName}`;
        }
        if (parameter.register) {
            decl += ` @${parameter.register}`;
        }
        markdown.appendCodeblock(decl, langId);
        markdown.appendMarkdown(`\n\n*Parameter of* \`${sub.name}()\``);
        markdown.appendMarkdown('\n\n*Library symbol*');
        return new vscode.Hover(markdown);
    }

}
