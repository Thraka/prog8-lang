import * as vscode from 'vscode';

/**
 * Represents a symbol in ProgB code
 */
export interface ProgBSymbol {
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
 * Parses a ProgB document and extracts all symbols.
 * ProgB uses BASIC-style syntax with END blocks instead of braces.
 */
export class ProgBParser {
    
    /**
     * Parse a document and return all symbols
     */
    parseDocument(document: vscode.TextDocument): ProgBSymbol[] {
        const symbols: ProgBSymbol[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        // Track scope with a stack of { name, kind, symbolIndex, startLine }
        const scopeStack: { name: string; kind: SymbolKind; symbolIndex: number; startLine: number }[] = [];

        // Track multiline sub/function declarations
        let pendingSub: {
            startLine: number;
            firstLine: string;
            accumulatedParams: string;
            isInline: boolean;
            subKind: SymbolKind;
            name: string;
            scopePath: string;
            keyword: string;  // 'SUB', 'FUNCTION', 'ASMSUB'
        } | null = null;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmedLine = this.stripComments(line).trim();

            if (trimmedLine === '') {
                continue;
            }

            // Get current scope path
            const scopePath = scopeStack.map(s => s.name).join('.');

            // Handle multiline sub/function declaration continuation
            if (pendingSub) {
                // Accumulate this line's content (strip comments first)
                const continuationContent = this.stripComments(line).trim();
                pendingSub.accumulatedParams += ' ' + continuationContent;

                // Check if we now have the closing parenthesis
                if (pendingSub.accumulatedParams.includes(')')) {
                    // Extract the full params and complete the sub declaration
                    const fullDecl = pendingSub.accumulatedParams;
                    const closeParenIdx = fullDecl.indexOf(')');
                    const openParenIdx = fullDecl.indexOf('(');
                    const params = openParenIdx !== -1 ? fullDecl.substring(openParenIdx + 1, closeParenIdx) : '';
                    const afterParen = fullDecl.substring(closeParenIdx + 1).trim();
                    
                    // For FUNCTION, check for AS return type
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
                        range: new vscode.Range(pendingSub.startLine, 0, lineIndex, line.length),
                        selectionRange: new vscode.Range(pendingSub.startLine, nameStart, pendingSub.startLine, nameStart + pendingSub.name.length),
                        parent: pendingSub.scopePath || undefined,
                        fullPath,
                        parameters: this.convertProgBParams(params.trim()),
                        returnType,
                        uri: document.uri
                    });

                    // Parse parameters - use the multiline version
                    this.parseMultilineParameters(params.trim(), pendingSub.startLine, lineIndex, lines, fullPath, document.uri, symbols);

                    // Push scope for SUB/FUNCTION/ASMSUB (they have END blocks)
                    scopeStack.push({ name: pendingSub.name, kind: pendingSub.subKind, symbolIndex, startLine: pendingSub.startLine });

                    pendingSub = null;
                }
                continue;
            }

            // Check for MODULE definition: MODULE name [AT $addr]
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
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    fullPath: name,
                    uri: document.uri
                });

                scopeStack.push({ name, kind: SymbolKind.Block, symbolIndex, startLine: lineIndex });
                continue;
            }

            // Check for END MODULE
            if (/^END\s+MODULE\b/i.test(trimmedLine)) {
                this.closeScope(scopeStack, symbols, lineIndex, line, SymbolKind.Block);
                continue;
            }

            // Check for TYPE (struct) definition: TYPE Name
            const typeMatch = trimmedLine.match(/^TYPE\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/i);
            if (typeMatch) {
                const name = typeMatch[1];
                const nameStart = line.toUpperCase().indexOf(name.toUpperCase(), line.toUpperCase().indexOf('TYPE') + 4);
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

                scopeStack.push({ name, kind: SymbolKind.Struct, symbolIndex, startLine: lineIndex });
                continue;
            }

            // Check for END TYPE
            if (/^END\s+TYPE\b/i.test(trimmedLine)) {
                this.closeScope(scopeStack, symbols, lineIndex, line, SymbolKind.Struct);
                continue;
            }

            // Check for FUNCTION definition: [INLINE] FUNCTION name(params) AS type
            const funcMatch = trimmedLine.match(/^(INLINE\s+)?FUNCTION\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)(?:\s+AS\s+(.+))?/i);
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
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    returnType: this.convertProgBType(returnType),
                    uri: document.uri
                });

                // Parse parameters as symbols too
                this.parseParameters(params, lineIndex, line, fullPath, document.uri, symbols);

                scopeStack.push({ name, kind: SymbolKind.Subroutine, symbolIndex, startLine: lineIndex });
                continue;
            } else {
                // Check for start of multiline FUNCTION declaration (has opening paren but no closing paren)
                const multilineFuncStart = trimmedLine.match(/^(INLINE\s+)?FUNCTION\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/i);
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

            // Check for END FUNCTION
            if (/^END\s+FUNCTION\b/i.test(trimmedLine)) {
                this.closeScope(scopeStack, symbols, lineIndex, line, SymbolKind.Subroutine);
                continue;
            }

            // Check for SUB definition: [INLINE] SUB name(params)
            const subMatch = trimmedLine.match(/^(INLINE\s+)?SUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/i);
            if (subMatch && !/^END\s+SUB\b/i.test(trimmedLine)) {
                const isInline = !!subMatch[1];
                const name = subMatch[2];
                const params = subMatch[3] || '';
                const nameStart = this.findIdentifierStart(line, name, 'SUB');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.Subroutine,
                    detail: isInline ? 'inline' : undefined,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    uri: document.uri
                });

                // Parse parameters as symbols too
                this.parseParameters(params, lineIndex, line, fullPath, document.uri, symbols);

                scopeStack.push({ name, kind: SymbolKind.Subroutine, symbolIndex, startLine: lineIndex });
                continue;
            } else if (!/^END\s+SUB\b/i.test(trimmedLine)) {
                // Check for start of multiline SUB declaration (has opening paren but no closing paren)
                const multilineSubStart = trimmedLine.match(/^(INLINE\s+)?SUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/i);
                if (multilineSubStart) {
                    const isInline = !!multilineSubStart[1];
                    const name = multilineSubStart[2];
                    const partialParams = multilineSubStart[3] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind: SymbolKind.Subroutine,
                        name,
                        scopePath,
                        keyword: 'SUB'
                    };
                    continue;
                }
            }

            // Check for END SUB
            if (/^END\s+SUB\b/i.test(trimmedLine)) {
                this.closeScope(scopeStack, symbols, lineIndex, line, SymbolKind.Subroutine);
                continue;
            }

            // Check for ASMSUB definition: [INLINE] ASMSUB name(params) [CLOBBERS(...)] [AS type @reg]
            const asmsubMatch = trimmedLine.match(/^(INLINE\s+)?ASMSUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/i);
            if (asmsubMatch) {
                const isInline = !!asmsubMatch[1];
                const name = asmsubMatch[2];
                const params = asmsubMatch[3] || '';
                const nameStart = this.findIdentifierStart(line, name, 'ASMSUB');
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                // Check for return type
                const returnMatch = trimmedLine.match(/AS\s+(\w+)\s*(@\w+)?(?:\s+CLOBBERS|$)/i);
                const returnType = returnMatch ? returnMatch[1] : undefined;

                const symbolIndex = symbols.length;
                symbols.push({
                    name,
                    kind: SymbolKind.AsmSubroutine,
                    detail: isInline ? 'inline' : undefined,
                    range: new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                    parent: scopePath || undefined,
                    fullPath,
                    parameters: this.convertProgBParams(params),
                    returnType: this.convertProgBType(returnType),
                    uri: document.uri
                });

                scopeStack.push({ name, kind: SymbolKind.AsmSubroutine, symbolIndex, startLine: lineIndex });
                continue;
            } else {
                // Check for start of multiline ASMSUB declaration (has opening paren but no closing paren)
                const multilineAsmsubStart = trimmedLine.match(/^(INLINE\s+)?ASMSUB\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\s*$/i);
                if (multilineAsmsubStart) {
                    const isInline = !!multilineAsmsubStart[1];
                    const name = multilineAsmsubStart[2];
                    const partialParams = multilineAsmsubStart[3] || '';

                    pendingSub = {
                        startLine: lineIndex,
                        firstLine: line,
                        accumulatedParams: '(' + partialParams,
                        isInline,
                        subKind: SymbolKind.AsmSubroutine,
                        name,
                        scopePath,
                        keyword: 'ASMSUB'
                    };
                    continue;
                }
            }

            // Check for END ASMSUB
            if (/^END\s+ASMSUB\b/i.test(trimmedLine)) {
                this.closeScope(scopeStack, symbols, lineIndex, line, SymbolKind.AsmSubroutine);
                continue;
            }

            // Check for EXTSUB: EXTSUB [AT BANK n] $addr = name(params) [AS type @reg] [CLOBBERS(...)]
            const extsubMatch = trimmedLine.match(/^EXTSUB\s+(?:AT\s+BANK\s+\d+\s+)?(\$[0-9a-fA-F]+)\s*=\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(([^)]*)\)/i);
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
                    parameters: this.convertProgBParams(params),
                    uri: document.uri
                });
                continue;
            }

            // Check for CONST declarations: CONST name AS type = value
            const constMatch = trimmedLine.match(/^CONST\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s+AS\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING)\s*=\s*(.+)/i);
            if (constMatch) {
                const name = constMatch[1];
                const type = this.convertProgBType(constMatch[2]);
                const value = constMatch[3];
                const nameStart = this.findIdentifierStart(line, name, 'CONST');
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
                continue;
            }

            // Check for variable declarations (DIM)
            this.parseVariableDeclarations(trimmedLine, line, lineIndex, scopePath, document.uri, symbols);

            // Check for alias: ALIAS short = long.name
            const aliasMatch = trimmedLine.match(/^ALIAS\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*=\s*(.+)/i);
            if (aliasMatch) {
                const name = aliasMatch[1];
                const target = aliasMatch[2];
                const nameStart = this.findIdentifierStart(line, name, 'ALIAS');
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
                continue;
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
                continue;
            }

            // Check for struct fields when inside a TYPE: name AS type
            // Supports primitive types, pointer types (^, ^^), and custom type names
            if (scopeStack.length > 0 && scopeStack[scopeStack.length - 1].kind === SymbolKind.Struct) {
                const fieldMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s+AS\s+(\^{0,2}(?:UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|PTR|[a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*))/i);
                if (fieldMatch) {
                    const name = fieldMatch[1];
                    const type = this.convertProgBType(fieldMatch[2]);
                    const nameStart = line.indexOf(name);
                    const fullPath = scopePath ? `${scopePath}.${name}` : name;

                    symbols.push({
                        name,
                        kind: SymbolKind.StructField,
                        type,
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
     * Close a scope and update its range
     */
    private closeScope(
        scopeStack: { name: string; kind: SymbolKind; symbolIndex: number; startLine: number }[],
        symbols: ProgBSymbol[],
        lineIndex: number,
        line: string,
        expectedKind: SymbolKind
    ): void {
        // Find and close the matching scope
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
     * Find the start position of an identifier after a keyword
     */
    private findIdentifierStart(line: string, identifier: string, keyword: string): number {
        const upperLine = line.toUpperCase();
        const keywordIndex = upperLine.indexOf(keyword.toUpperCase());
        if (keywordIndex === -1) return line.indexOf(identifier);
        
        // Search for the identifier after the keyword
        const searchStart = keywordIndex + keyword.length;
        const remaining = line.substring(searchStart);
        const match = remaining.match(new RegExp(`\\b${this.escapeRegex(identifier)}\\b`, 'i'));
        if (match && match.index !== undefined) {
            return searchStart + match.index;
        }
        return line.indexOf(identifier);
    }

    /**
     * Escape special regex characters
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
        symbols: ProgBSymbol[]
    ): void {
        // Skip if not a DIM statement
        if (!/^DIM\b/i.test(trimmedLine)) {
            return;
        }

        // DIM with AT (memory-mapped): DIM name AS type AT $address
        const memoryMatch = trimmedLine.match(/^DIM\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)(?:\s*\[([^\]]*)\])?\s+AS\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING)\s+AT\s+(\$[0-9a-fA-F]+)/i);
        if (memoryMatch) {
            const name = memoryMatch[1];
            const arraySize = memoryMatch[2];
            const type = this.convertProgBType(memoryMatch[3]);
            const address = memoryMatch[4];
            const nameStart = this.findIdentifierStart(fullLine, name, 'DIM');
            const fullPath = scopePath ? `${scopePath}.${name}` : name;

            symbols.push({
                name,
                kind: SymbolKind.Variable,
                type: arraySize ? `${type}[${arraySize}]` : `&${type}`,
                detail: `@ ${address}`,
                range: new vscode.Range(lineIndex, 0, lineIndex, fullLine.length),
                selectionRange: new vscode.Range(lineIndex, nameStart, lineIndex, nameStart + name.length),
                parent: scopePath || undefined,
                fullPath,
                uri
            });
            return;
        }

        // Regular DIM: DIM name[size], name2 AS type [= value] [@tags]
        // Pattern: DIM var1[10], var2, var3 AS UBYTE
        const dimMatch = trimmedLine.match(/^DIM\s+(.+?)\s+AS\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|PTR)(?:\s+(@\w+))?/i);
        if (dimMatch) {
            const varList = dimMatch[1];
            const baseType = this.convertProgBType(dimMatch[2]);
            
            // Parse the variable list (handles: name, name[size], name = value)
            const varPattern = /([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)(?:\s*\[([^\]]*)\])?(?:\s*=\s*[^,]+)?/gi;
            let varMatch;
            while ((varMatch = varPattern.exec(varList)) !== null) {
                const name = varMatch[1];
                const arraySize = varMatch[2];
                const type = arraySize ? `${baseType}[${arraySize}]` : baseType;
                const nameStart = fullLine.indexOf(name);
                const fullPath = scopePath ? `${scopePath}.${name}` : name;

                symbols.push({
                    name,
                    kind: SymbolKind.Variable,
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
     * Parse subroutine parameters (ProgB style: name AS TYPE [@reg])
     */
    private parseParameters(
        params: string,
        lineIndex: number,
        fullLine: string,
        subPath: string,
        uri: vscode.Uri,
        symbols: ProgBSymbol[]
    ): void {
        if (!params.trim()) return;

        // ProgB parameter format: name AS TYPE [@reg]
        const paramRegex = /([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s+AS\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|PTR)(?:\s*(@\w+))?/gi;
        let match;
        while ((match = paramRegex.exec(params)) !== null) {
            const name = match[1];
            const type = this.convertProgBType(match[2]);
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
        symbols: ProgBSymbol[]
    ): void {
        if (!params.trim()) return;

        // ProgB parameter format: name AS TYPE [@reg]
        const paramRegex = /([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s+AS\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|PTR)(?:\s*(@\w+))?/gi;
        let match;
        while ((match = paramRegex.exec(params)) !== null) {
            const name = match[1];
            const type = this.convertProgBType(match[2]);
            const fullPath = `${subPath}.${name}`;

            // Find the actual position of this parameter name in the source lines
            let foundLine = startLine;
            let foundCol = 0;
            let found = false;

            // Search through the lines that comprise this multiline declaration
            for (let lineIdx = startLine; lineIdx <= endLine && !found; lineIdx++) {
                const line = lines[lineIdx];
                // Look for the parameter pattern "name AS TYPE" in this line (case-insensitive)
                const lineParamRegex = new RegExp(
                    `(${this.escapeRegex(name)})\\s+AS\\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|PTR)`,
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
        
        // Convert "name AS TYPE [@reg]" to "type name [@reg]"
        return params.replace(
            /([a-zA-Z_][\w]*)\s+AS\s+(UBYTE|BYTE|UWORD|WORD|LONG|FLOAT|BOOL|STRING|PTR)(\s*@\w+)?/gi,
            (_, name, type, reg) => `${this.convertProgBType(type)} ${name}${reg || ''}`
        );
    }

    /**
     * Convert ProgB type to Prog8 type for display
     */
    private convertProgBType(type: string | undefined): string | undefined {
        if (!type) return undefined;
        const typeMap: { [key: string]: string } = {
            'UBYTE': 'ubyte',
            'BYTE': 'byte',
            'UWORD': 'uword',
            'WORD': 'word',
            'LONG': 'long',
            'FLOAT': 'float',
            'BOOL': 'bool',
            'STRING': 'str',
            'PTR': '^^'
        };
        return typeMap[type.toUpperCase()] || type.toLowerCase();
    }

    /**
     * Strip comments from a line (ProgB uses ' and /' '/ for comments)
     */
    private stripComments(line: string): string {
        // Handle block comment continuation (simplistic - doesn't handle multi-line properly)
        // For single-line detection, just look for /'
        const blockStart = line.indexOf("/'");
        const blockEnd = line.indexOf("'/");
        
        if (blockStart !== -1 && blockEnd !== -1 && blockEnd > blockStart) {
            // Both on same line - remove the comment
            return line.substring(0, blockStart) + line.substring(blockEnd + 2);
        }
        
        // Handle line comments (')
        // Make sure it's not inside a string
        let inString = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inString = !inString;
            }
            if (!inString && char === "'" && (i === 0 || line[i - 1] !== '/')) {
                // Check it's not part of /' or '/
                if (i + 1 < line.length && line[i + 1] === '/') {
                    continue; // This is '/ end of block comment
                }
                return line.substring(0, i);
            }
        }
        
        // Handle REM comments
        const remMatch = line.match(/^(.*?)\bREM\b/i);
        if (remMatch) {
            const beforeRem = remMatch[1];
            // Make sure REM is not inside a string
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
    private isKeyword(word: string): boolean {
        const keywords = [
            'if', 'then', 'elseif', 'else', 'end', 'select', 'case', 'for', 'next', 
            'to', 'downto', 'step', 'in', 'while', 'wend', 'do', 'loop', 'until',
            'repeat', 'unroll', 'sub', 'function', 'asmsub', 'extsub', 'inline',
            'return', 'break', 'continue', 'exit', 'goto', 'defer', 'type', 'module',
            'dim', 'const', 'alias', 'on', 'void', 'call', 'as', 'at',
            'ubyte', 'byte', 'uword', 'word', 'long', 'float', 'bool', 'string', 'ptr',
            'true', 'false', 'not', 'and', 'or', 'xor', 'mod', 'shl', 'shr',
            'import', 'encoding', 'launcher', 'option', 'output', 'zeropage',
            'asm', 'ir', 'clobbers', 'rem'
        ];
        return keywords.includes(word.toLowerCase());
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
    findSymbol(symbols: ProgBSymbol[], name: string, currentScope?: string): ProgBSymbol | undefined {
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
    getScopeAtPosition(symbols: ProgBSymbol[], position: vscode.Position): string | undefined {
        // Find the innermost scope that contains this position
        let currentScope: string | undefined;
        let minRange: vscode.Range | undefined;

        for (const symbol of symbols) {
            if ((symbol.kind === SymbolKind.Block || 
                 symbol.kind === SymbolKind.Subroutine || 
                 symbol.kind === SymbolKind.AsmSubroutine) &&
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
export const progbParser = new ProgBParser();
