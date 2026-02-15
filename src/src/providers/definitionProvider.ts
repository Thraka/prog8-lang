import * as vscode from 'vscode';
import { unifiedParser } from '../parser';
import { 
    getAllAccessibleSymbols, 
    findSymbolInAccessible, 
    resolveStructMemberInAccessible,
    isLibrarySymbol 
} from '../parser/symbolAggregator';

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

        const accessible = await getAllAccessibleSymbols(document);
        const currentScope = unifiedParser.getScopeAtPosition(accessible.localSymbols, position);

        // 1. Find the symbol via unified lookup (local → imported → library)
        const symbol = findSymbolInAccessible(word, accessible, currentScope);
        if (symbol && !isLibrarySymbol(symbol)) {
            return new vscode.Location(symbol.uri, symbol.selectionRange);
        }

        // 2. Try struct member access resolution (e.g., variable.field)
        const structMember = resolveStructMemberInAccessible(word, accessible, currentScope);
        if (structMember) {
            return new vscode.Location(structMember.uri, structMember.selectionRange);
        }

        // Library symbols have no navigable location (hover handles them)
        return undefined;
    }
}
