const fs = require('fs');
const path = require('path');

console.log("=========================================");
console.log("RUNNING MOCK DATA REFERENTIAL INTEGRITY SCRIPT");
console.log("=========================================");

const dbFilePath = path.join(__dirname, '../assets/js/mocks/mock-database.js');
if (!fs.existsSync(dbFilePath)) {
    console.error(`Error: mock-database.js not found at: ${dbFilePath}`);
    process.exit(1);
}

// Read and parse mock database file
const fileContent = fs.readFileSync(dbFilePath, 'utf8');
let cleanCode = fileContent.replace(/^\ufeff/, '');
cleanCode = cleanCode.replace(/export const MOCK_DB\s*=/g, 'globalThis.MOCK_DB =');

let MOCK_DB = null;
try {
    eval(cleanCode);
    MOCK_DB = globalThis.MOCK_DB;
} catch (e) {
    console.error("Failed to parse mock-database.js via eval:", e);
    process.exit(1);
}

if (!MOCK_DB) {
    console.error("MOCK_DB is empty or undefined!");
    process.exit(1);
}

let errors = [];

// Helper to log errors
function addError(message) {
    errors.push(message);
    console.error(`[ERROR] ${message}`);
}

// Enums definitions
const COURSE_STATUS_ENUM = ["draft", "pending_review", "approved", "rejected", "published", "hidden"];
const USER_STATUS_ENUM = ["active", "inactive", "locked"];
const USER_ROLE_ENUM = ["admin", "instructor", "learner"];
const APPLICATION_STATUS_ENUM = ["pending", "approved", "rejected"];
const ORDER_STATUS_ENUM = ["pending", "paid", "failed", "cancelled", "expired"];
const PAYMENT_STATUS_ENUM = ["unpaid", "processing", "paid", "failed"];
const ENROLLMENT_STATUS_ENUM = ["ongoing", "completed"];
const REVENUE_STATUS_ENUM = ["available", "withdrawn", "cancelled"];
const WITHDRAWAL_STATUS_ENUM = ["pending", "approved", "rejected", "paid", "cancelled"];

function isValidOrderPaymentPair(orderStatus, paymentStatus) {
  const allowedPairs = {
    pending: ["unpaid", "processing"],
    paid: ["paid"],
    failed: ["failed"],
    cancelled: ["unpaid", "failed"],
    expired: ["unpaid"]
  };
  return Boolean(allowedPairs[orderStatus]?.includes(paymentStatus));
}

// Helpers for checks
function isValidISO(dateStr) {
    if (!dateStr) return false;
    // Basic ISO 8601 validation (e.g. YYYY-MM-DDTHH:MM:SSZ or with offsets)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    return regex.test(dateStr) && !isNaN(Date.parse(dateStr));
}

const users = MOCK_DB.users || [];
const categories = MOCK_DB.categories || [];
const courses = MOCK_DB.courses || [];
const courseReviews = MOCK_DB.courseReviews || [];
const instructorUpgrades = MOCK_DB.instructorUpgrades || [];
const orders = MOCK_DB.orders || [];
const enrollments = MOCK_DB.enrollments || [];
const revenues = MOCK_DB.revenues || [];
const payoutAccounts = MOCK_DB.payoutAccounts || [];
const withdrawals = MOCK_DB.withdrawals || [];

console.log(`Users count: ${users.length}`);
console.log(`Categories count: ${categories.length}`);
console.log(`Courses count: ${courses.length}`);
console.log(`Course Reviews count: ${courseReviews.length}`);
console.log(`Instructor Upgrades count: ${instructorUpgrades.length}`);
console.log(`Orders count: ${orders.length}`);
console.log(`Enrollments count: ${enrollments.length}`);
console.log(`Revenues count: ${revenues.length}`);
console.log(`Payout Accounts count: ${payoutAccounts.length}`);
console.log(`Withdrawals count: ${withdrawals.length}`);
console.log("-----------------------------------------");

// 1. Check duplicate IDs
function checkDuplicateIds(arr, name) {
    const ids = new Set();
    arr.forEach(item => {
        if (item.id === undefined && item.course_id === undefined && item.user_id === undefined) return;
        const id = item.id !== undefined ? item.id : (item.course_id !== undefined ? `course_${item.course_id}` : `user_${item.user_id}`);
        if (ids.has(id)) {
            addError(`Duplicate ID found in ${name}: ${id}`);
        }
        ids.add(id);
    });
}
checkDuplicateIds(users, 'users');
checkDuplicateIds(categories, 'categories');
checkDuplicateIds(courses, 'courses');
checkDuplicateIds(courseReviews, 'courseReviews');
checkDuplicateIds(orders, 'orders');
checkDuplicateIds(enrollments, 'enrollments');
checkDuplicateIds(revenues, 'revenues');
checkDuplicateIds(payoutAccounts, 'payoutAccounts');
checkDuplicateIds(withdrawals, 'withdrawals');

// 2. Validate Users
users.forEach(u => {
    if (!USER_STATUS_ENUM.includes(u.status)) {
        addError(`User ID ${u.id} has invalid status: ${u.status}`);
    }
    if (!USER_ROLE_ENUM.includes(u.role)) {
        addError(`User ID ${u.id} has invalid role: ${u.role}`);
    }
    if (u.created_at && !isValidISO(u.created_at)) {
        addError(`User ID ${u.id} created_at is not valid ISO 8601: ${u.created_at}`);
    }
    if (u.updated_at && !isValidISO(u.updated_at)) {
        addError(`User ID ${u.id} updated_at is not valid ISO 8601: ${u.updated_at}`);
    }
});

// 3. Validate Courses
courses.forEach(c => {
    if (!COURSE_STATUS_ENUM.includes(c.status)) {
        addError(`Course ID ${c.id} has invalid status: ${c.status}`);
    }
    if (c.created_at && !isValidISO(c.created_at)) {
        addError(`Course ID ${c.id} created_at is not valid ISO 8601: ${c.created_at}`);
    }
    const instructor = users.find(u => u.id === c.instructor_id);
    if (!instructor) {
        addError(`Course ID ${c.id} references non-existent instructor_id: ${c.instructor_id}`);
    } else if (instructor.role !== 'instructor') {
        addError(`Course ID ${c.id} instructor (User ID ${c.instructor_id}) does not have instructor role (has ${instructor.role})`);
    }

    (c.category_ids || []).forEach(catId => {
        const cat = categories.find(cat => cat.id === catId);
        if (!cat) {
            addError(`Course ID ${c.id} references non-existent category_id: ${catId}`);
        }
    });
});

// 4. Validate Course Reviews
courseReviews.forEach(r => {
    const course = courses.find(c => c.id === r.course_id);
    if (!course) {
        addError(`Course review references non-existent course_id: ${r.course_id}`);
    }
});

// All courses with pending_review must have review details
courses.filter(c => c.status === 'pending_review').forEach(c => {
    const review = courseReviews.find(r => r.course_id === c.id);
    if (!review) {
        addError(`Course ID ${c.id} is pending_review but has no course review details defined!`);
    }
});

// 5. Validate Instructor Upgrades
instructorUpgrades.forEach(app => {
    const user = users.find(u => u.id === app.user_id);
    if (!user) {
        addError(`Instructor upgrade request references non-existent user_id: ${app.user_id}`);
    } else {
        if (app.application_status === 'approved' && user.role !== 'instructor') {
            addError(`Approved applicant User ID ${app.user_id} has role learner instead of instructor`);
        }
        if (app.application_status === 'pending' && user.role === 'instructor') {
            addError(`Pending applicant User ID ${app.user_id} already has role instructor`);
        }
    }
    if (!APPLICATION_STATUS_ENUM.includes(app.application_status)) {
        addError(`Upgrade request for User ID ${app.user_id} has invalid status: ${app.application_status}`);
    }
});

// 6. Validate Orders
orders.forEach(o => {
    const user = users.find(u => u.id === o.user_id);
    if (!user) {
        addError(`Order ID ${o.id} references non-existent user_id: ${o.user_id}`);
    }
    const course = courses.find(c => c.id === o.course_id);
    if (!course) {
        addError(`Order ID ${o.id} references non-existent course_id: ${o.course_id}`);
    }
    if (!ORDER_STATUS_ENUM.includes(o.status)) {
        addError(`Order ID ${o.id} has invalid status: ${o.status}`);
    }
    if (!PAYMENT_STATUS_ENUM.includes(o.payment_status)) {
        addError(`Order ID ${o.id} has invalid payment_status: ${o.payment_status}`);
    }
    if (!o.is_intentional_anomaly && !isValidOrderPaymentPair(o.status, o.payment_status)) {
        addError(`Order ID ${o.id} has invalid status/payment_status pair: (${o.status}, ${o.payment_status})`);
    }
    if (o.created_at && !isValidISO(o.created_at)) {
        addError(`Order ID ${o.id} created_at is not valid ISO: ${o.created_at}`);
    }
    if (o.paid_at && !isValidISO(o.paid_at)) {
        addError(`Order ID ${o.id} paid_at is not valid ISO: ${o.paid_at}`);
    }
    if (o.status === 'paid' && o.payment_status === 'paid') {
        if (!o.paid_at) {
            addError(`Order ID ${o.id} is paid but has null paid_at`);
        }
        const enrollment = enrollments.find(e => e.order_id === o.id);
        if (!enrollment) {
            addError(`Canonical Paid Order ID ${o.id} is missing enrollment record!`);
        }
        const revenue = revenues.find(r => r.order_id === o.id);
        if (!revenue) {
            addError(`Canonical Paid Order ID ${o.id} is missing revenue record!`);
        } else {
            if (Number(revenue.gross_amount) !== Number(o.amount)) {
                addError(`Paid Order ID ${o.id} amount (${o.amount}) does not match revenue gross_amount (${revenue.gross_amount})`);
            }
        }
    } else {
        const revenue = revenues.find(r => r.order_id === o.id);
        if (revenue) {
            addError(`Non-paid Order ID ${o.id} (status: ${o.status}) should NOT have a revenue record!`);
        }
    }
});

// Summary Verification
const paidOrders = orders.filter(o => o.status === "paid" && o.payment_status === "paid");
const pendingOrders = orders.filter(o => o.status === "pending");
const failedOrders = orders.filter(o => o.status === "failed");
const cancelledOrders = orders.filter(o => o.status === "cancelled");
const expiredOrders = orders.filter(o => o.status === "expired");

const totalCalculated = paidOrders.length + pendingOrders.length + failedOrders.length + cancelledOrders.length + expiredOrders.length;

if (totalCalculated !== orders.length) {
    addError(`Orders status breakdown count (${totalCalculated}) does not equal total orders count (${orders.length})`);
}

const paidSum = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
const avgValue = paidOrders.length > 0 ? paidSum / paidOrders.length : 0;
const successRate = orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0;

if (isNaN(paidSum) || !isFinite(paidSum)) addError("Calculated paid_amount is NaN or Infinity!");
if (isNaN(avgValue) || !isFinite(avgValue)) addError("Calculated average_order_value is NaN or Infinity!");
if (isNaN(successRate) || !isFinite(successRate)) addError("Calculated payment_success_rate is NaN or Infinity!");

// 7. Validate Enrollments
enrollments.forEach(e => {
    const user = users.find(u => u.id === e.user_id);
    if (!user) {
        addError(`Enrollment ID ${e.id} references non-existent user_id: ${e.user_id}`);
    }
    const course = courses.find(c => c.id === e.course_id);
    if (!course) {
        addError(`Enrollment ID ${e.id} references non-existent course_id: ${e.course_id}`);
    }
    const order = orders.find(o => o.id === e.order_id);
    if (!order) {
        addError(`Enrollment ID ${e.id} references non-existent order_id: ${e.order_id}`);
    } else {
        if (order.user_id !== e.user_id) {
            addError(`Enrollment ID ${e.id} user_id (${e.user_id}) does not match order user_id (${order.user_id})`);
        }
        if (order.course_id !== e.course_id) {
            addError(`Enrollment ID ${e.id} course_id (${e.course_id}) does not match order course_id (${order.course_id})`);
        }
    }
});

// 8. Validate Revenues
revenues.forEach(r => {
    const order = orders.find(o => o.id === r.order_id);
    if (!order) {
        addError(`Revenue ID ${r.id} references non-existent order_id: ${r.order_id}`);
    } else {
        if (order.payment_status !== 'paid') {
            addError(`Revenue ID ${r.id} belongs to unpaid order ID ${r.order_id}`);
        }
        if (r.gross_amount !== order.amount) {
            addError(`Revenue ID ${r.id} gross_amount (${r.gross_amount}) does not match order amount (${order.amount})`);
        }
    }
    const course = courses.find(c => c.id === r.course_id);
    if (!course) {
        addError(`Revenue ID ${r.id} references non-existent course_id: ${r.course_id}`);
    } else {
        if (r.instructor_id !== course.instructor_id) {
            addError(`Revenue ID ${r.id} instructor_id (${r.instructor_id}) does not match course instructor_id (${course.instructor_id})`);
        }
    }
    if (r.instructor_amount + r.platform_fee_amount !== r.gross_amount) {
        addError(`Revenue ID ${r.id} split mismatch: ${r.instructor_amount} + ${r.platform_fee_amount} !== ${r.gross_amount}`);
    }
});

// 9. Validate Payout Accounts
payoutAccounts.forEach(pa => {
    const user = users.find(u => u.id === pa.user_id);
    if (!user) {
        addError(`Payout account ID ${pa.id} references non-existent user_id: ${pa.user_id}`);
    } else if (user.role !== 'instructor') {
        addError(`Payout account ID ${pa.id} belongs to non-instructor User ID ${pa.user_id}`);
    }
});

// 10. Validate Withdrawals
withdrawals.forEach(w => {
    const user = users.find(u => u.id === w.user_id);
    if (!user) {
        addError(`Withdrawal ID ${w.id} references non-existent user_id: ${w.user_id}`);
    } else if (user.role !== 'instructor') {
        addError(`Withdrawal ID ${w.id} belongs to non-instructor User ID ${w.user_id}`);
    }
    const pa = payoutAccounts.find(pa => pa.id === w.payout_account_id);
    if (!pa) {
        addError(`Withdrawal ID ${w.id} references non-existent payout_account_id: ${w.payout_account_id}`);
    } else if (pa.user_id !== w.user_id) {
        addError(`Withdrawal ID ${w.id} payout account belongs to User ID ${pa.user_id} instead of User ID ${w.user_id}`);
    }
    if (!WITHDRAWAL_STATUS_ENUM.includes(w.status)) {
        addError(`Withdrawal ID ${w.id} has invalid status: ${w.status}`);
    }
});

console.log("-----------------------------------------");
if (errors.length === 0) {
    console.log("SUCCESS: 0 referential integrity errors found! PASS.");
    console.log("=========================================");
    process.exit(0);
} else {
    console.error(`FAILURE: ${errors.length} referential integrity errors found! FAIL.`);
    console.log("=========================================");
    process.exit(1);
}
