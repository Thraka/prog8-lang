import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';

/**
 * Provides workspace-wide symbol search for Prog8 and ProgB files.
 * 
 * This allows users to quickly find any symbol using Ctrl+T (Go to Symbol in Workspace).
 * 
 * Note: Prog8/ProgB only compiles files in the same directory as the main file,
 * so we only search the directory of the currently active file.
 * 
 * Symbols indexed:
 * - Blocks/Modules
 * - Subroutines (sub/function, asmsub, extsub)
 * - Structs/Types
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
        // Prog8/ProgB only imports from the same directory, so we scope the search accordingly
        const activeEditor = vscode.window.activeTextEditor;
        let searchPattern: vscode.GlobPattern;
        
        if (activeEditor && (activeEditor.document.languageId === 'prog8' || activeEditor.document.languageId === 'progb')) {
            // Search only in the same directory as the active file
            const activeDir = path.dirname(activeEditor.document.uri.fsPath);
            searchPattern = new vscode.RelativePattern(activeDir, '*.{p8,pb}');
        } else {
            // Fallback: search entire workspace if no Prog8/ProgB file is active
            searchPattern = '**/*.{p8,pb}';
        }
        
        const files = await vscode.workspace.findFiles(searchPattern, '**/node_modules/**');
        
        const lowerQuery = query.toLowerCase();
        
        for (const fileUri of files) {
            if (token.isCancellationRequested) {
                return symbols;
            }
            
            try {
                const document = await vscode.workspace.openTextDocument(fileUri);
                const parsedSymbols = unifiedParser.parseDocument(document);
                const matchingSymbols = this.filterAndConvertSymbols(parsedSymbols, lowerQuery, document.uri);
                symbols.push(...matchingSymbols);
            } catch (error) {
                // Skip files that can't be opened
                console.warn(`Could not read file ${fileUri.fsPath}: ${error}`);
            }
        }
        
        return symbols;
    }

    /**
     * Filter symbols by query and convert to SymbolInformation
     */
    private filterAndConvertSymbols(
        symbols: UnifiedSymbol[], 
        lowerQuery: string,
        uri: vscode.Uri
    ): vscode.SymbolInformation[] {
        const result: vscode.SymbolInformation[] = [];
        
        for (const symbol of symbols) {
            // Skip parameters for workspace symbol search
            if (symbol.kind === SymbolKind.Parameter) {
                continue;
            }
            
            // Check if it matches the query
            if (!this.matchesQuery(symbol.name, lowerQuery) && 
                !this.matchesQuery(symbol.fullPath, lowerQuery)) {
                continue;
            }
            
            // Convert to vscode.SymbolKind
            let vscodeKind: vscode.SymbolKind;
            switch (symbol.kind) {
                case SymbolKind.Block:
                    vscodeKind = vscode.SymbolKind.Module;
                    break;
                case SymbolKind.Subroutine:
                case SymbolKind.AsmSubroutine:
                case SymbolKind.ExtSubroutine:
                    vscodeKind = vscode.SymbolKind.Function;
                    break;
                case SymbolKind.Struct:
                    vscodeKind = vscode.SymbolKind.Struct;
                    break;
                case SymbolKind.StructField:
                    vscodeKind = vscode.SymbolKind.Field;
                    break;
                case SymbolKind.Constant:
                    vscodeKind = vscode.SymbolKind.Constant;
                    break;
                case SymbolKind.Variable:
                    vscodeKind = vscode.SymbolKind.Variable;
                    break;
                case SymbolKind.Label:
                    vscodeKind = vscode.SymbolKind.Key;
                    break;
                case SymbolKind.Alias:
                    vscodeKind = vscode.SymbolKind.Variable;
                    break;
                default:
                    vscodeKind = vscode.SymbolKind.Variable;
            }
            
            result.push(new vscode.SymbolInformation(
                symbol.name,
                vscodeKind,
                symbol.parent || '',
                new vscode.Location(uri, symbol.selectionRange.start)
            ));
        }
        
        return result;
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
}
