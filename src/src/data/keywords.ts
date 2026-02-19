/**
 * Prog8 and ProgB keyword definitions.
 * These are language keywords for auto-completion and hover information.
 */

export interface KeywordInfo {
    description: string;
    category: string;
}

/**
 * Prog8-specific keywords (C/Python-style syntax, lowercase)
 */
export const prog8Keywords: { [key: string]: KeywordInfo } = {
    // Types
    'ubyte': { description: 'Unsigned 8-bit integer (0-255)', category: 'type' },
    'byte': { description: 'Signed 8-bit integer (-128 to 127)', category: 'type' },
    'uword': { description: 'Unsigned 16-bit integer (0-65535)', category: 'type' },
    'word': { description: 'Signed 16-bit integer (-32768 to 32767)', category: 'type' },
    'ulong': { description: 'Unsigned 32-bit integer', category: 'type' },
    'long': { description: 'Signed 32-bit integer', category: 'type' },
    'float': { description: 'Floating point number (5 bytes on CBM systems)', category: 'type' },
    'bool': { description: 'Boolean value (true or false)', category: 'type' },
    'str': { description: 'String (null-terminated)', category: 'type' },
    
    // Control flow
    'if': { description: 'Conditional statement', category: 'control flow' },
    'else': { description: 'Alternative branch of an if statement', category: 'control flow' },
    'then': { description: 'Then clause (optional in single-line if)', category: 'control flow' },
    'when': { description: 'Multi-way branch (like switch/case)', category: 'control flow' },
    'for': { description: 'For loop - note: loop variable must be declared before the loop', category: 'control flow' },
    'while': { description: 'While loop - executes while condition is true', category: 'control flow' },
    'do': { description: 'Do-until loop - executes at least once', category: 'control flow' },
    'until': { description: 'Loop termination condition', category: 'control flow' },
    'repeat': { description: 'Repeat loop - executes a fixed number of times', category: 'control flow' },
    'unroll': { description: 'Unroll a loop at compile time', category: 'control flow' },
    'break': { description: 'Exit the current loop', category: 'control flow' },
    'continue': { description: 'Skip to the next iteration of the loop', category: 'control flow' },
    'return': { description: 'Return from subroutine', category: 'control flow' },
    'defer': { description: 'Execute statement when leaving the current subroutine', category: 'control flow' },
    'goto': { description: 'Jump to a label', category: 'control flow' },
    'on': { description: 'On-goto computed jump', category: 'control flow' },
    'call': { description: 'Call a subroutine at address', category: 'control flow' },
    
    // Conditional status flag checks
    'if_cs': { description: 'Branch if carry set', category: 'conditional' },
    'if_cc': { description: 'Branch if carry clear', category: 'conditional' },
    'if_vs': { description: 'Branch if overflow set', category: 'conditional' },
    'if_vc': { description: 'Branch if overflow clear', category: 'conditional' },
    'if_eq': { description: 'Branch if equal (zero flag set)', category: 'conditional' },
    'if_z': { description: 'Branch if zero', category: 'conditional' },
    'if_ne': { description: 'Branch if not equal (zero flag clear)', category: 'conditional' },
    'if_nz': { description: 'Branch if not zero', category: 'conditional' },
    'if_pl': { description: 'Branch if plus (positive)', category: 'conditional' },
    'if_pos': { description: 'Branch if positive', category: 'conditional' },
    'if_mi': { description: 'Branch if minus (negative)', category: 'conditional' },
    'if_neg': { description: 'Branch if negative', category: 'conditional' },
    
    // Operators
    'and': { description: 'Logical AND operator', category: 'operator' },
    'or': { description: 'Logical OR operator', category: 'operator' },
    'xor': { description: 'Logical XOR operator', category: 'operator' },
    'not': { description: 'Logical NOT operator', category: 'operator' },
    'in': { description: 'Check if value is in array or range', category: 'operator' },
    'as': { description: 'Type cast operator', category: 'operator' },
    'to': { description: 'Range specifier (ascending)', category: 'operator' },
    'downto': { description: 'Range specifier (descending)', category: 'operator' },
    'step': { description: 'Loop step value', category: 'operator' },
    
    // Subroutines
    'sub': { description: 'Subroutine definition', category: 'declaration' },
    'asmsub': { description: 'Assembly subroutine with register parameters', category: 'declaration' },
    'extsub': { description: 'External subroutine (ROM or library)', category: 'declaration' },
    'inline': { description: 'Inline the subroutine at each call site', category: 'modifier' },
    'clobbers': { description: 'Specify registers clobbered by asmsub', category: 'modifier' },
    
    // Other declarations
    'const': { description: 'Constant value (compile-time)', category: 'declaration' },
    'struct': { description: 'Structure type definition', category: 'declaration' },
    'alias': { description: 'Create an alias for another identifier', category: 'declaration' },
    'void': { description: 'Discard the return value of a function', category: 'modifier' },
    
    // Literals
    'true': { description: 'Boolean true value', category: 'literal' },
    'false': { description: 'Boolean false value', category: 'literal' },
    
    // Directives
    '%import': { description: 'Import a module', category: 'directive' },
    '%encoding': { description: 'Set default string encoding', category: 'directive' },
    '%launcher': { description: 'Set program launcher type', category: 'directive' },
    '%option': { description: 'Set compiler option', category: 'directive' },
    '%output': { description: 'Set output type (raw or prg)', category: 'directive' },
    '%zeropage': { description: 'Zero page configuration (basicsafe, kernalsafe, full, dontuse)', category: 'directive' },
    '%zpallowed': { description: 'Specify allowed zero page range', category: 'directive' },
    '%zpreserved': { description: 'Specify reserved zero page range', category: 'directive' },
    '%address': { description: 'Set load address', category: 'directive' },
    '%memtop': { description: 'Set memory top address', category: 'directive' },
    '%align': { description: 'Align to memory boundary', category: 'directive' },
    '%asmbinary': { description: 'Include binary file in assembly output', category: 'directive' },
    '%asminclude': { description: 'Include assembly source file', category: 'directive' },
    '%asm': { description: 'Start inline assembly block', category: 'directive' },
    '%ir': { description: 'Start intermediate representation block', category: 'directive' },
    '%breakpoint': { description: 'Insert debugger breakpoint', category: 'directive' },
    '%jmptable': { description: 'Generate jump table', category: 'directive' },
};

/**
 * ProgB-specific keywords (BASIC-style syntax, uppercase)
 */
export const progbKeywords: { [key: string]: KeywordInfo } = {
    // Types (uppercase, STRING instead of str, PTR added)
    'UBYTE': { description: 'Unsigned 8-bit integer (0-255)', category: 'type' },
    'BYTE': { description: 'Signed 8-bit integer (-128 to 127)', category: 'type' },
    'UWORD': { description: 'Unsigned 16-bit integer (0-65535)', category: 'type' },
    'WORD': { description: 'Signed 16-bit integer (-32768 to 32767)', category: 'type' },
    'LONG': { description: 'Signed 32-bit integer', category: 'type' },
    'FLOAT': { description: 'Floating point number (5 bytes on CBM systems)', category: 'type' },
    'BOOL': { description: 'Boolean value (TRUE or FALSE)', category: 'type' },
    'STRING': { description: 'String (null-terminated)', category: 'type' },
    'PTR': { description: 'Pointer type', category: 'type' },
    
    // Control flow
    'IF': { description: 'Conditional statement', category: 'control flow' },
    'IIF': { description: 'Inline conditional expression', category: 'control flow' },
    'THEN': { description: 'Then clause of IF statement', category: 'control flow' },
    'ELSE': { description: 'Alternative branch of an IF statement', category: 'control flow' },
    'ELSEIF': { description: 'Else-if branch', category: 'control flow' },
    'END IF': { description: 'End of IF block', category: 'control flow' },
    'SELECT CASE': { description: 'Multi-way branch (like switch/case)', category: 'control flow' },
    'CASE': { description: 'Case in SELECT statement', category: 'control flow' },
    'END SELECT': { description: 'End of SELECT block', category: 'control flow' },
    'FOR': { description: 'For loop', category: 'control flow' },
    'EACH': { description: 'For-each iteration', category: 'control flow' },
    'NEXT': { description: 'End of FOR loop', category: 'control flow' },
    'WHILE': { description: 'While loop', category: 'control flow' },
    'WEND': { description: 'End of WHILE loop', category: 'control flow' },
    'DO': { description: 'Do loop', category: 'control flow' },
    'LOOP': { description: 'End of DO loop', category: 'control flow' },
    'UNTIL': { description: 'Loop termination condition', category: 'control flow' },
    'REPEAT': { description: 'Repeat loop', category: 'control flow' },
    'END REPEAT': { description: 'End of REPEAT block', category: 'control flow' },
    'UNROLL': { description: 'Unroll a loop at compile time', category: 'control flow' },
    'END UNROLL': { description: 'End of UNROLL block', category: 'control flow' },
    'BREAK': { description: 'Exit the current loop', category: 'control flow' },
    'EXIT': { description: 'Exit the current loop or subroutine', category: 'control flow' },
    'CONTINUE': { description: 'Skip to the next iteration of the loop', category: 'control flow' },
    'RETURN': { description: 'Return from subroutine', category: 'control flow' },
    'DEFER': { description: 'Execute statement when leaving the current subroutine', category: 'control flow' },
    'END DEFER': { description: 'End of DEFER block', category: 'control flow' },
    'GOTO': { description: 'Jump to a label', category: 'control flow' },
    'ON': { description: 'On-goto computed jump', category: 'control flow' },
    'CALL': { description: 'Call a subroutine', category: 'control flow' },
    
    // Conditional status flag checks
    'IF_CS': { description: 'Branch if carry set', category: 'conditional' },
    'IF_CC': { description: 'Branch if carry clear', category: 'conditional' },
    'IF_VS': { description: 'Branch if overflow set', category: 'conditional' },
    'IF_VC': { description: 'Branch if overflow clear', category: 'conditional' },
    'IF_EQ': { description: 'Branch if equal (zero flag set)', category: 'conditional' },
    'IF_Z': { description: 'Branch if zero', category: 'conditional' },
    'IF_NE': { description: 'Branch if not equal (zero flag clear)', category: 'conditional' },
    'IF_NZ': { description: 'Branch if not zero', category: 'conditional' },
    'IF_PL': { description: 'Branch if plus (positive)', category: 'conditional' },
    'IF_POS': { description: 'Branch if positive', category: 'conditional' },
    'IF_MI': { description: 'Branch if minus (negative)', category: 'conditional' },
    'IF_NEG': { description: 'Branch if negative', category: 'conditional' },
    
    // Logical operators
    'AND': { description: 'Logical AND operator', category: 'operator' },
    'OR': { description: 'Logical OR operator', category: 'operator' },
    'XOR': { description: 'Logical XOR operator', category: 'operator' },
    'NOT': { description: 'Logical NOT operator', category: 'operator' },
    
    // Bitwise operators
    'BITNOT': { description: 'Bitwise NOT operator', category: 'operator' },
    'BITAND': { description: 'Bitwise AND operator', category: 'operator' },
    'BITOR': { description: 'Bitwise OR operator', category: 'operator' },
    'BITXOR': { description: 'Bitwise XOR operator', category: 'operator' },
    'SHL': { description: 'Shift left operator', category: 'operator' },
    'SHR': { description: 'Shift right operator', category: 'operator' },
    
    // Other operators
    'MOD': { description: 'Modulo operator', category: 'operator' },
    'IN': { description: 'Check if value is in array or range', category: 'operator' },
    'TO': { description: 'Range specifier (ascending)', category: 'operator' },
    'DOWNTO': { description: 'Range specifier (descending)', category: 'operator' },
    'STEP': { description: 'Loop step value', category: 'operator' },
    'INC': { description: 'Increment operator', category: 'operator' },
    'DEC': { description: 'Decrement operator', category: 'operator' },
    
    // Subroutines
    'SUB': { description: 'Subroutine definition', category: 'declaration' },
    'END SUB': { description: 'End of SUB block', category: 'declaration' },
    'FUNCTION': { description: 'Function definition (returns a value)', category: 'declaration' },
    'END FUNCTION': { description: 'End of FUNCTION block', category: 'declaration' },
    'ASMSUB': { description: 'Assembly subroutine with register parameters', category: 'declaration' },
    'END ASMSUB': { description: 'End of ASMSUB block', category: 'declaration' },
    'EXTSUB': { description: 'External subroutine (ROM or library)', category: 'declaration' },
    'INLINE': { description: 'Inline the subroutine at each call site', category: 'modifier' },
    'CLOBBERS': { description: 'Specify registers clobbered by asmsub', category: 'modifier' },
    'AT BANK': { description: 'Specify bank for far call', category: 'modifier' },
    
    // Variables and declarations
    'MODULE': { description: 'Module/block definition', category: 'declaration' },
    'END MODULE': { description: 'End of MODULE block', category: 'declaration' },
    'DIM': { description: 'Variable declaration', category: 'declaration' },
    'CONST': { description: 'Constant value (compile-time)', category: 'declaration' },
    'AS': { description: 'Type specifier', category: 'declaration' },
    'TYPE': { description: 'Structure type definition', category: 'declaration' },
    'END TYPE': { description: 'End of TYPE block', category: 'declaration' },
    'ALIAS': { description: 'Create an alias for another identifier', category: 'declaration' },
    'VOID': { description: 'Discard the return value of a function', category: 'modifier' },
    'AT': { description: 'Memory address specifier', category: 'modifier' },
    'SHARED': { description: 'Shared variable modifier', category: 'modifier' },
    
    // Assembly blocks
    'ASM': { description: 'Start inline assembly block', category: 'assembly' },
    'END ASM': { description: 'End inline assembly block', category: 'assembly' },
    'IR': { description: 'Start intermediate representation block', category: 'assembly' },
    'END IR': { description: 'End intermediate representation block', category: 'assembly' },
    
    // Directives
    'IMPORT': { description: 'Import a module', category: 'directive' },
    'ENCODING': { description: 'Set string encoding', category: 'directive' },
    'LAUNCHER': { description: 'Set program launcher type', category: 'directive' },
    'OPTION': { description: 'Set compiler option', category: 'directive' },
    'OUTPUT': { description: 'Set output type', category: 'directive' },
    'ZEROPAGE': { description: 'Zero page configuration', category: 'directive' },
    'ZPALLOWED': { description: 'Specify allowed zero page range', category: 'directive' },
    'ZPRESERVED': { description: 'Specify reserved zero page range', category: 'directive' },
    'ADDRESS': { description: 'Set load address', category: 'directive' },
    'MEMTOP': { description: 'Set memory top address', category: 'directive' },
    'ALIGN': { description: 'Align to memory boundary', category: 'directive' },
    'ASMBINARY': { description: 'Include binary file in assembly', category: 'directive' },
    'ASMINCLUDE': { description: 'Include assembly source file', category: 'directive' },
    'JMPTABLE': { description: 'Generate jump table', category: 'directive' },
    'BREAKPOINT': { description: 'Insert debugger breakpoint', category: 'directive' },
    'MERGE': { description: 'Merge blocks', category: 'directive' },
    'FORCE_OUTPUT': { description: 'Force output of symbol', category: 'directive' },
    'VERAFXMULS': { description: 'Use VERA FX for multiplication', category: 'directive' },
    
    // Built-in functions that need casing
    'ADDRESSOF': { description: 'Get the address of a variable', category: 'declaration' },
    'TYPEDADDR': { description: 'Get the typed address of a variable', category: 'declaration' },
    
    // Literals
    'TRUE': { description: 'Boolean true value', category: 'literal' },
    'FALSE': { description: 'Boolean false value', category: 'literal' },
    
    // Comments
    'REM': { description: 'Comment (rest of line is ignored)', category: 'comment' },
};

/**
 * Get all keywords for a specific language
 * @param isProgB Whether to get ProgB keywords (true) or Prog8 keywords (false)
 * @returns Language-specific keywords
 */
export function getKeywordsForLanguage(isProgB: boolean): { [key: string]: KeywordInfo } {
    return isProgB ? progbKeywords : prog8Keywords;
}

/**
 * ProgB block pairs for folding, casing, and validation.
 * These define the start/end keyword pairs for block structures.
 */
export interface BlockPair {
    start: string;
    end: string;
}

export const progbBlockPairs: BlockPair[] = [
    { start: 'MODULE', end: 'END MODULE' },
    { start: 'SUB', end: 'END SUB' },
    { start: 'FUNCTION', end: 'END FUNCTION' },
    { start: 'ASMSUB', end: 'END ASMSUB' },
    { start: 'IF', end: 'END IF' },
    { start: 'SELECT', end: 'END SELECT' },
    { start: 'TYPE', end: 'END TYPE' },
    { start: 'FOR', end: 'NEXT' },
    { start: 'WHILE', end: 'WEND' },
    { start: 'DO', end: 'LOOP' },
    { start: 'REPEAT', end: 'END REPEAT' },
    { start: 'DEFER', end: 'END DEFER' },
    { start: 'ASM', end: 'END ASM' },
    { start: 'IR', end: 'END IR' },
    { start: 'UNROLL', end: 'END UNROLL' },
];

/**
 * Get all ProgB keywords as a flat list (for casing purposes).
 * This includes both single keywords and compound keywords like "END IF".
 */
export function getAllProgBKeywords(): string[] {
    const keywords = Object.keys(progbKeywords);
    return keywords;
}
