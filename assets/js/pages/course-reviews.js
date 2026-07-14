/**
 * Trang ADM-05: Kiểm duyệt khóa học (Course Reviews)
 * Thuộc dự án FE Admin MindHub.
 */

import {
    getCourseReviews,
    getCourseReview,
    approveCourse,
    rejectCourse
} from "../api/course-reviews-api.js";
import { showToast } from "../toast.js";

// Page Global State
let pageState = {
    page: 1,
    per_page: 20,
    search: "",
    sort: "submitted_desc"
};

let currentItemsData = [];
let activeCourseIdForAction = null;
let activeCourseDetailData = null;
let searchDebounceTimeout = null;
let isSubmitting = false;

/**
 * Hàm khởi tạo chính của trang
 */
document.addEventListener("DOMContentLoaded", () => {
    initPage();
});

function initPage() {
    bindEvents();
    readStateFromUrl();
    fetchAndRender();
}

/**
 * Gắn các sự kiện UI toàn trang
 */
function bindEvents() {
    // 1. Nút làm mới dữ liệu
    const refreshBtn = document.getElementById("btn-refresh-data");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            const icon = document.getElementById("refresh-icon");
            if (icon) icon.classList.add("animate-spin");
            fetchAndRender(false).finally(() => {
                setTimeout(() => {
                    if (icon) icon.classList.remove("animate-spin");
                }, 400);
            });
        });
    }

    // Nút cuộn xuống danh sách ở Card 1 Summary
    const scrollToListBtn = document.getElementById("btn-scroll-to-list");
    if (scrollToListBtn) {
        scrollToListBtn.addEventListener("click", () => {
            scrollToCourseReviewList();
        });
    }

    // 2. Bộ lọc Form (Search & Sort)
    const form = document.getElementById("filter-form");
    const searchInput = document.getElementById("filter-search");
    const sortSelect = document.getElementById("filter-sort");
    const resetBtn = document.getElementById("btn-reset-filters");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            clearTimeout(searchDebounceTimeout);
            searchDebounceTimeout = setTimeout(() => {
                pageState.search = e.target.value.trim();
                pageState.page = 1;
                writeStateToUrl();
                fetchAndRender(true);
            }, 400);
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (searchInput) pageState.search = searchInput.value.trim();
            if (sortSelect) pageState.sort = sortSelect.value;
            pageState.page = 1;
            writeStateToUrl();
            fetchAndRender(true);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            resetFilters();
        });
    }

    // Nút đặt lại ở Empty state & Error retry
    const emptyResetBtn = document.getElementById("btn-empty-reset");
    if (emptyResetBtn) {
        emptyResetBtn.addEventListener("click", () => {
            resetFilters();
        });
    }

    const errorRetryBtn = document.getElementById("btn-error-retry");
    if (errorRetryBtn) {
        errorRetryBtn.addEventListener("click", () => {
            fetchAndRender(true);
        });
    }

    // Nút Xóa tất cả chips
    const clearAllChipsBtn = document.getElementById("btn-clear-all-chips");
    if (clearAllChipsBtn) {
        clearAllChipsBtn.addEventListener("click", () => {
            resetFilters();
        });
    }

    // 3. Phân trang per_page
    const perPageSelect = document.getElementById("pag-per-page");
    if (perPageSelect) {
        perPageSelect.addEventListener("change", (e) => {
            pageState.per_page = parseInt(e.target.value) || 20;
            pageState.page = 1;
            writeStateToUrl();
            fetchAndRender(true);
        });
    }

    // 4. Drawer & Tabs events
    bindDrawerEvents();

    // 5. Modals Approve & Reject events
    bindModalEvents();
}

/**
 * Đọc query string từ URL
 */
function readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    pageState.search = params.get("search") || "";
    pageState.sort = params.get("sort") || "submitted_desc";
    pageState.page = parseInt(params.get("page")) || 1;
    pageState.per_page = parseInt(params.get("per_page")) || 20;

    const searchInput = document.getElementById("filter-search");
    if (searchInput) searchInput.value = pageState.search;

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) sortSelect.value = pageState.sort;

    const perPageSelect = document.getElementById("pag-per-page");
    if (perPageSelect) perPageSelect.value = pageState.per_page;
}

/**
 * Ghi state ra URL query string
 */
function writeStateToUrl() {
    const url = new URL(window.location);
    url.search = "";

    if (pageState.search) url.searchParams.set("search", pageState.search);
    if (pageState.sort && pageState.sort !== "submitted_desc") url.searchParams.set("sort", pageState.sort);
    if (pageState.page && pageState.page !== 1) url.searchParams.set("page", pageState.page);
    if (pageState.per_page && pageState.per_page !== 20) url.searchParams.set("per_page", pageState.per_page);

    window.history.pushState({}, "", url);
}

/**
 * Tự động cuộn mượt đến đầu phần danh sách
 */
function scrollToCourseReviewList() {
    const target = document.getElementById("course-review-list-section");
    if (!target) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
    });
}

/**
 * Tải dữ liệu và render giao diện
 */
async function fetchAndRender(shouldScroll = false) {
    showLoadingState();

    try {
        const res = await getCourseReviews(pageState);
        updateLastUpdateTime();

        if (res.success && res.data) {
            currentItemsData = res.data.items || [];
            renderSummary(res.data.summary);
            renderQuickInsights(currentItemsData);
            renderFilterChips();

            if (currentItemsData.length === 0) {
                showEmptyState();
            } else {
                renderTable(currentItemsData);
                showTableState();
            }

            renderPagination(res.meta);

            if (shouldScroll) {
                scrollToCourseReviewList();
            }
        } else {
            showErrorState(res.message || "Dữ liệu Kiểm duyệt khóa học không đúng API contract.");
        }
    } catch (err) {
        console.error("Lỗi khi tải dữ liệu kiểm duyệt khóa học:", err);
        const errMsg = err?.data?.message || "Không thể tải danh sách kiểm duyệt. Vui lòng kiểm tra kết nối.";
        showErrorState(errMsg);
    }
}

/**
 * Reset mọi bộ lọc
 */
function resetFilters() {
    pageState.search = "";
    pageState.sort = "submitted_desc";
    pageState.page = 1;

    const searchInput = document.getElementById("filter-search");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) {
        sortSelect.value = "submitted_desc";
        // Trigger descriptor setter để cập nhật nhãn custom select
        sortSelect.value = sortSelect.value;
    }

    writeStateToUrl();
    fetchAndRender(true);
}

/**
 * Cập nhật dòng "Cập nhật lần cuối"
 */
function updateLastUpdateTime() {
    const el = document.getElementById("last-update-time");
    if (!el) return;
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    el.textContent = formatted;
}

/**
 * Render 3 Summary Cards
 */
function renderSummary(summary) {
    if (!summary) return;

    const pendingEl = document.getElementById("summary-pending-count");
    const approvedEl = document.getElementById("summary-approved-today");
    const rejectedEl = document.getElementById("summary-rejected-today");
    const titlePendingEl = document.getElementById("title-pending-count");

    if (pendingEl) pendingEl.textContent = summary.pending_count ?? 0;
    if (approvedEl) approvedEl.textContent = summary.approved_today ?? 0;
    if (rejectedEl) rejectedEl.textContent = summary.rejected_today ?? 0;
    if (titlePendingEl) titlePendingEl.textContent = summary.pending_count ?? 0;
}

/**
 * Render Quick Insight Bar (5 thông số)
 */
function renderQuickInsights(items) {
    if (!items) return;

    // 1. Khóa mới 7 ngày
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newIn7Days = items.filter(i => new Date(i.created_at || i.updated_at) >= sevenDaysAgo).length;

    // 2. Khóa chờ lâu nhất (tính từ created_at)
    let maxWaitingDays = 0;
    items.forEach(i => {
        const createdDate = new Date(i.created_at || i.updated_at);
        const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        if (diffDays > maxWaitingDays) maxWaitingDays = diffDays;
    });

    // 3. Giá bán trung bình
    const validPrices = items.map(i => i.sale_price !== null && i.sale_price !== undefined ? i.sale_price : i.price);
    const totalPrice = validPrices.reduce((sum, p) => sum + (p || 0), 0);
    const avgPrice = items.length > 0 ? Math.round(totalPrice / items.length) : 0;

    // 4. Tổng thời lượng chờ
    const totalDurationSeconds = items.reduce((sum, i) => sum + (i.total_duration_seconds || 0), 0);
    const totalDurationHours = Math.round(totalDurationSeconds / 3600);

    // 5. Số giảng viên có khóa chờ
    const instructorIds = new Set(items.map(i => i.instructor?.id).filter(Boolean));

    // Fill UI
    const el7Days = document.getElementById("insight-recent-7-days");
    const elLongest = document.getElementById("insight-longest-waiting");
    const elAvgPrice = document.getElementById("insight-avg-price");
    const elDuration = document.getElementById("insight-total-duration");
    const elInstructors = document.getElementById("insight-unique-instructors");

    if (el7Days) el7Days.textContent = `${newIn7Days} khóa`;
    if (elLongest) elLongest.textContent = `${maxWaitingDays} ngày`;
    if (elAvgPrice) elAvgPrice.textContent = formatMoney(avgPrice);
    if (elDuration) elDuration.textContent = `${totalDurationHours} giờ`;
    if (elInstructors) elInstructors.textContent = `${instructorIds.size} giảng viên`;
}

/**
 * Render Filter Chips
 */
function renderFilterChips() {
    const container = document.getElementById("filter-chips-container");
    const list = document.getElementById("filter-chips-list");
    if (!container || !list) return;

    list.innerHTML = "";
    const chips = [];

    if (pageState.search) {
        chips.push({ key: "search", label: `Tìm kiếm: "${pageState.search}"` });
    }

    if (pageState.sort && pageState.sort !== "submitted_desc") {
        const sortLabels = {
            submitted_asc: "Sắp xếp: Chờ lâu nhất",
            title_asc: "Sắp xếp: Tên A–Z",
            title_desc: "Sắp xếp: Tên Z–A",
            price_desc: "Sắp xếp: Giá cao nhất",
            price_asc: "Sắp xếp: Giá thấp nhất",
            duration_desc: "Sắp xếp: Thời lượng dài nhất"
        };
        chips.push({ key: "sort", label: sortLabels[pageState.sort] || `Sắp xếp: ${pageState.sort}` });
    }

    if (chips.length === 0) {
        container.classList.add("hidden");
        return;
    }

    container.classList.remove("hidden");

    chips.forEach(chip => {
        const div = document.createElement("div");
        div.className = "flex items-center gap-1 bg-paper border border-hairline px-2.5 py-0.5 rounded-[4px] font-medium text-ink";
        div.innerHTML = `
            <span>${chip.label}</span>
            <button type="button" class="text-mid-gray hover:text-danger-brick p-0.5 rounded transition-colors cursor-pointer" aria-label="Xóa bộ lọc ${chip.label}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            if (chip.key === "search") {
                pageState.search = "";
                const input = document.getElementById("filter-search");
                if (input) input.value = "";
            } else if (chip.key === "sort") {
                pageState.sort = "submitted_desc";
                const select = document.getElementById("filter-sort");
                if (select) {
                    select.value = "submitted_desc";
                    select.value = select.value;
                }
            }
            pageState.page = 1;
            writeStateToUrl();
            fetchAndRender(true);
        });

        list.appendChild(div);
    });
}

/**
 * Render Table Rows
 */
function renderTable(items) {
    const tbody = document.getElementById("course-reviews-table-body");
    if (!tbody) return;

    tbody.innerHTML = items.map(item => {
        const instructor = item.instructor || {};
        const isSale = item.sale_price !== null && item.sale_price !== undefined;
        const displayPrice = isSale ? item.sale_price : item.price;

        return `
            <tr class="hover:bg-surface-alt/60 transition-colors">
                <!-- 1. Khóa học -->
                <td class="p-3 pl-4">
                    <div class="flex items-center gap-3">
                        <img src="${item.thumbnail_url || ''}" alt="Thumbnail" class="w-12 h-8 rounded-[4px] object-cover border border-hairline shrink-0 cursor-pointer btn-open-drawer" data-course-id="${item.id}" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80'">
                        <div class="min-w-0">
                            <h4 class="font-bold text-ink hover:text-mid-gray transition-colors cursor-pointer text-xs truncate max-w-[210px] btn-open-drawer" data-course-id="${item.id}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>
                            <p class="text-[10px] text-mid-gray font-mono truncate max-w-[210px] mt-0.5">${escapeHtml(item.slug)}</p>
                        </div>
                    </div>
                </td>

                <!-- 2. Giảng viên -->
                <td class="p-3">
                    <div>
                        <div class="font-semibold text-ink text-xs truncate max-w-[170px]">${escapeHtml(instructor.full_name || 'N/A')}</div>
                        <div class="text-[10px] text-mid-gray font-mono truncate max-w-[170px] mt-0.5">${escapeHtml(instructor.email || '')}</div>
                    </div>
                </td>

                <!-- 3. Mô tả ngắn -->
                <td class="p-3">
                    <p class="text-mid-gray text-xs line-clamp-2 leading-relaxed max-w-[200px]" title="${escapeHtml(item.short_description || '')}">${escapeHtml(item.short_description || 'Chưa có mô tả ngắn')}</p>
                </td>

                <!-- 4. Trình độ -->
                <td class="p-3">
                    <span class="text-xs font-medium text-ink">${formatLevel(item.level)}</span>
                </td>

                <!-- 5. Giá bán -->
                <td class="p-3">
                    <div class="font-bold text-ink text-xs">${formatMoney(displayPrice)}</div>
                    ${isSale ? `<div class="text-[10px] text-mid-gray line-through mt-0.5">${formatMoney(item.price)}</div>` : ''}
                </td>

                <!-- 6. Thời lượng -->
                <td class="p-3">
                    <span class="text-xs text-mid-gray font-medium">${formatDuration(item.total_duration_seconds)}</span>
                </td>

                <!-- 7. Ngày gửi -->
                <td class="p-3 whitespace-nowrap">
                    <div class="text-xs font-medium text-ink">${formatDateTime(item.created_at || item.updated_at)}</div>
                </td>

                <!-- 8. Trạng thái -->
                <td class="p-3 whitespace-nowrap">
                    <span class="course-review-status text-xs font-semibold text-warning">
                        <span class="h-1.5 w-1.5 rounded-full bg-warning inline-block"></span>
                        <span>Chờ duyệt</span>
                    </span>
                </td>

                <!-- 9. Thao tác -->
                <td class="p-3 pr-4 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1">
                        <button type="button" class="btn-open-drawer p-1.5 rounded-[4px] hover:bg-canvas text-mid-gray hover:text-ink transition-colors cursor-pointer" data-course-id="${item.id}" title="Xem chi tiết kiểm duyệt">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2.036 12c2.018-4.575 6.071-8 11.964-8 5.892 0 9.946 3.425 11.964 8-2.018 4.575-6.071 8-11.964 8-5.892 0-9.946-3.425-11.964-8z"/><circle cx="14" cy="12" r="3"/></svg>
                        </button>
                        <button type="button" class="btn-trigger-approve p-1.5 rounded-[4px] hover:bg-canvas text-success transition-colors cursor-pointer" data-course-id="${item.id}" title="Duyệt khóa học">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                        </button>
                        <button type="button" class="btn-trigger-reject p-1.5 rounded-[4px] hover:bg-canvas text-danger-brick transition-colors cursor-pointer" data-course-id="${item.id}" title="Từ chối khóa học">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    // Gắn sự kiện click dòng
    tbody.querySelectorAll(".btn-open-drawer").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-course-id");
            if (id) openDrawer(id);
        });
    });

    tbody.querySelectorAll(".btn-trigger-approve").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-course-id");
            if (id) openApproveModal(id);
        });
    });

    tbody.querySelectorAll(".btn-trigger-reject").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-course-id");
            if (id) openRejectModal(id);
        });
    });
}

/**
 * Render Pagination
 */
function renderPagination(meta) {
    const wrapper = document.getElementById("pagination-wrapper");
    if (!wrapper || !meta) return;

    const showingRange = document.getElementById("pag-showing-range");
    const totalRecords = document.getElementById("pag-total-records");
    const buttonsContainer = document.getElementById("pagination-buttons");

    const total = meta.total || 0;
    const page = meta.current_page || 1;
    const perPage = meta.per_page || 20;
    const lastPage = meta.last_page || 1;

    const start = total === 0 ? 0 : (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);

    if (showingRange) showingRange.textContent = `${start}-${end}`;
    if (totalRecords) totalRecords.textContent = total;

    if (!buttonsContainer) return;
    buttonsContainer.innerHTML = "";

    // Nút Trước
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = `px-2.5 py-1 rounded-[6px] border border-hairline text-xs font-medium transition-colors ${page > 1 ? "bg-canvas text-ink hover:bg-hairline cursor-pointer" : "bg-canvas/50 text-mid-gray/40 cursor-not-allowed"}`;
    prevBtn.innerHTML = "&laquo; Trang trước";
    prevBtn.disabled = page <= 1;
    prevBtn.addEventListener("click", () => {
        if (page > 1) {
            pageState.page = page - 1;
            writeStateToUrl();
            fetchAndRender(true);
        }
    });
    buttonsContainer.appendChild(prevBtn);

    // Render các số trang
    for (let i = 1; i <= lastPage; i++) {
        if (i === 1 || i === lastPage || (i >= page - 1 && i <= page + 1)) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${i === page ? "bg-ink text-white" : "border border-hairline bg-canvas text-ink hover:bg-hairline"}`;
            btn.textContent = i;
            btn.addEventListener("click", () => {
                if (i !== page) {
                    pageState.page = i;
                    writeStateToUrl();
                    fetchAndRender(true);
                }
            });
            buttonsContainer.appendChild(btn);
        } else if (i === page - 2 || i === page + 2) {
            const span = document.createElement("span");
            span.className = "px-1 text-mid-gray";
            span.textContent = "...";
            buttonsContainer.appendChild(span);
        }
    }

    // Nút Sau
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = `px-2.5 py-1 rounded-[6px] border border-hairline text-xs font-medium transition-colors ${page < lastPage ? "bg-canvas text-ink hover:bg-hairline cursor-pointer" : "bg-canvas/50 text-mid-gray/40 cursor-not-allowed"}`;
    nextBtn.innerHTML = "Trang sau &raquo;";
    nextBtn.disabled = page >= lastPage;
    nextBtn.addEventListener("click", () => {
        if (page < lastPage) {
            pageState.page = page + 1;
            writeStateToUrl();
            fetchAndRender(true);
        }
    });
    buttonsContainer.appendChild(nextBtn);
}

/**
 * Chuyển trạng thái UI sang Loading
 */
function showLoadingState() {
    document.getElementById("summary-content-wrapper")?.classList.add("hidden");
    document.getElementById("summary-loading-wrapper")?.classList.remove("hidden");

    document.getElementById("insight-content-wrapper")?.classList.add("hidden");
    document.getElementById("insight-loading-wrapper")?.classList.remove("hidden");

    document.getElementById("course-reviews-table-body")?.parentElement?.classList.add("hidden");
    document.getElementById("course-reviews-empty-state")?.classList.add("hidden");
    document.getElementById("course-reviews-error-state")?.classList.add("hidden");
    document.getElementById("course-reviews-loading-state")?.classList.remove("hidden");
}

/**
 * Chuyển trạng thái UI sang Table Data
 */
function showTableState() {
    document.getElementById("summary-loading-wrapper")?.classList.add("hidden");
    document.getElementById("summary-content-wrapper")?.classList.remove("hidden");

    document.getElementById("insight-loading-wrapper")?.classList.add("hidden");
    document.getElementById("insight-content-wrapper")?.classList.remove("hidden");

    document.getElementById("course-reviews-loading-state")?.classList.add("hidden");
    document.getElementById("course-reviews-empty-state")?.classList.add("hidden");
    document.getElementById("course-reviews-error-state")?.classList.add("hidden");
    document.getElementById("course-reviews-table-body")?.parentElement?.classList.remove("hidden");
}

/**
 * Chuyển trạng thái UI sang Empty State
 */
function showEmptyState() {
    document.getElementById("summary-loading-wrapper")?.classList.add("hidden");
    document.getElementById("summary-content-wrapper")?.classList.remove("hidden");

    document.getElementById("insight-loading-wrapper")?.classList.add("hidden");
    document.getElementById("insight-content-wrapper")?.classList.remove("hidden");

    document.getElementById("course-reviews-loading-state")?.classList.add("hidden");
    document.getElementById("course-reviews-error-state")?.classList.add("hidden");
    document.getElementById("course-reviews-table-body")?.parentElement?.classList.add("hidden");
    document.getElementById("course-reviews-empty-state")?.classList.remove("hidden");

    const emptyTitle = document.getElementById("empty-title");
    const emptyDesc = document.getElementById("empty-desc");

    if (pageState.search) {
        if (emptyTitle) emptyTitle.textContent = "Không tìm thấy khóa học phù hợp";
        if (emptyDesc) emptyDesc.textContent = `Không tìm thấy khóa học nào phù hợp với từ khóa "${pageState.search}".`;
    } else {
        if (emptyTitle) emptyTitle.textContent = "Không có khóa học chờ duyệt";
        if (emptyDesc) emptyDesc.textContent = "Tất cả yêu cầu kiểm duyệt hiện đã được xử lý xong.";
    }
}

/**
 * Chuyển trạng thái UI sang Error State
 */
function showErrorState(message) {
    document.getElementById("summary-loading-wrapper")?.classList.add("hidden");
    document.getElementById("summary-content-wrapper")?.classList.remove("hidden");

    document.getElementById("insight-loading-wrapper")?.classList.add("hidden");
    document.getElementById("insight-content-wrapper")?.classList.remove("hidden");

    document.getElementById("course-reviews-loading-state")?.classList.add("hidden");
    document.getElementById("course-reviews-empty-state")?.classList.add("hidden");
    document.getElementById("course-reviews-table-body")?.parentElement?.classList.add("hidden");

    const errState = document.getElementById("course-reviews-error-state");
    const errDesc = document.getElementById("error-desc");
    if (errDesc) errDesc.textContent = message;
    if (errState) errState.classList.remove("hidden");
}

/* ======================================================== */
/* DRAWER LOGIC (Chi tiết kiểm duyệt, Accordion & Checklist) */
/* ======================================================== */

function bindDrawerEvents() {
    const drawer = document.getElementById("review-detail-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    const closeBtn = document.getElementById("btn-close-drawer");
    const tabBtns = document.querySelectorAll(".drawer-tab-btn");

    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

    // Chuyển Tab trong Drawer
    tabBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetTab = e.currentTarget.getAttribute("data-drawer-tab");
            switchDrawerTab(targetTab);
        });
    });

    // Action footer buttons trong drawer
    const drawerApproveBtn = document.getElementById("btn-drawer-approve");
    const drawerRejectBtn = document.getElementById("btn-drawer-reject");

    if (drawerApproveBtn) {
        drawerApproveBtn.addEventListener("click", async () => {
            if (activeCourseIdForAction) {
                await closeDrawer();
                openApproveModal(activeCourseIdForAction);
            }
        });
    }

    if (drawerRejectBtn) {
        drawerRejectBtn.addEventListener("click", async () => {
            if (activeCourseIdForAction) {
                await closeDrawer();
                openRejectModal(activeCourseIdForAction);
            }
        });
    }
}

async function openDrawer(courseId) {
    const drawer = document.getElementById("review-detail-drawer");
    const panel = document.getElementById("drawer-panel");
    const loading = document.getElementById("drawer-loading");
    const loaded = document.getElementById("drawer-loaded");

    activeCourseIdForAction = courseId;
    document.getElementById("detail-course-id").textContent = courseId;

    if (drawer) drawer.classList.remove("hidden");
    setTimeout(() => {
        if (panel) panel.classList.remove("translate-x-full");
    }, 10);

    // Default tab overview
    switchDrawerTab("overview");

    if (loading) loading.classList.remove("hidden");
    if (loaded) loaded.classList.add("hidden");

    try {
        const res = await getCourseReview(courseId);
        if (res.success && res.data) {
            activeCourseDetailData = res.data;
            renderDrawerDetail(res.data);
            if (loading) loading.classList.add("hidden");
            if (loaded) loaded.classList.remove("hidden");
        } else {
            showToast({
                type: "error",
                title: "Lỗi nạp chi tiết",
                message: res.message || "Không thể nạp chi tiết khóa học."
            });
            closeDrawer();
        }
    } catch (err) {
        console.error("Lỗi nạp chi tiết khóa học:", err);
        showToast({
            type: "error",
            title: "Lỗi kết nối",
            message: "Lỗi khi tải chi tiết kiểm duyệt khóa học."
        });
        closeDrawer();
    }
}

function closeDrawer() {
    const drawer = document.getElementById("review-detail-drawer");
    const panel = document.getElementById("drawer-panel");

    if (!drawer || drawer.classList.contains("hidden")) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        if (panel) panel.classList.add("translate-x-full");

        const finishClose = () => {
            drawer.classList.add("hidden");
            resolve();
        };

        let handled = false;
        const handler = () => {
            if (handled) return;
            handled = true;
            if (panel) panel.removeEventListener("transitionend", handler);
            finishClose();
        };

        if (panel) panel.addEventListener("transitionend", handler);
        setTimeout(handler, 250);
    });
}

function switchDrawerTab(tabKey) {
    const tabBtns = document.querySelectorAll(".drawer-tab-btn");
    const panels = document.querySelectorAll(".drawer-tab-panel");

    tabBtns.forEach(btn => {
        const isCurrent = btn.getAttribute("data-drawer-tab") === tabKey;
        btn.className = `drawer-tab-btn px-4 py-2.5 text-xs font-semibold select-none whitespace-nowrap cursor-pointer transition-all ${isCurrent ? "border-b-2 border-ink text-ink font-bold" : "border-b-2 border-transparent text-mid-gray hover:text-ink font-medium"}`;
    });

    panels.forEach(p => {
        if (p.id === `drawer-tab-panel-${tabKey}`) {
            p.classList.remove("hidden");
        } else {
            p.classList.add("hidden");
        }
    });
}

function renderDrawerDetail(data) {
    const course = data.course || {};
    const sections = data.sections || [];
    const lessons = data.lessons || [];
    const checklist = data.checklist || {};
    const instructor = course.instructor || {};

    // Header badge
    const headerPassedBadge = document.getElementById("drawer-header-passed-badge");
    if (headerPassedBadge) {
        if (checklist.passed) {
            headerPassedBadge.textContent = "● Đạt checklist";
            headerPassedBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-success-soft text-success border border-success/20";
        } else {
            headerPassedBadge.textContent = "● Chưa đạt checklist";
            headerPassedBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-danger-brick-soft text-danger-brick border border-danger-brick/20";
        }
        headerPassedBadge.classList.remove("hidden");
    }

    // Tab count
    const tabLessonsCount = document.getElementById("drawer-tab-lessons-count");
    if (tabLessonsCount) tabLessonsCount.textContent = lessons.length;

    // --- TAB 1: TỔNG QUAN ---
    const imgThumb = document.getElementById("detail-thumbnail");
    if (imgThumb) imgThumb.src = course.thumbnail_url || "";

    const levelBadge = document.getElementById("detail-level-badge");
    if (levelBadge) levelBadge.textContent = `Trình độ: ${formatLevel(course.level)}`;

    const langBadge = document.getElementById("detail-language-badge");
    if (langBadge) langBadge.textContent = `Ngôn ngữ: ${course.language === "vi" ? "Tiếng Việt" : "Tiếng Anh"}`;

    const titleEl = document.getElementById("detail-title");
    if (titleEl) titleEl.textContent = course.title || "N/A";

    const slugEl = document.getElementById("detail-slug");
    if (slugEl) slugEl.textContent = `Slug: ${course.slug || ''}`;

    const isSale = course.sale_price !== null && course.sale_price !== undefined;
    const priceEl = document.getElementById("detail-price");
    if (priceEl) {
        priceEl.innerHTML = isSale
            ? `<span class="text-ink font-bold text-sm">${formatMoney(course.sale_price)}</span> <span class="text-mid-gray text-xs line-through ml-1.5">${formatMoney(course.price)}</span>`
            : `<span class="text-ink font-bold text-sm">${formatMoney(course.price)}</span>`;
    }

    const durationEl = document.getElementById("detail-duration");
    if (durationEl) durationEl.textContent = `Thời lượng: ${formatDuration(course.total_duration_seconds)}`;

    const insAvatar = document.getElementById("detail-instructor-avatar");
    if (insAvatar) insAvatar.src = instructor.avatar_url || "";

    const insName = document.getElementById("detail-instructor-name");
    if (insName) insName.textContent = instructor.full_name || "N/A";

    const insEmail = document.getElementById("detail-instructor-email");
    if (insEmail) insEmail.textContent = instructor.email || "";

    const insTitle = document.getElementById("detail-instructor-title");
    if (insTitle) insTitle.textContent = instructor.title || "Giảng viên MindHub";

    const shortDesc = document.getElementById("detail-short-desc");
    if (shortDesc) shortDesc.textContent = course.short_description || "Chưa có mô tả ngắn.";

    const fullDesc = document.getElementById("detail-description");
    if (fullDesc) fullDesc.innerHTML = course.description || "<p class='text-mid-gray italic'>Chưa có mô tả chi tiết.</p>";

    const createdAt = document.getElementById("detail-created-at");
    if (createdAt) createdAt.textContent = formatDateTime(course.created_at);

    const updatedAt = document.getElementById("detail-updated-at");
    if (updatedAt) updatedAt.textContent = formatDateTime(course.updated_at);

    // --- TAB 2: NỘI DUNG KHÓA HỌC (Accordion) ---
    const secCount = document.getElementById("detail-sections-count");
    if (secCount) secCount.textContent = sections.length;

    const totalLessonsInfo = document.getElementById("detail-total-lessons-info");
    if (totalLessonsInfo) totalLessonsInfo.textContent = `Tổng số: ${lessons.length} bài học`;

    const accordionList = document.getElementById("sections-accordion-list");
    if (accordionList) {
        if (sections.length === 0) {
            accordionList.innerHTML = `<div class="p-4 text-center text-xs text-mid-gray italic bg-canvas border border-hairline rounded-[6px]">Khóa học này chưa được khởi tạo Chương/Bài học nào.</div>`;
        } else {
            accordionList.innerHTML = sections.map((sec, idx) => {
                const secLessons = sec.lessons || [];
                const isFirst = idx === 0;

                return `
                    <div class="border border-hairline rounded-[6px] overflow-hidden bg-canvas">
                        <button type="button" class="w-full p-3 flex items-center justify-between bg-surface-alt hover:bg-hairline/60 transition-colors text-left cursor-pointer accordion-toggle" aria-expanded="${isFirst ? 'true' : 'false'}">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-mid-gray transition-transform duration-200 accordion-chevron ${isFirst ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
                                <span class="font-bold text-xs text-ink">${escapeHtml(sec.title || `Chương ${sec.order}`)}</span>
                            </div>
                            <div class="text-[10px] text-mid-gray font-medium shrink-0 ml-2">
                                ${secLessons.length} bài (${formatDuration(sec.total_duration_seconds)})
                            </div>
                        </button>
                        <div class="accordion-content ${isFirst ? '' : 'hidden'} divide-y divide-hairline bg-paper">
                            ${secLessons.map(les => `
                                <div class="p-2.5 pl-8 flex items-center justify-between text-xs hover:bg-canvas/50 transition-colors">
                                    <div class="flex items-center gap-2 min-w-0 pr-2">
                                        ${getLessonTypeIcon(les.type)}
                                        <span class="text-ink font-medium truncate">${escapeHtml(les.title)}</span>
                                        ${les.is_preview ? `<span class="text-[9px] font-bold text-success bg-success-soft px-1.5 py-0.5 rounded">Học thử</span>` : ''}
                                    </div>
                                    <span class="text-[10px] text-mid-gray shrink-0 font-mono">${formatDuration(les.duration_seconds)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join("");

            // Gắn event toggle accordion
            accordionList.querySelectorAll(".accordion-toggle").forEach(toggle => {
                toggle.addEventListener("click", (e) => {
                    const btn = e.currentTarget;
                    const content = btn.nextElementSibling;
                    const chevron = btn.querySelector(".accordion-chevron");
                    const isExpanded = btn.getAttribute("aria-expanded") === "true";

                    if (isExpanded) {
                        btn.setAttribute("aria-expanded", "false");
                        if (content) content.classList.add("hidden");
                        if (chevron) chevron.classList.remove("rotate-180");
                    } else {
                        btn.setAttribute("aria-expanded", "true");
                        if (content) content.classList.remove("hidden");
                        if (chevron) chevron.classList.add("rotate-180");
                    }
                });
            });
        }
    }

    // --- TAB 3: CHECKLIST KIỂM DUYỆT ---
    const overallCard = document.getElementById("checklist-overall-card");
    const statusDot = document.getElementById("checklist-status-dot");
    const statusTitle = document.getElementById("checklist-status-title");
    const summaryText = document.getElementById("checklist-summary-text");
    const countsBadge = document.getElementById("checklist-counts-badge");

    const missingSection = document.getElementById("checklist-missing-section");
    const missingList = document.getElementById("checklist-missing-list");

    const warningsSection = document.getElementById("checklist-warnings-section");
    const warningsList = document.getElementById("checklist-warnings-list");

    const checksList = document.getElementById("checklist-checks-list");

    if (checklist.passed) {
        if (overallCard) overallCard.className = "rounded-[6px] border border-success/30 bg-success-soft/20 p-4 flex items-start justify-between gap-3 text-success";
        if (statusDot) statusDot.className = "h-2.5 w-2.5 rounded-full bg-success inline-block";
        if (statusTitle) statusTitle.textContent = "● Đạt checklist kiểm duyệt";
        if (countsBadge) {
            countsBadge.textContent = "Đạt tiêu chuẩn";
            countsBadge.className = "text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider bg-success text-white";
        }
    } else {
        if (overallCard) overallCard.className = "rounded-[6px] border border-danger-brick/30 bg-danger-brick-soft/20 p-4 flex items-start justify-between gap-3 text-danger-brick";
        if (statusDot) statusDot.className = "h-2.5 w-2.5 rounded-full bg-danger-brick inline-block";
        if (statusTitle) statusTitle.textContent = "● Chưa đạt checklist kiểm duyệt";
        if (countsBadge) {
            const missingCount = (checklist.missing_items || []).length;
            countsBadge.textContent = `Thiếu ${missingCount} mục`;
            countsBadge.className = "text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider bg-danger-brick text-white";
        }
    }

    if (summaryText) summaryText.textContent = checklist.summary || "Thông tin đánh giá checklist kiểm duyệt.";

    // Render Missing Items
    const missingItems = checklist.missing_items || [];
    if (missingItems.length === 0) {
        if (missingSection) missingSection.classList.add("hidden");
    } else {
        if (missingSection) missingSection.classList.remove("hidden");
        if (missingList) {
            missingList.innerHTML = missingItems.map(item => `
                <li class="flex items-start gap-2 text-xs text-danger-brick font-medium leading-relaxed bg-danger-brick-soft/10 p-2 rounded-[4px] border border-danger-brick/10">
                    <svg class="w-3.5 h-3.5 text-danger-brick shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    <span>${escapeHtml(item)}</span>
                </li>
            `).join("");
        }
    }

    // Render Warnings
    const warnings = checklist.warnings || [];
    if (warnings.length === 0) {
        if (warningsSection) warningsSection.classList.add("hidden");
    } else {
        if (warningsSection) warningsSection.classList.remove("hidden");
        if (warningsList) {
            warningsList.innerHTML = warnings.map(warn => `
                <li class="flex items-start gap-2 text-xs text-ink font-medium leading-relaxed bg-warning-soft/20 p-2 rounded-[4px] border border-warning/20">
                    <svg class="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                    <span>${escapeHtml(warn)}</span>
                </li>
            `).join("");
        }
    }

    // Render Detailed Checks
    const checks = checklist.checks || [];
    if (checksList) {
        if (checks.length === 0) {
            checksList.innerHTML = `<div class="p-3 text-center text-xs text-mid-gray italic">Chưa có danh sách kiểm tra chi tiết.</div>`;
        } else {
            checksList.innerHTML = checks.map(c => `
                <div class="p-3 flex items-center justify-between text-xs">
                    <div class="space-y-0.5 pr-2">
                        <div class="font-bold text-ink">${escapeHtml(c.name)}</div>
                        <div class="text-[11px] text-mid-gray">${escapeHtml(c.message || '')}</div>
                    </div>
                    <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${c.passed ? 'bg-success-soft text-success' : 'bg-danger-brick-soft text-danger-brick'}">
                        ${c.passed ? '● Đạt' : '● Chưa đạt'}
                    </span>
                </div>
            `).join("");
        }
    }
}

/* ======================================================== */
/* MODALS LOGIC (Approve & Reject Confirmation)             */
/* ======================================================== */

function bindModalEvents() {
    // Backdrop & Close buttons
    document.querySelectorAll(".btn-close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            closeApproveModal();
            closeRejectModal();
        });
    });

    const approveBackdrop = document.getElementById("approve-modal-backdrop");
    if (approveBackdrop) approveBackdrop.addEventListener("click", closeApproveModal);

    const rejectBackdrop = document.getElementById("reject-modal-backdrop");
    if (rejectBackdrop) rejectBackdrop.addEventListener("click", closeRejectModal);

    // Approve Confirm Click
    const confirmApproveBtn = document.getElementById("btn-confirm-approve");
    if (confirmApproveBtn) {
        confirmApproveBtn.addEventListener("click", handleApproveCourse);
    }

    // Reject Textarea Counter & Realtime Validation
    const rejectReasonInput = document.getElementById("reject-reason-input");
    const counterEl = document.getElementById("reject-reason-counter");
    const errorEl = document.getElementById("reject-reason-error");

    if (rejectReasonInput) {
        rejectReasonInput.addEventListener("input", (e) => {
            const text = e.target.value;
            if (counterEl) counterEl.textContent = text.length;

            if (text.trim().length > 0 && text.length <= 1000) {
                if (errorEl) errorEl.classList.add("hidden");
            }
        });
    }

    // Reject Confirm Click
    const confirmRejectBtn = document.getElementById("btn-confirm-reject");
    if (confirmRejectBtn) {
        confirmRejectBtn.addEventListener("click", handleRejectCourse);
    }
}

function openApproveModal(courseId) {
    activeCourseIdForAction = courseId;
    const targetItem = currentItemsData.find(c => c.id == courseId);

    const modal = document.getElementById("approve-course-modal");
    const titleEl = document.getElementById("approve-preview-title");
    const insEl = document.getElementById("approve-preview-instructor");
    const priceEl = document.getElementById("approve-preview-price");
    const chkEl = document.getElementById("approve-preview-checklist");

    if (targetItem) {
        if (titleEl) titleEl.textContent = targetItem.title;
        if (insEl) insEl.textContent = targetItem.instructor?.full_name || "N/A";
        const displayPrice = targetItem.sale_price ?? targetItem.price;
        if (priceEl) priceEl.textContent = `Giá: ${formatMoney(displayPrice)}`;
        if (chkEl) {
            const passed = targetItem.checklist?.passed ?? true;
            chkEl.textContent = passed ? "Checklist: ● Đạt" : "Checklist: ● Chưa đạt";
            chkEl.className = passed ? "font-bold text-success" : "font-bold text-warning";
        }
    }

    if (modal) modal.classList.remove("hidden");
}

function closeApproveModal() {
    const modal = document.getElementById("approve-course-modal");
    if (modal) modal.classList.add("hidden");
}

function openRejectModal(courseId) {
    activeCourseIdForAction = courseId;
    const targetItem = currentItemsData.find(c => c.id == courseId);

    const modal = document.getElementById("reject-course-modal");
    const titleEl = document.getElementById("reject-preview-title");
    const insEl = document.getElementById("reject-preview-instructor");
    const input = document.getElementById("reject-reason-input");
    const counterEl = document.getElementById("reject-reason-counter");
    const errorEl = document.getElementById("reject-reason-error");

    if (targetItem) {
        if (titleEl) titleEl.textContent = targetItem.title;
        if (insEl) insEl.textContent = targetItem.instructor?.full_name || "N/A";
    }

    if (input) input.value = "";
    if (counterEl) counterEl.textContent = "0";
    if (errorEl) errorEl.classList.add("hidden");

    if (modal) modal.classList.remove("hidden");
}

function closeRejectModal() {
    const modal = document.getElementById("reject-course-modal");
    if (modal) modal.classList.add("hidden");
}

/**
 * Thao tác Duyệt khóa học
 */
async function handleApproveCourse() {
    if (!activeCourseIdForAction || isSubmitting) return;
    isSubmitting = true;

    const btn = document.getElementById("btn-confirm-approve");
    const btnText = document.getElementById("approve-btn-text");
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = "Đang xử lý...";

    try {
        const res = await approveCourse(activeCourseIdForAction);
        closeApproveModal();
        closeDrawer();
        showToast({
            type: "success",
            title: "Đã duyệt khóa học",
            message: res.message || "Khóa học đã được duyệt thành công."
        });
        await fetchAndRender(false);
    } catch (err) {
        console.error("Lỗi duyệt khóa học:", err);
        const status = err.status || err?.data?.status;
        const msg = err?.data?.message || "Đã xảy ra lỗi khi duyệt khóa học.";

        if (status === 409) {
            showToast({
                type: "warning",
                title: "Khóa học đã được xử lý",
                message: "Khóa học này đã được một quản trị viên khác xử lý trước đó."
            });
            closeApproveModal();
            closeDrawer();
            await fetchAndRender(false);
        } else {
            showToast({
                type: "error",
                title: "Không thể xử lý khóa học",
                message: msg
            });
        }
    } finally {
        isSubmitting = false;
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = "Xác nhận duyệt";
    }
}

/**
 * Thao tác Từ chối khóa học
 */
async function handleRejectCourse() {
    if (!activeCourseIdForAction || isSubmitting) return;

    const input = document.getElementById("reject-reason-input");
    const errorEl = document.getElementById("reject-reason-error");
    const reason = (input?.value || "").trim();

    if (!reason) {
        if (errorEl) {
            errorEl.textContent = "Vui lòng nhập lý do từ chối.";
            errorEl.classList.remove("hidden");
        }
        return;
    }

    if (reason.length > 1000) {
        if (errorEl) {
            errorEl.textContent = "Lý do từ chối không được vượt quá 1000 ký tự.";
            errorEl.classList.remove("hidden");
        }
        return;
    }

    isSubmitting = true;
    const btn = document.getElementById("btn-confirm-reject");
    const btnText = document.getElementById("reject-btn-text");
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = "Đang xử lý...";

    try {
        const res = await rejectCourse(activeCourseIdForAction, { admin_reject_reason: reason });
        closeRejectModal();
        closeDrawer();
        showToast({
            type: "success",
            title: "Đã từ chối khóa học",
            message: res.message || "Khóa học đã được gửi lại để giảng viên chỉnh sửa."
        });
        await fetchAndRender(false);
    } catch (err) {
        console.error("Lỗi từ chối khóa học:", err);
        const status = err.status || err?.data?.status;
        const msg = err?.data?.message || "Đã xảy ra lỗi khi từ chối khóa học.";

        if (status === 409) {
            showToast({
                type: "warning",
                title: "Khóa học đã được xử lý",
                message: "Khóa học này đã được một quản trị viên khác xử lý trước đó."
            });
            closeRejectModal();
            closeDrawer();
            await fetchAndRender(false);
        } else if (status === 422) {
            if (errorEl) {
                errorEl.textContent = msg;
                errorEl.classList.remove("hidden");
            }
            showToast({
                type: "warning",
                title: "Vui lòng kiểm tra lại",
                message: msg || "Vui lòng kiểm tra lại lý do từ chối."
            });
        } else {
            showToast({
                type: "error",
                title: "Không thể xử lý khóa học",
                message: msg
            });
        }
    } finally {
        isSubmitting = false;
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = "Xác nhận từ chối";
    }
}

/* ======================================================== */
/* HELPER FORMATTERS                                        */
/* ======================================================== */

function formatMoney(amount) {
    if (amount === 0 || amount === "0") return "Miễn phí";
    if (!amount && amount !== 0) return "---";
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatDuration(totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) return "Chưa có thời lượng";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
        return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
        return `${hours} giờ`;
    } else {
        return `${minutes} phút`;
    }
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "---";
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return dateTimeStr;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatLevel(level) {
    const levels = {
        beginner: "Cơ bản",
        intermediate: "Trung cấp",
        advanced: "Nâng cao",
        all_levels: "Mọi trình độ"
    };
    return levels[level] || level || "Chưa rõ";
}

function getLessonTypeIcon(type) {
    if (type === "video") {
        return `<svg class="w-3.5 h-3.5 text-mid-gray shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    } else if (type === "quiz") {
        return `<svg class="w-3.5 h-3.5 text-mid-gray shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else {
        return `<svg class="w-3.5 h-3.5 text-mid-gray shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
