# FE CURRENT STATE AUDIT

- Thời điểm: 2026-07-16 08:37:08
- FE root: `D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin`
- Git branch: `main`
- Tổng file đã quét: **163**
- Tổng trang tìm thấy: **16**
- File Git đang thay đổi: **2**
- Tham chiếu API tìm thấy: **4**
- API V2 được tham chiếu: **6/57**
- API ngoài danh sách V2: **0**
- Marker mock: **170**
- Source snapshot: **True**

## 1. File hiện đang thay đổi theo Git

- `audit-fe-current-state-fixed.ps1`
- `FE_CURRENT_STATE_AUDIT_20260716_083422/`

## 2. Endpoint V2 chưa thấy FE tham chiếu trực tiếp

Lưu ý: endpoint có thể được tạo động hoặc đi qua wrapper nên cần kiểm tra thêm file `06_API_USAGE.csv`.

- `GET /api/admin/dashboard` — ADM-01 Dashboard
- `GET /api/admin/users/{id}` — ADM-02 Users
- `PATCH /api/admin/users/{id}` — ADM-02 Users
- `DELETE /api/admin/users/{id}` — ADM-02 Users
- `GET /api/admin/instructor-upgrade-requests/{id}` — ADM-03 Instructor upgrades
- `PATCH /api/admin/instructor-upgrade-requests/{id}/approve` — ADM-03 Instructor upgrades
- `PATCH /api/admin/instructor-upgrade-requests/{id}/reject` — ADM-03 Instructor upgrades
- `GET /api/admin/courses/{id}` — ADM-04 Courses
- `PATCH /api/admin/courses/{id}` — ADM-04 Courses
- `GET /api/admin/course-reviews` — ADM-05 Course reviews
- `GET /api/admin/course-reviews/{id}` — ADM-05 Course reviews
- `PATCH /api/admin/courses/{id}/approve` — ADM-05 Course reviews
- `PATCH /api/admin/courses/{id}/reject` — ADM-05 Course reviews
- `GET /api/admin/categories/{id}` — ADM-06 Categories
- `PATCH /api/admin/categories/{id}` — ADM-06 Categories
- `DELETE /api/admin/categories/{id}` — ADM-06 Categories
- `GET /api/admin/orders` — ADM-07 Orders
- `GET /api/admin/orders/{id}` — ADM-07 Orders
- `GET /api/admin/revenues` — ADM-08 Revenues
- `GET /api/admin/revenues/{id}` — ADM-08 Revenues
- `GET /api/admin/withdrawals` — ADM-09 Withdrawals
- `GET /api/admin/withdrawals/{id}` — ADM-09 Withdrawals
- `PATCH /api/admin/withdrawals/{id}/approve` — ADM-09 Withdrawals
- `PATCH /api/admin/withdrawals/{id}/reject` — ADM-09 Withdrawals
- `PATCH /api/admin/withdrawals/{id}/mark-paid` — ADM-09 Withdrawals
- `GET /api/admin/payout-accounts` — ADM-10 Payout accounts
- `GET /api/admin/payout-accounts/{id}` — ADM-10 Payout accounts
- `PATCH /api/admin/payout-accounts/{id}/approve` — ADM-10 Payout accounts
- `PATCH /api/admin/payout-accounts/{id}/reject` — ADM-10 Payout accounts
- `PATCH /api/admin/payout-accounts/{id}/disable` — ADM-10 Payout accounts
- `GET /api/admin/moderation/items` — ADM-11 Moderation
- `GET /api/admin/moderation/items/{id}/{id}` — ADM-11 Moderation
- `PATCH /api/admin/moderation/items/{id}` — ADM-11 Moderation
- `GET /api/admin/reports/revenue` — ADM-12 Reports
- `GET /api/admin/reports/top-courses` — ADM-12 Reports
- `GET /api/admin/reports/instructors` — ADM-12 Reports
- `GET /api/admin/banners` — ADM-13 Banners
- `POST /api/admin/banners` — ADM-13 Banners
- `GET /api/admin/banners/{id}` — ADM-13 Banners
- `PATCH /api/admin/banners/{id}` — ADM-13 Banners
- `DELETE /api/admin/banners/{id}` — ADM-13 Banners
- `GET /api/admin/faqs` — ADM-14 FAQs
- `POST /api/admin/faqs` — ADM-14 FAQs
- `GET /api/admin/faqs/{id}` — ADM-14 FAQs
- `PATCH /api/admin/faqs/{id}` — ADM-14 FAQs
- `DELETE /api/admin/faqs/{id}` — ADM-14 FAQs
- `PATCH /api/admin/faqs/{id}/courses` — ADM-14 FAQs
- `GET /api/admin/notifications` — SYS-01 Notifications
- `GET /api/admin/notifications/unread-count` — SYS-01 Notifications
- `PATCH /api/admin/notifications/{id}/read` — SYS-01 Notifications
- `PATCH /api/admin/notifications/read-all` — SYS-01 Notifications

## 3. Endpoint đang dùng nhưng nằm ngoài API Contract V2

- Không phát hiện endpoint ngoài danh sách V2.

## 4. File còn dấu hiệu dùng mock/localStorage

- `.design-backup/colors-only-20260713-222236/assets/js/pages/dashboard.js`
- `.design-backup/refine-seline-admin-20260713-222851/assets/js/pages/dashboard.js`
- `.design-backup/refine-seline-admin-20260713-222851/pages/dashboard.html`
- `assets/js/api/categories-api.js`
- `assets/js/api/course-reviews-api.js`
- `assets/js/api/courses-api.js`
- `assets/js/api/instructor-upgrades-api.js`
- `assets/js/api/users-api.js`
- `assets/js/mocks/course-reviews-mock.js`
- `assets/js/mocks/courses-mock.js`
- `assets/js/mocks/instructor-upgrades-mock.js`
- `assets/js/mocks/mock-database.js`
- `assets/js/mocks/mock-repository.js`
- `assets/js/pages/course-reviews.js`
- `assets/js/pages/courses.js`
- `assets/js/pages/dashboard.js`
- `assets/js/pages/instructor-upgrades.js`
- `assets/js/sidebar-toggle.js`
- `data/dashboard.js`
- `data/instructor-upgrades.js`
- `data/users.js`
- `pages/course-reviews.html`
- `pages/courses.html`
- `pages/dashboard.html`
- `pages/instructor-upgrades.html`
- `scripts/validate-mock-data.cjs`

## 5. File quan trọng trong gói báo cáo

- `01_GIT_STATE.txt`: branch, trạng thái Git, commit gần nhất.
- `02_CURRENT_DIFF.patch`: code khác với HEAD hiện tại.
- `03_CHANGED_FILES.txt`: danh sách file thay đổi.
- `04_FILE_INVENTORY.csv`: toàn bộ file FE được quét.
- `05_PAGE_INVENTORY.csv`: danh sách trang và script gắn kèm.
- `06_API_USAGE.csv`: API FE đang tham chiếu, vị trí và context.
- `07_MOCK_USAGE.csv`: mock, fallback, localStorage.
- `08_FIELD_USAGE.csv`: field FE đang đọc theo từng file.
- `09_UI_CONTROLS.csv`: input, select, button, form.
- `10_STORAGE_USAGE.csv`: key localStorage/sessionStorage.
- `11_EXPECTED_API_COVERAGE.csv`: đối chiếu endpoint V2.
- `12_API_OUTSIDE_V2.csv`: endpoint ngoài contract.
- `source-snapshot/`: source an toàn để audit, nếu bật tùy chọn.

## 6. Cách dùng gói này để viết tài liệu BE

Đối chiếu theo thứ tự:

1. `05_PAGE_INVENTORY.csv` để xác định trang thật đang tồn tại.
2. `09_UI_CONTROLS.csv` để xác định filter, form và action mới của giao diện.
3. `06_API_USAGE.csv` để xác định API đã được chuẩn bị hoặc đang gọi.
4. `08_FIELD_USAGE.csv` để xác định field response FE thực sự đọc.
5. `07_MOCK_USAGE.csv` để tìm chức năng mới chỉ tồn tại ở mock.
6. `02_CURRENT_DIFF.patch` để nhận ra cải tiến mới chưa có trong tài liệu FE V2.
7. `11_EXPECTED_API_COVERAGE.csv` và `12_API_OUTSIDE_V2.csv` để chốt API cần thêm, sửa hoặc bỏ.

## 7. Cảnh báo bảo mật

Script không thu thập `.env`, `node_modules`, `.git`, `dist`, `build` hoặc file cache. Trước khi gửi gói ZIP, vẫn nên kiểm tra nhanh để chắc chắn không có token, mật khẩu hoặc dữ liệu thật.
