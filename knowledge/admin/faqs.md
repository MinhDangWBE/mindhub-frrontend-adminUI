---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 14. QUẢN LÝ FAQ

```txt
Quản lý FAQ

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Tạo FAQ
5. Cập nhật FAQ
6. Gắn FAQ với khóa học
7. Ẩn / hiện
8. Xóa mềm
```

---

## 14.1. Tổng FAQ

```txt
COUNT(faqs.id)
WHERE deleted_at IS NULL
```

---

## 14.2. FAQ đang hiển thị

```txt
COUNT(faqs.id)
WHERE status = 'active'
AND deleted_at IS NULL
```

---

## 14.3. FAQ đang ẩn

```txt
COUNT(faqs.id)
WHERE status = 'inactive'
AND deleted_at IS NULL
```

---

## 14.4. Số khóa học sử dụng FAQ

```txt
COUNT(DISTINCT course_faqs.course_id)
WHERE course_faqs.faq_id = faq_id
```

---

## 14.5. Bộ lọc

```txt
Tìm câu hỏi
Type
Status
Khóa học liên quan
```

Status:

```txt
active
inactive
```

`type` là chuỗi do code kiểm soát, không phải enum DB cố định.

FE nên lấy options từ BE hoặc config chung, không tự thêm loại tùy ý.

---

## 14.6. Danh sách

Các cột:

```txt
Câu hỏi
Type
Số khóa sử dụng
Thứ tự
Trạng thái
Ngày tạo
Thao tác
```

---

## 14.7. Form FAQ

```txt
Question
Answer
Type
Status
Sort order
Danh sách khóa học áp dụng
```

---

## API cần bổ sung

```txt
GET /api/admin/faqs
POST /api/admin/faqs
GET /api/admin/faqs/{id}
PATCH /api/admin/faqs/{id}
DELETE /api/admin/faqs/{id}
PATCH /api/admin/faqs/{id}/courses
```

---