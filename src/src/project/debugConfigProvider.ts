import * as vscode from 'vscode';
import * as path from 'path';
import { getProjectForFile, findProjectFile, Prog8Project } from './projectFile';
import { buildProject } from './projectRunner';

/**
 * Debug configuration for Prog8 projects
 */
interface Prog8DebugConfiguration extends vscode.DebugConfiguration {
    projectFile?: string;
}

/**
 * Debug configuration provider for Prog8
 * This enables F5 to build and run Prog8 projects
 */
export class Prog8DebugConfigurationProvider implements vscode.DebugConfigurationProvider {
    
    /**
     * Provide debug configurations to show in launch.json
     */
    provideDebugConfigurations(
        folder: vscode.WorkspaceFolder | undefined,
        token?: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DebugConfiguration[]> {
        return [
            {
                type: 'prog8',
                request: 'launch',
                name: 'Run Prog8 Project'
            }
        ];
    }
    
    /**
     * Resolve the debug configuration before launching
     * This is called when F5 is pressed
     */
    async resolveDebugConfiguration(
        folder: vscode.WorkspaceFolder | undefined,
        config: Prog8DebugConfiguration,
        token?: vscode.CancellationToken
    ): Promise<vscode.DebugConfiguration | undefined> {
        
        // If no config is provided (F5 without launch.json), create a default one
        if (!config.type && !config.request && !config.name) {
            const editor = vscode.window.activeTextEditor;
            
            if (editor && (editor.document.languageId === 'prog8' || editor.document.languageId === 'progb')) {
                config.type = 'prog8';
                config.request = 'launch';
                config.name = 'Run Prog8 Project';
            } else {
                // Not a Prog8 file, don't handle this debug request
                return undefined;
            }
        }
        
        // Make sure it's a Prog8 debug configuration
        if (config.type !== 'prog8') {
            return undefined;
        }
        
        return config;
    }
    
    /**
     * Final resolution after resolveDebugConfiguration
     * Actually perform the build and run
     */
    async resolveDebugConfigurationWithSubstitutedVariables(
        folder: vscode.WorkspaceFolder | undefined,
        config: Prog8DebugConfiguration,
        token?: vscode.CancellationToken
    ): Promise<vscode.DebugConfiguration | undefined> {
        
        if (config.type !== 'prog8') {
            return undefined;
        }
        
        // Get the current file to determine project location
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open. Open a .p8 or .pb file to run.');
            return undefined;
        }
        
        const document = editor.document;
        const languageId = document.languageId;
        
        if (languageId !== 'prog8' && languageId !== 'progb') {
            vscode.window.showErrorMessage('Current file is not a Prog8 or ProgB file.');
            return undefined;
        }
        
        try {
            // Get project configuration
            const project = await getProjectForFile(document.uri);
            
            // Build and run the project
            await buildProject(project, true);
            
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed to run project: ${message}`);
        }
        
        // Return undefined to prevent VS Code from trying to start an actual debug session
        // (we're handling everything ourselves)
        return undefined;
    }
}

/**
 * Debug adapter descriptor factory
 * This tells VS Code we don't have an actual debug adapter
 */
export class Prog8DebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
    createDebugAdapterDescriptor(
        session: vscode.DebugSession,
        executable: vscode.DebugAdapterExecutable | undefined
    ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
        // Return undefined - we handle everything in resolveDebugConfiguration
        return undefined;
    }
}
