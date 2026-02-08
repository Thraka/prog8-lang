import * as vscode from 'vscode';
import { applyKeywordCasingToLine, getKeywordCasingStyle, applyCommaSpacingToLine, getFormatCommaSpacing } from '../utils/progbAutoFormat';

/**
 * Provides document formatting for ProgB files.
 * Formats keyword casing and comma spacing according to settings.
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
        const casingStyle = getKeywordCasingStyle(document);
        const commaSpacing = getFormatCommaSpacing(document);
        
        if (casingStyle === 'disabled' && !commaSpacing) {
            return [];
        }
        
        const edits: vscode.TextEdit[] = [];
        
        for (let lineNum = startLine; lineNum <= endLine && lineNum < document.lineCount; lineNum++) {
            const line = document.lineAt(lineNum);
            let text = line.text;
            let changed = false;
            
            // Apply keyword casing first
            if (casingStyle !== 'disabled') {
                const casedText = applyKeywordCasingToLine(text, casingStyle);
                if (casedText !== null) {
                    text = casedText;
                    changed = true;
                }
            }
            
            // Then apply comma spacing
            if (commaSpacing) {
                const spacedText = applyCommaSpacingToLine(text);
                if (spacedText !== null) {
                    text = spacedText;
                    changed = true;
                }
            }
            
            if (changed) {
                edits.push(vscode.TextEdit.replace(line.range, text));
            }
        }
        
        return edits;
    }
}
