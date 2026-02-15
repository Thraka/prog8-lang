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
     * Resolve a struct member access like `variable.member` where `variable` is a typed variable.
     * Returns the struct field symbol if found, or undefined if not a struct member access.
     * 
     * @param qualifiedName The qualified name (e.g., "head.name")
     * @param symbols All symbols in scope
     * @param currentScope The current scope for resolving the variable
     * @returns The struct field symbol, or undefined
     */
    resolveStructMemberAccess(
        qualifiedName: string,
        symbols: UnifiedSymbol[],
        currentScope?: string
    ): UnifiedSymbol | undefined {
        if (!qualifiedName.includes('.')) {
            return undefined;
        }

        const parts = qualifiedName.split('.');
        if (parts.length !== 2) {
            // For now, only handle single-level member access
            return undefined;
        }

        const [varName, memberName] = parts;

        // Find the variable
        const variable = this.findSymbol(symbols, varName, currentScope);
        if (!variable || !variable.type) {
            return undefined;
        }

        // Extract the base type name by stripping pointer prefixes (^, ^^)
        const baseTypeName = variable.type.replace(/^\^+/, '');

        // Find the struct/type definition
        const structSymbol = symbols.find(s => 
            (s.kind === Prog8SymbolKind.Struct || s.kind === Prog8SymbolKind.Alias) && 
            s.name === baseTypeName
        );

        if (!structSymbol) {
            return undefined;
        }

        // Find the field within the struct
        const fieldFullPath = `${structSymbol.fullPath}.${memberName}`;
        const field = symbols.find(s => 
            s.kind === Prog8SymbolKind.StructField && 
            s.fullPath === fieldFullPath
        );

        return field;
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
    resolveStructMemberInAccessible,
    LIBRARY_SYMBOL_URI,
    type AccessibleSymbols
} from './symbolAggregator';
