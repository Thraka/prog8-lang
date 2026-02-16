import * as vscode from 'vscode';

/**
 * Provides code actions for Prog8/ProgB diagnostics.
 * Currently supports adding ignore comments to suppress specific errors.
 */
export class Prog8CodeActionProvider implements vscode.CodeActionProvider {
    
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken
    ): vscode.CodeAction[] | undefined {
        
        // Only process diagnostics from our compiler
        const prog8Diagnostics = context.diagnostics.filter(
            d => d.source === 'prog8c'
        );
        
        if (prog8Diagnostics.length === 0) {
            return undefined;
        }
        
        const actions: vscode.CodeAction[] = [];
        const processedLines = new Set<number>();
        
        for (const diagnostic of prog8Diagnostics) {
            const line = diagnostic.range.start.line;
            
            // Only create one action per line (multiple diagnostics may be on same line)
            if (processedLines.has(line)) {
                continue;
            }
            processedLines.add(line);
            
            const action = this.createIgnoreAction(document, diagnostic);
            if (action) {
                actions.push(action);
            }
        }
        
        return actions;
    }
    
    private createIgnoreAction(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction | undefined {
        const line = diagnostic.range.start.line;
        const lineText = document.lineAt(line).text;
        
        // Determine comment style based on language
        const isProgB = document.languageId === 'progb';
        const commentPrefix = isProgB ? "'" : ';';
        const ignoreComment = ` ${commentPrefix} @ignore-error`;
        
        // Check if line already has an ignore comment
        if (/(?:;|'|\brem\b)\s*(@ignore-error|prog8-ignore|noerror)\b/i.test(lineText)) {
            return undefined;
        }
        
        // Find where to insert the comment (at end of line, before any existing comment)
        const insertPosition = this.findCommentInsertPosition(lineText, isProgB);
        
        const action = new vscode.CodeAction(
            `Add '${commentPrefix} @ignore-error' to suppress this diagnostic`,
            vscode.CodeActionKind.QuickFix
        );
        
        action.diagnostics = [diagnostic];
        action.isPreferred = false;
        
        // Create the edit
        const edit = new vscode.WorkspaceEdit();
        const position = new vscode.Position(line, insertPosition);
        edit.insert(document.uri, position, ignoreComment);
        action.edit = edit;
        
        return action;
    }
    
    /**
     * Find the position to insert the ignore comment.
     * If there's already a comment on the line, insert before it.
     * Otherwise, insert at end of line.
     */
    private findCommentInsertPosition(lineText: string, isProgB: boolean): number {
        // Look for existing comment start
        // For Prog8: ; starts a comment
        // For ProgB: ' starts a comment, or REM at word boundary
        
        if (isProgB) {
            // Find ' that's not inside a string
            const quotePos = this.findCommentCharOutsideString(lineText, "'");
            if (quotePos !== -1) {
                return quotePos;
            }
            
            // Find REM keyword (case insensitive, at word boundary)
            const remMatch = lineText.match(/\brem\b/i);
            if (remMatch && remMatch.index !== undefined) {
                // Make sure it's not inside a string
                const beforeRem = lineText.substring(0, remMatch.index);
                if (this.isBalancedQuotes(beforeRem)) {
                    return remMatch.index;
                }
            }
        } else {
            // Prog8: find ; that's not inside a string
            const semicolonPos = this.findCommentCharOutsideString(lineText, ';');
            if (semicolonPos !== -1) {
                return semicolonPos;
            }
        }
        
        // No existing comment, insert at end of line (trimming trailing whitespace)
        return lineText.trimEnd().length;
    }
    
    /**
     * Find a comment character that's not inside a string literal.
     */
    private findCommentCharOutsideString(text: string, char: string): number {
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            
            if (inString) {
                if (c === stringChar) {
                    // Check for escaped quote
                    if (i + 1 < text.length && text[i + 1] === stringChar) {
                        i++; // Skip escaped quote
                    } else {
                        inString = false;
                    }
                }
            } else {
                if (c === '"' || c === "'") {
                    inString = true;
                    stringChar = c;
                } else if (c === char) {
                    return i;
                }
            }
        }
        
        return -1;
    }
    
    /**
     * Check if quotes are balanced in a string (simple check).
     */
    private isBalancedQuotes(text: string): boolean {
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            
            if (inString) {
                if (c === stringChar) {
                    if (i + 1 < text.length && text[i + 1] === stringChar) {
                        i++;
                    } else {
                        inString = false;
                    }
                }
            } else {
                if (c === '"' || c === "'") {
                    inString = true;
                    stringChar = c;
                }
            }
        }
        
        return !inString;
    }
}
