import { MOCK_DB } from "./mock-database.js";
const STORAGE_KEY = "mindhub_admin_mock_db";

// Khởi tạo database dùng chung trong localStorage nếu chưa có
function getDB() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DB));
    return MOCK_DB;
  }
  try {
    const db = JSON.parse(data);
    let mutated = false;
    if (!Array.isArray(db.comments)) { db.comments = MOCK_DB.comments || []; mutated = true; }
    if (!Array.isArray(db.reviews)) { db.reviews = MOCK_DB.reviews || []; mutated = true; }
    if (!Array.isArray(db.lessons)) { db.lessons = MOCK_DB.lessons || []; mutated = true; }
    if (mutated) saveDB(db);
    return db;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DB));
    return MOCK_DB;
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// === USERS ===
export function getUsers() {
  const db = getDB();
  return db.users || [];
}

export function getUserById(id) {
  const parsedId = Number(id);
  const user = getUsers().find((u) => u.id === parsedId);
  return user || null;
}

export function saveUsers(users) {
  const db = getDB();
  db.users = users;
  saveDB(db);
}

export function updateUser(id, updates) {
  const users = getUsers();
  const parsedId = Number(id);
  const index = users.findIndex((u) => u.id === parsedId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveUsers(users);
    return users[index];
  }
  return null;
}

// === CATEGORIES ===
export function getCategories() {
  const db = getDB();
  return (db.categories || []).filter((c) => c.deleted_at === null);
}

export function getRawCategories() {
  const db = getDB();
  return db.categories || [];
}

export function getCategoryById(id) {
  const parsedId = Number(id);
  return getCategories().find((c) => c.id === parsedId) || null;
}

export function saveCategories(categories) {
  const db = getDB();
  db.categories = categories;
  saveDB(db);
}

export function createCategory(payload) {
  const db = getDB();
  const categories = db.categories || [];
  const maxId = categories.reduce((max, c) => (c.id > max ? c.id : max), 2000);
  const newId = maxId + 1;
  const nowStr = new Date().toISOString();

  const newCat = {
    id: newId,
    parent_id: payload.parent_id ? Number(payload.parent_id) : null,
    name: payload.name.trim(),
    slug: payload.slug.trim(),
    description: payload.description ? payload.description.trim() : "",
    sort_order:
      payload.sort_order !== undefined ? Number(payload.sort_order) : 0,
    status: payload.status || "active",
    created_at: nowStr,
    updated_at: nowStr,
    deleted_at: null,
  };

  categories.push(newCat);
  db.categories = categories;
  saveDB(db);
  return newCat;
}

export function updateCategory(id, updates) {
  const db = getDB();
  const categories = db.categories || [];
  const parsedId = Number(id);
  const index = categories.findIndex((c) => c.id === parsedId);
  if (index !== -1) {
    const original = categories[index];
    const updated = {
      ...original,
      ...updates,
      parent_id:
        updates.parent_id !== undefined
          ? updates.parent_id
            ? Number(updates.parent_id)
            : null
          : original.parent_id,
      sort_order:
        updates.sort_order !== undefined
          ? Number(updates.sort_order)
          : original.sort_order,
      updated_at: new Date().toISOString(),
    };
    categories[index] = updated;
    db.categories = categories;
    saveDB(db);
    return updated;
  }
  return null;
}

export function deleteCategory(id) {
  const db = getDB();
  const categories = db.categories || [];
  const parsedId = Number(id);
  const index = categories.findIndex((c) => c.id === parsedId);
  if (index !== -1) {
    categories[index].deleted_at = new Date().toISOString();
    db.categories = categories;
    saveDB(db);
    return true;
  }
  return false;
}

export function restoreCategory(id) {
  const db = getDB();
  const categories = db.categories || [];
  const parsedId = Number(id);
  const index = categories.findIndex((c) => c.id === parsedId);
  if (index !== -1) {
    categories[index].deleted_at = null;
    categories[index].updated_at = new Date().toISOString();
    db.categories = categories;
    saveDB(db);
    return true;
  }
  return false;
}

// === COURSES ===
export function getCourses() {
  const db = getDB();
  return db.courses || [];
}

export function getCourseById(id) {
  const parsedId = Number(id);
  return getCourses().find((c) => c.id === parsedId) || null;
}

export function saveCourses(courses) {
  const db = getDB();
  db.courses = courses;
  saveDB(db);
}

export function updateCourse(id, updates) {
  const courses = getCourses();
  const parsedId = Number(id);
  const index = courses.findIndex((c) => c.id === parsedId);
  if (index !== -1) {
    courses[index] = {
      ...courses[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveCourses(courses);
    return courses[index];
  }
  return null;
}

// Helper to populate a course object with instructor and categories
export function populateCourse(course) {
  if (!course) return null;
  const instructorUser = getUserById(course.instructor_id);
  const categoriesList = getCategories();
  const matchedCategories = (course.category_ids || [])
    .map((catId) => categoriesList.find((cat) => cat.id === catId))
    .filter(Boolean);

  return {
    ...course,
    instructor: instructorUser
      ? {
          id: instructorUser.id,
          full_name: instructorUser.full_name,
          email: instructorUser.email,
          status: instructorUser.status,
        }
      : null,
    categories: matchedCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
  };
}

// === COURSE REVIEWS ===
export function getCourseReviews() {
  const db = getDB();
  return db.courseReviews || [];
}

export function getCourseReviewByCourseId(courseId) {
  const parsedId = Number(courseId);
  return getCourseReviews().find((r) => r.course_id === parsedId) || null;
}

export function saveCourseReviews(reviews) {
  const db = getDB();
  db.courseReviews = reviews;
  saveDB(db);
}

export function getPopulatedCourseReview(courseId) {
  const parsedId = Number(courseId);
  const review = getCourseReviewByCourseId(parsedId);
  if (!review) return null;

  const rawCourse = getCourseById(parsedId);
  if (!rawCourse) return null;

  const course = populateCourse(rawCourse);

  return {
    course,
    sections: review.sections || [],
    lessons: review.lessons || [],
    checklist: review.checklist || { passed: true, summary: "Đạt checklist" },
  };
}

// === INSTRUCTOR UPGRADES ===
export function getInstructorUpgrades() {
  const db = getDB();
  return db.instructorUpgrades || [];
}

export function saveInstructorUpgrades(upgrades) {
  const db = getDB();
  db.instructorUpgrades = upgrades;
  saveDB(db);
}

// === COUPONS ===
export function getCoupons() {
  const db = getDB();
  return db.coupons || [];
}

export function getCouponById(id) {
  if (!id) return null;
  const parsedId = Number(id);
  return getCoupons().find((c) => c.id === parsedId) || null;
}

// === ORDERS ===
export function getOrders() {
  const db = getDB();
  return db.orders || [];
}

export function getOrderById(id) {
  const parsedId = Number(id);
  return getOrders().find((o) => o.id === parsedId) || null;
}

export function saveOrders(orders) {
  const db = getDB();
  db.orders = orders;
  saveDB(db);
}

// === ENROLLMENTS ===
export function getEnrollments() {
  const db = getDB();
  return db.enrollments || [];
}

export function getEnrollmentByOrderId(orderId) {
  const parsedId = Number(orderId);
  return getEnrollments().find((e) => e.order_id === parsedId) || null;
}

export function saveEnrollments(enrollments) {
  const db = getDB();
  db.enrollments = enrollments;
  saveDB(db);
}

export function isValidOrderPaymentPair(orderStatus, paymentStatus) {
  const allowedPairs = {
    pending: ["unpaid", "processing"],
    paid: ["paid"],
    failed: ["failed"],
    cancelled: ["unpaid", "failed"],
    expired: ["unpaid"],
  };
  return Boolean(allowedPairs[orderStatus]?.includes(paymentStatus));
}

// Helper to populate an order object with user, course, coupon, enrollment, revenue, consistency, timeline
export function populateOrder(order) {
  if (!order) return null;
  const user = getUserById(order.user_id);
  const rawCourse = getCourseById(order.course_id);
  const course = populateCourse(rawCourse);
  const coupon = getCouponById(order.coupon_id);
  const enrollment = getEnrollmentByOrderId(order.id);
  const revenue = getRevenueByOrderId(order.id);

  const isCanonicalPaid =
    order.status === "paid" && order.payment_status === "paid";
  const isValidPair = isValidOrderPaymentPair(
    order.status,
    order.payment_status,
  );
  const paidHasEnrollment = isCanonicalPaid ? !!enrollment : true;
  const paidHasRevenue = isCanonicalPaid ? !!revenue : true;
  const amountsMatch =
    isCanonicalPaid && revenue
      ? Number(revenue.gross_amount) === Number(order.amount)
      : true;

  const timeline = [
    {
      timestamp: order.created_at,
      title: "Đơn hàng được tạo",
      description: `Đơn hàng ${order.order_code} khởi tạo bởi ${user ? user.full_name : "Người dùng"}.`,
      status: "info",
    },
  ];

  if (order.status === "pending" || order.payment_status === "processing") {
    timeline.push({
      timestamp: order.created_at,
      title: "Chờ thanh toán",
      description:
        "Chuyển hướng đến cổng thanh toán, đang chờ xác nhận từ phía nhà cung cấp.",
      status: "warning",
    });
  } else if (isCanonicalPaid) {
    timeline.push({
      timestamp: order.paid_at || order.created_at,
      title: "Thanh toán thành công",
      description: `Xác nhận thanh toán thành công qua ${order.payment_method === "vnpay" ? "VNPay" : order.payment_method === "momo" ? "MoMo" : order.payment_method === "bank_transfer" ? "Chuyển khoản" : "Hệ thống"}.${order.provider_transaction_id ? " Mã GD: " + order.provider_transaction_id : ""}`,
      status: "success",
    });
    if (enrollment) {
      timeline.push({
        timestamp: enrollment.created_at || order.paid_at || order.created_at,
        title: "Ghi danh khóa học",
        description: `Tạo ghi danh khóa học thành công cho ${user ? user.full_name : "Học viên"}. Tiến độ: ${enrollment.progress_percent}%.`,
        status: "success",
      });
    }
    if (revenue) {
      timeline.push({
        timestamp: revenue.earned_at || order.paid_at || order.created_at,
        title: "Doanh thu được ghi nhận",
        description: `Ghi nhận ${Number(revenue.gross_amount).toLocaleString("vi-VN")}đ (Giảng viên: ${Number(revenue.instructor_amount).toLocaleString("vi-VN")}đ, Nền tảng: ${Number(revenue.platform_fee_amount).toLocaleString("vi-VN")}đ).`,
        status: "success",
      });
    }
  } else if (order.status === "failed" || order.payment_status === "failed") {
    timeline.push({
      timestamp: order.updated_at || order.created_at,
      title: "Thanh toán thất bại",
      description: "Giao dịch không thành công hoặc bị nhà cung cấp hủy bỏ.",
      status: "error",
    });
  } else if (
    order.status === "cancelled" ||
    order.payment_status === "cancelled"
  ) {
    timeline.push({
      timestamp: order.updated_at || order.created_at,
      title: "Đơn hàng đã hủy",
      description: "Đơn hàng đã bị hủy bởi học viên hoặc quản trị viên.",
      status: "error",
    });
  } else if (order.status === "expired" || order.payment_status === "expired") {
    timeline.push({
      timestamp: order.updated_at || order.created_at,
      title: "Đơn hàng hết hạn",
      description: "Hết thời hạn thanh toán (quá 24 giờ).",
      status: "error",
    });
  }

  return {
    ...order,
    price_snapshot:
      order.price_snapshot !== undefined
        ? String(order.price_snapshot)
        : String(order.amount),
    discount_amount:
      order.discount_amount !== undefined ? String(order.discount_amount) : "0",
    amount: String(order.amount),
    user: user
      ? {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      : null,
    course: course
      ? {
          id: course.id,
          title: course.title,
          slug: course.slug,
          status: course.status,
          price: course.price,
          sale_price: course.sale_price,
        }
      : null,
    coupon: coupon
      ? {
          id: coupon.id,
          code: coupon.code,
          name: coupon.name,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          status: coupon.status,
        }
      : null,
    enrollment: enrollment
      ? {
          id: enrollment.id,
          status: enrollment.status,
          progress_percent: enrollment.progress_percent,
          enrolled_at: enrollment.created_at,
          completed_at: enrollment.completed_at,
        }
      : null,
    revenue: revenue
      ? {
          id: revenue.id,
          gross_amount: String(revenue.gross_amount),
          instructor_amount: String(revenue.instructor_amount),
          platform_fee_amount: String(revenue.platform_fee_amount),
          status: revenue.status,
          earned_at: revenue.earned_at,
        }
      : null,
    consistency: {
      paid_has_enrollment: paidHasEnrollment,
      paid_has_revenue: paidHasRevenue,
      amounts_match: amountsMatch,
    },
    timeline,
  };
}

// === PAYOUT ACCOUNTS ===
function populatePayoutAccount(payoutAccount, db) {
  if (!payoutAccount) return null;
  const parsedId = Number(payoutAccount.id);
  const userId = Number(payoutAccount.user_id);

  const user = (db.users || []).find((u) => Number(u.id) === userId) || null;

  const relatedWithdrawals = (db.withdrawals || []).filter(
    (w) => Number(w.payout_account_id) === parsedId
  );

  const total_paid_amount = relatedWithdrawals
    .filter((w) => w.status === "paid")
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  const sortedWithdrawals = [...relatedWithdrawals].sort(
    (a, b) => new Date(b.requested_at || 0) - new Date(a.requested_at || 0)
  );

  const latest_withdrawal_at =
    sortedWithdrawals.length > 0
      ? sortedWithdrawals[0].requested_at || sortedWithdrawals[0].created_at || null
      : null;

  const timeline = [
    {
      timestamp: payoutAccount.created_at || payoutAccount.connected_at || "2026-07-01T10:00:00+07:00",
      title: "Tạo tài khoản nhận tiền",
      description: `Tạo tài khoản ${payoutAccount.provider} (${payoutAccount.account_number_masked})`,
      status: "info",
    },
  ];

  if (payoutAccount.status === "pending_verification") {
    timeline.push({
      timestamp: payoutAccount.updated_at || payoutAccount.created_at,
      title: "Gửi yêu cầu xác minh",
      description: "Đang chờ quản trị viên duyệt thông tin tài khoản",
      status: "warning",
    });
  } else if (payoutAccount.status === "active") {
    timeline.push({
      timestamp: payoutAccount.connected_at || payoutAccount.updated_at,
      title: "Đã xác minh & Kích hoạt",
      description: "Tài khoản nhận tiền đủ điều kiện nhận thanh toán",
      status: "success",
    });
  } else if (payoutAccount.status === "rejected") {
    timeline.push({
      timestamp: payoutAccount.updated_at,
      title: "Yêu cầu bị từ chối",
      description: "Thông tin tài khoản chưa đạt tiêu chuẩn xác minh",
      status: "error",
    });
  } else if (payoutAccount.status === "inactive") {
    if (payoutAccount.connected_at) {
      timeline.push({
        timestamp: payoutAccount.connected_at,
        title: "Đã xác minh thành công",
        description: "Tài khoản đã từng hoạt động",
        status: "success",
      });
    }
    timeline.push({
      timestamp: payoutAccount.updated_at,
      title: "Đã vô hiệu hóa",
      description: "Tài khoản tạm ngưng sử dụng cho các giao dịch mới",
      status: "error",
    });
  }

  return {
    ...payoutAccount,
    id: parsedId,
    user_id: userId,
    user: user
      ? {
          id: Number(user.id),
          full_name: user.full_name,
          email: user.email,
          avatar_url: user.avatar_url || null,
          status: user.status,
        }
      : null,
    withdrawal_count: relatedWithdrawals.length,
    total_paid_amount: Number(total_paid_amount.toFixed(2)),
    latest_withdrawal_at,
    related_withdrawals: sortedWithdrawals.map((w) => ({
      id: Number(w.id),
      withdrawal_code: w.withdrawal_code || `WD-${w.id}`,
      amount: Number(w.amount),
      status: w.status,
      requested_at: w.requested_at || w.created_at || null,
    })),
    timeline,
  };
}

export function getPayoutAccounts() {
  const db = getDB();
  if (!Array.isArray(db.payoutAccounts)) {
    db.payoutAccounts = JSON.parse(JSON.stringify(MOCK_DB.payoutAccounts || []));
    saveDB(db);
  }
  return (db.payoutAccounts || []).map((pa) => populatePayoutAccount(pa, db));
}

export function getPayoutAccountById(id) {
  const parsedId = Number(id);
  return getPayoutAccounts().find((pa) => Number(pa.id) === parsedId) || null;
}

export function savePayoutAccounts(accounts) {
  const db = getDB();
  db.payoutAccounts = (accounts || []).map((pa) => ({
    id: Number(pa.id),
    user_id: Number(pa.user_id),
    provider: pa.provider,
    account_name: pa.account_name,
    account_number: pa.account_number,
    account_number_masked: pa.account_number_masked,
    status: pa.status,
    connected_at: pa.connected_at || null,
    created_at: pa.created_at || new Date().toISOString(),
    updated_at: pa.updated_at || new Date().toISOString(),
  }));
  saveDB(db);
}

export function updatePayoutAccountStatus(id, newStatus) {
  const db = getDB();
  const rawAccounts = db.payoutAccounts || [];
  const parsedId = Number(id);
  const index = rawAccounts.findIndex((pa) => Number(pa.id) === parsedId);

  if (index === -1) {
    return {
      success: false,
      message: "Không tìm thấy tài khoản nhận tiền trong hệ thống.",
    };
  }

  const current = rawAccounts[index];

  // State transition validation:
  // pending_verification -> active
  // pending_verification -> rejected
  // active -> inactive
  let isValid = false;
  if (
    current.status === "pending_verification" &&
    (newStatus === "active" || newStatus === "rejected")
  ) {
    isValid = true;
  } else if (current.status === "active" && newStatus === "inactive") {
    isValid = true;
  }

  if (!isValid) {
    return {
      success: false,
      message: `Chuyển trạng thái không hợp lệ: Không thể đổi từ '${current.status}' sang '${newStatus}'.`,
    };
  }

  const now = new Date().toISOString();
  rawAccounts[index] = {
    ...current,
    status: newStatus,
    updated_at: now,
    connected_at: newStatus === "active" ? current.connected_at || now : current.connected_at,
  };

  db.payoutAccounts = rawAccounts;
  saveDB(db);

  return {
    success: true,
    message: "Cập nhật trạng thái thành công.",
    data: populatePayoutAccount(rawAccounts[index], db),
  };
}


// === WITHDRAWALS ===
function populateWithdrawal(withdrawal, db) {
  if (!withdrawal) return null;
  const user = (db.users || []).find((u) => Number(u.id) === Number(withdrawal.user_id)) || null;
  const payoutAccount = (db.payoutAccounts || []).find((pa) => Number(pa.id) === Number(withdrawal.payout_account_id)) || null;

  return {
    ...withdrawal,
    id: Number(withdrawal.id),
    user_id: Number(withdrawal.user_id),
    payout_account_id: Number(withdrawal.payout_account_id),
    amount: Number(withdrawal.amount).toFixed(2),
    withdrawal_code: withdrawal.withdrawal_code || `WD-${withdrawal.id}`,
    user: user
      ? {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          avatar_url: user.avatar_url || null,
          status: user.status,
        }
      : null,
    payout_account: payoutAccount
      ? {
          id: payoutAccount.id,
          provider: payoutAccount.provider,
          account_name: payoutAccount.account_name,
          account_number: payoutAccount.account_number,
          account_number_masked: payoutAccount.account_number_masked,
          status: payoutAccount.status,
          connected_at: payoutAccount.connected_at,
        }
      : null,
    payout_snapshot:
      withdrawal.payout_snapshot ||
      (payoutAccount
        ? {
            provider: payoutAccount.provider,
            account_name: payoutAccount.account_name,
            account_number: payoutAccount.account_number,
            account_number_masked: payoutAccount.account_number_masked,
            status: payoutAccount.status,
            connected_at: payoutAccount.connected_at,
          }
        : null),
  };
}

export function getWithdrawals() {
  const db = getDB();
  if (!Array.isArray(db.withdrawals)) {
    db.withdrawals = JSON.parse(JSON.stringify(MOCK_DB.withdrawals || []));
    saveDB(db);
  }
  return (db.withdrawals || []).map((w) => populateWithdrawal(w, db));
}

export function getWithdrawalById(id) {
  const parsedId = Number(id);
  return getWithdrawals().find((w) => Number(w.id) === parsedId) || null;
}

export function saveWithdrawals(withdrawals) {
  const db = getDB();
  db.withdrawals = (withdrawals || []).map((w) => ({
    id: Number(w.id),
    withdrawal_code: w.withdrawal_code,
    user_id: Number(w.user_id),
    payout_account_id: Number(w.payout_account_id),
    amount: Number(w.amount),
    status: w.status,
    requested_at: w.requested_at,
    approved_at: w.approved_at || null,
    rejected_at: w.rejected_at || null,
    paid_at: w.paid_at || null,
    rejected_reason: w.rejected_reason || null,
    provider_payout_id: w.provider_payout_id || null,
    payout_snapshot: w.payout_snapshot || null,
    balance_snapshot: w.balance_snapshot || null,
    allocations: w.allocations || [],
    timeline: w.timeline || [],
  }));
  saveDB(db);
}

export function updateWithdrawalStatus(id, updates) {
  const db = getDB();
  const rawWithdrawals = db.withdrawals || [];
  const parsedId = Number(id);
  const index = rawWithdrawals.findIndex((w) => Number(w.id) === parsedId);
  if (index !== -1) {
    rawWithdrawals[index] = {
      ...rawWithdrawals[index],
      ...updates,
    };
    db.withdrawals = rawWithdrawals;
    saveDB(db);
    return populateWithdrawal(rawWithdrawals[index], db);
  }
  return null;
}

// === BANNERS, FAQS, NOTIFICATIONS ===
export function getBanners() {
  const db = getDB();
  return db.banners || [];
}

export function getFaqs() {
  const db = getDB();
  return db.faqs || [];
}

export function getNotifications() {
  const db = getDB();
  return db.notifications || [];
}
// === REVENUES ===
/**
 * Chuẩn hóa một revenue và lấy quan hệ từ database mock dùng chung.
 */
function populateRevenue(revenue, db) {
  if (!revenue) return null;
  const orderId = Number(revenue.order_id ?? revenue.order?.id);
  const courseId = Number(revenue.course_id ?? revenue.course?.id);
  const instructorId = Number(
    revenue.instructor_id ?? revenue.instructor?.id
  );
  const order =
    (db.orders || []).find((item) => Number(item.id) === orderId) || null;
  const course =
    (db.courses || []).find((item) => Number(item.id) === courseId) || null;
  const instructor =
    (db.users || []).find(
      (item) => Number(item.id) === instructorId
    ) || null;
  const grossAmount = Number(revenue.gross_amount) || 0;
  const instructorAmount = Number(revenue.instructor_amount) || 0;
  const platformAmount = Number(revenue.platform_fee_amount) || 0;
  const calculatedInstructorRate =
    grossAmount > 0
      ? Number(((instructorAmount / grossAmount) * 100).toFixed(2))
      : 0;
  const calculatedPlatformRate =
    grossAmount > 0
      ? Number(((platformAmount / grossAmount) * 100).toFixed(2))
      : 0;
  const calculatedConsistency =
    Math.abs(
      grossAmount - instructorAmount - platformAmount
    ) < 0.01;
  return {
    ...revenue,
    order_id: orderId || null,
    course_id: courseId || null,
    instructor_id: instructorId || null,
    gross_amount: grossAmount.toFixed(2),
    instructor_amount: instructorAmount.toFixed(2),
    platform_fee_amount: platformAmount.toFixed(2),
    instructor_rate:
      revenue.instructor_rate ?? calculatedInstructorRate,
    platform_rate:
      revenue.platform_rate ?? calculatedPlatformRate,
    amount_consistent:
      revenue.amount_consistent ?? calculatedConsistency,
    order: order
      ? {
          id: order.id,
          order_code: order.order_code,
          amount: Number(
            order.amount ?? order.price_snapshot ?? grossAmount
          ).toFixed(2),
          status: order.status,
          payment_status: order.payment_status,
          paid_at: order.paid_at,
          course_id: order.course_id,
        }
      : null,
    course: course
      ? {
          id: course.id,
          title: course.title,
          slug: course.slug,
          thumbnail_url: course.thumbnail_url || null,
          status: course.status,
        }
      : null,
    instructor: instructor
      ? {
          id: instructor.id,
          full_name: instructor.full_name,
          email: instructor.email,
          avatar_url: instructor.avatar_url || null,
          status: instructor.status,
        }
      : null,
  };
}
/**
 * Lấy toàn bộ revenue từ database mock dùng chung.
 */
export function getRevenues() {
  const db = getDB();
  if (!Array.isArray(db.revenues)) {
    db.revenues = JSON.parse(
      JSON.stringify(MOCK_DB.revenues || [])
    );
    saveDB(db);
  }
  return (db.revenues || []).map((revenue) =>
    populateRevenue(revenue, db)
  );
}
export function getRevenueById(id) {
  const parsedId = Number(id);
  return (
    getRevenues().find(
      (revenue) => Number(revenue.id) === parsedId
    ) || null
  );
}
export function getRevenueByOrderId(orderId) {
  const parsedId = Number(orderId);
  const normalizedCode = String(orderId)
    .trim()
    .toLowerCase();
  return (
    getRevenues().find((revenue) => {
      return (
        Number(revenue.order_id) === parsedId ||
        String(revenue.order?.order_code || "")
          .toLowerCase() === normalizedCode
      );
    }) || null
  );
}
export function saveRevenues(revenues) {
  const db = getDB();
  db.revenues = (revenues || []).map((item) => ({
    id: Number(item.id),
    order_id: Number(item.order_id ?? item.order?.id) || null,
    course_id: Number(item.course_id ?? item.course?.id) || null,
    instructor_id:
      Number(item.instructor_id ?? item.instructor?.id) || null,
    gross_amount: Number(item.gross_amount) || 0,
    instructor_amount: Number(item.instructor_amount) || 0,
    platform_fee_amount:
      Number(item.platform_fee_amount) || 0,
    status: item.status,
    earned_at: item.earned_at,
  }));
  saveDB(db);
}

// === MODERATION (COMMENTS & REVIEWS) ===
export function getComments() {
  const db = getDB();
  return db.comments || [];
}

export function getReviews() {
  const db = getDB();
  return db.reviews || [];
}

export function getLessons() {
  const db = getDB();
  return db.lessons || [];
}

export function getLessonById(id) {
  const parsedId = Number(id);
  return getLessons().find((l) => Number(l.id) === parsedId) || null;
}

export function getNormalizedModerationItems() {
  const db = getDB();
  const users = db.users || [];
  const courses = db.courses || [];
  const lessons = db.lessons || [];
  const orders = db.orders || [];
  const rawComments = db.comments || [];
  const rawReviews = db.reviews || [];

  const commentsList = rawComments.map((c) => {
    const user = users.find((u) => Number(u.id) === Number(c.user_id)) || null;
    const course = courses.find((cr) => Number(cr.id) === Number(c.course_id)) || null;
    const lesson = c.lesson_id ? (lessons.find((l) => Number(l.id) === Number(c.lesson_id)) || null) : null;
    const parent = c.parent_id ? (rawComments.find((p) => Number(p.id) === Number(c.parent_id)) || null) : null;

    return {
      id: Number(c.id),
      target_type: "comment",
      status: c.status || "visible",
      content: c.content || "",
      rating: null,
      user_id: Number(c.user_id),
      course_id: Number(c.course_id),
      lesson_id: c.lesson_id ? Number(c.lesson_id) : null,
      order_id: null,
      parent_id: c.parent_id ? Number(c.parent_id) : null,
      created_at: c.created_at,
      updated_at: c.updated_at || c.created_at,
      deleted_at: c.deleted_at || null,
      user: user
        ? {
            id: Number(user.id),
            full_name: user.full_name,
            email: user.email,
            avatar_url: user.avatar_url || null,
            status: user.status,
          }
        : null,
      course: course
        ? {
            id: Number(course.id),
            title: course.title,
            slug: course.slug,
          }
        : null,
      lesson: lesson
        ? {
            id: Number(lesson.id),
            title: lesson.title,
          }
        : null,
      order: null,
      parent: parent
        ? {
            id: Number(parent.id),
            content: parent.content,
            user_id: Number(parent.user_id),
          }
        : null,
    };
  });

  const reviewsList = rawReviews.map((r) => {
    const user = users.find((u) => Number(u.id) === Number(r.user_id)) || null;
    const course = courses.find((cr) => Number(cr.id) === Number(r.course_id)) || null;
    const order = r.order_id ? (orders.find((o) => Number(o.id) === Number(r.order_id)) || null) : null;

    return {
      id: Number(r.id),
      target_type: "review",
      status: r.status || "visible",
      content: r.content || "",
      rating: Number(r.rating) || 5,
      user_id: Number(r.user_id),
      course_id: Number(r.course_id),
      lesson_id: null,
      order_id: r.order_id ? Number(r.order_id) : null,
      parent_id: null,
      created_at: r.created_at,
      updated_at: r.updated_at || r.created_at,
      deleted_at: r.deleted_at || null,
      user: user
        ? {
            id: Number(user.id),
            full_name: user.full_name,
            email: user.email,
            avatar_url: user.avatar_url || null,
            status: user.status,
          }
        : null,
      course: course
        ? {
            id: Number(course.id),
            title: course.title,
            slug: course.slug,
          }
        : null,
      lesson: null,
      order: order
        ? {
            id: Number(order.id),
            order_code: order.order_code,
            amount: String(order.amount),
            status: order.status,
            payment_status: order.payment_status,
            paid_at: order.paid_at || order.created_at,
          }
        : null,
      parent: null,
    };
  });

  return [...commentsList, ...reviewsList];
}

export function updateModerationItemStatus(targetType, id, newStatus) {
  const db = getDB();
  const parsedId = Number(id);
  const now = new Date().toISOString();

  if (targetType === "review" && newStatus === "hidden") {
    return {
      success: false,
      message: "Đánh giá (review) không hỗ trợ trạng thái 'bị ẩn' (chỉ hỗ trợ Đang hiển thị hoặc Đã xóa).",
      errors: { status: "Review không hỗ trợ trạng thái hidden." }
    };
  }

  if (targetType === "comment") {
    const comments = db.comments || [];
    const index = comments.findIndex((c) => Number(c.id) === parsedId);
    if (index === -1) {
      return { success: false, message: "Không tìm thấy bình luận cần xử lý." };
    }
    const current = comments[index];
    let isValid = false;
    if (current.status === "visible" && (newStatus === "hidden" || newStatus === "deleted")) isValid = true;
    else if (current.status === "hidden" && (newStatus === "visible" || newStatus === "deleted")) isValid = true;
    else if (current.status === "deleted" && newStatus === "visible") isValid = true;

    if (!isValid && current.status !== newStatus) {
      return {
        success: false,
        message: `Chuyển trạng thái bình luận không hợp lệ từ '${current.status}' sang '${newStatus}'.`,
      };
    }

    comments[index] = {
      ...current,
      status: newStatus,
      updated_at: now,
      deleted_at: newStatus === "deleted" ? now : (newStatus === "visible" ? null : current.deleted_at),
    };
    db.comments = comments;
    saveDB(db);
    return {
      success: true,
      message: "Cập nhật trạng thái bình luận thành công.",
      data: comments[index],
    };
  } else if (targetType === "review") {
    const reviews = db.reviews || [];
    const index = reviews.findIndex((r) => Number(r.id) === parsedId);
    if (index === -1) {
      return { success: false, message: "Không tìm thấy đánh giá cần xử lý." };
    }
    const current = reviews[index];
    let isValid = false;
    if (current.status === "visible" && newStatus === "deleted") isValid = true;
    else if (current.status === "deleted" && newStatus === "visible") isValid = true;

    if (!isValid && current.status !== newStatus) {
      return {
        success: false,
        message: `Chuyển trạng thái đánh giá không hợp lệ từ '${current.status}' sang '${newStatus}'.`,
      };
    }

    reviews[index] = {
      ...current,
      status: newStatus,
      updated_at: now,
      deleted_at: newStatus === "deleted" ? now : null,
    };
    db.reviews = reviews;
    saveDB(db);
    return {
      success: true,
      message: "Cập nhật trạng thái đánh giá thành công.",
      data: reviews[index],
    };
  }

  return { success: false, message: "Loại nội dung không hợp lệ." };
}