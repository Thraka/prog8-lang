import * as vscode from 'vscode';

/**
 * Shared utility functions for Prog8/ProgB language providers.
 * Centralizes common operations like comment detection and import statement parsing.
 */

/**
 * Check if a position is within an import statement.
 * Works for both Prog8 (%import) and ProgB (IMPORT) syntax.
 */
export function isInImportStatement(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line).text;
    const trimmed = line.trim();
    
    // Prog8 style: %import modulename
    if (/^%import\s+\w+/i.test(trimmed)) {
        return true;
    }
    
    // ProgB style: IMPORT modulename (case insensitive)
    if (/^import\s+\w+/i.test(trimmed)) {
        return true;
    }
    
    return false;
}

/**
 * Check if a line prefix indicates we're typing in an import statement.
 * Used for completion triggering.
 */
export function isTypingImport(linePrefix: string): boolean {
    const trimmed = linePrefix.trim();
    
    // Prog8 style: %import (with optional partial module name)
    if (/^%import\s+\w*$/i.test(trimmed)) {
        return true;
    }
    
    // ProgB style: IMPORT (case insensitive)
    if (/^import\s+\w*$/i.test(trimmed)) {
        return true;
    }
    
    return false;
}

/**
 * Check if a position is inside a comment.
 * Handles both line comments (;) and block comments.
 * 
 * @param document The text document
 * @param position The position to check
 * @returns true if the position is inside a comment
 */
export function isInComment(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line).text;
    const textBeforeCursor = line.substring(0, position.character);

    // Check for Prog8 line comment (;)
    const semiColonIndex = textBeforeCursor.indexOf(';');
    if (semiColonIndex !== -1) {
        // Make sure it's not inside a string
        const beforeSemi = textBeforeCursor.substring(0, semiColonIndex);
        const quoteCount = (beforeSemi.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
            return true;
        }
    }

    // Check for ProgB line comment (')
    const apostropheIndex = textBeforeCursor.indexOf("'");
    if (apostropheIndex !== -1) {
        // Make sure it's not inside a string
        const beforeApos = textBeforeCursor.substring(0, apostropheIndex);
        const quoteCount = (beforeApos.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
            return true;
        }
    }

    // Check for block comment - scan from the start of file
    const text = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    let inBlockComment = false;
    let i = 0;
    while (i < text.length) {
        // Prog8 block comment: /* */
        if (!inBlockComment && text[i] === '/' && text[i + 1] === '*') {
            inBlockComment = true;
            i += 2;
        } else if (inBlockComment && text[i] === '*' && text[i + 1] === '/') {
            inBlockComment = false;
            i += 2;
        // ProgB block comment: /' '/
        } else if (!inBlockComment && text[i] === '/' && text[i + 1] === "'") {
            inBlockComment = true;
            i += 2;
        } else if (inBlockComment && text[i] === "'" && text[i + 1] === '/') {
            inBlockComment = false;
            i += 2;
        } else {
            i++;
        }
    }

    return inBlockComment;
}

/**
 * Check if a specific column in a line is inside a comment.
 * Simpler version for line-by-line processing.
 * 
 * @param line The line text
 * @param col The column position to check
 * @returns true if the position is inside a comment
 */
export function isPositionInLineComment(line: string, col: number): boolean {
    const textBeforeCol = line.substring(0, col);
    
    // Check for Prog8 line comment (;)
    const semiColonIndex = textBeforeCol.indexOf(';');
    if (semiColonIndex !== -1) {
        const beforeSemi = textBeforeCol.substring(0, semiColonIndex);
        const quoteCount = (beforeSemi.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
            return true;
        }
    }
    
    // Check for ProgB line comment (')
    const apostropheIndex = textBeforeCol.indexOf("'");
    if (apostropheIndex !== -1) {
        const beforeApos = textBeforeCol.substring(0, apostropheIndex);
        const quoteCount = (beforeApos.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
            return true;
        }
    }
    
    return false;
}

/**
 * Get the qualified name at a position (e.g., "txt.print" from hovering over "print")
 */
export function getQualifiedNameAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
    const line = document.lineAt(position.line).text;
    
    // Find the start of the identifier chain
    let start = position.character;
    while (start > 0 && /[\w.]/.test(line[start - 1])) {
        start--;
    }
    
    // Find the end of the identifier chain
    let end = position.character;
    while (end < line.length && /[\w.]/.test(line[end])) {
        end++;
    }
    
    const fullName = line.substring(start, end);
    
    // Only return if it looks like a qualified name
    if (fullName && /^\w+\.\w+$/.test(fullName)) {
        return fullName;
    }
    
    return undefined;
}

/**
 * Extract the qualified prefix before the cursor (e.g., "txt" from "txt.")
 * Used for scoped completions.
 * 
 * @param linePrefix The text on the line before the cursor
 * @returns The prefix if in a qualified context, undefined otherwise
 */
export function getQualifiedPrefix(linePrefix: string): string | undefined {
    // Match identifiers followed by a dot at the end
    // e.g., "txt." -> "txt", "main.start." -> "main.start"
    const match = linePrefix.match(/([a-zA-Z_][\w]*(?:\.[a-zA-Z_][\w]*)*)\.$/);
    if (match) {
        return match[1];
    }
    return undefined;
}
