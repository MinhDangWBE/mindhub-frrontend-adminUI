import { initializeInteractions } from "./sidebar.js";

/**
 * Xác định tiền tố đường dẫn tương đối dựa trên độ sâu của trang hiện tại.
 */
function getRootPrefix() {
    const path = window.location.pathname;
    return path.includes("/pages/") ? "../" : "./";
}

/**
 * Cập nhật đường dẫn href của các thẻ liên kết để khớp với độ sâu của trang hiện tại.
 */
function adjustRelativeLinks(container, isRoot) {
    if (!isRoot) return; // Nếu đang ở trong thư mục pages/, đường dẫn mặc định trong component đã chuẩn xác.

    const links = container.querySelectorAll("a[href]");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript:")) {
            return;
        }

        if (href === "../index.html") {
            link.setAttribute("href", "./index.html");
        } else if (!href.startsWith("pages/")) {
            link.setAttribute("href", `./pages/${href}`);
        }
    });
}

/**
 * Đánh dấu trang hiện tại hoạt động trên menu sidebar.
 */
function highlightActiveMenu(container) {
    const path = window.location.pathname;
    let pageName = path.split("/").pop() || "dashboard.html";
    if (pageName === "index.html" || pageName === "") {
        pageName = "dashboard.html"; // Mặc định nếu là trang chủ ngoài
    }

    const items = container.querySelectorAll("[data-menu-id]");
    let foundActive = false;

    items.forEach(item => {
        const href = item.getAttribute("href");
        const menuId = item.getAttribute("data-menu-id");
        
        // So khớp dựa trên đuôi href hoặc data-menu-id
        if (href && (href.endsWith(pageName) || href === pageName)) {
            // Thiết lập active style theo DESIGN.md
            item.classList.remove("text-mid-gray", "hover:bg-paper", "hover:text-ink", "border-transparent");
            item.classList.add("bg-paper", "text-ink", "font-semibold", "shadow-subtle", "border-hairline/80");
            
            // Cập nhật nhãn Breadcrumb ở topbar
            const breadcrumbLabel = document.getElementById("breadcrumb-current-label");
            if (breadcrumbLabel) {
                const textSpan = item.querySelector(".sidebar-text");
                if (textSpan) {
                    breadcrumbLabel.textContent = textSpan.textContent.trim();
                }
            }
            foundActive = true;
        }
    });

    return foundActive;
}

/**
 * Nạp động Sidebar và Topbar vào trang HTML hiện tại.
 */
export async function initializeLayout() {
    const rootPrefix = getRootPrefix();
    const isRoot = rootPrefix === "./";

    // 1. Nạp Sidebar
    const sidebarPlaceholder = document.querySelector("[data-sidebar]") || document.getElementById("sidebar-placeholder");
    if (sidebarPlaceholder) {
        try {
            const response = await fetch(`${rootPrefix}components/sidebar.html`);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const loadedSidebar = doc.querySelector("[data-sidebar]");

                if (loadedSidebar) {
                    // Áp dụng ngay trạng thái thu gọn trước khi chèn vào DOM để tránh flicker
                    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
                    if (isCollapsed) {
                        loadedSidebar.classList.add("sidebar-collapsed");
                    }

                    // Điều chỉnh link và đánh dấu active
                    adjustRelativeLinks(loadedSidebar, isRoot);
                    highlightActiveMenu(loadedSidebar);

                    // Thay thế placeholder
                    sidebarPlaceholder.replaceWith(loadedSidebar);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải sidebar component:", error);
        }
    }

    // 2. Nạp Topbar
    const topbarPlaceholder = document.querySelector("header") || document.getElementById("topbar-placeholder");
    if (topbarPlaceholder) {
        try {
            const response = await fetch(`${rootPrefix}components/topbar.html`);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const loadedTopbar = doc.querySelector("header");

                if (loadedTopbar) {
                    // Thay thế placeholder
                    topbarPlaceholder.replaceWith(loadedTopbar);
                    
                    // Cập nhật lại nhãn Breadcrumb sau khi topbar đã hiển thị
                    const activeItem = document.querySelector(".sidebar-item.bg-paper");
                    if (activeItem) {
                        const breadcrumbLabel = document.getElementById("breadcrumb-current-label");
                        const textSpan = activeItem.querySelector(".sidebar-text");
                        if (breadcrumbLabel && textSpan) {
                            breadcrumbLabel.textContent = textSpan.textContent.trim();
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải topbar component:", error);
        }
    }

    // 3. Khởi tạo tương tác sự kiện cho các thành phần layout
    initializeInteractions();
}
