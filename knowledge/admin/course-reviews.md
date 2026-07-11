---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 5. KIỂM DUYỆT KHÓA HỌC

```txt
Kiểm duyệt khóa học

1. Tổng quan
2. Danh sách chờ duyệt
3. Bộ lọc
4. Chi tiết kiểm duyệt
5. Duyệt khóa học
6. Từ chối khóa học
7. Trạng thái rỗng
```

---

## 5.1. Khóa đang chờ duyệt

```txt
COUNT(courses.id)
WHERE status = 'pending_review'
AND deleted_at IS NULL
```

---

## 5.2. Danh sách chờ duyệt

Các cột:

```txt
Khóa học
Giảng viên
Danh mục
Ngày tạo
Ngày cập nhật gần nhất
Mức độ hoàn thiện
Thao tác
```

Nếu DB chưa có `submitted_at`, FE không được gọi `created_at` là “Ngày gửi duyệt”.

Nên hiển thị:

```txt
Ngày cập nhật
```

cho đến khi BE có mốc gửi duyệt rõ ràng.

---

## 5.3. Checklist hoàn thiện

**Công thức:**

```txt
Tỷ lệ hoàn thiện =
Số tiêu chí bắt buộc đã đạt
/
Tổng tiêu chí bắt buộc
× 100
```

Ví dụ tiêu chí:

```txt
Có tiêu đề
Có mô tả
Có thumbnail
Có giá
Có danh mục
Có yêu cầu đầu vào
Có kết quả đầu ra
Có ít nhất một chương
Có ít nhất một bài học
```

Checklist phải do BE trả.

FE không tự quyết định khóa đủ điều kiện duyệt chỉ dựa vào giao diện.

---

## 5.4. Nội dung kiểm duyệt

Hiển thị:

```txt
Thông tin cơ bản
Thumbnail
Video giới thiệu
Giá bán
Danh mục
Level
Ngôn ngữ
Yêu cầu đầu vào
Kết quả đầu ra
Danh sách chương
Danh sách bài học
Tài liệu
Checklist
```

---

## 5.5. Duyệt khóa học

**Tương tác:**

```txt
Bấm Duyệt
→ modal xác nhận
→ gọi approve API
→ refresh dữ liệu
```

FE hiển thị status đúng theo response BE.

Không tự giả định approve luôn bằng published nếu BE trả `approved`.

---

## 5.6. Từ chối khóa học

Bắt buộc nhập:

```txt
Lý do từ chối
```

Sau thành công:

```txt
status = rejected
admin_reject_reason = nội dung do admin nhập
```

---

## API FE sử dụng

```txt
GET /api/admin/course-reviews
PATCH /api/admin/courses/{courseId}/approve
PATCH /api/admin/courses/{courseId}/reject
GET /api/admin/courses/{id}
```

---