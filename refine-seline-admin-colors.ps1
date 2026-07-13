param(
    [switch]$DryRun,
    [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $Root (".design-backup\refine-seline-admin-" + $Timestamp)
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ChangedFiles = New-Object System.Collections.Generic.List[string]

function Get-RelativePath {
    param([string]$Path)

    $FullPath = [System.IO.Path]::GetFullPath($Path)

    if ($FullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
        return ($FullPath.Substring($Root.Length) -replace '^[\\/]+', '')
    }

    return $FullPath
}

function Backup-File {
    param([string]$Path)

    if ($DryRun -or -not (Test-Path -LiteralPath $Path)) {
        return
    }

    $Relative = Get-RelativePath -Path $Path
    $Destination = Join-Path $BackupRoot $Relative
    $DestinationDirectory = Split-Path -Parent $Destination

    if (-not (Test-Path -LiteralPath $DestinationDirectory)) {
        New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null
    }

    Copy-Item -LiteralPath $Path -Destination $Destination -Force
}

function Save-FileIfChanged {
    param(
        [string]$Path,
        [string]$Original,
        [string]$Updated
    )

    if ($Updated -ceq $Original) {
        return
    }

    $Relative = Get-RelativePath -Path $Path
    [void]$ChangedFiles.Add($Relative)

    if ($DryRun) {
        Write-Host ("WOULD CHANGE: " + $Relative) -ForegroundColor Yellow
        return
    }

    Backup-File -Path $Path
    [System.IO.File]::WriteAllText($Path, $Updated, $Utf8NoBom)
    Write-Host ("CHANGED: " + $Relative) -ForegroundColor Green
}

function Set-CssToken {
    param(
        [string]$Content,
        [string]$Token,
        [string]$Value
    )

    $Pattern = "(?m)(--" + [regex]::Escape($Token) + "\s*:\s*)[^;]+;"

    if ([regex]::IsMatch($Content, $Pattern)) {
        return [regex]::Replace($Content, $Pattern, ('$1' + $Value + ';'))
    }

    return $Content
}

function Update-CssTokenFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $Original = [System.IO.File]::ReadAllText($Path)
    $Updated = $Original

    # Seline-inspired admin palette.
    # Layout, spacing, typography, radius and shadow remain unchanged.
    $Tokens = [ordered]@{
        "color-canvas" = "#fafaf9"
        "color-paper" = "#ffffff"
        "color-surface-alt" = "#f5f5f4"

        "color-ink" = "#0c0a09"
        "color-ink-soft" = "#44403c"
        "color-mid-gray" = "#78716c"
        "color-hairline" = "#e8e6e5"

        "color-ember" = "#3ba6f1"

        "color-success" = "#15803d"
        "color-success-soft" = "#dcfce7"

        "color-warning" = "#b7791f"
        "color-warning-soft" = "#fef3c7"

        "color-danger-brick" = "#b42318"
        "color-danger-brick-soft" = "#fee4e2"

        "surface-canvas" = "#fafaf9"
        "surface-sidebar" = "#f5f5f4"
        "surface-card" = "#ffffff"
        "surface-input-fill" = "#ffffff"
    }

    foreach ($Entry in $Tokens.GetEnumerator()) {
        $Updated = Set-CssToken -Content $Updated -Token $Entry.Key -Value $Entry.Value
    }

    Save-FileIfChanged -Path $Path -Original $Original -Updated $Updated
}

function Set-JsonColorToken {
    param(
        [object]$Container,
        [string]$Name,
        [string]$Value,
        [string]$Description
    )

    if ($null -eq $Container) {
        return
    }

    $Property = $Container.PSObject.Properties[$Name]

    if ($null -eq $Property) {
        return
    }

    if ($null -ne $Property.Value.'$value') {
        $Property.Value.'$value' = $Value
    }

    if ($Description -and $null -ne $Property.Value.'$description') {
        $Property.Value.'$description' = $Description
    }
}

function Update-JsonTokenFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $Original = [System.IO.File]::ReadAllText($Path)
    $Json = $Original | ConvertFrom-Json

    Set-JsonColorToken -Container $Json.color -Name "canvas" -Value "#fafaf9" -Description "Warm stone page canvas"
    Set-JsonColorToken -Container $Json.color -Name "paper" -Value "#ffffff" -Description "White card and panel surface"
    Set-JsonColorToken -Container $Json.color -Name "surface-alt" -Value "#f5f5f4" -Description "Warm neutral sidebar and alternate surface"
    Set-JsonColorToken -Container $Json.color -Name "ink" -Value "#0c0a09" -Description "Primary text"
    Set-JsonColorToken -Container $Json.color -Name "ink-soft" -Value "#44403c" -Description "Strong secondary text"
    Set-JsonColorToken -Container $Json.color -Name "mid-gray" -Value "#78716c" -Description "Muted text and helper copy"
    Set-JsonColorToken -Container $Json.color -Name "hairline" -Value "#e8e6e5" -Description "Warm stone border"
    Set-JsonColorToken -Container $Json.color -Name "ember" -Value "#3ba6f1" -Description "Primary cyan brand accent"

    Set-JsonColorToken -Container $Json.color -Name "success" -Value "#15803d" -Description "Success, paid, published and approved"
    Set-JsonColorToken -Container $Json.color -Name "success-soft" -Value "#dcfce7" -Description "Soft success background"
    Set-JsonColorToken -Container $Json.color -Name "warning" -Value "#b7791f" -Description "Pending, waiting and review"
    Set-JsonColorToken -Container $Json.color -Name "warning-soft" -Value "#fef3c7" -Description "Soft warning background"
    Set-JsonColorToken -Container $Json.color -Name "danger-brick" -Value "#b42318" -Description "Rejected, failed, locked and destructive"
    Set-JsonColorToken -Container $Json.color -Name "danger-brick-soft" -Value "#fee4e2" -Description "Soft danger background"

    Set-JsonColorToken -Container $Json.surface -Name "canvas" -Value "#fafaf9" -Description "Warm stone page background"
    Set-JsonColorToken -Container $Json.surface -Name "sidebar" -Value "#f5f5f4" -Description "Warm neutral sidebar"
    Set-JsonColorToken -Container $Json.surface -Name "card" -Value "#ffffff" -Description "White card surface"
    Set-JsonColorToken -Container $Json.surface -Name "input-fill" -Value "#ffffff" -Description "White input surface"

    $Updated = ($Json | ConvertTo-Json -Depth 100) + [Environment]::NewLine

    Save-FileIfChanged -Path $Path -Original $Original -Updated $Updated
}

function Update-RuntimeUtilityColors {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $Original = [System.IO.File]::ReadAllText($Path)
    $Updated = $Original

    # Remove overly dark structural borders.
    $Updated = [regex]::Replace(
        $Updated,
        '(?<![\w-])border-ink-soft(?![\w-])',
        'border-hairline'
    )

    $Updated = [regex]::Replace(
        $Updated,
        '(?<![\w-])border-ink(?![\w-])',
        'border-hairline'
    )

    Save-FileIfChanged -Path $Path -Original $Original -Updated $Updated
}

function Update-DashboardChartColors {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    $Original = [System.IO.File]::ReadAllText($Path)
    $Updated = $Original

    # Revenue = cyan brand.
    $Updated = [regex]::Replace(
        $Updated,
        '(borderColor\s*:\s*["''])(#15803d|#3ba6f1)(["''])',
        '$1#3ba6f1$3',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    $Updated = [regex]::Replace(
        $Updated,
        '(pointBorderColor\s*:\s*["''])(#15803d|#3ba6f1)(["''])',
        '$1#3ba6f1$3',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    # Instructor income = warm dark neutral.
    $Updated = [regex]::Replace(
        $Updated,
        '(borderColor\s*:\s*["''])(#404040|#1c1917)(["''])',
        '$1#57534e$3',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    $Updated = [regex]::Replace(
        $Updated,
        '(pointBorderColor\s*:\s*["''])(#404040|#1c1917)(["''])',
        '$1#57534e$3',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    # Platform fee = amber warning.
    $Updated = [regex]::Replace(
        $Updated,
        '(borderColor\s*:\s*["''])(#78716c|#b7791f)(["''])',
        '$1#b7791f$3',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    $Updated = [regex]::Replace(
        $Updated,
        '(pointBorderColor\s*:\s*["''])(#78716c|#b7791f)(["''])',
        '$1#b7791f$3',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    Save-FileIfChanged -Path $Path -Original $Original -Updated $Updated
}

function Invoke-Build {
    if ($SkipBuild) {
        return
    }

    $PackagePath = Join-Path $Root "package.json"

    if (-not (Test-Path -LiteralPath $PackagePath)) {
        Write-Host "package.json not found; build skipped." -ForegroundColor Yellow
        return
    }

    $Package = Get-Content -LiteralPath $PackagePath -Raw | ConvertFrom-Json
    $Scripts = @()

    if ($null -ne $Package.scripts) {
        $Scripts = @($Package.scripts.PSObject.Properties.Name)
    }

    $BuildScript = $null

    foreach ($Candidate in @("build:css", "css:build", "tailwind:build", "build")) {
        if ($Scripts -contains $Candidate) {
            $BuildScript = $Candidate
            break
        }
    }

    if ($null -eq $BuildScript) {
        Write-Host "No CSS build script was found." -ForegroundColor Yellow
        return
    }

    if ($DryRun) {
        Write-Host ("WOULD RUN: npm run " + $BuildScript) -ForegroundColor Yellow
        return
    }

    Write-Host ""
    Write-Host ("RUNNING: npm run " + $BuildScript) -ForegroundColor Cyan

    $Output = & npm run $BuildScript 2>&1
    $ExitCode = $LASTEXITCODE
    $Output | ForEach-Object { Write-Host $_ }

    if ($ExitCode -ne 0) {
        throw "CSS build failed."
    }
}

Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "REFINE SELINE COLORS FOR MINDHUB ADMIN" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host ("PROJECT: " + $Root)
Write-Host ("DRY RUN: " + [string]$DryRun)
Write-Host ""
Write-Host "This script changes colors only." -ForegroundColor Yellow
Write-Host "Layout, spacing, sizing, typography, radius, shadow and responsive behavior stay unchanged."
Write-Host ""

$InputCss = Join-Path $Root "assets\css\input.css"

if (-not (Test-Path -LiteralPath $InputCss)) {
    throw "assets/css/input.css was not found. Run the script from the fe-admin project root."
}

$CssFiles = @(
    (Join-Path $Root "assets\css\input.css"),
    (Join-Path $Root "knowledge\design\theme.css"),
    (Join-Path $Root "knowledge\design\variables.css"),
    (Join-Path $Root "_setup-input\theme.css"),
    (Join-Path $Root "_setup-input\variables.css")
)

foreach ($File in $CssFiles) {
    Update-CssTokenFile -Path $File
}

$JsonFiles = @(
    (Join-Path $Root "knowledge\design\tokens.json"),
    (Join-Path $Root "_setup-input\tokens.json")
)

foreach ($File in $JsonFiles) {
    Update-JsonTokenFile -Path $File
}

$RuntimeDirectories = @(
    (Join-Path $Root "pages"),
    (Join-Path $Root "assets\js")
)

foreach ($Directory in $RuntimeDirectories) {
    if (-not (Test-Path -LiteralPath $Directory)) {
        continue
    }

    $Files = Get-ChildItem -Path $Directory -Recurse -File |
        Where-Object {
            $_.Extension.ToLowerInvariant() -in @(".html", ".js")
        }

    foreach ($File in $Files) {
        Update-RuntimeUtilityColors -Path $File.FullName
    }
}

Update-DashboardChartColors -Path (Join-Path $Root "assets\js\pages\dashboard.js")

Invoke-Build

Write-Host ""
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "RESULT" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host ("FILES CHANGED: " + [string]$ChangedFiles.Count)

if (-not $DryRun) {
    Write-Host ("BACKUP: " + $BackupRoot) -ForegroundColor Yellow
}

if (Test-Path -LiteralPath (Join-Path $Root ".git")) {
    Write-Host ""
    Write-Host "GIT DIFF SUMMARY:" -ForegroundColor Cyan
    & git diff --stat
    Write-Host ""
    & git status --short
}
