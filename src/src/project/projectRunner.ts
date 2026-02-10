import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Prog8Project, getProjectForFile, validateProject } from './projectFile';
import { TargetPlatform, isCustomTarget, BuiltinTargetPlatform } from '../utils/targetPlatform';
import { 
    determineCompilationStrategy, 
    CompilationOptions,
    CommandInfo,
    CustomScriptStrategy,
    resolveSrcDirs
} from './compilationStrategy';
import { resolveAllCompilerSettings } from './settingsResolver';

/**
 * Output file extensions for each built-in target platform.
 * Custom targets default to .prg as well.
 */
const OUTPUT_EXTENSIONS: Record<BuiltinTargetPlatform, string> = {
    'cx16': '.prg',
    'c64': '.prg',
    'c128': '.prg',
    'pet32': '.prg',
    'virtual': '.prg'
};

/**
 * Terminal name for Prog8 builds
 */
const TERMINAL_NAME = 'Prog8';

/**
 * Get or create the Prog8 build terminal
 */
function getTerminal(): vscode.Terminal {
    // Look for existing Prog8 terminal
    const existing = vscode.window.terminals.find(t => t.name === TERMINAL_NAME);
    if (existing) {
        return existing;
    }
    
    // Create new terminal
    return vscode.window.createTerminal(TERMINAL_NAME);
}

/**
 * Quote a path for shell use if it contains spaces
 */
function quotePath(p: string): string {
    if (p.includes(' ')) {
        return `"${p}"`;
    }
    return p;
}

/**
 * Build the command string from command parts, handling PowerShell vs bash
 * On Windows/PowerShell, adds & call operator before the first part if needed
 */
function buildCommandString(commandParts: string[]): string {
    if (commandParts.length === 0) {
        return '';
    }
    
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
        // On PowerShell, we need the & call operator before the executable/script
        // to ensure it's invoked correctly, especially with paths or quoted strings
        const firstPart = commandParts[0];
        const restParts = commandParts.slice(1);
        
        // Add & before the first part for proper PowerShell execution
        return `& ${firstPart} ${restParts.join(' ')}`.trim();
    } else {
        // On bash/sh, just join normally (& means background in bash)
        return commandParts.join(' ');
    }
}

/**
 * Build the PATH additions for the command
 */
function buildPathPrefix(pathAdditions: string[]): string {
    if (pathAdditions.length === 0) {
        return '';
    }
    
    const isWindows = process.platform === 'win32';
    const pathSeparator = isWindows ? ';' : ':';
    
    if (isWindows) {
        // PowerShell syntax
        return `$env:PATH = "${pathAdditions.join(pathSeparator)};$env:PATH"; `;
    } else {
        // Bash/sh syntax - export so it persists for the session
        return `export PATH="${pathAdditions.join(pathSeparator)}:$PATH"; `;
    }
}

/**
 * Build the environment variable setup string for the terminal.
 * These variables are available to both the compiler and any post-build scripts.
 */
function buildEnvironmentVariables(project: Prog8Project): string {
    const mainBaseName = path.basename(project.main, path.extname(project.main));
    const mainFileName = path.basename(project.main);
    const mainFilePath = path.join(project.projectDir, project.main);
    const mainFileDir = path.dirname(mainFilePath);
    // For custom targets, default to .prg extension
    const outputExt = isCustomTarget(project.target) 
        ? '.prg' 
        : OUTPUT_EXTENSIONS[project.target as BuiltinTargetPlatform];

    let prgPath: string;
    if (project.outputDir) {
        prgPath = path.join(project.projectDir, project.outputDir, mainBaseName + outputExt);
    } else {
        prgPath = path.join(project.projectDir, mainBaseName + outputExt);
    }

    const isWindows = process.platform === 'win32';

    // For custom targets, resolve the full path to the .properties file
    const customTargetPath = isCustomTarget(project.target)
        ? path.resolve(project.projectDir, project.target)
        : undefined;

    if (isWindows) {
        let envVars = `$env:PROG8_VSCODE_MAIN_FILE = "${mainFilePath}";`;
        envVars += ` $env:PROG8_VSCODE_MAIN_FILE_NAME = "${mainFileName}";`;
        envVars += ` $env:PROG8_VSCODE_MAIN_FILE_BASENAME = "${mainBaseName}";`;
        envVars += ` $env:PROG8_VSCODE_MAIN_FILE_DIR = "${mainFileDir}";`;
        envVars += ` $env:PROG8_VSCODE_TARGET = "${project.target}";`;
        envVars += ` $env:PROG8_VSCODE_OUTPUT_FILE = "${prgPath}";`;
        envVars += ` $env:PROG8_VSCODE_PROJECT_DIR = "${project.projectDir}";`;
        if (customTargetPath) {
            envVars += ` $env:PROG8_VSCODE_TARGET_FILE = "${customTargetPath}";`;
        }
        if (project.srcdirs && project.srcdirs.length > 0) {
            const resolvedDirs = resolveSrcDirs(project);
            envVars += ` $env:PROG8_VSCODE_SRC_DIRS = "${resolvedDirs.join(';')}";`;
        }
        return envVars + ' ';
    } else {
        let envVars = `export PROG8_VSCODE_MAIN_FILE="${mainFilePath}";`;
        envVars += ` export PROG8_VSCODE_MAIN_FILE_NAME="${mainFileName}";`;
        envVars += ` export PROG8_VSCODE_MAIN_FILE_BASENAME="${mainBaseName}";`;
        envVars += ` export PROG8_VSCODE_MAIN_FILE_DIR="${mainFileDir}";`;
        envVars += ` export PROG8_VSCODE_TARGET="${project.target}";`;
        envVars += ` export PROG8_VSCODE_OUTPUT_FILE="${prgPath}";`;
        envVars += ` export PROG8_VSCODE_PROJECT_DIR="${project.projectDir}";`;
        if (customTargetPath) {
            envVars += ` export PROG8_VSCODE_TARGET_FILE="${customTargetPath}";`;
        }
        if (project.srcdirs && project.srcdirs.length > 0) {
            const resolvedDirs = resolveSrcDirs(project);
            envVars += ` export PROG8_VSCODE_SRC_DIRS="${resolvedDirs.join(';')}";`;
        }
        return envVars + ' ';
    }
}

/**
 * Build a Prog8 project
 * @param project Project configuration
 * @param runAfterBuild Whether to run the emulator after successful build
 * @returns True if validation passed and build was started
 */
export async function buildProject(project: Prog8Project, runAfterBuild: boolean = false): Promise<boolean> {
    // Resolve all compiler settings with project overrides
    const resolvedConfig = resolveAllCompilerSettings(project);
    
    // Determine which compilation strategy to use
    const strategy = determineCompilationStrategy(project, resolvedConfig);
    
    // Validate using the strategy
    const validationResult = strategy.validate(project, resolvedConfig);
    
    if (!validationResult.isValid) {
        const errorMessage = validationResult.errors.join('\n\n');
        vscode.window.showErrorMessage(`Build failed:\n${errorMessage}`, 'Open Settings').then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'prog8.compiler');
            }
        });
        return false;
    }
    
    // Show warnings if any
    if (validationResult.warnings.length > 0) {
        const warningMessage = validationResult.warnings.join('\n');
        vscode.window.showWarningMessage(`Build warnings:\n${warningMessage}`);
    }
    
    // Validate project
    const projectErrors = validateProject(project);
    if (projectErrors.length > 0) {
        const errorMessage = projectErrors.join('\n');
        vscode.window.showErrorMessage(`Build failed: ${errorMessage}`);
        return false;
    }
    
    // Build compilation command using the strategy
    const options: CompilationOptions = { runAfterBuild };
    const commandInfo = strategy.buildCommand(project, resolvedConfig, options);
    
    // Build the full command with PATH and environment setup
    const pathPrefix = buildPathPrefix(commandInfo.pathAdditions);
    const envPrefix = buildEnvironmentVariables(project);
    const compileCommand = buildCommandString(commandInfo.commandParts);
    
    // Build post-compile command if needed
    // Skip this when using CustomScriptStrategy - the script already handles everything
    let postCommand = '';
    if (runAfterBuild && project.launchEmu !== true && project.run && !(strategy instanceof CustomScriptStrategy)) {
        const customCmd = buildCustomCommand(project);
        if (customCmd) {
            // Chain commands - run post command only if compile succeeds
            const isWindows = process.platform === 'win32';
            if (isWindows) {
                postCommand = `; if ($LASTEXITCODE -eq 0) { ${customCmd} }`;
            } else {
                postCommand = ` && ${customCmd}`;
            }
        }
    }
    
    // Get or create terminal
    const terminal = getTerminal();
    terminal.show();
    
    // Build the header to display project info
    const projectName = project.name || path.basename(project.projectDir);
    const isWindows = process.platform === 'win32';
    
    let headerCommand: string;
    if (isWindows) {
        headerCommand = `Write-Host ""; Write-Host "Building: ${projectName}" -ForegroundColor Cyan; Write-Host "  Strategy: ${strategy.getName()}" -ForegroundColor Gray; Write-Host "  Target: ${project.target}" -ForegroundColor Gray; Write-Host "  Main: ${project.main}" -ForegroundColor Gray; Write-Host "";`;
    } else {
        headerCommand = `echo ""; echo -e "\\033[36mBuilding: ${projectName}\\033[0m"; echo "  Strategy: ${strategy.getName()}"; echo "  Target: ${project.target}"; echo "  Main: ${project.main}"; echo "";`;
    }
    
    // Change to project directory and run the command
    // Use && for directory change so we don't run in wrong dir if cd fails
    const cdCommand = isWindows 
        ? `cd ${quotePath(project.projectDir)};`
        : `cd ${quotePath(project.projectDir)} &&`;
    const fullCommand = `${headerCommand} ${cdCommand} ${envPrefix}${pathPrefix}${compileCommand}${postCommand}`;
    
    terminal.sendText(fullCommand);
    
    return true;
}

/**
 * Build the custom post-compile command string.
 * Environment variables are already set by buildEnvironmentVariables() before the compile command.
 */
function buildCustomCommand(project: Prog8Project): string | undefined {
    if (!project.run) {
        return undefined;
    }
    
    // Resolve the command path (could be relative to project dir)
    let commandPath = project.run;
    if (!path.isAbsolute(commandPath)) {
        commandPath = path.join(project.projectDir, commandPath);
    }
    
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
        return `& ${quotePath(commandPath)}`;
    } else {
        return quotePath(commandPath);
    }
}

/**
 * Run the current project (build and launch)
 */
export async function runCurrentProject(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage('No file open. Open a .p8 or .pb file to run.');
        return;
    }
    
    const document = editor.document;
    const languageId = document.languageId;
    
    if (languageId !== 'prog8' && languageId !== 'progb') {
        vscode.window.showErrorMessage('Current file is not a Prog8 or ProgB file.');
        return;
    }
    
    try {
        const project = await getProjectForFile(document.uri);
        await buildProject(project, true);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to run project: ${message}`);
    }
}

/**
 * Build the current project (without launching emulator)
 */
export async function buildCurrentProject(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage('No file open. Open a .p8 or .pb file to build.');
        return;
    }
    
    const document = editor.document;
    const languageId = document.languageId;
    
    if (languageId !== 'prog8' && languageId !== 'progb') {
        vscode.window.showErrorMessage('Current file is not a Prog8 or ProgB file.');
        return;
    }
    
    try {
        const project = await getProjectForFile(document.uri);
        await buildProject(project, false);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to build project: ${message}`);
    }
}
