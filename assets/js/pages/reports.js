/**
 * MindHub Admin Reports and Statistics Page Controller
 */

import { initializeLayout } from "../layout.js";
import {
  getRevenueReport,
  getTopCoursesReport,
  getTopInstructorsReport,
} from "../api/reports-api.js";
import { getCourses, getUsers } from "../mocks/mock-repository.js";
import { showToast } from "../toast.js";

// Biến lưu Chart instance để destroy trước khi vẽ lại
let revenueChartInstance = null;

// Application State
const state = {
  currentTab: "revenue", // "revenue" | "courses" | "instructors"
  filters: {
    time_preset: "30_days",
    date_from: "",
    date_to: "",
    month: "",
    year: "2026",
    course_id: "",
    instructor_id: "",
    group_by: "day",
  },
  sorting: {
    revenue: { sort_by: "period", sort_direction: "asc" },
    courses: { sort_by: "total_revenue", sort_direction: "desc" },
    instructors: { sort_by: "total_revenue", sort_direction: "desc" },
  },
  pagination: {
    revenue: { page: 1, per_page: 20 },
    courses: { page: 1, per_page: 20 },
    instructors: { page: 1, per_page: 20 },
  },
};

/**
 * Format tiền tệ VND
 */
function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format phần trăm
 */
function formatPercent(num) {
  const val = Number(num);
  if (!Number.isFinite(val)) return "0%";
  return `${Math.round(val)}%`;
}

/**
 * Escape HTML chống XSS
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Đọc query string và khôi phục State
 */
function readStateFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("tab")) {
    const tab = urlParams.get("tab");
    if (["revenue", "courses", "instructors"].includes(tab)) {
      state.currentTab = tab;
    }
  }

  if (urlParams.has("time_preset")) state.filters.time_preset = urlParams.get("time_preset");
  if (urlParams.has("date_from")) state.filters.date_from = urlParams.get("date_from");
  if (urlParams.has("date_to")) state.filters.date_to = urlParams.get("date_to");
  if (urlParams.has("month")) state.filters.month = urlParams.get("month");
  if (urlParams.has("year")) state.filters.year = urlParams.get("year");
  if (urlParams.has("course_id")) state.filters.course_id = urlParams.get("course_id");
  if (urlParams.has("instructor_id")) state.filters.instructor_id = urlParams.get("instructor_id");
  if (urlParams.has("group_by")) state.filters.group_by = urlParams.get("group_by");

  if (urlParams.has("revenue_page"))
    state.pagination.revenue.page = Number(urlParams.get("revenue_page")) || 1;
  if (urlParams.has("courses_page"))
    state.pagination.courses.page = Number(urlParams.get("courses_page")) || 1;
  if (urlParams.has("instructors_page"))
    state.pagination.instructors.page = Number(urlParams.get("instructors_page")) || 1;

  if (urlParams.has("per_page")) {
    const perPage = Number(urlParams.get("per_page")) || 20;
    state.pagination.revenue.per_page = perPage;
    state.pagination.courses.per_page = perPage;
    state.pagination.instructors.per_page = perPage;
  }
}

/**
 * Cập nhật URL State mà không làm reload trang
 */
function updateUrlState() {
  const params = new URLSearchParams();

  params.set("tab", state.currentTab);
  if (state.filters.time_preset) params.set("time_preset", state.filters.time_preset);
  if (state.filters.date_from) params.set("date_from", state.filters.date_from);
  if (state.filters.date_to) params.set("date_to", state.filters.date_to);
  if (state.filters.month) params.set("month", state.filters.month);
  if (state.filters.year) params.set("year", state.filters.year);
  if (state.filters.course_id) params.set("course_id", state.filters.course_id);

  if (state.currentTab === "revenue" && state.filters.instructor_id) {
    params.set("instructor_id", state.filters.instructor_id);
  }
  if (state.currentTab === "revenue" && state.filters.group_by) {
    params.set("group_by", state.filters.group_by);
  }

  if (state.pagination.revenue.page > 1)
    params.set("revenue_page", String(state.pagination.revenue.page));
  if (state.pagination.courses.page > 1)
    params.set("courses_page", String(state.pagination.courses.page));
  if (state.pagination.instructors.page > 1)
    params.set("instructors_page", String(state.pagination.instructors.page));

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);

  // Kích hoạt/Vô hiệu hóa nút Xóa bộ lọc
  const hasActiveFilters = Boolean(
    state.filters.date_from ||
      state.filters.date_to ||
      state.filters.month ||
      state.filters.course_id ||
      (state.filters.instructor_id && state.currentTab === "revenue") ||
      state.filters.time_preset === "custom"
  );

  const resetBtn = document.getElementById("btn-reset-filters");
  if (resetBtn) {
    resetBtn.disabled = !hasActiveFilters;
  }
}

/**
 * Nạp danh sách Khóa học & Giảng viên vào Dropdown bộ lọc
 */
function initCourseAndInstructorSelects() {
  const courseSelect = document.getElementById("filter-course-id");
  if (courseSelect) {
    const courses = getCourses();
    courses.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = String(c.id);
      opt.textContent = `${c.title} (#${c.id})`;
      if (state.filters.course_id === String(c.id)) opt.selected = true;
      courseSelect.appendChild(opt);
    });
  }

  const instructorSelect = document.getElementById("filter-instructor-id");
  if (instructorSelect) {
    const users = getUsers();
    const instructors = users.filter((u) => u.role === "instructor");
    instructors.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = String(u.id);
      opt.textContent = `${u.full_name} (${u.email})`;
      if (state.filters.instructor_id === String(u.id)) opt.selected = true;
      instructorSelect.appendChild(opt);
    });
  }

  // Tự động khởi tạo lại CustomSelect nếu có
  if (typeof window.initAllCustomSelects === "function") {
    window.initAllCustomSelects();
  }
}

/**
 * Đồng bộ giá trị của giao diện Filter với State
 */
function syncFilterInputs() {
  const timePreset = document.getElementById("filter-time-preset");
  if (timePreset) timePreset.value = state.filters.time_preset || "30_days";

  const dateFrom = document.getElementById("filter-date-from");
  if (dateFrom) dateFrom.value = state.filters.date_from || "";

  const dateTo = document.getElementById("filter-date-to");
  if (dateTo) dateTo.value = state.filters.date_to || "";

  const month = document.getElementById("filter-month");
  if (month) month.value = state.filters.month || "";

  const year = document.getElementById("filter-year");
  if (year) year.value = state.filters.year || "2026";

  const courseSelect = document.getElementById("filter-course-id");
  if (courseSelect) courseSelect.value = state.filters.course_id || "";

  const instructorSelect = document.getElementById("filter-instructor-id");
  if (instructorSelect) instructorSelect.value = state.filters.instructor_id || "";

  const groupBy = document.getElementById("filter-group-by");
  if (groupBy) groupBy.value = state.filters.group_by || "day";

  toggleCustomDateInputs();
}

/**
 * Hiện/ẩn ô nhập ngày tùy chọn dựa trên time_preset
 */
function toggleCustomDateInputs() {
  const preset = state.filters.time_preset;
  const wrapperFrom = document.getElementById("wrapper-date-from");
  const wrapperTo = document.getElementById("wrapper-date-to");

  if (preset === "custom") {
    if (wrapperFrom) wrapperFrom.classList.remove("hidden");
    if (wrapperTo) wrapperTo.classList.remove("hidden");
  } else {
    if (wrapperFrom) wrapperFrom.classList.add("hidden");
    if (wrapperTo) wrapperTo.classList.add("hidden");
    state.filters.date_from = "";
    state.filters.date_to = "";
  }
}

/**
 * Kiểm tra tính hợp lệ của khoảng ngày
 */
function validateDateRange() {
  const errorEl = document.getElementById("filter-date-error");
  if (state.filters.time_preset === "custom" && state.filters.date_from && state.filters.date_to) {
    const from = new Date(state.filters.date_from);
    const to = new Date(state.filters.date_to);
    if (to < from) {
      if (errorEl) errorEl.classList.remove("hidden");
      return false;
    }
  }
  if (errorEl) errorEl.classList.add("hidden");
  return true;
}

/**
 * Chuyển đổi Tab UI
 */
function switchTab(tabName) {
  state.currentTab = tabName;

  // Toggle Tab Buttons
  document.querySelectorAll(".report-tab-btn").forEach((btn) => {
    const target = btn.getAttribute("data-tab-target");
    if (target === tabName) {
      btn.classList.add("border-ink", "text-ink", "font-semibold");
      btn.classList.remove("border-transparent", "text-mid-gray", "font-medium");
    } else {
      btn.classList.remove("border-ink", "text-ink", "font-semibold");
      btn.classList.add("border-transparent", "text-mid-gray", "font-medium");
    }
  });

  // Toggle Tab Panels
  document.querySelectorAll(".report-tab-panel").forEach((panel) => {
    if (panel.id === `tab-panel-${tabName}`) {
      panel.classList.remove("hidden");
    } else {
      panel.classList.add("hidden");
    }
  });

  // Toggle filter controls specific to Revenue Tab
  const instructorWrapper = document.getElementById("wrapper-filter-instructor");
  const groupByWrapper = document.getElementById("wrapper-filter-group-by");
  if (tabName === "revenue") {
    if (instructorWrapper) instructorWrapper.classList.remove("hidden");
    if (groupByWrapper) groupByWrapper.classList.remove("hidden");
  } else {
    if (instructorWrapper) instructorWrapper.classList.add("hidden");
    if (groupByWrapper) groupByWrapper.classList.add("hidden");
  }

  updateUrlState();
  loadCurrentTabReport();
}

/**
 * Tải dữ liệu tương ứng với Tab đang được chọn
 */
function loadCurrentTabReport() {
  if (!validateDateRange()) return;

  if (state.currentTab === "revenue") {
    loadRevenueReport();
  } else if (state.currentTab === "courses") {
    loadTopCoursesReport();
  } else if (state.currentTab === "instructors") {
    loadTopInstructorsReport();
  }
}

/**
 * =========================================================================
 * 1. TAB REVENUE REPORT CONTROLLER
 * =========================================================================
 */
async function loadRevenueReport() {
  const tbody = document.getElementById("revenue-table-body");
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-12 text-center text-mid-gray">
          <div class="inline-flex items-center gap-2">
            <svg class="w-5 h-5 animate-spin text-ink" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang nạp dữ liệu báo cáo doanh thu...</span>
          </div>
        </td>
      </tr>
    `;
  }

  const params = {
    page: state.pagination.revenue.page,
    per_page: state.pagination.revenue.per_page,
    date_from: state.filters.date_from,
    date_to: state.filters.date_to,
    month: state.filters.month,
    year: state.filters.year,
    course_id: state.filters.course_id,
    instructor_id: state.filters.instructor_id,
    group_by: state.filters.group_by,
    sort_by: state.sorting.revenue.sort_by,
    sort_direction: state.sorting.revenue.sort_direction,
  };

  try {
    const res = await getRevenueReport(params);
    if (!res || !res.success) {
      throw new Error(res?.message || "Không thể nạp dữ liệu báo cáo doanh thu.");
    }

    const { summary, items, all_periods } = res.data;

    // Render KPI Cards
    const grossEl = document.getElementById("kpi-revenue-gross");
    const instrEl = document.getElementById("kpi-revenue-instructor");
    const instrRateEl = document.getElementById("kpi-revenue-instructor-rate");
    const platEl = document.getElementById("kpi-revenue-platform");
    const platRateEl = document.getElementById("kpi-revenue-platform-rate");
    const ordersEl = document.getElementById("kpi-revenue-orders");
    const subcountsEl = document.getElementById("kpi-revenue-subcounts");

    const grossNum = Number(summary.total_gross_amount);
    const instrNum = Number(summary.total_instructor_amount);
    const platNum = Number(summary.total_platform_fee_amount);

    if (grossEl) grossEl.textContent = formatMoney(grossNum);
    if (instrEl) instrEl.textContent = formatMoney(instrNum);
    if (platEl) platEl.textContent = formatMoney(platNum);
    if (ordersEl) ordersEl.textContent = `${summary.order_count} đơn`;
    if (subcountsEl)
      subcountsEl.textContent = `${summary.course_count} khóa học • ${summary.instructor_count} giảng viên`;

    // Tính tỷ lệ trực tiếp từ số liệu tổng (Không hard-code 70/30)
    const instrRate = grossNum > 0 ? ((instrNum / grossNum) * 100).toFixed(1) : "0.0";
    const platRate = grossNum > 0 ? ((platNum / grossNum) * 100).toFixed(1) : "0.0";
    if (instrRateEl) instrRateEl.textContent = `Tỷ lệ thực nhận: ${instrRate}%`;
    if (platRateEl) platRateEl.textContent = `Phí giữ lại: ${platRate}%`;

    // Render Chart
    renderRevenueChart(all_periods || items, state.filters.group_by);

    // Render Table Body
    if (!items || items.length === 0) {
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="px-4 py-12 text-center text-mid-gray">
              <div class="flex flex-col items-center justify-center space-y-2">
                <svg class="w-8 h-8 text-mid-gray/50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
                <span class="font-medium">Không có dữ liệu doanh thu trong khoảng thời gian đã chọn</span>
              </div>
            </td>
          </tr>
        `;
      }
    } else {
      if (tbody) {
        tbody.innerHTML = items
          .map((row) => {
            const gross = Number(row.gross_amount);
            const instr = Number(row.instructor_amount);
            const plat = Number(row.platform_fee_amount);
            const iRate = gross > 0 ? Math.round((instr / gross) * 100) : 0;
            const pRate = gross > 0 ? Math.round((plat / gross) * 100) : 0;

            return `
              <tr class="hover:bg-canvas/60 transition-colors">
                <td class="px-4 py-3 font-semibold text-ink">${escapeHtml(row.period)}</td>
                <td class="px-4 py-3 text-right font-medium text-emerald-600">${formatMoney(gross)}</td>
                <td class="px-4 py-3 text-right font-medium text-blue-600">${formatMoney(instr)}</td>
                <td class="px-4 py-3 text-right font-medium text-amber-600">${formatMoney(plat)}</td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">${iRate}% GV</span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">${pRate}% NT</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right font-medium">${row.order_count}</td>
                <td class="px-4 py-3 text-right text-mid-gray">${row.course_count}</td>
                <td class="px-4 py-3 text-right text-mid-gray">${row.instructor_count}</td>
              </tr>
            `;
          })
          .join("");
      }
    }

    // Render Pagination
    renderPagination("revenue-pagination-container", res.meta, (newPage) => {
      state.pagination.revenue.page = newPage;
      updateUrlState();
      loadRevenueReport();
    });
  } catch (error) {
    console.error("Lỗi khi tải báo cáo doanh thu:", error);
    showToast(error.message || "Không thể nạp báo cáo doanh thu.", "error");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-4 py-8 text-center text-red-600 bg-red-50">
            <p class="font-semibold">Đã xảy ra lỗi khi tải dữ liệu báo cáo</p>
            <p class="text-xs mt-1 text-red-500">${escapeHtml(error.message)}</p>
          </td>
        </tr>
      `;
    }
  }
}

/**
 * Vẽ/Cập nhật Biểu đồ Chart.js
 */
function renderRevenueChart(periodsData, groupBy) {
  const canvas = document.getElementById("revenue-chart-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Hủy instance cũ nếu đã tồn tại để tránh đè canvas
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  if (!periodsData || periodsData.length === 0) return;

  const labels = periodsData.map((d) => d.period);
  const grossValues = periodsData.map((d) => Number(d.gross_amount));
  const instructorValues = periodsData.map((d) => Number(d.instructor_amount));
  const platformValues = periodsData.map((d) => Number(d.platform_fee_amount));

  if (typeof window.Chart === "undefined") {
    console.warn("Chart.js chưa sẵn sàng.");
    return;
  }

  revenueChartInstance = new window.Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Tổng doanh thu",
          data: grossValues,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.08)",
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: "Thu nhập giảng viên",
          data: instructorValues,
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.35,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: "Phí nền tảng",
          data: platformValues,
          borderColor: "#f59e0b",
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [2, 2],
          tension: 0.35,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false, // Dùng legend riêng trên HTML
        },
        tooltip: {
          backgroundColor: "#111827",
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || "";
              const val = context.parsed.y;
              return `${label}: ${formatMoney(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: "#6b7280" },
        },
        y: {
          grid: { color: "#f3f4f6" },
          ticks: {
            font: { size: 11 },
            color: "#6b7280",
            callback: function (value) {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
              if (value >= 1000) return (value / 1000).toFixed(0) + "k";
              return value;
            },
          },
        },
      },
    },
  });
}

/**
 * =========================================================================
 * 2. TAB TOP COURSES REPORT CONTROLLER
 * =========================================================================
 */
async function loadTopCoursesReport() {
  const tbody = document.getElementById("courses-table-body");
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="px-4 py-12 text-center text-mid-gray">
          <div class="inline-flex items-center gap-2">
            <svg class="w-5 h-5 animate-spin text-ink" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang nạp bảng xếp hạng khóa học...</span>
          </div>
        </td>
      </tr>
    `;
  }

  const params = {
    page: state.pagination.courses.page,
    per_page: state.pagination.courses.per_page,
    date_from: state.filters.date_from,
    date_to: state.filters.date_to,
    month: state.filters.month,
    year: state.filters.year,
    course_id: state.filters.course_id,
    sort_by: state.sorting.courses.sort_by,
    sort_direction: state.sorting.courses.sort_direction,
  };

  try {
    const res = await getTopCoursesReport(params);
    if (!res || !res.success) {
      throw new Error(res?.message || "Không thể nạp dữ liệu khóa học nổi bật.");
    }

    const { summary, items } = res.data;

    // Render KPI Cards
    const countEl = document.getElementById("kpi-courses-count");
    const soldEl = document.getElementById("kpi-courses-sold");
    const revEl = document.getElementById("kpi-courses-revenue");
    const compEl = document.getElementById("kpi-courses-completed");

    if (countEl) countEl.textContent = `${summary.total_courses} khóa`;
    if (soldEl) soldEl.textContent = `${summary.total_sold} lượt`;
    if (revEl) revEl.textContent = formatMoney(summary.total_revenue);
    if (compEl) compEl.textContent = `${summary.total_completed} học viên`;

    // Render Table Body
    if (!items || items.length === 0) {
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="px-4 py-12 text-center text-mid-gray">
              <span>Không tìm thấy khóa học nào phù hợp với bộ lọc</span>
            </td>
          </tr>
        `;
      }
    } else {
      const startIndex = (res.meta.current_page - 1) * res.meta.per_page;
      if (tbody) {
        tbody.innerHTML = items
          .map((item, index) => {
            const rank = startIndex + index + 1;
            let rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold bg-canvas text-mid-gray">#${rank}</span>`;
            if (rank === 1)
              rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">#1</span>`;
            else if (rank === 2)
              rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">#2</span>`;
            else if (rank === 3)
              rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">#3</span>`;

            const lastPaidStr = item.last_paid_at
              ? new Date(item.last_paid_at).toLocaleDateString("vi-VN")
              : "Chưa có";

            return `
              <tr class="hover:bg-canvas/60 transition-colors cursor-pointer" onclick="window.location.href='courses.html?open_course_id=${item.course_id}'">
                <td class="px-4 py-3 text-center">${rankBadge}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-col">
                    <a href="courses.html?open_course_id=${item.course_id}" onclick="event.stopPropagation();" class="font-semibold text-ink hover:underline text-xs">
                      ${escapeHtml(item.title)}
                    </a>
                    <span class="text-[11px] text-mid-gray mt-0.5 font-mono">ID: #${item.course_id}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  ${
                    item.instructor
                      ? `<a href="users.html?open_user_id=${item.instructor.id}" onclick="event.stopPropagation();" class="text-xs text-ink font-medium hover:underline">
                          ${escapeHtml(item.instructor.full_name)}
                        </a>`
                      : '<span class="text-mid-gray">N/A</span>'
                  }
                </td>
                <td class="px-4 py-3 text-right font-medium tabular-nums">${item.sold_count}</td>
                <td class="px-4 py-3 text-right text-mid-gray tabular-nums">${item.enrollment_count}</td>
                <td class="px-4 py-3 text-right text-mid-gray tabular-nums">${item.completed_count}</td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center gap-2 justify-center">
                    <div class="w-16 h-1.5 rounded-full bg-hairline overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" style="width: ${item.completion_rate}%"></div>
                    </div>
                    <span class="text-[11px] font-semibold text-ink">${formatPercent(item.completion_rate)}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-emerald-600">
                  <a href="revenues.html?course_id=${item.course_id}" onclick="event.stopPropagation();" class="hover:underline">
                    ${formatMoney(item.total_revenue)}
                  </a>
                </td>
                <td class="px-4 py-3 text-right text-mid-gray text-[11px]">${lastPaidStr}</td>
              </tr>
            `;
          })
          .join("");
      }
    }

    // Render Pagination
    renderPagination("courses-pagination-container", res.meta, (newPage) => {
      state.pagination.courses.page = newPage;
      updateUrlState();
      loadTopCoursesReport();
    });
  } catch (error) {
    console.error("Lỗi khi tải báo cáo khóa học nổi bật:", error);
    showToast(error.message || "Không thể nạp báo cáo khóa học nổi bật.", "error");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="px-4 py-8 text-center text-red-600 bg-red-50">
            <p class="font-semibold">Đã xảy ra lỗi khi tải danh sách khóa học</p>
            <p class="text-xs mt-1 text-red-500">${escapeHtml(error.message)}</p>
          </td>
        </tr>
      `;
    }
  }
}

/**
 * =========================================================================
 * 3. TAB TOP INSTRUCTORS REPORT CONTROLLER
 * =========================================================================
 */
async function loadTopInstructorsReport() {
  const tbody = document.getElementById("instructors-table-body");
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="px-4 py-12 text-center text-mid-gray">
          <div class="inline-flex items-center gap-2">
            <svg class="w-5 h-5 animate-spin text-ink" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang nạp bảng xếp hạng giảng viên...</span>
          </div>
        </td>
      </tr>
    `;
  }

  const params = {
    page: state.pagination.instructors.page,
    per_page: state.pagination.instructors.per_page,
    date_from: state.filters.date_from,
    date_to: state.filters.date_to,
    month: state.filters.month,
    year: state.filters.year,
    sort_by: state.sorting.instructors.sort_by,
    sort_direction: state.sorting.instructors.sort_direction,
  };

  try {
    const res = await getTopInstructorsReport(params);
    if (!res || !res.success) {
      throw new Error(res?.message || "Không thể nạp dữ liệu giảng viên nổi bật.");
    }

    const { summary, items } = res.data;

    // Render KPI Cards
    const countEl = document.getElementById("kpi-instructors-count");
    const coursesEl = document.getElementById("kpi-instructors-courses");
    const soldEl = document.getElementById("kpi-instructors-sold");
    const revEl = document.getElementById("kpi-instructors-revenue");

    if (countEl) countEl.textContent = `${summary.total_instructors} giảng viên`;
    if (coursesEl) coursesEl.textContent = `${summary.total_courses} khóa`;
    if (soldEl) soldEl.textContent = `${summary.total_sold} đơn`;
    if (revEl) revEl.textContent = formatMoney(summary.total_revenue);

    // Render Table Body
    if (!items || items.length === 0) {
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="px-4 py-12 text-center text-mid-gray">
              <span>Không tìm thấy giảng viên nào phù hợp với bộ lọc</span>
            </td>
          </tr>
        `;
      }
    } else {
      const startIndex = (res.meta.current_page - 1) * res.meta.per_page;
      if (tbody) {
        tbody.innerHTML = items
          .map((item, index) => {
            const rank = startIndex + index + 1;
            let rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold bg-canvas text-mid-gray">#${rank}</span>`;
            if (rank === 1)
              rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">#1</span>`;
            else if (rank === 2)
              rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">#2</span>`;
            else if (rank === 3)
              rankBadge = `<span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">#3</span>`;

            const lastActStr = item.last_activity_at
              ? new Date(item.last_activity_at).toLocaleDateString("vi-VN")
              : "Chưa có";

            return `
              <tr class="hover:bg-canvas/60 transition-colors cursor-pointer" onclick="window.location.href='users.html?open_user_id=${item.instructor_id}'">
                <td class="px-4 py-3 text-center">${rankBadge}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white font-semibold text-xs shrink-0">
                      ${escapeHtml((item.full_name || "GV").charAt(0).toUpperCase())}
                    </div>
                    <div class="flex flex-col">
                      <a href="users.html?open_user_id=${item.instructor_id}" onclick="event.stopPropagation();" class="font-semibold text-ink hover:underline text-xs">
                        ${escapeHtml(item.full_name)}
                      </a>
                      <span class="text-[11px] text-mid-gray">${escapeHtml(item.email)}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-col">
                    <span class="font-medium text-ink">${item.total_courses} khóa</span>
                    <span class="text-[10px] text-emerald-600 font-medium">${item.published_courses} xuất bản</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right font-medium tabular-nums">${item.total_sold}</td>
                <td class="px-4 py-3 text-right text-mid-gray tabular-nums">${item.total_enrollments}</td>
                <td class="px-4 py-3 text-right text-mid-gray tabular-nums">${item.total_completed}</td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center gap-2 justify-center">
                    <div class="w-16 h-1.5 rounded-full bg-hairline overflow-hidden">
                      <div class="h-full bg-blue-500 rounded-full" style="width: ${item.completion_rate}%"></div>
                    </div>
                    <span class="text-[11px] font-semibold text-ink">${formatPercent(item.completion_rate)}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-emerald-600">
                  <a href="revenues.html?instructor_id=${item.instructor_id}" onclick="event.stopPropagation();" class="hover:underline">
                    ${formatMoney(item.total_revenue)}
                  </a>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-blue-600">
                  ${formatMoney(item.instructor_amount)}
                </td>
                <td class="px-4 py-3 text-right text-mid-gray text-[11px]">${lastActStr}</td>
              </tr>
            `;
          })
          .join("");
      }
    }

    // Render Pagination
    renderPagination("instructors-pagination-container", res.meta, (newPage) => {
      state.pagination.instructors.page = newPage;
      updateUrlState();
      loadTopInstructorsReport();
    });
  } catch (error) {
    console.error("Lỗi khi tải báo cáo giảng viên nổi bật:", error);
    showToast(error.message || "Không thể nạp báo cáo giảng viên nổi bật.", "error");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="px-4 py-8 text-center text-red-600 bg-red-50">
            <p class="font-semibold">Đã xảy ra lỗi khi tải danh sách giảng viên</p>
            <p class="text-xs mt-1 text-red-500">${escapeHtml(error.message)}</p>
          </td>
        </tr>
      `;
    }
  }
}

/**
 * Component Pagination dùng chung chuẩn MindHub
 */
function renderPagination(containerId, meta, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!meta || meta.total === 0 || meta.last_page <= 1) {
    container.innerHTML = `
      <div class="text-xs text-mid-gray">Hiển thị 0 - 0 trong tổng số ${meta?.total || 0} bản ghi</div>
      <div></div>
    `;
    return;
  }

  const { current_page, last_page, per_page, total } = meta;
  const fromIndex = (current_page - 1) * per_page + 1;
  const toIndex = Math.min(current_page * per_page, total);

  // Tạo các nút số trang
  let pageButtonsHtml = "";
  const maxVisiblePages = 5;
  let startPage = Math.max(1, current_page - 2);
  let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let p = startPage; p <= endPage; p++) {
    const isActive = p === current_page;
    pageButtonsHtml += `
      <button type="button" data-page="${p}" class="page-num-btn h-8 w-8 rounded-full border text-xs font-semibold transition-colors ${
      isActive
        ? "border-ink bg-ink text-white shadow-xs"
        : "border-hairline bg-paper text-ink hover:bg-canvas"
    }">
        ${p}
      </button>
    `;
  }

  container.innerHTML = `
    <div class="text-xs text-mid-gray">
      Hiển thị <span class="font-semibold text-ink">${fromIndex}</span> - <span class="font-semibold text-ink">${toIndex}</span> trong tổng số <span class="font-semibold text-ink">${total}</span> bản ghi
    </div>
    <div class="flex items-center gap-1.5">
      <button type="button" id="${containerId}-prev" ${
    current_page <= 1 ? "disabled" : ""
  } class="inline-flex h-8 items-center gap-1 rounded-full border border-hairline bg-paper px-3 text-xs font-medium text-ink hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
        <span>Trước</span>
      </button>

      <div class="flex items-center gap-1">
        ${pageButtonsHtml}
      </div>

      <button type="button" id="${containerId}-next" ${
    current_page >= last_page ? "disabled" : ""
  } class="inline-flex h-8 items-center gap-1 rounded-full border border-hairline bg-paper px-3 text-xs font-medium text-ink hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <span>Sau</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
      </button>
    </div>
  `;

  // Gán sự kiện
  const prevBtn = document.getElementById(`${containerId}-prev`);
  if (prevBtn && current_page > 1) {
    prevBtn.addEventListener("click", () => onPageChange(current_page - 1));
  }

  const nextBtn = document.getElementById(`${containerId}-next`);
  if (nextBtn && current_page < last_page) {
    nextBtn.addEventListener("click", () => onPageChange(current_page + 1));
  }

  container.querySelectorAll(".page-num-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const p = Number(e.currentTarget.getAttribute("data-page"));
      if (p && p !== current_page) {
        onPageChange(p);
      }
    });
  });
}

/**
 * Đăng ký tất cả sự kiện tương tác bộ lọc & sắp xếp
 */
function bindEventListeners() {
  // Tab Switchers
  document.querySelectorAll(".report-tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget.getAttribute("data-tab-target");
      if (target && target !== state.currentTab) {
        switchTab(target);
      }
    });
  });

  // Time Preset Filter
  const timePresetSelect = document.getElementById("filter-time-preset");
  if (timePresetSelect) {
    timePresetSelect.addEventListener("change", (e) => {
      state.filters.time_preset = e.target.value;
      toggleCustomDateInputs();
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  // Custom Date From / Date To
  const dateFromInput = document.getElementById("filter-date-from");
  if (dateFromInput) {
    dateFromInput.addEventListener("change", (e) => {
      state.filters.date_from = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  const dateToInput = document.getElementById("filter-date-to");
  if (dateToInput) {
    dateToInput.addEventListener("change", (e) => {
      state.filters.date_to = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  // Month & Year Filter
  const monthSelect = document.getElementById("filter-month");
  if (monthSelect) {
    monthSelect.addEventListener("change", (e) => {
      state.filters.month = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  const yearSelect = document.getElementById("filter-year");
  if (yearSelect) {
    yearSelect.addEventListener("change", (e) => {
      state.filters.year = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  // Course Filter
  const courseSelect = document.getElementById("filter-course-id");
  if (courseSelect) {
    courseSelect.addEventListener("change", (e) => {
      state.filters.course_id = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  // Instructor Filter
  const instructorSelect = document.getElementById("filter-instructor-id");
  if (instructorSelect) {
    instructorSelect.addEventListener("change", (e) => {
      state.filters.instructor_id = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  // Group By Filter
  const groupBySelect = document.getElementById("filter-group-by");
  if (groupBySelect) {
    groupBySelect.addEventListener("change", (e) => {
      state.filters.group_by = e.target.value;
      resetPagesToOne();
      updateUrlState();
      loadCurrentTabReport();
    });
  }

  // Reset Filters Button X
  const resetBtn = document.getElementById("btn-reset-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.filters = {
        time_preset: "30_days",
        date_from: "",
        date_to: "",
        month: "",
        year: "2026",
        course_id: "",
        instructor_id: "",
        group_by: "day",
      };
      resetPagesToOne();
      syncFilterInputs();
      updateUrlState();
      loadCurrentTabReport();
      showToast("Đã xóa toàn bộ bộ lọc về mặc định", "info");
    });
  }

  // Refresh Button
  const refreshBtn = document.getElementById("btn-refresh-reports");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadCurrentTabReport();
      showToast("Đã làm mới dữ liệu báo cáo", "success");
    });
  }

  // Sort Selects
  const sortRevenueSelect = document.getElementById("sort-revenue-by");
  if (sortRevenueSelect) {
    sortRevenueSelect.addEventListener("change", (e) => {
      const [by, dir] = e.target.value.split(":");
      state.sorting.revenue.sort_by = by;
      state.sorting.revenue.sort_direction = dir || "asc";
      state.pagination.revenue.page = 1;
      updateUrlState();
      loadRevenueReport();
    });
  }

  const sortCoursesSelect = document.getElementById("sort-courses-by");
  if (sortCoursesSelect) {
    sortCoursesSelect.addEventListener("change", (e) => {
      const [by, dir] = e.target.value.split(":");
      state.sorting.courses.sort_by = by;
      state.sorting.courses.sort_direction = dir || "desc";
      state.pagination.courses.page = 1;
      updateUrlState();
      loadTopCoursesReport();
    });
  }

  const sortInstructorsSelect = document.getElementById("sort-instructors-by");
  if (sortInstructorsSelect) {
    sortInstructorsSelect.addEventListener("change", (e) => {
      const [by, dir] = e.target.value.split(":");
      state.sorting.instructors.sort_by = by;
      state.sorting.instructors.sort_direction = dir || "desc";
      state.pagination.instructors.page = 1;
      updateUrlState();
      loadTopInstructorsReport();
    });
  }

  // Per Page Selects
  const perPageRevenueSelect = document.getElementById("per-page-revenue");
  if (perPageRevenueSelect) {
    perPageRevenueSelect.addEventListener("change", (e) => {
      state.pagination.revenue.per_page = Number(e.target.value) || 20;
      state.pagination.revenue.page = 1;
      updateUrlState();
      loadRevenueReport();
    });
  }

  const perPageCoursesSelect = document.getElementById("per-page-courses");
  if (perPageCoursesSelect) {
    perPageCoursesSelect.addEventListener("change", (e) => {
      state.pagination.courses.per_page = Number(e.target.value) || 20;
      state.pagination.courses.page = 1;
      updateUrlState();
      loadTopCoursesReport();
    });
  }

  const perPageInstructorsSelect = document.getElementById("per-page-instructors");
  if (perPageInstructorsSelect) {
    perPageInstructorsSelect.addEventListener("change", (e) => {
      state.pagination.instructors.per_page = Number(e.target.value) || 20;
      state.pagination.instructors.page = 1;
      updateUrlState();
      loadTopInstructorsReport();
    });
  }
}

/**
 * Reset tất cả page về 1 khi đổi bộ lọc
 */
function resetPagesToOne() {
  state.pagination.revenue.page = 1;
  state.pagination.courses.page = 1;
  state.pagination.instructors.page = 1;
}

/**
 * Khởi tạo ứng dụng khi DOM sẵn sàng
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initializeLayout();
  } catch (err) {
    console.error("Lỗi khởi tạo Layout:", err);
  }

  readStateFromUrl();
  initCourseAndInstructorSelects();
  syncFilterInputs();
  bindEventListeners();

  switchTab(state.currentTab);
});
