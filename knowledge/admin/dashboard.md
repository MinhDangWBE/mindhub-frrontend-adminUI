---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
---

# 1. DASHBOARD TỔNG QUAN ADMIN

```txt
Dashboard tổng quan Admin

1. Tổng quan hệ thống
   1.1. Tổng người dùng
   1.2. Tổng học viên
   1.3. Tổng giảng viên
   1.4. Tổng khóa học
   1.5. Tổng lượt ghi danh

2. Tổng quan kinh doanh
   2.1. Tổng tiền học viên đã thanh toán
   2.2. Tổng thu nhập giảng viên
   2.3. Tổng phí nền tảng
   2.4. Tổng tiền đang chờ rút
   2.5. Tổng tiền đã thanh toán cho giảng viên

3. Công việc cần xử lý
   3.1. Khóa học chờ duyệt
   3.2. Yêu cầu nâng cấp giảng viên
   3.3. Yêu cầu rút tiền chờ xử lý
   3.4. Tài khoản nhận tiền chờ xác minh
   3.5. Đơn hàng cần kiểm tra

4. Biểu đồ
   4.1. Doanh thu
   4.2. Đơn hàng
   4.3. Lượt ghi danh
   4.4. Người dùng mới

5. Xếp hạng
   5.1. Khóa học bán chạy
   5.2. Khóa học nhiều học viên
   5.3. Giảng viên doanh thu cao

6. Hoạt động gần đây
```

---

## 1.1. Tổng người dùng

**Mục đích hiển thị:**

Cho admin biết tổng số tài khoản đang tồn tại trong hệ thống.

**Logic nghiệp vụ:**

Chỉ tính user chưa bị xóa mềm.

**Công thức hiển thị:**

```txt
Tổng người dùng =
COUNT(users.id)
WHERE users.deleted_at IS NULL
```

**Ví dụ:**

```txt
Hệ thống có 1.020 user.
Có 20 user đã soft delete.

Tổng người dùng hiển thị = 1.000.
```

**Tương tác người dùng:**

Khi bấm card:

```txt
Mở trang Quản lý người dùng
→ bỏ tất cả filter vai trò
```

---

## 1.2. Tổng học viên

**Mục đích hiển thị:**

Cho admin biết tổng tài khoản có vai trò học viên.

**Công thức hiển thị:**

```txt
Tổng học viên =
COUNT(users.id)
WHERE users.role = 'learner'
AND users.deleted_at IS NULL
```

**Không tính:**

```txt
Instructor
Admin
User đã soft delete
```

**Tương tác người dùng:**

```txt
Bấm card
→ mở Quản lý người dùng
→ filter role=learner
```

---

## 1.3. Tổng giảng viên

**Mục đích hiển thị:**

Cho admin biết số tài khoản hiện đang mang vai trò giảng viên.

**Công thức hiển thị:**

```txt
Tổng giảng viên =
COUNT(users.id)
WHERE users.role = 'instructor'
AND users.deleted_at IS NULL
```

**Tương tác người dùng:**

```txt
Bấm card
→ mở Quản lý người dùng
→ filter role=instructor
```

---

## 1.4. Tổng khóa học

**Mục đích hiển thị:**

Cho admin biết tổng số khóa học chưa bị xóa mềm.

**Công thức hiển thị:**

```txt
Tổng khóa học =
COUNT(courses.id)
WHERE courses.deleted_at IS NULL
```

**Không tính:**

```txt
Khóa học đã soft delete
```

**Tương tác người dùng:**

```txt
Bấm card
→ mở Quản lý khóa học
→ status=all
```

---

## 1.5. Tổng lượt ghi danh

**Mục đích hiển thị:**

Cho admin biết tổng số lượt học viên được ghi danh vào khóa học.

**Logic nghiệp vụ:**

Đây là số lượt enrollment, không phải số học viên duy nhất.

Một học viên học hai khóa khác nhau thì tính hai lượt.

**Công thức hiển thị:**

```txt
Tổng lượt ghi danh =
COUNT(enrollments.id)
WHERE enrollments.status IN ('active', 'completed')
```

**Ví dụ:**

```txt
Học viên A học khóa Laravel.
Học viên A học khóa Vue.
Học viên B học khóa Laravel.

Tổng lượt ghi danh = 3.
Tổng học viên duy nhất = 2.
```

---

## 1.6. Tổng tiền học viên đã thanh toán

**Mục đích hiển thị:**

Cho admin biết tổng số tiền thực tế hệ thống đã thu từ các đơn hàng thành công.

**Logic nghiệp vụ:**

Dùng `orders.amount`, vì đây là số tiền thực trả sau giảm giá.

Không dùng giá niêm yết của khóa học.

**Công thức hiển thị:**

```txt
Tổng tiền học viên đã thanh toán =
SUM(orders.amount)
WHERE orders.status = 'paid'
AND orders.payment_status = 'paid'
```

**Ví dụ:**

```txt
Giá khóa học: 500.000đ
Coupon giảm: 100.000đ
orders.amount: 400.000đ

Doanh thu thu vào được tính là 400.000đ.
```

**Không tính:**

```txt
pending
cancelled
failed
expired
payment_status khác paid
```

**Tương tác người dùng:**

```txt
Bấm card
→ mở Đơn hàng / Thanh toán
→ status=paid
→ payment_status=paid
```

---

## 1.7. Tổng thu nhập giảng viên

**Mục đích hiển thị:**

Cho admin biết tổng phần tiền được phân bổ cho giảng viên từ các revenue hợp lệ.

**Công thức hiển thị:**

```txt
Tổng thu nhập giảng viên =
SUM(revenues.instructor_amount)
WHERE revenues.status IN ('available', 'withdrawn')
```

**Không tính:**

```txt
revenues.status = 'cancelled'
```

`pending` không thuộc flow chính GD1 sau khi order đã paid.

**Ví dụ:**

```txt
Revenue 1 instructor_amount = 280.000đ, status=available.
Revenue 2 instructor_amount = 350.000đ, status=withdrawn.
Revenue 3 instructor_amount = 100.000đ, status=cancelled.

Tổng thu nhập giảng viên = 630.000đ.
```

---

## 1.8. Tổng phí nền tảng

**Mục đích hiển thị:**

Cho admin biết tổng phần tiền nền tảng được hưởng.

**Công thức hiển thị:**

```txt
Tổng phí nền tảng =
SUM(revenues.platform_fee_amount)
WHERE revenues.status IN ('available', 'withdrawn')
```

**Kiểm tra liên quan:**

Với từng revenue hợp lệ:

```txt
gross_amount =
instructor_amount + platform_fee_amount
```

FE không tự sửa hoặc tự phân bổ hai phần này.

---

## 1.9. Tổng tiền đang chờ rút

**Mục đích hiển thị:**

Cho admin biết số tiền đã được giảng viên đưa vào yêu cầu rút nhưng chưa thanh toán xong.

**Công thức hiển thị:**

```txt
Tổng tiền đang chờ rút =
SUM(withdraw_requests.amount)
WHERE withdraw_requests.status IN ('pending', 'approved')
```

**Ý nghĩa:**

```txt
pending  → admin chưa duyệt
approved → admin đã duyệt nhưng chưa đánh dấu đã thanh toán
```

---

## 1.10. Tổng tiền đã thanh toán cho giảng viên

**Mục đích hiển thị:**

Cho admin biết tổng số tiền đã được ghi nhận thanh toán xong cho giảng viên.

**Công thức hiển thị:**

```txt
Tổng đã thanh toán =
SUM(withdraw_requests.amount)
WHERE withdraw_requests.status = 'paid'
```

---

## 1.11. Công việc cần xử lý

**Mục đích hiển thị:**

Cho admin biết nhanh các nghiệp vụ đang chờ thao tác.

**Các chỉ số đề xuất:**

```txt
Khóa học chờ duyệt =
COUNT(courses.id)
WHERE status = 'pending_review'
AND deleted_at IS NULL
```

```txt
Yêu cầu rút tiền chờ duyệt =
COUNT(withdraw_requests.id)
WHERE status = 'pending'
```

```txt
Yêu cầu đã duyệt chờ thanh toán =
COUNT(withdraw_requests.id)
WHERE status = 'approved'
```

```txt
Tài khoản nhận tiền chờ xác minh =
COUNT(payout_accounts.id)
WHERE status = 'pending_verification'
AND deleted_at IS NULL
```

**Tương tác người dùng:**

Mỗi dòng có nút:

```txt
Xử lý ngay
```

Bấm vào phải điều hướng đúng trang và áp dụng filter tương ứng.

---

## 1.12. Biểu đồ doanh thu

**Mục đích hiển thị:**

Cho admin theo dõi tiền thu, tiền giảng viên và phí nền tảng theo thời gian.

**Dữ liệu biểu đồ:**

```txt
gross_amount
instructor_amount
platform_fee_amount
```

**Công thức theo ngày:**

```txt
Doanh thu gộp ngày =
SUM(revenues.gross_amount)
GROUP BY DATE(revenues.earned_at)
WHERE status IN ('available', 'withdrawn')
```

```txt
Thu nhập giảng viên ngày =
SUM(revenues.instructor_amount)
GROUP BY DATE(revenues.earned_at)
WHERE status IN ('available', 'withdrawn')
```

```txt
Phí nền tảng ngày =
SUM(revenues.platform_fee_amount)
GROUP BY DATE(revenues.earned_at)
WHERE status IN ('available', 'withdrawn')
```

**Bộ lọc:**

```txt
7 ngày qua
30 ngày qua
Tháng này
Năm nay
Từ ngày - đến ngày
```

---

## 1.13. Khóa học bán chạy

**Công thức:**

```txt
Số lượt bán của khóa =
COUNT(orders.id)
WHERE orders.course_id = courses.id
AND orders.status = 'paid'
AND orders.payment_status = 'paid'
```

Sort:

```txt
paid_order_count DESC
```

---

## 1.14. Khóa học nhiều học viên

**Công thức:**

```txt
Tổng lượt ghi danh của khóa =
COUNT(enrollments.id)
WHERE enrollments.course_id = courses.id
AND enrollments.status IN ('active', 'completed')
```

Nếu cần học viên duy nhất:

```txt
COUNT(DISTINCT enrollments.user_id)
```

Hai chỉ số phải được đặt tên khác nhau.

---

## 1.15. Giảng viên doanh thu cao

**Công thức:**

```txt
Thu nhập của giảng viên =
SUM(revenues.instructor_amount)
WHERE revenues.instructor_id = users.id
AND revenues.status IN ('available', 'withdrawn')
GROUP BY revenues.instructor_id
```

Sort:

```txt
instructor_amount DESC
```

---

## API FE sử dụng

### API hiện có

```txt
GET /api/admin/dashboard
GET /api/admin/reports/revenue
GET /api/admin/reports/top-courses
GET /api/admin/reports/instructors
```

### Có thể cần mở rộng response của Dashboard

Dashboard nên trả đủ:

```txt
user_summary
course_summary
enrollment_summary
order_summary
revenue_summary
withdraw_summary
action_required
recent_activities
```

---