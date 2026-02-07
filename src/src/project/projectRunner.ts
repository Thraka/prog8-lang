import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Prog8Project, getProjectForFile, validateProject } from './projectFile';
import { TargetPlatform } from '../utils/targetPlatform';

/**
 * Output file extensions for each target platform
 */
const OUTPUT_EXTENSIONS: Record<TargetPlatform, string> = {
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
 * Get compiler configuration from settings
 */
interface CompilerConfig {
    compilerPath: string;
    javaPath: string;
    tassPath: string;
    emulatorPath: string;
}

function getCompilerConfig(): CompilerConfig {
    const config = vscode.workspace.getConfiguration('prog8');
    return {
        compilerPath: config.get<string>('compiler.path', ''),
        javaPath: config.get<string>('compiler.javaPath', 'java'),
        tassPath: config.get<string>('tools.tassPath', ''),
        emulatorPath: config.get<string>('emulator.path', '')
    };
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
 * Build the PATH additions for the command
 */
function buildPathPrefix(config: CompilerConfig): string {
    const isWindows = process.platform === 'win32';
    const pathSeparator = isWindows ? ';' : ':';
    
    const additionalPaths: string[] = [];
    
    if (config.tassPath && fs.existsSync(config.tassPath)) {
        additionalPaths.push(config.tassPath);
    }
    
    if (config.emulatorPath && fs.existsSync(config.emulatorPath)) {
        additionalPaths.push(config.emulatorPath);
    }
    
    if (additionalPaths.length === 0) {
        return '';
    }
    
    if (isWindows) {
        // PowerShell syntax
        return `$env:PATH = "${additionalPaths.join(pathSeparator)};$env:PATH"; `;
    } else {
        // Bash/sh syntax - export so it persists for the session
        return `export PATH="${additionalPaths.join(pathSeparator)}:$PATH"; `;
    }
}

/**
 * Validate compiler configuration
 */
function validateCompilerConfig(config: CompilerConfig): string[] {
    const errors: string[] = [];
    
    if (!config.compilerPath) {
        errors.push('Compiler path not configured. Set prog8.compiler.path in settings.');
    } else if (!fs.existsSync(config.compilerPath)) {
        errors.push(`Compiler not found: ${config.compilerPath}`);
    }
    
    if (!config.tassPath) {
        errors.push('64tass path not configured. Set prog8.tools.tassPath in settings.');
    } else if (!fs.existsSync(config.tassPath)) {
        errors.push(`64tass folder not found: ${config.tassPath}`);
    }
    
    return errors;
}

/**
 * Build a Prog8 project
 * @param project Project configuration
 * @param runAfterBuild Whether to run the emulator after successful build
 * @returns True if validation passed and build was started
 */
export async function buildProject(project: Prog8Project, runAfterBuild: boolean = false): Promise<boolean> {
    // Validate configuration
    const config = getCompilerConfig();
    const configErrors = validateCompilerConfig(config);
    
    if (configErrors.length > 0) {
        const errorMessage = configErrors.join('\n');
        vscode.window.showErrorMessage(`Build failed:\n${errorMessage}`, 'Open Settings').then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'prog8.compiler');
            }
        });
        return false;
    }
    
    // Validate project
    const projectErrors = validateProject(project);
    if (projectErrors.length > 0) {
        const errorMessage = projectErrors.join('\n');
        vscode.window.showErrorMessage(`Build failed: ${errorMessage}`);
        return false;
    }
    
    // Build compiler command
    const isJar = config.compilerPath.toLowerCase().endsWith('.jar');
    const mainFilePath = path.join(project.projectDir, project.main);
    
    let commandParts: string[] = [];
    
    if (isJar) {
        commandParts.push(quotePath(config.javaPath));
        commandParts.push('-jar');
        commandParts.push(quotePath(config.compilerPath));
    } else {
        commandParts.push(quotePath(config.compilerPath));
    }
    
    // Add compiler arguments
    commandParts.push('-target', project.target);
    
    // Add -emu flag if launching emulator via compiler
    const useCompilerEmulator = runAfterBuild && project.launchEmu === true;
    if (useCompilerEmulator) {
        commandParts.push('-emu');
    }
    
    // Add output directory if specified
    if (project.outputDir) {
        const outputPath = path.join(project.projectDir, project.outputDir);
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        commandParts.push('-out', quotePath(outputPath));
    }
    
    commandParts.push(quotePath(mainFilePath));
    
    // Build the full command with PATH setup
    const pathPrefix = buildPathPrefix(config);
    const compileCommand = commandParts.join(' ');
    
    // Build post-compile command if needed
    let postCommand = '';
    if (runAfterBuild && !useCompilerEmulator && project.run) {
        const customCmd = buildCustomCommand(project, config);
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
    
    // Change to project directory and run the command
    // Use && for directory change so we don't run in wrong dir if cd fails
    const isWindows = process.platform === 'win32';
    const cdCommand = isWindows 
        ? `cd ${quotePath(project.projectDir)};`
        : `cd ${quotePath(project.projectDir)} &&`;
    const fullCommand = `${cdCommand} ${pathPrefix}${compileCommand}${postCommand}`;
    
    terminal.sendText(fullCommand);
    
    return true;
}

/**
 * Build the custom post-compile command string
 */
function buildCustomCommand(project: Prog8Project, config: CompilerConfig): string | undefined {
    if (!project.run) {
        return undefined;
    }
    
    // Determine the output PRG file path
    const mainBaseName = path.basename(project.main, path.extname(project.main));
    const outputExt = OUTPUT_EXTENSIONS[project.target];
    
    let prgPath: string;
    if (project.outputDir) {
        prgPath = path.join(project.projectDir, project.outputDir, mainBaseName + outputExt);
    } else {
        prgPath = path.join(project.projectDir, mainBaseName + outputExt);
    }
    
    // Resolve the command path (could be relative to project dir)
    let commandPath = project.run;
    if (!path.isAbsolute(commandPath)) {
        commandPath = path.join(project.projectDir, commandPath);
    }
    
    const isWindows = process.platform === 'win32';
    
    // Set environment variables and run the command
    if (isWindows) {
        return `$env:PRG_PATH = ${quotePath(prgPath)}; $env:PROJECT_DIR = ${quotePath(project.projectDir)}; & ${quotePath(commandPath)}`;
    } else {
        return `PRG_PATH=${quotePath(prgPath)} PROJECT_DIR=${quotePath(project.projectDir)} ${quotePath(commandPath)}`;
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
