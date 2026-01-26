import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { unifiedParser, UnifiedSymbol } from './index';
import { findModule } from '../data/librarySymbols';

/**
 * Represents an import declaration in a Prog8/ProgB file
 */
export interface ImportInfo {
    moduleName: string;
    isLibrary: boolean;
    localFilePath?: string;
    line: number;
}

/**
 * Represents symbols imported from a local file
 */
export interface ImportedFileSymbols {
    filePath: string;
    moduleName: string;
    symbols: UnifiedSymbol[];
}

/**
 * Parse import statements from a document
 * Handles both Prog8 (%import) and ProgB (IMPORT) syntax
 */
export function parseImports(document: vscode.TextDocument): ImportInfo[] {
    const imports: ImportInfo[] = [];
    const text = document.getText();
    const lines = text.split(/\r?\n/);
    const documentDir = path.dirname(document.uri.fsPath);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Prog8 style: %import modulename
        let match = line.match(/^%import\s+(\w+)/i);
        if (!match) {
            // ProgB style: IMPORT modulename
            match = line.match(/^import\s+(\w+)/i);
        }

        if (match) {
            const moduleName = match[1];
            const isLibrary = isLibraryModule(moduleName);
            let localFilePath: string | undefined;

            if (!isLibrary) {
                // Check for local file - try .p8 first, then .pb
                localFilePath = resolveLocalImport(documentDir, moduleName);
            }

            imports.push({
                moduleName,
                isLibrary,
                localFilePath,
                line: i
            });
        }
    }

    return imports;
}

/**
 * Check if a module name refers to a built-in library module
 */
export function isLibraryModule(moduleName: string): boolean {
    return findModule(moduleName) !== undefined;
}

/**
 * Resolve a local import to a file path
 * Returns undefined if the file doesn't exist
 */
export function resolveLocalImport(documentDir: string, moduleName: string): string | undefined {
    // Try .p8 first
    const p8Path = path.join(documentDir, `${moduleName}.p8`);
    if (fs.existsSync(p8Path)) {
        return p8Path;
    }

    // Then try .pb
    const pbPath = path.join(documentDir, `${moduleName}.pb`);
    if (fs.existsSync(pbPath)) {
        return pbPath;
    }

    return undefined;
}

/**
 * Parse symbols from all locally imported files in a document
 * Does not recursively follow imports in the imported files
 */
export async function parseImportedFileSymbols(document: vscode.TextDocument): Promise<ImportedFileSymbols[]> {
    const imports = parseImports(document);
    const results: ImportedFileSymbols[] = [];

    for (const imp of imports) {
        if (!imp.isLibrary && imp.localFilePath) {
            try {
                const uri = vscode.Uri.file(imp.localFilePath);
                const importedDoc = await vscode.workspace.openTextDocument(uri);
                const symbols = unifiedParser.parseDocument(importedDoc);
                
                // Update the URI on all symbols to point to the imported file
                for (const symbol of symbols) {
                    symbol.uri = uri;
                }

                results.push({
                    filePath: imp.localFilePath,
                    moduleName: imp.moduleName,
                    symbols
                });
            } catch (error) {
                // File might not exist or be readable - skip it
                console.log(`Could not parse imported file: ${imp.localFilePath}`, error);
            }
        }
    }

    return results;
}

/**
 * Get all symbols accessible from a document, including imported local files
 */
export async function getAllAccessibleSymbols(document: vscode.TextDocument): Promise<{
    localSymbols: UnifiedSymbol[];
    importedSymbols: ImportedFileSymbols[];
}> {
    const localSymbols = unifiedParser.parseDocument(document);
    const importedSymbols = await parseImportedFileSymbols(document);
    
    return { localSymbols, importedSymbols };
}

/**
 * Find a symbol by name across local and imported symbols
 */
export function findSymbolInImports(
    name: string,
    importedSymbols: ImportedFileSymbols[],
    currentScope?: string
): UnifiedSymbol | undefined {
    // Handle qualified names (e.g., "mymodule.myblock.mysub")
    if (name.includes('.')) {
        for (const imported of importedSymbols) {
            const symbol = imported.symbols.find(s => s.fullPath === name);
            if (symbol) return symbol;
        }
    }

    // For unqualified names, search all imported files
    for (const imported of importedSymbols) {
        // First try to find in top-level (blocks)
        const topLevel = imported.symbols.find(s => s.name === name && !s.parent);
        if (topLevel) return topLevel;
        
        // Then search all symbols
        const symbol = unifiedParser.findSymbol(imported.symbols, name, currentScope);
        if (symbol) return symbol;
    }

    return undefined;
}

/**
 * Get all blocks from imported files
 */
export function getBlocksFromImports(importedSymbols: ImportedFileSymbols[]): UnifiedSymbol[] {
    const blocks: UnifiedSymbol[] = [];
    
    for (const imported of importedSymbols) {
        for (const symbol of imported.symbols) {
            if (symbol.kind === 'block') {
                blocks.push(symbol);
            }
        }
    }
    
    return blocks;
}
