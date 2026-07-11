---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 11. KIỂM DUYỆT BÌNH LUẬN / ĐÁNH GIÁ

```txt
Kiểm duyệt bình luận / Đánh giá

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết
5. Ẩn bình luận
6. Khôi phục bình luận
7. Ẩn đánh giá
8. Trạng thái rỗng
```

---

## 11.1. Tổng bình luận

```txt
COUNT(comments.id)
```

Nếu muốn chỉ tính dữ liệu chưa deleted logic:

```txt
WHERE comments.status != 'deleted'
```

---

## 11.2. Bình luận đang hiển thị

```txt
COUNT(comments.id)
WHERE status = 'visible'
```

---

## 11.3. Bình luận đã ẩn

```txt
COUNT(comments.id)
WHERE status = 'hidden'
```

---

## 11.4. Bình luận đã xóa logic

```txt
COUNT(comments.id)
WHERE status = 'deleted'
```

Status DB của comment:

```txt
visible
hidden
deleted
```

---

## 11.5. Tổng đánh giá

```txt
COUNT(course_reviews.id)
WHERE course_reviews.deleted_at IS NULL
```

Bảng `course_reviews` không có cột status.

FE không được gửi:

```txt
status=hidden
```

cho review nếu BE không định nghĩa effective field.

Việc ẩn review có thể được BE xử lý bằng soft delete.

---

## 11.6. Điểm đánh giá trung bình toàn hệ thống

```txt
AVG(course_reviews.rating)
WHERE deleted_at IS NULL
```

---

## 11.7. Bộ lọc

```txt
Loại nội dung: comment/review
Người đăng
Khóa học
Bài học
Trạng thái comment
Rating
Từ khóa nội dung
Khoảng thời gian
```

---

## 11.8. Danh sách bình luận

Các cột:

```txt
Người đăng
Nội dung
Comment gốc / reply
Khóa học
Bài học
Trạng thái
Ngày đăng
Thao tác
```

---

## 11.9. Danh sách đánh giá

Các cột:

```txt
Người đánh giá
Khóa học
Rating
Nội dung
Ngày đánh giá
Thao tác
```

User và course được lấy qua:

```txt
course_reviews.order_id
→ orders.user_id
→ orders.course_id
```

---

## 11.10. Chi tiết

Hiển thị:

```txt
Người đăng
Nội dung đầy đủ
Khóa học
Bài học
Comment cha
Danh sách reply
Order chứng minh đã mua nếu là review
Rating
Ngày tạo
```

---

## API FE sử dụng

### API hiện có

```txt
PATCH /api/admin/moderation/items/{id}
```

API cần trả hoặc nhận rõ loại đối tượng:

```txt
item_type=comment
item_type=review
```

Nếu không, FE không thể biết cùng một id thuộc bảng nào.

Có thể cần bổ sung:

```txt
GET /api/admin/moderation/items
GET /api/admin/moderation/items/{type}/{id}
```

---