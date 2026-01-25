import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';

/**
 * Provides "Go to Definition" for Prog8 files.
 * Searches the current file first, then other Prog8 files in the same directory.
 */
export class Prog8DefinitionProvider implements vscode.DefinitionProvider {

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Definition | vscode.LocationLink[] | undefined> {
        
        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        // Parse the document to get symbols
        const symbols = unifiedParser.parseDocument(document);
        
        // Get current scope for context
        const currentScope = unifiedParser.getScopeAtPosition(symbols, position);

        // Find the symbol definition in current file
        const symbol = unifiedParser.findSymbol(symbols, word, currentScope);
        
        if (symbol) {
            return new vscode.Location(symbol.uri, symbol.selectionRange);
        }

        // If not found locally, search other Prog8 files in the same directory
        // This handles cross-file references like "drawing.line_horizontal()"
        return await this.findInOtherFiles(document, word, token);
    }

    /**
     * Search for a symbol definition in other Prog8 files in the same directory
     */
    private async findInOtherFiles(
        currentDocument: vscode.TextDocument,
        word: string,
        token: vscode.CancellationToken
    ): Promise<vscode.Location | undefined> {
        
        const currentDir = path.dirname(currentDocument.uri.fsPath);
        const searchPattern = new vscode.RelativePattern(currentDir, '*.{p8,pb}');
        const files = await vscode.workspace.findFiles(searchPattern);

        // Extract the parts of a qualified name (e.g., "drawing.line_horizontal" -> ["drawing", "line_horizontal"])
        const parts = word.split('.');
        const blockName = parts.length > 1 ? parts[0] : undefined;
        const symbolName = parts.length > 1 ? parts[parts.length - 1] : word;

        for (const fileUri of files) {
            if (token.isCancellationRequested) {
                return undefined;
            }

            // Skip the current file (already searched)
            if (fileUri.fsPath === currentDocument.uri.fsPath) {
                continue;
            }

            try {
                const doc = await vscode.workspace.openTextDocument(fileUri);
                const symbols = unifiedParser.parseDocument(doc);

                // If it's a qualified name like "drawing.line_horizontal", look for that full path
                if (blockName) {
                    const fullPath = word;
                    const symbol = symbols.find(s => s.fullPath === fullPath);
                    if (symbol) {
                        return new vscode.Location(symbol.uri, symbol.selectionRange);
                    }
                }

                // Also try finding by just the symbol name within the expected block
                if (blockName) {
                    const symbol = symbols.find(s => 
                        s.name === symbolName && s.parent === blockName
                    );
                    if (symbol) {
                        return new vscode.Location(symbol.uri, symbol.selectionRange);
                    }
                }

                // For unqualified names, search top-level symbols
                if (!blockName) {
                    const symbol = symbols.find(s => s.name === symbolName && !s.parent);
                    if (symbol) {
                        return new vscode.Location(symbol.uri, symbol.selectionRange);
                    }
                }

            } catch (error) {
                console.warn(`Could not read file ${fileUri.fsPath}: ${error}`);
            }
        }

        return undefined;
    }
}
