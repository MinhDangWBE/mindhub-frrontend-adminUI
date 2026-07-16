# ORDERS DEBUG REPORT

- Thời điểm: 10:50:02 16/7/2026
- FE root: `D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin`
- Phạm vi: Orders filter, table render, sidebar toggle và trạng thái order/payment.

## 1. Kiểm tra file bắt buộc

- OK: `pages/orders.html` — 55338 bytes
- OK: `pages/dashboard.html` — 57673 bytes
- OK: `components/sidebar.html` — 16979 bytes
- OK: `components/topbar.html` — 6794 bytes
- OK: `assets/js/pages/orders.js` — 65613 bytes
- OK: `assets/js/api/orders-api.js` — 6579 bytes
- OK: `assets/js/sidebar-toggle.js` — 4092 bytes
- OK: `assets/js/core/table-row-click.js` — 4204 bytes
- OK: `assets/js/core/custom-select.js` — 21084 bytes
- OK: `assets/js/toast.js` — 9263 bytes

## 2. Kiểm tra cú pháp JavaScript

- FAIL: `assets/js/pages/orders.js`

```text
(node:12308) Warning: Failed to load the ES module: D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\pages\orders.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\pages\orders.js:1
import { getOrders, getOrder } from "../api/orders-api.js";
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at wrapSafe (node:internal/modules/cjs/loader:1691:18)
    at checkSyntax (node:internal/main/check_syntax:76:3)

Node.js v24.11.0
```
- FAIL: `assets/js/api/orders-api.js`

```text
(node:13116) Warning: Failed to load the ES module: D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\api\orders-api.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\api\orders-api.js:1
import { getOrders as getRepoOrders, getOrderById as getRepoOrderById, populateOrder } from "../mocks/mock-repository.js";
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at wrapSafe (node:internal/modules/cjs/loader:1691:18)
    at checkSyntax (node:internal/main/check_syntax:76:3)

Node.js v24.11.0
```
- PASS: `assets/js/sidebar-toggle.js`
- FAIL: `assets/js/core/table-row-click.js`

```text
(node:504) Warning: Failed to load the ES module: D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\core\table-row-click.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\core\table-row-click.js:9
export function isInteractiveElement(target) {
^^^^^^

SyntaxError: Unexpected token 'export'
    at wrapSafe (node:internal/modules/cjs/loader:1691:18)
    at checkSyntax (node:internal/main/check_syntax:76:3)

Node.js v24.11.0
```
- FAIL: `assets/js/core/custom-select.js`

```text
(node:3552) Warning: Failed to load the ES module: D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\core\custom-select.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\core\custom-select.js:26
export function initAllCustomSelects() {
^^^^^^

SyntaxError: Unexpected token 'export'
    at wrapSafe (node:internal/modules/cjs/loader:1691:18)
    at checkSyntax (node:internal/main/check_syntax:76:3)

Node.js v24.11.0
```
- FAIL: `assets/js/toast.js`

```text
(node:22636) Warning: Failed to load the ES module: D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\toast.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin\assets\js\toast.js:25
export function showToast(options, typeParam, titleParam, durationParam) {
^^^^^^

SyntaxError: Unexpected token 'export'
    at wrapSafe (node:internal/modules/cjs/loader:1691:18)
    at checkSyntax (node:internal/main/check_syntax:76:3)

Node.js v24.11.0
```

## 3. Kiểm tra script và component trong orders.html

- OK: `../assets/js/app.js`
- OK: `../assets/js/pages/orders.js`

### Import của orders.js
- OK: `../api/orders-api.js`
- OK: `../mocks/mock-repository.js`
- OK: `../toast.js`
- OK: `../layout.js`

## 4. Đối chiếu Sidebar giữa Dashboard và Orders

- Tham chiếu components/sidebar.html: Dashboard=true, Orders=false
- Có thẻ aside: Dashboard=true, Orders=true
- Có sidebar toggle script: Dashboard=true, Orders=false
- Có nút/selector sidebar toggle: Dashboard=true, Orders=true
- Có sidebar container: Dashboard=true, Orders=true

### Selector toggle được tìm thấy trong sidebar-toggle.js
- Dòng 2: `* Module JS dùng chung: Quản lý đóng/mở Sidebar (Desktop 248px <-> 72px & Mobile Drawer)`
- Dòng 3: `* Lưu trữ trạng thái bền vững với localStorage key "mindhub-sidebar-collapsed"`
- Dòng 6: `const STORAGE_KEY = "mindhub-sidebar-collapsed";`
- Dòng 8: `function getSidebar() {`
- Dòng 9: `return document.getElementById("admin-sidebar") || document.querySelector("[data-sidebar]");`
- Dòng 12: `function getToggleBtn() {`
- Dòng 13: `return document.getElementById("sidebar-collapse-toggle");`
- Dòng 16: `function getToggleIcon() {`
- Dòng 17: `return document.getElementById("sidebar-toggle-icon");`
- Dòng 20: `function setCollapsedState(sidebar, btn, icon, isCollapsed) {`
- Dòng 21: `if (!sidebar) return;`
- Dòng 23: `if (isCollapsed) {`
- Dòng 24: `sidebar.classList.add("sidebar-collapsed");`
- Dòng 28: `sidebar.classList.remove("sidebar-collapsed");`
- Dòng 35: `let overlay = document.getElementById("sidebar-mobile-overlay");`
- Dòng 38: `overlay.id = "sidebar-mobile-overlay";`
- Dòng 45: `function toggleMobileSidebar(open) {`
- Dòng 46: `const sidebar = getSidebar();`
- Dòng 48: `if (!sidebar) return;`
- Dòng 51: `sidebar.classList.remove("-translate-x-full");`
- Dòng 54: `sidebar.classList.add("-translate-x-full");`
- Dòng 59: `function initSidebarToggle() {`
- Dòng 60: `if (window.__mindhubSidebarInited) return;`
- Dòng 61: `window.__mindhubSidebarInited = true;`
- Dòng 63: `const sidebar = getSidebar();`
- Dòng 64: `const btn = getToggleBtn();`
- Dòng 65: `const icon = getToggleIcon();`
- Dòng 67: `if (!sidebar) return;`
- Dòng 69: `// 1. Khôi phục trạng thái thu gọn trên Desktop từ localStorage`
- Dòng 70: `const savedState = localStorage.getItem(STORAGE_KEY);`
- Dòng 71: `const isCollapsed = savedState === "true";`
- Dòng 72: `setCollapsedState(sidebar, btn, icon, isCollapsed);`
- Dòng 74: `// 2. Lắng nghe click nút Toggle Desktop giữa cạnh phải`
- Dòng 78: `const currentlyCollapsed = sidebar.classList.contains("sidebar-collapsed");`
- Dòng 79: `const nextState = !currentlyCollapsed;`
- Dòng 81: `setCollapsedState(sidebar, btn, icon, nextState);`
- Dòng 82: `localStorage.setItem(STORAGE_KEY, nextState ? "true" : "false");`
- Dòng 87: `const openBtns = document.querySelectorAll("[data-sidebar-open]");`
- Dòng 91: `toggleMobileSidebar(true);`
- Dòng 95: `const closeBtns = document.querySelectorAll("[data-sidebar-close]");`
- Dòng 99: `toggleMobileSidebar(false);`
- Dòng 105: `toggleMobileSidebar(false);`
- Dòng 110: `document.addEventListener("DOMContentLoaded", initSidebarToggle);`
- Dòng 112: `initSidebarToggle();`

## 5. Kiểm tra ID HTML và selector JavaScript

- Tổng ID trong orders.html: 77
- Tổng ID được orders.js truy cập: 35
- Tất cả ID orders.js truy cập đều tồn tại trong HTML.

## 6. Kiểm tra pipeline load và render bảng

### Khởi tạo trang
- Dòng 1599: `document.addEventListener("DOMContentLoaded", () => {`

### Gọi API danh sách
- Dòng 172: `const apiParams = {`
- Dòng 177: `if (state.status !== "all") apiParams.status = state.status;`
- Dòng 178: `if (state.payment_status !== "all") apiParams.payment_status = state.payment_status;`
- Dòng 179: `if (state.user_id !== "all") apiParams.user_id = state.user_id;`
- Dòng 180: `if (state.course_id !== "all") apiParams.course_id = state.course_id;`
- Dòng 181: `if (state.order_code.trim()) apiParams.order_code = state.order_code.trim();`
- Dòng 182: `if (state.search_text.trim() && !state.order_code.trim()) apiParams.search = state.search_text.trim();`
- Dòng 183: `if (state.date_from) apiParams.date_from = state.date_from;`
- Dòng 184: `if (state.date_to) apiParams.date_to = state.date_to;`
- Dòng 187: `const response = await getOrders(apiParams);`

### Đọc response
- Dòng 192: `!response.data.summary ||`
- Dòng 193: `!Array.isArray(response.data.items) ||`
- Dòng 194: `!response.meta`
- Dòng 200: `const meta = response.meta;`

### Render bảng và pagination
- Dòng 209: `renderTable(items);`
- Dòng 210: `renderPagination(meta);`
- Dòng 330: `function renderTable(items) {`
- Dòng 532: `function renderPagination(meta) {`

### Loading, empty và table visibility
- Dòng 142: `errorEl.classList.remove("hidden");`
- Dòng 147: `errorEl.classList.remove("hidden");`
- Dòng 152: `errorEl.classList.remove("hidden");`
- Dòng 157: `errorEl.classList.add("hidden");`
- Dòng 242: `document.getElementById("orders-tbody-skeleton")?.classList.remove("hidden");`
- Dòng 243: `document.getElementById("orders-tbody")?.classList.add("hidden");`
- Dòng 244: `document.getElementById("orders-empty-state")?.classList.add("hidden");`
- Dòng 245: `document.getElementById("orders-filter-empty-state")?.classList.add("hidden");`
- Dòng 246: `document.getElementById("orders-error-state")?.classList.add("hidden");`
- Dòng 253: `document.getElementById("orders-tbody-skeleton")?.classList.add("hidden");`
- Dòng 331: `const tbody = document.getElementById("orders-tbody");`
- Dòng 332: `const emptyState = document.getElementById("orders-empty-state");`
- Dòng 333: `const filterEmptyState = document.getElementById("orders-filter-empty-state");`
- Dòng 335: `if (!tbody) return;`
- Dòng 337: `tbody.innerHTML = "";`
- Dòng 340: `tbody.classList.add("hidden");`
- Dòng 352: `filterEmptyState?.classList.remove("hidden");`
- Dòng 353: `emptyState?.classList.add("hidden");`
- Dòng 355: `emptyState?.classList.remove("hidden");`
- Dòng 356: `filterEmptyState?.classList.add("hidden");`
- Dòng 361: `emptyState?.classList.add("hidden");`
- Dòng 362: `filterEmptyState?.classList.add("hidden");`
- Dòng 363: `tbody.classList.remove("hidden");`
- Dòng 493: `<div data-menu-dropdown class="absolute right-4 top-full mt-1 w-48 bg-paper border border-hairline rounded-[6px] shadow-lg z-50 hidden py-1 text-left">`
- Dòng 525: `tbody.appendChild(tr);`
- Dòng 747: `if (btnClear) btnClear.classList.add("hidden");`
- Dòng 767: `btnClear?.classList.remove("hidden");`
- Dòng 772: `btnClear?.classList.remove("hidden");`
- Dòng 775: `btnClear?.classList.remove("hidden");`
- Dòng 778: `btnClear?.classList.remove("hidden");`
- Dòng 781: `btnClear?.classList.add("hidden");`
- Dòng 816: `customDateContainer.classList.remove("hidden");`
- Dòng 818: `customDateContainer.classList.add("hidden");`
- Dòng 844: `document.getElementById("orders-tbody")?.classList.add("hidden");`
- Dòng 845: `document.getElementById("orders-empty-state")?.classList.add("hidden");`
- Dòng 846: `document.getElementById("orders-filter-empty-state")?.classList.add("hidden");`
- Dòng 852: `errWrapper.classList.remove("hidden");`
- Dòng 875: `dropdown.classList.add("hidden");`
- Dòng 948: `dropdown.classList.remove("hidden");`
- Dòng 950: `dropdown.classList.add("hidden");`

### Reset page khi filter
- Dòng 9: `per_page: 20,`
- Dòng 67: `state.per_page = Number(urlParams.get("per_page")) || 20;`
- Dòng 86: `if (state.per_page !== 20) urlParams.set("per_page", state.per_page);`
- Dòng 174: `per_page: state.per_page`
- Dòng 202: `if (meta && meta.current_page) {`
- Dòng 203: `state.page = meta.current_page;`
- Dòng 540: `const start = meta.total === 0 ? 0 : (meta.current_page - 1) * meta.per_page + 1;`
- Dòng 541: `const end = Math.min(meta.current_page * meta.per_page, meta.total);`
- Dòng 549: `prevBtn.disabled = meta.current_page <= 1;`
- Dòng 551: `meta.current_page <= 1 ? "opacity-40 cursor-not-allowed text-mid-gray" : "hover:bg-canvas text-ink"`
- Dòng 565: `for (let p = 1; p <= meta.last_page; p++) {`
- Dòng 569: `p === meta.current_page`
- Dòng 588: `nextBtn.disabled = meta.current_page >= meta.last_page;`
- Dòng 590: `meta.current_page >= meta.last_page ? "opacity-40 cursor-not-allowed text-mid-gray" : "hover:bg-canvas text-ink"`
- Dòng 594: `if (state.page < meta.last_page) {`
- Dòng 710: `state.page = 1;`
- Dòng 730: `state.page = 1;`
- Dòng 971: `state.page = 1;`
- Dòng 997: `state.page = 1;`
- Dòng 1007: `state.page = 1;`
- Dòng 1088: `state.page = 1;`
- Dòng 1461: `state.page = 1;`
- Dòng 1492: `state.page = 1;`
- Dòng 1504: `state.per_page = Number(e.target.value);`
- Dòng 1505: `state.page = 1;`


## 7. Kiểm tra logic tab và filter trạng thái

### Tab click
- Dòng 299: `const container = document.getElementById("status-tabs-container");`
- Dòng 1133: `tabBtn.addEventListener("click", () => {`
- Dòng 1483: `// Status quick tabs click (Lọc status chuẩn)`
- Dòng 1484: `const statusTabsContainer = document.getElementById("status-tabs-container");`

### State order status
- Dòng 68: `state.status = urlParams.get("status") || "all";`
- Dòng 87: `if (state.status !== "all") urlParams.set("status", state.status);`
- Dòng 177: `if (state.status !== "all") apiParams.status = state.status;`
- Dòng 319: `if (tabVal === state.status) {`
- Dòng 342: `state.status !== "all" ||`
- Dòng 632: `if (state.status !== "all") {`
- Dòng 640: `chips.push({ key: "status", label: `Trạng thái đơn: ${statusMap[state.status] || state.status}` });`
- Dòng 694: `if (filterKey === "status") state.status = "all";`
- Dòng 723: `state.status = "all";`
- Dòng 786: `setCustomSelectValue("select-status-wrapper", state.status, {`
- Dòng 1053: `state.status = value;`
- Dòng 1087: `state.status = filterStatus;`
- Dòng 1490: `if (newStatus !== state.status) {`
- Dòng 1491: `state.status = newStatus;`

### State payment status
- Dòng 11: `payment_status: "all",`
- Dòng 69: `state.payment_status = urlParams.get("payment_status") || "all";`
- Dòng 88: `if (state.payment_status !== "all") urlParams.set("payment_status", state.payment_status);`
- Dòng 178: `if (state.payment_status !== "all") apiParams.payment_status = state.payment_status;`
- Dòng 343: `state.payment_status !== "all" ||`
- Dòng 387: `if (item.payment_status === "paid") {`
- Dòng 389: `} else if (item.payment_status === "processing") {`
- Dòng 391: `} else if (item.payment_status === "failed") {`
- Dòng 643: `if (state.payment_status !== "all") {`
- Dòng 650: `chips.push({ key: "payment_status", label: `Thanh toán: ${pStatusMap[state.payment_status] || state.payment_status}` });`
- Dòng 695: `if (filterKey === "payment_status") state.payment_status = "all";`
- Dòng 724: `state.payment_status = "all";`
- Dòng 796: `setCustomSelectValue("select-payment-status-wrapper", state.payment_status, {`
- Dòng 1055: `state.payment_status = value;`
- Dòng 1232: `<span class="font-semibold text-ink">${order.payment_status === 'paid' ? '● Đã thanh toán' : order.payment_status === 'processing' ? '● Đang xử lý' : '● Chưa thanh toán'}</span>`
- Dòng 1346: `const isPaidOrder = order.status === "paid" || order.payment_status === "paid";`

### Hàm lọc trong orders-api.js
- Dòng 15: `* API Contract Query List: page, per_page, status, payment_status, user_id, course_id, order_code, date_from, date_to`
- Dòng 22: `throw new Error(`HTTP error! status: ${response.status}`);`
- Dòng 32: `const allPopulatedOrders = rawOrders.map(populateOrder).filter(Boolean);`
- Dòng 34: `// 1. Tính toán summary trên TOÀN BỘ dataset gốc bằng quy tắc status chuẩn`
- Dòng 44: `const st = o.status;`
- Dòng 89: `filtered = filtered.filter((o) => {`
- Dòng 103: `// Lọc theo status (raw order status)`
- Dòng 104: `if (params.status && params.status !== "" && params.status !== "all") {`
- Dòng 105: `filtered = filtered.filter((o) => o.status === params.status);`
- Dòng 108: `// Lọc theo payment_status (raw payment status)`
- Dòng 109: `if (params.payment_status && params.payment_status !== "" && params.payment_status !== "all") {`
- Dòng 110: `filtered = filtered.filter((o) => o.payment_status === params.payment_status);`
- Dòng 116: `filtered = filtered.filter((o) => Number(o.user_id) === targetUserId);`
- Dòng 122: `filtered = filtered.filter((o) => Number(o.course_id) === targetCourseId);`
- Dòng 129: `filtered = filtered.filter((o) => new Date(o.created_at) >= fromDate);`
- Dòng 135: `filtered = filtered.filter((o) => new Date(o.created_at) <= toDate);`
- Dòng 151: `const items = filtered.slice(startIndex, startIndex + perPage);`
- Dòng 181: `throw new Error(errData.message || `HTTP error! status: ${response.status}`);`
- Dòng 192: `error.status = 404;`

### Dấu hiệu mutate dataset
- Dòng 139: `filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));`


## 8. Kiểm tra tbody, table và empty state

- Table IDs: Không có ID
- Tbody IDs: `orders-tbody-skeleton`, `orders-tbody`
- Tbody `orders-tbody-skeleton` được orders.js tham chiếu: true
- Tbody `orders-tbody` được orders.js tham chiếu: true

### Empty state trong HTML
- Dòng 644: `<div id="orders-empty-state" class="hidden p-12 text-center">`
- Dòng 656: `<div id="orders-filter-empty-state" class="hidden p-12 text-center">`
- Dòng 662: `<h3 class="text-sm font-semibold text-ink">Không tìm thấy đơn hàng phù hợp với bộ lọc</h3>`

## 9. Kiểm tra dữ liệu trạng thái đơn và thanh toán

- Số object order phát hiện được: 1

### Phân bổ cặp trạng thái
- `all + all`: 1

### Cặp trạng thái không hợp lệ
- **SAI** — File `assets/js/pages/orders.js`, ID `?`, mã `?`: `all + all` — Order status không hợp lệ: all

## 10. Kiểm tra logic mở khóa học/người dùng từ drawer

### Deep link khóa học
- Dòng 13: `course_id: "all",`
- Dòng 71: `state.course_id = urlParams.get("course_id") || "all";`
- Dòng 90: `if (state.course_id !== "all") urlParams.set("course_id", state.course_id);`
- Dòng 180: `if (state.course_id !== "all") apiParams.course_id = state.course_id;`
- Dòng 345: `state.course_id !== "all" ||`
- Dòng 508: `<a href="courses.html?open_course_id=${item.course.id}" class="w-full px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2 text-ink transition-colors cursor-pointer">`
- Dòng 626: `if (state.course_id !== "all") {`
- Dòng 628: `const found = courses.find((c) => c.id === Number(state.course_id));`
- Dòng 629: `chips.push({ key: "course_id", label: `Khóa học: ${found ? found.title : state.course_id}` });`
- Dòng 700: `if (filterKey === "course_id") {`
- Dòng 701: `state.course_id = "all";`
- Dòng 726: `state.course_id = "all";`
- Dòng 752: `state.course_id = "all";`
- Dòng 768: `} else if (state.course_id !== "all") {`
- Dòng 770: `const found = courses.find((c) => c.id === Number(state.course_id));`
- Dòng 771: `searchInput.value = found ? `Khóa học: ${found.title}` : state.course_id;`
- Dòng 964: `state.course_id = String(value);`
- Dòng 985: `state.course_id = "all";`
- Dòng 1267: `<!-- 3. Khóa học (Course - Truyền chuẩn open_course_id={order.course.id}) -->`
- Dòng 1274: `${order.course ? `<a href="courses.html?open_course_id=${order.course.id}" class="text-xs font-semibold text-ink hover:underline flex items-center gap-1">Mở khóa học &rarr;</a>` : ''}`

### Deep link người dùng
- Dòng 12: `user_id: "all",`
- Dòng 70: `state.user_id = urlParams.get("user_id") || "all";`
- Dòng 89: `if (state.user_id !== "all") urlParams.set("user_id", state.user_id);`
- Dòng 179: `if (state.user_id !== "all") apiParams.user_id = state.user_id;`
- Dòng 344: `state.user_id !== "all" ||`
- Dòng 501: `<a href="users.html?open_user_id=${item.user.id}" class="w-full px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2 text-ink transition-colors cursor-pointer">`
- Dòng 620: `if (state.user_id !== "all") {`
- Dòng 622: `const found = users.find((u) => u.id === Number(state.user_id));`
- Dòng 623: `chips.push({ key: "user_id", label: `Người mua: ${found ? found.full_name : state.user_id}` });`
- Dòng 696: `if (filterKey === "user_id") {`
- Dòng 697: `state.user_id = "all";`
- Dòng 725: `state.user_id = "all";`
- Dòng 751: `state.user_id = "all";`
- Dòng 763: `if (state.user_id !== "all") {`
- Dòng 765: `const found = users.find((u) => u.id === Number(state.user_id));`
- Dòng 766: `searchInput.value = found ? `Người mua: ${found.full_name}` : state.user_id;`
- Dòng 961: `state.user_id = String(value);`
- Dòng 984: `state.user_id = "all";`
- Dòng 1255: `${order.user ? `<a href="users.html?open_user_id=${order.user.id}" class="text-xs font-semibold text-ink hover:underline flex items-center gap-1">Mở người dùng &rarr;</a>` : ''}`

### Deep link order
- Dòng 20: `open_order_id: null,`
- Dòng 77: `state.open_order_id = urlParams.get("open_order_id") || null;`
- Dòng 96: `if (state.open_order_id) urlParams.set("open_order_id", state.open_order_id);`
- Dòng 1122: `state.open_order_id = null;`
- Dòng 1158: `async function openOrderDrawer(orderId) {`
- Dòng 1166: `state.open_order_id = String(orderId);`
- Dòng 1186: `const response = await getOrder(orderId);`
- Dòng 1202: `state.open_order_id = null;`
- Dòng 1548: `openOrderDrawer(orderId);`
- Dòng 1578: `openOrderDrawer(orderId);`
- Dòng 1590: `if (orderId) openOrderDrawer(orderId);`
- Dòng 1611: `// Nếu URL có deep link open_order_id`
- Dòng 1612: `if (state.open_order_id) {`
- Dòng 1613: `openOrderDrawer(state.open_order_id);`


## 11. Kiểm tra Live Server

- HTTP 200: `http://127.0.0.1:5500/pages/orders.html`
- HTTP 200: `http://127.0.0.1:5500/pages/orders.html?status=paid`
- HTTP 200: `http://127.0.0.1:5500/assets/js/pages/orders.js`
- HTTP 200: `http://127.0.0.1:5500/assets/js/api/orders-api.js`
- HTTP 200: `http://127.0.0.1:5500/assets/js/sidebar-toggle.js`
- HTTP 200: `http://127.0.0.1:5500/components/sidebar.html`

## 12. Dấu hiệu cần chú ý

- **CẢNH BÁO:** Có 5 file JavaScript lỗi cú pháp.
- **CẢNH BÁO:** Phát hiện 1 order có status/payment_status không hợp lệ.
- **CẢNH BÁO:** Dashboard và Orders không nạp sidebar-toggle.js giống nhau.

## 13. Kết luận sử dụng báo cáo

- Nếu tab có count nhưng `response.data.items` không được đọc hoặc `renderOrdersTable(items)` không chạy: lỗi nằm ở pipeline render.
- Nếu `status=paid` nhưng code đồng thời ép `payment_status` sai: lỗi nằm ở filter kép.
- Nếu page cũ lớn hơn last_page sau lọc: phải reset page về 1 trước khi phân trang.
- Nếu empty state vẫn hiện dù items có dữ liệu: lỗi nằm ở state hiển thị hoặc selector tbody.
- Nếu Dashboard có sidebar-toggle.js nhưng Orders không có: đây là nguyên nhân nút sidebar chỉ kẹt ở trang Orders.
- Nếu có `cancelled + paid`: dữ liệu mock đang sai và cần đồng bộ lại trước khi test UI.