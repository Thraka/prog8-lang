import * as vscode from 'vscode';
import { applyKeywordCasingToLine, getKeywordCasingStyle } from '../utils/keywordCasing';

/**
 * Provides document formatting for ProgB files.
 * Formats keyword casing according to the progb.keywordCasing setting.
 */
export class ProgBFormattingProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
    
    /**
     * Format the entire document (Shift+Alt+F or format on save)
     */
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        _options: vscode.FormattingOptions,
        _token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        return this.formatRange(document, 0, document.lineCount - 1);
    }
    
    /**
     * Format a selection of the document
     */
    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        _options: vscode.FormattingOptions,
        _token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        return this.formatRange(document, range.start.line, range.end.line);
    }
    
    /**
     * Format a range of lines and return the edits
     */
    private formatRange(document: vscode.TextDocument, startLine: number, endLine: number): vscode.TextEdit[] {
        const style = getKeywordCasingStyle();
        if (style === 'disabled') {
            return [];
        }
        
        const edits: vscode.TextEdit[] = [];
        
        for (let lineNum = startLine; lineNum <= endLine && lineNum < document.lineCount; lineNum++) {
            const line = document.lineAt(lineNum);
            const transformedText = applyKeywordCasingToLine(line.text, style);
            
            if (transformedText !== null) {
                edits.push(vscode.TextEdit.replace(line.range, transformedText));
            }
        }
        
        return edits;
    }
}
