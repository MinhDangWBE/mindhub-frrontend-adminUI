import {
  getRevenues as getRepoRevenues,
  getCourses as getRepoCourses,
  getOrders as getRepoOrders,
  getEnrollments as getRepoEnrollments,
  getUsers as getRepoUsers,
} from "../mocks/mock-repository.js";
import { USE_MOCK_DATA } from "../core/config.js";

const API_REVENUE_REPORT_URL = "/api/admin/reports/revenue";
const API_TOP_COURSES_REPORT_URL = "/api/admin/reports/top-courses";
const API_TOP_INSTRUCTORS_REPORT_URL = "/api/admin/reports/instructors";

function parseMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatDecimalSource(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

/**
 * Lọc danh sách Doanh thu theo bộ lọc thời gian, khóa học và giảng viên
 */
function filterRevenuesData(revenues, params = {}) {
  let filtered = revenues.filter(
    (r) => r.status === "available" || r.status === "withdrawn"
  );

  if (params.course_id && params.course_id !== "all" && params.course_id !== "") {
    const courseId = Number(params.course_id);
    filtered = filtered.filter((r) => Number(r.course_id || r.course?.id) === courseId);
  }

  if (params.instructor_id && params.instructor_id !== "all" && params.instructor_id !== "") {
    const instructorId = Number(params.instructor_id);
    filtered = filtered.filter(
      (r) => Number(r.instructor_id || r.instructor?.id) === instructorId
    );
  }

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

  if (params.year && (!params.date_from && !params.date_to)) {
    const yr = Number(params.year);
    if (params.month) {
      const mn = Number(params.month) - 1;
      filtered = filtered.filter((r) => {
        const d = new Date(r.earned_at);
        return d.getFullYear() === yr && d.getMonth() === mn;
      });
    } else {
      filtered = filtered.filter((r) => new Date(r.earned_at).getFullYear() === yr);
    }
  }

  return filtered;
}

/**
 * API: Báo cáo doanh thu (Revenue Report)
 * GET /api/admin/reports/revenue
 */
export async function getRevenueReport(params = {}) {
  if (!USE_MOCK_DATA) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_REVENUE_REPORT_URL}?${query}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  const allRevenues = getRepoRevenues();
  const filtered = filterRevenuesData(allRevenues, params);

  let totalGross = 0;
  let totalInstructor = 0;
  let totalPlatform = 0;
  const courseSet = new Set();
  const instructorSet = new Set();

  filtered.forEach((r) => {
    totalGross += parseMoney(r.gross_amount);
    totalInstructor += parseMoney(r.instructor_amount);
    totalPlatform += parseMoney(r.platform_fee_amount);
    if (r.course_id || r.course?.id) courseSet.add(Number(r.course_id || r.course?.id));
    if (r.instructor_id || r.instructor?.id)
      instructorSet.add(Number(r.instructor_id || r.instructor?.id));
  });

  const summary = {
    total_gross_amount: formatDecimalSource(totalGross),
    total_instructor_amount: formatDecimalSource(totalInstructor),
    total_platform_fee_amount: formatDecimalSource(totalPlatform),
    order_count: filtered.length,
    course_count: courseSet.size,
    instructor_count: instructorSet.size,
  };

  // Xác định khoảng ngày/tháng để gom nhóm timeline
  let dateFrom = params.date_from ? new Date(params.date_from) : null;
  let dateTo = params.date_to ? new Date(params.date_to) : null;

  if (!dateFrom || !dateTo) {
    if (params.year) {
      const yr = Number(params.year);
      if (params.month) {
        const mn = Number(params.month) - 1;
        dateFrom = new Date(yr, mn, 1);
        dateTo = new Date(yr, mn + 1, 0, 23, 59, 59);
      } else {
        dateFrom = new Date(yr, 0, 1);
        dateTo = new Date(yr, 11, 31, 23, 59, 59);
      }
    } else {
      // Default: 30 ngày gần đây
      dateTo = new Date("2026-07-21T23:59:59Z");
      dateFrom = new Date("2026-06-22T00:00:00Z");
    }
  }

  dateFrom.setHours(0, 0, 0, 0);
  dateTo.setHours(23, 59, 59, 999);

  const diffDays = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24));
  let groupBy = params.group_by;
  if (!groupBy) {
    groupBy = diffDays > 45 ? "month" : "day";
  }

  const periodMap = {};

  if (groupBy === "month") {
    let current = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
    const end = new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);
    while (current <= end) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
      periodMap[key] = {
        period: key,
        gross_amount: 0,
        instructor_amount: 0,
        platform_fee_amount: 0,
        order_count: 0,
        courses: new Set(),
        instructors: new Set(),
      };
      current.setMonth(current.getMonth() + 1);
    }
  } else {
    let current = new Date(dateFrom.getTime());
    while (current <= dateTo) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(
        current.getDate()
      ).padStart(2, "0")}`;
      periodMap[key] = {
        period: key,
        gross_amount: 0,
        instructor_amount: 0,
        platform_fee_amount: 0,
        order_count: 0,
        courses: new Set(),
        instructors: new Set(),
      };
      current.setDate(current.getDate() + 1);
    }
  }

  filtered.forEach((r) => {
    const d = new Date(r.earned_at);
    let key;
    if (groupBy === "month") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    }

    if (!periodMap[key]) {
      periodMap[key] = {
        period: key,
        gross_amount: 0,
        instructor_amount: 0,
        platform_fee_amount: 0,
        order_count: 0,
        courses: new Set(),
        instructors: new Set(),
      };
    }

    periodMap[key].gross_amount += parseMoney(r.gross_amount);
    periodMap[key].instructor_amount += parseMoney(r.instructor_amount);
    periodMap[key].platform_fee_amount += parseMoney(r.platform_fee_amount);
    periodMap[key].order_count += 1;
    if (r.course_id || r.course?.id) periodMap[key].courses.add(Number(r.course_id || r.course?.id));
    if (r.instructor_id || r.instructor?.id)
      periodMap[key].instructors.add(Number(r.instructor_id || r.instructor?.id));
  });

  const periodItems = Object.values(periodMap).map((row) => ({
    period: row.period,
    gross_amount: formatDecimalSource(row.gross_amount),
    instructor_amount: formatDecimalSource(row.instructor_amount),
    platform_fee_amount: formatDecimalSource(row.platform_fee_amount),
    order_count: row.order_count,
    course_count: row.courses.size,
    instructor_count: row.instructors.size,
  }));

  // Sorting
  const sortBy = params.sort_by || "period";
  const sortDir = params.sort_direction || "asc";
  periodItems.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (["gross_amount", "instructor_amount", "platform_fee_amount"].includes(sortBy)) {
      valA = parseMoney(valA);
      valB = parseMoney(valB);
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Phân trang
  const total = periodItems.length;
  const perPage = Math.max(1, Number(params.per_page) || 20);
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  let page = Number(params.page) || 1;
  if (page > lastPage) page = 1;
  const startIndex = (page - 1) * perPage;
  const paginatedItems = periodItems.slice(startIndex, startIndex + perPage);

  return {
    success: true,
    message: "Lấy báo cáo doanh thu thành công.",
    data: {
      summary,
      items: paginatedItems,
      all_periods: periodItems, // dùng cho Chart đầy đủ trục thời gian
    },
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  };
}

/**
 * API: Khóa học nổi bật (Top Courses Report)
 * GET /api/admin/reports/top-courses
 */
export async function getTopCoursesReport(params = {}) {
  if (!USE_MOCK_DATA) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_TOP_COURSES_REPORT_URL}?${query}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  const courses = getRepoCourses();
  const orders = getRepoOrders();
  const enrollments = getRepoEnrollments();
  const revenues = getRepoRevenues();
  const users = getRepoUsers();

  // Filter orders & revenues by time parameters
  let filteredRevenues = revenues.filter(
    (r) => r.status === "available" || r.status === "withdrawn"
  );

  if (params.date_from) {
    const from = new Date(params.date_from);
    from.setHours(0, 0, 0, 0);
    filteredRevenues = filteredRevenues.filter((r) => new Date(r.earned_at) >= from);
  }
  if (params.date_to) {
    const to = new Date(params.date_to);
    to.setHours(23, 59, 59, 999);
    filteredRevenues = filteredRevenues.filter((r) => new Date(r.earned_at) <= to);
  }

  let courseItems = courses.map((c) => {
    const courseId = Number(c.id);
    const courseOrders = orders.filter(
      (o) =>
        Number(o.course_id) === courseId &&
        o.status === "paid" &&
        o.payment_status === "paid"
    );
    const courseEnrollments = enrollments.filter(
      (e) => Number(e.course_id || e.course?.id) === courseId
    );
    const completedCount = courseEnrollments.filter(
      (e) => e.status === "completed"
    ).length;
    const courseRevenues = filteredRevenues.filter(
      (r) => Number(r.course_id || r.course?.id) === courseId
    );

    const totalRev = courseRevenues.reduce(
      (sum, r) => sum + parseMoney(r.gross_amount),
      0
    );

    const lastPaidAt =
      courseRevenues.length > 0
        ? courseRevenues.sort(
            (a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
          )[0].earned_at
        : courseOrders.length > 0
        ? courseOrders.sort(
            (a, b) => new Date(b.paid_at || b.created_at).getTime() - new Date(a.paid_at || a.created_at).getTime()
          )[0].paid_at
        : null;

    const instructor = users.find((u) => Number(u.id) === Number(c.instructor_id));

    const soldCount = courseOrders.length;
    const enrollmentCount = courseEnrollments.length || soldCount;
    const completionRate =
      enrollmentCount > 0 ? Math.round((completedCount / enrollmentCount) * 100) : 0;

    return {
      course_id: courseId,
      title: c.title,
      slug: c.slug,
      status: c.status,
      price: formatDecimalSource(c.price),
      sale_price: c.sale_price !== null ? formatDecimalSource(c.sale_price) : null,
      instructor: instructor
        ? {
            id: instructor.id,
            full_name: instructor.full_name,
            email: instructor.email,
          }
        : null,
      sold_count: soldCount,
      enrollment_count: enrollmentCount,
      completed_count: completedCount,
      completion_rate: completionRate,
      total_revenue: formatDecimalSource(totalRev),
      last_paid_at: lastPaidAt,
    };
  });

  // Filter course_id if provided
  if (params.course_id && params.course_id !== "all" && params.course_id !== "") {
    const targetId = Number(params.course_id);
    courseItems = courseItems.filter((item) => item.course_id === targetId);
  }

  // Summary across all courses
  let grandTotalRevenue = 0;
  let grandTotalSold = 0;
  let grandTotalCompleted = 0;

  courseItems.forEach((item) => {
    grandTotalRevenue += parseMoney(item.total_revenue);
    grandTotalSold += item.sold_count;
    grandTotalCompleted += item.completed_count;
  });

  const summary = {
    total_courses: courseItems.length,
    total_sold: grandTotalSold,
    total_revenue: formatDecimalSource(grandTotalRevenue),
    total_completed: grandTotalCompleted,
  };

  // Sorting
  const sortBy = params.sort_by || "total_revenue";
  const sortDir = params.sort_direction || "desc";
  courseItems.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (["total_revenue", "price", "sale_price"].includes(sortBy)) {
      valA = parseMoney(valA);
      valB = parseMoney(valB);
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Phân trang
  const total = courseItems.length;
  const perPage = Math.max(1, Number(params.per_page) || 20);
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  let page = Number(params.page) || 1;
  if (page > lastPage) page = 1;
  const startIndex = (page - 1) * perPage;
  const paginatedItems = courseItems.slice(startIndex, startIndex + perPage);

  return {
    success: true,
    message: "Lấy danh sách khóa học nổi bật thành công.",
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

/**
 * API: Giảng viên nổi bật (Top Instructors Report)
 * GET /api/admin/reports/instructors
 */
export async function getTopInstructorsReport(params = {}) {
  if (!USE_MOCK_DATA) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_TOP_INSTRUCTORS_REPORT_URL}?${query}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  const users = getRepoUsers();
  const courses = getRepoCourses();
  const orders = getRepoOrders();
  const enrollments = getRepoEnrollments();
  const revenues = getRepoRevenues();

  const instructors = users.filter(
    (u) => u.role === "instructor" || courses.some((c) => Number(c.instructor_id) === Number(u.id))
  );

  let filteredRevenues = revenues.filter(
    (r) => r.status === "available" || r.status === "withdrawn"
  );

  if (params.date_from) {
    const from = new Date(params.date_from);
    from.setHours(0, 0, 0, 0);
    filteredRevenues = filteredRevenues.filter((r) => new Date(r.earned_at) >= from);
  }
  if (params.date_to) {
    const to = new Date(params.date_to);
    to.setHours(23, 59, 59, 999);
    filteredRevenues = filteredRevenues.filter((r) => new Date(r.earned_at) <= to);
  }

  let instructorItems = instructors.map((inst) => {
    const instId = Number(inst.id);
    const instCourses = courses.filter((c) => Number(c.instructor_id) === instId);
    const instCourseIds = new Set(instCourses.map((c) => Number(c.id)));

    const instOrders = orders.filter(
      (o) =>
        instCourseIds.has(Number(o.course_id)) &&
        o.status === "paid" &&
        o.payment_status === "paid"
    );

    const instEnrollments = enrollments.filter((e) =>
      instCourseIds.has(Number(e.course_id || e.course?.id))
    );

    const completedCount = instEnrollments.filter(
      (e) => e.status === "completed"
    ).length;

    const instRevenues = filteredRevenues.filter((r) =>
      instCourseIds.has(Number(r.course_id || r.course?.id)) ||
      Number(r.instructor_id || r.instructor?.id) === instId
    );

    let grossRev = 0;
    let instrAmt = 0;
    let platFee = 0;

    instRevenues.forEach((r) => {
      grossRev += parseMoney(r.gross_amount);
      instrAmt += parseMoney(r.instructor_amount);
      platFee += parseMoney(r.platform_fee_amount);
    });

    const lastActivityAt =
      instRevenues.length > 0
        ? instRevenues.sort(
            (a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
          )[0].earned_at
        : inst.updated_at || inst.created_at;

    const totalSold = instOrders.length;
    const totalEnrollments = instEnrollments.length || totalSold;
    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedCount / totalEnrollments) * 100)
        : 0;

    return {
      instructor_id: instId,
      full_name: inst.full_name,
      email: inst.email,
      role: inst.role,
      status: inst.status,
      avatar_url: inst.avatar_url || null,
      total_courses: instCourses.length,
      published_courses: instCourses.filter((c) => c.status === "published").length,
      total_sold: totalSold,
      total_enrollments: totalEnrollments,
      total_completed: completedCount,
      completion_rate: completionRate,
      total_revenue: formatDecimalSource(grossRev),
      instructor_amount: formatDecimalSource(instrAmt),
      platform_fee_amount: formatDecimalSource(platFee),
      last_activity_at: lastActivityAt,
    };
  });

  // Summary
  let grandTotalRevenue = 0;
  let grandTotalCourses = 0;
  let grandTotalSold = 0;

  instructorItems.forEach((item) => {
    grandTotalRevenue += parseMoney(item.total_revenue);
    grandTotalCourses += item.total_courses;
    grandTotalSold += item.total_sold;
  });

  const summary = {
    total_instructors: instructorItems.length,
    total_courses: grandTotalCourses,
    total_sold: grandTotalSold,
    total_revenue: formatDecimalSource(grandTotalRevenue),
  };

  // Sorting
  const sortBy = params.sort_by || "total_revenue";
  const sortDir = params.sort_direction || "desc";
  instructorItems.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (["total_revenue", "instructor_amount", "platform_fee_amount"].includes(sortBy)) {
      valA = parseMoney(valA);
      valB = parseMoney(valB);
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Phân trang
  const total = instructorItems.length;
  const perPage = Math.max(1, Number(params.per_page) || 20);
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  let page = Number(params.page) || 1;
  if (page > lastPage) page = 1;
  const startIndex = (page - 1) * perPage;
  const paginatedItems = instructorItems.slice(startIndex, startIndex + perPage);

  return {
    success: true,
    message: "Lấy danh sách giảng viên nổi bật thành công.",
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
