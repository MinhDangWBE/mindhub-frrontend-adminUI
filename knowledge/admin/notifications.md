---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 15. THÔNG BÁO ADMIN

```txt
Thông báo Admin

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết
5. Đánh dấu đã đọc
6. Đánh dấu tất cả đã đọc
```

---

## 15.1. Tổng thông báo

```txt
COUNT(notifications.id)
WHERE user_id = admin hiện tại
AND deleted_at IS NULL
```

---

## 15.2. Thông báo chưa đọc

```txt
COUNT(notifications.id)
WHERE user_id = admin hiện tại
AND read_at IS NULL
AND deleted_at IS NULL
```

---

## 15.3. Thông báo đã đọc

```txt
COUNT(notifications.id)
WHERE user_id = admin hiện tại
AND read_at IS NOT NULL
AND deleted_at IS NULL
```

---

## 15.4. Danh sách

Các cột hoặc card:

```txt
Tiêu đề
Nội dung
Type
Channel
Thời gian
Đã đọc / chưa đọc
Action URL
```

`type`, `channel`, `email_status` không phải enum DB.

FE không tự giới hạn bằng danh sách cứng nếu BE có thể trả loại mới.

---

## 15.5. Tương tác

```txt
Bấm thông báo
→ gọi mark read nếu chưa đọc
→ điều hướng action_url nếu hợp lệ
```

Không điều hướng URL bên ngoài chưa được kiểm soát.

---

## API cần bổ sung

```txt
GET /api/admin/notifications
PATCH /api/admin/notifications/{id}/read
PATCH /api/admin/notifications/read-all
```

---