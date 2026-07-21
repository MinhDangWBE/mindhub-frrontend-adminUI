import { getWithdrawals, getWithdrawalById, updateWithdrawalStatus } from "../mocks/mock-repository.js";
import { USE_MOCK_DATA } from "../core/config.js";

const API_BASE_URL = "/api/admin/withdrawals";

function formatDecimalSource(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

/**
 * Tính summary trên toàn bộ danh sách đã lọc (trước khi phân trang)
 */
export function calculateWithdrawalsSummary(withdrawals) {
  let pending_count = 0;
  let approved_count = 0;
  let rejected_count = 0;
  let paid_count = 0;

  let pending_amount = 0;
  let approved_amount = 0;
  let rejected_amount = 0;
  let paid_amount = 0;

  withdrawals.forEach((w) => {
    const amt = Number(w.amount) || 0;
    if (w.status === "pending") {
      pending_count++;
      pending_amount += amt;
    } else if (w.status === "approved") {
      approved_count++;
      approved_amount += amt;
    } else if (w.status === "rejected") {
      rejected_count++;
      rejected_amount += amt;
    } else if (w.status === "paid") {
      paid_count++;
      paid_amount += amt;
    }
  });

  return {
    total_requests: withdrawals.length,
    pending_count,
    approved_count,
    rejected_count,
    paid_count,
    pending_amount: formatDecimalSource(pending_amount),
    approved_amount: formatDecimalSource(approved_amount),
    rejected_amount: formatDecimalSource(rejected_amount),
    paid_amount: formatDecimalSource(paid_amount),
  };
}

/**
 * Lọc dữ liệu yêu cầu rút tiền
 */
function filterWithdrawalDataset(withdrawals, params = {}) {
  let filtered = [...withdrawals];

  // 1. Search (Mã WD, Tên GV, Email GV, Provider payout ID, Masked Account Number, ID)
  if (params.search && params.search.trim() !== "") {
    const term = params.search.trim().toLowerCase();
    filtered = filtered.filter((w) => {
      const code = (w.withdrawal_code || "").toLowerCase();
      const idStr = String(w.id);
      const name = (w.user?.full_name || "").toLowerCase();
      const email = (w.user?.email || "").toLowerCase();
      const providerTx = (w.provider_payout_id || "").toLowerCase();
      const maskedAcc = (w.payout_snapshot?.account_number_masked || w.payout_account?.account_number_masked || "").toLowerCase();
      const rawAcc = (w.payout_snapshot?.account_number || w.payout_account?.account_number || "").toLowerCase();

      return (
        code.includes(term) ||
        idStr === term ||
        name.includes(term) ||
        email.includes(term) ||
        providerTx.includes(term) ||
        maskedAcc.includes(term) ||
        rawAcc.includes(term)
      );
    });
  }

  // 2. Filter User ID
  if (params.user_id) {
    const userId = Number(params.user_id);
    filtered = filtered.filter((w) => Number(w.user_id) === userId);
  }

  // 3. Filter Status
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((w) => w.status === params.status);
  }

  // 4. Time Preset / Date Filters
  const now = new Date();
  if (params.time_preset && params.time_preset !== "all") {
    if (params.time_preset === "today") {
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      filtered = filtered.filter((w) => new Date(w.requested_at) >= startToday);
    } else if (params.time_preset === "last_7_days") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((w) => new Date(w.requested_at) >= sevenDaysAgo);
    } else if (params.time_preset === "last_30_days") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((w) => new Date(w.requested_at) >= thirtyDaysAgo);
    } else if (params.time_preset === "last_3_months") {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((w) => new Date(w.requested_at) >= ninetyDaysAgo);
    }
  }

  if (params.date_from) {
    const fromDate = new Date(params.date_from);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter((w) => new Date(w.requested_at) >= fromDate);
  }

  if (params.date_to) {
    const toDate = new Date(params.date_to);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((w) => new Date(w.requested_at) <= toDate);
  }

  // 5. Amount Filters
  if (params.amount_min !== undefined && params.amount_min !== null && params.amount_min !== "") {
    const minAmt = Number(params.amount_min);
    if (!isNaN(minAmt)) {
      filtered = filtered.filter((w) => Number(w.amount) >= minAmt);
    }
  }

  if (params.amount_max !== undefined && params.amount_max !== null && params.amount_max !== "") {
    const maxAmt = Number(params.amount_max);
    if (!isNaN(maxAmt)) {
      filtered = filtered.filter((w) => Number(w.amount) <= maxAmt);
    }
  }

  // 6. Default Sort: requested_at giảm dần
  filtered.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));

  return filtered;
}

/**
 * GET /api/admin/withdrawals
 */
export async function fetchWithdrawals(params = {}) {
  if (USE_MOCK_DATA) {
    const allWithdrawals = getWithdrawals();
    
    // Summary data tính trên tập đã lọc theo search, thời gian, số tiền nhưng KHÔNG bị ảnh hưởng bởi lọc status
    const summaryParams = { ...params, status: "all" };
    const summaryFiltered = filterWithdrawalDataset(allWithdrawals, summaryParams);
    const summary = calculateWithdrawalsSummary(summaryFiltered);

    // Bảng dữ liệu lọc toàn bộ điều kiện (bao gồm cả status)
    const filtered = filterWithdrawalDataset(allWithdrawals, params);

    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Number(params.per_page) || 20);
    const total = filtered.length;
    const lastPage = Math.ceil(total / perPage) || 1;
    const startIndex = (page - 1) * perPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + perPage);

    return {
      success: true,
      message: "Lấy dữ liệu thành công.",
      data: {
        summary,
        items: paginatedItems,
      },
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    };
  }

  throw new Error("API Backend chưa được kết nối.");
}

/**
 * GET /api/admin/withdrawals/{id}
 */
export async function fetchWithdrawalById(id) {
  if (USE_MOCK_DATA) {
    const withdrawal = getWithdrawalById(id);
    if (!withdrawal) {
      return {
        success: false,
        message: "Không tìm thấy yêu cầu rút tiền trong hệ thống.",
        errors: { id: "Bản ghi không tồn tại." },
      };
    }
    return {
      success: true,
      message: "Thao tác thành công.",
      data: withdrawal,
    };
  }

  throw new Error("API Backend chưa được kết nối.");
}

/**
 * PATCH /api/admin/withdrawals/{id}/approve
 */
export async function approveWithdrawalApi(id) {
  if (USE_MOCK_DATA) {
    const current = getWithdrawalById(id);
    if (!current) {
      return {
        success: false,
        message: "Không tìm thấy yêu cầu rút tiền.",
        errors: {},
      };
    }

    if (current.status !== "pending") {
      return {
        success: false,
        message: `Không thể duyệt yêu cầu có trạng thái "${current.status}". Chỉ yêu cầu ở trạng thái "Chờ duyệt" mới có thể duyệt.`,
        errors: { status: "Trạng thái không hợp lệ." },
      };
    }

    const nowStr = new Date().toISOString();
    const timeline = current.timeline || [];
    timeline.push({
      timestamp: nowStr,
      title: "Đã phê duyệt",
      description: "Admin đã phê duyệt yêu cầu rút tiền.",
      status: "success",
    });

    const updated = updateWithdrawalStatus(id, {
      status: "approved",
      approved_at: nowStr,
      timeline,
    });

    return {
      success: true,
      message: "Duyệt yêu cầu rút tiền thành công.",
      data: updated,
    };
  }

  throw new Error("API Backend chưa được kết nối.");
}

/**
 * PATCH /api/admin/withdrawals/{id}/reject
 */
export async function rejectWithdrawalApi(id, rejectedReason) {
  if (USE_MOCK_DATA) {
    const current = getWithdrawalById(id);
    if (!current) {
      return {
        success: false,
        message: "Không tìm thấy yêu cầu rút tiền.",
        errors: {},
      };
    }

    if (current.status !== "pending") {
      return {
        success: false,
        message: `Không thể từ chối yêu cầu có trạng thái "${current.status}". Chỉ yêu cầu ở trạng thái "Chờ duyệt" mới có thể từ chối.`,
        errors: { status: "Trạng thái không hợp lệ." },
      };
    }

    const trimmedReason = (rejectedReason || "").trim();
    if (!trimmedReason) {
      return {
        success: false,
        message: "Lý do từ chối là bắt buộc.",
        errors: { rejected_reason: "Vui lòng nhập lý do từ chối." },
      };
    }

    if (trimmedReason.length > 1000) {
      return {
        success: false,
        message: "Lý do từ chối tối đa 1000 ký tự.",
        errors: { rejected_reason: "Vượt quá độ dài tối đa 1000 ký tự." },
      };
    }

    const nowStr = new Date().toISOString();
    const timeline = current.timeline || [];
    timeline.push({
      timestamp: nowStr,
      title: "Từ chối yêu cầu",
      description: `Lý do: ${trimmedReason}`,
      status: "error",
    });

    const updated = updateWithdrawalStatus(id, {
      status: "rejected",
      rejected_at: nowStr,
      rejected_reason: trimmedReason,
      timeline,
    });

    return {
      success: true,
      message: "Đã từ chối yêu cầu rút tiền.",
      data: updated,
    };
  }

  throw new Error("API Backend chưa được kết nối.");
}

/**
 * PATCH /api/admin/withdrawals/{id}/mark-paid
 */
export async function markPaidWithdrawalApi(id, providerPayoutId) {
  if (USE_MOCK_DATA) {
    const current = getWithdrawalById(id);
    if (!current) {
      return {
        success: false,
        message: "Không tìm thấy yêu cầu rút tiền.",
        errors: {},
      };
    }

    if (current.status !== "approved") {
      return {
        success: false,
        message: `Không thể đánh dấu thanh toán cho yêu cầu có trạng thái "${current.status}". Chỉ yêu cầu ở trạng thái "Đã duyệt" mới có thể đánh dấu đã thanh toán.`,
        errors: { status: "Trạng thái không hợp lệ." },
      };
    }

    const trimmedPayoutId = (providerPayoutId || "").trim();
    if (!trimmedPayoutId) {
      return {
        success: false,
        message: "Mã giao dịch từ nhà cung cấp là bắt buộc.",
        errors: { provider_payout_id: "Vui lòng nhập mã giao dịch." },
      };
    }

    if (trimmedPayoutId.length > 255) {
      return {
        success: false,
        message: "Mã giao dịch tối đa 255 ký tự.",
        errors: { provider_payout_id: "Vượt quá độ dài tối đa 255 ký tự." },
      };
    }

    const nowStr = new Date().toISOString();
    const timeline = current.timeline || [];
    timeline.push({
      timestamp: nowStr,
      title: "Hoàn tất thanh toán",
      description: `Mã giao dịch nhà cung cấp: ${trimmedPayoutId}`,
      status: "success",
    });

    // Cập nhật trạng thái allocation tương ứng trong mock nếu có
    const updatedAllocations = (current.allocations || []).map((alloc) => ({
      ...alloc,
      status: "withdrawn",
    }));

    const updated = updateWithdrawalStatus(id, {
      status: "paid",
      paid_at: nowStr,
      provider_payout_id: trimmedPayoutId,
      allocations: updatedAllocations,
      timeline,
    });

    return {
      success: true,
      message: "Đã đánh dấu yêu cầu rút tiền là đã thanh toán.",
      data: updated,
    };
  }

  throw new Error("API Backend chưa được kết nối.");
}
