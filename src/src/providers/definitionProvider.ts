import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { getAllAccessibleSymbols, isLibrarySymbol } from '../parser/symbolAggregator';

/**
 * Provides "Go to Definition" for Prog8 files.
 * Searches the current file first, then imported files, then library symbols,
 * then other Prog8 files in the same directory.
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

        // Get all accessible symbols via the unified aggregator
        const { localSymbols, importedFileSymbols, librarySymbols } = await getAllAccessibleSymbols(document);
        
        // Get current scope for context
        const currentScope = unifiedParser.getScopeAtPosition(localSymbols, position);

        // 1. Find the symbol definition in current file
        const localSymbol = unifiedParser.findSymbol(localSymbols, word, currentScope);
        if (localSymbol) {
            return new vscode.Location(localSymbol.uri, localSymbol.selectionRange);
        }

        // 2. Search in imported file symbols
        for (const imported of importedFileSymbols) {
            // Try qualified name match first
            if (word.includes('.')) {
                const byPath = imported.symbols.find(s => s.fullPath === word);
                if (byPath) {
                    return new vscode.Location(byPath.uri, byPath.selectionRange);
                }
            }
            // Try scope-aware resolution
            const found = unifiedParser.findSymbol(imported.symbols, word, currentScope);
            if (found) {
                return new vscode.Location(found.uri, found.selectionRange);
            }
        }

        // 3. Library symbols have no real file location — skip (hover handles them)
        // But we check them to avoid a potentially expensive directory scan
        const libSymbol = unifiedParser.findSymbol(librarySymbols, word, currentScope);
        if (libSymbol) {
            // Library symbol — no definition location to jump to
            return undefined;
        }

        // 4. If not found anywhere, search other Prog8 files in the same directory
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
