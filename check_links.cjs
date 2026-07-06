const fs = require('fs');
const https = require('https');
const path = require('path');

const links = new Set();
function scan(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach(f => {
        const p = path.join(d, f.name);
        if (f.isDirectory() && !p.includes('node_modules')) {
            scan(p);
        } else if (f.isFile() && /\.(tsx|ts|html)$/.test(p)) {
            const content = fs.readFileSync(p, 'utf-8');
            const hrefRegex = /(?:href|to|url)\s*=\s*(?:\{['"])?['"]([^'"]+)['"]/g;
            let match;
            while ((match = hrefRegex.exec(content)) !== null) {
                if (!match[1].startsWith('{') && !match[1].startsWith('$(')) {
                    links.add(match[1]);
                }
            }
        }
    });
}

scan('./src');

const urlsToCheck = Array.from(links).filter(l => l.startsWith('http'));
const internalLinks = Array.from(links).filter(l => l.startsWith('/'));
console.log('Internal routes found:', internalLinks.length, internalLinks.slice(0, 10));
console.log('\nChecking external links:', urlsToCheck.length);

async function checkUrl(urlStr) {
    return new Promise((resolve) => {
        try {
            const req = https.get(urlStr, (res) => {
                if (res.statusCode >= 400 && res.statusCode !== 403 && res.statusCode !== 401) {
                    console.log(`❌ BROKEN: ${res.statusCode} -> ${urlStr}`);
                }
                resolve();
            });
            req.on('error', () => {
                console.log(`❌ ERROR: -> ${urlStr}`);
                resolve();
            });
            req.setTimeout(5000, () => {
                req.destroy();
                console.log(`⏱️ TIMEOUT -> ${urlStr}`);
                resolve();
            });
        } catch(e) {
            console.log(`❌ INVALID FORMAT: -> ${urlStr}`);
            resolve();
        }
    });
}

(async () => {
    for (const u of urlsToCheck) {
        await checkUrl(u);
    }
    console.log('Link check complete!');
})();
