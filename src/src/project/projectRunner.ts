import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
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
import { clearDiagnostics, processCompilerOutput } from './diagnostics';

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
 * Interface for compilation execution context
 */
interface CompilationContext {
    command: string;
    args: string[];
    cwd: string;
    env: Record<string, string>;
    projectDir: string;
}

/**
 * Quote a path for shell usage, handling spaces and special characters.
 * Uses single quotes on Unix (stronger quoting) and double quotes on Windows.
 */
function shellQuote(value: string): string {
    // If already quoted, return as-is
    if (value.startsWith('"') && value.endsWith('"')) {
        return value;
    }
    if (value.startsWith("'") && value.endsWith("'")) {
        return value;
    }
    
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
        // Windows: use double quotes, escape internal double quotes
        // Also need to handle trailing backslashes - in cmd.exe \" is an escaped quote
        // so "path\" becomes "path\\" to avoid the backslash escaping the quote
        if (/[\s&|<>^()]/.test(value)) {
            let escaped = value.replace(/"/g, '\\"');
            // Double any trailing backslashes so they don't escape the closing quote
            escaped = escaped.replace(/\\+$/, (match) => match + match);
            return `"${escaped}"`;
        }
    } else {
        // Unix: use single quotes (prevents all interpolation except single quotes)
        // Single quotes are the safest quoting on Unix shells
        if (/[\s&|<>()$`!\\*?#~]/.test(value)) {
            // Escape single quotes by ending the string, adding escaped quote, and restarting
            // 'path with'\''s quote' -> handles apostrophes
            return `'${value.replace(/'/g, "'\\''")}'`;
        }
    }
    return value;
}

/**
 * Quote a value for use inside a PowerShell -Command string.
 * Uses single quotes which are safer inside double-quoted command strings.
 */
function psQuote(value: string): string {
    // Single quotes in PowerShell - escape by doubling them
    return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Build the full command line for execution.
 * Handles script files specially for each platform.
 * Returns the shell to use and the full command as a single string.
 */
function buildCommandLine(command: string, args: string[]): { shell: string | boolean; commandLine: string } {
    const isWindows = process.platform === 'win32';
    const lowerCommand = command.toLowerCase();
    const isPowerShellScript = lowerCommand.endsWith('.ps1');
    const isShellScript = lowerCommand.endsWith('.sh');
    
    // Quote all parts properly
    const quotedCommand = shellQuote(command);
    const quotedArgs = args.map(shellQuote);
    
    if (isPowerShellScript) {
        // PowerShell scripts - use pwsh (PowerShell Core) on all platforms
        // Use single quotes (psQuote) inside the -Command to avoid escaping issues
        // The & operator is needed to invoke a quoted path in PowerShell
        const psQuotedCommand = psQuote(command);
        const psQuotedArgs = args.map(psQuote);
        const scriptInvocation = `& ${psQuotedCommand} ${psQuotedArgs.join(' ')}`;
        // Use -ExecutionPolicy Bypass on Windows to avoid script execution restrictions
        const execPolicy = isWindows ? '-ExecutionPolicy Bypass ' : '';
        const commandLine = `pwsh ${execPolicy}-NoProfile -Command "${scriptInvocation}"`;
        return {
            shell: true,
            commandLine
        };
    }
    
    if (isWindows) {
        // Regular executables on Windows - use default shell (cmd.exe)
        // This works for java, .exe files, etc.
        const commandLine = `${quotedCommand} ${quotedArgs.join(' ')}`;
        return {
            shell: true,
            commandLine
        };
    } else {
        // Unix (Linux/macOS)
        if (isShellScript) {
            // Shell scripts - invoke with bash explicitly to ensure they run
            const commandLine = `bash ${quotedCommand} ${quotedArgs.join(' ')}`;
            return {
                shell: true,
                commandLine
            };
        } else {
            // Regular executables
            const commandLine = `${quotedCommand} ${quotedArgs.join(' ')}`;
            return {
                shell: true,
                commandLine
            };
        }
    }
}

/**
 * Create a CustomExecution that runs the compiler and captures output for diagnostics.
 * This allows us to parse the HTML-encoded file paths and properly populate the Problems panel.
 */
function createCompilerExecution(context: CompilationContext): vscode.CustomExecution {
    return new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
        const writeEmitter = new vscode.EventEmitter<string>();
        const closeEmitter = new vscode.EventEmitter<number>();
        
        let allOutput = '';
        
        const pty: vscode.Pseudoterminal = {
            onDidWrite: writeEmitter.event,
            onDidClose: closeEmitter.event,
            open: () => {
                // Clear previous diagnostics at the start of a new build
                clearDiagnostics();
                
                // Build the command line with proper quoting and PowerShell handling
                const { shell, commandLine } = buildCommandLine(context.command, context.args);
                
                // Display the command being executed
                writeEmitter.fire(`> ${commandLine}\r\n\r\n`);
                
                // Spawn the process - pass commandLine as a single string with shell
                const spawnOptions: cp.SpawnOptions = {
                    cwd: context.cwd,
                    env: { ...process.env, ...context.env },
                    shell: shell
                };
                
                const proc = cp.spawn(commandLine, [], spawnOptions);
                
                proc.stdout?.on('data', (data: Buffer) => {
                    const text = data.toString();
                    allOutput += text;
                    // Convert \n to \r\n for terminal display
                    writeEmitter.fire(text.replace(/\r?\n/g, '\r\n'));
                });
                
                proc.stderr?.on('data', (data: Buffer) => {
                    const text = data.toString();
                    allOutput += text;
                    // Convert \n to \r\n for terminal display
                    writeEmitter.fire(text.replace(/\r?\n/g, '\r\n'));
                });
                
                proc.on('error', (err) => {
                    writeEmitter.fire(`\r\nError: ${err.message}\r\n`);
                    closeEmitter.fire(1);
                });
                
                proc.on('close', (code) => {
                    // Process the captured output for diagnostics
                    const counts = processCompilerOutput(allOutput, context.projectDir);
                    
                    if (counts.errors > 0 || counts.warnings > 0 || counts.infos > 0 || counts.ignored > 0) {
                        writeEmitter.fire(`\r\n`);
                        const parts: string[] = [];
                        if (counts.errors > 0) parts.push(`${counts.errors} error(s)`);
                        if (counts.warnings > 0) parts.push(`${counts.warnings} warning(s)`);
                        if (counts.infos > 0) parts.push(`${counts.infos} info(s)`);
                        if (counts.ignored > 0) parts.push(`${counts.ignored} ignored`);
                        writeEmitter.fire(`Problems: ${parts.join(', ')}\r\n`);
                    }
                    
                    writeEmitter.fire(`\r\nProcess exited with code ${code ?? 0}\r\n`);
                    closeEmitter.fire(code ?? 0);
                });
            },
            close: () => {
                // Nothing to clean up
            }
        };
        
        return pty;
    });
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
    
    // Strip quotes from command parts
    const unquotedParts = commandInfo.commandParts.map(stripOuterQuotes);
    const command = unquotedParts[0];
    const args = unquotedParts.slice(1);
    
    // Create custom execution to capture output and parse diagnostics
    // This handles HTML-encoded file paths that the problem matcher can't process
    const compilationContext: CompilationContext = {
        command,
        args,
        cwd: project.projectDir,
        env,
        projectDir: project.projectDir
    };
    const execution = createCompilerExecution(compilationContext);
    
    const projectName = project.name || path.basename(project.projectDir);
    const task = new vscode.Task(
        { type: 'prog8', task: 'compile' },
        vscode.TaskScope.Workspace,
        `Build: ${projectName} [${strategy.getName()}]`,
        TASK_SOURCE,
        execution
        // No problem matcher - we handle diagnostics manually via CustomExecution
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
