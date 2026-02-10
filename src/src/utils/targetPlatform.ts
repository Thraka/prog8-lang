import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { PROJECT_FILE_NAME } from '../project/projectFile';

/**
 * Built-in target platforms for Prog8 compilation
 */
export type BuiltinTargetPlatform = 'cx16' | 'c64' | 'c128' | 'pet32' | 'virtual';

/**
 * Target platform can be either a built-in target or a custom target (.properties path)
 */
export type TargetPlatform = BuiltinTargetPlatform | string;

/**
 * Display names for each target platform
 */
export const TARGET_DISPLAY_NAMES: Record<BuiltinTargetPlatform, string> = {
    'cx16': 'Commander X16',
    'c64': 'Commodore 64',
    'c128': 'Commodore 128',
    'pet32': 'Commodore PET 32K',
    'virtual': 'Virtual'
};

/**
 * All available built-in targets
 */
export const ALL_TARGETS: BuiltinTargetPlatform[] = ['cx16', 'c64', 'c128', 'pet32', 'virtual'];

/**
 * Check if a target string represents a custom target (path to .properties file)
 */
export function isCustomTarget(target: string): boolean {
    return target.endsWith('.properties');
}

/**
 * Check if a target is a built-in target
 */
export function isBuiltinTarget(target: string): target is BuiltinTargetPlatform {
    return ALL_TARGETS.includes(target as BuiltinTargetPlatform);
}

/**
 * Status bar item for target platform selection
 */
let statusBarItem: vscode.StatusBarItem | undefined;

/**
 * Get the currently configured target platform from settings (only built-in targets)
 */
export function getTargetPlatform(): BuiltinTargetPlatform {
    const config = vscode.workspace.getConfiguration('prog8');
    const target = config.get<string>('targetPlatform', 'cx16');
    
    // Validate the target is one of the known values
    if (ALL_TARGETS.includes(target as BuiltinTargetPlatform)) {
        return target as BuiltinTargetPlatform;
    }
    return 'cx16';
}

/**
 * Get the target platform for a specific document, checking project file first.
 * Can return a custom target path (.properties file) if specified in the project file.
 */
export function getTargetPlatformForDocument(document?: vscode.TextDocument): TargetPlatform {
    if (document) {
        const dir = path.dirname(document.uri.fsPath);
        const projectPath = path.join(dir, PROJECT_FILE_NAME);
        
        if (fs.existsSync(projectPath)) {
            try {
                const content = fs.readFileSync(projectPath, 'utf-8');
                const json = JSON.parse(content);
                if (json.target) {
                    // Accept both built-in targets and custom targets (.properties paths)
                    if (isBuiltinTarget(json.target) || isCustomTarget(json.target)) {
                        return json.target;
                    }
                }
            } catch {
                // Fall through to default
            }
        }
    }
    
    return getTargetPlatform();
}

/**
 * Set the target platform in workspace or global configuration.
 * Only built-in targets can be set via settings (custom targets are project-file only).
 */
export async function setTargetPlatform(target: BuiltinTargetPlatform): Promise<void> {
    const config = vscode.workspace.getConfiguration('prog8');
    
    // Try to set in workspace first, fall back to global
    try {
        await config.update('targetPlatform', target, vscode.ConfigurationTarget.Workspace);
    } catch {
        await config.update('targetPlatform', target, vscode.ConfigurationTarget.Global);
    }
    
    updateStatusBarItem();
}

/**
 * Show a quick pick to select the target platform
 */
export async function selectTargetPlatform(): Promise<void> {
    const currentTarget = getTargetPlatform();
    
    const items: vscode.QuickPickItem[] = ALL_TARGETS.map(target => ({
        label: TARGET_DISPLAY_NAMES[target],
        description: target,
        picked: target === currentTarget
    }));
    
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select Prog8 target platform',
        title: 'Prog8 Target Platform'
    });
    
    if (selected && selected.description) {
        await setTargetPlatform(selected.description as BuiltinTargetPlatform);
    }
}

/**
 * Update the status bar item text based on the active document's target
 */
function updateStatusBarItem(): void {
    if (!statusBarItem) {
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    const target = editor ? getTargetPlatformForDocument(editor.document) : getTargetPlatform();
    
    if (isCustomTarget(target)) {
        // Custom target - show the filename without extension
        const targetName = path.basename(target, '.properties');
        statusBarItem.text = `$(circuit-board) ${targetName}`;
        statusBarItem.tooltip = `Prog8 Custom Target: ${target}\n(defined in project file)`;
    } else {
        // Built-in target
        statusBarItem.text = `$(circuit-board) ${target.toUpperCase()}`;
        const displayName = TARGET_DISPLAY_NAMES[target as BuiltinTargetPlatform] || target;
        statusBarItem.tooltip = `Prog8 Target: ${displayName}\nClick to change`;
    }
}

/**
 * Create and register the status bar item
 */
export function createStatusBarItem(context: vscode.ExtensionContext): vscode.StatusBarItem {
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100 // Priority - lower numbers are further right
    );
    
    statusBarItem.command = 'prog8.selectTargetPlatform';
    updateStatusBarItem();
    
    // Show/hide based on active editor language
    updateStatusBarVisibility();
    
    context.subscriptions.push(statusBarItem);
    
    // Update visibility when active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            updateStatusBarVisibility();
            updateStatusBarItem(); // Also update the target display for the new document
        })
    );
    
    // Update text when configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('prog8.targetPlatform')) {
                updateStatusBarItem();
            }
        })
    );
    
    return statusBarItem;
}

/**
 * Show or hide the status bar item based on active editor
 */
function updateStatusBarVisibility(): void {
    if (!statusBarItem) {
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    if (editor && (editor.document.languageId === 'prog8' || editor.document.languageId === 'progb')) {
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}
