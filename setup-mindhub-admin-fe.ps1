[CmdletBinding()]
param(
    [string]$Root = "D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ============================================================
# MINDHUB ADMIN FE - SETUP V2 (WINDOWS POWERSHELL 5.1 COMPATIBLE)
# HTML + Tailwind CSS + JavaScript thuần
# ============================================================

if (-not (Test-Path -LiteralPath $Root)) {
    throw "Không tìm thấy thư mục dự án: $Root"
}

Set-Location -LiteralPath $Root

$InputDir = Join-Path $Root "_setup-input"
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Ensure-Directory {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath
    )

    $FullPath = Join-Path $Root $RelativePath

    if (-not (Test-Path -LiteralPath $FullPath)) {
        New-Item -ItemType Directory -Path $FullPath -Force | Out-Null
        Write-Host "Đã tạo thư mục: $RelativePath" -ForegroundColor Green
    }
}

function Write-FileIfEmpty {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath,

        [Parameter(Mandatory = $true)]
        [string]$Content
    )

    $FullPath = Join-Path $Root $RelativePath
    $Parent = Split-Path -Parent $FullPath

    if (-not (Test-Path -LiteralPath $Parent)) {
        New-Item -ItemType Directory -Path $Parent -Force | Out-Null
    }

    if (Test-Path -LiteralPath $FullPath) {
        $CurrentLength = (Get-Item -LiteralPath $FullPath).Length

        if ($CurrentLength -gt 0) {
            Write-Host "Giữ nguyên file đã có nội dung: $RelativePath" -ForegroundColor DarkYellow
            return
        }
    }

    [System.IO.File]::WriteAllText($FullPath, $Content.TrimStart(), $Utf8NoBom)
    Write-Host "Đã ghi nội dung: $RelativePath" -ForegroundColor Green
}

function Find-InputFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Pattern
    )

    $SearchFolders = @($InputDir, $Root)

    foreach ($Folder in $SearchFolders) {
        if (-not (Test-Path -LiteralPath $Folder)) {
            continue
        }

        $Found = Get-ChildItem -LiteralPath $Folder -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like $Pattern } |
            Select-Object -First 1

        if ($Found) {
            return $Found
        }
    }

    return $null
}

function Copy-InputFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Pattern,

        [Parameter(Mandatory = $true)]
        [string]$DestinationRelativePath
    )

    $Source = Find-InputFile -Pattern $Pattern

    if (-not $Source) {
        Write-Warning "Chưa tìm thấy file nguồn: $Pattern"
        return $false
    }

    $Destination = Join-Path $Root $DestinationRelativePath
    $Parent = Split-Path -Parent $Destination

    if (-not (Test-Path -LiteralPath $Parent)) {
        New-Item -ItemType Directory -Path $Parent -Force | Out-Null
    }

    $SourceResolved = [System.IO.Path]::GetFullPath($Source.FullName)
    $DestinationResolved = [System.IO.Path]::GetFullPath($Destination)

    if ($SourceResolved -ne $DestinationResolved) {
        Copy-Item -LiteralPath $Source.FullName -Destination $Destination -Force
    }
    Write-Host "Đã sao chép: $($Source.Name) -> $DestinationRelativePath" -ForegroundColor Green
    return $true
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "SETUP MINDHUB ADMIN FE" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Root: $Root" -ForegroundColor White
Write-Host ""

# ============================================================
# 1. TẠO THƯ MỤC
# ============================================================

$Directories = @(
    "_setup-input",

    ".antigravity\rules",
    ".antigravity\workflows",

    ".agents\skills\mindhub-admin-ui",
    ".agents\skills\mindhub-admin-ui\references",
    ".agents\skills\mindhub-admin-ui\templates",
    ".agents\skills\mindhub-admin-ui\scripts",

    "knowledge",
    "knowledge\project",
    "knowledge\design",
    "knowledge\admin",
    "knowledge\api",
    "knowledge\quality"
)

foreach ($Directory in $Directories) {
    Ensure-Directory -RelativePath $Directory
}

# ============================================================
# 2. NHẬP TÀI LIỆU NGUỒN
# Bỏ các file sau vào _setup-input trước khi chạy:
# - FE_Quan_Ly_Admin_MindHub_GD1*.md
# - DESIGN.md
# - tokens.json
# - theme.css
# - variables.css
# ============================================================

$HasAdminDoc = Copy-InputFile `
    -Pattern "FE_Quan_Ly_Admin_MindHub_GD1*.md" `
    -DestinationRelativePath "knowledge\admin\ADMIN_FE_GD1_FULL.md"

Copy-InputFile -Pattern "DESIGN.md" -DestinationRelativePath "knowledge\design\DESIGN.md" | Out-Null
Copy-InputFile -Pattern "tokens.json" -DestinationRelativePath "knowledge\design\tokens.json" | Out-Null
Copy-InputFile -Pattern "theme.css" -DestinationRelativePath "knowledge\design\theme.css" | Out-Null
Copy-InputFile -Pattern "variables.css" -DestinationRelativePath "knowledge\design\variables.css" | Out-Null

# Placeholder cho tài liệu thiết kế còn thiếu
Write-FileIfEmpty "knowledge\design\DESIGN.md" @'
# MindHub Admin Design System

File thiết kế chi tiết chưa được nhập.

Hãy đặt `DESIGN.md` vào `_setup-input`, sau đó chạy lại script.
'@

Write-FileIfEmpty "knowledge\design\tokens.json" @'
{
  "_note": "Đặt tokens.json thật vào _setup-input rồi chạy lại script."
}
'@

Write-FileIfEmpty "knowledge\design\theme.css" @'
/* Đặt theme.css thật vào _setup-input rồi chạy lại script. */
'@

Write-FileIfEmpty "knowledge\design\variables.css" @'
/* Đặt variables.css thật vào _setup-input rồi chạy lại script. */
'@

# ============================================================
# 3. AGENTS.MD
# ============================================================

Write-FileIfEmpty "AGENTS.md" @'
# MindHub Admin FE Agent Guide

## Phạm vi hiện tại

Dự án chỉ xây dựng giao diện quản trị Admin bằng:

- HTML tĩnh
- Tailwind CSS
- JavaScript thuần
- Dữ liệu mock
- Chưa kết nối API thật
- Không dùng React hoặc Vue

## Thứ tự đọc tài liệu

Trước khi làm một trang Admin:

1. Đọc `.antigravity/rules/`.
2. Đọc `knowledge/admin/INDEX.md`.
3. Đọc tài liệu module tương ứng.
4. Đọc `knowledge/design/DESIGN.md`.
5. Đọc `knowledge/design/component-rules.md`.
6. Kiểm tra code HTML, CSS và JavaScript hiện có.
7. Dùng `.agents/skills/mindhub-admin-ui/SKILL.md`.

## Nguồn ưu tiên

1. Tài liệu Admin GD1 đã chốt.
2. Design system MindHub.
3. Code hiện tại.
4. API chỉ dùng để chuẩn bị việc nối Backend sau này.

## Quy tắc bắt buộc

- Không tự thêm trang, API, field, status, role hoặc nghiệp vụ.
- Không sửa Backend.
- Không viết logic Backend trong frontend.
- Không hard-code màu khi đã có token.
- Tái sử dụng sidebar, topbar, card, table, modal và badge.
- Mỗi trang phải có loading, empty, filter-empty, error và permission denied.
- Sau khi sửa phải build Tailwind CSS.
- Phải báo file đã sửa và phần chưa hoàn thành.

## Quy trình

Đọc tài liệu → kiểm tra code → lập kế hoạch → code → build CSS → kiểm tra giao diện → báo kết quả.
'@

# ============================================================
# 4. KNOWLEDGE PROJECT
# ============================================================

Write-FileIfEmpty "knowledge\INDEX.md" @'
# MindHub Admin Knowledge Index

## Project

- `project/overview.md`
- `project/current-state.md`
- `project/directory-structure.md`
- `project/decisions.md`

## Design

- `design/DESIGN.md`
- `design/tokens.json`
- `design/theme.css`
- `design/variables.css`
- `design/component-rules.md`
- `design/layout-rules.md`
- `design/page-patterns.md`

## Admin

- `admin/INDEX.md`
- `admin/ADMIN_FE_GD1_FULL.md`
- Các tài liệu từng module

## API

- `api/api-index.md`
- `api/existing-api.md`
- `api/missing-api.md`
- `api/status-dictionary.md`

## Quality

- `quality/definition-of-done.md`
- `quality/testing-checklist.md`
- `quality/known-issues.md`
'@

Write-FileIfEmpty "knowledge\project\overview.md" @'
# Tổng quan MindHub Admin FE

MindHub Admin là giao diện quản trị cho nền tảng bán khóa học trực tuyến.

Phạm vi GD1 gồm:

- Dashboard
- Người dùng
- Nâng cấp giảng viên
- Khóa học
- Kiểm duyệt khóa học
- Danh mục
- Đơn hàng
- Doanh thu
- Rút tiền
- Tài khoản nhận tiền
- Bình luận và đánh giá
- Báo cáo
- Banner
- FAQ
- Thông báo

Giai đoạn hiện tại chỉ xây dựng giao diện tĩnh.
'@

Write-FileIfEmpty "knowledge\project\current-state.md" @'
# Trạng thái hiện tại

## Đã có

- Khung HTML/CSS/JavaScript
- Tailwind CSS CLI
- Danh sách trang Admin
- Tài liệu nghiệp vụ Admin GD1
- Rules, workflows và skill cho AI

## Đang làm

- Design system
- Admin Shell
- Sidebar
- Topbar
- Component dùng chung
- Dashboard tĩnh
- Dữ liệu mock

## Chưa làm

- API thật
- Authentication thật
- Route guard
- React/Vue
- Dữ liệu Backend
'@

Write-FileIfEmpty "knowledge\project\directory-structure.md" @'
# Cấu trúc thư mục

fe-admin/
- index.html
- pages/
- components/
- assets/css/
- assets/js/
- assets/images/
- data/
- knowledge/
- .antigravity/
- .agents/
- package.json
- AGENTS.md

## Vai trò

- `pages/`: từng trang Admin.
- `components/`: thành phần dùng chung.
- `assets/css/`: CSS nguồn và CSS đã build.
- `assets/js/`: JavaScript chung và theo trang.
- `data/`: dữ liệu mock.
- `knowledge/`: kiến thức dự án.
- `.antigravity/`: rules và workflows.
- `.agents/skills/`: kỹ năng chuyên môn của AI.
'@

Write-FileIfEmpty "knowledge\project\decisions.md" @'
# Các quyết định đã chốt

1. Dùng HTML tĩnh, Tailwind CSS và JavaScript thuần.
2. Chưa dùng React hoặc Vue.
3. Dùng mock data trước, nối API sau.
4. Chỉ làm khu vực Admin GD1.
5. Coupon do giảng viên quản lý.
6. Không đưa Credit package vào Admin mới.
7. Không thêm refund, audit log, role động hoặc system settings.
8. Giao diện light mode, monochrome.
9. Bắt đầu với Admin Shell, Sidebar, Topbar và Dashboard.
'@

# ============================================================
# 5. DESIGN KNOWLEDGE
# ============================================================

Write-FileIfEmpty "knowledge\design\component-rules.md" @'
# Quy tắc Component

## Card

- Nền trắng.
- Border mảnh.
- Radius 24px.
- Padding 20px.
- Shadow rất nhẹ.

## Button

### Primary

- Nền tối.
- Chữ trắng.
- Radius 18px.
- Cao khoảng 36–40px.

### Secondary

- Nền xám nhạt.
- Chữ tối.
- Radius 18px.

### Destructive

- Chỉ dùng đỏ cho lỗi, xóa, khóa hoặc từ chối.

## Input

- Nền xám nhạt.
- Radius 18px.
- Cỡ chữ 14px.
- Có focus ring.

## Badge

- Radius 18px.
- Cỡ chữ 12px.
- Luôn có text, không chỉ dựa vào màu.

## Table

- Header rõ ràng.
- Có hover row.
- Có empty state.
- Action ở cột cuối.
- Có overflow ngang trên màn hình nhỏ.
'@

Write-FileIfEmpty "knowledge\design\layout-rules.md" @'
# Quy tắc Layout

## Admin Shell

- Sidebar bên trái.
- Topbar phía trên.
- Nội dung chính bên phải.
- Background trang xám rất nhạt.
- Card trắng.

## Sidebar

- Rộng khoảng 256px trên desktop.
- Có trạng thái active.
- Menu chia theo nhóm.
- Có thể thu gọn sau.

## Topbar

- Nút menu mobile.
- Search.
- Notification.
- Hồ sơ Admin.

## Main Content

- Padding desktop 24–32px.
- Padding mobile 16px.
- Khoảng cách theo hệ 4px.
'@

Write-FileIfEmpty "knowledge\design\page-patterns.md" @'
# Mẫu trang Admin

## Dashboard

- Header
- KPI cards
- Chart
- Công việc cần xử lý
- Xếp hạng
- Hoạt động gần đây

## Management List

- Header
- Summary cards
- Filter bar
- Data table
- Pagination
- Detail drawer
- Confirm modal

## Review Workspace

- Danh sách chờ xử lý
- Chi tiết
- Duyệt
- Từ chối
- Lý do từ chối

## Content Editor

- Danh sách
- Form thêm/sửa
- Preview
- Save/Cancel
'@

# ============================================================
# 6. ADMIN INDEX + TÁCH MODULE
# ============================================================

Write-FileIfEmpty "knowledge\admin\INDEX.md" @'
# MindHub Admin Module Index

| STT | Module | File |
|---:|---|---|
| 1 | Dashboard | `dashboard.md` |
| 2 | Người dùng | `users.md` |
| 3 | Nâng cấp giảng viên | `instructor-upgrades.md` |
| 4 | Khóa học | `courses.md` |
| 5 | Kiểm duyệt khóa học | `course-reviews.md` |
| 6 | Danh mục | `categories.md` |
| 7 | Đơn hàng | `orders.md` |
| 8 | Doanh thu | `revenues.md` |
| 9 | Rút tiền | `withdrawals.md` |
| 10 | Tài khoản nhận tiền | `payout-accounts.md` |
| 11 | Moderation | `moderation.md` |
| 12 | Báo cáo | `reports.md` |
| 13 | Banner | `banners.md` |
| 14 | FAQ | `faqs.md` |
| 15 | Thông báo | `notifications.md` |

Nguồn đầy đủ: `ADMIN_FE_GD1_FULL.md`.
'@

$AdminFullPath = Join-Path $Root "knowledge\admin\ADMIN_FE_GD1_FULL.md"

$AdminFileMap = @{
    1  = "dashboard.md"
    2  = "users.md"
    3  = "instructor-upgrades.md"
    4  = "courses.md"
    5  = "course-reviews.md"
    6  = "categories.md"
    7  = "orders.md"
    8  = "revenues.md"
    9  = "withdrawals.md"
    10 = "payout-accounts.md"
    11 = "moderation.md"
    12 = "reports.md"
    13 = "banners.md"
    14 = "faqs.md"
    15 = "notifications.md"
}

if (Test-Path -LiteralPath $AdminFullPath) {
    $AdminContent = [System.IO.File]::ReadAllText($AdminFullPath)
    $SectionPattern = '(?m)^#\s+(?<number>1[0-5]|[1-9])\.\s+(?<title>[^\r\n]+)'
    $Matches = [regex]::Matches($AdminContent, $SectionPattern)
    $RomanIII = [regex]::Match($AdminContent, '(?m)^#\s+III\.')

    for ($Index = 0; $Index -lt $Matches.Count; $Index++) {
        $Match = $Matches[$Index]
        $Number = [int]$Match.Groups["number"].Value

        if (-not $AdminFileMap.ContainsKey($Number)) {
            continue
        }

        $Start = $Match.Index

        if ($Index + 1 -lt $Matches.Count) {
            $End = $Matches[$Index + 1].Index
        }
        elseif ($RomanIII.Success -and $RomanIII.Index -gt $Start) {
            $End = $RomanIII.Index
        }
        else {
            $End = $AdminContent.Length
        }

        $Section = $AdminContent.Substring($Start, $End - $Start).Trim()

        $ModuleContent = @"
---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

$Section
"@

        Write-FileIfEmpty "knowledge\admin\$($AdminFileMap[$Number])" $ModuleContent
    }

    Write-Host "Đã xử lý tài liệu 15 module Admin." -ForegroundColor Cyan
}
else {
    Write-Warning "Chưa có knowledge\admin\ADMIN_FE_GD1_FULL.md."
}

# ============================================================
# 7. API KNOWLEDGE
# ============================================================

Write-FileIfEmpty "knowledge\api\api-index.md" @'
# API Index

Giai đoạn hiện tại chưa kết nối API.

Tài liệu API chỉ dùng để:

- Đặt tên field mock.
- Chuẩn bị filter.
- Chuẩn bị status.
- Tránh thiết kế giao diện không thể nối Backend sau này.
'@

Write-FileIfEmpty "knowledge\api\existing-api.md" @'
# API Admin hiện có theo tài liệu GD1

- GET /api/admin/dashboard
- CRUD /api/admin/users
- CRUD /api/admin/categories
- GET/PATCH /api/admin/courses
- GET /api/admin/course-reviews
- PATCH approve/reject course
- GET/PATCH instructor upgrade requests
- GET /api/admin/orders
- PATCH /api/admin/moderation/items/{id}
- GET các API reports
- CRUD /api/admin/banners

Không gọi API thật trong giai đoạn giao diện tĩnh.
'@

Write-FileIfEmpty "knowledge\api\missing-api.md" @'
# API còn thiếu theo tài liệu GD1

Các nhóm còn thiếu:

- Chi tiết và thao tác đơn hàng.
- Revenue list/detail.
- Withdrawals.
- Payout accounts.
- FAQ.
- Notifications.
- Moderation list/detail.
- Một số báo cáo học viên.

Frontend không được giả định các API này đã tồn tại.
'@

Write-FileIfEmpty "knowledge\api\status-dictionary.md" @'
# Status Dictionary

## User

- active → Đang hoạt động
- inactive → Tạm ngưng
- locked → Bị khóa

## Course

- draft → Đang hoàn thiện
- pending_review → Chờ duyệt
- approved → Đã duyệt
- rejected → Bị từ chối
- published → Đang công khai
- hidden → Đã ẩn

## Order

- pending → Chờ thanh toán
- paid → Đã thanh toán
- cancelled → Đã hủy
- failed → Thất bại
- expired → Hết hạn

## Revenue

- pending → Chờ ghi nhận
- available → Khả dụng
- withdrawn → Đã rút
- cancelled → Đã hủy

## Withdrawal

- pending → Chờ xử lý
- approved → Đã duyệt
- rejected → Bị từ chối
- paid → Đã thanh toán
- cancelled → Đã hủy

## Payout account

- active → Đang hoạt động
- inactive → Đã tắt
- pending_verification → Chờ xác minh
- rejected → Bị từ chối

## Comment

- visible → Đang hiển thị
- hidden → Đã ẩn
- deleted → Đã xóa
'@

# ============================================================
# 8. QUALITY
# ============================================================

Write-FileIfEmpty "knowledge\quality\definition-of-done.md" @'
# Definition of Done

Một trang Admin hoàn thành khi:

- Đúng tài liệu module.
- Đúng design system.
- Dùng layout chung.
- Responsive cơ bản.
- Có dữ liệu mock.
- Có filter UI.
- Có nội dung chính.
- Có modal/drawer nếu cần.
- Có loading.
- Có empty.
- Có filter-empty.
- Có error.
- Có permission denied.
- Không lỗi console.
- Tailwind build thành công.
- Link điều hướng hoạt động.
'@

Write-FileIfEmpty "knowledge\quality\testing-checklist.md" @'
# Testing Checklist

## Giao diện

- Desktop
- Tablet
- Mobile
- Sidebar
- Menu active
- Overflow table
- Modal
- Dropdown
- Filter

## Kỹ thuật

Chạy:

npm run build:css

Sau đó:

- Mở bằng Live Server.
- Kiểm tra Console.
- Kiểm tra link.
- Kiểm tra CSS và JavaScript tải thành công.
'@

Write-FileIfEmpty "knowledge\quality\known-issues.md" @'
# Known Issues

- Đang dùng mock data.
- Chưa có authentication thật.
- Chưa có route guard.
- Chưa kết nối API.
- Component HTML dùng chung chưa có cơ chế render hoàn chỉnh.
- Một số thao tác chỉ mô phỏng.
- Biểu đồ có thể dùng dữ liệu tĩnh.
'@

# ============================================================
# 9. RULES
# ============================================================

Write-FileIfEmpty ".antigravity\rules\00-project-guardrails.md" @'
# Project Guardrails

- Chỉ làm frontend Admin MindHub GD1.
- Không sửa Backend.
- Không tạo database.
- Không tự thêm nghiệp vụ.
- Không tự thêm status hoặc role.
- Không làm trang ngoài tài liệu đã chốt.
- Không xóa file ngoài phạm vi task.
- Không sửa toàn bộ dự án khi task chỉ yêu cầu một trang.
- Phải đọc tài liệu module trước khi code.
- Phải kiểm tra code hiện tại trước khi tạo component mới.
- Không tuyên bố hoàn thành nếu chưa build CSS và kiểm tra giao diện.
'@

Write-FileIfEmpty ".antigravity\rules\10-frontend-admin-rules.md" @'
# Frontend Admin Rules

- FE dùng HTML, Tailwind CSS và JavaScript thuần.
- Dùng dữ liệu mock trong `data/`.
- Không gọi API thật khi chưa được yêu cầu.
- Không xem số liệu mock là nguồn nghiệp vụ thật.
- Status trong data dùng giá trị kỹ thuật.
- Label tiếng Việt chỉ dùng để hiển thị.
- Trang quản lý có summary, filter, content và pagination khi phù hợp.
- Tái sử dụng component chung.
- JavaScript riêng từng trang đặt trong `assets/js/pages/`.
'@

Write-FileIfEmpty ".antigravity\rules\20-design-system-rules.md" @'
# Design System Rules

- Chỉ light mode trong GD1.
- Dùng token từ `knowledge/design/`.
- Card radius 24px.
- Button, input và badge radius 18px.
- Không gradient.
- Không thêm màu tùy ý.
- Đỏ chỉ dùng cho lỗi hoặc destructive action.
- Không hard-code màu khi đã có token.
- Icon thin stroke.
'@

Write-FileIfEmpty ".antigravity\rules\30-static-html-rules.md" @'
# Static HTML Rules

- Mỗi trang dùng `lang="vi"`.
- Dùng semantic HTML khi phù hợp.
- Button không submit phải có `type="button"`.
- Modal có role phù hợp.
- Input có label hoặc aria-label.
- Không dùng inline style nếu không cần thiết.
- Tailwind class là lựa chọn chính.
- Không phụ thuộc framework JavaScript.
- Kiểm tra element tồn tại trước khi thao tác DOM.
- Không dùng `innerHTML` với dữ liệu không kiểm soát.
- Dùng đúng đường dẫn tương đối giữa các trang.
'@

Write-FileIfEmpty ".antigravity\rules\40-terminal-safety.md" @'
# Terminal Safety

Trước khi sửa:

- Chạy `Get-Location`.
- Chạy `git status` nếu có Git.

Quy tắc:

- Chỉ làm trong thư mục `fe-admin`.
- Không chạy `Remove-Item -Recurse -Force` ngoài phạm vi task.
- Không chạy `git reset --hard`.
- Không chạy `git clean -fd`.
- Không xóa file người dùng.
- Không sửa `.env`.
- Không in token hoặc secret.
'@

Write-FileIfEmpty ".antigravity\rules\50-output-report.md" @'
# Output Report Rules

Sau mỗi task phải báo:

1. Trang hoặc component đã làm.
2. File đã tạo.
3. File đã sửa.
4. JavaScript đã bổ sung.
5. Lệnh đã chạy.
6. Kết quả build Tailwind.
7. Phần chưa hoàn thành.
8. Lỗi còn lại.

Không nói “đã xong” khi chưa kiểm tra.
'@

# ============================================================
# 10. WORKFLOWS
# ============================================================

Write-FileIfEmpty ".antigravity\workflows\build-admin-page.md" @'
# Workflow: Build Admin Page

1. Đọc rules.
2. Đọc tài liệu module.
3. Đọc design system.
4. Kiểm tra layout và component hiện tại.
5. Lập kế hoạch file.
6. Làm header, summary, filter, content và modal/drawer.
7. Thêm các trạng thái UI.
8. Kiểm tra responsive.
9. Chạy `npm run build:css`.
10. Kiểm tra bằng Live Server.
11. Báo changed files và phần còn thiếu.
'@

Write-FileIfEmpty ".antigravity\workflows\build-reusable-component.md" @'
# Workflow: Build Reusable Component

1. Xác định component có dùng ở nhiều nơi không.
2. Kiểm tra component tương tự.
3. Đọc design rules.
4. Tạo HTML component.
5. Tạo JavaScript chung nếu cần.
6. Không nhúng dữ liệu riêng của một trang.
7. Kiểm tra responsive.
8. Kiểm tra accessibility cơ bản.
9. Báo các trang sử dụng component.
'@

Write-FileIfEmpty ".antigravity\workflows\review-admin-page.md" @'
# Workflow: Review Admin Page

1. So sánh với tài liệu module.
2. Kiểm tra đủ thành phần.
3. Kiểm tra status label.
4. Kiểm tra token.
5. Kiểm tra responsive.
6. Kiểm tra modal và dropdown.
7. Kiểm tra loading, empty, error và 403.
8. Kiểm tra console.
9. Build Tailwind.
10. Liệt kê lỗi theo mức nghiêm trọng.
'@

Write-FileIfEmpty ".antigravity\workflows\fix-frontend-error.md" @'
# Workflow: Fix Frontend Error

1. Ghi lại lỗi chính xác.
2. Xác định file và dòng.
3. Kiểm tra Console và Network.
4. Sửa phạm vi nhỏ nhất.
5. Build lại CSS nếu cần.
6. Mở lại trang.
7. Kiểm tra lỗi cũ.
8. Kiểm tra không tạo lỗi mới.
9. Báo nguyên nhân và kết quả.
'@

Write-FileIfEmpty ".antigravity\workflows\update-knowledge.md" @'
# Workflow: Update Knowledge

Chỉ cập nhật Knowledge khi:

- Có quyết định mới.
- Thay đổi cấu trúc thư mục.
- Thêm page pattern.
- Thêm status mapping.
- Thay đổi design token.
- Chuyển từ mock sang API thật.

Không cập nhật tài liệu cho thay đổi chưa được duyệt.
'@

# ============================================================
# 11. SKILL
# ============================================================

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\SKILL.md" @'
---
name: mindhub-admin-ui
description: Thiết kế, xây dựng, sửa và review giao diện MindHub Admin bằng HTML tĩnh, Tailwind CSS và JavaScript thuần.
---

# Goal

Xây dựng giao diện Admin MindHub GD1 đúng nghiệp vụ và design system.

# Required Reading

1. `AGENTS.md`
2. `.antigravity/rules/`
3. `knowledge/admin/INDEX.md`
4. Tài liệu module
5. `knowledge/design/DESIGN.md`
6. `knowledge/design/component-rules.md`
7. Code hiện tại

# Stack

- HTML
- Tailwind CSS
- JavaScript thuần
- Mock data
- Không React
- Không Vue
- Chưa nối API

# Process

1. Xác định module.
2. Đọc specification.
3. Kiểm tra component.
4. Lập kế hoạch.
5. Xây dựng giao diện.
6. Thêm mock data.
7. Thêm tương tác.
8. Thêm UI states.
9. Build Tailwind.
10. Review responsive.
11. Báo changed files.

# Constraints

- Không tự thêm nghiệp vụ.
- Không tự thêm API.
- Không hard-code màu ngoài token.
- Không sửa Backend.
- Không dùng framework JavaScript.
- Không tạo component trùng lặp.
- Không bỏ qua mobile.
- Không tuyên bố hoàn thành khi chưa kiểm tra.
'@

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\references\knowledge-map.md" @'
# Knowledge Map

## Dashboard

- `knowledge/admin/dashboard.md`
- `knowledge/design/page-patterns.md`

## Trang quản lý

- Tài liệu module tương ứng
- `knowledge/design/component-rules.md`
- `references/page-patterns.md`

## Status

- `knowledge/api/status-dictionary.md`
- `references/status-ui-map.md`

## Review

- `knowledge/quality/definition-of-done.md`
- `knowledge/quality/testing-checklist.md`
'@

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\references\page-patterns.md" @'
# Page Patterns

## Management Page

- Header
- Summary cards
- Filter bar
- Table
- Pagination
- Detail drawer
- Confirm modal

## Dashboard Page

- Header
- KPI cards
- Chart
- Action queue
- Rankings
- Recent activity

## Review Page

- Pending list
- Detail panel
- Approve
- Reject
- Reason modal

## Content Page

- List
- Create/Edit form
- Preview
- Save/Cancel
'@

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\references\status-ui-map.md" @'
# Status UI Map

## Positive

Badge nền tối:

- paid
- approved
- published
- active
- available

## Pending

Badge outline hoặc xám:

- pending
- pending_review
- processing
- pending_verification

## Neutral

Badge soft:

- draft
- inactive
- hidden
- withdrawn

## Destructive

Đỏ cho text, icon hoặc border:

- rejected
- failed
- locked
- deleted

Luôn có text trạng thái.
'@

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\templates\management-page.md" @'
# Management Page Template

1. Breadcrumb
2. Title và description
3. Primary action
4. Summary cards
5. Search và filters
6. Data table
7. Pagination
8. Detail drawer
9. Confirm/reject modal
10. Empty/error states
'@

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\templates\dashboard-page.md" @'
# Dashboard Page Template

1. Page greeting
2. Date filter
3. KPI cards
4. Main chart
5. Action required
6. Top courses
7. Top instructors
8. Recent activities
'@

Write-FileIfEmpty ".agents\skills\mindhub-admin-ui\templates\detail-drawer.md" @'
# Detail Drawer Template

- Header
- Status badge
- Main information
- Related data
- Timeline
- Actions
- Close button

Yêu cầu:

- Có overlay.
- Có nút đóng.
- Đóng được bằng Escape.
- Không làm mất context trang danh sách.
'@

$GitKeep = Join-Path $Root ".agents\skills\mindhub-admin-ui\scripts\.gitkeep"

if (-not (Test-Path -LiteralPath $GitKeep)) {
    New-Item -ItemType File -Path $GitKeep -Force | Out-Null
}

# ============================================================
# 12. BUILD TAILWIND
# ============================================================

Write-Host ""
Write-Host "Đang kiểm tra Tailwind..." -ForegroundColor Cyan

if (
    (Test-Path -LiteralPath (Join-Path $Root "package.json")) -and
    (Get-Command npm -ErrorAction SilentlyContinue)
) {
    npm run build:css

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Tailwind build thành công." -ForegroundColor Green
    }
    else {
        Write-Warning "Tailwind build lỗi, exit code: $LASTEXITCODE"
    }
}
else {
    Write-Warning "Không tìm thấy package.json hoặc npm. Bỏ qua build Tailwind."
}

# ============================================================
# 13. XUẤT CẤU TRÚC
# ============================================================

$StructureFile = Join-Path $Root "structure-after-setup.txt"

cmd /c tree "$Root" /F /A |
    Out-File -LiteralPath $StructureFile -Encoding utf8

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "SETUP HOÀN TẤT" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cấu trúc được lưu tại:" -ForegroundColor White
Write-Host $StructureFile -ForegroundColor Yellow
Write-Host ""
Write-Host "Bước tiếp theo: dựng Admin Shell, Sidebar và Topbar." -ForegroundColor Cyan
