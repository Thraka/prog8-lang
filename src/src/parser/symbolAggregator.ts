import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from './index';
import { parseImports, parseImportedFileSymbols, ImportInfo, ImportedFileSymbols, getSrcDirsForDocument } from './importResolver';
import { findModule } from '../data/librarySymbolsHelpers';
import { getTargetPlatformForDocument } from '../utils/targetPlatform';

/** URI used for synthetic library symbols (no real source file) */
export const LIBRARY_SYMBOL_URI = vscode.Uri.parse('prog8-library:builtin');

/** Synthetic range for library symbols */
const SYNTHETIC_RANGE = new vscode.Range(0, 0, 0, 0);

/**
 * Modules that Prog8 implicitly imports for every program
 * (i.e., always available without an explicit %import statement).
 * 'syslib' provides blocks like sys, cbm, cx16, c64, etc. depending on the target.
 */
const IMPLICIT_MODULES = ['syslib'];

/**
 * All symbols accessible from a given document, grouped by source.
 */
export interface AccessibleSymbols {
    /** Symbols defined in the current document */
    localSymbols: UnifiedSymbol[];
    /** Symbols from imported local files (%import mymodule where mymodule.p8 exists) */
    importedFileSymbols: ImportedFileSymbols[];
    /** Symbols from imported library modules (%import txt, %import sys, etc.) converted to UnifiedSymbol format */
    librarySymbols: UnifiedSymbol[];
}

/**
 * Get all symbols accessible from a document in a unified format:
 * - Local symbols from the document itself
 * - Symbols from imported local files
 * - Symbols from imported library modules (converted to UnifiedSymbol)
 *
 * This is the single entry point that all providers should use
 * for consistent symbol resolution.
 */
export async function getAllAccessibleSymbols(document: vscode.TextDocument): Promise<AccessibleSymbols> {
    const localSymbols = unifiedParser.parseDocument(document);
    const additionalDirs = getSrcDirsForDocument(document);
    const importedFileSymbols = await parseImportedFileSymbols(document, additionalDirs);
    const target = getTargetPlatformForDocument(document);
    const imports = parseImports(document, additionalDirs);

    const librarySymbols = convertLibrarySymbols(imports, target);

    return { localSymbols, importedFileSymbols, librarySymbols };
}

/**
 * Check if a UnifiedSymbol is a synthetic library symbol
 * (i.e., from a built-in library module, not from a real file).
 */
export function isLibrarySymbol(symbol: UnifiedSymbol): boolean {
    return symbol.uri.toString() === LIBRARY_SYMBOL_URI.toString();
}

/**
 * Find a symbol by name across all accessible symbol sources.
 * Searches local symbols first, then imported files, then library symbols.
 * 
 * For qualified names (containing '.'), checks fullPath match first before
 * falling back to scope-aware resolution.
 */
export function findSymbolInAccessible(
    name: string,
    accessible: AccessibleSymbols,
    scope?: string
): UnifiedSymbol | undefined {
    // Normalize :: separator (Prog8 enum/module qualifier) to . for symbol table lookup
    const normalizedName = name.replace(/::/g, '.');
    const isQualified = normalizedName.includes('.');

    // 1. Local symbols
    if (isQualified) {
        // For qualified names, try exact fullPath match first, then suffix match
        // (e.g., "Mode.ON" matches "main.Mode.ON" for enum/module-qualified references)
        const byPath = accessible.localSymbols.find(s =>
            s.fullPath === normalizedName || s.fullPath.endsWith('.' + normalizedName));
        if (byPath) return byPath;
    }
    const local = unifiedParser.findSymbol(accessible.localSymbols, normalizedName, scope);
    if (local) return local;

    // 2. Imported file symbols
    for (const imported of accessible.importedFileSymbols) {
        // For qualified names, try exact fullPath match first, then suffix match
        if (isQualified) {
            const byPath = imported.symbols.find(s =>
                s.fullPath === normalizedName || s.fullPath.endsWith('.' + normalizedName));
            if (byPath) return byPath;
        }
        // Fall back to scope-aware resolution
        const found = unifiedParser.findSymbol(imported.symbols, normalizedName, scope);
        if (found) return found;
    }

    // 3. Library symbols
    if (isQualified) {
        const byPath = accessible.librarySymbols.find(s =>
            s.fullPath === normalizedName || s.fullPath.endsWith('.' + normalizedName));
        if (byPath) return byPath;
    }
    const lib = unifiedParser.findSymbol(accessible.librarySymbols, normalizedName, scope);
    if (lib) return lib;

    return undefined;
}

/**
 * Resolve struct member access (e.g., "variable.field") across all accessible symbols.
 * Returns the struct field symbol if the variable has a struct type and the field exists.
 * 
 * Merges all symbol sets so that cross-set resolution works (e.g., variable defined
 * locally but struct type defined in an imported file).
 */
export function resolveStructMemberInAccessible(
    qualifiedName: string,
    accessible: AccessibleSymbols,
    scope?: string
): UnifiedSymbol | undefined {
    if (!qualifiedName.includes('.')) {
        return undefined;
    }

    // Merge all symbols for cross-set resolution
    // This handles cases where the variable is in one set and the struct in another
    const allSymbols = [
        ...accessible.localSymbols,
        ...accessible.importedFileSymbols.flatMap(i => i.symbols),
        ...accessible.librarySymbols
    ];

    return unifiedParser.resolveStructMemberAccess(qualifiedName, allSymbols, scope);
}

/**
 * Convert library modules into UnifiedSymbol objects.
 * Includes both explicitly %import-ed library modules AND
 * implicitly available modules (like syslib) that Prog8 auto-imports.
 */
function convertLibrarySymbols(imports: ImportInfo[], target?: string): UnifiedSymbol[] {
    const symbols: UnifiedSymbol[] = [];
    const addedBlocks = new Set<string>();

    // Collect the set of library module names to convert
    const moduleNames = new Set<string>();

    // Always include implicit modules (e.g., syslib)
    for (const name of IMPLICIT_MODULES) {
        moduleNames.add(name);
    }

    // Add explicitly imported library modules
    for (const imp of imports) {
        if (imp.isLibrary) {
            moduleNames.add(imp.moduleName);
        }
    }

    // Convert each module's symbols
    for (const moduleName of moduleNames) {
        const mod = findModule(moduleName, target);
        if (!mod) continue;

        for (const block of mod.blocks) {
            // Avoid duplicate blocks (multiple modules may expose same block name)
            if (addedBlocks.has(block.name)) continue;
            addedBlocks.add(block.name);

            // Block symbol
            symbols.push({
                name: block.name,
                kind: SymbolKind.Block,
                range: SYNTHETIC_RANGE,
                selectionRange: SYNTHETIC_RANGE,
                fullPath: block.name,
                uri: LIBRARY_SYMBOL_URI,
            });

            // Subroutines
            for (const sub of block.subroutines) {
                const fullPath = `${block.name}.${sub.name}`;
                const params = sub.parameters.map(p => {
                    let s = `${p.type} ${p.name}`;
                    if (p.register) s += ` @${p.register}`;
                    return s;
                }).join(', ');
                const returnType = sub.returns.length > 0
                    ? sub.returns.map(r => r.type).join(', ')
                    : undefined;

                symbols.push({
                    name: sub.name,
                    kind: sub.address ? SymbolKind.AsmSubroutine : SymbolKind.Subroutine,
                    range: SYNTHETIC_RANGE,
                    selectionRange: SYNTHETIC_RANGE,
                    parent: block.name,
                    fullPath,
                    parameters: params || undefined,
                    returnType,
                    uri: LIBRARY_SYMBOL_URI,
                });

                // Subroutine parameters as child symbols
                for (const param of sub.parameters) {
                    symbols.push({
                        name: param.name,
                        kind: SymbolKind.Parameter,
                        type: param.type,
                        detail: param.register ? `@${param.register}` : undefined,
                        range: SYNTHETIC_RANGE,
                        selectionRange: SYNTHETIC_RANGE,
                        parent: fullPath,
                        fullPath: `${fullPath}.${param.name}`,
                        uri: LIBRARY_SYMBOL_URI,
                    });
                }
            }

            // Variables
            for (const v of block.variables) {
                symbols.push({
                    name: v.name,
                    kind: SymbolKind.Variable,
                    type: v.isMemoryMapped ? `&${v.type}` : v.type,
                    range: SYNTHETIC_RANGE,
                    selectionRange: SYNTHETIC_RANGE,
                    parent: block.name,
                    fullPath: `${block.name}.${v.name}`,
                    uri: LIBRARY_SYMBOL_URI,
                });
            }

            // Constants
            for (const c of block.constants) {
                symbols.push({
                    name: c.name,
                    kind: SymbolKind.Constant,
                    type: c.type,
                    detail: c.value,
                    range: SYNTHETIC_RANGE,
                    selectionRange: SYNTHETIC_RANGE,
                    parent: block.name,
                    fullPath: `${block.name}.${c.name}`,
                    uri: LIBRARY_SYMBOL_URI,
                });
            }
        }
    }

    return symbols;
}
