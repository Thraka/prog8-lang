import * as vscode from 'vscode';
import { unifiedParser, UnifiedSymbol, SymbolKind } from '../parser';

/**
 * Provides auto-completion for Prog8 and ProgB files.
 * Phase 2: Local variables completion.
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

        // Add local variable completions
        const localVarCompletions = this.getLocalVariableCompletions(symbols, currentScope, position);
        completions.push(...localVarCompletions);

        return completions;
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
