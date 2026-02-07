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
    Parameter,
    formatSubroutineSignature 
} from '../data/librarySymbolsHelpers';
import { getTargetPlatform, getTargetPlatformForDocument } from '../utils/targetPlatform';
import { 
    parseImportedFileSymbols, 
    ImportedFileSymbols,
    getBlocksFromImports 
} from '../parser/importResolver';
import { isInComment, isTypingImport, getQualifiedPrefix } from './providerUtils';
import { builtinFunctions, BuiltinFunctionInfo } from '../data/builtinFunctions';
import { getKeywordsForLanguage } from '../data/keywords';

/**
 * Provides auto-completion for Prog8 and ProgB files.
 * Phase 2: Local variables and scoped names completion.
 */
export class Prog8CompletionProvider implements vscode.CompletionItemProvider {
    
    /** Current document being processed (set during provideCompletionItems) */
    private currentDocument: vscode.TextDocument | undefined;

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
        
        // Store document for use by helper methods
        this.currentDocument = document;
        
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

        // Parse imported local files for their symbols
        const importedFileSymbols = await parseImportedFileSymbols(document);

        // Check if we're completing a qualified name (e.g., "txt." or "main.start.")
        const qualifiedPrefixValue = getQualifiedPrefix(linePrefix);
        
        if (qualifiedPrefixValue) {
            // Scoped completion - show only members of the specified scope
            const scopedCompletions = this.getScopedCompletions(qualifiedPrefixValue, symbols, importedFileSymbols);
            completions.push(...scopedCompletions);
        } else {
            // Regular completion - show local variables and accessible symbols
            const localVarCompletions = this.getLocalVariableCompletions(symbols, currentScope, position);
            completions.push(...localVarCompletions);
            
            // Add blocks from imported local files
            const importedBlockCompletions = this.getImportedBlockCompletions(importedFileSymbols);
            completions.push(...importedBlockCompletions);
            
            // Also add library block names for qualified access
            const libraryBlockCompletions = this.getLibraryBlockCompletions();
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
        
        const modules = getAllModules(getTargetPlatformForDocument(this.currentDocument));
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
            
            const doc = new vscode.MarkdownString();
            doc.appendCodeblock(`%import ${mod.name}`, 'prog8');
            doc.appendMarkdown(`\n\n*Library module*\n\n`);
            
            // Show blocks this module provides
            const blockNames = mod.blocks.map(b => b.name);
            if (blockNames.length > 0) {
                doc.appendMarkdown(`**Provides blocks:** \`${blockNames.join('`, `')}\`\n\n`);
            }
            
            doc.appendMarkdown(`Contains ${totalSubs} subroutines`);
            if (totalVars > 0) {
                doc.appendMarkdown(`, ${totalVars} variables`);
            }
            if (totalConsts > 0) {
                doc.appendMarkdown(`, ${totalConsts} constants`);
            }
            
            item.documentation = doc;
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
        importedFileSymbols: ImportedFileSymbols[] = []
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedNames = new Set<string>();

        // First, check if this is a library block (e.g., "txt", "sys", "cx16")
        const libraryCompletions = this.getLibraryMemberCompletions(prefix);
        completions.push(...libraryCompletions);
        libraryCompletions.forEach(item => addedNames.add(item.label as string));

        // Check if prefix is a library block.sub path (e.g., "diskio.lf_start_list")
        // to offer subroutine parameter completions
        if (prefix.includes('.') && libraryCompletions.length === 0) {
            const subMemberCompletions = this.getLibrarySubMemberCompletions(prefix);
            completions.push(...subMemberCompletions);
            subMemberCompletions.forEach(item => addedNames.add(item.label as string));
        }

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
     * Get completions for blocks from imported local files
     */
    private getImportedBlockCompletions(importedFileSymbols: ImportedFileSymbols[]): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedBlocks = new Set<string>();

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

                const doc = new vscode.MarkdownString();
                doc.appendCodeblock(`${symbol.name} { }`, 'prog8');
                doc.appendMarkdown(`\n\n*Block from imported file*\n\n`);
                doc.appendMarkdown(`Source: \`${imported.moduleName}\``);
                item.documentation = doc;

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
        
        // Get library blocks for the selected target platform
        const blocks = getAllBlocks(getTargetPlatform());
        const block = blocks.find(b => b.name === blockName);
        
        if (!block) {
            return completions;
        }

        // Add subroutines
        for (const sub of block.subroutines) {
            const item = this.createLibrarySubroutineCompletion(sub, blockName);
            completions.push(item);
        }

        // Add variables
        for (const variable of block.variables) {
            const item = this.createLibraryVariableCompletion(variable, blockName);
            completions.push(item);
        }

        // Add constants
        for (const constant of block.constants) {
            const item = this.createLibraryConstantCompletion(constant, blockName);
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

        const params = getSubroutineMembers(prefix, getTargetPlatformForDocument(this.currentDocument));
        for (const param of params) {
            const item = new vscode.CompletionItem(param.name);
            item.kind = vscode.CompletionItemKind.Field;
            item.detail = `${param.type} (parameter)`;

            const doc = new vscode.MarkdownString();
            let decl = `${param.type} ${prefix}.${param.name}`;
            if (param.register) {
                decl += ` @${param.register}`;
            }
            doc.appendCodeblock(decl, 'prog8');
            doc.appendMarkdown(`\n\n*Subroutine parameter*`);
            item.documentation = doc;
            completions.push(item);
        }

        return completions;
    }

    /**
     * Get completions for library block names (txt, sys, cx16, etc.)
     */
    private getLibraryBlockCompletions(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedBlocks = new Set<string>();
        
        const blocks = getAllBlocks(getTargetPlatform());
        for (const block of blocks) {
            if (addedBlocks.has(block.name)) {
                continue;
            }
            addedBlocks.add(block.name);
            
            const item = new vscode.CompletionItem(block.name);
            item.kind = vscode.CompletionItemKind.Module;
            item.detail = `library module`;
            
            const memberCount = block.subroutines.length + block.variables.length + block.constants.length;
            const doc = new vscode.MarkdownString();
            doc.appendMarkdown(`**${block.name}** - Prog8 library module\n\n`);
            doc.appendMarkdown(`Contains ${block.subroutines.length} subroutines`);
            if (block.variables.length > 0) {
                doc.appendMarkdown(`, ${block.variables.length} variables`);
            }
            if (block.constants.length > 0) {
                doc.appendMarkdown(`, ${block.constants.length} constants`);
            }
            item.documentation = doc;
            
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
            
            // Documentation
            const doc = new vscode.MarkdownString();
            doc.appendCodeblock(info.signature, 'prog8');
            doc.appendMarkdown(`\n\n${info.description}`);
            doc.appendMarkdown(`\n\n*Built-in function* (${info.category})`);
            item.documentation = doc;
            
            completions.push(item);
        }

        return completions;
    }

    /**
     * Check if we're typing a directive (line starts with %) - Prog8 only
     */
    private isTypingDirective(linePrefix: string, document: vscode.TextDocument): boolean {
        const isProgB = document.languageId === 'progb' || document.fileName.endsWith('.pb');
        // ProgB doesn't use % directives
        if (isProgB) {
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
        const languageId = 'prog8';

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
            
            // Documentation
            const doc = new vscode.MarkdownString();
            doc.appendCodeblock(name, languageId);
            doc.appendMarkdown(`\n\n${info.description}`);
            doc.appendMarkdown(`\n\n*Directive*`);
            item.documentation = doc;
            
            completions.push(item);
        }

        return completions;
    }

    /**
     * Get completions for language keywords
     */
    private getKeywordCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const isProgB = document.languageId === 'progb' || document.fileName.endsWith('.pb');
        const languageId = isProgB ? 'progb' : 'prog8';

        const keywords = getKeywordsForLanguage(isProgB);

        for (const [name, info] of Object.entries(keywords)) {
            // Skip directives - they are handled separately when typing %
            if (info.category === 'directive') {
                continue;
            }

            const item = new vscode.CompletionItem(name);
            item.kind = vscode.CompletionItemKind.Keyword;
            item.detail = info.category;
            
            // Lower sort priority so local/imported symbols appear first
            item.sortText = `zzzz_${name}`;
            
            // Documentation
            const doc = new vscode.MarkdownString();
            doc.appendCodeblock(name, languageId);
            doc.appendMarkdown(`\n\n${info.description}`);
            doc.appendMarkdown(`\n\n*Keyword* (${info.category})`);
            item.documentation = doc;
            
            completions.push(item);
        }

        return completions;
    }

    /**
     * Create a completion item for a library subroutine
     */
    private createLibrarySubroutineCompletion(sub: SubroutineInfo, blockName: string): vscode.CompletionItem {
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
        
        // Documentation
        const doc = new vscode.MarkdownString();
        doc.appendCodeblock(formatSubroutineSignature(sub), 'prog8');
        doc.appendMarkdown(`\n\nFrom library: \`${blockName}\``);
        if (sub.address) {
            doc.appendMarkdown(`\n\nAddress: \`${sub.address}\``);
        }
        item.documentation = doc;
        
        return item;
    }

    /**
     * Create a completion item for a library variable
     */
    private createLibraryVariableCompletion(variable: VariableInfo, blockName: string): vscode.CompletionItem {
        const item = new vscode.CompletionItem(variable.name);
        item.kind = vscode.CompletionItemKind.Variable;
        item.detail = variable.type;
        
        const doc = new vscode.MarkdownString();
        let decl = `${variable.type} ${variable.name}`;
        if (variable.isMemoryMapped) {
            decl = `&${decl}`;
        }
        doc.appendCodeblock(decl, 'prog8');
        doc.appendMarkdown(`\n\nFrom library: \`${blockName}\``);
        
        const flags: string[] = [];
        if (variable.isMemoryMapped) flags.push('memory-mapped');
        if (variable.isShared) flags.push('shared');
        if (variable.isZeroPage) flags.push('zeropage');
        if (flags.length > 0) {
            doc.appendMarkdown(`\n\n*${flags.join(', ')}*`);
        }
        
        item.documentation = doc;
        return item;
    }

    /**
     * Create a completion item for a library constant
     */
    private createLibraryConstantCompletion(constant: ConstantInfo, blockName: string): vscode.CompletionItem {
        const item = new vscode.CompletionItem(constant.name);
        item.kind = vscode.CompletionItemKind.Constant;
        item.detail = `const ${constant.type}` + (constant.value ? ` = ${constant.value}` : '');
        
        const doc = new vscode.MarkdownString();
        let decl = `const ${constant.type} ${constant.name}`;
        if (constant.value) {
            decl += ` = ${constant.value}`;
        }
        doc.appendCodeblock(decl, 'prog8');
        doc.appendMarkdown(`\n\nFrom library: \`${blockName}\``);
        item.documentation = doc;
        
        return item;
    }

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
            // Only include variables, constants, and parameters
            if (symbol.kind !== SymbolKind.Variable && 
                symbol.kind !== SymbolKind.Constant && 
                symbol.kind !== SymbolKind.Parameter) {
                continue;
            }

            // Check if this symbol is accessible from the current scope
            if (!this.isSymbolAccessible(symbol, currentScope)) {
                continue;
            }

            // Avoid duplicates
            if (addedNames.has(symbol.name)) {
                continue;
            }
            addedNames.add(symbol.name);

            // Create completion item
            const item = this.createCompletionItem(symbol);
            completions.push(item);
        }

        // Also add subroutines that are accessible from current scope
        for (const symbol of symbols) {
            if (symbol.kind !== SymbolKind.Subroutine && 
                symbol.kind !== SymbolKind.AsmSubroutine &&
                symbol.kind !== SymbolKind.ExtSubroutine) {
                continue;
            }

            if (!this.isSymbolAccessible(symbol, currentScope)) {
                continue;
            }

            if (addedNames.has(symbol.name)) {
                continue;
            }
            addedNames.add(symbol.name);

            const item = this.createCompletionItem(symbol);
            completions.push(item);
        }

        // Add blocks as they can be used for qualified access
        for (const symbol of symbols) {
            if (symbol.kind !== SymbolKind.Block) {
                continue;
            }

            if (addedNames.has(symbol.name)) {
                continue;
            }
            addedNames.add(symbol.name);

            const item = this.createCompletionItem(symbol);
            completions.push(item);
        }

        // Add labels in current scope
        for (const symbol of symbols) {
            if (symbol.kind !== SymbolKind.Label) {
                continue;
            }

            // Labels should be in the same scope
            if (symbol.parent !== currentScope) {
                continue;
            }

            if (addedNames.has(symbol.name)) {
                continue;
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

        // Add documentation
        const doc = new vscode.MarkdownString();
        doc.appendCodeblock(this.formatSymbolSignature(symbol), 'prog8');
        if (symbol.parent) {
            doc.appendMarkdown(`\n\nDefined in: \`${symbol.parent}\``);
        }
        if (sourceModule) {
            doc.appendMarkdown(`\n\nSource: \`${sourceModule}\``);
        }
        item.documentation = doc;

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

    /**
     * Format a symbol's signature for documentation
     */
    private formatSymbolSignature(symbol: UnifiedSymbol): string {
        switch (symbol.kind) {
            case SymbolKind.Variable:
                return `${symbol.type || 'var'} ${symbol.name}`;
            case SymbolKind.Constant:
                return `const ${symbol.type} ${symbol.name}${symbol.detail ? ' = ' + symbol.detail : ''}`;
            case SymbolKind.Parameter:
                return `${symbol.type} ${symbol.name}`;
            case SymbolKind.Subroutine:
                return `sub ${symbol.name}(${symbol.parameters || ''})${symbol.returnType ? ' -> ' + symbol.returnType : ''}`;
            case SymbolKind.AsmSubroutine:
                return `asmsub ${symbol.name}(${symbol.parameters || ''})`;
            case SymbolKind.ExtSubroutine:
                return `extsub ${symbol.detail || ''} = ${symbol.name}(${symbol.parameters || ''})`;
            case SymbolKind.Block:
                return `${symbol.name} { }`;
            case SymbolKind.Label:
                return `${symbol.name}:`;
            case SymbolKind.Struct:
                return `struct ${symbol.name} { }`;
            case SymbolKind.Alias:
                return `alias ${symbol.name} ${symbol.detail || ''}`;
            default:
                return symbol.name;
        }
    }

    /**
     * Provide additional information when an item is selected
     */
    resolveCompletionItem(
        item: vscode.CompletionItem,
        token: vscode.CancellationToken
    ): vscode.CompletionItem {
        // Item already has all info from provideCompletionItems
        return item;
    }
}
