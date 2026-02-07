import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { progbKeywords, progbBlockPairs } from '../data/keywords';
import { PROJECT_FILE_NAME } from '../project/projectFile';

/**
 * Supported keyword casing styles for ProgB
 */
export type KeywordCasingStyle = 'upper' | 'lower' | 'camel' | 'disabled';

/**
 * Cache for project settings to avoid repeated file reads
 * Key: project directory path, Value: { settings, mtime }
 */
const projectSettingsCache = new Map<string, { settings: any; mtime: number }>();

/**
 * Get project-level ProgB settings if available, with caching
 */
function getProjectProgbSettings(document?: vscode.TextDocument): { keywordCasing?: KeywordCasingStyle; formatCommaSpacing?: boolean } | undefined {
    if (!document) {
        return undefined;
    }
    
    const dir = path.dirname(document.uri.fsPath);
    const projectPath = path.join(dir, PROJECT_FILE_NAME);
    
    if (!fs.existsSync(projectPath)) {
        return undefined;
    }
    
    try {
        // Check cache first
        const stats = fs.statSync(projectPath);
        const cached = projectSettingsCache.get(projectPath);
        
        if (cached && cached.mtime === stats.mtimeMs) {
            return cached.settings;
        }
        
        // Read and parse file
        const content = fs.readFileSync(projectPath, 'utf-8');
        const json = JSON.parse(content);
        const settings = json.progb;
        
        // Update cache
        projectSettingsCache.set(projectPath, { settings, mtime: stats.mtimeMs });
        
        return settings;
    } catch {
        return undefined;
    }
}

/**
 * Clear the project settings cache (useful for testing or manual reload)
 */
export function clearProjectSettingsCache(): void {
    projectSettingsCache.clear();
}

/**
 * Gets the configured comma spacing setting from VS Code settings or project file
 */
export function getFormatCommaSpacing(document?: vscode.TextDocument): boolean {
    // Check project-level override first
    const projectSettings = getProjectProgbSettings(document);
    if (projectSettings?.formatCommaSpacing !== undefined) {
        return projectSettings.formatCommaSpacing;
    }
    
    const config = vscode.workspace.getConfiguration('progb');
    return config.get<boolean>('formatCommaSpacing', true);
}

/**
 * Gets the configured keyword casing style from VS Code settings or project file
 */
export function getKeywordCasingStyle(document?: vscode.TextDocument): KeywordCasingStyle {
    // Check project-level override first
    const projectSettings = getProjectProgbSettings(document);
    if (projectSettings?.keywordCasing !== undefined) {
        return projectSettings.keywordCasing;
    }
    
    const config = vscode.workspace.getConfiguration('progb');
    return config.get<KeywordCasingStyle>('keywordCasing', 'upper');
}

/**
 * Build a sorted list of all ProgB keywords (longest first for proper matching).
 * Includes compound keywords like "END IF", "SELECT CASE", etc.
 */
function buildKeywordList(): string[] {
    const keywords = Object.keys(progbKeywords);
    // Sort by length descending so longer compound keywords match first
    return keywords.sort((a, b) => b.length - a.length);
}

/**
 * Pre-compile regex patterns for all keywords to avoid repeated creation
 */
function buildKeywordRegexMap(): Map<string, RegExp> {
    const map = new Map<string, RegExp>();
    const keywords = buildKeywordList();

    for (const keyword of keywords) {
        // Handle compound keywords with flexible whitespace
        const keywordPattern = keyword.replace(/\s+/g, '\\s+');
        const regex = new RegExp(`\\b${keywordPattern}\\b`, 'gi');
        map.set(keyword, regex);
    }

    return map;
}

const allKeywords = buildKeywordList();
const keywordRegexMap = buildKeywordRegexMap();

/**
 * Transform a keyword to the specified casing style
 */
export function transformKeyword(keyword: string, style: KeywordCasingStyle): string {
    switch (style) {
        case 'upper':
            return keyword.toUpperCase();
        case 'lower':
            return keyword.toLowerCase();
        case 'camel':
            // Capitalize first letter of each word: "END IF" -> "End If"
            return keyword.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        case 'disabled':
            return keyword; // No change
        default:
            // Exhaustiveness check - TypeScript error if a case is missing
            const _exhaustive: never = style;
            return _exhaustive;
    }
}

/**
 * Parse a line of ProgB code and return metadata about string and comment regions.
 * This is the single source of truth for string/comment detection logic.
 */
interface LineParseResult {
    /** Position where comment starts, or -1 if no comment */
    commentStart: number;
    /** Set of positions that are inside string literals */
    stringPositions: Set<number>;
}

function parseLineForStringsAndComments(line: string): LineParseResult {
    const stringPositions = new Set<number>();
    let commentStart = -1;
    let inString = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const prevChar = i > 0 ? line[i - 1] : '';
        
        // Check for line comment start (ProgB uses ' for comments)
        if (!inString && char === "'") {
            commentStart = i;
            break; // Rest of line is a comment
        }
        
        // Check for block comment start /'
        if (!inString && char === '/' && line[i + 1] === "'") {
            commentStart = i;
            break; // Rest is a block comment (simplification - doesn't handle closing)
        }
        
        // Toggle string state on unescaped quotes
        if (char === '"' && prevChar !== '\\') {
            inString = !inString;
        }
        
        // Track positions inside strings
        if (inString) {
            stringPositions.add(i);
        }
    }
    
    return { commentStart, stringPositions };
}

/**
 * Check if a position is inside a string literal or comment.
 * This prevents modifying keywords that appear in strings or comments.
 */
function isInsideStringOrComment(line: string, position: number): boolean {
    const parsed = parseLineForStringsAndComments(line);
    
    // Check if position is in a comment
    if (parsed.commentStart !== -1 && position >= parsed.commentStart) {
        return true;
    }
    
    // Check if position is in a string
    return parsed.stringPositions.has(position);
}

/**
 * Strip comments from a line of ProgB code.
 * Handles inline comments (') and preserves content inside strings.
 */
function stripComments(line: string): string {
    const parsed = parseLineForStringsAndComments(line);
    
    if (parsed.commentStart === -1) {
        return line;
    }
    
    return line.substring(0, parsed.commentStart);
}

/**
 * Result of finding a keyword in a line
 */
interface KeywordMatch {
    keyword: string;      // The canonical keyword (e.g., "END IF")
    start: number;        // Start position in line
    end: number;          // End position in line
    original: string;     // The original text as found
}

/**
 * Find all keywords in a line of ProgB code
 */
function findKeywordsInLine(line: string): KeywordMatch[] {
    const matches: KeywordMatch[] = [];
    
    // Track which positions we've already matched to avoid overlapping
    const matchedPositions = new Set<number>();
    
    for (const keyword of allKeywords) {
        // Get pre-compiled regex for this keyword
        const regex = keywordRegexMap.get(keyword);
        if (!regex) continue;
        
        // Reset regex state for reuse
        regex.lastIndex = 0;
        
        let match;
        while ((match = regex.exec(line)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            
            // Skip if this position overlaps with an already-matched keyword
            let overlaps = false;
            for (let i = start; i < end; i++) {
                if (matchedPositions.has(i)) {
                    overlaps = true;
                    break;
                }
            }
            
            if (overlaps) {
                continue;
            }
            
            // Skip if inside string or comment
            if (isInsideStringOrComment(line, start)) {
                continue;
            }
            
            // Mark these positions as matched
            for (let i = start; i < end; i++) {
                matchedPositions.add(i);
            }
            
            matches.push({
                keyword,
                start,
                end,
                original: match[0]
            });
        }
    }
    
    // Sort by position for consistent application
    return matches.sort((a, b) => a.start - b.start);
}

/**
 * Add spaces after commas in a line of ProgB code, but not inside strings.
 * Returns the transformed line, or null if no changes were needed.
 */
export function applyCommaSpacingToLine(line: string): string | null {
    const parsed = parseLineForStringsAndComments(line);
    let result = '';
    let hasChanges = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        // If we hit a comment, append the rest as-is and stop
        if (parsed.commentStart !== -1 && i >= parsed.commentStart) {
            result += line.substring(i);
            break;
        }

        result += char;

        // If we just wrote a comma and we are NOT in a string,
        // ensure the next character is a space (unless end-of-line or already a space)
        if (char === ',' && !parsed.stringPositions.has(i)) {
            const next = i + 1 < line.length ? line[i + 1] : undefined;
            if (next !== undefined && next !== ' ' && next !== '\t') {
                result += ' ';
                hasChanges = true;
            }
        }
    }

    return hasChanges ? result : null;
}

/**
 * Apply keyword casing to a single line of ProgB code.
 * Returns the transformed line, or null if no changes were needed.
 */
export function applyKeywordCasingToLine(line: string, style: KeywordCasingStyle): string | null {
    if (style === 'disabled') {
        return null;
    }
    
    const matches = findKeywordsInLine(line);
    if (matches.length === 0) {
        return null;
    }
    
    let result = line;
    let offset = 0;
    let hasChanges = false;
    
    for (const match of matches) {
        const transformed = transformKeyword(match.keyword, style);
        
        // Preserve the original whitespace pattern for compound keywords
        let replacement = transformed;
        if (match.keyword.includes(' ')) {
            // Match the whitespace from the original
            const originalParts = match.original.split(/\s+/);
            const transformedParts = transformed.split(' ');
            
            // Reconstruct with original whitespace
            const whitespaceMatches = match.original.match(/\s+/g) || [' '];
            replacement = '';
            for (let i = 0; i < transformedParts.length; i++) {
                replacement += transformedParts[i];
                if (i < whitespaceMatches.length) {
                    replacement += whitespaceMatches[i];
                }
            }
            replacement = replacement.trimEnd();
        }
        
        if (match.original !== replacement) {
            hasChanges = true;
            const adjustedStart = match.start + offset;
            const adjustedEnd = match.end + offset;
            result = result.substring(0, adjustedStart) + replacement + result.substring(adjustedEnd);
            offset += replacement.length - (match.end - match.start);
        }
    }
    
    return hasChanges ? result : null;
}

/**
 * Apply keyword casing to an entire document (useful for format document command)
 */
export async function applyKeywordCasingToDocument(document: vscode.TextDocument): Promise<void> {
    const style = getKeywordCasingStyle(document);
    if (style === 'disabled') {
        return;
    }
    
    if (document.languageId !== 'progb') {
        return;
    }
    
    const workspaceEdit = new vscode.WorkspaceEdit();
    let hasEdits = false;
    
    for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
        const line = document.lineAt(lineNum);
        const transformedText = applyKeywordCasingToLine(line.text, style);
        
        if (transformedText !== null) {
            workspaceEdit.replace(
                document.uri,
                line.range,
                transformedText
            );
            hasEdits = true;
        }
    }
    
    if (hasEdits) {
        await vscode.workspace.applyEdit(workspaceEdit);
    }
}

/**
 * Apply keyword casing to a range of lines in a document.
 * Used for formatting pasted code or entire blocks.
 */
export async function applyKeywordCasingToLineRange(
    document: vscode.TextDocument,
    startLine: number,
    endLine: number,
    style: KeywordCasingStyle
): Promise<void> {
    if (style === 'disabled') {
        return;
    }
    
    const workspaceEdit = new vscode.WorkspaceEdit();
    let hasEdits = false;
    
    for (let lineNum = startLine; lineNum <= endLine && lineNum < document.lineCount; lineNum++) {
        const line = document.lineAt(lineNum);
        const transformedText = applyKeywordCasingToLine(line.text, style);
        
        if (transformedText !== null) {
            workspaceEdit.replace(document.uri, line.range, transformedText);
            hasEdits = true;
        }
    }
    
    if (hasEdits) {
        await vscode.workspace.applyEdit(workspaceEdit);
    }
}

/**
 * Apply comma spacing to a range of lines in a document.
 * Used for formatting pasted code or entire blocks.
 */
export async function applyCommaSpacingToLineRange(
    document: vscode.TextDocument,
    startLine: number,
    endLine: number
): Promise<void> {
    const workspaceEdit = new vscode.WorkspaceEdit();
    let hasEdits = false;
    
    for (let lineNum = startLine; lineNum <= endLine && lineNum < document.lineCount; lineNum++) {
        const line = document.lineAt(lineNum);
        const spacedText = applyCommaSpacingToLine(line.text);
        
        if (spacedText !== null) {
            workspaceEdit.replace(document.uri, line.range, spacedText);
            hasEdits = true;
        }
    }
    
    if (hasEdits) {
        await vscode.workspace.applyEdit(workspaceEdit);
    }
}

/**
 * Check if a line contains a block closer keyword.
 * Returns the closer keyword if found, null otherwise.
 */
function getBlockCloser(lineText: string): string | null {
    const trimmed = lineText.trim().toUpperCase();
    
    for (const pair of progbBlockPairs) {
        // Build regex for the end keyword (handle "END X" with flexible whitespace)
        const endPattern = pair.end.replace(/\s+/g, '\\s+');
        const regex = new RegExp(`^${endPattern}\\b`, 'i');
        
        if (regex.test(trimmed)) {
            return pair.end;
        }
    }
    
    return null;
}

/**
 * Find the matching block start line for a block closer.
 * Returns the line number of the opener, or null if not found.
 */
export function findBlockStart(document: vscode.TextDocument, closerLine: number): number | null {
    const closerText = document.lineAt(closerLine).text;
    const closer = getBlockCloser(closerText);
    
    if (!closer) {
        return null;
    }
    
    // Find the matching opener
    const pair = progbBlockPairs.find(p => p.end.toUpperCase() === closer.toUpperCase());
    if (!pair) {
        return null;
    }
    
    const openerKeyword = pair.start;
    const closerKeyword = pair.end;
    
    // Build regex patterns for opener and closer
    const openerPattern = new RegExp(`\\b${openerKeyword}\\b`, 'i');
    const closerPattern = new RegExp(`\\b${closerKeyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
    
    // Search backwards from the closer line, tracking nesting depth
    let depth = 1;
    
    for (let lineNum = closerLine - 1; lineNum >= 0; lineNum--) {
        const lineText = document.lineAt(lineNum).text;
        
        // Strip comments before checking for keywords
        const codeOnly = stripComments(lineText).trim();
        
        // Skip empty lines (after stripping comments)
        if (codeOnly === '') {
            continue;
        }
        
        // Check for nested closer (increases depth)
        if (closerPattern.test(codeOnly)) {
            depth++;
        }
        // Check for opener (decreases depth)
        else if (openerPattern.test(codeOnly)) {
            depth--;
            if (depth === 0) {
                return lineNum;
            }
        }
    }
    
    return null;
}
