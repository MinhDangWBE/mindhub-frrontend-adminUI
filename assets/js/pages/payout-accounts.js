/**
 * MindHub Admin - Payout Accounts Page Logic
 */

import {
  fetchPayoutAccounts,
  fetchPayoutAccountById,
  approvePayoutAccountApi,
  rejectPayoutAccountApi,
  disablePayoutAccountApi,
} from "../api/payout-accounts-api.js";
import { showToast } from "../toast.js";

// Mapping trạng thái sang nhãn tiếng Việt và màu chấm tròn
export const payoutStatusMap = {
  pending_verification: {
    label: "Chờ xác minh",
    colorClass: "text-amber-700 font-semibold",
    dotClass: "bg-amber-500",
  },
  active: {
    label: "Đang hoạt động",
    colorClass: "text-emerald-700 font-semibold",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    label: "Đã từ chối",
    colorClass: "text-rose-700 font-semibold",
    dotClass: "bg-rose-500",
  },
  inactive: {
    label: "Đã vô hiệu hóa",
    colorClass: "text-slate-600 font-semibold",
    dotClass: "bg-slate-400",
  },
};

// Quản lý state của trang
const pageState = {
  page: 1,
  per_page: 20,
  search: "",
  provider: "all",
  status: "all",
  open_payout_account_id: null,
  activeAccountForModal: null,
  isLoading: false,
};

/**
 * Format số tiền VND
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
 * Lấy chữ cái initials cho avatar
 */
function getInitials(name) {
  if (!name) return "GV";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Đồng bộ state từ URL Query Params
 */
function syncStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  pageState.page = Math.max(1, Number(params.get("page")) || 1);
  pageState.per_page = Math.max(1, Number(params.get("per_page")) || 20);
  pageState.search = params.get("search") || "";
  pageState.provider = params.get("provider") || "all";
  pageState.status = params.get("status") || "all";

  const drawerId = params.get("open_payout_account_id");
  pageState.open_payout_account_id = drawerId ? Number(drawerId) : null;

  // Cập nhật giao diện các ô filter
  const searchInput = document.getElementById("input-search");
  if (searchInput) searchInput.value = pageState.search;

  const providerSelect = document.getElementById("select-provider");
  if (providerSelect) providerSelect.value = pageState.provider;

  const statusSelect = document.getElementById("select-status");
  if (statusSelect) statusSelect.value = pageState.status;

  const perPageSelect = document.getElementById("select-per-page");
  if (perPageSelect) perPageSelect.value = String(pageState.per_page);
}

/**
 * Cập nhật URL State không reload trang
 */
function updateUrlState() {
  const params = new URLSearchParams();

  if (pageState.page > 1) params.set("page", pageState.page);
  if (pageState.per_page !== 20) params.set("per_page", pageState.per_page);
  if (pageState.search) params.set("search", pageState.search);
  if (pageState.provider && pageState.provider !== "all") params.set("provider", pageState.provider);
  if (pageState.status && pageState.status !== "all") params.set("status", pageState.status);
  if (pageState.open_payout_account_id) {
    params.set("open_payout_account_id", pageState.open_payout_account_id);
  }

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, "", newUrl);
}

/**
 * Render thẻ summary cards
 */
function renderPayoutSummary(summary = {}) {
  const total = summary.total_accounts || 0;
  const pending = summary.pending_verification_count || 0;
  const active = summary.active_count || 0;
  const rejected = summary.rejected_count || 0;
  const inactive = summary.inactive_count || 0;

  // Card Tổng
  const elTotal = document.getElementById("kpi-total-accounts");
  if (elTotal) elTotal.textContent = total.toLocaleString("vi-VN");

  const elTotalSub = document.getElementById("kpi-total-subtext");
  if (elTotalSub) elTotalSub.textContent = `${inactive} tài khoản đã vô hiệu hóa`;

  // Helper tính phần trăm
  const calcPct = (cnt) => (total > 0 ? Math.round((cnt / total) * 100) : 0);

  // Pending
  const elPendingCount = document.getElementById("kpi-pending-count");
  if (elPendingCount) elPendingCount.textContent = pending.toLocaleString("vi-VN");

  const elPendingPct = document.getElementById("kpi-pending-percent");
  if (elPendingPct) elPendingPct.textContent = `${calcPct(pending)}%`;

  const elPendingBar = document.getElementById("kpi-pending-bar");
  if (elPendingBar) elPendingBar.style.width = `${calcPct(pending)}%`;

  // Active
  const elActiveCount = document.getElementById("kpi-active-count");
  if (elActiveCount) elActiveCount.textContent = active.toLocaleString("vi-VN");

  const elActivePct = document.getElementById("kpi-active-percent");
  if (elActivePct) elActivePct.textContent = `${calcPct(active)}%`;

  const elActiveBar = document.getElementById("kpi-active-bar");
  if (elActiveBar) elActiveBar.style.width = `${calcPct(active)}%`;

  // Rejected
  const elRejectedCount = document.getElementById("kpi-rejected-count");
  if (elRejectedCount) elRejectedCount.textContent = rejected.toLocaleString("vi-VN");

  const elRejectedPct = document.getElementById("kpi-rejected-percent");
  if (elRejectedPct) elRejectedPct.textContent = `${calcPct(rejected)}%`;

  const elRejectedBar = document.getElementById("kpi-rejected-bar");
  if (elRejectedBar) elRejectedBar.style.width = `${calcPct(rejected)}%`;

  // Inactive
  const elInactiveCount = document.getElementById("kpi-inactive-count");
  if (elInactiveCount) elInactiveCount.textContent = inactive.toLocaleString("vi-VN");

  const elInactivePct = document.getElementById("kpi-inactive-percent");
  if (elInactivePct) elInactivePct.textContent = `${calcPct(inactive)}%`;

  const elInactiveBar = document.getElementById("kpi-inactive-bar");
  if (elInactiveBar) elInactiveBar.style.width = `${calcPct(inactive)}%`;
}

/**
 * Render bảng danh sách tài khoản nhận tiền
 */
function renderPayoutAccountsList(items = []) {
  const tbody = document.getElementById("payout-accounts-table-body");
  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = "";
    return;
  }

  const rowsHtml = items
    .map((item) => {
      const statusInfo = payoutStatusMap[item.status] || {
        label: item.status,
        colorClass: "text-mid-gray",
        dotClass: "bg-mid-gray",
      };

      const user = item.user || {};
      const initials = getInitials(user.full_name);
      const userLink = `users.html?open_user_id=${item.user_id}`;

      return `
        <tr
          data-account-id="${item.id}"
          class="hover:bg-canvas/80 transition-colors cursor-pointer group"
        >
          <!-- ID -->
          <td class="py-3 px-4 font-mono font-medium text-ink">
            #${item.id}
          </td>

          <!-- Giảng viên -->
          <td class="py-3 px-4">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white font-semibold text-xs shadow-subtle">
                ${initials}
              </div>
              <div class="min-w-0 max-w-[180px]">
                <a
                  href="${userLink}"
                  onclick="event.stopPropagation();"
                  class="font-semibold text-ink hover:text-blue-600 truncate block transition-colors"
                  title="${user.full_name || 'N/A'}"
                >
                  ${user.full_name || 'N/A'}
                </a>
                <span class="text-[11px] text-mid-gray truncate block" title="${user.email || ''}">
                  ${user.email || 'N/A'}
                </span>
              </div>
            </div>
          </td>

          <!-- Nhà cung cấp -->
          <td class="py-3 px-4 font-medium text-ink whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-ink/40"></span>
              <span>${item.provider || 'N/A'}</span>
            </span>
          </td>

          <!-- Chủ tài khoản -->
          <td class="py-3 px-4 font-medium text-ink uppercase tracking-wide whitespace-nowrap">
            ${item.account_name || 'N/A'}
          </td>

          <!-- Số tài khoản (CHỈ MASKED NÀY CÓ TRONG HTML BẢNG) -->
          <td class="py-3 px-4 font-mono text-ink whitespace-nowrap font-medium">
            ${item.account_number_masked || '******'}
          </td>

          <!-- Trạng thái (Dấu chấm tròn, không badge pill nền màu) -->
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-2 text-xs font-semibold ${statusInfo.colorClass}">
              <span class="h-2 w-2 rounded-full ${statusInfo.dotClass}"></span>
              <span>${statusInfo.label}</span>
            </span>
          </td>

          <!-- Ngày kết nối -->
          <td class="py-3 px-4 text-mid-gray whitespace-nowrap">
            ${formatDateVN(item.connected_at || item.created_at)}
          </td>

          <!-- Cập nhật gần nhất -->
          <td class="py-3 px-4 text-mid-gray whitespace-nowrap">
            ${formatDateVN(item.updated_at || item.created_at)}
          </td>
        </tr>
      `;
    })
    .join("");

  tbody.innerHTML = rowsHtml;

  // Gắn sự kiện click dòng mở Drawer
  const rows = tbody.querySelectorAll("tr[data-account-id]");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const id = Number(row.getAttribute("data-account-id"));
      if (id) {
        openPayoutAccountDrawer(id, true);
      }
    });
  });
}

/**
 * Render thanh phân trang
 */
function renderPagination(meta = {}) {
  const current_page = meta.current_page || 1;
  const last_page = meta.last_page || 1;
  const per_page = meta.per_page || 20;
  const total = meta.total || 0;

  const start = total > 0 ? (current_page - 1) * per_page + 1 : 0;
  const end = Math.min(current_page * per_page, total);

  const elStart = document.getElementById("pag-start");
  if (elStart) elStart.textContent = start.toLocaleString("vi-VN");

  const elEnd = document.getElementById("pag-end");
  if (elEnd) elEnd.textContent = end.toLocaleString("vi-VN");

  const elTotal = document.getElementById("pag-total");
  if (elTotal) elTotal.textContent = total.toLocaleString("vi-VN");

  const nav = document.getElementById("pagination-nav");
  if (!nav) return;

  if (last_page <= 1) {
    nav.innerHTML = "";
    return;
  }

  let navHtml = "";

  // Nút Prev
  const prevDisabled = current_page === 1 ? "disabled" : "";
  navHtml += `
    <button
      type="button"
      data-page="${current_page - 1}"
      ${prevDisabled}
      class="h-8 px-2.5 rounded border border-hairline bg-paper text-xs font-medium text-ink hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      aria-label="Trang trước"
    >
      «
    </button>
  `;

  // Các trang số
  const maxButtons = 5;
  let startPage = Math.max(1, current_page - Math.floor(maxButtons / 2));
  let endPage = Math.min(last_page, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === current_page;
    const btnClass = isActive
      ? "bg-ink text-white font-bold border-ink"
      : "bg-paper text-ink border-hairline hover:bg-canvas font-medium";

    navHtml += `
      <button
        type="button"
        data-page="${i}"
        class="h-8 w-8 rounded border text-xs transition-colors ${btnClass}"
      >
        ${i}
      </button>
    `;
  }

  // Nút Next
  const nextDisabled = current_page === last_page ? "disabled" : "";
  navHtml += `
    <button
      type="button"
      data-page="${current_page + 1}"
      ${nextDisabled}
      class="h-8 px-2.5 rounded border border-hairline bg-paper text-xs font-medium text-ink hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      aria-label="Trang sau"
    >
      »
    </button>
  `;

  nav.innerHTML = navHtml;

  // Sự kiện click nút phân trang
  nav.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (btn.hasAttribute("disabled")) return;
      const targetPage = Number(btn.getAttribute("data-page"));
      if (targetPage && targetPage !== pageState.page) {
        pageState.page = targetPage;
        updateUrlState();
        loadPayoutAccountsData(true);
      }
    });
  });
}

/**
 * Cập nhật trạng thái nút Xóa Filter
 */
function updateResetFilterButtonState() {
  const btnReset = document.getElementById("btn-reset-filters");
  const activeCountContainer = document.getElementById("filter-active-count-container");
  const activeCountText = document.getElementById("filter-active-count-text");

  const hasFilter =
    pageState.search.trim() !== "" ||
    pageState.provider !== "all" ||
    pageState.status !== "all";

  if (btnReset) {
    btnReset.disabled = !hasFilter;
    if (hasFilter) {
      btnReset.classList.remove("opacity-50", "cursor-not-allowed");
      btnReset.classList.add("text-rose-600", "border-rose-300", "cursor-pointer");
    } else {
      btnReset.classList.add("opacity-50", "cursor-not-allowed");
      btnReset.classList.remove("text-rose-600", "border-rose-300", "cursor-pointer");
    }
  }

  if (activeCountContainer && activeCountText) {
    let count = 0;
    if (pageState.search.trim()) count++;
    if (pageState.provider !== "all") count++;
    if (pageState.status !== "all") count++;

    if (count > 0) {
      activeCountText.textContent = `${count} bộ lọc`;
      activeCountContainer.classList.remove("hidden");
    } else {
      activeCountContainer.classList.add("hidden");
    }
  }

  const btnClearSearch = document.getElementById("btn-clear-search");
  if (btnClearSearch) {
    if (pageState.search.trim()) {
      btnClearSearch.classList.remove("hidden");
    } else {
      btnClearSearch.classList.add("hidden");
    }
  }
}

/**
 * Tải dữ liệu chính cho trang
 */
export async function loadPayoutAccountsData(scrollToTable = false) {
  if (pageState.isLoading) return;
  pageState.isLoading = true;

  const loadingEl = document.getElementById("payout-accounts-loading");
  const errorEl = document.getElementById("payout-accounts-error");
  const emptyEl = document.getElementById("payout-accounts-empty");
  const tableBody = document.getElementById("payout-accounts-table-body");

  // Hiển thị Skeleton loading
  if (loadingEl) loadingEl.classList.remove("hidden");
  if (errorEl) errorEl.classList.add("hidden");
  if (emptyEl) emptyEl.classList.add("hidden");
  if (tableBody) tableBody.innerHTML = "";

  updateResetFilterButtonState();

  try {
    const res = await fetchPayoutAccounts({
      page: pageState.page,
      per_page: pageState.per_page,
      search: pageState.search,
      provider: pageState.provider,
      status: pageState.status,
    });

    if (loadingEl) loadingEl.classList.add("hidden");

    if (!res || !res.success) {
      if (errorEl) {
        errorEl.classList.remove("hidden");
        const msgDesc = document.getElementById("error-message-desc");
        if (msgDesc) msgDesc.textContent = res?.message || "Không thể truy xuất danh sách tài khoản.";
      }
      return;
    }

    const { summary, items } = res.data;
    const meta = res.meta;

    // Render Cards
    renderPayoutSummary(summary);

    // Check empty
    if (items.length === 0) {
      if (emptyEl) emptyEl.classList.remove("hidden");
    } else {
      renderPayoutAccountsList(items);
    }

    // Render Pagination
    renderPagination(meta);

    // Cập nhật thời gian
    const lastUpdateEl = document.getElementById("last-update-time");
    if (lastUpdateEl) {
      lastUpdateEl.textContent = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // Tự động mở drawer nếu URL có parameter open_payout_account_id
    if (pageState.open_payout_account_id) {
      openPayoutAccountDrawer(pageState.open_payout_account_id, false);
    }

    // Cuộn xuống bảng nếu người dùng tương tác card/filter
    if (scrollToTable) {
      const section = document.getElementById("payout-accounts-list-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách tài khoản nhận tiền:", err);
    if (loadingEl) loadingEl.classList.add("hidden");
    if (errorEl) errorEl.classList.remove("hidden");
  } finally {
    pageState.isLoading = false;
  }
}

/**
 * Mở Drawer chi tiết tài khoản nhận tiền
 */
export async function openPayoutAccountDrawer(id, updateUrl = true) {
  const drawer = document.getElementById("drawer-payout-account-detail");
  const backdrop = document.getElementById("drawer-backdrop");
  const panel = document.getElementById("drawer-panel");

  if (!drawer || !backdrop || !panel) return;

  if (updateUrl) {
    pageState.open_payout_account_id = id;
    updateUrlState();
  }

  // Mở overlay trước
  drawer.classList.remove("hidden");
  setTimeout(() => {
    backdrop.classList.remove("opacity-0");
    panel.classList.remove("translate-x-full");
  }, 10);

  // Hiển thị trạng thái đang tải trong drawer
  const drawerTitle = document.getElementById("drawer-title");
  if (drawerTitle) drawerTitle.textContent = `Tài khoản nhận tiền #${id}`;

  try {
    const res = await fetchPayoutAccountById(id);
    if (!res || !res.success || !res.data) {
      showToast("error", "Lỗi dữ liệu", res?.message || "Không tìm thấy chi tiết tài khoản.");
      closePayoutAccountDrawer();
      return;
    }

    const data = res.data;
    pageState.activeAccountForModal = data;

    // Fill Header
    const statusInfo = payoutStatusMap[data.status] || {
      label: data.status,
      colorClass: "text-mid-gray",
      dotClass: "bg-mid-gray",
    };

    const statusBadge = document.getElementById("drawer-status-badge");
    if (statusBadge) {
      statusBadge.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.colorClass} bg-canvas border border-hairline">
          <span class="h-2 w-2 rounded-full ${statusInfo.dotClass}"></span>
          <span>${statusInfo.label}</span>
        </span>
      `;
    }

    // Fill Thông tin Giảng viên
    const user = data.user || {};
    const initials = getInitials(user.full_name);

    const userAvatar = document.getElementById("drawer-user-avatar");
    if (userAvatar) userAvatar.textContent = initials;

    const userName = document.getElementById("drawer-user-name");
    if (userName) userName.textContent = user.full_name || "N/A";

    const userEmail = document.getElementById("drawer-user-email");
    if (userEmail) userEmail.textContent = user.email || "N/A";

    const linkUser = document.getElementById("drawer-link-user");
    if (linkUser) {
      linkUser.href = `users.html?open_user_id=${data.user_id}`;
    }

    // Fill Thông tin Tài khoản (FULL ACCOUNT NUMBER DISPLAYED ONLY HERE IN ADMIN DETAIL)
    const providerEl = document.getElementById("drawer-provider");
    if (providerEl) providerEl.textContent = data.provider || "N/A";

    const accNameEl = document.getElementById("drawer-account-name");
    if (accNameEl) accNameEl.textContent = data.account_name || "N/A";

    const accNumberEl = document.getElementById("drawer-account-number");
    if (accNumberEl) accNumberEl.textContent = data.account_number || data.account_number_masked || "N/A";

    const statusTextEl = document.getElementById("drawer-status-text");
    if (statusTextEl) statusTextEl.textContent = statusInfo.label;

    const createdAtEl = document.getElementById("drawer-created-at");
    if (createdAtEl) createdAtEl.textContent = formatDateVN(data.created_at);

    const connectedAtEl = document.getElementById("drawer-connected-at");
    if (connectedAtEl) connectedAtEl.textContent = formatDateVN(data.connected_at);

    const updatedAtEl = document.getElementById("drawer-updated-at");
    if (updatedAtEl) updatedAtEl.textContent = formatDateVN(data.updated_at);

    // Fill Thống kê
    const statCount = document.getElementById("drawer-stat-withdrawal-count");
    if (statCount) statCount.textContent = (data.withdrawal_count || 0).toLocaleString("vi-VN");

    const statPaid = document.getElementById("drawer-stat-total-paid");
    if (statPaid) statPaid.textContent = formatVND(data.total_paid_amount || 0);

    // Fill Danh sách Yêu cầu rút tiền gần nhất
    const withdrawalsContainer = document.getElementById("drawer-withdrawals-list");
    if (withdrawalsContainer) {
      const wList = data.related_withdrawals || [];
      if (wList.length === 0) {
        withdrawalsContainer.innerHTML = `<p class="text-xs text-mid-gray italic py-2">Chưa có yêu cầu rút tiền nào sử dụng tài khoản này.</p>`;
      } else {
        withdrawalsContainer.innerHTML = wList
          .slice(0, 5)
          .map(
            (w) => `
            <div class="flex items-center justify-between p-2.5 rounded-[6px] border border-hairline bg-canvas hover:bg-paper transition-colors text-xs">
              <div class="flex items-center gap-2">
                <a
                  href="withdrawals.html?open_withdrawal_id=${w.id}"
                  class="font-mono font-bold text-ink hover:text-blue-600 transition-colors"
                >
                  ${w.withdrawal_code}
                </a>
                <span class="text-[11px] text-mid-gray">${formatDateVN(w.requested_at)}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-bold text-ink">${formatVND(w.amount)}</span>
                <a
                  href="withdrawals.html?open_withdrawal_id=${w.id}"
                  class="text-[11px] font-medium text-ink hover:underline"
                >
                  Xem
                </a>
              </div>
            </div>
          `
          )
          .join("");
      }
    }

    // Fill Timeline
    const timelineContainer = document.getElementById("drawer-timeline");
    if (timelineContainer) {
      const tList = data.timeline || [];
      timelineContainer.innerHTML = tList
        .map((t) => {
          let dotBg = "bg-mid-gray";
          if (t.status === "success") dotBg = "bg-emerald-500";
          if (t.status === "warning") dotBg = "bg-amber-500";
          if (t.status === "error") dotBg = "bg-rose-500";
          if (t.status === "info") dotBg = "bg-blue-500";

          return `
            <div class="relative">
              <div class="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${dotBg} ring-4 ring-paper"></div>
              <div>
                <p class="text-xs font-bold text-ink">${t.title}</p>
                <p class="text-[11px] text-mid-gray mt-0.5">${t.description}</p>
                <span class="text-[10px] text-mid-gray/70 block mt-0.5">${formatDateVN(t.timestamp)}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    // Render Action Buttons theo đúng trạng thái contract
    const footer = document.getElementById("drawer-footer");
    if (footer) {
      if (data.status === "pending_verification") {
        footer.innerHTML = `
          <button
            type="button"
            id="btn-drawer-reject"
            class="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full text-xs font-semibold transition-colors"
          >
            Từ chối tài khoản
          </button>
          <button
            type="button"
            id="btn-drawer-approve"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            Duyệt tài khoản
          </button>
        `;

        document.getElementById("btn-drawer-approve")?.addEventListener("click", () => {
          openApproveModal(data);
        });

        document.getElementById("btn-drawer-reject")?.addEventListener("click", () => {
          openRejectModal(data);
        });
      } else if (data.status === "active") {
        footer.innerHTML = `
          <button
            type="button"
            id="btn-drawer-disable"
            class="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-full text-xs font-semibold transition-colors"
          >
            Vô hiệu hóa tài khoản
          </button>
        `;

        document.getElementById("btn-drawer-disable")?.addEventListener("click", () => {
          openDisableModal(data);
        });
      } else {
        footer.innerHTML = `
          <span class="text-xs text-mid-gray italic">
            Không có thao tác nào khả dụng cho trạng thái ${statusInfo.label.toLowerCase()}
          </span>
        `;
      }
    }
  } catch (err) {
    console.error("Lỗi khi mở drawer tài khoản nhận tiền:", err);
  }
}

/**
 * Đóng Drawer
 */
export function closePayoutAccountDrawer() {
  const drawer = document.getElementById("drawer-payout-account-detail");
  const backdrop = document.getElementById("drawer-backdrop");
  const panel = document.getElementById("drawer-panel");

  if (!drawer || !backdrop || !panel) return;

  backdrop.classList.add("opacity-0");
  panel.classList.add("translate-x-full");

  setTimeout(() => {
    drawer.classList.add("hidden");
    pageState.open_payout_account_id = null;
    updateUrlState();
  }, 300);
}

/**
 * Mở Modal Xác nhận Duyệt
 */
function openApproveModal(account) {
  pageState.activeAccountForModal = account;
  const modal = document.getElementById("modal-approve-account");
  if (!modal) return;

  const userEl = document.getElementById("approve-modal-user");
  if (userEl) userEl.textContent = account.user?.full_name || "N/A";

  const providerEl = document.getElementById("approve-modal-provider");
  if (providerEl) providerEl.textContent = account.provider || "N/A";

  const nameEl = document.getElementById("approve-modal-name");
  if (nameEl) nameEl.textContent = account.account_name || "N/A";

  const numEl = document.getElementById("approve-modal-number");
  if (numEl) numEl.textContent = account.account_number_masked || "******";

  modal.classList.remove("hidden");
}

/**
 * Mở Modal Xác nhận Từ chối
 */
function openRejectModal(account) {
  pageState.activeAccountForModal = account;
  const modal = document.getElementById("modal-reject-account");
  if (!modal) return;

  const userEl = document.getElementById("reject-modal-user");
  if (userEl) userEl.textContent = account.user?.full_name || "N/A";

  const providerEl = document.getElementById("reject-modal-provider");
  if (providerEl) providerEl.textContent = account.provider || "N/A";

  const nameEl = document.getElementById("reject-modal-name");
  if (nameEl) nameEl.textContent = account.account_name || "N/A";

  modal.classList.remove("hidden");
}

/**
 * Mở Modal Xác nhận Vô hiệu hóa
 */
function openDisableModal(account) {
  pageState.activeAccountForModal = account;
  const modal = document.getElementById("modal-disable-account");
  if (!modal) return;

  const userEl = document.getElementById("disable-modal-user");
  if (userEl) userEl.textContent = account.user?.full_name || "N/A";

  const accEl = document.getElementById("disable-modal-account");
  if (accEl) accEl.textContent = `${account.provider} (${account.account_number_masked})`;

  modal.classList.remove("hidden");
}

/**
 * Đóng toàn bộ Modals
 */
function closeAllModals() {
  const modals = document.querySelectorAll("#modal-approve-account, #modal-reject-account, #modal-disable-account");
  modals.forEach((m) => m.classList.add("hidden"));
}

/**
 * Đăng ký sự kiện tương tác UI
 */
function bindEvents() {
  // 1. Thẻ Summary Cards Click
  const cardTotal = document.getElementById("card-total-accounts");
  if (cardTotal) {
    cardTotal.addEventListener("click", () => {
      pageState.status = "all";
      pageState.page = 1;
      syncSelectsUI();
      updateUrlState();
      loadPayoutAccountsData(true);
    });
  }

  const cardPending = document.getElementById("card-pending-accounts");
  if (cardPending) {
    cardPending.addEventListener("click", () => {
      pageState.status = "pending_verification";
      pageState.page = 1;
      syncSelectsUI();
      updateUrlState();
      loadPayoutAccountsData(true);
    });
  }

  const cardActive = document.getElementById("card-active-accounts");
  if (cardActive) {
    cardActive.addEventListener("click", () => {
      pageState.status = "active";
      pageState.page = 1;
      syncSelectsUI();
      updateUrlState();
      loadPayoutAccountsData(true);
    });
  }

  const cardRejected = document.getElementById("card-rejected-accounts");
  if (cardRejected) {
    cardRejected.addEventListener("click", () => {
      pageState.status = "rejected";
      pageState.page = 1;
      syncSelectsUI();
      updateUrlState();
      loadPayoutAccountsData(true);
    });
  }

  const cardInactive = document.getElementById("card-inactive-accounts");
  if (cardInactive) {
    cardInactive.addEventListener("click", () => {
      pageState.status = "inactive";
      pageState.page = 1;
      syncSelectsUI();
      updateUrlState();
      loadPayoutAccountsData(true);
    });
  }

  // 2. Ô tìm kiếm với Debounce
  let searchTimer = null;
  const searchInput = document.getElementById("input-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        pageState.search = e.target.value;
        pageState.page = 1;
        updateUrlState();
        loadPayoutAccountsData(false);
      }, 300);
    });
  }

  const btnClearSearch = document.getElementById("btn-clear-search");
  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      pageState.search = "";
      pageState.page = 1;
      updateUrlState();
      loadPayoutAccountsData(false);
    });
  }

  // 3. Custom Select: Provider & Status
  const providerSelect = document.getElementById("select-provider");
  if (providerSelect) {
    providerSelect.addEventListener("change", (e) => {
      pageState.provider = e.target.value;
      pageState.page = 1;
      updateUrlState();
      loadPayoutAccountsData(false);
    });
  }

  const statusSelect = document.getElementById("select-status");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      pageState.status = e.target.value;
      pageState.page = 1;
      updateUrlState();
      loadPayoutAccountsData(false);
    });
  }

  // 4. Nút Xóa Filter (X nhỏ 40x40px)
  const btnReset = document.getElementById("btn-reset-filters");
  const btnEmptyReset = document.getElementById("btn-empty-reset");

  const resetFiltersAction = () => {
    pageState.search = "";
    pageState.provider = "all";
    pageState.status = "all";
    pageState.page = 1;

    if (searchInput) searchInput.value = "";
    syncSelectsUI();
    updateUrlState();
    loadPayoutAccountsData(false);
  };

  if (btnReset) btnReset.addEventListener("click", resetFiltersAction);
  if (btnEmptyReset) btnEmptyReset.addEventListener("click", resetFiltersAction);

  // 5. Select Per Page
  const perPageSelect = document.getElementById("select-per-page");
  if (perPageSelect) {
    perPageSelect.addEventListener("change", (e) => {
      pageState.per_page = Number(e.target.value) || 20;
      pageState.page = 1;
      updateUrlState();
      loadPayoutAccountsData(false);
    });
  }

  // 6. Nút Làm Mới Dữ Liệu
  const btnRefresh = document.getElementById("btn-refresh-data");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      const refreshIcon = document.getElementById("refresh-icon");
      if (refreshIcon) refreshIcon.classList.add("animate-spin");
      loadPayoutAccountsData(false).finally(() => {
        setTimeout(() => {
          if (refreshIcon) refreshIcon.classList.remove("animate-spin");
        }, 500);
      });
    });
  }

  // Nút thử lại khi lỗi
  const btnRetry = document.getElementById("btn-retry-fetch");
  if (btnRetry) {
    btnRetry.addEventListener("click", () => loadPayoutAccountsData(false));
  }

  // 7. Sự kiện Đóng Drawer
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", closePayoutAccountDrawer);

  const drawerBackdrop = document.getElementById("drawer-backdrop");
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closePayoutAccountDrawer);

  // 8. Sự kiện trong Modals
  document.querySelectorAll(".btn-cancel-modal, .modal-overlay").forEach((el) => {
    el.addEventListener("click", closeAllModals);
  });

  // Confirm Duyệt
  const btnConfirmApprove = document.getElementById("btn-confirm-approve");
  if (btnConfirmApprove) {
    btnConfirmApprove.addEventListener("click", async () => {
      const account = pageState.activeAccountForModal;
      if (!account) return;

      closeAllModals();
      try {
        const res = await approvePayoutAccountApi(account.id);
        if (res && res.success) {
          showToast("success", "Duyệt thành công", `Tài khoản #${account.id} đã được chuyển sang Đang hoạt động.`);
          loadPayoutAccountsData(false);
          openPayoutAccountDrawer(account.id, false);
        } else {
          showToast("error", "Duyệt thất bại", res?.message || "Không thể cập nhật trạng thái.");
        }
      } catch (err) {
        showToast("error", "Lỗi hệ thống", "Đã xảy ra lỗi khi duyệt tài khoản.");
      }
    });
  }

  // Confirm Từ chối
  const btnConfirmReject = document.getElementById("btn-confirm-reject");
  if (btnConfirmReject) {
    btnConfirmReject.addEventListener("click", async () => {
      const account = pageState.activeAccountForModal;
      if (!account) return;

      closeAllModals();
      try {
        const res = await rejectPayoutAccountApi(account.id);
        if (res && res.success) {
          showToast("success", "Từ chối thành công", `Tài khoản #${account.id} đã chuyển sang Đã từ chối.`);
          loadPayoutAccountsData(false);
          openPayoutAccountDrawer(account.id, false);
        } else {
          showToast("error", "Thao tác thất bại", res?.message || "Không thể từ chối tài khoản.");
        }
      } catch (err) {
        showToast("error", "Lỗi hệ thống", "Đã xảy ra lỗi khi từ chối tài khoản.");
      }
    });
  }

  // Confirm Vô hiệu hóa
  const btnConfirmDisable = document.getElementById("btn-confirm-disable");
  if (btnConfirmDisable) {
    btnConfirmDisable.addEventListener("click", async () => {
      const account = pageState.activeAccountForModal;
      if (!account) return;

      closeAllModals();
      try {
        const res = await disablePayoutAccountApi(account.id);
        if (res && res.success) {
          showToast("success", "Vô hiệu hóa thành công", `Tài khoản #${account.id} đã chuyển sang Đã vô hiệu hóa.`);
          loadPayoutAccountsData(false);
          openPayoutAccountDrawer(account.id, false);
        } else {
          showToast("error", "Thao tác thất bại", res?.message || "Không thể vô hiệu hóa tài khoản.");
        }
      } catch (err) {
        showToast("error", "Lỗi hệ thống", "Đã xảy ra lỗi khi vô hiệu hóa tài khoản.");
      }
    });
  }
}

/**
 * Đồng bộ Custom Selects UI
 */
function syncSelectsUI() {
  const providerSelect = document.getElementById("select-provider");
  if (providerSelect) {
    providerSelect.value = pageState.provider;
    providerSelect.dispatchEvent(new Event("change"));
  }

  const statusSelect = document.getElementById("select-status");
  if (statusSelect) {
    statusSelect.value = pageState.status;
    statusSelect.dispatchEvent(new Event("change"));
  }

  if (typeof window.initAllCustomSelects === "function") {
    window.initAllCustomSelects();
  }
}

/**
 * Khởi tạo trang
 */
document.addEventListener("DOMContentLoaded", () => {
  syncStateFromUrl();
  bindEvents();
  loadPayoutAccountsData(false);
});
