---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 12. BÁO CÁO VÀ THỐNG KÊ

```txt
Báo cáo và thống kê

1. Báo cáo doanh thu
2. Báo cáo khóa học
3. Báo cáo giảng viên
4. Báo cáo học viên
5. Bộ lọc
6. Biểu đồ
7. Bảng dữ liệu
```

---

## 12.1. Doanh thu theo ngày

```txt
SUM(revenues.gross_amount)
GROUP BY DATE(earned_at)
WHERE status IN ('available', 'withdrawn')
```

---

## 12.2. Doanh thu theo tháng

```txt
SUM(revenues.gross_amount)
GROUP BY YEAR(earned_at), MONTH(earned_at)
WHERE status IN ('available', 'withdrawn')
```

---

## 12.3. Thu nhập giảng viên theo thời gian

```txt
SUM(revenues.instructor_amount)
GROUP BY khoảng thời gian
WHERE status IN ('available', 'withdrawn')
```

---

## 12.4. Phí nền tảng theo thời gian

```txt
SUM(revenues.platform_fee_amount)
GROUP BY khoảng thời gian
WHERE status IN ('available', 'withdrawn')
```

---

## 12.5. Tăng trưởng doanh thu

```txt
Tăng trưởng =
(Doanh thu kỳ hiện tại - Doanh thu kỳ trước)
/
Doanh thu kỳ trước
× 100
```

Nếu kỳ trước bằng 0:

```txt
Không chia cho 0.
BE trả growth_rate = null hoặc quy ước riêng.
```

---

## 12.6. Khóa học bán chạy

```txt
COUNT(orders.id)
WHERE status = 'paid'
AND payment_status = 'paid'
GROUP BY course_id
ORDER BY COUNT DESC
```

---

## 12.7. Khóa học doanh thu cao

```txt
SUM(revenues.gross_amount)
WHERE status IN ('available', 'withdrawn')
GROUP BY course_id
ORDER BY SUM DESC
```

---

## 12.8. Giảng viên doanh thu cao

```txt
SUM(revenues.instructor_amount)
WHERE status IN ('available', 'withdrawn')
GROUP BY instructor_id
ORDER BY SUM DESC
```

---

## 12.9. Tỷ lệ hoàn thành học tập

```txt
Tỷ lệ hoàn thành =
COUNT(enrollments.id WHERE status = 'completed')
/
COUNT(enrollments.id WHERE status IN ('active', 'completed'))
× 100
```

---

## 12.10. Giá trị đơn hàng trung bình

```txt
SUM(orders.amount của đơn paid)
/
COUNT(orders.id của đơn paid)
```

---

## 12.11. Doanh thu trung bình mỗi khóa

```txt
Tổng gross_amount hợp lệ
/
Số khóa có phát sinh revenue
```

---

## 12.12. Doanh thu trung bình mỗi giảng viên

```txt
Tổng instructor_amount hợp lệ
/
Số giảng viên có phát sinh revenue
```

---

## 12.13. Bộ lọc chung

```txt
7 ngày
30 ngày
Tháng này
Quý này
Năm nay
Từ ngày - đến ngày
Giảng viên
Khóa học
Danh mục
```

---

## API FE sử dụng

```txt
GET /api/admin/reports/revenue
GET /api/admin/reports/top-courses
GET /api/admin/reports/instructors
```

Có thể cần bổ sung API báo cáo học viên và completion nếu Dashboard chưa trả.

---