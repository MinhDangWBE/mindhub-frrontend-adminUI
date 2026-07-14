# Báo cáo Kiểm tra Tính Toàn vẹn Dữ liệu Mock - MindHub Admin

> [!NOTE]
> Báo cáo này được tự động tạo sau khi rà soát và cấu trúc lại toàn bộ dữ liệu mock của dự án.
> Toàn bộ dữ liệu hiện được tập trung về một nguồn duy nhất (Single Source of Truth) tại [mock-database.js](file:///d:/DỰ%20ÁN%20TỐT%20NGHIỆP/mô%20tả%20của%20Trello/gd3/fe-admin/assets/js/mocks/mock-database.js).

---

## 1. Thống Kê Tổng Quan Hệ Thống

| Thực thể | Số lượng bản ghi | Ghi chú |
| :--- | :--- | :--- |
| **Người dùng (Users)** | 47 | 19 học viên, 25 giảng viên, 3 admin |
| **Danh mục (Categories)** | 5 | Quản lý danh mục khóa học chuẩn |
| **Khóa học (Courses)** | 18 | Xem chi tiết phân phối trạng thái bên dưới |
| **Kiểm duyệt khóa học (Course Reviews)** | 12 | Chứa các phần sections, lessons và checklist |
| **Nâng cấp giảng viên (Upgrades)** | 12 | Đơn đăng ký nâng cấp tài khoản |
| **Đơn hàng (Orders)** | 9 | Chi tiết đơn hàng thanh toán |
| **Đăng ký học (Enrollments)** | 6 | Tiến trình và trạng thái học tập của học viên |
| **Doanh thu (Revenues)** | 6 | Khớp 100% với các đơn hàng đã thanh toán |
| **Tài khoản liên kết (Payout Accounts)** | 25 | Tài khoản ngân hàng của giảng viên |
| **Yêu cầu rút tiền (Withdrawals)** | 4 | Lịch sử rút tiền của giảng viên |
| **Bình luận (Comments)** | 0 | Sẵn sàng cho việc phát triển tương lai |
| **Đánh giá (Reviews)** | 0 | Sẵn sàng cho việc phát triển tương lai |

### Phân phối trạng thái Khóa học (Courses by Status)
- **Draft (Bản nháp)**: 3
- **Pending Review (Chờ duyệt)**: 3
- **Approved (Đã duyệt chuyên môn)**: 2
- **Rejected (Từ chối duyệt)**: 2
- **Published (Đã xuất bản)**: 6
- **Hidden (Tạm ẩn)**: 2

---

## 2. Kết Quả Kiểm Tra Referential Integrity

> [!IMPORTANT]
> Script kiểm tra toàn vẹn liên kết dữ liệu [validate-mock-data.cjs](file:///d:/DỰ%20ÁN%20TỐT%20NGHIỆP/mô%20tả%20của%20Trello/gd3/fe-admin/scripts/validate-mock-data.cjs) đã chạy và trả về kết quả:

- **Số lỗi Foreign Key**: 0
- **Số ID trùng lặp (Duplicate IDs)**: 0
- **Số Course Mismatch**: 0
- **Số Amount/Revenue Mismatch**: 0
- **Số Ngày sai định dạng ISO 8601**: 0

### KẾT LUẬN CUỐI CÙNG: **PASS** ✅
