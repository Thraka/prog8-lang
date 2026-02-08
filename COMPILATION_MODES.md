# Compilation Modes

The project system now supports three compilation modes with smart settings resolution.

## How It Works

### Settings Resolution Priority

**IMPORTANT: Each path uses ONLY ONE source - no mixing!**

For every setting (compilerPath, assemblerFolder, etc.):
1. **Project File** - If set here, this value is used and extension setting is COMPLETELY IGNORED
2. **Extension Settings** - Only used if NOT set in project file  
3. **Not Set** - Setting is undefined

**Example:**
```json
// Extension Settings
{
  "prog8.compiler.path": "C:/global/prog8c.jar",
  "prog8.compiler.assemblerFolder": "C:/global/64tass"
}

// Project File
{
  "compilerPath": "./local/prog8c.exe"
}

// Result:
// - compilerPath = "./local/prog8c.exe" (project file value, extension setting ignored)
// - assemblerFolder = "C:/global/64tass" (extension setting, not overridden in project)
```

This means you can:
- Set global defaults in extension settings
- Override specific paths per-project in the project file
- Mix and match - override only the settings you need in project file

### Compilation Modes

#### 1. Auto Mode (Default)
```json
{
  "main": "main.p8",
  "target": "cx16",
  "compilationMode": "auto"
}
```
Automatically detects the right strategy based on what's configured:
- If `compilerPath` ends with `.jar` → Uses Java + JAR compiler
- If `compilerPath` is a binary → Uses binary compiler
- If only `run` is specified → Uses custom script mode

#### 2. Standard Mode
```json
{
  "main": "main.p8",
  "target": "cx16",
  "compilationMode": "standard",
  "compilerPath": "./tools/prog8c.exe",
  "compilerArgs": ["-quiet", "-optimize"]
}
```
Uses prog8c compiler with 64tass:
- **Requires**: `compilerPath` and `assemblerFolder`
- **Optional**: `javaPath` (only if compilerPath is .jar)
- **Optional**: `compilerArgs` - additional arguments passed to the compiler

Custom arguments are inserted before the main file, so the final command looks like:
```bash
prog8c -target cx16 -quiet -optimize main.p8
```

#### 3. Custom Script Mode
```json
{
  "main": "main.p8",
  "target": "cx16",
  "compilationMode": "custom-script",
  "run": "./build.bat",
  "compilerArgs": ["--verbose", "--debug"]
}
```
Uses your custom build script that handles everything:
- **Requires**: Only `run` script path
- **Skips validation** of compiler, tass, java paths
- **Optional**: `passMainToScript` (default: true) - whether to pass main file path to script
- **Optional**: `compilerArgs` - passed as additional arguments to the script
- Perfect for team scripts, Docker builds, or CI pipelines

**Default behavior** (`passMainToScript: true` or omitted):
```bash
./build.bat "main.p8" --verbose --debug
```

**Without main file** (`passMainToScript: false`):
```json
{
  "main": "main.p8",
  "compilationMode": "custom-script",
  "run": "./build-all.sh",
  "passMainToScript": false
}
```
The script is called without the main file argument:
```bash
./build-all.sh
```
Use this when your script determines what to compile on its own (e.g., compiles all *.p8 files in a directory).

## Example Scenarios

### Scenario 1: JAR with Extension Settings
**Extension Settings:**
```json
{
  "prog8.compiler.path": "C:/tools/prog8c.jar",
  "prog8.compiler.javaPath": "java",
  "prog8.compiler.assemblerFolder": "C:/tools/64tass"
}
```

**Project File:**
```json
{
  "main": "main.p8",
  "target": "cx16"
}
```
Works! Uses settings from extension configuration.

### Scenario 2: Project-Level Override
**Extension Settings:**
```json
{
  "prog8.compiler.path": "C:/tools/prog8c.jar"
}
```

**Project File:**
```json
{
  "main": "main.p8",
  "target": "cx16",
  "compilerPath": "./local/prog8c.exe",
  "assemblerFolder": "./local/64tass"
}
```
Works! Project file overrides the extension setting for this specific project.

### Scenario 3: Custom Build Script
**No Extension Settings Required!**

**Project File:**
```json
{
  "main": "main.p8",
  "target": "cx16",
  "compilationMode": "custom-script",
  "run": "./build-everything.sh"
}
```

**build-everything.sh:**
```bash
#!/bin/bash
MAIN_FILE=$1
# Use Docker, call remote compiler, whatever you need
docker run --rm -v $(pwd):/work prog8-builder $MAIN_FILE
```
Works! No compiler validation, your script does everything.

**Alternative - Script handles everything without main file:**
```json
{
  "main": "main.p8",
  "target": "cx16",
  "compilationMode": "custom-script",
  "run": "./build-all.sh",
  "passMainToScript": false
}
```

**build-all.sh:**
```bash
#!/bin/bash
# Compile all .p8 files in the project
for file in *.p8; do
  docker run --rm -v $(pwd):/work prog8-builder "$file"
done
```
Script receives no arguments and handles file discovery itself.

### Scenario 4: Team Project
**Project File (committed to repo):**
```json
{
  "main": "game.p8",
  "target": "cx16",
  "compilationMode": "auto"
}
```

Each team member configures their own extension settings however they want:
- Alice: Uses local binary compiler
- Bob: Uses JAR file with Java
- CI Server: Uses custom Docker script in project file override

Everyone can build without requiring specific global settings!

### Scenario 5: Passing Extra Arguments
**Project File:**
```json
{
  "main": "game.p8",
  "target": "cx16",
  "outputDir": "build",
  "compilerArgs": [
    "-noopt",
    "-quietasm",
    "-sourcelines"
  ]
}
```

The compiler is called with:
```bash
prog8c -target cx16 -out build -noopt -quietasm -sourcelines game.p8
```

Use `compilerArgs` for:
- Debug builds: `["-noopt", "-sourcelines"]`
- Quiet output: `["-quiet", "-quietasm"]`
- Experimental features: `["-experimentalcodegen"]`
- Any prog8c flags you need per-project

## Error Messages

The new system provides better error messages:

**Before:**
```
Compiler path not configured. Set prog8.compiler.path in settings.
```

**After:**
```
Compiler path not configured. Set either:
  • In project file: "compilerPath"
  • In extension settings: "prog8.compiler.path"
```

## Migration

Existing project files work without changes. The system defaults to `"compilationMode": "auto"` which detects the right approach based on your current configuration.
