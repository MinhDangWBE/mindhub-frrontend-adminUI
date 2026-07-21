import { getRevenues, getRevenueReport, getRevenueById } from "../api/revenues-api.js";
import { USE_MOCK_DATA } from "../core/config.js";

/**========================================================================
 * STATE & UTILS
 *========================================================================**/
const state = {
  page: 1,
  per_page: 20,
  filters: {
    search: "",
    date_preset: "last_30_days",
    date_from: "",
    date_to: "",
    status: "all"
  },
  isDrawerOpen: false
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

function applyPresetDates() {
  const preset = state.filters.date_preset;
  if (preset === "custom") return;

  const now = new Date("2026-07-21T23:59:59Z");
  const from = new Date(now.getTime());

  if (preset === "last_7_days") {
    from.setDate(now.getDate() - 6);
  } else if (preset === "last_30_days") {
    from.setDate(now.getDate() - 29);
  } else if (preset === "last_3_months") {
    from.setDate(now.getDate() - 89);
  }

  state.filters.date_from = from.toISOString().split('T')[0];
  state.filters.date_to = now.toISOString().split('T')[0];

  const presetLabels = {
    last_7_days: "7 ngày qua",
    last_30_days: "1 tháng qua",
    last_3_months: "3 tháng qua"
  };
  const labelEl = document.getElementById("chart-preset-label");
  if (labelEl) labelEl.textContent = presetLabels[preset] || "";
}

function initURLParams() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("page")) state.page = Number(params.get("page")) || 1;
  if (params.has("search")) state.filters.search = params.get("search");
  if (params.has("status")) state.filters.status = params.get("status");

  if (params.has("date_from") || params.has("date_to")) {
    state.filters.date_preset = "custom";
    state.filters.date_from = params.get("date_from") || "";
    state.filters.date_to = params.get("date_to") || "";
    document.getElementById("filter-date-preset").value = "custom";
    document.getElementById("custom-date-group").classList.remove("hidden");
    document.getElementById("custom-date-group").classList.add("flex");
    const labelEl = document.getElementById("chart-preset-label");
    if (labelEl) labelEl.textContent = "Tùy chọn ngày";
  } else if (params.has("date_preset")) {
    state.filters.date_preset = params.get("date_preset");
    document.getElementById("filter-date-preset").value = state.filters.date_preset;
    applyPresetDates();
  } else {
    applyPresetDates();
  }

  // Bind values to UI elements
  const searchInput = document.getElementById("filter-search");
  searchInput.value = state.filters.search;
  toggleClearSearchButton(state.filters.search);

  document.getElementById("filter-status").value = state.filters.status;
  document.getElementById("filter-date-from").value = state.filters.date_from;
  document.getElementById("filter-date-to").value = state.filters.date_to;

  if (params.has("open_revenue_id")) {
    openDrawer(params.get("open_revenue_id"));
  }
}

function updateURL() {
  const params = new URLSearchParams();
  params.set("page", state.page);

  if (state.filters.search) params.set("search", state.filters.search);
  if (state.filters.status !== "all") params.set("status", state.filters.status);

  if (state.filters.date_preset === "custom") {
    if (state.filters.date_from) params.set("date_from", state.filters.date_from);
    if (state.filters.date_to) params.set("date_to", state.filters.date_to);
  } else {
    params.set("date_preset", state.filters.date_preset);
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

function toggleClearSearchButton(val) {
  const btn = document.getElementById("btn-clear-search");
  if (btn) {
    btn.classList.toggle("hidden", !val);
  }
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
    search: state.filters.search,
    status: state.filters.status,
    date_from: state.filters.date_from,
    date_to: state.filters.date_to
  };

  try {
    const [revenueRes, reportRes] = await Promise.all([
      getRevenues(apiParams),
      getRevenueReport(apiParams)
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
    const errText = document.getElementById("error-message-text");
    if (errText) errText.textContent = error.message || "Đã xảy ra sự cố kết nối.";
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
    search: state.filters.search,
    status: state.filters.status,
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
  const icon = document.getElementById("refresh-icon");
  if (icon) icon.classList.add("animate-spin");
  showTableLoading();
}
function hideLoading() {
  const icon = document.getElementById("refresh-icon");
  if (icon) icon.classList.remove("animate-spin");
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
    const rowClass = item.amount_consistent === false ? "bg-rose-50/60 hover:bg-rose-50" : "hover:bg-canvas/50";
    const consistentBadge = item.amount_consistent === false ? 
      `<span class="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded border border-rose-200 ml-1.5 inline-flex items-center" title="Sai lệch số tiền">! Lệch</span>` : "";

    const tr = document.createElement("tr");
    tr.className = `transition-colors cursor-pointer ${rowClass}`;
    tr.onclick = () => openDrawer(item.id);

    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-ink">#REV-${item.id}</td>
      <td class="py-3 px-3 font-mono text-mid-gray">${item.order?.order_code || "---"}</td>
      <td class="py-3 px-3">
         <div class="truncate max-w-[220px] font-medium text-ink" title="${item.course?.title}">${item.course?.title || "---"}</div>
      </td>
      <td class="py-3 px-3">
         <div class="truncate max-w-[150px] font-medium text-ink" title="${item.instructor?.full_name}">${item.instructor?.full_name || "---"}</div>
         <div class="text-[10px] text-mid-gray truncate max-w-[150px]">${item.instructor?.email || ""}</div>
      </td>
      <td class="py-3 px-3 text-right font-bold text-ink">
         ${formatMoney(item.gross_amount)}
         ${consistentBadge}
      </td>
      <td class="py-3 px-3 text-right font-semibold text-emerald-600">${formatMoney(item.instructor_amount)}</td>
      <td class="py-3 px-3 text-right font-semibold text-blue-600">${formatMoney(item.platform_fee_amount)}</td>
      <td class="py-3 px-3">
         <div class="text-[10px] font-medium text-mid-gray whitespace-nowrap">
            GV: <span class="font-bold text-ink">${item.instructor_rate}%</span> / NT: <span class="font-bold text-ink">${item.platform_rate}%</span>
         </div>
      </td>
      <td class="py-3 px-3">
         <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${sMap.class}">${sMap.label}</span>
      </td>
      <td class="py-3 px-3 text-[11px] text-mid-gray whitespace-nowrap">${formatDate(item.earned_at)}</td>
      <td class="py-3 px-3 text-center">
         <div class="flex items-center justify-center">
            ${item.amount_consistent === false ? 
              `<svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
              : `<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`
            }
         </div>
      </td>
      <td class="py-3 px-3 text-center">
         <button type="button" class="text-blue-600 hover:text-blue-800 text-[11px] font-semibold p-1 hover:underline cursor-pointer" onclick="event.stopPropagation(); openDrawer('${item.id}')">Xem</button>
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
  prevBtn.className = `px-2.5 py-1 text-xs font-semibold rounded border ${meta.current_page === 1 ? 'border-hairline text-mid-gray/50 cursor-not-allowed bg-canvas' : 'border-hairline bg-paper text-ink hover:bg-canvas cursor-pointer'}`;
  prevBtn.textContent = "Trước";
  prevBtn.disabled = meta.current_page === 1;
  prevBtn.onclick = () => { state.page--; loadTableOnly(); };
  container.appendChild(prevBtn);

  for (let i = 1; i <= meta.last_page; i++) {
    if (i === 1 || i === meta.last_page || (i >= meta.current_page - 1 && i <= meta.current_page + 1)) {
      const btn = document.createElement("button");
      btn.className = `w-7 py-1 text-xs font-semibold rounded border ${i === meta.current_page ? 'border-ink bg-ink text-white' : 'border-hairline bg-paper text-ink hover:bg-canvas cursor-pointer'}`;
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
  nextBtn.className = `px-2.5 py-1 text-xs font-semibold rounded border ${meta.current_page === meta.last_page ? 'border-hairline text-mid-gray/50 cursor-not-allowed bg-canvas' : 'border-hairline bg-paper text-ink hover:bg-canvas cursor-pointer'}`;
  nextBtn.textContent = "Sau";
  nextBtn.disabled = meta.current_page === meta.last_page;
  nextBtn.onclick = () => { state.page++; loadTableOnly(); };
  container.appendChild(nextBtn);
}

function renderChart(reportData) {
  const emptyStateEl = document.getElementById("chart-empty-state");

  if (!reportData || reportData.length === 0) {
    if (revenueChartInstance) {
      revenueChartInstance.destroy();
      revenueChartInstance = null;
    }
    if (emptyStateEl) emptyStateEl.classList.remove("hidden");
    return;
  }

  if (emptyStateEl) emptyStateEl.classList.add("hidden");

  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Hủy chart instance cũ trước khi render mới
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  const labels = reportData.map(d => {
    const parts = d.period.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return d.period;
  });

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
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Thu nhập Giảng viên',
          data: instrData,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Phí Nền tảng',
          data: platData,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
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
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            font: { size: 11, family: 'Inter, sans-serif' }
          }
        },
        tooltip: {
          padding: 10,
          backgroundColor: '#1E293B',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
          callbacks: {
            title: function(context) {
              const index = context[0].dataIndex;
              const rawDate = reportData[index]?.period || '';
              const orderCount = reportData[index]?.order_count || 0;
              return `Ngày ${rawDate} (${orderCount} đơn hàng)`;
            },
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
          ticks: { font: { size: 10, family: 'Inter, sans-serif' } }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#F1F5F9' },
          border: { display: false },
          ticks: {
            font: { size: 10, family: 'Inter, sans-serif' },
            callback: function(value) {
               if (value >= 1000000) return (value / 1000000) + 'M đ';
               if (value >= 1000) return (value / 1000) + 'k đ';
               return value + ' đ';
            }
          }
        }
      }
    }
  });
}

/**========================================================================
 * EVENT HANDLERS & FILTERS
 *========================================================================**/
function setupEventListeners() {
  document.getElementById("btn-refresh-data")?.addEventListener("click", () => {
    state.page = 1;
    loadData();
  });

  // 1. Ô Tìm kiếm chung (Unified Search + Debounce 350ms)
  const searchInput = document.getElementById("filter-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      state.filters.search = val;
      toggleClearSearchButton(val);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.page = 1;
        loadData();
      }, 350);
    });
  }

  // Nút xóa từ khóa tìm kiếm
  const clearBtn = document.getElementById("btn-clear-search");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.filters.search = "";
      if (searchInput) searchInput.value = "";
      toggleClearSearchButton("");
      state.page = 1;
      loadData();
    });
  }

  // 2. Select thời gian
  const presetSelect = document.getElementById("filter-date-preset");
  if (presetSelect) {
    presetSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      state.filters.date_preset = val;

      const customGroup = document.getElementById("custom-date-group");
      if (val === "custom") {
        customGroup?.classList.remove("hidden");
        customGroup?.classList.add("flex");
        const labelEl = document.getElementById("chart-preset-label");
        if (labelEl) labelEl.textContent = "Tùy chọn ngày";
      } else {
        customGroup?.classList.add("hidden");
        customGroup?.classList.remove("flex");
        applyPresetDates();
        state.page = 1;
        loadData();
      }
    });
  }

  // 3. Inputs từ ngày / đến ngày
  const dateFromEl = document.getElementById("filter-date-from");
  const dateToEl = document.getElementById("filter-date-to");

  [dateFromEl, dateToEl].forEach((el) => {
    if (el) {
      el.addEventListener("change", () => {
        if (state.filters.date_preset === "custom") {
          state.filters.date_from = dateFromEl.value;
          state.filters.date_to = dateToEl.value;

          const errEl = document.getElementById("date-validation-error");
          if (dateFromEl.value && dateToEl.value && new Date(dateFromEl.value) > new Date(dateToEl.value)) {
            if (errEl) {
              errEl.textContent = "Ngày bắt đầu không được lớn hơn ngày kết thúc.";
              errEl.classList.remove("hidden");
            }
            return;
          }
          if (errEl) errEl.classList.add("hidden");

          state.page = 1;
          loadData();
        }
      });
    }
  });

  // 4. Select Trạng thái
  const statusSelect = document.getElementById("filter-status");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      state.filters.status = e.target.value;
      state.page = 1;
      loadData();
    });
  }

  // 5. Nút Đặt lại bộ lọc
  document.getElementById("btn-reset-filters")?.addEventListener("click", resetFilters);
  document.getElementById("btn-clear-empty-filter")?.addEventListener("click", resetFilters);
  document.getElementById("btn-retry-error")?.addEventListener("click", () => loadData());

  // 6. Drawer Events
  document.getElementById("btn-close-drawer")?.addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay")?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.isDrawerOpen) closeDrawer();
  });
}

function resetFilters() {
  state.filters = {
    search: "",
    date_preset: "last_30_days",
    date_from: "",
    date_to: "",
    status: "all"
  };

  const searchInput = document.getElementById("filter-search");
  if (searchInput) searchInput.value = "";
  toggleClearSearchButton("");

  const presetSelect = document.getElementById("filter-date-preset");
  if (presetSelect) presetSelect.value = "last_30_days";

  const customGroup = document.getElementById("custom-date-group");
  if (customGroup) {
    customGroup.classList.add("hidden");
    customGroup.classList.remove("flex");
  }

  document.getElementById("filter-date-from").value = "";
  document.getElementById("filter-date-to").value = "";
  document.getElementById("filter-status").value = "all";
  document.getElementById("date-validation-error")?.classList.add("hidden");

  applyPresetDates();
  state.page = 1;
  loadData();
}

function hasActiveFilters() {
  return state.filters.search !== "" || state.filters.status !== "all";
}

function renderFilterChips() {
  const container = document.getElementById("filter-chips-container");
  if (!container) return;
  container.innerHTML = "";

  const addChip = (label, value, onRemove) => {
    const chip = document.createElement("div");
    chip.className = "flex items-center gap-1.5 px-2 py-0.5 bg-surface-alt rounded border border-hairline text-mid-gray";
    chip.innerHTML = `<span class="font-semibold text-ink">${label}:</span> <span>${value}</span>
      <button type="button" class="hover:text-ink hover:bg-canvas rounded-full p-0.5 transition-colors cursor-pointer"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
    chip.querySelector("button").onclick = onRemove;
    container.appendChild(chip);
  };

  if (state.filters.search) {
    addChip("Từ khóa", state.filters.search, () => {
      state.filters.search = "";
      const input = document.getElementById("filter-search");
      if (input) input.value = "";
      toggleClearSearchButton("");
      state.page = 1;
      loadData();
    });
  }

  if (state.filters.status !== "all") {
    const l = document.querySelector(`#filter-status option[value="${state.filters.status}"]`)?.textContent || state.filters.status;
    addChip("Trạng thái", l, () => {
      state.filters.status = "all";
      document.getElementById("filter-status").value = "all";
      state.page = 1;
      loadData();
    });
  }
}

/**========================================================================
 * DRAWER LOGIC
 *========================================================================**/
async function openDrawer(id) {
  state.isDrawerOpen = true;
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("revenue-drawer");

  overlay.classList.remove("hidden");
  void overlay.offsetWidth;
  overlay.classList.remove("opacity-0");
  drawer.classList.remove("translate-x-full");
  document.body.classList.add("overflow-hidden");

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
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("revenue-drawer");

  overlay.classList.add("opacity-0");
  drawer.classList.add("translate-x-full");
  document.body.classList.remove("overflow-hidden");

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 300);

  const url = new URL(window.location);
  url.searchParams.delete("open_revenue_id");
  window.history.pushState({}, "", url);
}

function populateDrawer(data) {
  document.getElementById("drawer-loading").classList.add("hidden");
  document.getElementById("drawer-loading").classList.remove("flex");
  document.getElementById("drawer-content").classList.remove("hidden");

  const sMap = statusMap[data.status] || { label: data.status, class: "" };
  document.getElementById("drawer-status").innerHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${sMap.class}">${sMap.label}</span>`;
  document.getElementById("drawer-earned-at").textContent = formatDate(data.earned_at);

  document.getElementById("drawer-gross-amount").textContent = formatMoney(data.gross_amount);
  document.getElementById("drawer-instructor-amount").textContent = formatMoney(data.instructor_amount);
  document.getElementById("drawer-platform-amount").textContent = formatMoney(data.platform_fee_amount);
  document.getElementById("drawer-instructor-rate").textContent = Number.isFinite(Number(data.instructor_rate)) ? Number(data.instructor_rate).toLocaleString("vi-VN") : "0";
  document.getElementById("drawer-platform-rate").textContent = Number.isFinite(Number(data.platform_rate)) ? Number(data.platform_rate).toLocaleString("vi-VN") : "0";

  if (data.amount_consistent === false) {
    document.getElementById("drawer-consistency-warning").classList.remove("hidden");
  } else {
    document.getElementById("drawer-consistency-warning").classList.add("hidden");
  }

  if (data.order) {
    document.getElementById("drawer-order-code").textContent = data.order.order_code;
    document.getElementById("drawer-order-amount").textContent = formatMoney(data.order.amount);

    const osMap = orderStatusMap[data.order.status] || { label: data.order.status, class: "text-mid-gray bg-canvas" };
    document.getElementById("drawer-order-status").innerHTML = `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${osMap.class}">${osMap.label}</span>`;

    const psMap = orderPaymentMap[data.order.payment_status] || { label: data.order.payment_status, class: "text-mid-gray" };
    document.getElementById("drawer-payment-status").innerHTML = `<span class="text-[10px] font-semibold ${psMap.class}">TT: ${psMap.label}</span>`;

    document.getElementById("drawer-order-link").href = `orders.html?open_order_id=${data.order.id}`;
  } else {
    document.getElementById("drawer-order-code").textContent = "---";
    document.getElementById("drawer-order-amount").textContent = "0 đ";
    document.getElementById("drawer-order-status").textContent = "---";
    document.getElementById("drawer-payment-status").textContent = "---";
    document.getElementById("drawer-order-link").removeAttribute("href");
  }

  if (data.course) {
    document.getElementById("drawer-course-title").textContent = data.course.title;
    document.getElementById("drawer-course-link").href = `courses.html?open_course_id=${data.course.id}`;
  } else {
    document.getElementById("drawer-course-title").textContent = "---";
    document.getElementById("drawer-course-link").removeAttribute("href");
  }

  if (data.instructor) {
    document.getElementById("drawer-instructor-name").textContent = data.instructor.full_name;
    document.getElementById("drawer-instructor-email").textContent = data.instructor.email;
    document.getElementById("drawer-instructor-link").href = `users.html?open_user_id=${data.instructor.id}`;
  } else {
    document.getElementById("drawer-instructor-name").textContent = "---";
    document.getElementById("drawer-instructor-email").textContent = "---";
    document.getElementById("drawer-instructor-link").removeAttribute("href");
  }
}
