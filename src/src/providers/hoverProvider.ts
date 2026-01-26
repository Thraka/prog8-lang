import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { findSubroutine, getAllBlocks, findModule, formatSubroutineSignature, SubroutineInfo, BlockInfo, ModuleInfo } from '../data/librarySymbols';
import { parseImportedFileSymbols, findSymbolInImports } from '../parser/importResolver';

/**
 * Provides hover information for Prog8 files.
 */
export class Prog8HoverProvider implements vscode.HoverProvider {

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        
        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        // Check if it's a qualified name (e.g., txt.print)
        const qualifiedName = this.getQualifiedNameAtPosition(document, position);
        if (qualifiedName && qualifiedName.includes('.')) {
            const libraryHover = this.getLibraryHover(qualifiedName);
            if (libraryHover) {
                return libraryHover;
            }
        }

        // Check if it's a built-in function
        const builtinHover = this.getBuiltinHover(word);
        if (builtinHover) {
            return builtinHover;
        }

        // Check if it's a keyword
        const keywordHover = this.getKeywordHover(word);
        if (keywordHover) {
            return keywordHover;
        }

        // Check if it's a library module name (e.g., buffers, textio)
        const moduleHover = this.getLibraryModuleHover(word);
        if (moduleHover) {
            return moduleHover;
        }

        // Check if it's a library block name (e.g., txt, sys, cx16)
        const blockHover = this.getLibraryBlockHover(word);
        if (blockHover) {
            return blockHover;
        }

        // Parse the document to get symbols
        const symbols = unifiedParser.parseDocument(document);
        
        // Get current scope for context
        const currentScope = unifiedParser.getScopeAtPosition(symbols, position);

        // Find the symbol in current file
        const symbol = unifiedParser.findSymbol(symbols, word, currentScope);
        
        if (symbol) {
            return this.createHoverForSymbol(symbol);
        }

        // Search in imported local files
        const importedFileSymbols = await parseImportedFileSymbols(document);
        const importedSymbol = findSymbolInImports(qualifiedName || word, importedFileSymbols, currentScope);
        if (importedSymbol) {
            return this.createHoverForSymbol(importedSymbol, true);
        }

        // If not found locally, search other Prog8 files in the same directory
        const crossFileSymbol = await this.findSymbolInOtherFiles(document, word, qualifiedName);
        if (crossFileSymbol) {
            return this.createHoverForSymbol(crossFileSymbol);
        }

        return undefined;
    }

    /**
     * Get the fully qualified name at a position (e.g., txt.print)
     */
    private getQualifiedNameAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
        const line = document.lineAt(position.line).text;
        
        // Find the start of the identifier chain
        let start = position.character;
        while (start > 0 && /[\w.]/.test(line[start - 1])) {
            start--;
        }
        
        // Find the end of the identifier chain
        let end = position.character;
        while (end < line.length && /[\w.]/.test(line[end])) {
            end++;
        }
        
        const fullName = line.substring(start, end);
        
        // Only return if it looks like a qualified name
        if (fullName && /^\w+\.\w+$/.test(fullName)) {
            return fullName;
        }
        
        return undefined;
    }

    /**
     * Create a hover for a symbol
     * @param symbol The symbol to create a hover for
     * @param isImported Whether the symbol comes from an imported file
     */
    private createHoverForSymbol(symbol: UnifiedSymbol, isImported: boolean = false): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        
        switch (symbol.kind) {
            case SymbolKind.Block:
                markdown.appendCodeblock(`${symbol.name}${symbol.detail ? ' ' + symbol.detail : ''} { }`, 'prog8');
                markdown.appendMarkdown('\n\n*Block (namespace)*');
                break;

            case SymbolKind.Subroutine:
                const subSig = `sub ${symbol.name}(${symbol.parameters || ''})${symbol.returnType ? ' -> ' + symbol.returnType : ''}`;
                markdown.appendCodeblock(subSig, 'prog8');
                if (symbol.detail === 'inline') {
                    markdown.appendMarkdown('\n\n*Inline subroutine*');
                }
                break;

            case SymbolKind.AsmSubroutine:
                const asmSig = `asmsub ${symbol.name}(${symbol.parameters || ''})`;
                markdown.appendCodeblock(asmSig, 'prog8');
                markdown.appendMarkdown('\n\n*Assembly subroutine*');
                break;

            case SymbolKind.ExtSubroutine:
                const extSig = `extsub ${symbol.detail} = ${symbol.name}(${symbol.parameters || ''})`;
                markdown.appendCodeblock(extSig, 'prog8');
                markdown.appendMarkdown('\n\n*External ROM/library routine*');
                break;

            case SymbolKind.Constant:
                markdown.appendCodeblock(`const ${symbol.type} ${symbol.name} = ${symbol.detail}`, 'prog8');
                markdown.appendMarkdown('\n\n*Constant*');
                break;

            case SymbolKind.Variable:
                let varDecl = `${symbol.type} ${symbol.name}`;
                if (symbol.detail) {
                    varDecl += ` ${symbol.detail}`;
                }
                markdown.appendCodeblock(varDecl, 'prog8');
                if (symbol.type?.startsWith('&')) {
                    markdown.appendMarkdown('\n\n*Memory-mapped variable*');
                } else {
                    markdown.appendMarkdown('\n\n*Variable*');
                }
                break;

            case SymbolKind.Parameter:
                markdown.appendCodeblock(`${symbol.type} ${symbol.name}`, 'prog8');
                markdown.appendMarkdown('\n\n*Parameter*');
                break;

            case SymbolKind.Label:
                markdown.appendCodeblock(`${symbol.name}:`, 'prog8');
                markdown.appendMarkdown('\n\n*Label*');
                break;

            case SymbolKind.Struct:
                markdown.appendCodeblock(`struct ${symbol.name} { }`, 'prog8');
                markdown.appendMarkdown('\n\n*Struct type*');
                break;

            case SymbolKind.Alias:
                markdown.appendCodeblock(`alias ${symbol.name} ${symbol.detail}`, 'prog8');
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
     * Get hover for built-in functions
     */
    private getBuiltinHover(word: string): vscode.Hover | undefined {
        const builtins: { [key: string]: { signature: string; description: string } } = {
            // Math functions
            'abs': { signature: 'abs(value) -> same type', description: 'Returns the absolute value of a number (integer or floating point)' },
            'min': { signature: 'min(a, b) -> same type', description: 'Returns the minimum of two values' },
            'max': { signature: 'max(a, b) -> same type', description: 'Returns the maximum of two values' },
            'minf': { signature: 'minf(a, b) -> float', description: 'Returns the minimum of two floating point values' },
            'maxf': { signature: 'maxf(a, b) -> float', description: 'Returns the maximum of two floating point values' },
            'clamp': { signature: 'clamp(value, min, max) -> same type', description: 'Restricts value to be within the specified minimum and maximum bounds' },
            'clampf': { signature: 'clampf(value, min, max) -> float', description: 'Restricts float value to be within the specified minimum and maximum bounds' },
            'sgn': { signature: 'sgn(value) -> byte', description: 'Returns the sign of a number: -1 for negative, 0 for zero, 1 for positive' },
            'sqrt': { signature: 'sqrt(value) -> ubyte', description: 'Returns the integer square root. For the reverse (squaring), just write x*x' },
            'divmod': { signature: 'divmod(dividend, divisor, quotient, remainder)', description: 'Computes both quotient and remainder of division in one operation' },
            
            // Byte/word construction and extraction
            'lsb': { signature: 'lsb(x) -> ubyte', description: 'Get the least significant (lower) byte of a word/long. Equivalent to x & 255' },
            'msb': { signature: 'msb(x) -> ubyte', description: 'Get the most significant (highest) byte of a word or long value' },
            'lsw': { signature: 'lsw(x) -> uword', description: 'Get the least significant (lower) word. Equivalent to x & 65535' },
            'msw': { signature: 'msw(x) -> uword', description: 'Get the most significant (higher) word of a long value' },
            'mkword': { signature: 'mkword(msb, lsb) -> uword', description: 'Efficiently create a word from two bytes. mkword($80, $22) = $8022. Note: args are MSB first, then LSB' },
            'mklong': { signature: 'mklong(msb, b2, b1, lsb) -> long', description: 'Efficiently create a long from four bytes. mklong($12, $34, $56, $78) = $12345678' },
            'mklong2': { signature: 'mklong2(msw, lsw) -> long', description: 'Efficiently create a long from two words. mklong2($1234, $abcd) = $1234abcd' },
            'setlsb': { signature: 'setlsb(x, value)', description: 'Sets the least significant byte of word variable x to a new value. Leaves MSB untouched' },
            'setmsb': { signature: 'setmsb(x, value)', description: 'Sets the most significant byte of word variable x to a new value. Leaves LSB untouched' },
            
            // Bit rotation
            'rol': { signature: 'rol(variable)', description: 'Rotate left through carry flag (9-bit rotation for bytes, 17-bit for words). Modifies in-place' },
            'ror': { signature: 'ror(variable)', description: 'Rotate right through carry flag (9-bit rotation for bytes, 17-bit for words). Modifies in-place' },
            'rol2': { signature: 'rol2(variable)', description: 'Rotate left as pure 8/16-bit rotation (ignores carry). Modifies in-place. Can use @($addr) syntax' },
            'ror2': { signature: 'ror2(variable)', description: 'Rotate right as pure 8/16-bit rotation (ignores carry). Modifies in-place. Can use @($addr) syntax' },
            
            // Memory functions
            'sizeof': { signature: 'sizeof(name) -> ubyte', description: 'Returns the size in bytes of an object, number, or datatype. For element count, use len()' },
            'len': { signature: 'len(array_or_string) -> ubyte', description: 'Returns the number of elements in an array, or characters in a string (excluding 0-byte). Determined at compile-time!' },
            'memory': { signature: 'memory(name, size, alignment) -> uword', description: 'Reserves a block of uninitialized memory. Name must be a string literal. Returns address. Same name+size returns same address' },
            'peek': { signature: 'peek(address) -> ubyte', description: 'Reads a byte from the given memory address. Same as @(address)' },
            'peekw': { signature: 'peekw(address) -> uword', description: 'Reads a word (little-endian) from memory. Requires consecutive LSB/MSB bytes (not split arrays)' },
            'peekl': { signature: 'peekl(address) -> long', description: 'Reads a signed long value (little-endian) from memory' },
            'peekf': { signature: 'peekf(address) -> float', description: 'Reads a float from memory (5 bytes on CBM machines)' },
            'poke': { signature: 'poke(address, value)', description: 'Writes a byte to memory. Same as @(address)=value' },
            'pokew': { signature: 'pokew(address, value)', description: 'Writes a word to memory in little-endian byte order' },
            'pokel': { signature: 'pokel(address, value)', description: 'Writes a signed long to memory in little-endian byte order' },
            'pokef': { signature: 'pokef(address, value)', description: 'Writes a float to memory (5 bytes on CBM machines)' },
            'pokemon': { signature: 'pokemon(address, value) -> ubyte', description: 'Like poke(), but also returns the previous value at the address' },
            
            // Array operations
            'any': { signature: 'any(array) -> bool', description: 'Returns true if any element in the array is non-zero' },
            'all': { signature: 'all(array) -> bool', description: 'Returns true if all elements in the array are non-zero' },
            'reverse': { signature: 'reverse(array)', description: 'Reverses the array in place' },
            'sort': { signature: 'sort(array)', description: 'Sorts the array in place (ascending order)' },
            
            // System/calling
            'call': { signature: 'call(address) -> uword', description: 'Calls a subroutine at address. Returns value in AY. Use cx16.r0 etc for args. Creates indirect JSR' },
            'callfar': { signature: 'callfar(bank, address, argumentword) -> uword', description: 'Calls routine in another bank. Loads arg into A+Y before call. Inefficient - use sparingly (cx16)' },
            'callfar2': { signature: 'callfar2(bank, address, argA, argX, argY, argCarry) -> uword', description: 'Like callfar but with individual A, X, Y register args and Carry bit (cx16)' },
            
            // Comparisons
            'cmp': { signature: 'cmp(a, b) -> byte', description: 'Compares two values, returns -1 (a<b), 0 (a==b), or 1 (a>b)' },
            
            // Random
            'rnd': { signature: 'rnd() -> ubyte', description: 'Returns a pseudo-random byte' },
            'rndw': { signature: 'rndw() -> uword', description: 'Returns a pseudo-random word' },
        };

        const info = builtins[word];
        if (info) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(info.signature, 'prog8');
            markdown.appendMarkdown(`\n\n${info.description}`);
            markdown.appendMarkdown('\n\n*Built-in function*');
            return new vscode.Hover(markdown);
        }

        return undefined;
    }

    /**
     * Get hover for keywords
     */
    private getKeywordHover(word: string): vscode.Hover | undefined {
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
            markdown.appendCodeblock(word, 'prog8');
            markdown.appendMarkdown(`\n\n${description}`);
            markdown.appendMarkdown('\n\n*Keyword*');
            return new vscode.Hover(markdown);
        }

        return undefined;
    }

    /**
     * Get hover for library subroutines (e.g., txt.print, sys.memset)
     */
    private getLibraryHover(qualifiedName: string): vscode.Hover | undefined {
        const sub = findSubroutine(qualifiedName);
        if (sub) {
            return this.createHoverForLibrarySubroutine(sub, qualifiedName);
        }
        return undefined;
    }

    /**
     * Get hover for library module names (e.g., buffers, textio, math)
     * Modules are what you %import - they contain one or more blocks
     */
    private getLibraryModuleHover(name: string): vscode.Hover | undefined {
        const mod = findModule(name);
        
        if (mod) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(`%import ${name}`, 'prog8');
            
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
    private getLibraryBlockHover(name: string): vscode.Hover | undefined {
        const blocks = getAllBlocks();
        const block = blocks.find(b => b.name === name);
        
        if (block) {
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(`${name} { }`, 'prog8');
            
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
     * Create hover for a library subroutine
     */
    private createHoverForLibrarySubroutine(sub: SubroutineInfo, qualifiedName: string): vscode.Hover {
        const markdown = new vscode.MarkdownString();
        
        if (sub.isAlias) {
            markdown.appendCodeblock(`${qualifiedName}  (alias for ${sub.isAlias})`, 'prog8');
            markdown.appendMarkdown(`\n\n*Library function alias*`);
        } else {
            // Format the signature nicely
            const params = sub.parameters.map(p => {
                let s = `${p.type} ${p.name}`;
                if (p.register) s += ` ${p.register}`;
                return s;
            }).join(', ');
            
            let sig = `${qualifiedName}(${params})`;
            
            if (sub.returns.length > 0) {
                const rets = sub.returns.map(r => {
                    let s = r.type;
                    if (r.register) s += ` ${r.register}`;
                    return s;
                }).join(', ');
                sig += ` -> ${rets}`;
            }
            
            markdown.appendCodeblock(sig, 'prog8');
            
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
     * Search for a symbol in other Prog8/ProgB files in the same directory
     */
    private async findSymbolInOtherFiles(
        currentDocument: vscode.TextDocument,
        word: string,
        qualifiedName: string | undefined
    ): Promise<UnifiedSymbol | undefined> {
        
        const currentDir = path.dirname(currentDocument.uri.fsPath);
        const searchPattern = new vscode.RelativePattern(currentDir, '*.{p8,pb}');
        const files = await vscode.workspace.findFiles(searchPattern);

        // Extract parts of a qualified name (e.g., "drawing.line_horizontal")
        const searchName = qualifiedName || word;
        const parts = searchName.split('.');
        const blockName = parts.length > 1 ? parts[0] : undefined;
        const symbolName = parts.length > 1 ? parts[parts.length - 1] : word;

        for (const fileUri of files) {
            // Skip the current file (already searched)
            if (fileUri.fsPath === currentDocument.uri.fsPath) {
                continue;
            }

            try {
                const doc = await vscode.workspace.openTextDocument(fileUri);
                const symbols = unifiedParser.parseDocument(doc);

                // If it's a qualified name like "drawing.line_horizontal", look for that full path
                if (blockName) {
                    const symbol = symbols.find(s => s.fullPath === searchName);
                    if (symbol) {
                        return symbol;
                    }

                    // Also try finding by just the symbol name within the expected block
                    const symbolInBlock = symbols.find(s => 
                        s.name === symbolName && s.parent === blockName
                    );
                    if (symbolInBlock) {
                        return symbolInBlock;
                    }
                }

                // For unqualified names, search for blocks or top-level symbols
                if (!blockName) {
                    // Check if it's a block name
                    const block = symbols.find(s => s.name === symbolName && s.kind === SymbolKind.Block);
                    if (block) {
                        return block;
                    }

                    // Check for top-level symbols
                    const topLevel = symbols.find(s => s.name === symbolName && !s.parent);
                    if (topLevel) {
                        return topLevel;
                    }
                }

            } catch (error) {
                console.warn(`Could not read file ${fileUri.fsPath}: ${error}`);
            }
        }

        return undefined;
    }
}
