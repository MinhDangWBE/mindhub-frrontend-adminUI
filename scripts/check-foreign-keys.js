const fs = require('fs');
const path = require('path');

const mockDbPath = path.resolve('assets/js/mocks/mock-database.js');
const mockDbContent = fs.readFileSync(mockDbPath, 'utf-8');
const evalCode = mockDbContent.replace('export const MOCK_DB =', 'const MOCK_DB =') + '\nmodule.exports = { MOCK_DB };';
const tmpModulePath = path.resolve('assets/js/mocks/mock-db-temp-eval.js');
fs.writeFileSync(tmpModulePath, evalCode, 'utf-8');
const { MOCK_DB } = require(tmpModulePath);
fs.unlinkSync(tmpModulePath);

console.log('=== CHECKING MOCK_DB RELATIONSHIPS & FOREIGN KEYS ===');

const users = new Set((MOCK_DB.users || []).map(u => String(u.id)));
const categories = new Set((MOCK_DB.categories || []).map(c => String(c.id)));
const courses = new Set((MOCK_DB.courses || []).map(c => String(c.id)));
const orders = new Set((MOCK_DB.orders || []).map(o => String(o.id)));
const revenues = new Set((MOCK_DB.revenues || []).map(r => String(r.id)));
const payoutAccounts = new Set((MOCK_DB.payoutAccounts || []).map(p => String(p.id)));
const withdrawals = new Set((MOCK_DB.withdrawals || []).map(w => String(w.id)));
const faqs = new Set((MOCK_DB.faqs || []).map(f => String(f.id)));
const lessons = new Set((MOCK_DB.lessons || []).map(l => String(l.id)));

let errors = [];

// 1. Courses instructor_id -> users
(MOCK_DB.courses || []).forEach(c => {
    if (c.instructor_id && !users.has(String(c.instructor_id))) {
        errors.push(`Course ${c.id} -> instructor_id ${c.instructor_id} missing in users`);
    }
});

// 2. Orders user_id -> users, course_id -> courses
(MOCK_DB.orders || []).forEach(o => {
    if (o.user_id && !users.has(String(o.user_id))) {
        errors.push(`Order ${o.id} -> user_id ${o.user_id} missing in users`);
    }
    if (o.course_id && !courses.has(String(o.course_id))) {
        errors.push(`Order ${o.id} -> course_id ${o.course_id} missing in courses`);
    }
});

// 3. Revenues order_id -> orders, course_id -> courses, instructor_id -> users
(MOCK_DB.revenues || []).forEach(r => {
    if (r.order_id && !orders.has(String(r.order_id))) {
        errors.push(`Revenue ${r.id} -> order_id ${r.order_id} missing in orders`);
    }
    if (r.course_id && !courses.has(String(r.course_id))) {
        errors.push(`Revenue ${r.id} -> course_id ${r.course_id} missing in courses`);
    }
    if (r.instructor_id && !users.has(String(r.instructor_id))) {
        errors.push(`Revenue ${r.id} -> instructor_id ${r.instructor_id} missing in users`);
    }
});

// 4. PayoutAccounts user_id -> users
(MOCK_DB.payoutAccounts || []).forEach(p => {
    if (p.user_id && !users.has(String(p.user_id))) {
        errors.push(`PayoutAccount ${p.id} -> user_id ${p.user_id} missing in users`);
    }
});

// 5. Withdrawals user_id -> users, payout_account_id -> payoutAccounts
(MOCK_DB.withdrawals || []).forEach(w => {
    if (w.user_id && !users.has(String(w.user_id))) {
        errors.push(`Withdrawal ${w.id} -> user_id ${w.user_id} missing in users`);
    }
    if (w.payout_account_id && !payoutAccounts.has(String(w.payout_account_id))) {
        errors.push(`Withdrawal ${w.id} -> payout_account_id ${w.payout_account_id} missing in payoutAccounts`);
    }
    // Check allocations revenue_id -> revenues
    if (Array.isArray(w.allocations)) {
        w.allocations.forEach(al => {
            if (al.revenue_id && !revenues.has(String(al.revenue_id))) {
                errors.push(`Withdrawal ${w.id} allocation -> revenue_id ${al.revenue_id} missing in revenues`);
            }
        });
    }
});

// 6. InstructorUpgrades user_id -> users
(MOCK_DB.instructorUpgrades || []).forEach(iu => {
    if (iu.user_id && !users.has(String(iu.user_id))) {
        errors.push(`InstructorUpgrade user_id ${iu.user_id} missing in users`);
    }
});

// 7. CourseReviews course_id -> courses
(MOCK_DB.courseReviews || []).forEach(cr => {
    if (cr.course_id && !courses.has(String(cr.course_id))) {
        errors.push(`CourseReview course_id ${cr.course_id} missing in courses`);
    }
});

// 8. Comments user_id -> users, course_id -> courses, lesson_id -> lessons
(MOCK_DB.comments || []).forEach(cm => {
    if (cm.user_id && !users.has(String(cm.user_id))) {
        errors.push(`Comment ${cm.id} -> user_id ${cm.user_id} missing in users`);
    }
    if (cm.course_id && !courses.has(String(cm.course_id))) {
        errors.push(`Comment ${cm.id} -> course_id ${cm.course_id} missing in courses`);
    }
    if (cm.lesson_id && !lessons.has(String(cm.lesson_id))) {
        errors.push(`Comment ${cm.id} -> lesson_id ${cm.lesson_id} missing in lessons`);
    }
});

// 9. Reviews user_id -> users, course_id -> courses, order_id -> orders
(MOCK_DB.reviews || []).forEach(rv => {
    if (rv.user_id && !users.has(String(rv.user_id))) {
        errors.push(`Review ${rv.id} -> user_id ${rv.user_id} missing in users`);
    }
    if (rv.course_id && !courses.has(String(rv.course_id))) {
        errors.push(`Review ${rv.id} -> course_id ${rv.course_id} missing in courses`);
    }
    if (rv.order_id && !orders.has(String(rv.order_id))) {
        errors.push(`Review ${rv.id} -> order_id ${rv.order_id} missing in orders`);
    }
});

// 10. Course_faqs faq_id -> faqs, course_id -> courses
(MOCK_DB.course_faqs || []).forEach(cf => {
    if (cf.faq_id && !faqs.has(String(cf.faq_id))) {
        errors.push(`CourseFAQ faq_id ${cf.faq_id} missing in faqs`);
    }
    if (cf.course_id && !courses.has(String(cf.course_id))) {
        errors.push(`CourseFAQ course_id ${cf.course_id} missing in courses`);
    }
});

console.log(`Total Foreign Key Issues Found: ${errors.length}`);
errors.forEach(e => console.log(`- ${e}`));
