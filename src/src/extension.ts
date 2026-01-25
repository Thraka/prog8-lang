import * as vscode from 'vscode';
import { Prog8DocumentSymbolProvider } from './providers/documentSymbolProvider';
import { Prog8DefinitionProvider } from './providers/definitionProvider';
import { Prog8HoverProvider } from './providers/hoverProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Prog8 Language Support is now active');

    // Document selectors for both prog8 and progb
    const prog8Selector: vscode.DocumentSelector = [
        { language: 'prog8', scheme: 'file' },
        { language: 'progb', scheme: 'file' }
    ];

    // Register Document Symbol Provider for outline view
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            prog8Selector,
            new Prog8DocumentSymbolProvider()
        )
    );

    // Register Definition Provider for "Go to Definition"
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            prog8Selector,
            new Prog8DefinitionProvider()
        )
    );

    // Register Hover Provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            prog8Selector,
            new Prog8HoverProvider()
        )
    );
}

export function deactivate() {
    console.log('Prog8 Language Support deactivated');
}
