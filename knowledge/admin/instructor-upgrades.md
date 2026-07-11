---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 3. YÊU CẦU NÂNG CẤP GIẢNG VIÊN

```txt
Yêu cầu nâng cấp giảng viên

1. Tổng quan yêu cầu
2. Bộ lọc
3. Danh sách yêu cầu
4. Chi tiết yêu cầu
5. Duyệt yêu cầu
6. Từ chối yêu cầu
7. Trạng thái rỗng
```

> Lưu ý: ERD SQL hiện tại không có bảng `instructor_upgrade_requests` riêng. FE phải lấy cấu trúc và status đúng từ API hiện tại, không tự suy luận bằng `users.role`.

---

## 3.1. Tổng yêu cầu

**Công thức giao diện:**

```txt
Tổng yêu cầu =
summary.total do API trả về
```

Nếu API trả danh sách không phân trang toàn bộ, BE có thể tính:

```txt
COUNT(các hồ sơ nâng cấp)
```

FE không cộng số item của trang hiện tại.

---

## 3.2. Yêu cầu chờ xử lý

**Công thức:**

```txt
Yêu cầu chờ xử lý =
COUNT(yêu cầu có status = pending)
```

Status chính xác phải theo response BE.

---

## 3.3. Đã duyệt

```txt
COUNT(yêu cầu có status = approved)
```

---

## 3.4. Bị từ chối

```txt
COUNT(yêu cầu có status = rejected)
```

---

## 3.5. Bộ lọc

```txt
Tìm người gửi
Tìm email
Lọc trạng thái
Lọc ngày gửi
```

---

## 3.6. Danh sách

Các cột:

```txt
Người gửi
Email
Chuyên môn
Kinh nghiệm
Trạng thái
Ngày gửi
Ngày xử lý
Thao tác
```

---

## 3.7. Chi tiết yêu cầu

Hiển thị:

```txt
Thông tin tài khoản
Bio
Expertise
Experience years
Level
Nội dung hồ sơ nâng cấp do API trả về
Trạng thái hiện tại
Lý do từ chối nếu có
```

---

## 3.8. Duyệt yêu cầu

**Tương tác:**

```txt
Bấm Duyệt
→ mở modal xác nhận
→ gọi API approve
→ thành công: cập nhật role/status theo BE
→ refresh danh sách và summary
```

FE không tự sửa `users.role` trước khi API thành công.

---

## 3.9. Từ chối yêu cầu

Bắt buộc nhập:

```txt
Lý do từ chối
```

Nếu BE trả validation 422, hiển thị lỗi tại textarea.

---

## API FE sử dụng

```txt
GET /api/admin/instructor-upgrade-requests
GET /api/admin/instructor-upgrade-requests/{userId}
PATCH /api/admin/instructor-upgrade-requests/{userId}/approve
PATCH /api/admin/instructor-upgrade-requests/{userId}/reject
```

---