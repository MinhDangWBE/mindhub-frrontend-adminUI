/**
 * MindHub Admin Unified Mock Database
 * Single source of truth cho tất cả dữ liệu mock trong hệ thống.
 */

export const MOCK_DB = {
  "users": [
    {
      "id": 1,
      "full_name": "Administrator",
      "email": "admin@mindhub.edu.vn",
      "phone": "0901234567",
      "role": "admin",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-01-01T08:00:00Z",
      "last_login_at": "2026-07-13T15:30:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-01-01T08:00:00Z",
      "updated_at": "2026-07-13T15:30:00Z",
      "deleted_at": null
    },
    {
      "id": 2,
      "full_name": "Nguyễn Văn Học",
      "email": "hoc.nguyen@gmail.com",
      "phone": "0912345678",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-10T09:00:00Z",
      "last_login_at": "2026-07-12T20:15:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-10T08:30:00Z",
      "updated_at": "2026-07-12T20:15:00Z",
      "deleted_at": null
    },
    {
      "id": 3,
      "full_name": "Trần Thị Dạy",
      "email": "day.tran@mindhub.edu.vn",
      "phone": "0923456789",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-09T14:30:00Z",
      "last_login_at": "2026-07-13T09:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-09T10:00:00Z",
      "updated_at": "2026-07-13T09:00:00Z",
      "deleted_at": null
    },
    {
      "id": 4,
      "full_name": "Lê Văn Khóa",
      "email": "khoa.le@gmail.com",
      "phone": "0934567890",
      "role": "learner",
      "status": "locked",
      "effective_status": "locked",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-15T10:00:00Z",
      "last_login_at": "2026-07-01T14:00:00Z",
      "locked": true,
      "locked_reason": "Vi phạm điều khoản cộng đồng: Spam tin nhắn quảng cáo",
      "created_at": "2026-06-15T09:00:00Z",
      "updated_at": "2026-07-05T16:20:00Z",
      "deleted_at": null
    },
    {
      "id": 5,
      "full_name": "Phạm Chưa Xác Minh",
      "email": "verify.pham@gmail.com",
      "phone": "0945678901",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": true,
      "email_verified_at": null,
      "last_login_at": "2026-07-12T11:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-12T10:45:00Z",
      "updated_at": "2026-07-12T11:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6,
      "full_name": "Hoàng Tạm Ngưng",
      "email": "ngung.hoang@gmail.com",
      "phone": "0956789012",
      "role": "instructor",
      "status": "inactive",
      "effective_status": "inactive",
      "oauth_account_login": false,
      "email_verified_at": "2026-05-20T11:00:00Z",
      "last_login_at": "2026-06-30T10:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-05-20T10:30:00Z",
      "updated_at": "2026-06-30T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 7,
      "full_name": "Nguyễn Văn Admin Phụ",
      "email": "subadmin@mindhub.edu.vn",
      "phone": "0967890123",
      "role": "admin",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-02-10T08:00:00Z",
      "last_login_at": "2026-07-13T10:15:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-02-10T08:00:00Z",
      "updated_at": "2026-07-13T10:15:00Z",
      "deleted_at": null
    },
    {
      "id": 8,
      "full_name": "Vũ Học Viên Google",
      "email": "vu.google@gmail.com",
      "phone": null,
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": true,
      "email_verified_at": "2026-07-08T15:00:00Z",
      "last_login_at": "2026-07-08T15:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-08T15:00:00Z",
      "updated_at": "2026-07-08T15:00:00Z",
      "deleted_at": null
    },
    {
      "id": 9,
      "full_name": "Lê Giảng Viên Xịn",
      "email": "xin.le@mindhub.edu.vn",
      "phone": "0987654321",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T09:00:00Z",
      "last_login_at": "2026-07-13T14:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:30:00Z",
      "updated_at": "2026-07-13T14:00:00Z",
      "deleted_at": null
    },
    {
      "id": 10,
      "full_name": "Đỗ Bị Khóa Lần Nữa",
      "email": "khoa.do@gmail.com",
      "phone": "0976543210",
      "role": "learner",
      "status": "locked",
      "effective_status": "locked",
      "oauth_account_login": false,
      "email_verified_at": "2026-05-10T14:00:00Z",
      "last_login_at": "2026-06-20T08:00:00Z",
      "locked": true,
      "locked_reason": "Đăng tải tài nguyên vi phạm bản quyền khóa học khác",
      "created_at": "2026-05-10T10:00:00Z",
      "updated_at": "2026-06-25T11:45:00Z",
      "deleted_at": null
    },
    {
      "id": 11,
      "full_name": "Hoàng Học Viên Chăm",
      "email": "cham.hoang@gmail.com",
      "phone": "0965432109",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-02T10:00:00Z",
      "last_login_at": "2026-07-13T12:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-02T09:30:00Z",
      "updated_at": "2026-07-13T12:00:00Z",
      "deleted_at": null
    },
    {
      "id": 12,
      "full_name": "Phạm Thầy Giáo Trẻ",
      "email": "tre.pham@gmail.com",
      "phone": "0954321098",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-28T09:00:00Z",
      "last_login_at": "2026-07-11T16:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-06-28T08:00:00Z",
      "updated_at": "2026-07-11T16:00:00Z",
      "deleted_at": null
    },
    {
      "id": 13,
      "full_name": "Nguyễn Học Viên Mới",
      "email": "moi.nguyen@gmail.com",
      "phone": "0943210987",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-13T08:00:00Z",
      "last_login_at": "2026-07-13T08:15:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-13T07:45:00Z",
      "updated_at": "2026-07-13T08:15:00Z",
      "deleted_at": null
    },
    {
      "id": 14,
      "full_name": "Bùi Offline",
      "email": "offline.bui@gmail.com",
      "phone": "0932109876",
      "role": "learner",
      "status": "inactive",
      "effective_status": "inactive",
      "oauth_account_login": false,
      "email_verified_at": "2026-04-12T10:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-04-12T09:00:00Z",
      "updated_at": "2026-04-12T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 15,
      "full_name": "Ngô Giảng Viên Hưu",
      "email": "huu.ngo@gmail.com",
      "phone": "0921098765",
      "role": "instructor",
      "status": "inactive",
      "effective_status": "inactive",
      "oauth_account_login": false,
      "email_verified_at": "2026-03-01T08:00:00Z",
      "last_login_at": "2026-05-15T09:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-03-01T08:00:00Z",
      "updated_at": "2026-05-15T09:00:00Z",
      "deleted_at": null
    },
    {
      "id": 16,
      "full_name": "Đặng Siêu Admin",
      "email": "superadmin@mindhub.edu.vn",
      "phone": "0910987654",
      "role": "admin",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-01-05T08:00:00Z",
      "last_login_at": "2026-07-13T14:45:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-01-05T08:00:00Z",
      "updated_at": "2026-07-13T14:45:00Z",
      "deleted_at": null
    },
    {
      "id": 17,
      "full_name": "Trần Học Sinh Ngoan",
      "email": "ngoan.tran@gmail.com",
      "phone": "0909876543",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": true,
      "email_verified_at": "2026-07-05T14:00:00Z",
      "last_login_at": "2026-07-06T10:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-05T13:30:00Z",
      "updated_at": "2026-07-06T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 18,
      "full_name": "Dương Giáo Sư",
      "email": "professor.duong@mindhub.edu.vn",
      "phone": "0998765432",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-04T09:00:00Z",
      "last_login_at": "2026-07-12T17:00:00Z",
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-04T08:00:00Z",
      "updated_at": "2026-07-12T17:00:00Z",
      "deleted_at": null
    },
    {
      "id": 19,
      "full_name": "Phan Spam Khóa",
      "email": "spam.phan@gmail.com",
      "phone": "0989876543",
      "role": "learner",
      "status": "locked",
      "effective_status": "locked",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-20T10:00:00Z",
      "last_login_at": "2026-06-20T10:05:00Z",
      "locked": true,
      "locked_reason": "Gửi tin nhắn quấy rối giảng viên và các học viên khác",
      "created_at": "2026-06-20T09:50:00Z",
      "updated_at": "2026-06-21T08:30:00Z",
      "deleted_at": null
    },
    {
      "id": 20,
      "full_name": "Lê Chưa Đăng Nhập",
      "email": "no_login.le@gmail.com",
      "phone": "0978901234",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": null,
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-11T14:00:00Z",
      "updated_at": "2026-07-11T14:00:00Z",
      "deleted_at": null
    },
    {
      "id": 206,
      "full_name": "Lê Thị B",
      "email": "b.le@mindhub.edu.vn",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 205,
      "full_name": "Nguyễn Văn A",
      "email": "a.nguyen@mindhub.edu.vn",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 201,
      "full_name": "Đặng Tuấn Kiệt",
      "email": "kiet.dang@gmail.com",
      "phone": "0901112222",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T10:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 202,
      "full_name": "Trần Quốc Huy",
      "email": "huy.tran@gmail.com",
      "phone": "0912223333",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-02T11:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 203,
      "full_name": "Lê Thảo Vy",
      "email": "vy.le@gmail.com",
      "phone": "0923334444",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-05T09:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 204,
      "full_name": "Phạm Hoàng Nam",
      "email": "nam.pham@gmail.com",
      "phone": "0934445555",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 215,
      "full_name": "Võ Gia Hân",
      "email": "han.vo@gmail.com",
      "phone": "0945556666",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-06T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 216,
      "full_name": "Nguyễn Minh Anh",
      "email": "minhanh.nguyen@gmail.com",
      "phone": "0956667777",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-25T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 207,
      "full_name": "Bùi Ngọc Mai",
      "email": "mai.bui@gmail.com",
      "phone": "0967778888",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-20T14:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 208,
      "full_name": "Hồ Đức Long",
      "email": "long.ho@gmail.com",
      "phone": "0978889999",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-28T09:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 209,
      "full_name": "Nguyễn Thanh Trúc",
      "email": "truc.nguyen@gmail.com",
      "phone": "0989990000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-18T10:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 210,
      "full_name": "Trần Anh Khoa",
      "email": "khoa.tran@gmail.com",
      "phone": "0902221111",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-30T09:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 211,
      "full_name": "Lý Minh Châu",
      "email": "chau.ly@gmail.com",
      "phone": "0913332222",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 212,
      "full_name": "Phan Quốc Bảo",
      "email": "bao.phan@gmail.com",
      "phone": "0924443333",
      "role": "learner",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-06-25T11:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 30,
      "full_name": "Phạm Quốc Bảo",
      "email": "bao.pq@mindhub.edu.vn",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 32,
      "full_name": "ThS. Nguyễn Văn Anh",
      "email": "anhnv.tech@mindhub.edu.vn",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 38,
      "full_name": "Trần Minh Hoàng",
      "email": "hoangtm.frontend@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 25,
      "full_name": "Lê Thị Thảo Linh",
      "email": "linhltt.design@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 31,
      "full_name": "Phạm Quốc Bảo",
      "email": "baopq.devops@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 42,
      "full_name": "Đặng Tiến Dũng",
      "email": "dungdt.backend@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 55,
      "full_name": "Vũ Hải Đăng",
      "email": "dangvh.data@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 61,
      "full_name": "Bùi Hoàng Nam",
      "email": "nambh.dba@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 72,
      "full_name": "Ngô Quang Huy",
      "email": "huynq.fullstack@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 84,
      "full_name": "Lê Mỹ Duyên",
      "email": "duyenlmd.marketing@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 91,
      "full_name": "Phan Văn Đức",
      "email": "ducpv.vue@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 98,
      "full_name": "Hoàng Văn Tuấn",
      "email": "tuanhv.dev@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 105,
      "full_name": "Đỗ Kim Anh",
      "email": "anhdk.qa@gmail.com",
      "phone": "0900000000",
      "role": "instructor",
      "status": "active",
      "effective_status": "active",
      "oauth_account_login": false,
      "email_verified_at": "2026-07-01T08:00:00Z",
      "last_login_at": null,
      "locked": false,
      "locked_reason": null,
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    }
  ],
  "categories": [
    {
      "id": 2001,
      "parent_id": null,
      "name": "Lập trình Web",
      "slug": "lap-trinh-web",
      "status": "active",
      "sort_order": 1,
      "description": "Học phát triển ứng dụng web từ cơ bản đến nâng cao.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2002,
      "parent_id": null,
      "name": "Lập trình Mobile",
      "slug": "lap-trinh-mobile",
      "status": "active",
      "sort_order": 2,
      "description": "Thiết kế và phát triển ứng dụng di động đa nền tảng.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2003,
      "parent_id": null,
      "name": "Thiết kế Đồ họa / UI-UX",
      "slug": "thiet-ke-ui-ux",
      "status": "active",
      "sort_order": 3,
      "description": "Học thiết kế đồ họa chuyên nghiệp và giao diện UI/UX.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2004,
      "parent_id": null,
      "name": "Phân tích dữ liệu & AI",
      "slug": "phan-tich-du-lieu-ai",
      "status": "active",
      "sort_order": 4,
      "description": "Khám phá khoa học dữ liệu và các mô hình trí tuệ nhân tạo.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2005,
      "parent_id": null,
      "name": "Marketing số & SEO",
      "slug": "marketing-so-seo",
      "status": "active",
      "sort_order": 5,
      "description": "Tối ưu hóa tìm kiếm và các chiến dịch quảng cáo kỹ thuật số.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2006,
      "parent_id": 2001,
      "name": "Frontend",
      "slug": "frontend",
      "status": "active",
      "sort_order": 1,
      "description": "Học HTML, CSS, JavaScript, ReactJS, TailwindCSS.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2007,
      "parent_id": 2001,
      "name": "Backend",
      "slug": "backend",
      "status": "active",
      "sort_order": 2,
      "description": "Xây dựng hệ thống backend với NodeJS, Laravel, Python.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2008,
      "parent_id": 2002,
      "name": "React Native",
      "slug": "react-native",
      "status": "active",
      "sort_order": 1,
      "description": "Phát triển app mobile bằng React Native.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2009,
      "parent_id": 2002,
      "name": "Flutter",
      "slug": "flutter",
      "status": "active",
      "sort_order": 2,
      "description": "Xây dựng ứng dụng di động với Flutter và Dart.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2010,
      "parent_id": null,
      "name": "Danh mục rỗng ngừng hoạt động",
      "slug": "danh-muc-rong-ngung-hoat-dong",
      "status": "inactive",
      "sort_order": 6,
      "description": "Danh mục cũ không còn được sử dụng, không có khóa học và không có danh mục con. Được phép xóa.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2011,
      "parent_id": null,
      "name": "Danh mục có con ngừng hoạt động",
      "slug": "danh-muc-co-con-ngung-hoat-dong",
      "status": "inactive",
      "sort_order": 7,
      "description": "Danh mục gốc đã ngừng hoạt động nhưng chứa danh mục con bên dưới.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2012,
      "parent_id": 2011,
      "name": "Danh mục con ngừng hoạt động",
      "slug": "danh-muc-con-ngung-hoat-dong",
      "status": "inactive",
      "sort_order": 1,
      "description": "Danh mục con thuộc danh mục đã ngừng hoạt động.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2013,
      "parent_id": null,
      "name": "Danh mục có khóa học ngừng hoạt động",
      "slug": "danh-muc-co-khoa-hoc-ngung-hoat-dong",
      "status": "inactive",
      "sort_order": 8,
      "description": "Danh mục đã ngừng hoạt động nhưng vẫn có khóa học liên kết.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-01T08:00:00Z",
      "deleted_at": null
    },
    {
      "id": 2014,
      "parent_id": null,
      "name": "Bảo mật & Hacking đạo đức (Đã xóa)",
      "slug": "bao-mat-hacking-dao-duc-da-xoa",
      "status": "inactive",
      "sort_order": 9,
      "description": "Danh mục đã bị xóa mềm trước đó.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-10T10:00:00Z",
      "deleted_at": "2026-07-10T10:00:00Z"
    },
    {
      "id": 2015,
      "parent_id": 2001,
      "name": "VueJS & NuxtJS (Đã xóa)",
      "slug": "vuejs-nuxtjs-da-xoa",
      "status": "inactive",
      "sort_order": 3,
      "description": "Danh mục con thuộc Lập trình Web đã bị xóa mềm.",
      "created_at": "2026-07-01T08:00:00Z",
      "updated_at": "2026-07-11T14:30:00Z",
      "deleted_at": "2026-07-11T14:30:00Z"
    }
  ],
  "courses": [
    {
      "id": 1001,
      "title": "Laravel REST API từ cơ bản đến thực chiến",
      "slug": "laravel-rest-api-tu-co-ban-den-thuc-chien",
      "thumbnail_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80",
      "short_description": "Học cách xây dựng hệ thống RESTful API chuẩn REST, bảo mật với Passport/Sanctum và deploy dự án lên production.",
      "description": "Khóa học này sẽ hướng dẫn bạn từ các khái niệm cơ bản về HTTP Request/Response đến việc thiết kế Database chuẩn, tối ưu hóa câu lệnh Eloquent và xử lý cơ chế Authentication. Bạn cũng sẽ học cách viết tài liệu API tự động với Swagger và viết Unit Test cho API.",
      "price": 799000,
      "sale_price": 499000,
      "level": "beginner",
      "language": "vi",
      "status": "published",
      "is_featured": true,
      "published_at": "2026-02-01T08:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-12T09:00:00Z",
      "total_duration_seconds": 45000,
      "instructor_id": 3,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1002,
      "title": "React và TypeScript chuyên sâu",
      "slug": "react-va-typescript-chuyen-sau",
      "thumbnail_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80",
      "short_description": "Làm chủ React 18, React Router v6, Redux Toolkit kết hợp cùng sức mạnh kiểm soát kiểu dữ liệu của TypeScript.",
      "description": "Khóa học chuyên sâu dành cho các bạn muốn nâng cao tay nghề thiết kế UI với React. Học về Custom Hooks, Render Props, React.lazy, SSR với Next.js và cách config TypeScript trong các component phức tạp.",
      "price": 1299000,
      "sale_price": 999000,
      "level": "advanced",
      "language": "vi",
      "status": "published",
      "is_featured": true,
      "published_at": "2026-03-10T10:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T08:00:00Z",
      "total_duration_seconds": 57600,
      "instructor_id": 3,
      "category_ids": [
        2001,
        2002
      ]
    },
    {
      "id": 1003,
      "title": "Thiết kế UI/UX cho sản phẩm số",
      "slug": "thiet-ke-ui-ux-cho-san-pham-so",
      "thumbnail_url": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&auto=format&fit=crop&q=80",
      "short_description": "Học tư duy thiết kế, cách làm wireframe, thiết kế giao diện bằng Figma và tối ưu hóa trải nghiệm người dùng.",
      "description": "Khóa học sẽ giúp bạn chuyển từ vai trò vẽ giao diện thông thường thành một UX Designer thực thụ. Học cách phân tích hành vi, vẽ User Flow, tạo Prototype tương tác cao và tiến hành A/B testing sản phẩm thực tế.",
      "price": 899000,
      "sale_price": null,
      "level": "intermediate",
      "language": "vi",
      "status": "pending_review",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-13T16:00:00Z",
      "total_duration_seconds": 36000,
      "instructor_id": 206,
      "category_ids": [
        2003
      ]
    },
    {
      "id": 1004,
      "title": "Node.js Backend Architecture",
      "slug": "node-js-backend-architecture",
      "thumbnail_url": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format&fit=crop&q=80",
      "short_description": "Xây dựng kiến trúc Backend Node.js bền vững bằng cách áp dụng Clean Architecture, SOLID và Design Patterns.",
      "description": "Khóa học đưa bạn tiếp cận với việc xây dựng hệ thống Node.js quy mô lớn. Áp dụng Clean Architecture để phân tách các tầng nghiệp vụ, tối ưu hóa hiệu suất với Cluster module, Queue Redis và quản lý logs thông minh.",
      "price": 1499000,
      "sale_price": 1199000,
      "level": "advanced",
      "language": "en",
      "status": "published",
      "is_featured": false,
      "published_at": "2026-01-15T09:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-10T14:30:00Z",
      "total_duration_seconds": 64800,
      "instructor_id": 6,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1005,
      "title": "Digital Marketing thực chiến",
      "slug": "digital-marketing-thuc-chien",
      "thumbnail_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80",
      "short_description": "Lên kế hoạch và thực thi chiến dịch quảng cáo Facebook Ads, Google Ads, SEO chuyên nghiệp tối ưu ngân sách.",
      "description": "Khóa học cung cấp cái nhìn toàn cảnh về Digital Marketing thế hệ mới. Bạn được hướng dẫn chi tiết cách chạy chiến dịch chuyển đổi, viết content thu hút, phân tích chỉ số ROI và xây dựng thương hiệu cá nhân trên các mạng xã hội phổ biến.",
      "price": 599000,
      "sale_price": null,
      "level": "beginner",
      "language": "vi",
      "status": "draft",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-11T11:00:00Z",
      "total_duration_seconds": 28800,
      "instructor_id": 205,
      "category_ids": [
        2005
      ]
    },
    {
      "id": 1006,
      "title": "Phân tích dữ liệu với Python",
      "slug": "phan-tich-du-lieu-voi-python",
      "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
      "short_description": "Thu thập, làm sạch và trực quan hóa dữ liệu kinh doanh bằng các thư viện Pandas, NumPy, Matplotlib và Seaborn.",
      "description": "Khóa học đào tạo kỹ năng Data Analysis bằng Python. Bắt đầu từ cú pháp cơ bản của Python, học cách thao tác dữ liệu dạng bảng với Pandas, xử lý dữ liệu khuyết thiếu và vẽ các biểu đồ phân tích xu hướng chuyên nghiệp.",
      "price": 999000,
      "sale_price": 799000,
      "level": "intermediate",
      "language": "vi",
      "status": "published",
      "is_featured": false,
      "published_at": "2026-04-05T08:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-12T10:00:00Z",
      "total_duration_seconds": 43200,
      "instructor_id": 206,
      "category_ids": [
        2004
      ]
    },
    {
      "id": 1007,
      "title": "MySQL tối ưu truy vấn",
      "slug": "mysql-toi-uu-truy-van",
      "thumbnail_url": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80",
      "short_description": "Tìm hiểu kiến trúc MySQL, tối ưu hóa Index, viết câu lệnh JOIN phức tạp và cải thiện tốc độ câu truy vấn chậm.",
      "description": "Khóa học đặc thù dành cho Database Administrator hoặc Backend Developer. Đi sâu vào cấu trúc InnoDB Engine, cách phân tích EXPLAIN kế hoạch thực thi, tối ưu hóa các index phức tạp và phân vùng bảng dữ liệu lớn.",
      "price": 699000,
      "sale_price": 499000,
      "level": "intermediate",
      "language": "vi",
      "status": "hidden",
      "is_featured": false,
      "published_at": "2026-02-20T08:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-13T09:15:00Z",
      "total_duration_seconds": 32400,
      "instructor_id": 6,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1008,
      "title": "Vue 3 và Pinia",
      "slug": "vue-3-va-pinia",
      "thumbnail_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80",
      "short_description": "Học Composition API, Router, State Management với Pinia và xây dựng ứng dụng Frontend Single Page Application mượt mà.",
      "description": "Khóa học toàn diện hướng dẫn phát triển ứng dụng client-side bằng Vue 3. Tìm hiểu sâu về Composition API, quản lý dữ liệu toàn cục với Pinia Store, viết Custom Directives và cấu hình Vite nâng cao.",
      "price": 899000,
      "sale_price": 699000,
      "level": "intermediate",
      "language": "vi",
      "status": "rejected",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-05T14:00:00Z",
      "total_duration_seconds": 37800,
      "instructor_id": 3,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1009,
      "title": "Docker dành cho Web Developer",
      "slug": "docker-danh-cho-web-developer",
      "thumbnail_url": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&auto=format&fit=crop&q=80",
      "short_description": "Đóng gói ứng dụng, tối ưu hóa Dockerfile, quản lý multi-container với Docker Compose và triển khai CI/CD cơ bản.",
      "description": "Khóa học giải quyết bài toán chạy dự án đồng bộ giữa các môi trường dev, staging và production. Học cách viết Dockerfile tối ưu layer, cấu hình mạng network, mount volume và chạy ứng dụng phức tạp có DB, Cache qua Docker Compose.",
      "price": 799000,
      "sale_price": null,
      "level": "all_levels",
      "language": "en",
      "status": "approved",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T09:00:00Z",
      "total_duration_seconds": 28800,
      "instructor_id": 6,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1010,
      "title": "Xây dựng ứng dụng với Next.js",
      "slug": "xay-dung-ung-dung-voi-next-js",
      "thumbnail_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
      "short_description": "Làm chủ App Router, React Server Components (RSC), SSR, SSG và ISR để xây dựng ứng dụng SEO tốt nhất.",
      "description": "Khóa học đi thẳng vào các kỹ thuật hiện đại của Next.js 14. Tìm hiểu cách tối ưu hóa hiệu suất load trang, tối ưu SEO, phân tách Server và Client Components, kết hợp với các giải pháp database phổ biến.",
      "price": 1199000,
      "sale_price": 899000,
      "level": "advanced",
      "language": "vi",
      "status": "pending_review",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T10:00:00Z",
      "total_duration_seconds": 46800,
      "instructor_id": 32,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1011,
      "title": "Figma Design System",
      "slug": "figma-design-system",
      "thumbnail_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
      "short_description": "Xây dựng hệ thống UI Library, thiết kế variables đồng bộ và tối ưu hóa quy trình bàn giao cho lập trình viên.",
      "description": "Khóa học đi sâu vào kỹ năng thiết lập Design System chuyên nghiệp quy mô lớn trên Figma. Học cách định nghĩa Token, Variables nâng cao, tạo component thông minh (Variants, Nested Components, Auto Layout 5.0) giúp team thiết kế làm việc nhanh hơn gấp 5 lần.",
      "price": 799000,
      "sale_price": 599000,
      "level": "intermediate",
      "language": "vi",
      "status": "published",
      "is_featured": true,
      "published_at": "2026-05-15T09:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T11:00:00Z",
      "total_duration_seconds": 32400,
      "instructor_id": 206,
      "category_ids": [
        2003
      ]
    },
    {
      "id": 1012,
      "title": "SEO Content Marketing",
      "slug": "seo-content-marketing",
      "thumbnail_url": "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&auto=format&fit=crop&q=80",
      "short_description": "Viết bài chuẩn SEO thu hút khách hàng tiềm năng, lên kế hoạch từ khóa chi tiết và xây dựng cấu trúc website tối ưu.",
      "description": "Khóa học viết bài chuẩn SEO dành cho copywriter hoặc chủ doanh nghiệp. Học cách nghiên cứu từ khóa (Keyword Research), phân tích đối thủ cạnh tranh, tối ưu SEO Onpage, tránh các hình phạt nội dung từ thuật toán Google.",
      "price": 499000,
      "sale_price": null,
      "level": "beginner",
      "language": "vi",
      "status": "draft",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-01T15:30:00Z",
      "total_duration_seconds": 25200,
      "instructor_id": 205,
      "category_ids": [
        2005,
        2013
      ]
    },
    {
      "id": 1013,
      "title": "PHP Laravel cho người mới",
      "slug": "php-laravel-cho-nguoi-moi",
      "thumbnail_url": "https://images.unsplash.com/photo-1599507593499-a3f7f74f32be?w=400&auto=format&fit=crop&q=80",
      "short_description": "Bước đầu làm quen với Laravel framework, nắm vững Route, Controller, View (Blade) và ORM Eloquent cơ bản.",
      "description": "Khóa học nhập môn giúp bạn nhanh chóng sử dụng Laravel. Tìm hiểu cách cài đặt, cấu hình Route, viết Controller xử lý logic, tạo Layout Blade và thực hiện các thao tác CRUD dữ liệu căn bản với Eloquent ORM.",
      "price": 599000,
      "sale_price": 399000,
      "level": "beginner",
      "language": "vi",
      "status": "rejected",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-06-20T10:30:00Z",
      "total_duration_seconds": 28800,
      "instructor_id": 205,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1014,
      "title": "Git và GitHub trong dự án nhóm",
      "slug": "git-va-github-trong-du-an-nhom",
      "thumbnail_url": "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=400&auto=format&fit=crop&q=80",
      "short_description": "Làm chủ các lệnh Git cơ bản, giải quyết conflict, làm việc với Branch và quản lý pull request chuyên nghiệp trên GitHub.",
      "description": "Khóa học thực chiến giải quyết bài toán xung đột code khi làm việc nhóm. Học viên được hướng dẫn quy trình Gitflow chuẩn công nghiệp, viết commit message rõ ràng, review code qua Pull Request và quản lý phiên bản phần mềm hiệu quả.",
      "price": 399000,
      "sale_price": 199000,
      "level": "all_levels",
      "language": "vi",
      "status": "published",
      "is_featured": false,
      "published_at": "2026-05-01T08:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-12T16:00:00Z",
      "total_duration_seconds": 18000,
      "instructor_id": 6,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1015,
      "title": "JavaScript nâng cao",
      "slug": "javascript-nang-cao",
      "thumbnail_url": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&auto=format&fit=crop&q=80",
      "short_description": "Tìm hiểu cơ chế hoạt động bên dưới của Javascript Engine: Closure, Scope, Prototype, Event Loop và Asynchronous.",
      "description": "Khóa học đi sâu vào phần lý thuyết nền tảng cốt lõi của ngôn ngữ Javascript. Hiểu cách Execution Context được tạo ra, cách hoạt động của Garbage Collector, viết code bất đồng bộ hiệu quả với Promise và Async/Await, tránh rò rỉ bộ nhớ (memory leaks).",
      "price": 999000,
      "sale_price": null,
      "level": "advanced",
      "language": "vi",
      "status": "hidden",
      "is_featured": false,
      "published_at": "2026-01-10T08:00:00Z",
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T07:00:00Z",
      "total_duration_seconds": 39600,
      "instructor_id": 3,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1016,
      "title": "Kiểm thử API với Postman",
      "slug": "kiem-thu-api-voi-postman",
      "thumbnail_url": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&auto=format&fit=crop&q=80",
      "short_description": "Học cách viết test script tự động, cấu hình Environment, Mock Server và chạy test suite bằng Newman CLI.",
      "description": "Khóa học hướng dẫn các lập trình viên hoặc Tester tự động hóa quy trình kiểm thử API. Học cách sử dụng biến toàn cục/môi trường, viết script kiểm thử phản hồi bằng thư viện Javascript tích hợp trong Postman, chạy kiểm thử tự động tích hợp CI/CD.",
      "price": 699000,
      "sale_price": 499000,
      "level": "intermediate",
      "language": "vi",
      "status": "pending_review",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T11:30:00Z",
      "total_duration_seconds": 25200,
      "instructor_id": 105,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1017,
      "title": "Vue 3 cho người mới bắt đầu",
      "slug": "vue-3-cho-nguoi-moi-bat-dau",
      "thumbnail_url": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80",
      "short_description": "Làm quen với Vue 3 qua Options API, Data Binding, Directives và xây dựng các component tương tác đơn giản.",
      "description": "Khóa học căn bản dành cho các bạn mới tiếp cận Frontend framework. Hướng dẫn chi tiết cách khai báo data, method, computed, watcher, xử lý event và truyền dữ liệu qua props/emit.",
      "price": 699000,
      "sale_price": null,
      "level": "beginner",
      "language": "vi",
      "status": "draft",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T12:00:00Z",
      "total_duration_seconds": 21600,
      "instructor_id": 3,
      "category_ids": [
        2001
      ]
    },
    {
      "id": 1018,
      "title": "Xây dựng Chatbot AI với Python",
      "slug": "xay-dung-chatbot-ai-voi-python",
      "thumbnail_url": "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80",
      "short_description": "Sử dụng API của OpenAI, Gemini và LangChain để xây dựng hệ thống chatbot AI thông minh trả lời tự động.",
      "description": "Khóa học đi đầu xu hướng công nghệ. Tìm hiểu kiến trúc mô hình ngôn ngữ lớn (LLM), lập trình kết nối API OpenAI GPT, Google Gemini, viết prompt thông minh và ứng dụng LangChain để kết nối chatbot với cơ sở dữ liệu riêng (RAG).",
      "price": 1599000,
      "sale_price": 1299000,
      "level": "advanced",
      "language": "vi",
      "status": "approved",
      "is_featured": false,
      "published_at": null,
      "created_at": "2026-07-01T08:00:00+07:00",
      "updated_at": "2026-07-14T13:00:00Z",
      "total_duration_seconds": 39600,
      "instructor_id": 206,
      "category_ids": [
        2004
      ]
    }
  ],
  "courseReviews": [
    {
      "course_id": 1010,
      "sections": [
        {
          "id": 10101,
          "title": "Chương 1: Tổng quan VPC & Networking trên AWS",
          "order": 1,
          "lesson_count": 3,
          "total_duration_seconds": 10800,
          "lessons": [
            {
              "id": 1,
              "title": "1.1 Giới thiệu kiến trúc VPC & Subnets",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": true
            },
            {
              "id": 2,
              "title": "1.2 Cấu hình Route Tables & Internet Gateways",
              "order": 2,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 3,
              "title": "1.3 Lab thực hành tạo VPC tùy chỉnh",
              "order": 3,
              "type": "document",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": true,
        "summary": "Khóa học đầy đủ thông tin và đạt chuẩn kiểm duyệt.",
        "missing_items": [],
        "warnings": [],
        "checks": [
          {
            "name": "Video giới thiệu khóa học",
            "passed": true,
            "message": "Đã upload video giới thiệu."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5)",
            "passed": true,
            "message": "Đạt chuẩn."
          },
          {
            "name": "Thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Đạt chuẩn."
          },
          {
            "name": "Thông tin giảng viên",
            "passed": true,
            "message": "Đã xác minh."
          }
        ]
      }
    },
    {
      "course_id": 1001,
      "sections": [
        {
          "id": 1001,
          "title": "Chương 1: Kiến trúc RESTful API & Cấu hình môi trường",
          "order": 1,
          "lesson_count": 4,
          "total_duration_seconds": 7200,
          "lessons": [
            {
              "id": 1,
              "title": "1.1 Giới thiệu tổng quan & Chuẩn RESTful API 2026",
              "order": 1,
              "type": "video",
              "duration_seconds": 1200,
              "is_preview": true
            },
            {
              "id": 2,
              "title": "1.2 Thiết lập Laravel 11 & Docker Compose",
              "order": 2,
              "type": "video",
              "duration_seconds": 2400,
              "is_preview": false
            },
            {
              "id": 3,
              "title": "1.3 Tối ưu hóa Database Schema & Migrations",
              "order": 3,
              "type": "video",
              "duration_seconds": 1800,
              "is_preview": false
            },
            {
              "id": 4,
              "title": "1.4 Tài liệu hướng dẫn cài đặt môi trường",
              "order": 4,
              "type": "document",
              "duration_seconds": 1800,
              "is_preview": false
            }
          ]
        },
        {
          "id": 1002,
          "title": "Chương 2: Authentication & Authorization với Passport",
          "order": 2,
          "lesson_count": 5,
          "total_duration_seconds": 14400,
          "lessons": [
            {
              "id": 5,
              "title": "2.1 JWT vs OAuth2 Passport trong Laravel",
              "order": 1,
              "type": "video",
              "duration_seconds": 1800,
              "is_preview": true
            },
            {
              "id": 6,
              "title": "2.2 Cấu hình Access Token & Refresh Token",
              "order": 2,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 7,
              "title": "2.3 Phân quyền chi tiết với Spatie Permission",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 8,
              "title": "2.4 Đăng nhập đa nền tảng Google & GitHub",
              "order": 4,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 9,
              "title": "2.5 Quiz kiểm tra lý thuyết OAuth2",
              "order": 5,
              "type": "quiz",
              "duration_seconds": 1800,
              "is_preview": false
            }
          ]
        },
        {
          "id": 1003,
          "title": "Chương 3: Cấu trúc Microservices & Redis Message Queue",
          "order": 3,
          "lesson_count": 5,
          "total_duration_seconds": 25200,
          "lessons": [
            {
              "id": 10,
              "title": "3.1 Khái niệm Message Broker & RabbitMQ/Redis",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 11,
              "title": "3.2 Tối ưu Cache với Redis Sentinel",
              "order": 2,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 12,
              "title": "3.3 Xây dựng Service Discovery đơn giản",
              "order": 3,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 13,
              "title": "3.4 Deploy ứng dụng lên Kubernetes Cluster",
              "order": 4,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 14,
              "title": "3.5 Đồ án tốt nghiệp khóa học",
              "order": 5,
              "type": "document",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": true,
        "summary": "Khóa học đáp ứng đầy đủ tất cả 6 tiêu chí kiểm duyệt chuẩn của hệ thống.",
        "missing_items": [],
        "warnings": [
          "Ảnh thumbnail độ phân giải 720p (khuyến nghị nâng cấp 1080p để đạt hiệu năng tốt hơn)."
        ],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã upload video giới thiệu độ dài 2 phút 30 giây."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Khóa học hiện có 14 bài học (Đạt chuẩn)."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng đạt 13 giờ 00 phút (Đạt chuẩn)."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Mô tả chi tiết và rõ ràng các kĩ năng học viên thu được."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Đã bật 2 bài học học thử miễn phí cho học viên."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Giảng viên đã xác minh danh tính và bằng cấp thành công."
          }
        ]
      }
    },
    {
      "course_id": 1002,
      "sections": [
        {
          "id": 1004,
          "title": "Chương 1: TypeScript Căn Bản Đến Nâng Cao Cho Dev React",
          "order": 1,
          "lesson_count": 3,
          "total_duration_seconds": 10800,
          "lessons": [
            {
              "id": 15,
              "title": "1.1 Why TypeScript in 2026?",
              "order": 1,
              "type": "video",
              "duration_seconds": 1800,
              "is_preview": true
            },
            {
              "id": 16,
              "title": "1.2 Generics, Utility Types & Type Narrowing",
              "order": 2,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 17,
              "title": "1.3 Typing React Props, Events & Refs",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        },
        {
          "id": 1005,
          "title": "Chương 2: React 19 Core Features & Hooks",
          "order": 2,
          "lesson_count": 4,
          "total_duration_seconds": 25200,
          "lessons": [
            {
              "id": 18,
              "title": "2.1 useActionState & useOptimistic Hooks",
              "order": 1,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": true
            },
            {
              "id": 19,
              "title": "2.2 Server Components vs Client Components",
              "order": 2,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 20,
              "title": "2.3 Tối ưu re-render với use() API & Compiler",
              "order": 3,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 21,
              "title": "2.4 Thực hành xây dựng Dashboard UI",
              "order": 4,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": true,
        "summary": "Khóa học đạt chuẩn chất lượng kiểm duyệt.",
        "missing_items": [],
        "warnings": [],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã có video giới thiệu chất lượng HD 1080p."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Khóa học có 7 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng 10 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Đầy đủ thông tin mục tiêu học tập."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Có 2 bài học mở xem trước."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Tài khoản giảng viên đã xác thực."
          }
        ]
      }
    },
    {
      "course_id": 1003,
      "sections": [
        {
          "id": 1006,
          "title": "Chương 1: Figma Fundamentals & Variables System",
          "order": 1,
          "lesson_count": 3,
          "total_duration_seconds": 18000,
          "lessons": [
            {
              "id": 22,
              "title": "1.1 Tổng quan công cụ Figma & Plugin cần thiết",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 23,
              "title": "1.2 Tạo Variables Color, Mode Dark/Light",
              "order": 2,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 24,
              "title": "1.3 Auto Layout 5.0 & Smart Animate",
              "order": 3,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": false,
        "summary": "Phát hiện 2 mục bắt buộc chưa đạt tiêu chuẩn kiểm duyệt của MindHub.",
        "missing_items": [
          "Chưa có video giới thiệu khóa học (Promo Video)",
          "Chưa bật bất kỳ bài học nào ở chế độ Học thử (Preview Lesson)"
        ],
        "warnings": [
          "Số lượng bài học chỉ có 3 bài (khuyến nghị tách nhỏ thành ít nhất 5-10 bài học)."
        ],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": false,
            "message": "Thiếu promo video giới thiệu."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": false,
            "message": "Hiện chỉ có 3 bài học (Cần bổ sung)."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Thời lượng đạt 5 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Mô tả ngắn gọn và đầy đủ."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": false,
            "message": "Chưa chọn bài học học thử."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Thông tin cá nhân đã xác minh."
          }
        ]
      }
    },
    {
      "course_id": 1009,
      "sections": [
        {
          "id": 1007,
          "title": "Chương 1: Docker Core Concepts & Multi-stage Build",
          "order": 1,
          "lesson_count": 4,
          "total_duration_seconds": 14400,
          "lessons": [
            {
              "id": 25,
              "title": "1.1 Docker Architecture & Container Lifecycle",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": true
            },
            {
              "id": 26,
              "title": "1.2 Tối ưu dung lượng Image với Multi-stage",
              "order": 2,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 27,
              "title": "1.3 Cấu hình Docker Compose cho Stack Laravel-Postgres",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 28,
              "title": "1.4 Tài liệu Cheatsheet lệnh Docker",
              "order": 4,
              "type": "document",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        },
        {
          "id": 1008,
          "title": "Chương 2: Kubernetes In Production & CI/CD Pipeline",
          "order": 2,
          "lesson_count": 4,
          "total_duration_seconds": 28800,
          "lessons": [
            {
              "id": 29,
              "title": "2.1 Pods, Deployments & StatefulSets",
              "order": 1,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 30,
              "title": "2.2 Ingress NGINX Controller & SSL Cert-Manager",
              "order": 2,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 31,
              "title": "2.3 Helm Chart Packaging",
              "order": 3,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            },
            {
              "id": 32,
              "title": "2.4 Pipeline GitHub Actions Auto Deploy K8s",
              "order": 4,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": true,
        "summary": "Khóa học đáp ứng đầy đủ tiêu chuẩn kiểm duyệt.",
        "missing_items": [],
        "warnings": [],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã có promo video 3 phút."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Đã có 8 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng 12 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Đầy đủ thông tin chi tiết."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Có 1 bài học xem trước."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Tài khoản giảng viên hợp lệ."
          }
        ]
      }
    },
    {
      "course_id": 1004,
      "sections": [
        {
          "id": 1009,
          "title": "Chương 1: NestJS Essentials & Dependency Injection",
          "order": 1,
          "lesson_count": 3,
          "total_duration_seconds": 14400,
          "lessons": [
            {
              "id": 33,
              "title": "1.1 Modules, Controllers & Providers Architecture",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": true
            },
            {
              "id": 34,
              "title": "1.2 Custom Decorators, Pipes & Interceptors",
              "order": 2,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 35,
              "title": "1.3 TypeORM & PostgreSQL Migration",
              "order": 3,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            }
          ]
        },
        {
          "id": 1010,
          "title": "Chương 2: Event-driven Microservices với Apache Kafka",
          "order": 2,
          "lesson_count": 3,
          "total_duration_seconds": 14400,
          "lessons": [
            {
              "id": 36,
              "title": "2.1 gRPC High-performance Communication",
              "order": 1,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 37,
              "title": "2.2 Kafka Event Streaming & Consumer Groups",
              "order": 2,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 38,
              "title": "2.3 CQRS Pattern trong NestJS Enterprise",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": false,
        "summary": "Phát hiện 1 mục chưa đạt tiêu chuẩn nội dung bắt buộc.",
        "missing_items": [
          "Mô tả chi tiết khóa học quá ngắn (dưới 100 từ tiêu chuẩn)"
        ],
        "warnings": [
          "Bài tập thực hành trắc nghiệm/tự luận chưa được thiết lập."
        ],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã có video giới thiệu."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Đã có 6 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Thời lượng 8 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": false,
            "message": "Nội dung mô tả khóa học sơ sài."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Đã bật 1 bài preview."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Giảng viên xác thực thành công."
          }
        ]
      }
    },
    {
      "course_id": 1006,
      "sections": [
        {
          "id": 1011,
          "title": "Chương 1: Python Căn Bản & Thư Viện NumPy/Pandas",
          "order": 1,
          "lesson_count": 4,
          "total_duration_seconds": 21600,
          "lessons": [
            {
              "id": 39,
              "title": "1.1 Cài đặt Jupyter Notebook & Anaconda",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": true
            },
            {
              "id": 40,
              "title": "1.2 Thao tác với Pandas DataFrame & Series",
              "order": 2,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 41,
              "title": "1.3 Xử lý dữ liệu khuyết (Missing Values) & Duplicates",
              "order": 3,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 42,
              "title": "1.4 Trực quan hóa Seaborn & Matplotlib Dashboards",
              "order": 4,
              "type": "video",
              "duration_seconds": 7200,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": false,
        "summary": "Nội dung thiếu bài học tối thiểu và thiếu bài học học thử.",
        "missing_items": [
          "Số lượng bài học chỉ có 4 bài (yêu cầu tối thiểu >= 5 bài)",
          "Chưa bật tính năng Học thử (Preview Lesson)"
        ],
        "warnings": [
          "Thời lượng 6 giờ tương đối ngắn cho chủ đề Data Analytics."
        ],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã có video giới thiệu."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": false,
            "message": "Hiện chỉ có 4 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Thời lượng 6 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Mô tả chi tiết bài học."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": false,
            "message": "Thiếu bài xem thử."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Xác minh tài khoản hoàn tất."
          }
        ]
      }
    },
    {
      "course_id": 1007,
      "sections": [
        {
          "id": 1012,
          "title": "Chương 1: Deep Dive MySQL Storage Engine & Indexing",
          "order": 1,
          "lesson_count": 5,
          "total_duration_seconds": 14400,
          "lessons": [
            {
              "id": 43,
              "title": "1.1 B-Tree Index & Composite Index Internal",
              "order": 1,
              "type": "video",
              "duration_seconds": 2880,
              "is_preview": true
            },
            {
              "id": 44,
              "title": "1.2 Đọc & Phân tích EXPLAIN Execution Plan",
              "order": 2,
              "type": "video",
              "duration_seconds": 2880,
              "is_preview": false
            },
            {
              "id": 45,
              "title": "1.3 Tránh Full Table Scan & Covering Index",
              "order": 3,
              "type": "video",
              "duration_seconds": 2880,
              "is_preview": false
            },
            {
              "id": 46,
              "title": "1.4 Cấu hình Slow Query Log & Percona Toolkit",
              "order": 4,
              "type": "video",
              "duration_seconds": 2880,
              "is_preview": false
            },
            {
              "id": 47,
              "title": "1.5 Bài tập tối ưu query hàng triệu bản ghi",
              "order": 5,
              "type": "quiz",
              "duration_seconds": 2880,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": true,
        "summary": "Khóa học hoàn toàn đạt chuẩn chất lượng kiểm duyệt.",
        "missing_items": [],
        "warnings": [],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã upload video giới thiệu."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Có 5 bài học vừa đủ chuẩn."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng 4 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Nội dung mô tả khoa học."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Đã mở 1 bài học xem thử."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Giảng viên xác minh tài khoản."
          }
        ]
      }
    },
    {
      "course_id": 1005,
      "sections": [
        {
          "id": 1015,
          "title": "Chương 1: Chiến Lược Nội Dung & TikTok Shop Optimization",
          "order": 1,
          "lesson_count": 5,
          "total_duration_seconds": 19800,
          "lessons": [
            {
              "id": 54,
              "title": "1.1 Tư duy Marketing 2026 & Xây dựng Persona",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 55,
              "title": "1.2 Thuật toán TikTok Shop & Chuẩn hóa cửa hàng",
              "order": 2,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 56,
              "title": "1.3 Kịch bản Video ngắn 15s gây bão View",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 57,
              "title": "1.4 Thiết lập chiến dịch Ads Chuyển đổi",
              "order": 4,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 58,
              "title": "1.5 Đọc chỉ số CAC, LTV, ROAS tối ưu ngân sách",
              "order": 5,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": false,
        "summary": "Phát hiện 2 vi phạm quy định kiểm duyệt của MindHub.",
        "missing_items": [
          "Thiếu video giới thiệu khóa học (Promo Video)",
          "Chưa thiết lập bất kỳ bài học xem thử (Preview Lesson)"
        ],
        "warnings": [
          "Khóa học chỉ có 1 section duy nhất."
        ],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": false,
            "message": "Thiếu promo video."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Đã có 5 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng 5 giờ 30 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Đầy đủ mô tả chi tiết."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": false,
            "message": "Chưa mở bài học thử."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Tài khoản giảng viên đã xác thực."
          }
        ]
      }
    },
    {
      "course_id": 1008,
      "sections": [
        {
          "id": 1016,
          "title": "Chương 1: Vue 3 Composition API Essentials",
          "order": 1,
          "lesson_count": 3,
          "total_duration_seconds": 10800,
          "lessons": [
            {
              "id": 59,
              "title": "1.1 Reactive vs Ref trong Vue 3",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": true
            },
            {
              "id": 60,
              "title": "1.2 Computed Properties & Watchers",
              "order": 2,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 61,
              "title": "1.3 Lifecycle Hooks trong Script Setup",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        },
        {
          "id": 1017,
          "title": "Chương 2: Pinia Store & Vue Router Navigation Guards",
          "order": 2,
          "lesson_count": 3,
          "total_duration_seconds": 14400,
          "lessons": [
            {
              "id": 62,
              "title": "2.1 Khởi tạo Pinia Store & Actions/Getters",
              "order": 1,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 63,
              "title": "2.2 Phân quyền Route với Navigation Guards",
              "order": 2,
              "type": "video",
              "duration_seconds": 5400,
              "is_preview": false
            },
            {
              "id": 64,
              "title": "2.3 Build & Deploy SPA với Nginx",
              "order": 3,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": true,
        "summary": "Khóa học đạt chuẩn chất lượng kiểm duyệt.",
        "missing_items": [],
        "warnings": [
          "Cần chú ý bổ sung bài tập trắc nghiệm củng cố kiến thức ở mỗi chương."
        ],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã có promo video HD."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Có 6 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Thời lượng 7 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Đầy đủ mục tiêu đầu ra."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Có 1 bài xem trước."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Tài khoản giảng viên đã xác thực."
          }
        ]
      }
    },
    {
      "course_id": 1014,
      "sections": [
        {
          "id": 1018,
          "title": "Chương 1: Git Essentials & Advanced Branching",
          "order": 1,
          "lesson_count": 5,
          "total_duration_seconds": 10800,
          "lessons": [
            {
              "id": 65,
              "title": "1.1 Git Working Directory, Staging & Repository",
              "order": 1,
              "type": "video",
              "duration_seconds": 2160,
              "is_preview": true
            },
            {
              "id": 66,
              "title": "1.2 Git Flow vs Trunk-based Development",
              "order": 2,
              "type": "video",
              "duration_seconds": 2160,
              "is_preview": false
            },
            {
              "id": 67,
              "title": "1.3 Git Rebase vs Merge Deep Dive",
              "order": 3,
              "type": "video",
              "duration_seconds": 2160,
              "is_preview": false
            },
            {
              "id": 68,
              "title": "1.4 Xử lý Merge Conflicts thực tế",
              "order": 4,
              "type": "video",
              "duration_seconds": 2160,
              "is_preview": false
            },
            {
              "id": 69,
              "title": "1.5 Git Stash, Cherry-pick & Bisect",
              "order": 5,
              "type": "video",
              "duration_seconds": 2160,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": false,
        "summary": "Nội dung thiếu video giới thiệu khóa học.",
        "missing_items": [
          "Thiếu video giới thiệu khóa học (Promo Video)"
        ],
        "warnings": [],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": false,
            "message": "Chưa upload promo video."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": true,
            "message": "Đã có 5 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng 3 giờ 00 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Mô tả rõ ràng."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": true,
            "message": "Có 1 bài xem trước."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Thông tin hợp lệ."
          }
        ]
      }
    },
    {
      "course_id": 1016,
      "sections": [
        {
          "id": 1019,
          "title": "Chương 1: Postman Scripting & Test Automation",
          "order": 1,
          "lesson_count": 4,
          "total_duration_seconds": 16200,
          "lessons": [
            {
              "id": 70,
              "title": "1.1 Postman Collections, Environments & Variables",
              "order": 1,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            },
            {
              "id": 71,
              "title": "1.2 Viết Test Scripts với chai.js trong Postman",
              "order": 2,
              "type": "video",
              "duration_seconds": 4500,
              "is_preview": false
            },
            {
              "id": 72,
              "title": "1.3 Collection Runner & Data-driven Testing",
              "order": 3,
              "type": "video",
              "duration_seconds": 4500,
              "is_preview": false
            },
            {
              "id": 73,
              "title": "1.4 Tích hợp Newman CLI vào GitHub Actions",
              "order": 4,
              "type": "video",
              "duration_seconds": 3600,
              "is_preview": false
            }
          ]
        }
      ],
      "lessons": [],
      "checklist": {
        "passed": false,
        "summary": "Nội dung thiếu bài học tối thiểu và thiếu bài học học thử.",
        "missing_items": [
          "Số lượng bài học chỉ có 4 bài (yêu cầu tối thiểu >= 5 bài)",
          "Chưa chọn bài học học thử (Preview Lesson)"
        ],
        "warnings": [],
        "checks": [
          {
            "name": "Video giới thiệu khóa học (Promo Video)",
            "passed": true,
            "message": "Đã upload promo video."
          },
          {
            "name": "Số lượng bài học tối thiểu (>= 5 bài)",
            "passed": false,
            "message": "Hiện có 4 bài học."
          },
          {
            "name": "Tổng thời lượng video (>= 2 giờ)",
            "passed": true,
            "message": "Tổng thời lượng 4 giờ 30 phút."
          },
          {
            "name": "Mô tả khóa học & Mục tiêu đầu ra",
            "passed": true,
            "message": "Mô tả khóa học hợp lệ."
          },
          {
            "name": "Bài học học thử (Preview Lesson)",
            "passed": false,
            "message": "Chưa mở bài xem trước."
          },
          {
            "name": "Thông tin giảng viên & Xác minh tài khoản",
            "passed": true,
            "message": "Tài khoản hợp lệ."
          }
        ]
      }
    }
  ],
  "instructorUpgrades": [
    {
      "user_id": 201,
      "application_status": "pending",
      "submitted_at": "2026-07-13T08:30:00Z",
      "reviewed_at": null,
      "review_note": null,
      "bio": "Tôi là kỹ sư Backend hơn 5 năm kinh nghiệm làm việc với Node.js, Go và microservices.\nTôi mong muốn mang đến các khóa học thiết kế hệ thống phân tán chịu tải cao thực tế nhất cho học viên.",
      "expertise": "Lập trình Backend (Node.js, Go), Thiết kế hệ thống (Microservices, SQL/NoSQL)",
      "experience_years": 5,
      "level": "Cao cấp",
      "payout_account": {
        "provider": "Vietcombank",
        "account_name": "DANG TUAN KIET",
        "account_number": "1023334445",
        "status": "active"
      }
    },
    {
      "user_id": 202,
      "application_status": "pending",
      "submitted_at": "2026-07-12T14:15:00Z",
      "reviewed_at": null,
      "review_note": null,
      "bio": "Senior Frontend Engineer chuyên về ReactJS, Next.js và Tailwind CSS.\nTừng xây dựng nhiều dự án SaaS lớn. Tôi muốn chia sẻ kỹ thuật tối ưu hóa performance và quản lý state phức tạp.",
      "expertise": "Lập trình Frontend (ReactJS, NextJS), CSS & UI Architecture",
      "experience_years": 4,
      "level": "Trung cấp",
      "payout_account": null
    },
    {
      "user_id": 203,
      "application_status": "pending",
      "submitted_at": "2026-07-11T10:00:00Z",
      "reviewed_at": null,
      "review_note": null,
      "bio": "Product Designer tại tập đoàn công nghệ đa quốc gia.\nTôi muốn dạy thiết kế UI/UX từ cơ bản đến nâng cao, hướng dẫn làm Portfolio và xây dựng tư duy thiết kế lấy người dùng làm trung tâm.",
      "expertise": "Thiết kế UI/UX, Design System, Figma, User Research",
      "experience_years": 6,
      "level": "Cao cấp",
      "payout_account": {
        "provider": "Techcombank",
        "account_name": "LE THAO VY",
        "account_number": "1903334445556",
        "status": "pending_verification"
      }
    },
    {
      "user_id": 204,
      "application_status": "pending",
      "submitted_at": "2026-07-10T16:20:00Z",
      "reviewed_at": null,
      "review_note": null,
      "bio": "Tôi đã làm việc trong ngành Marketing hơn 8 năm, chạy ngân sách quảng cáo hàng tỷ đồng cho nhiều doanh nghiệp FMCG.\nKhóa học của tôi tập trung vào thực chiến phễu chuyển đổi và đo lường ROI.",
      "expertise": "Digital Marketing, Performance Marketing, Facebook/Google Ads",
      "experience_years": 8,
      "level": "Cao cấp",
      "payout_account": {
        "provider": "MB Bank",
        "account_name": "PHAM HOANG NAM",
        "account_number": "999333444555",
        "status": "active"
      }
    },
    {
      "user_id": 215,
      "application_status": "pending",
      "submitted_at": "2026-07-09T09:00:00Z",
      "reviewed_at": null,
      "review_note": null,
      "bio": "Data Analyst đam mê phân tích số liệu và kể câu chuyện qua biểu đồ.\nTôi muốn hướng dẫn học viên các kỹ năng SQL, Excel nâng cao, Python Pandas và Tableau để xử lý dữ liệu lớn.",
      "expertise": "Phân tích dữ liệu (Python, SQL), Data Visualization (Tableau, PowerBI)",
      "experience_years": 3,
      "level": "Trung cấp",
      "payout_account": {
        "provider": "ACB",
        "account_name": "VO GIA HAN",
        "account_number": "123444555",
        "status": "active"
      }
    },
    {
      "user_id": 216,
      "application_status": "approved",
      "submitted_at": "2026-07-08T10:00:00Z",
      "reviewed_at": "2026-07-09T14:00:00Z",
      "review_note": "Hồ sơ chuyên môn tốt. Đã kết nối tài khoản nhận tiền hợp lệ.",
      "bio": "Mobile Developer hơn 7 năm kinh nghiệm. Đã xây dựng và phát hành nhiều ứng dụng iOS/Android phổ biến bằng Flutter và Swift.\nKhóa học hướng dẫn code dự án thực tế và đưa app lên Store.",
      "expertise": "Lập trình di động (Flutter, Swift, Kotlin), App Store Optimization",
      "experience_years": 7,
      "level": "Cao cấp",
      "payout_account": {
        "provider": "Vietcombank",
        "account_name": "NGUYEN MINH ANH",
        "account_number": "1024445556",
        "status": "active"
      }
    },
    {
      "user_id": 207,
      "application_status": "approved",
      "submitted_at": "2026-07-07T11:15:00Z",
      "reviewed_at": "2026-07-08T09:30:00Z",
      "review_note": "Hồ sơ đạt tiêu chuẩn hệ thống.",
      "bio": "Business Analyst tại ngân hàng lớn với kỹ năng lấy yêu cầu, phân tích quy trình nghiệp vụ BPMN và viết tài liệu SRS chuyên nghiệp.\nDạy học với case study thực tế từ doanh nghiệp.",
      "expertise": "Business Analysis, Requirement Gathering, BPMN, Agile/Scrum",
      "experience_years": 5,
      "level": "Trung cấp",
      "payout_account": {
        "provider": "Techcombank",
        "account_name": "BUI NGOC MAI",
        "account_number": "1904445556667",
        "status": "active"
      }
    },
    {
      "user_id": 208,
      "application_status": "approved",
      "submitted_at": "2026-07-06T15:30:00Z",
      "reviewed_at": "2026-07-07T10:00:00Z",
      "review_note": "Chuyên gia bảo mật thông tin có đầy đủ chứng chỉ quốc tế CISSP.",
      "bio": "Security Consultant chuyên về Penetration Testing và an ninh ứng dụng.\nGiúp lập trình viên viết code bảo mật cao, phát hiện và vá các lỗ hổng OWASP Top 10.",
      "expertise": "An toàn thông tin, Cyber Security, Ethical Hacking, AppSec",
      "experience_years": 8,
      "level": "Cao cấp",
      "payout_account": {
        "provider": "MB Bank",
        "account_name": "HO DUC LONG",
        "account_number": "999444555666",
        "status": "active"
      }
    },
    {
      "user_id": 209,
      "application_status": "approved",
      "submitted_at": "2026-07-05T09:00:00Z",
      "reviewed_at": "2026-07-06T11:00:00Z",
      "review_note": "Có chứng chỉ PMP và kinh nghiệm dẫn dắt nhiều dự án phần mềm quy mô lớn.",
      "bio": "Senior Product Manager với tư duy định hình sản phẩm từ con số 0.\nTôi sẽ chia sẻ quy trình định vị thị trường, viết User Story, lập lộ trình phát triển (Product Roadmap).",
      "expertise": "Product Management, Agile/Scrum, PMP, Product Strategy",
      "experience_years": 7,
      "level": "Cao cấp",
      "payout_account": {
        "provider": "ACB",
        "account_name": "NGUYEN THANH TRUC",
        "account_number": "123555666",
        "status": "active"
      }
    },
    {
      "user_id": 210,
      "application_status": "rejected",
      "submitted_at": "2026-07-04T13:00:00Z",
      "reviewed_at": "2026-07-05T15:30:00Z",
      "review_note": "Kinh nghiệm làm việc thực tế chưa đủ yêu cầu (tối thiểu 3 năm).",
      "bio": "Lập trình viên Game tự do mới tốt nghiệp, yêu thích thiết kế các game nhỏ 2D trên nền tảng Unity.",
      "expertise": "Lập trình Game (Unity, C#), Game Design 2D",
      "experience_years": 1,
      "level": "Sơ cấp",
      "payout_account": {
        "provider": "Sacombank",
        "account_name": "TRAN ANH KHOA",
        "account_number": "060222333444",
        "status": "active"
      }
    },
    {
      "user_id": 211,
      "application_status": "rejected",
      "submitted_at": "2026-07-03T10:45:00Z",
      "reviewed_at": "2026-07-04T11:00:00Z",
      "review_note": "Tài khoản người dùng chưa hoàn tất xác minh email.",
      "bio": "Marketing Specialist chuyên về viết nội dung quảng cáo và quản trị fanpage.\nMuốn giảng dạy copywriting cơ bản.",
      "expertise": "Content Marketing, Copywriting, Social Media Management",
      "experience_years": 3,
      "level": "Trung cấp",
      "payout_account": {
        "provider": "Vietinbank",
        "account_name": "LY MINH CHAU",
        "account_number": "101888999000",
        "status": "active"
      }
    },
    {
      "user_id": 212,
      "application_status": "rejected",
      "submitted_at": "2026-07-02T16:00:00Z",
      "reviewed_at": "2026-07-03T09:00:00Z",
      "review_note": "Hồ sơ không có chuyên môn phù hợp với định hướng khóa học lập trình thực chiến của nền tảng.",
      "bio": "Tôi yêu thích quản trị hệ thống, muốn dạy cách quản trị hosting và tên miền cơ bản.",
      "expertise": "Web Hosting Administration, Domain Configuration",
      "experience_years": 2,
      "level": "Sơ cấp",
      "payout_account": {
        "provider": "TPBank",
        "account_name": "PHAN QUOC BAO",
        "account_number": "04022233344",
        "status": "active"
      }
    }
  ],
  "coupons": [
    {
      "id": 1,
      "code": "MINDHUB10",
      "name": "Giảm 10% mừng năm mới",
      "discount_type": "percentage",
      "discount_value": 10,
      "status": "active"
    },
    {
      "id": 2,
      "code": "SUMMER100K",
      "name": "Giảm 100.000đ chào hè",
      "discount_type": "fixed",
      "discount_value": 100000,
      "status": "active"
    },
    {
      "id": 3,
      "code": "WELCOME50K",
      "name": "Giảm 50.000đ cho học viên mới",
      "discount_type": "fixed",
      "discount_value": 50000,
      "status": "active"
    },
    {
      "id": 4,
      "code": "PROMO20",
      "name": "Ưu đãi 20% các khóa học lập trình",
      "discount_type": "percentage",
      "discount_value": 20,
      "status": "active"
    }
  ],
  "orders": [
    {
      "id": 3001,
      "order_code": "ORD-2026-0001",
      "provider_transaction_id": "VNP14829101",
      "user_id": 2,
      "course_id": 1001,
      "coupon_id": null,
      "price_snapshot": 499000,
      "discount_amount": 0,
      "amount": 499000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-10T09:00:00+07:00",
      "updated_at": "2026-07-10T09:05:00+07:00",
      "paid_at": "2026-07-10T09:05:00+07:00"
    },
    {
      "id": 3002,
      "order_code": "ORD-2026-0002",
      "provider_transaction_id": "FT261928371",
      "user_id": 4,
      "course_id": 1002,
      "coupon_id": 2,
      "price_snapshot": 999000,
      "discount_amount": 100000,
      "amount": 899000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-11T14:30:00+07:00",
      "updated_at": "2026-07-11T14:35:00+07:00",
      "paid_at": "2026-07-11T14:35:00+07:00"
    },
    {
      "id": 3003,
      "order_code": "ORD-2026-0003",
      "provider_transaction_id": "MOMO8821034",
      "user_id": 8,
      "course_id": 1004,
      "coupon_id": null,
      "price_snapshot": 1199000,
      "discount_amount": 0,
      "amount": 1199000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "momo",
      "created_at": "2026-07-12T10:00:00+07:00",
      "updated_at": "2026-07-12T10:02:00+07:00",
      "paid_at": "2026-07-12T10:02:00+07:00"
    },
    {
      "id": 3004,
      "order_code": "ORD-2026-0004",
      "provider_transaction_id": "VNP14829104",
      "user_id": 11,
      "course_id": 1006,
      "coupon_id": 1,
      "price_snapshot": 590000,
      "discount_amount": 59000,
      "amount": 531000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-12T15:00:00+07:00",
      "updated_at": "2026-07-12T15:05:00+07:00",
      "paid_at": "2026-07-12T15:05:00+07:00"
    },
    {
      "id": 3005,
      "order_code": "ORD-2026-0005",
      "provider_transaction_id": "MOMO9928102",
      "user_id": 13,
      "course_id": 1011,
      "coupon_id": null,
      "price_snapshot": 1400000,
      "discount_amount": 0,
      "amount": 1400000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "momo",
      "created_at": "2026-07-13T11:00:00+07:00",
      "updated_at": "2026-07-13T11:01:00+07:00",
      "paid_at": "2026-07-13T11:01:00+07:00"
    },
    {
      "id": 3006,
      "order_code": "ORD-2026-0006",
      "provider_transaction_id": "VNP14829106",
      "user_id": 17,
      "course_id": 1014,
      "coupon_id": null,
      "price_snapshot": 490000,
      "discount_amount": 0,
      "amount": 490000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-13T16:00:00+07:00",
      "updated_at": "2026-07-13T16:02:00+07:00",
      "paid_at": "2026-07-13T16:02:00+07:00"
    },
    {
      "id": 3007,
      "order_code": "ORD-2026-0007",
      "provider_transaction_id": null,
      "user_id": 2,
      "course_id": 1002,
      "coupon_id": null,
      "price_snapshot": 999000,
      "discount_amount": 0,
      "amount": 999000,
      "status": "pending",
      "payment_status": "unpaid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-14T08:00:00+07:00",
      "updated_at": "2026-07-14T08:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3008,
      "order_code": "ORD-2026-0008",
      "provider_transaction_id": null,
      "user_id": 4,
      "course_id": 1001,
      "coupon_id": null,
      "price_snapshot": 499000,
      "discount_amount": 0,
      "amount": 499000,
      "status": "failed",
      "payment_status": "failed",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-14T09:00:00+07:00",
      "updated_at": "2026-07-14T09:15:00+07:00",
      "paid_at": null
    },
    {
      "id": 3009,
      "order_code": "ORD-2026-0009",
      "provider_transaction_id": null,
      "user_id": 19,
      "course_id": 1006,
      "coupon_id": null,
      "price_snapshot": 590000,
      "discount_amount": 0,
      "amount": 590000,
      "status": "cancelled",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2026-07-14T10:00:00+07:00",
      "updated_at": "2026-07-14T10:30:00+07:00",
      "paid_at": null
    },
    {
      "id": 3010,
      "order_code": "ORD-2026-0010",
      "provider_transaction_id": "VNP14829110",
      "user_id": 10,
      "course_id": 1003,
      "coupon_id": 3,
      "price_snapshot": 699000,
      "discount_amount": 50000,
      "amount": 649000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-14T11:10:00+07:00",
      "updated_at": "2026-07-14T11:15:00+07:00",
      "paid_at": "2026-07-14T11:15:00+07:00"
    },
    {
      "id": 3011,
      "order_code": "ORD-2026-0011",
      "provider_transaction_id": "FT261928375",
      "user_id": 14,
      "course_id": 1005,
      "coupon_id": 4,
      "price_snapshot": 1290000,
      "discount_amount": 258000,
      "amount": 1032000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-14T13:15:00+07:00",
      "updated_at": "2026-07-14T13:20:00+07:00",
      "paid_at": "2026-07-14T13:20:00+07:00"
    },
    {
      "id": 3012,
      "order_code": "ORD-2026-0012",
      "provider_transaction_id": "MOMO1102934",
      "user_id": 16,
      "course_id": 1007,
      "coupon_id": null,
      "price_snapshot": 890000,
      "discount_amount": 0,
      "amount": 890000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "momo",
      "created_at": "2026-07-14T14:25:00+07:00",
      "updated_at": "2026-07-14T14:30:00+07:00",
      "paid_at": "2026-07-14T14:30:00+07:00"
    },
    {
      "id": 3013,
      "order_code": "ORD-2026-0013",
      "provider_transaction_id": "FREE2026001",
      "user_id": 201,
      "course_id": 1008,
      "coupon_id": null,
      "price_snapshot": 750000,
      "discount_amount": 750000,
      "amount": 0,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "free",
      "created_at": "2026-07-14T15:00:00+07:00",
      "updated_at": "2026-07-14T15:00:00+07:00",
      "paid_at": "2026-07-14T15:00:00+07:00"
    },
    {
      "id": 3014,
      "order_code": "ORD-2026-0014",
      "provider_transaction_id": "VNP14829114",
      "user_id": 202,
      "course_id": 1009,
      "coupon_id": null,
      "price_snapshot": 1500000,
      "discount_amount": 0,
      "amount": 1500000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-14T16:05:00+07:00",
      "updated_at": "2026-07-14T16:10:00+07:00",
      "paid_at": "2026-07-14T16:10:00+07:00"
    },
    {
      "id": 3015,
      "order_code": "ORD-2026-0015",
      "provider_transaction_id": "MOMO3392014",
      "user_id": 203,
      "course_id": 1010,
      "coupon_id": 1,
      "price_snapshot": 1100000,
      "discount_amount": 110000,
      "amount": 990000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "momo",
      "created_at": "2026-07-14T17:20:00+07:00",
      "updated_at": "2026-07-14T17:25:00+07:00",
      "paid_at": "2026-07-14T17:25:00+07:00"
    },
    {
      "id": 3016,
      "order_code": "ORD-2026-0016",
      "provider_transaction_id": null,
      "user_id": 204,
      "course_id": 1012,
      "coupon_id": null,
      "price_snapshot": 650000,
      "discount_amount": 0,
      "amount": 650000,
      "status": "pending",
      "payment_status": "processing",
      "payment_method": "vnpay",
      "created_at": "2026-07-15T08:30:00+07:00",
      "updated_at": "2026-07-15T08:30:00+07:00",
      "paid_at": null
    },
    {
      "id": 3017,
      "order_code": "ORD-2026-0017",
      "provider_transaction_id": null,
      "user_id": 215,
      "course_id": 1013,
      "coupon_id": null,
      "price_snapshot": 1600000,
      "discount_amount": 0,
      "amount": 1600000,
      "status": "expired",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2026-07-15T09:00:00+07:00",
      "updated_at": "2026-07-15T10:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3018,
      "order_code": "ORD-2026-0018",
      "provider_transaction_id": null,
      "user_id": 2,
      "course_id": 1015,
      "coupon_id": null,
      "price_snapshot": 350000,
      "discount_amount": 0,
      "amount": 350000,
      "status": "failed",
      "payment_status": "failed",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-15T09:45:00+07:00",
      "updated_at": "2026-07-15T10:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3019,
      "order_code": "ORD-2026-0019",
      "provider_transaction_id": "VNP14829119",
      "user_id": 5,
      "course_id": 1016,
      "coupon_id": null,
      "price_snapshot": 450000,
      "discount_amount": 0,
      "amount": 450000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-15T10:30:00+07:00",
      "updated_at": "2026-07-15T10:35:00+07:00",
      "paid_at": "2026-07-15T10:35:00+07:00"
    },
    {
      "id": 3020,
      "order_code": "ORD-2026-0020",
      "provider_transaction_id": "VNP14829120",
      "user_id": 8,
      "course_id": 1007,
      "coupon_id": 1,
      "price_snapshot": 890000,
      "discount_amount": 89000,
      "amount": 801000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-15T11:10:00+07:00",
      "updated_at": "2026-07-15T11:15:00+07:00",
      "paid_at": "2026-07-15T11:15:00+07:00"
    },
    {
      "id": 3021,
      "order_code": "ORD-2026-0021",
      "provider_transaction_id": "MOMO7710293",
      "user_id": 10,
      "course_id": 1014,
      "coupon_id": null,
      "price_snapshot": 490000,
      "discount_amount": 0,
      "amount": 490000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "momo",
      "created_at": "2026-07-15T13:40:00+07:00",
      "updated_at": "2026-07-15T13:45:00+07:00",
      "paid_at": "2026-07-15T13:45:00+07:00"
    },
    {
      "id": 3022,
      "order_code": "ORD-2026-0022",
      "provider_transaction_id": "FT261928380",
      "user_id": 11,
      "course_id": 1003,
      "coupon_id": null,
      "price_snapshot": 699000,
      "discount_amount": 0,
      "amount": 699000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-15T14:45:00+07:00",
      "updated_at": "2026-07-15T14:50:00+07:00",
      "paid_at": "2026-07-15T14:50:00+07:00"
    },
    {
      "id": 3023,
      "order_code": "ORD-2026-0023",
      "provider_transaction_id": "VNP14829123",
      "user_id": 13,
      "course_id": 1005,
      "coupon_id": null,
      "price_snapshot": 1290000,
      "discount_amount": 0,
      "amount": 1290000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-15T15:30:00+07:00",
      "updated_at": "2026-07-15T15:35:00+07:00",
      "paid_at": "2026-07-15T15:35:00+07:00"
    },
    {
      "id": 3024,
      "order_code": "ORD-2026-0024",
      "provider_transaction_id": null,
      "user_id": 14,
      "course_id": 1010,
      "coupon_id": null,
      "price_snapshot": 1100000,
      "discount_amount": 0,
      "amount": 1100000,
      "status": "pending",
      "payment_status": "unpaid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-15T16:00:00+07:00",
      "updated_at": "2026-07-15T16:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3025,
      "order_code": "ORD-2026-0025",
      "provider_transaction_id": null,
      "user_id": 16,
      "course_id": 1011,
      "coupon_id": null,
      "price_snapshot": 1400000,
      "discount_amount": 0,
      "amount": 1400000,
      "status": "cancelled",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2026-07-15T16:30:00+07:00",
      "updated_at": "2026-07-15T17:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3026,
      "order_code": "ORD-2026-0026",
      "provider_transaction_id": null,
      "user_id": 17,
      "course_id": 1012,
      "coupon_id": null,
      "price_snapshot": 650000,
      "discount_amount": 0,
      "amount": 650000,
      "status": "failed",
      "payment_status": "failed",
      "payment_method": "vnpay",
      "created_at": "2026-07-15T17:00:00+07:00",
      "updated_at": "2026-07-15T17:15:00+07:00",
      "paid_at": null
    },
    {
      "id": 3027,
      "order_code": "ORD-2026-0027",
      "provider_transaction_id": null,
      "user_id": 19,
      "course_id": 1013,
      "coupon_id": null,
      "price_snapshot": 1600000,
      "discount_amount": 0,
      "amount": 1600000,
      "status": "expired",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2026-07-15T17:30:00+07:00",
      "updated_at": "2026-07-15T18:30:00+07:00",
      "paid_at": null
    },
    {
      "id": 3028,
      "order_code": "ORD-2026-0028",
      "provider_transaction_id": "VNP14829128",
      "user_id": 201,
      "course_id": 1015,
      "coupon_id": 1,
      "price_snapshot": 350000,
      "discount_amount": 35000,
      "amount": 315000,
      "status": "paid",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "created_at": "2026-07-16T08:10:00+07:00",
      "updated_at": "2026-07-16T08:15:00+07:00",
      "paid_at": "2026-07-16T08:15:00+07:00"
    },
    {
      "id": 3029,
      "order_code": "ORD-2026-0029",
      "provider_transaction_id": null,
      "user_id": 202,
      "course_id": 1016,
      "coupon_id": null,
      "price_snapshot": 450000,
      "discount_amount": 0,
      "amount": 450000,
      "status": "pending",
      "payment_status": "unpaid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-16T08:30:00+07:00",
      "updated_at": "2026-07-16T08:30:00+07:00",
      "paid_at": null
    },
    {
      "id": 3030,
      "order_code": "ORD-2026-0030",
      "provider_transaction_id": null,
      "user_id": 203,
      "course_id": 1001,
      "coupon_id": null,
      "price_snapshot": 499000,
      "discount_amount": 0,
      "amount": 499000,
      "status": "cancelled",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2026-07-16T08:45:00+07:00",
      "updated_at": "2026-07-16T08:50:00+07:00",
      "paid_at": null
    },
    {
      "id": 3031,
      "order_code": "ORD-2026-0031",
      "provider_transaction_id": null,
      "user_id": 210,
      "course_id": 1004,
      "coupon_id": null,
      "price_snapshot": 1199000,
      "discount_amount": 0,
      "amount": 1199000,
      "status": "pending",
      "payment_status": "processing",
      "payment_method": "vnpay",
      "created_at": "2026-07-16T11:00:00+07:00",
      "updated_at": "2026-07-16T11:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3032,
      "order_code": "ORD-2026-0032",
      "provider_transaction_id": null,
      "user_id": 211,
      "course_id": 1005,
      "coupon_id": null,
      "price_snapshot": 1290000,
      "discount_amount": 0,
      "amount": 1290000,
      "status": "pending",
      "payment_status": "unpaid",
      "payment_method": "bank_transfer",
      "created_at": "2026-07-16T14:20:00+07:00",
      "updated_at": "2026-07-16T14:20:00+07:00",
      "paid_at": null
    },
    {
      "id": 3033,
      "order_code": "ORD-2026-0033",
      "provider_transaction_id": null,
      "user_id": 212,
      "course_id": 1006,
      "coupon_id": null,
      "price_snapshot": 590000,
      "discount_amount": 0,
      "amount": 590000,
      "status": "pending",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2026-06-20T10:15:00+07:00",
      "updated_at": "2026-06-20T10:15:00+07:00",
      "paid_at": null
    },
    {
      "id": 3034,
      "order_code": "ORD-2026-0034",
      "provider_transaction_id": null,
      "user_id": 215,
      "course_id": 1007,
      "coupon_id": null,
      "price_snapshot": 890000,
      "discount_amount": 0,
      "amount": 890000,
      "status": "pending",
      "payment_status": "processing",
      "payment_method": "vnpay",
      "created_at": "2026-03-15T09:30:00+07:00",
      "updated_at": "2026-03-15T09:30:00+07:00",
      "paid_at": null
    },
    {
      "id": 3035,
      "order_code": "ORD-2026-0035",
      "provider_transaction_id": null,
      "user_id": 201,
      "course_id": 1008,
      "coupon_id": null,
      "price_snapshot": 750000,
      "discount_amount": 0,
      "amount": 750000,
      "status": "failed",
      "payment_status": "failed",
      "payment_method": "bank_transfer",
      "created_at": "2026-06-18T16:45:00+07:00",
      "updated_at": "2026-06-18T17:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3036,
      "order_code": "ORD-2025-0036",
      "provider_transaction_id": null,
      "user_id": 202,
      "course_id": 1009,
      "coupon_id": null,
      "price_snapshot": 1500000,
      "discount_amount": 0,
      "amount": 1500000,
      "status": "failed",
      "payment_status": "failed",
      "payment_method": "momo",
      "created_at": "2025-09-10T14:00:00+07:00",
      "updated_at": "2025-09-10T14:15:00+07:00",
      "paid_at": null
    },
    {
      "id": 3037,
      "order_code": "ORD-2026-0037",
      "provider_transaction_id": null,
      "user_id": 203,
      "course_id": 1010,
      "coupon_id": null,
      "price_snapshot": 1100000,
      "discount_amount": 0,
      "amount": 1100000,
      "status": "cancelled",
      "payment_status": "unpaid",
      "payment_method": "bank_transfer",
      "created_at": "2026-06-25T11:20:00+07:00",
      "updated_at": "2026-06-25T12:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3038,
      "order_code": "ORD-2025-0038",
      "provider_transaction_id": null,
      "user_id": 204,
      "course_id": 1012,
      "coupon_id": null,
      "price_snapshot": 650000,
      "discount_amount": 0,
      "amount": 650000,
      "status": "cancelled",
      "payment_status": "failed",
      "payment_method": "vnpay",
      "created_at": "2025-10-05T15:30:00+07:00",
      "updated_at": "2025-10-05T16:00:00+07:00",
      "paid_at": null
    },
    {
      "id": 3039,
      "order_code": "ORD-2025-0039",
      "provider_transaction_id": null,
      "user_id": 210,
      "course_id": 1013,
      "coupon_id": null,
      "price_snapshot": 1600000,
      "discount_amount": 0,
      "amount": 1600000,
      "status": "expired",
      "payment_status": "unpaid",
      "payment_method": "momo",
      "created_at": "2025-11-20T10:00:00+07:00",
      "updated_at": "2025-11-21T10:00:00+07:00",
      "paid_at": null
    }
  ],
  "enrollments": [
    {
      "id": 4001,
      "user_id": 2,
      "course_id": 1001,
      "order_id": 3001,
      "progress_percent": 45,
      "status": "ongoing",
      "created_at": "2026-07-10T09:05:00+07:00",
      "completed_at": null
    },
    {
      "id": 4002,
      "user_id": 4,
      "course_id": 1002,
      "order_id": 3002,
      "progress_percent": 10,
      "status": "ongoing",
      "created_at": "2026-07-11T14:35:00+07:00",
      "completed_at": null
    },
    {
      "id": 4003,
      "user_id": 8,
      "course_id": 1004,
      "order_id": 3003,
      "progress_percent": 100,
      "status": "completed",
      "created_at": "2026-07-12T10:02:00+07:00",
      "completed_at": "2026-07-13T22:00:00+07:00"
    },
    {
      "id": 4004,
      "user_id": 11,
      "course_id": 1006,
      "order_id": 3004,
      "progress_percent": 85,
      "status": "ongoing",
      "created_at": "2026-07-12T15:05:00+07:00",
      "completed_at": null
    },
    {
      "id": 4005,
      "user_id": 13,
      "course_id": 1011,
      "order_id": 3005,
      "progress_percent": 0,
      "status": "ongoing",
      "created_at": "2026-07-13T11:01:00+07:00",
      "completed_at": null
    },
    {
      "id": 4006,
      "user_id": 17,
      "course_id": 1014,
      "order_id": 3006,
      "progress_percent": 100,
      "status": "completed",
      "created_at": "2026-07-13T16:02:00+07:00",
      "completed_at": "2026-07-14T12:00:00+07:00"
    },
    {
      "id": 4007,
      "user_id": 10,
      "course_id": 1003,
      "order_id": 3010,
      "progress_percent": 30,
      "status": "ongoing",
      "created_at": "2026-07-14T11:15:00+07:00",
      "completed_at": null
    },
    {
      "id": 4008,
      "user_id": 14,
      "course_id": 1005,
      "order_id": 3011,
      "progress_percent": 15,
      "status": "ongoing",
      "created_at": "2026-07-14T13:20:00+07:00",
      "completed_at": null
    },
    {
      "id": 4009,
      "user_id": 16,
      "course_id": 1007,
      "order_id": 3012,
      "progress_percent": 60,
      "status": "ongoing",
      "created_at": "2026-07-14T14:30:00+07:00",
      "completed_at": null
    },
    {
      "id": 4010,
      "user_id": 201,
      "course_id": 1008,
      "order_id": 3013,
      "progress_percent": 100,
      "status": "completed",
      "created_at": "2026-07-14T15:00:00+07:00",
      "completed_at": "2026-07-15T09:30:00+07:00"
    },
    {
      "id": 4011,
      "user_id": 202,
      "course_id": 1009,
      "order_id": 3014,
      "progress_percent": 25,
      "status": "ongoing",
      "created_at": "2026-07-14T16:10:00+07:00",
      "completed_at": null
    },
    {
      "id": 4012,
      "user_id": 203,
      "course_id": 1010,
      "order_id": 3015,
      "progress_percent": 75,
      "status": "ongoing",
      "created_at": "2026-07-14T17:25:00+07:00",
      "completed_at": null
    },
    {
      "id": 4013,
      "user_id": 5,
      "course_id": 1016,
      "order_id": 3019,
      "progress_percent": 50,
      "status": "ongoing",
      "created_at": "2026-07-15T10:35:00+07:00",
      "completed_at": null
    },
    {
      "id": 4014,
      "user_id": 8,
      "course_id": 1007,
      "order_id": 3020,
      "progress_percent": 90,
      "status": "ongoing",
      "created_at": "2026-07-15T11:15:00+07:00",
      "completed_at": null
    },
    {
      "id": 4015,
      "user_id": 10,
      "course_id": 1014,
      "order_id": 3021,
      "progress_percent": 20,
      "status": "ongoing",
      "created_at": "2026-07-15T13:45:00+07:00",
      "completed_at": null
    },
    {
      "id": 4016,
      "user_id": 11,
      "course_id": 1003,
      "order_id": 3022,
      "progress_percent": 100,
      "status": "completed",
      "created_at": "2026-07-15T14:50:00+07:00",
      "completed_at": "2026-07-16T07:00:00+07:00"
    },
    {
      "id": 4017,
      "user_id": 13,
      "course_id": 1005,
      "order_id": 3023,
      "progress_percent": 10,
      "status": "ongoing",
      "created_at": "2026-07-15T15:35:00+07:00",
      "completed_at": null
    },
    {
      "id": 4018,
      "user_id": 201,
      "course_id": 1015,
      "order_id": 3028,
      "progress_percent": 0,
      "status": "ongoing",
      "created_at": "2026-07-16T08:15:00+07:00",
      "completed_at": null
    }
  ],
  "revenues": [
    {
      "id": 5001,
      "order_id": 3001,
      "course_id": 1001,
      "instructor_id": 3,
      "gross_amount": 499000,
      "instructor_amount": 349300,
      "platform_fee_amount": 149700,
      "status": "withdrawn",
      "earned_at": "2026-07-10T09:05:00+07:00"
    },
    {
      "id": 5002,
      "order_id": 3002,
      "course_id": 1002,
      "instructor_id": 3,
      "gross_amount": 899000,
      "instructor_amount": 629300,
      "platform_fee_amount": 269700,
      "status": "withdrawn",
      "earned_at": "2026-07-11T14:35:00+07:00"
    },
    {
      "id": 5003,
      "order_id": 3003,
      "course_id": 1004,
      "instructor_id": 6,
      "gross_amount": 1199000,
      "instructor_amount": 839300,
      "platform_fee_amount": 359700,
      "status": "withdrawn",
      "earned_at": "2026-07-12T10:02:00+07:00"
    },
    {
      "id": 5004,
      "order_id": 3004,
      "course_id": 1006,
      "instructor_id": 206,
      "gross_amount": 531000,
      "instructor_amount": 371700,
      "platform_fee_amount": 159300,
      "status": "available",
      "earned_at": "2026-07-12T15:05:00+07:00"
    },
    {
      "id": 5005,
      "order_id": 3005,
      "course_id": 1011,
      "instructor_id": 206,
      "gross_amount": 1400000,
      "instructor_amount": 980000,
      "platform_fee_amount": 420000,
      "status": "available",
      "earned_at": "2026-07-13T11:01:00+07:00"
    },
    {
      "id": 5006,
      "order_id": 3006,
      "course_id": 1014,
      "instructor_id": 6,
      "gross_amount": 490000,
      "instructor_amount": 343000,
      "platform_fee_amount": 147000,
      "status": "available",
      "earned_at": "2026-07-13T16:02:00+07:00"
    },
    {
      "id": 5007,
      "order_id": 3010,
      "course_id": 1003,
      "instructor_id": 206,
      "gross_amount": 649000,
      "instructor_amount": 454300,
      "platform_fee_amount": 194700,
      "status": "available",
      "earned_at": "2026-07-14T11:15:00+07:00"
    },
    {
      "id": 5008,
      "order_id": 3011,
      "course_id": 1005,
      "instructor_id": 205,
      "gross_amount": 1032000,
      "instructor_amount": 722400,
      "platform_fee_amount": 309600,
      "status": "available",
      "earned_at": "2026-07-14T13:20:00+07:00"
    },
    {
      "id": 5009,
      "order_id": 3012,
      "course_id": 1007,
      "instructor_id": 6,
      "gross_amount": 890000,
      "instructor_amount": 623000,
      "platform_fee_amount": 267000,
      "status": "available",
      "earned_at": "2026-07-14T14:30:00+07:00"
    },
    {
      "id": 5010,
      "order_id": 3013,
      "course_id": 1008,
      "instructor_id": 3,
      "gross_amount": 0,
      "instructor_amount": 0,
      "platform_fee_amount": 0,
      "status": "available",
      "earned_at": "2026-07-14T15:00:00+07:00"
    },
    {
      "id": 5011,
      "order_id": 3014,
      "course_id": 1009,
      "instructor_id": 6,
      "gross_amount": 1500000,
      "instructor_amount": 1050000,
      "platform_fee_amount": 450000,
      "status": "available",
      "earned_at": "2026-07-14T16:10:00+07:00"
    },
    {
      "id": 5012,
      "order_id": 3015,
      "course_id": 1010,
      "instructor_id": 32,
      "gross_amount": 990000,
      "instructor_amount": 693000,
      "platform_fee_amount": 297000,
      "status": "available",
      "earned_at": "2026-07-14T17:25:00+07:00"
    },
    {
      "id": 5013,
      "order_id": 3019,
      "course_id": 1016,
      "instructor_id": 105,
      "gross_amount": 450000,
      "instructor_amount": 315000,
      "platform_fee_amount": 135000,
      "status": "available",
      "earned_at": "2026-07-15T10:35:00+07:00"
    },
    {
      "id": 5014,
      "order_id": 3020,
      "course_id": 1007,
      "instructor_id": 6,
      "gross_amount": 801000,
      "instructor_amount": 560700,
      "platform_fee_amount": 240300,
      "status": "available",
      "earned_at": "2026-07-15T11:15:00+07:00"
    },
    {
      "id": 5015,
      "order_id": 3021,
      "course_id": 1014,
      "instructor_id": 6,
      "gross_amount": 490000,
      "instructor_amount": 343000,
      "platform_fee_amount": 147000,
      "status": "available",
      "earned_at": "2026-07-15T13:45:00+07:00"
    },
    {
      "id": 5016,
      "order_id": 3022,
      "course_id": 1003,
      "instructor_id": 206,
      "gross_amount": 699000,
      "instructor_amount": 489300,
      "platform_fee_amount": 209700,
      "status": "available",
      "earned_at": "2026-07-15T14:50:00+07:00"
    },
    {
      "id": 5017,
      "order_id": 3023,
      "course_id": 1005,
      "instructor_id": 205,
      "gross_amount": 1290000,
      "instructor_amount": 903000,
      "platform_fee_amount": 387000,
      "status": "available",
      "earned_at": "2026-07-15T15:35:00+07:00"
    },
    {
      "id": 5018,
      "order_id": 3028,
      "course_id": 1015,
      "instructor_id": 3,
      "gross_amount": 315000,
      "instructor_amount": 220500,
      "platform_fee_amount": 94500,
      "status": "available",
      "earned_at": "2026-07-16T08:15:00+07:00"
    }
  ],
  "payoutAccounts": [
    {
      "id": 6001,
      "user_id": 3,
      "provider": "Vietcombank",
      "account_name": "TRAN THI DAY",
      "account_number": "190126282446",
      "account_number_masked": "190******0",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6002,
      "user_id": 6,
      "provider": "Techcombank",
      "account_name": "HOANG TAM NGUNG",
      "account_number": "190668221079",
      "account_number_masked": "190******1",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6003,
      "user_id": 9,
      "provider": "MB Bank",
      "account_name": "LE GIANG VIEN XIN",
      "account_number": "190821067017",
      "account_number_masked": "190******2",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6004,
      "user_id": 12,
      "provider": "Vietcombank",
      "account_name": "PHAM THAY GIAO TRE",
      "account_number": "190976043404",
      "account_number_masked": "190******3",
      "status": "pending_verification",
      "connected_at": null,
      "created_at": "2026-07-15T08:30:00+07:00",
      "updated_at": "2026-07-15T08:30:00+07:00"
    },
    {
      "id": 6005,
      "user_id": 15,
      "provider": "Techcombank",
      "account_name": "NGO GIANG VIEN HUU",
      "account_number": "190227156886",
      "account_number_masked": "190******4",
      "status": "inactive",
      "connected_at": "2026-07-02T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-18T14:00:00+07:00"
    },
    {
      "id": 6006,
      "user_id": 18,
      "provider": "MB Bank",
      "account_name": "DUONG GIAO SU",
      "account_number": "190828412067",
      "account_number_masked": "190******5",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6007,
      "user_id": 206,
      "provider": "BIDV",
      "account_name": "LE THI B",
      "account_number": "190262494525",
      "account_number_masked": "190******6",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6008,
      "user_id": 205,
      "provider": "VietinBank",
      "account_name": "NGUYEN VAN A",
      "account_number": "190490216364",
      "account_number_masked": "190******7",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6009,
      "user_id": 216,
      "provider": "ACB",
      "account_name": "NGUYEN MINH ANH",
      "account_number": "190659835290",
      "account_number_masked": "190******8",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6010,
      "user_id": 207,
      "provider": "MoMo",
      "account_name": "BUI NGOC MAI",
      "account_number": "0987654321",
      "account_number_masked": "098******1",
      "status": "pending_verification",
      "connected_at": null,
      "created_at": "2026-07-18T10:00:00+07:00",
      "updated_at": "2026-07-18T10:00:00+07:00"
    },
    {
      "id": 6011,
      "user_id": 208,
      "provider": "Techcombank",
      "account_name": "HO ĐUC LONG",
      "account_number": "190701605834",
      "account_number_masked": "190******10",
      "status": "rejected",
      "connected_at": null,
      "created_at": "2026-07-10T09:00:00+07:00",
      "updated_at": "2026-07-12T11:00:00+07:00"
    },
    {
      "id": 6012,
      "user_id": 209,
      "provider": "MB Bank",
      "account_name": "NGUYEN THANH TRUC",
      "account_number": "190179946284",
      "account_number_masked": "190******11",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6013,
      "user_id": 30,
      "provider": "BIDV",
      "account_name": "PHAM QUOC BAO",
      "account_number": "190655687955",
      "account_number_masked": "190******12",
      "status": "pending_verification",
      "connected_at": null,
      "created_at": "2026-07-19T14:30:00+07:00",
      "updated_at": "2026-07-19T14:30:00+07:00"
    },
    {
      "id": 6014,
      "user_id": 32,
      "provider": "Techcombank",
      "account_name": "THS. NGUYEN VAN ANH",
      "account_number": "190901031784",
      "account_number_masked": "190******13",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6015,
      "user_id": 38,
      "provider": "VietinBank",
      "account_name": "TRAN MINH HOANG",
      "account_number": "190305747635",
      "account_number_masked": "190******14",
      "status": "inactive",
      "connected_at": "2026-07-04T10:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-16T16:20:00+07:00"
    },
    {
      "id": 6016,
      "user_id": 25,
      "provider": "MoMo",
      "account_name": "LE THI THAO LINH",
      "account_number": "0934567890",
      "account_number_masked": "093******0",
      "status": "pending_verification",
      "connected_at": null,
      "created_at": "2026-07-20T09:15:00+07:00",
      "updated_at": "2026-07-20T09:15:00+07:00"
    },
    {
      "id": 6017,
      "user_id": 31,
      "provider": "Techcombank",
      "account_name": "PHAM QUOC BAO",
      "account_number": "190406034243",
      "account_number_masked": "190******16",
      "status": "rejected",
      "connected_at": null,
      "created_at": "2026-07-08T14:00:00+07:00",
      "updated_at": "2026-07-09T16:00:00+07:00"
    },
    {
      "id": 6018,
      "user_id": 42,
      "provider": "ACB",
      "account_name": "ĐANG TIEN DUNG",
      "account_number": "190816355172",
      "account_number_masked": "190******17",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6019,
      "user_id": 55,
      "provider": "Vietcombank",
      "account_name": "VU HAI ĐANG",
      "account_number": "190583249943",
      "account_number_masked": "190******18",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6020,
      "user_id": 61,
      "provider": "Techcombank",
      "account_name": "BUI HOANG NAM",
      "account_number": "190146913812",
      "account_number_masked": "190******19",
      "status": "pending_verification",
      "connected_at": null,
      "created_at": "2026-07-21T10:00:00+07:00",
      "updated_at": "2026-07-21T10:00:00+07:00"
    },
    {
      "id": 6021,
      "user_id": 72,
      "provider": "MB Bank",
      "account_name": "NGO QUANG HUY",
      "account_number": "190862390449",
      "account_number_masked": "190******20",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6022,
      "user_id": 84,
      "provider": "Vietcombank",
      "account_name": "LE MY DUYEN",
      "account_number": "190519914089",
      "account_number_masked": "190******21",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6023,
      "user_id": 91,
      "provider": "Techcombank",
      "account_name": "PHAN VAN ĐUC",
      "account_number": "190582108593",
      "account_number_masked": "190******22",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6024,
      "user_id": 98,
      "provider": "MB Bank",
      "account_name": "HOANG VAN TUAN",
      "account_number": "190393274004",
      "account_number_masked": "190******23",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6025,
      "user_id": 105,
      "provider": "Vietcombank",
      "account_name": "ĐO KIM ANH",
      "account_number": "190356175383",
      "account_number_masked": "190******24",
      "status": "active",
      "connected_at": "2026-07-05T09:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-05T09:00:00+07:00"
    },
    {
      "id": 6026,
      "user_id": 201,
      "provider": "BIDV",
      "account_name": "DANG TUAN KIET",
      "account_number": "50110000123456",
      "account_number_masked": "501******456",
      "status": "active",
      "connected_at": "2026-07-13T09:00:00+07:00",
      "created_at": "2026-07-13T08:30:00+07:00",
      "updated_at": "2026-07-13T09:00:00+07:00"
    },
    {
      "id": 6027,
      "user_id": 203,
      "provider": "Techcombank",
      "account_name": "LE THAO VY",
      "account_number": "1903334445556",
      "account_number_masked": "190******556",
      "status": "pending_verification",
      "connected_at": null,
      "created_at": "2026-07-11T10:00:00+07:00",
      "updated_at": "2026-07-11T10:00:00+07:00"
    },
    {
      "id": 6028,
      "user_id": 204,
      "provider": "MB Bank",
      "account_name": "PHAM HOANG NAM",
      "account_number": "999333444555",
      "account_number_masked": "999******555",
      "status": "rejected",
      "connected_at": null,
      "created_at": "2026-07-10T16:20:00+07:00",
      "updated_at": "2026-07-11T09:00:00+07:00"
    },
    {
      "id": 6029,
      "user_id": 215,
      "provider": "ACB",
      "account_name": "VO GIA HAN",
      "account_number": "123444555",
      "account_number_masked": "123******55",
      "status": "inactive",
      "connected_at": "2026-07-09T10:00:00+07:00",
      "created_at": "2026-07-09T09:00:00+07:00",
      "updated_at": "2026-07-14T15:00:00+07:00"
    },
    {
      "id": 6030,
      "user_id": 206,
      "provider": "MoMo",
      "account_name": "LE THI B",
      "account_number": "0912999888",
      "account_number_masked": "091******88",
      "status": "inactive",
      "connected_at": "2026-07-02T10:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-10T12:00:00+07:00"
    },
    {
      "id": 6031,
      "user_id": 208,
      "provider": "VietinBank",
      "account_name": "HO ĐUC LONG",
      "account_number": "108877665544",
      "account_number_masked": "108******544",
      "status": "inactive",
      "connected_at": "2026-07-03T10:00:00+07:00",
      "created_at": "2026-07-01T10:00:00+07:00",
      "updated_at": "2026-07-09T10:00:00+07:00"
    },
    {
      "id": 6032,
      "user_id": 3,
      "provider": "ACB",
      "account_name": "TRAN THI DAY",
      "account_number": "445566778899",
      "account_number_masked": "445******899",
      "status": "rejected",
      "connected_at": null,
      "created_at": "2026-06-20T10:00:00+07:00",
      "updated_at": "2026-06-21T11:00:00+07:00"
    }
  ],
  "withdrawals": [
    {
      "id": 7001,
      "withdrawal_code": "WD-202607-0001",
      "user_id": 3,
      "payout_account_id": 6001,
      "amount": 5000000,
      "status": "paid",
      "requested_at": "2026-07-21T09:30:00+07:00",
      "approved_at": "2026-07-21T10:15:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-21T11:00:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260721-7001",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "TRAN THI DAY",
        "account_number": "190126282446",
        "account_number_masked": "190******0",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 15000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5001,
          "order_id": 3001,
          "course_title": "Lập trình React Native thực chiến",
          "amount": 5000000,
          "earned_at": "2026-07-10T10:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-21T09:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 5.000.000đ từ số dư khả dụng",
          "status": "info"
        },
        {
          "timestamp": "2026-07-21T10:15:00+07:00",
          "title": "Đã được phê duyệt",
          "description": "Duyệt bởi Admin (admin@mindhub.edu.vn)",
          "status": "success"
        },
        {
          "timestamp": "2026-07-21T11:00:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch ngân hàng: TXN-20260721-7001",
          "status": "success"
        }
      ]
    },
    {
      "id": 7002,
      "withdrawal_code": "WD-202607-0002",
      "user_id": 6,
      "payout_account_id": 6002,
      "amount": 12000000,
      "status": "pending",
      "requested_at": "2026-07-21T14:20:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "HOANG TAM NGUNG",
        "account_number": "190668221079",
        "account_number_masked": "190******1",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 22000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5002,
          "order_id": 3002,
          "course_title": "Node.js Microservices Architecture",
          "amount": 12000000,
          "earned_at": "2026-07-12T14:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-21T14:20:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 12.000.000đ về ngân hàng Techcombank",
          "status": "info"
        }
      ]
    },
    {
      "id": 7003,
      "withdrawal_code": "WD-202607-0003",
      "user_id": 9,
      "payout_account_id": 6003,
      "amount": 3500000,
      "status": "approved",
      "requested_at": "2026-07-21T08:00:00+07:00",
      "approved_at": "2026-07-21T11:45:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "LE GIANG VIEN XIN",
        "account_number": "190821067017",
        "account_number_masked": "190******2",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 8500000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5003,
          "order_id": 3003,
          "course_title": "Fullstack Web Development NextJS",
          "amount": 3500000,
          "earned_at": "2026-07-15T09:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-21T08:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Gửi yêu cầu rút 3.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-21T11:45:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Chờ chuyển khoản từ kế toán",
          "status": "success"
        }
      ]
    },
    {
      "id": 7004,
      "withdrawal_code": "WD-202607-0004",
      "user_id": 216,
      "payout_account_id": 6009,
      "amount": 1500000,
      "status": "rejected",
      "requested_at": "2026-07-20T16:10:00+07:00",
      "approved_at": null,
      "rejected_at": "2026-07-20T17:30:00+07:00",
      "paid_at": null,
      "rejected_reason": "Tài khoản thụ hưởng không khớp với tên giảng viên đã xác thực.",
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "NGUYEN MINH ANH",
        "account_number": "190659835290",
        "account_number_masked": "190******8",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 4500000,
        "holding_balance_before": 0,
        "available_balance_after": 4500000
      },
      "allocations": [
        {
          "revenue_id": 5004,
          "order_id": 3004,
          "course_title": "Docker & Kubernetes từ Z đến A",
          "amount": 1500000,
          "earned_at": "2026-07-14T11:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-20T16:10:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 1.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-20T17:30:00+07:00",
          "title": "Từ chối yêu cầu",
          "description": "Lý do: Tài khoản thụ hưởng không khớp với tên giảng viên đã xác thực.",
          "status": "error"
        }
      ]
    },
    {
      "id": 7005,
      "withdrawal_code": "WD-202607-0005",
      "user_id": 72,
      "payout_account_id": 6021,
      "amount": 8000000,
      "status": "pending",
      "requested_at": "2026-07-20T10:15:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "NGO QUANG HUY",
        "account_number": "190862390449",
        "account_number_masked": "190******20",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 18000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5005,
          "order_id": 3005,
          "course_title": "Python Data Science Mastery",
          "amount": 8000000,
          "earned_at": "2026-07-13T15:30:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-20T10:15:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 8.000.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7006,
      "withdrawal_code": "WD-202607-0006",
      "user_id": 84,
      "payout_account_id": 6022,
      "amount": 4200000,
      "status": "paid",
      "requested_at": "2026-07-19T11:00:00+07:00",
      "approved_at": "2026-07-19T14:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-19T16:20:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260719-8401",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "LE MY DUYEN",
        "account_number": "190519914089",
        "account_number_masked": "190******21",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 9200000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5006,
          "order_id": 3006,
          "course_title": "UI/UX Design chuyên nghiệp Figma",
          "amount": 4200000,
          "earned_at": "2026-07-11T09:20:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-19T11:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 4.200.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-19T14:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt bởi Admin",
          "status": "success"
        },
        {
          "timestamp": "2026-07-19T16:20:00+07:00",
          "title": "Thanh toán thành công",
          "description": "Mã giao dịch: TXN-20260719-8401",
          "status": "success"
        }
      ]
    },
    {
      "id": 7007,
      "withdrawal_code": "WD-202607-0007",
      "user_id": 91,
      "payout_account_id": 6023,
      "amount": 9500000,
      "status": "approved",
      "requested_at": "2026-07-18T13:40:00+07:00",
      "approved_at": "2026-07-18T15:10:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "PHAN VAN ĐUC",
        "account_number": "190582108593",
        "account_number_masked": "190******22",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 19500000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5007,
          "order_id": 3007,
          "course_title": "Java Spring Boot Microservices",
          "amount": 9500000,
          "earned_at": "2026-07-10T16:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-18T13:40:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 9.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-18T15:10:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Đang xếp lịch chi tiền",
          "status": "success"
        }
      ]
    },
    {
      "id": 7008,
      "withdrawal_code": "WD-202607-0008",
      "user_id": 98,
      "payout_account_id": 6024,
      "amount": 2800000,
      "status": "pending",
      "requested_at": "2026-07-17T09:15:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "HOANG VAN TUAN",
        "account_number": "190393274004",
        "account_number_masked": "190******23",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 5800000,
        "holding_balance_before": 0,
        "available_balance_after": 3000000
      },
      "allocations": [
        {
          "revenue_id": 5008,
          "order_id": 3008,
          "course_title": "Flutter Cross-Platform Development",
          "amount": 2800000,
          "earned_at": "2026-07-09T14:20:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-17T09:15:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 2.800.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7009,
      "withdrawal_code": "WD-202607-0009",
      "user_id": 105,
      "payout_account_id": 6025,
      "amount": 6300000,
      "status": "paid",
      "requested_at": "2026-07-16T15:00:00+07:00",
      "approved_at": "2026-07-16T16:30:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-17T08:45:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260717-1051",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "ĐO KIM ANH",
        "account_number": "190356175383",
        "account_number_masked": "190******24",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 16300000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5009,
          "order_id": 3009,
          "course_title": "DevOps Engineer Professional Course",
          "amount": 6300000,
          "earned_at": "2026-07-08T11:30:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-16T15:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 6.300.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-16T16:30:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Đã xác nhận tài khoản",
          "status": "success"
        },
        {
          "timestamp": "2026-07-17T08:45:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260717-1051",
          "status": "success"
        }
      ]
    },
    {
      "id": 7010,
      "withdrawal_code": "WD-202607-0010",
      "user_id": 205,
      "payout_account_id": 6008,
      "amount": 11000000,
      "status": "rejected",
      "requested_at": "2026-07-15T10:00:00+07:00",
      "approved_at": null,
      "rejected_at": "2026-07-15T11:20:00+07:00",
      "paid_at": null,
      "rejected_reason": "Tài khoản đang bị tạm khóa để đối soát giao dịch nghi ngờ.",
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "NGUYEN VAN A",
        "account_number": "190490216364",
        "account_number_masked": "190******7",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 11000000,
        "holding_balance_before": 0,
        "available_balance_after": 11000000
      },
      "allocations": [
        {
          "revenue_id": 5010,
          "order_id": 3010,
          "course_title": "Golang High Performance Backend",
          "amount": 11000000,
          "earned_at": "2026-07-07T10:10:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-15T10:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 11.000.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-15T11:20:00+07:00",
          "title": "Từ chối yêu cầu",
          "description": "Lý do: Tài khoản đang bị tạm khóa để đối soát giao dịch nghi ngờ.",
          "status": "error"
        }
      ]
    },
    {
      "id": 7011,
      "withdrawal_code": "WD-202607-0011",
      "user_id": 206,
      "payout_account_id": 6007,
      "amount": 7500000,
      "status": "pending",
      "requested_at": "2026-07-14T14:45:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "LE THI B",
        "account_number": "190262494525",
        "account_number_masked": "190******6",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 12500000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5011,
          "order_id": 3011,
          "course_title": "AI Prompt Engineering Masterclass",
          "amount": 7500000,
          "earned_at": "2026-07-06T09:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-14T14:45:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 7.500.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7012,
      "withdrawal_code": "WD-202607-0012",
      "user_id": 3,
      "payout_account_id": 6001,
      "amount": 15000000,
      "status": "paid",
      "requested_at": "2026-07-13T09:00:00+07:00",
      "approved_at": "2026-07-13T10:30:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-13T14:00:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260713-301",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "TRAN THI DAY",
        "account_number": "190126282446",
        "account_number_masked": "190******0",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 25000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5012,
          "order_id": 3012,
          "course_title": "Lập trình React Native thực chiến",
          "amount": 15000000,
          "earned_at": "2026-07-05T08:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-13T09:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 15.000.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-13T10:30:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi",
          "status": "success"
        },
        {
          "timestamp": "2026-07-13T14:00:00+07:00",
          "title": "Thanh toán thành công",
          "description": "Mã giao dịch: TXN-20260713-301",
          "status": "success"
        }
      ]
    },
    {
      "id": 7013,
      "withdrawal_code": "WD-202607-0013",
      "user_id": 6,
      "payout_account_id": 6002,
      "amount": 5400000,
      "status": "approved",
      "requested_at": "2026-07-12T16:00:00+07:00",
      "approved_at": "2026-07-12T17:15:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "HOANG TAM NGUNG",
        "account_number": "190668221079",
        "account_number_masked": "190******1",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 10400000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5013,
          "order_id": 3013,
          "course_title": "Node.js Microservices Architecture",
          "amount": 5400000,
          "earned_at": "2026-07-04T12:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-12T16:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 5.400.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-12T17:15:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Chờ cổng thanh toán xử lý hàng loạt",
          "status": "success"
        }
      ]
    },
    {
      "id": 7014,
      "withdrawal_code": "WD-202607-0014",
      "user_id": 9,
      "payout_account_id": 6003,
      "amount": 2100000,
      "status": "pending",
      "requested_at": "2026-07-11T11:30:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "LE GIANG VIEN XIN",
        "account_number": "190821067017",
        "account_number_masked": "190******2",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 4100000,
        "holding_balance_before": 0,
        "available_balance_after": 2000000
      },
      "allocations": [
        {
          "revenue_id": 5014,
          "order_id": 3014,
          "course_title": "Fullstack Web Development NextJS",
          "amount": 2100000,
          "earned_at": "2026-07-03T11:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-11T11:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 2.100.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7015,
      "withdrawal_code": "WD-202607-0015",
      "user_id": 72,
      "payout_account_id": 6021,
      "amount": 18500000,
      "status": "paid",
      "requested_at": "2026-07-10T08:15:00+07:00",
      "approved_at": "2026-07-10T10:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-10T11:30:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260710-7201",
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "NGO QUANG HUY",
        "account_number": "190862390449",
        "account_number_masked": "190******20",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 28500000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5015,
          "order_id": 3015,
          "course_title": "Python Data Science Mastery",
          "amount": 18500000,
          "earned_at": "2026-07-02T15:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-10T08:15:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 18.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-10T10:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Đã xác minh số dư",
          "status": "success"
        },
        {
          "timestamp": "2026-07-10T11:30:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260710-7201",
          "status": "success"
        }
      ]
    },
    {
      "id": 7016,
      "withdrawal_code": "WD-202607-0016",
      "user_id": 84,
      "payout_account_id": 6022,
      "amount": 3900000,
      "status": "rejected",
      "requested_at": "2026-07-09T14:10:00+07:00",
      "approved_at": null,
      "rejected_at": "2026-07-09T15:30:00+07:00",
      "paid_at": null,
      "rejected_reason": "Chưa hoàn tất xác minh danh tính giảng viên.",
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "LE MY DUYEN",
        "account_number": "190519914089",
        "account_number_masked": "190******21",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 3900000,
        "holding_balance_before": 0,
        "available_balance_after": 3900000
      },
      "allocations": [
        {
          "revenue_id": 5016,
          "order_id": 3016,
          "course_title": "UI/UX Design chuyên nghiệp Figma",
          "amount": 3900000,
          "earned_at": "2026-07-01T10:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-09T14:10:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 3.900.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-09T15:30:00+07:00",
          "title": "Từ chối yêu cầu",
          "description": "Lý do: Chưa hoàn tất xác minh danh tính giảng viên.",
          "status": "error"
        }
      ]
    },
    {
      "id": 7017,
      "withdrawal_code": "WD-202607-0017",
      "user_id": 91,
      "payout_account_id": 6023,
      "amount": 16000000,
      "status": "paid",
      "requested_at": "2026-07-08T09:30:00+07:00",
      "approved_at": "2026-07-08T11:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-08T15:45:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260708-9101",
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "PHAN VAN ĐUC",
        "account_number": "190582108593",
        "account_number_masked": "190******22",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 26000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5017,
          "order_id": 3017,
          "course_title": "Java Spring Boot Microservices",
          "amount": 16000000,
          "earned_at": "2026-06-30T14:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-08T09:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 16.000.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-08T11:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Đã xác nhận với bộ phận kế toán",
          "status": "success"
        },
        {
          "timestamp": "2026-07-08T15:45:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260708-9101",
          "status": "success"
        }
      ]
    },
    {
      "id": 7018,
      "withdrawal_code": "WD-202607-0018",
      "user_id": 98,
      "payout_account_id": 6024,
      "amount": 4700000,
      "status": "pending",
      "requested_at": "2026-07-07T16:20:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "HOANG VAN TUAN",
        "account_number": "190393274004",
        "account_number_masked": "190******23",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 8700000,
        "holding_balance_before": 0,
        "available_balance_after": 4000000
      },
      "allocations": [
        {
          "revenue_id": 5018,
          "order_id": 3018,
          "course_title": "Flutter Cross-Platform Development",
          "amount": 4700000,
          "earned_at": "2026-06-29T09:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-07T16:20:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 4.700.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7019,
      "withdrawal_code": "WD-202607-0019",
      "user_id": 105,
      "payout_account_id": 6025,
      "amount": 8200000,
      "status": "approved",
      "requested_at": "2026-07-06T10:15:00+07:00",
      "approved_at": "2026-07-06T14:00:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "ĐO KIM ANH",
        "account_number": "190356175383",
        "account_number_masked": "190******24",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 13200000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5001,
          "order_id": 3001,
          "course_title": "DevOps Engineer Professional Course",
          "amount": 8200000,
          "earned_at": "2026-06-28T11:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-06T10:15:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 8.200.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-06T14:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Chờ lệnh giải ngân đợt 2",
          "status": "success"
        }
      ]
    },
    {
      "id": 7020,
      "withdrawal_code": "WD-202607-0020",
      "user_id": 205,
      "payout_account_id": 6008,
      "amount": 14000000,
      "status": "paid",
      "requested_at": "2026-07-05T11:00:00+07:00",
      "approved_at": "2026-07-05T13:30:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-05T16:00:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260705-2051",
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "NGUYEN VAN A",
        "account_number": "190490216364",
        "account_number_masked": "190******7",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 24000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5002,
          "order_id": 3002,
          "course_title": "Golang High Performance Backend",
          "amount": 14000000,
          "earned_at": "2026-06-27T10:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-05T11:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 14.000.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-05T13:30:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi",
          "status": "success"
        },
        {
          "timestamp": "2026-07-05T16:00:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260705-2051",
          "status": "success"
        }
      ]
    },
    {
      "id": 7021,
      "withdrawal_code": "WD-202607-0021",
      "user_id": 206,
      "payout_account_id": 6007,
      "amount": 2900000,
      "status": "pending",
      "requested_at": "2026-07-04T09:30:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "LE THI B",
        "account_number": "190262494525",
        "account_number_masked": "190******6",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 5900000,
        "holding_balance_before": 0,
        "available_balance_after": 3000000
      },
      "allocations": [
        {
          "revenue_id": 5003,
          "order_id": 3003,
          "course_title": "AI Prompt Engineering Masterclass",
          "amount": 2900000,
          "earned_at": "2026-06-26T15:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-04T09:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 2.900.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7022,
      "withdrawal_code": "WD-202607-0022",
      "user_id": 216,
      "payout_account_id": 6009,
      "amount": 9100000,
      "status": "paid",
      "requested_at": "2026-07-03T14:20:00+07:00",
      "approved_at": "2026-07-03T16:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-07-04T10:15:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260704-2161",
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "NGUYEN MINH ANH",
        "account_number": "190659835290",
        "account_number_masked": "190******8",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 14100000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5004,
          "order_id": 3004,
          "course_title": "Docker & Kubernetes từ Z đến A",
          "amount": 9100000,
          "earned_at": "2026-06-25T11:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-07-03T14:20:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 9.100.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-07-03T16:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt bởi Admin",
          "status": "success"
        },
        {
          "timestamp": "2026-07-04T10:15:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260704-2161",
          "status": "success"
        }
      ]
    },
    {
      "id": 7023,
      "withdrawal_code": "WD-202606-0023",
      "user_id": 3,
      "payout_account_id": 6001,
      "amount": 22000000,
      "status": "paid",
      "requested_at": "2026-06-28T09:00:00+07:00",
      "approved_at": "2026-06-28T10:30:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-06-28T14:20:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260628-301",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "TRAN THI DAY",
        "account_number": "190126282446",
        "account_number_masked": "190******0",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 32000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5005,
          "order_id": 3005,
          "course_title": "Lập trình React Native thực chiến",
          "amount": 22000000,
          "earned_at": "2026-06-20T10:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-28T09:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 22.000.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-28T10:30:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi đợt cuối tháng 6",
          "status": "success"
        },
        {
          "timestamp": "2026-06-28T14:20:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260628-301",
          "status": "success"
        }
      ]
    },
    {
      "id": 7024,
      "withdrawal_code": "WD-202606-0024",
      "user_id": 6,
      "payout_account_id": 6002,
      "amount": 16500000,
      "status": "approved",
      "requested_at": "2026-06-25T15:30:00+07:00",
      "approved_at": "2026-06-25T17:00:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "HOANG TAM NGUNG",
        "account_number": "190668221079",
        "account_number_masked": "190******1",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 21500000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5006,
          "order_id": 3006,
          "course_title": "Node.js Microservices Architecture",
          "amount": 16500000,
          "earned_at": "2026-06-18T14:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-25T15:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 16.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-25T17:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Chờ xác nhận giao dịch ngân hàng",
          "status": "success"
        }
      ]
    },
    {
      "id": 7025,
      "withdrawal_code": "WD-202606-0025",
      "user_id": 9,
      "payout_account_id": 6003,
      "amount": 6800000,
      "status": "rejected",
      "requested_at": "2026-06-22T11:00:00+07:00",
      "approved_at": null,
      "rejected_at": "2026-06-22T14:15:00+07:00",
      "paid_at": null,
      "rejected_reason": "Hệ thống phát hiện sai lệch số dư khả dụng, chờ kiểm tra lại.",
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "LE GIANG VIEN XIN",
        "account_number": "190821067017",
        "account_number_masked": "190******2",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 6800000,
        "holding_balance_before": 0,
        "available_balance_after": 6800000
      },
      "allocations": [
        {
          "revenue_id": 5007,
          "order_id": 3007,
          "course_title": "Fullstack Web Development NextJS",
          "amount": 6800000,
          "earned_at": "2026-06-15T11:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-22T11:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 6.800.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-22T14:15:00+07:00",
          "title": "Từ chối yêu cầu",
          "description": "Lý do: Hệ thống phát hiện sai lệch số dư khả dụng, chờ kiểm tra lại.",
          "status": "error"
        }
      ]
    },
    {
      "id": 7026,
      "withdrawal_code": "WD-202606-0026",
      "user_id": 72,
      "payout_account_id": 6021,
      "amount": 13500000,
      "status": "pending",
      "requested_at": "2026-06-20T08:45:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "NGO QUANG HUY",
        "account_number": "190862390449",
        "account_number_masked": "190******20",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 18500000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5008,
          "order_id": 3008,
          "course_title": "Python Data Science Mastery",
          "amount": 13500000,
          "earned_at": "2026-06-12T09:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-20T08:45:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 13.500.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7027,
      "withdrawal_code": "WD-202606-0027",
      "user_id": 84,
      "payout_account_id": 6022,
      "amount": 5100000,
      "status": "approved",
      "requested_at": "2026-06-18T10:00:00+07:00",
      "approved_at": "2026-06-18T11:30:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "LE MY DUYEN",
        "account_number": "190519914089",
        "account_number_masked": "190******21",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 8100000,
        "holding_balance_before": 0,
        "available_balance_after": 3000000
      },
      "allocations": [
        {
          "revenue_id": 5009,
          "order_id": 3009,
          "course_title": "UI/UX Design chuyên nghiệp Figma",
          "amount": 5100000,
          "earned_at": "2026-06-10T10:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-18T10:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 5.100.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-18T11:30:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Đã xác nhận",
          "status": "success"
        }
      ]
    },
    {
      "id": 7028,
      "withdrawal_code": "WD-202606-0028",
      "user_id": 91,
      "payout_account_id": 6023,
      "amount": 10500000,
      "status": "paid",
      "requested_at": "2026-06-15T14:00:00+07:00",
      "approved_at": "2026-06-15T16:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-06-16T09:30:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260616-9102",
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "PHAN VAN ĐUC",
        "account_number": "190582108593",
        "account_number_masked": "190******22",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 15500000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5010,
          "order_id": 3010,
          "course_title": "Java Spring Boot Microservices",
          "amount": 10500000,
          "earned_at": "2026-06-08T11:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-15T14:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 10.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-15T16:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi",
          "status": "success"
        },
        {
          "timestamp": "2026-06-16T09:30:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260616-9102",
          "status": "success"
        }
      ]
    },
    {
      "id": 7029,
      "withdrawal_code": "WD-202606-0029",
      "user_id": 98,
      "payout_account_id": 6024,
      "amount": 3400000,
      "status": "rejected",
      "requested_at": "2026-06-12T09:15:00+07:00",
      "approved_at": null,
      "rejected_at": "2026-06-12T10:45:00+07:00",
      "paid_at": null,
      "rejected_reason": "Số dư khả dụng thay đổi do học viên yêu cầu hoàn tiền đơn hàng.",
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "HOANG VAN TUAN",
        "account_number": "190393274004",
        "account_number_masked": "190******23",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 3400000,
        "holding_balance_before": 0,
        "available_balance_after": 3400000
      },
      "allocations": [
        {
          "revenue_id": 5011,
          "order_id": 3011,
          "course_title": "Flutter Cross-Platform Development",
          "amount": 3400000,
          "earned_at": "2026-06-05T14:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-12T09:15:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 3.400.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-12T10:45:00+07:00",
          "title": "Từ chối yêu cầu",
          "description": "Lý do: Số dư khả dụng thay đổi do học viên yêu cầu hoàn tiền đơn hàng.",
          "status": "error"
        }
      ]
    },
    {
      "id": 7030,
      "withdrawal_code": "WD-202606-0030",
      "user_id": 105,
      "payout_account_id": 6025,
      "amount": 17200000,
      "status": "paid",
      "requested_at": "2026-06-10T16:00:00+07:00",
      "approved_at": "2026-06-10T17:30:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-06-11T11:00:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260611-1052",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "ĐO KIM ANH",
        "account_number": "190356175383",
        "account_number_masked": "190******24",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 27200000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5012,
          "order_id": 3012,
          "course_title": "DevOps Engineer Professional Course",
          "amount": 17200000,
          "earned_at": "2026-06-02T10:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-06-10T16:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 17.200.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-06-10T17:30:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi",
          "status": "success"
        },
        {
          "timestamp": "2026-06-11T11:00:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260611-1052",
          "status": "success"
        }
      ]
    },
    {
      "id": 7031,
      "withdrawal_code": "WD-202605-0031",
      "user_id": 205,
      "payout_account_id": 6008,
      "amount": 8800000,
      "status": "approved",
      "requested_at": "2026-05-28T10:30:00+07:00",
      "approved_at": "2026-05-28T14:00:00+07:00",
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "NGUYEN VAN A",
        "account_number": "190490216364",
        "account_number_masked": "190******7",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 13800000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5013,
          "order_id": 3013,
          "course_title": "Golang High Performance Backend",
          "amount": 8800000,
          "earned_at": "2026-05-20T09:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-05-28T10:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 8.800.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-05-28T14:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Chờ thanh toán",
          "status": "success"
        }
      ]
    },
    {
      "id": 7032,
      "withdrawal_code": "WD-202605-0032",
      "user_id": 206,
      "payout_account_id": 6007,
      "amount": 19500000,
      "status": "paid",
      "requested_at": "2026-05-20T11:00:00+07:00",
      "approved_at": "2026-05-20T13:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-05-20T16:45:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260520-2061",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "LE THI B",
        "account_number": "190262494525",
        "account_number_masked": "190******6",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 29500000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5014,
          "order_id": 3014,
          "course_title": "AI Prompt Engineering Masterclass",
          "amount": 19500000,
          "earned_at": "2026-05-12T10:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-05-20T11:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 19.500.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-05-20T13:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi thành công",
          "status": "success"
        },
        {
          "timestamp": "2026-05-20T16:45:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260520-2061",
          "status": "success"
        }
      ]
    },
    {
      "id": 7033,
      "withdrawal_code": "WD-202605-0033",
      "user_id": 216,
      "payout_account_id": 6009,
      "amount": 4100000,
      "status": "pending",
      "requested_at": "2026-05-15T15:20:00+07:00",
      "approved_at": null,
      "rejected_at": null,
      "paid_at": null,
      "rejected_reason": null,
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "MB Bank",
        "account_name": "NGUYEN MINH ANH",
        "account_number": "190659835290",
        "account_number_masked": "190******8",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 9100000,
        "holding_balance_before": 0,
        "available_balance_after": 5000000
      },
      "allocations": [
        {
          "revenue_id": 5015,
          "order_id": 3015,
          "course_title": "Docker & Kubernetes từ Z đến A",
          "amount": 4100000,
          "earned_at": "2026-05-08T09:00:00+07:00",
          "status": "pending"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-05-15T15:20:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 4.100.000đ",
          "status": "info"
        }
      ]
    },
    {
      "id": 7034,
      "withdrawal_code": "WD-202604-0034",
      "user_id": 3,
      "payout_account_id": 6001,
      "amount": 13000000,
      "status": "paid",
      "requested_at": "2026-04-25T08:30:00+07:00",
      "approved_at": "2026-04-25T10:00:00+07:00",
      "rejected_at": null,
      "paid_at": "2026-04-25T15:00:00+07:00",
      "rejected_reason": null,
      "provider_payout_id": "TXN-20260425-301",
      "payout_snapshot": {
        "provider": "Vietcombank",
        "account_name": "TRAN THI DAY",
        "account_number": "190126282446",
        "account_number_masked": "190******0",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 23000000,
        "holding_balance_before": 0,
        "available_balance_after": 10000000
      },
      "allocations": [
        {
          "revenue_id": 5016,
          "order_id": 3016,
          "course_title": "Lập trình React Native thực chiến",
          "amount": 13000000,
          "earned_at": "2026-04-18T10:00:00+07:00",
          "status": "withdrawn"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-04-25T08:30:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 13.000.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-04-25T10:00:00+07:00",
          "title": "Đã phê duyệt",
          "description": "Duyệt chi thành công",
          "status": "success"
        },
        {
          "timestamp": "2026-04-25T15:00:00+07:00",
          "title": "Hoàn tất thanh toán",
          "description": "Mã giao dịch: TXN-20260425-301",
          "status": "success"
        }
      ]
    },
    {
      "id": 7035,
      "withdrawal_code": "WD-202604-0035",
      "user_id": 6,
      "payout_account_id": 6002,
      "amount": 7800000,
      "status": "rejected",
      "requested_at": "2026-04-10T14:00:00+07:00",
      "approved_at": null,
      "rejected_at": "2026-04-10T16:30:00+07:00",
      "paid_at": null,
      "rejected_reason": "Thông tin tài khoản nhận tiền không hợp lệ theo quy định nhà cung cấp dịch vụ thanh toán.",
      "provider_payout_id": null,
      "payout_snapshot": {
        "provider": "Techcombank",
        "account_name": "HOANG TAM NGUNG",
        "account_number": "190668221079",
        "account_number_masked": "190******1",
        "status": "active",
        "connected_at": "2026-07-05T09:00:00+07:00"
      },
      "balance_snapshot": {
        "available_balance_before": 7800000,
        "holding_balance_before": 0,
        "available_balance_after": 7800000
      },
      "allocations": [
        {
          "revenue_id": 5017,
          "order_id": 3017,
          "course_title": "Node.js Microservices Architecture",
          "amount": 7800000,
          "earned_at": "2026-04-02T11:00:00+07:00",
          "status": "available"
        }
      ],
      "timeline": [
        {
          "timestamp": "2026-04-10T14:00:00+07:00",
          "title": "Gửi yêu cầu rút tiền",
          "description": "Tạo yêu cầu rút 7.800.000đ",
          "status": "info"
        },
        {
          "timestamp": "2026-04-10T16:30:00+07:00",
          "title": "Từ chối yêu cầu",
          "description": "Lý do: Thông tin tài khoản nhận tiền không hợp lệ theo quy định nhà cung cấp dịch vụ thanh toán.",
          "status": "error"
        }
      ]
    }
  ],
  "banners": [
    {
      "id": 10001,
      "title": "Chào mừng bạn đến với MindHub",
      "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      "link": "#",
      "status": "active",
      "sort_order": 1
    },
    {
      "id": 10002,
      "title": "Khóa học React 19 mới ra mắt",
      "image_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      "link": "#",
      "status": "active",
      "sort_order": 2
    }
  ],
  "faqs": [
    {
      "id": 11001,
      "question": "Làm thế nào để được nâng cấp giảng viên?",
      "answer": "Bạn cần gửi hồ sơ ứng tuyển kèm CV, bio, kinh nghiệm thực tế. Admin sẽ xem xét và phê duyệt trong vòng 24-48h.",
      "status": "active",
      "sort_order": 1
    },
    {
      "id": 11002,
      "question": "Chính sách đối soát doanh thu như thế nào?",
      "answer": "MindHub chi trả 70% doanh thu khóa học cho giảng viên, 30% là phí vận hành nền tảng.",
      "status": "active",
      "sort_order": 2
    }
  ],
  "notifications": [
    {
      "id": 12001,
      "title": "Có yêu cầu nâng cấp giảng viên mới",
      "message": "Hồ sơ của Đặng Tuấn Kiệt đang chờ duyệt.",
      "type": "system",
      "is_read": false,
      "created_at": "2026-07-14T10:00:00+07:00"
    },
    {
      "id": 12002,
      "title": "Khóa học đã gửi kiểm duyệt",
      "message": "Khóa học Next.js của giảng viên Nguyễn Văn Anh đã gửi lên hệ thống.",
      "type": "course",
      "is_read": false,
      "created_at": "2026-07-14T09:30:00+07:00"
    }
  ],
  "lessons": [
    {
      "id": 4001,
      "course_id": 1001,
      "title": "Bài 1.1: Giới thiệu Laravel REST API & Cấu trúc thư mục",
      "duration": "15:30"
    },
    {
      "id": 4002,
      "course_id": 1001,
      "title": "Bài 1.2: Cấu hình Sanctum Authentication & Middleware",
      "duration": "22:15"
    },
    {
      "id": 4003,
      "course_id": 1001,
      "title": "Bài 2.1: Tối ưu truy vấn Eloquent & Eager Loading",
      "duration": "18:45"
    },
    {
      "id": 4004,
      "course_id": 1002,
      "title": "Bài 1.1: Tổng quan React 18, JSX và Virtual DOM",
      "duration": "12:00"
    },
    {
      "id": 4005,
      "course_id": 1002,
      "title": "Bài 2.3: Quản lý State nâng cao với Redux Toolkit / Zustand",
      "duration": "30:10"
    },
    {
      "id": 4006,
      "course_id": 1003,
      "title": "Bài 1.2: Nguyên lý UI/UX & Thiết kế Grid System",
      "duration": "25:00"
    },
    {
      "id": 4007,
      "course_id": 1004,
      "title": "Bài 3.1: Kiến trúc Microservices với Node.js & RabbitMQ",
      "duration": "40:20"
    },
    {
      "id": 4008,
      "course_id": 1005,
      "title": "Bài 1.1: Lập kế hoạch Digital Marketing toàn diện 2026",
      "duration": "20:00"
    },
    {
      "id": 4009,
      "course_id": 1006,
      "title": "Bài 2.1: Xử lý dữ liệu khuyết thiếu với Pandas",
      "duration": "16:40"
    },
    {
      "id": 4010,
      "course_id": 1007,
      "title": "Bài 1.3: Đánh Index B-Tree & Query Execution Plan",
      "duration": "28:15"
    },
    {
      "id": 4011,
      "course_id": 1008,
      "title": "Bài 1.2: Vue 3 Composition API vs Options API",
      "duration": "14:50"
    },
    {
      "id": 4012,
      "course_id": 1009,
      "title": "Bài 2.2: Docker Compose cho môi trường Fullstack Development",
      "duration": "35:00"
    }
  ],
  "comments": [
    {
      "id": 5001,
      "user_id": 2,
      "course_id": 1001,
      "lesson_id": 4001,
      "parent_id": null,
      "content": "Cho em hỏi ở Bài 1.1 nếu muốn custom HTTP response status code chuẩn RESTful thì làm thế nào ạ?",
      "status": "visible",
      "created_at": "2026-07-22T14:30:00Z",
      "updated_at": "2026-07-22T14:30:00Z",
      "deleted_at": null
    },
    {
      "id": 5002,
      "user_id": 3,
      "course_id": 1001,
      "lesson_id": 4001,
      "parent_id": 5001,
      "content": "Chào bạn Học, bạn có thể return response()->json($data, 201) hoặc tạo API Resource class riêng nhé!",
      "status": "visible",
      "created_at": "2026-07-22T14:45:00Z",
      "updated_at": "2026-07-22T14:45:00Z",
      "deleted_at": null
    },
    {
      "id": 5003,
      "user_id": 4,
      "course_id": 1001,
      "lesson_id": 4002,
      "parent_id": null,
      "content": "Video bài giảng rất chi tiết. Thầy giải thích cơ chế Token Bearer cực kỳ dễ hiểu!",
      "status": "visible",
      "created_at": "2026-07-22T11:20:00Z",
      "updated_at": "2026-07-22T11:20:00Z",
      "deleted_at": null
    },
    {
      "id": 5004,
      "user_id": 5,
      "course_id": 1002,
      "lesson_id": 4004,
      "parent_id": null,
      "content": "Spam tin nhắn: Mua tài khoản giá rẻ tại website abc-test-spam.com nhận ưu đãi 90%!",
      "status": "hidden",
      "created_at": "2026-07-22T09:10:00Z",
      "updated_at": "2026-07-22T09:15:00Z",
      "deleted_at": null
    },
    {
      "id": 5005,
      "user_id": 6,
      "course_id": 1002,
      "lesson_id": 4005,
      "parent_id": null,
      "content": "Nội dung xúc phạm người khác và chứa ngôn từ không phù hợp quy định cộng đồng.",
      "status": "deleted",
      "created_at": "2026-07-21T18:00:00Z",
      "updated_at": "2026-07-21T18:30:00Z",
      "deleted_at": "2026-07-21T18:30:00Z"
    },
    {
      "id": 5006,
      "user_id": 8,
      "course_id": 1003,
      "lesson_id": 4006,
      "parent_id": null,
      "content": "Cảm ơn tác giả. Grid System trong Figma được hướng dẫn chi tiết vượt mong đợi.",
      "status": "visible",
      "created_at": "2026-07-21T15:40:00Z",
      "updated_at": "2026-07-21T15:40:00Z",
      "deleted_at": null
    },
    {
      "id": 5007,
      "user_id": 9,
      "course_id": 1003,
      "lesson_id": 4006,
      "parent_id": 5006,
      "content": "Chúc bạn áp dụng tốt vào dự án thực tế nhé!",
      "status": "visible",
      "created_at": "2026-07-21T16:00:00Z",
      "updated_at": "2026-07-21T16:00:00Z",
      "deleted_at": null
    },
    {
      "id": 5008,
      "user_id": 10,
      "course_id": 1004,
      "lesson_id": 4007,
      "parent_id": null,
      "content": "Phần RabbitMQ Message Queue bị lỗi kết nối AMQP, thầy hỗ trợ check log giúp em với.",
      "status": "visible",
      "created_at": "2026-07-20T10:00:00Z",
      "updated_at": "2026-07-20T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 5009,
      "user_id": 11,
      "course_id": 1004,
      "lesson_id": 4007,
      "parent_id": 5008,
      "content": "Bạn kiểm tra lại port 5672 và username/password trong file docker-compose.yml nhé.",
      "status": "visible",
      "created_at": "2026-07-20T10:25:00Z",
      "updated_at": "2026-07-20T10:25:00Z",
      "deleted_at": null
    },
    {
      "id": 5010,
      "user_id": 12,
      "course_id": 1005,
      "lesson_id": 4008,
      "parent_id": null,
      "content": "Đã ứng dụng chạy Facebook Ads theo đúng tệp đối tượng được hướng dẫn, ROI tăng rõ rệt!",
      "status": "visible",
      "created_at": "2026-07-19T14:15:00Z",
      "updated_at": "2026-07-19T14:15:00Z",
      "deleted_at": null
    },
    {
      "id": 5011,
      "user_id": 13,
      "course_id": 1006,
      "lesson_id": 4009,
      "parent_id": null,
      "content": "Hàm fillna() và dropna() trong Pandas trình bày vô cùng mạch lạc.",
      "status": "visible",
      "created_at": "2026-07-18T09:30:00Z",
      "updated_at": "2026-07-18T09:30:00Z",
      "deleted_at": null
    },
    {
      "id": 5012,
      "user_id": 14,
      "course_id": 1007,
      "lesson_id": 4010,
      "parent_id": null,
      "content": "Quảng cáo dịch vụ kéo Telegram & Zalo group: liên hệ ngay 0999888777",
      "status": "hidden",
      "created_at": "2026-07-17T16:20:00Z",
      "updated_at": "2026-07-17T16:25:00Z",
      "deleted_at": null
    },
    {
      "id": 5013,
      "user_id": 15,
      "course_id": 1008,
      "lesson_id": 4011,
      "parent_id": null,
      "content": "Bình luận chứa liên kết nguy hiểm <script>alert('test')</script> đã được ngăn chặn.",
      "status": "hidden",
      "created_at": "2026-07-16T11:00:00Z",
      "updated_at": "2026-07-16T11:05:00Z",
      "deleted_at": null
    },
    {
      "id": 5014,
      "user_id": 16,
      "course_id": 1009,
      "lesson_id": 4012,
      "parent_id": null,
      "content": "Docker Compose volume mapping cho live-reload chạy rất mượt trên Windows 11 WSL2.",
      "status": "visible",
      "created_at": "2026-07-15T08:45:00Z",
      "updated_at": "2026-07-15T08:45:00Z",
      "deleted_at": null
    },
    {
      "id": 5015,
      "user_id": 17,
      "course_id": 1010,
      "lesson_id": null,
      "parent_id": null,
      "content": "Khóa học Next.js App Router rất hiện đại, cập nhật Server Components đầy đủ.",
      "status": "visible",
      "created_at": "2026-07-14T19:20:00Z",
      "updated_at": "2026-07-14T19:20:00Z",
      "deleted_at": null
    },
    {
      "id": 5016,
      "user_id": 18,
      "course_id": 1001,
      "lesson_id": 4003,
      "parent_id": null,
      "content": "Nội dung vi phạm quy tắc: đăng tải lời lẽ thô tục tiêu cực.",
      "status": "deleted",
      "created_at": "2026-07-12T13:10:00Z",
      "updated_at": "2026-07-12T13:30:00Z",
      "deleted_at": "2026-07-12T13:30:00Z"
    },
    {
      "id": 5017,
      "user_id": 19,
      "course_id": 1002,
      "lesson_id": 4005,
      "parent_id": null,
      "content": "Thầy hướng dẫn thêm phần TypeScript generics áp dụng vào Redux AsyncThunk với ạ!",
      "status": "visible",
      "created_at": "2026-07-10T10:00:00Z",
      "updated_at": "2026-07-10T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 5018,
      "user_id": 20,
      "course_id": 1003,
      "lesson_id": 4006,
      "parent_id": null,
      "content": "File đính kèm thực hành rất đẹp và chất lượng.",
      "status": "visible",
      "created_at": "2026-07-08T15:30:00Z",
      "updated_at": "2026-07-08T15:30:00Z",
      "deleted_at": null
    },
    {
      "id": 5019,
      "user_id": 206,
      "course_id": 1004,
      "lesson_id": 4007,
      "parent_id": null,
      "content": "Spam link giới thiệu casino không rõ nguồn gốc.",
      "status": "hidden",
      "created_at": "2026-07-05T09:00:00Z",
      "updated_at": "2026-07-05T09:10:00Z",
      "deleted_at": null
    },
    {
      "id": 5020,
      "user_id": 205,
      "course_id": 1005,
      "lesson_id": 4008,
      "parent_id": null,
      "content": "Khóa học hay nhưng tốc độ nói ở chương 1 hơi nhanh, mong thầy nói chậm hơn chút.",
      "status": "visible",
      "created_at": "2026-06-28T14:00:00Z",
      "updated_at": "2026-06-28T14:00:00Z",
      "deleted_at": null
    },
    {
      "id": 5021,
      "user_id": 201,
      "course_id": 1006,
      "lesson_id": 4009,
      "parent_id": null,
      "content": "Data clean up vô cùng dễ hiểu, giảng viên giải thích chi tiết từng câu lệnh.",
      "status": "visible",
      "created_at": "2026-06-20T11:45:00Z",
      "updated_at": "2026-06-20T11:45:00Z",
      "deleted_at": null
    },
    {
      "id": 5022,
      "user_id": 202,
      "course_id": 1007,
      "lesson_id": 4010,
      "parent_id": null,
      "content": "Phần EXPLAIN ANALYZE MySQL 8 giúp mình phát hiện ra bottleneck của cty ngay lập tức!",
      "status": "visible",
      "created_at": "2026-06-15T16:20:00Z",
      "updated_at": "2026-06-15T16:20:00Z",
      "deleted_at": null
    },
    {
      "id": 5023,
      "user_id": 203,
      "course_id": 1008,
      "lesson_id": 4011,
      "parent_id": null,
      "content": "Pinia thay thế Vuex mượt mà tuyệt đối.",
      "status": "visible",
      "created_at": "2026-06-01T08:30:00Z",
      "updated_at": "2026-06-01T08:30:00Z",
      "deleted_at": null
    },
    {
      "id": 5024,
      "user_id": 204,
      "course_id": 1009,
      "lesson_id": 4012,
      "parent_id": null,
      "content": "Bình luận rác đã bị hệ thống xóa bỏ.",
      "status": "deleted",
      "created_at": "2026-05-20T10:00:00Z",
      "updated_at": "2026-05-20T10:15:00Z",
      "deleted_at": "2026-05-20T10:15:00Z"
    },
    {
      "id": 5025,
      "user_id": 215,
      "course_id": 1010,
      "lesson_id": null,
      "parent_id": null,
      "content": "Next.js SSR vs SSG được phân tích rất trực quan khoa học.",
      "status": "visible",
      "created_at": "2026-04-15T15:10:00Z",
      "updated_at": "2026-04-15T15:10:00Z",
      "deleted_at": null
    },
    {
      "id": 5026,
      "user_id": 216,
      "course_id": 1001,
      "lesson_id": 4001,
      "parent_id": null,
      "content": "Rất cảm ơn tác giả đã tạo ra một khóa học chất lượng cao như thế này.",
      "status": "visible",
      "created_at": "2026-03-10T09:25:00Z",
      "updated_at": "2026-03-10T09:25:00Z",
      "deleted_at": null
    },
    {
      "id": 5027,
      "user_id": 207,
      "course_id": 1002,
      "lesson_id": 4004,
      "parent_id": null,
      "content": "Phần demo dự án thực tế xuất sắc!",
      "status": "visible",
      "created_at": "2026-02-14T14:30:00Z",
      "updated_at": "2026-02-14T14:30:00Z",
      "deleted_at": null
    },
    {
      "id": 5028,
      "user_id": 208,
      "course_id": 1003,
      "lesson_id": 4006,
      "parent_id": null,
      "content": "Thiết kế mượt mà, dễ hiểu cho người mới bắt đầu.",
      "status": "visible",
      "created_at": "2026-01-20T11:00:00Z",
      "updated_at": "2026-01-20T11:00:00Z",
      "deleted_at": null
    },
    {
      "id": 5029,
      "user_id": 209,
      "course_id": 1004,
      "lesson_id": 4007,
      "parent_id": null,
      "content": "Hỏi đáp nhanh chóng, giảng viên hỗ trợ tận tâm.",
      "status": "visible",
      "created_at": "2026-01-10T16:45:00Z",
      "updated_at": "2026-01-10T16:45:00Z",
      "deleted_at": null
    },
    {
      "id": 5030,
      "user_id": 210,
      "course_id": 1005,
      "lesson_id": 4008,
      "parent_id": null,
      "content": "Nội dung chuẩn đét, thực chiến cao.",
      "status": "visible",
      "created_at": "2026-01-05T08:15:00Z",
      "updated_at": "2026-01-05T08:15:00Z",
      "deleted_at": null
    }
  ],
  "reviews": [
    {
      "id": 6001,
      "user_id": 2,
      "course_id": 1001,
      "order_id": 3001,
      "rating": 5,
      "content": "Khóa học Laravel REST API quá tuyệt vời! Bài giảng súc tích, đi thẳng vào thực tế dự án doanh nghiệp.",
      "status": "visible",
      "created_at": "2026-07-22T13:00:00Z",
      "updated_at": "2026-07-22T13:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6002,
      "user_id": 4,
      "course_id": 1002,
      "order_id": 3002,
      "rating": 5,
      "content": "React & TS hay nhất từng học. Nhờ khóa này em đã vượt qua vòng phỏng vấn Frontend Dev!",
      "status": "visible",
      "created_at": "2026-07-22T10:45:00Z",
      "updated_at": "2026-07-22T10:45:00Z",
      "deleted_at": null
    },
    {
      "id": 6003,
      "user_id": 8,
      "course_id": 1004,
      "order_id": 3003,
      "rating": 4,
      "content": "Nội dung rất sâu về Node.js architecture. Hy vọng khóa học bổ sung thêm chủ đề K8s trong tương lai.",
      "status": "visible",
      "created_at": "2026-07-21T16:20:00Z",
      "updated_at": "2026-07-21T16:20:00Z",
      "deleted_at": null
    },
    {
      "id": 6004,
      "user_id": 11,
      "course_id": 1006,
      "order_id": 3004,
      "rating": 5,
      "content": "Python Data Analysis cực chất. Giảng viên hỗ trợ học viên rất chu đáo trong group chat.",
      "status": "visible",
      "created_at": "2026-07-21T09:15:00Z",
      "updated_at": "2026-07-21T09:15:00Z",
      "deleted_at": null
    },
    {
      "id": 6005,
      "user_id": 13,
      "course_id": 1011,
      "order_id": 3005,
      "rating": 1,
      "content": "Đánh giá ảo có dấu hiệu cạnh tranh không lành mạnh và xúc phạm giảng viên.",
      "status": "deleted",
      "created_at": "2026-07-20T14:00:00Z",
      "updated_at": "2026-07-20T14:30:00Z",
      "deleted_at": "2026-07-20T14:30:00Z"
    },
    {
      "id": 6006,
      "user_id": 17,
      "course_id": 1014,
      "order_id": 3006,
      "rating": 5,
      "content": "Kiến thức thực chiến 10/10. Đáng tiền từng xu bỏ ra!",
      "status": "visible",
      "created_at": "2026-07-19T11:10:00Z",
      "updated_at": "2026-07-19T11:10:00Z",
      "deleted_at": null
    },
    {
      "id": 6007,
      "user_id": 2,
      "course_id": 1002,
      "order_id": 3007,
      "rating": 5,
      "content": "Thầy dạy mượt mà, bài tập phong phú, code mẫu chuẩn mực Clean Code.",
      "status": "visible",
      "created_at": "2026-07-18T15:30:00Z",
      "updated_at": "2026-07-18T15:30:00Z",
      "deleted_at": null
    },
    {
      "id": 6008,
      "user_id": 4,
      "course_id": 1001,
      "order_id": 3008,
      "rating": 4,
      "content": "Chất lượng âm thanh tuyệt vời, hình ảnh Full HD rõ nét.",
      "status": "visible",
      "created_at": "2026-07-17T08:20:00Z",
      "updated_at": "2026-07-17T08:20:00Z",
      "deleted_at": null
    },
    {
      "id": 6009,
      "user_id": 19,
      "course_id": 1006,
      "order_id": 3009,
      "rating": 5,
      "content": "Tài liệu học tập đính kèm rất phong phú, dễ dàng tự ôn luyện.",
      "status": "visible",
      "created_at": "2026-07-16T13:40:00Z",
      "updated_at": "2026-07-16T13:40:00Z",
      "deleted_at": null
    },
    {
      "id": 6010,
      "user_id": 10,
      "course_id": 1003,
      "order_id": 3010,
      "rating": 2,
      "content": "Nội dung hơi cơ bản so với kỳ vọng của mình.",
      "status": "visible",
      "created_at": "2026-07-15T17:00:00Z",
      "updated_at": "2026-07-15T17:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6011,
      "user_id": 12,
      "course_id": 1005,
      "order_id": null,
      "rating": 5,
      "content": "Phương pháp giảng dạy lôi cuốn, thực tế.",
      "status": "visible",
      "created_at": "2026-07-14T09:00:00Z",
      "updated_at": "2026-07-14T09:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6012,
      "user_id": 14,
      "course_id": 1007,
      "order_id": null,
      "rating": 1,
      "content": "Đánh giá vi phạm tiêu chuẩn cộng đồng đã bị xóa bỏ.",
      "status": "deleted",
      "created_at": "2026-07-12T10:00:00Z",
      "updated_at": "2026-07-12T10:20:00Z",
      "deleted_at": "2026-07-12T10:20:00Z"
    },
    {
      "id": 6013,
      "user_id": 15,
      "course_id": 1008,
      "order_id": null,
      "rating": 4,
      "content": "Khóa học Vue 3 rất thực tế, giúp làm quen nhanh với Pinia.",
      "status": "visible",
      "created_at": "2026-07-10T14:15:00Z",
      "updated_at": "2026-07-10T14:15:00Z",
      "deleted_at": null
    },
    {
      "id": 6014,
      "user_id": 16,
      "course_id": 1009,
      "order_id": null,
      "rating": 5,
      "content": "Docker hóa ứng dụng chưa bao giờ đơn giản đến thế!",
      "status": "visible",
      "created_at": "2026-07-05T16:30:00Z",
      "updated_at": "2026-07-05T16:30:00Z",
      "deleted_at": null
    },
    {
      "id": 6015,
      "user_id": 18,
      "course_id": 1010,
      "order_id": null,
      "rating": 5,
      "content": "Next.js 14 App Router chuẩn SEO và mượt mà.",
      "status": "visible",
      "created_at": "2026-06-25T11:00:00Z",
      "updated_at": "2026-06-25T11:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6016,
      "user_id": 20,
      "course_id": 1003,
      "order_id": null,
      "rating": 3,
      "content": "Nội dung khá ổn nhưng video hơi ngắn.",
      "status": "visible",
      "created_at": "2026-06-18T09:45:00Z",
      "updated_at": "2026-06-18T09:45:00Z",
      "deleted_at": null
    },
    {
      "id": 6017,
      "user_id": 206,
      "course_id": 1004,
      "order_id": null,
      "rating": 5,
      "content": "Giảng viên tâm huyết, hỗ trợ giải đáp 24/7.",
      "status": "visible",
      "created_at": "2026-06-10T15:20:00Z",
      "updated_at": "2026-06-10T15:20:00Z",
      "deleted_at": null
    },
    {
      "id": 6018,
      "user_id": 205,
      "course_id": 1005,
      "order_id": null,
      "rating": 4,
      "content": "Học xong làm được ngay dự án cho công ty.",
      "status": "visible",
      "created_at": "2026-06-01T10:00:00Z",
      "updated_at": "2026-06-01T10:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6019,
      "user_id": 201,
      "course_id": 1006,
      "order_id": null,
      "rating": 5,
      "content": "Xử lý dữ liệu cực kỳ bài bản và chuyên nghiệp.",
      "status": "visible",
      "created_at": "2026-05-15T14:30:00Z",
      "updated_at": "2026-05-15T14:30:00Z",
      "deleted_at": null
    },
    {
      "id": 6020,
      "user_id": 202,
      "course_id": 1007,
      "order_id": null,
      "rating": 1,
      "content": "Đánh giá vi phạm đã bị gỡ bỏ theo chính sách kiểm duyệt.",
      "status": "deleted",
      "created_at": "2026-05-01T08:00:00Z",
      "updated_at": "2026-05-01T08:15:00Z",
      "deleted_at": "2026-05-01T08:15:00Z"
    },
    {
      "id": 6021,
      "user_id": 203,
      "course_id": 1008,
      "order_id": null,
      "rating": 5,
      "content": "Rất đáng tiền, kiến thức chuẩn chỉnh.",
      "status": "visible",
      "created_at": "2026-04-10T12:00:00Z",
      "updated_at": "2026-04-10T12:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6022,
      "user_id": 204,
      "course_id": 1009,
      "order_id": null,
      "rating": 4,
      "content": "Docker nâng cao ứng dụng vào CI/CD tuyệt vời.",
      "status": "visible",
      "created_at": "2026-03-20T16:15:00Z",
      "updated_at": "2026-03-20T16:15:00Z",
      "deleted_at": null
    },
    {
      "id": 6023,
      "user_id": 215,
      "course_id": 1010,
      "order_id": null,
      "rating": 5,
      "content": "Tuyệt vời! 5 sao không cần bàn cãi.",
      "status": "visible",
      "created_at": "2026-02-28T09:10:00Z",
      "updated_at": "2026-02-28T09:10:00Z",
      "deleted_at": null
    },
    {
      "id": 6024,
      "user_id": 216,
      "course_id": 1001,
      "order_id": null,
      "rating": 5,
      "content": "Cảm ơn MindHub đã mang đến khóa học tuyệt vời này.",
      "status": "visible",
      "created_at": "2026-02-10T14:00:00Z",
      "updated_at": "2026-02-10T14:00:00Z",
      "deleted_at": null
    },
    {
      "id": 6025,
      "user_id": 207,
      "course_id": 1002,
      "order_id": null,
      "rating": 4,
      "content": "React TS chất lượng cao.",
      "status": "visible",
      "created_at": "2026-01-15T11:20:00Z",
      "updated_at": "2026-01-15T11:20:00Z",
      "deleted_at": null
    },
    {
      "id": 6026,
      "user_id": 208,
      "course_id": 1003,
      "order_id": null,
      "rating": 5,
      "content": "Khóa học hay, giảng viên truyền cảm hứng tốt.",
      "status": "visible",
      "created_at": "2026-01-05T10:00:00Z",
      "updated_at": "2026-01-05T10:00:00Z",
      "deleted_at": null
    }
  ]
};
