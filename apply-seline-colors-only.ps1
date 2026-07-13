param(
    [switch]$SkipBuild,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $Root ".design-backup\colors-only-$Timestamp"
$ReportPath = Join-Path $Root "DESIGN_SYSTEM_COLOR_ONLY_RESULT.md"
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$ChangedFiles = New-Object System.Collections.Generic.List[string]

function Get-RelativePath {
    param([Parameter(Mandatory)][string]$Path)

    $FullPath = [System.IO.Path]::GetFullPath($Path)

    if ($FullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
        return ($FullPath.Substring($Root.Length) -replace '^[\\/]+', '')
    }

    return $FullPath
}

function Backup-File {
    param([Parameter(Mandatory)][string]$Path)

    if (!(Test-Path -LiteralPath $Path) -or $DryRun) {
        return
    }

    $Relative = Get-RelativePath $Path
    $Destination = Join-Path $BackupRoot $Relative
    $DestinationDirectory = Split-Path -Parent $Destination

    New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null
    Copy-Item -LiteralPath $Path -Destination $Destination -Force
}

function Write-Utf8NoBom {
    param(
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][AllowEmptyString()][string]$Content
    )

    if ($DryRun) {
        return
    }

    [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

function Replace-ColorValues {
    param([Parameter(Mandatory)][AllowEmptyString()][string]$Content)

    # CHỈ thay mã màu. Không thay class, layout, spacing, radius, font hoặc shadow.
    $ColorMap = [ordered]@{
        "#f5f5f5" = "#fafaf9"  # canvas
        "#fafafa" = "#ffffff"  # surface-alt
        "#0a0a0a" = "#0c0a09"  # primary text
        "#171717" = "#1c1917"  # dark surface/text
        "#737373" = "#78716c"  # muted text
        "#e5e5e5" = "#e8e6e5"  # border
        "#e7000b" = "#3ba6f1"  # accent

        "#15803d" = "#3ba6f1"  # success
        "#dcfce7" = "#c1e1f7"  # success soft
        "#b42318" = "#1c1917"  # danger
        "#fee4e2" = "#d6d3d1"  # danger soft
        "#b7791f" = "#78716c"  # warning
        "#fef3c7" = "#fafaf9"  # warning soft

        "#404040" = "#1c1917"  # chart dark
        "#1f2937" = "#1c1917"  # tooltip dark
    }

    $Result = $Content

    foreach ($OldColor in $ColorMap.Keys) {
        $Result = [regex]::Replace(
            $Result,
            [regex]::Escape($OldColor),
            $ColorMap[$OldColor],
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
    }

    return $Result
}

function Update-FileColorsOnly {
    param([Parameter(Mandatory)][string]$Path)

    if (!(Test-Path -LiteralPath $Path)) {
        return
    }

    $Original = [System.IO.File]::ReadAllText($Path)
    $Updated = Replace-ColorValues $Original

    if ($Updated -ceq $Original) {
        return
    }

    Backup-File $Path
    Write-Utf8NoBom -Path $Path -Content $Updated
    [void]$ChangedFiles.Add((Get-RelativePath $Path))
}

function Get-TargetFiles {
    $Targets = New-Object System.Collections.Generic.List[System.IO.FileInfo]

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
            $Targets.Add((Get-Item -LiteralPath $FullPath))
        }
    }

    $RuntimeDirectories = @(
        (Join-Path $Root "assets\js"),
        (Join-Path $Root "pages")
    )

    foreach ($Directory in $RuntimeDirectories) {
        if (!(Test-Path -LiteralPath $Directory)) {
            continue
        }

        Get-ChildItem -Path $Directory -Recurse -File |
            Where-Object {
                $_.Extension.ToLowerInvariant() -in @(".js", ".html", ".css")
            } |
            ForEach-Object {
                $Targets.Add($_)
            }
    }

    return @(
        $Targets |
        Sort-Object FullName -Unique |
        Where-Object {
            $_.Name -ne "output.css"
        }
    )
}

function Invoke-CssBuild {
    if ($SkipBuild) {
        return @{
            Status = "SKIPPED"
            Command = "Build bị bỏ qua bằng -SkipBuild"
        }
    }

    $PackagePath = Join-Path $Root "package.json"

    if (!(Test-Path -LiteralPath $PackagePath)) {
        return @{
            Status = "NOT_FOUND"
            Command = "Không tìm thấy package.json"
        }
    }

    $Package = Get-Content -LiteralPath $PackagePath -Raw | ConvertFrom-Json
    $ScriptNames = @()

    if ($null -ne $Package.scripts) {
        $ScriptNames = @($Package.scripts.PSObject.Properties.Name)
    }

    $Candidates = @(
        "build:css",
        "css:build",
        "tailwind:build",
        "build"
    )

    foreach ($Name in $Candidates) {
        if ($ScriptNames -contains $Name) {
            $Command = "npm run $Name"

            if ($DryRun) {
                return @{
                    Status = "DRY_RUN"
                    Command = $Command
                }
            }

            Write-Host ""
            Write-Host "Đang chạy: $Command" -ForegroundColor Cyan

            & npm run $Name

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

    $TailwindCommand = Join-Path $Root "node_modules\.bin\tailwindcss.cmd"

    if (Test-Path -LiteralPath $TailwindCommand) {
        $Command = "npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --minify"

        if ($DryRun) {
            return @{
                Status = "DRY_RUN"
                Command = $Command
            }
        }

        Write-Host ""
        Write-Host "Đang chạy: $Command" -ForegroundColor Cyan

        & npx tailwindcss `
            -i "./assets/css/input.css" `
            -o "./assets/css/output.css" `
            --minify

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
        Command = "Không tìm thấy script build CSS phù hợp"
    }
}

function Find-ForbiddenNonColorChanges {
    if (!(Test-Path -LiteralPath (Join-Path $Root ".git"))) {
        return @()
    }

    $Diff = & git diff --unified=0 -- `
        "assets/css/input.css" `
        "assets/js" `
        "pages" `
        "knowledge/design" `
        "_setup-input" `
        ".antigravity/rules/20-design-system-rules.md" `
        ".agents/skills/mindhub-admin-ui/SKILL.md" `
        "AGENTS.md"

    $ForbiddenPattern = '(?i)(padding|margin|gap|width|height|grid|flex|position|top|right|bottom|left|font-size|font-family|line-height|letter-spacing|border-radius|radius|shadow|transform|display|overflow)'

    return @(
        $Diff |
        Where-Object {
            $_ -match '^[+-](?![+-])' -and
            $_ -match $ForbiddenPattern
        }
    )
}

function Write-Report {
    param(
        [Parameter(Mandatory)][hashtable]$BuildResult,
        [Parameter(Mandatory)][object[]]$ForbiddenChanges
    )

    if ($DryRun) {
        return
    }

    $Lines = New-Object System.Collections.Generic.List[string]

    $Lines.Add("# DESIGN SYSTEM — COLOR ONLY RESULT")
    $Lines.Add("")
    $Lines.Add("> Chỉ thay đổi màu. Không thay đổi bố cục, khoảng cách, kích thước, font, bo góc, shadow hoặc responsive.")
    $Lines.Add("")
    $Lines.Add("## Bảng màu đã áp dụng")
    $Lines.Add("")
    $Lines.Add("| Vai trò | Màu |")
    $Lines.Add("|---|---|")
    $Lines.Add("| Nền trang | ``#fafaf9`` |")
    $Lines.Add("| Card/surface | ``#ffffff`` |")
    $Lines.Add("| Border | ``#e8e6e5`` |")
    $Lines.Add("| Muted fill | ``#d6d3d1`` |")
    $Lines.Add("| Chữ phụ | ``#78716c`` |")
    $Lines.Add("| Chữ chính | ``#0c0a09`` |")
    $Lines.Add("| Dark neutral | ``#1c1917`` |")
    $Lines.Add("| Cyan nhạt | ``#c1e1f7`` |")
    $Lines.Add("| Cyan chính | ``#3ba6f1`` |")
    $Lines.Add("| Cyan phụ | ``#3398e1`` |")
    $Lines.Add("")
    $Lines.Add("## File đã thay đổi")
    $Lines.Add("")

    if ($ChangedFiles.Count -eq 0) {
        $Lines.Add("- Không có file nào cần thay đổi.")
    } else {
        foreach ($File in ($ChangedFiles | Sort-Object -Unique)) {
            $Lines.Add("- ``$File``")
        }
    }

    $Lines.Add("")
    $Lines.Add("## Build")
    $Lines.Add("")
    $Lines.Add("- Lệnh: ``$($BuildResult.Command)``")
    $Lines.Add("- Kết quả: **$($BuildResult.Status)**")
    $Lines.Add("")
    $Lines.Add("## Kiểm tra thay đổi ngoài màu")
    $Lines.Add("")

    if ($ForbiddenChanges.Count -eq 0) {
        $Lines.Add("- Không phát hiện thay đổi liên quan layout, spacing, font, radius hoặc shadow trong Git diff.")
    } else {
        $Lines.Add("- Phát hiện các dòng cần kiểm tra thủ công:")
        $Lines.Add("")
        $Lines.Add("```diff")

        foreach ($Line in ($ForbiddenChanges | Select-Object -First 100)) {
            $Lines.Add([string]$Line)
        }

        $Lines.Add("```")
    }

    [System.IO.File]::WriteAllText(
        $ReportPath,
        (($Lines -join "`r`n") + "`r`n"),
        $Utf8NoBom
    )
}

Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "MINDHUB ADMIN - APPLY SELINE COLORS ONLY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "Project: $Root"
Write-Host "DryRun: $DryRun"
Write-Host ""
Write-Host "Giữ nguyên tuyệt đối:" -ForegroundColor Yellow
Write-Host "- Bố cục"
Write-Host "- Kích thước"
Write-Host "- Padding, margin, gap"
Write-Host "- Font và typography"
Write-Host "- Bo góc"
Write-Host "- Shadow"
Write-Host "- Responsive"
Write-Host "- API, route và JavaScript logic"

$RequiredFile = Join-Path $Root "assets\css\input.css"

if (!(Test-Path -LiteralPath $RequiredFile)) {
    throw "Không tìm thấy assets/css/input.css. Hãy chạy script tại thư mục gốc fe-admin."
}

$TargetFiles = Get-TargetFiles

foreach ($File in $TargetFiles) {
    Update-FileColorsOnly -Path $File.FullName
}

$BuildResult = Invoke-CssBuild
$ForbiddenChanges = Find-ForbiddenNonColorChanges

Write-Report `
    -BuildResult $BuildResult `
    -ForbiddenChanges $ForbiddenChanges

Write-Host ""
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "KẾT QUẢ" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkCyan
Write-Host "Số file đổi màu: $($ChangedFiles.Count)"
Write-Host "Build: $($BuildResult.Status) - $($BuildResult.Command)"

if (!$DryRun) {
    Write-Host "Backup: $BackupRoot" -ForegroundColor Yellow
    Write-Host "Báo cáo: $ReportPath" -ForegroundColor Green
}

if ($ForbiddenChanges.Count -gt 0) {
    Write-Host ""
    Write-Host "CẢNH BÁO: Git diff có dòng giống thay đổi ngoài màu." -ForegroundColor Red
    Write-Host "Mở DESIGN_SYSTEM_COLOR_ONLY_RESULT.md để kiểm tra." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Không phát hiện thay đổi layout, spacing, font, radius hoặc shadow." -ForegroundColor Green
}

if (Test-Path -LiteralPath (Join-Path $Root ".git")) {
    Write-Host ""
    Write-Host "Git diff summary:" -ForegroundColor Cyan
    & git diff --stat
    Write-Host ""
    & git status --short
}

if ($BuildResult.Status -eq "FAILED") {
    throw "Build thất bại. File backup đã được tạo trước khi sửa."
}
