import { getOrders as getRepoOrders, getOrderById as getRepoOrderById, populateOrder } from "../mocks/mock-repository.js";

const USE_MOCK = true;
const API_BASE_URL = "/api/admin/orders";

/**
 * Helper chuẩn hóa chuỗi tìm kiếm không phân biệt hoa/thường
 */
function normalizeSearchText(val) {
  return String(val ?? "").trim().toLocaleLowerCase("vi-VN");
}

/**
 * Lấy danh sách đơn hàng (hỗ trợ phân trang, lọc, summary)
 * API Contract Query List: page, per_page, status, payment_status, user_id, course_id, order_code, date_from, date_to
 */
export async function getOrders(params = {}) {
  if (!USE_MOCK) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}?${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Giả lập độ trễ mạng 350ms
  await new Promise((resolve) => setTimeout(resolve, 350));

  try {
    const rawOrders = getRepoOrders();
    const allPopulatedOrders = rawOrders.map(populateOrder).filter(Boolean);

    // 1. Tính toán summary trên TOÀN BỘ dataset gốc bằng quy tắc status chuẩn
    let totalPaidSum = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let failedCount = 0;
    let cancelledCount = 0;
    let expiredCount = 0;
    let anomalyCount = 0;

    allPopulatedOrders.forEach((o) => {
      const st = o.status;

      if (st === "paid") {
        paidCount++;
        totalPaidSum += Number(o.amount) || 0;
      } else if (st === "pending") {
        pendingCount++;
      } else if (st === "failed") {
        failedCount++;
      } else if (st === "cancelled") {
        cancelledCount++;
      } else if (st === "expired") {
        expiredCount++;
      }

      if (o.consistency) {
        if (!o.consistency.paid_has_enrollment || !o.consistency.paid_has_revenue || !o.consistency.amounts_match) {
          anomalyCount++;
        }
      }
    });

    const totalOrdersCount = allPopulatedOrders.length;
    const avgOrderValue = paidCount > 0 ? (totalPaidSum / paidCount).toFixed(2) : "0.00";
    const successRate = totalOrdersCount > 0 ? parseFloat(((paidCount / totalOrdersCount) * 100).toFixed(1)) : 0;

    const summary = {
      total_orders: totalOrdersCount,
      pending_orders: pendingCount,
      paid_orders: paidCount,
      failed_orders: failedCount,
      cancelled_orders: cancelledCount,
      expired_orders: expiredCount,
      paid_amount: totalPaidSum.toFixed(2),
      average_order_value: avgOrderValue,
      payment_success_rate: successRate,
      anomaly_count: anomalyCount
    };

    // 2. Lọc danh sách từ mảng clone mới
    let filtered = [...allPopulatedOrders];

    // Lọc theo tìm kiếm tổng hợp (Unified Search) hoặc order_code
    const searchKeyword = normalizeSearchText(params.search || params.order_code);
    if (searchKeyword) {
      filtered = filtered.filter((o) => {
        const searchableFields = [
          o.order_code,
          o.provider_transaction_id,
          o.user?.full_name,
          o.user?.email,
          o.course?.title,
          o.course?.slug
        ].map(normalizeSearchText).join(" ");
        
        return searchableFields.includes(searchKeyword);
      });
    }

    // Lọc theo status (raw order status)
    if (params.status && params.status !== "" && params.status !== "all") {
      filtered = filtered.filter((o) => o.status === params.status);
    }

    // Lọc theo payment_status (raw payment status)
    if (params.payment_status && params.payment_status !== "" && params.payment_status !== "all") {
      filtered = filtered.filter((o) => o.payment_status === params.payment_status);
    }

    // Lọc theo user_id
    if (params.user_id && params.user_id !== "" && params.user_id !== "all") {
      const targetUserId = Number(params.user_id);
      filtered = filtered.filter((o) => Number(o.user_id) === targetUserId);
    }

    // Lọc theo course_id
    if (params.course_id && params.course_id !== "" && params.course_id !== "all") {
      const targetCourseId = Number(params.course_id);
      filtered = filtered.filter((o) => Number(o.course_id) === targetCourseId);
    }

    // Lọc theo khoảng thời gian (date_from, date_to)
    if (params.date_from && params.date_from !== "") {
      const fromDate = new Date(params.date_from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((o) => new Date(o.created_at) >= fromDate);
    }

    if (params.date_to && params.date_to !== "") {
      const toDate = new Date(params.date_to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((o) => new Date(o.created_at) <= toDate);
    }

    // Sắp xếp đơn hàng mới nhất lên đầu
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 3. Phân trang an toàn (reset page = 1 nếu page hiện tại > lastPage)
    const total = filtered.length;
    const perPage = Number(params.per_page) || 20;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    let page = Number(params.page) || 1;
    if (page > lastPage) {
      page = 1;
    }

    const startIndex = (page - 1) * perPage;
    const items = filtered.slice(startIndex, startIndex + perPage);

    return {
      success: true,
      message: "Lấy dữ liệu thành công.",
      data: {
        summary,
        items
      },
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total
      }
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng mock:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết đơn hàng theo ID
 */
export async function getOrder(id) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Giả lập độ trễ mạng 200ms
  await new Promise((resolve) => setTimeout(resolve, 200));

  const rawOrder = getRepoOrderById(id);
  if (!rawOrder) {
    const error = new Error("Đơn hàng không tồn tại hoặc đã bị xóa.");
    error.status = 404;
    throw error;
  }

  const populatedOrder = populateOrder(rawOrder);

  return {
    success: true,
    message: "Lấy chi tiết đơn hàng thành công.",
    data: populatedOrder
  };
}
