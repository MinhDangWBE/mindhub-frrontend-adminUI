import { getDashboardMockData } from "../../../data/dashboard.js";

let myChart = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Đã tải trang: Dashboard");

    // Khởi tạo các sự kiện tương tác
    initFilters();
    initCustomDateFilter();
    initTabs();
    initDemoSwitcher();

    // Tải và hiển thị dữ liệu dựa trên query params hiện có trên URL
    fetchAndRender();
});

/**
 * Định dạng tiền tệ VND (ví dụ: "185.400.000 đ")
 */
function formatVND(value) {
    if (value === undefined || value === null) return "0 đ";
    const num = parseFloat(value);
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
}

/**
 * Định dạng số (ví dụ: 1250 -> "1.250")
 */
function formatNumber(value) {
    if (value === undefined || value === null) return "0";
    return new Intl.NumberFormat("vi-VN").format(value);
}

/**
 * Định dạng ngày giờ Việt Nam (DD/MM/YYYY HH:MM)
 */
function formatDateTime(isoString) {
    if (!isoString) return "---";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "---";
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Định dạng tỷ lệ phần trăm (ví dụ: 30 -> "30%")
 */
function formatPercent(value) {
    if (value === undefined || value === null) return "0%";
    return `${value}%`;
}

/**
 * Đọc query params từ URL hiện tại
 */
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        date_from: params.get("date_from"),
        date_to: params.get("date_to"),
        month: params.get("month") ? parseInt(params.get("month")) : null,
        year: params.get("year") ? parseInt(params.get("year")) : null,
        state: params.get("state") || "loaded"
    };
}

/**
 * Cập nhật query string trên URL và tải lại dữ liệu
 */
function updateUrlParams(newParams) {
    const url = new URL(window.location);
    
    // Giữ lại state hiện tại nếu có
    const currentState = url.searchParams.get("state");
    
    // Xóa sạch các query lọc thời gian cũ
    url.searchParams.delete("date_from");
    url.searchParams.delete("date_to");
    url.searchParams.delete("month");
    url.searchParams.delete("year");
    
    // Thiết lập các query mới
    Object.keys(newParams).forEach(key => {
        if (newParams[key] !== undefined && newParams[key] !== null) {
            url.searchParams.set(key, newParams[key]);
        }
    });

    if (currentState) {
        url.searchParams.set("state", currentState);
    }
    
    window.history.pushState({}, "", url);
    fetchAndRender();
}

/**
 * Khởi tạo bộ lọc thời gian preset
 */
function initFilters() {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const params = getQueryParams();

    // Đồng bộ nút active dựa trên URL lúc khởi tạo
    filterButtons.forEach(btn => {
        const filterType = btn.getAttribute("data-filter");
        let isActive = false;

        if (filterType === "7days" && params.date_from === "2026-07-06" && params.date_to === "2026-07-12") {
            isActive = true;
        } else if (filterType === "30days" && params.date_from === "2026-06-13" && params.date_to === "2026-07-12") {
            isActive = true;
        } else if (filterType === "thisMonth" && params.month === 7 && params.year === 2026) {
            isActive = true;
        } else if (filterType === "thisYear" && params.year === 2026 && !params.month) {
            isActive = true;
        } else if (filterType === "7days" && !params.date_from && !params.month && !params.year) {
            // Mặc định
            isActive = true;
        }

        if (isActive) {
            btn.className = "px-3.5 py-1.5 text-xs font-medium rounded-full bg-ink text-white transition-colors shadow-sm";
        } else {
            btn.className = "px-3.5 py-1.5 text-xs font-medium rounded-full text-mid-gray hover:text-ink transition-colors bg-transparent";
        }

        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.className = "px-3.5 py-1.5 text-xs font-medium rounded-full text-mid-gray hover:text-ink transition-colors bg-transparent";
            });
            btn.className = "px-3.5 py-1.5 text-xs font-medium rounded-full bg-ink text-white transition-colors shadow-sm";

            // Reset input date tùy chọn khi bấm preset
            const fromInput = document.getElementById("custom-date-from");
            const toInput = document.getElementById("custom-date-to");
            if (fromInput) fromInput.value = "";
            if (toInput) toInput.value = "";

            // Cập nhật params tương ứng
            if (filterType === "7days") {
                updateUrlParams({ date_from: "2026-07-06", date_to: "2026-07-12" });
            } else if (filterType === "30days") {
                updateUrlParams({ date_from: "2026-06-13", date_to: "2026-07-12" });
            } else if (filterType === "thisMonth") {
                updateUrlParams({ month: 7, year: 2026 });
            } else if (filterType === "thisYear") {
                updateUrlParams({ year: 2026 });
            }
        });
    });
}

/**
 * Khởi tạo bộ lọc ngày tùy chỉnh
 */
function initCustomDateFilter() {
    const fromInput = document.getElementById("custom-date-from");
    const toInput = document.getElementById("custom-date-to");
    const applyBtn = document.getElementById("apply-custom-date");
    const params = getQueryParams();

    // Đồng bộ giá trị input lúc khởi tạo nếu URL có khoảng ngày
    if (params.date_from && params.date_to) {
        // Chỉ điền vào input nếu không trùng với presets
        const isPreset7 = (params.date_from === "2026-07-06" && params.date_to === "2026-07-12");
        const isPreset30 = (params.date_from === "2026-06-13" && params.date_to === "2026-07-12");
        if (!isPreset7 && !isPreset30) {
            if (fromInput) fromInput.value = params.date_from;
            if (toInput) toInput.value = params.date_to;
        }
    }

    if (applyBtn) {
        applyBtn.addEventListener("click", () => {
            const dateFrom = fromInput ? fromInput.value : "";
            const dateTo = toInput ? toInput.value : "";

            if (!dateFrom || !dateTo) {
                alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.");
                return;
            }

            if (new Date(dateFrom) > new Date(dateTo)) {
                alert("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
                return;
            }

            // Hủy active của các nút preset
            const filterButtons = document.querySelectorAll("[data-filter]");
            filterButtons.forEach(b => {
                b.className = "px-3.5 py-1.5 text-xs font-medium rounded-full text-mid-gray hover:text-ink transition-colors bg-transparent";
            });

            // Cập nhật URL
            updateUrlParams({ date_from: dateFrom, date_to: dateTo });
        });
    }
}

/**
 * Khởi tạo chuyển đổi tab dữ liệu gần đây
 */
function initTabs() {
    const tabBtnOrders = document.getElementById("tab-btn-orders");
    const tabBtnCourses = document.getElementById("tab-btn-courses");
    const ordersContainer = document.getElementById("recent-orders-container");
    const coursesContainer = document.getElementById("recent-courses-container");

    if (tabBtnOrders && tabBtnCourses && ordersContainer && coursesContainer) {
        tabBtnOrders.addEventListener("click", () => {
            tabBtnOrders.className = "px-2.5 py-1 rounded-full bg-paper text-ink shadow-sm transition-all";
            tabBtnCourses.className = "px-2.5 py-1 rounded-full text-mid-gray hover:text-ink bg-transparent transition-all";
            ordersContainer.classList.remove("hidden");
            coursesContainer.classList.add("hidden");
        });

        tabBtnCourses.addEventListener("click", () => {
            tabBtnCourses.className = "px-2.5 py-1 rounded-full bg-paper text-ink shadow-sm transition-all";
            tabBtnOrders.className = "px-2.5 py-1 rounded-full text-mid-gray hover:text-ink bg-transparent transition-all";
            coursesContainer.classList.remove("hidden");
            ordersContainer.classList.add("hidden");
        });
    }
}

/**
 * Quản lý hiển thị các trạng thái UI chính
 */
function switchDashboardState(state) {
    const loadedWrapper = document.getElementById("dashboard-content-wrapper");
    const loadingWrapper = document.getElementById("dashboard-loading-wrapper");
    const emptyWrapper = document.getElementById("dashboard-empty-wrapper");
    const errorWrapper = document.getElementById("dashboard-error-wrapper");
    const forbiddenWrapper = document.getElementById("dashboard-forbidden-wrapper");

    // Ẩn tất cả các wrapper
    if (loadedWrapper) loadedWrapper.classList.add("hidden");
    if (loadingWrapper) loadingWrapper.classList.add("hidden");
    if (emptyWrapper) emptyWrapper.classList.add("hidden");
    if (errorWrapper) errorWrapper.classList.add("hidden");
    if (forbiddenWrapper) forbiddenWrapper.classList.add("hidden");

    // Hiển thị wrapper tương ứng
    if (state === "loaded") {
        if (loadedWrapper) loadedWrapper.classList.remove("hidden");
    } else if (state === "loading") {
        if (loadingWrapper) loadingWrapper.classList.remove("hidden");
    } else if (state === "empty") {
        if (emptyWrapper) emptyWrapper.classList.remove("hidden");
    } else if (state === "error") {
        if (errorWrapper) errorWrapper.classList.remove("hidden");
    } else if (state === "forbidden") {
        if (forbiddenWrapper) forbiddenWrapper.classList.remove("hidden");
    }
}

/**
 * Tải dữ liệu giả lập và kết xuất lên giao diện HTML
 */
function fetchAndRender() {
    const params = getQueryParams();

    // 1. Kiểm tra trạng thái UI được chỉ định trên URL trước
    if (params.state && params.state !== "loaded") {
        switchDashboardState(params.state);
        return;
    }

    // 2. Chuyển sang trạng thái Loading (hiển thị xương/skeleton) để giả lập trễ mạng
    switchDashboardState("loading");

    setTimeout(() => {
        try {
            // Lấy mock data khớp contract
            const data = getDashboardMockData({
                date_from: params.date_from,
                date_to: params.date_to,
                month: params.month,
                year: params.year
            });

            if (!data || !data.dashboard || !data.dashboard.data) {
                switchDashboardState("empty");
                return;
            }

            // Chuyển sang trạng thái Loaded và render UI
            switchDashboardState("loaded");
            renderUI(data);

        } catch (error) {
            console.error("Lỗi khi kết xuất dữ liệu Dashboard:", error);
            switchDashboardState("error");
        }
    }, 300); // Giả lập trễ 300ms
}

/**
 * Kết xuất dữ liệu lên các thành phần giao diện
 */
function renderUI(data) {
    const dashboardData = data.dashboard.data;
    const summary = dashboardData.summary;
    const revenue = dashboardData.revenue;
    const courseStatus = dashboardData.course_status;
    const userStatus = dashboardData.user_status;
    const withdrawalSummary = dashboardData.withdrawal_summary;
    const actionRequired = dashboardData.action_required;
    const recent = dashboardData.recent;

    // 1. Render KPI chính
    const kpiTotalUsers = document.getElementById("kpi-total-users");
    const kpiUsersSub = document.getElementById("kpi-users-sub");
    if (kpiTotalUsers) kpiTotalUsers.textContent = formatNumber(summary.total_users);
    if (kpiUsersSub) kpiUsersSub.textContent = `${formatNumber(summary.total_learners)} học viên • ${formatNumber(summary.total_instructors)} giảng viên`;

    const kpiTotalCourses = document.getElementById("kpi-total-courses");
    const kpiCoursesSub = document.getElementById("kpi-courses-sub");
    const kpiCoursesPending = document.getElementById("kpi-courses-pending");
    if (kpiTotalCourses) kpiTotalCourses.textContent = formatNumber(summary.total_courses);
    if (kpiCoursesSub) kpiCoursesSub.textContent = `${formatNumber(summary.total_published_courses)} đã xuất bản`;
    if (kpiCoursesPending) {
        kpiCoursesPending.textContent = `${courseStatus.pending_review} chờ duyệt`;
    }

    const kpiTotalEnrollments = document.getElementById("kpi-total-enrollments");
    const kpiEnrollmentsSub = document.getElementById("kpi-enrollments-sub");
    if (kpiTotalEnrollments) kpiTotalEnrollments.textContent = formatNumber(summary.total_enrollments);
    if (kpiEnrollmentsSub) {
        kpiEnrollmentsSub.textContent = `${formatNumber(summary.completed_enrollments)} hoàn thành • Tỉ lệ ${formatPercent(summary.completion_rate)}`;
    }

    const kpiTotalOrders = document.getElementById("kpi-total-orders");
    const kpiOrdersSub = document.getElementById("kpi-orders-sub");
    if (kpiTotalOrders) kpiTotalOrders.textContent = formatNumber(summary.total_orders);
    if (kpiOrdersSub) kpiOrdersSub.textContent = `${formatNumber(summary.paid_orders)} đã thanh toán`;

    // 2. Render KPI tài chính phụ
    const kpiGrossRevenue = document.getElementById("kpi-gross-revenue");
    const kpiInstructorEarnings = document.getElementById("kpi-instructor-earnings");
    const kpiPlatformFee = document.getElementById("kpi-platform-fee");
    const kpiWithdrawalPendingAmount = document.getElementById("kpi-withdrawal-pending-amount");
    const kpiWithdrawalPendingCount = document.getElementById("kpi-withdrawal-pending-count");
    const kpiWithdrawalApprovedAmount = document.getElementById("kpi-withdrawal-approved-amount");
    const kpiWithdrawalApprovedCount = document.getElementById("kpi-withdrawal-approved-count");
    const kpiWithdrawalPaidAmount = document.getElementById("kpi-withdrawal-paid-amount");

    if (kpiGrossRevenue) kpiGrossRevenue.textContent = formatVND(revenue.gross_amount);
    if (kpiInstructorEarnings) kpiInstructorEarnings.textContent = formatVND(revenue.instructor_amount);
    if (kpiPlatformFee) kpiPlatformFee.textContent = formatVND(revenue.platform_fee_amount);
    if (kpiWithdrawalPendingAmount) kpiWithdrawalPendingAmount.textContent = formatVND(withdrawalSummary.pending_amount);
    if (kpiWithdrawalPendingCount) kpiWithdrawalPendingCount.textContent = formatNumber(withdrawalSummary.pending_count);
    if (kpiWithdrawalApprovedAmount) kpiWithdrawalApprovedAmount.textContent = formatVND(withdrawalSummary.approved_amount);
    if (kpiWithdrawalApprovedCount) kpiWithdrawalApprovedCount.textContent = formatNumber(withdrawalSummary.approved_count);
    if (kpiWithdrawalPaidAmount) kpiWithdrawalPaidAmount.textContent = formatVND(withdrawalSummary.paid_amount);

    // 3. Phân bổ trạng thái khóa học
    const courseStatusMap = {
        draft: "status-course-draft",
        pending_review: "status-course-pending",
        approved: "status-course-approved",
        rejected: "status-course-rejected",
        published: "status-course-published",
        hidden: "status-course-hidden"
    };
    Object.keys(courseStatusMap).forEach(key => {
        const el = document.getElementById(courseStatusMap[key]);
        if (el) el.textContent = formatNumber(courseStatus[key]);
    });

    // 4. Phân bổ trạng thái người dùng
    const userStatusMap = {
        active: "status-user-active",
        inactive: "status-user-inactive",
        locked: "status-user-locked"
    };
    Object.keys(userStatusMap).forEach(key => {
        const el = document.getElementById(userStatusMap[key]);
        if (el) el.textContent = formatNumber(userStatus[key]);
    });

    // 5. Công việc cần xử lý (action_required)
    renderActions(actionRequired);

    // 6. Xếp hạng Top khóa học
    renderTopCourses(data.top_courses.data.items);

    // 7. Xếp hạng Top giảng viên
    renderTopInstructors(data.top_instructors.data.items);

    // 8. Dữ liệu gần đây (Đơn hàng & Khóa học)
    renderRecentOrders(recent.latest_orders);
    renderRecentCourses(recent.latest_courses);

    // 9. Biểu đồ doanh thu
    renderChartData(data.revenue_report.data);
}

/**
 * Render công việc cần xử lý
 */
function renderActions(actions) {
    const container = document.getElementById("actions-container");
    if (!container) return;

    container.innerHTML = "";

    const actionItems = [
        {
            count: actions.pending_course_reviews,
            title: "Khóa học chờ duyệt",
            desc: `${actions.pending_course_reviews} khóa học mới cần kiểm duyệt`,
            btnText: "Duyệt ngay",
            link: "course-reviews.html"
        },
        {
            count: actions.pending_instructor_upgrades,
            title: "Yêu cầu nâng giảng viên",
            desc: `${actions.pending_instructor_upgrades} hồ sơ đăng ký cần xác minh`,
            btnText: "Xử lý",
            link: "instructor-upgrades.html"
        },
        {
            count: actions.pending_withdrawals,
            title: "Yêu cầu rút tiền",
            desc: `${actions.pending_withdrawals} lệnh rút tiền đang chờ xử lý`,
            btnText: "Chi tiền",
            link: "withdrawals.html"
        },
        {
            count: actions.pending_payout_accounts,
            title: "Tài khoản nhận tiền",
            desc: `${actions.pending_payout_accounts} tài khoản ngân hàng chờ xác minh`,
            btnText: "Xác minh",
            link: "payout-accounts.html"
        }
    ];

    actionItems.forEach(item => {
        // Chỉ hiển thị các mục cần xử lý (count > 0)
        if (item.count > 0) {
            const div = document.createElement("div");
            div.className = "flex items-center justify-between p-3 rounded-[6px] bg-canvas border border-hairline/40 hover:bg-hairline/30 transition-colors";
            div.innerHTML = `
                <div class="min-w-0 pr-2">
                    <p class="text-xs font-semibold text-ink">${item.title}</p>
                    <p class="text-[10px] text-mid-gray mt-0.5">${item.desc}</p>
                </div>
                <a href="${item.link}" class="inline-flex h-7 items-center rounded-full bg-ink px-3 text-[10px] font-semibold text-white shrink-0 hover:opacity-90 transition-opacity">
                    ${item.btnText}
                </a>
            `;
            container.appendChild(div);
        }
    });

    if (container.children.length === 0) {
        container.innerHTML = `
            <div class="h-28 flex flex-col items-center justify-center text-center">
                <svg class="w-6 h-6 text-mid-gray/40 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4.5 12.75 6 6 9-13.5"/>
                </svg>
                <p class="text-[11px] text-mid-gray">Đã hoàn thành mọi công việc cần xử lý!</p>
            </div>
        `;
    }
}

/**
 * Render xếp hạng Top khóa học
 */
function renderTopCourses(items) {
    const container = document.getElementById("top-selling-courses-container");
    if (!container) return;

    container.innerHTML = "";

    if (!items || items.length === 0) {
        container.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-mid-gray">Không có khóa học nào.</td></tr>`;
        return;
    }

    items.forEach(course => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-canvas/40 transition-colors";
        tr.innerHTML = `
            <td class="py-2 font-medium text-ink truncate max-w-[150px]">
                <a href="courses.html?id=${course.course_id}" class="hover:underline">${course.title}</a>
                <span class="block text-[9px] text-mid-gray font-normal truncate">GV: ${course.instructor_name}</span>
            </td>
            <td class="py-2 text-right text-mid-gray font-sans">${formatNumber(course.sales_count)}</td>
            <td class="py-2 text-right font-medium text-ink font-sans">${formatVND(course.gross_revenue)}</td>
        `;
        container.appendChild(tr);
    });
}

/**
 * Render xếp hạng Top giảng viên
 */
function renderTopInstructors(items) {
    const container = document.getElementById("top-instructors-container");
    if (!container) return;

    container.innerHTML = "";

    if (!items || items.length === 0) {
        container.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-mid-gray">Không có giảng viên nào.</td></tr>`;
        return;
    }

    items.forEach(inst => {
        // Lấy ký tự đầu tên để làm avatar
        const initials = inst.full_name.split(" ").pop().substring(0, 2).toUpperCase();

        const tr = document.createElement("tr");
        tr.className = "hover:bg-canvas/40 transition-colors";
        tr.innerHTML = `
            <td class="py-2 font-medium text-ink flex items-center gap-2">
                <span class="h-6.5 w-6.5 rounded-full bg-ink text-white font-semibold flex items-center justify-center text-[9px] shrink-0 select-none">${initials}</span>
                <span class="truncate block max-w-[100px]">${inst.full_name}</span>
            </td>
            <td class="py-2 text-right text-mid-gray font-sans">${formatNumber(inst.total_courses)}</td>
            <td class="py-2 text-right font-medium text-ink font-sans">${formatVND(inst.gross_revenue)}</td>
        `;
        container.appendChild(tr);
    });
}

/**
 * Render timeline Đơn hàng gần đây
 */
function renderRecentOrders(orders) {
    const container = document.getElementById("recent-orders-container");
    if (!container) return;

    container.innerHTML = "";

    if (!orders || orders.length === 0) {
        container.innerHTML = `<p class="text-[11px] text-mid-gray text-center py-6">Chưa có đơn hàng nào.</p>`;
        return;
    }

    orders.forEach(order => {
        const item = document.createElement("div");
        item.className = "relative pl-4 pb-2 border-l border-hairline last:pb-0";
        item.innerHTML = `
            <span class="absolute -left-[4.5px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-ink ring-4 ring-paper"></span>
            <p class="font-semibold text-ink text-xs truncate max-w-[200px]">Đơn hàng #${order.id} - ${formatVND(order.amount)}</p>
            <p class="text-[10px] text-mid-gray mt-0.5 truncate">Học viên: ${order.learner_name}</p>
            <p class="text-[9px] text-mid-gray font-sans mt-0.5">${formatDateTime(order.paid_at)}</p>
        `;
        container.appendChild(item);
    });
}

/**
 * Render timeline Khóa học gần đây
 */
function renderRecentCourses(courses) {
    const container = document.getElementById("recent-courses-container");
    if (!container) return;

    container.innerHTML = "";

    if (!courses || courses.length === 0) {
        container.innerHTML = `<p class="text-[11px] text-mid-gray text-center py-6">Chưa có khóa học nào.</p>`;
        return;
    }

    courses.forEach(course => {
        // Map nhãn trạng thái tiếng Việt
        let statusLabel = "Nháp";
        let statusClass = "text-mid-gray";
        if (course.status === "published") {
            statusLabel = "Đã xuất bản";
            statusClass = "text-emerald-600 font-semibold";
        } else if (course.status === "pending_review") {
            statusLabel = "Chờ duyệt";
            statusClass = "text-amber-600 font-semibold";
        } else if (course.status === "approved") {
            statusLabel = "Đã duyệt";
            statusClass = "text-blue-600 font-semibold";
        } else if (course.status === "rejected") {
            statusLabel = "Bị từ chối";
            statusClass = "text-red-600 font-semibold";
        }

        const dateToShow = course.published_at || course.approved_at || course.created_at;

        const item = document.createElement("div");
        item.className = "relative pl-4 pb-2 border-l border-hairline last:pb-0";
        item.innerHTML = `
            <span class="absolute -left-[4.5px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-mid-gray ring-4 ring-paper"></span>
            <p class="font-semibold text-ink text-xs truncate max-w-[200px]">${course.title}</p>
            <p class="text-[10px] text-mid-gray mt-0.5">Giảng viên: ${course.instructor_name} • Trạng thái: <span class="${statusClass}">${statusLabel}</span></p>
            <p class="text-[9px] text-mid-gray font-sans mt-0.5">${formatDateTime(dateToShow)}</p>
        `;
        container.appendChild(item);
    });
}

/**
 * Vẽ biểu đồ tài chính bằng Chart.js
 */
function renderChartData(reportData) {
    const canvas = document.getElementById("revenue-chart-canvas");
    const emptyState = document.getElementById("chart-empty-state");
    if (!canvas) return;

    if (myChart) {
        myChart.destroy();
    }

    const items = reportData.items || [];
    if (items.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    const labels = items.map(item => item.date);
    const grossData = items.map(item => parseFloat(item.gross_amount));
    const instructorData = items.map(item => parseFloat(item.instructor_amount));
    const platformData = items.map(item => parseFloat(item.platform_fee_amount));

    const ctx = canvas.getContext("2d");
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Doanh thu gộp",
                    data: grossData,
                    borderColor: "#0a0a0a",
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#0a0a0a",
                    pointHoverRadius: 6,
                    pointRadius: 4,
                    tension: 0.15
                },
                {
                    label: "Thu nhập giảng viên",
                    data: instructorData,
                    borderColor: "#737373",
                    backgroundColor: "transparent",
                    borderWidth: 1.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#737373",
                    pointHoverRadius: 5,
                    pointRadius: 3,
                    tension: 0.15
                },
                {
                    label: "Phí nền tảng",
                    data: platformData,
                    borderColor: "#e5e5e5",
                    borderDash: [4, 4],
                    backgroundColor: "transparent",
                    borderWidth: 1.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#a3a3a3",
                    pointHoverRadius: 5,
                    pointRadius: 3,
                    tension: 0.15
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
                        boxWidth: 8,
                        boxHeight: 8,
                        usePointStyle: true,
                        font: {
                            family: "Geist, Inter, sans-serif",
                            size: 11
                        },
                        color: "#0a0a0a"
                    }
                },
                tooltip: {
                    backgroundColor: "#0a0a0a",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    padding: 8,
                    cornerRadius: 6,
                    titleFont: {
                        family: "Geist, Inter, sans-serif",
                        size: 11,
                        weight: "600"
                    },
                    bodyFont: {
                        family: "Geist, Inter, sans-serif",
                        size: 11
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || "";
                            if (label) {
                                label += ": ";
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#737373",
                        font: {
                            family: "Geist, Inter, sans-serif",
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: "#e5e5e5"
                    },
                    ticks: {
                        color: "#737373",
                        font: {
                            family: "Geist, Inter, sans-serif",
                            size: 10
                        },
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000) + "M đ";
                            }
                            return value + " đ";
                        }
                    }
                }
            }
        }
    });
}

/**
 * Khởi tạo Demo Switcher ở góc dưới màn hình.
 * Hỗ trợ chuyển qua query param ?state= trên URL thay vì inline.
 */
function initDemoSwitcher() {
    // Xóa demo switcher cũ nếu có trùng
    const oldPanel = document.querySelector(".demo-state-panel");
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.className = "demo-state-panel fixed bottom-4 right-4 z-[100] bg-paper border border-hairline p-2 rounded-[24px] shadow-subtle flex gap-1 items-center text-[10px] font-bold";
    panel.innerHTML = `
        <span class="text-mid-gray px-1.5 text-[9px] uppercase tracking-wider">Demo States:</span>
        <button type="button" id="demo-state-loaded" class="px-2.5 py-1.5 rounded-full transition-colors hover:opacity-90">Loaded</button>
        <button type="button" id="demo-state-loading" class="px-2.5 py-1.5 rounded-full transition-colors hover:bg-hairline">Loading</button>
        <button type="button" id="demo-state-empty" class="px-2.5 py-1.5 rounded-full transition-colors hover:bg-hairline">Empty</button>
        <button type="button" id="demo-state-error" class="px-2.5 py-1.5 rounded-full transition-colors hover:bg-hairline">Error</button>
        <button type="button" id="demo-state-forbidden" class="px-2.5 py-1.5 rounded-full transition-colors hover:bg-hairline">403</button>
    `;
    document.body.appendChild(panel);

    const states = ["loaded", "loading", "empty", "error", "forbidden"];
    const currentParams = getQueryParams();

    states.forEach(state => {
        const btn = document.getElementById(`demo-state-${state}`);
        if (!btn) return;

        // Cập nhật class active ban đầu cho button demo tương ứng với state hiện tại trên URL
        if (currentParams.state === state) {
            btn.className = "px-2.5 py-1.5 rounded-full bg-ink text-white transition-colors hover:opacity-90";
        } else {
            btn.className = "px-2.5 py-1.5 rounded-full bg-canvas text-ink border border-hairline transition-colors hover:bg-hairline";
        }

        btn.addEventListener("click", () => {
            states.forEach(s => {
                const b = document.getElementById(`demo-state-${s}`);
                if (b) {
                    b.className = "px-2.5 py-1.5 rounded-full bg-canvas text-ink border border-hairline transition-colors hover:bg-hairline";
                }
            });
            btn.className = "px-2.5 py-1.5 rounded-full bg-ink text-white transition-colors hover:opacity-90";

            // Cập nhật query param ?state= trên URL
            const url = new URL(window.location);
            url.searchParams.set("state", state);
            window.history.pushState({}, "", url);
            
            // Tải lại để áp dụng state mới
            fetchAndRender();
        });
    });
}
