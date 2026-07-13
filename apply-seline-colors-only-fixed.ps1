param(
    [switch]$DryRun,
    [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $Root (".design-backup\colors-only-" + $Timestamp)
$ReportPath = Join-Path $Root "DESIGN_SYSTEM_COLOR_ONLY_RESULT.md"
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$ChangedFiles = New-Object System.Collections.Generic.List[string]

function Get-RelativePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $FullPath = [System.IO.Path]::GetFullPath($Path)

    if ($FullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
        return ($FullPath.Substring($Root.Length) -replace '^[\\/]+', '')
    }

    return $FullPath
}

function Backup-File {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if ($DryRun) {
        return
    }

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $RelativePath = Get-RelativePath -Path $Path
    $BackupPath = Join-Path $BackupRoot $RelativePath
    $BackupDirectory = Split-Path -Parent $BackupPath

    if (-not (Test-Path -LiteralPath $BackupDirectory)) {
        New-Item -ItemType Directory -Path $BackupDirectory -Force | Out-Null
    }

    Copy-Item -LiteralPath $Path -Destination $BackupPath -Force
}

function Replace-ColorValues {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Content
    )

    # Color-only mapping.
    # No layout, spacing, typography, radius, shadow, responsive or logic changes.
    $ColorMap = [ordered]@{
        "#f5f5f5" = "#fafaf9"
        "#fafafa" = "#ffffff"
        "#0a0a0a" = "#0c0a09"
        "#171717" = "#1c1917"
        "#737373" = "#78716c"
        "#e5e5e5" = "#e8e6e5"
        "#e7000b" = "#3ba6f1"

        "#15803d" = "#3ba6f1"
        "#dcfce7" = "#c1e1f7"
        "#b42318" = "#1c1917"
        "#fee4e2" = "#d6d3d1"
        "#b7791f" = "#78716c"
        "#fef3c7" = "#fafaf9"

        "#404040" = "#1c1917"
        "#1f2937" = "#1c1917"
    }

    $Result = $Content

    foreach ($OldColor in $ColorMap.Keys) {
        $Pattern = [regex]::Escape($OldColor)
        $NewColor = [string]$ColorMap[$OldColor]

        $Result = [regex]::Replace(
            $Result,
            $Pattern,
            $NewColor,
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
    }

    return $Result
}

function Update-FileColorsOnly {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $OriginalContent = [System.IO.File]::ReadAllText($Path)
    $UpdatedContent = Replace-ColorValues -Content $OriginalContent

    if ($UpdatedContent -ceq $OriginalContent) {
        return
    }

    $RelativePath = Get-RelativePath -Path $Path
    [void]$ChangedFiles.Add($RelativePath)

    if ($DryRun) {
        Write-Host ("WOULD CHANGE: " + $RelativePath) -ForegroundColor Yellow
        return
    }

    Backup-File -Path $Path
    [System.IO.File]::WriteAllText($Path, $UpdatedContent, $Utf8NoBom)
    Write-Host ("CHANGED: " + $RelativePath) -ForegroundColor Green
}

function Get-TargetFiles {
    $CollectedPaths = New-Object System.Collections.Generic.List[string]

    $ExplicitFiles = @(
        "assets\css\input.css",
        "knowledge\design\theme.css",
        "knowledge\design\variables.css",
        "knowledge\design\tokens.json",
        "knowledge\design\DESIGN.md",
        "knowledge\design\component-rules.md",
        "_setup-input\theme.css",
        "_setup-input\variables.css",
        "_setup-input\tokens.json",
        "_setup-input\DESIGN.md",
        ".antigravity\rules\20-design-system-rules.md",
        ".agents\skills\mindhub-admin-ui\SKILL.md",
        "AGENTS.md"
    )

    foreach ($RelativePath in $ExplicitFiles) {
        $FullPath = Join-Path $Root $RelativePath

        if (Test-Path -LiteralPath $FullPath) {
            [void]$CollectedPaths.Add([System.IO.Path]::GetFullPath($FullPath))
        }
    }

    $RuntimeDirectories = @(
        (Join-Path $Root "assets\js"),
        (Join-Path $Root "pages")
    )

    foreach ($Directory in $RuntimeDirectories) {
        if (-not (Test-Path -LiteralPath $Directory)) {
            continue
        }

        $Files = Get-ChildItem -Path $Directory -Recurse -File |
            Where-Object {
                $_.Extension.ToLowerInvariant() -in @(".js", ".html", ".css")
            }

        foreach ($File in $Files) {
            [void]$CollectedPaths.Add($File.FullName)
        }
    }

    $DesignDirectories = @(
        (Join-Path $Root "knowledge\design"),
        (Join-Path $Root "_setup-input"),
        (Join-Path $Root ".antigravity"),
        (Join-Path $Root ".agents\skills\mindhub-admin-ui")
    )

    foreach ($Directory in $DesignDirectories) {
        if (-not (Test-Path -LiteralPath $Directory)) {
            continue
        }

        $Files = Get-ChildItem -Path $Directory -Recurse -File |
            Where-Object {
                $_.Extension.ToLowerInvariant() -in @(".md", ".css", ".json")
            }

        foreach ($File in $Files) {
            [void]$CollectedPaths.Add($File.FullName)
        }
    }

    return @(
        $CollectedPaths |
            Sort-Object -Unique |
            Where-Object {
                (Split-Path -Leaf $_) -ne "output.css" -and
                (Split-Path -Leaf $_) -ne "DESIGN_SYSTEM_CURRENT_STATE.md" -and
                (Split-Path -Leaf $_) -ne "DESIGN_SYSTEM_COLOR_ONLY_RESULT.md"
            }
    )
}

function Invoke-CssBuild {
    if ($SkipBuild) {
        return @{
            Status = "SKIPPED"
            Command = "Build skipped with -SkipBuild"
        }
    }

    $PackagePath = Join-Path $Root "package.json"

    if (-not (Test-Path -LiteralPath $PackagePath)) {
        return @{
            Status = "NOT_FOUND"
            Command = "package.json not found"
        }
    }

    $Package = Get-Content -LiteralPath $PackagePath -Raw | ConvertFrom-Json
    $AvailableScripts = @()

    if ($null -ne $Package.scripts) {
        $AvailableScripts = @($Package.scripts.PSObject.Properties.Name)
    }

    $Candidates = @(
        "build:css",
        "css:build",
        "tailwind:build",
        "build"
    )

    foreach ($ScriptName in $Candidates) {
        if ($AvailableScripts -contains $ScriptName) {
            $Command = "npm run " + $ScriptName

            if ($DryRun) {
                return @{
                    Status = "DRY_RUN"
                    Command = $Command
                }
            }

            Write-Host ""
            Write-Host ("RUNNING: " + $Command) -ForegroundColor Cyan

            & npm run $ScriptName

            if ($LASTEXITCODE -ne 0) {
                return @{
                    Status = "FAILED"
                    Command = $Command
                }
            }

            return @{
                Status = "PASSED"
                Command = $Command
            }
        }
    }

    $LocalTailwind = Join-Path $Root "node_modules\.bin\tailwindcss.cmd"

    if (Test-Path -LiteralPath $LocalTailwind) {
        $Command = "npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --minify"

        if ($DryRun) {
            return @{
                Status = "DRY_RUN"
                Command = $Command
            }
        }

        Write-Host ""
        Write-Host ("RUNNING: " + $Command) -ForegroundColor Cyan

        & npx tailwindcss -i "./assets/css/input.css" -o "./assets/css/output.css" --minify

        if ($LASTEXITCODE -ne 0) {
            return @{
                Status = "FAILED"
                Command = $Command
            }
        }

        return @{
            Status = "PASSED"
            Command = $Command
        }
    }

    return @{
        Status = "NO_SCRIPT"
        Command = "No CSS build script was found"
    }
}

function Write-ResultReport {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$BuildResult
    )

    if ($DryRun) {
        return
    }

    $Lines = New-Object System.Collections.Generic.List[string]

    [void]$Lines.Add("# DESIGN SYSTEM COLOR ONLY RESULT")
    [void]$Lines.Add("")
    [void]$Lines.Add("Only color values were changed.")
    [void]$Lines.Add("Layout, spacing, sizing, typography, border radius, shadow, responsive behavior and application logic were preserved.")
    [void]$Lines.Add("")
    [void]$Lines.Add("## Applied palette")
    [void]$Lines.Add("")
    [void]$Lines.Add("| Role | Color |")
    [void]$Lines.Add("|---|---|")
    [void]$Lines.Add("| Page canvas | #fafaf9 |")
    [void]$Lines.Add("| Card surface | #ffffff |")
    [void]$Lines.Add("| Border | #e8e6e5 |")
    [void]$Lines.Add("| Muted fill | #d6d3d1 |")
    [void]$Lines.Add("| Secondary text | #78716c |")
    [void]$Lines.Add("| Primary text | #0c0a09 |")
    [void]$Lines.Add("| Dark neutral | #1c1917 |")
    [void]$Lines.Add("| Cyan soft | #c1e1f7 |")
    [void]$Lines.Add("| Cyan primary | #3ba6f1 |")
    [void]$Lines.Add("| Cyan secondary | #3398e1 |")
    [void]$Lines.Add("")
    [void]$Lines.Add("## Changed files")
    [void]$Lines.Add("")

    if ($ChangedFiles.Count -eq 0) {
        [void]$Lines.Add("- No file needed a color update.")
    }
    else {
        $UniqueFiles = $ChangedFiles | Sort-Object -Unique

        foreach ($File in $UniqueFiles) {
            [void]$Lines.Add("- " + $File)
        }
    }

    [void]$Lines.Add("")
    [void]$Lines.Add("## Build")
    [void]$Lines.Add("")
    [void]$Lines.Add("- Command: " + [string]$BuildResult.Command)
    [void]$Lines.Add("- Status: " + [string]$BuildResult.Status)
    [void]$Lines.Add("")
    [void]$Lines.Add("## Backup")
    [void]$Lines.Add("")
    [void]$Lines.Add("- " + (Get-RelativePath -Path $BackupRoot))

    $ReportContent = ($Lines -join [Environment]::NewLine) + [Environment]::NewLine
    [System.IO.File]::WriteAllText($ReportPath, $ReportContent, $Utf8NoBom)
}

Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "MINDHUB ADMIN - APPLY SELINE COLORS ONLY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host ("PROJECT: " + $Root)
Write-Host ("DRY RUN: " + [string]$DryRun)
Write-Host ("SKIP BUILD: " + [string]$SkipBuild)
Write-Host ""
Write-Host "PRESERVED:" -ForegroundColor Yellow
Write-Host "- Layout"
Write-Host "- Width and height"
Write-Host "- Padding, margin and gap"
Write-Host "- Typography"
Write-Host "- Border radius"
Write-Host "- Shadows"
Write-Host "- Responsive behavior"
Write-Host "- API, routes and JavaScript logic"
Write-Host ""

$RequiredFile = Join-Path $Root "assets\css\input.css"

if (-not (Test-Path -LiteralPath $RequiredFile)) {
    throw "assets/css/input.css was not found. Run this script from the fe-admin project root."
}

$TargetFiles = Get-TargetFiles

foreach ($FilePath in $TargetFiles) {
    Update-FileColorsOnly -Path $FilePath
}

$BuildResult = Invoke-CssBuild
Write-ResultReport -BuildResult $BuildResult

Write-Host ""
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "RESULT" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host ("FILES: " + [string]$ChangedFiles.Count)
Write-Host ("BUILD: " + [string]$BuildResult.Status + " - " + [string]$BuildResult.Command)

if (-not $DryRun) {
    Write-Host ("BACKUP: " + $BackupRoot) -ForegroundColor Yellow
    Write-Host ("REPORT: " + $ReportPath) -ForegroundColor Green
}

if (Test-Path -LiteralPath (Join-Path $Root ".git")) {
    Write-Host ""
    Write-Host "GIT DIFF SUMMARY:" -ForegroundColor Cyan
    & git diff --stat
    Write-Host ""
    & git status --short
}

if ($BuildResult.Status -eq "FAILED") {
    throw "Build failed. Original files are available in the backup directory."
}
