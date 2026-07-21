/**
 * MindHub Admin Revenue Mock Data
 * Đáp ứng đầy đủ contract & bao phủ các preset 7 ngày, 1 tháng, 3 tháng.
 */

const courses = [
  { id: 10, title: "Lập trình ReactJS Thực Chiến", slug: "reactjs-thuc-chien" },
  { id: 11, title: "Next.js Pro Tích Hợp AI", slug: "nextjs-pro-ai" },
  { id: 12, title: "System Design Nâng Cao", slug: "system-design-nang-cao" },
  { id: 13, title: "Nhập Môn Lập Trình Python", slug: "python-nhap-mon" },
  { id: 14, title: "Node.js & Microservices Architecture", slug: "nodejs-microservices" },
  { id: 15, title: "HTML CSS Tailwind Masterclass", slug: "html-css-tailwind-masterclass" },
  { id: 16, title: "Vue 3 & Composition API", slug: "vue3-composition-api" },
  { id: 17, title: "DevOps Essentials & Docker K8s", slug: "devops-docker-k8s" }
];

const instructors = [
  { id: 3, full_name: "Trần Thị Dạy", email: "day.tran@mindhub.edu.vn" },
  { id: 6, full_name: "Hoàng Tạm Ngưng", email: "ngung.hoang@gmail.com" },
  { id: 9, full_name: "Lê Giảng Viên Xịn", email: "xin.le@mindhub.edu.vn" },
  { id: 12, full_name: "Phạm Thầy Giáo Trẻ", email: "tre.pham@gmail.com" },
  { id: 15, full_name: "Nguyễn Quốc Cường", email: "cuong.nguyen@mindhub.edu.vn" },
  { id: 18, full_name: "Đặng Minh Châu", email: "chau.dang@mindhub.edu.vn" }
];

const statuses = ["available", "available", "available", "withdrawn", "pending", "cancelled"];

// Helper để sinh ngày trong khoảng 2026-04-15 đến 2026-07-21
function getRandomDate(startOffsetDays, endOffsetDays) {
  const now = new Date("2026-07-21T10:00:00Z");
  const targetDate = new Date(now.getTime());
  const diffDays = startOffsetDays + Math.random() * (endOffsetDays - startOffsetDays);
  targetDate.setDate(targetDate.getDate() - diffDays);
  targetDate.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return targetDate.toISOString();
}

export const MOCK_REVENUES = [
  // --- BẢN GHI NỔI BẬT KHÔNG ĐỒNG NHẤT (AMOUNT_CONSISTENT = FALSE) ---
  {
    id: 1,
    gross_amount: "500000.00",
    instructor_amount: "300000.00", // Lệch 50k so với 70% (350k)
    platform_fee_amount: "150000.00",
    status: "available",
    earned_at: "2026-07-20T14:30:00Z",
    amount_consistent: false,
    instructor_rate: 70,
    platform_rate: 30,
    order: { id: 101, order_code: "ORD-20260720-001", amount: "500000.00", status: "paid", payment_status: "paid", paid_at: "2026-07-20T14:30:00Z" },
    course: courses[0],
    instructor: instructors[0]
  },
  {
    id: 2,
    gross_amount: "1200000.00",
    instructor_amount: "800000.00", // Lệch tiền so với 60%
    platform_fee_amount: "480000.00",
    status: "pending",
    earned_at: "2026-07-19T09:15:00Z",
    amount_consistent: false,
    instructor_rate: 60,
    platform_rate: 40,
    order: { id: 102, order_code: "ORD-20260719-002", amount: "1200000.00", status: "pending", payment_status: "processing", paid_at: null },
    course: courses[2],
    instructor: instructors[2]
  },
  {
    id: 3,
    gross_amount: "800000.00",
    instructor_amount: "500000.00", // Lệch tiền
    platform_fee_amount: "240000.00",
    status: "available",
    earned_at: "2026-07-05T11:00:00Z",
    amount_consistent: false,
    instructor_rate: 70,
    platform_rate: 30,
    order: { id: 103, order_code: "ORD-20260705-003", amount: "800000.00", status: "paid", payment_status: "paid", paid_at: "2026-07-05T11:00:00Z" },
    course: courses[1],
    instructor: instructors[1]
  }
];

// --- 10 bản ghi trong 7 ngày gần đây (Offset 0 - 6 ngày) ---
for (let i = 4; i <= 13; i++) {
  const course = courses[i % courses.length];
  const instructor = instructors[i % instructors.length];
  const rate = i % 5 === 0 ? 80 : (i % 4 === 0 ? 60 : 70);
  const grossNum = (Math.floor(Math.random() * 8) + 3) * 100000;
  const instrNum = (grossNum * rate) / 100;
  const platNum = grossNum - instrNum;
  const status = statuses[i % statuses.length];
  const dateStr = getRandomDate(0.1, 6.5);

  MOCK_REVENUES.push({
    id: i,
    gross_amount: grossNum.toFixed(2),
    instructor_amount: instrNum.toFixed(2),
    platform_fee_amount: platNum.toFixed(2),
    status: status,
    earned_at: dateStr,
    amount_consistent: true,
    instructor_rate: rate,
    platform_rate: 100 - rate,
    order: {
      id: 100 + i,
      order_code: `ORD-202607${String(21 - (i % 6)).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
      amount: grossNum.toFixed(2),
      status: status === "cancelled" ? "cancelled" : (status === "pending" ? "pending" : "paid"),
      payment_status: status === "cancelled" ? "failed" : (status === "pending" ? "processing" : "paid"),
      paid_at: status === "cancelled" || status === "pending" ? null : dateStr
    },
    course,
    instructor
  });
}

// --- 15 bản ghi từ 7 - 30 ngày trước (Offset 7 - 29 ngày) ---
for (let i = 14; i <= 28; i++) {
  const course = courses[i % courses.length];
  const instructor = instructors[i % instructors.length];
  const rate = i % 6 === 0 ? 60 : 70;
  const grossNum = (Math.floor(Math.random() * 10) + 4) * 100000;
  const instrNum = (grossNum * rate) / 100;
  const platNum = grossNum - instrNum;
  const status = statuses[i % statuses.length];
  const dateStr = getRandomDate(7, 29);

  MOCK_REVENUES.push({
    id: i,
    gross_amount: grossNum.toFixed(2),
    instructor_amount: instrNum.toFixed(2),
    platform_fee_amount: platNum.toFixed(2),
    status: status,
    earned_at: dateStr,
    amount_consistent: true,
    instructor_rate: rate,
    platform_rate: 100 - rate,
    order: {
      id: 100 + i,
      order_code: `ORD-202606${String(30 - (i % 25)).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
      amount: grossNum.toFixed(2),
      status: status === "cancelled" ? "cancelled" : (status === "pending" ? "pending" : "paid"),
      payment_status: status === "cancelled" ? "failed" : (status === "pending" ? "processing" : "paid"),
      paid_at: status === "cancelled" || status === "pending" ? null : dateStr
    },
    course,
    instructor
  });
}

// --- 12 bản ghi từ 30 - 90 ngày trước (Offset 30 - 85 ngày) ---
for (let i = 29; i <= 40; i++) {
  const course = courses[i % courses.length];
  const instructor = instructors[i % instructors.length];
  const rate = 70;
  const grossNum = (Math.floor(Math.random() * 12) + 5) * 100000;
  const instrNum = (grossNum * rate) / 100;
  const platNum = grossNum - instrNum;
  const status = i % 3 === 0 ? "withdrawn" : "available";
  const dateStr = getRandomDate(30, 85);

  MOCK_REVENUES.push({
    id: i,
    gross_amount: grossNum.toFixed(2),
    instructor_amount: instrNum.toFixed(2),
    platform_fee_amount: platNum.toFixed(2),
    status: status,
    earned_at: dateStr,
    amount_consistent: true,
    instructor_rate: rate,
    platform_rate: 100 - rate,
    order: {
      id: 100 + i,
      order_code: `ORD-202605${String(30 - (i % 25)).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
      amount: grossNum.toFixed(2),
      status: "paid",
      payment_status: "paid",
      paid_at: dateStr
    },
    course,
    instructor
  });
}
