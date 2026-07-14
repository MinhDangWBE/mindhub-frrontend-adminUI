/**
 * API Layer cho Module ADM-05: Kiểm duyệt khóa học
 * Mặc định sử dụng Mock data do Backend duyệt khóa học hiện còn logic credit cũ.
 * Tuân thủ 100% API Contract của MindHub Backend.
 */

import {
    getMockCourseReviews,
    getMockCourseReviewDetail,
    approveMockCourse,
    rejectMockCourse
} from "../mocks/course-reviews-mock.js";

// Đặt mặc định là true theo đúng cảnh báo nghiệp vụ
export const USE_MOCK = true;

/**
 * Lấy danh sách khóa học cần kiểm duyệt
 * @param {Object} params - { page, per_page, search, sort }
 */
export async function getCourseReviews(params = {}) {
    if (USE_MOCK) {
        // Giả lập delay mạng 250ms
        await new Promise(resolve => setTimeout(resolve, 250));
        return getMockCourseReviews(params);
    }

    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.per_page) query.append("per_page", params.per_page);
    if (params.search) query.append("search", params.search);
    if (params.sort) query.append("sort", params.sort);

    const response = await fetch(`/api/admin/course-reviews?${query.toString()}`, {
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
}

/**
 * Lấy chi tiết một khóa học (kèm sections, lessons và checklist)
 * @param {number|string} id 
 */
export async function getCourseReview(id) {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return getMockCourseReviewDetail(id);
    }

    const response = await fetch(`/api/admin/course-reviews/${id}`, {
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
}

/**
 * Duyệt chấp thuận khóa học
 * Endpoint: PATCH /api/admin/courses/{id}/approve
 * @param {number|string} id 
 */
export async function approveCourse(id) {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const res = approveMockCourse(id);
        if (res.status !== 200) {
            throw res;
        }
        return res.data;
    }

    const response = await fetch(`/api/admin/courses/${id}/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
}

/**
 * Từ chối duyệt khóa học
 * Endpoint: PATCH /api/admin/courses/{id}/reject
 * Body: { "admin_reject_reason": "..." }
 * @param {number|string} id 
 * @param {Object} payload - { admin_reject_reason }
 */
export async function rejectCourse(id, payload = {}) {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const res = rejectMockCourse(id, payload);
        if (res.status !== 200) {
            throw res;
        }
        return res.data;
    }

    const response = await fetch(`/api/admin/courses/${id}/reject`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({
            admin_reject_reason: payload.admin_reject_reason
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
}
