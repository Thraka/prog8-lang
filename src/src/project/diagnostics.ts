import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Diagnostic collection for Prog8 compiler problems.
 * Created once and reused across builds.
 */
let diagnosticCollection: vscode.DiagnosticCollection | undefined;

/**
 * Regex pattern to match compiler output lines.
 * Matches: SEVERITY file:///encoded/path:line:column: message
 * Groups: 1=severity, 2=file path (URL-encoded), 3=line, 4=column, 5=message
 * Note: Uses .* prefix to handle ANSI codes or other prefixes before severity
 */
const COMPILER_OUTPUT_PATTERN = /(ERROR|WARN|INFO)\s+file:\/\/\/(\S+?):(\d+):(\d+):\s*(.*)$/;

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
 * Create VS Code diagnostics from parsed compiler problems.
 * Groups diagnostics by file and adds them to the diagnostic collection.
 * 
 * @param problems Array of parsed compiler problems
 */
export function addDiagnosticsFromProblems(problems: CompilerProblem[]): void {
    if (!diagnosticCollection) {
        console.error('Diagnostic collection not initialized');
        return;
    }
    
    // Group problems by file
    const diagnosticsByFile = new Map<string, vscode.Diagnostic[]>();
    
    for (const problem of problems) {
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
}

/**
 * Process compiler output: parse problems and add them as diagnostics.
 * This is the main entry point for handling compiler output.
 * 
 * @param output The complete compiler output
 * @param projectDir The project directory
 * @returns The number of problems found
 */
export function processCompilerOutput(output: string, projectDir: string): { errors: number; warnings: number; infos: number } {
    const problems = parseCompilerOutput(output, projectDir);
    
    const counts = {
        errors: problems.filter(p => p.severity === 'ERROR').length,
        warnings: problems.filter(p => p.severity === 'WARN').length,
        infos: problems.filter(p => p.severity === 'INFO').length
    };
    
    addDiagnosticsFromProblems(problems);
    
    return counts;
}
