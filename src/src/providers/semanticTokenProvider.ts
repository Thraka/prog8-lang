import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';

/**
 * Semantic token types used by this provider.
 * These map to VS Code's standard semantic token types so themes can style them.
 * 
 * Standard types: https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers
 */
export const tokenTypes = [
    'namespace',    // blocks/modules
    'function',     // sub, asmsub, extsub
    'variable',     // regular variables
    'parameter',    // subroutine parameters
    'property',     // struct fields
    'label',        // goto labels
    'struct',       // struct types
    'type',         // aliases
    'string',       // string literals (fallback)
    'keyword',      // language keywords (fallback)
    'enum',         // used for constants — many themes give enums a distinct color
];

/**
 * Semantic token modifiers for additional classification.
 */
export const tokenModifiers = [
    'declaration',     // where the symbol is defined
    'readonly',        // constants
    'modification',    // where the symbol is being written to
    'defaultLibrary',  // library/built-in symbols
];

/**
 * The legend that maps our token types/modifiers to VS Code's encoding.
 */
export const semanticTokensLegend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

/**
 * Provides semantic tokens for Prog8 and ProgB documents.
 * 
 * This goes beyond TextMate grammar by using the parsed symbol table to:
 * - Color constants distinctly from variables, even at usage sites
 * - Color subroutine calls in function color
 * - Color parameters distinctly
 * - Mark declarations vs usages
 * - Color qualified references (e.g., `myblock.myvar`)
 * - Color labels distinctly
 */
export class Prog8SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {

    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder(semanticTokensLegend);

        // Parse the document for symbols
        const symbols = unifiedParser.parseDocument(document);
        if (symbols.length === 0) {
            return builder.build();
        }

        // Build a lookup map: name -> symbol(s) for fast resolution
        const symbolsByName = new Map<string, UnifiedSymbol[]>();
        for (const sym of symbols) {
            const existing = symbolsByName.get(sym.name);
            if (existing) {
                existing.push(sym);
            } else {
                symbolsByName.set(sym.name, [sym]);
            }
        }

        // Phase 1: Emit tokens for declaration sites
        this.emitDeclarationTokens(builder, symbols);

        // Phase 2: Scan every line for usage sites
        this.emitUsageTokens(builder, document, symbols, symbolsByName);

        return builder.build();
    }

    /**
     * Emit semantic tokens for all symbol declaration sites.
     */
    private emitDeclarationTokens(
        builder: vscode.SemanticTokensBuilder,
        symbols: UnifiedSymbol[]
    ): void {
        for (const sym of symbols) {
            const { tokenType, modifiers } = this.classifySymbol(sym);
            const declModifiers = [...modifiers, 'declaration'];

            // Use the selectionRange (just the name portion, not the whole line)
            builder.push(sym.selectionRange, tokenType, declModifiers);
        }
    }

    /**
     * Scan every line of the document and emit tokens for identifier usages
     * that resolve to known symbols.
     */
    private emitUsageTokens(
        builder: vscode.SemanticTokensBuilder,
        document: vscode.TextDocument,
        symbols: UnifiedSymbol[],
        symbolsByName: Map<string, UnifiedSymbol[]>
    ): void {
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        // Build a set of declaration positions to skip (already emitted)
        const declPositions = new Set<string>();
        for (const sym of symbols) {
            const sr = sym.selectionRange;
            declPositions.add(`${sr.start.line}:${sr.start.character}:${sr.end.character}`);
        }

        // Identifier regex — matches Prog8/ProgB identifiers, including qualified names
        const identRegex = /[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*(?:\.[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)*/g;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmed = line.trim();

            // Skip pure comment lines
            if (trimmed.startsWith(';') || trimmed.startsWith('/*') || trimmed.startsWith("'")) {
                continue;
            }

            // Skip import/directive lines — nothing to resolve
            if (trimmed.startsWith('%') || /^import\s/i.test(trimmed)) {
                continue;
            }

            identRegex.lastIndex = 0;
            let match: RegExpExecArray | null;

            while ((match = identRegex.exec(line)) !== null) {
                const word = match[0];
                const col = match.index;
                const endCol = col + word.length;

                // Skip if inside a comment on this line
                if (this.isInLineComment(line, col)) {
                    continue;
                }

                // Skip if inside a string
                if (this.isInString(line, col)) {
                    continue;
                }

                // Skip if this is a declaration position (already emitted)
                if (declPositions.has(`${lineIndex}:${col}:${endCol}`)) {
                    continue;
                }

                const scope = unifiedParser.getScopeAtPosition(symbols, new vscode.Position(lineIndex, col));

                // For qualified names like "monitor.open", split into segments
                // and classify each part independently
                if (word.includes('.')) {
                    this.emitQualifiedName(builder, word, col, lineIndex, symbols, scope, declPositions);
                } else {
                    const resolved = unifiedParser.findSymbol(symbols, word, scope);
                    if (resolved) {
                        const { tokenType, modifiers } = this.classifySymbol(resolved);
                        builder.push(
                            new vscode.Range(lineIndex, col, lineIndex, endCol),
                            tokenType,
                            modifiers
                        );
                    }
                }
            }
        }
    }

    /**
     * Emit separate semantic tokens for each segment of a qualified name.
     * e.g. "monitor.open" → "monitor" as namespace, "open" as function.
     * 
     * Walks the segments left to right, building up the qualified path
     * and resolving each segment to its own symbol.
     */
    private emitQualifiedName(
        builder: vscode.SemanticTokensBuilder,
        qualifiedName: string,
        startCol: number,
        lineIndex: number,
        symbols: UnifiedSymbol[],
        scope: string | undefined,
        declPositions: Set<string>
    ): void {
        const parts = qualifiedName.split('.');
        let currentCol = startCol;
        let pathSoFar = '';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const partEnd = currentCol + part.length;

            // Skip if this segment is a declaration position
            if (!declPositions.has(`${lineIndex}:${currentCol}:${partEnd}`)) {
                // Build the path incrementally: "monitor", then "monitor.open"
                pathSoFar = pathSoFar ? `${pathSoFar}.${part}` : part;

                // Try to resolve this segment as a symbol
                const resolved = unifiedParser.findSymbol(symbols, pathSoFar, scope);
                if (resolved) {
                    const { tokenType, modifiers } = this.classifySymbol(resolved);
                    builder.push(
                        new vscode.Range(lineIndex, currentCol, lineIndex, partEnd),
                        tokenType,
                        modifiers
                    );
                }
            } else {
                pathSoFar = pathSoFar ? `${pathSoFar}.${part}` : part;
            }

            // Advance past this segment + the dot separator
            currentCol = partEnd + 1; // +1 for the '.'
        }
    }

    /**
     * Map a symbol's kind to a semantic token type and modifiers.
     */
    private classifySymbol(sym: UnifiedSymbol): { tokenType: string; modifiers: string[] } {
        const modifiers: string[] = [];

        switch (sym.kind) {
            case SymbolKind.Block:
                return { tokenType: 'namespace', modifiers };

            case SymbolKind.Subroutine:
            case SymbolKind.AsmSubroutine:
            case SymbolKind.ExtSubroutine:
                return { tokenType: 'function', modifiers };

            case SymbolKind.Constant:
                modifiers.push('readonly');
                return { tokenType: 'variable', modifiers };

            case SymbolKind.Variable:
                return { tokenType: 'variable', modifiers };

            case SymbolKind.Parameter:
                return { tokenType: 'parameter', modifiers };

            case SymbolKind.Label:
                return { tokenType: 'label', modifiers };

            case SymbolKind.Struct:
                return { tokenType: 'struct', modifiers };

            case SymbolKind.StructField:
                return { tokenType: 'property', modifiers };

            case SymbolKind.Alias:
                return { tokenType: 'type', modifiers };

            default:
                return { tokenType: 'variable', modifiers };
        }
    }

    /**
     * Check if position is inside a line comment (;) on this line
     */
    private isInLineComment(line: string, col: number): boolean {
        for (let i = 0; i < col; i++) {
            if (line[i] === ';') {
                // Check it's not inside a string
                const before = line.substring(0, i);
                const quoteCount = (before.match(/"/g) || []).length;
                if (quoteCount % 2 === 0) {
                    return true;
                }
            }
            // ProgB line comment
            if (line[i] === "'") {
                const before = line.substring(0, i);
                const quoteCount = (before.match(/"/g) || []).length;
                if (quoteCount % 2 === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if position is inside a string literal
     */
    private isInString(line: string, col: number): boolean {
        let inString = false;
        for (let i = 0; i < col; i++) {
            if (line[i] === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inString = !inString;
            }
        }
        return inString;
    }
}
