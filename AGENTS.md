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