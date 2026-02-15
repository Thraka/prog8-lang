import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol } from '../parser';
import { isPositionInLineComment } from './providerUtils';
import { 
    getAllAccessibleSymbols, 
    findSymbolInAccessible, 
    resolveStructMemberInAccessible 
} from '../parser/symbolAggregator';

/**
 * Provides "Find All References" for Prog8 files.
 * 
 * Searches for all usages of a symbol within the current directory
 * and in imported files (matching Prog8's import behavior).
 */
export class Prog8ReferenceProvider implements vscode.ReferenceProvider {

    async provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Location[]> {
        
        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            return [];
        }

        const accessible = await getAllAccessibleSymbols(document);
        const currentScope = unifiedParser.getScopeAtPosition(accessible.localSymbols, position);
        
        // Find the symbol definition via unified lookup
        let symbol = findSymbolInAccessible(word, accessible, currentScope);
        
        // If not found, try struct member access resolution
        if (!symbol && word.includes('.')) {
            symbol = resolveStructMemberInAccessible(word, accessible, currentScope);
        }

        // Get the target name to search for
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
        const symbols = unifiedParser.parseDocument(document);

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
                if (isPositionInLineComment(line, col)) {
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
        symbols: UnifiedSymbol[],
        includeDeclaration: boolean
    ): boolean {
        // Get the full word at this position (might include qualified path)
        const wordAtPos = unifiedParser.getWordAtPosition(document, position);
        if (!wordAtPos) {
            return false;
        }

        // Get the scope at this position
        const scope = unifiedParser.getScopeAtPosition(symbols, position);

        // Try to resolve what symbol this reference points to
        const referencedSymbol = unifiedParser.findSymbol(symbols, wordAtPos, scope);

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
