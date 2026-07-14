# COURSE REVIEW MAPPING REPORT

- Thời điểm: 16:28:58 14/7/2026
- Course ID kiểm tra: `1010`

## 1. Khóa học trong courses-mock.js

- ID: `1010`
- Tiêu đề: `Xây dựng ứng dụng với Next.js`
- Slug: `xay-dung-ung-dung-voi-next-js`
- Status: `pending_review`
- Instructor ID: `3`
- Giảng viên: `Trần Thị Dạy`
- Vị trí dữ liệu: `exports.coursesMockData[9]`

## 2. Khóa học trong course-reviews-mock.js

- ID: `1010`
- Tiêu đề: `AWS Certified Solutions Architect Thực Chiến`
- Slug: `aws-certified-solutions-architect-thuc-chien`
- Status: `pending_review`
- Instructor ID: `10`
- Giảng viên: `Phạm Quốc Bảo`
- Vị trí dữ liệu: `exports.MOCK_COURSE_REVIEWS[0]`

## 3. Kết quả đối chiếu

- Cùng tiêu đề: **KHÔNG**
- Cùng slug: **KHÔNG**
- Cùng giảng viên: **KHÔNG**

> **KẾT LUẬN:** Hai file mock đang gắn cùng ID cho hai khóa học khác nhau. Đây là nguyên nhân khóa A chuyển thành khóa B.

## 4. Kiểm tra toàn bộ khóa pending_review

- ID `1003` — **SAI DỮ LIỆU** — Courses: `Thiết kế UI/UX cho sản phẩm số` / Reviews: `Chương 3: Cấu trúc Microservices & Redis Message Queue`
- ID `1010` — **SAI DỮ LIỆU** — Courses: `Xây dựng ứng dụng với Next.js` / Reviews: `AWS Certified Solutions Architect Thực Chiến`
- ID `1016` — **SAI DỮ LIỆU** — Courses: `Kiểm thử API với Postman` / Reviews: `Chương 1: Vue 3 Composition API Essentials`

## 5. Kiểm tra logic điều hướng trong courses.js

- Dòng 867: `(e) => goToCourseReview(c.id, e)`
- Dòng 927: `function goToCourseReview(courseId, event) {`
- Dòng 944: `const url = new URL("course-reviews.html", window.location.href);`
- Dòng 945: `url.searchParams.set("open_course_id", String(id));`
- Dòng 1908: `goToCourseReview(course.id, e);`
- Dòng 2307: `goToCourseReview(course.id, e);`

## 6. Kiểm tra logic mở drawer trong course-reviews.js

- Dòng 28: `let activeCourseIdForAction = null;`
- Dòng 29: `let activeCourseDetailData = null;`
- Dòng 45: `// Đọc open_course_id từ URL và tự động mở drawer`
- Dòng 47: `const rawOpenCourseId = params.get("open_course_id");`
- Dòng 50: `await openDrawer(openCourseId);`
- Dòng 818: `if (id) openDrawer(id);`
- Dòng 843: `openDrawer(id);`
- Dòng 1103: `if (activeCourseIdForAction) {`
- Dòng 1105: `openApproveModal(activeCourseIdForAction);`
- Dòng 1112: `if (activeCourseIdForAction) {`
- Dòng 1114: `openRejectModal(activeCourseIdForAction);`
- Dòng 1121: `let activeCourseReviewId = null;`
- Dòng 1123: `async function openDrawer(courseId) {`
- Dòng 1129: `if (activeCourseReviewId === id) return;`
- Dòng 1138: `activeCourseIdForAction = id;`
- Dòng 1154: `const res = await getCourseReview(id);`
- Dòng 1156: `activeCourseDetailData = res.data;`
- Dòng 1157: `activeCourseReviewId = id;`
- Dòng 1202: `// Xóa query open_course_id nhưng giữ các query UI/filter khác`
- Dòng 1204: `if (url.searchParams.has("open_course_id")) {`
- Dòng 1205: `url.searchParams.delete("open_course_id");`
- Dòng 1210: `activeCourseIdForAction = null;`
- Dòng 1211: `activeCourseDetailData = null;`
- Dòng 1213: `activeCourseReviewId = null;`
- Dòng 1608: `activeCourseIdForAction = courseId;`
- Dòng 1640: `activeCourseIdForAction = courseId;`
- Dòng 1671: `if (!activeCourseIdForAction || isSubmitting) return;`
- Dòng 1680: `const res = await approveCourse(activeCourseIdForAction);`
- Dòng 1721: `if (!activeCourseIdForAction || isSubmitting) return;`
- Dòng 1750: `const res = await rejectCourse(activeCourseIdForAction, {`

## 7. Kết luận nhanh

- Nếu cùng ID nhưng title/slug khác nhau: lỗi nằm ở dữ liệu mock.
- Nếu mock khớp nhưng drawer sai: lỗi nằm ở `getCourseReview(id)`, state drawer hoặc code đang dùng phần tử đầu tiên/index.
- Khi nối Backend, FE vẫn phải gửi và đọc đúng `course_id`; Backend không tự sửa được lỗi mở sai ID.