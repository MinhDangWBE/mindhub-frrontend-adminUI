import {
  getNormalizedModerationItems,
  updateModerationItemStatus
} from "../mocks/mock-repository.js";

const USE_MOCK = true;

/**
 * Normalizes text for case-insensitive Vietnamese search
 */
function normalizeSearchText(val) {
  return String(val ?? "").trim().toLocaleLowerCase("vi-VN");
}

/**
 * Filter items by date range / preset
 */
function filterByDate(items, timePreset, dateFrom, dateTo) {
  if (!timePreset || timePreset === "all") {
    if (!dateFrom && !dateTo) return items;
  }

  const now = new Date();
  let fromDate = null;
  let toDate = null;

  if (timePreset === "today") {
    fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  } else if (timePreset === "7days") {
    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timePreset === "1month") {
    fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (timePreset === "3months") {
    fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }

  if (dateFrom) {
    const parsedFrom = new Date(dateFrom);
    if (!isNaN(parsedFrom.getTime())) fromDate = parsedFrom;
  }
  if (dateTo) {
    const parsedTo = new Date(dateTo);
    if (!isNaN(parsedTo.getTime())) {
      // Set to end of day if only date is provided
      if (dateTo.length <= 10) {
        parsedTo.setHours(23, 59, 59, 999);
      }
      toDate = parsedTo;
    }
  }

  return items.filter((item) => {
    const itemDate = new Date(item.created_at);
    if (isNaN(itemDate.getTime())) return true;

    if (fromDate && itemDate < fromDate) return false;
    if (toDate && itemDate > toDate) return false;
    return true;
  });
}

/**
 * GET /api/admin/moderation/items
 */
export async function getModerationItems(params = {}) {
  if (USE_MOCK) {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Number(params.per_page) || 20);
    const search = normalizeSearchText(params.search);
    const targetType = params.target_type || "all";
    const status = params.status || "all";
    const userId = params.user_id ? Number(params.user_id) : null;
    const courseId = params.course_id ? Number(params.course_id) : null;
    const timePreset = params.time_preset || "all";
    const dateFrom = params.date_from || "";
    const dateTo = params.date_to || "";
    const sortBy = params.sort_by || "created_at";
    const sortDirection = params.sort_direction || "desc";

    let dataset = getNormalizedModerationItems();

    // 1. Search Filter (content, user name, user email, course title, ID)
    if (search) {
      dataset = dataset.filter((item) => {
        const idMatch = String(item.id).includes(search);
        const contentMatch = normalizeSearchText(item.content).includes(search);
        const userNameMatch = item.user ? normalizeSearchText(item.user.full_name).includes(search) : false;
        const userEmailMatch = item.user ? normalizeSearchText(item.user.email).includes(search) : false;
        const courseTitleMatch = item.course ? normalizeSearchText(item.course.title).includes(search) : false;

        return idMatch || contentMatch || userNameMatch || userEmailMatch || courseTitleMatch;
      });
    }

    // 2. Filter by User ID & Course ID
    if (userId) {
      dataset = dataset.filter((item) => Number(item.user_id) === userId);
    }
    if (courseId) {
      dataset = dataset.filter((item) => Number(item.course_id) === courseId);
    }

    // 3. Filter by Date
    dataset = filterByDate(dataset, timePreset, dateFrom, dateTo);

    // 4. Calculate Summary Metrics (BEFORE target_type & status card filters)
    const summaryFilteredItems = [...dataset];
    const totalComments = summaryFilteredItems.filter((i) => i.target_type === "comment").length;
    const totalReviews = summaryFilteredItems.filter((i) => i.target_type === "review").length;

    const visibleComments = summaryFilteredItems.filter((i) => i.target_type === "comment" && i.status === "visible").length;
    const hiddenComments = summaryFilteredItems.filter((i) => i.target_type === "comment" && i.status === "hidden").length;
    const deletedComments = summaryFilteredItems.filter((i) => i.target_type === "comment" && i.status === "deleted").length;

    const visibleReviews = summaryFilteredItems.filter((i) => i.target_type === "review" && i.status === "visible");
    const deletedReviews = summaryFilteredItems.filter((i) => i.target_type === "review" && i.status === "deleted").length;

    const needActionCount = hiddenComments + deletedComments + deletedReviews;

    let averageRating = 0;
    if (visibleReviews.length > 0) {
      const sumRating = visibleReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
      averageRating = Number((sumRating / visibleReviews.length).toFixed(1));
    }

    const summary = {
      total_items: summaryFilteredItems.length,
      total_comments: totalComments,
      total_reviews: totalReviews,
      need_action_count: needActionCount,
      visible_comments: visibleComments,
      hidden_comments: hiddenComments,
      deleted_comments: deletedComments,
      visible_reviews: visibleReviews.length,
      deleted_reviews: deletedReviews,
      average_rating: averageRating,
    };

    // 5. Apply target_type Filter
    if (targetType !== "all") {
      dataset = dataset.filter((item) => item.target_type === targetType);
    }

    // 6. Apply status Filter
    if (status !== "all") {
      dataset = dataset.filter((item) => item.status === status);
    }

    // 7. Sort
    dataset.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "created_at" || sortBy === "updated_at") {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (sortDirection === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    // 8. Pagination
    const total = dataset.length;
    const lastPage = Math.ceil(total / perPage) || 1;
    const startIndex = (page - 1) * perPage;
    const paginatedItems = dataset.slice(startIndex, startIndex + perPage);

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
        total: total,
      },
    };
  }

  throw new Error("API backend chưa được kết nối.");
}

/**
 * GET /api/admin/moderation/items/{targetType}/{id}
 */
export async function getModerationItemDetail(targetType, id) {
  if (USE_MOCK) {
    const items = getNormalizedModerationItems();
    const parsedId = Number(id);
    const found = items.find(
      (item) => item.target_type === targetType && Number(item.id) === parsedId
    );

    if (found) {
      return {
        success: true,
        message: "Lấy chi tiết thành công.",
        data: found,
      };
    }

    return {
      success: false,
      message: `Không tìm thấy ${targetType === "comment" ? "bình luận" : "đánh giá"} có ID ${id}.`,
      errors: {},
    };
  }

  throw new Error("API backend chưa được kết nối.");
}

/**
 * PATCH /api/admin/moderation/items/{id}
 */
export async function moderateItem(id, payload = {}) {
  if (USE_MOCK) {
    const { target_type, status } = payload;

    if (!target_type || !status) {
      return {
        success: false,
        message: "Thiếu thông tin loại nội dung hoặc trạng thái mới.",
        errors: { target_type: "bắt buộc", status: "bắt buộc" },
      };
    }

    // Validation: Review cannot have status 'hidden'
    if (target_type === "review" && status === "hidden") {
      return {
        success: false,
        message: "Đánh giá (review) không hỗ trợ trạng thái 'bị ẩn' (chỉ hỗ trợ Đang hiển thị hoặc Đã xóa).",
        errors: { status: "Trạng thái hidden không hợp lệ cho đánh giá." },
      };
    }

    const result = updateModerationItemStatus(target_type, id, status);
    return result;
  }

  throw new Error("API backend chưa được kết nối.");
}
