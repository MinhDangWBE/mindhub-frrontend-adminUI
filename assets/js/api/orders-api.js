import { getOrders as getRepoOrders, getOrderById as getRepoOrderById, populateOrder, isValidOrderPaymentPair } from "../mocks/mock-repository.js";

const USE_MOCK = true;
const API_BASE_URL = "/api/admin/orders";

/**
 * Helper chuẩn hóa chuỗi tìm kiếm không phân biệt hoa/thường
 */
function normalizeSearchText(val) {
  return String(val ?? "").trim().toLocaleLowerCase("vi-VN");
}

/**
 * Helper parse số tiền an toàn từ string hoặc number decimal
 */

function parseMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

/**
 * Helper format decimal source dạng chuỗi "0.00"
 */

function formatDecimalSource(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

/**
 * Tính toán summary trên TOÀN BỘ dataset gốc đơn hàng trước pagination/filtering
 */

export function calculateOrdersSummary(orders) {
  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.status === "paid" && order.payment_status === "paid"
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const failedOrders = orders.filter(
    (order) => order.status === "failed"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  );

  const expiredOrders = orders.filter(
    (order) => order.status === "expired"
  );

  const paidAmount = paidOrders.reduce(
    (sum, order) => sum + parseMoney(order.amount),
    0
  );

  const averageOrderValue =
    paidOrders.length > 0 ? paidAmount / paidOrders.length : 0;

  const paymentSuccessRate =
    totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0;

  const incompleteOrders =
    failedOrders.length + cancelledOrders.length + expiredOrders.length;

  const anomalyCount = orders.filter(
    (order) => !isValidOrderPaymentPair(order.status, order.payment_status)
  ).length;

  return {
    total_orders: totalOrders,
    paid_orders: paidOrders.length,
    pending_orders: pendingOrders.length,
    failed_orders: failedOrders.length,
    cancelled_orders: cancelledOrders.length,
    expired_orders: expiredOrders.length,
    paid_amount: formatDecimalSource(paidAmount),
    average_order_value: formatDecimalSource(averageOrderValue),
    payment_success_rate: Number(paymentSuccessRate.toFixed(1)),
    incomplete_orders: incompleteOrders,
    anomaly_count: anomalyCount
  };
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

    // 1. Tính toán summary trên TOÀN BỘ dataset gốc bằng helper chuẩn
    const summary = calculateOrdersSummary(allPopulatedOrders);

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
