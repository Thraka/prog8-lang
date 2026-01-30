import * as vscode from 'vscode';

/**
 * Available target platforms for Prog8 compilation
 */
export type TargetPlatform = 'cx16' | 'c64' | 'c128' | 'pet32' | 'virtual';

/**
 * Display names for each target platform
 */
export const TARGET_DISPLAY_NAMES: Record<TargetPlatform, string> = {
    'cx16': 'Commander X16',
    'c64': 'Commodore 64',
    'c128': 'Commodore 128',
    'pet32': 'Commodore PET 32K',
    'virtual': 'Virtual'
};

/**
 * All available targets
 */
export const ALL_TARGETS: TargetPlatform[] = ['cx16', 'c64', 'c128', 'pet32', 'virtual'];

/**
 * Status bar item for target platform selection
 */
let statusBarItem: vscode.StatusBarItem | undefined;

/**
 * Get the currently configured target platform
 */
export function getTargetPlatform(): TargetPlatform {
    const config = vscode.workspace.getConfiguration('prog8');
    const target = config.get<string>('targetPlatform', 'cx16');
    
    // Validate the target is one of the known values
    if (ALL_TARGETS.includes(target as TargetPlatform)) {
        return target as TargetPlatform;
    }
    return 'cx16';
}

/**
 * Set the target platform in workspace or global configuration
 */
export async function setTargetPlatform(target: TargetPlatform): Promise<void> {
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
        await setTargetPlatform(selected.description as TargetPlatform);
    }
}

/**
 * Update the status bar item text
 */
function updateStatusBarItem(): void {
    if (statusBarItem) {
        const target = getTargetPlatform();
        statusBarItem.text = `$(circuit-board) ${target.toUpperCase()}`;
        statusBarItem.tooltip = `Prog8 Target: ${TARGET_DISPLAY_NAMES[target]}\nClick to change`;
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
