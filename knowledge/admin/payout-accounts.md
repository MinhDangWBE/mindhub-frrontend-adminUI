---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 10. QUẢN LÝ TÀI KHOẢN NHẬN TIỀN

```txt
Tài khoản nhận tiền

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết
5. Xác minh
6. Từ chối
7. Vô hiệu hóa
8. Trạng thái rỗng
```

---

## 10.1. Tổng tài khoản

```txt
COUNT(payout_accounts.id)
WHERE deleted_at IS NULL
```

---

## 10.2. Đang hoạt động

```txt
COUNT(payout_accounts.id)
WHERE status = 'active'
AND deleted_at IS NULL
```

---

## 10.3. Chờ xác minh

```txt
COUNT(payout_accounts.id)
WHERE status = 'pending_verification'
AND deleted_at IS NULL
```

---

## 10.4. Bị từ chối

```txt
COUNT(payout_accounts.id)
WHERE status = 'rejected'
AND deleted_at IS NULL
```

---

## 10.5. Đã tắt

```txt
COUNT(payout_accounts.id)
WHERE status = 'inactive'
AND deleted_at IS NULL
```

---

## 10.6. Mapping trạng thái

```txt
active               → Đang hoạt động
inactive             → Đã tắt
pending_verification → Chờ xác minh
rejected             → Bị từ chối
```

---

## 10.7. Danh sách

Các cột:

```txt
Giảng viên
Provider
Tên chủ tài khoản
Số tài khoản đã che
Trạng thái
Ngày kết nối
Ngày tạo
Thao tác
```

Hiển thị:

```txt
MB Bank - NGUYEN VAN A - ****0001
```

Không hiển thị nguyên số tài khoản trong bảng.

---

## 10.8. Chi tiết

Hiển thị:

```txt
Thông tin giảng viên
Provider
Tên chủ tài khoản
Số tài khoản
connected_at
status
Ngày tạo
Các yêu cầu rút tiền liên quan
```

Chỉ trang chi tiết có quyền phù hợp mới được xem dữ liệu cần thiết.

---

## 10.9. Xác minh tài khoản

Chỉ hiển thị khi:

```txt
status = pending_verification
```

Sau thành công:

```txt
status = active
```

---

## 10.10. Từ chối tài khoản

Sau thành công:

```txt
status = rejected
```

Nếu DB chưa có cột lý do từ chối payout account, FE không được giả định BE có lưu lý do.

---

## 10.11. Vô hiệu hóa

Sau thành công:

```txt
status = inactive
```

Không hard delete tài khoản đã từng dùng trong withdrawal.

---

## API cần bổ sung

```txt
GET /api/admin/payout-accounts
GET /api/admin/payout-accounts/{id}
PATCH /api/admin/payout-accounts/{id}/approve
PATCH /api/admin/payout-accounts/{id}/reject
PATCH /api/admin/payout-accounts/{id}/disable
```

---