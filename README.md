# Prog8 Language Support for VS Code

Language support extension for [Prog8](https://prog8.readthedocs.io/), a structured programming language designed for 8-bit 6502/65c02 microprocessors, including the Commodore 64, Commander X16, and other retro computers.

![demo](./images/demo.png)

## Features

### Syntax Highlighting
Comprehensive syntax highlighting for `.p8` files with support for:
- Control flow statements and keywords
- Data types and type annotations
- Compiler directives and pragmas
- String literals with encoding prefixes
- Numeric literals (decimal, hexadecimal, binary)
- Built-in functions and library modules
- Memory-mapped variables
- Inline assembly blocks
- Comments and operators

### Code Intelligence
- **Code Completion**: Context-aware suggestions for keywords, functions, and symbols
- **Go to Definition**: Navigate to symbol declarations
- **Find References**: Locate all uses of a symbol
- **Hover Information**: View documentation and type information
- **Document Symbols**: Outline view and breadcrumb navigation
- **Workspace Symbols**: Search for symbols across your project

### Project Support
- **Prog8 Project Files**: Support for `prog8.project.json` configuration files
- **Build Integration**: Compile and run Prog8 programs directly from VS Code
- **Import Resolution**: Automatic resolution of `%import` statements

#### Project File Format

Create a `prog8.project.json` file in your project root to configure compilation settings:

```json
{
  "name": "My Prog8 Project",
  "main": "main.p8",
  "target": "cx16",
  "outputDir": "build",
  "launchEmu": true,
  "srcdirs": ["src", "lib"],
  "compilerArgs": ["-optimize"]
}
```

**Required fields:**
- `main` - Main source file to compile.
- `target` - Target platform: `cx16`, `c64`, `c128`, `pet32`, or `virtual`.

**Optional fields:**
- `name` - Project name for display.
- `outputDir` - Output directory for compiled files.
- `launchEmu` - Launch emulator after compilation (default: `true`).
- `srcdirs` - Additional source directories for imports.
- `compilerArgs` - Extra compiler arguments.
- `compilerPath`, `javaPath`, `assemblerFolder`, `emulatorFolder` - Override tool paths.
- `run` - Custom script to run after compilation.
- `compilationMode` - Compilation strategy: `auto`, `standard`, or `custom-script`.
- `progb` - ProgB-specific formatting settings.

#### Environment Variables During Compilation

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

### Editor Features
- Auto-closing brackets and quotes
- Comment toggling
- Code folding
- Smart indentation
- Symbol formatting

## Supported Platforms

This extension supports Prog8 development for:
- **Commander X16**
- **Commodore 64**
- **Commodore 128**
- **Commodore PET**

## Example Code

```prog8
%import textio
%zeropage basicsafe

main {
    sub start() {
        txt.print("Hello, Prog8!\n")
        
        ubyte counter
        for counter in 0 to 10 {
            txt.print_ub(counter)
            txt.nl()
        }
        
        return
    }
}
```

## Installation

Install directly from the VS Code Extensions Marketplace by searching for "Prog8" or install from a `.vsix` file using the Command Palette (`Ctrl+Shift+P`) and selecting "Extensions: Install from VSIX...".

## Requirements

To compile and run Prog8 programs, you need the [Prog8 compiler](https://github.com/irmen/prog8) installed on your system.

## Resources

- [Prog8 Documentation](https://prog8.readthedocs.io/)
- [Prog8 GitHub Repository](https://github.com/irmen/prog8)
- [Commander X16 Website](https://www.commanderx16.com/)
- [Prog8 Discord Community](https://discord.gg/nS2PqEC)

## License

MIT License - see [LICENSE](LICENSE) file for details.
