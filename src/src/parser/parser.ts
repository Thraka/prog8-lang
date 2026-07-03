import * as vscode from 'vscode';
import { prog8Keywords, progbKeywords } from '../data/keywords';

/**
 * Represents a parsed symbol from either Prog8 or ProgB code
 */
export interface ParsedSymbol {
    name: string;
    kind: SymbolKind;
    type?: string;           // Data type for variables/constants
    detail?: string;         // Additional info (address, parameters, etc.)
    description?: string;    // Documentation comment extracted from lines above the symbol
    range: vscode.Range;     // Full range of the declaration
    selectionRange: vscode.Range;  // Range of just the name
    parent?: string;         // Parent block/subroutine name
    fullPath: string;        // Fully qualified name (e.g., "main.start.counter")
    parameters?: string;     // For subroutines
    returnType?: string;     // For subroutines with return values
    uri: vscode.Uri;         // Document URI
    isPrivate?: boolean;     // True if symbol is marked with 'private' keyword
}

export enum SymbolKind {
    Block = 'block',
    Subroutine = 'subroutine',
    AsmSubroutine = 'asmsub',
    ExtSubroutine = 'extsub',
    Variable = 'variable',
    Constant = 'constant',
    Label = 'label',
    Struct = 'struct',
    StructField = 'field',
    Parameter = 'parameter',
    Alias = 'alias',
    Enum = 'enum',
    EnumMember = 'enum_member'
}

/**
 * Unified parser that handles both Prog8 (.p8) and ProgB (.pb) files.
 * Language detection happens automatically based on the document.
 */
export class Parser {

    // ──────────────────────────────────────────────
    //  Public API (language-agnostic)
    // ──────────────────────────────────────────────

    /**
     * Check if a document is a ProgB file
     */
    isProgB(document: vscode.TextDocument): boolean {
        return document.languageId === 'progb' || document.fileName.endsWith('.pb');
    }

    /**
     * Parse a document and return all symbols.
     * Automatically detects the language and uses the appropriate parsing strategy.
     */
    parseDocument(document: vscode.TextDocument): ParsedSymbol[] {
        if (this.isProgB(document)) {
            return this.parseProgBDocument(document);
        }
        return this.parseProg8Document(document);
    }

    /**
     * Find the word at a given position in a document
     */
    getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF.:]*/);
        return wordRange ? document.getText(wordRange) : undefined;
    }

    /**
     * Find a symbol by name, considering scope
     */
    findSymbol(symbols: ParsedSymbol[], name: string, currentScope?: string): ParsedSymbol | undefined {
        // Handle qualified names (e.g., "main.start")
        if (name.includes('.')) {
            return symbols.find(s => s.fullPath === name);
        }

        // For unqualified names, search local scope first, then parent scopes
        if (currentScope) {
            const scopeParts = currentScope.split('.');
            for (let i = scopeParts.length; i >= 0; i--) {
                const searchScope = scopeParts.slice(0, i).join('.');
                const fullPath = searchScope ? `${searchScope}.${name}` : name;
                const symbol = symbols.find(s => s.fullPath === fullPath);
                if (symbol) return symbol;
            }
        }

        // Search top-level
        return symbols.find(s => s.name === name && !s.parent);
    }

    /**
     * Get the scope at a given position
     */
    getScopeAtPosition(symbols: ParsedSymbol[], position: vscode.Position): string | undefined {
        let currentScope: string | undefined;
        let minRange: vscode.Range | undefined;

        for (const symbol of symbols) {
            if ((symbol.kind === SymbolKind.Block ||
                 symbol.kind === SymbolKind.Subroutine ||
                 symbol.kind === SymbolKind.AsmSubroutine ||
                 symbol.kind === SymbolKind.Struct ||
                 symbol.kind === SymbolKind.Enum) &&
                symbol.range.contains(position)) {
                if (!minRange || symbol.range.start.isAfter(minRange.start)) {
                    currentScope = symbol.fullPath;
                    minRange = symbol.range;
                }
            }
        }

        return currentScope;
    }

    /**
     * Resolve a struct member access like `variable.member` where `variable` is a typed variable.
     * Returns the struct field symbol if found, or undefined if not a struct member access.
     */
    resolveStructMemberAccess(
        qualifiedName: string,
        symbols: ParsedSymbol[],
        currentScope?: string
    ): ParsedSymbol | undefined {
        if (!qualifiedName.includes('.')) {
            return undefined;
        }

        const parts = qualifiedName.split('.');
        if (parts.length !== 2) {
            return undefined;
        }

        const [varName, memberName] = parts;

        const variable = this.findSymbol(symbols, varName, currentScope);
        if (!variable || !variable.type) {
            return undefined;
        }

        // Extract the base type name by stripping pointer prefixes (^, ^^)
        const baseTypeName = variable.type.replace(/^\^+/, '');

        const structSymbol = symbols.find(s =>
            (s.kind === SymbolKind.Struct || s.kind === SymbolKind.Alias) &&
            (s.name === baseTypeName || s.fullPath === baseTypeName)
        );

        if (!structSymbol) {
            return undefined;
        }

        const fieldFullPath = `${structSymbol.fullPath}.${memberName}`;
        const field = symbols.find(s =>
            s.kind === SymbolKind.StructField &&
            s.fullPath === fieldFullPath
        );

        return field;
    }

    /**
     * Get the appropriate file extensions for searching related files
     */
    getSearchExtensions(): string {
        return '*.{p8,pb}';
    }

    // ──────────────────────────────────────────────
    //  Shared utility methods
    // ──────────────────────────────────────────────

    /**
     * Escape special regex characters in a string
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Strip comments from a line (delegates to language-specific logic)
     */
    private stripComments(line: string, isProgB: boolean): string {
        return isProgB ? this.stripProgBComments(line) : this.stripProg8Comments(line);
    }

    /**
     * Check if a word is a keyword (delegates to language-specific logic)
     */
    private isKeyword(word: string, isProgB: boolean): boolean {
        return isProgB ? this.isProgBKeyword(word) : this.isProg8Keyword(word);
    }

    // ──────────────────────────────────────────────
    //  Prog8-specific parsing
    // ──────────────────────────────────────────────

    /**
     * Parse a Prog8 document and extract all symbols
     */
    private parseProg8Document(document: vscode.TextDocument): ParsedSymbol[] {
        const symbols: ParsedSymbol[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        const scopeStack: { name: string; kind: SymbolKind; symbolIndex: number }[] = [];
        let braceDepth = 0;
        const scopeStartDepths: number[] = [];

        let pendingSub: {
            startLine: number;
            firstLine: string;
            accumulatedParams: string;
            isInline: boolean;
            subKind: SymbolKind;
            name: string;
            scopePath: string;
            isPrivate?: boolean;
        } | null = null;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmedLine = this.stripProg8Comments(line).trim();

            if (trimmedLine === '') {
                braceDepth += this.countBraces(line);
                this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                continue;
            }

            const scopePath = scopeStack.map(s => s.name).join('.');

            // Handle multiline sub declaration continuation
            if (pendingSub) {
                const continuationContent = this.stripProg8Comments(line).trim();
                pendingSub.accumulatedParams += ' ' + continuationContent;

                if (pendingSub.accumulatedParams.includes(')')) {
                    const fullDecl = pendingSub.accumulatedParams;
                    const closeParenIdx = fullDecl.indexOf(')');
                    const openParenIdx = fullDecl.indexOf('(');
                    const params = openParenIdx !== -1 ? fullDecl.substring(openParenIdx + 1, closeParenIdx) : '';
                    const afterParen = fullDecl.substring(closeParenIdx + 1).trim();
                    const returnMatch = afterParen.match(/^->\s*(.+?)(?:\s*\{|$)/);
                    const returnType = returnMatch ? returnMatch[1].trim() : undefined;

                    const fullPath = pendingSub.scopePath ? `${pendingSub.scopePath}.${pendingSub.name}` : pendingSub.name;
                    const nameStart = pendingSub.firstLine.indexOf(pendingSub.name);

                    const symbolIndex = symbols.length;
                    symbols.push({
                        name: pendingSub.name,
                        kind: pendingSub.subKind,
                        detail: pendingSub.isInline ? 'inline' : undefined,
                        description: this.extractDescriptionAbove(lines, pendingSub.startLine, false),
                        range: new vscode.Range(pendingSub.startLine, 0, lineIndex, line.length),
                        selectionRange: new vscode.Range(pendingSub.startLine, nameStart, pendingSub.startLine, nameStart + pendingSub.name.length),
                        parent: pendingSub.scopePath || undefined,
                        fullPath,
                        parameters: params.trim(),
                        returnType,
                        uri: document.uri,
                        isPrivate: pendingSub.isPrivate
                    });

                    this.parseProg8MultilineParameters(params.trim(), pendingSub.startLine, lineIndex, lines, fullPath, document.uri, symbols);

                    if (fullDecl.includes('{')) {
                        scopeStack.push({ name: pendingSub.name, kind: pendingSub.subKind, symbolIndex });
                        scopeStartDepths.push(braceDepth);
                    }

                    pendingSub = null;
                }

                braceDepth += this.countBraces(line);
                this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                continue;
            }

            // Block definition: identifier [address] {
            const blockMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)\s*(\$[0-9a-fA-F]+)?\s*\{?\s*$/);
            if (blockMatch && braceDepth === 0 && !this.isProg8Keyword(blockMatch[1])) {
                const name = blockMatch[1];
                const address = blockMatch[2];
                const nameStart = line.indexOf(name);

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Block,
                    detail: address || undefined,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    fullPath: name,
                    uri: document.uri
                });

                scopeStack.push({ name, kind: SymbolKind.Block, symbolIndex });
                scopeStartDepths.push(braceDepth);
            }

            // Struct definition
            const structMatch = trimmedLine.match(/^(private\s+)?struct\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\{?/);
            if (structMatch) {
                const isPrivate = !!structMatch[1];
                const name = structMatch[2];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Struct,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });

                if (trimmedLine.includes('{')) {
                    scopeStack.push({ name, kind: SymbolKind.Struct, symbolIndex });
                    scopeStartDepths.push(braceDepth);
                }
            }

            // Enum definition: [private] enum Name { [members] }
            const enumMatch = trimmedLine.match(/^(private\s+)?enum\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*(\{.*)?$/);
            if (enumMatch) {
                const isPrivate = !!enumMatch[1];
                const name = enumMatch[2];
                const rest = enumMatch[3] || '';
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Enum,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });

                if (rest.includes('{') && rest.includes('}')) {
                    // Single-line: enum Foo { a, b, c }
                    const bodyMatch = rest.match(/\{([^}]*)\}/);
                    if (bodyMatch) {
                        this.parseProg8EnumMembers(bodyMatch[1], lineIndex, line, fullPath, document.uri, symbols);
                    }
                } else if (rest.includes('{')) {
                    // Opening brace on this line, members follow on subsequent lines
                    scopeStack.push({ name, kind: SymbolKind.Enum, symbolIndex });
                    scopeStartDepths.push(braceDepth);
                }
            }

            // Subroutine: [private] [inline] sub|asmsub name(params) [-> returntype]
            const subMatch = trimmedLine.match(/^(private\s+)?(inline\s+)?(sub|asmsub)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)(\s*->\s*(.+?))?\s*\{?/);
            if (subMatch) {
                const isPrivate = !!subMatch[1];
                const isInline = !!subMatch[2];
                const subKind = subMatch[3] === 'asmsub' ? SymbolKind.AsmSubroutine : SymbolKind.Subroutine;
                const name = subMatch[4];
                const params = subMatch[5] || '';
                const returnType = subMatch[7]?.trim();
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: subKind,
                    detail: isInline ? 'inline' : undefined,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: params,
                    returnType,
                    uri: document.uri,
                    isPrivate
                });

                this.parseProg8Parameters(params, lineIndex, line, fullPath, document.uri, symbols);

                if (trimmedLine.includes('{')) {
                    scopeStack.push({ name, kind: subKind, symbolIndex });
                    scopeStartDepths.push(braceDepth);
                }
            } else {
                // Multiline sub declaration start
                const multilineSubStart = trimmedLine.match(/^(private\s+)?(inline\s+)?(sub|asmsub)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/);
                if (multilineSubStart) {
                    const isPrivate = !!multilineSubStart[1];
                    const isInline = !!multilineSubStart[2];
                    const subKind = multilineSubStart[3] === 'asmsub' ? SymbolKind.AsmSubroutine : SymbolKind.Subroutine;
                    const name = multilineSubStart[4];
                    const partialParams = multilineSubStart[5] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind,
                        name,
                        scopePath,
                        isPrivate
                    };

                    braceDepth += this.countBraces(line);
                    this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                    continue;
                }
            }

            // extsub [$addr | @bank N $addr] = name(params)
            const extsubMatch = trimmedLine.match(/^(private\s+)?extsub\s+(?:@bank\s+\d+\s+)?(\$[0-9a-fA-F]+)\s*=\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/);
            if (extsubMatch) {
                const isPrivate = !!extsubMatch[1];
                const address = extsubMatch[2];
                const name = extsubMatch[3];
                const params = extsubMatch[4] || '';
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.ExtSubroutine,
                    detail: address,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: params,
                    uri: document.uri,
                    isPrivate
                });
            }

            // const type name = value
            const constMatch = trimmedLine.match(/^(private\s+)?const\s+(ubyte|byte|uword|word|long|ulong|float|bool|str)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/);
            if (constMatch) {
                const isPrivate = !!constMatch[1];
                const type = constMatch[2];
                const name = constMatch[3];
                const value = constMatch[4];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Constant,
                    type,
                    detail: value,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });
            }

            // Variable declarations
            const insideStruct = scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Struct;
            const insideEnum = scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Enum;
            if (insideEnum) {
                this.parseProg8EnumMembersFromLine(trimmedLine, line, lineIndex, scopePath, document.uri, symbols);
                braceDepth += this.countBraces(line);
                this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                continue;
            }
            const symbolCountBefore = symbols.length;
            this.parseProg8VariableDeclarations(trimmedLine, line, lineIndex, scopePath, document.uri, symbols, insideStruct);
            // Attach description to any variables just added
            if (symbols.length > symbolCountBefore) {
                const desc = this.extractDescriptionAbove(lines, lineIndex, false);
                if (desc) {
                    for (let si = symbolCountBefore; si < symbols.length; si++) {
                        symbols[si].description = desc;
                    }
                }
            }

            // Alias
            const aliasMatch = trimmedLine.match(/^(private\s+)?alias\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/);
            if (aliasMatch) {
                const isPrivate = !!aliasMatch[1];
                const name = aliasMatch[2];
                const target = aliasMatch[3];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Alias,
                    detail: `= ${target}`,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });
            }

            // Labels
            const labelMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*):\s*$/);
            if (labelMatch) {
                const name = labelMatch[1];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Label,
                    description: this.extractDescriptionAbove(lines, lineIndex, false),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri
                });
            }

            // Update brace depth and scope
            braceDepth += this.countBraces(line);
            this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
        }

        return symbols;
    }

    /**
     * Update ranges for Prog8 scopes that are being closed (brace-based)
     */
    private updateClosedScopes(
        braceDepth: number,
        scopeStack: { name: string; kind: SymbolKind; symbolIndex: number }[],
        scopeStartDepths: number[],
        symbols: ParsedSymbol[],
        lineIndex: number,
        line: string
    ): void {
        while (scopeStartDepths.length > 0 && braceDepth <= scopeStartDepths[scopeStartDepths.length - 1]) {
            const closedScope = scopeStack.pop();
            scopeStartDepths.pop();

            if (closedScope) {
                const symbol = symbols[closedScope.symbolIndex];
                if (symbol) {
                    symbol.range = new vscode.Range(
                        symbol.range.start,
                        new vscode.Position(lineIndex, line.length)
                    );
                }
            }
        }
    }

    /**
     * Count net brace change in a line (Prog8)
     */
    private countBraces(line: string): number {
        let count = 0;
        let inString = false;
        let inAsm = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const prev = i > 0 ? line[i - 1] : '';

            if (char === '"' && prev !== '\\') {
                inString = !inString;
            }

            if (!inString) {
                if (char === '{' && line[i + 1] === '{') {
                    inAsm = true;
                    i++;
                } else if (char === '}' && line[i + 1] === '}') {
                    inAsm = false;
                    i++;
                } else if (!inAsm) {
                    if (char === '{') count++;
                    else if (char === '}') count--;
                }
            }
        }
        return count;
    }

    /**
     * Extract the documentation comment block directly above a given line.
     * Only collects lines that start with a triple comment prefix (`;;;` for
     * Prog8, `'''` for ProgB) to distinguish doc-comments from regular comments.
     * Collects consecutive doc-comment lines walking upward — any non-doc-comment
     * line (including single-`;` comments) stops collection.
     *
     * Example (Prog8):
     * ```
     * ; This is a regular comment — NOT included.
     *
     * ;;; Does something fun using the `position` parameter.
     * ;;; Line 2
     * ;;;
     * ;;; More comment added
     * sub MySub1(ubyte position) {
     * ```
     * → returns "Does something fun using the `position` parameter.\nLine 2\n\nMore comment added"
     */
    private extractDescriptionAbove(lines: string[], lineIndex: number, isProgB: boolean): string | undefined {
        const commentLines: string[] = [];
        const prefix = isProgB ? "'''" : ';;;';

        for (let i = lineIndex - 1; i >= 0; i--) {
            const trimmed = lines[i].trim();

            if (trimmed.startsWith(prefix)) {
                // Strip the triple prefix and optional single space
                const text = trimmed.substring(prefix.length);
                commentLines.unshift(text.startsWith(' ') ? text.substring(1) : text);
            } else {
                break; // non-doc-comment line stops collection
            }
        }

        if (commentLines.length === 0) {
            return undefined;
        }

        return commentLines.join('\n');
    }

    /**
     * Strip Prog8 comments (;)
     */
    private stripProg8Comments(line: string): string {
        const commentIndex = line.indexOf(';');
        if (commentIndex !== -1) {
            const beforeComment = line.substring(0, commentIndex);
            const quoteCount = (beforeComment.match(/"/g) || []).length;
            if (quoteCount % 2 === 0) {
                return beforeComment;
            }
        }
        return line;
    }

    /**
     * Check if a word is a Prog8 keyword
     */
    private isProg8Keyword(word: string): boolean {
        return word in prog8Keywords;
    }

    /**
     * Parse Prog8 variable declarations from a line
     */
    private parseProg8VariableDeclarations(
        trimmedLine: string,
        fullLine: string,
        lineIndex: number,
        scopePath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[],
        insideStruct: boolean = false
    ): void {
        // Skip keyword lines
        if (/^(const|sub|asmsub|extsub|struct|enum|if|else|when|for|while|do|repeat|return|goto|defer|alias|on|swap|private)\b/.test(trimmedLine)) {
            return;
        }

        // Memory-mapped variable: &type NAME = address
        const memoryMatch = trimmedLine.match(/^&(ubyte|byte|uword|word|long|ulong|float|bool)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/);
        if (memoryMatch) {
            const type = memoryMatch[1];
            const name = memoryMatch[2];
            const address = memoryMatch[3];
            const nameStart = fullLine.indexOf(name);
            const fullPath = scopePath ? `${scopePath}.${name}` : name;

            symbols.push({
                name,
                kind: SymbolKind.Variable,
                type: `&${type}`,
                detail: `@ ${address}`,
                range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                parent: scopePath || undefined,
                fullPath,
                uri
            });
            return;
        }

        // Regular variable: type [@tags] [arrayspec] name [= value]
        const varMatch = trimmedLine.match(/^(\^{0,2}(?:ubyte|byte|uword|word|long|ulong|float|bool|str|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*(?:\.[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)*))((?:\[\d*\]){0,2})\s+(@\w+\s+)*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/);
        if (varMatch) {
            const baseType = varMatch[1];
            const arrayPart = varMatch[2] || '';
            const name = varMatch[4];
            const type = baseType + arrayPart;
            const nameStart = fullLine.indexOf(name);
            const fullPath = scopePath ? `${scopePath}.${name}` : name;

            symbols.push({
                name,
                kind: insideStruct ? SymbolKind.StructField : SymbolKind.Variable,
                type,
                range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                parent: scopePath || undefined,
                fullPath,
                uri
            });

            // Check for additional variables on same line (ubyte a, b, c)
            const remaining = trimmedLine.substring(trimmedLine.indexOf(name) + name.length);
            const additionalVars = remaining.match(/,\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/g);
            if (additionalVars) {
                for (const match of additionalVars) {
                    const addName = match.replace(/,\s*/, '');
                    const addNameStart = fullLine.lastIndexOf(addName);
                    const addFullPath = scopePath ? `${scopePath}.${addName}` : addName;

                    symbols.push({
                        name: addName,
                        kind: insideStruct ? SymbolKind.StructField : SymbolKind.Variable,
                        type: baseType,
                        range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                        selectionRange: new vscode.Range(lineIndex, addNameStart, lineIndex, addNameStart + addName.length),
                        parent: scopePath || undefined,
                        fullPath: addFullPath,
                        uri
                    });
                }
            }
        }
    }

    /**
     * Parse enum members from a text fragment (comma-separated identifiers with optional = value).
     * Used for single-line enums: enum Foo { a, b = 5, c }
     */
    private parseProg8EnumMembers(
        memberText: string,
        lineIndex: number,
        fullLine: string,
        enumPath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[]
    ): void {
        for (const part of memberText.split(',')) {
            const m = part.trim();
            if (!m) continue;
            const memberMatch = m.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*(?:=\s*(.+))?$/);
            if (memberMatch) {
                const name = memberMatch[1];
                const value = memberMatch[2]?.trim();
                const nameStart = fullLine.indexOf(name);
                symbols.push({
                    name,
                    kind: SymbolKind.EnumMember,
                    detail: value ? `= ${value}` : undefined,
                    range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: enumPath,
                    fullPath: `${enumPath}.${name}`,
                    uri
                });
            }
        }
    }

    /**
     * Parse enum members from a single line when already inside an enum scope.
     * Handles comma-separated members, possibly with = value.
     */
    private parseProg8EnumMembersFromLine(
        trimmedLine: string,
        fullLine: string,
        lineIndex: number,
        enumPath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[]
    ): void {
        if (trimmedLine === '{' || trimmedLine === '}' || trimmedLine === '') return;
        // Strip surrounding braces/commas and parse each comma-separated item
        const cleaned = trimmedLine.replace(/^\{/, '').replace(/\}$/, '').trim();
        this.parseProg8EnumMembers(cleaned, lineIndex, fullLine, enumPath, uri, symbols);
    }

    /**
     * Parse Prog8 subroutine parameters (type name format)
     */
    private parseProg8Parameters(
        params: string,
        lineIndex: number,
        fullLine: string,
        subPath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[]
    ): void {
        if (!params.trim()) return;

        const paramRegex = /(ubyte|byte|uword|word|long|ulong|float|bool|str)(\[\d*\])?\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/g;
        let match;
        const parenPos = fullLine.indexOf('(');
        while ((match = paramRegex.exec(params)) !== null) {
            const type = match[1] + (match[2] || '');
            const name = match[3];
            const nameOffsetInMatch = match[0].length - name.length;
            const nameStart = parenPos + 1 + match.index + nameOffsetInMatch;
            const fullPath = `${subPath}.${name}`;

            symbols.push({
                name,
                kind: SymbolKind.Parameter,
                type,
                range: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                parent: subPath,
                fullPath,
                uri
            });
        }
    }

    /**
     * Parse Prog8 parameters from a multiline subroutine declaration
     */
    private parseProg8MultilineParameters(
        params: string,
        startLine: number,
        endLine: number,
        lines: string[],
        subPath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[]
    ): void {
        if (!params.trim()) return;

        const paramRegex = /(ubyte|byte|uword|word|long|ulong|float|bool|str)(\[\d*\])?\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/g;
        let match;
        while ((match = paramRegex.exec(params)) !== null) {
            const type = match[1] + (match[2] || '');
            const name = match[3];
            const fullPath = `${subPath}.${name}`;

            let foundLine = startLine;
            let foundCol = 0;
            let found = false;

            for (let lineIdx = startLine; lineIdx <= endLine && !found; lineIdx++) {
                const line = lines[lineIdx];
                const lineParamRegex = new RegExp(
                    `(ubyte|byte|uword|word|long|ulong|float|bool|str)(\\[\\d*\\])?\\s+(${this.escapeRegex(name)})\\b`,
                    'g'
                );
                const lineMatch = lineParamRegex.exec(line);
                if (lineMatch) {
                    foundLine = lineIdx;
                    const nameOffsetInMatch = lineMatch[0].length - name.length;
                    foundCol = lineMatch.index + nameOffsetInMatch;
                    found = true;
                }
            }

            symbols.push({
                name,
                kind: SymbolKind.Parameter,
                type,
                range: new vscode.Range(foundLine, foundCol, foundLine, foundCol + name.length),
                selectionRange: new vscode.Range(foundLine, foundCol, foundLine, foundCol + name.length),
                parent: subPath,
                fullPath,
                uri
            });
        }
    }

    // ──────────────────────────────────────────────
    //  ProgB-specific parsing
    // ──────────────────────────────────────────────

    /**
     * Parse a ProgB document and extract all symbols.
     * ProgB uses BASIC-style syntax with END blocks instead of braces.
     */
    private parseProgBDocument(document: vscode.TextDocument): ParsedSymbol[] {
        const symbols: ParsedSymbol[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        const scopeStack: { name: string; kind: SymbolKind; symbolIndex: number; startLine: number }[] = [];

        let pendingSub: {
            startLine: number;
            firstLine: string;
            accumulatedParams: string;
            isInline: boolean;
            subKind: SymbolKind;
            name: string;
            scopePath: string;
            keyword: string;  // 'SUB', 'FUNCTION', 'ASMSUB'
            isPrivate?: boolean;
        } | null = null;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmedLine = this.stripProgBComments(line).trim();

            if (trimmedLine === '') {
                continue;
            }

            const scopePath = scopeStack.map(s => s.name).join('.');

            // Handle multiline sub/function declaration continuation
            if (pendingSub) {
                const continuationContent = this.stripProgBComments(line).trim();
                pendingSub.accumulatedParams += ' ' + continuationContent;

                if (pendingSub.accumulatedParams.includes(')')) {
                    const fullDecl = pendingSub.accumulatedParams;
                    const closeParenIdx = fullDecl.indexOf(')');
                    const openParenIdx = fullDecl.indexOf('(');
                    const params = openParenIdx !== -1 ? fullDecl.substring(openParenIdx + 1, closeParenIdx) : '';
                    const afterParen = fullDecl.substring(closeParenIdx + 1).trim();

                    let returnType: string | undefined;
                    if (pendingSub.keyword === 'FUNCTION') {
                        const returnMatch = afterParen.match(/^AS\s+(\w+)/i);
                        returnType = returnMatch ? this.convertProgBType(returnMatch[1]) : undefined;
                    }

                    const fullPath = pendingSub.scopePath ? `${pendingSub.scopePath}.${pendingSub.name}` : pendingSub.name;
                    const nameStart = this.findIdentifierStart(pendingSub.firstLine, pendingSub.name, pendingSub.keyword);

                    const symbolIndex = symbols.length;
                    symbols.push({
                        name: pendingSub.name,
                        kind: pendingSub.subKind,
                        detail: pendingSub.isInline ? 'inline' : undefined,
                        description: this.extractDescriptionAbove(lines, pendingSub.startLine, true),
                        range: new vscode.Range(pendingSub.startLine, 0, lineIndex, line.length),
                        selectionRange: new vscode.Range(pendingSub.startLine, nameStart, pendingSub.startLine, nameStart + pendingSub.name.length),
                        parent: pendingSub.scopePath || undefined,
                        fullPath,
                        parameters: this.convertProgBParams(params.trim()),
                        returnType,
                        uri: document.uri,
                        isPrivate: pendingSub.isPrivate
                    });

                    this.parseProgBMultilineParameters(params.trim(), pendingSub.startLine, lineIndex, lines, fullPath, document.uri, symbols);

                    scopeStack.push({ name: pendingSub.name, kind: pendingSub.subKind, symbolIndex, startLine: pendingSub.startLine });

                    pendingSub = null;
                }
                continue;
            }

            // MODULE definition: MODULE name [AT $addr]
            const moduleMatch = trimmedLine.match(/^MODULE\s+([a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)(?:\s+AT\s+(\$[0-9a-fA-F]+))?/i);
            if (moduleMatch) {
                const name = moduleMatch[1];
                const address = moduleMatch[2];
                const nameStart = line.toUpperCase().indexOf(name.toUpperCase(), line.toUpperCase().indexOf('MODULE') + 6);

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Block,
                    detail: address || undefined,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    fullPath: name,
                    uri: document.uri
                });

                scopeStack.push({ name, kind: SymbolKind.Block, symbolIndex, startLine: lineIndex });
                continue;
            }

            // END MODULE
            if (/^END\s+MODULE\b/i.test(trimmedLine)) {
                this.closeProgBScope(scopeStack, symbols, lineIndex, line, SymbolKind.Block);
                continue;
            }

            // TYPE (struct) definition: [PRIVATE] TYPE Name
            const typeMatch = trimmedLine.match(/^(PRIVATE\s+)?TYPE\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/i);
            if (typeMatch) {
                const isPrivate = !!typeMatch[1];
                const name = typeMatch[2];
                const nameStart = line.toUpperCase().indexOf(name.toUpperCase(), line.toUpperCase().indexOf('TYPE') + 4);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Struct,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });

                scopeStack.push({ name, kind: SymbolKind.Struct, symbolIndex, startLine: lineIndex });
                continue;
            }

            // END TYPE
            if (/^END\s+TYPE\b/i.test(trimmedLine)) {
                this.closeProgBScope(scopeStack, symbols, lineIndex, line, SymbolKind.Struct);
                continue;
            }

            // ENUM definition: [PRIVATE] ENUM Name
            const progbEnumMatch = trimmedLine.match(/^(PRIVATE\s+)?ENUM\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/i);
            if (progbEnumMatch) {
                const isPrivate = !!progbEnumMatch[1];
                const name = progbEnumMatch[2];
                const nameStart = this.findIdentifierStart(line, name, 'ENUM');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Enum,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });

                scopeStack.push({ name, kind: SymbolKind.Enum, symbolIndex, startLine: lineIndex });
                continue;
            }

            // END ENUM
            if (/^END\s+ENUM\b/i.test(trimmedLine)) {
                this.closeProgBScope(scopeStack, symbols, lineIndex, line, SymbolKind.Enum);
                continue;
            }

            // ENUM members when inside an ENUM scope
            if (scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Enum) {
                const enumPath = scopePath;
                const memberMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*(?:=\s*(.+))?$/);
                if (memberMatch) {
                    const name = memberMatch[1];
                    const value = memberMatch[2]?.trim();
                    const nameStart = line.indexOf(name);
                    symbols.push({
                        name,
                        kind: SymbolKind.EnumMember,
                        detail: value ? `= ${value}` : undefined,
                        description: this.extractDescriptionAbove(lines, lineIndex, true),
                        range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                        selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                        parent: enumPath,
                        fullPath: `${enumPath}.${name}`,
                        uri: document.uri
                    });
                }
                continue;
            }

            // FUNCTION definition: [PRIVATE] [INLINE] FUNCTION name(params) AS type
            const funcMatch = trimmedLine.match(/^(?:PRIVATE\s+)?(INLINE\s+)?FUNCTION\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)(?:\s+AS\s+(.+))?/i);
            if (funcMatch) {
                const isInline = !!funcMatch[1];
                const name = funcMatch[2];
                const params = funcMatch[3] || '';
                const returnType = funcMatch[4]?.trim();
                const nameStart = this.findIdentifierStart(line, name, 'FUNCTION');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Subroutine,
                    detail: isInline ? 'inline' : undefined,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    returnType: this.convertProgBType(returnType),
                    uri: document.uri
                });

                this.parseProgBParameters(params, lineIndex, line, fullPath, document.uri, symbols);

                scopeStack.push({ name, kind: SymbolKind.Subroutine, symbolIndex, startLine: lineIndex });
                continue;
            } else {
                // Multiline FUNCTION declaration start
                const multilineFuncStart = trimmedLine.match(/^(?:PRIVATE\s+)?(INLINE\s+)?FUNCTION\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/i);
                if (multilineFuncStart) {
                    const isInline = !!multilineFuncStart[1];
                    const name = multilineFuncStart[2];
                    const partialParams = multilineFuncStart[3] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind: SymbolKind.Subroutine,
                        name,
                        scopePath,
                        keyword: 'FUNCTION'
                    };
                    continue;
                }
            }

            // END FUNCTION
            if (/^END\s+FUNCTION\b/i.test(trimmedLine)) {
                this.closeProgBScope(scopeStack, symbols, lineIndex, line, SymbolKind.Subroutine);
                continue;
            }

            // SUB definition: [PRIVATE] [INLINE] SUB name(params)
            const subMatch = trimmedLine.match(/^(PRIVATE\s+)?(INLINE\s+)?SUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/i);
            if (subMatch && !/^END\s+SUB\b/i.test(trimmedLine)) {
                const isPrivate = !!subMatch[1];
                const isInline = !!subMatch[2];
                const name = subMatch[3];
                const params = subMatch[4] || '';
                const nameStart = this.findIdentifierStart(line, name, 'SUB');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Subroutine,
                    detail: isInline ? 'inline' : undefined,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    uri: document.uri,
                    isPrivate
                });

                this.parseProgBParameters(params, lineIndex, line, fullPath, document.uri, symbols);

                scopeStack.push({ name, kind: SymbolKind.Subroutine, symbolIndex, startLine: lineIndex });
                continue;
            } else if (!/^END\s+SUB\b/i.test(trimmedLine)) {
                // Multiline SUB declaration start
                const multilineSubStart = trimmedLine.match(/^(PRIVATE\s+)?(INLINE\s+)?SUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/i);
                if (multilineSubStart) {
                    const isPrivate = !!multilineSubStart[1];
                    const isInline = !!multilineSubStart[2];
                    const name = multilineSubStart[3];
                    const partialParams = multilineSubStart[4] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind: SymbolKind.Subroutine,
                        name,
                        scopePath,
                        keyword: 'SUB',
                        isPrivate
                    };
                    continue;
                }
            }

            // END SUB
            if (/^END\s+SUB\b/i.test(trimmedLine)) {
                this.closeProgBScope(scopeStack, symbols, lineIndex, line, SymbolKind.Subroutine);
                continue;
            }

            // ASMSUB definition: [PRIVATE] [INLINE] ASMSUB name(params) [CLOBBERS(...)] [AS type @reg]
            const asmsubMatch = trimmedLine.match(/^(PRIVATE\s+)?(INLINE\s+)?ASMSUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/i);
            if (asmsubMatch) {
                const isPrivate = !!asmsubMatch[1];
                const isInline = !!asmsubMatch[2];
                const name = asmsubMatch[3];
                const params = asmsubMatch[4] || '';
                const nameStart = this.findIdentifierStart(line, name, 'ASMSUB');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const returnMatch = trimmedLine.match(/AS\s+(\w+)\s*(@\w+)?(?:\s+CLOBBERS|$)/i);
                const returnType = returnMatch ? returnMatch[1] : undefined;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.AsmSubroutine,
                    detail: isInline ? 'inline' : undefined,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    returnType: this.convertProgBType(returnType),
                    uri: document.uri,
                    isPrivate
                });

                scopeStack.push({ name, kind: SymbolKind.AsmSubroutine, symbolIndex, startLine: lineIndex });
                continue;
            } else {
                // Multiline ASMSUB declaration start
                const multilineAsmsubStart = trimmedLine.match(/^(PRIVATE\s+)?(INLINE\s+)?ASMSUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/i);
                if (multilineAsmsubStart) {
                    const isPrivate = !!multilineAsmsubStart[1];
                    const isInline = !!multilineAsmsubStart[2];
                    const name = multilineAsmsubStart[3];
                    const partialParams = multilineAsmsubStart[4] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind: SymbolKind.AsmSubroutine,
                        name,
                        scopePath,
                        keyword: 'ASMSUB',
                        isPrivate
                    };
                    continue;
                }
            }

            // END ASMSUB
            if (/^END\s+ASMSUB\b/i.test(trimmedLine)) {
                this.closeProgBScope(scopeStack, symbols, lineIndex, line, SymbolKind.AsmSubroutine);
                continue;
            }

            // EXTSUB: [PRIVATE] EXTSUB [AT BANK n] $addr = name(params) [AS type @reg] [CLOBBERS(...)]
            const extsubMatch = trimmedLine.match(/^(PRIVATE\s+)?EXTSUB\s+(?:AT\s+BANK\s+\d+\s+)?(\$[0-9a-fA-F]+)\s*=\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/i);
            if (extsubMatch) {
                const isPrivate = !!extsubMatch[1];
                const address = extsubMatch[2];
                const name = extsubMatch[3];
                const params = extsubMatch[4] || '';
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.ExtSubroutine,
                    detail: address,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    uri: document.uri,
                    isPrivate
                });
                continue;
            }

            // CONST name AS type = value
            const constMatch = trimmedLine.match(/^(PRIVATE\s+)?CONST\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s+AS\s+((?:PTR\s+)*\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*))\s*=\s*(.+)/i);
            if (constMatch) {
                const isPrivate = !!constMatch[1];
                const name = constMatch[2];
                const type = this.convertProgBType(constMatch[3]);
                const value = constMatch[4];
                const nameStart = this.findIdentifierStart(line, name, 'CONST');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Constant,
                    type,
                    detail: value,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri,
                    isPrivate
                });
                continue;
            }

            // Variable declarations (DIM)
            const insideStruct = scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Struct;
            const symbolCountBefore = symbols.length;
            this.parseProgBVariableDeclarations(trimmedLine, line, lineIndex, scopePath, document.uri, symbols, insideStruct);
            // Attach description to any variables just added
            if (symbols.length > symbolCountBefore) {
                const desc = this.extractDescriptionAbove(lines, lineIndex, true);
                if (desc) {
                    for (let si = symbolCountBefore; si < symbols.length; si++) {
                        symbols[si].description = desc;
                    }
                }
            }

            // ALIAS short = long.name
            const aliasMatch = trimmedLine.match(/^(?:PRIVATE\s+)?ALIAS\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/i);
            if (aliasMatch) {
                const name = aliasMatch[1];
                const target = aliasMatch[2];
                const nameStart = this.findIdentifierStart(line, name, 'ALIAS');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Alias,
                    detail: `= ${target}`,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri
                });
                continue;
            }

            // Labels
            const labelMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*):\s*$/);
            if (labelMatch) {
                const name = labelMatch[1];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Label,
                    description: this.extractDescriptionAbove(lines, lineIndex, true),
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri
                });
                continue;
            }

            // Struct fields when inside a TYPE: name AS type
            if (scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Struct) {
                const fieldMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s+AS\s+((?:PTR\s+)*\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*))/i);
                if (fieldMatch) {
                    const name = fieldMatch[1];
                    const type = this.convertProgBType(fieldMatch[2]);
                    const nameStart = line.indexOf(name);
                    const fullPath = scopePath ? `${scopePath}.${name}` : name;

                    symbols.push({
                        name,
                        kind: SymbolKind.StructField,
                        type,
                        description: this.extractDescriptionAbove(lines, lineIndex, true),
                        range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                        selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                        parent: scopePath || undefined,
                        fullPath,
                        uri: document.uri
                    });
                }
            }
        }

        return symbols;
    }

    /**
     * Close a ProgB scope and update its range (END keyword-based)
     */
    private closeProgBScope(
        scopeStack: { name: string; kind: SymbolKind; symbolIndex: number; startLine: number }[],
        symbols: ParsedSymbol[],
        lineIndex: number,
        line: string,
        expectedKind: SymbolKind
    ): void {
        for (let i = scopeStack.length - 1; i >= 0; i--) {
            if (scopeStack[i].kind === expectedKind) {
                const closedScope = scopeStack.splice(i, 1)[0];
                const symbol = symbols[closedScope.symbolIndex];
                if (symbol) {
                    symbol.range = new vscode.Range(
                        symbol.range.start,
                        new vscode.Position(lineIndex, line.length)
                    );
                }
                break;
            }
        }
    }

    /**
     * Find the start position of an identifier after a keyword (case-insensitive, ProgB)
     */
    private findIdentifierStart(line: string, identifier: string, keyword: string): number {
        const upperLine = line.toUpperCase();
        const keywordIndex = upperLine.indexOf(keyword.toUpperCase());
        if (keywordIndex === -1) return line.indexOf(identifier);

        const searchStart = keywordIndex + keyword.length;
        const remaining = line.substring(searchStart);
        const match = remaining.match(new RegExp(`\\b${this.escapeRegex(identifier)}\\b`, 'i'));
        if (match && match.index !== undefined) {
            return searchStart + match.index;
        }
        return line.indexOf(identifier);
    }

    /**
     * Strip ProgB comments (' and /' '/ and REM)
     */
    private stripProgBComments(line: string): string {
        // Block comments: /' ... '/
        const blockStart = line.indexOf("/'");
        const blockEnd = line.indexOf("'/");

        if (blockStart !== -1 && blockEnd !== -1 && blockEnd > blockStart) {
            return line.substring(0, blockStart) + line.substring(blockEnd + 2);
        }

        // Line comments (')
        let inString = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inString = !inString;
            }
            if (!inString && char === "'" && (i === 0 || line[i - 1] !== '/')) {
                if (i + 1 < line.length && line[i + 1] === '/') {
                    continue; // This is '/ end of block comment
                }
                return line.substring(0, i);
            }
        }

        // REM comments
        const remMatch = line.match(/^(.*?)\bREM\b/i);
        if (remMatch) {
            const beforeRem = remMatch[1];
            const quoteCount = (beforeRem.match(/"/g) || []).length;
            if (quoteCount % 2 === 0) {
                return beforeRem;
            }
        }

        return line;
    }

    /**
     * Check if a word is a ProgB keyword
     */
    private isProgBKeyword(word: string): boolean {
        return word.toUpperCase() in progbKeywords;
    }

    /**
     * Parse ProgB variable declarations from a line (DIM-based)
     */
    private parseProgBVariableDeclarations(
        trimmedLine: string,
        fullLine: string,
        lineIndex: number,
        scopePath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[],
        insideStruct: boolean = false
    ): void {
        if (!/^(?:PRIVATE\s+)?DIM\b/i.test(trimmedLine)) {
            return;
        }

        // DIM with AT (memory-mapped): [PRIVATE] DIM name[spec] AS type AT $address
        const memoryMatch = trimmedLine.match(/^(?:PRIVATE\s+)?DIM\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)((?:\s*\[[^\]]*\]){0,2})?\s+AS\s+(\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*(?:\.[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)*))\s+AT\s+(\$[0-9a-fA-F]+)/i);
        if (memoryMatch) {
            const name = memoryMatch[1];
            const arraySpec = memoryMatch[2]?.trim() || '';
            const type = this.convertProgBType(memoryMatch[3]);
            const address = memoryMatch[4];
            const nameStart = this.findIdentifierStart(fullLine, name, 'DIM');
            const fullPath = scopePath ? `${scopePath}.${name}` : name;

            symbols.push({
                name,
                kind: insideStruct ? SymbolKind.StructField : SymbolKind.Variable,
                type: arraySpec ? `${type}${arraySpec}` : `&${type}`,
                detail: `@ ${address}`,
                range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                parent: scopePath || undefined,
                fullPath,
                uri
            });
            return;
        }

        // Regular DIM: [PRIVATE] DIM name[spec], name2 AS type [= value] [@tags]
        const dimMatch = trimmedLine.match(/^(?:PRIVATE\s+)?DIM\s+(.+?)\s+AS\s+((?:PTR\s+)*\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*(?:\.[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)*))(?:\s+(@\w+))?/i);
        if (dimMatch) {
            const varList = dimMatch[1];
            const baseType = this.convertProgBType(dimMatch[2]);

            const varPattern = /([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)((?:\s*\[[^\]]*\]){0,2})(?:\s*=\s*[^,]+)?/gi;
            let varMatch;
            while ((varMatch = varPattern.exec(varList)) !== null) {
                const name = varMatch[1];
                const arraySpec = varMatch[2]?.trim() || '';
                const type = arraySpec ? `${baseType}${arraySpec}` : baseType;
                const nameStart = fullLine.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: insideStruct ? SymbolKind.StructField : SymbolKind.Variable,
                    type,
                    range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri
                });
            }
        }
    }

    /**
     * Parse ProgB subroutine parameters (name AS TYPE format)
     */
    private parseProgBParameters(
        params: string,
        lineIndex: number,
        fullLine: string,
        subPath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[]
    ): void {
        if (!params.trim()) return;

        const paramRegex = /([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)(\[\])?\s+AS\s+((?:PTR\s+)*\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*))(?:\s*(@\w+))?/gi;
        let match;
        while ((match = paramRegex.exec(params)) !== null) {
            const name = match[1];
            const isArray = !!match[2];
            const type = this.convertProgBType(match[3]) + (isArray ? '[]' : '');
            const nameStart = fullLine.indexOf(name, fullLine.indexOf('('));
            const fullPath = `${subPath}.${name}`;

            symbols.push({
                name,
                kind: SymbolKind.Parameter,
                type,
                range: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                parent: subPath,
                fullPath,
                uri
            });
        }
    }

    /**
     * Parse ProgB parameters from a multiline subroutine declaration
     */
    private parseProgBMultilineParameters(
        params: string,
        startLine: number,
        endLine: number,
        lines: string[],
        subPath: string,
        uri: vscode.Uri,
        symbols: ParsedSymbol[]
    ): void {
        if (!params.trim()) return;

        const paramRegex = /([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)(\[\])?\s+AS\s+((?:PTR\s+)*\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*))(?:\s*(@\w+))?/gi;
        let match;
        while ((match = paramRegex.exec(params)) !== null) {
            const name = match[1];
            const isArray = !!match[2];
            const type = this.convertProgBType(match[3]) + (isArray ? '[]' : '');
            const fullPath = `${subPath}.${name}`;

            let foundLine = startLine;
            let foundCol = 0;
            let found = false;

            for (let lineIdx = startLine; lineIdx <= endLine && !found; lineIdx++) {
                const line = lines[lineIdx];
                const lineParamRegex = new RegExp(
                    `(${this.escapeRegex(name)})(\\[\\])?\\s+AS\\s+(?:PTR\\s+)*(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_][\\w]*)`,
                    'gi'
                );
                const lineMatch = lineParamRegex.exec(line);
                if (lineMatch) {
                    foundLine = lineIdx;
                    foundCol = lineMatch.index;
                    found = true;
                }
            }

            symbols.push({
                name,
                kind: SymbolKind.Parameter,
                type,
                range: new vscode.Range(foundLine, foundCol, foundLine, foundCol + name.length),
                selectionRange: new vscode.Range(foundLine, foundCol, foundLine, foundCol + name.length),
                parent: subPath,
                fullPath,
                uri
            });
        }
    }

    /**
     * Convert ProgB parameter list to Prog8 style for display
     */
    private convertProgBParams(params: string): string {
        if (!params.trim()) return '';

        return params.replace(
            /([a-zA-Z_][\w]*)\s+AS\s+((?:PTR\s+)*(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|[a-zA-Z_][\w]*))(\s*@\w+)?/gi,
            (_, name, type, reg) => `${this.convertProgBType(type)} ${name}${reg || ''}`
        );
    }

    /**
     * Convert ProgB type to Prog8 type for display
     */
    private convertProgBType(type: string | undefined): string | undefined {
        if (!type) return undefined;

        // Handle PTR prefix keyword (PTR UBYTE -> ^^ubyte)
        let ptrPrefix = '';
        let remainingType = type;

        while (remainingType.match(/^PTR\s+/i)) {
            ptrPrefix += '^^';
            remainingType = remainingType.replace(/^PTR\s+/i, '').trim();
        }

        // Extract caret pointer prefixes (^ or ^^)
        const pointerMatch = remainingType.match(/^(\^+)(.+)$/);
        const caretPrefix = pointerMatch ? pointerMatch[1] : '';
        const baseType = pointerMatch ? pointerMatch[2] : remainingType;

        const typeMap: { [key: string]: string } = {
            'UBYTE': 'ubyte',
            'BYTE': 'byte',
            'UWORD': 'uword',
            'WORD': 'word',
            'LONG': 'long',
            'FLOAT': 'float',
            'BOOL': 'bool',
            'STRING': 'str'
        };

        const convertedBase = typeMap[baseType.toUpperCase()] || baseType;
        return ptrPrefix + caretPrefix + convertedBase;
    }
}

// Singleton instance
export const parser = new Parser();
