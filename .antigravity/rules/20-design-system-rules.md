# Design System Rules

- Chỉ light mode trong GD1.
- Dùng token từ `knowledge/design/`.
- Card radius 24px, riêng panel nhỏ có thể dùng radius 6px theo quy tắc density compact mới.
- Button, input và badge radius 18px.
- Không gradient.
- Cho phép sử dụng màu sắc semantic mới (xanh lá, đỏ gạch, amber, xám) cho chỉ báo trạng thái (badge, icon, status text, thanh tỷ lệ). Tuyệt đối không dùng để trang trí. Giao diện tổng thể giữ nguyên tone monochrome làm chủ đạo.
- Không dùng alert() cho thông báo thông thường, sử dụng hệ thống Toast dùng chung (ES Module).
- Không hard-code màu khi đã có token.
- Icon thin stroke.