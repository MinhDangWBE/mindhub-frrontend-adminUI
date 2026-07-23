/**
 * API Layer cho Module: Quản lý FAQ
 * Đồng bộ với Unified Mock Database qua mock-repository.js.
 * Chuẩn bị đầy đủ Contract sẵn sàng kết nối Backend thật.
 */

import {
  getFaqs as getRepoFaqs,
  getFaqById as getRepoFaqById,
  createFaq as createRepoFaq,
  updateFaq as updateRepoFaq,
  deleteFaq as deleteRepoFaq,
  syncFaqCourses as syncRepoFaqCourses
} from "../mocks/mock-repository.js";

const USE_MOCK = true;
const API_BASE_URL = "/api/admin/faqs";

/**
 * Lấy danh sách FAQ (phân trang, lọc theo type, status, course_id, search, sort)
 * @param {Object} params - Query parameters
 */
export async function getFaqs(params = {}) {
  if (!USE_MOCK) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page);
    if (params.per_page) query.set("per_page", params.per_page);
    if (params.search) query.set("search", params.search);
    if (params.type && params.type !== "all") query.set("type", params.type);
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.course_id && params.course_id !== "all") query.set("course_id", params.course_id);
    if (params.sort_by) query.set("sort_by", params.sort_by);
    if (params.sort_direction) query.set("sort_direction", params.sort_direction);

    const response = await fetch(`${API_BASE_URL}?${query.toString()}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi máy chủ (${response.status})`);
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const result = getRepoFaqs(params);
    return {
      success: true,
      message: "Lấy dữ liệu thành công.",
      data: {
        summary: result.summary,
        items: result.items
      },
      meta: result.meta
    };
  } catch (error) {
    console.error("Lỗi getFaqs mock:", error);
    throw new Error("Không thể tải danh sách FAQ từ Mock Repository.");
  }
}

/**
 * Lấy chi tiết một FAQ theo ID
 * @param {number|string} id 
 */
export async function getFaqDetail(id) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || `Lỗi máy chủ (${response.status})`);
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise((resolve) => setTimeout(resolve, 200));

  const faq = getRepoFaqById(id);
  if (!faq) {
    const err = new Error("FAQ không tồn tại hoặc đã bị xóa.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Thao tác thành công.",
    data: faq
  };
}

/**
 * Tạo mới FAQ
 * @param {Object} payload 
 */
export async function createFaq(payload) {
  if (!USE_MOCK) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || `Lỗi tạo FAQ (${response.status})`);
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (!payload.question || !payload.question.trim()) {
    const err = new Error("Câu hỏi không được để trống.");
    err.status = 422;
    err.errors = { question: ["Câu hỏi không được để trống."] };
    throw err;
  }

  if (!payload.answer || !payload.answer.trim()) {
    const err = new Error("Câu trả lời không được để trống.");
    err.status = 422;
    err.errors = { answer: ["Câu trả lời không được để trống."] };
    throw err;
  }

  if (!payload.type) {
    const err = new Error("Loại FAQ không được để trống.");
    err.status = 422;
    err.errors = { type: ["Loại FAQ không được để trống."] };
    throw err;
  }

  const newFaq = createRepoFaq(payload);
  return {
    success: true,
    message: "Tạo FAQ mới thành công.",
    data: newFaq
  };
}

/**
 * Cập nhật thông tin FAQ (PATCH)
 * @param {number|string} id 
 * @param {Object} payload 
 */
export async function updateFaq(id, payload) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || `Lỗi cập nhật FAQ (${response.status})`);
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (payload.question !== undefined && !payload.question.trim()) {
    const err = new Error("Câu hỏi không được để trống.");
    err.status = 422;
    err.errors = { question: ["Câu hỏi không được để trống."] };
    throw err;
  }

  if (payload.answer !== undefined && !payload.answer.trim()) {
    const err = new Error("Câu trả lời không được để trống.");
    err.status = 422;
    err.errors = { answer: ["Câu trả lời không được để trống."] };
    throw err;
  }

  const updatedFaq = updateRepoFaq(id, payload);
  if (!updatedFaq) {
    const err = new Error("FAQ không tồn tại hoặc đã bị xóa.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Cập nhật FAQ thành công.",
    data: updatedFaq
  };
}

/**
 * Xóa mềm FAQ (DELETE /api/admin/faqs/{id})
 * @param {number|string} id 
 */
export async function deleteFaq(id) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || `Lỗi xóa FAQ (${response.status})`);
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise((resolve) => setTimeout(resolve, 300));

  const success = deleteRepoFaq(id);
  if (!success) {
    const err = new Error("FAQ không tồn tại hoặc đã bị xóa từ trước.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Xóa FAQ thành công."
  };
}

/**
 * Đồng bộ liên kết khóa học (PATCH /api/admin/faqs/{id}/courses)
 * @param {number|string} id 
 * @param {Array<number>} courseIds - Danh sách integer course IDs
 */
export async function syncFaqCourses(id, courseIds = []) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}/courses`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_ids: courseIds })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || `Lỗi đồng bộ khóa học (${response.status})`);
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise((resolve) => setTimeout(resolve, 350));

  const updatedFaq = syncRepoFaqCourses(id, courseIds);
  if (!updatedFaq) {
    const err = new Error("FAQ không tồn tại hoặc đã bị xóa.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Cập nhật liên kết khóa học thành công.",
    data: updatedFaq
  };
}
