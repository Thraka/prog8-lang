# Changelog

All notable changes to the Prog8 Language Support extension will be documented in this file.

## [1.0.0] - 2026-01-06

### Added
- Initial release
- Syntax highlighting for Prog8 `.p8` files
- Support for all Prog8 keywords and control flow statements
- Data type highlighting (`byte`, `ubyte`, `word`, `uword`, `long`, `float`, `bool`, `str`)
- Compiler directive highlighting (`%import`, `%zeropage`, `%asm`, etc.)
- String literals with encoding prefixes (`petscii:`, `sc:`, `iso:`, etc.)
- Numeric literal highlighting (decimal, hex `$`, binary `%`)
- Built-in function highlighting (`len`, `sizeof`, `lsb`, `msb`, `rol`, `ror`, etc.)
- Inline assembly block highlighting with 6502 mnemonics
- Comment support (`;` line comments and `/* */` block comments)
- Operator highlighting
- Virtual register highlighting (`r0`-`r15` and variants)
- Library module name highlighting
- Language configuration for:
  - Auto-closing brackets and quotes
  - Comment toggling
  - Code folding
  - Indentation rules
