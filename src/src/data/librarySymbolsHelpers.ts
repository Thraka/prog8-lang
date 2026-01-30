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
 * Format a subroutine signature for display
 */
export function formatSubroutineSignature(sub: SubroutineInfo): string {
    if (sub.isAlias) {
        return `${sub.name}  (alias for ${sub.isAlias})`;
    }
    
    const params = sub.parameters.map(p => {
        let s = `${p.type} ${p.name}`;
        if (p.register) s += ` ${p.register}`;
        return s;
    }).join(', ');
    
    let sig = `${sub.name}(${params})`;
    
    if (sub.returns.length > 0) {
        const rets = sub.returns.map(r => {
            let s = r.type;
            if (r.register) s += ` ${r.register}`;
            return s;
        }).join(', ');
        sig += ` -> ${rets}`;
    }
    
    if (sub.clobbers.length > 0) {
        sig += `  clobbers (${sub.clobbers.join(',')})`;
    }
    
    if (sub.address) {
        sig += `  = ${sub.address}`;
    }
    
    if (sub.bank !== undefined) {
        sig += `  @bank ${sub.bank}`;
    }
    
    return sig;
}
