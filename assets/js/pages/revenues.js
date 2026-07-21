import { getRevenues, getRevenueReport, getRevenueById } from "../api/revenues-api.js";
import { USE_MOCK_DATA } from "../core/config.js";

/**========================================================================
 * STATE & UTILS
 *========================================================================**/
const state = {
  page: 1,
  per_page: 20,
  filters: {
    date_preset: "last_30_days",
    date_from: "",
    date_to: "",
    status: "all",
    course_id: "all",
    instructor_id: "all",
    order_id: "",
  },
  search_course_text: "",
  search_instructor_text: "",
  isDrawerOpen: false,
};

let debounceTimer = null;
let revenueChartInstance = null;

function formatMoney(value) {
  const number = Number(value);
  if (isNaN(number)) return "0 đ";
  return new Intl.NumberFormat('vi-VN').format(number) + " đ";
}

function formatDate(isoString) {
  if (!isoString) return "---";
  const d = new Date(isoString);
  return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
}

const statusMap = {
  available: { label: "Khả dụng", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Đang chờ", class: "bg-amber-100 text-amber-700 border-amber-200" },
  withdrawn: { label: "Đã rút", class: "bg-blue-100 text-blue-700 border-blue-200" },
  cancelled: { label: "Đã hủy", class: "bg-rose-100 text-rose-700 border-rose-200" }
};
const orderStatusMap = {
  paid: { label: "Đã thanh toán", class: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Chờ thanh toán", class: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Đã hủy", class: "bg-rose-100 text-rose-700" }
};
const orderPaymentMap = {
  paid: { label: "Thành công", class: "text-emerald-600" },
  processing: { label: "Đang xử lý", class: "text-amber-600" },
  failed: { label: "Thất bại", class: "text-rose-600" }
};

/**========================================================================
 * INITIALIZATION
 *========================================================================**/
document.addEventListener("DOMContentLoaded", () => {
  initURLParams();
  setupEventListeners();
  loadData();
  
  if (USE_MOCK_DATA) {
    document.title = "[MOCK] " + document.title;
  }
});

function initURLParams() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has("page")) state.page = Number(params.get("page")) || 1;
  if (params.has("status")) state.filters.status = params.get("status");
  if (params.has("order_id")) state.filters.order_id = params.get("order_id");
  if (params.has("course_id")) state.filters.course_id = params.get("course_id");
  if (params.has("instructor_id")) state.filters.instructor_id = params.get("instructor_id");
  
  if (params.has("date_from") || params.has("date_to")) {
    state.filters.date_preset = "custom";
    state.filters.date_from = params.get("date_from") || "";
    state.filters.date_to = params.get("date_to") || "";
    document.getElementById("filter-date-preset").value = "custom";
    document.getElementById("custom-date-group").classList.remove("hidden");
    document.getElementById("custom-date-group").classList.add("flex");
  } else if (params.has("date_preset")) {
    state.filters.date_preset = params.get("date_preset");
  }

  // Update DOM inputs
  document.getElementById("filter-date-preset").value = state.filters.date_preset;
  document.getElementById("filter-date-from").value = state.filters.date_from;
  document.getElementById("filter-date-to").value = state.filters.date_to;
  document.getElementById("filter-status").value = state.filters.status;
  document.getElementById("search-order").value = state.filters.order_id;
  
  if (state.filters.course_id !== "all") {
    document.getElementById("search-course").value = `Khóa học ID: ${state.filters.course_id}`;
    state.search_course_text = `Khóa học ID: ${state.filters.course_id}`;
  }
  if (state.filters.instructor_id !== "all") {
    document.getElementById("search-instructor").value = `Giảng viên ID: ${state.filters.instructor_id}`;
    state.search_instructor_text = `Giảng viên ID: ${state.filters.instructor_id}`;
  }
  
  applyPresetDates();
  
  // Check if we need to open drawer automatically
  if (params.has("open_revenue_id")) {
    openDrawer(params.get("open_revenue_id"));
  }
}

function updateURL() {
  const params = new URLSearchParams();
  params.set("page", state.page);
  
  if (state.filters.status !== "all") params.set("status", state.filters.status);
  if (state.filters.order_id) params.set("order_id", state.filters.order_id);
  if (state.filters.course_id !== "all") params.set("course_id", state.filters.course_id);
  if (state.filters.instructor_id !== "all") params.set("instructor_id", state.filters.instructor_id);
  
  if (state.filters.date_preset === "custom") {
    if (state.filters.date_from) params.set("date_from", state.filters.date_from);
    if (state.filters.date_to) params.set("date_to", state.filters.date_to);
  } else {
    params.set("date_preset", state.filters.date_preset);
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

/**========================================================================
 * DATA LOADING
 *========================================================================**/
async function loadData() {
  showLoading();
  updateURL();
  renderFilterChips();

  const apiParams = {
    page: state.page,
    per_page: state.per_page,
    status: state.filters.status,
    order_id: state.filters.order_id,
    course_id: state.filters.course_id,
    instructor_id: state.filters.instructor_id,
    date_from: state.filters.date_from,
    date_to: state.filters.date_to
  };

  try {
    const [revenueRes, reportRes] = await Promise.all([
      getRevenues(apiParams),
      getRevenueReport(apiParams) // Fetch chart data with same filters
    ]);
    
    if (revenueRes.success) {
      renderSummary(revenueRes.data.summary);
      renderTable(revenueRes.data.items);
      renderPagination(revenueRes.meta);
      
      const isEmpty = revenueRes.data.items.length === 0;
      const isFiltered = hasActiveFilters();
      
      document.getElementById("revenues-tbody").classList.toggle("hidden", isEmpty);
      document.getElementById("revenues-empty-state").classList.toggle("hidden", !isEmpty || isFiltered);
      document.getElementById("revenues-filter-empty-state").classList.toggle("hidden", !isEmpty || !isFiltered);
      document.getElementById("revenues-error-state").classList.add("hidden");
    }

    if (reportRes.success) {
      renderChart(reportRes.data);
    }
    
    document.getElementById("last-update-time").textContent = new Date().toLocaleTimeString("vi-VN");
  } catch (error) {
    console.error("Error loading revenues:", error);
    document.getElementById("revenues-tbody").classList.add("hidden");
    document.getElementById("revenues-error-state").classList.remove("hidden");
  } finally {
    hideLoading();
  }
}

async function loadTableOnly() {
  showTableLoading();
  updateURL();

  const apiParams = {
    page: state.page,
    per_page: state.per_page,
    status: state.filters.status,
    order_id: state.filters.order_id,
    course_id: state.filters.course_id,
    instructor_id: state.filters.instructor_id,
    date_from: state.filters.date_from,
    date_to: state.filters.date_to
  };

  try {
    const res = await getRevenues(apiParams);
    if (res.success) {
      renderTable(res.data.items);
      renderPagination(res.meta);
      
      const isEmpty = res.data.items.length === 0;
      const isFiltered = hasActiveFilters();
      
      document.getElementById("revenues-tbody").classList.toggle("hidden", isEmpty);
      document.getElementById("revenues-empty-state").classList.toggle("hidden", !isEmpty || isFiltered);
      document.getElementById("revenues-filter-empty-state").classList.toggle("hidden", !isEmpty || !isFiltered);
      document.getElementById("revenues-error-state").classList.add("hidden");
    }
  } catch (error) {
    console.error("Error loading table:", error);
  } finally {
    hideTableLoading();
  }
}

/**========================================================================
 * RENDERING
 *========================================================================**/
function showLoading() {
  document.getElementById("refresh-icon").classList.add("animate-spin");
  showTableLoading();
}
function hideLoading() {
  document.getElementById("refresh-icon").classList.remove("animate-spin");
  hideTableLoading();
}
function showTableLoading() {
  document.getElementById("revenues-tbody").classList.add("hidden");
  document.getElementById("revenues-tbody-skeleton").classList.remove("hidden");
}
function hideTableLoading() {
  document.getElementById("revenues-tbody-skeleton").classList.add("hidden");
}

function renderSummary(summary) {
  document.getElementById("kpi-total-gross").textContent = formatMoney(summary.total_gross_amount);
  document.getElementById("kpi-total-instructor").textContent = formatMoney(summary.total_instructor_amount);
  document.getElementById("kpi-total-platform").textContent = formatMoney(summary.total_platform_fee_amount);
  document.getElementById("kpi-available").textContent = formatMoney(summary.available_amount);
  
  document.getElementById("kpi-withdrawn").textContent = formatMoney(summary.withdrawn_amount);
  document.getElementById("kpi-cancelled").textContent = formatMoney(summary.cancelled_amount);
  
  const incEl = document.getElementById("kpi-inconsistent");
  incEl.textContent = summary.inconsistent_count;
  if (summary.inconsistent_count > 0) {
    incEl.classList.remove("text-ink");
    incEl.classList.add("text-rose-600");
  } else {
    incEl.classList.remove("text-rose-600");
    incEl.classList.add("text-ink");
  }
}

function renderTable(items) {
  const tbody = document.getElementById("revenues-tbody");
  tbody.innerHTML = "";

  items.forEach(item => {
    const sMap = statusMap[item.status] || { label: item.status, class: "bg-canvas text-mid-gray" };
    
    // Warn if amount inconsistent
    const rowClass = item.amount_consistent === false ? "bg-rose-50/50 hover:bg-rose-50" : "hover:bg-canvas/50";
    const consistentBadge = item.amount_consistent === false ? 
      `<span class="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] rounded border border-rose-200 ml-2" title="Sai lệch tiền">!</span>` : "";

    const tr = document.createElement("tr");
    tr.className = `transition-colors cursor-pointer ${rowClass}`;
    tr.onclick = () => openDrawer(item.id);

    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-medium text-ink">#REV-${item.id}</td>
      <td class="py-3 px-4 font-mono text-mid-gray">${item.order?.order_code || "---"}</td>
      <td class="py-3 px-4">
         <div class="truncate max-w-[200px]" title="${item.course?.title}">${item.course?.title || "---"}</div>
      </td>
      <td class="py-3 px-4">
         <div class="truncate max-w-[150px]" title="${item.instructor?.full_name}">${item.instructor?.full_name || "---"}</div>
      </td>
      <td class="py-3 px-4 text-right font-medium text-ink">
         ${formatMoney(item.gross_amount)}
         ${consistentBadge}
      </td>
      <td class="py-3 px-4 text-right font-medium text-emerald-600">${formatMoney(item.instructor_amount)}</td>
      <td class="py-3 px-4 text-right font-medium text-blue-600">${formatMoney(item.platform_fee_amount)}</td>
      <td class="py-3 px-4">
         <div class="text-[10px] font-medium text-mid-gray whitespace-nowrap">
            GV: <span class="text-ink">${item.instructor_rate}%</span> / NT: <span class="text-ink">${item.platform_rate}%</span>
         </div>
      </td>
      <td class="py-3 px-4">
         <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${sMap.class}">${sMap.label}</span>
      </td>
      <td class="py-3 px-4 text-[11px] text-mid-gray whitespace-nowrap">${formatDate(item.earned_at)}</td>
      <td class="py-3 px-4">
         <div class="flex items-center justify-center">
            ${item.amount_consistent === false ? 
              `<svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
              : `<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`
            }
         </div>
      </td>
      <td class="py-3 px-4 text-center">
         <button type="button" class="text-blue-600 hover:text-blue-800 text-[11px] font-medium p-1" onclick="event.stopPropagation(); openDrawer('${item.id}')">Chi tiết</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPagination(meta) {
  document.getElementById("pagination-total-count").textContent = meta.total;
  const start = (meta.current_page - 1) * meta.per_page + 1;
  const end = Math.min(meta.current_page * meta.per_page, meta.total);
  document.getElementById("pagination-showing-range").textContent = meta.total > 0 ? `${start}-${end}` : "0";

  const container = document.getElementById("pagination-buttons");
  container.innerHTML = "";

  if (meta.last_page <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className = `px-2 py-1.5 text-xs font-medium rounded border ${meta.current_page === 1 ? 'border-hairline text-mid-gray/50 cursor-not-allowed bg-canvas' : 'border-hairline bg-paper text-ink hover:bg-canvas'}`;
  prevBtn.textContent = "Trước";
  prevBtn.disabled = meta.current_page === 1;
  prevBtn.onclick = () => { state.page--; loadTableOnly(); };
  container.appendChild(prevBtn);

  // Simple page numbers
  for (let i = 1; i <= meta.last_page; i++) {
    if (i === 1 || i === meta.last_page || (i >= meta.current_page - 1 && i <= meta.current_page + 1)) {
      const btn = document.createElement("button");
      btn.className = `w-8 py-1.5 text-xs font-medium rounded border ${i === meta.current_page ? 'border-ink bg-ink text-white' : 'border-hairline bg-paper text-ink hover:bg-canvas'}`;
      btn.textContent = i;
      btn.onclick = () => { state.page = i; loadTableOnly(); };
      container.appendChild(btn);
    } else if (i === meta.current_page - 2 || i === meta.current_page + 2) {
      const span = document.createElement("span");
      span.className = "text-xs text-mid-gray px-1";
      span.textContent = "...";
      container.appendChild(span);
    }
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = `px-2 py-1.5 text-xs font-medium rounded border ${meta.current_page === meta.last_page ? 'border-hairline text-mid-gray/50 cursor-not-allowed bg-canvas' : 'border-hairline bg-paper text-ink hover:bg-canvas'}`;
  nextBtn.textContent = "Sau";
  nextBtn.disabled = meta.current_page === meta.last_page;
  nextBtn.onclick = () => { state.page++; loadTableOnly(); };
  container.appendChild(nextBtn);
}

function renderChart(reportData) {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  const labels = reportData.map(d => d.period);
  const grossData = reportData.map(d => Number(d.gross_amount));
  const instrData = reportData.map(d => Number(d.instructor_amount));
  const platData = reportData.map(d => Number(d.platform_fee_amount));

  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Tổng doanh thu',
          data: grossData,
          borderColor: '#10B981', // emerald-500
          backgroundColor: '#10B98120',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3,
          hidden: true
        },
        {
          label: 'Thu nhập GV',
          data: instrData,
          borderColor: '#3B82F6', // blue-500
          backgroundColor: '#3B82F620',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Phí nền tảng',
          data: platData,
          borderColor: '#F59E0B', // amber-500
          backgroundColor: '#F59E0B20',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 12, usePointStyle: true, font: { size: 11, family: 'Inter, sans-serif' } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' đ';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#e5e7eb' },
          border: { display: false },
          ticks: {
            font: { size: 10 },
            callback: function(value) {
               if(value >= 1000000) return (value / 1000000) + 'M';
               if(value >= 1000) return (value / 1000) + 'k';
               return value;
            }
          }
        }
      }
    }
  });
}

/**========================================================================
 * FILTERS
 *========================================================================**/
function setupEventListeners() {
  document.getElementById("btn-refresh-data").addEventListener("click", () => {
    state.page = 1;
    loadData();
  });

  document.getElementById("filter-date-preset").addEventListener("change", (e) => {
    const val = e.target.value;
    state.filters.date_preset = val;
    if (val === "custom") {
      document.getElementById("custom-date-group").classList.remove("hidden");
      document.getElementById("custom-date-group").classList.add("flex");
    } else {
      document.getElementById("custom-date-group").classList.add("hidden");
      document.getElementById("custom-date-group").classList.remove("flex");
      applyPresetDates();
      triggerFilterUpdate();
    }
  });

  const dateFromEl = document.getElementById("filter-date-from");
  const dateToEl = document.getElementById("filter-date-to");
  
  [dateFromEl, dateToEl].forEach(el => {
    el.addEventListener("change", () => {
      if (state.filters.date_preset === "custom") {
        state.filters.date_from = dateFromEl.value;
        state.filters.date_to = dateToEl.value;
        if (dateFromEl.value && dateToEl.value && new Date(dateFromEl.value) > new Date(dateToEl.value)) {
          document.getElementById("date-validation-error").textContent = "Ngày bắt đầu không được lớn hơn ngày kết thúc.";
          document.getElementById("date-validation-error").classList.remove("hidden");
          return;
        }
        document.getElementById("date-validation-error").classList.add("hidden");
        triggerFilterUpdate();
      }
    });
  });

  document.getElementById("filter-status").addEventListener("change", (e) => {
    state.filters.status = e.target.value;
    triggerFilterUpdate();
  });

  document.getElementById("search-order").addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.filters.order_id = e.target.value.trim();
      triggerFilterUpdate();
    }, 500);
  });

  // Mock search suggestions
  const courseInput = document.getElementById("search-course");
  courseInput.addEventListener("input", (e) => {
    state.search_course_text = e.target.value;
    if (!state.search_course_text) {
      state.filters.course_id = "all";
      triggerFilterUpdate();
    } else {
      // In a real app, show suggestions here. For mock, just use ID if it's a number
      if (!isNaN(state.search_course_text)) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
           state.filters.course_id = state.search_course_text;
           triggerFilterUpdate();
        }, 500);
      }
    }
  });
  
  const instInput = document.getElementById("search-instructor");
  instInput.addEventListener("input", (e) => {
    state.search_instructor_text = e.target.value;
    if (!state.search_instructor_text) {
      state.filters.instructor_id = "all";
      triggerFilterUpdate();
    } else {
      if (!isNaN(state.search_instructor_text)) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
           state.filters.instructor_id = state.search_instructor_text;
           triggerFilterUpdate();
        }, 500);
      }
    }
  });

  document.getElementById("btn-reset-filters").addEventListener("click", resetFilters);
  document.getElementById("btn-clear-empty-filter").addEventListener("click", resetFilters);
  
  // Drawer events
  document.getElementById("btn-close-drawer").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.isDrawerOpen) closeDrawer();
  });
}

function triggerFilterUpdate() {
  state.page = 1;
  loadData(); // Need to reload chart as well because it's a full data reload
}

function applyPresetDates() {
  const preset = state.filters.date_preset;
  if (preset === "custom") return;

  const to = new Date();
  const from = new Date();
  
  if (preset === "last_7_days") {
    from.setDate(to.getDate() - 7);
  } else if (preset === "last_30_days") {
    from.setDate(to.getDate() - 30);
  } else if (preset === "last_3_months") {
    from.setMonth(to.getMonth() - 3);
  }
  
  state.filters.date_from = from.toISOString().split('T')[0];
  state.filters.date_to = to.toISOString().split('T')[0];
}

function resetFilters() {
  state.filters = {
    date_preset: "last_30_days",
    date_from: "",
    date_to: "",
    status: "all",
    course_id: "all",
    instructor_id: "all",
    order_id: "",
  };
  state.search_course_text = "";
  state.search_instructor_text = "";
  
  document.getElementById("filter-date-preset").value = "last_30_days";
  document.getElementById("custom-date-group").classList.add("hidden");
  document.getElementById("custom-date-group").classList.remove("flex");
  document.getElementById("filter-date-from").value = "";
  document.getElementById("filter-date-to").value = "";
  document.getElementById("filter-status").value = "all";
  document.getElementById("search-order").value = "";
  document.getElementById("search-course").value = "";
  document.getElementById("search-instructor").value = "";
  document.getElementById("date-validation-error").classList.add("hidden");
  
  applyPresetDates();
  triggerFilterUpdate();
}

function hasActiveFilters() {
  return state.filters.status !== "all" || 
         state.filters.order_id !== "" || 
         state.filters.course_id !== "all" || 
         state.filters.instructor_id !== "all";
}

function renderFilterChips() {
  const container = document.getElementById("filter-chips-container");
  container.innerHTML = "";
  
  const addChip = (label, value, onRemove) => {
    const chip = document.createElement("div");
    chip.className = "flex items-center gap-1.5 px-2 py-1 bg-surface-alt rounded border border-hairline text-mid-gray";
    chip.innerHTML = `<span class="font-medium text-ink">${label}:</span> <span>${value}</span>
      <button type="button" class="hover:text-ink hover:bg-canvas rounded-full p-0.5 transition-colors"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
    chip.querySelector("button").onclick = onRemove;
    container.appendChild(chip);
  };

  if (state.filters.status !== "all") {
    const l = document.querySelector(`#filter-status option[value="${state.filters.status}"]`)?.textContent || state.filters.status;
    addChip("Trạng thái", l, () => {
      state.filters.status = "all";
      document.getElementById("filter-status").value = "all";
      triggerFilterUpdate();
    });
  }
  if (state.filters.order_id) {
    addChip("Mã đơn", state.filters.order_id, () => {
      state.filters.order_id = "";
      document.getElementById("search-order").value = "";
      triggerFilterUpdate();
    });
  }
  if (state.filters.course_id !== "all") {
    addChip("Khóa học ID", state.filters.course_id, () => {
      state.filters.course_id = "all";
      state.search_course_text = "";
      document.getElementById("search-course").value = "";
      triggerFilterUpdate();
    });
  }
  if (state.filters.instructor_id !== "all") {
    addChip("GV ID", state.filters.instructor_id, () => {
      state.filters.instructor_id = "all";
      state.search_instructor_text = "";
      document.getElementById("search-instructor").value = "";
      triggerFilterUpdate();
    });
  }
}

/**========================================================================
 * DRAWER LOGIC
 *========================================================================**/
async function openDrawer(id) {
  state.isDrawerOpen = true;
  document.getElementById("drawer-overlay").classList.remove("hidden");
  // trigger reflow
  void document.getElementById("drawer-overlay").offsetWidth;
  document.getElementById("drawer-overlay").classList.remove("opacity-0");
  document.getElementById("revenue-drawer").classList.remove("translate-x-full");
  document.body.classList.add("overflow-hidden");
  
  // Set URL parameter without reloading
  const url = new URL(window.location);
  url.searchParams.set("open_revenue_id", id);
  window.history.pushState({}, "", url);

  document.getElementById("drawer-header-id").textContent = `#REV-${id}`;
  document.getElementById("drawer-content").classList.add("hidden");
  document.getElementById("drawer-loading").classList.remove("hidden");
  document.getElementById("drawer-loading").classList.add("flex");

  try {
    const res = await getRevenueById(id);
    if (res.success) {
      populateDrawer(res.data);
    }
  } catch (error) {
    console.error("Failed to load revenue details", error);
    alert("Không thể tải chi tiết doanh thu.");
    closeDrawer();
  }
}

function closeDrawer() {
  state.isDrawerOpen = false;
  document.getElementById("drawer-overlay").classList.add("opacity-0");
  document.getElementById("revenue-drawer").classList.add("translate-x-full");
  document.body.classList.remove("overflow-hidden");
  
  setTimeout(() => {
    document.getElementById("drawer-overlay").classList.add("hidden");
  }, 300);

  // Remove URL parameter
  const url = new URL(window.location);
  url.searchParams.delete("open_revenue_id");
  window.history.pushState({}, "", url);
}

function populateDrawer(data) {
  document.getElementById("drawer-loading").classList.add("hidden");
  document.getElementById("drawer-loading").classList.remove("flex");
  document.getElementById("drawer-content").classList.remove("hidden");

  // General
  const sMap = statusMap[data.status] || { label: data.status, class: "" };
  document.getElementById("drawer-status").innerHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${sMap.class}">${sMap.label}</span>`;
  document.getElementById("drawer-earned-at").textContent = formatDate(data.earned_at);

  // Financial
  document.getElementById("drawer-gross-amount").textContent = formatMoney(data.gross_amount);
  document.getElementById("drawer-instructor-amount").textContent = formatMoney(data.instructor_amount);
  document.getElementById("drawer-platform-amount").textContent = formatMoney(data.platform_fee_amount);
  document.getElementById("drawer-instructor-rate").textContent = data.instructor_rate;
  document.getElementById("drawer-platform-rate").textContent = data.platform_rate;

  if (data.amount_consistent === false) {
    document.getElementById("drawer-consistency-warning").classList.remove("hidden");
  } else {
    document.getElementById("drawer-consistency-warning").classList.add("hidden");
  }

  // Order
  if (data.order) {
    document.getElementById("drawer-order-code").textContent = data.order.order_code;
    document.getElementById("drawer-order-amount").textContent = formatMoney(data.order.amount);
    
    const osMap = orderStatusMap[data.order.status] || { label: data.order.status, class: "text-mid-gray bg-canvas" };
    document.getElementById("drawer-order-status").innerHTML = `<span class="px-1.5 py-0.5 rounded text-[10px] font-medium ${osMap.class}">${osMap.label}</span>`;
    
    const psMap = orderPaymentMap[data.order.payment_status] || { label: data.order.payment_status, class: "text-mid-gray" };
    document.getElementById("drawer-payment-status").innerHTML = `<span class="text-[10px] font-medium ${psMap.class}">TT: ${psMap.label}</span>`;
    
    document.getElementById("drawer-order-link").href = `orders.html?open_order_id=${data.order.id}`;
  } else {
    document.getElementById("drawer-order-code").textContent = "---";
  }

  // Course
  if (data.course) {
    document.getElementById("drawer-course-title").textContent = data.course.title;
    document.getElementById("drawer-course-link").href = `courses.html?open_course_id=${data.course.id}`;
  } else {
    document.getElementById("drawer-course-title").textContent = "---";
  }

  // Instructor
  if (data.instructor) {
    document.getElementById("drawer-instructor-name").textContent = data.instructor.full_name;
    document.getElementById("drawer-instructor-email").textContent = data.instructor.email;
    document.getElementById("drawer-instructor-link").href = `users.html?open_user_id=${data.instructor.id}`;
  } else {
    document.getElementById("drawer-instructor-name").textContent = "---";
    document.getElementById("drawer-instructor-email").textContent = "---";
  }
}
