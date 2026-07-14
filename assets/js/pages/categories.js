import * as categoriesApi from "../api/categories-api.js";
import { showToast } from "../toast.js";

// Trạng thái hiện tại của trang
let pageState = {
    search: "",
    status: "",
    type: "",
    parent_id: "",
    sort_by: "newest",
    page: 1,
    per_page: 20
};

// Lưu toàn bộ danh sách để phục vụ kiểm tra con cháu và nạp dropdown
let cachedAllCategories = [];

// Đối tượng danh mục đang thao tác
let activeCategory = null;

// Biến debounce cho ô tìm kiếm
let searchTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Đã tải trang: Quản lý danh mục (Script logic)");

    // Đọc bộ lọc từ URL
    readStateFromUrl();

    // Khởi tạo các sự kiện giao diện
    initFilterEvents();
    initModalEvents();
    initActionEvents();
    initSortOrderInputEvents();

    // Tải dữ liệu ban đầu
    fetchAndRender();
});

/**
 * Đọc query params từ URL để thiết lập bộ lọc
 */
function readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    
    pageState.search = params.get("search") || "";
    pageState.status = params.get("status") || "";
    pageState.type = params.get("type") || "";
    pageState.parent_id = params.get("parent_id") || "";
    pageState.sort_by = params.get("sort_by") || "newest";
    pageState.page = parseInt(params.get("page")) || 1;
    pageState.per_page = parseInt(params.get("per_page")) || 20;

    // Cập nhật giá trị hiển thị trên các input lọc
    document.getElementById("filter-search").value = pageState.search;
    document.getElementById("filter-status").value = pageState.status;
    document.getElementById("filter-type").value = pageState.type;
    document.getElementById("filter-parent").value = pageState.parent_id;
    document.getElementById("filter-sort").value = pageState.sort_by;
    document.getElementById("pag-per-page").value = pageState.per_page;
}

/**
 * Cập nhật query string trên URL dựa trên pageState
 */
function writeStateToUrl() {
    const url = new URL(window.location);
    url.search = "";

    Object.keys(pageState).forEach(key => {
        const val = pageState[key];
        if (val !== undefined && val !== null && val !== "") {
            if (key === "page" && val === 1) return;
            if (key === "per_page" && val === 20) return;
            if (key === "sort_by" && val === "newest") return;
            url.searchParams.set(key, val);
        }
    });

    window.history.pushState({}, "", url);
}

/**
 * Hiện thị / Ẩn skeletons khi load dữ liệu
 */
function toggleLoading(isLoading) {
    const kpiLoaded = document.getElementById("kpi-content-wrapper");
    const kpiLoading = document.getElementById("kpi-loading-wrapper");
    const tableBody = document.getElementById("categories-table-body");
    const tableLoading = document.getElementById("categories-loading-state");
    const tableEmpty = document.getElementById("categories-empty-state");
    const tableFilterEmpty = document.getElementById("categories-filter-empty-state");
    const tableError = document.getElementById("categories-error-state");
    const pagination = document.getElementById("pagination-wrapper");

    // Khóa các ô lọc khi đang tải dữ liệu
    const filterInputs = document.querySelectorAll("#filter-form input, #filter-form select, #filter-form button");
    filterInputs.forEach(input => {
        input.disabled = isLoading;
    });

    if (isLoading) {
        kpiLoaded.classList.add("hidden");
        kpiLoading.classList.remove("hidden");
        
        tableBody.innerHTML = "";
        tableLoading.classList.remove("hidden");
        tableEmpty.classList.add("hidden");
        tableFilterEmpty.classList.add("hidden");
        tableError.classList.add("hidden");
        pagination.classList.add("pointer-events-none", "opacity-50");
    } else {
        kpiLoaded.classList.remove("hidden");
        kpiLoading.classList.add("hidden");
        
        tableLoading.classList.add("hidden");
        pagination.classList.remove("pointer-events-none", "opacity-50");
    }
}

/**
 * Fetch danh sách danh mục từ API và kết xuất lên giao diện
 */
async function fetchAndRender() {
    toggleLoading(true);

    try {
        const response = await categoriesApi.getCategories(pageState);
        
        if (!response || !response.success) {
            showErrorState(response ? response.message : "Đã xảy ra lỗi không xác định.");
            return;
        }

        // Cập nhật thống kê, danh sách lọc và bảng dữ liệu
        renderSummary(response.data.summary);
        
        // Lưu cache toàn bộ danh mục để làm cha
        cachedAllCategories = response.data.items || [];
        
        // Nạp dropdown lọc danh mục cha
        populateParentFilterOptions(response.data.items || []);
        
        // Render bảng danh mục
        renderTable(response.data.items);
        
        // Render phân trang
        renderPagination(response.meta);
        
        // Render chips bộ lọc hoạt động
        renderFilterChips();

        toggleLoading(false);
    } catch (error) {
        console.error("Lỗi fetch categories:", error);
        showErrorState("Không thể kết nối đến máy chủ dữ liệu.");
    }
}

/**
 * Hiển thị giao diện lỗi
 */
function showErrorState(message) {
    toggleLoading(false);
    document.getElementById("kpi-content-wrapper").classList.remove("hidden");
    document.getElementById("kpi-loading-wrapper").classList.add("hidden");
    
    document.getElementById("categories-table-body").innerHTML = "";
    document.getElementById("categories-loading-state").classList.add("hidden");
    document.getElementById("categories-empty-state").classList.add("hidden");
    document.getElementById("categories-filter-empty-state").classList.add("hidden");
    
    const errorState = document.getElementById("categories-error-state");
    errorState.classList.remove("hidden");
    
    const desc = errorState.querySelector("p");
    if (desc) desc.textContent = message || "Đã xảy ra lỗi khi kết nối dữ liệu. Vui lòng thử lại.";
}

/**
 * Render chỉ số thống kê
 */
function renderSummary(summary) {
    if (!summary) return;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = new Intl.NumberFormat("vi-VN").format(val || 0);
    };

    setVal("kpi-total-categories", summary.total_categories);
    setVal("kpi-active-categories", summary.active_categories);
    setVal("kpi-inactive-categories", summary.inactive_categories);
    setVal("kpi-root-categories", summary.root_categories);
    setVal("kpi-empty-categories", summary.empty_categories);

    setVal("title-total-categories", summary.total_categories);
}

/**
 * Nạp danh mục cha vào các phần tử chọn
 */
function populateParentFilterOptions(categories) {
    const parentSelect = document.getElementById("filter-parent");
    if (!parentSelect) return;

    const currentVal = parentSelect.value;
    
    // Chỉ lấy các danh mục gốc làm cha để hiển thị đơn giản
    const rootCats = categories.filter(c => c.parent_id === null);

    let html = '<option value="">Tất cả cha</option>';
    rootCats.forEach(c => {
        html += `<option value="${c.id}" ${currentVal === String(c.id) ? "selected" : ""}>${c.name}</option>`;
    });

    parentSelect.innerHTML = html;

    // Tự động khởi tạo lại Custom Select nếu thư viện có hỗ trợ
    if (typeof window.initAllCustomSelects === "function") {
        window.initAllCustomSelects();
    }
}

/**
 * Render bảng danh sách
 */
function renderTable(items) {
    const tableBody = document.getElementById("categories-table-body");
    const emptyState = document.getElementById("categories-empty-state");
    const filterEmptyState = document.getElementById("categories-filter-empty-state");

    if (items.length === 0) {
        if (pageState.search || pageState.status || pageState.type || pageState.parent_id) {
            filterEmptyState.classList.remove("hidden");
        } else {
            emptyState.classList.remove("hidden");
        }
        tableBody.innerHTML = "";
        return;
    }

    emptyState.classList.add("hidden");
    filterEmptyState.classList.add("hidden");

    let html = "";
    items.forEach(c => {
        const isChild = c.parent_id !== null;
        const indentClass = isChild ? "pl-8" : "pl-4";
        const indentIcon = isChild ? '<span class="text-mid-gray/40 font-mono mr-1.5 select-none">└──</span>' : '';
        
        // Parent Badge
        let parentBadge = `<span class="px-2 py-0.5 rounded-[6px] bg-canvas text-mid-gray border border-hairline font-semibold text-[10px] font-sans">Danh mục gốc</span>`;
        if (c.parent) {
            parentBadge = `<span class="font-medium text-ink">${escapeHTML(c.parent.name)}</span>`;
        }

        // Course Count Clickable
        let coursesCol = `<span class="text-mid-gray italic">Chưa có khóa học</span>`;
        if (c.course_count > 0) {
            coursesCol = `<a href="courses.html?category_id=${c.id}" class="underline text-mid-gray hover:text-ink font-semibold transition-colors">${c.course_count} khóa học</a>`;
        }

        // Status Badge
        const statusBadge = c.status === "active" 
            ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft text-success border border-success/10">Đang hoạt động</span>`
            : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-canvas text-mid-gray border border-hairline">Ngừng hoạt động</span>`;

        // Action menu constraints
        // 1. Kiểm tra xem có chứa danh mục con hay không
        const hasChildren = cachedAllCategories.some(cat => cat.parent_id === c.id);
        const hasCourses = c.course_count > 0;
        const canDelete = !hasChildren && !hasCourses;
        
        let deleteBtnClass = "btn-delete-cat text-danger-brick hover:bg-danger-brick-soft/30";
        let deleteTitle = "Xóa danh mục này";
        let deleteAttr = `data-id="${c.id}"`;

        if (!canDelete) {
            deleteBtnClass = "opacity-40 cursor-not-allowed text-mid-gray";
            deleteTitle = hasChildren 
                ? "Không thể xóa: Danh mục đang có danh mục con trực thuộc." 
                : `Không thể xóa: Danh mục đang được liên kết với ${c.course_count} khóa học.`;
            deleteAttr = `disabled title="${deleteTitle}"`;
        }

        const dateStr = formatDateTime(c.updated_at || c.created_at);

        html += `
        <tr class="hover:bg-canvas/40 transition-colors h-12" data-row-id="${c.id}">
            <td class="py-2.5 ${indentClass} font-medium text-ink select-text">
                <div class="flex items-center gap-1">
                    ${indentIcon}
                    <div class="truncate">
                        <span class="font-semibold text-ink">${escapeHTML(c.name)}</span>
                        <p class="text-[10px] text-mid-gray/80 truncate max-w-[280px] font-normal" title="${escapeHTML(c.description || 'Chưa có mô tả.')}">
                            ${escapeHTML(c.description || 'Chưa có mô tả.')}
                        </p>
                    </div>
                </div>
            </td>
            <td class="px-3 py-2.5 whitespace-nowrap text-mid-gray select-text">
                ${parentBadge}
            </td>
            <td class="px-3 py-2.5 whitespace-nowrap font-mono text-[11px] text-ink select-text">
                <div class="flex items-center gap-1.5">
                    <span class="truncate max-w-[120px] bg-canvas/60 px-1.5 py-0.5 rounded border border-hairline">${escapeHTML(c.slug)}</span>
                    <button type="button" class="btn-copy-slug text-mid-gray hover:text-ink p-0.5 hover:bg-canvas rounded transition-colors cursor-pointer" data-slug="${escapeHTML(c.slug)}" title="Sao chép slug">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"/>
                        </svg>
                    </button>
                </div>
            </td>
            <td class="px-3 py-2.5 text-center select-text">
                ${coursesCol}
            </td>
            <td class="px-3 py-2.5 text-center">
                <div class="flex items-center justify-center gap-1">
                    <input type="number" value="${c.sort_order}" min="0" data-id="${c.id}" class="sort-order-input w-12 h-7 px-1 text-center bg-canvas focus:bg-paper border border-hairline rounded-[6px] focus:ring-1 focus:ring-mid-gray/40 outline-none text-ink text-xs inline-block">
                </div>
            </td>
            <td class="px-3 py-2.5 text-center">
                ${statusBadge}
            </td>
            <td class="px-3 py-2.5 whitespace-nowrap text-mid-gray">
                ${dateStr}
            </td>
            <td class="pr-4 py-2.5 text-right relative">
                <div class="inline-block text-left dropdown-wrapper">
                    <button type="button" class="btn-toggle-dropdown p-1 hover:bg-canvas rounded-full text-mid-gray hover:text-ink transition-colors cursor-pointer" data-id="${c.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                        </svg>
                    </button>
                    <!-- Dropdown Panel -->
                    <div class="dropdown-menu absolute right-0 mt-1 w-36 bg-paper border border-hairline rounded-[6px] shadow-lg z-10 hidden py-1 select-none">
                        <button type="button" class="btn-view-cat w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-canvas transition-colors cursor-pointer flex items-center gap-1.5" data-id="${c.id}">
                            Xem chi tiết
                        </button>
                        <button type="button" class="btn-edit-cat w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-canvas transition-colors cursor-pointer flex items-center gap-1.5" data-id="${c.id}">
                            Chỉnh sửa
                        </button>
                        ${
                            c.status === "active"
                            ? `<button type="button" class="btn-status-cat w-full text-left px-3 py-1.5 text-xs text-warning hover:bg-warning-soft/30 transition-colors cursor-pointer" data-id="${c.id}" data-action="inactive">Vô hiệu hóa</button>`
                            : `<button type="button" class="btn-status-cat w-full text-left px-3 py-1.5 text-xs text-success hover:bg-success-soft/30 transition-colors cursor-pointer" data-id="${c.id}" data-action="active">Kích hoạt</button>`
                        }
                        <div class="h-px bg-hairline my-0.5"></div>
                        <button type="button" class="w-full text-left px-3 py-1.5 text-xs cursor-pointer ${deleteBtnClass}" ${deleteAttr}>
                            Xóa danh mục
                        </button>
                    </div>
                </div>
            </td>
        </tr>`;
    });

    tableBody.innerHTML = html;
    initDropdownToggler();
}

/**
 * Khởi tạo ẩn/hiện menu thao tác dropdown
 */
function initDropdownToggler() {
    const togglers = document.querySelectorAll(".btn-toggle-dropdown");
    
    togglers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const parent = btn.closest(".dropdown-wrapper");
            const menu = parent.querySelector(".dropdown-menu");

            // Đóng các dropdown khác đang mở
            document.querySelectorAll(".dropdown-menu").forEach(m => {
                if (m !== menu) m.classList.add("hidden");
            });

            menu.classList.toggle("hidden");
        });
    });
}

/**
 * Click ra ngoài tự đóng các dropdown
 */
document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.add("hidden"));
});

/**
 * Render phân trang
 */
function renderPagination(meta) {
    if (!meta) return;

    const startEl = document.getElementById("table-range-start");
    const endEl = document.getElementById("table-range-end");
    const totalEl = document.getElementById("table-total-count");
    
    const total = meta.total || 0;
    const startRange = total > 0 ? (meta.current_page - 1) * meta.per_page + 1 : 0;
    const endRange = Math.min(total, meta.current_page * meta.per_page);

    startEl.textContent = startRange;
    endEl.textContent = endRange;
    totalEl.textContent = total;

    // Render nút trang trước và trang sau
    const prevBtn = document.getElementById("btn-pag-prev");
    const nextBtn = document.getElementById("btn-pag-next");

    prevBtn.disabled = meta.current_page === 1;
    nextBtn.disabled = meta.current_page === meta.last_page;

    // Render danh sách số trang
    const pagesContainer = document.getElementById("pagination-pages");
    let html = "";
    
    const startPage = Math.max(1, meta.current_page - 2);
    const endPage = Math.min(meta.last_page, meta.current_page + 2);

    if (startPage > 1) {
        html += `<button type="button" class="btn-page h-8 w-8 text-xs font-semibold rounded-[6px] border border-hairline hover:bg-canvas transition-colors cursor-pointer" data-page="1">1</button>`;
        if (startPage > 2) {
            html += `<span class="text-xs text-mid-gray px-1">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === meta.current_page;
        const activeClass = isActive 
            ? "bg-ink text-white font-bold border-ink" 
            : "bg-paper text-ink hover:bg-canvas border-hairline";
        html += `<button type="button" class="btn-page h-8 w-8 text-xs font-semibold rounded-[6px] border ${activeClass} transition-colors cursor-pointer" data-page="${i}">${i}</button>`;
    }

    if (endPage < meta.last_page) {
        if (endPage < meta.last_page - 1) {
            html += `<span class="text-xs text-mid-gray px-1">...</span>`;
        }
        html += `<button type="button" class="btn-page h-8 w-8 text-xs font-semibold rounded-[6px] border border-hairline hover:bg-canvas transition-colors cursor-pointer" data-page="${meta.last_page}">${meta.last_page}</button>`;
    }

    pagesContainer.innerHTML = html;

    // Sự kiện chuyển trang
    pagesContainer.querySelectorAll(".btn-page").forEach(btn => {
        btn.addEventListener("click", () => {
            pageState.page = parseInt(btn.getAttribute("data-page"));
            writeStateToUrl();
            fetchAndRender();
        });
    });
}

/**
 * Render chips lọc hiển thị
 */
function renderFilterChips() {
    const container = document.getElementById("filter-chips-container");
    if (!container) return;

    let chips = [];
    if (pageState.search) {
        chips.push({ key: "search", label: `Từ khóa: "${pageState.search}"` });
    }
    if (pageState.status) {
        const label = pageState.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động";
        chips.push({ key: "status", label: `Trạng thái: ${label}` });
    }
    if (pageState.type) {
        const label = pageState.type === "root" ? "Danh mục gốc" : "Danh mục con";
        chips.push({ key: "type", label: `Loại: ${label}` });
    }
    if (pageState.parent_id) {
        const parent = cachedAllCategories.find(c => c.id === Number(pageState.parent_id));
        const name = parent ? parent.name : pageState.parent_id;
        chips.push({ key: "parent_id", label: `Cha: ${name}` });
    }

    if (chips.length === 0) {
        container.classList.add("hidden");
        container.innerHTML = "";
        return;
    }

    container.classList.remove("hidden");
    let html = `<span class="text-[10px] font-semibold text-mid-gray uppercase tracking-wider mr-1">Đang lọc theo:</span>`;
    chips.forEach(chip => {
        html += `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-canvas border border-hairline text-ink">
            ${escapeHTML(chip.label)}
            <button type="button" class="btn-remove-chip hover:text-danger-brick cursor-pointer p-0.5" data-key="${chip.key}">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </span>`;
    });

    container.innerHTML = html;

    // Lắng nghe sự kiện click xóa chip
    container.querySelectorAll(".btn-remove-chip").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-key");
            
            // Xóa state
            pageState[key] = "";
            pageState.page = 1;

            // Reset input tương ứng
            if (key === "search") document.getElementById("filter-search").value = "";
            if (key === "status") document.getElementById("filter-status").value = "";
            if (key === "type") document.getElementById("filter-type").value = "";
            if (key === "parent_id") document.getElementById("filter-parent").value = "";

            writeStateToUrl();
            fetchAndRender();
        });
    });
}

/**
 * Khởi tạo sự kiện của bộ lọc
 */
function initFilterEvents() {
    const searchInput = document.getElementById("filter-search");
    const statusSelect = document.getElementById("filter-status");
    const typeSelect = document.getElementById("filter-type");
    const parentSelect = document.getElementById("filter-parent");
    const sortSelect = document.getElementById("filter-sort");
    const resetBtn = document.getElementById("btn-reset-filters");
    const filterResetBtn = document.getElementById("btn-filter-reset");
    const retryBtn = document.getElementById("btn-retry-load");

    // Sự kiện tìm kiếm có Debounce
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            pageState.search = e.target.value.trim();
            pageState.page = 1;
            writeStateToUrl();
            fetchAndRender();
        }, 400);
    });

    // Các select thay đổi tự động lọc
    const handleSelectChange = (key, selectEl) => {
        selectEl.addEventListener("change", () => {
            pageState[key] = selectEl.value;
            pageState.page = 1;
            writeStateToUrl();
            fetchAndRender();
        });
    };

    handleSelectChange("status", statusSelect);
    handleSelectChange("type", typeSelect);
    handleSelectChange("parent_id", parentSelect);
    handleSelectChange("sort_by", sortSelect);

    // Thay đổi số dòng trên trang
    document.getElementById("pag-per-page").addEventListener("change", (e) => {
        pageState.per_page = parseInt(e.target.value);
        pageState.page = 1;
        writeStateToUrl();
        fetchAndRender();
    });

    // Trang trước/sau
    document.getElementById("btn-pag-prev").addEventListener("click", () => {
        if (pageState.page > 1) {
            pageState.page--;
            writeStateToUrl();
            fetchAndRender();
        }
    });
    document.getElementById("btn-pag-next").addEventListener("click", () => {
        pageState.page++;
        writeStateToUrl();
        fetchAndRender();
    });

    // Nút Đặt lại bộ lọc
    const resetAllFilters = () => {
        pageState = {
            search: "",
            status: "",
            type: "",
            parent_id: "",
            sort_by: "newest",
            page: 1,
            per_page: 20
        };

        searchInput.value = "";
        statusSelect.value = "";
        typeSelect.value = "";
        parentSelect.value = "";
        sortSelect.value = "newest";
        document.getElementById("pag-per-page").value = 20;

        writeStateToUrl();
        fetchAndRender();
    };

    resetBtn.addEventListener("click", resetAllFilters);
    if (filterResetBtn) filterResetBtn.addEventListener("click", resetAllFilters);
    if (retryBtn) retryBtn.addEventListener("click", fetchAndRender);

    // Refresh dữ liệu
    document.getElementById("btn-refresh-list").addEventListener("click", () => {
        const icon = document.getElementById("refresh-icon");
        icon.classList.add("rotate-180");
        setTimeout(() => icon.classList.remove("rotate-180"), 500);
        fetchAndRender();
    });
}

/**
 * Khởi tạo sự kiện sao chép slug và action buttons trong table
 */
function initActionEvents() {
    const tableBody = document.getElementById("categories-table-body");

    tableBody.addEventListener("click", async (e) => {
        // 1. Sao chép slug
        const btnCopy = e.target.closest(".btn-copy-slug");
        if (btnCopy) {
            e.stopPropagation();
            const slug = btnCopy.getAttribute("data-slug");
            try {
                await navigator.clipboard.writeText(slug);
                showToast({ type: "success", title: "Sao chép thành công", message: `Đã sao chép: ${slug}` });
            } catch (err) {
                console.error("Lỗi copy:", err);
                showToast({ type: "error", title: "Không thể sao chép", message: "Trình duyệt không hỗ trợ truy cập clipboard." });
            }
            return;
        }

        // 2. Xem chi tiết
        const btnView = e.target.closest(".btn-view-cat");
        if (btnView) {
            e.stopPropagation();
            const id = btnView.getAttribute("data-id");
            openDetailDrawer(id);
            return;
        }

        // 3. Chỉnh sửa
        const btnEdit = e.target.closest(".btn-edit-cat");
        if (btnEdit) {
            e.stopPropagation();
            const id = btnEdit.getAttribute("data-id");
            openEditModal(id);
            return;
        }

        // 4. Đổi trạng thái
        const btnStatus = e.target.closest(".btn-status-cat");
        if (btnStatus) {
            e.stopPropagation();
            const id = btnStatus.getAttribute("data-id");
            const newStatus = btnStatus.getAttribute("data-action");
            openConfirmStatusModal(id, newStatus);
            return;
        }

        // 5. Xóa mềm
        const btnDelete = e.target.closest(".btn-delete-cat");
        if (btnDelete) {
            e.stopPropagation();
            if (btnDelete.hasAttribute("disabled")) return;
            const id = btnDelete.getAttribute("data-id");
            openConfirmDeleteModal(id);
            return;
        }
    });

    // Button tạo ở trạng thái trống
    const btnEmptyCreate = document.getElementById("btn-empty-create");
    if (btnEmptyCreate) {
        btnEmptyCreate.addEventListener("click", () => {
            openCreateModal();
        });
    }
}

/**
 * Khởi tạo sự kiện của Sort Order Input
 */
function initSortOrderInputEvents() {
    const tableBody = document.getElementById("categories-table-body");

    // Click liên tục và lưu trực tiếp khi thay đổi
    let sortSaveTimeouts = {};

    tableBody.addEventListener("change", (e) => {
        const input = e.target.closest(".sort-order-input");
        if (!input) return;

        const id = input.getAttribute("data-id");
        const val = parseInt(input.value);
        if (isNaN(val) || val < 0) {
            input.value = 0;
            return;
        }

        // Đóng băng input
        input.disabled = true;

        clearTimeout(sortSaveTimeouts[id]);
        sortSaveTimeouts[id] = setTimeout(async () => {
            try {
                const response = await categoriesApi.updateCategory(id, { sort_order: val });
                if (response && response.success) {
                    showToast({ type: "success", title: "Cập nhật thành công", message: `Đã đổi thứ tự hiển thị thành ${val}.` });
                    fetchAndRender();
                } else {
                    showToast({ type: "error", title: "Thất bại", message: response.message || "Không thể cập nhật thứ tự." });
                    input.disabled = false;
                }
            } catch (err) {
                console.error("Lỗi cập nhật sort order:", err);
                showToast({ type: "error", title: "Lỗi kết nối", message: "Đã xảy ra sự cố khi lưu thứ tự hiển thị." });
                input.disabled = false;
            }
        }, 300);
    });
}

/**
 * Sự kiện mở / đóng modal và sinh slug tự động
 */
function initModalEvents() {
    const btnAdd = document.getElementById("btn-add-category");
    
    // Nút mở modal tạo
    btnAdd.addEventListener("click", () => {
        openCreateModal();
    });

    // Sự kiện đóng modal tự động thông qua data-close-modal
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-close-modal");
            closeModal(modalId);
        });
    });

    // Sinh slug tự động cho Create Form
    const createNameInput = document.getElementById("create-name");
    const createSlugInput = document.getElementById("create-slug");
    const btnGenerateSlugCreate = document.getElementById("btn-generate-slug-create");

    let createSlugManuallyEdited = false;
    createSlugInput.addEventListener("input", () => {
        createSlugManuallyEdited = true;
    });

    createNameInput.addEventListener("input", () => {
        if (!createSlugManuallyEdited) {
            createSlugInput.value = generateSlug(createNameInput.value);
        }
    });

    btnGenerateSlugCreate.addEventListener("click", () => {
        createSlugInput.value = generateSlug(createNameInput.value);
        createSlugManuallyEdited = false;
    });

    // Sinh slug tự động cho Edit Form
    const editNameInput = document.getElementById("edit-name");
    const editSlugInput = document.getElementById("edit-slug");
    const btnGenerateSlugEdit = document.getElementById("btn-generate-slug-edit");

    let editSlugManuallyEdited = false;
    editSlugInput.addEventListener("input", () => {
        editSlugManuallyEdited = true;
    });

    editNameInput.addEventListener("input", () => {
        if (!editSlugManuallyEdited) {
            editSlugInput.value = generateSlug(editNameInput.value);
        }
    });

    btnGenerateSlugEdit.addEventListener("click", () => {
        editSlugInput.value = generateSlug(editNameInput.value);
        editSlugManuallyEdited = false;
    });

    // Đếm số ký tự mô tả
    const setupCharCounter = (textareaId, counterId) => {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        textarea.addEventListener("input", () => {
            counter.textContent = textarea.value.length;
        });
    };
    setupCharCounter("create-description", "create-desc-count");
    setupCharCounter("edit-description", "edit-desc-count");

    // Xử lý click Submit thêm mới
    document.getElementById("btn-submit-create").addEventListener("click", submitCreateForm);

    // Xử lý click Submit chỉnh sửa
    document.getElementById("btn-submit-edit").addEventListener("click", submitEditForm);

    // Đổi trạng thái modal
    document.getElementById("btn-submit-status").addEventListener("click", submitStatusChange);

    // Xóa mềm modal
    document.getElementById("btn-submit-delete").addEventListener("click", submitDeleteCategory);
}

/**
 * Mở modal
 */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("hidden");
        // Reset validation errors
        modal.querySelectorAll("[data-error]").forEach(p => {
            p.classList.add("hidden");
            p.textContent = "";
        });
    }
}

/**
 * Đóng modal
 */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("hidden");
    }
}

/**
 * Sinh slug chuẩn SEO từ Tiếng Việt có dấu
 */
function generateSlug(text) {
    let slug = text.toString().toLowerCase().trim();
    
    // Thay ký tự tiếng Việt
    const sets = [
        { src: /a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, replace: 'a' },
        { src: /e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, replace: 'e' },
        { src: /i|ì|í|ị|ỉ|ĩ/g, replace: 'i' },
        { src: /o|ò|á|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, replace: 'o' },
        { src: /u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, replace: 'u' },
        { src: /y|ỳ|ý|ỵ|ỷ|ỹ/g, replace: 'y' },
        { src: /d|đ/g, replace: 'd' }
    ];

    sets.forEach(set => {
        slug = slug.replace(set.src, set.replace);
    });

    slug = slug
        .replace(/[^a-z0-9 -]/g, '') // loại bỏ ký tự đặc biệt
        .replace(/\s+/g, '-')        // thay khoảng trắng bằng gạch ngang
        .replace(/-+/g, '-')         // thu gọn nhiều gạch ngang liền nhau
        .replace(/^-+|-+$/g, '');    // cắt bỏ gạch ngang ở đầu/cuối

    return slug;
}

/**
 * Mở modal Thêm mới danh mục
 */
async function openCreateModal() {
    // Reset form
    document.getElementById("create-category-form").reset();
    document.getElementById("create-desc-count").textContent = "0";
    
    // Nạp danh sách danh mục cha hợp lệ (chỉ lấy các root category)
    const parentSelect = document.getElementById("create-parent");
    let html = '<option value="">Không có - Danh mục gốc</option>';
    
    // Chỉ lấy danh mục gốc làm cha
    const rootCats = cachedAllCategories.filter(c => c.parent_id === null);
    rootCats.forEach(c => {
        html += `<option value="${c.id}">${c.name}</option>`;
    });
    parentSelect.innerHTML = html;

    // Refresh custom select
    if (typeof window.initAllCustomSelects === "function") {
        window.initAllCustomSelects();
    }

    openModal("create-category-modal");
}

/**
 * Submit Form tạo danh mục
 */
async function submitCreateForm() {
    const btn = document.getElementById("btn-submit-create");
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Đang xử lý...";

    // Thu thập dữ liệu
    const form = document.getElementById("create-category-form");
    const formData = new FormData(form);
    const payload = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        parent_id: formData.get("parent_id") || null,
        description: formData.get("description"),
        sort_order: formData.get("sort_order") || 0,
        status: formData.get("status")
    };

    try {
        const response = await categoriesApi.createCategory(payload);
        
        if (response.success) {
            showToast({ type: "success", title: "Thành công", message: "Đã tạo danh mục mới thành công." });
            closeModal("create-category-modal");
            fetchAndRender(); // Tải lại bảng & summary
        } else {
            // Hiển thị lỗi validation cụ thể từng field
            if (response.error_code === 422 || response.error_code === 409) {
                showFieldErrors("create-category-modal", response.errors || {});
                showToast({ type: "error", title: "Không thể lưu", message: response.message || "Vui lòng kiểm tra lại thông tin nhập." });
            } else {
                showToast({ type: "error", title: "Thất bại", message: response.message || "Đã xảy ra lỗi không xác định." });
            }
        }
    } catch (err) {
        console.error("Lỗi khi thêm mới danh mục:", err);
        showToast({ type: "error", title: "Lỗi kết nối", message: "Không thể kết nối đến máy chủ." });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Mở modal Chỉnh sửa danh mục
 */
async function openEditModal(id) {
    const modal = document.getElementById("edit-category-modal");
    const form = document.getElementById("edit-category-form");
    const loader = document.getElementById("edit-modal-loader");

    // Ẩn form, hiện loader
    form.classList.add("hidden");
    loader.classList.remove("hidden");
    
    openModal("edit-category-modal");

    try {
        const response = await categoriesApi.getCategory(id);
        
        if (!response || !response.success) {
            showToast({ type: "error", title: "Không tìm thấy", message: response ? response.message : "Không thể lấy thông tin danh mục." });
            closeModal("edit-category-modal");
            return;
        }

        const cat = response.data;
        activeCategory = cat;

        // Điền dữ liệu
        document.getElementById("edit-category-id").value = cat.id;
        document.getElementById("edit-name").value = cat.name;
        document.getElementById("edit-slug").value = cat.slug;
        document.getElementById("edit-description").value = cat.description || "";
        document.getElementById("edit-desc-count").textContent = (cat.description || "").length;
        document.getElementById("edit-sort-order").value = cat.sort_order;
        
        // Radio status
        if (cat.status === "active") {
            document.getElementById("edit-status-active").checked = true;
        } else {
            document.getElementById("edit-status-inactive").checked = true;
        }

        // Nạp dropdown danh mục cha (Loại bỏ chính nó và con cháu để chặn vòng lặp)
        const parentSelect = document.getElementById("edit-parent");
        let html = '<option value="">Không có - Danh mục gốc</option>';
        
        // Chỉ lấy danh mục gốc làm cha
        const rootCats = cachedAllCategories.filter(c => {
            // Chặn chính nó
            if (c.id === cat.id) return false;
            // Chặn con cháu trực thuộc
            if (isDescendant(cat.id, c.id, cachedAllCategories)) return false;
            // Chỉ lấy danh mục gốc
            return c.parent_id === null;
        });

        rootCats.forEach(c => {
            html += `<option value="${c.id}" ${cat.parent_id === c.id ? "selected" : ""}>${c.name}</option>`;
        });
        parentSelect.innerHTML = html;

        // Refresh custom select
        if (typeof window.initAllCustomSelects === "function") {
            window.initAllCustomSelects();
        }

        // Hiện form, ẩn loader
        loader.classList.add("hidden");
        form.classList.remove("hidden");

    } catch (err) {
        console.error("Lỗi nạp dữ liệu edit modal:", err);
        showToast({ type: "error", title: "Lỗi kết nối", message: "Đã xảy ra sự cố khi tải dữ liệu." });
        closeModal("edit-category-modal");
    }
}

/**
 * Kiểm tra xem targetParentId có phải là con cháu của catId hay không (Logic tương tự Backend)
 */
function isDescendant(catId, targetParentId, allCats) {
    const children = allCats.filter(c => c.parent_id === catId);
    if (children.some(child => child.id === targetParentId)) {
        return true;
    }
    return children.some(child => isDescendant(child.id, targetParentId, allCats));
}

/**
 * Submit form Chỉnh sửa danh mục
 */
async function submitEditForm() {
    const id = document.getElementById("edit-category-id").value;
    const btn = document.getElementById("btn-submit-edit");
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Đang xử lý...";

    const form = document.getElementById("edit-category-form");
    const formData = new FormData(form);
    
    // Gửi PATCH - Chỉ gửi các trường thay đổi hoặc đầy đủ payload
    const payload = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        parent_id: formData.get("parent_id") || null,
        description: formData.get("description"),
        sort_order: formData.get("sort_order") || 0,
        status: formData.get("status")
    };

    try {
        const response = await categoriesApi.updateCategory(id, payload);
        
        if (response.success) {
            showToast({ type: "success", title: "Cập nhật thành công", message: `Đã lưu thay đổi cho danh mục "${payload.name}".` });
            closeModal("edit-category-modal");
            fetchAndRender(); // Tải lại summary và bảng
        } else {
            if (response.error_code === 422 || response.error_code === 409) {
                showFieldErrors("edit-category-modal", response.errors || {});
                showToast({ type: "error", title: "Không thể lưu", message: response.message || "Thông tin nhập không hợp lệ." });
            } else {
                showToast({ type: "error", title: "Thất bại", message: response.message || "Lỗi hệ thống không xác định." });
            }
        }
    } catch (err) {
        console.error("Lỗi khi update danh mục:", err);
        showToast({ type: "error", title: "Lỗi kết nối", message: "Đã xảy ra sự cố kết nối." });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Mở Drawer xem chi tiết danh mục
 */
async function openDetailDrawer(id) {
    try {
        const response = await categoriesApi.getCategory(id);
        
        if (!response || !response.success) {
            showToast({ type: "error", title: "Không tìm thấy", message: response ? response.message : "Không thể lấy thông tin chi tiết danh mục." });
            return;
        }

        const cat = response.data;

        // Điền dữ liệu
        document.getElementById("detail-id").textContent = cat.id;
        document.getElementById("detail-name").textContent = cat.name;
        document.getElementById("detail-slug").textContent = cat.slug;
        document.getElementById("detail-description").textContent = cat.description || "Chưa có mô tả.";
        
        // Thứ tự & Số khóa học
        document.getElementById("detail-sort-order").textContent = cat.sort_order;
        document.getElementById("detail-course-count").innerHTML = cat.course_count > 0
            ? `<a href="courses.html?category_id=${cat.id}" class="underline text-success hover:font-bold font-semibold transition-all font-sans">${cat.course_count} khóa học</a>`
            : "Chưa có khóa học";

        // Parent
        const parentSpan = document.getElementById("detail-parent");
        if (cat.parent) {
            parentSpan.innerHTML = `<span class="font-semibold text-ink">${escapeHTML(cat.parent.name)}</span>`;
        } else {
            parentSpan.innerHTML = `<span class="px-2 py-0.5 rounded-[6px] bg-canvas text-mid-gray border border-hairline text-[10px] font-sans font-semibold">Danh mục gốc</span>`;
        }

        // Status
        const statusSpan = document.getElementById("detail-status");
        statusSpan.innerHTML = cat.status === "active"
            ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft text-success border border-success/10">Đang hoạt động</span>`
            : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-canvas text-mid-gray border border-hairline">Ngừng hoạt động</span>`;

        // Dates
        document.getElementById("detail-created-at").textContent = formatDateTime(cat.created_at);
        document.getElementById("detail-updated-at").textContent = formatDateTime(cat.updated_at || cat.created_at);

        // Danh sách danh mục con
        const childrenContainer = document.getElementById("detail-children-container");
        if (cat.children && cat.children.length > 0) {
            let html = "";
            cat.children.forEach(ch => {
                const statusBadge = ch.status === "active"
                    ? `<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-success-soft text-success font-semibold border border-success/10">Active</span>`
                    : `<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-canvas text-mid-gray border border-hairline">Inactive</span>`;
                
                html += `
                <div class="flex items-center justify-between p-2 rounded bg-canvas/60 border border-hairline">
                    <div class="truncate mr-2">
                        <span class="font-semibold text-xs text-ink">${escapeHTML(ch.name)}</span>
                        <p class="text-[9px] text-mid-gray font-mono">${escapeHTML(ch.slug)}</p>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <span class="text-[9px] text-mid-gray font-medium">Sắp xếp: ${ch.sort_order}</span>
                        ${statusBadge}
                    </div>
                </div>`;
            });
            childrenContainer.innerHTML = html;
        } else {
            childrenContainer.innerHTML = `<p class="text-xs text-mid-gray italic pl-1">Không có danh mục con trực thuộc.</p>`;
        }

        openModal("detail-category-drawer");

    } catch (err) {
        console.error("Lỗi khi tải chi tiết danh mục:", err);
        showToast({ type: "error", title: "Lỗi kết nối", message: "Đã xảy ra sự cố khi tải chi tiết." });
    }
}

/**
 * Mở modal xác nhận đổi trạng thái
 */
function openConfirmStatusModal(id, newStatus) {
    const cat = cachedAllCategories.find(c => c.id === Number(id));
    if (!cat) return;

    activeCategory = cat;
    activeCategory.target_status = newStatus;

    const messageEl = document.getElementById("confirm-status-message");
    const catNameSpan = document.getElementById("confirm-status-cat-name");
    
    catNameSpan.textContent = cat.name;

    if (newStatus === "inactive") {
        messageEl.innerHTML = `Bạn có chắc muốn **ngừng hoạt động** danh mục “<span id="confirm-status-cat-name" class="font-semibold text-ink">${escapeHTML(cat.name)}</span>” không?<br><br><span class="text-[10px] text-mid-gray mt-2 block leading-relaxed bg-surface-alt p-2 rounded border border-hairline">Các khóa học hiện có vẫn được giữ nguyên, nhưng danh mục sẽ không còn được ưu tiên hiển thị cho người dùng.</span>`;
    } else {
        messageEl.innerHTML = `Bạn có chắc muốn **kích hoạt** hoạt động lại cho danh mục “<span id="confirm-status-cat-name" class="font-semibold text-ink">${escapeHTML(cat.name)}</span>” không?<br><br><span class="text-[10px] text-mid-gray mt-2 block leading-relaxed bg-surface-alt p-2 rounded border border-hairline">Danh mục sẽ được hiển thị công khai trên trang chủ và bộ lọc của người dùng.</span>`;
    }

    openModal("confirm-status-modal");
}

/**
 * Submit đổi trạng thái danh mục
 */
async function submitStatusChange() {
    if (!activeCategory) return;
    
    const id = activeCategory.id;
    const targetStatus = activeCategory.target_status;

    const btn = document.getElementById("btn-submit-status");
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Đang xử lý...";

    try {
        const response = await categoriesApi.updateCategory(id, { status: targetStatus });
        
        if (response && response.success) {
            const statusLabel = targetStatus === "active" ? "Kích hoạt" : "Vô hiệu hóa";
            showToast({ type: "success", title: "Thao tác thành công", message: `Đã ${statusLabel.toLowerCase()} danh mục "${activeCategory.name}" thành công.` });
            closeModal("confirm-status-modal");
            fetchAndRender(); // Tải lại summary và bảng
        } else {
            showToast({ type: "error", title: "Lỗi thực hiện", message: response.message || "Không thể thay đổi trạng thái danh mục." });
        }
    } catch (err) {
        console.error("Lỗi khi thay đổi trạng thái:", err);
        showToast({ type: "error", title: "Lỗi kết nối", message: "Đã xảy ra sự cố kết nối máy chủ." });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Mở modal xác nhận xóa mềm danh mục
 */
function openConfirmDeleteModal(id) {
    const cat = cachedAllCategories.find(c => c.id === Number(id));
    if (!cat) return;

    activeCategory = cat;

    const nameSpan = document.getElementById("confirm-delete-name");
    nameSpan.textContent = cat.name;

    openModal("confirm-delete-modal");
}

/**
 * Submit xóa mềm danh mục
 */
async function submitDeleteCategory() {
    if (!activeCategory) return;

    const id = activeCategory.id;
    const btn = document.getElementById("btn-submit-delete");
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = "Đang xóa...";

    try {
        const response = await categoriesApi.deleteCategory(id);
        
        if (response && response.success) {
            showToast({ type: "success", title: "Xóa thành công", message: `Đã xóa mềm danh mục "${activeCategory.name}" khỏi hệ thống.` });
            closeModal("confirm-delete-modal");
            fetchAndRender();
        } else {
            showToast({ type: "error", title: "Xóa thất bại", message: response.message || "Không thể thực hiện xóa danh mục." });
        }
    } catch (err) {
        console.error("Lỗi khi xóa danh mục:", err);
        showToast({ type: "error", title: "Lỗi kết nối", message: "Đã xảy ra sự cố kết nối." });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Kết xuất validation errors chi tiết cho form
 */
function showFieldErrors(modalId, errors) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Ẩn tất cả các lỗi cũ
    modal.querySelectorAll("[data-error]").forEach(p => {
        p.classList.add("hidden");
        p.textContent = "";
    });

    // Điền lỗi mới
    Object.keys(errors).forEach(field => {
        const p = modal.querySelector(`[data-error="${field}"]`);
        if (p) {
            p.textContent = errors[field][0] || "Thông tin không hợp lệ.";
            p.classList.remove("hidden");
        }
    });
}

/**
 * Định dạng ngày giờ dạng DD/MM/YYYY HH:MM
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
 * Chống XSS độc hại
 */
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
