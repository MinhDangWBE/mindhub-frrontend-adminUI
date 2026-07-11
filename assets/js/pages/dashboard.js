import { mockDashboardData } from "../../../data/dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Đã tải trang: Dashboard");

    // Khởi tạo bộ lọc thời gian
    initFilters();

    // Khởi tạo biểu đồ và nạp dữ liệu mặc định ban đầu (7 ngày qua)
    loadData("7days");

    // Khởi tạo bảng điều khiển chuyển đổi trạng thái demo
    initDemoSwitcher();
});

let myChart = null;

/**
 * Khởi tạo bộ lọc thời gian.
 */
function initFilters() {
    const filterButtons = document.querySelectorAll("[data-filter]");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Thay đổi giao diện nút bấm active
            filterButtons.forEach(b => {
                b.className = "px-3.5 py-1.5 text-xs font-medium rounded-full text-mid-gray hover:text-ink transition-colors bg-transparent";
            });
            btn.className = "px-3.5 py-1.5 text-xs font-medium rounded-full bg-ink text-white transition-colors shadow-sm";

            // Lấy khoảng thời gian lọc và nạp dữ liệu tương ứng
            const range = btn.getAttribute("data-filter");
            loadData(range);
        });
    });
}

/**
 * Nạp dữ liệu mock-up vào giao diện.
 */
function loadData(range) {
    const data = mockDashboardData[range];
    if (!data) return;

    updateKPIs(data);
    updateActions(data);
    updateRankings(data);
    updateActivities(data);
    renderChart(data.chart);
}

/**
 * Cập nhật số liệu các khối KPI.
 */
function updateKPIs(data) {
    // 1. KPI Hệ thống chính
    const kpiTotalUsers = document.getElementById("kpi-total-users");
    const kpiUsersSub = document.getElementById("kpi-users-sub");
    const kpiUsersGrowth = document.getElementById("kpi-users-growth");
    
    if (kpiTotalUsers) kpiTotalUsers.textContent = data.system.totalUsers;
    if (kpiUsersSub) kpiUsersSub.textContent = `${data.system.totalLearners} học viên • ${data.system.totalInstructors} giảng viên`;
    if (kpiUsersGrowth) kpiUsersGrowth.textContent = data.system.growthUsers;

    const kpiTotalCourses = document.getElementById("kpi-total-courses");
    const kpiCoursesPending = document.getElementById("kpi-courses-pending");
    
    if (kpiTotalCourses) kpiTotalCourses.textContent = data.system.totalCourses;
    if (kpiCoursesPending) {
        kpiCoursesPending.textContent = `${data.system.pendingCourses} chờ duyệt`;
    }

    const kpiTotalEnrollments = document.getElementById("kpi-total-enrollments");
    const kpiEnrollmentsGrowth = document.getElementById("kpi-enrollments-growth");
    
    if (kpiTotalEnrollments) kpiTotalEnrollments.textContent = data.system.totalEnrollments;
    if (kpiEnrollmentsGrowth) kpiEnrollmentsGrowth.textContent = data.system.growthEnrollments;

    const kpiTotalPaid = document.getElementById("kpi-total-paid");
    if (kpiTotalPaid) kpiTotalPaid.textContent = data.financial.totalPaid;

    // 2. KPI Tài chính phụ
    const kpiInstructorEarnings = document.getElementById("kpi-instructor-earnings");
    const kpiPlatformFee = document.getElementById("kpi-platform-fee");
    const kpiPayoutPending = document.getElementById("kpi-payout-pending");
    const kpiPayoutPendingCount = document.getElementById("kpi-payout-pending-count");
    const kpiPayoutPaid = document.getElementById("kpi-payout-paid");

    if (kpiInstructorEarnings) kpiInstructorEarnings.textContent = data.financial.instructorEarnings;
    if (kpiPlatformFee) kpiPlatformFee.textContent = data.financial.platformFee;
    if (kpiPayoutPending) kpiPayoutPending.textContent = data.financial.payoutPending;
    if (kpiPayoutPendingCount) {
        kpiPayoutPendingCount.textContent = `${data.financial.pendingWithdrawalsCount} chờ duyệt`;
    }
    if (kpiPayoutPaid) kpiPayoutPaid.textContent = data.financial.payoutPaid;
}

/**
 * Cập nhật danh sách công việc cần xử lý.
 */
function updateActions(data) {
    const container = document.getElementById("actions-container");
    if (!container) return;

    container.innerHTML = "";
    data.actions.forEach(act => {
        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-3 rounded-2xl bg-canvas border border-hairline/40 hover:bg-hairline/30 transition-colors";
        
        // Điều chỉnh link tương đối nếu cần
        const itemLink = act.link;

        item.innerHTML = `
            <div class="min-w-0">
                <p class="text-xs font-semibold text-ink">${act.title}</p>
                <p class="text-[10px] text-mid-gray mt-0.5">${act.desc}</p>
            </div>
            <a href="${itemLink}" class="inline-flex h-7 items-center rounded-full bg-ink px-3 text-[10px] font-semibold text-white shrink-0 hover:opacity-90 transition-opacity">
                ${act.actionText}
            </a>
        `;
        container.appendChild(item);
    });
}

/**
 * Cập nhật bảng xếp hạng và danh sách.
 */
function updateRankings(data) {
    // 1. Khóa học bán chạy
    const topSellingContainer = document.getElementById("top-selling-courses-container");
    if (topSellingContainer) {
        topSellingContainer.innerHTML = "";
        data.topSellingCourses.forEach(course => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="py-2.5 font-medium text-ink truncate max-w-[150px]">${course.title}</td>
                <td class="py-2.5 text-right text-mid-gray">${course.sales}</td>
                <td class="py-2.5 text-right font-medium text-ink">${course.revenue}</td>
            `;
            topSellingContainer.appendChild(tr);
        });
    }

    // 2. Khóa học nhiều học viên nhất
    const topEnrolledContainer = document.getElementById("top-enrolled-courses-container");
    if (topEnrolledContainer) {
        topEnrolledContainer.innerHTML = "";
        data.topEnrolledCourses.forEach(course => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="py-2.5 font-medium text-ink truncate max-w-[150px]">${course.title}</td>
                <td class="py-2.5 text-right text-mid-gray">${course.students}</td>
            `;
            topEnrolledContainer.appendChild(tr);
        });
    }

    // 3. Giảng viên doanh thu cao
    const topInstructorsContainer = document.getElementById("top-instructors-container");
    if (topInstructorsContainer) {
        topInstructorsContainer.innerHTML = "";
        data.topInstructors.forEach(inst => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="py-2.5 font-medium text-ink flex items-center gap-2">
                    <span class="h-6 w-6 rounded-full bg-ink text-white font-semibold flex items-center justify-center text-[10px] shrink-0 select-none">${inst.initials}</span>
                    <span class="truncate">${inst.name}</span>
                </td>
                <td class="py-2.5 text-right text-mid-gray">${inst.courses}</td>
                <td class="py-2.5 text-right font-medium text-ink">${inst.earnings}</td>
            `;
            topInstructorsContainer.appendChild(tr);
        });
    }
}

/**
 * Cập nhật dòng hoạt động gần đây.
 */
function updateActivities(data) {
    const container = document.getElementById("activities-timeline-container");
    if (!container) return;

    container.innerHTML = "";
    data.activities.forEach(act => {
        let dotColor = "bg-mid-gray";
        if (act.iconType === "check") {
            dotColor = "bg-ink";
        }

        const item = document.createElement("div");
        item.className = "relative pl-5 pb-3 last:pb-0";
        item.innerHTML = `
            <span class="absolute left-0 top-1.5 flex h-2 w-2 items-center justify-center rounded-full ${dotColor} ring-4 ring-paper"></span>
            <p class="font-semibold text-ink">${act.title}</p>
            <p class="text-[10px] text-mid-gray mt-0.5 leading-relaxed">${act.desc}</p>
            <span class="text-[9px] text-mid-gray block mt-0.5">${act.time}</span>
        `;
        container.appendChild(item);
    });
}

/**
 * Vẽ biểu đồ tương tác bằng Chart.js.
 */
function renderChart(chartData) {
    const canvas = document.getElementById("revenue-chart-canvas");
    if (!canvas) return;

    if (myChart) {
        myChart.destroy();
    }

    // Nếu không có dữ liệu Chart.js
    if (!chartData || !chartData.gross || chartData.gross.length === 0) {
        return;
    }

    const ctx = canvas.getContext("2d");
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Doanh thu gộp",
                    data: chartData.gross,
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
                    data: chartData.instructor,
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
                    label: "Phí hệ thống",
                    data: chartData.platform,
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
 * Thay đổi trạng thái hiển thị Dashboard để kiểm thử (Loaded, Loading, Empty, Error).
 */
function switchDashboardState(state) {
    const loadedWrapper = document.getElementById("dashboard-content-wrapper");
    const loadingWrapper = document.getElementById("dashboard-loading-wrapper");
    const emptyWrapper = document.getElementById("dashboard-empty-wrapper");
    const errorWrapper = document.getElementById("dashboard-error-wrapper");

    // Ẩn tất cả
    if (loadedWrapper) loadedWrapper.classList.add("hidden");
    if (loadingWrapper) loadingWrapper.classList.add("hidden");
    if (emptyWrapper) emptyWrapper.classList.add("hidden");
    if (errorWrapper) errorWrapper.classList.add("hidden");

    // Hiển thị trạng thái tương ứng
    if (state === "loaded") {
        if (loadedWrapper) loadedWrapper.classList.remove("hidden");
    } else if (state === "loading") {
        if (loadingWrapper) loadingWrapper.classList.remove("hidden");
    } else if (state === "empty") {
        if (emptyWrapper) emptyWrapper.classList.remove("hidden");
    } else if (state === "error") {
        if (errorWrapper) errorWrapper.classList.remove("hidden");
    }
}

/**
 * Khởi tạo bảng demo trạng thái góc dưới màn hình.
 */
function initDemoSwitcher() {
    const panel = document.createElement("div");
    panel.className = "fixed bottom-4 right-4 z-[100] bg-paper border border-hairline p-2 rounded-[24px] shadow-subtle flex gap-1 items-center text-[10px] font-bold";
    panel.innerHTML = `
        <span class="text-mid-gray px-1.5 text-[9px] uppercase tracking-wider">Demo States:</span>
        <button type="button" id="demo-state-loaded" class="px-2.5 py-1.5 rounded-full bg-ink text-white transition-colors hover:opacity-90">Loaded</button>
        <button type="button" id="demo-state-loading" class="px-2.5 py-1.5 rounded-full bg-canvas text-ink border border-hairline transition-colors hover:bg-hairline">Loading</button>
        <button type="button" id="demo-state-empty" class="px-2.5 py-1.5 rounded-full bg-canvas text-ink border border-hairline transition-colors hover:bg-hairline">Empty</button>
        <button type="button" id="demo-state-error" class="px-2.5 py-1.5 rounded-full bg-canvas text-ink border border-hairline transition-colors hover:bg-hairline">Error</button>
    `;
    document.body.appendChild(panel);

    const states = ["loaded", "loading", "empty", "error"];
    states.forEach(state => {
        const btn = document.getElementById(`demo-state-${state}`);
        if (btn) {
            btn.addEventListener("click", () => {
                // Đổi kiểu nút active trên bảng demo
                states.forEach(s => {
                    const b = document.getElementById(`demo-state-${s}`);
                    if (b) {
                        b.className = "px-2.5 py-1.5 rounded-full bg-canvas text-ink border border-hairline transition-colors hover:bg-hairline";
                    }
                });
                btn.className = "px-2.5 py-1.5 rounded-full bg-ink text-white transition-colors hover:opacity-90";

                // Thay đổi trạng thái hiển thị của Dashboard
                switchDashboardState(state);
            });
        }
    });
}
