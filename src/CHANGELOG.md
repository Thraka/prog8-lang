# Changelog

All notable changes to the Prog8 Language Support extension will be documented in this file.

## [1.3.0] - 2026-01-25

Added lots of support for discovering and finding symbols within the current document and those in the same folder.

## [1.2.3] - 2026-01-23

- Added IIF and EACH to keywords for ProgB.

## [1.2.2] - 2026-01-22

- Fixed some coloring issues with method parameter variables.

## [1.2.1] - 2026-01-22

- Forgot to update the changelog. :(

## [1.2.0] - 2026-01-22

- Fixed comma-separated variable declarations in Prog8 (e.g., `ubyte counter, counter2 = 0`)
- Fixed directive parameter coloring `%import something`
- Fixed struct/type name highlighting in both Prog8 (`struct MyStruct {`)
- Added support for ProgB

## [1.1.0] - 2026-01-08

- Block/namespace highlighting for block definitions (e.g., `main {`, `irq $c000 {`)
- Variable declaration highlighting - identifiers after type declarations now properly highlighted
- Memory-mapped variable declaration support (`&ubyte`, `&&uword`, etc.)
- Typed pointer operators (`&&`, `&<`, `&>`) with distinct highlighting from bitwise `&`
- Pointer-related operators (`^^`, `&&`, `&<`, `&>`) now share consistent highlighting
- `default:` string encoding prefix
- `%ir` directive for intermediate representation mode
- `rsavex` and `rrestorex` built-in functions
- Removed special-casing of `main` and `start` - they now follow standard block/function patterns

## [1.0.0] - 2026-01-06

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
