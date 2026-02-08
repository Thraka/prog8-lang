import * as vscode from 'vscode';
import * as path from 'path';
import { Prog8Project } from './projectFile';

/**
 * Represents a resolved setting with its source and requirement status
 */
export interface ResolvedSetting<T = string> {
    /** The resolved value (may be undefined) */
    value: T | undefined;
    /** Where the value came from */
    source: 'project-file' | 'workspace' | 'none';
    /** Whether this setting is required for the current compilation scenario */
    required: boolean;
}

/**
 * Settings resolver that implements hierarchical settings resolution
 * Priority: Project File > Workspace Settings > None
 * 
 * IMPORTANT: For each setting, only ONE source is used:
 * - If set in project file → uses project file value, workspace setting is IGNORED
 * - If NOT in project file → uses workspace setting
 * - If in neither → returns undefined
 * 
 * This ensures project overrides are absolute - no mixing of sources per setting.
 */
export class SettingsResolver {
    /**
     * Resolve a compiler/tool path setting
     * 
     * This method returns the value from ONLY ONE source with strict priority:
     * 1. Project file value (if present) - workspace setting is completely ignored
     * 2. Workspace setting (only checked if project file doesn't have it)
     * 3. None (if neither source has the value)
     * 
     * @param settingKey The key in the project file (e.g., 'compilerPath')
     * @param configKey The key in workspace config (e.g., 'compiler.path')
     * @param project Optional project with potential overrides
     * @param required Whether this setting is required for the current scenario
     * @returns Resolved setting with source information - value comes from ONLY ONE source
     */
    resolve(
        settingKey: keyof Prog8Project,
        configKey: string,
        project?: Prog8Project,
        required: boolean = false
    ): ResolvedSetting<string> {
        // 1. Check project file first - if found, return immediately without checking workspace
        if (project && project[settingKey]) {
            let projectValue = project[settingKey] as string;
            // Resolve relative paths against the project file directory
            if (!path.isAbsolute(projectValue)) {
                projectValue = path.resolve(project.projectDir, projectValue);
            }
            // IMPORTANT: We return here, workspace config is NOT consulted at all
            return {
                value: projectValue,
                source: 'project-file',
                required
            };
        }
        
        // 2. Project file doesn't have this setting, check workspace settings as fallback
        const config = vscode.workspace.getConfiguration('prog8');
        const workspaceValue = config.get<string>(configKey);
        if (workspaceValue) {
            return {
                value: workspaceValue,
                source: 'workspace',
                required
            };
        }
        
        // 3. Not found in either source
        return {
            value: undefined,
            source: 'none',
            required
        };
    }

    /**
     * Build a friendly error message for a missing required setting
     */
    buildErrorMessage(
        settingName: string,
        projectFileKey: string,
        workspaceSettingKey: string
    ): string {
        return `${settingName} not configured. Set either:\n` +
               `  • In project file: "${projectFileKey}"\n` +
               `  • In extension settings: "${workspaceSettingKey}"`;
    }
}

/**
 * Resolved compiler configuration with all paths
 * 
 * Each setting contains only ONE value from ONE source:
 * - value: The resolved path (project file OR workspace setting, never both)
 * - source: Which source provided the value ('project-file' | 'workspace' | 'none')
 * - required: Whether the setting is required for the current compilation mode
 */
export interface ResolvedCompilerConfig {
    compilerPath: ResolvedSetting<string>;
    javaPath: ResolvedSetting<string>;
    assemblerFolder: ResolvedSetting<string>;
    emulatorFolder: ResolvedSetting<string>;
}

/**
 * Resolve all compiler-related settings with strict override behavior
 * 
 * For each setting, project file values completely override extension settings.
 * There is no mixing - each path comes from exactly one source.
 * 
 * Example:
 * - Project file has: compilerPath="./local/prog8c.exe"
 * - Extension has: prog8.compiler.path="C:/global/prog8c.jar", prog8.compiler.assemblerFolder="C:/global/tass"
 * 
 * Result:
 * - compilerPath.value = "./local/prog8c.exe" (from project, extension setting ignored)
 * - assemblerFolder.value = "C:/global/tass" (from extension, not in project)
 * 
 * @param project Project configuration with optional path overrides
 * @param requireCompiler Whether compiler path is required
 * @param requireTass Whether 64tass path is required
 * @param requireJava Whether Java path is required
 * @param requireEmulator Whether emulator path is required
 * @returns Resolved configuration where each setting has ONE value from ONE source
 */
export function resolveAllCompilerSettings(
    project?: Prog8Project,
    requireCompiler: boolean = true,
    requireTass: boolean = true,
    requireJava: boolean = false,
    requireEmulator: boolean = false
): ResolvedCompilerConfig {
    const resolver = new SettingsResolver();
    
    // Each resolve() call returns a value from ONLY ONE source (project OR workspace, never mixed)
    return {
        compilerPath: resolver.resolve('compilerPath', 'compiler.path', project, requireCompiler),
        javaPath: resolver.resolve('javaPath', 'compiler.javaPath', project, requireJava),
        assemblerFolder: resolver.resolve('assemblerFolder', 'compiler.assemblerFolder', project, requireTass),
        emulatorFolder: resolver.resolve('emulatorFolder', 'emulator.folder', project, requireEmulator)
    };
}
