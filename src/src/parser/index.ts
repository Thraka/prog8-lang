/**
 * Parser barrel file.
 * Re-exports the unified parser and all related types/utilities.
 */
export { Parser, parser as unifiedParser, ParsedSymbol, SymbolKind } from './parser';
export type { ParsedSymbol as UnifiedSymbol } from './parser';

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
