const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('=== AUDIT PART 1: NODE --CHECK FOR ES MODULES ===');
console.log('====================================================');

function getAllJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git', 'backup'].includes(file)) {
                results = results.concat(getAllJsFiles(filePath));
            }
        } else if (file.endsWith('.js') && !file.endsWith('.bak')) {
            results.push(filePath);
        }
    });
    return results;
}

const jsFiles = getAllJsFiles('.');
let jsErrors = 0;

jsFiles.forEach(file => {
    const mjsFile = file.replace(/\.js$/, '.tmp.mjs');
    try {
        fs.copyFileSync(file, mjsFile);
        execSync(`node --check "${mjsFile}"`, { stdio: 'pipe' });
    } catch (err) {
        console.error(`[SYNTAX FAIL] ${file}:\n${err.stderr ? err.stderr.toString() : err.message}`);
        jsErrors++;
    } finally {
        if (fs.existsSync(mjsFile)) {
            fs.unlinkSync(mjsFile);
        }
    }
});

console.log(`Active JS Files Checked: ${jsFiles.length - 1}, Syntax Errors: ${jsErrors}\n`);

console.log('====================================================');
console.log('=== AUDIT PART 2: PAGE HTML FILES & SECTION IDS ===');
console.log('====================================================');

const requiredSectionIds = {
    'users.html': 'users-results-section',
    'instructor-upgrades.html': 'instructor-upgrades-results-section',
    'courses.html': 'courses-results-section',
    'course-reviews.html': 'course-reviews-results-section',
    'categories.html': 'categories-results-section',
    'orders.html': 'orders-results-section',
    'revenues.html': 'revenues-results-section',
    'withdrawals.html': 'withdrawals-results-section',
    'payout-accounts.html': 'payout-accounts-results-section',
    'moderation.html': 'moderation-results-section',
    'banners.html': 'banners-results-section',
    'faqs.html': 'faqs-results-section'
};

Object.keys(requiredSectionIds).forEach(page => {
    const pagePath = path.join('pages', page);
    if (!fs.existsSync(pagePath)) {
        console.error(`[MISSING PAGE] pages/${page}`);
        return;
    }
    const html = fs.readFileSync(pagePath, 'utf-8');
    const reqId = requiredSectionIds[page];
    if (html.includes(`id="${reqId}"`)) {
        console.log(`[PASS ID] ${page} has #${reqId}`);
    } else {
        console.warn(`[MISSING ID] ${page} lacks #${reqId}`);
    }
});

console.log('\n====================================================');
console.log('=== AUDIT PART 3: MOCK DATABASE FOREIGN KEYS ===');
console.log('====================================================');

try {
    const mockDbPath = path.resolve('assets/js/mocks/mock-database.js');
    delete require.cache[mockDbPath];
    const mockDbContent = fs.readFileSync(mockDbPath, 'utf-8');
    const evalCode = mockDbContent.replace('export const MOCK_DB =', 'const MOCK_DB =') + '\nmodule.exports = { MOCK_DB };';
    const tmpModulePath = path.resolve('assets/js/mocks/mock-db-temp-eval.js');
    fs.writeFileSync(tmpModulePath, evalCode, 'utf-8');
    const { MOCK_DB } = require(tmpModulePath);
    fs.unlinkSync(tmpModulePath);

    console.log(`MOCK_DB loaded successfully. Collections: ${Object.keys(MOCK_DB).join(', ')}`);

    const usersMap = new Set((MOCK_DB.users || []).map(u => String(u.id)));
    const coursesMap = new Set((MOCK_DB.courses || []).map(c => String(c.id)));
    const ordersMap = new Set((MOCK_DB.orders || []).map(o => String(o.id)));
    const revenuesMap = new Set((MOCK_DB.revenues || []).map(r => String(r.id)));
    const payoutAccountsMap = new Set((MOCK_DB.payoutAccounts || MOCK_DB.payout_accounts || []).map(p => String(p.id)));
    const faqsMap = new Set((MOCK_DB.faqs || []).map(f => String(f.id)));

    let orphanCount = 0;

    // Check revenues foreign keys
    (MOCK_DB.revenues || []).forEach(r => {
        if (r.order_id && !ordersMap.has(String(r.order_id))) {
            console.warn(`[ORPHAN FK] Revenue ${r.id} -> order_id ${r.order_id} not found in orders`);
            orphanCount++;
        }
        if (r.course_id && !coursesMap.has(String(r.course_id))) {
            console.warn(`[ORPHAN FK] Revenue ${r.id} -> course_id ${r.course_id} not found in courses`);
            orphanCount++;
        }
        if (r.instructor_id && !usersMap.has(String(r.instructor_id))) {
            console.warn(`[ORPHAN FK] Revenue ${r.id} -> instructor_id ${r.instructor_id} not found in users`);
            orphanCount++;
        }
    });

    // Check orders foreign keys
    (MOCK_DB.orders || []).forEach(o => {
        if (o.course_id && !coursesMap.has(String(o.course_id))) {
            console.warn(`[ORPHAN FK] Order ${o.id} -> course_id ${o.course_id} not found in courses`);
            orphanCount++;
        }
        if (o.user_id && !usersMap.has(String(o.user_id))) {
            console.warn(`[ORPHAN FK] Order ${o.id} -> user_id ${o.user_id} not found in users`);
            orphanCount++;
        }
    });

    // Check courses foreign keys
    (MOCK_DB.courses || []).forEach(c => {
        if (c.instructor_id && !usersMap.has(String(c.instructor_id))) {
            console.warn(`[ORPHAN FK] Course ${c.id} -> instructor_id ${c.instructor_id} not found in users`);
            orphanCount++;
        }
    });

    // Check withdrawals foreign keys
    (MOCK_DB.withdrawals || []).forEach(w => {
        if (w.user_id && !usersMap.has(String(w.user_id))) {
            console.warn(`[ORPHAN FK] Withdrawal ${w.id} -> user_id ${w.user_id} not found in users`);
            orphanCount++;
        }
        if (w.payout_account_id && !payoutAccountsMap.has(String(w.payout_account_id))) {
            console.warn(`[ORPHAN FK] Withdrawal ${w.id} -> payout_account_id ${w.payout_account_id} not found in payout_accounts`);
            orphanCount++;
        }
    });

    console.log(`Orphan Foreign Keys Count: ${orphanCount}`);

} catch (err) {
    console.error(`Error auditing MOCK_DB:`, err);
}

console.log('\n====================================================');
console.log('=== AUDIT PART 4: PROHIBITED LEGACY TERMS CHECK ===');
console.log('====================================================');

const prohibitedTerms = ['pending_approval', 'open_report_id', 'open_instructor_upgrade_id'];
let prohibitedCount = 0;

const codeFiles = getAllJsFiles('assets/js').concat(
    fs.readdirSync('pages').map(f => path.join('pages', f))
);

codeFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf-8');
    prohibitedTerms.forEach(term => {
        if (content.includes(term)) {
            console.warn(`[PROHIBITED TERM FOUND] File ${file} contains '${term}'`);
            prohibitedCount++;
        }
    });
});

console.log(`Prohibited Terms Count: ${prohibitedCount}`);
