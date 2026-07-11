---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 8. DOANH THU / CHIA LỢI NHUẬN

```txt
Doanh thu / Chia lợi nhuận

1. Tổng quan
2. Bộ lọc
3. Biểu đồ
4. Danh sách revenue
5. Chi tiết revenue
6. Đối chiếu dữ liệu
7. Trạng thái rỗng
```

---

## 8.1. Tổng doanh thu gộp

**Mục đích hiển thị:**

Cho admin biết tổng tiền thực trả đã được ghi nhận vào revenue hợp lệ.

**Công thức:**

```txt
Tổng doanh thu gộp =
SUM(revenues.gross_amount)
WHERE status IN ('available', 'withdrawn')
```

---

## 8.2. Tổng thu nhập giảng viên

```txt
SUM(revenues.instructor_amount)
WHERE status IN ('available', 'withdrawn')
```

---

## 8.3. Tổng phí nền tảng

```txt
SUM(revenues.platform_fee_amount)
WHERE status IN ('available', 'withdrawn')
```

---

## 8.4. Doanh thu khả dụng

```txt
SUM(revenues.instructor_amount)
WHERE status = 'available'
```

Ý nghĩa:

```txt
Tiền giảng viên đã phát sinh và chưa chuyển sang withdrawn.
```

---

## 8.5. Doanh thu đã rút

```txt
SUM(revenues.instructor_amount)
WHERE status = 'withdrawn'
```

---

## 8.6. Doanh thu bị hủy

```txt
SUM(revenues.instructor_amount)
WHERE status = 'cancelled'
```

Không cộng khoản này vào tổng doanh thu hợp lệ.

---

## 8.7. Công thức một revenue

Theo flow hiện tại:

```txt
gross_amount = orders.amount
```

Kiểm tra:

```txt
gross_amount =
instructor_amount + platform_fee_amount
```

**Ví dụ:**

```txt
orders.amount = 400.000đ
instructor_amount = 280.000đ
platform_fee_amount = 120.000đ

400.000 = 280.000 + 120.000
```

Tỷ lệ cụ thể không được FE tự hard-code nếu DB chưa có bảng cấu hình tỷ lệ.

FE hiển thị đúng số tiền BE đã lưu.

---

## 8.8. Tỷ lệ chia thực tế

Dùng để hiển thị tham khảo:

```txt
Tỷ lệ giảng viên =
instructor_amount / gross_amount × 100
```

```txt
Tỷ lệ nền tảng =
platform_fee_amount / gross_amount × 100
```

Nếu `gross_amount = 0`:

```txt
Không thực hiện phép chia.
Hiển thị 0% hoặc — theo response BE.
```

---

## 8.9. Bộ lọc

```txt
Thời gian earned_at
Giảng viên
Khóa học
Mã đơn
Trạng thái revenue
Khoảng gross amount
```

Status:

```txt
pending
available
withdrawn
cancelled
```

UI:

```txt
pending   → Chờ ghi nhận
available → Khả dụng
withdrawn → Đã rút
cancelled → Đã hủy
```

---

## 8.10. Danh sách revenue

Các cột:

```txt
Mã revenue
Mã đơn
Khóa học
Giảng viên
Gross amount
Instructor amount
Platform fee
Trạng thái
Ngày phát sinh
Thao tác
```

---

## 8.11. Đối chiếu bất thường

FE có thể hiển thị cảnh báo nếu BE trả:

```txt
is_amount_consistent = false
```

Điều kiện kiểm tra:

```txt
gross_amount != instructor_amount + platform_fee_amount
```

Không nên để FE tự sửa số liệu.

---

## API FE sử dụng

### API hiện có

```txt
GET /api/admin/reports/revenue
```

### API cần bổ sung

```txt
GET /api/admin/revenues
GET /api/admin/revenues/{id}
```

---