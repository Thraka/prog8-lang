import * as vscode from 'vscode';
import { prog8Parser, Prog8Symbol, SymbolKind } from '../parser/prog8Parser';

/**
 * Provides "Go to Definition" for Prog8 files.
 */
export class Prog8DefinitionProvider implements vscode.DefinitionProvider {

    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        
        const word = prog8Parser.getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        // Parse the document to get symbols
        const symbols = prog8Parser.parseDocument(document);
        
        // Get current scope for context
        const currentScope = prog8Parser.getScopeAtPosition(symbols, position);

        // Find the symbol definition
        const symbol = prog8Parser.findSymbol(symbols, word, currentScope);
        
        if (symbol) {
            return new vscode.Location(symbol.uri, symbol.selectionRange);
        }

        // If not found locally, try to find in imported modules
        // TODO: Multi-file support - parse %import directives and search other files

        return undefined;
    }
}
