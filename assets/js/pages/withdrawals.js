/**
 * MindHub Admin - Yêu cầu rút tiền Page Logic
 */

import {
  fetchWithdrawals,
  fetchWithdrawalById,
  approveWithdrawalApi,
  rejectWithdrawalApi,
  markPaidWithdrawalApi,
} from "../api/withdrawals-api.js";
import { showToast } from "../toast.js";

// Mapping trạng thái sang nhãn và màu chấm tròn
const withdrawalStatusMap = {
  pending: {
    label: "Chờ duyệt",
    colorClass: "text-amber-700 font-semibold",
    dotClass: "bg-amber-500",
  },
  approved: {
    label: "Đã duyệt",
    colorClass: "text-blue-700 font-semibold",
    dotClass: "bg-blue-500",
  },
  rejected: {
    label: "Đã từ chối",
    colorClass: "text-rose-700 font-semibold",
    dotClass: "bg-rose-500",
  },
  paid: {
    label: "Đã thanh toán",
    colorClass: "text-emerald-700 font-semibold",
    dotClass: "bg-emerald-500",
  },
};

// Quản lý state toàn bộ trang
const pageState = {
  page: 1,
  per_page: 20,
  search: "",
  status: "all",
  time_preset: "all",
  date_from: "",
  date_to: "",
  amount_min: "",
  amount_max: "",
  open_withdrawal_id: null,
  activeItemForModal: null,
};

/**
 * Format số tiền VND hiển thị
 */
function formatVND(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

/**
 * Format ngày giờ Việt Nam
 */
function formatDateVN(dateStr) {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "---";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Lấy chữ cái viết tắt đại diện avatar
 */
function getInitials(name) {
  if (!name) return "GV";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Đồng bộ state từ Query String URL
 */
function syncStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  pageState.page = Math.max(1, Number(params.get("page")) || 1);
  pageState.per_page = Math.max(1, Number(params.get("per_page")) || 20);
  pageState.search = params.get("search") || "";
  pageState.status = params.get("status") || "all";
  pageState.time_preset = params.get("time_preset") || "all";
  pageState.date_from = params.get("date_from") || "";
  pageState.date_to = params.get("date_to") || "";
  pageState.amount_min = params.get("amount_min") || "";
  pageState.amount_max = params.get("amount_max") || "";
  pageState.open_withdrawal_id = params.get("open_withdrawal_id") || null;

  // Đồng bộ UI ô input/select
  const searchInput = document.getElementById("filter-search");
  const clearSearchBtn = document.getElementById("btn-clear-search");
  if (searchInput) {
    searchInput.value = pageState.search;
    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle("hidden", !pageState.search);
    }
  }

  const statusSelect = document.getElementById("filter-status");
  if (statusSelect) statusSelect.value = pageState.status;

  const timePresetSelect = document.getElementById("filter-time-preset");
  if (timePresetSelect) timePresetSelect.value = pageState.time_preset;

  const customDateGroup = document.getElementById("custom-date-group");
  if (customDateGroup) {
    if (pageState.time_preset === "custom") {
      customDateGroup.classList.remove("hidden");
      customDateGroup.classList.add("flex");
    } else {
      customDateGroup.classList.add("hidden");
      customDateGroup.classList.remove("flex");
    }
  }

  const dateFromInput = document.getElementById("filter-date-from");
  if (dateFromInput) dateFromInput.value = pageState.date_from;

  const dateToInput = document.getElementById("filter-date-to");
  if (dateToInput) dateToInput.value = pageState.date_to;

  const amountMinInput = document.getElementById("filter-amount-min");
  if (amountMinInput) amountMinInput.value = pageState.amount_min;

  const amountMaxInput = document.getElementById("filter-amount-max");
  if (amountMaxInput) amountMaxInput.value = pageState.amount_max;

  const perPageSelect = document.getElementById("pag-per-page");
  if (perPageSelect) perPageSelect.value = String(pageState.per_page);

  if (typeof window.initAllCustomSelects === "function") {
    window.initAllCustomSelects();
  }
}

/**
 * Cập nhật URL state không nạp lại trang
 */
function updateUrlState() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (pageState.page > 1) params.set("page", pageState.page);
  else params.delete("page");

  if (pageState.per_page !== 20) params.set("per_page", pageState.per_page);
  else params.delete("per_page");

  if (pageState.search) params.set("search", pageState.search);
  else params.delete("search");

  if (pageState.status !== "all") params.set("status", pageState.status);
  else params.delete("status");

  if (pageState.time_preset !== "all") params.set("time_preset", pageState.time_preset);
  else params.delete("time_preset");

  if (pageState.time_preset === "custom") {
    if (pageState.date_from) params.set("date_from", pageState.date_from);
    else params.delete("date_from");

    if (pageState.date_to) params.set("date_to", pageState.date_to);
    else params.delete("date_to");
  } else {
    params.delete("date_from");
    params.delete("date_to");
  }

  if (pageState.amount_min) params.set("amount_min", pageState.amount_min);
  else params.delete("amount_min");

  if (pageState.amount_max) params.set("amount_max", pageState.amount_max);
  else params.delete("amount_max");

  if (pageState.open_withdrawal_id) params.set("open_withdrawal_id", pageState.open_withdrawal_id);
  else params.delete("open_withdrawal_id");

  window.history.replaceState({}, "", url.toString());
}

/**
 * Tải danh sách yêu cầu rút tiền
 */
async function loadWithdrawals(options = {}) {
  const tbody = document.getElementById("withdrawals-tbody");
  const skeleton = document.getElementById("withdrawals-tbody-skeleton");
  const emptyState = document.getElementById("withdrawals-empty-state");
  const filterEmptyState = document.getElementById("withdrawals-filter-empty-state");
  const errorState = document.getElementById("withdrawals-error-state");
  const lastUpdateTime = document.getElementById("last-update-time");

  if (tbody) tbody.innerHTML = "";
  if (skeleton) skeleton.classList.remove("hidden");
  if (emptyState) emptyState.classList.add("hidden");
  if (filterEmptyState) filterEmptyState.classList.add("hidden");
  if (errorState) errorState.classList.add("hidden");

  try {
    const response = await fetchWithdrawals(pageState);
    if (skeleton) skeleton.classList.add("hidden");

    if (lastUpdateTime) {
      lastUpdateTime.textContent = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    if (!response.success) {
      showErrorState(response.message || "Không thể tải dữ liệu.");
      return;
    }

    const { summary, items } = response.data;
    const meta = response.meta;

    // Render Summary Cards
    renderSummaryCards(summary);

    // Filter Chips & Reset Button state
    renderFilterChips();
    updateResetButtonState();

    // Check dataset empty vs filter empty
    if (meta.total === 0) {
      const hasActiveFilter =
        pageState.search ||
        pageState.status !== "all" ||
        pageState.time_preset !== "all" ||
        pageState.amount_min ||
        pageState.amount_max ||
        pageState.date_from ||
        pageState.date_to;

      if (hasActiveFilter && filterEmptyState) {
        filterEmptyState.classList.remove("hidden");
      } else if (emptyState) {
        emptyState.classList.remove("hidden");
      }
      renderPagination(meta);
    } else {
      renderTableRows(items);
      renderPagination(meta);
    }

    // Tự động cuộn đến bảng nếu người dùng chủ động click card
    if (options.autoScroll) {
      const resultsSection = document.getElementById("withdrawals-results-section");
      resultsSection?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  } catch (err) {
    if (skeleton) skeleton.classList.add("hidden");
    console.error("Lỗi loadWithdrawals:", err);
    showErrorState(err.message || "Đã xảy ra sự cố kết nối dữ liệu.");
  }
}

/**
 * Hiển thị error state trong bảng
 */
function showErrorState(msg) {
  const errorState = document.getElementById("withdrawals-error-state");
  const errorMsgText = document.getElementById("error-message-text");
  if (errorMsgText) errorMsgText.textContent = msg;
  if (errorState) errorState.classList.remove("hidden");
}

/**
 * Render KPI Cards
 */
function renderSummaryCards(summary) {
  const elTotalReq = document.getElementById("kpi-total-requests");
  const elTotalAmount = document.getElementById("kpi-total-amount");
  const elTotalSubtext = document.getElementById("kpi-total-subtext");

  const elPendingCount = document.getElementById("kpi-pending-count");
  const elPendingAmt = document.getElementById("kpi-pending-amount");
  const elPendingPercent = document.getElementById("kpi-pending-percent");
  const elPendingBar = document.getElementById("kpi-pending-bar");

  const elApprovedCount = document.getElementById("kpi-approved-count");
  const elApprovedAmt = document.getElementById("kpi-approved-amount");
  const elApprovedPercent = document.getElementById("kpi-approved-percent");
  const elApprovedBar = document.getElementById("kpi-approved-bar");

  const elPaidCount = document.getElementById("kpi-paid-count");
  const elPaidAmt = document.getElementById("kpi-paid-amount");
  const elPaidPercent = document.getElementById("kpi-paid-percent");
  const elPaidBar = document.getElementById("kpi-paid-bar");

  const elRejectedCount = document.getElementById("kpi-rejected-count");
  const elRejectedAmt = document.getElementById("kpi-rejected-amount");

  const totalReq = summary.total_requests || 0;
  const totalMoney =
    Number(summary.pending_amount || 0) +
    Number(summary.approved_amount || 0) +
    Number(summary.paid_amount || 0) +
    Number(summary.rejected_amount || 0);

  if (elTotalReq) elTotalReq.textContent = totalReq;
  if (elTotalAmount) elTotalAmount.textContent = `${formatVND(totalMoney)} tổng giá trị`;
  if (elTotalSubtext) elTotalSubtext.textContent = `${summary.rejected_count || 0} yêu cầu bị từ chối`;

  const pendingCount = summary.pending_count || 0;
  const pendingPct = totalReq > 0 ? (pendingCount / totalReq) * 100 : 0;
  if (elPendingCount) elPendingCount.textContent = pendingCount;
  if (elPendingAmt) elPendingAmt.textContent = formatVND(summary.pending_amount);
  if (elPendingPercent) elPendingPercent.textContent = `${Math.round(pendingPct)}% tổng yêu cầu`;
  if (elPendingBar) elPendingBar.style.width = `${pendingPct.toFixed(1)}%`;

  const approvedCount = summary.approved_count || 0;
  const approvedPct = totalReq > 0 ? (approvedCount / totalReq) * 100 : 0;
  if (elApprovedCount) elApprovedCount.textContent = approvedCount;
  if (elApprovedAmt) elApprovedAmt.textContent = formatVND(summary.approved_amount);
  if (elApprovedPercent) elApprovedPercent.textContent = `${Math.round(approvedPct)}% tổng yêu cầu`;
  if (elApprovedBar) elApprovedBar.style.width = `${approvedPct.toFixed(1)}%`;

  const paidCount = summary.paid_count || 0;
  const paidPct = totalReq > 0 ? (paidCount / totalReq) * 100 : 0;
  if (elPaidCount) elPaidCount.textContent = paidCount;
  if (elPaidAmt) elPaidAmt.textContent = formatVND(summary.paid_amount);
  if (elPaidPercent) elPaidPercent.textContent = `${Math.round(paidPct)}% tổng yêu cầu`;
  if (elPaidBar) elPaidBar.style.width = `${paidPct.toFixed(1)}%`;

  if (elRejectedCount) elRejectedCount.textContent = summary.rejected_count || 0;
  if (elRejectedAmt) elRejectedAmt.textContent = formatVND(summary.rejected_amount);

  // Active styles cho card nếu đang filter theo trạng thái tương ứng
  const cardTotal = document.getElementById("card-total-requests");
  const cardPending = document.getElementById("card-pending");
  const cardApproved = document.getElementById("card-approved");
  const cardPaid = document.getElementById("card-paid");

  [cardTotal, cardPending, cardApproved, cardPaid].forEach((c) => {
    if (c) {
      c.classList.remove(
        "ring-2",
        "ring-ink",
        "ring-amber-500",
        "ring-blue-500",
        "ring-emerald-500",
        "bg-amber-50/10",
        "bg-blue-50/10",
        "bg-emerald-50/10"
      );
    }
  });

  if (pageState.status === "pending" && cardPending) {
    cardPending.classList.add("ring-2", "ring-amber-500", "bg-amber-50/10");
  } else if (pageState.status === "approved" && cardApproved) {
    cardApproved.classList.add("ring-2", "ring-blue-500", "bg-blue-50/10");
  } else if (pageState.status === "paid" && cardPaid) {
    cardPaid.classList.add("ring-2", "ring-emerald-500", "bg-emerald-50/10");
  } else if (pageState.status === "all" && cardTotal) {
    cardTotal.classList.add("ring-2", "ring-ink");
  }
}

/**
 * Kiểm tra xem có bất kỳ bộ lọc nào khác mặc định đang active hay không
 */
function isFilterActive() {
  return (
    Boolean(pageState.search && pageState.search.trim()) ||
    pageState.status !== "all" ||
    pageState.time_preset !== "all" ||
    Boolean(pageState.date_from) ||
    Boolean(pageState.date_to) ||
    Boolean(pageState.amount_min) ||
    Boolean(pageState.amount_max)
  );
}

/**
 * Cập nhật trạng thái hiển thị màu sắc và bấm cho nút X đỏ xóa bộ lọc
 */
function updateResetButtonState() {
  const btnReset = document.getElementById("btn-reset-filters");
  if (!btnReset) return;

  if (isFilterActive()) {
    btnReset.disabled = false;
    btnReset.classList.remove(
      "opacity-40",
      "text-mid-gray/40",
      "pointer-events-none",
      "cursor-not-allowed",
      "bg-canvas",
      "border-hairline"
    );
    btnReset.classList.add(
      "text-rose-600",
      "hover:text-rose-700",
      "bg-paper",
      "hover:bg-rose-50",
      "border-rose-200",
      "shadow-sm",
      "cursor-pointer"
    );
  } else {
    btnReset.disabled = true;
    btnReset.classList.remove(
      "text-rose-600",
      "hover:text-rose-700",
      "bg-paper",
      "hover:bg-rose-50",
      "border-rose-200",
      "shadow-sm",
      "cursor-pointer"
    );
    btnReset.classList.add(
      "opacity-40",
      "text-mid-gray/40",
      "pointer-events-none",
      "cursor-not-allowed",
      "bg-canvas",
      "border-hairline"
    );
  }
}

/**
 * Render Filter Chips
 */
function renderFilterChips() {
  const container = document.getElementById("filter-chips-container");
  if (!container) return;
  container.innerHTML = "";

  const chips = [];

  if (pageState.search) {
    chips.push({ key: "search", label: `Từ khóa: "${pageState.search}"` });
  }

  if (pageState.status !== "all") {
    const badge = withdrawalStatusMap[pageState.status];
    chips.push({ key: "status", label: `Trạng thái: ${badge ? badge.label : pageState.status}` });
  }

  if (pageState.time_preset !== "all") {
    let presetLabel = pageState.time_preset;
    if (pageState.time_preset === "today") presetLabel = "Hôm nay";
    else if (pageState.time_preset === "last_7_days") presetLabel = "7 ngày gần nhất";
    else if (pageState.time_preset === "last_30_days") presetLabel = "1 tháng gần nhất";
    else if (pageState.time_preset === "last_3_months") presetLabel = "3 tháng gần nhất";
    else if (pageState.time_preset === "custom") {
      presetLabel = `Từ ${pageState.date_from || "..."} đến ${pageState.date_to || "..."}`;
    }
    chips.push({ key: "time_preset", label: `Thời gian: ${presetLabel}` });
  }

  if (pageState.amount_min || pageState.amount_max) {
    const minText = pageState.amount_min ? formatVND(pageState.amount_min) : "0đ";
    const maxText = pageState.amount_max ? formatVND(pageState.amount_max) : "Không giới hạn";
    chips.push({ key: "amount", label: `Số tiền: ${minText} - ${maxText}` });
  }

  chips.forEach((chip) => {
    const el = document.createElement("span");
    el.className =
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-canvas border border-hairline text-ink font-medium transition-colors hover:border-mid-gray";
    el.innerHTML = `
      <span>${chip.label}</span>
      <button type="button" class="hover:text-rose-600 cursor-pointer p-0.5" aria-label="Xóa bộ lọc ${chip.key}">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;
    const btn = el.querySelector("button");
    btn.addEventListener("click", () => {
      if (chip.key === "search") pageState.search = "";
      else if (chip.key === "status") pageState.status = "all";
      else if (chip.key === "time_preset") {
        pageState.time_preset = "all";
        pageState.date_from = "";
        pageState.date_to = "";
      } else if (chip.key === "amount") {
        pageState.amount_min = "";
        pageState.amount_max = "";
      }
      pageState.page = 1;
      updateUrlState();
      syncStateFromUrl();
      loadWithdrawals();
    });
    container.appendChild(el);
  });
}

/**
 * Render các hàng dữ liệu trong bảng
 */
function renderTableRows(items) {
  const tbody = document.getElementById("withdrawals-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-canvas/60 transition-colors cursor-pointer group";

    const badge = withdrawalStatusMap[item.status] || {
      label: item.status,
      colorClass: "text-mid-gray",
      dotClass: "bg-mid-gray",
    };

    const user = item.user || {};
    const avatarContent = user.avatar_url
      ? `<img src="${user.avatar_url}" alt="${user.full_name}" class="w-7 h-7 rounded-full object-cover shrink-0" />`
      : `<div class="w-7 h-7 rounded-full bg-ink/10 text-ink font-semibold text-xs flex items-center justify-center shrink-0">${getInitials(user.full_name)}</div>`;

    const userLinkHtml = user.id
      ? `<a href="users.html?open_user_id=${user.id}" class="text-blue-600 hover:text-blue-800 font-semibold truncate max-w-[150px] inline-block transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" title="${user.full_name}" onclick="event.stopPropagation()">${user.full_name}</a>`
      : `<span class="text-mid-gray italic">N/A</span>`;

    const payoutAcc = item.payout_snapshot || item.payout_account || {};
    const payoutLinkHtml = item.payout_account_id
      ? `<a href="payout-accounts.html?open_payout_account_id=${item.payout_account_id}" class="text-blue-600 hover:text-blue-800 font-medium truncate max-w-[180px] inline-block transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" title="${payoutAcc.account_name || ''} - ${payoutAcc.account_number_masked || ''}" onclick="event.stopPropagation()">${payoutAcc.provider || 'Ngân hàng'} - ${payoutAcc.account_number_masked || '---'}</a>`
      : `<span class="text-mid-gray">---</span>`;

    const lastUpdatedDate = item.paid_at || item.approved_at || item.rejected_at || item.requested_at;

    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-ink whitespace-nowrap">
        ${item.withdrawal_code || "WD-" + item.id}
      </td>
      <td class="py-3 px-3">
        <div class="flex items-center gap-2.5">
          ${avatarContent}
          <div class="flex flex-col min-w-0">
            ${userLinkHtml}
            <span class="text-[11px] text-mid-gray truncate max-w-[170px]" title="${user.email || ''}">${user.email || '---'}</span>
          </div>
        </div>
      </td>
      <td class="py-3 px-3">
        <div class="flex flex-col text-xs">
          ${payoutLinkHtml}
          <span class="text-[11px] text-mid-gray truncate font-medium max-w-[180px]">${payoutAcc.account_name || '---'}</span>
        </div>
      </td>
      <td class="py-3 px-3 text-center font-bold text-ink whitespace-nowrap tabular-nums">
        ${formatVND(item.amount)}
      </td>
      <td class="py-3 px-3 whitespace-nowrap">
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold ${badge.colorClass}">
          <span class="h-2 w-2 rounded-full ${badge.dotClass} shrink-0" aria-hidden="true"></span>
          <span>${badge.label}</span>
        </span>
      </td>
      <td class="py-3 px-3 text-mid-gray whitespace-nowrap">
        ${formatDateVN(item.requested_at)}
      </td>
      <td class="py-3 px-3 text-mid-gray whitespace-nowrap">
        ${formatDateVN(lastUpdatedDate)}
      </td>
    `;

    // Row click opens drawer
    tr.addEventListener("click", () => {
      openWithdrawalDrawer(item.id);
    });

    tbody.appendChild(tr);
  });
}

/**
 * Render Pagination Controls
 */
function renderPagination(meta) {
  const showingRange = document.getElementById("pag-showing-range");
  const totalRecords = document.getElementById("pag-total-records");
  const buttonsContainer = document.getElementById("pagination-buttons");

  const total = meta.total || 0;
  const page = meta.current_page || 1;
  const perPage = meta.per_page || 20;
  const lastPage = meta.last_page || 1;

  if (totalRecords) totalRecords.textContent = total;

  if (showingRange) {
    if (total === 0) {
      showingRange.textContent = "0-0";
    } else {
      const from = (page - 1) * perPage + 1;
      const to = Math.min(page * perPage, total);
      showingRange.textContent = `${from}-${to}`;
    }
  }

  if (!buttonsContainer) return;
  buttonsContainer.innerHTML = "";

  if (lastPage <= 1) return;

  // Button Prev
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.disabled = page <= 1;
  prevBtn.className =
    "h-7 px-2 flex items-center justify-center rounded border border-hairline bg-paper text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors cursor-pointer";
  prevBtn.innerHTML = `
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
  `;
  prevBtn.addEventListener("click", () => {
    if (page > 1) {
      pageState.page = page - 1;
      updateUrlState();
      loadWithdrawals();
    }
  });
  buttonsContainer.appendChild(prevBtn);

  // Page Numbers logic
  const pageNumbers = [];
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
      pageNumbers.push("...");
    }
  }

  pageNumbers.forEach((p) => {
    if (p === "...") {
      const span = document.createElement("span");
      span.className = "px-1.5 text-mid-gray";
      span.textContent = "...";
      buttonsContainer.appendChild(span);
    } else {
      const btn = document.createElement("button");
      btn.type = "button";
      const isActive = p === page;
      btn.className = isActive
        ? "h-7 w-7 flex items-center justify-center rounded font-bold bg-ink text-white transition-colors cursor-default"
        : "h-7 w-7 flex items-center justify-center rounded border border-hairline bg-paper text-ink hover:bg-canvas transition-colors cursor-pointer";
      btn.textContent = p;
      if (!isActive) {
        btn.addEventListener("click", () => {
          pageState.page = p;
          updateUrlState();
          loadWithdrawals();
        });
      }
      buttonsContainer.appendChild(btn);
    }
  });

  // Button Next
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.disabled = page >= lastPage;
  nextBtn.className =
    "h-7 px-2 flex items-center justify-center rounded border border-hairline bg-paper text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors cursor-pointer";
  nextBtn.innerHTML = `
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
  `;
  nextBtn.addEventListener("click", () => {
    if (page < lastPage) {
      pageState.page = page + 1;
      updateUrlState();
      loadWithdrawals();
    }
  });
  buttonsContainer.appendChild(nextBtn);
}

/**
 * Mở Drawer chi tiết yêu cầu rút tiền
 */
async function openWithdrawalDrawer(id) {
  const drawer = document.getElementById("withdrawal-drawer");
  const overlay = document.getElementById("drawer-overlay");
  const loading = document.getElementById("drawer-loading");
  const content = document.getElementById("drawer-content");

  if (!drawer || !overlay) return;

  pageState.open_withdrawal_id = String(id);
  updateUrlState();

  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.remove("opacity-0"), 10);
  drawer.classList.remove("translate-x-full");

  if (loading) loading.classList.remove("hidden");
  if (content) content.classList.add("hidden");

  try {
    const res = await fetchWithdrawalById(id);
    if (loading) loading.classList.add("hidden");

    if (!res.success || !res.data) {
      showToast(res.message || "Không thể tải chi tiết yêu cầu.", "error");
      closeWithdrawalDrawer();
      return;
    }

    if (content) content.classList.remove("hidden");
    renderDrawerDetails(res.data);
  } catch (err) {
    if (loading) loading.classList.add("hidden");
    console.error("Lỗi openWithdrawalDrawer:", err);
    showToast("Lỗi tải chi tiết yêu cầu rút tiền.", "error");
    closeWithdrawalDrawer();
  }
}

/**
 * Render dữ liệu trong Drawer chi tiết
 */
function renderDrawerDetails(data) {
  pageState.activeItemForModal = data;

  const headerCode = document.getElementById("drawer-header-code");
  const headerStatus = document.getElementById("drawer-header-status");

  if (headerCode) headerCode.textContent = data.withdrawal_code || `WD-${data.id}`;

  if (headerStatus) {
    const badge = withdrawalStatusMap[data.status] || {
      label: data.status,
      colorClass: "bg-canvas text-mid-gray border-hairline",
    };
    headerStatus.innerHTML = `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.colorClass}">
        ${badge.label}
      </span>
    `;
  }

  // Section 1: Giảng viên
  const instructorCard = document.getElementById("drawer-instructor-card");
  if (instructorCard) {
    const user = data.user || {};
    const avatarHtml = user.avatar_url
      ? `<img src="${user.avatar_url}" alt="${user.full_name}" class="w-10 h-10 rounded-full object-cover shrink-0" />`
      : `<div class="w-10 h-10 rounded-full bg-ink/10 text-ink font-bold text-sm flex items-center justify-center shrink-0">${getInitials(user.full_name)}</div>`;

    instructorCard.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        ${avatarHtml}
        <div class="flex flex-col min-w-0">
          <span class="text-xs font-bold text-ink truncate">${user.full_name || "N/A"}</span>
          <span class="text-[11px] text-mid-gray truncate">${user.email || "---"}</span>
          <span class="text-[10px] text-mid-gray/80 font-mono mt-0.5">ID GV: #${user.id || 'N/A'}</span>
        </div>
      </div>
      ${
        user.id
          ? `<a href="users.html?open_user_id=${user.id}" onclick="event.stopPropagation()" class="h-8 px-3 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-hairline hover:bg-canvas rounded-[6px] transition-colors flex items-center justify-center shrink-0 whitespace-nowrap">Xem người dùng &rarr;</a>`
          : ""
      }
    `;
  }

  // Section 2: Chi tiết số tiền & Số dư
  const elReqAmount = document.getElementById("drawer-requested-amount");
  const elBalBefore = document.getElementById("drawer-balance-before");
  const elHolding = document.getElementById("drawer-holding-amount");
  const elBalAfter = document.getElementById("drawer-balance-after");
  const elWarning = document.getElementById("drawer-balance-warning");

  const snapshot = data.balance_snapshot || {};
  if (elReqAmount) elReqAmount.textContent = formatVND(data.amount);
  if (elBalBefore) elBalBefore.textContent = formatVND(snapshot.available_balance_before || data.amount);
  if (elHolding) elHolding.textContent = formatVND(snapshot.holding_balance_before || 0);
  if (elBalAfter) elBalAfter.textContent = formatVND(snapshot.available_balance_after || 0);

  if (elWarning) {
    const isConsistent = Number(snapshot.available_balance_before || 0) >= Number(data.amount || 0);
    if (!isConsistent) {
      elWarning.classList.remove("hidden");
    } else {
      elWarning.classList.add("hidden");
    }
  }

  // Section 3: Payout Account Snapshot
  const payoutCard = document.getElementById("drawer-payout-account-card");
  if (payoutCard) {
    const pAcc = data.payout_snapshot || data.payout_account || {};
    payoutCard.innerHTML = `
      <div class="flex justify-between items-center pb-2 border-b border-hairline/60">
        <span class="text-mid-gray">Ngân hàng / Cổng:</span>
        <span class="font-bold text-ink">${pAcc.provider || 'N/A'}</span>
      </div>
      <div class="flex justify-between items-center py-1">
        <span class="text-mid-gray">Tên chủ tài khoản:</span>
        <span class="font-semibold text-ink uppercase">${pAcc.account_name || 'N/A'}</span>
      </div>
      <div class="flex justify-between items-center py-1">
        <span class="text-mid-gray">Số tài khoản:</span>
        <span class="font-mono font-bold text-ink tracking-wide">${pAcc.account_number || pAcc.account_number_masked || 'N/A'}</span>
      </div>
      <div class="flex justify-between items-center pt-2 border-t border-hairline/60 text-[11px]">
        <span class="text-mid-gray">Trạng thái kết nối:</span>
        <span class="text-emerald-600 font-semibold uppercase">${pAcc.status || 'active'}</span>
      </div>
    `;
  }

  // Section 4: Allocations
  const allocCard = document.getElementById("drawer-allocations-card");
  if (allocCard) {
    const allocations = data.allocations || [];
    if (allocations.length === 0) {
      allocCard.innerHTML = `<p class="text-xs text-mid-gray italic">Chưa có phân bổ doanh thu nào được gắn với yêu cầu này.</p>`;
    } else {
      allocCard.innerHTML = allocations
        .map(
          (alloc) => `
        <div class="p-2.5 bg-canvas/60 rounded-[6px] border border-hairline/80 space-y-1 text-xs">
          <div class="flex items-center justify-between font-medium">
            <span class="font-semibold text-ink truncate max-w-[240px]">${alloc.course_title || "Khóa học"}</span>
            <span class="font-bold text-ink whitespace-nowrap">${formatVND(alloc.amount)}</span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-[11px] text-mid-gray pt-1 border-t border-hairline/40">
            ${alloc.revenue_id ? `<a href="revenues.html?open_revenue_id=${alloc.revenue_id}" onclick="event.stopPropagation()" class="text-blue-600 hover:underline">Rev #${alloc.revenue_id}</a>` : ""}
            ${alloc.order_id ? `<a href="orders.html?open_order_id=${alloc.order_id}" onclick="event.stopPropagation()" class="text-blue-600 hover:underline">Đơn #${alloc.order_id}</a>` : ""}
            <span class="ml-auto">${formatDateVN(alloc.earned_at)}</span>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  // Section 5: Timeline
  const timelineCard = document.getElementById("drawer-timeline-card");
  if (timelineCard) {
    const timeline = data.timeline || [
      {
        timestamp: data.requested_at,
        title: "Gửi yêu cầu rút tiền",
        description: `Tạo yêu cầu rút ${formatVND(data.amount)}`,
        status: "info",
      },
    ];

    timelineCard.innerHTML = `
      <div class="relative pl-4 space-y-4 border-l border-hairline">
        ${timeline
          .map((t) => {
            let dotClass = "bg-blue-500";
            if (t.status === "success") dotClass = "bg-emerald-500";
            else if (t.status === "error") dotClass = "bg-rose-500";
            else if (t.status === "warning") dotClass = "bg-amber-500";

            return `
            <div class="relative">
              <span class="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${dotClass} ring-4 ring-paper"></span>
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-xs font-bold text-ink">${t.title}</span>
                <span class="text-[10px] text-mid-gray whitespace-nowrap font-mono">${formatDateVN(t.timestamp)}</span>
              </div>
              <p class="text-[11px] text-mid-gray mt-0.5 leading-snug">${t.description}</p>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  // Action Buttons Footer
  const footer = document.getElementById("drawer-actions-footer");
  if (footer) {
    footer.innerHTML = "";

    if (data.status === "pending") {
      footer.innerHTML = `
        <button type="button" id="btn-drawer-reject" class="h-9 px-4 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap">
          Từ chối
        </button>
        <button type="button" id="btn-drawer-approve" class="h-9 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-[6px] transition-colors cursor-pointer shadow-sm whitespace-nowrap">
          Duyệt yêu cầu
        </button>
      `;

      const btnReject = document.getElementById("btn-drawer-reject");
      const btnApprove = document.getElementById("btn-drawer-approve");

      if (btnReject) btnReject.addEventListener("click", () => openRejectModal(data));
      if (btnApprove) btnApprove.addEventListener("click", () => openApproveModal(data));
    } else if (data.status === "approved") {
      footer.innerHTML = `
        <button type="button" id="btn-drawer-mark-paid" class="h-9 px-5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors cursor-pointer shadow-sm whitespace-nowrap">
          Đánh dấu đã thanh toán
        </button>
      `;

      const btnMarkPaid = document.getElementById("btn-drawer-mark-paid");
      if (btnMarkPaid) btnMarkPaid.addEventListener("click", () => openMarkPaidModal(data));
    } else {
      footer.innerHTML = `
        <span class="text-xs text-mid-gray italic">Yêu cầu đã ở trạng thái kết thúc (${data.status === "paid" ? "Đã thanh toán" : "Đã từ chối"}). Không thể thao tác thêm.</span>
      `;
    }
  }
}

/**
 * Đóng Drawer chi tiết
 */
function closeWithdrawalDrawer() {
  const drawer = document.getElementById("withdrawal-drawer");
  const overlay = document.getElementById("drawer-overlay");

  if (drawer) drawer.classList.add("translate-x-full");
  if (overlay) {
    overlay.classList.add("opacity-0");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  }

  pageState.open_withdrawal_id = null;
  updateUrlState();
}

/**
 * Modal Duyệt
 */
function openApproveModal(data) {
  pageState.activeItemForModal = data;
  const modal = document.getElementById("modal-approve");
  const elCode = document.getElementById("modal-approve-code");
  const elUser = document.getElementById("modal-approve-user");
  const elAmt = document.getElementById("modal-approve-amount");
  const elPayout = document.getElementById("modal-approve-payout");

  if (!modal) return;
  if (elCode) elCode.textContent = data.withdrawal_code || `WD-${data.id}`;
  if (elUser) elUser.textContent = data.user?.full_name || "N/A";
  if (elAmt) elAmt.textContent = formatVND(data.amount);
  if (elPayout) {
    const pAcc = data.payout_snapshot || data.payout_account || {};
    elPayout.textContent = `${pAcc.provider || 'Ngân hàng'} - ${pAcc.account_number_masked || '---'}`;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeApproveModal() {
  const modal = document.getElementById("modal-approve");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/**
 * Modal Từ Chối
 */
function openRejectModal(data) {
  pageState.activeItemForModal = data;
  const modal = document.getElementById("modal-reject");
  const elCode = document.getElementById("modal-reject-code");
  const textarea = document.getElementById("reject-reason-input");
  const errText = document.getElementById("reject-error-text");
  const charCount = document.getElementById("reject-char-count");

  if (!modal) return;
  if (elCode) elCode.textContent = data.withdrawal_code || `WD-${data.id}`;
  if (textarea) textarea.value = "";
  if (errText) errText.classList.add("hidden");
  if (charCount) charCount.textContent = "0/1000";

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (textarea) setTimeout(() => textarea.focus(), 50);
}

function closeRejectModal() {
  const modal = document.getElementById("modal-reject");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/**
 * Modal Đánh Dấu Đã Thanh Toán
 */
function openMarkPaidModal(data) {
  pageState.activeItemForModal = data;
  const modal = document.getElementById("modal-mark-paid");
  const elCode = document.getElementById("modal-mark-paid-code");
  const input = document.getElementById("provider-payout-id-input");
  const errText = document.getElementById("mark-paid-error-text");

  if (!modal) return;
  if (elCode) elCode.textContent = data.withdrawal_code || `WD-${data.id}`;
  if (input) input.value = `TXN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${data.id}`;
  if (errText) errText.classList.add("hidden");

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (input) setTimeout(() => input.focus(), 50);
}

function closeMarkPaidModal() {
  const modal = document.getElementById("modal-mark-paid");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/**
 * Đăng ký tất cả sự kiện tương tác DOM
 */
function bindEvents() {
  // Nút Refresh
  const btnRefresh = document.getElementById("btn-refresh-data");
  const refreshIcon = document.getElementById("refresh-icon");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      if (refreshIcon) refreshIcon.classList.add("rotate-180");
      setTimeout(() => {
        if (refreshIcon) refreshIcon.classList.remove("rotate-180");
      }, 500);
      loadWithdrawals();
      showToast("Đã cập nhật dữ liệu mới nhất.", "info");
    });
  }

  // Search Input
  const searchInput = document.getElementById("filter-search");
  const clearSearchBtn = document.getElementById("btn-clear-search");
  if (searchInput) {
    let debounceTimer = null;
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (clearSearchBtn) clearSearchBtn.classList.toggle("hidden", !val);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        pageState.search = val.trim();
        pageState.page = 1;
        updateUrlState();
        loadWithdrawals();
      }, 350);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      clearSearchBtn.classList.add("hidden");
      pageState.search = "";
      pageState.page = 1;
      updateUrlState();
      loadWithdrawals();
    });
  }

  // Filter Status Select
  const statusSelect = document.getElementById("filter-status");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      pageState.status = e.target.value;
      pageState.page = 1;
      updateUrlState();
      loadWithdrawals();
    });
  }

  // Filter Time Preset
  const timePresetSelect = document.getElementById("filter-time-preset");
  const customDateGroup = document.getElementById("custom-date-group");
  if (timePresetSelect) {
    timePresetSelect.addEventListener("change", (e) => {
      pageState.time_preset = e.target.value;
      if (pageState.time_preset === "custom") {
        if (customDateGroup) {
          customDateGroup.classList.remove("hidden");
          customDateGroup.classList.add("flex");
        }
      } else {
        if (customDateGroup) {
          customDateGroup.classList.add("hidden");
          customDateGroup.classList.remove("flex");
        }
        pageState.date_from = "";
        pageState.date_to = "";
        pageState.page = 1;
        updateUrlState();
        loadWithdrawals();
      }
    });
  }

  // Inputs Date From/To
  const dateFromInput = document.getElementById("filter-date-from");
  const dateToInput = document.getElementById("filter-date-to");
  [dateFromInput, dateToInput].forEach((input) => {
    if (input) {
      input.addEventListener("change", () => {
        pageState.date_from = dateFromInput ? dateFromInput.value : "";
        pageState.date_to = dateToInput ? dateToInput.value : "";
        pageState.page = 1;
        updateUrlState();
        loadWithdrawals();
      });
    }
  });

  // Inputs Amount Min/Max
  const amountMinInput = document.getElementById("filter-amount-min");
  const amountMaxInput = document.getElementById("filter-amount-max");
  [amountMinInput, amountMaxInput].forEach((input) => {
    if (input) {
      let amountDebounce = null;
      input.addEventListener("input", () => {
        clearTimeout(amountDebounce);
        amountDebounce = setTimeout(() => {
          pageState.amount_min = amountMinInput ? amountMinInput.value : "";
          pageState.amount_max = amountMaxInput ? amountMaxInput.value : "";
          pageState.page = 1;
          updateUrlState();
          loadWithdrawals();
        }, 400);
      });
    }
  });

  // Reset Filters Button
  const btnReset = document.getElementById("btn-reset-filters");
  const btnClearEmpty = document.getElementById("btn-clear-empty-filter");
  const resetAllFilters = () => {
    pageState.search = "";
    pageState.status = "all";
    pageState.time_preset = "all";
    pageState.date_from = "";
    pageState.date_to = "";
    pageState.amount_min = "";
    pageState.amount_max = "";
    pageState.page = 1;

    updateUrlState();
    syncStateFromUrl();
    loadWithdrawals();
    showToast("Đã xóa toàn bộ bộ lọc.", "info");
  };

  if (btnReset) btnReset.addEventListener("click", resetAllFilters);
  if (btnClearEmpty) btnClearEmpty.addEventListener("click", resetAllFilters);

  // Retry Button
  const btnRetry = document.getElementById("btn-retry-error");
  if (btnRetry) btnRetry.addEventListener("click", loadWithdrawals);

  // Per Page Select
  const perPageSelect = document.getElementById("pag-per-page");
  if (perPageSelect) {
    perPageSelect.addEventListener("change", (e) => {
      pageState.per_page = Number(e.target.value) || 20;
      pageState.page = 1;
      updateUrlState();
      loadWithdrawals();
    });
  }

  // Card clicks filter status & auto scroll to table
  const cardTotal = document.getElementById("card-total-requests");
  const cardPending = document.getElementById("card-pending");
  const cardApproved = document.getElementById("card-approved");
  const cardPaid = document.getElementById("card-paid");

  const handleCardClick = (targetStatus) => {
    if (targetStatus === "all") {
      pageState.status = "all";
    } else {
      pageState.status = pageState.status === targetStatus ? "all" : targetStatus;
    }
    pageState.page = 1;

    // Đồng bộ giá trị với custom select UI
    const statusSelect = document.getElementById("filter-status");
    if (statusSelect) statusSelect.value = pageState.status;
    if (typeof window.initAllCustomSelects === "function") {
      window.initAllCustomSelects();
    }

    updateUrlState();
    loadWithdrawals({ autoScroll: true });
  };

  const setupCardKeyAndClick = (cardEl, targetStatus) => {
    if (!cardEl) return;
    cardEl.addEventListener("click", () => handleCardClick(targetStatus));
    cardEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick(targetStatus);
      }
    });
  };

  setupCardKeyAndClick(cardTotal, "all");
  setupCardKeyAndClick(cardPending, "pending");
  setupCardKeyAndClick(cardApproved, "approved");
  setupCardKeyAndClick(cardPaid, "paid");

  // Drawer Close Button & Overlay
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");

  if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", closeWithdrawalDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeWithdrawalDrawer);

  // Approve Modal Actions
  const btnCancelApprove = document.getElementById("btn-cancel-approve");
  const btnConfirmApprove = document.getElementById("btn-confirm-approve");

  if (btnCancelApprove) btnCancelApprove.addEventListener("click", closeApproveModal);
  if (btnConfirmApprove) {
    btnConfirmApprove.addEventListener("click", async () => {
      if (!pageState.activeItemForModal) return;
      btnConfirmApprove.disabled = true;
      btnConfirmApprove.textContent = "Đang xử lý...";

      try {
        const res = await approveWithdrawalApi(pageState.activeItemForModal.id);
        btnConfirmApprove.disabled = false;
        btnConfirmApprove.textContent = "Xác nhận duyệt";

        if (!res.success) {
          showToast(res.message || "Duyệt yêu cầu thất bại.", "error");
          return;
        }

        showToast(res.message || "Đã duyệt yêu cầu rút tiền thành công.", "success");
        closeApproveModal();
        loadWithdrawals();
        if (pageState.open_withdrawal_id) {
          openWithdrawalDrawer(pageState.open_withdrawal_id);
        }
      } catch (err) {
        btnConfirmApprove.disabled = false;
        btnConfirmApprove.textContent = "Xác nhận duyệt";
        console.error("Lỗi approve:", err);
        showToast(err.message || "Lỗi hệ thống khi duyệt yêu cầu.", "error");
      }
    });
  }

  // Reject Modal Actions
  const textareaReject = document.getElementById("reject-reason-input");
  const charCountReject = document.getElementById("reject-char-count");
  const errTextReject = document.getElementById("reject-error-text");

  if (textareaReject && charCountReject) {
    textareaReject.addEventListener("input", (e) => {
      const len = e.target.value.length;
      charCountReject.textContent = `${len}/1000`;
      if (errTextReject) errTextReject.classList.add("hidden");
    });
  }

  const btnCancelReject = document.getElementById("btn-cancel-reject");
  const btnConfirmReject = document.getElementById("btn-confirm-reject");

  if (btnCancelReject) btnCancelReject.addEventListener("click", closeRejectModal);
  if (btnConfirmReject) {
    btnConfirmReject.addEventListener("click", async () => {
      if (!pageState.activeItemForModal) return;

      const reason = textareaReject ? textareaReject.value.trim() : "";
      if (!reason) {
        if (errTextReject) {
          errTextReject.textContent = "Vui lòng nhập lý do từ chối.";
          errTextReject.classList.remove("hidden");
        }
        return;
      }

      btnConfirmReject.disabled = true;
      btnConfirmReject.textContent = "Đang xử lý...";

      try {
        const res = await rejectWithdrawalApi(pageState.activeItemForModal.id, reason);
        btnConfirmReject.disabled = false;
        btnConfirmReject.textContent = "Xác nhận từ chối";

        if (!res.success) {
          if (errTextReject) {
            errTextReject.textContent = res.message || "Từ chối thất bại.";
            errTextReject.classList.remove("hidden");
          } else {
            showToast(res.message || "Từ chối thất bại.", "error");
          }
          return;
        }

        showToast(res.message || "Đã từ chối yêu cầu rút tiền.", "success");
        closeRejectModal();
        loadWithdrawals();
        if (pageState.open_withdrawal_id) {
          openWithdrawalDrawer(pageState.open_withdrawal_id);
        }
      } catch (err) {
        btnConfirmReject.disabled = false;
        btnConfirmReject.textContent = "Xác nhận từ chối";
        console.error("Lỗi reject:", err);
        showToast(err.message || "Lỗi hệ thống khi từ chối yêu cầu.", "error");
      }
    });
  }

  // Mark Paid Modal Actions
  const inputMarkPaid = document.getElementById("provider-payout-id-input");
  const errTextMarkPaid = document.getElementById("mark-paid-error-text");

  if (inputMarkPaid && errTextMarkPaid) {
    inputMarkPaid.addEventListener("input", () => {
      errTextMarkPaid.classList.add("hidden");
    });
  }

  const btnCancelMarkPaid = document.getElementById("btn-cancel-mark-paid");
  const btnConfirmMarkPaid = document.getElementById("btn-confirm-mark-paid");

  if (btnCancelMarkPaid) btnCancelMarkPaid.addEventListener("click", closeMarkPaidModal);
  if (btnConfirmMarkPaid) {
    btnConfirmMarkPaid.addEventListener("click", async () => {
      if (!pageState.activeItemForModal) return;

      const payoutId = inputMarkPaid ? inputMarkPaid.value.trim() : "";
      if (!payoutId) {
        if (errTextMarkPaid) {
          errTextMarkPaid.textContent = "Vui lòng nhập mã giao dịch từ nhà cung cấp.";
          errTextMarkPaid.classList.remove("hidden");
        }
        return;
      }

      btnConfirmMarkPaid.disabled = true;
      btnConfirmMarkPaid.textContent = "Đang xử lý...";

      try {
        const res = await markPaidWithdrawalApi(pageState.activeItemForModal.id, payoutId);
        btnConfirmMarkPaid.disabled = false;
        btnConfirmMarkPaid.textContent = "Xác nhận hoàn tất";

        if (!res.success) {
          if (errTextMarkPaid) {
            errTextMarkPaid.textContent = res.message || "Đánh dấu thất bại.";
            errTextMarkPaid.classList.remove("hidden");
          } else {
            showToast(res.message || "Đánh dấu thất bại.", "error");
          }
          return;
        }

        showToast(res.message || "Đã đánh dấu hoàn tất thanh toán.", "success");
        closeMarkPaidModal();
        loadWithdrawals();
        if (pageState.open_withdrawal_id) {
          openWithdrawalDrawer(pageState.open_withdrawal_id);
        }
      } catch (err) {
        btnConfirmMarkPaid.disabled = false;
        btnConfirmMarkPaid.textContent = "Xác nhận hoàn tất";
        console.error("Lỗi mark paid:", err);
        showToast(err.message || "Lỗi hệ thống khi đánh dấu thanh toán.", "error");
      }
    });
  }

  // ESC key handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modalApprove = document.getElementById("modal-approve");
      const modalReject = document.getElementById("modal-reject");
      const modalMarkPaid = document.getElementById("modal-mark-paid");

      if (modalApprove && !modalApprove.classList.contains("hidden")) {
        closeApproveModal();
        return;
      }
      if (modalReject && !modalReject.classList.contains("hidden")) {
        closeRejectModal();
        return;
      }
      if (modalMarkPaid && !modalMarkPaid.classList.contains("hidden")) {
        closeMarkPaidModal();
        return;
      }
      if (pageState.open_withdrawal_id) {
        closeWithdrawalDrawer();
      }
    }
  });
}

/**
 * Khởi tạo khi trang được nạp
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Đã tải trang: Yêu cầu rút tiền");
  syncStateFromUrl();
  bindEvents();
  loadWithdrawals();

  if (pageState.open_withdrawal_id) {
    openWithdrawalDrawer(pageState.open_withdrawal_id);
  }
});
