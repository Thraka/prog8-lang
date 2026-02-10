# Prog8 VS Code Language Server Plan

## Current State
- Syntax highlighting is working (TextMate grammar)
- **ProgB support fully mirrored** - All Phase 1 and completed Phase 2 features work for both `.p8` (Prog8) and `.pb` (ProgB) files

## ProgB Parser Implementation
A dedicated ProgB parser (`src/parser/progbParser.ts`) handles BASIC-style syntax:
- `MODULE ... END MODULE` blocks
- `SUB ... END SUB` and `FUNCTION ... END FUNCTION`
- `ASMSUB ... END ASMSUB` and `EXTSUB` declarations
- `DIM` variable declarations with `AS TYPE` syntax
- `CONST name AS TYPE = value` constants
- `TYPE ... END TYPE` structs
- ProgB-style comments (`'` and `/' '/`)

A unified parser interface (`src/parser/index.ts`) auto-detects the language and delegates appropriately.

## Goal
Add full language support features to the VS Code extension for Prog8.

---

## Prog8 Language Characteristics

### Scoping & Symbol Access
- **Everything is publicly accessible** from everywhere via fully scoped names
- No concept of private/public/protected accessibility
- **Qualified names** are searched from the top-level namespace (must provide full qualified path)
- **Unqualified names** are locally scoped
- Subroutines can be nested; inner subroutines can access parent variables
- Variables in a subroutine are hoisted to the top of that subroutine
- `for` loops and `if/else` blocks do NOT introduce new scope - only subroutines do

### Module System
- Programs can consist of many separate module files
- No linker - compiler outputs a single program file
- Modules are imported with `%import` directive
- The compiler is self-contained (uses 64tass for assembly step)

### Language Structure
- Structured imperative language (looks like Python + C mix)
- Usually single statement per line, no statement separator
- `;` starts line comments, `/* */` for multi-line
- Supports `defer` statement for cleanup
- Supports `extsub` for foreign function interface (ROM/external calls)
- Identifiers can contain non-ASCII characters (e.g., `knäckebröd`, `見せしめ`)

### Data Types
- `byte`, `ubyte`, `word`, `uword` (16-bit), `long`, `ulong` (32-bit), `float`
- `bool` type
- No automatic type enlargement (overflow wraps silently)
- Strings/arrays are statically allocated, mutable, never resized
- Structs and typed pointers (since v12.0)
- `uword` can be used as an untyped pointer

### Variables
- All statically allocated (no dynamic memory management)
- All initialized at program start (no random garbage)
- Can be declared anywhere but hoisted to subroutine top

### Subroutines
- Can be nested
- Parameters are just local variables
- Can return multiple values
- No function overloading (except some builtins)
- No call stack for arguments (recursion requires manual stack handling)

---

## Planned Language Server Features

### Phase 1: Core Navigation
- [x] Go to Definition
- [x] Peek Definition (uses same provider)
- [x] Find All References
- [x] Document Symbols (outline)
- [x] Workspace Symbols

### Phase 2: Intellisense
- [x] Hover information (type info, documentation)
  - [x] Built-in functions (abs, mkword, peek, poke, etc.)
  - [x] Keywords (if, for, while, ubyte, etc.)
  - [x] User-defined symbols
  - [x] Library functions (txt.print, sys.memset, etc.) - uses parsed skeleton files
  - [x] Library modules (for import statements) - distinguishes modules vs blocks
  - [x] Symbols from locally imported files
- [x] Auto-completion
  - [x] Local variables, constants, parameters
  - [x] Scoped names (qualified paths like `txt.print`, `myblock.mysub`)
  - [x] Library blocks and their members (from parsed skeleton files)
  - [x] Library modules (context-aware: only shown in import statements)
  - [x] Blocks from locally imported files
  - [x] Built-in functions
  - [x] Keywords
- [ ] Signature help for subroutines

### Phase 2.5: ProgB Keyword Casing

- [x] keywords.ts updated with block pairs from language-configuration-progb.json (progbBlockPairs)
- [ ] Migrate language-configuration-progb.json to use keywords.ts as its source of truth (future)
- [x] Add Enum option for setting how ProgB keywords are cased: Upper, Lower, Camel, Disabled
- [x] Auto case lines edited (detects changes via onDidChangeTextDocument)
- [x] Format entire document via Document Formatting Provider (Shift+Alt+F, format selection)
- [x] Auto case blocks when closed: END IF, END SUB, END MODULE, etc. (findBlockStart + applyKeywordCasingToLineRange)
- [x] Comma spacing auto-format (optional: progb.formatCommaSpacing setting)

### Phase 2.8: Target filtering

- [x] Update skeleton symbol import script to handle all of Prog8's targets
- [x] Add configuration to extension that sets the target platform
- [x] Expose target platform as dropdown in the bottom bar
- [x] Intellisense and hover providers filter by selected target

### Phase 3: Project System
- [x] `prog8.project.json` configuration file with JSON schema validation
- [x] Initialize project command (`prog8.initProject`)
- [x] Build project command (`prog8.buildProject`)
- [x] Run project command (`prog8.runProject`)
- [x] Debug configuration provider (F5 support)
- [x] Project-specific settings override extension settings
- [x] Compiler configuration (compilerPath, javaPath, assemblerFolder)
- [x] Emulator configuration (emulatorFolder, launchEmu)
- [x] Custom run scripts (run property with environment variables)
- [x] Target platform per project
- [x] Output directory configuration
- [x] Additional source directories (srcdirs for imported modules)
- [x] Compiler arguments (compilerArgs)
- [x] ProgB project-specific settings (keywordCasing, formatCommaSpacing)
- [x] Compilation modes (auto, standard, custom-script)
- [ ] Custom targets (user-defined target configurations)

### Phase 4: Advanced
- [ ] Rename symbol
- [x] Code folding (declarative folding via language-configuration files: brace-based for Prog8, keyword-based for ProgB)
- [x] Semantic tokens (enhanced highlighting) - fully implemented with declaration/usage tracking
- [x] Format document (ProgB only - keyword casing and comma spacing via DocumentFormattingEditProvider)

### Phase 5: Diagnostics
- [ ] Syntax error reporting
- [ ] Undefined symbol warnings
- [ ] Type mismatch warnings (if feasible)

---

### Reference Documentation
- Main docs: https://prog8.readthedocs.io/en/latest/
- Context7 library ID for prog8: `/irmen/prog8`
- **`.github/reference/` folder** - Contains information about prog8 and progb:
  - Kotlin translator code
  - ANTLR grammar files (useful for understanding the formal grammar)
