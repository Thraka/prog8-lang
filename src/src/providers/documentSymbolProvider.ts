import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';

/**
 * Provides document symbols (outline view) for Prog8 and ProgB files.
 * 
 * Structure:
 * - Blocks/Modules (like namespaces)
 * - Subroutines (sub/function, asmsub, extsub)
 * - Variables (const, regular vars)
 * - Labels
 * - Structs/Types
 */
export class Prog8DocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        
        if (token.isCancellationRequested) {
            return [];
        }

        // Parse the document using the unified parser
        const parsedSymbols = unifiedParser.parseDocument(document);

        // Build a tree of DocumentSymbols from the parsed symbols
        return this.buildSymbolTree(parsedSymbols);
    }

    /**
     * Build a hierarchical DocumentSymbol tree from the parsed symbols
     */
    private buildSymbolTree(symbols: UnifiedSymbol[]): vscode.DocumentSymbol[] {
        const result: vscode.DocumentSymbol[] = [];
        const blockMap = new Map<string, vscode.DocumentSymbol>();

        // First pass: create all top-level blocks/modules
        for (const symbol of symbols) {
            if (symbol.kind === SymbolKind.Block && !symbol.parent) {
                const docSymbol = this.createDocumentSymbol(symbol);
                result.push(docSymbol);
                blockMap.set(symbol.fullPath, docSymbol);
            }
        }

        // Second pass: add all children to their parents
        for (const symbol of symbols) {
            if (symbol.parent) {
                const parentDocSymbol = blockMap.get(symbol.parent);
                if (parentDocSymbol) {
                    const docSymbol = this.createDocumentSymbol(symbol);
                    parentDocSymbol.children.push(docSymbol);
                    
                    // If this is a block/subroutine, track it so its children can find it
                    if (symbol.kind === SymbolKind.Block || 
                        symbol.kind === SymbolKind.Subroutine || 
                        symbol.kind === SymbolKind.AsmSubroutine ||
                        symbol.kind === SymbolKind.Struct) {
                        blockMap.set(symbol.fullPath, docSymbol);
                    }
                }
            } else if (symbol.kind !== SymbolKind.Block) {
                // Top-level non-block symbols (shouldn't happen often in well-formed code)
                result.push(this.createDocumentSymbol(symbol));
            }
        }

        return result;
    }

    /**
     * Create a DocumentSymbol from a parsed symbol
     */
    private createDocumentSymbol(symbol: UnifiedSymbol): vscode.DocumentSymbol {
        let symbolKind: vscode.SymbolKind;
        let detail = '';

        switch (symbol.kind) {
            case SymbolKind.Block:
                symbolKind = vscode.SymbolKind.Module;
                if (symbol.detail) {
                    detail = symbol.detail; // address
                }
                break;
            case SymbolKind.Subroutine:
                symbolKind = vscode.SymbolKind.Function;
                detail = symbol.returnType ? `-> ${symbol.returnType}` : 'sub';
                if (symbol.detail === 'inline') {
                    detail = 'inline ' + detail;
                }
                break;
            case SymbolKind.AsmSubroutine:
                symbolKind = vscode.SymbolKind.Function;
                detail = 'asmsub';
                break;
            case SymbolKind.ExtSubroutine:
                symbolKind = vscode.SymbolKind.Function;
                detail = `extsub @ ${symbol.detail}`;
                break;
            case SymbolKind.Constant:
                symbolKind = vscode.SymbolKind.Constant;
                detail = `const ${symbol.type}`;
                break;
            case SymbolKind.Variable:
                symbolKind = vscode.SymbolKind.Variable;
                detail = symbol.type || '';
                break;
            case SymbolKind.Label:
                symbolKind = vscode.SymbolKind.Key;
                detail = 'label';
                break;
            case SymbolKind.Struct:
                symbolKind = vscode.SymbolKind.Struct;
                detail = 'struct';
                break;
            case SymbolKind.StructField:
                symbolKind = vscode.SymbolKind.Field;
                detail = symbol.type || '';
                break;
            case SymbolKind.Parameter:
                symbolKind = vscode.SymbolKind.Variable;
                detail = symbol.type || 'param';
                break;
            case SymbolKind.Alias:
                symbolKind = vscode.SymbolKind.Variable;
                detail = symbol.detail || 'alias';
                break;
            default:
                symbolKind = vscode.SymbolKind.Variable;
        }

        const docSymbol = new vscode.DocumentSymbol(
            symbol.name,
            detail,
            symbolKind,
            symbol.range,
            symbol.selectionRange
        );

        return docSymbol;
    }
}
