/**
 * MindHub Admin Toast Notification System
 * ES Module dùng chung để hiển thị thông báo.
 */

let toastContainer = null;

/**
 * Tạo container chứa Toast nếu chưa tồn tại
 */
function createToastContainer() {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    // Responsive: top-4 right-4 trên desktop, full-width (chừa margin) trên mobile
    toastContainer.className = "fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[328px] pointer-events-none px-4 md:px-0";
    document.body.appendChild(toastContainer);
}

/**
 * Hiển thị một Toast thông báo
 * @param {Object} options 
 * @param {string} options.type - success | error | warning | info
 * @param {string} options.title - Tiêu đề Toast
 * @param {string} options.message - Nội dung thông báo
 * @param {number} options.duration - Thời gian tự đóng (ms), mặc định 3500ms
 */
export function showToast({ type = "info", title = "", message = "", duration = 3500 }) {
    if (!toastContainer) {
        createToastContainer();
    }

    // Giới hạn tối đa 3 Toast cùng lúc. Nếu vượt quá, xóa Toast cũ nhất
    const activeToasts = toastContainer.querySelectorAll(".toast-item");
    if (activeToasts.length >= 3) {
        const oldestToast = activeToasts[0];
        oldestToast.classList.add("translate-x-10", "opacity-0");
        setTimeout(() => oldestToast.remove(), 300);
    }

    const toast = document.createElement("div");
    // Class hover state và transition
    toast.className = "toast-item pointer-events-auto flex gap-3 p-3 bg-paper border border-hairline rounded-[6px] shadow-subtle transition-all duration-300 transform translate-x-10 opacity-0 select-none";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");

    // Khởi tạo các màu sắc và icon SVG dựa trên loại Toast
    let iconColorClass = "";
    let iconSvg = "";
    let borderClass = "";

    if (type === "success") {
        iconColorClass = "text-success bg-success-soft border border-success/10";
        borderClass = "border-success/20";
        iconSvg = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        `;
    } else if (type === "error") {
        iconColorClass = "text-danger-brick bg-danger-brick-soft border border-danger-brick/10";
        borderClass = "border-danger-brick/20";
        iconSvg = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        `;
    } else if (type === "warning") {
        iconColorClass = "text-warning bg-warning-soft border border-warning/10";
        borderClass = "border-warning/20";
        iconSvg = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
        `;
    } else { // info
        iconColorClass = "text-mid-gray bg-canvas border border-hairline/60";
        borderClass = "border-hairline";
        iconSvg = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        `;
    }

    toast.classList.add(borderClass);

    toast.innerHTML = `
        <div class="flex h-6 w-6 items-center justify-center rounded-full shrink-0 ${iconColorClass}">
            ${iconSvg}
        </div>
        <div class="flex-1 min-w-0">
            <h4 class="text-xs font-semibold text-ink leading-tight">${title}</h4>
            <p class="text-[10px] text-mid-gray mt-0.5 leading-snug">${message}</p>
        </div>
        <button type="button" class="close-toast text-mid-gray hover:text-ink shrink-0 self-start p-0.5 hover:bg-canvas rounded transition-colors" aria-label="Đóng thông báo">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Kích hoạt hiệu ứng trượt vào (Slide in)
    setTimeout(() => {
        toast.classList.remove("translate-x-10", "opacity-0");
        toast.classList.add("translate-x-0", "opacity-100");
    }, 10);

    let dismissTimeout = null;
    let startTime = null;
    let remainingTime = duration;

    // Bắt đầu đếm ngược thời gian tự đóng
    const startTimer = () => {
        startTime = Date.now();
        dismissTimeout = setTimeout(() => {
            closeToast();
        }, remainingTime);
    };

    // Tạm dừng đếm ngược (khi hover)
    const stopTimer = () => {
        clearTimeout(dismissTimeout);
        remainingTime -= Date.now() - startTime;
        if (remainingTime < 0) remainingTime = 0;
    };

    // Đóng Toast
    const closeToast = () => {
        toast.classList.remove("translate-x-0", "opacity-100");
        toast.classList.add("translate-x-10", "opacity-0");
        // Đợi hiệu ứng kết thúc rồi mới xóa khỏi DOM
        toast.addEventListener("transitionend", function handler() {
            toast.removeEventListener("transitionend", handler);
            toast.remove();
        });
    };

    // Gắn sự kiện tương tác
    const closeBtn = toast.querySelector(".close-toast");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeToast);
    }

    toast.addEventListener("mouseenter", stopTimer);
    toast.addEventListener("mouseleave", startTimer);

    startTimer();
}
