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
- Màu sắc sử dụng:
  - Hoạt động/Đã xuất bản/Đã duyệt/Thành công: xanh lá (`--color-success`, `--color-success-soft`)
  - Chờ duyệt/Cảnh báo: hổ phách/amber (`--color-warning`, `--color-warning-soft`)
  - Bị từ chối/Bị khóa/Thất bại/Lỗi: đỏ gạch (`--color-danger-brick`, `--color-danger-brick-soft`)
  - Nháp/Đã ẩn/Trung tính: xám (`--color-mid-gray`, bg-canvas)

## Table

- Header rõ ràng.
- Có hover row.
- Có empty state.
- Action ở cột cuối.
- Có overflow ngang trên màn hình nhỏ.

## Toast

- Hiển thị ở góc trên bên phải (cách lề 16px trên desktop).
- Mobile hiển thị gần full width (margin 16px).
- Chiều rộng tối đa 328px.
- Bo góc 6px (nhỏ gọn), viền mảnh hairline theo màu của trạng thái.
- Tự đóng sau 3.5s, hover tạm dừng tự đóng.
- Có icon chỉ báo trạng thái, tiêu đề (font-bold) và nội dung (10px).
- Tối đa hiển thị 3 Toast cùng lúc.
- Nền trắng, không dùng nền đen cho tất cả Toast.
- Màu sắc:
  - success: xanh lá
  - error: đỏ gạch
  - warning: amber
  - info: màu trung tính/xám/đen