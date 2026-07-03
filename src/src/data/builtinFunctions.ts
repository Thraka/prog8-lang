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
        signature: 'abs(x)',
        description: 'Returns the absolute value of a number (integer or floating point).',
        category: 'Math'
    },
    'clamp': {
        signature: 'clamp(value, minimum, maximum)',
        description: 'Returns value restricted to the given minimum and maximum (integer types only).',
        category: 'Math'
    },
    'divmod': {
        signature: 'divmod(dividend, divisor)',
        description: 'Returns quotient and remainder of one division as two ubyte or uword values.',
        category: 'Math'
    },
    'max': {
        signature: 'max(x, y)',
        description: 'Returns the largest of x and y (integer types only).',
        category: 'Math'
    },
    'min': {
        signature: 'min(x, y)',
        description: 'Returns the smallest of x and y (integer types only).',
        category: 'Math'
    },
    'sgn': {
        signature: 'sgn(x)',
        description: 'Returns the sign as byte: -1, 0, or 1.',
        category: 'Math'
    },
    'sqrt': {
        signature: 'sqrt(x)',
        description: 'Returns square root for unsigned integer, long, or floating point input.',
        category: 'Math'
    },

    // Array operations
    'len': {
        signature: 'len(x)',
        description: 'Returns array element count or string character count (excluding trailing 0-byte).',
        category: 'Array'
    },

    // Miscellaneous
    'call': {
        signature: 'call(address) -> uword',
        description: 'Calls a subroutine at address and returns word value from AY.',
        category: 'Miscellaneous'
    },
    'callfar': {
        signature: 'callfar(bank, address, argumentword) -> uword',
        description: 'Calls an assembly routine in another bank and returns uword from AY.',
        category: 'Miscellaneous'
    },
    'callfar2': {
        signature: 'callfar2(bank, address, argA, argX, argY, argCarry) -> uword',
        description: 'Like callfar but with explicit A, X, Y and carry arguments.',
        category: 'Miscellaneous'
    },
    'cmp': {
        signature: 'cmp(x, y)',
        description: 'Compares integer values and sets processor status bits (no value return).',
        category: 'Miscellaneous'
    },
    'lmh': {
        signature: 'lmh(x)',
        description: 'Returns low, mid and high(bank) bytes of a long value (upper byte ignored).',
        category: 'Miscellaneous'
    },
    'lsb': {
        signature: 'lsb(x)',
        description: 'Returns least significant byte of x.',
        category: 'Miscellaneous'
    },
    'msb': {
        signature: 'msb(x)',
        description: 'Returns most significant byte of a word or long value.',
        category: 'Miscellaneous'
    },
    'lsw': {
        signature: 'lsw(x)',
        description: 'Returns least significant word of x.',
        category: 'Miscellaneous'
    },
    'msw': {
        signature: 'msw(x)',
        description: 'Returns most significant word of x.',
        category: 'Miscellaneous'
    },
    'mkword': {
        signature: 'mkword(msb, lsb)',
        description: 'Efficiently creates a word from two bytes (msb then lsb).',
        category: 'Miscellaneous'
    },
    'mklong': {
        signature: 'mklong(msb, b2, b1, lsb)',
        description: 'Efficiently creates a long from four bytes in natural msb-to-lsb argument order.',
        category: 'Miscellaneous'
    },
    'mklong2': {
        signature: 'mklong2(msw, lsw)',
        description: 'Efficiently creates a long from two words (msw, lsw).',
        category: 'Miscellaneous'
    },
    'memory': {
        signature: 'memory(name, size, alignment); memory(name) -> uword',
        description: 'Returns address of a statically reserved named memory block.',
        category: 'Miscellaneous'
    },
    'offsetof': {
        signature: 'offsetof(Struct.field)',
        description: 'Returns byte offset of a field inside a struct.',
        category: 'Miscellaneous'
    },
    'peek': {
        signature: 'peek(address)',
        description: 'Reads byte at address (same as @(address)).',
        category: 'Miscellaneous'
    },
    'peekbool': {
        signature: 'peekbool(address)',
        description: 'Reads boolean (0 or 1 byte) at address.',
        category: 'Miscellaneous'
    },
    'peekw': {
        signature: 'peekw(address)',
        description: 'Reads little-endian word at address.',
        category: 'Miscellaneous'
    },
    'peekl': {
        signature: 'peekl(address)',
        description: 'Reads little-endian signed long at address.',
        category: 'Miscellaneous'
    },
    'peekf': {
        signature: 'peekf(address)',
        description: 'Reads float at address.',
        category: 'Miscellaneous'
    },
    'poke': {
        signature: 'poke(address, value)',
        description: 'Writes byte at address (same as @(address)=value).',
        category: 'Miscellaneous'
    },
    'pokebool': {
        signature: 'pokebool(address, value)',
        description: 'Writes boolean as byte 0 or 1 at address.',
        category: 'Miscellaneous'
    },
    'pokebowl': {
        signature: 'pokebowl(address, value)',
        description: 'Alias spelling of pokebool(address, value).',
        category: 'Miscellaneous'
    },
    'pokew': {
        signature: 'pokew(address, value)',
        description: 'Writes little-endian word at address.',
        category: 'Miscellaneous'
    },
    'pokel': {
        signature: 'pokel(address, value)',
        description: 'Writes little-endian signed long at address.',
        category: 'Miscellaneous'
    },
    'pokef': {
        signature: 'pokef(address, value)',
        description: 'Writes float at address.',
        category: 'Miscellaneous'
    },
    'pokemon': {
        signature: 'pokemon(address, value)',
        description: 'Like poke, but returns previous value at address.',
        category: 'Miscellaneous'
    },
    'rol': {
        signature: 'rol(x)',
        description: 'Rotate left through carry; modifies x in-place.',
        category: 'Miscellaneous'
    },
    'rol2': {
        signature: 'rol2(x)',
        description: 'Rotate left without carry (8/16-bit rotation); modifies x in-place.',
        category: 'Miscellaneous'
    },
    'ror': {
        signature: 'ror(x)',
        description: 'Rotate right through carry; modifies x in-place.',
        category: 'Miscellaneous'
    },
    'ror2': {
        signature: 'ror2(x)',
        description: 'Rotate right without carry (8/16-bit rotation); modifies x in-place.',
        category: 'Miscellaneous'
    },
    'rrestore': {
        signature: 'rrestore()',
        description: 'Restores registers including status from CPU stack.',
        category: 'Miscellaneous'
    },
    'rsave': {
        signature: 'rsave()',
        description: 'Saves registers including status on CPU stack.',
        category: 'Miscellaneous'
    },
    'setlsb': {
        signature: 'setlsb(x, value)',
        description: 'Sets least significant byte of word or long variable x.',
        category: 'Miscellaneous'
    },
    'setmsb': {
        signature: 'setmsb(x, value)',
        description: 'Sets most significant byte of word or long variable x.',
        category: 'Miscellaneous'
    },
    'sizeof': {
        signature: 'sizeof(name); sizeof(datatype); sizeof(&name); sizeof(&&name); sizeof(^^type)',
        description: 'Returns constant byte size of an object, type, or pointer expression.',
        category: 'Miscellaneous'
    },

    // CPU stack
    'pop': {
        signature: 'pop() -> ubyte',
        description: 'Pops a byte value from CPU hardware stack.',
        category: 'CPU Stack'
    },
    'popf': {
        signature: 'popf() -> float',
        description: 'Pops a floating point value from CPU hardware stack.',
        category: 'CPU Stack'
    },
    'popl': {
        signature: 'popl() -> long',
        description: 'Pops a 32-bit value from CPU hardware stack.',
        category: 'CPU Stack'
    },
    'popw': {
        signature: 'popw() -> uword',
        description: 'Pops a 16-bit word value from CPU hardware stack.',
        category: 'CPU Stack'
    },
    'push': {
        signature: 'push(value)',
        description: 'Pushes a byte value on CPU hardware stack.',
        category: 'CPU Stack'
    },
    'pushf': {
        signature: 'pushf(value)',
        description: 'Pushes a floating point value on CPU hardware stack.',
        category: 'CPU Stack'
    },
    'pushl': {
        signature: 'pushl(value)',
        description: 'Pushes a 32-bit value on CPU hardware stack.',
        category: 'CPU Stack'
    },
    'pushw': {
        signature: 'pushw(value)',
        description: 'Pushes a 16-bit word value on CPU hardware stack.',
        category: 'CPU Stack'
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
