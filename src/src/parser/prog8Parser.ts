import * as vscode from 'vscode';

/**
 * Represents a symbol in Prog8 code
 */
export interface Prog8Symbol {
    name: string;
    kind: SymbolKind;
    type?: string;           // Data type for variables/constants
    detail?: string;         // Additional info (address, parameters, etc.)
    range: vscode.Range;     // Full range of the declaration
    selectionRange: vscode.Range;  // Range of just the name
    parent?: string;         // Parent block/subroutine name
    fullPath: string;        // Fully qualified name (e.g., "main.start.counter")
    parameters?: string;     // For subroutines
    returnType?: string;     // For subroutines with return values
    uri: vscode.Uri;         // Document URI
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
    Alias = 'alias'
}

/**
 * Parses a Prog8 document and extracts all symbols
 */
export class Prog8Parser {
    
    /**
     * Parse a document and return all symbols
     */
    parseDocument(document: vscode.TextDocument): Prog8Symbol[] {
        const symbols: Prog8Symbol[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        // Track scope - now also store the symbol index so we can update its range
        const scopeStack: { name: string; kind: SymbolKind; symbolIndex: number }[] = [];
        let braceDepth = 0;
        const scopeStartDepths: number[] = [];

        // Track multiline sub declarations
        let pendingSub: {
            startLine: number;
            firstLine: string;
            accumulatedParams: string;
            isInline: boolean;
            subKind: SymbolKind;
            name: string;
            scopePath: string;
        } | null = null;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmedLine = this.stripComments(line).trim();

            if (trimmedLine === '') {
                // Still need to track braces in empty/comment lines
                braceDepth += this.countBraces(line);
                this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                continue;
            }

            // Get current scope path
            const scopePath = scopeStack.map(s => s.name).join('.');

            // Handle multiline sub declaration continuation
            if (pendingSub) {
                // Accumulate this line's content (strip comments first)
                const continuationContent = this.stripComments(line).trim();
                pendingSub.accumulatedParams += ' ' + continuationContent;

                // Check if we now have the closing parenthesis
                if (pendingSub.accumulatedParams.includes(')')) {
                    // Extract the full params and complete the sub declaration
                    const fullDecl = pendingSub.accumulatedParams;
                    const closeParenIdx = fullDecl.indexOf(')');
                    // Find where params start (after the opening paren from first line)
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
                        range: new vscode.Range(pendingSub.startLine, 0, lineIndex, line.length),
                        selectionRange: new vscode.Range(pendingSub.startLine, nameStart, pendingSub.startLine, nameStart + pendingSub.name.length),
                        parent: pendingSub.scopePath || undefined,
                        fullPath,
                        parameters: params.trim(),
                        returnType,
                        uri: document.uri
                    });

                    // Parse parameters - use the start line and first line for position calculation
                    this.parseMultilineParameters(params.trim(), pendingSub.startLine, lineIndex, lines, fullPath, document.uri, symbols);

                    // Check if this line has the opening brace
                    if (fullDecl.includes('{')) {
                        scopeStack.push({ name: pendingSub.name, kind: pendingSub.subKind, symbolIndex });
                        scopeStartDepths.push(braceDepth);
                    }

                    pendingSub = null;
                }

                // Update brace depth and scope - still need to track even in continuation lines
                braceDepth += this.countBraces(line);
                this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                continue;
            }

            // Check for block definition: identifier [address] {
            const blockMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)\s*(\$[0-9a-fA-F]+)?\s*\{?\s*$/);
            if (blockMatch && braceDepth === 0 && !this.isKeyword(blockMatch[1])) {
                const name = blockMatch[1];
                const address = blockMatch[2];
                const nameStart = line.indexOf(name);
                
                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Block,
                    detail: address || undefined,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    fullPath: name,
                    uri: document.uri
                });

                scopeStack.push({ name, kind: SymbolKind.Block, symbolIndex });
                scopeStartDepths.push(braceDepth);
            }

            // Check for struct definition
            const structMatch = trimmedLine.match(/^struct\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\{?/);
            if (structMatch) {
                const name = structMatch[1];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Struct,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri
                });

                if (trimmedLine.includes('{')) {
                    scopeStack.push({ name, kind: SymbolKind.Struct, symbolIndex });
                    scopeStartDepths.push(braceDepth);
                }
            }

            // Check for subroutine: [inline] sub name(params) [-> returntype]
            // First, check if this is a complete single-line declaration
            const subMatch = trimmedLine.match(/^(inline\s+)?(sub|asmsub)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)(\s*->\s*(.+?))?\s*\{?/);
            if (subMatch) {
                const isInline = !!subMatch[1];
                const subKind = subMatch[2] === 'asmsub' ? SymbolKind.AsmSubroutine : SymbolKind.Subroutine;
                const name = subMatch[3];
                const params = subMatch[4] || '';
                const returnType = subMatch[6]?.trim();
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: subKind,
                    detail: isInline ? 'inline' : undefined,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: params,
                    returnType,
                    uri: document.uri
                });

                // Parse parameters as symbols too
                this.parseParameters(params, lineIndex, line, fullPath, document.uri, symbols);

                if (trimmedLine.includes('{')) {
                    scopeStack.push({ name, kind: subKind, symbolIndex });
                    scopeStartDepths.push(braceDepth);
                }
            } else {
                // Check for start of multiline sub declaration (has opening paren but no closing paren)
                const multilineSubStart = trimmedLine.match(/^(inline\s+)?(sub|asmsub)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/);
                if (multilineSubStart) {
                    const isInline = !!multilineSubStart[1];
                    const subKind = multilineSubStart[2] === 'asmsub' ? SymbolKind.AsmSubroutine : SymbolKind.Subroutine;
                    const name = multilineSubStart[3];
                    const partialParams = multilineSubStart[4] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind,
                        name,
                        scopePath
                    };

                    // Update brace depth and continue to next line
                    braceDepth += this.countBraces(line);
                    this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
                    continue;
                }
            }

            // Check for extsub: extsub $address = name(params)
            const extsubMatch = trimmedLine.match(/^extsub\s+(\$[0-9a-fA-F]+)\s*=\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/);
            if (extsubMatch) {
                const address = extsubMatch[1];
                const name = extsubMatch[2];
                const params = extsubMatch[3] || '';
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.ExtSubroutine,
                    detail: address,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: params,
                    uri: document.uri
                });
            }

            // Check for const declarations
            const constMatch = trimmedLine.match(/^const\s+(ubyte|byte|uword|word|long|ulong|float|bool|str)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/);
            if (constMatch) {
                const type = constMatch[1];
                const name = constMatch[2];
                const value = constMatch[3];
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
                    uri: document.uri
                });
            }

            // Check for variable declarations (various forms)
            const insideStruct = scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Struct;
            this.parseVariableDeclarations(trimmedLine, line, lineIndex, scopePath, document.uri, symbols, insideStruct);

            // Check for alias
            const aliasMatch = trimmedLine.match(/^alias\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/);
            if (aliasMatch) {
                const name = aliasMatch[1];
                const target = aliasMatch[2];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Alias,
                    detail: `-> ${target}`,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri
                });
            }

            // Check for labels
            const labelMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*):\s*$/);
            if (labelMatch) {
                const name = labelMatch[1];
                const nameStart = line.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Label,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    uri: document.uri
                });
            }

            // Update brace depth and scope
            const prevDepth = braceDepth;
            braceDepth += this.countBraces(line);

            // Check if we're closing any scopes and update their ranges
            this.updateClosedScopes(braceDepth, scopeStack, scopeStartDepths, symbols, lineIndex, line);
        }

        return symbols;
    }

    /**
     * Update ranges for scopes that are being closed
     */
    private updateClosedScopes(
        braceDepth: number,
        scopeStack: { name: string; kind: SymbolKind; symbolIndex: number }[],
        scopeStartDepths: number[],
        symbols: Prog8Symbol[],
        lineIndex: number,
        line: string
    ): void {
        while (scopeStartDepths.length > 0 && braceDepth <= scopeStartDepths[scopeStartDepths.length - 1]) {
            const closedScope = scopeStack.pop();
            scopeStartDepths.pop();
            
            // Update the symbol's range to include the entire scope
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
     * Parse variable declarations from a line
     */
    private parseVariableDeclarations(
        trimmedLine: string,
        fullLine: string,
        lineIndex: number,
        scopePath: string,
        uri: vscode.Uri,
        symbols: Prog8Symbol[],
        insideStruct: boolean = false
    ): void {
        // Skip if it's a keyword line
        if (/^(const|sub|asmsub|extsub|struct|if|else|when|for|while|do|repeat|return|goto|defer|alias|on)\b/.test(trimmedLine)) {
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

        // Regular variable: type [@tags] name [= value]
        // Supports primitive types, pointer types (^, ^^), custom type names, and qualified type names (e.g., other.DirEntry)
        const varMatch = trimmedLine.match(/^(\^{0,2}(?:ubyte|byte|uword|word|long|ulong|float|bool|str|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*(?:\.[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)*))(\[\d*\])?\s+(@\w+\s+)*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/);
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
     * Parse subroutine parameters
     */
    private parseParameters(
        params: string,
        lineIndex: number,
        fullLine: string,
        subPath: string,
        uri: vscode.Uri,
        symbols: Prog8Symbol[]
    ): void {
        if (!params.trim()) return;

        // Simple parameter parsing: type name
        const paramRegex = /(ubyte|byte|uword|word|long|ulong|float|bool|str)(\[\d*\])?\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/g;
        let match;
        const parenPos = fullLine.indexOf('(');
        while ((match = paramRegex.exec(params)) !== null) {
            const type = match[1] + (match[2] || '');
            const name = match[3];
            // Compute position from the regex match offset within params,
            // rather than using indexOf which can find single-letter names
            // (like 'y' or 'e') inside type keywords (like 'ubyte').
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
     * Parse parameters from a multiline subroutine declaration.
     * Searches each line in the span to find the actual positions of parameters.
     */
    private parseMultilineParameters(
        params: string,
        startLine: number,
        endLine: number,
        lines: string[],
        subPath: string,
        uri: vscode.Uri,
        symbols: Prog8Symbol[]
    ): void {
        if (!params.trim()) return;

        // Parse each parameter from the combined params string
        const paramRegex = /(ubyte|byte|uword|word|long|ulong|float|bool|str)(\[\d*\])?\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/g;
        let match;
        while ((match = paramRegex.exec(params)) !== null) {
            const type = match[1] + (match[2] || '');
            const name = match[3];
            const fullPath = `${subPath}.${name}`;

            // Find the actual position of this parameter name in the source lines
            let foundLine = startLine;
            let foundCol = 0;
            let found = false;

            // Search through the lines that comprise this multiline declaration
            for (let lineIdx = startLine; lineIdx <= endLine && !found; lineIdx++) {
                const line = lines[lineIdx];
                // Look for the parameter pattern "type name" in this line
                const lineParamRegex = new RegExp(
                    `(ubyte|byte|uword|word|long|ulong|float|bool|str)(\\[\\d*\\])?\\s+(${this.escapeRegex(name)})\\b`,
                    'g'
                );
                const lineMatch = lineParamRegex.exec(line);
                if (lineMatch) {
                    foundLine = lineIdx;
                    // The name starts at the match position + the length before the name
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

    /**
     * Escape special regex characters in a string
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Strip comments from a line
     */
    private stripComments(line: string): string {
        // Handle line comments
        const commentIndex = line.indexOf(';');
        if (commentIndex !== -1) {
            // Make sure it's not inside a string
            const beforeComment = line.substring(0, commentIndex);
            const quoteCount = (beforeComment.match(/"/g) || []).length;
            if (quoteCount % 2 === 0) {
                return beforeComment;
            }
        }
        return line;
    }

    /**
     * Count net brace change in a line
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
                // Check for asm block markers
                if (char === '{' && line[i + 1] === '{') {
                    inAsm = true;
                    i++; // Skip next {
                } else if (char === '}' && line[i + 1] === '}') {
                    inAsm = false;
                    i++; // Skip next }
                } else if (!inAsm) {
                    if (char === '{') count++;
                    else if (char === '}') count--;
                }
            }
        }
        return count;
    }

    /**
     * Check if a word is a Prog8 keyword
     */
    private isKeyword(word: string): boolean {
        const keywords = [
            'if', 'else', 'when', 'for', 'while', 'do', 'until', 'repeat', 'unroll',
            'sub', 'asmsub', 'extsub', 'inline', 'return', 'break', 'continue',
            'goto', 'defer', 'struct', 'const', 'alias', 'on', 'void', 'call',
            'ubyte', 'byte', 'uword', 'word', 'long', 'ulong', 'float', 'bool', 'str',
            'true', 'false', 'not', 'and', 'or', 'xor', 'in', 'to', 'downto', 'step'
        ];
        return keywords.includes(word);
    }

    /**
     * Find the word at a given position in a document
     */
    getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF.]*/);
        return wordRange ? document.getText(wordRange) : undefined;
    }

    /**
     * Find a symbol by name, considering scope
     */
    findSymbol(symbols: Prog8Symbol[], name: string, currentScope?: string): Prog8Symbol | undefined {
        // Handle qualified names (e.g., "main.start")
        if (name.includes('.')) {
            return symbols.find(s => s.fullPath === name);
        }

        // For unqualified names, search local scope first, then parent scopes
        if (currentScope) {
            // Build list of scopes to search (current, parent, grandparent, etc.)
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
    getScopeAtPosition(symbols: Prog8Symbol[], position: vscode.Position): string | undefined {
        // Find the innermost scope that contains this position
        let currentScope: string | undefined;
        let minRange: vscode.Range | undefined;

        for (const symbol of symbols) {
            if ((symbol.kind === SymbolKind.Block || 
                 symbol.kind === SymbolKind.Subroutine || 
                 symbol.kind === SymbolKind.AsmSubroutine ||
                 symbol.kind === SymbolKind.Struct) &&
                symbol.range.contains(position)) {
                if (!minRange || symbol.range.start.isAfter(minRange.start)) {
                    currentScope = symbol.fullPath;
                    minRange = symbol.range;
                }
            }
        }

        return currentScope;
    }
}

// Singleton instance
export const prog8Parser = new Prog8Parser();
