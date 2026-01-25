import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Provides workspace-wide symbol search for Prog8 files.
 * 
 * This allows users to quickly find any symbol using Ctrl+T (Go to Symbol in Workspace).
 * 
 * Note: Prog8 only compiles files in the same directory as the main file,
 * so we only search the directory of the currently active Prog8 file.
 * 
 * Symbols indexed:
 * - Blocks (modules)
 * - Subroutines (sub, asmsub, extsub)
 * - Structs
 * - Constants
 * - Labels
 */
export class Prog8WorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {

    async provideWorkspaceSymbols(
        query: string,
        token: vscode.CancellationToken
    ): Promise<vscode.SymbolInformation[]> {
        const symbols: vscode.SymbolInformation[] = [];
        
        // Get the currently active editor's directory
        // Prog8 only imports from the same directory, so we scope the search accordingly
        const activeEditor = vscode.window.activeTextEditor;
        let searchPattern: vscode.GlobPattern;
        
        if (activeEditor && (activeEditor.document.languageId === 'prog8' || activeEditor.document.languageId === 'progb')) {
            // Search only in the same directory as the active Prog8 file
            const activeDir = path.dirname(activeEditor.document.uri.fsPath);
            const relativePath = vscode.workspace.asRelativePath(activeDir, false);
            searchPattern = new vscode.RelativePattern(activeDir, '*.{p8,pb}');
        } else {
            // Fallback: search entire workspace if no Prog8 file is active
            searchPattern = '**/*.{p8,pb}';
        }
        
        const files = await vscode.workspace.findFiles(searchPattern, '**/node_modules/**');
        
        for (const fileUri of files) {
            if (token.isCancellationRequested) {
                return symbols;
            }
            
            try {
                const document = await vscode.workspace.openTextDocument(fileUri);
                const fileSymbols = this.extractSymbols(document, query);
                symbols.push(...fileSymbols);
            } catch (error) {
                // Skip files that can't be opened
                console.warn(`Could not read file ${fileUri.fsPath}: ${error}`);
            }
        }
        
        return symbols;
    }

    /**
     * Extract symbols from a document that match the query.
     * Uses fuzzy matching - query characters must appear in order in the symbol name.
     */
    private extractSymbols(document: vscode.TextDocument, query: string): vscode.SymbolInformation[] {
        const symbols: vscode.SymbolInformation[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        const lowerQuery = query.toLowerCase();

        let currentBlockName: string | null = null;
        let braceDepth = 0;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const trimmedLine = line.trim();

            // Skip comments and empty lines
            if (trimmedLine.startsWith(';') || trimmedLine.startsWith('/*') || trimmedLine === '') {
                continue;
            }

            // Count braces for depth tracking
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;

            // Check for block definition
            const blockMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*)\s*(\$[0-9a-fA-F]+)?\s*\{?\s*$/);
            if (blockMatch && braceDepth === 0 && !this.isKeyword(blockMatch[1])) {
                const blockName = blockMatch[1];
                currentBlockName = blockName;
                
                if (this.matchesQuery(blockName, lowerQuery)) {
                    symbols.push(new vscode.SymbolInformation(
                        blockName,
                        vscode.SymbolKind.Module,
                        '',
                        new vscode.Location(
                            document.uri,
                            new vscode.Position(lineIndex, line.indexOf(blockName))
                        )
                    ));
                }
            }

            // Check for struct definition
            const structMatch = trimmedLine.match(/^struct\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/);
            if (structMatch) {
                const structName = structMatch[1];
                const containerName = currentBlockName || '';
                const fullName = containerName ? `${containerName}.${structName}` : structName;
                
                if (this.matchesQuery(structName, lowerQuery) || this.matchesQuery(fullName, lowerQuery)) {
                    symbols.push(new vscode.SymbolInformation(
                        structName,
                        vscode.SymbolKind.Struct,
                        containerName,
                        new vscode.Location(
                            document.uri,
                            new vscode.Position(lineIndex, line.indexOf(structName))
                        )
                    ));
                }
            }

            // Check for subroutine definitions: sub, asmsub
            const subMatch = trimmedLine.match(/^(inline\s+)?(sub|asmsub)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(/);
            if (subMatch) {
                const subName = subMatch[3];
                const containerName = currentBlockName || '';
                const fullName = containerName ? `${containerName}.${subName}` : subName;
                
                if (this.matchesQuery(subName, lowerQuery) || this.matchesQuery(fullName, lowerQuery)) {
                    symbols.push(new vscode.SymbolInformation(
                        subName,
                        vscode.SymbolKind.Function,
                        containerName,
                        new vscode.Location(
                            document.uri,
                            new vscode.Position(lineIndex, line.indexOf(subName))
                        )
                    ));
                }
            }

            // Check for extsub (external subroutine)
            const extsubMatch = trimmedLine.match(/^extsub\s+(\$[0-9a-fA-F]+)\s*=\s*([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)\s*\(/);
            if (extsubMatch) {
                const subName = extsubMatch[2];
                const containerName = currentBlockName || '';
                const fullName = containerName ? `${containerName}.${subName}` : subName;
                
                if (this.matchesQuery(subName, lowerQuery) || this.matchesQuery(fullName, lowerQuery)) {
                    symbols.push(new vscode.SymbolInformation(
                        subName,
                        vscode.SymbolKind.Function,
                        containerName,
                        new vscode.Location(
                            document.uri,
                            new vscode.Position(lineIndex, line.indexOf(subName))
                        )
                    ));
                }
            }

            // Check for const declarations
            const constMatch = trimmedLine.match(/^const\s+(ubyte|byte|uword|word|long|ulong|float|bool|str)\s+([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*)/);
            if (constMatch) {
                const constName = constMatch[2];
                const containerName = currentBlockName || '';
                const fullName = containerName ? `${containerName}.${constName}` : constName;
                
                if (this.matchesQuery(constName, lowerQuery) || this.matchesQuery(fullName, lowerQuery)) {
                    symbols.push(new vscode.SymbolInformation(
                        constName,
                        vscode.SymbolKind.Constant,
                        containerName,
                        new vscode.Location(
                            document.uri,
                            new vscode.Position(lineIndex, line.indexOf(constName))
                        )
                    ));
                }
            }

            // Check for labels
            const labelMatch = trimmedLine.match(/^([a-zA-Z_\u00C0-\u024F][\w\u00C0-\u024F]*):\s*$/);
            if (labelMatch) {
                const labelName = labelMatch[1];
                const containerName = currentBlockName || '';
                const fullName = containerName ? `${containerName}.${labelName}` : labelName;
                
                if (this.matchesQuery(labelName, lowerQuery) || this.matchesQuery(fullName, lowerQuery)) {
                    symbols.push(new vscode.SymbolInformation(
                        labelName,
                        vscode.SymbolKind.Key,
                        containerName,
                        new vscode.Location(
                            document.uri,
                            new vscode.Position(lineIndex, line.indexOf(labelName))
                        )
                    ));
                }
            }

            // Update brace depth
            braceDepth += openBraces - closeBraces;

            // Reset block when it closes
            if (braceDepth === 0 && closeBraces > 0) {
                currentBlockName = null;
            }
        }

        return symbols;
    }

    /**
     * Check if a symbol name matches the query using fuzzy matching.
     * Query characters must appear in order in the symbol name.
     * Empty query matches everything.
     */
    private matchesQuery(symbolName: string, query: string): boolean {
        if (query === '') {
            return true;
        }
        
        const lowerName = symbolName.toLowerCase();
        let queryIndex = 0;
        
        for (let i = 0; i < lowerName.length && queryIndex < query.length; i++) {
            if (lowerName[i] === query[queryIndex]) {
                queryIndex++;
            }
        }
        
        return queryIndex === query.length;
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
