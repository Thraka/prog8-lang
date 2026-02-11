import * as vscode from 'vscode';
import * as path from 'path';
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
 * Task source identifier for Prog8 builds
 */
const TASK_SOURCE = 'prog8';

/**
 * Pending post-build actions keyed by task execution.
 * Used to run post-compile commands after successful builds.
 */
interface PostBuildAction {
    project: Prog8Project;
    useCustomScript: boolean;
}
const pendingPostBuildActions = new Map<vscode.TaskExecution, PostBuildAction>();

/**
 * Disposable for the task end listener. Created on first use.
 */
let taskEndListenerDisposable: vscode.Disposable | undefined;

/**
 * Strip outer quotes from a string if present.
 * Used because compilationStrategy pre-quotes paths, but ShellExecution args array
 * handles quoting automatically.
 */
function stripOuterQuotes(s: string): string {
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
        return s.slice(1, -1);
    }
    return s;
}

/**
 * Create a ShellQuotedString for a value that may contain spaces or special characters.
 * Uses strong quoting to ensure the value is passed as-is to the command.
 */
function quoteForShell(value: string): vscode.ShellQuotedString {
    return { value, quoting: vscode.ShellQuoting.Strong };
}

/**
 * Create a ShellExecution that properly handles the command and arguments.
 * On Windows with PowerShell, scripts need the & call operator to execute quoted paths.
 */
function createShellExecution(
    command: string, 
    args: string[], 
    options: vscode.ShellExecutionOptions
): vscode.ShellExecution {
    const isWindows = process.platform === 'win32';
    const isPowerShellScript = command.toLowerCase().endsWith('.ps1');
    
    if (isWindows && isPowerShellScript) {
        // PowerShell needs & call operator to execute a quoted script path
        // Command becomes: & 'path\to\script.ps1' arg1 arg2
        const allArgs = [quoteForShell(command), ...args.map(quoteForShell)];
        return new vscode.ShellExecution('&', allArgs, options);
    } else {
        // For other executables, the path can be the command directly
        return new vscode.ShellExecution(quoteForShell(command), args.map(quoteForShell), options);
    }
}

/**
 * Build environment variables as an object for the Task API.
 * These variables are passed silently to the shell without echoing setup commands.
 */
function buildEnvironmentVariablesObject(project: Prog8Project, pathAdditions: string[]): Record<string, string> {
    const mainBaseName = path.basename(project.main, path.extname(project.main));
    const mainFileName = path.basename(project.main);
    const mainFilePath = path.join(project.projectDir, project.main);
    const mainFileDir = path.dirname(mainFilePath);
    
    // For custom targets, default to .prg extension
    const outputExt = isCustomTarget(project.target) 
        ? '.prg' 
        : OUTPUT_EXTENSIONS[project.target as BuiltinTargetPlatform];

    const prgPath = project.outputDir
        ? path.join(project.projectDir, project.outputDir, mainBaseName + outputExt)
        : path.join(project.projectDir, mainBaseName + outputExt);

    const env: Record<string, string> = {
        'PROG8_VSCODE_MAIN_FILE': mainFilePath,
        'PROG8_VSCODE_MAIN_FILE_NAME': mainFileName,
        'PROG8_VSCODE_MAIN_FILE_BASENAME': mainBaseName,
        'PROG8_VSCODE_MAIN_FILE_DIR': mainFileDir,
        'PROG8_VSCODE_TARGET': project.target,
        'PROG8_VSCODE_OUTPUT_FILE': prgPath,
        'PROG8_VSCODE_PROJECT_DIR': project.projectDir,
    };

    // For custom targets, resolve the full path to the .properties file
    if (isCustomTarget(project.target)) {
        env['PROG8_VSCODE_TARGET_FILE'] = path.resolve(project.projectDir, project.target);
    }
    
    if (project.srcdirs && project.srcdirs.length > 0) {
        const resolvedDirs = resolveSrcDirs(project);
        env['PROG8_VSCODE_SRC_DIRS'] = resolvedDirs.join(';');
    }

    // Add PATH additions if any
    if (pathAdditions.length > 0) {
        const pathSeparator = process.platform === 'win32' ? ';' : ':';
        env['PATH'] = pathAdditions.join(pathSeparator) + pathSeparator + (process.env.PATH || '');
    }

    return env;
}

/**
 * Ensure the task end listener is registered.
 * This listener handles post-build actions like running the emulator.
 */
function ensureTaskEndListener(): void {
    if (taskEndListenerDisposable) {
        return;
    }
    
    taskEndListenerDisposable = vscode.tasks.onDidEndTaskProcess(async (e) => {
        const action = pendingPostBuildActions.get(e.execution);
        if (!action) {
            return;
        }
        
        // Clean up
        pendingPostBuildActions.delete(e.execution);
        
        // Only run post-build if compilation succeeded
        if (e.exitCode !== 0) {
            return;
        }
        
        // Run post-build command
        await runPostBuildCommand(action.project);
    });
}

/**
 * Run the post-build command for a project.
 * Uses a separate task with the same environment variables.
 */
async function runPostBuildCommand(project: Prog8Project): Promise<void> {
    if (!project.run) {
        return;
    }
    
    // Resolve the command path (could be relative to project dir)
    let commandPath = project.run;
    if (!path.isAbsolute(commandPath)) {
        commandPath = path.join(project.projectDir, commandPath);
    }
    
    const env = buildEnvironmentVariablesObject(project, []);
    
    const shellOptions: vscode.ShellExecutionOptions = {
        cwd: project.projectDir,
        env
    };
    
    // Use createShellExecution to handle PowerShell scripts properly
    const execution = createShellExecution(commandPath, [], shellOptions);
    
    const task = new vscode.Task(
        { type: 'prog8', task: 'run' },
        vscode.TaskScope.Workspace,
        'Run: ' + (project.name || path.basename(project.projectDir)),
        TASK_SOURCE,
        execution
    );
    
    task.presentationOptions = {
        reveal: vscode.TaskRevealKind.Always,
        panel: vscode.TaskPanelKind.Shared,
        clear: false
    };
    
    await vscode.tasks.executeTask(task);
}

/**
 * Build a Prog8 project using the VS Code Task API.
 * Environment variables are passed silently without cluttering the terminal output.
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
    
    // Build environment variables object (includes PATH additions)
    const env = buildEnvironmentVariablesObject(project, commandInfo.pathAdditions);
    
    // Strip quotes from command parts - createShellExecution handles quoting
    const unquotedParts = commandInfo.commandParts.map(stripOuterQuotes);
    const command = unquotedParts[0];
    const args = unquotedParts.slice(1);
    
    // Create shell execution with environment variables
    const shellOptions: vscode.ShellExecutionOptions = {
        cwd: project.projectDir,
        env
    };
    
    // Use createShellExecution to handle PowerShell scripts and quoting properly
    const execution = createShellExecution(command, args, shellOptions);
    
    const projectName = project.name || path.basename(project.projectDir);
    const task = new vscode.Task(
        { type: 'prog8', task: 'compile' },
        vscode.TaskScope.Workspace,
        `Build: ${projectName} [${strategy.getName()}]`,
        TASK_SOURCE,
        execution
    );
    
    // Configure task presentation
    task.presentationOptions = {
        reveal: vscode.TaskRevealKind.Always,
        panel: vscode.TaskPanelKind.Shared,
        clear: true,
        echo: true
    };
    
    // Execute the task
    const taskExecution = await vscode.tasks.executeTask(task);
    
    // Register post-build action if needed
    // Skip this when using CustomScriptStrategy - the script already handles everything
    if (runAfterBuild && project.launchEmu !== true && project.run && !(strategy instanceof CustomScriptStrategy)) {
        ensureTaskEndListener();
        pendingPostBuildActions.set(taskExecution, {
            project,
            useCustomScript: false
        });
    }
    
    return true;
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

/**
 * Dispose of the task end listener.
 * Should be called when the extension is deactivated.
 */
export function disposeProjectRunner(): void {
    if (taskEndListenerDisposable) {
        taskEndListenerDisposable.dispose();
        taskEndListenerDisposable = undefined;
    }
    pendingPostBuildActions.clear();
}
