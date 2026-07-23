/**
 * MindHub Admin - JavaScript Logic cho Trang: Quản lý FAQ
 * Đảm bảo đầy đủ nghiệp vụ, UX/UI, Validation, Filter state, Drawer, Modals và URL State.
 */

import * as faqsApi from "../api/faqs-api.js";
import { getCourses } from "../mocks/mock-repository.js";
import { showToast } from "../toast.js";

// Mapping Loại FAQ (raw value -> Tiếng Việt)
const typeMap = {
    general: "Chung",
    course: "Khóa học",
    payment: "Thanh toán",
    account: "Tài khoản",
    instructor: "Giảng viên",
    technical: "Kỹ thuật"
};

// Mapping Trạng thái FAQ (raw value -> UI text & CSS)
const statusMap = {
    active: { label: "Đang hoạt động", dotClass: "bg-emerald-500", textClass: "text-emerald-600" },
    inactive: { label: "Đã tắt", dotClass: "bg-mid-gray", textClass: "text-mid-gray" }
};

// State toàn cục cho trang FAQ
const state = {
    page: 1,
    per_page: 20,
    search: "",
    type: "all",
    status: "all",
    course_id: "all",
    sort_by: "sort_order",
    sort_direction: "asc",
    open_faq_id: null
};

// Biến lưu trữ tạm thời cho Modal / Drawer
let activeFaq = null;
let currentModalMode = "create"; // "create" | "edit"
let searchTimeout = null;
let isSubmitting = false;
let allCourses = []; // Cache danh sách khóa học cho Modal Sync
let selectedCourseIds = []; // IDs khóa học đang chọn trong Modal Sync
let syncCourseSearchKeyword = "";

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
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "N/A";

    const dateStr = d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const timeStr = d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });
    return { dateStr, timeStr };
}

/**
 * Khởi tạo trang khi DOM ready
 */
document.addEventListener("DOMContentLoaded", () => {
    loadCoursesList();
    readStateFromUrl();
    initFilterEvents();
    initSummaryCardEvents();
    initModalEvents();
    initDrawerEvents();
    initCourseSyncModalEvents();
    initDeleteModalEvents();
    
    // Tải dữ liệu ban đầu
    fetchFaqs();

    // Nút Refresh
    const btnRefresh = document.getElementById("btn-refresh");
    if (btnRefresh) {
        btnRefresh.addEventListener("click", () => {
            fetchFaqs(true);
            showToast("Đã làm mới dữ liệu FAQ.", "info");
        });
    }
});

/**
 * Tải danh sách khóa học để làm bộ lọc & modal sync
 */
function loadCoursesList() {
    try {
        allCourses = getCourses().filter(c => !c.deleted_at);
        populateCourseFilterOptions();
    } catch (err) {
        console.error("Lỗi nạp danh sách khóa học:", err);
    }
}

/**
 * Đổ danh sách khóa học vào select bộ lọc `#filter-course`
 */
function populateCourseFilterOptions() {
    const courseSelect = document.getElementById("filter-course");
    if (!courseSelect) return;

    const currentVal = state.course_id;
    let html = `
        <option value="all">Tất cả khóa học</option>
        <option value="unlinked">Chưa liên kết</option>
    `;

    allCourses.forEach(c => {
        const isSelected = String(c.id) === String(currentVal) ? "selected" : "";
        html += `<option value="${c.id}" ${isSelected}>${escapeHtml(c.title)} (ID: ${c.id})</option>`;
    });

    courseSelect.innerHTML = html;

    if (window.initAllCustomSelects) {
        window.initAllCustomSelects();
    }
}

/**
 * Đọc tham số truy vấn từ URL vào State
 */
function readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    state.page = parseInt(params.get("page")) || 1;
    state.per_page = parseInt(params.get("per_page")) || 20;
    state.search = params.get("search") || "";
    state.type = params.get("type") || "all";
    state.status = params.get("status") || "all";
    state.course_id = params.get("course_id") || "all";
    state.sort_by = params.get("sort_by") || "sort_order";
    state.sort_direction = params.get("sort_direction") || (state.sort_by === "sort_order" ? "asc" : "desc");
    state.open_faq_id = params.get("open_faq_id") ? parseInt(params.get("open_faq_id")) : null;

    // Đánh dấu UI Filter theo state
    const searchInput = document.getElementById("filter-search");
    if (searchInput) searchInput.value = state.search;

    const typeSelect = document.getElementById("filter-type");
    if (typeSelect) typeSelect.value = state.type;

    const statusSelect = document.getElementById("filter-status");
    if (statusSelect) statusSelect.value = state.status;

    const courseSelect = document.getElementById("filter-course");
    if (courseSelect) courseSelect.value = state.course_id;

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) sortSelect.value = state.sort_by;

    updateResetButtonState();

    if (window.initAllCustomSelects) {
        window.initAllCustomSelects();
    }
}

/**
 * Đồng bộ State hiện tại vào URL
 */
function updateUrlState() {
    const query = new URLSearchParams();

    if (state.page > 1) query.set("page", state.page);
    if (state.per_page !== 20) query.set("per_page", state.per_page);
    if (state.search) query.set("search", state.search);
    if (state.type !== "all") query.set("type", state.type);
    if (state.status !== "all") query.set("status", state.status);
    if (state.course_id !== "all") query.set("course_id", state.course_id);
    if (state.sort_by !== "sort_order") query.set("sort_by", state.sort_by);
    if (state.sort_direction !== (state.sort_by === "sort_order" ? "asc" : "desc")) {
        query.set("sort_direction", state.sort_direction);
    }
    if (state.open_faq_id) query.set("open_faq_id", state.open_faq_id);

    const newUrl = query.toString()
        ? `${window.location.pathname}?${query.toString()}`
        : window.location.pathname;

    window.history.replaceState({}, "", newUrl);
    updateResetButtonState();
}

/**
 * Cập nhật trạng thái bật/tắt nút X xóa bộ lọc
 */
function updateResetButtonState() {
    const btnReset = document.getElementById("btn-reset-filters");
    if (!btnReset) return;

    const isFiltered =
        state.search !== "" ||
        state.type !== "all" ||
        state.status !== "all" ||
        state.course_id !== "all" ||
        state.sort_by !== "sort_order";

    btnReset.disabled = !isFiltered;
}

/**
 * Gọi API nạp danh sách FAQ và hiển thị ra UI
 */
async function fetchFaqs(isRefresh = false) {
    showLoading();

    try {
        const response = await faqsApi.getFaqs({
            page: state.page,
            per_page: state.per_page,
            search: state.search,
            type: state.type,
            status: state.status,
            course_id: state.course_id,
            sort_by: state.sort_by,
            sort_direction: state.sort_direction
        });

        if (response && response.success) {
            renderSummary(response.data.summary);
            renderTable(response.data.items, response.meta);
            renderPagination(response.meta);

            // Kiểm tra xem URL có yêu cầu mở drawer tự động không
            if (state.open_faq_id) {
                openFaqDrawer(state.open_faq_id, false);
            }

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("scroll_to") === "results") {
                const targetSection = document.getElementById("faqs-results-section");
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    const url = new URL(window.location.href);
                    url.searchParams.delete("scroll_to");
                    window.history.replaceState({}, "", url.toString());
                }
            }
        } else {
            showError("Không thể nạp danh sách FAQ", response ? response.message : "");
        }
    } catch (err) {
        console.error("Lỗi fetchFaqs:", err);
        showError("Lỗi kết nối máy chủ", err.message || "Không thể tải dữ liệu.");
    }
}

/**
 * Hiển thị các ô KPI summary
 */
function renderSummary(summary) {
    if (!summary) return;

    const total = summary.total_faqs || 0;
    const active = summary.active_count || 0;
    const inactive = summary.inactive_count || 0;
    const unlinked = summary.unlinked_count || 0;
    const linkedCourses = summary.linked_course_count || 0;

    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    const inactivePct = total > 0 ? Math.round((inactive / total) * 100) : 0;
    const unlinkedPct = total > 0 ? Math.round((unlinked / total) * 100) : 0;

    // Tổng FAQ
    const elTotal = document.getElementById("summary-total");
    if (elTotal) elTotal.textContent = total.toLocaleString("vi-VN");

    // Đang hoạt động
    const elActive = document.getElementById("summary-active");
    const elActivePct = document.getElementById("summary-active-pct");
    const elActiveBar = document.getElementById("summary-active-bar");
    if (elActive) elActive.textContent = active.toLocaleString("vi-VN");
    if (elActivePct) elActivePct.textContent = `${activePct}%`;
    if (elActiveBar) elActiveBar.style.width = `${activePct}%`;

    // Đã tắt
    const elInactive = document.getElementById("summary-inactive");
    const elInactivePct = document.getElementById("summary-inactive-pct");
    const elInactiveBar = document.getElementById("summary-inactive-bar");
    if (elInactive) elInactive.textContent = inactive.toLocaleString("vi-VN");
    if (elInactivePct) elInactivePct.textContent = `${inactivePct}%`;
    if (elInactiveBar) elInactiveBar.style.width = `${inactivePct}%`;

    // Chưa liên kết
    const elUnlinked = document.getElementById("summary-unlinked");
    const elUnlinkedPct = document.getElementById("summary-unlinked-pct");
    const elUnlinkedBar = document.getElementById("summary-unlinked-bar");
    if (elUnlinked) elUnlinked.textContent = unlinked.toLocaleString("vi-VN");
    if (elUnlinkedPct) elUnlinkedPct.textContent = `${unlinkedPct}%`;
    if (elUnlinkedBar) elUnlinkedBar.style.width = `${unlinkedPct}%`;

    // Khóa học có FAQ
    const elLinkedCourses = document.getElementById("summary-linked-courses");
    if (elLinkedCourses) elLinkedCourses.textContent = linkedCourses.toLocaleString("vi-VN");
}

/**
 * Render bảng danh sách FAQ
 */
function renderTable(items, meta) {
    const tableBody = document.getElementById("faqs-table-body");
    const tableContainer = document.getElementById("faqs-table-container");
    const loadingState = document.getElementById("faqs-loading-state");
    const emptyState = document.getElementById("faqs-empty-state");
    const filterEmptyState = document.getElementById("faqs-filter-empty-state");
    const errorState = document.getElementById("faqs-error-state");
    const table = document.getElementById("faqs-table");

    // Ẩn tất cả các trạng thái
    loadingState.classList.add("hidden");
    emptyState.classList.add("hidden");
    filterEmptyState.classList.add("hidden");
    errorState.classList.add("hidden");
    table.classList.remove("hidden");

    if (!items || items.length === 0) {
        table.classList.add("hidden");
        const isFiltered =
            state.search !== "" ||
            state.type !== "all" ||
            state.status !== "all" ||
            state.course_id !== "all";

        if (isFiltered) {
            filterEmptyState.classList.remove("hidden");
        } else {
            emptyState.classList.remove("hidden");
        }
        return;
    }

    let rowsHtml = "";
    items.forEach((item) => {
        const typeText = typeMap[item.type] || item.type || "Chung";
        const statusConfig = statusMap[item.status] || statusMap.inactive;
        const { dateStr, timeStr } = formatDateTime(item.updated_at);

        // Khóa học liên kết cell
        let courseCellHtml = "";
        if (item.course_count === 0 || !item.linked_courses || item.linked_courses.length === 0) {
            courseCellHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">Chưa liên kết</span>`;
        } else {
            const firstTwo = item.linked_courses.slice(0, 2);
            const remainingCount = item.course_count - firstTwo.length;

            const courseLinks = firstTwo.map(c => 
                `<a href="courses.html?open_course_id=${c.id}" onclick="event.stopPropagation();" class="text-xs font-medium text-ink hover:text-blue-600 truncate max-w-[180px] block transition-colors" title="${escapeHtml(c.title)}">• ${escapeHtml(c.title)}</a>`
            ).join("");

            let moreText = "";
            if (remainingCount > 0) {
                moreText = `<span class="text-[11px] font-semibold text-mid-gray block mt-0.5">+${remainingCount} khóa học khác</span>`;
            }

            courseCellHtml = `
                <div class="flex flex-col space-y-0.5">
                    ${courseLinks}
                    ${moreText}
                </div>
            `;
        }

        rowsHtml += `
            <tr data-faq-id="${item.id}" class="hover:bg-canvas/80 transition-colors cursor-pointer group">
                <!-- Cột Câu hỏi & Trích đoạn trả lời -->
                <td class="py-3.5 px-4 align-top">
                    <div class="flex flex-col space-y-1">
                        <span class="font-medium text-ink group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            ${escapeHtml(item.question)}
                        </span>
                        <span class="text-xs text-mid-gray line-clamp-2 leading-normal">
                            ${escapeHtml(item.answer)}
                        </span>
                    </div>
                </td>

                <!-- Cột Loại -->
                <td class="py-3.5 px-4 align-top whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-canvas text-mid-gray border border-hairline">
                        ${escapeHtml(typeText)}
                    </span>
                </td>

                <!-- Cột Khóa học liên kết -->
                <td class="py-3.5 px-4 align-top">
                    ${courseCellHtml}
                </td>

                <!-- Cột Thứ tự -->
                <td class="py-3.5 px-4 align-top text-center whitespace-nowrap">
                    <span class="text-xs font-semibold tabular-nums text-ink bg-canvas px-2.5 py-1 rounded-lg border border-hairline">
                        ${item.sort_order !== undefined ? item.sort_order : 0}
                    </span>
                </td>

                <!-- Cột Trạng thái -->
                <td class="py-3.5 px-4 align-top whitespace-nowrap">
                    <div class="inline-flex items-center gap-1.5 text-xs font-medium ${statusConfig.textClass}">
                        <span class="h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}"></span>
                        <span>${statusConfig.label}</span>
                    </div>
                </td>

                <!-- Cột Cập nhật -->
                <td class="py-3.5 px-4 align-top whitespace-nowrap text-xs">
                    <div class="text-ink font-medium">${dateStr}</div>
                    <div class="text-[11px] text-mid-gray">${timeStr}</div>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = rowsHtml;

    // Gắn event row click mở Drawer
    tableBody.querySelectorAll("tr[data-faq-id]").forEach(tr => {
        tr.addEventListener("click", () => {
            const faqId = parseInt(tr.getAttribute("data-faq-id"));
            if (faqId) openFaqDrawer(faqId);
        });
    });
}

/**
 * Render Pagination chuẩn responsive
 */
function renderPagination(meta) {
    const container = document.getElementById("faqs-pagination-container");
    if (!container) return;

    if (!meta || meta.total === 0) {
        container.innerHTML = "";
        return;
    }

    const { current_page, last_page, per_page, total } = meta;
    const startItem = Math.min((current_page - 1) * per_page + 1, total);
    const endItem = Math.min(current_page * per_page, total);

    const prevDisabled = current_page <= 1 ? "disabled" : "";
    const nextDisabled = current_page >= last_page ? "disabled" : "";

    container.innerHTML = `
        <div class="text-xs text-mid-gray font-medium">
            Hiển thị <span class="text-ink font-semibold">${startItem}</span> - <span class="text-ink font-semibold">${endItem}</span> trong tổng <span class="text-ink font-semibold">${total}</span> câu hỏi
        </div>
        <div class="flex items-center gap-2">
            <button type="button" id="btn-prev-page" ${prevDisabled} class="inline-flex items-center justify-center h-8 px-3 rounded-full border border-hairline bg-paper text-ink hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none text-xs font-medium transition-colors cursor-pointer">
                Trang trước
            </button>
            <span class="text-xs font-semibold text-ink px-2">Trang ${current_page} / ${last_page}</span>
            <button type="button" id="btn-next-page" ${nextDisabled} class="inline-flex items-center justify-center h-8 px-3 rounded-full border border-hairline bg-paper text-ink hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none text-xs font-medium transition-colors cursor-pointer">
                Trang sau
            </button>
        </div>
    `;

    const btnPrev = document.getElementById("btn-prev-page");
    const btnNext = document.getElementById("btn-next-page");

    if (btnPrev && !prevDisabled) {
        btnPrev.addEventListener("click", () => {
            state.page = current_page - 1;
            updateUrlState();
            fetchFaqs();
        });
    }

    if (btnNext && !nextDisabled) {
        btnNext.addEventListener("click", () => {
            state.page = current_page + 1;
            updateUrlState();
            fetchFaqs();
        });
    }
}

/**
 * Hiển thị màn hình Loading
 */
function showLoading() {
    const loadingState = document.getElementById("faqs-loading-state");
    const emptyState = document.getElementById("faqs-empty-state");
    const filterEmptyState = document.getElementById("faqs-filter-empty-state");
    const errorState = document.getElementById("faqs-error-state");
    const table = document.getElementById("faqs-table");

    if (loadingState) loadingState.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");
    if (filterEmptyState) filterEmptyState.classList.add("hidden");
    if (errorState) errorState.classList.add("hidden");
    if (table) table.classList.add("hidden");
}

/**
 * Hiển thị màn hình Lỗi
 */
function showError(title, message) {
    const loadingState = document.getElementById("faqs-loading-state");
    const emptyState = document.getElementById("faqs-empty-state");
    const filterEmptyState = document.getElementById("faqs-filter-empty-state");
    const errorState = document.getElementById("faqs-error-state");
    const table = document.getElementById("faqs-table");

    if (loadingState) loadingState.classList.add("hidden");
    if (emptyState) emptyState.classList.add("hidden");
    if (filterEmptyState) filterEmptyState.classList.add("hidden");
    if (table) table.classList.add("hidden");

    if (errorState) {
        errorState.classList.remove("hidden");
        const titleEl = document.getElementById("error-message-title");
        const detailEl = document.getElementById("error-message-detail");
        if (titleEl) titleEl.textContent = title || "Đã xảy ra lỗi hệ thống";
        if (detailEl) detailEl.textContent = message || "Vui lòng thử lại sau.";

        const btnRetry = document.getElementById("btn-retry-load");
        if (btnRetry) {
            btnRetry.onclick = () => fetchFaqs();
        }
    }
}

/**
 * Đăng ký Sự kiện cho Bộ lọc Filter Bar
 */
function initFilterEvents() {
    const searchInput = document.getElementById("filter-search");
    const typeSelect = document.getElementById("filter-type");
    const statusSelect = document.getElementById("filter-status");
    const courseSelect = document.getElementById("filter-course");
    const sortSelect = document.getElementById("filter-sort");
    const btnReset = document.getElementById("btn-reset-filters");

    // Search với Debounce 350ms
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                state.search = e.target.value.trim();
                state.page = 1;
                updateUrlState();
                fetchFaqs();
            }, 350);
        });
    }

    // Type filter
    if (typeSelect) {
        typeSelect.addEventListener("change", (e) => {
            state.type = e.target.value;
            state.page = 1;
            updateUrlState();
            fetchFaqs();
        });
    }

    // Status filter
    if (statusSelect) {
        statusSelect.addEventListener("change", (e) => {
            state.status = e.target.value;
            state.page = 1;
            updateUrlState();
            fetchFaqs();
        });
    }

    // Course filter
    if (courseSelect) {
        courseSelect.addEventListener("change", (e) => {
            state.course_id = e.target.value;
            state.page = 1;
            updateUrlState();
            fetchFaqs();
        });
    }

    // Sort filter
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            state.sort_by = e.target.value;
            state.sort_direction = state.sort_by === "sort_order" ? "asc" : "desc";
            state.page = 1;
            updateUrlState();
            fetchFaqs();
        });
    }

    // Reset button X
    if (btnReset) {
        btnReset.addEventListener("click", resetFilters);
    }

    // Nút xóa bộ lọc ở Empty state
    const btnClearEmpty = document.getElementById("btn-clear-empty-filter");
    if (btnClearEmpty) {
        btnClearEmpty.addEventListener("click", resetFilters);
    }

    // Nút Tạo FAQ đầu tiên ở Empty state
    const btnCreateFirst = document.getElementById("btn-create-first-faq");
    if (btnCreateFirst) {
        btnCreateFirst.addEventListener("click", () => openFaqModal("create"));
    }
}

/**
 * Xóa toàn bộ bộ lọc về mặc định
 */
function resetFilters() {
    state.search = "";
    state.type = "all";
    state.status = "all";
    state.course_id = "all";
    state.sort_by = "sort_order";
    state.sort_direction = "asc";
    state.page = 1;

    const searchInput = document.getElementById("filter-search");
    if (searchInput) searchInput.value = "";

    const typeSelect = document.getElementById("filter-type");
    if (typeSelect) typeSelect.value = "all";

    const statusSelect = document.getElementById("filter-status");
    if (statusSelect) statusSelect.value = "all";

    const courseSelect = document.getElementById("filter-course");
    if (courseSelect) courseSelect.value = "all";

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) sortSelect.value = "sort_order";

    updateUrlState();

    if (window.initAllCustomSelects) {
        window.initAllCustomSelects();
    }

    fetchFaqs();
}

/**
 * Đăng ký Sự kiện click nhanh cho KPI Cards
 */
function initSummaryCardEvents() {
    const cardTotal = document.getElementById("kpi-card-total");
    const cardActive = document.getElementById("kpi-card-active");
    const cardInactive = document.getElementById("kpi-card-inactive");
    const cardUnlinked = document.getElementById("kpi-card-unlinked");
    const cardLinkedCourses = document.getElementById("kpi-card-linked-courses");

    if (cardTotal) {
        cardTotal.addEventListener("click", () => resetFilters());
    }

    if (cardActive) {
        cardActive.addEventListener("click", () => {
            state.status = "active";
            state.page = 1;
            const statusSelect = document.getElementById("filter-status");
            if (statusSelect) statusSelect.value = "active";
            updateUrlState();
            if (window.initAllCustomSelects) window.initAllCustomSelects();
            fetchFaqs();
        });
    }

    if (cardInactive) {
        cardInactive.addEventListener("click", () => {
            state.status = "inactive";
            state.page = 1;
            const statusSelect = document.getElementById("filter-status");
            if (statusSelect) statusSelect.value = "inactive";
            updateUrlState();
            if (window.initAllCustomSelects) window.initAllCustomSelects();
            fetchFaqs();
        });
    }

    if (cardUnlinked) {
        cardUnlinked.addEventListener("click", () => {
            state.course_id = "unlinked";
            state.page = 1;
            const courseSelect = document.getElementById("filter-course");
            if (courseSelect) courseSelect.value = "unlinked";
            updateUrlState();
            if (window.initAllCustomSelects) window.initAllCustomSelects();
            fetchFaqs();
        });
    }

    if (cardLinkedCourses) {
        cardLinkedCourses.addEventListener("click", () => {
            state.sort_by = "course_count";
            state.sort_direction = "desc";
            state.page = 1;
            const sortSelect = document.getElementById("filter-sort");
            if (sortSelect) sortSelect.value = "course_count";
            updateUrlState();
            if (window.initAllCustomSelects) window.initAllCustomSelects();
            fetchFaqs();
        });
    }
}

// ==========================================
// DRAWER CHI TIẾT FAQ
// ==========================================

function initDrawerEvents() {
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const btnCloseDrawer = document.getElementById("btn-close-drawer");

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener("click", closeFaqDrawer);
    }
    if (btnCloseDrawer) {
        btnCloseDrawer.addEventListener("click", closeFaqDrawer);
    }
}

/**
 * Mở Drawer chi tiết FAQ theo ID
 */
async function openFaqDrawer(faqId, updateUrl = true) {
    const drawer = document.getElementById("drawer-faq-detail");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const drawerPanel = document.getElementById("drawer-panel");
    const drawerBody = document.getElementById("drawer-body");
    const drawerFooter = document.getElementById("drawer-footer-actions");
    const drawerIdBadge = document.getElementById("drawer-faq-id-badge");
    const drawerTypeBadge = document.getElementById("drawer-faq-type-badge");

    if (!drawer || !drawerPanel) return;

    if (updateUrl) {
        state.open_faq_id = faqId;
        updateUrlState();
    }

    // Hiển thị khung drawer trước với loading skeleton
    drawer.classList.remove("hidden");
    setTimeout(() => {
        if (drawerBackdrop) drawerBackdrop.classList.remove("opacity-0");
        if (drawerPanel) drawerPanel.classList.remove("translate-x-full");
    }, 20);

    if (drawerIdBadge) drawerIdBadge.textContent = `FAQ #${faqId}`;
    if (drawerTypeBadge) drawerTypeBadge.textContent = "Đang tải...";
    if (drawerBody) {
        drawerBody.innerHTML = `
            <div class="py-12 text-center space-y-3">
                <div class="h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent mx-auto"></div>
                <p class="text-sm font-medium text-mid-gray">Đang tải chi tiết FAQ...</p>
            </div>
        `;
    }
    if (drawerFooter) drawerFooter.innerHTML = "";

    try {
        const response = await faqsApi.getFaqDetail(faqId);
        if (response && response.success && response.data) {
            activeFaq = response.data;
            renderDrawerContent(activeFaq);
        } else {
            showToast("Không thể tải chi tiết FAQ", "error");
            closeFaqDrawer();
        }
    } catch (err) {
        console.error("Lỗi getFaqDetail:", err);
        showToast(err.message || "FAQ không tồn tại hoặc đã bị xóa", "error");
        closeFaqDrawer();
    }
}

/**
 * Render nội dung chi tiết trong Drawer
 */
function renderDrawerContent(faq) {
    const drawerBody = document.getElementById("drawer-body");
    const drawerFooter = document.getElementById("drawer-footer-actions");
    const drawerIdBadge = document.getElementById("drawer-faq-id-badge");
    const drawerTypeBadge = document.getElementById("drawer-faq-type-badge");

    if (!faq) return;

    const typeText = typeMap[faq.type] || faq.type || "Chung";
    const statusConfig = statusMap[faq.status] || statusMap.inactive;
    const createdAt = formatDateTime(faq.created_at);
    const updatedAt = formatDateTime(faq.updated_at);

    if (drawerIdBadge) drawerIdBadge.textContent = `FAQ #${faq.id}`;
    if (drawerTypeBadge) drawerTypeBadge.textContent = typeText;

    // Render danh sách khóa học liên kết
    let linkedCoursesHtml = "";
    if (!faq.linked_courses || faq.linked_courses.length === 0) {
        linkedCoursesHtml = `
            <div class="p-4 rounded-2xl bg-canvas border border-hairline text-center text-xs text-mid-gray">
                Chưa liên kết với khóa học nào.
            </div>
        `;
    } else {
        const listItems = faq.linked_courses.map(c => `
            <div class="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-hairline hover:border-ink/20 transition-colors">
                <div class="min-w-0 flex-1 pr-3">
                    <a href="courses.html?open_course_id=${c.id}" onclick="event.stopPropagation();" class="text-xs font-semibold text-ink hover:text-blue-600 transition-colors truncate block">
                        ${escapeHtml(c.title)}
                    </a>
                    <div class="flex items-center gap-2 text-[11px] text-mid-gray mt-0.5">
                        <span>ID: ${c.id}</span>
                        ${c.instructor ? `<span>• Giảng viên: ${escapeHtml(c.instructor.full_name)}</span>` : ""}
                    </div>
                </div>
                <a href="courses.html?open_course_id=${c.id}" onclick="event.stopPropagation();" class="shrink-0 p-1.5 text-mid-gray hover:text-ink hover:bg-paper rounded-lg border border-hairline transition-colors" title="Xem chi tiết khóa học">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                </a>
            </div>
        `).join("");

        linkedCoursesHtml = `<div class="space-y-2">${listItems}</div>`;
    }

    if (drawerBody) {
        drawerBody.innerHTML = `
            <!-- Câu hỏi -->
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-mid-gray block mb-1.5">Câu hỏi</span>
                <h2 class="text-lg font-semibold text-ink leading-snug">
                    ${escapeHtml(faq.question)}
                </h2>
            </div>

            <!-- Câu trả lời -->
            <div class="rounded-2xl border border-hairline bg-canvas p-4">
                <span class="text-xs font-bold uppercase tracking-wider text-mid-gray block mb-2">Câu trả lời</span>
                <div class="text-sm text-ink leading-relaxed whitespace-pre-line">
                    ${escapeHtml(faq.answer)}
                </div>
            </div>

            <!-- Thông tin cơ bản Grid -->
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-mid-gray block mb-3">Thông tin chi tiết</span>
                <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="p-3 rounded-2xl bg-canvas border border-hairline">
                        <span class="text-mid-gray block mb-1">Trạng thái</span>
                        <div class="inline-flex items-center gap-1.5 font-semibold ${statusConfig.textClass}">
                            <span class="h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}"></span>
                            <span>${statusConfig.label}</span>
                        </div>
                    </div>

                    <div class="p-3 rounded-2xl bg-canvas border border-hairline">
                        <span class="text-mid-gray block mb-1">Thứ tự hiển thị</span>
                        <span class="font-semibold text-ink tabular-nums">${faq.sort_order !== undefined ? faq.sort_order : 0}</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-canvas border border-hairline">
                        <span class="text-mid-gray block mb-1">Loại FAQ</span>
                        <span class="font-semibold text-ink">${escapeHtml(typeText)}</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-canvas border border-hairline">
                        <span class="text-mid-gray block mb-1">Số khóa học liên kết</span>
                        <span class="font-semibold text-ink">${faq.course_count || 0} khóa học</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-canvas border border-hairline">
                        <span class="text-mid-gray block mb-1">Ngày tạo</span>
                        <span class="font-medium text-ink">${createdAt.dateStr} ${createdAt.timeStr}</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-canvas border border-hairline">
                        <span class="text-mid-gray block mb-1">Cập nhật lần cuối</span>
                        <span class="font-medium text-ink">${updatedAt.dateStr} ${updatedAt.timeStr}</span>
                    </div>
                </div>
            </div>

            <!-- Khóa học liên kết -->
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-mid-gray">Khóa học liên kết (${faq.course_count || 0})</span>
                    <button type="button" id="btn-drawer-manage-courses" class="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer">
                        Quản lý liên kết
                    </button>
                </div>
                ${linkedCoursesHtml}
            </div>
        `;
    }

    if (drawerFooter) {
        const toggleBtnLabel = faq.status === "active" ? "Tắt FAQ" : "Bật FAQ";
        const toggleBtnClass = faq.status === "active" ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50";

        drawerFooter.innerHTML = `
            <div class="flex items-center gap-2">
                <button type="button" id="btn-drawer-delete" class="px-3.5 h-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-medium text-xs transition-colors cursor-pointer">
                    Xóa mềm
                </button>
                <button type="button" id="btn-drawer-toggle-status" class="px-3.5 h-9 rounded-full border ${toggleBtnClass} font-medium text-xs transition-colors cursor-pointer">
                    ${toggleBtnLabel}
                </button>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" id="btn-drawer-edit" class="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-ink text-white font-medium text-xs shadow-subtle hover:bg-ink/90 transition-all cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/>
                    </svg>
                    <span>Chỉnh sửa</span>
                </button>
            </div>
        `;

        // Gắn sự kiện cho các nút trong Drawer Footer
        const btnDelete = document.getElementById("btn-drawer-delete");
        const btnToggleStatus = document.getElementById("btn-drawer-toggle-status");
        const btnEdit = document.getElementById("btn-drawer-edit");
        const btnManageCourses = document.getElementById("btn-drawer-manage-courses");

        if (btnDelete) btnDelete.onclick = () => openDeleteModal(faq);
        if (btnToggleStatus) btnToggleStatus.onclick = () => handleToggleFaqStatus(faq);
        if (btnEdit) btnEdit.onclick = () => {
            closeFaqDrawer();
            openFaqModal("edit", faq);
        };
        if (btnManageCourses) btnManageCourses.onclick = () => openCourseSyncModal(faq);
    }
}

/**
 * Đóng Drawer
 */
function closeFaqDrawer() {
    const drawer = document.getElementById("drawer-faq-detail");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const drawerPanel = document.getElementById("drawer-panel");

    if (!drawer || !drawerPanel) return;

    if (drawerBackdrop) drawerBackdrop.classList.add("opacity-0");
    if (drawerPanel) drawerPanel.classList.add("translate-x-full");

    setTimeout(() => {
        drawer.classList.add("hidden");
        state.open_faq_id = null;
        updateUrlState();
    }, 300);
}

// ==========================================
// MODAL TẠO / CHỈNH SỬA FAQ
// ==========================================

function initModalEvents() {
    const btnCreateFaq = document.getElementById("btn-create-faq");
    const btnCloseModal = document.getElementById("btn-close-faq-modal");
    const btnCancelModal = document.getElementById("btn-cancel-faq-modal");
    const modalBackdrop = document.getElementById("modal-faq-backdrop");
    const formFaq = document.getElementById("form-faq");

    if (btnCreateFaq) btnCreateFaq.addEventListener("click", () => openFaqModal("create"));
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeFaqModal);
    if (btnCancelModal) btnCancelModal.addEventListener("click", closeFaqModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeFaqModal);

    if (formFaq) formFaq.addEventListener("submit", handleSaveFaq);
}

/**
 * Mở Modal Tạo / Sửa
 */
function openFaqModal(mode = "create", faq = null) {
    currentModalMode = mode;
    activeFaq = faq;

    const modal = document.getElementById("modal-faq-form");
    const titleEl = document.getElementById("modal-faq-title");
    const form = document.getElementById("form-faq");

    if (!modal || !form) return;

    resetFaqFormErrors();

    const inputQuestion = document.getElementById("faq-question");
    const inputAnswer = document.getElementById("faq-answer");
    const selectType = document.getElementById("faq-type");
    const inputSortOrder = document.getElementById("faq-sort-order");
    const selectStatus = document.getElementById("faq-status");

    if (mode === "create") {
        if (titleEl) titleEl.textContent = "Tạo FAQ mới";
        if (inputQuestion) inputQuestion.value = "";
        if (inputAnswer) inputAnswer.value = "";
        if (selectType) selectType.value = "general";
        if (inputSortOrder) inputSortOrder.value = "0";
        if (selectStatus) selectStatus.value = "active";
    } else if (mode === "edit" && faq) {
        if (titleEl) titleEl.textContent = `Chỉnh sửa FAQ #${faq.id}`;
        if (inputQuestion) inputQuestion.value = faq.question || "";
        if (inputAnswer) inputAnswer.value = faq.answer || "";
        if (selectType) selectType.value = faq.type || "general";
        if (inputSortOrder) inputSortOrder.value = faq.sort_order !== undefined ? faq.sort_order : 0;
        if (selectStatus) selectStatus.value = faq.status || "active";
    }

    if (window.initAllCustomSelects) window.initAllCustomSelects();

    modal.classList.remove("hidden");
    if (inputQuestion) inputQuestion.focus();
}

/**
 * Đóng Modal Tạo / Sửa
 */
function closeFaqModal() {
    const modal = document.getElementById("modal-faq-form");
    if (modal) modal.classList.add("hidden");
}

/**
 * Xóa thông báo lỗi cũ trên Form
 */
function resetFaqFormErrors() {
    const errorIds = [
        "faq-question-error",
        "faq-answer-error",
        "faq-type-error",
        "faq-sort-order-error",
        "faq-status-error",
        "form-faq-general-error"
    ];

    errorIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = "";
            el.classList.add("hidden");
        }
    });
}

/**
 * Xử lý Lưu FAQ (Create / Edit)
 */
async function handleSaveFaq(e) {
    e.preventDefault();
    if (isSubmitting) return;

    resetFaqFormErrors();

    const questionVal = document.getElementById("faq-question").value.trim();
    const answerVal = document.getElementById("faq-answer").value.trim();
    const typeVal = document.getElementById("faq-type").value;
    const sortOrderVal = parseInt(document.getElementById("faq-sort-order").value) || 0;
    const statusVal = document.getElementById("faq-status").value;

    let hasError = false;

    if (!questionVal) {
        showFieldError("faq-question-error", "Vui lòng nhập câu hỏi.");
        hasError = true;
    }

    if (!answerVal) {
        showFieldError("faq-answer-error", "Vui lòng nhập câu trả lời.");
        hasError = true;
    }

    if (hasError) return;

    const payload = {
        question: questionVal,
        answer: answerVal,
        type: typeVal,
        sort_order: sortOrderVal,
        status: statusVal
    };

    const btnSave = document.getElementById("btn-save-faq");
    if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = `
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Đang lưu...</span>
        `;
    }
    isSubmitting = true;

    try {
        let response;
        if (currentModalMode === "create") {
            response = await faqsApi.createFaq(payload);
        } else {
            response = await faqsApi.updateFaq(activeFaq.id, payload);
        }

        if (response && response.success) {
            showToast(
                currentModalMode === "create" ? "Tạo FAQ thành công." : "Cập nhật FAQ thành công.",
                "success"
            );
            closeFaqModal();
            fetchFaqs();

            // Nếu đang mở drawer cho FAQ này thì refresh lại drawer
            if (state.open_faq_id && activeFaq && state.open_faq_id === activeFaq.id) {
                openFaqDrawer(activeFaq.id, false);
            }
        } else {
            showFormGeneralError(response ? response.message : "Thao tác không thành công.");
        }
    } catch (err) {
        console.error("Lỗi handleSaveFaq:", err);

        if (err.status === 422 && err.errors) {
            if (err.errors.question) showFieldError("faq-question-error", err.errors.question[0]);
            if (err.errors.answer) showFieldError("faq-answer-error", err.errors.answer[0]);
            if (err.errors.type) showFieldError("faq-type-error", err.errors.type[0]);
        } else {
            showFormGeneralError(err.message || "Đã xảy ra lỗi hệ thống.");
        }
    } finally {
        isSubmitting = false;
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.innerHTML = `<span>Lưu FAQ</span>`;
        }
    }
}

function showFieldError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
    }
}

function showFormGeneralError(msg) {
    const el = document.getElementById("form-faq-general-error");
    if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
    }
}

// ==========================================
// BẬT / TẮT TRẠNG THÁI FAQ
// ==========================================

async function handleToggleFaqStatus(faq) {
    if (!faq || isSubmitting) return;

    const newStatus = faq.status === "active" ? "inactive" : "active";
    const statusText = newStatus === "active" ? "Bật" : "Tắt";

    isSubmitting = true;

    try {
        const response = await faqsApi.updateFaq(faq.id, { status: newStatus });
        if (response && response.success) {
            showToast(`Đã ${statusText.toLowerCase()} FAQ thành công.`, "success");
            fetchFaqs();
            if (state.open_faq_id === faq.id) {
                openFaqDrawer(faq.id, false);
            }
        } else {
            showToast("Không thể thay đổi trạng thái FAQ", "error");
        }
    } catch (err) {
        console.error("Lỗi handleToggleFaqStatus:", err);
        showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    } finally {
        isSubmitting = false;
    }
}

// ==========================================
// MODAL QUẢN LÝ LIÊN KẾT KHÓA HỌC
// ==========================================

function initCourseSyncModalEvents() {
    const btnClose = document.getElementById("btn-close-course-sync-modal");
    const btnCancel = document.getElementById("btn-cancel-course-sync");
    const backdrop = document.getElementById("modal-sync-backdrop");
    const searchInput = document.getElementById("sync-course-search");
    const btnClearAll = document.getElementById("btn-clear-course-selection");
    const btnSave = document.getElementById("btn-save-course-sync");

    if (btnClose) btnClose.addEventListener("click", closeCourseSyncModal);
    if (btnCancel) btnCancel.addEventListener("click", closeCourseSyncModal);
    if (backdrop) backdrop.addEventListener("click", closeCourseSyncModal);

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            syncCourseSearchKeyword = e.target.value.toLowerCase().trim();
            renderSyncCourseList();
        });
    }

    if (btnClearAll) {
        btnClearAll.addEventListener("click", () => {
            selectedCourseIds = [];
            renderSyncCourseList();
        });
    }

    if (btnSave) {
        btnSave.addEventListener("click", handleSaveCourseSync);
    }
}

/**
 * Mở Modal Quản lý liên kết khóa học
 */
function openCourseSyncModal(faq) {
    if (!faq) return;
    activeFaq = faq;

    // Lấy các course_id đang liên kết
    selectedCourseIds = (faq.linked_courses || []).map(c => c.id);
    syncCourseSearchKeyword = "";

    const modal = document.getElementById("modal-sync-courses");
    const subtitle = document.getElementById("sync-courses-faq-question");
    const searchInput = document.getElementById("sync-course-search");

    if (subtitle) subtitle.textContent = `FAQ #${faq.id}: ${faq.question}`;
    if (searchInput) searchInput.value = "";

    renderSyncCourseList();

    if (modal) modal.classList.remove("hidden");
}

/**
 * Đóng Modal Sync khóa học
 */
function closeCourseSyncModal() {
    const modal = document.getElementById("modal-sync-courses");
    if (modal) modal.classList.add("hidden");
}

/**
 * Render danh sách checkbox khóa học trong Modal Sync
 */
function renderSyncCourseList() {
    const listContainer = document.getElementById("sync-course-list");
    const countBadge = document.getElementById("sync-course-count");

    if (countBadge) {
        countBadge.textContent = `Đã chọn ${selectedCourseIds.length} khóa học`;
    }

    if (!listContainer) return;

    let filteredCourses = allCourses;

    if (syncCourseSearchKeyword) {
        filteredCourses = allCourses.filter(c => 
            (c.title && c.title.toLowerCase().includes(syncCourseSearchKeyword)) ||
            (c.instructor && c.instructor.full_name && c.instructor.full_name.toLowerCase().includes(syncCourseSearchKeyword)) ||
            String(c.id) === syncCourseSearchKeyword
        );
    }

    if (filteredCourses.length === 0) {
        listContainer.innerHTML = `
            <div class="p-8 text-center text-xs text-mid-gray">
                Không tìm thấy khóa học nào phù hợp.
            </div>
        `;
        return;
    }

    let itemsHtml = "";
    filteredCourses.forEach(c => {
        const isChecked = selectedCourseIds.includes(c.id);
        const instructorName = c.instructor ? c.instructor.full_name : "N/A";

        itemsHtml += `
            <label class="flex items-center justify-between p-3 px-4 hover:bg-canvas transition-colors cursor-pointer select-none">
                <div class="flex items-center gap-3 min-w-0 flex-1 pr-3">
                    <input type="checkbox" data-course-id="${c.id}" ${isChecked ? "checked" : ""} class="h-4 w-4 rounded border-hairline text-ink focus:ring-ink transition-colors cursor-pointer">
                    <div class="min-w-0 flex-1">
                        <div class="text-xs font-semibold text-ink truncate">${escapeHtml(c.title)}</div>
                        <div class="text-[11px] text-mid-gray mt-0.5">ID: ${c.id} • Giảng viên: ${escapeHtml(instructorName)}</div>
                    </div>
                </div>
                <span class="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${c.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-canvas text-mid-gray"}">
                    ${c.status === "published" ? "Đã xuất bản" : c.status}
                </span>
            </label>
        `;
    });

    listContainer.innerHTML = itemsHtml;

    // Gắn sự kiện thay đổi Checkbox
    listContainer.querySelectorAll("input[type='checkbox']").forEach(chk => {
        chk.addEventListener("change", (e) => {
            const courseId = parseInt(chk.getAttribute("data-course-id"));
            if (e.target.checked) {
                if (!selectedCourseIds.includes(courseId)) {
                    selectedCourseIds.push(courseId);
                }
            } else {
                selectedCourseIds = selectedCourseIds.filter(id => id !== courseId);
            }
            if (countBadge) {
                countBadge.textContent = `Đã chọn ${selectedCourseIds.length} khóa học`;
            }
        });
    });
}

/**
 * Xử lý Lưu Đồng bộ khóa học
 */
async function handleSaveCourseSync() {
    if (!activeFaq || isSubmitting) return;

    const btnSave = document.getElementById("btn-save-course-sync");
    if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = `
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Đang lưu...</span>
        `;
    }
    isSubmitting = true;

    try {
        const response = await faqsApi.syncFaqCourses(activeFaq.id, selectedCourseIds);
        if (response && response.success) {
            showToast("Cập nhật liên kết khóa học thành công.", "success");
            closeCourseSyncModal();
            fetchFaqs();

            if (state.open_faq_id === activeFaq.id) {
                openFaqDrawer(activeFaq.id, false);
            }
        } else {
            showToast("Không thể đồng bộ khóa học", "error");
        }
    } catch (err) {
        console.error("Lỗi handleSaveCourseSync:", err);
        showToast(err.message || "Lỗi lưu liên kết khóa học", "error");
    } finally {
        isSubmitting = false;
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.innerHTML = `<span>Lưu liên kết</span>`;
        }
    }
}

// ==========================================
// MODAL XÁC NHẬN XÓA MỀM FAQ
// ==========================================

function initDeleteModalEvents() {
    const btnCancel = document.getElementById("btn-cancel-delete-faq");
    const backdrop = document.getElementById("modal-delete-backdrop");
    const btnConfirm = document.getElementById("btn-confirm-delete-faq");

    if (btnCancel) btnCancel.addEventListener("click", closeDeleteModal);
    if (backdrop) backdrop.addEventListener("click", closeDeleteModal);
    if (btnConfirm) btnConfirm.addEventListener("click", handleConfirmDeleteFaq);
}

/**
 * Mở Modal Xác nhận Xóa mềm FAQ
 */
function openDeleteModal(faq) {
    if (!faq) return;
    activeFaq = faq;

    const modal = document.getElementById("modal-delete-faq");
    const elQuestion = document.getElementById("delete-faq-question");
    const elType = document.getElementById("delete-faq-type");
    const elCourses = document.getElementById("delete-faq-courses");

    const typeText = typeMap[faq.type] || faq.type || "Chung";

    if (elQuestion) elQuestion.textContent = faq.question;
    if (elType) elType.textContent = `Loại: ${typeText}`;
    if (elCourses) elCourses.textContent = `Đang liên kết: ${faq.course_count || 0} khóa học`;

    if (modal) modal.classList.remove("hidden");
}

/**
 * Đóng Modal Xóa FAQ
 */
function closeDeleteModal() {
    const modal = document.getElementById("modal-delete-faq");
    if (modal) modal.classList.add("hidden");
}

/**
 * Xử lý Xóa mềm FAQ
 */
async function handleConfirmDeleteFaq() {
    if (!activeFaq || isSubmitting) return;

    const btnConfirm = document.getElementById("btn-confirm-delete-faq");
    if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = `
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Đang xóa...</span>
        `;
    }
    isSubmitting = true;

    try {
        const response = await faqsApi.deleteFaq(activeFaq.id);
        if (response && response.success) {
            showToast("Xóa mềm FAQ thành công.", "success");
            closeDeleteModal();
            closeFaqDrawer();
            fetchFaqs();
        } else {
            showToast("Không thể xóa FAQ", "error");
        }
    } catch (err) {
        console.error("Lỗi handleConfirmDeleteFaq:", err);
        showToast(err.message || "Lỗi xóa FAQ", "error");
    } finally {
        isSubmitting = false;
        if (btnConfirm) {
            btnConfirm.disabled = false;
            btnConfirm.innerHTML = `<span>Xóa FAQ</span>`;
        }
    }
}
