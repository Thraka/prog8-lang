---
name: "Update Builtin Functions"
description: "Update Prog8 builtin function metadata and syntax highlighting from the exact upstream version targeted by this extension"
argument-hint: "Refresh builtin functions from upstream Prog8"
agent: "agent"
---

Update the built-in function data for this VS Code extension from the exact Prog8 version the extension targets.

Scope:
- Update [../../src/src/data/builtinFunctions.ts](../../src/src/data/builtinFunctions.ts)
- Update the `builtins` repository entries in [../../src/syntaxes/prog8.tmLanguage.json](../../src/syntaxes/prog8.tmLanguage.json)
- Update the `builtins` repository entries in [../../src/syntaxes/progb.tmLanguage.json](../../src/syntaxes/progb.tmLanguage.json)
- Do not change unrelated files.

Version source of truth:
- Read [../../src/README.md](../../src/README.md) and extract the Prog8 version from the line near the top that says `This extension was built for Prog8 vX.Y.Z.`
- Use that exact version string in all upstream GitHub URLs. Do not hardcode `v12.2.1` unless that is the current version found in [../../src/README.md](../../src/README.md).

Upstream sources:
1. Builtin definition list:
   `https://github.com/irmen/prog8/blob/<VERSION>/docs/source/_static/symboldumps/skeletons-cx16.txt`
2. Builtin documentation:
   `https://github.com/irmen/prog8/blob/<VERSION>/docs/source/libraries.rst`

Rules:
- The authoritative builtin name list comes from `skeletons-cx16.txt` only.
- In `skeletons-cx16.txt`, use only the lines between `BUILTIN FUNCTIONS` and the first later line that starts with `LIBRARY MODULE NAME`.
- The builtin list is platform-independent, so only `skeletons-cx16.txt` is needed.
- Use `libraries.rst` only to derive signatures, descriptions, and categories.
- If a function appears in `libraries.rst` but not in the skeleton builtin list, do not add it.
- If a function appears in the skeleton builtin list but lacks clear documentation, keep it in the extension and derive the best minimal signature/description you can from the available upstream text. Do not invent extra functions.

Update requirements:
1. In [../../src/src/data/builtinFunctions.ts](../../src/src/data/builtinFunctions.ts), make the exported `builtinFunctions` object match the upstream builtin list exactly.
2. For each builtin entry, update:
   - `signature`
   - `description`
   - `category`
3. Preserve the existing object shape and helper exports.
4. In [../../src/syntaxes/prog8.tmLanguage.json](../../src/syntaxes/prog8.tmLanguage.json), update the builtin regexes so every current builtin function is highlighted.
5. In [../../src/syntaxes/progb.tmLanguage.json](../../src/syntaxes/progb.tmLanguage.json), update the builtin regexes so every current builtin function is highlighted.
6. Keep existing casing conventions:
   - Prog8 grammar uses lowercase builtin names.
   - ProgB grammar remains case-insensitive.
7. Preserve formatting and avoid unrelated refactors.

Suggested workflow:
1. Read [../../src/README.md](../../src/README.md) to get the target Prog8 version.
2. Fetch both upstream GitHub documents for that exact version.
3. Extract the authoritative builtin name list from `skeletons-cx16.txt`.
4. Cross-reference `libraries.rst` to collect docs only for those builtin names.
5. Update [../../src/src/data/builtinFunctions.ts](../../src/src/data/builtinFunctions.ts).
6. Update both grammar files' `builtins` regexes.
7. Run the compile validation from the extension folder: `npm run compile` in [../../src](../../src).
8. Report:
   - the version used
   - added builtin names
   - removed builtin names
   - any builtin names that were present upstream but had weak or missing documentation

Constraints:
- Prefer minimal edits.
- Do not edit auto-generated library symbol files.
- Do not rely on stale URLs or latest-docs links when a versioned GitHub source is available.