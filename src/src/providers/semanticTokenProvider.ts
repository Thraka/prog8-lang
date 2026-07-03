import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { ImportedFileSymbols } from '../parser/importResolver';
import { getAllAccessibleSymbols, isLibrarySymbol } from '../parser/symbolAggregator';
import { prog8Keywords, progbKeywords } from '../data/keywords';

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

/** Type keywords derived from keywords.ts — entries with category 'type'. */
const prog8TypeKeywords = new Set(
    Object.entries(prog8Keywords).filter(([, info]) => info.category === 'type').map(([name]) => name)
);
const progbTypeKeywords = new Set(
    Object.entries(progbKeywords).filter(([, info]) => info.category === 'type').map(([name]) => name)
);
const progbSemanticKeywords = new Set(
    Object.entries(progbKeywords)
        .filter(([name, info]) => info.category !== 'type' && info.category !== 'comment' && !name.includes(' '))
        .map(([name]) => name)
);
const progbCompoundSemanticKeywords = Object.entries(progbKeywords)
    .filter(([name, info]) => info.category !== 'type' && info.category !== 'comment' && name.includes(' '))
    .map(([name]) => name);

export class Prog8SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {

    async provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder(semanticTokensLegend);

        // Get all accessible symbols via the unified aggregator
        const { localSymbols: symbols, importedFileSymbols, librarySymbols } = await getAllAccessibleSymbols(document);
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

        // Build comment ranges for the entire document (used by both phases)
        const documentCommentRanges = this.buildDocumentCommentRanges(document);

        // Phase 1: Emit tokens for declaration sites (local symbols only)
        this.emitDeclarationTokens(builder, symbols, documentCommentRanges);

        // Determine which type keyword set to use based on language variant
        const isProgB = unifiedParser.isProgB(document);
        const typeKeywords = isProgB ? progbTypeKeywords : prog8TypeKeywords;

        // Phase 2: Scan every line for usage sites
        this.emitUsageTokens(builder, document, symbols, symbolsByName, importedFileSymbols, librarySymbols, documentCommentRanges, typeKeywords, isProgB);

        return builder.build();
    }

    /**
     * Check if a symbol is accessible from a given scope, respecting private visibility.
     * Private symbols are only accessible within their defining block or nested scopes.
     * Private symbols from imported files are never accessible.
     */
    private isSymbolAccessibleInScope(
        symbol: UnifiedSymbol,
        scope: string | undefined,
        isFromImportedFile: boolean
    ): boolean {
        // Private symbols from imported files are never accessible
        if (isFromImportedFile && symbol.isPrivate) {
            return false;
        }

        // If not private, it's accessible
        if (!symbol.isPrivate) {
            return true;
        }

        // Private local symbols: check if current scope is within their defining block
        if (!symbol.parent) {
            // Top-level private symbol - only accessible in its own file
            return !isFromImportedFile;
        }

        if (!scope) {
            // No current scope and symbol is private - not accessible
            return false;
        }

        // Check if current scope is within the symbol's block
        const symbolBlockName = symbol.parent;
        return scope === symbolBlockName || scope.startsWith(symbolBlockName + '.');
    }
    private emitDeclarationTokens(
        builder: vscode.SemanticTokensBuilder,
        symbols: UnifiedSymbol[],
        documentCommentRanges: Map<number, Array<{ start: number; end: number }>>
    ): void {
        for (const sym of symbols) {
            // Skip symbols that are inside comments
            const lineRanges = documentCommentRanges.get(sym.selectionRange.start.line);
            if (lineRanges && this.isInCommentRanges(sym.selectionRange.start.character, lineRanges)) {
                continue;
            }

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
        symbolsByName: Map<string, UnifiedSymbol[]>,
        importedFileSymbols: ImportedFileSymbols[],
        librarySymbols: UnifiedSymbol[],
        documentCommentRanges: Map<number, Array<{ start: number; end: number }>>,
        typeKeywords: Set<string>,
        isProgB: boolean
    ): void {
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        // Build a set of declaration positions to skip (already emitted)
        const declPositions = new Set<string>();
        for (const sym of symbols) {
            const sr = sym.selectionRange;
            declPositions.add(`${sr.start.line}:${sr.start.character}:${sr.end.character}`);
        }

        // Identifier regex — matches Prog8/ProgB identifiers, including qualified names with . or ::
        const identRegex = /[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*(?:(?:\.|::)[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)*/g;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmed = line.trim();

            // Get pre-built comment ranges for this line
            const commentRanges = documentCommentRanges.get(lineIndex) || [];

            // Skip pure comment lines (entire line is in a comment)
            if (commentRanges.length === 1 && commentRanges[0].start === 0 && commentRanges[0].end >= line.length) {
                continue;
            }

            // Skip import/directive lines — nothing to resolve
            if (trimmed.startsWith('%') || /^import\s/i.test(trimmed)) {
                continue;
            }

            // ProgB-specific keyword statements/modifiers that are easy to miss with symbol-only coloring.
            const forceKeywordPositions = isProgB
                ? this.emitProgBSpecialKeywordTokens(builder, line, lineIndex, commentRanges)
                : new Set<string>();

            identRegex.lastIndex = 0;
            let match: RegExpExecArray | null;

            while ((match = identRegex.exec(line)) !== null) {
                const word = match[0];
                const col = match.index;
                const endCol = col + word.length;

                // Skip if inside a comment on this line (line comment or block comment)
                if (this.isInLineComment(line, col) || this.isInCommentRanges(col, commentRanges)) {
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

                // Skip if this segment was already emitted as a forced ProgB keyword/modifier token.
                if (forceKeywordPositions.has(`${lineIndex}:${col}:${endCol}`)) {
                    continue;
                }

                // Check if this word is a type keyword — emit as 'type' token
                const lookupWord = isProgB ? word.toUpperCase() : word;
                if (typeKeywords.has(lookupWord)) {
                    builder.push(
                        new vscode.Range(lineIndex, col, lineIndex, endCol),
                        'type',
                        []
                    );
                    continue;
                }

                const scope = unifiedParser.getScopeAtPosition(symbols, new vscode.Position(lineIndex, col));

                // For qualified names like "monitor.open", split into segments
                // For enum member access like "lines::boxes", only if :: is being used
                let isQualified = word.includes('.');
                let isEnumMember = false;
                
                if (word.includes('::')) {
                    // Check if the first part is an enum
                    const firstPart = word.split('::')[0];
                    const enumSymbol = unifiedParser.findSymbol(symbols, firstPart, scope);
                    if (enumSymbol && enumSymbol.kind === SymbolKind.Enum) {
                        isEnumMember = true;
                        isQualified = true;
                    }
                }

                if (isQualified) {
                    this.emitQualifiedName(builder, word, col, lineIndex, symbols, scope, declPositions, importedFileSymbols, librarySymbols);
                } else {
                    // Try to resolve unqualified name in local symbols first
                    let resolved = unifiedParser.findSymbol(symbols, word, scope);
                    let isFromImportedFile = false;
                    
                    // If not found locally, search in imported file symbols
                    if (!resolved) {
                        for (const imported of importedFileSymbols) {
                            resolved = unifiedParser.findSymbol(imported.symbols, word, scope);
                            if (resolved) {
                                isFromImportedFile = true;
                                break;
                            }
                        }
                    }

                    // If not found in imports, search in library symbols
                    if (!resolved) {
                        resolved = unifiedParser.findSymbol(librarySymbols, word, scope);
                    }
                    
                    if (resolved && this.isSymbolAccessibleInScope(resolved, scope, isFromImportedFile)) {
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
     * Emit explicit ProgB tokens for special statement/modifier forms.
     * Returns position keys of emitted tokens so the identifier pass can skip them.
     */
    private emitProgBSpecialKeywordTokens(
        builder: vscode.SemanticTokensBuilder,
        line: string,
        lineIndex: number,
        commentRanges: Array<{ start: number; end: number }>
    ): Set<string> {
        const emitted = new Set<string>();

        for (const keyword of progbCompoundSemanticKeywords) {
            const keywordRegex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'ig');
            let keywordMatch: RegExpExecArray | null;

            while ((keywordMatch = keywordRegex.exec(line)) !== null) {
                const keywordText = keywordMatch[0];
                const start = keywordMatch.index;

                if (this.isInLineComment(line, start) || this.isInCommentRanges(start, commentRanges) || this.isInString(line, start)) {
                    continue;
                }

                const wordRegex = /\S+/g;
                let wordMatch: RegExpExecArray | null;
                while ((wordMatch = wordRegex.exec(keywordText)) !== null) {
                    const wordStart = start + wordMatch.index;
                    const wordEnd = wordStart + wordMatch[0].length;
                    builder.push(new vscode.Range(lineIndex, wordStart, lineIndex, wordEnd), 'keyword', []);
                    emitted.add(`${lineIndex}:${wordStart}:${wordEnd}`);
                }
            }
        }

        for (const keyword of progbSemanticKeywords) {
            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'ig');
            let keywordMatch: RegExpExecArray | null;

            while ((keywordMatch = keywordRegex.exec(line)) !== null) {
                const start = keywordMatch.index;
                const end = start + keywordMatch[0].length;

                if (this.isInLineComment(line, start) || this.isInCommentRanges(start, commentRanges) || this.isInString(line, start)) {
                    continue;
                }

                builder.push(new vscode.Range(lineIndex, start, lineIndex, end), 'keyword', []);
                emitted.add(`${lineIndex}:${start}:${end}`);
            }
        }

        // Keep SWAP(x, y) covered explicitly in case it is used in call-like form.
        const swapRegex = /\bSWAP\b(?=\s*\()/ig;
        let swapMatch: RegExpExecArray | null;
        while ((swapMatch = swapRegex.exec(line)) !== null) {
            const start = swapMatch.index;
            const end = start + swapMatch[0].length;
            if (this.isInLineComment(line, start) || this.isInCommentRanges(start, commentRanges) || this.isInString(line, start)) {
                continue;
            }
            if (!emitted.has(`${lineIndex}:${start}:${end}`)) {
                builder.push(new vscode.Range(lineIndex, start, lineIndex, end), 'keyword', []);
                emitted.add(`${lineIndex}:${start}:${end}`);
            }
        }

        return emitted;
    }

    /**
     * Emit separate semantic tokens for each segment of a qualified name.
     * e.g. "monitor.open" → "monitor" as namespace, "open" as function.
     * e.g. "head.name" → "head" as variable, "name" as property (struct field).
     * 
     * Walks the segments left to right, building up the qualified path
     * and resolving each segment to its own symbol.
     * Respects private visibility - does not color inaccessible private symbols.
     */
    private emitQualifiedName(
        builder: vscode.SemanticTokensBuilder,
        qualifiedName: string,
        startCol: number,
        lineIndex: number,
        symbols: UnifiedSymbol[],
        scope: string | undefined,
        declPositions: Set<string>,
        importedFileSymbols: ImportedFileSymbols[],
        librarySymbols: UnifiedSymbol[]
    ): void {
        // Normalize :: separator (for enum members) to . for symbol table lookup
        const normalizedName = qualifiedName.replace(/::/g, '.');
        const parts = normalizedName.split('.');
        let currentCol = startCol;
        let pathSoFar = '';

        // Track the first part's type for struct member resolution
        let firstPartVariable: UnifiedSymbol | undefined;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const partEnd = currentCol + part.length;

            // Skip if this segment is a declaration position
            if (!declPositions.has(`${lineIndex}:${currentCol}:${partEnd}`)) {
                // Build the path incrementally: "monitor", then "monitor.open"
                pathSoFar = pathSoFar ? `${pathSoFar}.${part}` : part;

                // Try to resolve this segment as a symbol in local symbols first
                let resolved = unifiedParser.findSymbol(symbols, pathSoFar, scope);
                let isFromImportedFile = false;
                
                // For qualified names, if not found by exact path, try suffix matching
                // (e.g., "lines.boxes" matches "main.lines.boxes" for enum members)
                if (!resolved && pathSoFar.includes('.')) {
                    resolved = symbols.find(s => 
                        s.fullPath === pathSoFar || s.fullPath.endsWith('.' + pathSoFar)
                    );
                }
                
                // If not found locally, search in imported file symbols
                if (!resolved) {
                    for (const imported of importedFileSymbols) {
                        // Check for exact fullPath match
                        resolved = imported.symbols.find(s => s.fullPath === pathSoFar);
                        if (resolved) {
                            isFromImportedFile = true;
                            break;
                        }
                        
                        // For single-segment paths (e.g., just "helpers"), also check top-level names
                        if (!pathSoFar.includes('.')) {
                            resolved = imported.symbols.find(s => s.name === pathSoFar && !s.parent);
                            if (resolved) {
                                isFromImportedFile = true;
                                break;
                            }
                        }
                    }
                }

                // If not found in imports, search in library symbols
                if (!resolved) {
                    resolved = librarySymbols.find(s => s.fullPath === pathSoFar);
                    if (!resolved && !pathSoFar.includes('.')) {
                        resolved = librarySymbols.find(s => s.name === pathSoFar && !s.parent);
                    }
                }

                // If still not found and this is the second part, try struct member resolution
                // Merge all symbol sets for cross-set resolution
                if (!resolved && i === 1 && firstPartVariable && firstPartVariable.type) {
                    const allSymbols = [
                        ...symbols,
                        ...importedFileSymbols.flatMap(imp => imp.symbols),
                        ...librarySymbols
                    ];
                    resolved = unifiedParser.resolveStructMemberAccess(pathSoFar, allSymbols, scope);
                }
                
                // Only emit token if the symbol is accessible (respects private visibility)
                if (resolved && this.isSymbolAccessibleInScope(resolved, scope, isFromImportedFile)) {
                    const { tokenType, modifiers } = this.classifySymbol(resolved);
                    builder.push(
                        new vscode.Range(lineIndex, currentCol, lineIndex, partEnd),
                        tokenType,
                        modifiers
                    );
                }

                // Track first part for struct member resolution
                if (i === 0 && resolved) {
                    firstPartVariable = resolved;
                }
            } else {
                pathSoFar = pathSoFar ? `${pathSoFar}.${part}` : part;
            }

            // Advance past this segment + the separator in the original qualifiedName
            if (i < parts.length - 1) {
                // Find the separator after this part in the original qualifiedName
                const searchStart = currentCol - startCol + part.length;
                const separatorMatch = qualifiedName.substring(searchStart).match(/^(\.{1}|:{2})/);
                const separatorLength = separatorMatch ? separatorMatch[0].length : 1; // Default to 1 if not found
                currentCol = partEnd + separatorLength;
            }
        }
    }

    /**
     * Map a symbol's kind to a semantic token type and modifiers.
     */
    private classifySymbol(sym: UnifiedSymbol): { tokenType: string; modifiers: string[] } {
        const modifiers: string[] = [];

        // Add defaultLibrary modifier for symbols from built-in library modules
        if (isLibrarySymbol(sym)) {
            modifiers.push('defaultLibrary');
        }

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

            case SymbolKind.Enum:
                return { tokenType: 'enum', modifiers };

            case SymbolKind.EnumMember:
                modifiers.push('readonly');
                return { tokenType: 'enum', modifiers };

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

    /**
     * Parse a line to find block comment ranges, tracking state from previous lines.
     * Returns the ranges of characters that are inside block comments on this line,
     * and whether the line ends inside a block comment.
     */
    private parseLineCommentRanges(
        line: string,
        startInBlockComment: boolean
    ): { inComment: boolean; commentRanges: Array<{ start: number; end: number }> } {
        const commentRanges: Array<{ start: number; end: number }> = [];
        let inBlockComment = startInBlockComment;
        let blockCommentStart = inBlockComment ? 0 : -1;
        let inString = false;
        let i = 0;

        while (i < line.length) {
            const ch = line[i];
            const nextCh = line[i + 1];

            // Track string state (but not when we're in a block comment)
            if (!inBlockComment && ch === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inString = !inString;
                i++;
                continue;
            }

            // Skip if we're inside a string
            if (inString) {
                i++;
                continue;
            }

            // Prog8 block comment start: /*
            if (!inBlockComment && ch === '/' && nextCh === '*') {
                inBlockComment = true;
                blockCommentStart = i;
                i += 2;
                continue;
            }

            // Prog8 block comment end: */
            if (inBlockComment && ch === '*' && nextCh === '/') {
                commentRanges.push({ start: blockCommentStart, end: i + 2 });
                inBlockComment = false;
                blockCommentStart = -1;
                i += 2;
                continue;
            }

            // ProgB block comment start: /'
            if (!inBlockComment && ch === '/' && nextCh === "'") {
                inBlockComment = true;
                blockCommentStart = i;
                i += 2;
                continue;
            }

            // ProgB block comment end: '/
            if (inBlockComment && ch === "'" && nextCh === '/') {
                commentRanges.push({ start: blockCommentStart, end: i + 2 });
                inBlockComment = false;
                blockCommentStart = -1;
                i += 2;
                continue;
            }

            i++;
        }

        // If we're still in a block comment at end of line, add range to end
        if (inBlockComment && blockCommentStart !== -1) {
            commentRanges.push({ start: blockCommentStart, end: line.length });
        } else if (inBlockComment && blockCommentStart === -1) {
            // Entire line is in a block comment that started on a previous line
            commentRanges.push({ start: 0, end: line.length });
        }

        return { inComment: inBlockComment, commentRanges };
    }

    /**
     * Check if a column position falls within any of the comment ranges.
     */
    private isInCommentRanges(col: number, ranges: Array<{ start: number; end: number }>): boolean {
        for (const range of ranges) {
            if (col >= range.start && col < range.end) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build comment ranges for the entire document.
     * Returns a map from line number to array of comment ranges on that line.
     */
    private buildDocumentCommentRanges(
        document: vscode.TextDocument
    ): Map<number, Array<{ start: number; end: number }>> {
        const result = new Map<number, Array<{ start: number; end: number }>>();
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        
        let inBlockComment = false;
        
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const { inComment: lineEndsInComment, commentRanges } = this.parseLineCommentRanges(line, inBlockComment);
            inBlockComment = lineEndsInComment;
            
            if (commentRanges.length > 0) {
                result.set(lineIndex, commentRanges);
            }
        }
        
        return result;
    }
}
