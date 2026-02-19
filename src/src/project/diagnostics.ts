import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Diagnostic collection for Prog8 compiler problems.
 * Created once and reused across builds.
 */
let diagnosticCollection: vscode.DiagnosticCollection | undefined;

/**
 * Map of file URI string → (0-based line number → original line text).
 * When a diagnostic is created, the line text at compile time is stored here.
 * Used to detect stale diagnostics: if a line's text changes after compile,
 * the diagnostic on that line is considered stale and removed.
 */
let diagnosticLineTexts = new Map<string, Map<number, string>>();

/**
 * Pattern to match ignore comments in source code.
 * Supports Prog8 (;) and ProgB (' or rem) comment syntax.
 * Keywords: @ignore-error, prog8-ignore, noerror
 * Case-insensitive, allows optional text after the keyword.
 */
const IGNORE_COMMENT_PATTERN = /(?:;|'|\brem\b)\s*(@ignore-error|prog8-ignore|noerror)\b/i;

/**
 * Regex pattern to match compiler output lines.
 * Matches: SEVERITY file:///encoded/path:line:column: message
 * Groups: 1=severity, 2=file path (URL-encoded), 3=line, 4=column, 5=message
 * Note: Uses .* prefix to handle ANSI codes or other prefixes before severity
 */
const COMPILER_OUTPUT_PATTERN = /(ERROR|WARN|INFO)\s+file:\/\/\/(\S+?):(\d+):(\d+):\s*(.*)$/;

/**
 * Regex pattern to match parse error lines from the compiler.
 * These occur before ERROR/WARN/INFO messages when the compiler cannot parse the source.
 * Matches: file:///encoded/path:line:column: parse error: message
 * Groups: 1=file path (URL-encoded), 2=line, 3=column, 4=error type, 5=message
 */
const PARSE_ERROR_PATTERN = /^file:\/\/\/(\S+?):(\d+):(\d+):\s*(parse error|syntax error):\s*(.*)$/;

/**
 * Regex to strip ANSI escape codes from text
 */
const ANSI_ESCAPE_PATTERN = /\x1b\[[0-9;]*m/g;

/**
 * Parsed compiler problem
 */
export interface CompilerProblem {
    severity: 'ERROR' | 'WARN' | 'INFO';
    filePath: string;
    line: number;
    column: number;
    message: string;
}

/**
 * Initialize the diagnostic collection.
 * Call this once during extension activation.
 */
export function initDiagnostics(context: vscode.ExtensionContext): void {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('prog8');
    context.subscriptions.push(diagnosticCollection);
}

/**
 * Get the diagnostic collection instance.
 */
export function getDiagnosticCollection(): vscode.DiagnosticCollection | undefined {
    return diagnosticCollection;
}

/**
 * Clear all diagnostics.
 * Call this at the start of each build.
 */
export function clearDiagnostics(): void {
    diagnosticCollection?.clear();
    diagnosticLineTexts.clear();
    clearFileContentsCache();
}

/**
 * Decode a URL-encoded file path.
 * Handles HTML-encoded characters like %20 for spaces.
 */
function decodeFilePath(encodedPath: string): string {
    try {
        return decodeURIComponent(encodedPath);
    } catch {
        // If decoding fails, return as-is
        return encodedPath;
    }
}

/**
 * Convert a file path from compiler output to a proper local file path.
 * The compiler outputs file:/// URLs where the path may be URL-encoded.
 * 
 * @param encodedPath The path portion after file:/// (URL-encoded)
 * @param projectDir The project directory (used to resolve relative paths if needed)
 * @returns Absolute file path
 */
function normalizeFilePath(encodedPath: string, projectDir: string): string {
    // Decode URL encoding (e.g., %20 -> space)
    let decoded = decodeFilePath(encodedPath);
    
    // Handle Windows paths: file:///C:/path becomes C:/path
    // The path after file:/// on Windows starts with the drive letter
    // On Unix, it would be /path/to/file
    
    if (process.platform === 'win32') {
        // On Windows, the path might look like: C:/Users/...
        // If it starts with a drive letter pattern, use it as-is
        if (/^[A-Za-z]:/.test(decoded)) {
            // Normalize slashes for Windows
            return decoded.replace(/\//g, '\\');
        }
        // Otherwise it might be a UNC path or relative
        return decoded.replace(/\//g, '\\');
    }
    
    // On Unix, ensure the path starts with /
    if (!decoded.startsWith('/')) {
        decoded = '/' + decoded;
    }
    
    return decoded;
}

/**
 * Parse a single line of compiler output.
 * Returns a CompilerProblem if the line matches the expected format, undefined otherwise.
 */
export function parseCompilerLine(line: string, projectDir: string): CompilerProblem | undefined {
    // Strip ANSI escape codes (color formatting) before parsing
    const cleanLine = line.replace(ANSI_ESCAPE_PATTERN, '');
    
    // Try to match parse error format first (no severity prefix)
    const parseErrorMatch = cleanLine.match(PARSE_ERROR_PATTERN);
    if (parseErrorMatch) {
        const [, encodedPath, lineStr, columnStr, errorType, message] = parseErrorMatch;
        const filePath = normalizeFilePath(encodedPath, projectDir);
        const cleanMessage = message.replace(ANSI_ESCAPE_PATTERN, '').trim();
        
        return {
            severity: 'ERROR',  // Parse errors are always critical
            filePath,
            line: parseInt(lineStr, 10),
            column: parseInt(columnStr, 10),
            message: `${errorType}: ${cleanMessage}`
        };
    }
    
    // Try standard format with severity prefix
    const match = cleanLine.match(COMPILER_OUTPUT_PATTERN);
    if (!match) {
        return undefined;
    }
    
    const [, severity, encodedPath, lineStr, columnStr, message] = match;
    const filePath = normalizeFilePath(encodedPath, projectDir);
    
    // Also clean ANSI codes from the message (in case any remain)
    const cleanMessage = message.replace(ANSI_ESCAPE_PATTERN, '').trim();
    
    return {
        severity: severity as 'ERROR' | 'WARN' | 'INFO',
        filePath,
        line: parseInt(lineStr, 10),
        column: parseInt(columnStr, 10),
        message: cleanMessage
    };
}

/**
 * Parse all lines from compiler output and extract problems.
 */
export function parseCompilerOutput(output: string, projectDir: string): CompilerProblem[] {
    const problems: CompilerProblem[] = [];
    const lines = output.split(/\r?\n/);
    
    for (const line of lines) {
        const problem = parseCompilerLine(line.trim(), projectDir);
        if (problem) {
            problems.push(problem);
        }
    }
    
    return problems;
}

/**
 * Convert severity string to VS Code DiagnosticSeverity.
 */
function toVSCodeSeverity(severity: 'ERROR' | 'WARN' | 'INFO'): vscode.DiagnosticSeverity {
    switch (severity) {
        case 'ERROR':
            return vscode.DiagnosticSeverity.Error;
        case 'WARN':
            return vscode.DiagnosticSeverity.Warning;
        case 'INFO':
            return vscode.DiagnosticSeverity.Information;
    }
}

/**
 * Cache for file contents to avoid re-reading files multiple times.
 * Cleared for each build via clearDiagnostics().
 */
let fileContentsCache = new Map<string, string[] | null>();

/**
 * Clear the file contents cache.
 */
function clearFileContentsCache(): void {
    fileContentsCache.clear();
}

/**
 * Get lines of a file (cached).
 * Returns null if file cannot be read.
 */
function getFileLines(filePath: string): string[] | null {
    if (fileContentsCache.has(filePath)) {
        return fileContentsCache.get(filePath) ?? null;
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split(/\r?\n/);
        fileContentsCache.set(filePath, lines);
        return lines;
    } catch {
        fileContentsCache.set(filePath, null);
        return null;
    }
}

/**
 * Check if a specific line in a file has an ignore comment.
 * 
 * @param filePath Path to the source file
 * @param lineNumber 1-based line number
 * @returns true if the line contains an ignore comment
 */
function hasIgnoreComment(filePath: string, lineNumber: number): boolean {
    const lines = getFileLines(filePath);
    if (!lines) {
        return false;
    }
    
    // Convert to 0-based index
    const lineIndex = lineNumber - 1;
    if (lineIndex < 0 || lineIndex >= lines.length) {
        return false;
    }
    
    const line = lines[lineIndex];
    return IGNORE_COMMENT_PATTERN.test(line);
}

/**
 * Create VS Code diagnostics from parsed compiler problems.
 * Groups diagnostics by file and adds them to the diagnostic collection.
 * Skips problems on lines that contain ignore comments.
 * 
 * @param problems Array of parsed compiler problems
 * @returns Number of problems that were ignored
 */
export function addDiagnosticsFromProblems(problems: CompilerProblem[]): number {
    if (!diagnosticCollection) {
        console.error('Diagnostic collection not initialized');
        return 0;
    }
    
    // Group problems by file
    const diagnosticsByFile = new Map<string, vscode.Diagnostic[]>();
    let ignoredCount = 0;
    
    for (const problem of problems) {
        // Check for ignore comment on this line
        if (hasIgnoreComment(problem.filePath, problem.line)) {
            ignoredCount++;
            continue;
        }
        
        // Convert to 0-based line/column for VS Code
        const line = Math.max(0, problem.line - 1);
        const column = Math.max(0, problem.column - 1);
        
        // Create range - just highlight from the column to end of line
        // We don't know the actual span, so we use a reasonable default
        const range = new vscode.Range(line, column, line, column + 50);
        
        const diagnostic = new vscode.Diagnostic(
            range,
            problem.message,
            toVSCodeSeverity(problem.severity)
        );
        diagnostic.source = 'prog8c';
        
        // Capture the original line text for stale diagnostic detection
        const sourceLines = getFileLines(problem.filePath);
        if (sourceLines && line >= 0 && line < sourceLines.length) {
            const fileUri2 = vscode.Uri.file(problem.filePath);
            const fileKey2 = fileUri2.toString();
            if (!diagnosticLineTexts.has(fileKey2)) {
                diagnosticLineTexts.set(fileKey2, new Map());
            }
            diagnosticLineTexts.get(fileKey2)!.set(line, sourceLines[line]);
        }
        
        // Get or create the array for this file
        const fileUri = vscode.Uri.file(problem.filePath);
        const fileKey = fileUri.toString();
        
        if (!diagnosticsByFile.has(fileKey)) {
            diagnosticsByFile.set(fileKey, []);
        }
        diagnosticsByFile.get(fileKey)!.push(diagnostic);
    }
    
    // Add all diagnostics to the collection
    for (const [fileKey, diagnostics] of diagnosticsByFile) {
        const uri = vscode.Uri.parse(fileKey);
        diagnosticCollection.set(uri, diagnostics);
    }
    
    return ignoredCount;
}

/**
 * Adjust diagnostic positions after a document edit.
 * When lines are inserted or deleted, diagnostics and their associated line texts
 * must be shifted so they continue to point at the correct code.
 * 
 * Call this BEFORE removeStaleDiagnostics so the stale check compares
 * against the correct (shifted) lines.
 * 
 * @param document The document that changed
 * @param contentChanges The content changes from the TextDocumentChangeEvent
 */
export function adjustDiagnosticPositions(
    document: vscode.TextDocument,
    contentChanges: readonly vscode.TextDocumentContentChangeEvent[]
): void {
    if (!diagnosticCollection || contentChanges.length === 0) {
        return;
    }

    const fileKey = document.uri.toString();
    const currentDiagnostics = diagnosticCollection.get(document.uri);
    if (!currentDiagnostics || currentDiagnostics.length === 0) {
        return;
    }

    // Process each change to compute how lines shift.
    // VS Code provides changes in reverse document order when there are multiple,
    // so processing them in order is safe (later changes don't affect earlier positions).
    for (const change of contentChanges) {
        const changeStartLine = change.range.start.line;
        const oldLineCount = change.range.end.line - change.range.start.line;
        const newLineCount = (change.text.match(/\n/g) || []).length;
        const lineDelta = newLineCount - oldLineCount;

        if (lineDelta === 0) {
            // No line shift, only in-line text change — nothing to adjust
            continue;
        }

        // Rebuild diagnostics with shifted ranges
        const adjusted: vscode.Diagnostic[] = [];
        for (const diag of currentDiagnostics) {
            const diagLine = diag.range.start.line;

            if (diagLine <= changeStartLine) {
                // Diagnostic is at or before the change point — no shift needed
                adjusted.push(diag);
            } else if (diagLine > changeStartLine + oldLineCount) {
                // Diagnostic is after the changed region — shift by delta
                const newLine = diagLine + lineDelta;
                if (newLine >= 0) {
                    const newDiag = new vscode.Diagnostic(
                        new vscode.Range(
                            newLine,
                            diag.range.start.character,
                            newLine + (diag.range.end.line - diag.range.start.line),
                            diag.range.end.character
                        ),
                        diag.message,
                        diag.severity
                    );
                    newDiag.source = diag.source;
                    newDiag.code = diag.code;
                    newDiag.relatedInformation = diag.relatedInformation;
                    newDiag.tags = diag.tags;
                    adjusted.push(newDiag);
                }
                // else: shifted to negative line, drop the diagnostic
            } else {
                // Diagnostic is inside the changed region — it may be invalidated,
                // but keep it at the same position; removeStaleDiagnostics will
                // catch it if the text changed
                adjusted.push(diag);
            }
        }

        // Also shift the stored line texts
        const lineTexts = diagnosticLineTexts.get(fileKey);
        if (lineTexts) {
            const newLineTexts = new Map<number, string>();
            for (const [lineNum, text] of lineTexts) {
                if (lineNum <= changeStartLine) {
                    newLineTexts.set(lineNum, text);
                } else if (lineNum > changeStartLine + oldLineCount) {
                    const newLine = lineNum + lineDelta;
                    if (newLine >= 0) {
                        newLineTexts.set(newLine, text);
                    }
                } else {
                    // Inside the changed region — keep at same position,
                    // stale check will handle text comparison
                    newLineTexts.set(lineNum, text);
                }
            }
            diagnosticLineTexts.set(fileKey, newLineTexts);
        }

        // Update the collection so subsequent changes see the shifted positions
        diagnosticCollection.set(document.uri, adjusted);
    }
}

/**
 * Remove stale diagnostics from a document.
 * Compares each diagnostic's line text against the stored original text from compile time.
 * If the line text has changed, the diagnostic is removed as stale.
 * If the line text is the same, the diagnostic is kept.
 * 
 * @param document The document to check for stale diagnostics
 */
export function removeStaleDiagnostics(document: vscode.TextDocument): void {
    if (!diagnosticCollection) {
        return;
    }

    const fileKey = document.uri.toString();
    const lineTexts = diagnosticLineTexts.get(fileKey);
    if (!lineTexts || lineTexts.size === 0) {
        return;
    }

    const currentDiagnostics = diagnosticCollection.get(document.uri);
    if (!currentDiagnostics || currentDiagnostics.length === 0) {
        return;
    }

    const remaining: vscode.Diagnostic[] = [];
    for (const diag of currentDiagnostics) {
        const lineNum = diag.range.start.line;
        const originalText = lineTexts.get(lineNum);

        if (originalText === undefined) {
            // No stored text for this line, keep the diagnostic
            remaining.push(diag);
            continue;
        }

        if (lineNum < document.lineCount) {
            const currentText = document.lineAt(lineNum).text;
            if (currentText === originalText) {
                // Line hasn't changed, keep the diagnostic
                remaining.push(diag);
            } else {
                // Line changed, diagnostic is stale — drop it and clean up stored text
                lineTexts.delete(lineNum);
            }
        }
        // If line no longer exists in the document, drop the diagnostic
    }

    if (remaining.length !== currentDiagnostics.length) {
        diagnosticCollection.set(document.uri, remaining);
        if (lineTexts.size === 0) {
            diagnosticLineTexts.delete(fileKey);
        }
    }
}

/**
 * Process compiler output: parse problems and add them as diagnostics.
 * This is the main entry point for handling compiler output.
 * 
 * @param output The complete compiler output
 * @param projectDir The project directory
 * @returns The number of problems found and ignored
 */
export function processCompilerOutput(output: string, projectDir: string): { errors: number; warnings: number; infos: number; ignored: number } {
    const problems = parseCompilerOutput(output, projectDir);
    
    const counts = {
        errors: problems.filter(p => p.severity === 'ERROR').length,
        warnings: problems.filter(p => p.severity === 'WARN').length,
        infos: problems.filter(p => p.severity === 'INFO').length,
        ignored: 0
    };
    
    counts.ignored = addDiagnosticsFromProblems(problems);
    
    return counts;
}
