/**
 * Prog8 built-in function definitions.
 * These are functions that are built into the Prog8 compiler itself,
 * not provided by library modules.
 */

export interface BuiltinFunctionInfo {
    signature: string;
    description: string;
    category: string;
}

export const builtinFunctions: { [key: string]: BuiltinFunctionInfo } = {
    // Math functions
    'abs': {
        signature: 'abs(value) -> same type',
        description: 'Returns the absolute value of a number (integer or floating point)',
        category: 'Math'
    },
    'min': {
        signature: 'min(a, b) -> same type',
        description: 'Returns the minimum of two values',
        category: 'Math'
    },
    'max': {
        signature: 'max(a, b) -> same type',
        description: 'Returns the maximum of two values',
        category: 'Math'
    },
    'minf': {
        signature: 'minf(a, b) -> float',
        description: 'Returns the minimum of two floating point values',
        category: 'Math'
    },
    'maxf': {
        signature: 'maxf(a, b) -> float',
        description: 'Returns the maximum of two floating point values',
        category: 'Math'
    },
    'clamp': {
        signature: 'clamp(value, min, max) -> same type',
        description: 'Restricts value to be within the specified minimum and maximum bounds',
        category: 'Math'
    },
    'clampf': {
        signature: 'clampf(value, min, max) -> float',
        description: 'Restricts float value to be within the specified minimum and maximum bounds',
        category: 'Math'
    },
    'sgn': {
        signature: 'sgn(value) -> byte',
        description: 'Returns the sign of a number: -1 for negative, 0 for zero, 1 for positive',
        category: 'Math'
    },
    'sqrt': {
        signature: 'sqrt(value) -> ubyte',
        description: 'Returns the integer square root. For the reverse (squaring), just write x*x',
        category: 'Math'
    },
    'divmod': {
        signature: 'divmod(dividend, divisor, quotient, remainder)',
        description: 'Computes both quotient and remainder of division in one operation',
        category: 'Math'
    },

    // Byte/word construction and extraction
    'lsb': {
        signature: 'lsb(x) -> ubyte',
        description: 'Get the least significant (lower) byte of a word/long. Equivalent to x & 255',
        category: 'Byte/Word'
    },
    'msb': {
        signature: 'msb(x) -> ubyte',
        description: 'Get the most significant (highest) byte of a word or long value',
        category: 'Byte/Word'
    },
    'lsw': {
        signature: 'lsw(x) -> uword',
        description: 'Get the least significant (lower) word. Equivalent to x & 65535',
        category: 'Byte/Word'
    },
    'msw': {
        signature: 'msw(x) -> uword',
        description: 'Get the most significant (higher) word of a long value',
        category: 'Byte/Word'
    },
    'mkword': {
        signature: 'mkword(msb, lsb) -> uword',
        description: 'Efficiently create a word from two bytes. mkword($80, $22) = $8022. Note: args are MSB first, then LSB',
        category: 'Byte/Word'
    },
    'mklong': {
        signature: 'mklong(msb, b2, b1, lsb) -> long',
        description: 'Efficiently create a long from four bytes. mklong($12, $34, $56, $78) = $12345678',
        category: 'Byte/Word'
    },
    'mklong2': {
        signature: 'mklong2(msw, lsw) -> long',
        description: 'Efficiently create a long from two words. mklong2($1234, $abcd) = $1234abcd',
        category: 'Byte/Word'
    },
    'setlsb': {
        signature: 'setlsb(x, value)',
        description: 'Sets the least significant byte of word variable x to a new value. Leaves MSB untouched',
        category: 'Byte/Word'
    },
    'setmsb': {
        signature: 'setmsb(x, value)',
        description: 'Sets the most significant byte of word variable x to a new value. Leaves LSB untouched',
        category: 'Byte/Word'
    },

    // Bit rotation
    'rol': {
        signature: 'rol(variable)',
        description: 'Rotate left through carry flag (9-bit rotation for bytes, 17-bit for words). Modifies in-place',
        category: 'Bit Rotation'
    },
    'ror': {
        signature: 'ror(variable)',
        description: 'Rotate right through carry flag (9-bit rotation for bytes, 17-bit for words). Modifies in-place',
        category: 'Bit Rotation'
    },
    'rol2': {
        signature: 'rol2(variable)',
        description: 'Rotate left as pure 8/16-bit rotation (ignores carry). Modifies in-place. Can use @($addr) syntax',
        category: 'Bit Rotation'
    },
    'ror2': {
        signature: 'ror2(variable)',
        description: 'Rotate right as pure 8/16-bit rotation (ignores carry). Modifies in-place. Can use @($addr) syntax',
        category: 'Bit Rotation'
    },

    // Memory functions
    'sizeof': {
        signature: 'sizeof(name) -> ubyte',
        description: 'Returns the size in bytes of an object, number, or datatype. For element count, use len()',
        category: 'Memory'
    },
    'len': {
        signature: 'len(array_or_string) -> ubyte',
        description: 'Returns the number of elements in an array, or characters in a string (excluding 0-byte). Determined at compile-time!',
        category: 'Memory'
    },
    'memory': {
        signature: 'memory(name, size, alignment) -> uword',
        description: 'Reserves a block of uninitialized memory. Name must be a string literal. Returns address. Same name+size returns same address',
        category: 'Memory'
    },
    'peek': {
        signature: 'peek(address) -> ubyte',
        description: 'Reads a byte from the given memory address. Same as @(address)',
        category: 'Memory'
    },
    'peekw': {
        signature: 'peekw(address) -> uword',
        description: 'Reads a word (little-endian) from memory. Requires consecutive LSB/MSB bytes (not split arrays)',
        category: 'Memory'
    },
    'peekl': {
        signature: 'peekl(address) -> long',
        description: 'Reads a signed long value (little-endian) from memory',
        category: 'Memory'
    },
    'peekf': {
        signature: 'peekf(address) -> float',
        description: 'Reads a float from memory (5 bytes on CBM machines)',
        category: 'Memory'
    },
    'poke': {
        signature: 'poke(address, value)',
        description: 'Writes a byte to memory. Same as @(address)=value',
        category: 'Memory'
    },
    'pokew': {
        signature: 'pokew(address, value)',
        description: 'Writes a word to memory in little-endian byte order',
        category: 'Memory'
    },
    'pokel': {
        signature: 'pokel(address, value)',
        description: 'Writes a signed long to memory in little-endian byte order',
        category: 'Memory'
    },
    'pokef': {
        signature: 'pokef(address, value)',
        description: 'Writes a float to memory (5 bytes on CBM machines)',
        category: 'Memory'
    },
    'pokemon': {
        signature: 'pokemon(address, value) -> ubyte',
        description: 'Like poke(), but also returns the previous value at the address',
        category: 'Memory'
    },

    // Array operations
    'any': {
        signature: 'any(array) -> bool',
        description: 'Returns true if any element in the array is non-zero',
        category: 'Array'
    },
    'all': {
        signature: 'all(array) -> bool',
        description: 'Returns true if all elements in the array are non-zero',
        category: 'Array'
    },
    'reverse': {
        signature: 'reverse(array)',
        description: 'Reverses the array in place',
        category: 'Array'
    },
    'sort': {
        signature: 'sort(array)',
        description: 'Sorts the array in place (ascending order)',
        category: 'Array'
    },

    // System/calling
    'call': {
        signature: 'call(address) -> uword',
        description: 'Calls a subroutine at address. Returns value in AY. Use cx16.r0 etc for args. Creates indirect JSR',
        category: 'System'
    },
    'callfar': {
        signature: 'callfar(bank, address, argumentword) -> uword',
        description: 'Calls routine in another bank. Loads arg into A+Y before call. Inefficient - use sparingly (cx16)',
        category: 'System'
    },
    'callfar2': {
        signature: 'callfar2(bank, address, argA, argX, argY, argCarry) -> uword',
        description: 'Like callfar but with individual A, X, Y register args and Carry bit (cx16)',
        category: 'System'
    },

    // Comparisons
    'cmp': {
        signature: 'cmp(a, b) -> byte',
        description: 'Compares two values, returns -1 (a<b), 0 (a==b), or 1 (a>b)',
        category: 'Comparison'
    },

    // Random
    'rnd': {
        signature: 'rnd() -> ubyte',
        description: 'Returns a pseudo-random byte',
        category: 'Random'
    },
    'rndw': {
        signature: 'rndw() -> uword',
        description: 'Returns a pseudo-random word',
        category: 'Random'
    },
};

/**
 * Get all built-in function names
 */
export function getAllBuiltinNames(): string[] {
    return Object.keys(builtinFunctions);
}

/**
 * Get built-in function info by name (case-insensitive)
 */
export function getBuiltinFunction(name: string): BuiltinFunctionInfo | undefined {
    return builtinFunctions[name.toLowerCase()];
}

/**
 * Get all built-in functions in a specific category
 */
export function getBuiltinsByCategory(category: string): { name: string; info: BuiltinFunctionInfo }[] {
    return Object.entries(builtinFunctions)
        .filter(([_, info]) => info.category === category)
        .map(([name, info]) => ({ name, info }));
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
    const categories = new Set<string>();
    for (const info of Object.values(builtinFunctions)) {
        categories.add(info.category);
    }
    return Array.from(categories);
}
