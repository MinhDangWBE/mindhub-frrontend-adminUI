# Revenue Mock Sync Patch

## File được sửa

- `assets/js/mocks/mock-repository.js`
- `assets/js/api/revenues-api.js`
- `assets/js/pages/revenues.js`

## Mục tiêu

- Dùng `MOCK_DB.revenues` làm nguồn doanh thu chuẩn.
- Liên kết doanh thu bằng `order_id`, `course_id`, `instructor_id`.
- Hydrate dữ liệu từ `MOCK_DB.orders`, `MOCK_DB.courses`, `MOCK_DB.users`.
- Tự migrate dữ liệu revenue cũ trong localStorage nếu ID không còn hợp lệ.
- Tính `instructor_rate`, `platform_rate`, `amount_consistent` khi dữ liệu gốc chưa có.
- Nút đơn hàng dùng `orders.html?open_order_id=<id>`.
- Nút khóa học dùng `courses.html?open_course_id=<id>`.
- Nút giảng viên dùng `users.html?open_user_id=<id>`.

## Áp dụng

Giải nén và chép đè đúng cấu trúc thư mục dự án.

Sau đó chạy:

```powershell
Set-Location -LiteralPath "D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin"
npm run build:css
```

Mở DevTools Console tại `127.0.0.1:5500` và chạy một lần:

```js
localStorage.removeItem("mindhub_admin_mock_db");
location.reload();
```

Việc xóa key này chỉ reset database mock của dự án để nạp lại dữ liệu chuẩn từ `mock-database.js`.

## Kiểm tra

1. Mở `pages/revenues.html`.
2. Mở revenue `#REV-5001`.
3. Phải thấy đơn `ORD-2026-0001`.
4. Phải thấy khóa học `Laravel REST API từ cơ bản đến thực chiến`.
5. Phải thấy giảng viên `Trần Thị Dạy`.
6. Bấm đơn hàng phải mở `orders.html?open_order_id=3001` và tự mở đúng drawer.
7. Tỷ lệ phải hiển thị `70% / 30%`, không còn `undefined%`.
