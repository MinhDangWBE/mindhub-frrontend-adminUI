---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 4. QUẢN LÝ KHÓA HỌC TOÀN HỆ THỐNG

```txt
Quản lý khóa học

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết khóa học
5. Ẩn / hiện khóa học
6. Đánh dấu nổi bật
7. Trạng thái rỗng
```

---

## 4.1. Tổng khóa học

```txt
COUNT(courses.id)
WHERE deleted_at IS NULL
```

---

## 4.2. Khóa đang hoàn thiện

```txt
COUNT(courses.id)
WHERE status = 'draft'
AND deleted_at IS NULL
```

UI label:

```txt
Đang hoàn thiện
```

Không hiển thị chữ `draft` cho người dùng cuối.

---

## 4.3. Khóa chờ duyệt

```txt
COUNT(courses.id)
WHERE status = 'pending_review'
AND deleted_at IS NULL
```

---

## 4.4. Khóa bị từ chối

```txt
COUNT(courses.id)
WHERE status = 'rejected'
AND deleted_at IS NULL
```

---

## 4.5. Khóa đang công khai

```txt
COUNT(courses.id)
WHERE status = 'published'
AND deleted_at IS NULL
```

---

## 4.6. Mapping trạng thái

```txt
draft          → Đang hoàn thiện
pending_review → Chờ duyệt
approved       → Đã duyệt
rejected       → Bị từ chối
published      → Đang công khai
hidden         → Đã ẩn
```

---

## 4.7. Bộ lọc

```txt
Tìm tên khóa học
Lọc giảng viên
Lọc danh mục
Lọc trạng thái
Lọc level
Lọc khoảng giá
Lọc featured
Lọc ngày tạo
```

Level:

```txt
beginner
intermediate
advanced
all_levels
```

---

## 4.8. Danh sách khóa học

Các cột:

```txt
Ảnh
Tên khóa học
Giảng viên
Danh mục
Giá gốc
Giá khuyến mãi
Trạng thái
Tổng lượt ghi danh
Doanh thu gộp
Ngày tạo
Thao tác
```

**Tổng lượt ghi danh của khóa:**

```txt
COUNT(enrollments.id)
WHERE enrollments.course_id = course_id
AND status IN ('active', 'completed')
```

**Doanh thu gộp của khóa:**

```txt
SUM(revenues.gross_amount)
WHERE revenues.course_id = course_id
AND revenues.status IN ('available', 'withdrawn')
```

---

## 4.9. Điểm đánh giá trung bình

Bảng review hiện tại là `course_reviews` và liên kết course qua `orders`.

**Công thức:**

```txt
Điểm trung bình =
AVG(course_reviews.rating)
JOIN orders ON orders.id = course_reviews.order_id
WHERE orders.course_id = course_id
AND course_reviews.deleted_at IS NULL
```

**Tổng lượt đánh giá:**

```txt
COUNT(course_reviews.id)
JOIN orders ON orders.id = course_reviews.order_id
WHERE orders.course_id = course_id
AND course_reviews.deleted_at IS NULL
```

---

## 4.10. Chi tiết khóa học

Các tab:

```txt
Tổng quan
Thông tin khóa học
Chương và bài học
Tài liệu
Học viên
Đơn hàng
Doanh thu
Đánh giá
Thông tin kiểm duyệt
```

Không cho admin sửa nội dung bài học thay giảng viên nếu chưa có nghiệp vụ.

---

## 4.11. Ẩn khóa học

Admin bấm:

```txt
Ẩn khóa học
```

FE mở modal xác nhận.

Sau thành công:

```txt
status = hidden
```

Không hard delete khóa đã có enrollment hoặc revenue.

---

## API FE sử dụng

```txt
GET /api/admin/courses
GET /api/admin/courses/{id}
PATCH /api/admin/courses/{id}
```

---