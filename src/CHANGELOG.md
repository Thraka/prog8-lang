# Changelog

All notable changes to the Prog8 Language Support extension will be documented in this file.

## [1.6.12] - 2026-02-15

- Cleaned up various provider code.
- Array declarations in multiline subs wasn't detected correctly.
- Rewrite the compile tasks to properly detect file paths for VSCode integration.
- Fix detection of voids as keywords when multiple returned in sub return values.

## [1.6.11] - 2026-02-12

- Fix multiline subs.
- Fix symbol support on structs.
- De-symboling of comment blocks.

## [1.6.10] - 2026-02-10

- Rewrite the project runner to use the VSCode task system.
- A little bit of custom target support added. Still in progress.


## [1.6.9] - 2026-02-09

- Fixed a bug with custom scripts running twice.
- Fixed a bug with syntax coloring detecting a parameter name before it was declared.
- Added more environment variables when compile happens.

  | Variable Name | Description | With Project File | Without Project File |
  |---------------|-------------|-------------------|---------------------|
  | PATH (assemblerFolder) | Path to 64tass assembler directory | ✓ | ✓ |
  | PATH (emulatorFolder) | Path to emulator directory | ✓ | ✓ |
  | PROG8_VSCODE_MAIN_FILE | Full path to the main code file | ✓ | ✓ |
  | PROG8_VSCODE_MAIN_FILE_NAME | Main code file name with extension | ✓ | ✓ |
  | PROG8_VSCODE_MAIN_FILE_BASENAME | Main code file name without extension | ✓ | ✓ |
  | PROG8_VSCODE_MAIN_FILE_DIR | Directory containing the main code file | ✓ | ✓ |
  | PROG8_VSCODE_TARGET | Target platform (cx16, c64, c128, pet32, virtual) | ✓ | ✓ |
  | PROG8_VSCODE_OUTPUT_FILE | Full path to the compiled .prg output file | ✓ | ✓ |
  | PROG8_VSCODE_PROJECT_DIR | Root directory of the project | ✓ | |
  | PROG8_VSCODE_SRC_DIRS | Semicolon-separated list of source directories | ✓ | |

- Rewrote readme.

## [1.6.8] - 2026-02-08

- `srcdirs` is supported by the project system now!
- Symbol resolution and syntax coloring works with `srcdirs`.

## [1.6.7] - 2026-02-08

- Aggregate the symbol providers to a single API. This helps a lot of the little coloring issues.
- ProgB: Auto formatting only happens when you edit lines now, instead of when the caret leaves the line.

## [1.6.6] - 2026-02-07

- Spoke too soon! Fixed a bug with the compiler being a loose binary in path.

## [1.6.5] - 2026-02-07

- Added semantic token coloring! This fixes a lot of color problems.

## [1.6.4] - 2026-02-07

- Fixed a bug with setting the `compilerPath` to a binary that might be in path.

## [1.6.3] - 2026-02-07

- Project folder\file paths can all be relative now.
- Fixed **some** color issue with first parameter of a sub.

## [1.6.2] - 2026-02-07

- Project file now handles all folder resolutions.
- Project file has a compile mode that can be set to just run a script instead of a jar/binary.
- Project setting names disambiguate between folder and path; descriptions are also clearer.
- When an invalid path/folder is used, the popup opens to the correct settings now.
- Can turn off passing the main file to the custom compile script.
- Improvements to ProgBasic language.

## [1.6.1] - 2026-02-06

- New project system!
- F5 now compiles the current code file if you don't have a project file in the same folder as the current file.
- Use the command `Prog8: Initialize Project` to generate a project file in the current directory.
- Paths to the emulator, java (or compiled binary) of the compiler, and 64tass, are configured in the project or extension if no project defined.

Example project file:
```json
{
  "name": "My Project 1",
  "main": "start.p8",
  "target": "cx16",
  "launchEmu": true
}
```

## [1.5.1] - 2026-02-06

- Fixed symbol detection on parameters of subs declared in the builtin modules.
- ProgB: Fixed the REM keyword not coloring correctly.
- ProgB: The auto formatter will space parameters used and declared in sub/function.

## [1.5.0] - 2026-01-30

- Target platform support: CX16, C64, C128, PET32, Virtual. This affects the intellisense for modules and blocks.
- ProgBasic supports a automatic casing, configurable in UPPER, lower, CamelCase, disabled.

## [1.4.1] - 2026-01-26

- Improved hover for modules.
- Moved built-in subs to a data file.
- Add built-in subs to intellisense (at the end of the list and config option to turn off).

## [1.4.0] - 2026-01-26

- Local intellisense working.
- Scoped intellisense working (referencing blocks defined in the same file).
- Import intellisense working, lists the modules picked up by the skeleton file importer.
- Imported file module intellisense working!! Referencing a file brings the modules blocks into local intellisense. Navigation and hovering works on these members too!

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
