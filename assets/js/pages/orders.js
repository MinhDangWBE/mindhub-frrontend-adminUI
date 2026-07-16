import { getOrders, getOrder } from "../api/orders-api.js";
import { getUsers, getCourses } from "../mocks/mock-repository.js";
import { showToast } from "../toast.js";
import { initializeLayout } from "../layout.js";

// Global State
const state = {
  page: 1,
  per_page: 20,
  status: "all",
  payment_status: "all",
  user_id: "all",
  course_id: "all",
  order_code: "",
  search_text: "",
  selected_search_label: "",
  date_preset: "all",
  date_from: "",
  date_to: "",
  open_order_id: null,
  isLoading: false,
  shouldAutoScroll: false,
};

export function getOrderStatusMeta(status) {
  const map = {
    pending: { label: "Chờ thanh toán", tone: "warning" },
    paid: { label: "Đã thanh toán", tone: "success" },
    failed: { label: "Thất bại", tone: "danger" },
    cancelled: { label: "Đã hủy", tone: "neutral" },
    expired: { label: "Đã hết hạn", tone: "neutral" }
  };
  return map[status] ?? { label: "Không xác định", tone: "neutral" };
}

export function getPaymentStatusMeta(status) {
  const map = {
    unpaid: { label: "Chưa thanh toán", tone: "neutral" },
    processing: { label: "Đang xử lý", tone: "warning" },
    paid: { label: "Đã thanh toán", tone: "success" },
    failed: { label: "Thất bại", tone: "danger" }
  };
  return map[status] ?? { label: "Không xác định", tone: "neutral" };
}

export function isValidOrderPaymentPair(orderStatus, paymentStatus) {
  const allowedPairs = {
    pending: ["unpaid", "processing"],
    paid: ["paid"],
    failed: ["failed"],
    cancelled: ["unpaid", "failed"],
    expired: ["unpaid"]
  };
  return Boolean(allowedPairs[orderStatus]?.includes(paymentStatus));
}

/**
 * Format tiền tệ VND
 */
function formatVND(amountStr) {
  const num = Number(amountStr) || 0;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(num)
    .replace("₫", "đ");
}

/**
 * Format ngày giờ dd/mm/yyyy HH:mm
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
 * Helper cuộn mượt đến danh sách đơn hàng
 */
function scrollToOrdersList() {
  const target = document.getElementById("orders-list-section");
  if (!target) return;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

/**
 * Đọc tham số từ Query String URL
 */
function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  state.page = Number(urlParams.get("page")) || 1;
  state.per_page = Number(urlParams.get("per_page")) || 20;
  state.status = urlParams.get("status") || "all";
  state.payment_status = urlParams.get("payment_status") || "all";
  state.user_id = urlParams.get("user_id") || "all";
  state.course_id = urlParams.get("course_id") || "all";
  state.order_code = urlParams.get("order_code") || "";
  state.search_text =
    urlParams.get("search") || urlParams.get("order_search") || "";
  state.date_preset = urlParams.get("date_preset") || "all";
  state.date_from = urlParams.get("date_from") || "";
  state.date_to = urlParams.get("date_to") || "";
  state.open_order_id = urlParams.get("open_order_id") || null;
}

/**
 * Cập nhật Query String trên thanh địa chỉ trình duyệt
 */
function updateUrlParams() {
  const urlParams = new URLSearchParams();
  if (state.page > 1) urlParams.set("page", state.page);
  if (state.per_page !== 20) urlParams.set("per_page", state.per_page);
  if (state.status !== "all") urlParams.set("status", state.status);
  if (state.payment_status !== "all")
    urlParams.set("payment_status", state.payment_status);
  if (state.user_id !== "all") urlParams.set("user_id", state.user_id);
  if (state.course_id !== "all") urlParams.set("course_id", state.course_id);
  if (state.order_code.trim())
    urlParams.set("order_code", state.order_code.trim());
  if (state.search_text.trim() && !state.order_code.trim())
    urlParams.set("search", state.search_text.trim());
  if (state.date_preset !== "all")
    urlParams.set("date_preset", state.date_preset);
  if (state.date_from) urlParams.set("date_from", state.date_from);
  if (state.date_to) urlParams.set("date_to", state.date_to);
  if (state.open_order_id) urlParams.set("open_order_id", state.open_order_id);

  const queryString = urlParams.toString();
  const newUrl =
    window.location.pathname + (queryString ? `?${queryString}` : "");
  window.history.replaceState({}, "", newUrl);
}

/**
 * Tính toán ngày khi chọn preset khoảng thời gian
 */
function applyDatePreset(presetValue) {
  state.date_preset = presetValue;
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (presetValue === "all") {
    state.date_from = "";
    state.date_to = "";
  } else if (presetValue === "last_7_days") {
    const past7 = new Date();
    past7.setDate(past7.getDate() - 7);
    state.date_from = past7.toISOString().split("T")[0];
    state.date_to = todayStr;
  } else if (presetValue === "last_30_days") {
    const past30 = new Date();
    past30.setDate(past30.getDate() - 30);
    state.date_from = past30.toISOString().split("T")[0];
    state.date_to = todayStr;
  } else if (presetValue === "last_1_year") {
    const pastYear = new Date();
    pastYear.setFullYear(pastYear.getFullYear() - 1);
    state.date_from = pastYear.toISOString().split("T")[0];
    state.date_to = todayStr;
  }
}

/**
 * Validation ngày nhập thủ công
 */
function validateCustomDates() {
  const errorEl = document.getElementById("date-validation-error");
  if (!errorEl) return true;

  if (state.date_preset === "custom") {
    if (!state.date_from) {
      errorEl.textContent = "Vui lòng chọn ngày bắt đầu.";
      errorEl.classList.remove("hidden");
      return false;
    }
    if (!state.date_to) {
      errorEl.textContent = "Vui lòng chọn ngày kết thúc.";
      errorEl.classList.remove("hidden");
      return false;
    }
    if (new Date(state.date_from) > new Date(state.date_to)) {
      errorEl.textContent = "Ngày bắt đầu không được lớn hơn ngày kết thúc.";
      errorEl.classList.remove("hidden");
      return false;
    }
  }

  errorEl.classList.add("hidden");
  errorEl.textContent = "";
  return true;
}

let ordersRequestSequence = 0;

/**
 * Tải dữ liệu từ API & render lại trang
 */
async function fetchAndRenderOrders() {
  const requestId = ++ordersRequestSequence;
  if (state.isLoading) return;
  state.isLoading = true;

  showSkeletons();

  // Chuẩn bị tham số cho API Contract
  const apiParams = {
    page: state.page,
    per_page: state.per_page,
  };

  if (state.status !== "all") apiParams.status = state.status;
  if (state.payment_status !== "all")
    apiParams.payment_status = state.payment_status;
  if (state.user_id !== "all") apiParams.user_id = state.user_id;
  if (state.course_id !== "all") apiParams.course_id = state.course_id;
  if (state.order_code.trim()) apiParams.order_code = state.order_code.trim();
  if (state.search_text.trim() && !state.order_code.trim())
    apiParams.search = state.search_text.trim();
  if (state.date_from) apiParams.date_from = state.date_from;
  if (state.date_to) apiParams.date_to = state.date_to;

  const DEBUG_ORDERS = false;
  if (DEBUG_ORDERS) {
    console.debug("[orders] request", { state: structuredClone(state), apiParams, requestId });
  }

  try {
    const response = await getOrders(apiParams);

    if (requestId !== ordersRequestSequence) {
      if (DEBUG_ORDERS) console.debug("[orders] discarded stale response", { requestId });
      return;
    }

    if (
      !response ||
      !response.data ||
      !response.data.summary ||
      !Array.isArray(response.data.items) ||
      !response.meta
    ) {
      throw new Error("Dữ liệu đơn hàng không đúng API contract.");
    }

    const { summary, items } = response.data;
    const meta = response.meta;

    if (meta && meta.current_page) {
      state.page = meta.current_page;
    }

    if (DEBUG_ORDERS) {
      console.debug("[orders] response", {
        itemsLength: items.length,
        total: meta.total,
        currentPage: meta.current_page,
        lastPage: meta.last_page
      });
    }

    renderSummaryCards(summary);
    renderQuickInsightBar(summary);
    renderStatusTabs(summary);
    renderTable(items);
    renderPagination(meta);
    renderFilterChips();

    if (DEBUG_ORDERS) {
      console.debug("[orders] rendered", {
        renderedRows: document.querySelectorAll("#orders-tbody tr[data-order-row]").length,
        tbodyHidden: document.getElementById("orders-tbody")?.classList.contains("hidden"),
        filterEmptyVisible: !document.getElementById("orders-filter-empty-state")?.classList.contains("hidden")
      });
    }

    const now = new Date();
    const lastUpdateEl = document.getElementById("last-update-time");
    if (lastUpdateEl) {
      lastUpdateEl.textContent = `${formatDateTime(now.toISOString())}`;
    }

    if (state.shouldAutoScroll) {
      requestAnimationFrame(() => {
        scrollToOrdersList();
      });
      state.shouldAutoScroll = false;
    }
  } catch (error) {
    if (requestId !== ordersRequestSequence) return;
    console.error("Lỗi khi tải đơn hàng:", error);
    showErrorState(error.message || "Không thể tải danh sách đơn hàng.");
    showToast({
      type: "error",
      title: "Không thể tải dữ liệu",
      message: "Đã xảy ra lỗi khi kết nối máy chủ đơn hàng.",
    });
  } finally {
    if (requestId === ordersRequestSequence) {
      state.isLoading = false;
      hideSkeletons();
    }
  }
}

/**
 * Chế độ Hiển thị Loading Skeletons
 */
function showSkeletons() {
  document.getElementById("orders-tbody-skeleton")?.classList.remove("hidden");
  document.getElementById("orders-tbody")?.classList.add("hidden");
  document.getElementById("orders-empty-state")?.classList.add("hidden");
  document.getElementById("orders-filter-empty-state")?.classList.add("hidden");
  document.getElementById("orders-error-state")?.classList.add("hidden");
}

/**
 * Ẩn Loading Skeletons
 */
function hideSkeletons() {
  document.getElementById("orders-tbody-skeleton")?.classList.add("hidden");
}

/**
 * Render KPI Summary Cards
 */
function renderSummaryCards(summary) {
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt("title-total-orders", summary.total_orders || 0);
  setTxt("kpi-total-orders", summary.total_orders || 0);
  setTxt("kpi-paid-orders", summary.paid_orders || 0);
  setTxt("kpi-pending-orders", summary.pending_orders || 0);
  setTxt("kpi-failed-orders", summary.failed_orders || 0);
  setTxt("kpi-cancelled-orders", summary.cancelled_orders || 0);
  setTxt("kpi-expired-orders", summary.expired_orders || 0);

  const paidRate =
    summary.total_orders > 0
      ? ((summary.paid_orders / summary.total_orders) * 100).toFixed(1)
      : "0";
  setTxt("kpi-paid-rate", `${paidRate}%`);
}

/**
 * Render Quick Insight Bar
 */
function renderQuickInsightBar(summary) {
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt("insight-paid-amount", formatVND(summary.paid_amount));
  setTxt("insight-avg-order-value", formatVND(summary.average_order_value));
  setTxt("insight-success-rate", `${summary.payment_success_rate || 0}%`);

  const uncompleted =
    (summary.failed_orders || 0) +
    (summary.cancelled_orders || 0) +
    (summary.expired_orders || 0);
  setTxt("insight-uncompleted-orders", `${uncompleted} đơn`);
  setTxt("insight-anomaly-count", `${summary.anomaly_count || 0} trường hợp`);
}

/**
 * Render Quick Filter Status Tabs
 */
function renderStatusTabs(summary) {
  const container = document.getElementById("status-tabs-container");
  if (!container) return;

  const countMap = {
    all: summary.total_orders || 0,
    paid: summary.paid_orders || 0,
    pending: summary.pending_orders || 0,
    failed: summary.failed_orders || 0,
    cancelled: summary.cancelled_orders || 0,
    expired: summary.expired_orders || 0,
  };

  Object.keys(countMap).forEach((stKey) => {
    const el = container.querySelector(`[data-count="${stKey}"]`);
    if (el) el.textContent = countMap[stKey];
  });

  const buttons = container.querySelectorAll("button[data-tab-status]");
  buttons.forEach((btn) => {
    const tabVal = btn.getAttribute("data-tab-status");
    if (tabVal === state.status) {
      btn.className =
        "py-2.5 border-b-2 border-ink text-ink font-semibold transition-all cursor-pointer";
    } else {
      btn.className =
        "py-2.5 border-b-2 border-transparent text-mid-gray hover:text-ink transition-all cursor-pointer";
    }
  });
}

/**
 * Render Bảng Danh Sách Đơn Hàng (11 Cột - Gộp Cột Giá Thanh Toán)
 */
function renderTable(items) {
  const tbody = document.getElementById("orders-tbody");
  const emptyState = document.getElementById("orders-empty-state");
  const filterEmptyState = document.getElementById("orders-filter-empty-state");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!items || items.length === 0) {
    tbody.classList.add("hidden");
    const hasFilter =
      state.status !== "all" ||
      state.payment_status !== "all" ||
      state.user_id !== "all" ||
      state.course_id !== "all" ||
      state.order_code.trim() !== "" ||
      state.search_text.trim() !== "" ||
      state.date_from !== "" ||
      state.date_to !== "";

    if (hasFilter) {
      filterEmptyState?.classList.remove("hidden");
      emptyState?.classList.add("hidden");
    } else {
      emptyState?.classList.remove("hidden");
      filterEmptyState?.classList.add("hidden");
    }
    return;
  }

  emptyState?.classList.add("hidden");
  filterEmptyState?.classList.add("hidden");
  tbody.classList.remove("hidden");

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.className =
      "border-b border-hairline hover:bg-canvas/80 transition-colors cursor-pointer group";
    tr.setAttribute("data-order-row", "");
    tr.setAttribute("data-order-id", item.id);
    tr.setAttribute("tabindex", "0");
    tr.setAttribute("aria-label", `Xem chi tiết đơn hàng ${item.order_code}`);

    const statusMeta = getOrderStatusMeta(item.status);
    const statusToneClass =
      statusMeta.tone === "success"
        ? "text-emerald-600"
        : statusMeta.tone === "warning"
          ? "text-amber-600"
          : statusMeta.tone === "danger"
            ? "text-rose-600"
            : "text-mid-gray";
    const statusDotBg =
      statusMeta.tone === "success"
        ? "bg-emerald-500"
        : statusMeta.tone === "warning"
          ? "bg-amber-500"
          : statusMeta.tone === "danger"
            ? "bg-rose-500"
            : "bg-mid-gray";

    const statusDot = `<span class="inline-flex items-center gap-1.5 whitespace-nowrap font-medium ${statusToneClass}"><span class="h-1.5 w-1.5 rounded-full ${statusDotBg} shrink-0"></span>${statusMeta.label}</span>`;

    const paymentMeta = getPaymentStatusMeta(item.payment_status);
    const paymentToneClass =
      paymentMeta.tone === "success"
        ? "text-emerald-600"
        : paymentMeta.tone === "warning"
          ? "text-amber-600"
          : paymentMeta.tone === "danger"
            ? "text-rose-600"
            : "text-mid-gray";
    const paymentDotBg =
      paymentMeta.tone === "success"
        ? "bg-emerald-500"
        : paymentMeta.tone === "warning"
          ? "bg-amber-500"
          : paymentMeta.tone === "danger"
            ? "bg-rose-500"
            : "bg-mid-gray";

    const paymentDot = `<span class="inline-flex items-center gap-1.5 whitespace-nowrap font-medium ${paymentToneClass}"><span class="h-1.5 w-1.5 rounded-full ${paymentDotBg} shrink-0"></span>${paymentMeta.label}</span>`;

    // Payment method mapping
    let methodText = "Chưa chọn";
    if (item.payment_method === "vnpay") methodText = "VNPay";
    else if (item.payment_method === "momo") methodText = "MoMo";
    else if (item.payment_method === "bank_transfer")
      methodText = "Chuyển khoản";
    else if (item.payment_method === "cash") methodText = "Tiền mặt";
    else if (item.payment_method === "free") methodText = "Miễn phí";

    // Consistency badge
    let consistencyBadge = `<span class="inline-flex items-center gap-1.5 font-medium text-emerald-600 whitespace-nowrap"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>Bình thường</span>`;
    const isValidPair = isValidOrderPaymentPair(item.status, item.payment_status);
    if (item.consistency) {
      if (
        !isValidPair ||
        !item.consistency.paid_has_enrollment ||
        !item.consistency.paid_has_revenue ||
        !item.consistency.amounts_match
      ) {
        consistencyBadge = `<span class="inline-flex items-center gap-1.5 font-semibold text-rose-600 whitespace-nowrap"><span class="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>Cần kiểm tra</span>`;
      }
    }

    // Gộp Cột Giá Thanh Toán (GIÁ THANH TOÁN)
    let priceCellHtml = "";
    const hasDiscount =
      Number(item.discount_amount) > 0 &&
      Number(item.price_snapshot) !== Number(item.amount);
    if (hasDiscount) {
      priceCellHtml = `
        <div class="space-y-0.5">
          <div class="font-bold text-ink text-sm leading-tight">${formatVND(item.amount)}</div>
          <div class="text-[11px] text-mid-gray/80 line-through">${formatVND(item.price_snapshot)}</div>
          <div class="text-[10px] text-emerald-600 font-medium">Giảm ${formatVND(item.discount_amount)}</div>
          ${item.coupon ? `<div class="text-[9px] font-mono font-semibold text-ink uppercase mt-0.5">${item.coupon.code}</div>` : ""}
        </div>
      `;
    } else {
      priceCellHtml = `
        <div class="font-bold text-ink text-sm leading-tight">${formatVND(item.amount)}</div>
      `;
    }

    tr.innerHTML = `
      <!-- 1. Mã đơn -->
      <td class="py-3.5 px-4">
        <div class="font-mono font-bold text-ink leading-tight">${item.order_code}</div>
        ${item.provider_transaction_id ? `<div class="text-[10px] text-mid-gray font-mono mt-0.5 truncate max-w-[150px]" title="Mã GD: ${item.provider_transaction_id}">${item.provider_transaction_id}</div>` : ""}
      </td>

      <!-- 2. Người mua -->
      <td class="py-3.5 px-4">
        <div class="font-medium text-ink truncate max-w-[190px]" title="${item.user ? item.user.full_name : ""}">${item.user ? item.user.full_name : "---"}</div>
        <div class="text-[10px] text-mid-gray truncate max-w-[190px]" title="${item.user ? item.user.email : ""}">${item.user ? item.user.email : "---"}</div>
      </td>

      <!-- 3. Khóa học -->
      <td class="py-3.5 px-4">
        <div class="font-medium text-ink line-clamp-1 max-w-[240px]" title="${item.course ? item.course.title : ""}">${item.course ? item.course.title : "---"}</div>
        <div class="text-[10px] text-mid-gray font-mono truncate max-w-[240px] mt-0.5">${item.course ? item.course.slug : "---"}</div>
      </td>

      <!-- 4. Giá thanh toán (Gộp Cột) -->
      <td class="py-3.5 px-4">
        ${priceCellHtml}
      </td>

      <!-- 5. Phương thức -->
      <td class="py-3.5 px-4">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-canvas border border-hairline text-ink">${methodText}</span>
      </td>

      <!-- 6. Trạng thái đơn -->
      <td class="py-3.5 px-4">
        ${statusDot}
      </td>

      <!-- 7. Trạng thái thanh toán -->
      <td class="py-3.5 px-4">
        ${paymentDot}
      </td>

      <!-- 8. Thời gian thanh toán -->
      <td class="py-3.5 px-4 text-mid-gray whitespace-nowrap">
        ${formatDateTime(item.paid_at)}
      </td>

      <!-- 9. Ngày tạo -->
      <td class="py-3.5 px-4 text-mid-gray whitespace-nowrap">
        ${formatDateTime(item.created_at)}
      </td>

      <!-- 10. Kiểm tra dữ liệu -->
      <td class="py-3.5 px-4">
        ${consistencyBadge}
      </td>

      <!-- 11. Thao tác (3 dots menu) -->
      <td class="py-3.5 px-4 text-center relative" data-no-row-click>
        <button type="button" data-menu-trigger class="p-1 rounded-md hover:bg-canvas text-mid-gray hover:text-ink transition-colors cursor-pointer" aria-label="Menu thao tác">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="6" r="1.5"/>
            <circle cx="12" cy="18" r="1.5"/>
          </svg>
        </button>
        <!-- Dropdown Menu -->
        <div data-menu-dropdown class="absolute right-4 top-full mt-1 w-48 bg-paper border border-hairline rounded-[6px] shadow-lg z-50 hidden py-1 text-left">
          <button type="button" data-action="view-detail" data-id="${item.id}" class="w-full px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2 text-ink transition-colors cursor-pointer">
            <svg class="w-3.5 h-3.5 text-mid-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Xem chi tiết</span>
          </button>
          ${
            item.user
              ? `
          <a href="users.html?open_user_id=${item.user.id}" class="w-full px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2 text-ink transition-colors cursor-pointer">
            <svg class="w-3.5 h-3.5 text-mid-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Mở người dùng</span>
          </a>`
              : ""
          }
          ${
            item.course
              ? `
          <a href="courses.html?open_course_id=${item.course.id}" class="w-full px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2 text-ink transition-colors cursor-pointer">
            <svg class="w-3.5 h-3.5 text-mid-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            </svg>
            <span>Mở khóa học</span>
          </a>`
              : ""
          }
          <button type="button" data-action="copy-code" data-code="${item.order_code}" class="w-full px-3 py-2 text-xs hover:bg-canvas flex items-center gap-2 text-ink transition-colors cursor-pointer">
            <svg class="w-3.5 h-3.5 text-mid-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            <span>Sao chép mã đơn</span>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/**
 * Render Phân Trang
 */
function renderPagination(meta) {
  const rangeEl = document.getElementById("pagination-showing-range");
  const totalEl = document.getElementById("pagination-total-count");
  const buttonsContainer = document.getElementById("pagination-buttons");

  if (!rangeEl || !totalEl || !buttonsContainer) return;

  totalEl.textContent = meta.total;
  const start =
    meta.total === 0 ? 0 : (meta.current_page - 1) * meta.per_page + 1;
  const end = Math.min(meta.current_page * meta.per_page, meta.total);
  rangeEl.textContent = `${start}–${end}`;

  buttonsContainer.innerHTML = "";

  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.disabled = meta.current_page <= 1;
  prevBtn.className = `h-8 w-8 rounded-[6px] border border-hairline flex items-center justify-center transition-colors cursor-pointer ${
    meta.current_page <= 1
      ? "opacity-40 cursor-not-allowed text-mid-gray"
      : "hover:bg-canvas text-ink"
  }`;
  prevBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>`;
  prevBtn.addEventListener("click", () => {
    if (state.page > 1) {
      state.page--;
      state.shouldAutoScroll = true;
      updateUrlParams();
      fetchAndRenderOrders();
    }
  });
  buttonsContainer.appendChild(prevBtn);

  // Page numbers
  for (let p = 1; p <= meta.last_page; p++) {
    const pBtn = document.createElement("button");
    pBtn.type = "button";
    pBtn.className = `h-8 w-8 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
      p === meta.current_page
        ? "bg-ink text-white shadow-sm"
        : "border border-hairline bg-paper text-ink hover:bg-canvas"
    }`;
    pBtn.textContent = p;
    pBtn.addEventListener("click", () => {
      if (state.page !== p) {
        state.page = p;
        state.shouldAutoScroll = true;
        updateUrlParams();
        fetchAndRenderOrders();
      }
    });
    buttonsContainer.appendChild(pBtn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.disabled = meta.current_page >= meta.last_page;
  nextBtn.className = `h-8 w-8 rounded-[6px] border border-hairline flex items-center justify-center transition-colors cursor-pointer ${
    meta.current_page >= meta.last_page
      ? "opacity-40 cursor-not-allowed text-mid-gray"
      : "hover:bg-canvas text-ink"
  }`;
  nextBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>`;
  nextBtn.addEventListener("click", () => {
    if (state.page < meta.last_page) {
      state.page++;
      state.shouldAutoScroll = true;
      updateUrlParams();
      fetchAndRenderOrders();
    }
  });
  buttonsContainer.appendChild(nextBtn);
}

/**
 * Render Filter Chips
 */
function renderFilterChips() {
  const container = document.getElementById("filter-chips-container");
  if (!container) return;

  container.innerHTML = "";
  const chips = [];

  if (state.order_code.trim()) {
    chips.push({
      key: "order_code",
      label: `Mã đơn: ${state.order_code.trim()}`,
    });
  } else if (state.search_text.trim()) {
    chips.push({
      key: "search",
      label: `Tìm kiếm: ${state.search_text.trim()}`,
    });
  }

  if (state.user_id !== "all") {
    const users = getUsers();
    const found = users.find((u) => u.id === Number(state.user_id));
    chips.push({
      key: "user_id",
      label: `Người mua: ${found ? found.full_name : state.user_id}`,
    });
  }

  if (state.course_id !== "all") {
    const courses = getCourses();
    const found = courses.find((c) => c.id === Number(state.course_id));
    chips.push({
      key: "course_id",
      label: `Khóa học: ${found ? found.title : state.course_id}`,
    });
  }

  if (state.status !== "all") {
    const statusMap = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      failed: "Thất bại",
      cancelled: "Đã hủy",
      expired: "Đã hết hạn",
    };
    chips.push({
      key: "status",
      label: `Trạng thái đơn: ${statusMap[state.status] || state.status}`,
    });
  }

  if (state.payment_status !== "all") {
    const pStatusMap = {
      unpaid: "Chưa thanh toán",
      processing: "Đang xử lý",
      paid: "Đã thanh toán",
      failed: "Thất bại",
    };
    chips.push({
      key: "payment_status",
      label: `Thanh toán: ${pStatusMap[state.payment_status] || state.payment_status}`,
    });
  }

  if (state.date_preset !== "all") {
    const presetMap = {
      custom: `Tùy chọn (${state.date_from} -> ${state.date_to})`,
      last_7_days: "7 ngày gần nhất",
      last_30_days: "30 ngày gần nhất",
      last_1_year: "1 năm gần nhất",
    };
    chips.push({
      key: "date_preset",
      label: `Thời gian: ${presetMap[state.date_preset] || state.date_preset}`,
    });
  }

  if (chips.length === 0) return;

  chips.forEach((c) => {
    const chip = document.createElement("span");
    chip.className =
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-canvas border border-hairline text-ink text-[11px] font-medium";
    chip.innerHTML = `
      <span>${c.label}</span>
      <button type="button" data-remove-chip="${c.key}" class="hover:text-rose-600 transition-colors cursor-pointer" aria-label="Xóa bộ lọc ${c.label}">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;
    chip
      .querySelector("button")
      ?.addEventListener("click", () => removeSingleFilter(c.key));
    container.appendChild(chip);
  });

  // Nút Xóa tất cả (chữ đỏ, hover nền đỏ nhạt)
  const clearAllBtn = document.createElement("button");
  clearAllBtn.type = "button";
  clearAllBtn.className =
    "text-rose-600 font-semibold hover:bg-rose-50 px-2 py-1 rounded-md transition-colors text-xs cursor-pointer bg-transparent border-none";
  clearAllBtn.textContent = "Xóa tất cả";
  clearAllBtn.addEventListener("click", resetAllFilters);
  container.appendChild(clearAllBtn);
}

/**
 * Xóa 1 Filter duy nhất
 */
function removeSingleFilter(filterKey) {
  if (filterKey === "search" || filterKey === "order_code") {
    clearSearchSelection();
  }
  if (filterKey === "status") state.status = "all";
  if (filterKey === "payment_status") state.payment_status = "all";
  if (filterKey === "user_id") {
    state.user_id = "all";
    clearSearchSelection();
  }
  if (filterKey === "course_id") {
    state.course_id = "all";
    clearSearchSelection();
  }
  if (filterKey === "date_preset") {
    state.date_preset = "all";
    state.date_from = "";
    state.date_to = "";
  }

  state.page = 1;
  state.shouldAutoScroll = true;
  syncFilterInputsUI();
  updateUrlParams();
  fetchAndRenderOrders();
}

/**
 * Đặt lại toàn bộ bộ lọc
 */
function resetAllFilters() {
  state.order_code = "";
  state.search_text = "";
  state.status = "all";
  state.payment_status = "all";
  state.user_id = "all";
  state.course_id = "all";
  state.date_preset = "all";
  state.date_from = "";
  state.date_to = "";
  state.page = 1;
  state.shouldAutoScroll = true;

  clearSearchSelection();
  syncFilterInputsUI();
  updateUrlParams();
  fetchAndRenderOrders();
}

/**
 * Xóa lựa chọn tìm kiếm chung
 */
function clearSearchSelection() {
  const searchInput = document.getElementById("filter-search");
  const btnClear = document.getElementById("btn-clear-search");

  if (searchInput) searchInput.value = "";
  if (btnClear) btnClear.classList.add("hidden");

  state.search_text = "";
  state.order_code = "";
  state.user_id = "all";
  state.course_id = "all";
}

/**
 * Đồng bộ giá trị state lên Form Filter UI
 */
function syncFilterInputsUI() {
  const searchInput = document.getElementById("filter-search");
  const btnClear = document.getElementById("btn-clear-search");

  if (searchInput) {
    if (state.user_id !== "all") {
      const users = getUsers();
      const found = users.find((u) => u.id === Number(state.user_id));
      searchInput.value = found
        ? `Người mua: ${found.full_name}`
        : state.user_id;
      btnClear?.classList.remove("hidden");
    } else if (state.course_id !== "all") {
      const courses = getCourses();
      const found = courses.find((c) => c.id === Number(state.course_id));
      searchInput.value = found ? `Khóa học: ${found.title}` : state.course_id;
      btnClear?.classList.remove("hidden");
    } else if (state.order_code.trim()) {
      searchInput.value = state.order_code;
      btnClear?.classList.remove("hidden");
    } else if (state.search_text.trim()) {
      searchInput.value = state.search_text;
      btnClear?.classList.remove("hidden");
    } else {
      searchInput.value = "";
      btnClear?.classList.add("hidden");
    }
  }

  // Custom Select Status
  setCustomSelectValue("select-status-wrapper", state.status, {
    all: "Tất cả trạng thái",
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại",
    cancelled: "Đã hủy",
    expired: "Đã hết hạn",
  });

  // Custom Select Payment Status (Giao diện hiển thị nhãn ngắn gọn "Tất cả trạng thái")
  setCustomSelectValue("select-payment-status-wrapper", state.payment_status, {
    all: "Tất cả trạng thái",
    unpaid: "Chưa thanh toán",
    processing: "Đang xử lý",
    paid: "Đã thanh toán",
    failed: "Thất bại",
  });

  // Custom Select Date Preset
  setCustomSelectValue("select-date-preset-wrapper", state.date_preset, {
    all: "Tất cả thời gian",
    custom: "Tùy chọn thời gian",
    last_7_days: "7 ngày gần nhất",
    last_30_days: "30 ngày gần nhất",
    last_1_year: "1 năm gần nhất",
  });

  const customDateContainer = document.getElementById("custom-date-container");
  if (customDateContainer) {
    if (state.date_preset === "custom") {
      customDateContainer.classList.remove("hidden");
    } else {
      customDateContainer.classList.add("hidden");
    }
  }

  const fromInput = document.getElementById("filter-date-from");
  const toInput = document.getElementById("filter-date-to");
  if (fromInput) fromInput.value = state.date_from;
  if (toInput) toInput.value = state.date_to;
}

/**
 * Helper đặt nhãn hiển thị cho Custom Select
 */
function setCustomSelectValue(wrapperId, value, labelMap) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const labelEl = wrapper.querySelector("[data-select-label]");
  if (labelEl) {
    labelEl.textContent = labelMap[value] || "Tất cả trạng thái";
  }
}

/**
 * Hiển thị Error State
 */
function showErrorState(msg) {
  document.getElementById("orders-tbody")?.classList.add("hidden");
  document.getElementById("orders-empty-state")?.classList.add("hidden");
  document.getElementById("orders-filter-empty-state")?.classList.add("hidden");

  const errWrapper = document.getElementById("orders-error-state");
  const errMessage = document.getElementById("orders-error-message");
  if (errWrapper && errMessage) {
    errMessage.textContent = msg;
    errWrapper.classList.remove("hidden");
  }
}

/**
 * Khởi tạo Component Tìm Kiếm Tổng Hợp (Unified Search)
 */
function initUnifiedSearch() {
  const wrapper = document.getElementById("unified-search-wrapper");
  const input = document.getElementById("filter-search");
  const dropdown = document.getElementById("search-suggestions-dropdown");
  const btnClear = document.getElementById("btn-clear-search");

  if (!wrapper || !input || !dropdown) return;

  const users = getUsers();
  const courses = getCourses();

  function renderSuggestions(keyword = "") {
    const kw = keyword.toLowerCase().trim();
    dropdown.innerHTML = "";

    if (!kw) {
      dropdown.classList.add("hidden");
      return;
    }

    let hasResults = false;

    // 1. Phân loại Gợi ý Đơn hàng (Matching order code)
    const matchingOrders =
      users.length > 0
        ? [
            { code: "ORD-2026-0001" },
            { code: "ORD-2026-0002" },
            { code: "ORD-2026-0003" },
            { code: "ORD-2026-0010" },
          ].filter((o) => o.code.toLowerCase().includes(kw))
        : [];

    if (matchingOrders.length > 0) {
      hasResults = true;
      const grpHeader = document.createElement("div");
      grpHeader.className =
        "px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-mid-gray bg-surface-alt border-y border-hairline/60";
      grpHeader.textContent = "ĐƠN HÀNG";
      dropdown.appendChild(grpHeader);

      matchingOrders.forEach((o) => {
        const item = document.createElement("div");
        item.className =
          "px-3 py-2 hover:bg-canvas cursor-pointer flex items-center justify-between transition-colors";
        item.innerHTML = `<span class="font-mono font-bold text-ink">${o.code}</span><span class="text-[10px] text-mid-gray">Mã đơn hàng</span>`;
        item.addEventListener("click", () => {
          selectSuggestion("order", o.code, o.code);
        });
        dropdown.appendChild(item);
      });
    }

    // 2. Phân loại Gợi ý Người mua (Learner / Instructor)
    const matchingUsers = users
      .filter(
        (u) =>
          u.full_name.toLowerCase().includes(kw) ||
          u.email.toLowerCase().includes(kw),
      )
      .slice(0, 4);
    if (matchingUsers.length > 0) {
      hasResults = true;
      const grpHeader = document.createElement("div");
      grpHeader.className =
        "px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-mid-gray bg-surface-alt border-y border-hairline/60";
      grpHeader.textContent = "NGƯỜI MUA";
      dropdown.appendChild(grpHeader);

      matchingUsers.forEach((u) => {
        const item = document.createElement("div");
        item.className =
          "px-3 py-2 hover:bg-canvas cursor-pointer flex items-center justify-between transition-colors";
        item.innerHTML = `<span class="font-medium text-ink truncate max-w-[170px]">${u.full_name}</span><span class="text-[10px] text-mid-gray truncate max-w-[130px]">${u.email}</span>`;
        item.addEventListener("click", () => {
          selectSuggestion("user", u.id, u.full_name);
        });
        dropdown.appendChild(item);
      });
    }

    // 3. Phân loại Gợi ý Khóa học
    const matchingCourses = courses
      .filter(
        (c) =>
          c.title.toLowerCase().includes(kw) ||
          (c.slug && c.slug.toLowerCase().includes(kw)),
      )
      .slice(0, 4);
    if (matchingCourses.length > 0) {
      hasResults = true;
      const grpHeader = document.createElement("div");
      grpHeader.className =
        "px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-mid-gray bg-surface-alt border-y border-hairline/60";
      grpHeader.textContent = "KHÓA HỌC";
      dropdown.appendChild(grpHeader);

      matchingCourses.forEach((c) => {
        const item = document.createElement("div");
        item.className =
          "px-3 py-2 hover:bg-canvas cursor-pointer flex items-center justify-between transition-colors";
        item.innerHTML = `<span class="font-medium text-ink truncate max-w-[200px]" title="${c.title}">${c.title}</span><span class="text-[10px] text-mid-gray font-mono">ID:${c.id}</span>`;
        item.addEventListener("click", () => {
          selectSuggestion("course", c.id, c.title);
        });
        dropdown.appendChild(item);
      });
    }

    if (hasResults) {
      dropdown.classList.remove("hidden");
    } else {
      dropdown.classList.add("hidden");
    }
  }

  function selectSuggestion(type, value, displayLabel) {
    clearSearchSelection();

    if (type === "order") {
      state.order_code = String(value);
      input.value = String(value);
    } else if (type === "user") {
      state.user_id = String(value);
      input.value = `Người mua: ${displayLabel}`;
    } else if (type === "course") {
      state.course_id = String(value);
      input.value = `Khóa học: ${displayLabel}`;
    }

    btnClear?.classList.remove("hidden");
    dropdown.classList.add("hidden");

    state.page = 1;
    state.shouldAutoScroll = true;
    updateUrlParams();
    fetchAndRenderOrders();
  }

  let searchTimer = null;
  input.addEventListener("input", (e) => {
    const val = e.target.value;
    state.search_text = val;

    // Nếu vừa tự gõ tay (không chọn suggestion), reset các ID chọn trước đó
    state.order_code = "";
    state.user_id = "all";
    state.course_id = "all";

    if (val.trim()) {
      btnClear?.classList.remove("hidden");
    } else {
      btnClear?.classList.add("hidden");
    }

    renderSuggestions(val);

    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.page = 1;
      state.shouldAutoScroll = true;
      updateUrlParams();
      fetchAndRenderOrders();
    }, 400);
  });

  btnClear?.addEventListener("click", (e) => {
    e.stopPropagation();
    clearSearchSelection();
    state.page = 1;
    state.shouldAutoScroll = true;
    updateUrlParams();
    fetchAndRenderOrders();
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}

/**
 * Khởi tạo Custom Selects (Status, Payment Status, Date Preset)
 */
function initCustomSelects() {
  const wrappers = document.querySelectorAll(".custom-select-wrapper");

  wrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector("[data-select-trigger]");
    const dropdown = wrapper.querySelector("[data-select-dropdown]");

    if (!trigger || !dropdown) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      wrappers.forEach((w) => {
        if (w !== wrapper)
          w.querySelector("[data-select-dropdown]")?.classList.add("hidden");
      });
      dropdown.classList.toggle("hidden");
    });

    dropdown.addEventListener("click", (e) => {
      const option = e.target.closest("[data-option]");
      if (!option) return;

      const value = option.getAttribute("data-value");
      const label = option.textContent.trim();

      const labelEl = wrapper.querySelector("[data-select-label]");
      if (labelEl) labelEl.textContent = label;

      dropdown.classList.add("hidden");

      if (wrapper.id === "select-status-wrapper") {
        state.status = value;
      } else if (wrapper.id === "select-payment-status-wrapper") {
        state.payment_status = value;
      } else if (wrapper.id === "select-date-preset-wrapper") {
        applyDatePreset(value);
        const customContainer = document.getElementById(
          "custom-date-container",
        );
        if (customContainer) {
          if (value === "custom") {
            customContainer.classList.remove("hidden");
          } else {
            customContainer.classList.add("hidden");
          }
        }
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select-wrapper")) {
      wrappers.forEach((w) =>
        w.querySelector("[data-select-dropdown]")?.classList.add("hidden"),
      );
    }
  });
}

/**
 * Khởi tạo Sự Kiện Lọc Khi Bấm Vào Các Card KPI Tổng Quan
 */
function initSummaryCardEvents() {
  const cards = document.querySelectorAll("[data-kpi-card]");

  cards.forEach((card) => {
    const filterStatus = card.getAttribute("data-kpi-card");

    const triggerCardFilter = () => {
      state.status = filterStatus;
      state.page = 1;
      state.shouldAutoScroll = true;

      syncFilterInputsUI();
      updateUrlParams();
      fetchAndRenderOrders();
    };

    card.addEventListener("click", triggerCardFilter);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerCardFilter();
      }
    });
  });
}

/**
 * Khởi tạo Right Drawer & Event Listeners
 */
function initDrawer() {
  const drawer = document.getElementById("order-detail-drawer");
  const panel = document.getElementById("drawer-panel");
  const backdrop = document.getElementById("drawer-backdrop");

  if (!drawer || !panel || !backdrop) return;

  function closeDrawer() {
    panel.classList.add("translate-x-full");
    backdrop.classList.add("opacity-0");

    setTimeout(() => {
      drawer.classList.add("hidden");
      state.open_order_id = null;
      updateUrlParams();
    }, 300);
  }

  drawer.querySelectorAll("[data-drawer-close]").forEach((btn) => {
    btn.addEventListener("click", closeDrawer);
  });

  const drawerTabs = document.querySelectorAll("[data-drawer-tab]");
  drawerTabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      const targetTab = tabBtn.getAttribute("data-drawer-tab");

      drawerTabs.forEach((btn) => {
        if (btn === tabBtn) {
          btn.className =
            "py-2.5 border-b-2 border-ink text-ink font-semibold transition-all cursor-pointer";
        } else {
          btn.className =
            "py-2.5 border-b-2 border-transparent text-mid-gray hover:text-ink transition-all cursor-pointer";
        }
      });

      document
        .querySelectorAll("[data-drawer-tab-content]")
        .forEach((contentEl) => {
          if (contentEl.getAttribute("data-drawer-tab-content") === targetTab) {
            contentEl.classList.remove("hidden");
          } else {
            contentEl.classList.add("hidden");
          }
        });
    });
  });
}

/**
 * Mở Right Drawer xem chi tiết Đơn hàng
 */
async function openOrderDrawer(orderId) {
  const drawer = document.getElementById("order-detail-drawer");
  const panel = document.getElementById("drawer-panel");
  const backdrop = document.getElementById("drawer-backdrop");
  const body = document.getElementById("drawer-content-body");

  if (!drawer || !panel || !backdrop || !body) return;

  state.open_order_id = String(orderId);
  updateUrlParams();

  drawer.classList.remove("hidden");
  setTimeout(() => {
    backdrop.classList.remove("opacity-0");
    panel.classList.remove("translate-x-full");
  }, 10);

  document.getElementById("drawer-order-code").textContent = "Đang tải...";
  document.getElementById("drawer-subtitle").textContent =
    "Đang truy vấn dữ liệu chi tiết...";
  body.innerHTML = `
    <div class="p-8 text-center space-y-3 animate-pulse">
      <div class="h-4 bg-hairline/60 rounded w-1/3 mx-auto"></div>
      <div class="h-3 bg-hairline/40 rounded w-1/2 mx-auto"></div>
      <div class="h-20 bg-hairline/30 rounded w-full mt-4"></div>
    </div>
  `;

  try {
    const response = await getOrder(orderId);
    const order = response.data;

    renderDrawerContent(order);
  } catch (error) {
    console.error("Lỗi mở chi tiết đơn hàng:", error);
    showToast({
      type: "error",
      title: "Không tìm thấy đơn hàng",
      message: "Đơn hàng không tồn tại hoặc đã bị xóa.",
    });
    panel.classList.add("translate-x-full");
    backdrop.classList.add("opacity-0");
    setTimeout(() => {
      drawer.classList.add("hidden");
      state.open_order_id = null;
      updateUrlParams();
    }, 300);
  }
}

/**
 * Render nội dung các tab inside Drawer
 */
function renderDrawerContent(order) {
  document.getElementById("drawer-order-code").textContent = order.order_code;
  document.getElementById("drawer-subtitle").textContent =
    `ID: ${order.id} • Khởi tạo lúc ${formatDateTime(order.created_at)}`;

  const body = document.getElementById("drawer-content-body");

  const statusMeta = getOrderStatusMeta(order.status);
  const paymentMeta = getPaymentStatusMeta(order.payment_status);
  const isCanonicalPaidOrder = order.status === "paid" && order.payment_status === "paid";
  const isValidPair = isValidOrderPaymentPair(order.status, order.payment_status);

  // Tab 1: Tổng quan
  const overviewHtml = `
    <div data-drawer-tab-content="overview" class="space-y-4">
      <!-- 1. Trạng thái tổng quan -->
      <div class="rounded-[6px] border border-hairline bg-surface-alt p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span class="text-[10px] uppercase font-bold text-mid-gray block mb-1">Mã đơn hàng</span>
          <span class="font-mono font-bold text-ink text-sm">${order.order_code}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-mid-gray block mb-1">Trạng thái đơn</span>
          <span class="font-semibold text-ink">● ${statusMeta.label}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-mid-gray block mb-1">Thanh toán</span>
          <span class="font-semibold text-ink">● ${paymentMeta.label}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-mid-gray block mb-1">Ngày tạo</span>
          <span class="text-ink">${formatDateTime(order.created_at)}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-mid-gray block mb-1">Thời gian thanh toán</span>
          <span class="text-ink">${formatDateTime(order.paid_at)}</span>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold text-mid-gray block mb-1">Cập nhật cuối</span>
          <span class="text-ink">${formatDateTime(order.updated_at)}</span>
        </div>
      </div>

      <!-- 2. Người mua (Learner) -->
      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-2">
        <div class="flex items-center justify-between border-b border-hairline pb-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-mid-gray flex items-center gap-1.5">
            <svg class="w-4 h-4 text-ink" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Thông tin người mua
          </h3>
          ${order.user ? `<a href="users.html?open_user_id=${order.user.id}" class="text-xs font-semibold text-ink hover:underline flex items-center gap-1">Mở người dùng &rarr;</a>` : ""}
        </div>
        ${
          order.user
            ? `
        <div class="grid grid-cols-2 gap-3 text-xs pt-1">
          <div><span class="text-mid-gray">Họ và tên:</span> <span class="font-semibold text-ink">${order.user.full_name}</span></div>
          <div><span class="text-mid-gray">Email:</span> <span class="font-mono text-ink">${order.user.email}</span></div>
          <div><span class="text-mid-gray">Vai trò:</span> <span class="capitalize text-ink">${order.user.role}</span></div>
          <div><span class="text-mid-gray">Trạng thái tài khoản:</span> <span class="capitalize font-semibold text-emerald-600">● ${order.user.status}</span></div>
        </div>
        `
            : '<p class="text-xs text-mid-gray">Không có dữ liệu người mua</p>'
        }
      </div>

      <!-- 3. Khóa học (Course - Truyền chuẩn open_course_id={order.course.id}) -->
      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-2">
        <div class="flex items-center justify-between border-b border-hairline pb-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-mid-gray flex items-center gap-1.5">
            <svg class="w-4 h-4 text-ink" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
            Khóa học mua
          </h3>
          ${order.course ? `<a href="courses.html?open_course_id=${order.course.id}" class="text-xs font-semibold text-ink hover:underline flex items-center gap-1">Mở khóa học &rarr;</a>` : ""}
        </div>
        ${
          order.course
            ? `
        <div class="space-y-1.5 text-xs pt-1">
          <div class="font-bold text-ink text-sm">${order.course.title}</div>
          <div class="text-mid-gray font-mono text-[11px]">${order.course.slug}</div>
          <div class="flex items-center gap-4 text-xs pt-1">
            <span>Giá niêm yết: <strong class="text-ink">${formatVND(order.course.price)}</strong></span>
            ${order.course.sale_price ? `<span>Giá khuyến mãi: <strong class="text-emerald-600">${formatVND(order.course.sale_price)}</strong></span>` : ""}
            <span>Trạng thái: <strong class="capitalize text-emerald-600">● ${order.course.status}</strong></span>
          </div>
        </div>
        `
            : '<p class="text-xs text-mid-gray">Không có dữ liệu khóa học</p>'
        }
      </div>
    </div>
  `;

  // Tab 2: Thanh toán
  const paymentHtml = `
    <div data-drawer-tab-content="payment" class="space-y-4 hidden">
      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-mid-gray border-b border-hairline pb-2">Hóa đơn & Dòng tiền</h3>
        
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between py-1 border-b border-hairline/60">
            <span class="text-mid-gray">Giá snapshot khóa học:</span>
            <span class="font-semibold text-ink">${formatVND(order.price_snapshot)}</span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-hairline/60">
            <span class="text-mid-gray">Số tiền giảm giá:</span>
            <span class="font-semibold text-rose-600">-${formatVND(order.discount_amount)}</span>
          </div>
          <div class="flex items-center justify-between py-1.5 text-sm">
            <span class="font-bold text-ink">Thực trả (Amount):</span>
            <span class="font-bold text-ink text-base">${formatVND(order.amount)}</span>
          </div>
        </div>
      </div>

      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-mid-gray border-b border-hairline pb-2">Thông tin cổng thanh toán</h3>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-mid-gray block">Phương thức thanh toán:</span>
            <span class="font-semibold text-ink capitalize">${order.payment_method === "vnpay" ? "VNPay" : order.payment_method === "momo" ? "MoMo" : order.payment_method === "bank_transfer" ? "Chuyển khoản ngân hàng" : "Miễn phí"}</span>
          </div>
          <div>
            <span class="text-mid-gray block">Mã giao dịch Provider:</span>
            <span class="font-mono font-semibold text-ink">${order.provider_transaction_id || "Chưa phát sinh"}</span>
          </div>
          <div>
            <span class="text-mid-gray block">Thời gian xác nhận:</span>
            <span class="text-ink">${formatDateTime(order.paid_at)}</span>
          </div>
        </div>
      </div>

      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-mid-gray border-b border-hairline pb-2">Mã giảm giá (Coupon)</h3>
        ${
          order.coupon
            ? `
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div><span class="text-mid-gray">Mã Coupon:</span> <span class="font-mono font-bold text-ink uppercase">${order.coupon.code}</span></div>
          <div><span class="text-mid-gray">Tên chương trình:</span> <span class="font-medium text-ink">${order.coupon.name}</span></div>
          <div><span class="text-mid-gray">Loại giảm:</span> <span class="capitalize text-ink">${order.coupon.discount_type === "percentage" ? "Phần trăm (%)" : "Cố định (VND)"}</span></div>
          <div><span class="text-mid-gray">Mức giảm:</span> <span class="font-bold text-emerald-600">${order.coupon.discount_type === "percentage" ? order.coupon.discount_value + "%" : formatVND(order.coupon.discount_value)}</span></div>
        </div>
        `
            : '<p class="text-xs text-mid-gray">Không sử dụng mã giảm giá.</p>'
        }
      </div>
    </div>
  `;

  // Tab 3: Đối chiếu dữ liệu (Consistency)
  const consistencyHtml = `
    <div data-drawer-tab-content="consistency" class="space-y-4 hidden">
      ${
        !isCanonicalPaidOrder
          ? `
      <div class="p-4 rounded-[6px] border ${!isValidPair ? "border-rose-300 bg-rose-50 text-rose-800" : "border-amber-200 bg-amber-50 text-amber-800"} text-xs font-medium space-y-1">
        <div>● Đơn chưa hoàn tất thanh toán chuẩn (Status = ${order.status}, Payment Status = ${order.payment_status}).</div>
        ${!isValidPair ? `<div class="font-semibold text-rose-700">Cảnh báo: Cặp trạng thái không thuộc tập chuẩn cho phép (${statusMeta.label} + ${paymentMeta.label}). Cần kiểm tra đối soát!</div>` : ""}
      </div>
      `
          : ""
      }

      <!-- Enrollment Check Card -->
      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-2 text-xs">
        <div class="flex items-center justify-between border-b border-hairline pb-2">
          <h4 class="font-bold text-ink uppercase tracking-wider text-[11px]">1. Kiểm tra Ghi danh học tập (Enrollment)</h4>
          <span class="font-semibold ${order.consistency.paid_has_enrollment ? "text-emerald-600" : "text-rose-600"}">
            ● ${order.consistency.paid_has_enrollment ? "Có enrollment tương ứng" : "Thiếu enrollment"}
          </span>
        </div>
        ${
          order.enrollment
            ? `
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div><span class="text-mid-gray">Enrollment ID:</span> <span class="font-mono text-ink">#${order.enrollment.id}</span></div>
          <div><span class="text-mid-gray">Trạng thái:</span> <span class="capitalize font-semibold text-emerald-600">● ${order.enrollment.status}</span></div>
          <div><span class="text-mid-gray">Tiến độ học tập:</span> <span class="font-bold text-ink">${order.enrollment.progress_percent}%</span></div>
          <div><span class="text-mid-gray">Thời gian tạo:</span> <span class="text-ink">${formatDateTime(order.enrollment.enrolled_at)}</span></div>
        </div>
        `
            : `<p class="text-mid-gray pt-1">${isCanonicalPaidOrder ? "Cảnh báo: Đơn đã thanh toán nhưng chưa tìm thấy dữ liệu Enrollment trong hệ thống!" : "Đơn chưa phát sinh ghi danh."}</p>`
        }
      </div>

      <!-- Revenue Check Card -->
      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-2 text-xs">
        <div class="flex items-center justify-between border-b border-hairline pb-2">
          <h4 class="font-bold text-ink uppercase tracking-wider text-[11px]">2. Kiểm tra Phân bổ doanh thu (Revenue Split)</h4>
          <span class="font-semibold ${order.consistency.paid_has_revenue ? "text-emerald-600" : "text-rose-600"}">
            ● ${order.consistency.paid_has_revenue ? "Có revenue tương ứng" : "Thiếu revenue"}
          </span>
        </div>
        ${
          order.revenue
            ? `
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div><span class="text-mid-gray">Revenue ID:</span> <span class="font-mono text-ink">#${order.revenue.id}</span></div>
          <div><span class="text-mid-gray">Gross Amount:</span> <span class="font-bold text-ink">${formatVND(order.revenue.gross_amount)}</span></div>
          <div><span class="text-mid-gray">Thu nhập Giảng viên (70%):</span> <span class="font-semibold text-emerald-600">${formatVND(order.revenue.instructor_amount)}</span></div>
          <div><span class="text-mid-gray">Phí nền tảng MindHub (30%):</span> <span class="font-semibold text-ink">${formatVND(order.revenue.platform_fee_amount)}</span></div>
        </div>
        `
            : `<p class="text-mid-gray pt-1">${isCanonicalPaidOrder ? "Cảnh báo: Đơn đã thanh toán nhưng chưa được ghi nhận doanh thu!" : "Đơn chưa phát sinh doanh thu."}</p>`
        }
      </div>

      <!-- Amount Match Check Card -->
      <div class="rounded-[6px] border border-hairline bg-paper p-4 space-y-2 text-xs">
        <div class="flex items-center justify-between border-b border-hairline pb-2">
          <h4 class="font-bold text-ink uppercase tracking-wider text-[11px]">3. Đối chiếu số tiền giao dịch</h4>
          <span class="font-semibold ${order.consistency.amounts_match ? "text-emerald-600" : "text-rose-600"}">
            ● ${order.consistency.amounts_match ? "Số tiền order và revenue khớp" : "Số tiền không khớp"}
          </span>
        </div>
        <p class="text-mid-gray pt-1">
          ${order.consistency.amounts_match ? "Giá trị thanh toán thực tế của đơn hàng trùng khớp 100% với doanh thu đối soát." : "Phát hiện sự sai lệch giữa số tiền thực trả trên hóa đơn và tổng doanh thu ghi nhận!"}
        </p>
      </div>
    </div>
  `;

  // Tab 4: Timeline
  let timelineItemsHtml = "";
  if (order.timeline && order.timeline.length > 0) {
    timelineItemsHtml = order.timeline
      .map(
        (item) => `
      <div class="flex gap-3 text-xs relative pb-4 last:pb-0">
        <div class="flex flex-col items-center">
          <div class="h-3 w-3 rounded-full border-2 ${
            item.status === "success"
              ? "bg-emerald-500 border-emerald-200"
              : item.status === "warning"
                ? "bg-amber-500 border-amber-200"
                : item.status === "error"
                  ? "bg-rose-500 border-rose-200"
                  : "bg-ink border-hairline"
          }"></div>
          <div class="w-0.5 bg-hairline flex-1 mt-1"></div>
        </div>
        <div class="space-y-0.5 pt-0.5">
          <div class="font-bold text-ink">${item.title}</div>
          <div class="text-mid-gray text-[11px]">${item.description}</div>
          <div class="text-[10px] text-mid-gray/80 font-mono mt-1">${formatDateTime(item.timestamp)}</div>
        </div>
      </div>
    `,
      )
      .join("");
  } else {
    timelineItemsHtml = `<p class="text-xs text-mid-gray">Chưa có thông tin tiến trình timeline.</p>`;
  }

  const timelineHtml = `
    <div data-drawer-tab-content="timeline" class="space-y-4 hidden">
      <div class="rounded-[6px] border border-hairline bg-paper p-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-mid-gray border-b border-hairline pb-3 mb-4">Lịch sử sự kiện đơn hàng</h3>
        <div class="space-y-1">
          ${timelineItemsHtml}
        </div>
      </div>
    </div>
  `;

  body.innerHTML = overviewHtml + paymentHtml + consistencyHtml + timelineHtml;
}

/**
 * Đăng ký Event Listeners khởi tạo trang
 */
function initEventListeners() {
  const filterForm = document.getElementById("order-filter-form");
  const applyBtn = document.getElementById("btn-apply-filters");
  const resetBtn = document.getElementById("btn-reset-filters");
  const resetEmptyBtn = document.getElementById("btn-reset-filters-empty");
  const retryBtn = document.getElementById("btn-retry-orders");
  const refreshBtn = document.getElementById("btn-refresh-data");

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateCustomDates()) return;

    state.page = 1;
    state.shouldAutoScroll = true;
    updateUrlParams();
    fetchAndRenderOrders();
  };

  filterForm?.addEventListener("submit", handleSubmit);
  applyBtn?.addEventListener("click", handleSubmit);
  resetBtn?.addEventListener("click", resetAllFilters);
  resetEmptyBtn?.addEventListener("click", resetAllFilters);
  retryBtn?.addEventListener("click", fetchAndRenderOrders);

  // Date inputs change handlers
  const fromInput = document.getElementById("filter-date-from");
  const toInput = document.getElementById("filter-date-to");
  fromInput?.addEventListener("change", (e) => {
    state.date_from = e.target.value;
  });
  toInput?.addEventListener("change", (e) => {
    state.date_to = e.target.value;
  });

  // Status quick tabs click (Lọc status chuẩn)
  const statusTabsContainer = document.getElementById("status-tabs-container");
  statusTabsContainer?.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("button[data-tab-status]");
    if (!tabBtn) return;

    const newStatus = tabBtn.getAttribute("data-tab-status");
    if (newStatus !== state.status) {
      state.status = newStatus;
      state.page = 1;
      state.shouldAutoScroll = true;

      syncFilterInputsUI();
      updateUrlParams();
      fetchAndRenderOrders();
    }
  });

  // Per page select change
  const perPageSelect = document.getElementById("per-page-select");
  perPageSelect?.addEventListener("change", (e) => {
    state.per_page = Number(e.target.value);
    state.page = 1;
    state.shouldAutoScroll = true;
    updateUrlParams();
    fetchAndRenderOrders();
  });

  // Refresh data button (Không reload browser, không tự cuộn, giữ filter)
  refreshBtn?.addEventListener("click", () => {
    const icon = document.getElementById("refresh-icon");
    if (icon) icon.classList.add("rotate-180");
    state.shouldAutoScroll = false;
    fetchAndRenderOrders().then(() => {
      setTimeout(() => icon?.classList.remove("rotate-180"), 500);
      showToast({
        type: "success",
        title: "Đã làm mới",
        message: "Dữ liệu đơn hàng vừa được cập nhật.",
      });
    });
  });

  // Event Delegation trên Table Body: Row Click & Action Menu
  const tbody = document.getElementById("orders-tbody");
  tbody?.addEventListener("click", (e) => {
    // 1. Menu 3 chấm toggle
    const menuTrigger = e.target.closest("[data-menu-trigger]");
    if (menuTrigger) {
      e.stopPropagation();
      const parentTd = menuTrigger.closest("td");
      const dropdown = parentTd?.querySelector("[data-menu-dropdown]");
      dropdown?.classList.toggle("hidden");
      return;
    }

    // 2. Menu Actions
    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      e.stopPropagation();
      const actionType = actionBtn.getAttribute("data-action");
      actionBtn.closest("[data-menu-dropdown]")?.classList.add("hidden");

      if (actionType === "view-detail") {
        const orderId = actionBtn.getAttribute("data-id");
        openOrderDrawer(orderId);
      } else if (actionType === "copy-code") {
        const code = actionBtn.getAttribute("data-code");
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            showToast({
              type: "success",
              title: "Đã sao chép",
              message: `Đã chép mã đơn ${code} vào bộ nhớ tạm.`,
            });
          });
        }
      }
      return;
    }

    // 3. Đang chọn bôi đen text -> bỏ qua
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    // 4. Bỏ qua các phần tử no-row-click / links
    if (
      e.target.closest("[data-no-row-click]") ||
      e.target.closest("a") ||
      e.target.closest("button")
    ) {
      return;
    }

    // 5. Bấm vào toàn bộ dòng -> Mở Drawer
    const row = e.target.closest("[data-order-row]");
    if (row) {
      const orderId = row.getAttribute("data-order-id");
      if (orderId) {
        openOrderDrawer(orderId);
      }
    }
  });

  // Hỗ trợ Enter/Space khi focus row bàn phím
  tbody?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const row = e.target.closest("[data-order-row]");
      if (row && e.target === row) {
        e.preventDefault();
        const orderId = row.getAttribute("data-order-id");
        if (orderId) openOrderDrawer(orderId);
      }
    }
  });
}

/**
 * Hàm khởi tạo trang khi DOM sẵn sàng
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeLayout();
  parseUrlParams();
  initUnifiedSearch();
  initCustomSelects();
  initSummaryCardEvents();
  syncFilterInputsUI();
  initDrawer();
  initEventListeners();

  // Load dữ liệu lần đầu
  fetchAndRenderOrders().then(() => {
    // Nếu URL có deep link open_order_id
    if (state.open_order_id) {
      openOrderDrawer(state.open_order_id);
    }
  });
});
