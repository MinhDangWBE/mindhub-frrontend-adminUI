import {
  getPayoutAccounts,
  getPayoutAccountById,
  updatePayoutAccountStatus,
} from "../mocks/mock-repository.js";
import { USE_MOCK_DATA } from "../core/config.js";

const API_BASE_URL = "/api/admin/payout-accounts";

/**
 * Tính summary trên danh sách (trước khi áp dụng status filter)
 */
export function calculatePayoutSummary(accounts = []) {
  let active_count = 0;
  let pending_verification_count = 0;
  let rejected_count = 0;
  let inactive_count = 0;

  accounts.forEach((acc) => {
    if (acc.status === "active") {
      active_count++;
    } else if (acc.status === "pending_verification") {
      pending_verification_count++;
    } else if (acc.status === "rejected") {
      rejected_count++;
    } else if (acc.status === "inactive") {
      inactive_count++;
    }
  });

  return {
    total_accounts: accounts.length,
    active_count,
    pending_verification_count,
    rejected_count,
    inactive_count,
  };
}

/**
 * Lọc danh sách tài khoản nhận tiền theo search, user_id, provider
 */
function filterBaseDataset(accounts = [], params = {}) {
  let filtered = [...accounts];

  // 1. Search (Tên GV, Email GV, Chủ TK, Masked Account, Full Account, Provider, ID)
  if (params.search && params.search.trim() !== "") {
    const term = params.search.trim().toLowerCase();
    filtered = filtered.filter((acc) => {
      const idStr = String(acc.id);
      const userIdStr = String(acc.user_id);
      const userName = (acc.user?.full_name || "").toLowerCase();
      const userEmail = (acc.user?.email || "").toLowerCase();
      const accountName = (acc.account_name || "").toLowerCase();
      const maskedNumber = (acc.account_number_masked || "").toLowerCase();
      const fullNumber = (acc.account_number || "").toLowerCase();
      const provider = (acc.provider || "").toLowerCase();

      return (
        idStr === term ||
        userIdStr === term ||
        userName.includes(term) ||
        userEmail.includes(term) ||
        accountName.includes(term) ||
        maskedNumber.includes(term) ||
        fullNumber.includes(term) ||
        provider.includes(term)
      );
    });
  }

  // 2. Filter User ID
  if (params.user_id) {
    const userId = Number(params.user_id);
    filtered = filtered.filter((acc) => Number(acc.user_id) === userId);
  }

  // 3. Filter Provider
  if (params.provider && params.provider !== "all") {
    const pTerm = params.provider.trim().toLowerCase();
    filtered = filtered.filter((acc) => (acc.provider || "").toLowerCase() === pTerm);
  }

  return filtered;
}

/**
 * GET /api/admin/payout-accounts
 */
export async function fetchPayoutAccounts(params = {}) {
  if (!USE_MOCK_DATA) {
    // API thật trong tương lai
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}?${query}`);
    return await res.json();
  }

  // 1. Lấy toàn bộ dữ liệu mock đã hydrate
  const allAccounts = getPayoutAccounts();

  // 2. Áp dụng filter chung (không gồm status) để tính summary chuẩn
  const summaryFiltered = filterBaseDataset(allAccounts, params);
  const summary = calculatePayoutSummary(summaryFiltered);

  // 3. Áp dụng status filter cho bảng danh sách
  let tableFiltered = [...summaryFiltered];
  if (params.status && params.status !== "all") {
    tableFiltered = tableFiltered.filter((acc) => acc.status === params.status);
  }

  // 4. Sắp xếp mặc định: updated_at giảm dần (hoặc created_at)
  tableFiltered.sort((a, b) => {
    const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
    const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
    return timeB - timeA;
  });

  // 5. Phân trang
  const page = Math.max(1, Number(params.page) || 1);
  const per_page = Math.max(1, Number(params.per_page) || 20);
  const total = tableFiltered.length;
  const last_page = Math.max(1, Math.ceil(total / per_page));

  const startIndex = (page - 1) * per_page;
  const rawPageItems = tableFiltered.slice(startIndex, startIndex + per_page);

  // Mask full account number trong danh sách trả về để bảo mật DOM
  const pageItems = rawPageItems.map((item) => {
    const { account_number, ...rest } = item;
    return {
      ...rest,
      account_number_masked: item.account_number_masked || "******",
    };
  });

  return {
    success: true,
    message: "Lấy dữ liệu thành công.",
    data: {
      summary,
      items: pageItems,
    },
    meta: {
      current_page: page,
      last_page,
      per_page,
      total,
    },
  };
}

/**
 * GET /api/admin/payout-accounts/{id}
 */
export async function fetchPayoutAccountById(id) {
  if (!USE_MOCK_DATA) {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    return await res.json();
  }

  const account = getPayoutAccountById(id);
  if (!account) {
    return {
      success: false,
      message: "Không tìm thấy tài khoản nhận tiền trong hệ thống.",
      errors: {},
    };
  }

  return {
    success: true,
    message: "Lấy thông tin chi tiết thành công.",
    data: account,
  };
}

/**
 * PATCH /api/admin/payout-accounts/{id}/approve
 */
export async function approvePayoutAccountApi(id) {
  if (!USE_MOCK_DATA) {
    const res = await fetch(`${API_BASE_URL}/${id}/approve`, { method: "PATCH" });
    return await res.json();
  }

  const res = updatePayoutAccountStatus(id, "active");
  if (!res.success) {
    return {
      success: false,
      message: res.message,
      errors: {},
    };
  }

  return {
    success: true,
    message: "Duyệt tài khoản nhận tiền thành công.",
    data: res.data,
  };
}

/**
 * PATCH /api/admin/payout-accounts/{id}/reject
 */
export async function rejectPayoutAccountApi(id) {
  if (!USE_MOCK_DATA) {
    const res = await fetch(`${API_BASE_URL}/${id}/reject`, { method: "PATCH" });
    return await res.json();
  }

  const res = updatePayoutAccountStatus(id, "rejected");
  if (!res.success) {
    return {
      success: false,
      message: res.message,
      errors: {},
    };
  }

  return {
    success: true,
    message: "Từ chối tài khoản nhận tiền thành công.",
    data: res.data,
  };
}

/**
 * PATCH /api/admin/payout-accounts/{id}/disable
 */
export async function disablePayoutAccountApi(id) {
  if (!USE_MOCK_DATA) {
    const res = await fetch(`${API_BASE_URL}/${id}/disable`, { method: "PATCH" });
    return await res.json();
  }

  const res = updatePayoutAccountStatus(id, "inactive");
  if (!res.success) {
    return {
      success: false,
      message: res.message,
      errors: {},
    };
  }

  return {
    success: true,
    message: "Vô hiệu hóa tài khoản nhận tiền thành công.",
    data: res.data,
  };
}
