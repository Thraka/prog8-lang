import { libraries } from './librarySymbols';

export interface Parameter {
    name: string;
    type: string;
    register?: string;
}

export interface ReturnType {
    type: string;
    register?: string;
}

export interface SubroutineInfo {
    name: string;
    parameters: Parameter[];
    returns: ReturnType[];
    clobbers: string[];
    address?: string;
    bank?: number;
    isAlias?: string;
}

export interface VariableInfo {
    name: string;
    type: string;
    isMemoryMapped: boolean;
    isShared: boolean;
    isZeroPage: boolean;
}

export interface ConstantInfo {
    name: string;
    type: string;
    value?: string;
}

export interface BlockInfo {
    name: string;
    subroutines: SubroutineInfo[];
    variables: VariableInfo[];
    constants: ConstantInfo[];
}

export interface ModuleInfo {
    name: string;
    blocks: BlockInfo[];
}

export interface LibraryData {
    target: string;
    version: string;
    modules: ModuleInfo[];
}

/**
 * Get all subroutines for a given block across all targets
 */
export function getSubroutinesForBlock(blockName: string, target?: string): SubroutineInfo[] {
    const results: SubroutineInfo[] = [];
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    results.push(...block.subroutines);
                }
            }
        }
    }
    
    return results;
}

/**
 * Find a subroutine by fully qualified name (e.g., "txt.print", "sys.memset")
 */
export function findSubroutine(qualifiedName: string, target?: string): SubroutineInfo | undefined {
    const [blockName, subName] = qualifiedName.split('.');
    if (!blockName || !subName) return undefined;
    
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    const sub = block.subroutines.find(s => s.name === subName);
                    if (sub) return sub;
                }
            }
        }
    }
    
    return undefined;
}

/**
 * Get all blocks across all modules for a target
 */
export function getAllBlocks(target?: string): BlockInfo[] {
    const results: BlockInfo[] = [];
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            results.push(...mod.blocks);
        }
    }
    
    return results;
}

/**
 * Get all modules for a target
 */
export function getAllModules(target?: string): ModuleInfo[] {
    const results: ModuleInfo[] = [];
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        results.push(...lib.modules);
    }
    
    return results;
}

/**
 * Find a module by name
 */
export function findModule(moduleName: string, target?: string): ModuleInfo | undefined {
    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);
    
    for (const lib of targetLibs) {
        const mod = lib.modules.find(m => m.name === moduleName);
        if (mod) return mod;
    }
    
    return undefined;
}

/**
 * Find a variable in a library block by qualified name (e.g., "bmx.error_message")
 */
export function findVariable(qualifiedName: string, target?: string): { variable: VariableInfo; blockName: string } | undefined {
    const parts = qualifiedName.split('.');
    if (parts.length !== 2) return undefined;
    const [blockName, varName] = parts;

    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);

    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    const variable = block.variables.find(v => v.name === varName);
                    if (variable) return { variable, blockName };
                }
            }
        }
    }

    return undefined;
}

/**
 * Find a constant in a library block by qualified name (e.g., "cbm.READST")
 */
export function findConstant(qualifiedName: string, target?: string): { constant: ConstantInfo; blockName: string } | undefined {
    const parts = qualifiedName.split('.');
    if (parts.length !== 2) return undefined;
    const [blockName, constName] = parts;

    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);

    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    const constant = block.constants.find(c => c.name === constName);
                    if (constant) return { constant, blockName };
                }
            }
        }
    }

    return undefined;
}

/**
 * Find a subroutine parameter by 3-part qualified name (e.g., "diskio.lf_start_list.pattern_ptr")
 * In Prog8, sub parameters are accessible as local variables via scoped paths.
 */
export function findSubroutineParameter(qualifiedName: string, target?: string): { parameter: Parameter; sub: SubroutineInfo; blockName: string } | undefined {
    const parts = qualifiedName.split('.');
    if (parts.length !== 3) return undefined;
    const [blockName, subName, paramName] = parts;

    const targetLibs = target ? [libraries[target]].filter(Boolean) : Object.values(libraries);

    for (const lib of targetLibs) {
        for (const mod of lib.modules) {
            for (const block of mod.blocks) {
                if (block.name === blockName) {
                    const sub = block.subroutines.find(s => s.name === subName);
                    if (sub) {
                        const parameter = sub.parameters.find(p => p.name === paramName);
                        if (parameter) return { parameter, sub, blockName };
                    }
                }
            }
        }
    }

    return undefined;
}

/**
 * Get all members (parameters) of a library subroutine for completions.
 * Used when the user types "block.sub." to offer parameter completions.
 */
export function getSubroutineMembers(qualifiedSubName: string, target?: string): Parameter[] {
    const sub = findSubroutine(qualifiedSubName, target);
    if (sub) {
        return sub.parameters;
    }
    return [];
}
