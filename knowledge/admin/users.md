---
source: knowledge/admin/ADMIN_FE_GD1_FULL.md
scope: MindHub Admin GD1
frontend_mode: static-html-tailwind-javascript
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