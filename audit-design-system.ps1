$ErrorActionPreference = "Stop"
$Root = (Get-Location).Path
$ReportFile = Join-Path $Root "DESIGN_SYSTEM_CURRENT_STATE.md"
$ExcludePathRegex = '[\\/](node_modules|dist|build|\.next|coverage|vendor|\.git|out|public[\\/]build)[\\/]'
$ExcludedFileRegex = '(package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$'
$CodeExtensions = @(
    ".css", ".scss", ".sass", ".less",
    ".ts", ".tsx", ".js", ".jsx",
    ".vue", ".html", ".json", ".mjs", ".cjs"
)
function Get-RelativePath {
    param([string]$FullPath)
    if ($FullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
        return ($FullPath.Substring($Root.Length) -replace '^[\\/]+', '')
    }
    return $FullPath
}
Write-Host "Dang quet du an tai: $Root" -ForegroundColor Cyan
$AllFiles = Get-ChildItem -Path $Root -Recurse -File -Force |
    Where-Object {
        $_.FullName -notmatch $ExcludePathRegex -and
        $_.Name -notmatch $ExcludedFileRegex
    }
$CodeFiles = $AllFiles |
    Where-Object {
        $CodeExtensions -contains $_.Extension.ToLower()
    }
$DesignFilePattern = '(?i)(tailwind\.config|postcss\.config|components\.json|globals\.css|index\.css|app\.css|main\.css|theme|design[-_]?system|token|palette|variable|color)'
$DesignCandidates = $CodeFiles |
    Where-Object {
        $_.Name -match $DesignFilePattern -or
        $_.DirectoryName -match '(?i)[\\/](styles?|themes?|tokens?|design-system|ui|components)[\\/]'
    } |
    Sort-Object FullName -Unique
$ColorPattern = '(?i)(--[\w-]*(primary|secondary|accent|background|foreground|muted|border|ring|destructive|success|warning|info)[\w-]*|#[0-9a-f]{3,8}\b|rgba?\s*\(|hsla?\s*\(|oklch\s*\(|\b(bg|text|border|ring|fill|stroke)-(primary|secondary|accent|background|foreground|muted|destructive|success|warning|info)\b)'
$ColorHits = @(
    foreach ($File in $CodeFiles) {
        $Matches = Select-String `
            -Path $File.FullName `
            -Pattern $ColorPattern `
            -AllMatches `
            -ErrorAction SilentlyContinue |
            Select-Object -First 50
        foreach ($Match in $Matches) {
            $LineText = ($Match.Line.Trim() -replace '\s+', ' ')
            $LineText = $LineText -replace '\|', '\|'
            if ($LineText.Length -gt 180) {
                $LineText = $LineText.Substring(0, 180) + "..."
            }
            [PSCustomObject]@{
                File = Get-RelativePath $File.FullName
                Line = $Match.LineNumber
                Text = $LineText
            }
        }
    }
) | Select-Object -First 700
$MarkdownFiles = $AllFiles |
    Where-Object {
        $_.Extension.ToLower() -eq ".md"
    } |
    Sort-Object FullName
$MarkdownInfo = foreach ($File in $MarkdownFiles) {
    $RelevantMatches = Select-String `
        -Path $File.FullName `
        -Pattern '(?i)(design system|design|color|colour|màu|bảng màu|palette|theme|token|tailwind|giao diện|UI|component|button|sidebar|dashboard)' `
        -ErrorAction SilentlyContinue
    [PSCustomObject]@{
        File = Get-RelativePath $File.FullName
        RelevantLines = @($RelevantMatches).Count
    }
}
$PackageInformation = "Không tìm thấy package.json."
$PackagePath = Join-Path $Root "package.json"
if (Test-Path $PackagePath) {
    $PackageRaw = Get-Content $PackagePath -Raw
    $DetectedTechnologies = @()
    if ($PackageRaw -match '"next"') { $DetectedTechnologies += "Next.js" }
    if ($PackageRaw -match '"react"') { $DetectedTechnologies += "React" }
    if ($PackageRaw -match '"vue"') { $DetectedTechnologies += "Vue" }
    if ($PackageRaw -match '"vite"') { $DetectedTechnologies += "Vite" }
    if ($PackageRaw -match '"tailwindcss"') { $DetectedTechnologies += "Tailwind CSS" }
    if ($PackageRaw -match '"@radix-ui') { $DetectedTechnologies += "Radix UI" }
    if ($PackageRaw -match '"recharts"') { $DetectedTechnologies += "Recharts" }
    if ($DetectedTechnologies.Count -gt 0) {
        $PackageInformation = $DetectedTechnologies -join ", "
    }
    else {
        $PackageInformation = "Có package.json nhưng chưa nhận diện được framework chính."
    }
}
$Report = New-Object System.Collections.Generic.List[string]
$Report.Add("# DESIGN SYSTEM - CURRENT STATE")
$Report.Add("")
$Report.Add("> Báo cáo được tạo tự động. Báo cáo này chỉ quét dự án, không sửa source code.")
$Report.Add("")
$Report.Add("## 1. Thông tin dự án")
$Report.Add("")
$Report.Add("- Thư mục dự án: ``$Root``")
$Report.Add("- Công nghệ nhận diện: $PackageInformation")
$Report.Add("- Tổng file đã quét: $($AllFiles.Count)")
$Report.Add("- Tổng file source phù hợp: $($CodeFiles.Count)")
$Report.Add("- Tổng file Markdown: $($MarkdownFiles.Count)")
$Report.Add("")
$Report.Add("## 2. File có khả năng đang quản lý Design System")
$Report.Add("")
$Report.Add("Ưu tiên kiểm tra các file trong danh sách này trước khi sửa màu.")
$Report.Add("")
if ($DesignCandidates.Count -eq 0) {
    $Report.Add("- Chưa phát hiện file Design System tập trung.")
}
else {
    foreach ($File in $DesignCandidates) {
        $RelativePath = Get-RelativePath $File.FullName
        $Report.Add("- ``$RelativePath``")
    }
}
$Report.Add("")
$Report.Add("## 3. Vị trí đang sử dụng màu, biến CSS hoặc semantic token")
$Report.Add("")
$Report.Add("| File | Dòng | Nội dung |")
$Report.Add("|---|---:|---|")
if ($ColorHits.Count -eq 0) {
    $Report.Add("| Không tìm thấy | - | Không phát hiện màu hoặc token phù hợp |")
}
else {
    foreach ($Hit in $ColorHits) {
        $Report.Add("| ``$($Hit.File)`` | $($Hit.Line) | ``$($Hit.Text)`` |")
    }
}
$Report.Add("")
$Report.Add("## 4. Các file Markdown cần xem xét cập nhật")
$Report.Add("")
$Report.Add("| File | Số dòng có nội dung liên quan Design/UI | Mức ưu tiên |")
$Report.Add("|---|---:|---|")
if ($MarkdownInfo.Count -eq 0) {
    $Report.Add("| Không có file Markdown | 0 | - |")
}
else {
    foreach ($Item in $MarkdownInfo) {
        $Priority = if ($Item.RelevantLines -ge 10) {
            "Cao"
        }
        elseif ($Item.RelevantLines -gt 0) {
            "Trung bình"
        }
        else {
            "Thấp"
        }
        $Report.Add("| ``$($Item.File)`` | $($Item.RelevantLines) | $Priority |")
    }
}
$Report.Add("")
$Report.Add("## 5. Thứ tự đề xuất khi đổi bảng màu")
$Report.Add("")
$Report.Add("1. Xác định file nguồn màu trung tâm: CSS variables, theme hoặc Tailwind config.")
$Report.Add("2. Đổi semantic token như primary, background, foreground, border, muted và destructive.")
$Report.Add("3. Kiểm tra component dùng chung: button, input, badge, card, table, dialog, toast và sidebar.")
$Report.Add("4. Thay màu hard-code còn sót trong page và component.")
$Report.Add("5. Kiểm tra biểu đồ, trạng thái success, warning, error và info.")
$Report.Add("6. Đồng bộ tất cả tài liệu Markdown có mô tả màu, component hoặc giao diện.")
$Report.Add("7. Chạy lint, type-check và production build.")
$Report.Add("")
$Report.Add("## 6. Nguyên tắc chỉnh sửa")
$Report.Add("")
$Report.Add("- Không thay đổi bố cục và logic nghiệp vụ chỉ vì đổi bảng màu.")
$Report.Add("- Không thêm màu hard-code mới nếu dự án đã có semantic token.")
$Report.Add("- Không sửa trực tiếp component thư viện nếu có thể override qua token hoặc theme.")
$Report.Add("- Phải kiểm tra hover, focus, active, disabled, selected và dark mode nếu dự án có hỗ trợ.")
$Report.Add("- Nội dung trong file Markdown phải khớp với source code sau cùng.")
$Report | Set-Content -Path $ReportFile -Encoding UTF8
Write-Host ""
Write-Host "Da tao bao cao:" -ForegroundColor Green
Write-Host $ReportFile -ForegroundColor Yellow
Write-Host ""
Write-Host "Khong co file source nao bi thay doi." -ForegroundColor Green
