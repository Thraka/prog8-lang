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
  - [ ] Keywords
- [ ] Signature help for subroutines

### Phase 3: Diagnostics
- [ ] Syntax error reporting
- [ ] Undefined symbol warnings
- [ ] Type mismatch warnings (if feasible)

### Phase 4: Advanced
- [ ] Rename symbol
- [ ] Code folding
- [ ] Semantic tokens (enhanced highlighting)
- [ ] Format document

---

## Implementation Considerations

### Symbol Resolution Strategy
Since everything is public with fully qualified names:
1. Build a symbol table per module
2. Track the full path for each symbol: `module.block.subroutine.variable`
3. For unqualified names: search local scope first, then parent scopes
4. For qualified names: search from top-level namespace

### Multi-file Support
- Need to parse `%import` directives to find related modules
- Build a workspace-wide symbol index
- Handle standard library imports (prog8 ships with library modules)
- [x] **Library symbol data parsed from official skeleton files** (see `src/data/librarySymbols.ts`)
  - Parsed from https://prog8.readthedocs.io/en/latest/_static/symboldumps/
  - Contains 873 subroutines for cx16, 492 for c64
  - Run `npx ts-node scripts/parseSkeletons.ts` to regenerate
  - Helper functions: `findModule()`, `getAllModules()`, `getAllBlocks()`, `findSubroutine()`
- [x] **Local file import resolution** (see `src/parser/importResolver.ts`)
  - Parses `%import` and `IMPORT` statements from documents
  - Resolves non-library imports to local `.p8`/`.pb` files
  - Provides symbols for intellisense without recursive import following

### Reference Documentation
- Main docs: https://prog8.readthedocs.io/en/latest/
- Context7 library ID for prog8: `/irmen/prog8`
- **`.github/reference/` folder** - Contains information about prog8 and progb:
  - Kotlin translator code
  - ANTLR grammar files (useful for understanding the formal grammar)

---

## Technical Approach Options

### Option A: Language Server Protocol (LSP) in TypeScript
- Build a standalone language server
- Parse files using tree-sitter-prog8 bindings
- Communicate via LSP with VS Code

### Option B: VS Code Extension API Only
- Use VS Code's extension APIs directly
- Simpler but less portable to other editors

### Option C: Leverage Prog8 Compiler
- The prog8 compiler (Java/Kotlin) could potentially provide symbol info
- Would require compiler modifications or using its output

---

## Notes
- For loops don't define the iteration variable; it must be defined before the loop
- Trailing comma allowed in array literals: `[1, 2, 3,]`
- Ternary operator uses if-expression: `if x [then] value1 else value2`
