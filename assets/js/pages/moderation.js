import * as moderationApi from "../api/moderation-api.js";
import { showToast } from "../toast.js";

// Global page state
let pageState = {
  page: 1,
  per_page: 20,
  search: "",
  target_type: "all",
  status: "all",
  time_preset: "all",
  date_from: "",
  date_to: "",
  user_id: "",
  course_id: "",
  sort_by: "created_at",
  sort_direction: "desc",
  open_target_type: "",
  open_moderation_id: ""
};

// Active target item for modal confirm action
let activeActionItem = null;
let activeActionType = ""; // 'hide', 'delete', 'restore'

// Track refresh button animation rotation
let refreshRotation = 0;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Đã tải trang: Kiểm duyệt bình luận và đánh giá");

  readStateFromUrl();
  initFilterEvents();
  initSummaryCardEvents();
  initModalEvents();
  initDrawerEvents();
  initRefreshEvent();

  fetchAndRender().then(() => {
    if (pageState.open_target_type && pageState.open_moderation_id) {
      openModerationDrawer(pageState.open_target_type, pageState.open_moderation_id, false);
    }
  });
});

/**
 * Escapes HTML characters to prevent XSS attacks when rendering user content
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Formats ISO date time string to Vietnamese format (DD/MM/YYYY HH:MM)
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
 * Formats currency amount in VND
 */
function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(num) + "đ";
}

/**
 * Synchronizes page state from URL query params
 */
function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  pageState.page = Math.max(1, Number(params.get("page")) || 1);
  pageState.per_page = Math.max(1, Number(params.get("per_page")) || 20);
  pageState.search = params.get("search") || "";
  pageState.target_type = params.get("target_type") || "all";
  pageState.status = params.get("status") || "all";
  pageState.time_preset = params.get("time_preset") || "all";
  pageState.date_from = params.get("date_from") || "";
  pageState.date_to = params.get("date_to") || "";
  pageState.user_id = params.get("user_id") || "";
  pageState.course_id = params.get("course_id") || "";
  pageState.open_target_type = params.get("open_target_type") || "";
  pageState.open_moderation_id = params.get("open_moderation_id") || "";

  // Sync inputs
  const inputSearch = document.getElementById("filter-search");
  if (inputSearch) inputSearch.value = pageState.search;

  const selectTargetType = document.getElementById("filter-target-type");
  if (selectTargetType) selectTargetType.value = pageState.target_type;

  syncStatusSelectOptions(pageState.target_type);

  const selectStatus = document.getElementById("filter-status");
  if (selectStatus) selectStatus.value = pageState.status;

  const selectTimePreset = document.getElementById("filter-time-preset");
  if (selectTimePreset) selectTimePreset.value = pageState.time_preset;

  const dateContainer = document.getElementById("custom-date-container");
  if (pageState.time_preset === "custom") {
    if (dateContainer) dateContainer.classList.remove("hidden");
  } else {
    if (dateContainer) dateContainer.classList.add("hidden");
  }

  const inputDateFrom = document.getElementById("filter-date-from");
  if (inputDateFrom) inputDateFrom.value = pageState.date_from;

  const inputDateTo = document.getElementById("filter-date-to");
  if (inputDateTo) inputDateTo.value = pageState.date_to;

  const perPageSelect = document.getElementById("per-page-select");
  if (perPageSelect) perPageSelect.value = String(pageState.per_page);

  updateResetButtonState();
}

/**
 * Updates URL state without reloading page
 */
function updateUrlState() {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  const setOrDelete = (key, val, defaultVal = "") => {
    if (val && val !== defaultVal) {
      searchParams.set(key, val);
    } else {
      searchParams.delete(key);
    }
  };

  setOrDelete("page", pageState.page, 1);
  setOrDelete("per_page", pageState.per_page, 20);
  setOrDelete("search", pageState.search);
  setOrDelete("target_type", pageState.target_type, "all");
  setOrDelete("status", pageState.status, "all");
  setOrDelete("time_preset", pageState.time_preset, "all");
  setOrDelete("date_from", pageState.date_from);
  setOrDelete("date_to", pageState.date_to);
  setOrDelete("user_id", pageState.user_id);
  setOrDelete("course_id", pageState.course_id);
  setOrDelete("open_target_type", pageState.open_target_type);
  setOrDelete("open_moderation_id", pageState.open_moderation_id);

  window.history.replaceState({}, "", url.toString());
  updateResetButtonState();
}

/**
 * Enables or disables clear filters button based on active filters
 */
function updateResetButtonState() {
  const btnReset = document.getElementById("btn-reset-filters");
  if (!btnReset) return;

  const hasFilter =
    Boolean(pageState.search) ||
    (pageState.target_type && pageState.target_type !== "all") ||
    (pageState.status && pageState.status !== "all") ||
    (pageState.time_preset && pageState.time_preset !== "all") ||
    Boolean(pageState.date_from) ||
    Boolean(pageState.date_to) ||
    Boolean(pageState.user_id) ||
    Boolean(pageState.course_id);

  btnReset.disabled = !hasFilter;
}

/**
 * Dynamically adjusts options in status select dropdown.
 * Review target type MUST NOT have 'hidden' status!
 */
function syncStatusSelectOptions(targetType) {
  const selectStatus = document.getElementById("filter-status");
  if (!selectStatus) return;

  if (targetType === "review") {
    // If current status is hidden, reset to all
    if (pageState.status === "hidden") {
      pageState.status = "all";
    }
    selectStatus.innerHTML = `
      <option value="all">Tất cả trạng thái</option>
      <option value="visible">Đang hiển thị</option>
      <option value="deleted">Đã xóa</option>
    `;
  } else {
    selectStatus.innerHTML = `
      <option value="all">Tất cả trạng thái</option>
      <option value="visible">Đang hiển thị</option>
      <option value="hidden">Đã ẩn</option>
      <option value="deleted">Đã xóa</option>
    `;
  }

  // Set native select value
  selectStatus.value = pageState.status;

  // Trigger custom select update if custom-select library is active
  if (typeof window.initAllCustomSelects === "function") {
    window.initAllCustomSelects();
  }
}

/**
 * Main fetch & render function
 */
async function fetchAndRender() {
  try {
    showTableLoading();
    const response = await moderationApi.getModerationItems(pageState);

    if (response.success) {
      renderModerationSummary(response.data.summary);
      renderModerationItems(response.data.items);
      renderPagination(response.meta);
    } else {
      showToast({ type: "error", title: "Lỗi tải dữ liệu", message: response.message });
      showTableEmpty(response.message);
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách kiểm duyệt:", error);
    showToast({ type: "error", title: "Lỗi hệ thống", message: error.message || "Không thể kết nối dữ liệu." });
    showTableEmpty("Đã xảy ra lỗi khi tải dữ liệu.");
  }
}

/**
 * Render Summary Cards
 */
function renderModerationSummary(summary = {}) {
  const totalItemsEl = document.getElementById("summary-total-items");
  const totalDetailEl = document.getElementById("summary-total-detail");
  const commentsCountEl = document.getElementById("summary-comments-count");
  const commentsDetailEl = document.getElementById("summary-comments-detail");
  const commentsBarEl = document.getElementById("summary-comments-bar");
  const reviewsCountEl = document.getElementById("summary-reviews-count");
  const reviewsDetailEl = document.getElementById("summary-reviews-detail");
  const reviewsBarEl = document.getElementById("summary-reviews-bar");
  const actionCountEl = document.getElementById("summary-action-count");
  const actionDetailEl = document.getElementById("summary-action-detail");
  const actionBarEl = document.getElementById("summary-action-bar");

  if (totalItemsEl) totalItemsEl.textContent = summary.total_items ?? 0;
  if (totalDetailEl) {
    totalDetailEl.textContent = `${summary.total_comments ?? 0} bình luận • ${summary.total_reviews ?? 0} đánh giá`;
  }

  if (commentsCountEl) commentsCountEl.textContent = summary.total_comments ?? 0;
  if (commentsDetailEl) {
    commentsDetailEl.textContent = `${summary.visible_comments ?? 0} hiển thị • ${summary.hidden_comments ?? 0} ẩn • ${summary.deleted_comments ?? 0} đã xóa`;
  }
  if (commentsBarEl) {
    const pct = summary.total_items > 0 ? Math.round((summary.total_comments / summary.total_items) * 100) : 0;
    commentsBarEl.style.width = `${pct}%`;
  }

  if (reviewsCountEl) reviewsCountEl.textContent = summary.total_reviews ?? 0;
  if (reviewsDetailEl) {
    reviewsDetailEl.textContent = `Điểm trung bình ${summary.average_rating ?? "0.0"}/5`;
  }
  if (reviewsBarEl) {
    const pct = summary.total_items > 0 ? Math.round((summary.total_reviews / summary.total_items) * 100) : 0;
    reviewsBarEl.style.width = `${pct}%`;
  }

  if (actionCountEl) actionCountEl.textContent = summary.need_action_count ?? 0;
  if (actionDetailEl) {
    actionDetailEl.textContent = `${summary.hidden_comments ?? 0} bị ẩn • ${(summary.deleted_comments ?? 0) + (summary.deleted_reviews ?? 0)} đã xóa`;
  }
  if (actionBarEl) {
    const pct = summary.total_items > 0 ? Math.round((summary.need_action_count / summary.total_items) * 100) : 0;
    actionBarEl.style.width = `${pct}%`;
  }
}

/**
 * Renders Table Items
 */
function renderModerationItems(items = []) {
  const tbody = document.getElementById("moderation-table-body");
  const totalBadge = document.getElementById("table-total-badge");
  if (!tbody) return;

  if (totalBadge) totalBadge.textContent = items.length;

  if (!items || items.length === 0) {
    showTableEmpty("Không tìm thấy bình luận hoặc đánh giá nào phù hợp với bộ lọc.");
    return;
  }

  tbody.innerHTML = items
    .map((item) => {
      const isComment = item.target_type === "comment";
      const user = item.user;
      const course = item.course;
      const lesson = item.lesson;

      // Status indicator mapping (Dot + Text, NO heavy pills!)
      let statusHtml = "";
      if (item.status === "visible") {
        statusHtml = `<span class="inline-flex items-center gap-1.5 font-medium text-emerald-600"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>Đang hiển thị</span>`;
      } else if (item.status === "hidden") {
        statusHtml = `<span class="inline-flex items-center gap-1.5 font-medium text-amber-600"><span class="h-2 w-2 rounded-full bg-amber-500"></span>Đã ẩn</span>`;
      } else if (item.status === "deleted") {
        statusHtml = `<span class="inline-flex items-center gap-1.5 font-medium text-rose-600"><span class="h-2 w-2 rounded-full bg-rose-500"></span>Đã xóa</span>`;
      }

      // User avatar / initials fallback
      const initialChar = user && user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
      const avatarHtml = user && user.avatar_url
        ? `<img src="${escapeHtml(user.avatar_url)}" alt="${escapeHtml(user.full_name)}" class="h-7 w-7 rounded-full object-cover shrink-0">`
        : `<div class="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white font-semibold text-[11px] shrink-0">${initialChar}</div>`;

      // Target type badge
      const targetTypeBadge = isComment
        ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60"><svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Bình luận</span>`
        : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60"><svg class="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Đánh giá</span>`;

      // Rating column
      const ratingHtml = !isComment && item.rating
        ? `<span class="font-semibold text-amber-600 flex items-center justify-center gap-1">${item.rating}/5 <svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>`
        : `<span class="text-mid-gray/60 block text-center">-</span>`;

      // Reply badge if parent_id present
      const replyBadge = isComment && item.parent_id
        ? `<span class="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-1.5">Phản hồi</span>`
        : "";

      return `
        <tr data-target-type="${item.target_type}" data-id="${item.id}" class="hover:bg-canvas/80 transition-colors cursor-pointer group">
          <td class="py-3.5 px-4">
            ${targetTypeBadge}
          </td>
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-2.5">
              ${avatarHtml}
              <div class="min-w-0 flex-1">
                <a href="users.html?open_user_id=${item.user_id}" data-action="stop" class="font-medium text-ink hover:text-blue-600 transition-colors truncate block">
                  ${user ? escapeHtml(user.full_name) : "Người dùng #" + item.user_id}
                </a>
                <p class="text-[11px] text-mid-gray truncate">${user ? escapeHtml(user.email) : "---"}</p>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4">
            <div class="line-clamp-2 text-ink/90 leading-snug">
              ${replyBadge}${escapeHtml(item.content)}
            </div>
          </td>
          <td class="py-3.5 px-4">
            <div>
              <a href="courses.html?open_course_id=${item.course_id}" data-action="stop" class="font-medium text-ink hover:text-blue-600 transition-colors line-clamp-1">
                ${course ? escapeHtml(course.title) : "Khóa học #" + item.course_id}
              </a>
              ${lesson ? `<p class="text-[11px] text-mid-gray line-clamp-1 mt-0.5">${escapeHtml(lesson.title)}</p>` : ""}
            </div>
          </td>
          <td class="py-3.5 px-4 text-center">
            ${ratingHtml}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            ${statusHtml}
          </td>
          <td class="py-3.5 px-4 text-mid-gray whitespace-nowrap">
            ${formatDateTime(item.created_at)}
          </td>
        </tr>
      `;
    })
    .join("");

  // Attach click listeners to table rows and stopPropagation to inner links
  tbody.querySelectorAll("tr[data-id]").forEach((row) => {
    row.addEventListener("click", (e) => {
      const targetLink = e.target.closest("[data-action='stop']");
      if (targetLink) return; // Prevent drawer open when clicking user/course links

      const tType = row.getAttribute("data-target-type");
      const id = row.getAttribute("data-id");
      openModerationDrawer(tType, id);
    });
  });
}

/**
 * Renders Table Loading State
 */
function showTableLoading() {
  const tbody = document.getElementById("moderation-table-body");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="py-12 text-center text-mid-gray">
        <div class="flex flex-col items-center justify-center gap-2">
          <svg class="w-6 h-6 animate-spin text-ink/70" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-xs">Đang tải dữ liệu kiểm duyệt...</span>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Renders Table Empty State
 */
function showTableEmpty(message = "Không có dữ liệu.") {
  const tbody = document.getElementById("moderation-table-body");
  const totalBadge = document.getElementById("table-total-badge");
  if (totalBadge) totalBadge.textContent = "0";

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="py-12 text-center text-mid-gray">
        <div class="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-canvas border border-hairline text-mid-gray">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
          </div>
          <p class="text-xs md:text-sm font-medium text-ink">${escapeHtml(message)}</p>
          <p class="text-xs text-mid-gray">Hãy thử thay đổi điều kiện tìm kiếm hoặc xóa bộ lọc.</p>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Renders Pagination Controls (OUTSIDE table-scroll)
 */
function renderPagination(meta = {}) {
  const container = document.getElementById("pagination-container");
  if (!container) return;

  const currentPage = meta.current_page || 1;
  const lastPage = meta.last_page || 1;
  const total = meta.total || 0;
  const perPage = meta.per_page || 20;

  const startItem = total > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endItem = Math.min(total, currentPage * perPage);

  let pageButtonsHtml = "";
  for (let i = 1; i <= lastPage; i++) {
    if (
      i === 1 ||
      i === lastPage ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      const isActive = i === currentPage;
      pageButtonsHtml += `
        <button type="button" data-page="${i}" class="h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold transition-colors ${
          isActive
            ? "bg-ink text-white shadow-xs"
            : "border border-hairline bg-paper text-ink hover:bg-canvas"
        }">${i}</button>
      `;
    } else if (
      (i === 2 && currentPage > 3) ||
      (i === lastPage - 1 && currentPage < lastPage - 2)
    ) {
      pageButtonsHtml += `<span class="px-1 text-mid-gray">...</span>`;
    }
  }

  container.innerHTML = `
    <div class="text-xs text-mid-gray">
      Hiển thị <span class="font-semibold text-ink">${startItem}</span> - <span class="font-semibold text-ink">${endItem}</span> trên tổng <span class="font-semibold text-ink">${total}</span> mục
    </div>
    <div class="flex items-center gap-1.5">
      <button type="button" id="btn-page-prev" class="h-8 px-3 rounded-lg border border-hairline bg-paper text-xs font-medium text-ink hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer" ${
        currentPage <= 1 ? "disabled" : ""
      }>Trước</button>
      <div class="flex items-center gap-1 mx-1">
        ${pageButtonsHtml}
      </div>
      <button type="button" id="btn-page-next" class="h-8 px-3 rounded-lg border border-hairline bg-paper text-xs font-medium text-ink hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer" ${
        currentPage >= lastPage ? "disabled" : ""
      }>Sau</button>
    </div>
  `;

  // Attach pagination event handlers
  const prevBtn = container.querySelector("#btn-page-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (pageState.page > 1) {
        pageState.page--;
        updateUrlState();
        fetchAndRender();
      }
    });
  }

  const nextBtn = container.querySelector("#btn-page-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (pageState.page < lastPage) {
        pageState.page++;
        updateUrlState();
        fetchAndRender();
      }
    });
  }

  container.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = Number(btn.getAttribute("data-page"));
      if (p && p !== pageState.page) {
        pageState.page = p;
        updateUrlState();
        fetchAndRender();
      }
    });
  });
}

/**
 * Opens Item Detail Drawer by targetType & id
 */
async function openModerationDrawer(targetType, id, shouldScroll = false) {
  try {
    const response = await moderationApi.getModerationItemDetail(targetType, id);

    if (!response.success || !response.data) {
      showToast({ type: "error", title: "Không thể xem chi tiết", message: response.message });
      return;
    }

    const item = response.data;
    const isComment = item.target_type === "comment";

    pageState.open_target_type = item.target_type;
    pageState.open_moderation_id = String(item.id);
    updateUrlState();

    // Populate Drawer Header
    const drawerBadge = document.getElementById("drawer-target-badge");
    const drawerItemId = document.getElementById("drawer-item-id");
    const drawerStatusIndicator = document.getElementById("drawer-status-indicator");

    if (drawerBadge) {
      drawerBadge.textContent = isComment ? "Bình luận" : "Đánh giá";
      drawerBadge.className = isComment
        ? "px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200"
        : "px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200";
    }

    if (drawerItemId) drawerItemId.textContent = `ID: #${item.id}`;

    if (drawerStatusIndicator) {
      if (item.status === "visible") {
        drawerStatusIndicator.className = "text-xs font-semibold flex items-center gap-1.5 text-emerald-600";
        drawerStatusIndicator.innerHTML = `<span class="h-2 w-2 rounded-full bg-emerald-500"></span>Đang hiển thị công khai`;
      } else if (item.status === "hidden") {
        drawerStatusIndicator.className = "text-xs font-semibold flex items-center gap-1.5 text-amber-600";
        drawerStatusIndicator.innerHTML = `<span class="h-2 w-2 rounded-full bg-amber-500"></span>Bị ẩn khỏi giao diện`;
      } else if (item.status === "deleted") {
        drawerStatusIndicator.className = "text-xs font-semibold flex items-center gap-1.5 text-rose-600";
        drawerStatusIndicator.innerHTML = `<span class="h-2 w-2 rounded-full bg-rose-500"></span>Đã xóa (Lưu audit log)`;
      }
    }

    // Populate User Info
    const user = item.user;
    const avatarContainer = document.getElementById("drawer-user-avatar-container");
    const userNameLink = document.getElementById("drawer-user-name-link");
    const userEmail = document.getElementById("drawer-user-email");

    if (avatarContainer) {
      const initialChar = user && user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
      avatarContainer.innerHTML = user && user.avatar_url
        ? `<img src="${escapeHtml(user.avatar_url)}" alt="${escapeHtml(user.full_name)}" class="h-full w-full rounded-full object-cover">`
        : initialChar;
    }

    if (userNameLink) {
      userNameLink.textContent = user ? user.full_name : `Người dùng #${item.user_id}`;
      userNameLink.href = `users.html?open_user_id=${item.user_id}`;
    }

    if (userEmail) {
      userEmail.textContent = user ? user.email : "---";
    }

    // Populate Main Content Text (With HTML Escaping!)
    const contentText = document.getElementById("drawer-content-text");
    if (contentText) {
      contentText.innerHTML = escapeHtml(item.content);
    }

    // Populate Related Info
    const courseLink = document.getElementById("drawer-course-link");
    if (courseLink) {
      courseLink.textContent = item.course ? item.course.title : `Khóa học #${item.course_id}`;
      courseLink.href = `courses.html?open_course_id=${item.course_id}`;
    }

    const lessonRow = document.getElementById("drawer-lesson-row");
    const lessonTitle = document.getElementById("drawer-lesson-title");
    if (lessonRow && lessonTitle) {
      if (isComment && item.lesson) {
        lessonRow.classList.remove("hidden");
        lessonTitle.textContent = item.lesson.title;
      } else {
        lessonRow.classList.add("hidden");
      }
    }

    const parentRow = document.getElementById("drawer-parent-row");
    const parentText = document.getElementById("drawer-parent-text");
    if (parentRow && parentText) {
      if (isComment && item.parent) {
        parentRow.classList.remove("hidden");
        parentRow.classList.add("flex");
        parentText.textContent = item.parent.content;
      } else {
        parentRow.classList.add("hidden");
        parentRow.classList.remove("flex");
      }
    }

    const ratingRow = document.getElementById("drawer-rating-row");
    const ratingStars = document.getElementById("drawer-rating-stars");
    if (ratingRow && ratingStars) {
      if (!isComment && item.rating) {
        ratingRow.classList.remove("hidden");
        ratingRow.classList.add("flex");
        ratingStars.innerHTML = `${item.rating}/5 <svg class="w-4 h-4 fill-amber-400 text-amber-400 inline" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      } else {
        ratingRow.classList.add("hidden");
        ratingRow.classList.remove("flex");
      }
    }

    const createdAtEl = document.getElementById("drawer-created-at");
    if (createdAtEl) createdAtEl.textContent = formatDateTime(item.created_at);

    // Populate Order Proof (For Review)
    const orderProofSection = document.getElementById("drawer-order-proof-section");
    if (orderProofSection) {
      if (!isComment && item.order) {
        orderProofSection.classList.remove("hidden");
        const orderCodeLink = document.getElementById("drawer-order-code-link");
        const orderAmount = document.getElementById("drawer-order-amount");
        const orderStatus = document.getElementById("drawer-order-status");

        if (orderCodeLink) {
          orderCodeLink.textContent = item.order.order_code;
          orderCodeLink.href = `orders.html?open_order_id=${item.order.id}`;
        }
        if (orderAmount) orderAmount.textContent = formatCurrency(item.order.amount);
        if (orderStatus) {
          orderStatus.textContent = item.order.payment_status === "paid" ? "● Đã thanh toán thành công" : `● ${item.order.payment_status}`;
        }
      } else {
        orderProofSection.classList.add("hidden");
      }
    }

    // Populate Timeline
    const timelineContainer = document.getElementById("drawer-timeline-list");
    if (timelineContainer) {
      let timelineItems = [
        {
          time: formatDateTime(item.created_at),
          title: `Tạo ${isComment ? "bình luận" : "đánh giá"}`,
          desc: `Nội dung khởi tạo bởi ${user ? user.full_name : "người học"}.`,
          type: "info"
        }
      ];

      if (item.status === "hidden") {
        timelineItems.push({
          time: formatDateTime(item.updated_at),
          title: "Bị ẩn nội dung",
          desc: "Đã tạm ẩn khỏi trang học viên bởi quản trị viên.",
          type: "warning"
        });
      } else if (item.status === "deleted") {
        timelineItems.push({
          time: formatDateTime(item.deleted_at || item.updated_at),
          title: "Đã xóa nội dung (Soft Delete)",
          desc: "Nội dung bị xóa khỏi hệ thống công khai và lưu log audit.",
          type: "danger"
        });
      } else if (item.updated_at && item.updated_at !== item.created_at) {
        timelineItems.push({
          time: formatDateTime(item.updated_at),
          title: "Cập nhật / Khôi phục",
          desc: "Trạng thái hiển thị đã được khôi phục thành công.",
          type: "success"
        });
      }

      timelineContainer.innerHTML = timelineItems
        .map((t) => {
          let dotColor = "bg-blue-500";
          if (t.type === "warning") dotColor = "bg-amber-500";
          if (t.type === "danger") dotColor = "bg-rose-500";
          if (t.type === "success") dotColor = "bg-emerald-500";

          return `
            <div class="flex gap-3 text-xs">
              <div class="flex flex-col items-center">
                <span class="h-2 w-2 rounded-full ${dotColor} mt-1.5 shrink-0"></span>
                <span class="w-[1px] flex-1 bg-hairline my-1"></span>
              </div>
              <div class="pb-1">
                <p class="font-semibold text-ink">${t.title}</p>
                <p class="text-mid-gray mt-0.5">${t.desc}</p>
                <span class="text-[10px] text-mid-gray/70 mt-1 block">${t.time}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    // Populate Action Buttons (Strictly according to rules!)
    const actionsContainer = document.getElementById("drawer-actions-container");
    if (actionsContainer) {
      if (isComment) {
        if (item.status === "visible") {
          actionsContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-2">
              <button type="button" id="btn-action-hide" class="w-full py-2 px-3 text-xs font-semibold rounded-full border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                Ẩn bình luận
              </button>
              <button type="button" id="btn-action-delete" class="w-full py-2 px-3 text-xs font-semibold rounded-full border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                Xóa bình luận
              </button>
            </div>
          `;
        } else if (item.status === "hidden") {
          actionsContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-2">
              <button type="button" id="btn-action-restore" class="w-full py-2 px-3 text-xs font-semibold rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2.036 12c1.274-4.057 5.064-7 9.542-7 4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><circle cx="12" cy="12" r="3"/></svg>
                Hiển thị lại
              </button>
              <button type="button" id="btn-action-delete" class="w-full py-2 px-3 text-xs font-semibold rounded-full border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                Xóa bình luận
              </button>
            </div>
          `;
        } else if (item.status === "deleted") {
          actionsContainer.innerHTML = `
            <button type="button" id="btn-action-restore" class="w-full py-2.5 px-4 text-xs font-semibold rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              Khôi phục hiển thị bình luận
            </button>
          `;
        }
      } else {
        // Review (NO HIDDEN ACTION!)
        if (item.status === "visible") {
          actionsContainer.innerHTML = `
            <button type="button" id="btn-action-delete" class="w-full py-2.5 px-4 text-xs font-semibold rounded-full border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
              Xóa đánh giá
            </button>
          `;
        } else if (item.status === "deleted") {
          actionsContainer.innerHTML = `
            <button type="button" id="btn-action-restore" class="w-full py-2.5 px-4 text-xs font-semibold rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              Khôi phục hiển thị đánh giá
            </button>
          `;
        }
      }

      // Attach click handlers to action buttons
      const btnHide = actionsContainer.querySelector("#btn-action-hide");
      if (btnHide) {
        btnHide.addEventListener("click", () => openActionModal(item, "hide"));
      }
      const btnDelete = actionsContainer.querySelector("#btn-action-delete");
      if (btnDelete) {
        btnDelete.addEventListener("click", () => openActionModal(item, "delete"));
      }
      const btnRestore = actionsContainer.querySelector("#btn-action-restore");
      if (btnRestore) {
        btnRestore.addEventListener("click", () => openActionModal(item, "restore"));
      }
    }

    // Show Drawer Element
    const drawer = document.getElementById("moderation-drawer");
    const overlay = document.getElementById("drawer-overlay");

    if (drawer && overlay) {
      overlay.classList.remove("hidden");
      drawer.classList.remove("translate-x-full");
    }

    if (shouldScroll) {
      const section = document.getElementById("moderation-table-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  } catch (err) {
    console.error("Lỗi khi mở drawer chi tiết:", err);
    showToast({ type: "error", title: "Lỗi hiển thị", message: "Không thể nạp thông tin chi tiết." });
  }
}

/**
 * Closes Item Detail Drawer
 */
function closeModerationDrawer() {
  const drawer = document.getElementById("moderation-drawer");
  const overlay = document.getElementById("drawer-overlay");

  if (drawer && overlay) {
    drawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
  }

  pageState.open_target_type = "";
  pageState.open_moderation_id = "";
  updateUrlState();
}

/**
 * Opens Confirmation Modal before performing action
 */
function openActionModal(item, actionType) {
  activeActionItem = item;
  activeActionType = actionType;

  const modal = document.getElementById("moderation-action-modal");
  const modalTitle = document.getElementById("action-modal-title");
  const modalBody = document.getElementById("action-modal-body");
  const confirmBtn = document.getElementById("btn-modal-confirm");

  if (!modal || !modalTitle || !modalBody || !confirmBtn) return;

  const isComment = item.target_type === "comment";
  const itemTypeName = isComment ? "bình luận" : "đánh giá";
  const authorName = item.user ? item.user.full_name : `Người dùng #${item.user_id}`;
  const courseTitle = item.course ? item.course.title : `Khóa học #${item.course_id}`;

  if (actionType === "hide") {
    modalTitle.textContent = "Ẩn bình luận";
    confirmBtn.className = "px-4 py-2 text-xs font-semibold rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs cursor-pointer";
    confirmBtn.textContent = "Xác nhận ẩn";
    modalBody.innerHTML = `
      <div class="space-y-3">
        <p>Bạn có chắc chắn muốn <strong class="text-amber-600">ẩn bình luận này</strong> khỏi giao diện công khai?</p>
        <div class="p-3.5 rounded-xl border border-hairline bg-canvas/60 space-y-1.5">
          <p><span class="text-mid-gray">Người viết:</span> <strong>${escapeHtml(authorName)}</strong></p>
          <p><span class="text-mid-gray">Khóa học:</span> ${escapeHtml(courseTitle)}</p>
          <p class="italic text-mid-gray/90 line-clamp-2 mt-1 font-normal">"${escapeHtml(item.content)}"</p>
        </div>
        <p class="text-xs text-mid-gray flex items-center gap-1 text-amber-600">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          Bình luận sẽ bị ẩn đối với toàn bộ học viên nhưng vẫn giữ nguyên trong cơ sở dữ liệu.
        </p>
      </div>
    `;
  } else if (actionType === "delete") {
    modalTitle.textContent = `Xóa ${itemTypeName}`;
    confirmBtn.className = "px-4 py-2 text-xs font-semibold rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer";
    confirmBtn.textContent = `Xác nhận xóa ${itemTypeName}`;
    modalBody.innerHTML = `
      <div class="space-y-3">
        <p>Bạn có chắc chắn muốn <strong class="text-rose-600">xóa ${itemTypeName} này</strong>?</p>
        <div class="p-3.5 rounded-xl border border-hairline bg-canvas/60 space-y-1.5">
          <p><span class="text-mid-gray">Người viết:</span> <strong>${escapeHtml(authorName)}</strong></p>
          <p><span class="text-mid-gray">Khóa học:</span> ${escapeHtml(courseTitle)}</p>
          <p class="italic text-mid-gray/90 line-clamp-2 mt-1 font-normal">"${escapeHtml(item.content)}"</p>
        </div>
        <p class="text-xs text-rose-600 flex items-center gap-1">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          Hành động xóa mềm (soft delete) sẽ loại bỏ nội dung khỏi UI học viên và lưu lại audit log.
        </p>
      </div>
    `;
  } else if (actionType === "restore") {
    modalTitle.textContent = `Khôi phục ${itemTypeName}`;
    confirmBtn.className = "px-4 py-2 text-xs font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer";
    confirmBtn.textContent = `Khôi phục hiển thị`;
    modalBody.innerHTML = `
      <div class="space-y-3">
        <p>Bạn có muốn <strong class="text-emerald-600">khôi phục hiển thị ${itemTypeName} này</strong>?</p>
        <div class="p-3.5 rounded-xl border border-hairline bg-canvas/60 space-y-1.5">
          <p><span class="text-mid-gray">Người viết:</span> <strong>${escapeHtml(authorName)}</strong></p>
          <p><span class="text-mid-gray">Khóa học:</span> ${escapeHtml(courseTitle)}</p>
          <p class="italic text-mid-gray/90 line-clamp-2 mt-1 font-normal">"${escapeHtml(item.content)}"</p>
        </div>
        <p class="text-xs text-emerald-600 flex items-center gap-1">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          ${itemTypeName.toUpperCase()} sẽ hiển thị trở lại bình thường trên giao diện khóa học.
        </p>
      </div>
    `;
  }

  modal.classList.remove("hidden");
}

/**
 * Closes Action Modal
 */
function closeActionModal() {
  const modal = document.getElementById("moderation-action-modal");
  if (modal) modal.classList.add("hidden");
  activeActionItem = null;
  activeActionType = "";
}

/**
 * Executes moderate item action upon user confirmation
 */
async function executeModerateAction() {
  if (!activeActionItem || !activeActionType) return;

  const item = activeActionItem;
  let targetStatus = "visible";

  if (activeActionType === "hide") targetStatus = "hidden";
  if (activeActionType === "delete") targetStatus = "deleted";
  if (activeActionType === "restore") targetStatus = "visible";

  // Strict check: Review cannot transition to hidden!
  if (item.target_type === "review" && targetStatus === "hidden") {
    showToast({
      type: "error",
      title: "Thao tác không hợp lệ",
      message: "Đánh giá không hỗ trợ trạng thái bị ẩn (chỉ hỗ trợ Đang hiển thị hoặc Đã xóa)."
    });
    closeActionModal();
    return;
  }

  try {
    const result = await moderationApi.moderateItem(item.id, {
      target_type: item.target_type,
      status: targetStatus
    });

    closeActionModal();

    if (result.success) {
      showToast({
        type: "success",
        title: "Cập nhật thành công",
        message: result.message || "Đã cập nhật trạng thái kiểm duyệt thành công."
      });

      // Update UI components seamlessly without losing filter state
      await fetchAndRender();

      // Refresh drawer if open
      if (pageState.open_target_type && pageState.open_moderation_id) {
        openModerationDrawer(pageState.open_target_type, pageState.open_moderation_id, false);
      }
    } else {
      showToast({
        type: "error",
        title: "Không thể thực hiện",
        message: result.message || "Cập nhật thất bại."
      });
    }
  } catch (error) {
    console.error("Lỗi khi thực hiện thao tác kiểm duyệt:", error);
    closeActionModal();
    showToast({
      type: "error",
      title: "Lỗi hệ thống",
      message: error.message || "Đã xảy ra lỗi khi thực hiện thao tác."
    });
  }
}

/**
 * Handles Summary Card Clicks for quick filtering
 */
function handleSummaryCardClick(cardType) {
  if (cardType === "all") {
    pageState.target_type = "all";
    pageState.status = "all";
  } else if (cardType === "comment") {
    pageState.target_type = "comment";
    pageState.status = "all";
  } else if (cardType === "review") {
    pageState.target_type = "review";
    pageState.status = "all";
  } else if (cardType === "need_action") {
    pageState.target_type = "all";
    pageState.status = "hidden";
  }

  syncStatusSelectOptions(pageState.target_type);

  const selectTargetType = document.getElementById("filter-target-type");
  if (selectTargetType) selectTargetType.value = pageState.target_type;

  const selectStatus = document.getElementById("filter-status");
  if (selectStatus) selectStatus.value = pageState.status;

  pageState.page = 1;
  updateUrlState();
  fetchAndRender();

  // Smooth scroll down to table section on card click
  const section = document.getElementById("moderation-table-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Resets all filters to initial default state
 */
function resetFilters() {
  pageState.search = "";
  pageState.target_type = "all";
  pageState.status = "all";
  pageState.time_preset = "all";
  pageState.date_from = "";
  pageState.date_to = "";
  pageState.user_id = "";
  pageState.course_id = "";
  pageState.page = 1;

  const inputSearch = document.getElementById("filter-search");
  if (inputSearch) inputSearch.value = "";

  const selectTargetType = document.getElementById("filter-target-type");
  if (selectTargetType) selectTargetType.value = "all";

  syncStatusSelectOptions("all");

  const selectStatus = document.getElementById("filter-status");
  if (selectStatus) selectStatus.value = "all";

  const selectTimePreset = document.getElementById("filter-time-preset");
  if (selectTimePreset) selectTimePreset.value = "all";

  const dateContainer = document.getElementById("custom-date-container");
  if (dateContainer) dateContainer.classList.add("hidden");

  const inputDateFrom = document.getElementById("filter-date-from");
  if (inputDateFrom) inputDateFrom.value = "";

  const inputDateTo = document.getElementById("filter-date-to");
  if (inputDateTo) inputDateTo.value = "";

  if (typeof window.initAllCustomSelects === "function") {
    window.initAllCustomSelects();
  }

  updateUrlState();
  fetchAndRender();
}

/**
 * Initializes Filter Events
 */
function initFilterEvents() {
  const inputSearch = document.getElementById("filter-search");
  if (inputSearch) {
    let searchTimeout = null;
    inputSearch.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        pageState.search = e.target.value.trim();
        pageState.page = 1;
        updateUrlState();
        fetchAndRender();
      }, 300);
    });
  }

  const selectTargetType = document.getElementById("filter-target-type");
  if (selectTargetType) {
    selectTargetType.addEventListener("change", (e) => {
      pageState.target_type = e.target.value;
      syncStatusSelectOptions(pageState.target_type);
      pageState.page = 1;
      updateUrlState();
      fetchAndRender();
    });
  }

  const selectStatus = document.getElementById("filter-status");
  if (selectStatus) {
    selectStatus.addEventListener("change", (e) => {
      pageState.status = e.target.value;
      pageState.page = 1;
      updateUrlState();
      fetchAndRender();
    });
  }

  const selectTimePreset = document.getElementById("filter-time-preset");
  if (selectTimePreset) {
    selectTimePreset.addEventListener("change", (e) => {
      pageState.time_preset = e.target.value;
      const dateContainer = document.getElementById("custom-date-container");

      if (pageState.time_preset === "custom") {
        if (dateContainer) dateContainer.classList.remove("hidden");
      } else {
        if (dateContainer) dateContainer.classList.add("hidden");
        pageState.date_from = "";
        pageState.date_to = "";
      }

      pageState.page = 1;
      updateUrlState();
      fetchAndRender();
    });
  }

  const inputDateFrom = document.getElementById("filter-date-from");
  if (inputDateFrom) {
    inputDateFrom.addEventListener("change", (e) => {
      pageState.date_from = e.target.value;
      pageState.page = 1;
      updateUrlState();
      fetchAndRender();
    });
  }

  const inputDateTo = document.getElementById("filter-date-to");
  if (inputDateTo) {
    inputDateTo.addEventListener("change", (e) => {
      pageState.date_to = e.target.value;
      pageState.page = 1;
      updateUrlState();
      fetchAndRender();
    });
  }

  const btnReset = document.getElementById("btn-reset-filters");
  if (btnReset) {
    btnReset.addEventListener("click", () => resetFilters());
  }

  const perPageSelect = document.getElementById("per-page-select");
  if (perPageSelect) {
    perPageSelect.addEventListener("change", (e) => {
      pageState.per_page = Number(e.target.value) || 20;
      pageState.page = 1;
      updateUrlState();
      fetchAndRender();
    });
  }
}

/**
 * Initializes Summary Cards Click Events
 */
function initSummaryCardEvents() {
  document.querySelectorAll(".summary-card[data-card-type]").forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-card-type");
      handleSummaryCardClick(type);
    });
  });
}

/**
 * Initializes Modal Events
 */
function initModalEvents() {
  const modalCloseBtn = document.getElementById("btn-close-action-modal");
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeActionModal);

  const modalCancelBtn = document.getElementById("btn-modal-cancel");
  if (modalCancelBtn) modalCancelBtn.addEventListener("click", closeActionModal);

  const modalConfirmBtn = document.getElementById("btn-modal-confirm");
  if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", executeModerateAction);

  // Close modal when clicking background backdrop
  const modal = document.getElementById("moderation-action-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeActionModal();
    });
  }
}

/**
 * Initializes Drawer Events
 */
function initDrawerEvents() {
  const closeBtn = document.getElementById("btn-close-drawer");
  if (closeBtn) closeBtn.addEventListener("click", closeModerationDrawer);

  const overlay = document.getElementById("drawer-overlay");
  if (overlay) overlay.addEventListener("click", closeModerationDrawer);
}

/**
 * Initializes Page Refresh Button Event
 */
function initRefreshEvent() {
  const refreshBtn = document.getElementById("btn-refresh-page");
  const refreshIcon = document.getElementById("refresh-icon");

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      refreshRotation += 360;
      if (refreshIcon) {
        refreshIcon.style.transform = `rotate(${refreshRotation}deg)`;
      }

      fetchAndRender().then(() => {
        showToast({ type: "info", title: "Đã làm mới", message: "Dữ liệu kiểm duyệt đã được cập nhật." });
      });
    });
  }
}
