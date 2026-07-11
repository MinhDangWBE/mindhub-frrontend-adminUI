# TÀI LIỆU FE - HỆ THỐNG QUẢN LÝ ADMIN MINDHUB GD1

> Tài liệu này dùng để tham khảo khi thiết kế và code giao diện khu vực Admin.
>
> Phạm vi được đối chiếu theo ERD/SQL GD1, cấu trúc Laravel hiện tại và danh sách route đang có của dự án.
>
> Nguyên tắc quan trọng:
>
> - FE chịu trách nhiệm hiển thị, tương tác, bộ lọc, trạng thái giao diện và gọi API.
> - BE là nguồn quyết định cuối cùng đối với số liệu, công thức tài chính, phân quyền, validation và trạng thái dữ liệu.
> - FE không tự cộng tiền từ danh sách nếu BE đã trả summary.
> - Không thêm bảng, cột, trạng thái hoặc nghiệp vụ ngoài DB hiện tại.
> - Các API chưa có trong `route:list` được ghi rõ là **API cần bổ sung**.

---

# I. Cấu trúc Sidebar Admin đề xuất

```txt
TỔNG QUAN
├── Dashboard

NGƯỜI DÙNG
├── Quản lý người dùng
└── Yêu cầu nâng cấp giảng viên

KHÓA HỌC
├── Quản lý khóa học
├── Kiểm duyệt khóa học
├── Quản lý danh mục
├── Kiểm duyệt bình luận / Đánh giá
└── Quản lý FAQ

KINH DOANH
├── Đơn hàng / Thanh toán
├── Doanh thu / Chia lợi nhuận
├── Yêu cầu rút tiền
└── Tài khoản nhận tiền

BÁO CÁO
└── Báo cáo và thống kê

NỘI DUNG TRANG CHỦ
└── Banner / Trang chủ

HỆ THỐNG
└── Thông báo
```

---

# II. Quy tắc chung khi code FE Admin

## 1. Quy tắc lấy số liệu

FE ưu tiên dùng số liệu summary do BE trả về:

```txt
GET API summary
→ BE tính toán
→ FE format và hiển thị
```

Không nên:

```txt
GET danh sách có phân trang
→ FE cộng các dòng của trang hiện tại
→ coi đó là tổng toàn hệ thống
```

Ví dụ sai:

```txt
API trả page 1 có 10 đơn hàng.
FE cộng 10 đơn này và hiển thị là tổng doanh thu.
```

Tổng doanh thu phải do BE tính trên toàn bộ tập dữ liệu phù hợp điều kiện lọc.

---

## 2. Quy tắc hiển thị tiền

Dữ liệu tiền từ BE:

```txt
orders.amount
revenues.gross_amount
revenues.instructor_amount
revenues.platform_fee_amount
withdraw_requests.amount
```

FE định dạng:

```txt
1.000.000 ₫
```

Không dùng số thực float để tự tính tiền ở FE.

Nếu cần hiển thị phép tính minh họa, FE chỉ dùng dữ liệu BE trả về, không dùng làm nguồn quyết định lưu DB.

---

## 3. Quy tắc thời gian

Ưu tiên đúng cột nghiệp vụ:

```txt
Đơn hàng thanh toán          → paid_at
Doanh thu phát sinh          → earned_at
Yêu cầu rút tiền             → requested_at
Yêu cầu được duyệt           → approved_at
Yêu cầu được thanh toán      → paid_at
Khóa học công khai           → published_at
```

Không dùng `created_at` thay cho các cột trên nếu BE đã có mốc nghiệp vụ riêng.

FE hiển thị thống nhất:

```txt
dd/MM/yyyy HH:mm
```

---

## 4. Quy tắc trạng thái giao diện

FE map đúng status DB sang label tiếng Việt.

Không gửi label tiếng Việt về API.

Ví dụ:

```txt
DB: pending_review
UI: Chờ duyệt
```

Khi lọc, FE gửi:

```txt
status=pending_review
```

Không gửi:

```txt
status=Chờ duyệt
```

---

## 5. Trạng thái chung của trang

Mọi trang quản lý nên có đủ:

```txt
Loading
Loaded
Empty
Filter empty
Error
Permission denied
```

Ví dụ:

```txt
Loading:
Hiển thị skeleton cho card và bảng.

Empty:
Chưa có dữ liệu trong hệ thống.

Filter empty:
Không tìm thấy kết quả phù hợp với bộ lọc.

Error:
Không thể tải dữ liệu. Vui lòng thử lại.

403:
Bạn không có quyền thực hiện thao tác này.
```

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

# 2. QUẢN LÝ NGƯỜI DÙNG

```txt
Quản lý người dùng

1. Tổng quan
   1.1. Tổng người dùng
   1.2. Học viên
   1.3. Giảng viên
   1.4. Đang hoạt động
   1.5. Bị khóa
   1.6. Chưa xác thực email

2. Bộ lọc
3. Danh sách
4. Chi tiết người dùng
5. Tạo người dùng
6. Cập nhật người dùng
7. Khóa / mở khóa
8. Xóa mềm
9. Trạng thái rỗng và thông báo
```

---

## 2.1. Tổng người dùng

**Công thức:**

```txt
COUNT(users.id)
WHERE deleted_at IS NULL
```

---

## 2.2. Đang hoạt động

**Công thức:**

```txt
Tài khoản đang hoạt động =
COUNT(users.id)
WHERE users.status = 'active'
AND users.locked = false
AND users.deleted_at IS NULL
```

---

## 2.3. Bị khóa

**Logic nghiệp vụ:**

DB có cả:

```txt
status = 'locked'
locked = true
```

BE nên chuẩn hóa một field hiệu lực cho FE, ví dụ:

```txt
is_locked
effective_status
```

**Công thức tham khảo:**

```txt
Tài khoản bị khóa =
COUNT(users.id)
WHERE (users.status = 'locked' OR users.locked = true)
AND users.deleted_at IS NULL
```

FE không nên tự đoán trạng thái nếu hai field lệch nhau.

---

## 2.4. Chưa xác thực email

**Công thức:**

```txt
Chưa xác thực email =
COUNT(users.id)
WHERE users.email_verified_at IS NULL
AND users.deleted_at IS NULL
```

---

## 2.5. Bộ lọc người dùng

```txt
Tìm theo họ tên
Tìm theo email
Lọc role
Lọc status
Lọc locked
Lọc xác thực email
Lọc ngày đăng ký
```

Role DB:

```txt
admin
instructor
learner
```

Status DB:

```txt
active
inactive
locked
```

---

## 2.6. Danh sách người dùng

Các cột:

```txt
Họ tên
Email
Số điện thoại
Vai trò
Trạng thái
Email đã xác thực
Lần đăng nhập gần nhất
Ngày tạo
Thao tác
```

Thao tác:

```txt
Xem chi tiết
Chỉnh sửa
Khóa tài khoản
Mở khóa
Tạm ngưng
Kích hoạt
Xóa mềm
```

Không hiển thị:

```txt
password_hash
password_reset
oauth token
session token
```

---

## 2.7. Chi tiết học viên

Hiển thị:

```txt
Thông tin tài khoản
Tổng lượt ghi danh
Tổng khóa đang học
Tổng khóa hoàn thành
Danh sách đơn hàng
Danh sách khóa học
Đánh giá đã viết
Bình luận đã viết
```

**Công thức tổng lượt ghi danh:**

```txt
COUNT(enrollments.id)
WHERE enrollments.user_id = user_id
AND status IN ('active', 'completed')
```

**Công thức khóa đang học:**

```txt
COUNT(enrollments.id)
WHERE user_id = user_id
AND status = 'active'
```

**Công thức khóa hoàn thành:**

```txt
COUNT(enrollments.id)
WHERE user_id = user_id
AND status = 'completed'
```

---

## 2.8. Chi tiết giảng viên

Hiển thị:

```txt
Thông tin tài khoản
Hồ sơ giảng viên
Tổng khóa học
Tổng lượt ghi danh
Tổng thu nhập
Doanh thu available
Tổng đã rút
Tài khoản nhận tiền
```

**Tổng khóa học:**

```txt
COUNT(courses.id)
WHERE instructor_id = user_id
AND deleted_at IS NULL
```

**Tổng lượt ghi danh:**

```txt
COUNT(enrollments.id)
JOIN courses ON courses.id = enrollments.course_id
WHERE courses.instructor_id = user_id
AND enrollments.status IN ('active', 'completed')
AND courses.deleted_at IS NULL
```

**Tổng thu nhập:**

```txt
SUM(revenues.instructor_amount)
WHERE instructor_id = user_id
AND status IN ('available', 'withdrawn')
```

**Tổng đã rút:**

```txt
SUM(withdraw_requests.amount)
WHERE user_id = user_id
AND status = 'paid'
```

---

## 2.9. Khóa tài khoản

**Tương tác người dùng:**

Admin bấm:

```txt
Khóa tài khoản
```

FE mở modal bắt buộc nhập:

```txt
Lý do khóa
```

Sau thành công:

```txt
Refresh dòng hiện tại
Refresh summary
Hiển thị toast thành công
```

Không cho admin tự khóa chính tài khoản đang đăng nhập nếu BE chưa hỗ trợ.

---

## 2.10. Xóa người dùng

**Logic nghiệp vụ:**

Chỉ xóa mềm:

```txt
users.deleted_at = thời điểm xóa
```

FE phải hiển thị cảnh báo:

```txt
Thao tác này sẽ ẩn tài khoản khỏi hệ thống nhưng vẫn giữ dữ liệu đối chứng.
```

---

## API FE sử dụng

```txt
GET /api/admin/users
POST /api/admin/users
GET /api/admin/users/{id}
PUT/PATCH /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

---

# 3. YÊU CẦU NÂNG CẤP GIẢNG VIÊN

```txt
Yêu cầu nâng cấp giảng viên

1. Tổng quan yêu cầu
2. Bộ lọc
3. Danh sách yêu cầu
4. Chi tiết yêu cầu
5. Duyệt yêu cầu
6. Từ chối yêu cầu
7. Trạng thái rỗng
```

> Lưu ý: ERD SQL hiện tại không có bảng `instructor_upgrade_requests` riêng. FE phải lấy cấu trúc và status đúng từ API hiện tại, không tự suy luận bằng `users.role`.

---

## 3.1. Tổng yêu cầu

**Công thức giao diện:**

```txt
Tổng yêu cầu =
summary.total do API trả về
```

Nếu API trả danh sách không phân trang toàn bộ, BE có thể tính:

```txt
COUNT(các hồ sơ nâng cấp)
```

FE không cộng số item của trang hiện tại.

---

## 3.2. Yêu cầu chờ xử lý

**Công thức:**

```txt
Yêu cầu chờ xử lý =
COUNT(yêu cầu có status = pending)
```

Status chính xác phải theo response BE.

---

## 3.3. Đã duyệt

```txt
COUNT(yêu cầu có status = approved)
```

---

## 3.4. Bị từ chối

```txt
COUNT(yêu cầu có status = rejected)
```

---

## 3.5. Bộ lọc

```txt
Tìm người gửi
Tìm email
Lọc trạng thái
Lọc ngày gửi
```

---

## 3.6. Danh sách

Các cột:

```txt
Người gửi
Email
Chuyên môn
Kinh nghiệm
Trạng thái
Ngày gửi
Ngày xử lý
Thao tác
```

---

## 3.7. Chi tiết yêu cầu

Hiển thị:

```txt
Thông tin tài khoản
Bio
Expertise
Experience years
Level
Nội dung hồ sơ nâng cấp do API trả về
Trạng thái hiện tại
Lý do từ chối nếu có
```

---

## 3.8. Duyệt yêu cầu

**Tương tác:**

```txt
Bấm Duyệt
→ mở modal xác nhận
→ gọi API approve
→ thành công: cập nhật role/status theo BE
→ refresh danh sách và summary
```

FE không tự sửa `users.role` trước khi API thành công.

---

## 3.9. Từ chối yêu cầu

Bắt buộc nhập:

```txt
Lý do từ chối
```

Nếu BE trả validation 422, hiển thị lỗi tại textarea.

---

## API FE sử dụng

```txt
GET /api/admin/instructor-upgrade-requests
GET /api/admin/instructor-upgrade-requests/{userId}
PATCH /api/admin/instructor-upgrade-requests/{userId}/approve
PATCH /api/admin/instructor-upgrade-requests/{userId}/reject
```

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

# 5. KIỂM DUYỆT KHÓA HỌC

```txt
Kiểm duyệt khóa học

1. Tổng quan
2. Danh sách chờ duyệt
3. Bộ lọc
4. Chi tiết kiểm duyệt
5. Duyệt khóa học
6. Từ chối khóa học
7. Trạng thái rỗng
```

---

## 5.1. Khóa đang chờ duyệt

```txt
COUNT(courses.id)
WHERE status = 'pending_review'
AND deleted_at IS NULL
```

---

## 5.2. Danh sách chờ duyệt

Các cột:

```txt
Khóa học
Giảng viên
Danh mục
Ngày tạo
Ngày cập nhật gần nhất
Mức độ hoàn thiện
Thao tác
```

Nếu DB chưa có `submitted_at`, FE không được gọi `created_at` là “Ngày gửi duyệt”.

Nên hiển thị:

```txt
Ngày cập nhật
```

cho đến khi BE có mốc gửi duyệt rõ ràng.

---

## 5.3. Checklist hoàn thiện

**Công thức:**

```txt
Tỷ lệ hoàn thiện =
Số tiêu chí bắt buộc đã đạt
/
Tổng tiêu chí bắt buộc
× 100
```

Ví dụ tiêu chí:

```txt
Có tiêu đề
Có mô tả
Có thumbnail
Có giá
Có danh mục
Có yêu cầu đầu vào
Có kết quả đầu ra
Có ít nhất một chương
Có ít nhất một bài học
```

Checklist phải do BE trả.

FE không tự quyết định khóa đủ điều kiện duyệt chỉ dựa vào giao diện.

---

## 5.4. Nội dung kiểm duyệt

Hiển thị:

```txt
Thông tin cơ bản
Thumbnail
Video giới thiệu
Giá bán
Danh mục
Level
Ngôn ngữ
Yêu cầu đầu vào
Kết quả đầu ra
Danh sách chương
Danh sách bài học
Tài liệu
Checklist
```

---

## 5.5. Duyệt khóa học

**Tương tác:**

```txt
Bấm Duyệt
→ modal xác nhận
→ gọi approve API
→ refresh dữ liệu
```

FE hiển thị status đúng theo response BE.

Không tự giả định approve luôn bằng published nếu BE trả `approved`.

---

## 5.6. Từ chối khóa học

Bắt buộc nhập:

```txt
Lý do từ chối
```

Sau thành công:

```txt
status = rejected
admin_reject_reason = nội dung do admin nhập
```

---

## API FE sử dụng

```txt
GET /api/admin/course-reviews
PATCH /api/admin/courses/{courseId}/approve
PATCH /api/admin/courses/{courseId}/reject
GET /api/admin/courses/{id}
```

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

# 11. KIỂM DUYỆT BÌNH LUẬN / ĐÁNH GIÁ

```txt
Kiểm duyệt bình luận / Đánh giá

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Chi tiết
5. Ẩn bình luận
6. Khôi phục bình luận
7. Ẩn đánh giá
8. Trạng thái rỗng
```

---

## 11.1. Tổng bình luận

```txt
COUNT(comments.id)
```

Nếu muốn chỉ tính dữ liệu chưa deleted logic:

```txt
WHERE comments.status != 'deleted'
```

---

## 11.2. Bình luận đang hiển thị

```txt
COUNT(comments.id)
WHERE status = 'visible'
```

---

## 11.3. Bình luận đã ẩn

```txt
COUNT(comments.id)
WHERE status = 'hidden'
```

---

## 11.4. Bình luận đã xóa logic

```txt
COUNT(comments.id)
WHERE status = 'deleted'
```

Status DB của comment:

```txt
visible
hidden
deleted
```

---

## 11.5. Tổng đánh giá

```txt
COUNT(course_reviews.id)
WHERE course_reviews.deleted_at IS NULL
```

Bảng `course_reviews` không có cột status.

FE không được gửi:

```txt
status=hidden
```

cho review nếu BE không định nghĩa effective field.

Việc ẩn review có thể được BE xử lý bằng soft delete.

---

## 11.6. Điểm đánh giá trung bình toàn hệ thống

```txt
AVG(course_reviews.rating)
WHERE deleted_at IS NULL
```

---

## 11.7. Bộ lọc

```txt
Loại nội dung: comment/review
Người đăng
Khóa học
Bài học
Trạng thái comment
Rating
Từ khóa nội dung
Khoảng thời gian
```

---

## 11.8. Danh sách bình luận

Các cột:

```txt
Người đăng
Nội dung
Comment gốc / reply
Khóa học
Bài học
Trạng thái
Ngày đăng
Thao tác
```

---

## 11.9. Danh sách đánh giá

Các cột:

```txt
Người đánh giá
Khóa học
Rating
Nội dung
Ngày đánh giá
Thao tác
```

User và course được lấy qua:

```txt
course_reviews.order_id
→ orders.user_id
→ orders.course_id
```

---

## 11.10. Chi tiết

Hiển thị:

```txt
Người đăng
Nội dung đầy đủ
Khóa học
Bài học
Comment cha
Danh sách reply
Order chứng minh đã mua nếu là review
Rating
Ngày tạo
```

---

## API FE sử dụng

### API hiện có

```txt
PATCH /api/admin/moderation/items/{id}
```

API cần trả hoặc nhận rõ loại đối tượng:

```txt
item_type=comment
item_type=review
```

Nếu không, FE không thể biết cùng một id thuộc bảng nào.

Có thể cần bổ sung:

```txt
GET /api/admin/moderation/items
GET /api/admin/moderation/items/{type}/{id}
```

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

# 14. QUẢN LÝ FAQ

```txt
Quản lý FAQ

1. Tổng quan
2. Bộ lọc
3. Danh sách
4. Tạo FAQ
5. Cập nhật FAQ
6. Gắn FAQ với khóa học
7. Ẩn / hiện
8. Xóa mềm
```

---

## 14.1. Tổng FAQ

```txt
COUNT(faqs.id)
WHERE deleted_at IS NULL
```

---

## 14.2. FAQ đang hiển thị

```txt
COUNT(faqs.id)
WHERE status = 'active'
AND deleted_at IS NULL
```

---

## 14.3. FAQ đang ẩn

```txt
COUNT(faqs.id)
WHERE status = 'inactive'
AND deleted_at IS NULL
```

---

## 14.4. Số khóa học sử dụng FAQ

```txt
COUNT(DISTINCT course_faqs.course_id)
WHERE course_faqs.faq_id = faq_id
```

---

## 14.5. Bộ lọc

```txt
Tìm câu hỏi
Type
Status
Khóa học liên quan
```

Status:

```txt
active
inactive
```

`type` là chuỗi do code kiểm soát, không phải enum DB cố định.

FE nên lấy options từ BE hoặc config chung, không tự thêm loại tùy ý.

---

## 14.6. Danh sách

Các cột:

```txt
Câu hỏi
Type
Số khóa sử dụng
Thứ tự
Trạng thái
Ngày tạo
Thao tác
```

---

## 14.7. Form FAQ

```txt
Question
Answer
Type
Status
Sort order
Danh sách khóa học áp dụng
```

---

## API cần bổ sung

```txt
GET /api/admin/faqs
POST /api/admin/faqs
GET /api/admin/faqs/{id}
PATCH /api/admin/faqs/{id}
DELETE /api/admin/faqs/{id}
PATCH /api/admin/faqs/{id}/courses
```

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

# III. Bảng đối chiếu API Admin

## 1. API hiện có trong route hiện tại

```txt
GET /api/admin/dashboard

GET /api/admin/users
POST /api/admin/users
GET /api/admin/users/{id}
PUT/PATCH /api/admin/users/{id}
DELETE /api/admin/users/{id}

GET /api/admin/categories
POST /api/admin/categories
GET /api/admin/categories/{id}
PUT/PATCH /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

GET /api/admin/courses
GET /api/admin/courses/{id}
PATCH /api/admin/courses/{id}

GET /api/admin/course-reviews
PATCH /api/admin/courses/{courseId}/approve
PATCH /api/admin/courses/{courseId}/reject

GET /api/admin/instructor-upgrade-requests
GET /api/admin/instructor-upgrade-requests/{userId}
PATCH /api/admin/instructor-upgrade-requests/{userId}/approve
PATCH /api/admin/instructor-upgrade-requests/{userId}/reject

GET /api/admin/orders

PATCH /api/admin/moderation/items/{id}

GET /api/admin/reports/revenue
GET /api/admin/reports/top-courses
GET /api/admin/reports/instructors

GET/POST /api/admin/banners
GET/PUT/PATCH/DELETE /api/admin/banners/{id}
```

---

## 2. API quan trọng cần bổ sung

```txt
GET /api/admin/orders/{id}
PATCH /api/admin/orders/{id}/mark-paid
PATCH /api/admin/orders/{id}/mark-failed
PATCH /api/admin/orders/{id}/cancel

GET /api/admin/revenues
GET /api/admin/revenues/{id}

GET /api/admin/withdrawals
GET /api/admin/withdrawals/{id}
PATCH /api/admin/withdrawals/{id}/approve
PATCH /api/admin/withdrawals/{id}/reject
PATCH /api/admin/withdrawals/{id}/mark-paid

GET /api/admin/payout-accounts
GET /api/admin/payout-accounts/{id}
PATCH /api/admin/payout-accounts/{id}/approve
PATCH /api/admin/payout-accounts/{id}/reject
PATCH /api/admin/payout-accounts/{id}/disable

GET /api/admin/faqs
POST /api/admin/faqs
GET /api/admin/faqs/{id}
PATCH /api/admin/faqs/{id}
DELETE /api/admin/faqs/{id}

GET /api/admin/notifications
PATCH /api/admin/notifications/{id}/read
PATCH /api/admin/notifications/read-all
```

---

# IV. Những chức năng không đưa vào FE Admin GD1

## 1. Credit package / credit giảng viên

Route cũ có thể còn:

```txt
/api/admin/credit-packages
/api/admin/instructors/{id}/credits
/api/admin/instructors/{id}/credit-transactions
```

Nhưng mô hình hiện tại đã chuyển sang:

```txt
Học viên mua khóa học
→ order paid
→ revenue chia cho giảng viên và nền tảng
```

Không đưa Credit vào sidebar Admin mới.

---

## 2. CRUD Role động

DB hiện tại chỉ có:

```txt
users.role = admin/instructor/learner
```

Không có hệ thống bảng role-permission đầy đủ.

Không đưa trang CRUD Role vào FE mới.

---

## 3. Admin quản lý coupon của giảng viên

Coupon khóa học do instructor tự quản lý.

Admin chỉ xem coupon trong chi tiết đơn hàng để đối chiếu.

Không tạo trang Admin sửa coupon của instructor trong GD1.

---

## 4. Campaign riêng

Không tạo trang Campaign riêng nếu DB không có bảng campaign.

Banner được dùng cho nội dung quảng bá trang chủ.

---

## 5. Hoàn tiền

Không thêm:

```txt
Refund request
Partially refunded
Refunded
```

khi DB hiện tại chưa có bảng và status hoàn tiền.

---

## 6. Audit log và cấu hình tỷ lệ

Không thêm trang:

```txt
Nhật ký Admin
Commission rules
System settings
```

nếu DB chính thức chưa có bảng tương ứng.

---

# V. Bản chốt ngắn gọn đưa vào Notion

```txt
Hệ thống quản trị Admin MindHub

1. Dashboard
   1.1. Tổng quan người dùng
   1.2. Tổng quan khóa học
   1.3. Tổng quan đơn hàng
   1.4. Tổng quan doanh thu
   1.5. Công việc cần xử lý
   1.6. Biểu đồ
   1.7. Xếp hạng

2. Quản lý người dùng
   2.1. Tổng quan
   2.2. Bộ lọc
   2.3. Danh sách
   2.4. Chi tiết học viên
   2.5. Chi tiết giảng viên
   2.6. Khóa / mở khóa
   2.7. Xóa mềm

3. Yêu cầu nâng cấp giảng viên
   3.1. Tổng quan
   3.2. Bộ lọc
   3.3. Danh sách
   3.4. Chi tiết
   3.5. Duyệt
   3.6. Từ chối

4. Quản lý khóa học
   4.1. Tổng quan
   4.2. Bộ lọc
   4.3. Danh sách
   4.4. Chi tiết
   4.5. Ẩn / hiện

5. Kiểm duyệt khóa học
   5.1. Danh sách chờ duyệt
   5.2. Checklist
   5.3. Chi tiết kiểm duyệt
   5.4. Duyệt
   5.5. Từ chối

6. Quản lý danh mục
   6.1. Tổng quan
   6.2. Cây danh mục
   6.3. Danh sách
   6.4. Tạo mới
   6.5. Cập nhật
   6.6. Xóa mềm

7. Đơn hàng / Thanh toán
   7.1. Tổng quan
   7.2. Bộ lọc
   7.3. Danh sách
   7.4. Chi tiết
   7.5. Xác nhận paid
   7.6. Đánh dấu failed
   7.7. Hủy đơn

8. Doanh thu / Chia lợi nhuận
   8.1. Tổng quan
   8.2. Biểu đồ
   8.3. Danh sách revenue
   8.4. Chi tiết
   8.5. Đối chiếu

9. Yêu cầu rút tiền
   9.1. Tổng quan
   9.2. Bộ lọc
   9.3. Danh sách
   9.4. Chi tiết
   9.5. Duyệt
   9.6. Từ chối
   9.7. Đánh dấu đã thanh toán

10. Tài khoản nhận tiền
    10.1. Tổng quan
    10.2. Bộ lọc
    10.3. Danh sách
    10.4. Chi tiết
    10.5. Xác minh
    10.6. Từ chối
    10.7. Vô hiệu hóa

11. Kiểm duyệt bình luận / Đánh giá
    11.1. Tổng quan
    11.2. Bộ lọc
    11.3. Danh sách
    11.4. Chi tiết
    11.5. Ẩn / khôi phục

12. Báo cáo và thống kê
    12.1. Doanh thu
    12.2. Khóa học
    12.3. Giảng viên
    12.4. Học viên

13. Banner / Trang chủ
    13.1. Tổng quan
    13.2. Danh sách
    13.3. Tạo mới
    13.4. Cập nhật
    13.5. Bật / tắt
    13.6. Xóa mềm

14. FAQ
    14.1. Tổng quan
    14.2. Danh sách
    14.3. Tạo mới
    14.4. Cập nhật
    14.5. Gắn khóa học
    14.6. Ẩn / hiện

15. Thông báo
    15.1. Tổng quan
    15.2. Danh sách
    15.3. Đánh dấu đã đọc
    15.4. Điều hướng đối tượng liên quan
```

---

# VI. Công thức quan trọng cần nhớ khi code giao diện

```txt
Tổng tiền học viên thanh toán =
SUM(orders.amount)
WHERE order paid và payment paid
```

```txt
Tổng doanh thu hợp lệ =
SUM(revenues.gross_amount)
WHERE status IN (available, withdrawn)
```

```txt
Thu nhập giảng viên =
SUM(revenues.instructor_amount)
WHERE status IN (available, withdrawn)
```

```txt
Phí nền tảng =
SUM(revenues.platform_fee_amount)
WHERE status IN (available, withdrawn)
```

```txt
gross_amount =
instructor_amount + platform_fee_amount
```

```txt
Số dư có thể rút của giảng viên =
SUM(revenue available)
-
SUM(withdraw pending/approved)
```

```txt
Tổng tiền đang chờ rút =
SUM(withdraw amount)
WHERE status IN (pending, approved)
```

```txt
Tổng tiền đã trả =
SUM(withdraw amount)
WHERE status = paid
```

```txt
Tổng lượt ghi danh =
COUNT(enrollments)
WHERE status IN (active, completed)
```

```txt
Tổng học viên duy nhất =
COUNT(DISTINCT enrollments.user_id)
```

```txt
Tỷ lệ hoàn thành =
completed enrollments
/
(active + completed enrollments)
× 100
```

```txt
Tiền giảm của order =
MAX(0, price_snapshot - amount)
```

```txt
Banner đang hiển thị =
status active
AND start_at <= now nếu có
AND end_at >= now nếu có
```

---

# VII. Chốt trách nhiệm FE và BE

## FE làm

```txt
Hiển thị trang
Hiển thị card
Format tiền và ngày
Quản lý bộ lọc
Quản lý phân trang
Mở modal/drawer
Gọi API
Hiển thị loading/error/empty
Refresh dữ liệu sau thao tác
Map status sang label
```

## BE làm

```txt
Tính summary
Tính doanh thu
Tính số dư rút tiền
Kiểm tra quyền admin
Validate request
Xử lý trạng thái
Tạo enrollment
Tạo revenue
Chống xử lý trùng
Mask dữ liệu nhạy cảm
Trả response chuẩn
```

## Không làm lẫn

```txt
FE không tự xác nhận order paid.
FE không tự tạo enrollment.
FE không tự tạo revenue.
FE không tự đổi status withdrawal.
FE không tự tính số dư để quyết định cho rút.
BE không quyết định layout, modal hay điều hướng trang.
```
