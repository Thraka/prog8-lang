import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';
import { 
    getAllBlocks, 
    getAllModules,
    BlockInfo, 
    SubroutineInfo, 
    VariableInfo, 
    ConstantInfo,
    formatSubroutineSignature 
} from '../data/librarySymbols';

/**
 * Provides auto-completion for Prog8 and ProgB files.
 * Phase 2: Local variables and scoped names completion.
 */
export class Prog8CompletionProvider implements vscode.CompletionItemProvider {

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] | vscode.CompletionList {
        
        const completions: vscode.CompletionItem[] = [];

        // Parse the current document
        const symbols = unifiedParser.parseDocument(document);
        
        // Get the current scope at cursor position
        const currentScope = unifiedParser.getScopeAtPosition(symbols, position);

        // Get the text before the cursor to determine context
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        
        // Skip completion in comments
        if (this.isInComment(document, position)) {
            return completions;
        }

        // Check if we're in an import statement - show only module names
        if (this.isInImportStatement(linePrefix, document)) {
            const moduleCompletions = this.getLibraryModuleCompletions();
            completions.push(...moduleCompletions);
            return completions;
        }

        // Check if we're completing a qualified name (e.g., "txt." or "main.start.")
        const qualifiedPrefix = this.getQualifiedPrefix(linePrefix);
        
        if (qualifiedPrefix) {
            // Scoped completion - show only members of the specified scope
            const scopedCompletions = this.getScopedCompletions(qualifiedPrefix, symbols);
            completions.push(...scopedCompletions);
        } else {
            // Regular completion - show local variables and accessible symbols
            const localVarCompletions = this.getLocalVariableCompletions(symbols, currentScope, position);
            completions.push(...localVarCompletions);
            
            // Also add library block names for qualified access
            const libraryBlockCompletions = this.getLibraryBlockCompletions();
            completions.push(...libraryBlockCompletions);
        }

        return completions;
    }

    /**
     * Check if we're in an import statement context
     * Prog8: %import modulename
     * ProgB: IMPORT modulename
     */
    private isInImportStatement(linePrefix: string, document: vscode.TextDocument): boolean {
        
        // Prog8 style: %import
        if (/^%import\s+\w*$/i.test(linePrefix)) {
            return true;
        }
        
        // ProgB style: IMPORT (case insensitive)
        if (/^import\s+\w*$/i.test(linePrefix)) {
            return true;
        }
        
        return false;
    }

    /**
     * Get completions for library module names (for import statements)
     */
    private getLibraryModuleCompletions(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedModules = new Set<string>();
        
        const modules = getAllModules();
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
     * Extract the qualified prefix before the cursor (e.g., "txt" from "txt.")
     * Returns undefined if not in a qualified context
     */
    private getQualifiedPrefix(linePrefix: string): string | undefined {
        // Match identifiers followed by a dot at the end
        // e.g., "txt." -> "txt", "main.start." -> "main.start"
        const match = linePrefix.match(/([a-zA-Z_][\w]*(?:\.[a-zA-Z_][\w]*)*)\.$/);
        if (match) {
            return match[1];
        }
        return undefined;
    }

    /**
     * Get completions for members of a specific scope (qualified name completion)
     */
    private getScopedCompletions(prefix: string, symbols: UnifiedSymbol[]): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedNames = new Set<string>();

        // First, check if this is a library block (e.g., "txt", "sys", "cx16")
        const libraryCompletions = this.getLibraryMemberCompletions(prefix);
        completions.push(...libraryCompletions);
        libraryCompletions.forEach(item => addedNames.add(item.label as string));

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

        return completions;
    }

    /**
     * Get completions for library block members (e.g., txt.print, sys.memset)
     */
    private getLibraryMemberCompletions(blockName: string): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        
        // Get all library blocks (defaults to cx16 target)
        const blocks = getAllBlocks();
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
     * Get completions for library block names (txt, sys, cx16, etc.)
     */
    private getLibraryBlockCompletions(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        const addedBlocks = new Set<string>();
        
        const blocks = getAllBlocks();
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
     */
    private createCompletionItem(symbol: UnifiedSymbol): vscode.CompletionItem {
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

        // Add documentation
        const doc = new vscode.MarkdownString();
        doc.appendCodeblock(this.formatSymbolSignature(symbol), 'prog8');
        if (symbol.parent) {
            doc.appendMarkdown(`\n\nDefined in: \`${symbol.parent}\``);
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
     * Check if the position is inside a comment
     */
    private isInComment(document: vscode.TextDocument, position: vscode.Position): boolean {
        const line = document.lineAt(position.line).text;
        const textBeforeCursor = line.substring(0, position.character);

        // Check for line comment (;)
        const semiColonIndex = textBeforeCursor.indexOf(';');
        if (semiColonIndex !== -1) {
            // Make sure it's not inside a string
            const beforeSemi = textBeforeCursor.substring(0, semiColonIndex);
            const quoteCount = (beforeSemi.match(/"/g) || []).length;
            if (quoteCount % 2 === 0) {
                return true;
            }
        }

        // Check for block comment - scan from the start of file
        const text = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        let inBlockComment = false;
        let i = 0;
        while (i < text.length) {
            if (!inBlockComment && text[i] === '/' && text[i + 1] === '*') {
                inBlockComment = true;
                i += 2;
            } else if (inBlockComment && text[i] === '*' && text[i + 1] === '/') {
                inBlockComment = false;
                i += 2;
            } else {
                i++;
            }
        }

        return inBlockComment;
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
