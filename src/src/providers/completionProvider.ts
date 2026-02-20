import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { 
    getAllBlocks, 
    getAllModules,
    getSubroutineMembers,
    BlockInfo, 
    SubroutineInfo, 
    VariableInfo, 
    ConstantInfo,
} from '../data/librarySymbolsHelpers';
import { TargetPlatform } from '../utils/targetPlatform';
import { getTargetPlatformForDocument } from '../utils/targetPlatform';
import { 
    ImportedFileSymbols,
} from '../parser/importResolver';
import { getAllAccessibleSymbols } from '../parser/symbolAggregator';
import { isInComment, isTypingImport, getQualifiedPrefix } from './providerUtils';
import { builtinFunctions, BuiltinFunctionInfo } from '../data/builtinFunctions';
import { getKeywordsForLanguage } from '../data/keywords';
import {
    formatUnifiedSymbolDoc,
    formatBuiltinDoc,
    formatKeywordDoc,
    formatLibraryModuleDoc,
    formatLibraryBlockDoc,
    formatImportedBlockDoc,
    formatLibrarySubroutineDoc,
    formatLibraryVariableDoc,
    formatLibraryConstantDoc,
    formatLibraryParameterDoc
} from './symbolDocumentation';

/**
 * Provides auto-completion for Prog8 and ProgB files.
 * Phase 2: Local variables and scoped names completion.
 */
export class Prog8CompletionProvider implements vscode.CompletionItemProvider {
    
    /** Target platform cached for current completion request */
    private targetPlatform: TargetPlatform = 'cx16';

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        
        // Cache target platform for use by helper methods
        this.targetPlatform = getTargetPlatformForDocument(document);
        
        const completions: vscode.CompletionItem[] = [];

        // Parse the current document
        const symbols = unifiedParser.parseDocument(document);
        
        // Get the current scope at cursor position
        const currentScope = unifiedParser.getScopeAtPosition(symbols, position);

        // Get the text before the cursor to determine context
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        
        // Skip completion in comments
        if (isInComment(document, position)) {
            return completions;
        }

        // Check if we're typing a directive (starts with %) - Prog8 only
        if (this.isTypingDirective(linePrefix, document)) {
            const directiveCompletions = this.getDirectiveCompletions(document);
            completions.push(...directiveCompletions);
            return completions;
        }

        // Check if we're in an import statement - show only module names
        if (isTypingImport(linePrefix)) {
            const moduleCompletions = this.getLibraryModuleCompletions();
            completions.push(...moduleCompletions);
            return completions;
        }

        // Parse imported local files for their symbols via the unified aggregator
        const { importedFileSymbols, librarySymbols } = await getAllAccessibleSymbols(document);

        // Build filter set so we only show library completions for actually-imported items
        const importedLibBlockNames = new Set(
            librarySymbols.filter(s => s.kind === SymbolKind.Block).map(s => s.name)
        );

        // Check if we're completing a qualified name (e.g., "txt." or "main.start.")
        const qualifiedPrefixValue = getQualifiedPrefix(linePrefix);
        
        if (qualifiedPrefixValue) {
            // Scoped completion - show only members of the specified scope
            const scopedCompletions = this.getScopedCompletions(qualifiedPrefixValue, symbols, importedFileSymbols, currentScope, importedLibBlockNames);
            completions.push(...scopedCompletions);
        } else {
            // Regular completion - show local variables and accessible symbols
            const localVarCompletions = this.getLocalVariableCompletions(symbols, currentScope, position);
            completions.push(...localVarCompletions);
            
            // Add blocks from imported local files
            const importedBlockCompletions = this.getImportedBlockCompletions(importedFileSymbols);
            completions.push(...importedBlockCompletions);
            
            // Also add library block names for qualified access (only for imported libraries)
            const libraryBlockCompletions = this.getLibraryBlockCompletions(importedLibBlockNames);
            completions.push(...libraryBlockCompletions);

            // Add built-in functions if enabled in settings
            const config = vscode.workspace.getConfiguration('prog8');
            const showBuiltins = config.get<boolean>('completion.showBuiltinFunctions', true);
            if (showBuiltins) {
                const builtinCompletions = this.getBuiltinFunctionCompletions();
                completions.push(...builtinCompletions);
            }

            // Add keyword completions
            const showKeywords = config.get<boolean>('completion.showKeywords', true);
            if (showKeywords) {
                const keywordCompletions = this.getKeywordCompletions(document);
                completions.push(...keywordCompletions);
            }
        }

        return completions;
    }

    /**
     * Get completions for library module names (for import statements)
     */
    private getLibraryModuleCompletions(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedModules = new Set<string>();
        const isProgB = false; // import context is always prog8-style for module listing
        
        const modules = getAllModules(this.targetPlatform);
        for (const mod of modules) {
            if (addedModules.has(mod.name)) {
                continue;
            }
            addedModules.add(mod.name);
            
            const item = new vscode.CompletionItem(mod.name);
            item.kind = vscode.CompletionItemKind.Module;
            
            // Count contents
            let totalSubs = 0;
            let totalVars = 0;
            let totalConsts = 0;
            for (const block of mod.blocks) {
                totalSubs += block.subroutines.length;
                totalVars += block.variables.length;
                totalConsts += block.constants.length;
            }
            
            item.detail = `${mod.blocks.length} block${mod.blocks.length !== 1 ? 's' : ''}, ${totalSubs} subroutines`;
            item.documentation = formatLibraryModuleDoc(mod, isProgB);
            completions.push(item);
        }
        
        return completions;
    }

    /**
     * Get completions for members of a specific scope (qualified name completion)
     */
    private getScopedCompletions(
        prefix: string, 
        symbols: UnifiedSymbol[], 
        importedFileSymbols: ImportedFileSymbols[] = [],
        currentScope?: string,
        importedLibBlockNames?: Set<string>
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedNames = new Set<string>();

        // First, check if this is a library block (e.g., "txt", "sys", "cx16") - only if imported
        const prefixBlockName = prefix.split('.')[0];
        if (!importedLibBlockNames || importedLibBlockNames.has(prefixBlockName)) {
            const libraryCompletions = this.getLibraryMemberCompletions(prefix);
            completions.push(...libraryCompletions);
            libraryCompletions.forEach(item => addedNames.add(item.label as string));
        }

        // Check if prefix is a library block.sub path (e.g., "diskio.lf_start_list")
        // to offer subroutine parameter completions
        if (prefix.includes('.')) {
            const subMemberCompletions = this.getLibrarySubMemberCompletions(prefix);
            completions.push(...subMemberCompletions);
            subMemberCompletions.forEach(item => addedNames.add(item.label as string));
        }

        // Check if prefix is a variable with a struct type - offer struct fields
        // Merge local and imported symbols for cross-set struct resolution
        const allSymbolsForStruct = [
            ...symbols,
            ...importedFileSymbols.flatMap(i => i.symbols)
        ];
        const structMemberCompletions = this.getStructMemberCompletions(prefix, allSymbolsForStruct, currentScope);
        completions.push(...structMemberCompletions);
        structMemberCompletions.forEach(item => addedNames.add(item.label as string));

        // Then, check local symbols that belong to this scope
        for (const symbol of symbols) {
            // Check if this symbol's parent matches the prefix
            if (symbol.parent === prefix || symbol.fullPath.startsWith(prefix + '.')) {
                // Only add direct children, not nested ones
                const relativePath = symbol.fullPath.substring(prefix.length + 1);
                if (!relativePath.includes('.')) {
                    if (!addedNames.has(symbol.name)) {
                        addedNames.add(symbol.name);
                        const item = this.createCompletionItem(symbol);
                        completions.push(item);
                    }
                }
            }
        }

        // Check imported file symbols for the prefix
        for (const imported of importedFileSymbols) {
            for (const symbol of imported.symbols) {
                // Check if this symbol's parent matches the prefix or is a direct child
                if (symbol.parent === prefix || symbol.fullPath.startsWith(prefix + '.')) {
                    const relativePath = symbol.fullPath.substring(prefix.length + 1);
                    if (!relativePath.includes('.')) {
                        if (!addedNames.has(symbol.name)) {
                            addedNames.add(symbol.name);
                            const item = this.createCompletionItem(symbol, imported.moduleName);
                            completions.push(item);
                        }
                    }
                }
            }
        }

        return completions;
    }

    /**
     * Get completions for struct fields when the prefix is a variable with a struct type
     */
    private getStructMemberCompletions(
        prefix: string,
        symbols: UnifiedSymbol[],
        currentScope?: string
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];

        // Find the variable with this name
        const variable = unifiedParser.findSymbol(symbols, prefix, currentScope);
        if (!variable || !variable.type) {
            return completions;
        }

        // Extract the base type name by stripping pointer prefixes (^, ^^)
        const baseTypeName = variable.type.replace(/^\^+/, '');

        // Find the struct/type definition
        // Check both name (for same-scope types) and fullPath (for qualified types like "other.DirEntry")
        const structSymbol = symbols.find(s => 
            (s.kind === SymbolKind.Struct || s.kind === SymbolKind.Alias) && 
            (s.name === baseTypeName || s.fullPath === baseTypeName)
        );

        if (!structSymbol) {
            return completions;
        }

        // Find all fields of this struct
        for (const symbol of symbols) {
            if (symbol.kind === SymbolKind.StructField && symbol.parent === structSymbol.fullPath) {
                const item = this.createCompletionItem(symbol);
                completions.push(item);
            }
        }

        return completions;
    }

    /**
     * Get completions for blocks from imported local files
     */
    private getImportedBlockCompletions(importedFileSymbols: ImportedFileSymbols[]): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedBlocks = new Set<string>();
        const isProgB = false; // completion context defaults to prog8

        for (const imported of importedFileSymbols) {
            for (const symbol of imported.symbols) {
                if (symbol.kind !== SymbolKind.Block) {
                    continue;
                }

                if (addedBlocks.has(symbol.name)) {
                    continue;
                }
                addedBlocks.add(symbol.name);

                const item = new vscode.CompletionItem(symbol.name);
                item.kind = vscode.CompletionItemKind.Module;
                item.detail = `from ${imported.moduleName}`;
                item.documentation = formatImportedBlockDoc(symbol.name, imported.symbols, imported.moduleName, isProgB);

                // Trigger completion after inserting the block name
                item.command = {
                    command: 'editor.action.triggerSuggest',
                    title: 'Trigger Suggest'
                };

                completions.push(item);
            }
        }

        return completions;
    }

    /**
     * Get completions for library block members (e.g., txt.print, sys.memset)
     */
    private getLibraryMemberCompletions(blockName: string): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const isProgB = false; // completions default to prog8
        
        // Get library blocks for the selected target platform
        const blocks = getAllBlocks(this.targetPlatform);
        const block = blocks.find(b => b.name === blockName);
        
        if (!block) {
            return completions;
        }

        // Add subroutines
        for (const sub of block.subroutines) {
            const item = this.createLibrarySubroutineCompletion(sub, blockName, isProgB);
            completions.push(item);
        }

        // Add variables
        for (const variable of block.variables) {
            const item = this.createLibraryVariableCompletion(variable, blockName, isProgB);
            completions.push(item);
        }

        // Add constants
        for (const constant of block.constants) {
            const item = this.createLibraryConstantCompletion(constant, blockName, isProgB);
            completions.push(item);
        }

        return completions;
    }

    /**
     * Get completions for library subroutine members (parameters).
     * Handles prefixes like "diskio.lf_start_list" to offer parameter completions.
     */
    private getLibrarySubMemberCompletions(prefix: string): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const isProgB = false; // completions default to prog8

        const params = getSubroutineMembers(prefix, this.targetPlatform);
        for (const param of params) {
            const item = new vscode.CompletionItem(param.name);
            item.kind = vscode.CompletionItemKind.Field;
            item.detail = `${param.type} (parameter)`;
            // Re-use the shared parameter doc formatter with a dummy SubroutineInfo
            // since we only need the parameter display
            const qualifiedName = `${prefix}.${param.name}`;
            const doc = new vscode.MarkdownString();
            const langId = isProgB ? 'progb' : 'prog8';
            let decl = `${param.type} ${qualifiedName}`;
            if (param.register) {
                decl += ` @${param.register}`;
            }
            doc.appendCodeblock(decl, langId);
            doc.appendMarkdown(`\n\n*Subroutine parameter*`);
            item.documentation = doc;
            completions.push(item);
        }

        return completions;
    }

    /**
     * Get completions for library block names (txt, sys, cx16, etc.)
     * Only shows blocks from libraries that are actually imported.
     */
    private getLibraryBlockCompletions(importedLibBlockNames: Set<string>): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedBlocks = new Set<string>();
        const isProgB = false; // completions default to prog8
        
        const blocks = getAllBlocks(this.targetPlatform);
        for (const block of blocks) {
            // Only show blocks from imported libraries
            if (!importedLibBlockNames.has(block.name)) {
                continue;
            }
            if (addedBlocks.has(block.name)) {
                continue;
            }
            addedBlocks.add(block.name);
            
            const item = new vscode.CompletionItem(block.name);
            item.kind = vscode.CompletionItemKind.Module;
            item.detail = `library module`;
            item.documentation = formatLibraryBlockDoc(block, isProgB);
            
            // Trigger completion after inserting the block name
            item.command = {
                command: 'editor.action.triggerSuggest',
                title: 'Trigger Suggest'
            };
            
            completions.push(item);
        }
        
        return completions;
    }

    /**
     * Get completions for built-in functions (abs, len, peek, poke, etc.)
     */
    private getBuiltinFunctionCompletions(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const isProgB = false; // completions default to prog8

        for (const [name, info] of Object.entries(builtinFunctions)) {
            const item = new vscode.CompletionItem(name);
            item.kind = vscode.CompletionItemKind.Function;
            item.detail = `built-in`;
            
            // Lower sort priority so local/imported symbols appear first
            item.sortText = `zzz_${name}`;
            
            // Create snippet for insertion with parentheses
            const hasParams = !info.signature.includes('()');
            if (hasParams) {
                item.insertText = new vscode.SnippetString(`${name}($1)`);
            } else {
                item.insertText = new vscode.SnippetString(`${name}()`);
            }
            
            item.documentation = formatBuiltinDoc(info, isProgB);
            completions.push(item);
        }

        return completions;
    }

    /**
     * Check if we're typing a directive (line starts with %) - Prog8 only
     */
    private isTypingDirective(linePrefix: string, document: vscode.TextDocument): boolean {
        // ProgB doesn't use % directives
        if (unifiedParser.isProgB(document)) {
            return false;
        }
        const trimmed = linePrefix.trim();
        // Check if line starts with % and we're still typing the directive name
        return /^%\w*$/.test(trimmed);
    }

    /**
     * Get completions for directives (keywords starting with %)
     */
    private getDirectiveCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];

        const keywords = getKeywordsForLanguage(false); // Always prog8 for % directives

        // Filter to only directives
        for (const [name, info] of Object.entries(keywords)) {
            if (info.category !== 'directive') {
                continue;
            }

            // For prog8 directives starting with %, show name without % as label
            // since user already typed the %
            const displayName = name.startsWith('%') ? name.substring(1) : name;
            
            const item = new vscode.CompletionItem(displayName);
            item.kind = vscode.CompletionItemKind.Keyword;
            item.detail = name; // Show full directive in detail
            item.insertText = displayName; // Insert without % since user already typed it
            
            item.documentation = formatKeywordDoc(name, info.description, false, 'directive');
            
            completions.push(item);
        }

        return completions;
    }

    /**
     * Get completions for language keywords
     */
    private getKeywordCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const isProgB = unifiedParser.isProgB(document);

        const keywords = getKeywordsForLanguage(isProgB);

        for (const [name, info] of Object.entries(keywords)) {
            // Skip directives - they are handled separately when typing %
            if (info.category === 'directive') {
                continue;
            }

            const item = new vscode.CompletionItem(name);
            item.kind = info.category === 'type'
                ? vscode.CompletionItemKind.TypeParameter
                : vscode.CompletionItemKind.Keyword;
            item.detail = info.category;
            
            // Lower sort priority so local/imported symbols appear first
            item.sortText = `zzzz_${name}`;
            
            item.documentation = formatKeywordDoc(name, info.description, isProgB, info.category);
            completions.push(item);
        }

        return completions;
    }

    /**
     * Create a completion item for a library subroutine
     */
    private createLibrarySubroutineCompletion(sub: SubroutineInfo, blockName: string, isProgB: boolean): vscode.CompletionItem {
        const item = new vscode.CompletionItem(sub.name);
        item.kind = vscode.CompletionItemKind.Function;
        
        // Format parameters for detail
        const params = sub.parameters.map(p => `${p.type} ${p.name}`).join(', ');
        let detail = `(${params})`;
        if (sub.returns.length > 0) {
            const rets = sub.returns.map(r => r.type).join(', ');
            detail += ` -> ${rets}`;
        }
        item.detail = detail;
        
        // Create snippet for insertion
        if (sub.parameters.length > 0) {
            item.insertText = new vscode.SnippetString(`${sub.name}($1)`);
        } else {
            item.insertText = new vscode.SnippetString(`${sub.name}()`);
        }
        
        item.documentation = formatLibrarySubroutineDoc(sub, `${blockName}.${sub.name}`, isProgB);
        
        return item;
    }

    /**
     * Create a completion item for a library variable
     */
    private createLibraryVariableCompletion(variable: VariableInfo, blockName: string, isProgB: boolean): vscode.CompletionItem {
        const item = new vscode.CompletionItem(variable.name);
        item.kind = vscode.CompletionItemKind.Variable;
        item.detail = variable.type;
        
        item.documentation = formatLibraryVariableDoc(variable, `${blockName}.${variable.name}`, isProgB);
        return item;
    }

    /**
     * Create a completion item for a library constant
     */
    private createLibraryConstantCompletion(constant: ConstantInfo, blockName: string, isProgB: boolean): vscode.CompletionItem {
        const item = new vscode.CompletionItem(constant.name);
        item.kind = vscode.CompletionItemKind.Constant;
        item.detail = `const ${constant.type}` + (constant.value ? ` = ${constant.value}` : '');
        
        item.documentation = formatLibraryConstantDoc(constant, `${blockName}.${constant.name}`, isProgB);
        return item;
    }

    /**
     * Symbol kinds that should be included in local variable completions
     */
    private static readonly LOCAL_COMPLETION_KINDS = new Set([
        SymbolKind.Variable,
        SymbolKind.Constant,
        SymbolKind.Parameter,
        SymbolKind.Subroutine,
        SymbolKind.AsmSubroutine,
        SymbolKind.ExtSubroutine,
        SymbolKind.Block,
        SymbolKind.Struct,
        SymbolKind.Alias,
        SymbolKind.Label
    ]);

    /**
     * Get completions for local variables accessible from the current scope.
     * In Prog8, variables are scoped to their subroutine and are visible
     * to nested subroutines.
     */
    private getLocalVariableCompletions(
        symbols: UnifiedSymbol[],
        currentScope: string | undefined,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedNames = new Set<string>(); // Avoid duplicates

        for (const symbol of symbols) {
            // Skip symbol kinds we don't want in completions
            if (!Prog8CompletionProvider.LOCAL_COMPLETION_KINDS.has(symbol.kind)) {
                continue;
            }

            // Avoid duplicates
            if (addedNames.has(symbol.name)) {
                continue;
            }

            // Check accessibility based on symbol kind
            switch (symbol.kind) {
                case SymbolKind.Variable:
                case SymbolKind.Constant:
                case SymbolKind.Parameter:
                case SymbolKind.Subroutine:
                case SymbolKind.AsmSubroutine:
                case SymbolKind.ExtSubroutine:
                case SymbolKind.Struct:
                case SymbolKind.Alias:
                    // These require scope accessibility check
                    if (!this.isSymbolAccessible(symbol, currentScope)) {
                        continue;
                    }
                    break;

                case SymbolKind.Block:
                    // Blocks are always accessible for qualified access
                    break;

                case SymbolKind.Label:
                    // Labels must be in the same scope
                    if (symbol.parent !== currentScope) {
                        continue;
                    }
                    break;
            }

            addedNames.add(symbol.name);
            const item = this.createCompletionItem(symbol);
            completions.push(item);
        }

        return completions;
    }

    /**
     * Check if a symbol is accessible from the given scope.
     * In Prog8:
     * - Variables in a subroutine are accessible within that subroutine
     * - Nested subroutines can access parent subroutine variables
     * - Block-level symbols are accessible within the block
     */
    private isSymbolAccessible(symbol: UnifiedSymbol, currentScope: string | undefined): boolean {
        if (!currentScope) {
            // At top level, only top-level symbols are directly accessible
            return !symbol.parent;
        }

        // If symbol has no parent, it's at top level - accessible everywhere
        if (!symbol.parent) {
            return true;
        }

        // Check if the symbol's parent scope is the current scope or an ancestor
        const scopeParts = currentScope.split('.');
        for (let i = scopeParts.length; i >= 1; i--) {
            const ancestorScope = scopeParts.slice(0, i).join('.');
            if (symbol.parent === ancestorScope) {
                return true;
            }
        }

        // Check if current scope is inside the symbol's parent scope
        if (currentScope.startsWith(symbol.parent + '.')) {
            return true;
        }

        return false;
    }

    /**
     * Create a completion item for a symbol
     * @param symbol The symbol to create a completion item for
     * @param sourceModule Optional source module name for imported symbols
     */
    private createCompletionItem(symbol: UnifiedSymbol, sourceModule?: string): vscode.CompletionItem {
        const item = new vscode.CompletionItem(symbol.name);
        
        // Set the kind based on symbol type
        switch (symbol.kind) {
            case SymbolKind.Variable:
                item.kind = vscode.CompletionItemKind.Variable;
                item.detail = symbol.type || 'variable';
                break;
            case SymbolKind.Constant:
                item.kind = vscode.CompletionItemKind.Constant;
                item.detail = `const ${symbol.type}` + (symbol.detail ? ` = ${symbol.detail}` : '');
                break;
            case SymbolKind.Parameter:
                item.kind = vscode.CompletionItemKind.Variable;
                item.detail = `${symbol.type} (parameter)`;
                break;
            case SymbolKind.Subroutine:
                item.kind = vscode.CompletionItemKind.Function;
                item.detail = this.formatSubroutineDetail(symbol);
                item.insertText = new vscode.SnippetString(
                    symbol.parameters ? `${symbol.name}($1)` : `${symbol.name}()`
                );
                break;
            case SymbolKind.AsmSubroutine:
                item.kind = vscode.CompletionItemKind.Function;
                item.detail = this.formatSubroutineDetail(symbol, 'asmsub');
                item.insertText = new vscode.SnippetString(
                    symbol.parameters ? `${symbol.name}($1)` : `${symbol.name}()`
                );
                break;
            case SymbolKind.ExtSubroutine:
                item.kind = vscode.CompletionItemKind.Function;
                item.detail = `extsub ${symbol.detail || ''}`;
                item.insertText = new vscode.SnippetString(
                    symbol.parameters ? `${symbol.name}($1)` : `${symbol.name}()`
                );
                break;
            case SymbolKind.Block:
                item.kind = vscode.CompletionItemKind.Module;
                item.detail = 'block';
                break;
            case SymbolKind.Label:
                item.kind = vscode.CompletionItemKind.Reference;
                item.detail = 'label';
                break;
            case SymbolKind.Struct:
                item.kind = vscode.CompletionItemKind.Struct;
                item.detail = 'struct';
                break;
            case SymbolKind.Alias:
                item.kind = vscode.CompletionItemKind.Reference;
                item.detail = symbol.detail || 'alias';
                break;
            default:
                item.kind = vscode.CompletionItemKind.Text;
        }

        // Add source module to detail if provided
        if (sourceModule) {
            item.detail = (item.detail || '') + ` (from ${sourceModule})`;
        }

        // Add documentation – use the shared formatter for consistency with hover
        const isProgB = false; // completion context defaults to prog8
        item.documentation = formatUnifiedSymbolDoc(symbol, isProgB);

        return item;
    }

    /**
     * Format a subroutine's detail string
     */
    private formatSubroutineDetail(symbol: UnifiedSymbol, prefix: string = 'sub'): string {
        let detail = prefix;
        if (symbol.parameters) {
            detail += `(${symbol.parameters})`;
        } else {
            detail += '()';
        }
        if (symbol.returnType) {
            detail += ` -> ${symbol.returnType}`;
        }
        return detail;
    }
}
