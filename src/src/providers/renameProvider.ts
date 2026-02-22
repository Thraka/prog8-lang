import * as vscode from 'vscode';
import * as path from 'path';
import { unifiedParser, UnifiedSymbol } from '../parser';
import { isPositionInLineComment } from './providerUtils';
import {
    getAllAccessibleSymbols,
    findSymbolInAccessible,
    resolveStructMemberInAccessible,
    isLibrarySymbol
} from '../parser/symbolAggregator';

/**
 * Provides "Rename Symbol" (F2) for Prog8/ProgB files.
 *
 * Only works for locally-defined symbols (symbols whose source is a real file
 * within the project). Library/target symbols cannot be renamed.
 *
 * Searches the current directory's .p8/.pb files for all usages of the symbol
 * and produces a WorkspaceEdit that renames them consistently.
 */
export class Prog8RenameProvider implements vscode.RenameProvider {

    // ── prepareRename ────────────────────────────────────────────────

    async prepareRename(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<{ range: vscode.Range; placeholder: string } | undefined> {

        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            throw new Error('Cannot rename this element.');
        }

        const accessible = await getAllAccessibleSymbols(document);
        const currentScope = unifiedParser.getScopeAtPosition(accessible.localSymbols, position);

        // Resolve the symbol
        let symbol = findSymbolInAccessible(word, accessible, currentScope);
        if (!symbol && word.includes('.')) {
            symbol = resolveStructMemberInAccessible(word, accessible, currentScope);
        }

        if (!symbol) {
            throw new Error('No symbol found at this position.');
        }

        // Block renaming library symbols
        if (isLibrarySymbol(symbol)) {
            throw new Error('Library symbols cannot be renamed.');
        }

        // The rename-able name is the leaf identifier
        const leafName = word.includes('.') ? word.split('.').pop()! : word;

        // Compute the range of the leaf name under the cursor
        const line = document.lineAt(position.line).text;
        const wordRange = document.getWordRangeAtPosition(
            position,
            /[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF.]*/
        );
        if (!wordRange) {
            throw new Error('Cannot rename this element.');
        }

        // If qualified, narrow to the leaf portion
        const fullText = document.getText(wordRange);
        if (fullText.includes('.')) {
            const dotIndex = fullText.lastIndexOf('.');
            const leafStart = wordRange.start.character + dotIndex + 1;
            const leafRange = new vscode.Range(
                position.line, leafStart,
                position.line, leafStart + leafName.length
            );
            return { range: leafRange, placeholder: leafName };
        }

        return { range: wordRange, placeholder: leafName };
    }

    // ── provideRenameEdits ───────────────────────────────────────────

    async provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        token: vscode.CancellationToken
    ): Promise<vscode.WorkspaceEdit | undefined> {

        // Validate new name
        if (!/^[a-zA-Z_\u00C0-\u024F\u0400-\u04FF][\w\u00C0-\u024F\u0400-\u04FF]*$/.test(newName)) {
            throw new Error(`"${newName}" is not a valid identifier.`);
        }

        const word = unifiedParser.getWordAtPosition(document, position);
        if (!word) {
            return undefined;
        }

        const accessible = await getAllAccessibleSymbols(document);
        const currentScope = unifiedParser.getScopeAtPosition(accessible.localSymbols, position);

        let symbol = findSymbolInAccessible(word, accessible, currentScope);
        if (!symbol && word.includes('.')) {
            symbol = resolveStructMemberInAccessible(word, accessible, currentScope);
        }

        if (!symbol || isLibrarySymbol(symbol)) {
            return undefined;
        }

        const searchName = word.includes('.') ? word.split('.').pop()! : word;
        const fullPath = symbol.fullPath;

        const edit = new vscode.WorkspaceEdit();

        // Collect all .p8/.pb files in the same directory (matching reference provider scope)
        const currentDir = path.dirname(document.uri.fsPath);
        const searchPattern = new vscode.RelativePattern(currentDir, '*.{p8,pb}');
        const files = await vscode.workspace.findFiles(searchPattern);

        for (const fileUri of files) {
            if (token.isCancellationRequested) {
                return edit;
            }

            try {
                const doc = await vscode.workspace.openTextDocument(fileUri);
                this.collectEditsInDocument(doc, searchName, fullPath, newName, edit);
            } catch (error) {
                console.warn(`Could not read file ${fileUri.fsPath}: ${error}`);
            }
        }

        return edit;
    }

    // ── helpers ──────────────────────────────────────────────────────

    /**
     * Scan a document for all references to the symbol and add rename edits.
     */
    private collectEditsInDocument(
        document: vscode.TextDocument,
        searchName: string,
        fullPath: string | undefined,
        newName: string,
        edit: vscode.WorkspaceEdit
    ): void {
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        const symbols = unifiedParser.parseDocument(document);

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

                if (!this.isWordBoundary(line, col, endCol)) {
                    continue;
                }

                const position = new vscode.Position(lineIndex, col);

                if (isPositionInLineComment(line, col)) {
                    continue;
                }

                if (this.isInString(line, col)) {
                    continue;
                }

                if (this.isValidReference(document, position, searchName, fullPath, symbols)) {
                    edit.replace(
                        document.uri,
                        new vscode.Range(lineIndex, col, lineIndex, endCol),
                        newName
                    );
                }
            }
        }
    }

    /**
     * Check if the match at [startCol, endCol) has proper word boundaries
     */
    private isWordBoundary(line: string, startCol: number, endCol: number): boolean {
        if (startCol > 0) {
            const charBefore = line[startCol - 1];
            // Allow dot before (qualified reference) — but the name must still match standalone
            if (this.isIdentifierChar(charBefore) && charBefore !== '.') {
                return false;
            }
        }
        if (endCol < line.length) {
            const charAfter = line[endCol];
            // Allow dot after (qualified reference like name.something)
            if (this.isIdentifierChar(charAfter) && charAfter !== '.') {
                return false;
            }
        }
        return true;
    }

    private isIdentifierChar(char: string): boolean {
        return /[\w\u00C0-\u024F\u0400-\u04FF.]/.test(char);
    }

    /**
     * Check if a found reference is valid (refers to the same symbol)
     */
    private isValidReference(
        document: vscode.TextDocument,
        position: vscode.Position,
        searchName: string,
        targetFullPath: string | undefined,
        symbols: UnifiedSymbol[]
    ): boolean {
        const wordAtPos = unifiedParser.getWordAtPosition(document, position);
        if (!wordAtPos) {
            return false;
        }

        const scope = unifiedParser.getScopeAtPosition(symbols, position);
        const referencedSymbol = unifiedParser.findSymbol(symbols, wordAtPos, scope);

        if (targetFullPath && referencedSymbol) {
            return referencedSymbol.fullPath === targetFullPath;
        }

        if (targetFullPath) {
            const targetName = targetFullPath.split('.').pop();
            if (wordAtPos === targetName) {
                return true;
            }
            if (wordAtPos === targetFullPath) {
                return true;
            }
            return false;
        }

        return wordAtPos === searchName || wordAtPos.endsWith('.' + searchName);
    }

    private isInString(line: string, col: number): boolean {
        let inString = false;
        for (let i = 0; i < col; i++) {
            if (line[i] === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inString = !inString;
            }
        }
        return inString;
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
