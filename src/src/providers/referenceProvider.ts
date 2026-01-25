import * as vscode from 'vscode';
import * as path from 'path';
import { prog8Parser, Prog8Symbol } from '../parser/prog8Parser';

/**
 * Provides "Find All References" for Prog8 files.
 * 
 * Searches for all usages of a symbol within the current directory
 * (matching Prog8's import behavior where only same-directory files are accessible).
 */
export class Prog8ReferenceProvider implements vscode.ReferenceProvider {

    async provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Location[]> {
        
        const word = prog8Parser.getWordAtPosition(document, position);
        if (!word) {
            return [];
        }

        // Parse the current document to find the symbol definition
        const symbols = prog8Parser.parseDocument(document);
        const currentScope = prog8Parser.getScopeAtPosition(symbols, position);
        const symbol = prog8Parser.findSymbol(symbols, word, currentScope);

        // Get the target name to search for
        // Use the simple name for searching, but we'll verify matches against full path
        const searchName = word.includes('.') ? word.split('.').pop()! : word;
        const fullPath = symbol?.fullPath;

        const references: vscode.Location[] = [];

        // Get all Prog8 files in the same directory
        const currentDir = path.dirname(document.uri.fsPath);
        const searchPattern = new vscode.RelativePattern(currentDir, '*.{p8,pb}');
        const files = await vscode.workspace.findFiles(searchPattern);

        for (const fileUri of files) {
            if (token.isCancellationRequested) {
                return references;
            }

            try {
                const doc = await vscode.workspace.openTextDocument(fileUri);
                const fileRefs = this.findReferencesInDocument(doc, searchName, fullPath, context.includeDeclaration);
                references.push(...fileRefs);
            } catch (error) {
                console.warn(`Could not read file ${fileUri.fsPath}: ${error}`);
            }
        }

        return references;
    }

    /**
     * Find all references to a symbol within a document
     */
    private findReferencesInDocument(
        document: vscode.TextDocument,
        searchName: string,
        fullPath: string | undefined,
        includeDeclaration: boolean
    ): vscode.Location[] {
        const references: vscode.Location[] = [];
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        // Parse symbols to understand scope context
        const symbols = prog8Parser.parseDocument(document);

        // Build a regex to find the identifier
        // Use word boundary approach - find the name and verify boundaries manually
        const escapedName = this.escapeRegex(searchName);
        const namePattern = new RegExp(escapedName, 'g');

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            
            // Skip comment-only lines
            const trimmed = line.trim();
            if (trimmed.startsWith(';') || trimmed.startsWith('/*')) {
                continue;
            }

            let match;
            while ((match = namePattern.exec(line)) !== null) {
                const col = match.index;
                const endCol = col + searchName.length;
                
                // Check word boundaries manually
                if (!this.isWordBoundary(line, col, endCol)) {
                    continue;
                }

                const position = new vscode.Position(lineIndex, col);
                
                // Skip if this is inside a comment
                if (this.isInComment(line, col)) {
                    continue;
                }

                // Skip if inside a string
                if (this.isInString(line, col)) {
                    continue;
                }

                // Check if this reference is valid for the symbol we're looking for
                if (this.isValidReference(document, position, searchName, fullPath, symbols, includeDeclaration)) {
                    references.push(new vscode.Location(
                        document.uri,
                        new vscode.Range(lineIndex, col, lineIndex, endCol)
                    ));
                }
            }
        }

        return references;
    }

    /**
     * Check if the match at [startCol, endCol) has proper word boundaries
     */
    private isWordBoundary(line: string, startCol: number, endCol: number): boolean {
        // Check character before
        if (startCol > 0) {
            const charBefore = line[startCol - 1];
            if (this.isIdentifierChar(charBefore)) {
                return false;
            }
        }
        
        // Check character after
        if (endCol < line.length) {
            const charAfter = line[endCol];
            if (this.isIdentifierChar(charAfter)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Check if a character can be part of an identifier
     */
    private isIdentifierChar(char: string): boolean {
        return /[\w\u00C0-\u024F\u0400-\u04FF]/.test(char);
    }

    /**
     * Check if a found reference is valid (refers to the same symbol)
     */
    private isValidReference(
        document: vscode.TextDocument,
        position: vscode.Position,
        searchName: string,
        targetFullPath: string | undefined,
        symbols: Prog8Symbol[],
        includeDeclaration: boolean
    ): boolean {
        // Get the full word at this position (might include qualified path)
        const wordAtPos = prog8Parser.getWordAtPosition(document, position);
        if (!wordAtPos) {
            return false;
        }

        // Get the scope at this position
        const scope = prog8Parser.getScopeAtPosition(symbols, position);

        // Try to resolve what symbol this reference points to
        const referencedSymbol = prog8Parser.findSymbol(symbols, wordAtPos, scope);

        // Check if this is the declaration itself
        if (!includeDeclaration && referencedSymbol) {
            if (referencedSymbol.selectionRange.contains(position)) {
                return false;
            }
        }

        // If we found a symbol and have a target path, check if they match
        if (targetFullPath && referencedSymbol) {
            return referencedSymbol.fullPath === targetFullPath;
        }

        // If we have a target path but couldn't resolve the reference,
        // it might still be valid - check by name
        if (targetFullPath) {
            const targetName = targetFullPath.split('.').pop();
            // Match if word is exactly the target name (unqualified reference)
            if (wordAtPos === targetName) {
                return true;
            }
            // Or if it's a qualified reference to the target
            if (wordAtPos === targetFullPath) {
                return true;
            }
            return false;
        }

        // If no target path, just match by name
        return wordAtPos === searchName || wordAtPos.endsWith('.' + searchName);
    }

    /**
     * Check if a position is inside a line comment
     */
    private isInComment(line: string, col: number): boolean {
        const commentIndex = line.indexOf(';');
        if (commentIndex !== -1 && col > commentIndex) {
            // Make sure the semicolon isn't inside a string
            const beforeComment = line.substring(0, commentIndex);
            const quoteCount = (beforeComment.match(/"/g) || []).length;
            if (quoteCount % 2 === 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a position is inside a string literal
     */
    private isInString(line: string, col: number): boolean {
        let inString = false;
        for (let i = 0; i < col; i++) {
            if (line[i] === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inString = !inString;
            }
        }
        return inString;
    }

    /**
     * Escape special regex characters in a string
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
