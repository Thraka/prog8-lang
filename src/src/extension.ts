import * as vscode from 'vscode';
import { Prog8DocumentSymbolProvider } from './providers/documentSymbolProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Prog8 Language Support is now active');

    // Register Document Symbol Provider for outline view
    const prog8SymbolProvider = new Prog8DocumentSymbolProvider();
    
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            { language: 'prog8', scheme: 'file' },
            prog8SymbolProvider
        )
    );

    // Also register for progb files
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            { language: 'progb', scheme: 'file' },
            prog8SymbolProvider
        )
    );
}

export function deactivate() {
    console.log('Prog8 Language Support deactivated');
}
