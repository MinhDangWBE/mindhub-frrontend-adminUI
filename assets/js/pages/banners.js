/**
 * MindHub Admin - JavaScript Logic cho Trang: Banner / Trang chủ
 * Đảm bảo đầy đủ nghiệp vụ, UX/UI, Validation, Filter state, Drawer, Modal và Responsive.
 */

import * as bannersApi from "../api/banners-api.js";
import { showToast } from "../toast.js";

// Mapping vị trí hiển thị (raw value -> tiếng Việt)
const positionMap = {
    home_top: "Đầu trang chủ",
    home_middle: "Giữa trang chủ",
    home_bottom: "Cuối trang chủ",
    sidebar: "Thanh bên"
};

// Mapping hiệu lực (effective status local / DB)
const effectiveStatusMap = {
    active: { label: "Đang hiển thị", colorClass: "text-emerald-600", dotClass: "bg-emerald-500" },
    scheduled: { label: "Sắp hiển thị", colorClass: "text-blue-600", dotClass: "bg-blue-500" },
    expired: { label: "Đã kết thúc", colorClass: "text-amber-600", dotClass: "bg-amber-500" },
    inactive: { label: "Đã tắt", colorClass: "text-mid-gray", dotClass: "bg-mid-gray" }
};

// Mapping trạng thái raw (DB status)
const statusMap = {
    active: { label: "Đang bật", colorClass: "text-emerald-600", dotClass: "bg-emerald-500" },
    inactive: { label: "Đã tắt", colorClass: "text-mid-gray", dotClass: "bg-mid-gray" }
};

// State hiện tại của trang
const state = {
    page: 1,
    per_page: 20,
    search: "",
    position: "all",
    status: "all",
    view_mode: "all",
    open_banner_id: null
};

// Item hiện tại lưu trong Modal / Drawer / Delete Modal
let activeBanner = null;
let currentModalMode = "create"; // "create" | "edit"
let searchTimeout = null;
let isSubmitting = false;

// Fallback SVG cho ảnh lỗi
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='100%25' height='100%25' fill='%2F%2Ff3f4f6'/%3E%3Cpath d='M350 200 L450 200 L400 150 Z' fill='%239ca3af'/%3E%3Ccircle cx='340' cy='150' r='20' fill='%239ca3af'/%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%236b7280'%3E%C3%8Fnh kh%C3%B4ng kh%E1%BA%A3 d%E1%BB%A5ng%3C%2Ftext%3E%3C%2Fsvg%3E";

/**
 * Escape HTML để chống XSS
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
 * Format ngày giờ hiển thị
 */
function formatDateTime(isoStr) {
    if (!isoStr) return "Không giới hạn";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "Không hợp lệ";

    const dateStr = d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const timeStr = d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });
    return `${dateStr} ${timeStr}`;
}

/**
 * Chuyển ISO 8601 sang định dạng datetime-local (YYYY-MM-THH:mm)
 */
function isoToDatetimeLocal(isoStr) {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";

    const pad = (n) => String(n).padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Chuyển datetime-local sang ISO 8601
 */
function datetimeLocalToIso(val) {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
}

/**
 * Khởi tạo khi trang sẵn sàng
 */
document.addEventListener("DOMContentLoaded", () => {
    readStateFromUrl();
    initFilterEvents();
    initSummaryCardEvents();
    initModalEvents();
    initDrawerEvents();
    initDeleteModalEvents();
    initPaginationEvents();

    fetchAndRender();
});

/**
 * Đọc query parameters từ URL
 */
function readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    state.page = Math.max(1, parseInt(params.get("page")) || 1);
    state.per_page = parseInt(params.get("per_page")) || 20;
    state.search = params.get("search") || "";
    state.position = params.get("position") || "all";
    state.status = params.get("status") || "all";
    state.view_mode = params.get("view_mode") || "all";
    state.open_banner_id = params.get("open_banner_id") || null;

    // Cập nhật giá trị vào các điều khiển lọc
    const inputSearch = document.getElementById("filter-search");
    if (inputSearch) inputSearch.value = state.search;

    const selectPosition = document.getElementById("filter-position");
    if (selectPosition) selectPosition.value = state.position;

    const selectStatus = document.getElementById("filter-status");
    if (selectStatus) selectStatus.value = state.status;

    const selectViewMode = document.getElementById("filter-view-mode");
    if (selectViewMode) selectViewMode.value = state.view_mode;

    const selectPerPage = document.getElementById("pag-per-page");
    if (selectPerPage) selectPerPage.value = state.per_page;

    updateResetButtonState();
}

/**
 * Đồng bộ state hiện tại lên URL
 */
function updateUrlState() {
    const url = new URL(window.location);
    url.search = "";

    if (state.page > 1) url.searchParams.set("page", state.page);
    if (state.per_page !== 20) url.searchParams.set("per_page", state.per_page);
    if (state.search) url.searchParams.set("search", state.search);
    if (state.position !== "all") url.searchParams.set("position", state.position);
    if (state.status !== "all") url.searchParams.set("status", state.status);
    if (state.view_mode !== "all") url.searchParams.set("view_mode", state.view_mode);
    if (state.open_banner_id) url.searchParams.set("open_banner_id", state.open_banner_id);

    window.history.pushState({}, "", url);
    updateResetButtonState();
}

/**
 * Cập nhật nút Reset filter X
 */
function updateResetButtonState() {
    const btnReset = document.getElementById("btn-reset-filters");
    if (!btnReset) return;

    const hasFilters = state.search !== "" || state.position !== "all" || state.status !== "all" || state.view_mode !== "all";
    btnReset.disabled = !hasFilters;
}

/**
 * Nạp dữ liệu từ API và render giao diện
 */
async function fetchAndRender() {
    toggleLoading(true);

    try {
        const response = await bannersApi.getBanners({
            page: state.page,
            per_page: state.per_page,
            search: state.search,
            position: state.position,
            status: state.status,
            view_mode: state.view_mode
        });

        if (!response || !response.success) {
            throw new Error(response?.message || "Lấy danh sách banner không thành công.");
        }

        const data = response.data || {};
        const summary = data.summary || {};
        const items = data.items || [];
        const meta = response.meta || { current_page: 1, last_page: 1, per_page: state.per_page, total: 0 };

        // 1. Render Summary Cards
        renderBannerSummary(summary);

        // 2. Kiểm tra empty / filter empty state
        const isFiltering = state.search !== "" || state.position !== "all" || state.status !== "all" || state.view_mode !== "all";

        if (meta.total === 0) {
            if (isFiltering) {
                showUIState("filter-empty");
            } else {
                showUIState("empty");
            }
            renderPagination(meta);
            toggleLoading(false);
            return;
        }

        // 3. Render danh sách
        showUIState("table");
        renderBanners(items);
        renderPagination(meta);

        // 4. Mở Drawer nếu có open_banner_id trong URL
        if (state.open_banner_id) {
            openBannerDrawer(state.open_banner_id, false);
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("scroll_to") === "results") {
            const targetSection = document.getElementById("banners-results-section");
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                const url = new URL(window.location.href);
                url.searchParams.delete("scroll_to");
                window.history.replaceState({}, "", url.toString());
            }
        }

    } catch (error) {
        console.error("Lỗi fetchAndRender:", error);
        showUIState("error", error.message || "Đã xảy ra lỗi kết nối với máy chủ.");
    } finally {
        toggleLoading(false);
    }
}

/**
 * Chuyển đổi trạng thái giao diện (loading/table/empty/filter-empty/error)
 */
function showUIState(stateType, errorMessage = "") {
    const loadingEl = document.getElementById("banners-loading-state");
    const emptyEl = document.getElementById("banners-empty-state");
    const filterEmptyEl = document.getElementById("banners-filter-empty-state");
    const errorEl = document.getElementById("banners-error-state");
    const tableWrapper = document.getElementById("banners-table-wrapper");
    const errorMsgEl = document.getElementById("error-state-message");

    if (loadingEl) loadingEl.classList.add("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");
    if (filterEmptyEl) filterEmptyEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");
    if (tableWrapper) tableWrapper.classList.add("hidden");

    if (stateType === "table" && tableWrapper) tableWrapper.classList.remove("hidden");
    else if (stateType === "empty" && emptyEl) emptyEl.classList.remove("hidden");
    else if (stateType === "filter-empty" && filterEmptyEl) filterEmptyEl.classList.remove("hidden");
    else if (stateType === "error" && errorEl) {
        errorEl.classList.remove("hidden");
        if (errorMsgEl) errorMsgEl.textContent = errorMessage;
    }
}

/**
 * Hiển thị / Ẩn loading skeleton
 */
function toggleLoading(isLoading) {
    const loadingEl = document.getElementById("banners-loading-state");
    const filterInputs = document.querySelectorAll("#filter-form input, #filter-form select, #filter-form button, #btn-refresh");

    filterInputs.forEach(el => {
        if (el.id !== "btn-reset-filters") {
            el.disabled = isLoading;
        }
    });

    if (isLoading && loadingEl) {
        const tableWrapper = document.getElementById("banners-table-wrapper");
        const emptyEl = document.getElementById("banners-empty-state");
        const filterEmptyEl = document.getElementById("banners-filter-empty-state");
        const errorEl = document.getElementById("banners-error-state");

        if (tableWrapper) tableWrapper.classList.add("hidden");
        if (emptyEl) emptyEl.classList.add("hidden");
        if (filterEmptyEl) filterEmptyEl.classList.add("hidden");
        if (errorEl) errorEl.classList.add("hidden");

        loadingEl.classList.remove("hidden");
    }
}

/**
 * Render thẻ tổng quan (KPI Summary)
 */
function renderBannerSummary(summary = {}) {
    const total = summary.total_banners || 0;
    const active = summary.active_count || 0;
    const scheduled = summary.scheduled_count || 0;
    const expired = summary.expired_count || 0;
    const inactive = summary.inactive_count || 0;

    const calcPct = (val) => (total > 0 ? ((val / total) * 100).toFixed(0) : 0);

    const elTotal = document.getElementById("summary-total");
    const elActive = document.getElementById("summary-active");
    const elActivePct = document.getElementById("summary-active-pct");
    const elActiveBar = document.getElementById("summary-active-bar");

    const elScheduled = document.getElementById("summary-scheduled");
    const elScheduledPct = document.getElementById("summary-scheduled-pct");
    const elScheduledBar = document.getElementById("summary-scheduled-bar");

    const elExpired = document.getElementById("summary-expired");
    const elExpiredPct = document.getElementById("summary-expired-pct");
    const elExpiredBar = document.getElementById("summary-expired-bar");

    const elInactive = document.getElementById("summary-inactive");
    const elInactivePct = document.getElementById("summary-inactive-pct");
    const elInactiveBar = document.getElementById("summary-inactive-bar");

    if (elTotal) elTotal.textContent = total;
    
    if (elActive) elActive.textContent = active;
    if (elActivePct) elActivePct.textContent = `${calcPct(active)}%`;
    if (elActiveBar) elActiveBar.style.width = `${calcPct(active)}%`;

    if (elScheduled) elScheduled.textContent = scheduled;
    if (elScheduledPct) elScheduledPct.textContent = `${calcPct(scheduled)}%`;
    if (elScheduledBar) elScheduledBar.style.width = `${calcPct(scheduled)}%`;

    if (elExpired) elExpired.textContent = expired;
    if (elExpiredPct) elExpiredPct.textContent = `${calcPct(expired)}%`;
    if (elExpiredBar) elExpiredBar.style.width = `${calcPct(expired)}%`;

    if (elInactive) elInactive.textContent = inactive;
    if (elInactivePct) elInactivePct.textContent = `${calcPct(inactive)}%`;
    if (elInactiveBar) elInactiveBar.style.width = `${calcPct(inactive)}%`;
}

/**
 * Render danh sách Banner vào Table
 */
function renderBanners(items = []) {
    const tbody = document.getElementById("banners-table-body");
    if (!tbody) return;

    if (!items.length) {
        tbody.innerHTML = "";
        return;
    }

    tbody.innerHTML = items.map(item => {
        const id = item.id;
        const title = escapeHtml(item.title);
        const imageUrl = escapeHtml(item.image_url);
        const targetUrl = item.target_url ? escapeHtml(item.target_url) : null;
        const positionLabel = escapeHtml(positionMap[item.position] || item.position);
        const sortOrder = Number(item.sort_order || 0);

        const startAtText = formatDateTime(item.start_at);
        const endAtText = formatDateTime(item.end_at);

        const eff = effectiveStatusMap[item.effective_status] || effectiveStatusMap.inactive;
        const rawStat = statusMap[item.status] || statusMap.inactive;

        const updatedDate = formatDateTime(item.updated_at);
        const [uDate, uTime] = updatedDate.includes(" ") ? updatedDate.split(" ") : [updatedDate, ""];

        return `
            <tr class="banner-row hover:bg-canvas/60 transition-colors cursor-pointer border-b border-hairline/60" data-banner-id="${id}">
                <!-- BANNER -->
                <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                        <div class="h-12 w-20 rounded-xl bg-canvas border border-hairline overflow-hidden shrink-0 relative group">
                            <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-semibold text-ink truncate text-sm" title="${title}">${title}</p>
                            ${
                                targetUrl
                                    ? `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="text-[11px] text-mid-gray hover:text-ink hover:underline truncate block mt-0.5" onclick="event.stopPropagation();" title="${targetUrl}">${targetUrl}</a>`
                                    : `<span class="text-[11px] text-mid-gray/60 italic block mt-0.5">Không có URL đích</span>`
                            }
                        </div>
                    </div>
                </td>

                <!-- VỊ TRÍ -->
                <td class="py-3 px-4">
                    <span class="text-xs font-medium text-ink truncate block">${positionLabel}</span>
                </td>

                <!-- THỨ TỰ -->
                <td class="py-3 px-4 text-center">
                    <span class="inline-block px-2 py-0.5 rounded-md bg-canvas border border-hairline text-xs font-semibold text-ink tabular-nums">${sortOrder}</span>
                </td>

                <!-- LỊCH HIỂN THỊ -->
                <td class="py-3 px-4">
                    <div class="text-[11px] space-y-0.5">
                        <div class="text-ink"><span class="text-mid-gray">Bắt đầu:</span> <span class="font-medium tabular-nums">${startAtText}</span></div>
                        <div class="text-ink"><span class="text-mid-gray">Kết thúc:</span> <span class="font-medium tabular-nums">${endAtText}</span></div>
                    </div>
                </td>

                <!-- HIỆU LỰC -->
                <td class="py-3 px-4">
                    <div class="inline-flex items-center gap-1.5 text-xs font-medium ${eff.colorClass}">
                        <span class="h-2 w-2 rounded-full ${eff.dotClass}"></span>
                        <span>${eff.label}</span>
                    </div>
                </td>

                <!-- TRẠNG THÁI -->
                <td class="py-3 px-4">
                    <div class="inline-flex items-center gap-1.5 text-xs font-medium ${rawStat.colorClass}">
                        <span class="h-2 w-2 rounded-full ${rawStat.dotClass}"></span>
                        <span>${rawStat.label}</span>
                    </div>
                </td>

                <!-- CẬP NHẬT -->
                <td class="py-3 px-4 text-right">
                    <div class="text-[11px] text-ink font-medium tabular-nums">${uDate}</div>
                    <div class="text-[10px] text-mid-gray tabular-nums">${uTime}</div>
                </td>
            </tr>
        `;
    }).join("");

    // Gắn sự kiện Row Click để mở Drawer
    const rows = tbody.querySelectorAll(".banner-row");
    rows.forEach(row => {
        row.addEventListener("click", () => {
            const id = row.getAttribute("data-banner-id");
            if (id) openBannerDrawer(id, true);
        });
    });
}

/**
 * Render điều khiển Phân trang (Pagination)
 */
function renderPagination(meta = {}) {
    const { current_page = 1, last_page = 1, per_page = 20, total = 0 } = meta;

    state.page = current_page;
    state.per_page = per_page;

    const elInfo = document.getElementById("pag-info-text");
    const btnPrev = document.getElementById("pag-prev-btn");
    const btnNext = document.getElementById("pag-next-btn");
    const elNumbers = document.getElementById("pag-numbers");

    if (total === 0) {
        if (elInfo) elInfo.textContent = "0 banner";
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;
        if (elNumbers) elNumbers.innerHTML = "";
        return;
    }

    const startItem = (current_page - 1) * per_page + 1;
    const endItem = Math.min(current_page * per_page, total);
    if (elInfo) elInfo.textContent = `${startItem} - ${endItem} trong ${total} banner`;

    if (btnPrev) btnPrev.disabled = current_page <= 1;
    if (btnNext) btnNext.disabled = current_page >= last_page;

    if (!elNumbers) return;

    // Render số trang
    let pages = [];
    if (last_page <= 5) {
        for (let i = 1; i <= last_page; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current_page > 3) pages.push("...");
        const startP = Math.max(2, current_page - 1);
        const endP = Math.min(last_page - 1, current_page + 1);
        for (let i = startP; i <= endP; i++) pages.push(i);
        if (current_page < last_page - 2) pages.push("...");
        pages.push(last_page);
    }

    elNumbers.innerHTML = pages.map(p => {
        if (p === "...") {
            return `<span class="px-2 text-xs text-mid-gray">...</span>`;
        }
        const isActive = p === current_page;
        return `
            <button type="button" class="pag-num-btn h-8 w-8 rounded-lg border border-hairline text-xs font-medium transition-colors ${
                isActive ? "bg-ink text-white font-semibold" : "bg-paper text-ink hover:bg-canvas"
            }" data-page="${p}">
                ${p}
            </button>
        `;
    }).join("");

    elNumbers.querySelectorAll(".pag-num-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const p = parseInt(btn.getAttribute("data-page"));
            if (p && p !== state.page) {
                state.page = p;
                updateUrlState();
                fetchAndRender();
            }
        });
    });
}

/**
 * Khởi tạo sự kiện Bộ lọc & Tìm kiếm
 */
function initFilterEvents() {
    const inputSearch = document.getElementById("filter-search");
    const selectPosition = document.getElementById("filter-position");
    const selectStatus = document.getElementById("filter-status");
    const selectViewMode = document.getElementById("filter-view-mode");
    const btnReset = document.getElementById("btn-reset-filters");
    const btnRefresh = document.getElementById("btn-refresh");

    if (inputSearch) {
        inputSearch.addEventListener("input", () => {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                state.search = inputSearch.value.trim();
                state.page = 1;
                updateUrlState();
                fetchAndRender();
            }, 300);
        });
    }

    if (selectPosition) {
        selectPosition.addEventListener("change", () => {
            state.position = selectPosition.value;
            state.page = 1;
            updateUrlState();
            fetchAndRender();
        });
    }

    if (selectStatus) {
        selectStatus.addEventListener("change", () => {
            state.status = selectStatus.value;
            state.page = 1;
            updateUrlState();
            fetchAndRender();
        });
    }

    if (selectViewMode) {
        selectViewMode.addEventListener("change", () => {
            state.view_mode = selectViewMode.value;
            state.page = 1;
            updateUrlState();
            fetchAndRender();
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            resetFilters();
        });
    }

    const btnEmptyReset = document.getElementById("btn-empty-reset-filter");
    if (btnEmptyReset) {
        btnEmptyReset.addEventListener("click", () => {
            resetFilters();
        });
    }

    if (btnRefresh) {
        btnRefresh.addEventListener("click", () => {
            fetchAndRender();
            showToast("Đã làm mới dữ liệu.", "info");
        });
    }

    const btnRetry = document.getElementById("btn-error-retry");
    if (btnRetry) {
        btnRetry.addEventListener("click", () => {
            fetchAndRender();
        });
    }
}

/**
 * Reset tất cả bộ lọc về mặc định
 */
function resetFilters() {
    state.search = "";
    state.position = "all";
    state.status = "all";
    state.view_mode = "all";
    state.page = 1;

    const inputSearch = document.getElementById("filter-search");
    const selectPosition = document.getElementById("filter-position");
    const selectStatus = document.getElementById("filter-status");
    const selectViewMode = document.getElementById("filter-view-mode");

    if (inputSearch) inputSearch.value = "";
    if (selectPosition) selectPosition.value = "all";
    if (selectStatus) selectStatus.value = "all";
    if (selectViewMode) selectViewMode.value = "all";

    updateUrlState();
    fetchAndRender();
}

/**
 * Khởi tạo sự kiện Click trên KPI Summary Cards để lọc nhanh
 */
function initSummaryCardEvents() {
    const cardTotal = document.getElementById("kpi-card-total");
    const cardActive = document.getElementById("kpi-card-active");
    const cardScheduled = document.getElementById("kpi-card-scheduled");
    const cardExpired = document.getElementById("kpi-card-expired");
    const cardInactive = document.getElementById("kpi-card-inactive");

    const selectStatus = document.getElementById("filter-status");
    const selectViewMode = document.getElementById("filter-view-mode");

    if (cardTotal) {
        cardTotal.addEventListener("click", () => {
            resetFilters();
        });
    }

    if (cardActive) {
        cardActive.addEventListener("click", () => {
            state.view_mode = "active";
            state.status = "all";
            state.page = 1;
            if (selectViewMode) selectViewMode.value = "active";
            if (selectStatus) selectStatus.value = "all";
            updateUrlState();
            fetchAndRender();
        });
    }

    if (cardScheduled) {
        cardScheduled.addEventListener("click", () => {
            state.view_mode = "scheduled";
            state.status = "all";
            state.page = 1;
            if (selectViewMode) selectViewMode.value = "scheduled";
            if (selectStatus) selectStatus.value = "all";
            updateUrlState();
            fetchAndRender();
        });
    }

    if (cardExpired) {
        cardExpired.addEventListener("click", () => {
            state.view_mode = "expired";
            state.status = "all";
            state.page = 1;
            if (selectViewMode) selectViewMode.value = "expired";
            if (selectStatus) selectStatus.value = "all";
            updateUrlState();
            fetchAndRender();
        });
    }

    if (cardInactive) {
        cardInactive.addEventListener("click", () => {
            state.status = "inactive";
            state.view_mode = "all";
            state.page = 1;
            if (selectStatus) selectStatus.value = "inactive";
            if (selectViewMode) selectViewMode.value = "all";
            updateUrlState();
            fetchAndRender();
        });
    }
}

/**
 * Khởi tạo sự kiện Phân trang
 */
function initPaginationEvents() {
    const selectPerPage = document.getElementById("pag-per-page");
    const btnPrev = document.getElementById("pag-prev-btn");
    const btnNext = document.getElementById("pag-next-btn");

    if (selectPerPage) {
        selectPerPage.addEventListener("change", () => {
            state.per_page = parseInt(selectPerPage.value) || 20;
            state.page = 1;
            updateUrlState();
            fetchAndRender();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (state.page > 1) {
                state.page--;
                updateUrlState();
                fetchAndRender();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            state.page++;
            updateUrlState();
            fetchAndRender();
        });
    }
}

/**
 * Quản lý Drawer Chi tiết Banner
 */
async function openBannerDrawer(id, updateUrl = true) {
    const drawer = document.getElementById("banner-drawer");
    const backdrop = document.getElementById("banner-drawer-backdrop");
    if (!drawer || !backdrop) return;

    try {
        const response = await bannersApi.getBannerDetail(id);
        if (!response || !response.success || !response.data) {
            showToast(response?.message || "Không tìm thấy chi tiết banner.", "error");
            closeBannerDrawer();
            return;
        }

        activeBanner = response.data;
        state.open_banner_id = activeBanner.id;
        if (updateUrl) updateUrlState();

        // Điền dữ liệu vào Drawer
        const elBannerId = document.getElementById("drawer-banner-id");
        const elBannerTitle = document.getElementById("drawer-banner-title");
        const elPreviewImg = document.getElementById("drawer-preview-img");
        const elLinkImage = document.getElementById("drawer-link-image");
        const elLinkTarget = document.getElementById("drawer-link-target");

        const elInfoId = document.getElementById("drawer-info-id");
        const elInfoPosition = document.getElementById("drawer-info-position");
        const elInfoSort = document.getElementById("drawer-info-sort");
        const elInfoRawStatus = document.getElementById("drawer-info-raw-status");
        const elInfoEffective = document.getElementById("drawer-info-effective");
        const elInfoTargetUrl = document.getElementById("drawer-info-target-url");

        const elScheduleStart = document.getElementById("drawer-schedule-start");
        const elScheduleEnd = document.getElementById("drawer-schedule-end");
        const elScheduleStatus = document.getElementById("drawer-schedule-status");

        const elTimeCreated = document.getElementById("drawer-time-created");
        const elTimeUpdated = document.getElementById("drawer-time-updated");

        const btnToggleStatus = document.getElementById("drawer-btn-toggle-status");

        if (elBannerId) elBannerId.textContent = `#${activeBanner.id}`;
        if (elBannerTitle) elBannerTitle.textContent = activeBanner.title;

        if (elPreviewImg) {
            elPreviewImg.src = activeBanner.image_url;
            elPreviewImg.onerror = () => {
                elPreviewImg.onerror = null;
                elPreviewImg.src = FALLBACK_IMAGE;
            };
        }

        if (elLinkImage) elLinkImage.href = activeBanner.image_url;

        if (elLinkTarget) {
            if (activeBanner.target_url) {
                elLinkTarget.href = activeBanner.target_url;
                elLinkTarget.classList.remove("hidden");
            } else {
                elLinkTarget.classList.add("hidden");
            }
        }

        if (elInfoId) elInfoId.textContent = activeBanner.id;
        if (elInfoPosition) elInfoPosition.textContent = positionMap[activeBanner.position] || activeBanner.position;
        if (elInfoSort) elInfoSort.textContent = activeBanner.sort_order;

        const rawStat = statusMap[activeBanner.status] || statusMap.inactive;
        if (elInfoRawStatus) elInfoRawStatus.textContent = rawStat.label;

        const eff = effectiveStatusMap[activeBanner.effective_status] || effectiveStatusMap.inactive;
        if (elInfoEffective) {
            elInfoEffective.innerHTML = `
                <div class="inline-flex items-center gap-1.5 text-xs font-semibold ${eff.colorClass}">
                    <span class="h-2 w-2 rounded-full ${eff.dotClass}"></span>
                    <span>${eff.label}</span>
                </div>
            `;
        }

        if (elInfoTargetUrl) {
            elInfoTargetUrl.textContent = activeBanner.target_url || "Không có URL đích";
        }

        if (elScheduleStart) elScheduleStart.textContent = formatDateTime(activeBanner.start_at);
        if (elScheduleEnd) elScheduleEnd.textContent = formatDateTime(activeBanner.end_at);

        let schedText = "Không giới hạn";
        if (activeBanner.effective_status === "scheduled") schedText = "Chưa bắt đầu";
        else if (activeBanner.effective_status === "active") schedText = "Đang chạy";
        else if (activeBanner.effective_status === "expired") schedText = "Đã kết thúc";
        else if (activeBanner.effective_status === "inactive") schedText = "Đã tắt";

        if (elScheduleStatus) elScheduleStatus.textContent = schedText;

        if (elTimeCreated) elTimeCreated.textContent = formatDateTime(activeBanner.created_at);
        if (elTimeUpdated) elTimeUpdated.textContent = formatDateTime(activeBanner.updated_at);

        // Nút Bật/Tắt trong Drawer
        if (btnToggleStatus) {
            if (activeBanner.status === "active") {
                btnToggleStatus.textContent = "Tắt banner";
                btnToggleStatus.className = "h-9 px-4 rounded-full border border-hairline bg-paper text-ink hover:bg-canvas text-xs font-medium transition-colors";
            } else {
                btnToggleStatus.textContent = "Bật banner";
                btnToggleStatus.className = "h-9 px-4 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium transition-colors";
            }
        }

        // Hiển thị Drawer
        backdrop.classList.remove("opacity-0", "pointer-events-none");
        drawer.classList.remove("translate-x-full");

    } catch (error) {
        console.error("Lỗi khi mở Drawer:", error);
        showToast(error.message || "Không thể tải chi tiết banner.", "error");
        closeBannerDrawer();
    }
}

/**
 * Đóng Drawer Chi tiết
 */
function closeBannerDrawer() {
    const drawer = document.getElementById("banner-drawer");
    const backdrop = document.getElementById("banner-drawer-backdrop");
    if (!drawer || !backdrop) return;

    drawer.classList.add("translate-x-full");
    backdrop.classList.add("opacity-0", "pointer-events-none");

    state.open_banner_id = null;
    updateUrlState();
}

/**
 * Khởi tạo sự kiện Drawer
 */
function initDrawerEvents() {
    const closeBtn = document.getElementById("drawer-close-btn");
    const backdrop = document.getElementById("banner-drawer-backdrop");

    const btnEdit = document.getElementById("drawer-btn-edit");
    const btnToggleStatus = document.getElementById("drawer-btn-toggle-status");
    const btnDelete = document.getElementById("drawer-btn-delete");

    if (closeBtn) closeBtn.addEventListener("click", closeBannerDrawer);
    if (backdrop) backdrop.addEventListener("click", closeBannerDrawer);

    if (btnEdit) {
        btnEdit.addEventListener("click", () => {
            if (activeBanner) {
                openBannerModal("edit", activeBanner);
            }
        });
    }

    if (btnToggleStatus) {
        btnToggleStatus.addEventListener("click", () => {
            if (activeBanner) {
                toggleBannerStatusAction(activeBanner);
            }
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener("click", () => {
            if (activeBanner) {
                openDeleteModal(activeBanner);
            }
        });
    }
}

/**
 * Mở Modal Tạo / Chỉnh sửa Banner
 */
function openBannerModal(mode = "create", item = null) {
    currentModalMode = mode;
    activeBanner = item;

    const modal = document.getElementById("banner-modal");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("banner-form");

    if (!modal || !form) return;

    clearModalErrors();

    const inputId = document.getElementById("form-banner-id");
    const inputTitle = document.getElementById("form-title");
    const inputImageUrl = document.getElementById("form-image-url");
    const inputTargetUrl = document.getElementById("form-target-url");
    const selectPosition = document.getElementById("form-position");
    const inputSortOrder = document.getElementById("form-sort-order");
    const inputStartAt = document.getElementById("form-start-at");
    const inputEndAt = document.getElementById("form-end-at");
    const selectStatus = document.getElementById("form-status");

    if (mode === "edit" && item) {
        if (modalTitle) modalTitle.textContent = `Chỉnh sửa banner #${item.id}`;
        if (inputId) inputId.value = item.id;
        if (inputTitle) inputTitle.value = item.title;
        if (inputImageUrl) inputImageUrl.value = item.image_url;
        if (inputTargetUrl) inputTargetUrl.value = item.target_url || "";
        if (selectPosition) selectPosition.value = item.position;
        if (inputSortOrder) inputSortOrder.value = item.sort_order;
        if (inputStartAt) inputStartAt.value = isoToDatetimeLocal(item.start_at);
        if (inputEndAt) inputEndAt.value = isoToDatetimeLocal(item.end_at);
        if (selectStatus) selectStatus.value = item.status;
    } else {
        if (modalTitle) modalTitle.textContent = "Tạo banner mới";
        form.reset();
        if (inputId) inputId.value = "";
        if (selectPosition) selectPosition.value = "home_top";
        if (inputSortOrder) inputSortOrder.value = 0;
        if (selectStatus) selectStatus.value = "active";
    }

    updateModalImagePreview();
    modal.classList.remove("hidden");
}

/**
 * Đóng Modal Tạo / Chỉnh sửa
 */
function closeBannerModal() {
    const modal = document.getElementById("banner-modal");
    if (modal) modal.classList.add("hidden");
}

/**
 * Cập nhật xem trước hình ảnh trong Modal
 */
function updateModalImagePreview() {
    const inputImageUrl = document.getElementById("form-image-url");
    const imgPreview = document.getElementById("modal-image-preview");
    const placeholder = document.getElementById("modal-image-placeholder");

    if (!inputImageUrl || !imgPreview || !placeholder) return;

    const url = inputImageUrl.value.trim();
    if (url) {
        imgPreview.src = url;
        imgPreview.classList.remove("hidden");
        placeholder.classList.add("hidden");

        imgPreview.onerror = () => {
            imgPreview.onerror = null;
            imgPreview.src = FALLBACK_IMAGE;
        };
    } else {
        imgPreview.classList.add("hidden");
        placeholder.classList.remove("hidden");
    }
}

/**
 * Khởi tạo sự kiện cho Modal
 */
function initModalEvents() {
    const btnCreate = document.getElementById("btn-create-banner");
    const btnEmptyCreate = document.getElementById("btn-empty-create");
    const closeBtn = document.getElementById("modal-close-btn");
    const btnCancel = document.getElementById("modal-btn-cancel");
    const btnSubmit = document.getElementById("modal-btn-submit");
    const inputImageUrl = document.getElementById("form-image-url");

    if (btnCreate) btnCreate.addEventListener("click", () => openBannerModal("create"));
    if (btnEmptyCreate) btnEmptyCreate.addEventListener("click", () => openBannerModal("create"));

    if (closeBtn) closeBtn.addEventListener("click", closeBannerModal);
    if (btnCancel) btnCancel.addEventListener("click", closeBannerModal);

    if (inputImageUrl) {
        inputImageUrl.addEventListener("input", updateModalImagePreview);
        inputImageUrl.addEventListener("blur", updateModalImagePreview);
    }

    if (btnSubmit) {
        btnSubmit.addEventListener("click", handleModalSubmit);
    }
}

/**
 * Xóa thông báo lỗi cũ trên Modal
 */
function clearModalErrors() {
    const errorSpans = document.querySelectorAll("#banner-form [id^='error-']");
    errorSpans.forEach(span => {
        span.textContent = "";
        span.classList.add("hidden");
    });
}

/**
 * Hiển thị lỗi bên dưới trường nhập trên Modal
 */
function setFieldError(fieldId, message) {
    const span = document.getElementById(`error-${fieldId}`);
    if (span) {
        span.textContent = message;
        span.classList.remove("hidden");
    }
}

/**
 * Validate dữ liệu form Banner client-side
 */
function validateBannerForm(formData) {
    clearModalErrors();
    let isValid = true;

    // Title
    if (!formData.title) {
        setFieldError("title", "Tiêu đề banner là bắt buộc.");
        isValid = false;
    } else if (formData.title.length > 255) {
        setFieldError("title", "Tiêu đề banner tối đa 255 ký tự.");
        isValid = false;
    }

    // Image URL
    if (!formData.image_url) {
        setFieldError("image_url", "URL ảnh banner là bắt buộc.");
        isValid = false;
    } else if (formData.image_url.length > 500) {
        setFieldError("image_url", "URL ảnh tối đa 500 ký tự.");
        isValid = false;
    }

    // Target URL
    if (formData.target_url && formData.target_url.length > 500) {
        setFieldError("target_url", "URL đích tối đa 500 ký tự.");
        isValid = false;
    }

    // Position
    if (!formData.position) {
        setFieldError("position", "Vị trí hiển thị là bắt buộc.");
        isValid = false;
    }

    // Sort order
    if (isNaN(formData.sort_order) || formData.sort_order < 0) {
        setFieldError("sort_order", "Thứ tự hiển thị phải là số nguyên lớn hơn hoặc bằng 0.");
        isValid = false;
    }

    // Start / End at validation (end_at >= start_at)
    if (formData.start_at && formData.end_at) {
        const startD = new Date(formData.start_at);
        const endD = new Date(formData.end_at);
        if (!isNaN(startD.getTime()) && !isNaN(endD.getTime()) && endD < startD) {
            setFieldError("end_at", "Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu.");
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Xử lý Submit Modal Tạo / Chỉnh sửa
 */
async function handleModalSubmit() {
    if (isSubmitting) return;

    const inputTitle = document.getElementById("form-title");
    const inputImageUrl = document.getElementById("form-image-url");
    const inputTargetUrl = document.getElementById("form-target-url");
    const selectPosition = document.getElementById("form-position");
    const inputSortOrder = document.getElementById("form-sort-order");
    const inputStartAt = document.getElementById("form-start-at");
    const inputEndAt = document.getElementById("form-end-at");
    const selectStatus = document.getElementById("form-status");

    const payload = {
        title: inputTitle?.value.trim() || "",
        image_url: inputImageUrl?.value.trim() || "",
        target_url: inputTargetUrl?.value.trim() || null,
        position: selectPosition?.value || "home_top",
        sort_order: parseInt(inputSortOrder?.value) || 0,
        start_at: datetimeLocalToIso(inputStartAt?.value),
        end_at: datetimeLocalToIso(inputEndAt?.value),
        status: selectStatus?.value === "inactive" ? "inactive" : "active"
    };

    if (!validateBannerForm(payload)) return;

    // Chống double click
    setSubmitState(true);

    try {
        let response;
        if (currentModalMode === "edit" && activeBanner) {
            response = await bannersApi.updateBanner(activeBanner.id, payload);
        } else {
            response = await bannersApi.createBanner(payload);
        }

        if (!response || !response.success) {
            throw response;
        }

        showToast(currentModalMode === "edit" ? "Cập nhật banner thành công." : "Tạo mới banner thành công.", "success");
        closeBannerModal();

        // Refresh dữ liệu
        await fetchAndRender();

        // Nếu đang mở drawer item đó thì cập nhật drawer
        if (currentModalMode === "edit" && activeBanner && state.open_banner_id == activeBanner.id) {
            openBannerDrawer(activeBanner.id, false);
        }

    } catch (error) {
        console.error("Lỗi handleModalSubmit:", error);
        if (error && error.status === 422 && error.errors) {
            Object.keys(error.errors).forEach(key => {
                const msg = Array.isArray(error.errors[key]) ? error.errors[key].join(", ") : error.errors[key];
                setFieldError(key, msg);
            });
            showToast("Vui lòng kiểm tra lại thông tin trên form.", "error");
        } else {
            showToast(error.message || "Thao tác lưu banner thất bại.", "error");
        }
    } finally {
        setSubmitState(false);
    }
}

/**
 * Set trạng thái nút submit Modal
 */
function setSubmitState(submitting) {
    isSubmitting = submitting;
    const btnSubmit = document.getElementById("modal-btn-submit");
    const spinner = document.getElementById("modal-btn-spinner");
    const textSpan = document.getElementById("modal-btn-submit-text");

    if (btnSubmit) btnSubmit.disabled = submitting;
    if (spinner) {
        if (submitting) spinner.classList.remove("hidden");
        else spinner.classList.add("hidden");
    }
    if (textSpan) {
        textSpan.textContent = submitting ? "Đang lưu..." : "Lưu banner";
    }
}

/**
 * Xử lý Bật / Tắt Banner
 */
async function toggleBannerStatusAction(bannerItem) {
    if (!bannerItem) return;

    const newStatus = bannerItem.status === "active" ? "inactive" : "active";
    const actionLabel = newStatus === "active" ? "Bật banner" : "Tắt banner";

    try {
        const response = await bannersApi.updateBanner(bannerItem.id, { status: newStatus });
        if (!response || !response.success) {
            throw new Error(response?.message || `${actionLabel} thất bại.`);
        }

        showToast(`Đã ${newStatus === "active" ? "bật" : "tắt"} banner #${bannerItem.id} thành công.`, "success");

        await fetchAndRender();

        if (state.open_banner_id == bannerItem.id) {
            openBannerDrawer(bannerItem.id, false);
        }

    } catch (error) {
        console.error("Lỗi toggleBannerStatusAction:", error);
        showToast(error.message || `Không thể ${actionLabel.toLowerCase()}.`, "error");
    }
}

/**
 * Mở Modal Xác nhận Xóa mềm
 */
function openDeleteModal(item) {
    if (!item) return;
    activeBanner = item;

    const modal = document.getElementById("banner-delete-modal");
    const img = document.getElementById("delete-preview-img");
    const title = document.getElementById("delete-preview-title");
    const pos = document.getElementById("delete-preview-pos");

    if (!modal) return;

    if (img) {
        img.src = item.image_url;
        img.onerror = () => {
            img.onerror = null;
            img.src = FALLBACK_IMAGE;
        };
    }

    if (title) title.textContent = item.title;
    if (pos) pos.textContent = `Mã #${item.id} • Vị trí: ${positionMap[item.position] || item.position}`;

    modal.classList.remove("hidden");
}

/**
 * Đóng Modal Xác nhận Xóa
 */
function closeDeleteModal() {
    const modal = document.getElementById("banner-delete-modal");
    if (modal) modal.classList.add("hidden");
}

/**
 * Khởi tạo sự kiện cho Modal Xóa
 */
function initDeleteModalEvents() {
    const btnCancel = document.getElementById("delete-modal-btn-cancel");
    const btnConfirm = document.getElementById("delete-modal-btn-confirm");

    if (btnCancel) btnCancel.addEventListener("click", closeDeleteModal);
    if (btnConfirm) btnConfirm.addEventListener("click", handleDeleteConfirm);
}

/**
 * Xử lý xác nhận xóa mềm banner
 */
async function handleDeleteConfirm() {
    if (!activeBanner || isSubmitting) return;

    const btnConfirm = document.getElementById("delete-modal-btn-confirm");
    const spinner = document.getElementById("delete-modal-spinner");

    isSubmitting = true;
    if (btnConfirm) btnConfirm.disabled = true;
    if (spinner) spinner.classList.remove("hidden");

    try {
        const response = await bannersApi.deleteBanner(activeBanner.id);
        if (!response || !response.success) {
            throw new Error(response?.message || "Xóa banner thất bại.");
        }

        showToast(`Đã xóa banner #${activeBanner.id} thành công.`, "success");

        closeDeleteModal();

        // Nếu drawer đang mở banner vừa xóa thì đóng drawer
        if (state.open_banner_id == activeBanner.id) {
            closeBannerDrawer();
        }

        await fetchAndRender();

    } catch (error) {
        console.error("Lỗi handleDeleteConfirm:", error);
        showToast(error.message || "Không thể xóa banner.", "error");
    } finally {
        isSubmitting = false;
        if (btnConfirm) btnConfirm.disabled = false;
        if (spinner) spinner.classList.add("hidden");
    }
}
