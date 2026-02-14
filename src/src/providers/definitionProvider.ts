import * as vscode from 'vscode';
import { unifiedParser } from '../parser';
import { getAllAccessibleSymbols } from '../parser/symbolAggregator';

/**
 * Provides "Go to Definition" for Prog8 files.
 * Searches the current file first, then imported files.
 * Library symbols have no navigable location (hover handles them).
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
        const { localSymbols, importedFileSymbols } = await getAllAccessibleSymbols(document);
        
        // Get current scope for context
        const currentScope = unifiedParser.getScopeAtPosition(localSymbols, position);

        // 1. Find the symbol definition in current file
        const localSymbol = unifiedParser.findSymbol(localSymbols, word, currentScope);
        if (localSymbol) {
            return new vscode.Location(localSymbol.uri, localSymbol.selectionRange);
        }

        // 2. Check for struct member access (e.g., variable.member where variable has a struct type)
        if (word.includes('.')) {
            // Try local symbols first
            let structMember = unifiedParser.resolveStructMemberAccess(word, localSymbols, currentScope);
            
            // Then try imported file symbols
            if (!structMember) {
                for (const imported of importedFileSymbols) {
                    structMember = unifiedParser.resolveStructMemberAccess(word, imported.symbols, currentScope);
                    if (structMember) break;
                }
            }
            
            if (structMember) {
                return new vscode.Location(structMember.uri, structMember.selectionRange);
            }
        }

        // 3. Search in imported file symbols
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

        // 4. Library symbols have no real file location — skip (hover handles them)
        return undefined;
    }
}
