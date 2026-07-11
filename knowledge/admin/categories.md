---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 6. QUẢN LÝ DANH MỤC

```txt
Quản lý danh mục

1. Tổng quan
2. Cây danh mục
3. Bộ lọc
4. Danh sách
5. Tạo mới
6. Cập nhật
7. Ẩn / hiện
8. Xóa mềm
```

---

## 6.1. Tổng danh mục

```txt
COUNT(categories.id)
WHERE deleted_at IS NULL
```

---

## 6.2. Danh mục đang hiển thị

```txt
COUNT(categories.id)
WHERE status = 'active'
AND deleted_at IS NULL
```

---

## 6.3. Danh mục đang ẩn

```txt
COUNT(categories.id)
WHERE status = 'inactive'
AND deleted_at IS NULL
```

---

## 6.4. Danh mục gốc

```txt
COUNT(categories.id)
WHERE parent_id IS NULL
AND deleted_at IS NULL
```

---

## 6.5. Số khóa học thuộc danh mục

```txt
Số khóa học =
COUNT(DISTINCT course_categories.course_id)
JOIN courses ON courses.id = course_categories.course_id
WHERE course_categories.category_id = category_id
AND courses.deleted_at IS NULL
```

---

## 6.6. Cây danh mục

FE hiển thị:

```txt
Danh mục gốc
└── Danh mục con
    └── Danh mục con cấp tiếp theo nếu có
```

Không cho chọn chính danh mục đang sửa làm parent.

Không cho tạo vòng lặp cha-con.

---

## 6.7. Form danh mục

```txt
Tên danh mục
Slug
Mô tả
Danh mục cha
Thứ tự hiển thị
Trạng thái
```

Status:

```txt
active   → Đang hiển thị
inactive → Đang ẩn
```

---

## 6.8. Xóa danh mục

FE hiển thị cảnh báo nếu danh mục:

```txt
Có danh mục con
Có khóa học đang sử dụng
```

Quyết định cho xóa hay không do BE.

---

## API FE sử dụng

```txt
GET /api/admin/categories
POST /api/admin/categories
GET /api/admin/categories/{id}
PUT/PATCH /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

---