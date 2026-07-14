# COURSE REVIEW DEBUG REPORT

- Thời điểm: 2026-07-14 15:58:53
- FE root: `D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin`
- Course ID cần mở: `1010`
- URL kiểm tra: `http://127.0.0.1:5500/pages/course-reviews.html?review_date_preset=all&open_course_id=1010`

## 1. Kiểm tra file bắt buộc

- OK: `pages\course-reviews.html` — 55482 bytes
- OK: `pages\courses.html` — 66465 bytes
- OK: `assets\js\pages\course-reviews.js` — 61564 bytes
- OK: `assets\js\pages\courses.js` — 83976 bytes
- OK: `assets\js\pages\users.js` — 66664 bytes
- OK: `assets\js\api\course-reviews-api.js` — 3931 bytes
- OK: `assets\js\api\courses-api.js` — 12890 bytes
- OK: `assets\js\mocks\course-reviews-mock.js` — 62981 bytes
- OK: `assets\js\mocks\courses-mock.js` — 36897 bytes
- OK: `assets\js\core\config.js` — 85 bytes
- THIẾU: `assets\js\core\query-state.js`
- OK: `assets\js\core\table-row-click.js` — 3200 bytes

### File liên quan được phát hiện
- `assets\js\api\course-reviews-api.js`
- `assets\js\core\table-row-click.js`
- `assets\js\mocks\course-reviews-mock.js`
- `assets\js\mocks\courses-mock.js`
- `assets\js\mocks\instructor-upgrades-mock.js`
- `assets\js\pages\course-reviews.js`

## 2. Kiểm tra cú pháp JavaScript


## 4. Kiểm tra import của page JavaScript

### course-reviews.js
- OK: `../api/course-reviews-api.js`
- OK: `../mocks/course-reviews-mock.js`
- OK: `../toast.js`
- OK: `../core/table-row-click.js`

### courses.js
- OK: `../api/courses-api.js`
- OK: `../toast.js`
- OK: `../core/table-row-click.js`
- OK: `../modal.js`


## 5. Kiểm tra logic course-reviews.js

### Khởi tạo trang
- Dòng 36: `document.addEventListener("DOMContentLoaded", () => {`

### Đọc deep link open_course_id
- KHÔNG TÌM THẤY: `open_course_id|openCourseId`

### Gọi API/detail khóa học
- Dòng 7: `getCourseReviews,`
- Dòng 8: `getCourseReview,`
- Dòng 12: `import { getCourseReviewSubmittedDate } from "../mocks/course-reviews-mock.js";`
- Dòng 466: `const d = getCourseReviewSubmittedDate(i);`
- Dòng 473: `const createdDate = getCourseReviewSubmittedDate(i);`
- Dòng 656: `<img src="${item.thumbnail_url || ""}" alt="Thumbnail" class="w-12 h-8 rounded-[4px] object-cover border border-hairline shrink-0 cursor-pointer btn-open-drawer" data-course-id="${item.id}" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80'">`
- Dòng 658: `<h4 class="font-bold text-ink hover:text-mid-gray transition-colors cursor-pointer text-xs truncate max-w-[210px] btn-open-drawer" data-course-id="${item.id}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>`
- Dòng 709: `<button type="button" class="btn-open-drawer p-1.5 rounded-[4px] hover:bg-canvas text-mid-gray hover:text-ink transition-colors cursor-pointer" data-course-id="${item.id}" data-no-row-click="true" title="Xem chi tiết kiểm duyệt">`
- Dòng 726: `tbody.querySelectorAll(".btn-open-drawer").forEach((btn) => {`
- Dòng 729: `if (id) openDrawer(id);`
- Dòng 754: `openDrawer(id);`
- Dòng 1031: `async function openDrawer(courseId) {`
- Dòng 1052: `const res = await getCourseReview(courseId);`

### Đọc response đúng contract
- KHÔNG TÌM THẤY: `data\.summary|data\.items|response\.meta`

### Bộ lọc thời gian
- Dòng 12: `import { getCourseReviewSubmittedDate } from "../mocks/course-reviews-mock.js";`
- Dòng 76: `const datePresetSelect = document.getElementById("filter-date-preset");`
- Dòng 79: `if (datePresetSelect) {`
- Dòng 80: `datePresetSelect.addEventListener("change", (e) => {`
- Dòng 110: `if (datePresetSelect) pageState.date_preset = datePresetSelect.value;`
- Dòng 187: `params.get("review_date_preset") || params.get("date_preset");`
- Dòng 209: `const datePresetSelect = document.getElementById("filter-date-preset");`
- Dòng 210: `if (datePresetSelect) {`
- Dòng 211: `datePresetSelect.value = pageState.date_preset;`
- Dòng 212: `datePresetSelect.value = datePresetSelect.value;`
- Dòng 243: `url.searchParams.set("review_date_preset", pageState.date_preset);`
- Dòng 348: `const datePresetSelect = document.getElementById("filter-date-preset");`
- Dòng 349: `if (datePresetSelect) {`
- Dòng 350: `datePresetSelect.value = "last_30_days";`
- Dòng 351: `datePresetSelect.value = datePresetSelect.value;`
- Dòng 374: `const datePresetSelect = document.getElementById("filter-date-preset");`
- Dòng 375: `if (datePresetSelect) {`
- Dòng 376: `datePresetSelect.value = "all";`
- Dòng 377: `datePresetSelect.value = datePresetSelect.value;`
- Dòng 411: `const datePresetSelect = document.getElementById("filter-date-preset");`

### Cấu hình mock
- Dòng 12: `import { getCourseReviewSubmittedDate } from "../mocks/course-reviews-mock.js";`


## 6. Kiểm tra logic courses → course-reviews

### Điều hướng sang course-reviews
- Dòng 859: `const hasReviewsPage = true; // course-reviews.html`
- Dòng 868: `window.location.href = `course-reviews.html?id=${c.id}`;`
- Dòng 1886: `window.location.href = `course-reviews.html?id=${course.id}`;`
- Dòng 2286: `window.location.href = `course-reviews.html?id=${course.id}`;`

### Kiểm tra pending_review
- Dòng 381: `updateText("kpi-pending-courses", summary.pending_review_courses);`
- Dòng 425: `pending_review: summary.pending_review_courses,`
- Dòng 677: `case "pending_review":`
- Dòng 871: `c.status !== "pending_review",`
- Dòng 1088: `pending_review: "Chờ duyệt",`
- Dòng 1419: `pageState.status = "pending_review";`
- Dòng 1420: `document.getElementById("filter-status").value = "pending_review";`
- Dòng 1728: `case "pending_review":`
- Dòng 1889: `course.status !== "pending_review",`
- Dòng 2077: `case "pending_review":`
- Dòng 2281: `} else if (course.status === "pending_review") {`

### Row click và drawer
- Dòng 3: `import { enableTableRowClick } from "../core/table-row-click.js";`
- Dòng 509: `tr.setAttribute("data-course-row", "true");`
- Dòng 510: `tr.setAttribute("data-course-id", c.id);`
- Dòng 919: `rowSelector: "[data-course-row]",`
- Dòng 920: `idAttribute: "data-course-id",`
- Dòng 937: ``#courses-table-body tr[data-course-id="${courseId}"]`,`


## 7. Kiểm tra dữ liệu mock

### assets\js\mocks\course-reviews-mock.js
- Số lần xuất hiện `pending_review`: 12
- Có ID `1010`: True
- Có đủ field summary: True
- Số ngày ISO phát hiện được: 0

- Courses mock `assets\js\mocks\courses-mock.js` có ID `1010`: True

## 8. Kiểm tra Live Server

- HTTP 200: `http://127.0.0.1:5500/pages/course-reviews.html?review_date_preset=all&open_course_id=1010`
- HTTP 200: `http://127.0.0.1:5500/pages/courses.html`
- HTTP 200: `http://127.0.0.1:5500/assets/js/pages/course-reviews.js` — 61564 bytes
- HTTP 200: `http://127.0.0.1:5500/assets/js/pages/courses.js` — 83976 bytes
- HTTP 200: `http://127.0.0.1:5500/assets/js/pages/users.js` — 66664 bytes
- HTTP 200: `http://127.0.0.1:5500/assets/js/api/course-reviews-api.js` — 3931 bytes
- HTTP 200: `http://127.0.0.1:5500/assets/js/mocks/course-reviews-mock.js` — 62981 bytes

## 9. Kiểm tra nhanh users.js

- Dấu `{`: 331
- Dấu `}`: 331
- Chênh lệch: 0
- Dòng 1482: `renderDrawerActions(user);`
- Dòng 1506: `function renderDrawerActions(user) {`
- Dòng 1539: `const deleteBtn = document.createElement("button");`
- Dòng 1540: `deleteBtn.type = "button";`
- Dòng 1541: `deleteBtn.className = "px-4 py-1.5 text-xs font-semibold rounded-full bg-red-50 text-danger-brick border border-danger-brick/10 hover:bg-danger-brick/10 transition-colors cursor-pointer";`
- Dòng 1542: `deleteBtn.textContent = "Xóa";`
- Dòng 1543: `deleteBtn.addEventListener("click", () => handleUserAction("delete", user));`
- Dòng 1544: `container.appendChild(deleteBtn);`

## 10. Dấu hiệu cần chú ý

- NGHIÊM TRỌNG: course-reviews.js chưa đọc `open_course_id`.
- NGHIÊM TRỌNG: chưa thấy code đọc `response.data.items`.
- NGHIÊM TRỌNG: chưa thấy code đọc `response.data.summary`.

## Kết thúc

Không có source nào được chỉnh sửa. Báo cáo chỉ dùng để xác định nguyên nhân trước khi viết prompt sửa.
