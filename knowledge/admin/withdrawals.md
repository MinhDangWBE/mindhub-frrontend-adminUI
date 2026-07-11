---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 9. QUẢN LÝ YÊU CẦU RÚT TIỀN

```txt
Quản lý yêu cầu rút tiền

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết
5. Duyệt
6. Từ chối
7. Đánh dấu đã thanh toán
8. Trạng thái rỗng
```

---

## 9.1. Tổng yêu cầu

```txt
COUNT(withdraw_requests.id)
```

---

## 9.2. Yêu cầu chờ xử lý

```txt
COUNT(withdraw_requests.id)
WHERE status = 'pending'
```

---

## 9.3. Yêu cầu đã duyệt

```txt
COUNT(withdraw_requests.id)
WHERE status = 'approved'
```

---

## 9.4. Yêu cầu đã thanh toán

```txt
COUNT(withdraw_requests.id)
WHERE status = 'paid'
```

---

## 9.5. Tổng tiền chờ xử lý

```txt
SUM(withdraw_requests.amount)
WHERE status IN ('pending', 'approved')
```

---

## 9.6. Tổng tiền đã thanh toán

```txt
SUM(withdraw_requests.amount)
WHERE status = 'paid'
```

---

## 9.7. Số dư có thể rút của một giảng viên

**Mục đích hiển thị:**

Cho admin đối chiếu giảng viên có đủ số dư cho yêu cầu hay không.

**Logic nghiệp vụ:**

GD1 không có thời gian chờ revenue.

Revenue `available` có thể rút ngay, nhưng các yêu cầu `pending/approved` phải được trừ để chống rút trùng.

**Công thức:**

```txt
Số dư có thể rút =
SUM(revenues.instructor_amount WHERE status = 'available')
-
SUM(withdraw_requests.amount WHERE status IN ('pending', 'approved'))
```

Giới hạn:

```txt
available_balance = MAX(0, kết quả)
```

**Ví dụ:**

```txt
Revenue available = 1.000.000đ.
Yêu cầu pending = 600.000đ.
Yêu cầu approved = 200.000đ.

Số dư có thể rút = 200.000đ.
```

---

## 9.8. Mapping trạng thái

```txt
pending   → Chờ xử lý
approved  → Đã duyệt
rejected  → Bị từ chối
paid      → Đã thanh toán
cancelled → Đã hủy
```

---

## 9.9. Bộ lọc

```txt
Giảng viên
Trạng thái
requested_at
Khoảng số tiền
Provider
```

Sort mặc định:

```txt
requested_at DESC
```

---

## 9.10. Danh sách

Các cột:

```txt
Mã yêu cầu
Giảng viên
Số tiền
Tài khoản nhận tiền đã che
Trạng thái
Ngày yêu cầu
Ngày duyệt
Ngày thanh toán
Thao tác
```

Mã hiển thị nếu DB chưa có code:

```txt
#WR-001
```

Tạo từ `id` chỉ để hiển thị, không thêm cột DB.

---

## 9.11. Chi tiết yêu cầu

Hiển thị:

```txt
Thông tin giảng viên
Số tiền yêu cầu
Available revenue
Reserved withdraw amount
Available balance
Payout account snapshot
Trạng thái
requested_at
approved_at
paid_at
rejected_reason
provider_payout_id
```

Số tài khoản dùng snapshot:

```txt
account_number_snapshot
account_name_snapshot
```

FE phải ưu tiên field masked do BE trả.

---

## 9.12. Duyệt yêu cầu

Chỉ hiển thị nút khi:

```txt
status = pending
```

Sau duyệt:

```txt
status = approved
approved_at có giá trị
```

---

## 9.13. Từ chối yêu cầu

Chỉ hiển thị khi trạng thái còn có thể xử lý theo BE.

Bắt buộc nhập:

```txt
rejected_reason
```

Sau khi từ chối, số tiền không còn nằm trong nhóm giữ chỗ `pending/approved`.

---

## 9.14. Đánh dấu đã thanh toán

Chỉ hiển thị khi:

```txt
status = approved
```

Form có thể gồm:

```txt
Mã giao dịch thanh toán
Ghi chú xác nhận
```

Khi thành công:

```txt
status = paid
paid_at được cập nhật
provider_payout_id được lưu nếu có
```

Quan trọng:

```txt
Revenue tương ứng phải không còn ở status available.
```

Việc đồng bộ revenue là BE làm.

---

## API cần bổ sung

```txt
GET /api/admin/withdrawals
GET /api/admin/withdrawals/{id}
PATCH /api/admin/withdrawals/{id}/approve
PATCH /api/admin/withdrawals/{id}/reject
PATCH /api/admin/withdrawals/{id}/mark-paid
```

---