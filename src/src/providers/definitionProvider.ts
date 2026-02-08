import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { getAllAccessibleSymbols, isLibrarySymbol } from '../parser/symbolAggregator';

/**
 * Provides "Go to Definition" for Prog8 files.
 * Searches the current file first, then imported files, then library symbols.
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
        const libSymbol = unifiedParser.findSymbol(librarySymbols, word, currentScope);
        if (libSymbol) {
            return undefined;
        }

        return undefined;
    }
}
