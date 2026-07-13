FE ADMIN MINDHUB GD1 – API CONTRACT V2

1. Mục đích

Tài liệu này thay thế bản FE trước và dùng để code/nối API thật cho 14 trang Admin.

Đã đối chiếu với source Backend hiện tại:

Laravel 12.61.1.

46 route Admin hiện có.

Controller, FormRequest, Resource, Service và Repository đã xuất từ source.

ERD/SQL hiện tại.

Giao diện FE HTML + Tailwind + JavaScript thuần.

2. Kết luận kiểm tra hiện trạng

FE chưa được nối thẳng theo bản tài liệu cũ, vì source BE hiện còn các lệch sau:

API phân trang hiện trả data: [], trong khi bản FE cũ mong data.items.

Nhiều trang FE yêu cầu summary nhưng API hiện chưa trả.

API duyệt khóa học hiện vẫn gọi logic trừ lượt tạo khóa học cũ.

PaymentService hiện tạo revenue theo tỷ lệ 100% giảng viên, 0% nền tảng, không khớp ERD seed 70/30.

Banner create/update trả data là chuỗi JSON.

Top instructor report đang trả instructor_amount = 0 và platform_fee_amount = 0.

Payout status đang dùng lẫn pending và pending_verification.

Withdrawal instructor có route/controller/service/resource trùng và lệch kiểu dữ liệu.

Upgrade request trả số tài khoản đầy đủ trong list.

Dashboard và report Admin chưa gắn middleware active.user.

FE chỉ chuyển khỏi mock sau khi endpoint tương ứng đạt contract trong tài liệu này.

Quy ước contract FE–BE đã chốt

Response danh sách có summary

{
  "success": true,
  "message": "Lấy dữ liệu thành công.",
  "data": {
    "summary": {},
    "items": []
  },
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 0
  }
}

Response chi tiết hoặc thao tác

{
  "success": true,
  "message": "Thao tác thành công.",
  "data": {}
}

Response lỗi

{
  "success": false,
  "message": "Thông báo lỗi cụ thể.",
  "errors": {}
}

Kiểu dữ liệu bắt buộc

Loại

Contract

ID, số lượng

Integer

Tiền

Chuỗi decimal, ví dụ "269100.00"

Tỷ lệ/phần trăm

Number

Boolean

true / false

Ngày giờ

ISO 8601 hoặc null

Status

Mã tiếng Anh từ BE

Label tiếng Việt

FE tự map; không dùng để xử lý nghiệp vụ

FE không được tự đổi tên field. BE không được trả cùng một ý nghĩa bằng nhiều tên khác nhau.

3. Cấu trúc JavaScript FE cần dùng

assets/js/
├── core/
│   ├── api-client.js
│   ├── auth.js
│   ├── config.js
│   ├── formatters.js
│   ├── pagination.js
│   ├── query-state.js
│   └── ui-state.js
├── api/
│   ├── dashboard-api.js
│   ├── users-api.js
│   ├── instructor-upgrades-api.js
│   ├── courses-api.js
│   ├── course-reviews-api.js
│   ├── categories-api.js
│   ├── orders-api.js
│   ├── revenues-api.js
│   ├── withdrawals-api.js
│   ├── payout-accounts-api.js
│   ├── moderation-api.js
│   ├── reports-api.js
│   ├── banners-api.js
│   ├── faqs-api.js
│   └── notifications-api.js
└── pages/
    └── mỗi trang một file JS

4. Quy tắc nối API FE

Base URL: http://localhost:8000/api.

Gửi token/session theo cơ chế login hiện tại.

Gửi Accept: application/json.

Không format hoặc cộng tiền trước khi nhận đủ dữ liệu.

Không dùng status_label để quyết định nút thao tác.

Query string là nguồn trạng thái filter.

Sau mutation phải refresh list, summary và detail liên quan.

401: về đăng nhập.

403: trang không có quyền.

409: dữ liệu đã được xử lý hoặc sai trạng thái.

422: gắn lỗi vào field.

Khi endpoint chưa đạt contract: giữ mock và đánh dấu data-source="mock".

ADM-01 – Dashboard

Trang: pages/dashboard.htmlTrạng thái nối: CHỜ BE SỬA CONTRACT

Endpoint cuối cùng

GET /api/admin/dashboard
GET /api/admin/reports/revenue
GET /api/admin/reports/top-courses
GET /api/admin/reports/instructors

Query/body FE được phép gửi

date_from?: YYYY-MM-DD
date_to?: YYYY-MM-DD
month?: 1..12
year?: 2000..2100
course_id?: integer

Field FE đọc

dashboard.data.summary:
- total_users
- total_learners
- total_instructors
- total_courses
- total_published_courses
- total_orders
- paid_orders
- total_enrollments
- completed_enrollments
- completion_rate

dashboard.data.revenue:
- gross_amount
- instructor_amount
- platform_fee_amount

dashboard.data.course_status:
- draft
- pending_review
- approved
- rejected
- published
- hidden

dashboard.data.user_status:
- active
- inactive
- locked

dashboard.data.withdrawal_summary:
- pending_count
- approved_count
- pending_amount
- approved_amount
- paid_amount

dashboard.data.action_required:
- pending_course_reviews
- pending_instructor_upgrades
- pending_withdrawals
- pending_payout_accounts

dashboard.data.recent:
- latest_orders[]
- latest_courses[]

UI được triển khai

Card tổng quan, doanh thu, trạng thái khóa học, trạng thái user, công việc cần xử lý và dữ liệu gần đây. Biểu đồ/top dùng các report API hiện có để dashboard không quá nặng.

FE không được làm

Không cộng doanh thu từ order list. Không tính action-required ở FE. Không gửi query period vì BE không hỗ trợ field đó.

Điều kiện BE trước khi bỏ mock

BE phải thêm active.user, loại revenue cancelled/pending khỏi doanh thu hợp lệ, thêm withdrawal_summary/action_required và không trả raw DB object không qua Resource.

ADM-02 – Quản lý người dùng

Trang: pages/users.htmlTrạng thái nối: TẬN DỤNG API, CHỜ MỞ RỘNG SUMMARY

Endpoint cuối cùng

GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/{id}
PATCH  /api/admin/users/{id}
DELETE /api/admin/users/{id}

Query/body FE được phép gửi

List:
page, per_page, search, role, status, locked?, email_verified?,
date_from?, date_to?, sort_by, sort_direction

Create:
full_name, email, password, phone?, role, status?, locked_reason?

Update:
full_name?, email?, password?, phone?, role?, status?, locked_reason?

Field FE đọc

data.summary:
- total_users
- total_learners
- total_instructors
- active_users
- inactive_users
- locked_users
- unverified_users
- new_users_in_period

data.items[] / detail:
- id
- full_name
- email
- phone
- role
- status
- effective_status
- oauth_account_login
- email_verified_at
- last_login_at
- locked
- locked_reason
- created_at
- updated_at

UI được triển khai

Summary card, filter, table, detail drawer, create/edit modal, khóa/mở khóa, active/inactive và soft delete.

FE không được làm

Không gửi locked trực tiếp nếu BE dùng status=locked. Không cho tự khóa/xóa admin đang đăng nhập. Không hiển thị password/token/hash.

Điều kiện BE trước khi bỏ mock

BE phải thêm summary, effective_status, filter locked/email_verified/date; bắt buộc locked_reason khi status=locked và chặn xóa admin cuối cùng.

ADM-03 – Yêu cầu nâng cấp giảng viên

Trang: pages/instructor-upgrades.htmlTrạng thái nối: TẬN DỤNG API, SỬA MASK VÀ META

Endpoint cuối cùng

GET   /api/admin/instructor-upgrade-requests
GET   /api/admin/instructor-upgrade-requests/{userId}
PATCH /api/admin/instructor-upgrade-requests/{userId}/approve
PATCH /api/admin/instructor-upgrade-requests/{userId}/reject

Query/body FE được phép gửi

List:
page, per_page, search?, status?, date_from?, date_to?

Approve: không body
Reject: không body trong GD1 hiện tại

Field FE đọc

data.summary:
- total
- pending
- approved
- rejected

item/detail:
- application_status
- submitted_at
- reviewed_at
- review_note
- user { id, full_name, email, phone, role, status, email_verified_at }
- instructor_profile { bio, expertise, experience_years, level }
- payout_account {
    id, provider, account_name,
    account_number_masked ở list,
    account_number chỉ ở detail,
    status, connected_at
  }

UI được triển khai

Danh sách hồ sơ, chi tiết hai cột, approve và reject bằng modal xác nhận.

FE không được làm

Không hiển thị textarea lý do từ chối vì DB/API hiện không lưu rejected_reason. Không hiển thị full account number trong list.

Điều kiện BE trước khi bỏ mock

BE đã có logic dùng users + instructor_profiles + payout_accounts, không cần bảng mới. Phải chuẩn hóa list về data.summary/data.items/meta và mask số tài khoản.

ADM-04 – Quản lý khóa học

Trang: pages/courses.htmlTrạng thái nối: TẬN DỤNG API, CHỜ TÁCH LIST/DETAIL RESOURCE

Endpoint cuối cùng

GET   /api/admin/courses
GET   /api/admin/courses/{id}
PATCH /api/admin/courses/{id}

Query/body FE được phép gửi

List:
page, per_page, search, status, instructor_id, category_id, level,
is_featured?, date_from?, date_to?, sort_by, sort_direction

Update:
is_featured?
status? chỉ dùng cho published/hidden theo transition BE

Field FE đọc

List item:
- id, title, slug, thumbnail_url
- price, sale_price, level, language
- status, is_featured, published_at, updated_at
- instructor { id, full_name, email, status }
- categories[]
- enrollment_count
- paid_order_count
- gross_revenue
- average_rating
- review_count

Detail:
- toàn bộ field list
- short_description, description, intro_video_url
- requirements, outcomes, total_duration_seconds, admin_reject_reason
- summary { section_count, lesson_count, asset_count, enrollment_count, gross_revenue, average_rating }

UI được triển khai

Summary card, table, detail tab, featured/unfeatured, hide/show và link sang review/order/revenue.

FE không được làm

Không cho Admin sửa title, slug, mô tả, giá hoặc nội dung khóa học thay giảng viên. Không dùng PATCH chung để approve/reject.

Điều kiện BE trước khi bỏ mock

BE phải giới hạn UpdateAdminCourseRequest, thêm aggregate và tạo resource list/detail riêng.

ADM-05 – Kiểm duyệt khóa học

Trang: pages/course-reviews.htmlTrạng thái nối: CHỜ BE BỎ LOGIC CREDIT CŨ

Endpoint cuối cùng

GET   /api/admin/course-reviews
GET   /api/admin/course-reviews/{id}
PATCH /api/admin/courses/{id}/approve
PATCH /api/admin/courses/{id}/reject

Query/body FE được phép gửi

List:
page, per_page, search, sort

Reject body:
admin_reject_reason: required|string|max:1000

Field FE đọc

List:
data.summary { pending_count, approved_today, rejected_today }
data.items[] {
  id, instructor, title, slug, short_description,
  thumbnail_url, price, sale_price, level, language,
  status, total_duration_seconds, created_at, updated_at
}

Detail:
- course
- sections[]/lessons[]
- checklist {
    passed, missing_items, warnings, summary, checks
  }

Action response:
- id, instructor_id, title, slug, status,
  admin_reject_reason, published_at, created_at, updated_at, instructor

UI được triển khai

Danh sách pending, xem chi tiết/checklist, approve, reject có lý do.

FE không được làm

Không gọi logic trừ lượt tạo khóa học. Không tự kết luận checklist từ HTML.

Điều kiện BE trước khi bỏ mock

Route approve/reject phải chuyển khỏi AdminCourseApprovalController/CourseCreditService sang CourseModerationService; status chỉ pending_review mới xử lý.

ADM-06 – Quản lý danh mục

Trang: pages/categories.htmlTrạng thái nối: TẬN DỤNG CRUD, CHỜ COURSE_COUNT/SUMMARY

Endpoint cuối cùng

GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/categories/{id}
PATCH  /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

Query/body FE được phép gửi

List:
page, per_page, search, status, parent_id, sort_by, sort_direction

Create:
name, slug, parent_id?, description?, sort_order?, status?

Update:
name?, slug?, parent_id?, description?, sort_order?, status?

Field FE đọc

data.summary:
- total_categories
- active_categories
- inactive_categories
- root_categories
- empty_categories

items/detail:
- id, parent_id, name, slug, description, sort_order, status
- course_count
- created_at, updated_at
- parent?
- children?

UI được triển khai

Summary, table, create/edit, đổi parent, đổi sort_order, active/inactive và xóa mềm.

FE không được làm

Không tự build full tree từ một trang paginator. Không xóa khi còn children/course.

Điều kiện BE trước khi bỏ mock

BE thêm withCount(courses), summary và đổi lỗi category đang được dùng thành 409.

ADM-07 – Đơn hàng / Thanh toán

Trang: pages/orders.htmlTrạng thái nối: TẬN DỤNG LIST, THÊM DETAIL

Endpoint cuối cùng

GET /api/admin/orders
GET /api/admin/orders/{id}

Query/body FE được phép gửi

page, per_page, status, payment_status,
user_id, course_id, order_code, date_from, date_to

Field FE đọc

data.summary:
- total_orders
- pending_orders
- paid_orders
- failed_orders
- cancelled_orders
- expired_orders
- paid_amount
- average_order_value
- payment_success_rate
- anomaly_count

items[]:
- id, order_code, status, payment_status, payment_method
- provider_transaction_id
- price_snapshot, amount, discount_amount
- paid_at, created_at, updated_at
- user { id, full_name, email, role, status }
- course { id, title, slug, status, price, sale_price }
- coupon { id, code, name, discount_type, discount_value, status }

detail thêm:
- enrollment?
- revenue?
- consistency {
    paid_has_enrollment,
    paid_has_revenue,
    amounts_match
  }
- timeline[]

UI được triển khai

Summary, filter, bảng, detail, link sang user/course/revenue và badge cảnh báo dữ liệu.

FE không được làm

Không có nút mark-paid hoặc mark-failed thủ công trong GD1. Payment/VNPAY callback là nguồn quyết định. Không tạo enrollment/revenue từ FE.

Điều kiện BE trước khi bỏ mock

BE thêm detail và summary; AdminOrderResource thêm discount_amount tính từ price_snapshot - amount; đối chiếu enrollment/revenue.

ADM-08 – Doanh thu / Chia lợi nhuận

Trang: pages/revenues.htmlTrạng thái nối: CHỜ BE FIX TỶ LỆ VÀ THÊM LIST/DETAIL

Endpoint cuối cùng

GET /api/admin/revenues
GET /api/admin/revenues/{id}
GET /api/admin/reports/revenue

Query/body FE được phép gửi

List:
page, per_page, date_from, date_to,
instructor_id, course_id, order_id, status,
sort_by, sort_direction

Report:
page, per_page, date_from, date_to, month, year,
course_id, instructor_id, group_by=day|month,
sort_by, sort_direction

Field FE đọc

Revenue list summary:
- total_gross_amount
- total_instructor_amount
- total_platform_fee_amount
- available_amount
- withdrawn_amount
- cancelled_amount
- inconsistent_count

items/detail:
- id
- gross_amount
- instructor_amount
- platform_fee_amount
- status
- earned_at
- amount_consistent
- instructor_rate
- platform_rate
- order { id, order_code, amount, status, payment_status, paid_at }
- course { id, title, slug }
- instructor { id, full_name, email }

Report item:
- period
- gross_amount
- instructor_amount
- platform_fee_amount
- order_count
- course_count
- instructor_count

UI được triển khai

Summary, biểu đồ từ report, bảng revenue, detail đối chiếu và link sang order/course/instructor.

FE không được làm

Không tự chia 70/30. Không sửa trực tiếp amount/status. Không coi revenue pending/cancelled là doanh thu hợp lệ.

Điều kiện BE trước khi bỏ mock

PaymentService phải tạo revenue theo config 70/30, status available và earned_at; report phải dùng revenues, không fallback orders với phần chia bằng 0.

ADM-09 – Yêu cầu rút tiền

Trang: pages/withdrawals.htmlTrạng thái nối: CHỜ FIX NỀN WITHDRAWAL + ADMIN API

Endpoint cuối cùng

GET   /api/admin/withdrawals
GET   /api/admin/withdrawals/{id}
PATCH /api/admin/withdrawals/{id}/approve
PATCH /api/admin/withdrawals/{id}/reject
PATCH /api/admin/withdrawals/{id}/mark-paid

Query/body FE được phép gửi

List:
page, per_page, search, user_id, status,
date_from, date_to, amount_min, amount_max

Approve: không body

Reject:
rejected_reason: required|string|max:1000

Mark paid:
provider_payout_id: required|string|max:255

Field FE đọc

data.summary:
- total_requests
- pending_count
- approved_count
- rejected_count
- paid_count
- cancelled_count
- reserved_amount
- approved_amount
- paid_amount

items/detail:
- id, display_code
- user { id, full_name, email }
- amount
- status
- requested_at, approved_at, paid_at
- rejected_reason
- provider_payout_id
- payout_account {
    id, provider, account_name, account_number_masked, status
  }
- account_snapshot {
    account_name, account_number_masked
  }
- available_revenue
- reserved_amount
- available_balance
- timeline[]
- allocations[] chỉ ở detail

UI được triển khai

Summary, bảng, detail, approve/reject/mark-paid và link sang instructor/payout account.

FE không được làm

Không tự tính balance. Không approve/paid hai lần. Không hiển thị full snapshot trong list.

Điều kiện BE trước khi bỏ mock

BE phải sửa route/service withdrawal instructor bị trùng; sau đó thêm Admin API. Cần migration allocation được duyệt để chống rút trùng và xử lý rút một phần.

ADM-10 – Tài khoản nhận tiền

Trang: pages/payout-accounts.htmlTrạng thái nối: CHỜ ADMIN API VÀ CHUẨN HÓA STATUS

Endpoint cuối cùng

GET   /api/admin/payout-accounts
GET   /api/admin/payout-accounts/{id}
PATCH /api/admin/payout-accounts/{id}/approve
PATCH /api/admin/payout-accounts/{id}/reject
PATCH /api/admin/payout-accounts/{id}/disable

Query/body FE được phép gửi

List:
page, per_page, search, user_id, provider, status

Action: không body

Field FE đọc

data.summary:
- total_accounts
- active_count
- pending_verification_count
- rejected_count
- inactive_count

items:
- id
- user { id, full_name, email }
- provider
- account_name
- account_number_masked
- status
- connected_at
- created_at
- withdrawal_count

detail thêm:
- account_number
- related_withdrawals[]

UI được triển khai

Summary, filter, table, detail, approve/reject/disable.

FE không được làm

Không dùng status pending; dùng pending_verification. Không hiển thị full account number trong list. Không hard delete.

Điều kiện BE trước khi bỏ mock

BE chuẩn hóa model/request/resource về active|pending_verification|rejected|inactive và thêm Admin API.

ADM-11 – Kiểm duyệt bình luận / Đánh giá

Trang: pages/moderation.htmlTrạng thái nối: GIỮ PATCH, THÊM LIST/DETAIL

Endpoint cuối cùng

GET   /api/admin/moderation/items
GET   /api/admin/moderation/items/{targetType}/{id}
PATCH /api/admin/moderation/items/{id}

Query/body FE được phép gửi

List:
page, per_page, target_type=comment|review,
search, user_id, course_id, lesson_id,
status, rating, date_from, date_to

PATCH body:
target_type: comment|review
status:
- comment: visible|hidden|deleted
- review: visible|deleted

Field FE đọc

data.summary:
- total_comments
- visible_comments
- hidden_comments
- deleted_comments
- total_reviews
- deleted_reviews
- average_rating
- low_rating_count

items/detail normalized:
- target_type
- id
- status
- author { id, full_name, email }
- content
- rating?
- course { id, title, slug }
- lesson?
- parent_id?
- replies?
- order_proof?
- created_at
- updated_at

UI được triển khai

Hai tab comment/review, filter, detail ngữ cảnh, hide/restore/delete logic.

FE không được làm

Không gửi status hidden cho review. Không hiển thị ô reason vì BE hiện không lưu reason. Không nhầm cùng ID giữa hai bảng.

Điều kiện BE trước khi bỏ mock

BE thêm list/detail, validate status theo target_type và bỏ field reason nếu không có audit storage.

ADM-12 – Báo cáo và thống kê

Trang: pages/reports.htmlTrạng thái nối: TẬN DỤNG API, CHỜ FIX SOURCE DOANH THU

Endpoint cuối cùng

GET /api/admin/reports/revenue
GET /api/admin/reports/top-courses
GET /api/admin/reports/instructors

Query/body FE được phép gửi

page, per_page, date_from, date_to,
month, year, course_id,
instructor_id chỉ revenue,
group_by=day|month chỉ revenue,
sort_by, sort_direction

Field FE đọc

Revenue:
data.summary {
  total_gross_amount,
  total_instructor_amount,
  total_platform_fee_amount,
  order_count, course_count, instructor_count
}
data.items[] {
  period, gross_amount, instructor_amount,
  platform_fee_amount, order_count,
  course_count, instructor_count
}

Top courses:
data.summary { total_courses, total_sold, total_revenue, total_completed }
data.items[] {
  course_id, title, slug, status, price, sale_price,
  instructor, sold_count, enrollment_count,
  completed_count, completion_rate,
  total_revenue, last_paid_at
}

Top instructors:
data.items[] {
  instructor_id, full_name, email, role, status,
  total_courses, published_courses, total_sold,
  total_enrollments, total_completed, completion_rate,
  total_revenue, instructor_amount,
  platform_fee_amount, last_activity_at
}

UI được triển khai

Biểu đồ revenue và hai bảng xếp hạng. Drill-down bằng link sang course/revenue/instructor.

FE không được làm

Không yêu cầu reports/orders, reports/learners hoặc export trong GD1 nếu chưa có nghiệp vụ. Không tự tính phần chia.

Điều kiện BE trước khi bỏ mock

BE bỏ fallback orders cho revenue split, sửa top instructor lấy instructor/platform amount từ revenues và thêm active.user middleware.

ADM-13 – Banner / Trang chủ

Trang: pages/banners.htmlTrạng thái nối: TẬN DỤNG CRUD, CHỜ FIX RESPONSE

Endpoint cuối cùng

GET    /api/admin/banners
POST   /api/admin/banners
GET    /api/admin/banners/{id}
PATCH  /api/admin/banners/{id}
DELETE /api/admin/banners/{id}

Query/body FE được phép gửi

List:
page, per_page, search?, position?, status?

Create:
title, image_url, target_url?, position,
sort_order?, start_at?, end_at?, status

Update:
các field trên theo PATCH

Field FE đọc

data.summary:
- total_banners
- active_count
- inactive_count
- scheduled_count
- expired_count

items/detail:
- id
- title
- image_url
- target_url
- position
- sort_order
- start_at
- end_at
- status
- effective_status
- is_currently_visible
- created_at
- updated_at

UI được triển khai

Summary, table/card preview, create/edit, active/inactive, schedule và delete.

FE không được làm

Không đọc banner_id; chỉ dùng id. Không parse data lần hai bằng JSON.parse. Không gửi scheduled/expired về status.

Điều kiện BE trước khi bỏ mock

BE phải trả BannerResource object thay vì json_encode string, bỏ field banner_id, thêm filter/summary/effective_status và sửa import ApiResponse sai namespace.

ADM-14 – FAQ

Trang: pages/faqs.htmlTrạng thái nối: CHỜ API MỚI

Endpoint cuối cùng

GET    /api/admin/faqs
POST   /api/admin/faqs
GET    /api/admin/faqs/{id}
PATCH  /api/admin/faqs/{id}
DELETE /api/admin/faqs/{id}
PATCH  /api/admin/faqs/{id}/courses

Query/body FE được phép gửi

List:
page, per_page, search, type, status, course_id,
sort_by, sort_direction

Create/update:
question, answer, type, status, sort_order

Sync courses:
course_ids: integer[]

Field FE đọc

data.summary:
- total_faqs
- active_count
- inactive_count
- unlinked_count
- linked_course_count

items/detail:
- id
- question
- answer
- type
- status
- sort_order
- course_count
- linked_courses[]
- created_at
- updated_at

UI được triển khai

Summary, CRUD, active/inactive, link khóa học và sort_order.

FE không được làm

Không tạo bảng FAQ mới. Không gửi pivot ID; chỉ gửi course_ids.

Điều kiện BE trước khi bỏ mock

BE thêm API dựa trên faqs và course_faqs hiện có, sync pivot trong transaction.

SYS-01 – Thông báo Admin

Trang: pages/notifications.htmlTrạng thái: CHỜ API MỚI

Endpoint

GET   /api/admin/notifications
GET   /api/admin/notifications/unread-count
PATCH /api/admin/notifications/{id}/read
PATCH /api/admin/notifications/read-all

Field

summary { unread_count, total_count }
items[] {
  id, type, title, message, data,
  action_url, channel, read_at, created_at
}

Chỉ đọc notification có user_id là Admin đang đăng nhập.

5. API không được nối vào sidebar Admin mới

/api/admin/credit-packages
/api/admin/instructors/{id}/credits
/api/admin/instructors/{id}/credit-transactions
/api/admin/roles
/api/admin/campaigns

Các route trên là legacy hoặc 501. FE mới không gọi.

6. Thứ tự nối API đúng

BE sửa contract chung và lỗi critical.

Dashboard, users, categories.

Courses và course review.

Orders detail.

Revenue 70/30 và revenue list/detail.

Chốt migration withdrawal allocation.

Withdrawal và payout account.

Moderation.

Reports.

Banner.

FAQ.

Notifications.

Xóa mock data.

7. Definition of Done FE

Mỗi endpoint có đúng query/body trong tài liệu.

Không đọc field ngoài contract.

Không có adapter đoán nhiều tên field.

Không còn data-source="mock" ở module đã hoàn thành.

Filter/sort/page giữ trong URL.

Có loading, empty, error, 401, 403, 404, 409, 422.

Mutation disable nút và chống double click.

Tiền chỉ format để hiển thị.

Status raw dùng cho logic, label dùng cho UI.

Không có lỗi Console/Network.

npm run build:css thành công.