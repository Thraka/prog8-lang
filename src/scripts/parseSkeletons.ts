/**
 * Script to parse Prog8 skeleton files and generate TypeScript data for the extension.
 * 
 * Run with: npx ts-node scripts/parseSkeletons.ts
 * 
 * Input: skeleton files from https://prog8.readthedocs.io/en/latest/_static/symboldumps/
 * Output: src/data/librarySymbols.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface Parameter {
    name: string;
    type: string;
    register?: string;  // e.g., @A, @X, @Y, @AY, @R0, etc.
}

interface ReturnType {
    type: string;
    register?: string;
}

interface SubroutineInfo {
    name: string;
    parameters: Parameter[];
    returns: ReturnType[];
    clobbers: string[];
    address?: string;  // For ROM routines like = $ffd2
    bank?: number;     // For banked routines
    isAlias?: string;  // For aliases like "alias for: floats.print"
}

interface VariableInfo {
    name: string;
    type: string;
    isMemoryMapped: boolean;  // & prefix
    isShared: boolean;        // @shared
    isZeroPage: boolean;      // @zp
}

interface ConstantInfo {
    name: string;
    type: string;
    value?: string;
}

interface BlockInfo {
    name: string;
    subroutines: SubroutineInfo[];
    variables: VariableInfo[];
    constants: ConstantInfo[];
}

interface ModuleInfo {
    name: string;
    blocks: BlockInfo[];
}

interface LibraryData {
    target: string;
    version: string;
    modules: ModuleInfo[];
}

function fetchUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        }).on('error', reject);
    });
}

function parseParameter(paramStr: string): Parameter {
    // Examples:
    // "ubyte value @A"
    // "uword address @XY"
    // "str filename"
    // "^^ubyte buffer @AY"
    // "bool dir @Pc"
    
    const parts = paramStr.trim().split(/\s+/);
    let register: string | undefined;
    
    // Check if last part is a register
    const lastPart = parts[parts.length - 1];
    if (lastPart.startsWith('@')) {
        register = lastPart;
        parts.pop();
    }
    
    const name = parts.pop() || '';
    const type = parts.join(' ');
    
    return { name, type, register };
}

function parseReturnType(returnStr: string): ReturnType[] {
    // Examples:
    // "ubyte @A"
    // "uword @AY"
    // "ubyte @A, bool @Pc"
    // "ubyte @Y, ubyte @A, ubyte @X"
    // "float @FAC1"
    
    const returns: ReturnType[] = [];
    const parts = returnStr.split(',').map(s => s.trim());
    
    for (const part of parts) {
        const tokens = part.split(/\s+/);
        let register: string | undefined;
        
        if (tokens.length > 0 && tokens[tokens.length - 1].startsWith('@')) {
            register = tokens.pop();
        }
        
        const type = tokens.join(' ');
        if (type) {
            returns.push({ type, register });
        }
    }
    
    return returns;
}

function parseSubroutine(line: string): SubroutineInfo | null {
    // Examples:
    // "    CHROUT  (ubyte character @A)  = $ffd2"
    // "    memset  (uword mem @R0, uword numbytes @R1, ubyte value @A)  clobbers (A,X,Y)"
    // "    print  (str text @AY)  clobbers (A,Y)"
    // "    sin  (float angle) -> float"
    // "    print_f   alias for: floats.print"
    // "    bas_fmfreq  (ubyte channel @A, uword freq @XY, bool noretrigger @Pc)  clobbers (A,X,Y) -> bool @Pc @bank 10 = $c000"
    
    const trimmed = line.trim();
    
    // Check for alias
    const aliasMatch = trimmed.match(/^(\w+)\s+alias for:\s*(.+)$/);
    if (aliasMatch) {
        return {
            name: aliasMatch[1],
            parameters: [],
            returns: [],
            clobbers: [],
            isAlias: aliasMatch[2].trim()
        };
    }
    
    // Parse function signature
    // Name followed by parameters in parentheses
    const nameMatch = trimmed.match(/^(\w+)\s*\(/);
    if (!nameMatch) {
        return null;
    }
    
    const name = nameMatch[1];
    
    // Find the parameters (everything between first ( and matching ))
    let parenDepth = 0;
    let paramStart = trimmed.indexOf('(');
    let paramEnd = paramStart;
    
    for (let i = paramStart; i < trimmed.length; i++) {
        if (trimmed[i] === '(') parenDepth++;
        if (trimmed[i] === ')') {
            parenDepth--;
            if (parenDepth === 0) {
                paramEnd = i;
                break;
            }
        }
    }
    
    const paramStr = trimmed.substring(paramStart + 1, paramEnd);
    const parameters: Parameter[] = [];
    
    if (paramStr.trim()) {
        // Split parameters by comma, but be careful about nested types
        const paramParts = paramStr.split(',').map(s => s.trim());
        for (const p of paramParts) {
            if (p) {
                parameters.push(parseParameter(p));
            }
        }
    }
    
    // Rest of the line after parameters
    const rest = trimmed.substring(paramEnd + 1).trim();
    
    // Parse clobbers
    const clobbers: string[] = [];
    const clobberMatch = rest.match(/clobbers\s*\(([^)]+)\)/);
    if (clobberMatch) {
        clobbers.push(...clobberMatch[1].split(',').map(s => s.trim()));
    }
    
    // Parse return type
    let returns: ReturnType[] = [];
    const returnMatch = rest.match(/->\s*([^=@]+?)(?:\s*@bank|\s*=|$)/);
    if (returnMatch) {
        returns = parseReturnType(returnMatch[1].trim());
    }
    
    // Parse address
    let address: string | undefined;
    const addrMatch = rest.match(/=\s*(\$[0-9a-fA-F]+)/);
    if (addrMatch) {
        address = addrMatch[1];
    }
    
    // Parse bank
    let bank: number | undefined;
    const bankMatch = rest.match(/@bank\s*(\d+)/);
    if (bankMatch) {
        bank = parseInt(bankMatch[1]);
    }
    
    return { name, parameters, returns, clobbers, address, bank };
}

function parseVariable(line: string): VariableInfo | null {
    // Examples:
    // "    ubyte[]  buffer"
    // "    ubyte @shared  drivenumber"
    // "    &ubyte  VERA_CTRL"
    // "    uword @zp  sprite_reg"
    // "    ^^ubyte  error_message"
    
    const trimmed = line.trim();
    
    // Check if this is a subroutine (has parentheses)
    if (trimmed.includes('(')) {
        return null;
    }
    
    // Check for const
    if (trimmed.startsWith('const ')) {
        return null;
    }
    
    const isMemoryMapped = trimmed.startsWith('&');
    const isShared = trimmed.includes('@shared');
    const isZeroPage = trimmed.includes('@zp');
    
    // Remove prefixes and annotations
    let cleaned = trimmed.replace(/^&/, '').replace(/@shared\s*/, '').replace(/@zp\s*/, '');
    
    const parts = cleaned.trim().split(/\s+/);
    if (parts.length < 2) {
        return null;
    }
    
    const name = parts[parts.length - 1];
    const type = parts.slice(0, -1).join(' ');
    
    return { name, type, isMemoryMapped, isShared, isZeroPage };
}

function parseConstant(line: string): ConstantInfo | null {
    // Examples:
    // "    const ubyte  MAX_TASKS"
    // "    const float  PI"
    // "    const uword  VERA_BASE"
    
    const trimmed = line.trim();
    
    if (!trimmed.startsWith('const ')) {
        return null;
    }
    
    const withoutConst = trimmed.substring(6).trim();
    const parts = withoutConst.split(/\s+/);
    
    if (parts.length < 2) {
        return null;
    }
    
    const name = parts[parts.length - 1];
    const type = parts.slice(0, -1).join(' ');
    
    return { name, type };
}

function parseSkeleton(content: string, target: string): LibraryData {
    const lines = content.split('\n');
    const modules: ModuleInfo[] = [];
    
    let currentModule: ModuleInfo | null = null;
    let currentBlock: BlockInfo | null = null;
    let version = '';
    
    // Extract version
    const versionMatch = content.match(/Prog8 compiler v([\d.]+)/);
    if (versionMatch) {
        version = versionMatch[1];
    }
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for module header
        const moduleMatch = line.match(/^LIBRARY MODULE NAME:\s*(\S+)/);
        if (moduleMatch) {
            if (currentModule) {
                if (currentBlock) {
                    currentModule.blocks.push(currentBlock);
                    currentBlock = null;
                }
                modules.push(currentModule);
            }
            currentModule = {
                name: moduleMatch[1],
                blocks: []
            };
            continue;
        }
        
        // Check for block start (name followed by {)
        const blockMatch = line.match(/^(\w+)\s*\{/);
        if (blockMatch && currentModule) {
            if (currentBlock) {
                currentModule.blocks.push(currentBlock);
            }
            currentBlock = {
                name: blockMatch[1],
                subroutines: [],
                variables: [],
                constants: []
            };
            continue;
        }
        
        // Check for block end
        if (line.trim() === '}' && currentBlock) {
            if (currentModule) {
                currentModule.blocks.push(currentBlock);
            }
            currentBlock = null;
            continue;
        }
        
        // Parse content inside block
        if (currentBlock && line.trim()) {
            // Skip separator lines
            if (line.match(/^-+$/)) {
                continue;
            }
            
            // Try to parse as constant first
            const constant = parseConstant(line);
            if (constant) {
                currentBlock.constants.push(constant);
                continue;
            }
            
            // Try to parse as subroutine
            const sub = parseSubroutine(line);
            if (sub) {
                currentBlock.subroutines.push(sub);
                continue;
            }
            
            // Try to parse as variable
            const variable = parseVariable(line);
            if (variable) {
                currentBlock.variables.push(variable);
            }
        }
    }
    
    // Don't forget the last module
    if (currentModule) {
        if (currentBlock) {
            currentModule.blocks.push(currentBlock);
        }
        modules.push(currentModule);
    }
    
    return { target, version, modules };
}

function generateTypeScript(libraries: LibraryData[]): string {
    let output = `/**
* Auto-generated Prog8 library symbol data.
* Generated from official Prog8 skeleton files.
* DO NOT EDIT MANUALLY - run parseSkeletons.ts to regenerate.
*/

import { LibraryData } from "./librarySymbolsHelpers";

`;

    for (const lib of libraries) {
        const varName = `library_${lib.target.replace(/-/g, '_')}`;
        output += `export const ${varName}: LibraryData = ${JSON.stringify(lib, null, 2)};\n\n`;
    }

    // Create a combined lookup map
    output += `
/**
 * Map of target -> library data
 */
export const libraries: Record<string, LibraryData> = {
${libraries.map(lib => `    '${lib.target}': library_${lib.target.replace(/-/g, '_')}`).join(',\n')}
};
`;

    return output;
}

async function main() {
    console.log('Fetching Prog8 skeleton files...');
    
    const targets = [
        { name: 'cx16', url: 'https://prog8.readthedocs.io/en/latest/_static/symboldumps/skeletons-cx16.txt' },
        { name: 'c64', url: 'https://prog8.readthedocs.io/en/latest/_static/symboldumps/skeletons-c64.txt' },
        { name: 'c128', url: 'https://prog8.readthedocs.io/en/latest/_static/symboldumps/skeletons-c128.txt' },
        { name: 'pet32', url: 'https://prog8.readthedocs.io/en/latest/_static/symboldumps/skeletons-pet32.txt' },
        { name: 'virtual', url: 'https://prog8.readthedocs.io/en/latest/_static/symboldumps/skeletons-virtual.txt' },
    ];
    
    const libraries: LibraryData[] = [];
    
    for (const target of targets) {
        console.log(`Fetching ${target.name}...`);
        try {
            const content = await fetchUrl(target.url);
            console.log(`Parsing ${target.name}...`);
            const lib = parseSkeleton(content, target.name);
            libraries.push(lib);
            
            // Print stats
            let totalSubs = 0;
            let totalVars = 0;
            let totalConsts = 0;
            for (const mod of lib.modules) {
                for (const block of mod.blocks) {
                    totalSubs += block.subroutines.length;
                    totalVars += block.variables.length;
                    totalConsts += block.constants.length;
                }
            }
            console.log(`  ${lib.modules.length} modules, ${totalSubs} subroutines, ${totalVars} variables, ${totalConsts} constants`);
        } catch (err) {
            console.error(`Error fetching ${target.name}:`, err);
        }
    }
    
    console.log('\nGenerating TypeScript output...');
    const output = generateTypeScript(libraries);
    
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'librarySymbols.ts');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, output);
    console.log(`Written to ${outputPath}`);
    
    // Also output some stats
    console.log('\nSummary:');
    for (const lib of libraries) {
        console.log(`\n${lib.target} (v${lib.version}):`);
        for (const mod of lib.modules) {
            const blockNames = mod.blocks.map(b => b.name).join(', ');
            console.log(`  ${mod.name}: ${blockNames}`);
        }
    }
}

main().catch(console.error);
