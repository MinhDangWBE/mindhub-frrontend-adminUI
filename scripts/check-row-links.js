const fs = require('fs');
const path = require('path');

const pageFiles = [
    'users', 'instructor-upgrades', 'courses', 'course-reviews',
    'categories', 'orders', 'revenues', 'withdrawals', 'payout-accounts',
    'moderation', 'reports', 'banners', 'faqs'
];

console.log('=== CHECKING IN-ROW LINKS & EVENT STOPPROPAGATION ===\n');

pageFiles.forEach(page => {
    const jsPath = path.join('assets/js/pages', `${page}.js`);
    if (!fs.existsSync(jsPath)) return;
    const content = fs.readFileSync(jsPath, 'utf-8');

    // Find all <a href=... inside string templates that don't have stopPropagation
    const linksWithoutStop = [];
    const linkMatches = content.match(/<a\s+[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
    linkMatches.forEach(link => {
        if (!link.includes('stopPropagation')) {
            linksWithoutStop.push(link);
        }
    });

    console.log(`Page ${page}: ${linkMatches.length} total links, ${linksWithoutStop.length} without stopPropagation`);
    if (linksWithoutStop.length > 0) {
        linksWithoutStop.slice(0, 3).forEach(l => console.log(`  - Sample missing: ${l}`));
    }
});
