import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TargetPlatform, getTargetPlatform } from '../utils/targetPlatform';
import { CompilationMode } from './compilationStrategy';

/**
 * Project file name
 */
export const PROJECT_FILE_NAME = 'prog8.project.json';

/**
 * ProgB-specific settings
 */
export interface ProgBSettings {
    keywordCasing?: 'upper' | 'lower' | 'camel' | 'disabled';
    formatCommaSpacing?: boolean;
}

/**
 * Prog8 project configuration
 */
export interface Prog8Project {
    /** Project name (optional, for display purposes) */
    name?: string;
    /** Main source file to compile (.p8 or .pb) */
    main: string;
    /** Target platform for compilation */
    target: TargetPlatform;
    /** Output directory for compiled files (relative to project folder) */
    outputDir?: string;
    /** Launch emulator after successful compilation (uses compiler -emu flag) */
    launchEmu?: boolean;
    /** Custom script/executable to run after compilation (alternative to launchEmu) */
    run?: string;
    /** Whether to pass the main file path as an argument to the custom script (default: true) */
    passMainToScript?: boolean;
    /** Compilation mode: auto (detect), standard (prog8c + tass), or custom-script */
    compilationMode?: CompilationMode;
    /** Path to prog8c compiler (overrides extension setting) */
    compilerPath?: string;
    /** Path to Java executable (overrides extension setting) */
    javaPath?: string;
    /** Folder containing 64tass assembler (overrides extension setting) */
    assemblerFolder?: string;
    /** Folder containing emulators (overrides extension setting) */
    emulatorFolder?: string;
    /** Additional source directories for imported modules (absolute or relative paths) */
    srcdirs?: string[];
    /** Additional arguments to pass to the compiler or custom script */
    compilerArgs?: string[];
    /** ProgB-specific settings (overrides extension settings) */
    progb?: ProgBSettings;
    /** Full path to the project file */
    projectFilePath: string;
    /** Directory containing the project file */
    projectDir: string;
}

/**
 * Raw project file JSON structure
 */
interface ProjectFileJson {
    name?: string;
    main?: string;
    target?: string;
    outputDir?: string;
    launchEmu?: boolean;
    run?: string;
    passMainToScript?: boolean;
    compilationMode?: CompilationMode;
    compilerPath?: string;
    javaPath?: string;
    assemblerFolder?: string;
    emulatorFolder?: string;
    srcdirs?: string[];
    compilerArgs?: string[];
    progb?: ProgBSettings;
}

/**
 * Find the project file starting from the given directory
 * @param startDir Directory to start searching from
 * @returns Path to project file, or undefined if not found
 */
export function findProjectFile(startDir: string): string | undefined {
    const projectFilePath = path.join(startDir, PROJECT_FILE_NAME);
    if (fs.existsSync(projectFilePath)) {
        return projectFilePath;
    }
    return undefined;
}

/**
 * Load and parse a project file
 * @param projectFilePath Full path to the project file
 * @returns Parsed project configuration
 */
export function loadProjectFile(projectFilePath: string): Prog8Project {
    const content = fs.readFileSync(projectFilePath, 'utf-8');
    const json: ProjectFileJson = JSON.parse(content);
    const projectDir = path.dirname(projectFilePath);

    // Validate and normalize target
    const validTargets: TargetPlatform[] = ['cx16', 'c64', 'c128', 'pet32', 'virtual'];
    let target: TargetPlatform = getTargetPlatform();
    if (json.target && validTargets.includes(json.target as TargetPlatform)) {
        target = json.target as TargetPlatform;
    }

    // Main file is required if specified, otherwise will be set by caller
    const main = json.main || '';

    return {
        name: json.name,
        main,
        target,
        outputDir: json.outputDir,
        launchEmu: json.launchEmu,
        run: json.run,
        passMainToScript: json.passMainToScript !== false, // default to true
        compilationMode: json.compilationMode || 'auto',
        compilerPath: json.compilerPath,
        javaPath: json.javaPath,
        assemblerFolder: json.assemblerFolder,
        emulatorFolder: json.emulatorFolder,
        srcdirs: json.srcdirs,
        compilerArgs: json.compilerArgs,
        progb: json.progb,
        projectFilePath,
        projectDir
    };
}

/**
 * Get project configuration for the current context
 * If a project file exists, load it. Otherwise, create a default config based on current file.
 * @param currentFileUri URI of the currently active file
 * @returns Project configuration
 */
export async function getProjectForFile(currentFileUri: vscode.Uri): Promise<Prog8Project> {
    const currentFilePath = currentFileUri.fsPath;
    const currentDir = path.dirname(currentFilePath);
    const currentFileName = path.basename(currentFilePath);

    // Try to find project file
    const projectFilePath = findProjectFile(currentDir);

    if (projectFilePath) {
        // Load existing project
        const project = loadProjectFile(projectFilePath);
        
        // If main is not specified, use current file
        if (!project.main) {
            project.main = currentFileName;
        }
        
        return project;
    }

    // No project file - create default config from current file
    // Default to launchEmu: true so F5 works out of the box
    return {
        main: currentFileName,
        target: getTargetPlatform(),
        launchEmu: true,
        projectFilePath: path.join(currentDir, PROJECT_FILE_NAME),
        projectDir: currentDir
    };
}

/**
 * Create a new project file in the specified directory
 * @param directory Directory to create the project file in
 * @param mainFile Main source file name
 * @param target Target platform
 * @param launchEmu Whether to launch emulator after build
 * @param run Custom command to run after compilation
 */
export async function createProjectFile(
    directory: string,
    mainFile: string,
    target: TargetPlatform,
    launchEmu?: boolean,
    run?: string
): Promise<string> {
    const projectFilePath = path.join(directory, PROJECT_FILE_NAME);
    
    const projectContent: ProjectFileJson = {
        name: path.basename(directory),
        main: mainFile,
        target: target,
        launchEmu: launchEmu,
        run: run
    };

    fs.writeFileSync(projectFilePath, JSON.stringify(projectContent, null, 2), 'utf-8');
    
    return projectFilePath;
}

/**
 * Initialize a new project in the current folder
 * Prompts user for main file and creates prog8.project.json
 */
export async function initializeProject(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage('No file open. Open a .p8 or .pb file first.');
        return;
    }
    
    const document = editor.document;
    const currentFilePath = document.uri.fsPath;
    const currentDir = path.dirname(currentFilePath);
    const currentFileName = path.basename(currentFilePath);
    
    // Check if project file already exists
    const existingProject = findProjectFile(currentDir);
    if (existingProject) {
        const overwrite = await vscode.window.showWarningMessage(
            `Project file already exists: ${PROJECT_FILE_NAME}`,
            'Overwrite',
            'Cancel'
        );
        if (overwrite !== 'Overwrite') {
            return;
        }
    }
    
    // Get list of .p8 and .pb files in the folder
    const files = fs.readdirSync(currentDir)
        .filter(f => f.endsWith('.p8') || f.endsWith('.pb'))
        .sort();
    
    if (files.length === 0) {
        vscode.window.showErrorMessage('No .p8 or .pb files found in the current folder.');
        return;
    }
    
    // Prompt for main file
    const mainFile = await vscode.window.showQuickPick(files, {
        placeHolder: 'Select the main source file',
        title: 'Prog8 Project: Main File'
    });
    
    if (!mainFile) {
        return; // User cancelled
    }
    
    // Prompt for what to run after compilation
    const runOptions: vscode.QuickPickItem[] = [
        { label: 'Launch emulator', description: 'Use compiler -emu flag to launch emulator after build' },
        { label: 'Nothing', description: 'Just compile, don\'t run anything' },
        { label: 'Custom command...', description: 'Specify a custom executable or script' }
    ];
    
    const runChoice = await vscode.window.showQuickPick(runOptions, {
        placeHolder: 'What should happen after compilation?',
        title: 'Prog8 Project: Post-Build Action'
    });
    
    if (!runChoice) {
        return; // User cancelled
    }
    
    let launchEmu: boolean | undefined;
    let run: string | undefined;
    
    if (runChoice.label === 'Launch emulator') {
        launchEmu = true;
    } else if (runChoice.label === 'Custom command...') {
        run = await vscode.window.showInputBox({
            prompt: 'Enter the path to the executable or script to run after compilation',
            placeHolder: 'e.g., ./run.bat or /path/to/script.sh'
        });
        if (!run) {
            return; // User cancelled
        }
    }
    // If 'Nothing', both stay undefined
    
    // Get current target platform
    const target = getTargetPlatform();
    
    // Create the project file
    const projectPath = await createProjectFile(currentDir, mainFile, target, launchEmu, run);
    
    // Open the project file
    const projectDoc = await vscode.workspace.openTextDocument(projectPath);
    await vscode.window.showTextDocument(projectDoc);
    
    vscode.window.showInformationMessage(`Created ${PROJECT_FILE_NAME} with main file: ${mainFile}`);
}

/**
 * Validate that a project is ready to build
 * @param project Project configuration
 * @returns Array of error messages, empty if valid
 */
export function validateProject(project: Prog8Project): string[] {
    const errors: string[] = [];

    // Check main file exists
    const mainPath = path.join(project.projectDir, project.main);
    if (!fs.existsSync(mainPath)) {
        errors.push(`Main file not found: ${project.main}`);
    }

    // Check main file has valid extension
    const ext = path.extname(project.main).toLowerCase();
    if (ext !== '.p8' && ext !== '.pb') {
        errors.push(`Main file must be a .p8 or .pb file: ${project.main}`);
    }

    return errors;
}
