/**
 * API Layer cho Module ADM-13: Quản lý Banner / Trang chủ
 * Đồng bộ với Unified Mock Database qua mock-repository.js.
 * Chuẩn bị đầy đủ Contract sẵn sàng nối Backend thật.
 */

import {
  getBanners as getRepoBanners,
  getBannerById as getRepoBannerById,
  createBanner as createRepoBanner,
  updateBanner as updateRepoBanner,
  deleteBanner as deleteRepoBanner
} from "../mocks/mock-repository.js";

// Cấu hình nguồn dữ liệu: true để dùng mock (localStorage), false để gọi API thật
const USE_MOCK = true;
const API_BASE_URL = "/api/admin/banners";

/**
 * Lấy danh sách banner (phân trang, lọc theo position, status raw, search, view_mode local)
 * @param {Object} params - Query parameters (page, per_page, search, position, status, view_mode)
 */
export async function getBanners(params = {}) {
  if (!USE_MOCK) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page);
    if (params.per_page) query.set("per_page", params.per_page);
    if (params.search) query.set("search", params.search);
    if (params.position && params.position !== "all") query.set("position", params.position);
    if (params.status && params.status !== "all") query.set("status", params.status);

    const response = await fetch(`${API_BASE_URL}?${query.toString()}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi máy chủ (${response.status})`);
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const result = getRepoBanners(params);
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
    console.error("Lỗi getBanners mock:", error);
    throw new Error("Không thể tải danh sách banner từ Mock Repository.");
  }
}

/**
 * Lấy chi tiết một banner theo ID
 * @param {number|string} id 
 */
export async function getBannerDetail(id) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi máy chủ (${response.status})`);
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise(resolve => setTimeout(resolve, 200));

  const banner = getRepoBannerById(id);
  if (!banner) {
    const err = new Error("Banner không tồn tại hoặc đã bị xóa.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Lấy chi tiết banner thành công.",
    data: banner
  };
}

/**
 * Tạo mới banner
 * @param {Object} payload 
 */
export async function createBanner(payload) {
  if (!USE_MOCK) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || "Tạo banner thất bại.");
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise(resolve => setTimeout(resolve, 350));

  const created = createRepoBanner(payload);
  return {
    success: true,
    message: "Tạo banner mới thành công.",
    data: created
  };
}

/**
 * Cập nhật thông tin banner theo phương thức PATCH
 * @param {number|string} id 
 * @param {Object} patchPayload 
 */
export async function updateBanner(id, patchPayload) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchPayload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || "Cập nhật banner thất bại.");
      err.status = response.status;
      err.errors = errorData.errors || {};
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise(resolve => setTimeout(resolve, 300));

  const updated = updateRepoBanner(id, patchPayload);
  if (!updated) {
    const err = new Error("Banner không tồn tại hoặc đã bị xóa.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Cập nhật banner thành công.",
    data: updated
  };
}

/**
 * Xóa mềm banner (DELETE)
 * @param {number|string} id 
 */
export async function deleteBanner(id) {
  if (!USE_MOCK) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || "Xóa banner thất bại.");
      err.status = response.status;
      throw err;
    }
    return await response.json();
  }

  // --- MOCK DATA ---
  await new Promise(resolve => setTimeout(resolve, 300));

  const success = deleteRepoBanner(id);
  if (!success) {
    const err = new Error("Banner không tồn tại hoặc đã bị xóa trước đó.");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Xóa banner thành công.",
    data: { id: Number(id) }
  };
}
