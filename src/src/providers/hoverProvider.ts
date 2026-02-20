import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { findSubroutine, findVariable, findConstant, findSubroutineParameter, getAllBlocks, findModule, SubroutineInfo, BlockInfo, ModuleInfo, VariableInfo, ConstantInfo, Parameter } from '../data/librarySymbolsHelpers';
import { getTargetPlatform, getTargetPlatformForDocument } from '../utils/targetPlatform';
import { parseImports, findSymbolInImports, ImportedFileSymbols, resolveLocalImport, getSrcDirsForDocument } from '../parser/importResolver';
import { getAllAccessibleSymbols, resolveStructMemberInAccessible } from '../parser/symbolAggregator';
import { isInImportStatement, getQualifiedNameAtPosition, isInComment } from './providerUtils';
import { getBuiltinFunction } from '../data/builtinFunctions';
import { getKeywordsForLanguage } from '../data/keywords';
import {
    formatUnifiedSymbolDoc,
    formatLibrarySubroutineDoc,
    formatLibraryVariableDoc,
    formatLibraryConstantDoc,
    formatLibraryParameterDoc,
    formatBuiltinDoc,
    formatKeywordDoc,
    formatLibraryModuleDoc,
    formatLibraryBlockDoc,
    formatImportedBlockDoc,
    formatLocalModuleDoc
} from './symbolDocumentation';

/**
 * Provides hover information for Prog8 files.
 */
export class Prog8HoverProvider implements vscode.HoverProvider {

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        
        // Skip positions inside comments
        if (isInComment(document, position)) {
            return undefined;
        }

        // Determine if this is a ProgB document for syntax formatting
        const isProgB = unifiedParser.isProgB(document);

        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        // Check if we're in an import statement - if so, only show module info
        if (isInImportStatement(document, position)) {
            // Check library modules first
            const moduleHover = this.getLibraryModuleHover(word, isProgB);
            if (moduleHover) {
                return moduleHover;
            }
            // Check if it's a local module import
            const localModuleHover = await this.getLocalModuleHover(document, word, isProgB);
            if (localModuleHover) {
                return localModuleHover;
            }
            // In an import statement but not a known module - don't match anything else
            return undefined;
        }

        // Parse imported file symbols once via the unified aggregator and reuse throughout
        const accessible = await getAllAccessibleSymbols(document);
        const { localSymbols: symbols, importedFileSymbols, librarySymbols } = accessible;

        // Build filter sets so we only show library hovers for actually-imported items
        const importedLibBlockNames = new Set(
            librarySymbols.filter(s => s.kind === SymbolKind.Block).map(s => s.name)
        );
        const importedLibModuleNames = new Set(
            parseImports(document).filter(i => i.isLibrary).map(i => i.moduleName)
        );

        // Check if it's a qualified name (e.g., txt.print)
        const qualifiedName = getQualifiedNameAtPosition(document, position);
        if (qualifiedName && qualifiedName.includes('.')) {
            // First check library modules (from skeleton files) — only if the block is from an imported library
            const qualifiedBlockName = qualifiedName.split('.')[0];
            if (importedLibBlockNames.has(qualifiedBlockName)) {
                const libraryHover = this.getLibraryHover(qualifiedName, isProgB);
                if (libraryHover) {
                    return libraryHover;
                }
            }
            
            // If not a library, check local imports for qualified names
            // This handles cases like "localmodule.mysub" where localmodule is imported
            const importedSymbol = findSymbolInImports(qualifiedName, importedFileSymbols);
            if (importedSymbol) {
                return this.createHoverForSymbol(importedSymbol, isProgB, true);
            }
            
            // Also check current file for qualified names (e.g., myblock.mysub within same file)
            const localQualifiedSymbol = symbols.find(s => s.fullPath === qualifiedName);
            if (localQualifiedSymbol) {
                return this.createHoverForSymbol(localQualifiedSymbol, isProgB);
            }

            // Check for struct member access (e.g., variable.member where variable has a struct type)
            const currentScope = unifiedParser.getScopeAtPosition(symbols, position);
            const structMember = resolveStructMemberInAccessible(qualifiedName, accessible, currentScope);
            if (structMember) {
                return this.createHoverForSymbol(structMember, isProgB);
            }
        }

        // Check if it's a built-in function
        const builtinHover = this.getBuiltinHover(word, isProgB);
        if (builtinHover) {
            return builtinHover;
        }

        // Check if it's a keyword
        const keywordHover = this.getKeywordHover(word, isProgB);
        if (keywordHover) {
            return keywordHover;
        }

        // Check if it's a library module name (e.g., buffers, textio) — only if actually imported
        if (importedLibModuleNames.has(word)) {
            const moduleHover = this.getLibraryModuleHover(word, isProgB);
            if (moduleHover) {
                return moduleHover;
            }
        }

        // Check if it's a library block name (e.g., txt, sys, cx16) — only if from an imported library
        if (importedLibBlockNames.has(word)) {
            const blockHover = this.getLibraryBlockHover(word, isProgB);
            if (blockHover) {
                return blockHover;
            }
        }

        // Check if it's a block from an imported local file (e.g., helpers from %import myhelper)
        const importedBlockHover = this.getImportedBlockHover(word, importedFileSymbols, isProgB);
        if (importedBlockHover) {
            return importedBlockHover;
        }

        // Get current scope for context
        const currentScope = unifiedParser.getScopeAtPosition(symbols, position);

        // Find the symbol in current file
        const symbol = unifiedParser.findSymbol(symbols, word, currentScope);
        
        if (symbol) {
            return this.createHoverForSymbol(symbol, isProgB);
        }

        // Search in imported local files for unqualified names
        const importedSymbol = findSymbolInImports(qualifiedName || word, importedFileSymbols, currentScope);
        if (importedSymbol) {
            return this.createHoverForSymbol(importedSymbol, isProgB, true);
        }

        return undefined;
    }

    /**
     * Create a hover for a symbol
     * @param symbol The symbol to create a hover for
     * @param isProgB Whether to format in ProgB (BASIC-style) syntax
     * @param isImported Whether the symbol comes from an imported file
     */
    private createHoverForSymbol(symbol: UnifiedSymbol, isProgB: boolean = false, isImported: boolean = false): vscode.Hover {
        return new vscode.Hover(formatUnifiedSymbolDoc(symbol, isProgB, isImported));
    }

    /**
     * Get hover for built-in functions
     */
    private getBuiltinHover(word: string, isProgB: boolean): vscode.Hover | undefined {
        const info = getBuiltinFunction(word);
        if (info) {
            return new vscode.Hover(formatBuiltinDoc(info, isProgB));
        }
        return undefined;
    }

    /**
     * Get hover for keywords.
     * Uses the shared keyword data from keywords.ts via getKeywordsForLanguage().
     */
    private getKeywordHover(word: string, isProgB: boolean): vscode.Hover | undefined {
        const keywords = getKeywordsForLanguage(isProgB);
        const info = keywords[word];
        if (info) {
            return new vscode.Hover(formatKeywordDoc(word, info.description, isProgB));
        }
        return undefined;
    }

    /**
     * Get hover for library symbols: subroutines, variables, constants,
     * and subroutine parameters accessed via scoped paths.
     * Handles 2-part (block.member) and 3-part (block.sub.param) names.
     */
    private getLibraryHover(qualifiedName: string, isProgB: boolean): vscode.Hover | undefined {
        const target = getTargetPlatform();
        const parts = qualifiedName.split('.');

        // 3-part name: block.sub.parameter (e.g., diskio.lf_start_list.pattern_ptr)
        if (parts.length === 3) {
            const paramResult = findSubroutineParameter(qualifiedName, target);
            if (paramResult) {
                return this.createHoverForLibraryParameter(paramResult.parameter, paramResult.sub, qualifiedName, isProgB);
            }
            return undefined;
        }

        // 2-part name: check subroutine, then variable, then constant
        const sub = findSubroutine(qualifiedName, target);
        if (sub) {
            return this.createHoverForLibrarySubroutine(sub, qualifiedName, isProgB);
        }

        const varResult = findVariable(qualifiedName, target);
        if (varResult) {
            return this.createHoverForLibraryVariable(varResult.variable, qualifiedName, isProgB);
        }

        const constResult = findConstant(qualifiedName, target);
        if (constResult) {
            return this.createHoverForLibraryConstant(constResult.constant, qualifiedName, isProgB);
        }

        return undefined;
    }

    /**
     * Get hover for library module names (e.g., buffers, textio, math)
     * Modules are what you %import - they contain one or more blocks
     */
    private getLibraryModuleHover(name: string, isProgB: boolean): vscode.Hover | undefined {
        const mod = findModule(name, getTargetPlatform());
        
        if (mod) {
            return new vscode.Hover(formatLibraryModuleDoc(mod, isProgB));
        }
        
        return undefined;
    }

    /**
     * Get hover for library block names (e.g., txt, sys, cx16)
     * Blocks are namespaces inside modules that you access with qualified names
     */
    private getLibraryBlockHover(name: string, isProgB: boolean): vscode.Hover | undefined {
        const blocks = getAllBlocks(getTargetPlatform());
        const block = blocks.find(b => b.name === name);
        
        if (block) {
            return new vscode.Hover(formatLibraryBlockDoc(block, isProgB));
        }
        
        return undefined;
    }

    /**
     * Get hover for blocks from imported local files
     * Shows information about blocks defined in imported files (not library modules)
     */
    private getImportedBlockHover(name: string, importedSymbols: ImportedFileSymbols[], isProgB: boolean): vscode.Hover | undefined {
        for (const imported of importedSymbols) {
            const block = imported.symbols.find((s: UnifiedSymbol) => s.name === name && s.kind === SymbolKind.Block && !s.parent);
            if (block) {
                const fileName = path.basename(imported.filePath);
                return new vscode.Hover(formatImportedBlockDoc(name, imported.symbols, fileName, isProgB));
            }
        }
        
        return undefined;
    }

    /**
     * Get hover for local module imports (non-library modules)
     * Shows information about local files that can be imported
     */
    private async getLocalModuleHover(document: vscode.TextDocument, moduleName: string, isProgB: boolean): Promise<vscode.Hover | undefined> {
        const documentDir = path.dirname(document.uri.fsPath);
        const additionalDirs = getSrcDirsForDocument(document);
        const localFilePath = resolveLocalImport(documentDir, moduleName, additionalDirs);
        
        if (localFilePath) {
            try {
                const uri = vscode.Uri.file(localFilePath);
                const importedDoc = await vscode.workspace.openTextDocument(uri);
                const symbols = unifiedParser.parseDocument(importedDoc);
                
                const fileName = path.basename(localFilePath);
                const blocks = symbols.filter((s: UnifiedSymbol) => s.kind === SymbolKind.Block && !s.parent);
                
                return new vscode.Hover(formatLocalModuleDoc(moduleName, fileName, blocks, isProgB));
            } catch (error) {
                // File might not be readable
            }
        }
        
        return undefined;
    }

    /**
     * Create hover for a library subroutine
     */
    private createHoverForLibrarySubroutine(sub: SubroutineInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        return new vscode.Hover(formatLibrarySubroutineDoc(sub, qualifiedName, isProgB));
    }

    /**
     * Create hover for a library variable
     */
    private createHoverForLibraryVariable(variable: VariableInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        return new vscode.Hover(formatLibraryVariableDoc(variable, qualifiedName, isProgB));
    }

    /**
     * Create hover for a library constant
     */
    private createHoverForLibraryConstant(constant: ConstantInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        return new vscode.Hover(formatLibraryConstantDoc(constant, qualifiedName, isProgB));
    }

    /**
     * Create hover for a subroutine parameter accessed via scoped path
     */
    private createHoverForLibraryParameter(parameter: Parameter, sub: SubroutineInfo, qualifiedName: string, isProgB: boolean): vscode.Hover {
        return new vscode.Hover(formatLibraryParameterDoc(parameter, sub, qualifiedName, isProgB));
    }

}
