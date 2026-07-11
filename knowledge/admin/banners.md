---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 13. QUẢN LÝ BANNER / TRANG CHỦ

```txt
Banner / Trang chủ

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Tạo banner
5. Cập nhật
6. Bật / tắt
7. Xóa mềm
8. Trạng thái rỗng
```

---

## 13.1. Tổng banner

```txt
COUNT(banners.id)
WHERE deleted_at IS NULL
```

---

## 13.2. Banner active trong DB

```txt
COUNT(banners.id)
WHERE status = 'active'
AND deleted_at IS NULL
```

---

## 13.3. Banner đang hiển thị thực tế

**Công thức:**

```txt
status = 'active'
AND (start_at IS NULL OR start_at <= now)
AND (end_at IS NULL OR end_at >= now)
AND deleted_at IS NULL
```

---

## 13.4. Banner sắp hiển thị

```txt
status = 'active'
AND start_at > now
AND deleted_at IS NULL
```

Đây là effective label, không phải status DB mới.

---

## 13.5. Banner đã hết thời gian

```txt
end_at IS NOT NULL
AND end_at < now
AND deleted_at IS NULL
```

---

## 13.6. Mapping trạng thái

Status DB:

```txt
active
inactive
```

UI có thể hiển thị effective label:

```txt
Đang hiển thị
Sắp hiển thị
Đã kết thúc
Đã tắt
```

Không gửi `scheduled` hoặc `expired` về BE.

---

## 13.7. Danh sách

Các cột:

```txt
Ảnh
Tiêu đề
Vị trí
Target URL
Thứ tự
Thời gian bắt đầu
Thời gian kết thúc
Trạng thái hiệu lực
Thao tác
```

---

## 13.8. Form banner

```txt
Tiêu đề
Ảnh
Target URL
Position
Sort order
Start at
End at
Status
```

Validation FE:

```txt
Title bắt buộc
Image bắt buộc
end_at >= start_at
sort_order >= 0
```

BE vẫn validate lại.

---

## API FE sử dụng

```txt
GET/POST /api/admin/banners
GET/PUT/PATCH/DELETE /api/admin/banners/{id}
```

---