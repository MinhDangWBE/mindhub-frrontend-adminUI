import { getRevenues as getRepoRevenues } from "../mocks/mock-repository.js";
import { USE_MOCK_DATA } from "../core/config.js";

const API_BASE_URL = "/api/admin/revenues";
const API_REPORT_URL = "/api/admin/reports/revenue";

function parseMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatDecimalSource(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

/**
 * Tính summary trên toàn bộ danh sách đã lọc (trước pagination)
 */
export function calculateRevenuesSummary(revenues) {
  let total_gross_amount = 0;
  let total_instructor_amount = 0;
  let total_platform_fee_amount = 0;
  let available_amount = 0;
  let withdrawn_amount = 0;
  let cancelled_amount = 0;
  let inconsistent_count = 0;

  revenues.forEach((r) => {
    const gross = parseMoney(r.gross_amount);
    const instr = parseMoney(r.instructor_amount);
    const plat = parseMoney(r.platform_fee_amount);

    if (r.status === 'available' || r.status === 'withdrawn' || r.status === 'pending') {
      total_gross_amount += gross;
      total_instructor_amount += instr;
      total_platform_fee_amount += plat;
    }

    if (r.status === 'available') available_amount += instr;
    if (r.status === 'withdrawn') withdrawn_amount += instr;
    if (r.status === 'cancelled') cancelled_amount += gross;
    
    if (r.amount_consistent === false) inconsistent_count++;
  });

  return {
    total_gross_amount: formatDecimalSource(total_gross_amount),
    total_instructor_amount: formatDecimalSource(total_instructor_amount),
    total_platform_fee_amount: formatDecimalSource(total_platform_fee_amount),
    available_amount: formatDecimalSource(available_amount),
    withdrawn_amount: formatDecimalSource(withdrawn_amount),
    cancelled_amount: formatDecimalSource(cancelled_amount),
    inconsistent_count
  };
}

/**
 * Lọc dữ liệu dùng chung cho getRevenues và getRevenueReport
 */
function filterRevenueDataset(revenues, params = {}) {
  let filtered = [...revenues];

  // 1. Unified Search (tìm theo tên khóa học, giảng viên, email, mã đơn, ID đơn, ID revenue)
  if (params.search && params.search.trim() !== "") {
    const term = params.search.trim().toLowerCase();
    filtered = filtered.filter((r) => {
      const courseTitle = (r.course?.title || "").toLowerCase();
      const instructorName = (r.instructor?.full_name || "").toLowerCase();
      const instructorEmail = (r.instructor?.email || "").toLowerCase();
      const orderCode = (r.order?.order_code || "").toLowerCase();
      const orderIdStr = String(r.order?.id || "");
      const revenueIdStr = String(r.id || "");

      return (
        courseTitle.includes(term) ||
        instructorName.includes(term) ||
        instructorEmail.includes(term) ||
        orderCode.includes(term) ||
        orderIdStr === term ||
        revenueIdStr === term
      );
    });
  }

  // 2. Status Filter
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  // 3. Date Filters
  if (params.date_from) {
    const from = new Date(params.date_from);
    from.setHours(0, 0, 0, 0);
    filtered = filtered.filter((r) => new Date(r.earned_at) >= from);
  }

  if (params.date_to) {
    const to = new Date(params.date_to);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((r) => new Date(r.earned_at) <= to);
  }

  return filtered;
}

export async function getRevenues(params = {}) {
  if (!USE_MOCK_DATA) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}?${query}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const rawData = getRepoRevenues();
    const filtered = filterRevenueDataset(rawData, params);

    // Sort theo thời gian ghi nhận mới nhất
    const sortBy = params.sort_by || 'earned_at';
    const sortDir = params.sort_direction || 'desc';
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'earned_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (['gross_amount', 'instructor_amount', 'platform_fee_amount'].includes(sortBy)) {
        valA = parseMoney(valA);
        valB = parseMoney(valB);
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // Summary calculation trên TOÀN BỘ danh sách đã lọc (trước khi phân trang)
    const summary = calculateRevenuesSummary(filtered);

    // Pagination
    const total = filtered.length;
    const perPage = Number(params.per_page) || 20;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    let page = Number(params.page) || 1;
    if (page > lastPage) page = 1;

    const startIndex = (page - 1) * perPage;
    const items = filtered.slice(startIndex, startIndex + perPage);

    return {
      success: true,
      message: "Lấy dữ liệu doanh thu thành công.",
      data: { summary, items },
      meta: { current_page: page, last_page: lastPage, per_page: perPage, total }
    };
  } catch (error) {
    console.error("Lỗi getRevenues mock:", error);
    throw error;
  }
}

export async function getRevenueReport(params = {}) {
  if (!USE_MOCK_DATA) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_REPORT_URL}?${query}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  const rawData = getRepoRevenues();
  const filtered = filterRevenueDataset(rawData, params);

  // Determine date bounds
  let dateFrom = params.date_from ? new Date(params.date_from) : new Date("2026-06-22T00:00:00Z");
  let dateTo = params.date_to ? new Date(params.date_to) : new Date("2026-07-21T23:59:59Z");
  dateFrom.setHours(0, 0, 0, 0);
  dateTo.setHours(23, 59, 59, 999);

  const diffDays = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24));
  let groupBy = params.group_by;
  if (!groupBy) {
    if (params.time_preset === "1_day") groupBy = "hour";
    else if (diffDays > 31) groupBy = "month";
    else groupBy = "day";
  }

  const reportMap = {};

  // Build zero-filled buckets for continuous timeline
  if (groupBy === "hour") {
    for (let h = 0; h < 24; h += 2) {
      const key = `${String(h).padStart(2, '0')}:00`;
      reportMap[key] = { period: key, gross_amount: 0, instructor_amount: 0, platform_fee_amount: 0, order_count: 0 };
    }
  } else if (groupBy === "month") {
    let current = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
    const end = new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);
    while (current <= end) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      reportMap[key] = { period: key, gross_amount: 0, instructor_amount: 0, platform_fee_amount: 0, order_count: 0 };
      current.setMonth(current.getMonth() + 1);
    }
  } else {
    // day
    let current = new Date(dateFrom.getTime());
    while (current <= dateTo) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      reportMap[key] = { period: key, gross_amount: 0, instructor_amount: 0, platform_fee_amount: 0, order_count: 0 };
      current.setDate(current.getDate() + 1);
    }
  }

  // Aggregate actual data into buckets
  filtered.forEach((r) => {
    if (r.status === 'cancelled') return;

    const date = new Date(r.earned_at);
    let key;
    if (groupBy === "hour") {
      const h = Math.floor(date.getHours() / 2) * 2;
      key = `${String(h).padStart(2, '0')}:00`;
    } else if (groupBy === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    if (reportMap[key]) {
      reportMap[key].gross_amount += parseMoney(r.gross_amount);
      reportMap[key].instructor_amount += parseMoney(r.instructor_amount);
      reportMap[key].platform_fee_amount += parseMoney(r.platform_fee_amount);
      reportMap[key].order_count += 1;
    }
  });

  const reportData = Object.values(reportMap).map((row) => ({
    period: row.period,
    gross_amount: formatDecimalSource(row.gross_amount),
    instructor_amount: formatDecimalSource(row.instructor_amount),
    platform_fee_amount: formatDecimalSource(row.platform_fee_amount),
    order_count: row.order_count
  }));

  return {
    success: true,
    message: "Lấy báo cáo doanh thu thành công.",
    data: reportData
  };
}

export async function getRevenueById(id) {
  if (!USE_MOCK_DATA) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  const revenues = getRepoRevenues();
  const revenue = revenues.find((r) => r.id === Number(id));

  if (!revenue) {
    const error = new Error("Không tìm thấy bản ghi doanh thu.");
    error.status = 404;
    throw error;
  }

  return {
    success: true,
    message: "Thành công",
    data: revenue
  };
}
