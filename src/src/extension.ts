import * as vscode from 'vscode';
import { Prog8DocumentSymbolProvider } from './providers/documentSymbolProvider';
import { Prog8DefinitionProvider } from './providers/definitionProvider';
import { Prog8HoverProvider } from './providers/hoverProvider';
import { Prog8WorkspaceSymbolProvider } from './providers/workspaceSymbolProvider';
import { Prog8ReferenceProvider } from './providers/referenceProvider';
import { Prog8CompletionProvider } from './providers/completionProvider';
import { ProgBFormattingProvider } from './providers/formattingProvider';
import { Prog8SemanticTokensProvider, semanticTokensLegend } from './providers/semanticTokenProvider';
import { Prog8CodeActionProvider } from './providers/codeActionProvider';
import { applyKeywordCasingToLine, applyKeywordCasingToLineRange, getKeywordCasingStyle, findBlockStart, applyCommaSpacingToLine, applyCommaSpacingToLineRange, getFormatCommaSpacing } from './utils/progbAutoFormat';
import { createStatusBarItem, selectTargetPlatform } from './utils/targetPlatform';
import { Prog8DebugConfigurationProvider, Prog8DebugAdapterDescriptorFactory } from './project/debugConfigProvider';
import { runCurrentProject, buildCurrentProject, disposeProjectRunner } from './project/projectRunner';
import { initializeProject } from './project/projectFile';
import { initDiagnostics } from './project/diagnostics';

export function activate(context: vscode.ExtensionContext) {
    console.log('Prog8 Language Support is now active');

    // Initialize diagnostic collection for compiler errors/warnings
    initDiagnostics(context);

    // Register the target platform selection command
    context.subscriptions.push(
        vscode.commands.registerCommand('prog8.selectTargetPlatform', selectTargetPlatform)
    );

    // Register project build/run commands
    context.subscriptions.push(
        vscode.commands.registerCommand('prog8.initProject', initializeProject)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('prog8.runProject', runCurrentProject)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('prog8.buildProject', buildCurrentProject)
    );

    // Register debug configuration provider for F5 support
    const debugProvider = new Prog8DebugConfigurationProvider();
    context.subscriptions.push(
        vscode.debug.registerDebugConfigurationProvider('prog8', debugProvider)
    );
    context.subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory('prog8', new Prog8DebugAdapterDescriptorFactory())
    );

    // Create and show the target platform status bar item
    createStatusBarItem(context);

    // Document selectors for both prog8 and progb
    const prog8Selector: vscode.DocumentSelector = [
        { language: 'prog8', scheme: 'file' },
        { language: 'progb', scheme: 'file' }
    ];

    // Register Document Symbol Provider for outline view
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            prog8Selector,
            new Prog8DocumentSymbolProvider()
        )
    );

    // Register Definition Provider for "Go to Definition"
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            prog8Selector,
            new Prog8DefinitionProvider()
        )
    );

    // Register Hover Provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            prog8Selector,
            new Prog8HoverProvider()
        )
    );

    // Register Workspace Symbol Provider for "Go to Symbol in Workspace" (Ctrl+T)
    context.subscriptions.push(
        vscode.languages.registerWorkspaceSymbolProvider(
            new Prog8WorkspaceSymbolProvider()
        )
    );

    // Register Reference Provider for "Find All References" (Shift+F12)
    context.subscriptions.push(
        vscode.languages.registerReferenceProvider(
            prog8Selector,
            new Prog8ReferenceProvider()
        )
    );

    // Register Semantic Tokens Provider for rich highlighting beyond TextMate
    context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
            prog8Selector,
            new Prog8SemanticTokensProvider(),
            semanticTokensLegend
        )
    );

    // Register Code Action Provider for quick fixes (e.g., ignore error comments)
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            prog8Selector,
            new Prog8CodeActionProvider(),
            {
                providedCodeActionKinds: Prog8CodeActionProvider.providedCodeActionKinds
            }
        )
    );

    // Register Completion Provider for auto-completion (Ctrl+Space)
    // Prog8 gets % trigger for directives
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: 'prog8', scheme: 'file' },
            new Prog8CompletionProvider(),
            '.', // Trigger on dot for qualified names
            '@', // Trigger on @ for tags
            '%'  // Trigger on % for directives (Prog8 only)
        )
    );

    // ProgB does not use % directives
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: 'progb', scheme: 'file' },
            new Prog8CompletionProvider(),
            '.', // Trigger on dot for qualified names
            '@'  // Trigger on @ for tags
        )
    );

    // ProgB Keyword Casing: Auto-format keywords when leaving a line
    // This avoids interfering with undo while typing
    let previousLine: number | undefined;
    let previousDocument: vscode.TextDocument | undefined;
    
    // Track lines that were modified (e.g., by paste) that need formatting
    const pendingLines = new Set<number>();

    /**
     * Apply keyword casing and comma spacing to a single line, and if it's an END block,
     * format the entire block from opener to closer.
     */
    async function applyFormattingToLine(document: vscode.TextDocument, lineNum: number): Promise<void> {
        const style = getKeywordCasingStyle(document);
        const commaSpacing = getFormatCommaSpacing(document);
        
        if (style === 'disabled' && !commaSpacing) {
            return;
        }
        
        if (lineNum < 0 || lineNum >= document.lineCount) {
            return;
        }
        
        const lineText = document.lineAt(lineNum).text;
        
        // Check if this line is a block closer (END SUB, END MODULE, NEXT, WEND, LOOP, etc.)
        const blockStartLine = findBlockStart(document, lineNum);
        
        if (blockStartLine !== null && blockStartLine < lineNum) {
            // Format the entire block from opener to closer (keyword casing)
            if (style !== 'disabled') {
                await applyKeywordCasingToLineRange(document, blockStartLine, lineNum, style);
            }
            // Also apply comma spacing to the block range
            if (commaSpacing) {
                await applyCommaSpacingToLineRange(document, blockStartLine, lineNum);
            }
        } else {
            // Just format this single line
            let text = lineText;
            let changed = false;
            
            if (style !== 'disabled') {
                const casedText = applyKeywordCasingToLine(text, style);
                if (casedText !== null) {
                    text = casedText;
                    changed = true;
                }
            }
            
            if (commaSpacing) {
                const spacedText = applyCommaSpacingToLine(text);
                if (spacedText !== null) {
                    text = spacedText;
                    changed = true;
                }
            }
            
            if (changed) {
                const workspaceEdit = new vscode.WorkspaceEdit();
                workspaceEdit.replace(document.uri, document.lineAt(lineNum).range, text);
                await vscode.workspace.applyEdit(workspaceEdit);
            }
        }
    }

    /**
     * Apply formatting to all pending lines (from paste operations)
     */
    async function applyFormattingToPendingLines(document: vscode.TextDocument): Promise<void> {
        const style = getKeywordCasingStyle(document);
        const commaSpacing = getFormatCommaSpacing(document);
        
        if ((style === 'disabled' && !commaSpacing) || pendingLines.size === 0) {
            pendingLines.clear();
            return;
        }
        
        // Get sorted list of line numbers
        const lines = Array.from(pendingLines).sort((a, b) => a - b);
        pendingLines.clear();
        
        // Format all the lines at once
        const minLine = lines[0];
        const maxLine = lines[lines.length - 1];
        
        if (minLine >= 0 && maxLine < document.lineCount) {
            if (style !== 'disabled') {
                await applyKeywordCasingToLineRange(document, minLine, maxLine, style);
            }
            if (commaSpacing) {
                await applyCommaSpacingToLineRange(document, minLine, maxLine);
            }
        }
    }

    // Listen for document changes to detect paste operations
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            // Only process ProgB files
            if (event.document.languageId !== 'progb') {
                return;
            }
            
            if (getKeywordCasingStyle(event.document) === 'disabled' && !getFormatCommaSpacing(event.document)) {
                return;
            }
            
            // Track all lines affected by changes (especially multi-line pastes)
            for (const change of event.contentChanges) {
                const startLine = change.range.start.line;
                const newLineCount = (change.text.match(/\n/g) || []).length;
                
                // Add all affected lines to pending set
                for (let i = 0; i <= newLineCount; i++) {
                    const lineNum = startLine + i;
                    if (lineNum < event.document.lineCount) {
                        pendingLines.add(lineNum);
                    }
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(async event => {
            const editor = event.textEditor;
            const document = editor.document;
            
            // Only process ProgB files
            if (document.languageId !== 'progb') {
                previousLine = undefined;
                previousDocument = undefined;
                pendingLines.clear();
                return;
            }
            
            const currentLine = editor.selection.active.line;
            
            // Apply casing to the previous line when we move to a different line,
            // but ONLY if that line was actually edited (not just scrolled past)
            if (previousLine !== undefined && 
                previousDocument !== undefined &&
                previousDocument === document &&
                currentLine !== previousLine) {
                
                if (pendingLines.size > 1) {
                    // Multi-line change detected (paste), format all pending lines
                    await applyFormattingToPendingLines(document);
                } else if (pendingLines.has(previousLine)) {
                    // Single line was edited, apply with block check
                    pendingLines.clear();
                    await applyFormattingToLine(document, previousLine);
                } else {
                    // Line was not edited (just scrolled/clicked), skip formatting
                    pendingLines.clear();
                }
            }
            
            // Track the current line for next time
            previousLine = currentLine;
            previousDocument = document;
        })
    );

    // Also apply casing when switching away from a ProgB document
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async event => {
            // Apply casing to pending lines or previous line before switching editors,
            // but only if those lines were actually edited
            if (previousDocument !== undefined && previousDocument.languageId === 'progb') {
                if (pendingLines.size > 1) {
                    await applyFormattingToPendingLines(previousDocument);
                } else if (previousLine !== undefined && pendingLines.has(previousLine)) {
                    pendingLines.clear();
                    await applyFormattingToLine(previousDocument, previousLine);
                } else {
                    pendingLines.clear();
                }
            }
            
            // Reset tracking for the new editor
            pendingLines.clear();
            if (event && event.document.languageId === 'progb') {
                previousLine = event.selection.active.line;
                previousDocument = event.document;
            } else {
                previousLine = undefined;
                previousDocument = undefined;
            }
        })
    );

    // Register Formatting Providers for ProgB (Shift+Alt+F, format on save, format selection)
    const progbFormattingProvider = new ProgBFormattingProvider();
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            { language: 'progb', scheme: 'file' },
            progbFormattingProvider
        )
    );
    context.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(
            { language: 'progb', scheme: 'file' },
            progbFormattingProvider
        )
    );
}

export function deactivate() {
    disposeProjectRunner();
    console.log('Prog8 Language Support deactivated');
}
