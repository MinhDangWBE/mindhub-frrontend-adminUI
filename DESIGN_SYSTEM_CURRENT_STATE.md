# DESIGN SYSTEM - CURRENT STATE

> Báo cáo được tạo tự động. Báo cáo này chỉ quét dự án, không sửa source code.

## 1. Thông tin dự án

- Thư mục dự án: `D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin`
- Công nghệ nhận diện: Tailwind CSS
- Tổng file đã quét: 131
- Tổng file source phù hợp: 68
- Tổng file Markdown: 55

## 2. File có khả năng đang quản lý Design System

Ưu tiên kiểm tra các file trong danh sách này trước khi sửa màu.

- `_setup-input\theme.css`
- `_setup-input\tokens.json`
- `_setup-input\variables.css`
- `knowledge\design\theme.css`
- `knowledge\design\tokens.json`
- `knowledge\design\variables.css`

## 3. Vị trí đang sử dụng màu, biến CSS hoặc semantic token

| File | Dòng | Nội dung |
|---|---:|---|
| `assets\css\input.css` | 10 | `--color-canvas: #f5f5f5;` |
| `assets\css\input.css` | 11 | `--color-paper: #ffffff;` |
| `assets\css\input.css` | 12 | `--color-surface-alt: #fafafa;` |
| `assets\css\input.css` | 13 | `--color-ink: #0a0a0a;` |
| `assets\css\input.css` | 14 | `--color-ink-soft: #171717;` |
| `assets\css\input.css` | 15 | `--color-mid-gray: #737373;` |
| `assets\css\input.css` | 16 | `--color-hairline: #e5e5e5;` |
| `assets\css\input.css` | 17 | `--color-ember: #e7000b;` |
| `assets\css\input.css` | 20 | `--color-success: #15803d;` |
| `assets\css\input.css` | 21 | `--color-success-soft: #dcfce7;` |
| `assets\css\input.css` | 22 | `--color-danger-brick: #b42318;` |
| `assets\css\input.css` | 23 | `--color-danger-brick-soft: #fee4e2;` |
| `assets\css\input.css` | 24 | `--color-warning: #b7791f;` |
| `assets\css\input.css` | 25 | `--color-warning-soft: #fef3c7;` |
| `assets\css\input.css` | 41 | `rgba(0, 0, 0, 0.05) 0px 1px 3px 0px,` |
| `assets\css\input.css` | 42 | `rgba(0, 0, 0, 0.05) 0px 1px 2px -1px;` |
| `assets\css\input.css` | 106 | `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);` |
| `assets\css\input.css` | 132 | `background: linear-gradient(90deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%);` |
| `assets\css\output.css` | 2 | `@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--...` |
| `assets\js\toast.js` | 52 | `iconColorClass = "text-success bg-success-soft border border-success/10";` |
| `assets\js\toast.js` | 53 | `borderClass = "border-success/20";` |
| `assets\js\toast.js` | 68 | `iconColorClass = "text-warning bg-warning-soft border border-warning/10";` |
| `assets\js\toast.js` | 69 | `borderClass = "border-warning/20";` |
| `assets\js\pages\dashboard.js` | 595 | `borderClass: "border-l-3 border-warning",` |
| `assets\js\pages\dashboard.js` | 596 | `badgeClass: "bg-warning-soft text-warning border border-warning/10",` |
| `assets\js\pages\dashboard.js` | 597 | `btnClass: "bg-success text-white hover:opacity-90"` |
| `assets\js\pages\dashboard.js` | 605 | `borderClass: "border-l-3 border-warning",` |
| `assets\js\pages\dashboard.js` | 606 | `badgeClass: "bg-warning-soft text-warning border border-warning/10",` |
| `assets\js\pages\dashboard.js` | 607 | `btnClass: "bg-warning text-white hover:opacity-90"` |
| `assets\js\pages\dashboard.js` | 625 | `borderClass: "border-l-3 border-success",` |
| `assets\js\pages\dashboard.js` | 626 | `badgeClass: "bg-success-soft text-success border border-success/10",` |
| `assets\js\pages\dashboard.js` | 627 | `btnClass: "bg-success text-white hover:opacity-90"` |
| `assets\js\pages\dashboard.js` | 681 | `tr.className = `hover:bg-canvas/50 transition-colors ${isFirst ? 'bg-success-soft/30 border-l-2 border-success' : ''}`;` |
| `assets\js\pages\dashboard.js` | 689 | `<td class="py-2.5 text-right font-semibold text-success font-sans">${formatVND(course.gross_revenue)}</td>` |
| `assets\js\pages\dashboard.js` | 728 | `<span class="text-[9px] text-success block mt-0.5">${formatNumber(published)} công khai</span>` |
| `assets\js\pages\dashboard.js` | 730 | `<td class="py-2.5 text-right font-semibold text-success font-sans">${formatVND(inst.instructor_amount)}</td>` |
| `assets\js\pages\dashboard.js` | 761 | `let statusClass = "bg-success-soft text-success border border-success/15";` |
| `assets\js\pages\dashboard.js` | 762 | `let borderClass = "border-l-3 border-success";` |
| `assets\js\pages\dashboard.js` | 763 | `let amountColor = "text-success";` |
| `assets\js\pages\dashboard.js` | 767 | `statusClass = "bg-warning-soft text-warning border border-warning/15";` |
| `assets\js\pages\dashboard.js` | 768 | `borderClass = "border-l-3 border-warning";` |
| `assets\js\pages\dashboard.js` | 826 | `statusClass = "bg-success-soft text-success border border-success/15";` |
| `assets\js\pages\dashboard.js` | 827 | `borderClass = "border-l-3 border-success";` |
| `assets\js\pages\dashboard.js` | 830 | `statusClass = "bg-warning-soft text-warning border border-warning/15";` |
| `assets\js\pages\dashboard.js` | 831 | `borderClass = "border-l-3 border-warning";` |
| `assets\js\pages\dashboard.js` | 895 | `borderColor: "#15803d",` |
| `assets\js\pages\dashboard.js` | 898 | `pointBackgroundColor: "#ffffff",` |
| `assets\js\pages\dashboard.js` | 899 | `pointBorderColor: "#15803d",` |
| `assets\js\pages\dashboard.js` | 907 | `borderColor: "#404040",` |
| `assets\js\pages\dashboard.js` | 910 | `pointBackgroundColor: "#ffffff",` |
| `assets\js\pages\dashboard.js` | 911 | `pointBorderColor: "#404040",` |
| `assets\js\pages\dashboard.js` | 919 | `borderColor: "#b7791f",` |
| `assets\js\pages\dashboard.js` | 922 | `pointBackgroundColor: "#ffffff",` |
| `assets\js\pages\dashboard.js` | 923 | `pointBorderColor: "#b7791f",` |
| `assets\js\pages\dashboard.js` | 950 | `color: "#0a0a0a"` |
| `assets\js\pages\dashboard.js` | 954 | `backgroundColor: "#1f2937",` |
| `assets\js\pages\dashboard.js` | 955 | `titleColor: "#ffffff",` |
| `assets\js\pages\dashboard.js` | 956 | `bodyColor: "#ffffff",` |
| `assets\js\pages\dashboard.js` | 988 | `color: "#737373",` |
| `assets\js\pages\dashboard.js` | 997 | `color: "#f5f5f5"` |
| `assets\js\pages\dashboard.js` | 1000 | `color: "#737373",` |
| `assets\js\pages\dashboard.js` | 1071 | `colorClass: "bg-warning",` |
| `assets\js\pages\dashboard.js` | 1072 | `textClass: "text-warning",` |
| `assets\js\pages\dashboard.js` | 1073 | `bgSoftClass: "bg-warning-soft/60",` |
| `assets\js\pages\dashboard.js` | 1082 | `colorClass: "bg-success",` |
| `assets\js\pages\dashboard.js` | 1083 | `textClass: "text-success",` |
| `assets\js\pages\dashboard.js` | 1084 | `bgSoftClass: "bg-success-soft/40",` |
| `assets\js\pages\dashboard.js` | 1104 | `colorClass: "bg-success",` |
| `assets\js\pages\dashboard.js` | 1105 | `textClass: "text-success",` |
| `assets\js\pages\dashboard.js` | 1106 | `bgSoftClass: "bg-success-soft/60",` |
| `assets\js\pages\dashboard.js` | 1198 | `colorClass: "bg-success",` |
| `assets\js\pages\dashboard.js` | 1199 | `textClass: "text-success",` |
| `assets\js\pages\dashboard.js` | 1200 | `bgSoftClass: "bg-success-soft/40",` |
| `knowledge\design\theme.css` | 3 | `--color-canvas: #f5f5f5;` |
| `knowledge\design\theme.css` | 4 | `--color-paper: #ffffff;` |
| `knowledge\design\theme.css` | 5 | `--color-surface-alt: #fafafa;` |
| `knowledge\design\theme.css` | 6 | `--color-ink: #0a0a0a;` |
| `knowledge\design\theme.css` | 7 | `--color-ink-soft: #171717;` |
| `knowledge\design\theme.css` | 8 | `--color-mid-gray: #737373;` |
| `knowledge\design\theme.css` | 9 | `--color-hairline: #e5e5e5;` |
| `knowledge\design\theme.css` | 10 | `--color-ember: #e7000b;` |
| `knowledge\design\theme.css` | 55 | `--shadow-subtle: oklab(0.145 -0.00000143796 0.00000340492 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;` |
| `knowledge\design\tokens.json` | 4 | `"$value": "#f5f5f5",` |
| `knowledge\design\tokens.json` | 9 | `"$value": "#ffffff",` |
| `knowledge\design\tokens.json` | 14 | `"$value": "#fafafa",` |
| `knowledge\design\tokens.json` | 19 | `"$value": "#0a0a0a",` |
| `knowledge\design\tokens.json` | 24 | `"$value": "#171717",` |
| `knowledge\design\tokens.json` | 29 | `"$value": "#737373",` |
| `knowledge\design\tokens.json` | 34 | `"$value": "#e5e5e5",` |
| `knowledge\design\tokens.json` | 39 | `"$value": "#e7000b",` |
| `knowledge\design\tokens.json` | 334 | `"$value": "oklab(0.145 -0.00000143796 0.00000340492 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px",` |
| `knowledge\design\tokens.json` | 346 | `"$value": "#f5f5f5",` |
| `knowledge\design\tokens.json` | 351 | `"$value": "#fafafa",` |
| `knowledge\design\tokens.json` | 356 | `"$value": "#ffffff",` |
| `knowledge\design\tokens.json` | 361 | `"$value": "#f5f5f5",` |
| `knowledge\design\variables.css` | 3 | `--color-canvas: #f5f5f5;` |
| `knowledge\design\variables.css` | 4 | `--color-paper: #ffffff;` |
| `knowledge\design\variables.css` | 5 | `--color-surface-alt: #fafafa;` |
| `knowledge\design\variables.css` | 6 | `--color-ink: #0a0a0a;` |
| `knowledge\design\variables.css` | 7 | `--color-ink-soft: #171717;` |
| `knowledge\design\variables.css` | 8 | `--color-mid-gray: #737373;` |
| `knowledge\design\variables.css` | 9 | `--color-hairline: #e5e5e5;` |
| `knowledge\design\variables.css` | 10 | `--color-ember: #e7000b;` |
| `knowledge\design\variables.css` | 75 | `--shadow-subtle: oklab(0.145 -0.00000143796 0.00000340492 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;` |
| `knowledge\design\variables.css` | 79 | `--surface-canvas: #f5f5f5;` |
| `knowledge\design\variables.css` | 80 | `--surface-sidebar: #fafafa;` |
| `knowledge\design\variables.css` | 81 | `--surface-card: #ffffff;` |
| `knowledge\design\variables.css` | 82 | `--surface-input-fill: #f5f5f5;` |
| `pages\dashboard.html` | 197 | `class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-warning-soft text-warning border border-warning/10"` |
| `pages\dashboard.html` | 223 | `<div id="kpi-courses-bar-published" class="bg-success h-full rounded-full" style="width: 0%"></div>` |
| `pages\dashboard.html` | 261 | `<div id="kpi-enrollments-bar-completed" class="bg-success h-full rounded-full" style="width: 0%"></div>` |
| `pages\dashboard.html` | 300 | `<div id="kpi-orders-bar-paid" class="bg-success h-full rounded-full" style="width: 0%"></div>` |
| `pages\dashboard.html` | 319 | `<div class="text-success shrink-0">` |
| `pages\dashboard.html` | 387 | `<span id="kpi-withdrawal-pending-count" class="text-warning font-bold font-sans ml-0.5"></span>` |
| `pages\dashboard.html` | 389 | `<div class="text-warning shrink-0">` |
| `pages\dashboard.html` | 402 | `<span id="kpi-withdrawal-pending-sub" class="text-[9px] text-warning mt-1 leading-tight font-medium">` |
| `pages\dashboard.html` | 447 | `<div class="text-success shrink-0">` |
| `pages\dashboard.html` | 487 | `<div class="border-l-3 border-success pl-2.5 mb-2.5">` |
| `pages\dashboard.html` | 515 | `<div class="border-l-3 border-warning pl-2.5 mb-2.5">` |
| `pages\dashboard.html` | 538 | `<div class="border-l-3 border-success pl-2.5 mb-2.5">` |
| `pages\dashboard.html` | 666 | `class="px-3 py-1.5 text-xs font-semibold rounded-full bg-success-soft text-success hover:bg-success hover:text-white border border-success/10 transition-all cursor-pointer"` |
| `pages\dashboard.html` | 680 | `class="px-3 py-1.5 text-xs font-semibold rounded-full bg-warning-soft text-warning hover:bg-warning hover:text-white border border-warning/10 transition-all cursor-pointer"` |
| `_setup-input\theme.css` | 3 | `--color-canvas: #f5f5f5;` |
| `_setup-input\theme.css` | 4 | `--color-paper: #ffffff;` |
| `_setup-input\theme.css` | 5 | `--color-surface-alt: #fafafa;` |
| `_setup-input\theme.css` | 6 | `--color-ink: #0a0a0a;` |
| `_setup-input\theme.css` | 7 | `--color-ink-soft: #171717;` |
| `_setup-input\theme.css` | 8 | `--color-mid-gray: #737373;` |
| `_setup-input\theme.css` | 9 | `--color-hairline: #e5e5e5;` |
| `_setup-input\theme.css` | 10 | `--color-ember: #e7000b;` |
| `_setup-input\theme.css` | 55 | `--shadow-subtle: oklab(0.145 -0.00000143796 0.00000340492 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;` |
| `_setup-input\tokens.json` | 4 | `"$value": "#f5f5f5",` |
| `_setup-input\tokens.json` | 9 | `"$value": "#ffffff",` |
| `_setup-input\tokens.json` | 14 | `"$value": "#fafafa",` |
| `_setup-input\tokens.json` | 19 | `"$value": "#0a0a0a",` |
| `_setup-input\tokens.json` | 24 | `"$value": "#171717",` |
| `_setup-input\tokens.json` | 29 | `"$value": "#737373",` |
| `_setup-input\tokens.json` | 34 | `"$value": "#e5e5e5",` |
| `_setup-input\tokens.json` | 39 | `"$value": "#e7000b",` |
| `_setup-input\tokens.json` | 334 | `"$value": "oklab(0.145 -0.00000143796 0.00000340492 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px",` |
| `_setup-input\tokens.json` | 346 | `"$value": "#f5f5f5",` |
| `_setup-input\tokens.json` | 351 | `"$value": "#fafafa",` |
| `_setup-input\tokens.json` | 356 | `"$value": "#ffffff",` |
| `_setup-input\tokens.json` | 361 | `"$value": "#f5f5f5",` |
| `_setup-input\variables.css` | 3 | `--color-canvas: #f5f5f5;` |
| `_setup-input\variables.css` | 4 | `--color-paper: #ffffff;` |
| `_setup-input\variables.css` | 5 | `--color-surface-alt: #fafafa;` |
| `_setup-input\variables.css` | 6 | `--color-ink: #0a0a0a;` |
| `_setup-input\variables.css` | 7 | `--color-ink-soft: #171717;` |
| `_setup-input\variables.css` | 8 | `--color-mid-gray: #737373;` |
| `_setup-input\variables.css` | 9 | `--color-hairline: #e5e5e5;` |
| `_setup-input\variables.css` | 10 | `--color-ember: #e7000b;` |
| `_setup-input\variables.css` | 75 | `--shadow-subtle: oklab(0.145 -0.00000143796 0.00000340492 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;` |
| `_setup-input\variables.css` | 79 | `--surface-canvas: #f5f5f5;` |
| `_setup-input\variables.css` | 80 | `--surface-sidebar: #fafafa;` |
| `_setup-input\variables.css` | 81 | `--surface-card: #ffffff;` |
| `_setup-input\variables.css` | 82 | `--surface-input-fill: #f5f5f5;` |

## 4. Các file Markdown cần xem xét cập nhật

| File | Số dòng có nội dung liên quan Design/UI | Mức ưu tiên |
|---|---:|---|
| `.agents\skills\mindhub-admin-ui\references\knowledge-map.md` | 5 | Trung bình |
| `.agents\skills\mindhub-admin-ui\references\page-patterns.md` | 1 | Trung bình |
| `.agents\skills\mindhub-admin-ui\references\status-ui-map.md` | 1 | Trung bình |
| `.agents\skills\mindhub-admin-ui\SKILL.md` | 13 | Cao |
| `.agents\skills\mindhub-admin-ui\templates\dashboard-page.md` | 2 | Trung bình |
| `.agents\skills\mindhub-admin-ui\templates\detail-drawer.md` | 1 | Trung bình |
| `.agents\skills\mindhub-admin-ui\templates\management-page.md` | 0 | Thấp |
| `.antigravity\rules\00-project-guardrails.md` | 2 | Trung bình |
| `.antigravity\rules\10-frontend-admin-rules.md` | 2 | Trung bình |
| `.antigravity\rules\20-design-system-rules.md` | 5 | Trung bình |
| `.antigravity\rules\30-static-html-rules.md` | 2 | Trung bình |
| `.antigravity\rules\40-terminal-safety.md` | 1 | Trung bình |
| `.antigravity\rules\50-output-report.md` | 2 | Trung bình |
| `.antigravity\workflows\build-admin-page.md` | 5 | Trung bình |
| `.antigravity\workflows\build-reusable-component.md` | 6 | Trung bình |
| `.antigravity\workflows\fix-frontend-error.md` | 1 | Trung bình |
| `.antigravity\workflows\review-admin-page.md` | 2 | Trung bình |
| `.antigravity\workflows\update-knowledge.md` | 1 | Trung bình |
| `_setup-input\DESIGN.md` | 80 | Cao |
| `_setup-input\FE_Quan_Ly_Admin_MindHub_GD1(4).md` | 25 | Cao |
| `AGENTS.md` | 11 | Cao |
| `knowledge\admin\ADMIN_FE_GD1_FULL.md` | 25 | Cao |
| `knowledge\admin\banners.md` | 2 | Trung bình |
| `knowledge\admin\categories.md` | 1 | Trung bình |
| `knowledge\admin\course-reviews.md` | 2 | Trung bình |
| `knowledge\admin\courses.md` | 2 | Trung bình |
| `knowledge\admin\dashboard.md` | 7 | Trung bình |
| `knowledge\admin\faqs.md` | 1 | Trung bình |
| `knowledge\admin\INDEX.md` | 1 | Trung bình |
| `knowledge\admin\instructor-upgrades.md` | 2 | Trung bình |
| `knowledge\admin\moderation.md` | 1 | Trung bình |
| `knowledge\admin\notifications.md` | 1 | Trung bình |
| `knowledge\admin\orders.md` | 1 | Trung bình |
| `knowledge\admin\payout-accounts.md` | 1 | Trung bình |
| `knowledge\admin\reports.md` | 2 | Trung bình |
| `knowledge\admin\revenues.md` | 2 | Trung bình |
| `knowledge\admin\users.md` | 3 | Trung bình |
| `knowledge\admin\withdrawals.md` | 1 | Trung bình |
| `knowledge\api\api-index.md` | 1 | Trung bình |
| `knowledge\api\existing-api.md` | 2 | Trung bình |
| `knowledge\api\FE_ADMIN_MINDHUB_GD1_API_CONTRACT_V2.md` | 42 | Cao |
| `knowledge\api\missing-api.md` | 0 | Thấp |
| `knowledge\api\status-dictionary.md` | 0 | Thấp |
| `knowledge\design\component-rules.md` | 11 | Cao |
| `knowledge\design\DESIGN.md` | 87 | Cao |
| `knowledge\design\layout-rules.md` | 2 | Trung bình |
| `knowledge\design\page-patterns.md` | 1 | Trung bình |
| `knowledge\INDEX.md` | 8 | Trung bình |
| `knowledge\project\current-state.md` | 5 | Trung bình |
| `knowledge\project\decisions.md` | 3 | Trung bình |
| `knowledge\project\directory-structure.md` | 3 | Trung bình |
| `knowledge\project\overview.md` | 3 | Trung bình |
| `knowledge\quality\definition-of-done.md` | 3 | Trung bình |
| `knowledge\quality\known-issues.md` | 1 | Trung bình |
| `knowledge\quality\testing-checklist.md` | 3 | Trung bình |

## 5. Thứ tự đề xuất khi đổi bảng màu

1. Xác định file nguồn màu trung tâm: CSS variables, theme hoặc Tailwind config.
2. Đổi semantic token như primary, background, foreground, border, muted và destructive.
3. Kiểm tra component dùng chung: button, input, badge, card, table, dialog, toast và sidebar.
4. Thay màu hard-code còn sót trong page và component.
5. Kiểm tra biểu đồ, trạng thái success, warning, error và info.
6. Đồng bộ tất cả tài liệu Markdown có mô tả màu, component hoặc giao diện.
7. Chạy lint, type-check và production build.

## 6. Nguyên tắc chỉnh sửa

- Không thay đổi bố cục và logic nghiệp vụ chỉ vì đổi bảng màu.
- Không thêm màu hard-code mới nếu dự án đã có semantic token.
- Không sửa trực tiếp component thư viện nếu có thể override qua token hoặc theme.
- Phải kiểm tra hover, focus, active, disabled, selected và dark mode nếu dự án có hỗ trợ.
- Nội dung trong file Markdown phải khớp với source code sau cùng.
