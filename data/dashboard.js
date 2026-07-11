/**
 * Dữ liệu giả lập (mock data) cho trang Dashboard Admin MindHub.
 * Hỗ trợ 4 khoảng thời gian khác nhau để demo tương tác bộ lọc.
 */
export const mockDashboardData = {
    "7days": {
        system: {
            totalUsers: "1,250",
            totalLearners: "1,100",
            totalInstructors: "150",
            totalCourses: "84",
            pendingCourses: 12,
            publishedCourses: 70,
            totalEnrollments: "3,420",
            growthUsers: "+12.4%",
            growthEnrollments: "+8.4%"
        },
        financial: {
            totalPaid: "185,400,000 đ",
            instructorEarnings: "129,780,000 đ",
            platformFee: "55,620,000 đ",
            platformFeePercent: "30%",
            payoutPending: "14,500,000 đ",
            pendingWithdrawalsCount: 3,
            payoutPaid: "75,000,000 đ"
        },
        chart: {
            labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
            gross: [12000000, 18000000, 15000000, 22000000, 30000000, 45000000, 43400000],
            instructor: [8400000, 12600000, 10500000, 15400000, 21000000, 31500000, 30380000],
            platform: [3600000, 5400000, 4500000, 6600000, 9000000, 13500000, 13020000]
        },
        actions: [
            { id: 1, type: "course_moderation", title: "Khóa học chờ duyệt", desc: "5 khóa học mới được gửi lên", actionText: "Duyệt ngay", link: "course-reviews.html" },
            { id: 2, type: "instructor_upgrade", title: "Yêu cầu nâng giảng viên", desc: "3 hồ sơ cần xác minh", actionText: "Xử lý ngay", link: "instructor-upgrades.html" },
            { id: 3, type: "withdraw_request", title: "Yêu cầu rút tiền", desc: "2 lệnh yêu cầu chuyển khoản", actionText: "Chi tiền ngay", link: "withdrawals.html" },
            { id: 4, type: "payout_account", title: "Tài khoản nhận tiền", desc: "4 tài khoản ngân hàng chờ xác minh", actionText: "Xác minh ngay", link: "payout-accounts.html" }
        ],
        topSellingCourses: [
            { title: "Lập trình Laravel căn bản", sales: 148, revenue: "44.4M đ" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", sales: 120, revenue: "36.0M đ" },
            { title: "Thiết kế hệ thống lớn (System Design)", sales: 95, revenue: "33.2M đ" },
            { title: "Tailwind CSS từ Zero đến Hero", sales: 88, revenue: "17.6M đ" }
        ],
        topEnrolledCourses: [
            { title: "Lập trình Laravel căn bản", students: "1,250 học viên" },
            { title: "Tailwind CSS từ Zero đến Hero", students: "1,100 học viên" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", students: "840 học viên" },
            { title: "HTML/CSS & Javascript cho người mới", students: "780 học viên" }
        ],
        topInstructors: [
            { name: "Trần Văn Hoàng", initials: "TH", courses: 3, earnings: "45.8M đ" },
            { name: "Nguyễn Anh Hồng", initials: "AH", courses: 2, earnings: "38.2M đ" },
            { name: "Phạm Minh Đức", initials: "PD", courses: 5, earnings: "28.0M đ" },
            { name: "Lê Thị Nga", initials: "LN", courses: 1, earnings: "17.8M đ" }
        ],
        activities: [
            { title: "Phê duyệt khóa học", desc: "Admin đã phê duyệt khóa \"Lập trình React Native\" của giảng viên Trần Văn Hoàng.", time: "2 phút trước", iconType: "check" },
            { title: "Yêu cầu rút tiền mới", desc: "Giảng viên Nguyễn Anh Hồng gửi yêu cầu rút 5,000,000 đ về tài khoản MB Bank.", time: "15 phút trước", iconType: "wallet" },
            { title: "Đăng ký giảng viên mới", desc: "Học viên Phạm Minh Tuấn nộp hồ sơ yêu cầu nâng cấp tài khoản giảng viên.", time: "1 giờ trước", iconType: "user" }
        ]
    },
    "30days": {
        system: {
            totalUsers: "1,420",
            totalLearners: "1,240",
            totalInstructors: "180",
            totalCourses: "92",
            pendingCourses: 15,
            publishedCourses: 77,
            totalEnrollments: "4,110",
            growthUsers: "+14.8%",
            growthEnrollments: "+9.2%"
        },
        financial: {
            totalPaid: "320,600,000 đ",
            instructorEarnings: "224,420,000 đ",
            platformFee: "96,180,000 đ",
            platformFeePercent: "30%",
            payoutPending: "18,200,000 đ",
            pendingWithdrawalsCount: 5,
            payoutPaid: "120,000,000 đ"
        },
        chart: {
            labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Hôm nay"],
            gross: [40000000, 55000000, 70000000, 65000000, 90600000],
            instructor: [28000000, 38500000, 49000000, 45500000, 63420000],
            platform: [12000000, 16500000, 21000000, 19500000, 27180000]
        },
        actions: [
            { id: 1, type: "course_moderation", title: "Khóa học chờ duyệt", desc: "8 khóa học mới được gửi lên", actionText: "Duyệt ngay", link: "course-reviews.html" },
            { id: 2, type: "instructor_upgrade", title: "Yêu cầu nâng giảng viên", desc: "4 hồ sơ cần xác minh", actionText: "Xử lý ngay", link: "instructor-upgrades.html" },
            { id: 3, type: "withdraw_request", title: "Yêu cầu rút tiền", desc: "5 lệnh yêu cầu chuyển khoản", actionText: "Chi tiền ngay", link: "withdrawals.html" },
            { id: 4, type: "payout_account", title: "Tài khoản nhận tiền", desc: "6 tài khoản ngân hàng chờ xác minh", actionText: "Xác minh ngay", link: "payout-accounts.html" }
        ],
        topSellingCourses: [
            { title: "Lập trình Laravel căn bản", sales: 250, revenue: "75.0M đ" },
            { title: "Thiết kế hệ thống lớn (System Design)", sales: 180, revenue: "63.0M đ" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", sales: 172, revenue: "51.6M đ" },
            { title: "Tailwind CSS từ Zero đến Hero", sales: 150, revenue: "30.0M đ" }
        ],
        topEnrolledCourses: [
            { title: "Lập trình Laravel căn bản", students: "1,550 học viên" },
            { title: "Tailwind CSS từ Zero đến Hero", students: "1,240 học viên" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", students: "980 học viên" },
            { title: "Thiết kế hệ thống lớn (System Design)", students: "910 học viên" }
        ],
        topInstructors: [
            { name: "Nguyễn Anh Hồng", initials: "AH", courses: 2, earnings: "68.2M đ" },
            { name: "Trần Văn Hoàng", initials: "TH", courses: 3, earnings: "65.8M đ" },
            { name: "Phạm Minh Đức", initials: "PD", courses: 5, earnings: "42.0M đ" },
            { name: "Lê Thị Nga", initials: "LN", courses: 1, earnings: "24.8M đ" }
        ],
        activities: [
            { title: "Đơn hàng hoàn tất", desc: "Học viên Trần Quốc Đạt thanh toán thành công đơn hàng #1085.", time: "8 phút trước", iconType: "check" },
            { title: "Yêu cầu rút tiền mới", desc: "Giảng viên Lê Thị Nga gửi yêu cầu rút 8,000,000 đ.", time: "30 phút trước", iconType: "wallet" },
            { title: "Phê duyệt khóa học", desc: "Admin đã phê duyệt khóa \"Cấu trúc dữ liệu & Giải thuật\" của Phạm Minh Đức.", time: "3 giờ trước", iconType: "check" }
        ]
    },
    "thisMonth": {
        system: {
            totalUsers: "1,510",
            totalLearners: "1,310",
            totalInstructors: "200",
            totalCourses: "96",
            pendingCourses: 8,
            publishedCourses: 88,
            totalEnrollments: "4,550",
            growthUsers: "+16.2%",
            growthEnrollments: "+10.1%"
        },
        financial: {
            totalPaid: "450,200,000 đ",
            instructorEarnings: "315,140,000 đ",
            platformFee: "135,060,000 đ",
            platformFeePercent: "30%",
            payoutPending: "22,000,000 đ",
            pendingWithdrawalsCount: 2,
            payoutPaid: "160,000,000 đ"
        },
        chart: {
            labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
            gross: [90000000, 110000000, 120000000, 130200000],
            instructor: [63000000, 77000000, 84000000, 91140000],
            platform: [27000000, 33000000, 36000000, 39060000]
        },
        actions: [
            { id: 1, type: "course_moderation", title: "Khóa học chờ duyệt", desc: "4 khóa học mới được gửi lên", actionText: "Duyệt ngay", link: "course-reviews.html" },
            { id: 2, type: "instructor_upgrade", title: "Yêu cầu nâng giảng viên", desc: "2 hồ sơ cần xác minh", actionText: "Xử lý ngay", link: "instructor-upgrades.html" },
            { id: 3, type: "withdraw_request", title: "Yêu cầu rút tiền", desc: "1 lệnh yêu cầu chuyển khoản", actionText: "Chi tiền ngay", link: "withdrawals.html" },
            { id: 4, type: "payout_account", title: "Tài khoản nhận tiền", desc: "2 tài khoản ngân hàng chờ xác minh", actionText: "Xác minh ngay", link: "payout-accounts.html" }
        ],
        topSellingCourses: [
            { title: "Lập trình Laravel căn bản", sales: 310, revenue: "93.0M đ" },
            { title: "Thiết kế hệ thống lớn (System Design)", sales: 240, revenue: "84.0M đ" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", sales: 220, revenue: "66.0M đ" },
            { title: "Tailwind CSS từ Zero đến Hero", sales: 180, revenue: "36.0M đ" }
        ],
        topEnrolledCourses: [
            { title: "Lập trình Laravel căn bản", students: "1,850 học viên" },
            { title: "Tailwind CSS từ Zero đến Hero", students: "1,410 học viên" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", students: "1,100 học viên" },
            { title: "Thiết kế hệ thống lớn (System Design)", students: "990 học viên" }
        ],
        topInstructors: [
            { name: "Trần Văn Hoàng", initials: "TH", courses: 3, earnings: "85.8M đ" },
            { name: "Nguyễn Anh Hồng", initials: "AH", courses: 2, earnings: "78.2M đ" },
            { name: "Phạm Minh Đức", initials: "PD", courses: 5, earnings: "68.0M đ" },
            { name: "Lê Thị Nga", initials: "LN", courses: 1, earnings: "37.8M đ" }
        ],
        activities: [
            { title: "Phê duyệt tài khoản", desc: "Admin phê duyệt nâng cấp giảng viên cho người dùng Nguyễn Minh Cường.", time: "1 giờ trước", iconType: "user" },
            { title: "Đơn hàng hoàn tất", desc: "Thanh toán thành công đơn hàng #1120 trị giá 500,000 đ.", time: "4 giờ trước", iconType: "check" },
            { title: "Rút tiền thành công", desc: "Đã chi trả yêu cầu rút tiền của giảng viên Phạm Minh Đức (12,000,000 đ).", time: "1 ngày trước", iconType: "wallet" }
        ]
    },
    "thisYear": {
        system: {
            totalUsers: "4,200",
            totalLearners: "3,850",
            totalInstructors: "350",
            totalCourses: "210",
            pendingCourses: 22,
            publishedCourses: 188,
            totalEnrollments: "12,400",
            growthUsers: "+34.5%",
            growthEnrollments: "+24.8%"
        },
        financial: {
            totalPaid: "2,450,000,000 đ",
            instructorEarnings: "1,715,000,000 đ",
            platformFee: "735,000,000 đ",
            platformFeePercent: "30%",
            payoutPending: "45,000,000 đ",
            pendingWithdrawalsCount: 8,
            payoutPaid: "1,250,000,000 đ"
        },
        chart: {
            labels: ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"],
            gross: [120000000, 140000000, 180000000, 170000000, 210000000, 230000000, 220000000, 250000000, 270000000, 290000000, 310000000, 260000000],
            instructor: [84000000, 98000000, 126000000, 119000000, 147000000, 161000000, 154000000, 175000000, 189000000, 203000000, 217000000, 182000000],
            platform: [36000000, 42000000, 54000000, 51000000, 63000000, 69000000, 66000000, 75000000, 81000000, 87000000, 93000000, 78000000]
        },
        actions: [
            { id: 1, type: "course_moderation", title: "Khóa học chờ duyệt", desc: "22 khóa học chờ duyệt tích lũy", actionText: "Xem ngay", link: "course-reviews.html" },
            { id: 2, type: "instructor_upgrade", title: "Yêu cầu nâng giảng viên", desc: "8 hồ sơ cần xác nhận", actionText: "Xem ngay", link: "instructor-upgrades.html" },
            { id: 3, type: "withdraw_request", title: "Yêu cầu rút tiền", desc: "8 lệnh cần thanh toán ngân hàng", actionText: "Xem ngay", link: "withdrawals.html" },
            { id: 4, type: "payout_account", title: "Tài khoản nhận tiền", desc: "15 tài khoản chờ xác thực", actionText: "Xem ngay", link: "payout-accounts.html" }
        ],
        topSellingCourses: [
            { title: "Lập trình Laravel căn bản", sales: 1250, revenue: "375.0M đ" },
            { title: "Thiết kế hệ thống lớn (System Design)", sales: 980, revenue: "343.0M đ" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", sales: 840, revenue: "252.0M đ" },
            { title: "Tailwind CSS từ Zero đến Hero", sales: 790, revenue: "158.0M đ" }
        ],
        topEnrolledCourses: [
            { title: "Lập trình Laravel căn bản", students: "5,420 học viên" },
            { title: "Tailwind CSS từ Zero đến Hero", students: "4,110 học viên" },
            { title: "Làm chủ Vue.js 3 trong 30 ngày", students: "3,120 học viên" },
            { title: "HTML/CSS & Javascript cho người mới", students: "2,980 học viên" }
        ],
        topInstructors: [
            { name: "Trần Văn Hoàng", initials: "TH", courses: 5, earnings: "345.8M đ" },
            { name: "Nguyễn Anh Hồng", initials: "AH", courses: 4, earnings: "318.2M đ" },
            { name: "Phạm Minh Đức", initials: "PD", courses: 8, earnings: "248.0M đ" },
            { name: "Lê Thị Nga", initials: "LN", courses: 2, earnings: "137.8M đ" }
        ],
        activities: [
            { title: "Khóa học xuất bản", desc: "Hệ thống tự động kích hoạt 5 khóa học vừa qua kiểm duyệt đạt yêu cầu.", time: "1 ngày trước", iconType: "check" },
            { title: "Nâng cấp bảo mật", desc: "Admin hoàn thành quy trình quét xác minh thông tin tài khoản nhận tiền hàng loạt.", time: "3 ngày trước", iconType: "user" },
            { title: "Đối soát doanh thu năm", desc: "Hoàn tất thống kê đối soát doanh thu Quý II với toàn bộ đối tác giảng viên.", time: "1 tuần trước", iconType: "wallet" }
        ]
    }
};
