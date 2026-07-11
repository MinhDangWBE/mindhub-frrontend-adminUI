---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 7. ĐƠN HÀNG / THANH TOÁN

```txt
Đơn hàng / Thanh toán

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết đơn hàng
5. Xác nhận thanh toán
6. Đánh dấu thất bại
7. Hủy đơn
8. Trạng thái rỗng
```

---

## 7.1. Tổng đơn hàng

```txt
COUNT(orders.id)
```

---

## 7.2. Đơn chờ xử lý

```txt
COUNT(orders.id)
WHERE orders.status = 'pending'
```

---

## 7.3. Đơn đã thanh toán

```txt
COUNT(orders.id)
WHERE orders.status = 'paid'
AND orders.payment_status = 'paid'
```

---

## 7.4. Đơn thất bại

```txt
COUNT(orders.id)
WHERE orders.status = 'failed'
OR orders.payment_status = 'failed'
```

BE nên trả effective status để FE không tự xử lý xung đột.

---

## 7.5. Tổng giá trước giảm

```txt
SUM(orders.price_snapshot)
WHERE status = 'paid'
AND payment_status = 'paid'
```

---

## 7.6. Tổng tiền thực trả

```txt
SUM(orders.amount)
WHERE status = 'paid'
AND payment_status = 'paid'
```

---

## 7.7. Tổng tiền giảm

```txt
SUM(GREATEST(0, orders.price_snapshot - orders.amount))
WHERE status = 'paid'
AND payment_status = 'paid'
```

**Ví dụ:**

```txt
price_snapshot = 500.000đ
amount = 400.000đ

Tiền giảm = 100.000đ
```

---

## 7.8. Giá trị đơn hàng trung bình

```txt
Giá trị trung bình =
Tổng orders.amount của đơn paid
/
Số đơn paid
```

Nếu chưa có đơn paid:

```txt
average_order_value = 0
```

---

## 7.9. Tỷ lệ thanh toán thành công

```txt
Tỷ lệ thành công =
Số đơn paid
/
Tổng đơn đã có kết quả thanh toán
× 100
```

Mẫu số đề xuất:

```txt
paid + failed + cancelled + expired
```

Không tính đơn mới tạo vẫn pending nếu chưa thực hiện thanh toán.

---

## 7.10. Mapping trạng thái đơn hàng

```txt
pending   → Chờ thanh toán
paid      → Đã thanh toán
cancelled → Đã hủy
failed    → Thất bại
expired   → Hết hạn
```

Payment status:

```txt
unpaid     → Chưa thanh toán
processing → Đang xử lý
paid       → Đã thanh toán
failed     → Thất bại
```

---

## 7.11. Bộ lọc

```txt
Mã đơn hàng
Học viên
Khóa học
Coupon
Trạng thái đơn
Trạng thái thanh toán
Phương thức thanh toán
Khoảng thời gian
Khoảng tiền
```

---

## 7.12. Danh sách đơn hàng

Các cột:

```txt
Mã đơn
Học viên
Khóa học
Giá tại thời điểm mua
Coupon
Số tiền thực trả
Phương thức
Trạng thái đơn
Trạng thái thanh toán
Ngày thanh toán
Thao tác
```

---

## 7.13. Chi tiết đơn hàng

Hiển thị:

```txt
Thông tin đơn
Thông tin học viên
Thông tin khóa học
Giá tại thời điểm mua
Coupon áp dụng
Số tiền giảm
Số tiền thực trả
Payment method
Provider transaction ID
Trạng thái
Enrollment liên quan
Revenue liên quan
```

**Số tiền giảm hiển thị:**

```txt
MAX(0, price_snapshot - amount)
```

---

## 7.14. Xác nhận thanh toán

Khi admin xác nhận đơn paid, flow BE phải là:

```txt
Order paid
→ tạo enrollment một lần
→ tạo revenue một lần
→ revenue status = available
→ tăng used_count coupon nếu có
```

FE chỉ:

```txt
Bấm xác nhận
→ gọi API
→ hiển thị loading
→ nhận kết quả
→ refresh order detail
```

FE không tự tạo enrollment hoặc revenue.

---

## API FE sử dụng

### API hiện có

```txt
GET /api/admin/orders
```

### API cần bổ sung

```txt
GET /api/admin/orders/{id}
PATCH /api/admin/orders/{id}/mark-paid
PATCH /api/admin/orders/{id}/mark-failed
PATCH /api/admin/orders/{id}/cancel
```

---