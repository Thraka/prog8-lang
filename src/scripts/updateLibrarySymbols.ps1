# Update Prog8 Library Symbols
# Fetches the latest skeleton files from prog8.readthedocs.io and regenerates librarySymbols.ts

$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot\..

Write-Host "Updating Prog8 library symbols..." -ForegroundColor Cyan

try {
    npx ts-node scripts/parseSkeletons.ts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSuccess! Library symbols updated." -ForegroundColor Green
        Write-Host "Don't forget to recompile: npm run compile" -ForegroundColor Yellow
    } else {
        Write-Host "`nFailed to update library symbols." -ForegroundColor Red
        exit 1
    }
} finally {
    Pop-Location
}
