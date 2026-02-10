import * as path from 'path';
import * as fs from 'fs';
import { Prog8Project } from './projectFile';
import { 
    ResolvedCompilerConfig, 
    resolveAllCompilerSettings, 
    SettingsResolver 
} from './settingsResolver';
import { isCustomTarget } from '../utils/targetPlatform';

/**
 * Check if a value looks like a specific file/folder path (contains directory separators)
 * vs a bare command name that should be resolved via the system PATH.
 * Examples:
 *   "prog8c.exe" → false (bare command)
 *   "..\\prog8c.jar" → true (relative path)
 *   "C:\\tools\\prog8c.jar" → true (absolute path)
 */
function isFilePath(value: string): boolean {
    return value.includes('/') || value.includes('\\');
}

/**
 * Validation result with errors and warnings
 */
export interface ValidationResult {
    errors: string[];
    warnings: string[];
    isValid: boolean;
}

/**
 * Information needed to build a compilation command
 */
export interface CommandInfo {
    /** The command parts to execute (will be joined with spaces) */
    commandParts: string[];
    /** Environment PATH additions needed */
    pathAdditions: string[];
    /** Working directory for the command */
    workingDir: string;
}

/**
 * Compilation mode determines how the project is built
 */
export type CompilationMode = 'auto' | 'standard' | 'custom-script';

/**
 * Base class for compilation strategies
 */
export abstract class CompilationStrategy {
    protected resolver = new SettingsResolver();
    
    /**
     * Validate that all required settings are available for this strategy
     */
    abstract validate(project: Prog8Project, config: ResolvedCompilerConfig): ValidationResult;
    
    /**
     * Build the command to execute compilation
     */
    abstract buildCommand(project: Prog8Project, config: ResolvedCompilerConfig, options: CompilationOptions): CommandInfo;
    
    /**
     * Get a human-readable name for this strategy
     */
    abstract getName(): string;
}

/**
 * Options for compilation
 */
export interface CompilationOptions {
    /** Whether to launch emulator after successful build */
    runAfterBuild: boolean;
}

/**
 * Strategy for compiling with Java + JAR file
 * Requires: compilerPath (.jar), javaPath, tassPath
 */
export class JavaCompilerStrategy extends CompilationStrategy {
    getName(): string {
        return 'Java Compiler (.jar)';
    }
    
    validate(project: Prog8Project, config: ResolvedCompilerConfig): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // NOTE: config contains resolved values where each path comes from ONLY ONE source
        // (project file OR extension settings, never both). See settingsResolver.ts.
        
        // Validate compiler path (required)
        if (!config.compilerPath.value) {
            errors.push(this.resolver.buildErrorMessage(
                'Compiler path',
                'compilerPath',
                'prog8.compiler.path'
            ));
        } else if (!fs.existsSync(config.compilerPath.value)) {
            errors.push(`Compiler not found: ${config.compilerPath.value}`);
        }
        
        // Validate Java path (required for .jar)
        if (!config.javaPath.value) {
            errors.push(this.resolver.buildErrorMessage(
                'Java path',
                'javaPath',
                'prog8.compiler.javaPath'
            ));
        }
        
        // Validate 64tass path (required)
        if (!config.assemblerFolder.value) {
            errors.push(this.resolver.buildErrorMessage(
                '64tass assembler folder',
                'assemblerFolder',
                'prog8.compiler.assemblerFolder'
            ));
        } else if (!fs.existsSync(config.assemblerFolder.value)) {
            errors.push(`64tass folder not found: ${config.assemblerFolder.value}`);
        }
        
        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }
    
    buildCommand(project: Prog8Project, config: ResolvedCompilerConfig, options: CompilationOptions): CommandInfo {
        const commandParts: string[] = [];
        
        commandParts.push(quotePath(config.javaPath.value!));
        commandParts.push('-jar');
        commandParts.push(quotePath(config.compilerPath.value!));
        
        // Add common compiler arguments
        this.addCompilerArguments(commandParts, project, options);
        
        // Add any custom compiler arguments
        if (project.compilerArgs && project.compilerArgs.length > 0) {
            commandParts.push(...project.compilerArgs);
        }
        
        // Add the main file
        const mainFilePath = path.join(project.projectDir, project.main);
        commandParts.push(quotePath(mainFilePath));
        
        return {
            commandParts,
            pathAdditions: this.buildPathAdditions(config),
            workingDir: project.projectDir
        };
    }
    
    private addCompilerArguments(commandParts: string[], project: Prog8Project, options: CompilationOptions): void {
        // Resolve target - for custom targets, resolve the path
        const targetArg = isCustomTarget(project.target)
            ? quotePath(path.resolve(project.projectDir, project.target))
            : project.target;
        commandParts.push('-target', targetArg);
        
        // Add -emu flag if launching emulator via compiler
        const useCompilerEmulator = options.runAfterBuild && project.launchEmu === true;
        if (useCompilerEmulator) {
            commandParts.push('-emu');
        }
        
        // Add output directory if specified
        if (project.outputDir) {
            const outputPath = path.join(project.projectDir, project.outputDir);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }
            commandParts.push('-out', quotePath(outputPath));
        }
        
        // Add source directories if specified
        if (project.srcdirs && project.srcdirs.length > 0) {
            const resolvedDirs = resolveSrcDirs(project);
            commandParts.push('-srcdirs', quotePath(resolvedDirs.join(';')));
        }
    }
    
    private buildPathAdditions(config: ResolvedCompilerConfig): string[] {
        const additions: string[] = [];
        
        if (config.assemblerFolder.value && fs.existsSync(config.assemblerFolder.value)) {
            additions.push(config.assemblerFolder.value);
        }
        
        if (config.emulatorFolder.value && fs.existsSync(config.emulatorFolder.value)) {
            additions.push(config.emulatorFolder.value);
        }
        
        return additions;
    }
}

/**
 * Strategy for compiling with a precompiled binary
 * Requires: compilerPath (binary), assemblerFolder
 */
export class BinaryCompilerStrategy extends CompilationStrategy {
    getName(): string {
        return 'Binary Compiler';
    }
    
    validate(project: Prog8Project, config: ResolvedCompilerConfig): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // NOTE: config contains resolved values where each path comes from ONLY ONE source
        // (project file OR extension settings, never both). See settingsResolver.ts.
        
        // Validate compiler path (required)
        if (!config.compilerPath.value) {
            errors.push(this.resolver.buildErrorMessage(
                'Compiler path',
                'compilerPath',
                'prog8.compiler.path'
            ));
        } else if (isFilePath(config.compilerPath.value) && !fs.existsSync(config.compilerPath.value)) {
            errors.push(`Compiler not found: ${config.compilerPath.value}`);
        }
        
        // Validate 64tass path (required)
        if (!config.assemblerFolder.value) {
            errors.push(this.resolver.buildErrorMessage(
                '64tass assembler folder',
                'assemblerFolder',
                'prog8.compiler.assemblerFolder'
            ));
        } else if (!fs.existsSync(config.assemblerFolder.value)) {
            errors.push(`64tass folder not found: ${config.assemblerFolder.value}`);
        }
        
        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }
    
    buildCommand(project: Prog8Project, config: ResolvedCompilerConfig, options: CompilationOptions): CommandInfo {
        const commandParts: string[] = [];
        
        commandParts.push(quotePath(config.compilerPath.value!));
        
        // Resolve target - for custom targets, resolve the path
        const targetArg = isCustomTarget(project.target)
            ? quotePath(path.resolve(project.projectDir, project.target))
            : project.target;
        commandParts.push('-target', targetArg);
        
        const useCompilerEmulator = options.runAfterBuild && project.launchEmu === true;
        if (useCompilerEmulator) {
            commandParts.push('-emu');
        }
        
        if (project.outputDir) {
            const outputPath = path.join(project.projectDir, project.outputDir);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }
            commandParts.push('-out', quotePath(outputPath));
        }
        
        // Add source directories if specified
        if (project.srcdirs && project.srcdirs.length > 0) {
            const resolvedDirs = resolveSrcDirs(project);
            commandParts.push('-srcdirs', quotePath(resolvedDirs.join(';')));
        }
        
        // Add any custom compiler arguments
        if (project.compilerArgs && project.compilerArgs.length > 0) {
            commandParts.push(...project.compilerArgs);
        }
        
        const mainFilePath = path.join(project.projectDir, project.main);
        commandParts.push(quotePath(mainFilePath));
        
        return {
            commandParts,
            pathAdditions: this.buildPathAdditions(config),
            workingDir: project.projectDir
        };
    }
    
    private buildPathAdditions(config: ResolvedCompilerConfig): string[] {
        const additions: string[] = [];
        
        if (config.assemblerFolder.value && fs.existsSync(config.assemblerFolder.value)) {
            additions.push(config.assemblerFolder.value);
        }
        
        if (config.emulatorFolder.value && fs.existsSync(config.emulatorFolder.value)) {
            additions.push(config.emulatorFolder.value);
        }
        
        return additions;
    }
}

/**
 * Strategy for using a custom script that handles everything
 */
export class CustomScriptStrategy extends CompilationStrategy {
    getName(): string {
        return 'Custom Script';
    }
    
    validate(project: Prog8Project, config: ResolvedCompilerConfig): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Only validate that the run script exists
        if (!project.run) {
            errors.push('Custom script mode requires "run" to be specified in project file');
        } else {
            let scriptPath = project.run;
            if (!path.isAbsolute(scriptPath)) {
                scriptPath = path.join(project.projectDir, scriptPath);
            }
            
            if (!fs.existsSync(scriptPath)) {
                errors.push(`Custom script not found: ${project.run}`);
            }
        }
        
        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }
    
    buildCommand(project: Prog8Project, config: ResolvedCompilerConfig, options: CompilationOptions): CommandInfo {
        let scriptPath = project.run!;
        if (!path.isAbsolute(scriptPath)) {
            scriptPath = path.join(project.projectDir, scriptPath);
        }
        
        // Build command parts starting with the script path
        const commandParts = [quotePath(scriptPath)];
        
        // Conditionally add main file (default behavior is to pass it)
        if (project.passMainToScript !== false) {
            const mainFilePath = path.join(project.projectDir, project.main);
            commandParts.push(quotePath(mainFilePath));
        }
        
        // Add any custom compiler arguments as additional script arguments
        if (project.compilerArgs && project.compilerArgs.length > 0) {
            commandParts.push(...project.compilerArgs);
        }
        
        return {
            commandParts,
            pathAdditions: [],
            workingDir: project.projectDir
        };
    }
}

/**
 * Determine which compilation strategy to use based on project configuration
 */
export function determineCompilationStrategy(project: Prog8Project, config: ResolvedCompilerConfig): CompilationStrategy {
    // Check explicit mode first
    if (project.compilationMode === 'custom-script') {
        return new CustomScriptStrategy();
    }
    
    if (project.compilationMode === 'standard') {
        // Check if it's a JAR or binary
        if (config.compilerPath.value?.toLowerCase().endsWith('.jar')) {
            return new JavaCompilerStrategy();
        }
        return new BinaryCompilerStrategy();
    }
    
    // Auto-detect mode
    // If run is specified but no compiler, assume custom script
    if (project.run && !config.compilerPath.value) {
        return new CustomScriptStrategy();
    }
    
    // If compiler is specified, check if it's JAR or binary
    if (config.compilerPath.value) {
        if (config.compilerPath.value.toLowerCase().endsWith('.jar')) {
            return new JavaCompilerStrategy();
        }
        return new BinaryCompilerStrategy();
    }
    
    // Default to binary compiler strategy (will fail validation if nothing configured)
    return new BinaryCompilerStrategy();
}

/**
 * Resolve srcdirs paths: relative paths are resolved against the project directory
 */
export function resolveSrcDirs(project: Prog8Project): string[] {
    if (!project.srcdirs || project.srcdirs.length === 0) {
        return [];
    }
    return project.srcdirs.map(dir => {
        if (path.isAbsolute(dir)) {
            return dir;
        }
        return path.join(project.projectDir, dir);
    });
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
