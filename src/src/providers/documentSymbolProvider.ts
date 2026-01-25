import * as vscode from 'vscode';

/**
 * Provides document symbols (outline view) for Prog8 files.
 * 
 * Prog8 structure:
 * - Blocks (like namespaces/modules)
 * - Subroutines (sub, asmsub, extsub)
 * - Variables (const, regular vars)
 * - Labels
 * - Structs
 */
export class Prog8DocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        
        const symbols: vscode.DocumentSymbol[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        // Track current block for nesting symbols
        let currentBlock: vscode.DocumentSymbol | null = null;
        let braceDepth = 0;
        let blockStartLine = 0;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            if (token.isCancellationRequested) {
                return symbols;
            }

            const line = lines[lineIndex];
            const trimmedLine = line.trim();

            // Skip comments and empty lines
            if (trimmedLine.startsWith(';') || trimmedLine.startsWith('/*') || trimmedLine === '') {
                continue;
            }

            // Count braces for depth tracking
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;

            // Check for block definition: identifier [address] {
            const blockMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)\s*(\$[0-9a-fA-F]+)?\s*\{?\s*$/);
            if (blockMatch && braceDepth === 0 && !this.isKeyword(blockMatch[1])) {
                const blockName = blockMatch[1];
                const address = blockMatch[2] || '';
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const selectionRange = new vscode.Range(
                    lineIndex, 
                    line.indexOf(blockName), 
                    lineIndex, 
                    line.indexOf(blockName) + blockName.length
                );

                currentBlock = new vscode.DocumentSymbol(
                    address ? `${blockName} ${address}` : blockName,
                    '',
                    vscode.SymbolKind.Module,
                    range,
                    selectionRange
                );
                symbols.push(currentBlock);
                blockStartLine = lineIndex;
            }

            // Check for struct definition
            const structMatch = trimmedLine.match(/^struct\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/);
            if (structMatch) {
                const structName = structMatch[1];
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const selectionRange = new vscode.Range(
                    lineIndex,
                    line.indexOf(structName),
                    lineIndex,
                    line.indexOf(structName) + structName.length
                );

                const structSymbol = new vscode.DocumentSymbol(
                    structName,
                    'struct',
                    vscode.SymbolKind.Struct,
                    range,
                    selectionRange
                );

                if (currentBlock) {
                    currentBlock.children.push(structSymbol);
                } else {
                    symbols.push(structSymbol);
                }
            }

            // Check for subroutine definitions: sub, asmsub, extsub
            const subMatch = trimmedLine.match(/^(inline\s+)?(sub|asmsub)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(/);
            if (subMatch) {
                const subName = subMatch[3];
                const subKind = subMatch[2];
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const selectionRange = new vscode.Range(
                    lineIndex,
                    line.indexOf(subName),
                    lineIndex,
                    line.indexOf(subName) + subName.length
                );

                const subSymbol = new vscode.DocumentSymbol(
                    subName,
                    subKind,
                    vscode.SymbolKind.Function,
                    range,
                    selectionRange
                );

                if (currentBlock) {
                    currentBlock.children.push(subSymbol);
                } else {
                    symbols.push(subSymbol);
                }
            }

            // Check for extsub (external subroutine)
            const extsubMatch = trimmedLine.match(/^extsub\s+(\$[0-9a-fA-F]+)\s*=\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(/);
            if (extsubMatch) {
                const address = extsubMatch[1];
                const subName = extsubMatch[2];
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const selectionRange = new vscode.Range(
                    lineIndex,
                    line.indexOf(subName),
                    lineIndex,
                    line.indexOf(subName) + subName.length
                );

                const subSymbol = new vscode.DocumentSymbol(
                    `${subName} @ ${address}`,
                    'extsub',
                    vscode.SymbolKind.Function,
                    range,
                    selectionRange
                );

                if (currentBlock) {
                    currentBlock.children.push(subSymbol);
                } else {
                    symbols.push(subSymbol);
                }
            }

            // Check for const declarations
            const constMatch = trimmedLine.match(/^const\s+(ubyte|byte|uword|word|long|ulong|float|bool|str)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/);
            if (constMatch) {
                const constType = constMatch[1];
                const constName = constMatch[2];
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const selectionRange = new vscode.Range(
                    lineIndex,
                    line.indexOf(constName),
                    lineIndex,
                    line.indexOf(constName) + constName.length
                );

                const constSymbol = new vscode.DocumentSymbol(
                    constName,
                    `const ${constType}`,
                    vscode.SymbolKind.Constant,
                    range,
                    selectionRange
                );

                if (currentBlock) {
                    currentBlock.children.push(constSymbol);
                } else {
                    symbols.push(constSymbol);
                }
            }

            // Check for labels (identifier followed by colon at start of line, not a case in when)
            const labelMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*):\s*$/);
            if (labelMatch) {
                const labelName = labelMatch[1];
                const range = new vscode.Range(lineIndex, 0, lineIndex, line.length);
                const selectionRange = new vscode.Range(
                    lineIndex,
                    line.indexOf(labelName),
                    lineIndex,
                    line.indexOf(labelName) + labelName.length
                );

                const labelSymbol = new vscode.DocumentSymbol(
                    labelName,
                    'label',
                    vscode.SymbolKind.Key,
                    range,
                    selectionRange
                );

                if (currentBlock) {
                    currentBlock.children.push(labelSymbol);
                } else {
                    symbols.push(labelSymbol);
                }
            }

            // Update brace depth
            braceDepth += openBraces - closeBraces;

            // Update block range when it closes
            if (currentBlock && braceDepth === 0 && closeBraces > 0) {
                // Update the block's range to include all its content
                currentBlock.range = new vscode.Range(
                    currentBlock.range.start,
                    new vscode.Position(lineIndex, line.length)
                );
                currentBlock = null;
            }
        }

        return symbols;
    }

    /**
     * Check if an identifier is a Prog8 keyword (not a block name)
     */
    private isKeyword(word: string): boolean {
        const keywords = [
            'if', 'else', 'when', 'for', 'while', 'do', 'until', 'repeat',
            'sub', 'asmsub', 'extsub', 'inline', 'return', 'break', 'continue',
            'goto', 'defer', 'struct', 'const', 'alias', 'on', 'void',
            'ubyte', 'byte', 'uword', 'word', 'long', 'ulong', 'float', 'bool', 'str',
            'true', 'false', 'not', 'and', 'or', 'xor', 'in', 'to', 'downto', 'step'
        ];
        return keywords.includes(word);
    }
}
