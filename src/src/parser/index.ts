import * as vscode from 'vscode';
import { prog8Parser, Prog8Symbol, SymbolKind as Prog8SymbolKind } from './prog8Parser';
import { progbParser, ProgBSymbol, SymbolKind as ProgBSymbolKind } from './progbParser';

/**
 * Re-export the common types
 */
export { SymbolKind } from './prog8Parser';

/**
 * Unified symbol type that works for both Prog8 and ProgB
 */
export type UnifiedSymbol = Prog8Symbol | ProgBSymbol;

/**
 * Unified parser that delegates to the appropriate parser based on document language.
 * This provides a consistent interface for both Prog8 (.p8) and ProgB (.pb) files.
 */
export class UnifiedParser {
    
    /**
     * Parse a document and return all symbols.
     * Automatically detects the language and uses the appropriate parser.
     */
    parseDocument(document: vscode.TextDocument): UnifiedSymbol[] {
        if (document.languageId === 'progb' || document.fileName.endsWith('.pb')) {
            return progbParser.parseDocument(document);
        }
        return prog8Parser.parseDocument(document);
    }

    /**
     * Find the word at a given position in a document
     */
    getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
        if (document.languageId === 'progb' || document.fileName.endsWith('.pb')) {
            return progbParser.getWordAtPosition(document, position);
        }
        return prog8Parser.getWordAtPosition(document, position);
    }

    /**
     * Find a symbol by name, considering scope
     */
    findSymbol(symbols: UnifiedSymbol[], name: string, currentScope?: string): UnifiedSymbol | undefined {
        // Both parsers have the same findSymbol implementation, so we can use either
        return prog8Parser.findSymbol(symbols as Prog8Symbol[], name, currentScope);
    }

    /**
     * Get the scope at a given position
     */
    getScopeAtPosition(symbols: UnifiedSymbol[], position: vscode.Position): string | undefined {
        // Both parsers have the same getScopeAtPosition implementation
        return prog8Parser.getScopeAtPosition(symbols as Prog8Symbol[], position);
    }

    /**
     * Check if a document is a ProgB file
     */
    isProgB(document: vscode.TextDocument): boolean {
        return document.languageId === 'progb' || document.fileName.endsWith('.pb');
    }

    /**
     * Get the appropriate file extensions for searching related files
     */
    getSearchExtensions(): string {
        return '*.{p8,pb}';
    }
}

// Singleton instance
export const unifiedParser = new UnifiedParser();

// Also re-export the individual parsers for direct access if needed
export { prog8Parser } from './prog8Parser';
export { progbParser } from './progbParser';

// Re-export import resolver utilities
export { 
    parseImports, 
    parseImportedFileSymbols, 
    isLibraryModule, 
    resolveLocalImport,
    findSymbolInImports,
    getBlocksFromImports,
    getSrcDirsForDocument,
    type ImportInfo,
    type ImportedFileSymbols
} from './importResolver';

// Re-export unified symbol aggregator
export {
    getAllAccessibleSymbols,
    isLibrarySymbol,
    findSymbolInAccessible,
    LIBRARY_SYMBOL_URI,
    type AccessibleSymbols
} from './symbolAggregator';
