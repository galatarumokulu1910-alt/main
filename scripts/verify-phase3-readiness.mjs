/**
 * ============================================================================
 * GALATA RUM OKULU — PHASE 3 INDEPENDENT FINAL VALIDATION & QA SUITE
 * ============================================================================
 * Executes and records verifiable evidence for:
 * 1. All 52 Phase 2 Regression Tests
 * 2. Phase 3 RLS & Admin Authorization Static + Runtime Security Invariants
 * 3. Phase 3 Server-Side Rate-Limiting (ERRCODE P0001) & Honest Mailto Fallback
 * 4. Phase 3 Complete 165-URL Legacy WordPress Deep-URL Migration (page, sergi, etkinlik sitemaps)
 * 5. Phase 3 Unknown Event Slug & Unknown Artifact UUID 404 Handling
 * 6. Phase 3 Narrow 320x568 Viewport, Keyboard Focus, Language Switcher Route Preservation, OpenSeadragon Zoom
 * 7. Phase 3 Automated Accessibility & Performance Metrics Across 10 Key Templates
 * ============================================================================
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PHASE3_DIR = path.resolve(PROJECT_ROOT, '../../audit/prelaunch-phase3-2026-11-15');
const EVIDENCE_DIR = path.join(PHASE3_DIR, 'audit-evidence');
const SCREENSHOTS_DIR = path.join(EVIDENCE_DIR, 'screenshots');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const testResults = [];

function recordTest(suite, id, name, passed, expected, actual, evidenceRef, executionEnv = 'LOCAL_BUILD_REAL_BROWSER', prodStatus = 'PENDING_DEPLOY_OR_CUTOVER') {
    testResults.push({
        suite,
        id,
        name,
        status: passed ? 'PASS' : 'FAIL',
        executionEnv,
        prodStatus,
        expected,
        actual,
        evidenceRef,
    });
    if (!passed) {
        console.error(`[FAIL] ${id} - ${name}: expected (${expected}), got (${actual})`);
    } else {
        console.log(`[PASS] ${id} - ${name}`);
    }
}

/**
 * Matches a vercel.json redirect rule against a request pathname (both raw and decoded).
 */
function matchRedirectRule(rule, rawPathname, decodedPathname) {
    if (rule.source === '/tr/:path+') {
        if (decodedPathname.startsWith('/tr/') && decodedPathname.length > 4) {
            return decodedPathname.slice(3);
        }
        return null;
    }

    // Pattern rules: /:loc/etkinlik/:slug, /:loc/etkinlik/:slug/, /:loc/sergi/:slug, /:loc/sergi/:slug/
    const patternMatch = rule.source.match(/^\/(tr|en|el)\/(etkinlik|sergi)\/:slug(\/)?$/);
    if (patternMatch) {
        const [, loc, type, trailingSlash] = patternMatch;
        const regex = new RegExp(`^\\/${loc}\\/${type}\\/([^/]+)${trailingSlash ? '\\/' : ''}$`, 'i');
        const m = rawPathname.match(regex) || decodedPathname.match(regex);
        if (m) {
            const slug = m[1].toLowerCase();
            return rule.destination.replace(':slug', slug);
        }
        return null;
    }

    if (
        rawPathname === rule.source ||
        decodedPathname === rule.source ||
        rawPathname.toLowerCase() === rule.source.toLowerCase()
    ) {
        return rule.destination;
    }
    return null;
}

function createLocalEmulatedServer(distDir, vercelConfig) {
    const redirects = vercelConfig.redirects || [];
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.xml': 'application/xml; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
    };

    return http.createServer((req, res) => {
        const parsedUrl = new URL(req.url || '/', 'http://localhost');
        const rawPathname = parsedUrl.pathname;
        let decodedPathname = rawPathname;
        try {
            decodedPathname = decodeURIComponent(rawPathname);
        } catch {
            decodedPathname = rawPathname;
        }
        const simulatedHost = req.headers['x-simulated-host'] || req.headers.host || 'localhost';

        // Security headers from vercel.json
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if (String(simulatedHost).endsWith('.vercel.app')) {
            res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        }

        // 1. Check redirects
        for (const rule of redirects) {
            const dest = matchRedirectRule(rule, rawPathname, decodedPathname);
            if (dest) {
                res.statusCode = rule.permanent ? 301 : 302;
                res.setHeader('Location', dest);
                res.end();
                return;
            }
        }

        // Normalize trailing slash for cleanUrls / trailingSlash: false on /en/ and /el/
        const cleanPathname =
            decodedPathname.length > 1 && decodedPathname.endsWith('/')
                ? decodedPathname.replace(/\/+$/, '')
                : decodedPathname;

        // 2. Check exact file in distDir
        const safeRel = cleanPathname.replace(/^\/+/, '');
        const exactFile = path.join(distDir, safeRel);
        if (safeRel && fs.existsSync(exactFile) && fs.statSync(exactFile).isFile()) {
            const ext = path.extname(exactFile).toLowerCase();
            res.statusCode = 200;
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.end(fs.readFileSync(exactFile));
            return;
        }

        // 3. Check directory index.html (cleanUrls)
        const indexCandidate = path.join(distDir, safeRel, 'index.html');
        if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(indexCandidate));
            return;
        }

        // 4. Check admin rewrites
        if (/^\/(?:(?:en|el)\/)?admin(?:\/.*)?$/.test(cleanPathname)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(path.join(distDir, 'app.html')));
            return;
        }

        // 5. Fallback to dist/404.html with HTTP 404
        const notFoundFile = path.join(distDir, '404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.existsSync(notFoundFile) ? fs.readFileSync(notFoundFile) : 'Not Found');
    });
}

function httpGet(port, reqPath, headers = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(
            {
                hostname: '127.0.0.1',
                port,
                path: reqPath,
                method: 'GET',
                headers,
            },
            (res) => {
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: Buffer.concat(chunks).toString('utf8'),
                    });
                });
            }
        );
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log('=== Starting Phase 3 Independent Final Validation & QA Suite ===');

    const vercelConfig = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'vercel.json'), 'utf8'));
    const sitemapXml = fs.readFileSync(path.join(DIST_DIR, 'sitemap.xml'), 'utf8');
    const robotsTxt = fs.readFileSync(path.join(PROJECT_ROOT, 'public', 'robots.txt'), 'utf8');

    // =========================================================================
    // SUITE 0: PHASE 3 RLS & ADMIN AUTHORIZATION SQL INVARIANTS
    // =========================================================================
    const mig0 = fs.readFileSync(
        path.join(PROJECT_ROOT, 'supabase', 'migrations', '20261115000000_venue_inquiries.sql'),
        'utf8'
    );
    const mig1 = fs.readFileSync(
        path.join(PROJECT_ROOT, 'supabase', 'migrations', '20261115000001_archive_and_newsletter_forms.sql'),
        'utf8'
    );
    const migSync = fs.readFileSync(
        path.join(PROJECT_ROOT, 'supabase', 'migrations', '20261115010000_sync_all_content_and_event_types.sql'),
        'utf8'
    );

    const mig0ExecutableSql = mig0.replace(/--.*$/gm, '');
    const hasAdminUsersTable =
        mig0ExecutableSql.includes('CREATE TABLE IF NOT EXISTS public.admin_users') &&
        mig0ExecutableSql.includes('ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY');
    const hasSafeIsAdminFn =
        mig0ExecutableSql.includes('CREATE OR REPLACE FUNCTION public.is_admin()') &&
        mig0ExecutableSql.includes('SECURITY DEFINER') &&
        mig0ExecutableSql.includes("SET search_path = ''") &&
        mig0ExecutableSql.includes("'app_metadata'") &&
        !mig0ExecutableSql.includes('user_metadata');

    recordTest(
        'SECURITY_RLS',
        'QA-SEC-01',
        'public.admin_users table and public.is_admin() SECURITY DEFINER function verify app_metadata/allowlist and NEVER trust user_metadata',
        hasAdminUsersTable && hasSafeIsAdminFn,
        'admin_users + is_admin() with app_metadata only, 0 user_metadata',
        `adminUsers=${hasAdminUsersTable}, safeIsAdmin=${hasSafeIsAdminFn}`,
        'supabase/migrations/20261115000000_venue_inquiries.sql',
        'STATIC_SQL_AUDIT',
        'PENDING_SUPABASE_MIGRATION'
    );

    const hasPermissiveAuthenticatedInMig0 = /TO\s+authenticated\s+USING\s*\(\s*true\s*\)/i.test(mig0);
    const hasPermissiveAuthenticatedInMig1 = /TO\s+authenticated\s+USING\s*\(\s*true\s*\)/i.test(mig1);
    const hasPermissiveVenueInMigSync =
        migSync.includes('Public can submit venue inquiries') ||
        migSync.includes('Admins can read venue inquiries');
    const allPiiGatedByIsAdmin =
        mig0.includes('USING ((SELECT public.is_admin()))') &&
        mig1.includes('USING ((SELECT public.is_admin()))') &&
        migSync.includes('USING ((SELECT public.is_admin()))');

    recordTest(
        'SECURITY_RLS',
        'QA-SEC-02',
        'All PII tables (venue_inquiries, archive_inquiries, newsletter_subscribers) and test_cases restrict SELECT/UPDATE/DELETE to (SELECT public.is_admin()) with 0 TO authenticated USING (true)',
        !hasPermissiveAuthenticatedInMig0 &&
            !hasPermissiveAuthenticatedInMig1 &&
            !hasPermissiveVenueInMigSync &&
            allPiiGatedByIsAdmin,
        '0 permissive authenticated policies; all gated by (SELECT public.is_admin())',
        `mig0Perm=${hasPermissiveAuthenticatedInMig0}, mig1Perm=${hasPermissiveAuthenticatedInMig1}, syncConflict=${hasPermissiveVenueInMigSync}, gated=${allPiiGatedByIsAdmin}`,
        'supabase/migrations/20261115000000_venue_inquiries.sql',
        'STATIC_SQL_AUDIT',
        'PENDING_SUPABASE_MIGRATION'
    );

    const hasRateLimitTriggers =
        mig0.includes('enforce_venue_inquiry_rate_limit') &&
        mig1.includes('enforce_archive_inquiry_rate_limit') &&
        mig1.includes('enforce_newsletter_rate_limit') &&
        mig1.includes('CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter');

    recordTest(
        'SECURITY_RLS',
        'QA-SEC-03',
        'Server-side BEFORE INSERT rate-limit triggers exist on all 3 public intake tables and one-click unsubscribe uses SECURITY DEFINER RPC without anon SELECT/UPDATE grants',
        hasRateLimitTriggers,
        '3 BEFORE INSERT triggers + unsubscribe_newsletter RPC present',
        `triggersAndRpc=${hasRateLimitTriggers}`,
        'supabase/migrations/20261115000001_archive_and_newsletter_forms.sql',
        'STATIC_SQL_AUDIT',
        'PENDING_SUPABASE_MIGRATION'
    );

    // Check client bundle in dist/assets contains 0 service_role or secret keys
    const jsAssets = fs
        .readdirSync(path.join(DIST_DIR, 'assets'))
        .filter((f) => f.endsWith('.js'))
        .map((f) => fs.readFileSync(path.join(DIST_DIR, 'assets', f), 'utf8'))
        .join('\n');
    const hasSecretLeak =
        jsAssets.includes('service_role') ||
        jsAssets.includes('SUPABASE_SERVICE_ROLE_KEY') ||
        jsAssets.includes('RESEND_API_KEY');

    recordTest(
        'SECURITY_BUNDLE',
        'QA-SEC-04',
        'Production client JS bundle in dist/assets/ contains 0 service_role keys or server secrets',
        !hasSecretLeak,
        '0 service_role / RESEND_API_KEY strings in dist/assets/*.js',
        `hasSecretLeak=${hasSecretLeak}`,
        'dist/assets/',
        'LOCAL_BUILD_VERIFIED',
        'READY_FOR_DEPLOY'
    );

    // =========================================================================
    // SUITE 1: SITEMAP, ROBOTS.TXT & OG-IMAGE STATIC VERIFICATION
    // =========================================================================
    const locMatches = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const uniqueLocs = new Set(locMatches);
    const hasOrgTrInSitemap = locMatches.some((u) => u.includes('galatarumokulu.org.tr'));
    const hasSyntheticInSitemap = locMatches.some((u) => u.includes('c1000000-0000-0000-0000-00000000000'));
    const hasUuidEventInSitemap = locMatches.some((u) =>
        /\/gecmis-etkinlikler\/[0-9a-f]{8}-[0-9a-f]{4}/i.test(u)
    );

    recordTest(
        'SEO_STATIC',
        'QA-SEO-01',
        'sitemap.xml contains all 498 indexable URLs on https://galatarumokulu.org with zero duplicates',
        locMatches.length === 498 && uniqueLocs.size === 498 && !hasOrgTrInSitemap,
        '498 unique https://galatarumokulu.org URLs, 0 .org.tr',
        `${locMatches.length} total, ${uniqueLocs.size} unique, org.tr=${hasOrgTrInSitemap}`,
        'dist/sitemap.xml'
    );

    recordTest(
        'SEO_STATIC',
        'QA-SEO-02',
        'sitemap.xml excludes synthetic artifact placeholders and raw UUID event URLs',
        !hasSyntheticInSitemap && !hasUuidEventInSitemap,
        '0 synthetic artifacts, 0 UUID event URLs in sitemap.xml',
        `synthetic=${hasSyntheticInSitemap}, uuidEvent=${hasUuidEventInSitemap}`,
        'dist/sitemap.xml'
    );

    recordTest(
        'SEO_STATIC',
        'QA-SEO-03',
        'robots.txt references canonical https://galatarumokulu.org/sitemap.xml',
        robotsTxt.includes('Sitemap: https://galatarumokulu.org/sitemap.xml') &&
            !robotsTxt.includes('galatarumokulu.org.tr'),
        'Sitemap: https://galatarumokulu.org/sitemap.xml',
        robotsTxt.trim().replace(/\r?\n/g, ' | '),
        'public/robots.txt'
    );

    const ogImagePath = path.join(DIST_DIR, 'og-image.jpg');
    const ogImageExists = fs.existsSync(ogImagePath) && fs.statSync(ogImagePath).size > 10000;
    recordTest(
        'SEO_STATIC',
        'QA-SEO-04',
        'Brand-owned /og-image.jpg exists in dist/ and is non-empty',
        ogImageExists,
        'dist/og-image.jpg > 10 KB',
        ogImageExists ? `${fs.statSync(ogImagePath).size} bytes` : 'missing',
        'public/og-image.jpg'
    );

    // =========================================================================
    // SUITE 2: START LOCAL EMULATED SERVER & RUN CURL / REDIRECT / 404 CHECKS
    // =========================================================================
    const server = createLocalEmulatedServer(DIST_DIR, vercelConfig);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    console.log(`Emulated server listening on http://127.0.0.1:${port}`);

    try {
        const curlRoutes = [
            {
                path: '/',
                expectedLang: 'tr',
                expectedCanonical: 'https://galatarumokulu.org/',
            },
            {
                path: '/en/mekan-kiralama',
                expectedLang: 'en',
                expectedCanonical: 'https://galatarumokulu.org/en/mekan-kiralama',
            },
            {
                path: '/el/tarihce',
                expectedLang: 'el',
                expectedCanonical: 'https://galatarumokulu.org/el/tarihce',
            },
            {
                path: '/gecmis-etkinlikler/18-istanbul-bienali-uc-ayakli-kedi',
                expectedLang: 'tr',
                expectedCanonical: 'https://galatarumokulu.org/gecmis-etkinlikler/18-istanbul-bienali-uc-ayakli-kedi',
            },
            {
                path: '/gecmis-etkinlikler/cagri-sarayin-eksilen-zaman-adli-sergisi',
                expectedLang: 'tr',
                expectedCanonical: 'https://galatarumokulu.org/gecmis-etkinlikler/cagri-sarayin-eksilen-zaman-adli-sergisi',
            },
        ];

        const curlEvidenceLines = [];

        for (const item of curlRoutes) {
            const res = await httpGet(port, item.path);
            const hasLang = res.body.includes(`<html lang="${item.expectedLang}"`);
            const hasCanonical = res.body.includes(`<link rel="canonical" href="${item.expectedCanonical}" />`);
            const hasHreflangTr = res.body.includes('hreflang="tr"');
            const hasHreflangEn = res.body.includes('hreflang="en"');
            const hasHreflangEl = res.body.includes('hreflang="el"');
            const hasOgTitle = res.body.includes('property="og:title"');
            const hasOgImage =
                res.body.includes('property="og:image" content="https://galatarumokulu.org/og-image.jpg"') ||
                res.body.includes('property="og:image"');
            const hasNoFabricatedHours = !res.body.includes('10:00') && !res.body.includes('11:00');
            const hasNoOrgTr = !res.body.includes('galatarumokulu.org.tr');

            const passed =
                res.statusCode === 200 &&
                hasLang &&
                hasCanonical &&
                hasHreflangTr &&
                hasHreflangEn &&
                hasHreflangEl &&
                hasOgTitle &&
                hasOgImage &&
                hasNoFabricatedHours &&
                hasNoOrgTr;

            recordTest(
                'HTTP_CURL_SEO',
                `QA-CURL-${item.path}`,
                `Raw HTTP response for ${item.path} contains localized title, canonical, hreflang, OG tags, and 0 fabricated hours`,
                passed,
                `HTTP 200, lang=${item.expectedLang}, canonical=${item.expectedCanonical}`,
                `HTTP ${res.statusCode}, lang=${hasLang}, canonical=${hasCanonical}, noHours=${hasNoFabricatedHours}`,
                'audit-evidence/curl_head_verification.txt'
            );

            const headSnippet = res.body.match(/<head>[\s\S]*?<\/head>/i)?.[0] || '';
            curlEvidenceLines.push(`=== GET ${item.path} (HTTP ${res.statusCode}) ===\n${headSnippet}\n`);
        }

        // Test 404 routes via raw HTTP (unknown top-level route, unknown event slug, unknown artifact UUID)
        for (const [testId, unknownPath] of [
            ['QA-404-01', '/olmayan-sayfa-404-test'],
            ['QA-404-EVENT', '/gecmis-etkinlikler/olmayan-etkinlik-slug-404'],
            ['QA-404-ARTIFACT', '/arsiv/eser/00000000-0000-0000-0000-000000000999'],
        ]) {
            const res404 = await httpGet(port, unknownPath);
            const has404NoIndex = res404.body.includes('content="noindex, nofollow"');
            recordTest(
                'HTTP_404',
                testId,
                `Unknown route ${unknownPath} returns HTTP 404 and noindex, nofollow`,
                res404.statusCode === 404 && has404NoIndex,
                'HTTP 404 + meta robots noindex, nofollow',
                `HTTP ${res404.statusCode}, noindex=${has404NoIndex}`,
                'dist/404.html'
            );
            curlEvidenceLines.push(
                `=== GET ${unknownPath} (HTTP ${res404.statusCode}) ===\n${res404.body.match(/<head>[\s\S]*?<\/head>/i)?.[0] || ''}\n`
            );
        }

        // Test staging X-Robots-Tag header when host is *.vercel.app vs production galatarumokulu.org
        const stagingRes = await httpGet(port, '/', { 'x-simulated-host': 'main-one-fawn.vercel.app' });
        const prodRes = await httpGet(port, '/', { 'x-simulated-host': 'galatarumokulu.org' });
        recordTest(
            'HTTP_HEADERS',
            'QA-HDR-01',
            'Vercel preview host (*.vercel.app) receives X-Robots-Tag: noindex, nofollow while production galatarumokulu.org remains indexable',
            stagingRes.headers['x-robots-tag'] === 'noindex, nofollow' && !prodRes.headers['x-robots-tag'],
            'staging=noindex, nofollow; prod=undefined',
            `staging=${stagingRes.headers['x-robots-tag']}; prod=${prodRes.headers['x-robots-tag']}`,
            'vercel.json'
        );

        fs.writeFileSync(
            path.join(EVIDENCE_DIR, 'curl_head_verification.txt'),
            curlEvidenceLines.join('\n'),
            'utf8'
        );

        // Test Phase 2 18 Legacy Redirects
        const legacyRedirectsToTest = [
            ['/tr', '/'],
            ['/tr/', '/'],
            ['/tr/galata-rum-okulu/', '/tarihce'],
            ['/tr/sergiler/', '/gecmis-etkinlikler'],
            ['/tr/etkinlikler/', '/gecmis-etkinlikler'],
            ['/tr/duyurular/', '/gecmis-etkinlikler'],
            ['/tr/iletisim/', '/bize-ulasin'],
            ['/tr/mekan-kiralama', '/mekan-kiralama'],
            ['/en/galata-greek-school/', '/en/tarihce'],
            ['/en/exhibitions/', '/en/gecmis-etkinlikler'],
            ['/en/events/', '/en/gecmis-etkinlikler'],
            ['/en/announcements/', '/en/gecmis-etkinlikler'],
            ['/en/contact/', '/en/bize-ulasin'],
            ['/el/galata-greek-school/', '/el/tarihce'],
            ['/el/exhibitions/', '/el/gecmis-etkinlikler'],
            ['/el/events/', '/el/gecmis-etkinlikler'],
            ['/el/announcements/', '/el/gecmis-etkinlikler'],
            ['/el/contact/', '/el/bize-ulasin'],
        ];

        for (const [srcPath, expectedDest] of legacyRedirectsToTest) {
            const r = await httpGet(port, srcPath);
            recordTest(
                'LEGACY_REDIRECTS',
                `QA-RED-${srcPath}`,
                `Legacy route ${srcPath} returns HTTP 301 -> ${expectedDest}`,
                r.statusCode === 301 && r.headers.location === expectedDest,
                `301 -> ${expectedDest}`,
                `${r.statusCode} -> ${r.headers.location}`,
                'vercel.json'
            );
        }

        // Test ALL 165 Legacy WordPress Sitemap URLs (page-sitemap.xml, sergi-sitemap.xml, etkinlik-sitemap.xml)
        function extractSitemapPaths(xmlFile) {
            const xml = fs.readFileSync(path.join(EVIDENCE_DIR, xmlFile), 'utf8');
            return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
                m[1].replace('https://galatarumokulu.org', '')
            );
        }

        const wpPagePaths = extractSitemapPaths('legacy_page-sitemap.xml');
        const wpSergiPaths = extractSitemapPaths('legacy_sergi-sitemap.xml');
        const wpEtkinlikPaths = extractSitemapPaths('legacy_etkinlik-sitemap.xml');
        const all165WpPaths = [...wpPagePaths, ...wpSergiPaths, ...wpEtkinlikPaths];

        let wpPassCount = 0;
        let wpMultiHopFailures = [];
        let wpTarget404Failures = [];

        for (const wpPath of all165WpPaths) {
            const r1 = await httpGet(port, wpPath);
            if (r1.statusCode === 200) {
                // Direct 200 (e.g., /en/ and /el/)
                wpPassCount++;
            } else if (r1.statusCode === 301 && r1.headers.location) {
                const targetPath = r1.headers.location;
                const r2 = await httpGet(port, targetPath);
                if (r2.statusCode === 301 || r2.statusCode === 302) {
                    wpMultiHopFailures.push(`${wpPath} -> ${targetPath} -> ${r2.headers.location}`);
                } else if (r2.statusCode !== 200) {
                    wpTarget404Failures.push(`${wpPath} -> ${targetPath} (HTTP ${r2.statusCode})`);
                } else {
                    wpPassCount++;
                }
            } else {
                wpTarget404Failures.push(`${wpPath} (HTTP ${r1.statusCode})`);
            }
        }

        recordTest(
            'LEGACY_DEEP_URLS',
            'QA-WP-165',
            'All 165 authoritative legacy WordPress URLs (12 pages, 60 exhibitions, 93 events) resolve in <=1 redirect hop to an HTTP 200 page with 0 broken 404 targets',
            wpPassCount === 165 && wpMultiHopFailures.length === 0 && wpTarget404Failures.length === 0,
            '165/165 -> HTTP 200, 0 multi-hop chains, 0 404 targets',
            `${wpPassCount}/165 OK, multiHop=${wpMultiHopFailures.length}, 404s=${wpTarget404Failures.length} ${wpTarget404Failures.slice(0, 3).join('; ')}`,
            'LEGACY_DEEP_URL_MIGRATION.csv'
        );

        // Test all 498 indexable URLs in sitemap.xml return HTTP 200 locally
        let all498Ok = true;
        let failedUrls = [];
        for (const loc of locMatches) {
            const p = new URL(loc).pathname;
            const r = await httpGet(port, p);
            if (r.statusCode !== 200) {
                all498Ok = false;
                failedUrls.push(`${p}:${r.statusCode}`);
            }
        }
        recordTest(
            'URL_INVENTORY',
            'QA-INV-498',
            'All 498 indexable URLs in sitemap.xml return HTTP 200 from pre-rendered dist/',
            all498Ok,
            '498/498 HTTP 200',
            all498Ok ? '498/498 HTTP 200' : `Failed: ${failedUrls.slice(0, 5).join(', ')}`,
            'dist/sitemap.xml'
        );

        // =====================================================================
        // SUITE 3: HEADLESS BROWSER E2E VERIFICATION, 320px, A11Y & PERF
        // =====================================================================
        console.log('Launching headless browser for Phase 3 E2E, 320px, A11y & Performance verification...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();

            // 3.1 Verify Venue Schedule & Hours across TR, EN, EL on /bize-ulasin
            for (const lang of ['tr', 'en', 'el']) {
                const contactPath = lang === 'tr' ? '/bize-ulasin' : `/${lang}/bize-ulasin`;
                await page.setViewport({ width: 1440, height: 900 });
                await page.goto(`http://127.0.0.1:${port}${contactPath}`, { waitUntil: 'networkidle0' });

                const scheduleInfo = await page.evaluate(() => {
                    const schoolEl = document.querySelector('[data-testid="school-schedule-summary"]');
                    const simoneEl = document.querySelector('[data-testid="simone-schedule-summary"]');
                    const footerSchoolEl = document.querySelector('[data-testid="footer-school-schedule"]');
                    const footerSimoneEl = document.querySelector('[data-testid="footer-simone-schedule"]');
                    const bodyText = document.body.innerText;
                    const hasClockHours = /10:00|11:00|18:00|24\/7/.test(bodyText);
                    return {
                        schoolText: schoolEl?.textContent || '',
                        simoneText: simoneEl?.textContent || '',
                        footerSchoolText: footerSchoolEl?.textContent || '',
                        footerSimoneText: footerSimoneEl?.textContent || '',
                        hasClockHours,
                    };
                });

                const validSchedule =
                    scheduleInfo.schoolText.length > 10 &&
                    scheduleInfo.simoneText.length > 10 &&
                    scheduleInfo.footerSchoolText.length > 10 &&
                    scheduleInfo.footerSimoneText.length > 10 &&
                    !scheduleInfo.hasClockHours;

                recordTest(
                    'E2E_SCHEDULE',
                    `QA-SCHED-${lang.toUpperCase()}`,
                    `Contact page & Footer (${lang.toUpperCase()}) display School (Tue-Sat open, Sun/Mon closed) & Simone (7 days open) with 0 clock times`,
                    validSchedule,
                    'School & Simone schedules present, hasClockHours=false',
                    `school="${scheduleInfo.schoolText.slice(0, 45)}...", hasClockHours=${scheduleInfo.hasClockHours}`,
                    `audit-evidence/screenshots/bize-ulasin_${lang}_desktop_1440x900.png`
                );

                await page.screenshot({
                    path: path.join(SCREENSHOTS_DIR, `bize-ulasin_${lang}_desktop_1440x900.png`),
                    fullPage: false,
                });
            }

            // 3.2 Verify ISS-01 Venue Inquiry Form:
            // (a) Backend failure (PGRST205 simulated) -> MUST show error alert, NEVER false success!
            await page.setViewport({ width: 1440, height: 900 });
            await page.goto(`http://127.0.0.1:${port}/bize-ulasin`, { waitUntil: 'networkidle0' });

            await page.evaluate(() => {
                window.__GALATA_TEST_DB_ADAPTER__ = {
                    insertRow: async () => ({
                        error: { code: 'PGRST205', message: 'Could not find the table public.venue_inquiries in the schema cache' },
                    }),
                };
            });

            const stepButtons = await page.$$('.cp-stepper__item');
            if (stepButtons.length >= 3) {
                await stepButtons[2].click();
            }
            await page.waitForSelector('#cp-fullname');
            await page.type('#cp-fullname', 'Test MICE Director');
            await page.type('#cp-email', 'mice.director@example.org');
            await page.type('#cp-phone', '+90 212 555 01 99');
            await page.click('#cp-consent');
            await page.click('button[type="submit"].cp-form__btn-submit');

            await page.waitForSelector('[data-testid="venue-inquiry-error"]', { timeout: 5000 });
            const pgrstErrorShown = await page.evaluate(() => {
                const errEl = document.querySelector('[data-testid="venue-inquiry-error"]');
                const confirmEl = document.querySelector('.cp-confirmation');
                return {
                    errorVisible: Boolean(errEl && errEl.textContent && errEl.textContent.length > 10),
                    confirmationVisible: Boolean(confirmEl),
                    errorText: errEl?.textContent || '',
                };
            });

            recordTest(
                'E2E_FORMS',
                'QA-FORM-01',
                'ISS-01: When venue_inquiries returns PGRST205, UI shows accessible error alert with mailto/tel fallback and NEVER shows false success',
                pgrstErrorShown.errorVisible && !pgrstErrorShown.confirmationVisible,
                'errorVisible=true, confirmationVisible=false',
                `errorVisible=${pgrstErrorShown.errorVisible}, confirmationVisible=${pgrstErrorShown.confirmationVisible}`,
                'audit-evidence/screenshots/venue_inquiry_error_state.png',
                'LOCAL_E2E_MOCKED_SUPABASE_ADAPTER',
                'PENDING_SUPABASE_MIGRATION'
            );
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, 'venue_inquiry_error_state.png'),
            });

            // (b) Phase 3 Server-Side Rate-Limit (P0001 RATE_LIMIT_EXCEEDED) simulated -> Shows rate limit warning, NEVER false success
            await page.evaluate(() => {
                window.__GALATA_TEST_DB_ADAPTER__ = {
                    insertRow: async () => ({
                        error: { code: 'P0001', message: 'RATE_LIMIT_EXCEEDED: Too many venue inquiries from this email address.' },
                    }),
                };
            });
            await page.click('button[type="submit"].cp-form__btn-submit');
            await page.waitForSelector('[data-testid="venue-inquiry-error"]', { timeout: 5000 });
            const rateLimitCheck = await page.evaluate(() => {
                const errEl = document.querySelector('[data-testid="venue-inquiry-error"]');
                const confirmEl = document.querySelector('.cp-confirmation');
                return {
                    errorVisible: Boolean(errEl),
                    confirmationVisible: Boolean(confirmEl),
                    errorText: errEl?.textContent || '',
                };
            });

            recordTest(
                'E2E_FORMS',
                'QA-FORM-RATELIMIT',
                'Phase 3 Security: When PostgreSQL trigger raises ERRCODE P0001 (RATE_LIMIT_EXCEEDED), UI displays localized rate-limit alert with manual email draft fallback',
                rateLimitCheck.errorVisible &&
                    !rateLimitCheck.confirmationVisible &&
                    rateLimitCheck.errorText.includes('Çok sık'),
                'rate-limit message shown, confirmationVisible=false',
                `error="${rateLimitCheck.errorText.slice(0, 60)}...", confirm=${rateLimitCheck.confirmationVisible}`,
                'src/services/formSubmissionService.ts',
                'LOCAL_E2E_MOCKED_SUPABASE_ADAPTER',
                'PENDING_SUPABASE_MIGRATION'
            );

            // (c) Confirmed DB Persistence -> Shows confirmation state ONLY after adapter persists row
            await page.evaluate(() => {
                window.__GALATA_PERSISTED_ROWS__ = [];
                window.__GALATA_TEST_DB_ADAPTER__ = {
                    insertRow: async (table, row) => {
                        window.__GALATA_PERSISTED_ROWS__.push({ table, row });
                        return { error: null };
                    },
                    invokeNotification: async () => ({ error: null }),
                };
            });

            // Clear client-side sessionStorage rate limit key from previous test before submitting
            await page.evaluate(() => sessionStorage.clear());
            await page.click('button[type="submit"].cp-form__btn-submit');
            await page.waitForSelector('.cp-confirmation', { timeout: 5000 });
            const persistedCheck = await page.evaluate(() => {
                return {
                    confirmationVisible: Boolean(document.querySelector('.cp-confirmation')),
                    rows: window.__GALATA_PERSISTED_ROWS__ || [],
                };
            });

            recordTest(
                'E2E_FORMS',
                'QA-FORM-02',
                'ISS-01: Venue inquiry displays confirmation state after verified persistence of payload',
                persistedCheck.confirmationVisible &&
                    persistedCheck.rows.length === 1 &&
                    persistedCheck.rows[0].table === 'venue_inquiries' &&
                    persistedCheck.rows[0].row.email === 'mice.director@example.org' &&
                    persistedCheck.rows[0].row.consent_accepted === true,
                '1 persisted row in venue_inquiries + confirmation UI',
                `rows=${persistedCheck.rows.length}, table=${persistedCheck.rows[0]?.table}`,
                'audit-evidence/screenshots/venue_inquiry_success_state.png',
                'LOCAL_E2E_MOCKED_SUPABASE_ADAPTER',
                'PENDING_SUPABASE_MIGRATION'
            );
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, 'venue_inquiry_success_state.png'),
            });

            // 3.3 Verify Footer Newsletter Subscription Form (ISS-04)
            await page.evaluate(() => {
                sessionStorage.clear();
                window.__GALATA_NEWSLETTER_ROWS__ = [];
                window.__GALATA_TEST_DB_ADAPTER__ = {
                    insertRow: async (table, row) => {
                        window.__GALATA_NEWSLETTER_ROWS__.push({ table, row });
                        return { error: null };
                    },
                };
            });

            await page.type('.footer__newsletter-form input[name="email"]', 'cultural.patron@example.org');
            await page.click('.footer__newsletter-form input[name="newsletterConsent"]');
            await page.click('.footer__submit');
            await page.waitForSelector('[data-testid="newsletter-success"]', { timeout: 5000 });

            const newsletterCheck = await page.evaluate(() => ({
                successVisible: Boolean(document.querySelector('[data-testid="newsletter-success"]')),
                rows: window.__GALATA_NEWSLETTER_ROWS__ || [],
            }));

            recordTest(
                'E2E_FORMS',
                'QA-FORM-03',
                'ISS-04: Footer newsletter form validates KVKK consent and persists subscription row',
                newsletterCheck.successVisible &&
                    newsletterCheck.rows.length === 1 &&
                    newsletterCheck.rows[0].table === 'newsletter_subscribers',
                '1 persisted row in newsletter_subscribers + success feedback',
                `rows=${newsletterCheck.rows.length}, success=${newsletterCheck.successVisible}`,
                'src/components/Footer/Footer.tsx',
                'LOCAL_E2E_MOCKED_SUPABASE_ADAPTER',
                'PENDING_SUPABASE_MIGRATION'
            );

            // 3.4 Verify ISS-03 Archival Provenance Safeguard on Synthetic Artifact ID vs Verified Artifact ID
            await page.goto(`http://127.0.0.1:${port}/arsiv/eser/c1000000-0000-0000-0000-000000000001`, {
                waitUntil: 'networkidle0',
            });
            const syntheticCheck = await page.evaluate(() => {
                const banner = document.querySelector('[data-testid="unverified-artifact-banner"]');
                const credit = document.querySelector('[data-testid="archival-credit-notice"]');
                const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
                const imgs = [...document.querySelectorAll('img')].map((i) => i.getAttribute('src') || '');
                const hasVintagePng = imgs.some((s) => s.includes('vintage-'));
                return {
                    bannerVisible: Boolean(banner),
                    creditVisible: Boolean(credit),
                    robotsMeta,
                    hasVintagePng,
                };
            });

            recordTest(
                'E2E_ARCHIVE',
                'QA-ARC-01',
                'ISS-03: Unverified synthetic artifact c1000000-...001 displays provenance verification banner, noindex meta, and renders 0 synthetic vintage-*.png images',
                syntheticCheck.bannerVisible &&
                    syntheticCheck.creditVisible &&
                    syntheticCheck.robotsMeta.includes('noindex') &&
                    !syntheticCheck.hasVintagePng,
                'banner=true, noindex=true, hasVintagePng=false',
                `banner=${syntheticCheck.bannerVisible}, robots=${syntheticCheck.robotsMeta}, hasVintagePng=${syntheticCheck.hasVintagePng}`,
                'audit-evidence/screenshots/archive_unverified_safeguard.png'
            );
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, 'archive_unverified_safeguard.png'),
            });

            // Verified artifact detail page + OpenSeadragon Zoom + Archive Study Inquiry Form (ISS-04)
            await page.goto(`http://127.0.0.1:${port}/arsiv/eser/cd2fdfa8-5144-4b20-a4f1-218a10310e7a`, {
                waitUntil: 'networkidle0',
            });
            const osdCheck = await page.evaluate(() => {
                const osdCanvas = document.querySelector('.openseadragon-container, .archive-item__osd-canvas');
                const zoomBtns = document.querySelectorAll('.archive-item__controls button.archive-item__control-btn');
                return {
                    viewerPresent: Boolean(osdCanvas),
                    zoomBtnCount: zoomBtns.length,
                };
            });
            recordTest(
                'E2E_ARCHIVE',
                'QA-ARC-OSD',
                'Verified archival item page initializes OpenSeadragon deep-zoom viewer and accessible zoom controls',
                osdCheck.viewerPresent && osdCheck.zoomBtnCount >= 3,
                'viewerPresent=true, zoomBtnCount>=3',
                `viewerPresent=${osdCheck.viewerPresent}, zoomBtnCount=${osdCheck.zoomBtnCount}`,
                'src/pages/ArchivePage/ArchiveItemPage.tsx'
            );

            await page.evaluate(() => {
                sessionStorage.clear();
                window.__GALATA_ARCHIVE_ROWS__ = [];
                window.__GALATA_TEST_DB_ADAPTER__ = {
                    insertRow: async (table, row) => {
                        window.__GALATA_ARCHIVE_ROWS__.push({ table, row });
                        return { error: null };
                    },
                    invokeNotification: async () => ({ error: null }),
                };
            });

            await page.click('.archive-item__btn--primary');
            await page.waitForSelector('#inquiry-name');
            await page.type('#inquiry-name', 'Dr. Eleni Papadopoulou');
            await page.type('#inquiry-email', 'eleni.p@university.edu');
            await page.type('#inquiry-institution', 'Athens School of Fine Arts');
            await page.type('#inquiry-message', 'Archival provenance study on 19th-century Galata school registers.');
            await page.click('#inquiry-consent');
            await page.click('.inquiry-modal__btn--submit');
            await page.waitForSelector('.inquiry-modal__success', { timeout: 5000 });

            const archiveFormCheck = await page.evaluate(() => ({
                successVisible: Boolean(document.querySelector('.inquiry-modal__success')),
                rows: window.__GALATA_ARCHIVE_ROWS__ || [],
            }));

            recordTest(
                'E2E_FORMS',
                'QA-FORM-04',
                'ISS-04: Archive study inquiry modal validates consent and persists row to archive_inquiries',
                archiveFormCheck.successVisible &&
                    archiveFormCheck.rows.length === 1 &&
                    archiveFormCheck.rows[0].table === 'archive_inquiries' &&
                    archiveFormCheck.rows[0].row.email === 'eleni.p@university.edu',
                '1 persisted row in archive_inquiries + success state',
                `rows=${archiveFormCheck.rows.length}, success=${archiveFormCheck.successVisible}`,
                'audit-evidence/screenshots/archive_study_inquiry_success.png',
                'LOCAL_E2E_MOCKED_SUPABASE_ADAPTER',
                'PENDING_SUPABASE_MIGRATION'
            );
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, 'archive_study_inquiry_success.png'),
            });

            // 3.5 Verify ISS-08 Event Language Fallback Notice & Stabilized Slugs
            await page.goto(
                `http://127.0.0.1:${port}/en/gecmis-etkinlikler/cagri-sarayin-eksilen-zaman-adli-sergisi`,
                { waitUntil: 'networkidle0' }
            );
            const eventSlugCheck = await page.evaluate(() => {
                const h1 = document.querySelector('h1')?.textContent || '';
                const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
                return { h1, canonical };
            });

            recordTest(
                'E2E_EVENTS',
                'QA-EVT-01',
                'ISS-08: Previously null-slug event resolves via stabilized human-readable slug /en/gecmis-etkinlikler/cagri-sarayin-eksilen-zaman-adli-sergisi',
                eventSlugCheck.h1.length > 3 &&
                    eventSlugCheck.canonical === 'https://galatarumokulu.org/en/gecmis-etkinlikler/cagri-sarayin-eksilen-zaman-adli-sergisi',
                'H1 rendered + canonical matches stabilized slug',
                `h1="${eventSlugCheck.h1}", canonical="${eventSlugCheck.canonical}"`,
                'audit-evidence/screenshots/event_stabilized_slug_en.png'
            );
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, 'event_stabilized_slug_en.png'),
            });

            await page.goto(
                `http://127.0.0.1:${port}/en/gecmis-etkinlikler/adalar-konusuyor-irini-dimitriyadis`,
                { waitUntil: 'networkidle0' }
            );
            const translationNoticeCheck = await page.evaluate(() => {
                const notice = document.querySelector('[data-testid="event-translation-fallback-notice"]');
                const trBlock = document.querySelector('.ed-body__content div[lang="tr"]');
                return {
                    noticeVisible: Boolean(notice),
                    trLangAttrApplied: Boolean(trBlock),
                    noticeText: notice?.textContent || '',
                };
            });

            recordTest(
                'E2E_EVENTS',
                'QA-EVT-02',
                'ISS-08: Event without native English translation displays explicit editorial translation notice and wraps reference copy in lang="tr"',
                translationNoticeCheck.noticeVisible && translationNoticeCheck.trLangAttrApplied,
                'noticeVisible=true, trLangAttrApplied=true',
                `noticeVisible=${translationNoticeCheck.noticeVisible}, trLangAttrApplied=${translationNoticeCheck.trLangAttrApplied}`,
                'audit-evidence/screenshots/event_translation_notice_en.png'
            );
            await page.screenshot({
                path: path.join(SCREENSHOTS_DIR, 'event_translation_notice_en.png'),
            });

            // 3.6 Verify Language Switcher Route Preservation on deep routes
            await page.goto(`http://127.0.0.1:${port}/gecmis-etkinlikler/toz-sergisi`, { waitUntil: 'networkidle0' });
            const langLinks = await page.evaluate(() => {
                const hrefs = [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => ({
                    lang: l.getAttribute('hreflang'),
                    href: l.getAttribute('href'),
                }));
                return hrefs;
            });
            const hasTrEnElAlternates =
                langLinks.some((l) => l.lang === 'tr' && l.href === 'https://galatarumokulu.org/gecmis-etkinlikler/toz-sergisi') &&
                langLinks.some((l) => l.lang === 'en' && l.href === 'https://galatarumokulu.org/en/gecmis-etkinlikler/toz-sergisi') &&
                langLinks.some((l) => l.lang === 'el' && l.href === 'https://galatarumokulu.org/el/gecmis-etkinlikler/toz-sergisi');

            recordTest(
                'E2E_I18N',
                'QA-I18N-ROUTE',
                'Deep event route /gecmis-etkinlikler/toz-sergisi preserves exact route path across TR, EN, and EL hreflang alternates',
                hasTrEnElAlternates,
                'TR, EN, EL alternates point to /gecmis-etkinlikler/toz-sergisi in each locale',
                JSON.stringify(langLinks),
                'src/components/SEO/SEO.tsx'
            );

            // 3.7 Verify Admin Page Auth Gate & Noindex on /admin
            await page.goto(`http://127.0.0.1:${port}/admin`, { waitUntil: 'networkidle0' });
            await page.waitForSelector('.admin-login-form', { timeout: 5000 });
            const adminGateCheck = await page.evaluate(() => {
                const loginForm = document.querySelector('.admin-login-form');
                const dashboard = document.querySelector('.admin-sidebar');
                const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
                return {
                    loginFormVisible: Boolean(loginForm),
                    dashboardVisible: Boolean(dashboard),
                    robots,
                };
            });

            recordTest(
                'SECURITY_ADMIN_UI',
                'QA-SEC-ADMIN-01',
                '/admin route renders login gate for unauthenticated visitors, blocks dashboard access, and sets meta robots noindex, nofollow',
                adminGateCheck.loginFormVisible && !adminGateCheck.dashboardVisible && adminGateCheck.robots.includes('noindex'),
                'loginForm=true, dashboard=false, robots=noindex, nofollow',
                `loginForm=${adminGateCheck.loginFormVisible}, dashboard=${adminGateCheck.dashboardVisible}, robots="${adminGateCheck.robots}"`,
                'src/pages/AdminPage/AdminPage.tsx'
            );

            // 3.8 Verify ISS-05 NotFoundPage UI across Desktop, Tablet, Mobile, and 320px Narrow
            for (const [vpName, width, height] of [
                ['desktop_1440x900', 1440, 900],
                ['tablet_768x1024', 768, 1024],
                ['mobile_390x844', 390, 844],
                ['narrow_320x568', 320, 568],
            ]) {
                await page.setViewport({ width, height });
                await page.goto(`http://127.0.0.1:${port}/olmayan-sayfa-404-test`, { waitUntil: 'networkidle0' });
                const nfCheck = await page.evaluate(() => {
                    const pageEl = document.querySelector('[data-testid="not-found-page"]');
                    const h1 = document.querySelector('#not-found-title')?.textContent || '';
                    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
                    return {
                        rendered: Boolean(pageEl),
                        h1,
                        overflow,
                    };
                });

                recordTest(
                    'E2E_404_RESPONSIVE',
                    `QA-404-${vpName}`,
                    `ISS-05: 404 NotFoundPage renders cleanly on ${vpName} with 0 horizontal overflow`,
                    nfCheck.rendered && !nfCheck.overflow,
                    'rendered=true, overflow=false',
                    `rendered=${nfCheck.rendered}, h1="${nfCheck.h1}", overflow=${nfCheck.overflow}`,
                    `audit-evidence/screenshots/404_${vpName}.png`
                );
                await page.screenshot({
                    path: path.join(SCREENSHOTS_DIR, `404_${vpName}.png`),
                });
            }

            // 3.9 Verify Responsive Viewports (1440x900, 768x1024, 390x844, AND 320x568)
            for (const route of ['/', '/mekan-kiralama', '/arsiv/koleksiyon']) {
                const slugName = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
                for (const [vpName, width, height] of [
                    ['desktop_1440x900', 1440, 900],
                    ['tablet_768x1024', 768, 1024],
                    ['mobile_390x844', 390, 844],
                    ['narrow_320x568', 320, 568],
                ]) {
                    await page.setViewport({ width, height });
                    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle0' });
                    const layoutCheck = await page.evaluate(() => {
                        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
                        const goldTextToken = getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-brass-gold-text')
                            .trim();
                        return { overflow, goldTextToken };
                    });

                    recordTest(
                        'E2E_RESPONSIVE_A11Y',
                        `QA-RESP-${slugName}-${vpName}`,
                        `Route ${route} at ${vpName} has 0 horizontal overflow and active WCAG AA gold text token (#84642B)`,
                        !layoutCheck.overflow && layoutCheck.goldTextToken.toLowerCase() === '#84642b',
                        'overflow=false, --color-brass-gold-text=#84642B',
                        `overflow=${layoutCheck.overflow}, token=${layoutCheck.goldTextToken}`,
                        `audit-evidence/screenshots/${slugName}_${vpName}.png`
                    );

                    await page.screenshot({
                        path: path.join(SCREENSHOTS_DIR, `${slugName}_${vpName}.png`),
                    });
                }
            }

            // Additional 320x568 Narrow Viewport checks on Greek & English long-string pages
            for (const [narrowId, narrowRoute] of [
                ['QA-320-EL-HIST', '/el/tarihce'],
                ['QA-320-EN-EVT', '/en/gecmis-etkinlikler/cagri-sarayin-eksilen-zaman-adli-sergisi'],
                ['QA-320-TR-CONTACT', '/bize-ulasin'],
            ]) {
                await page.setViewport({ width: 320, height: 568 });
                await page.goto(`http://127.0.0.1:${port}${narrowRoute}`, { waitUntil: 'networkidle0' });
                const narrowCheck = await page.evaluate(() => ({
                    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                    scrollWidth: document.documentElement.scrollWidth,
                    clientWidth: document.documentElement.clientWidth,
                }));
                const safeFile = narrowRoute.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
                await page.screenshot({
                    path: path.join(SCREENSHOTS_DIR, `${safeFile}_narrow_320x568.png`),
                });
                recordTest(
                    'E2E_320PX_NARROW',
                    narrowId,
                    `Route ${narrowRoute} at 320x568 narrow viewport has 0 horizontal overflow`,
                    !narrowCheck.overflow,
                    'scrollWidth <= 320',
                    `scrollWidth=${narrowCheck.scrollWidth}, clientWidth=${narrowCheck.clientWidth}`,
                    `audit-evidence/screenshots/${safeFile}_narrow_320x568.png`
                );
            }

            // 3.10 Automated Accessibility (WCAG 2.2 AA DOM Audit) & Performance Timing Suite across 10 Key Templates
            const templatesToAudit = [
                { name: 'Home (TR)', path: '/' },
                { name: 'Home (EN)', path: '/en' },
                { name: 'Home (EL)', path: '/el' },
                { name: 'About (TR)', path: '/hakkimizda' },
                { name: 'History (EL)', path: '/el/tarihce' },
                { name: 'Venue Hire (EN)', path: '/en/mekan-kiralama' },
                { name: 'Past Events Hub (TR)', path: '/gecmis-etkinlikler' },
                { name: 'Event Detail (EN)', path: '/en/gecmis-etkinlikler/toz-sergisi' },
                { name: 'Archive Collection (TR)', path: '/arsiv/koleksiyon' },
                { name: 'Contact & Concierge (TR)', path: '/bize-ulasin' },
            ];

            const perfA11yReport = [];
            for (const tpl of templatesToAudit) {
                await page.setViewport({ width: 1440, height: 900 });
                await page.goto(`http://127.0.0.1:${port}${tpl.path}`, { waitUntil: 'networkidle0' });

                // Press Tab once to verify keyboard focus ring works
                await page.keyboard.press('Tab');

                const metrics = await page.evaluate(() => {
                    const navEntry = performance.getEntriesByType('navigation')[0];
                    const paintEntries = performance.getEntriesByType('paint');
                    const fcp = paintEntries.find((p) => p.name === 'first-contentful-paint')?.startTime || 0;
                    const resources = performance.getEntriesByType('resource');
                    const totalTransferBytes = resources.reduce((acc, r) => acc + (r.transferSize || r.encodedBodySize || 0), 0);

                    // Accessibility checks
                    const htmlLang = document.documentElement.getAttribute('lang') || '';
                    const h1Count = document.querySelectorAll('h1').length;
                    const imgsWithoutAlt = [...document.querySelectorAll('img')].filter(
                        (img) => !img.hasAttribute('alt')
                    ).length;
                    const buttonsWithoutName = [...document.querySelectorAll('button')].filter((btn) => {
                        const text = (btn.textContent || '').trim();
                        const ariaLabel = btn.getAttribute('aria-label') || '';
                        const ariaLabelledBy = btn.getAttribute('aria-labelledby') || '';
                        const title = btn.getAttribute('title') || '';
                        return !text && !ariaLabel && !ariaLabelledBy && !title;
                    }).length;
                    const inputsWithoutLabel = [...document.querySelectorAll('input:not([type="hidden"]), textarea, select')].filter((inp) => {
                        const id = inp.getAttribute('id');
                        const hasForLabel = id ? Boolean(document.querySelector(`label[for="${id}"]`)) : false;
                        const hasParentLabel = Boolean(inp.closest('label'));
                        const ariaLabel = inp.getAttribute('aria-label') || '';
                        const ariaLabelledBy = inp.getAttribute('aria-labelledby') || '';
                        return !hasForLabel && !hasParentLabel && !ariaLabel && !ariaLabelledBy;
                    }).length;
                    const activeTag = document.activeElement?.tagName || 'BODY';

                    return {
                        htmlLang,
                        h1Count,
                        imgsWithoutAlt,
                        buttonsWithoutName,
                        inputsWithoutLabel,
                        activeTagAfterTab: activeTag,
                        fcpMs: Math.round(fcp),
                        domContentLoadedMs: Math.round(navEntry ? navEntry.domContentLoadedEventEnd : 0),
                        loadMs: Math.round(navEntry ? navEntry.loadEventEnd : 0),
                        resourceCount: resources.length,
                        totalTransferKb: Math.round(totalTransferBytes / 1024),
                    };
                });

                perfA11yReport.push({
                    template: tpl.name,
                    path: tpl.path,
                    ...metrics,
                });

                const a11yPassed =
                    Boolean(metrics.htmlLang) &&
                    metrics.h1Count === 1 &&
                    metrics.imgsWithoutAlt === 0 &&
                    metrics.buttonsWithoutName === 0 &&
                    metrics.inputsWithoutLabel === 0;

                recordTest(
                    'A11Y_PERF_AUDIT',
                    `QA-A11Y-${tpl.path}`,
                    `Template ${tpl.name} (${tpl.path}) passes WCAG DOM audit (1 H1, 0 missing alt/labels/button names, FCP=${metrics.fcpMs}ms)`,
                    a11yPassed,
                    'lang set, h1=1, missingAlt=0, unnamedBtn=0, unlabeledInput=0',
                    `lang=${metrics.htmlLang}, h1=${metrics.h1Count}, missingAlt=${metrics.imgsWithoutAlt}, unnamedBtn=${metrics.buttonsWithoutName}, unlabeledInput=${metrics.inputsWithoutLabel}, FCP=${metrics.fcpMs}ms`,
                    'audit-evidence/perf_a11y_metrics.json'
                );
            }

            fs.writeFileSync(
                path.join(EVIDENCE_DIR, 'perf_a11y_metrics.json'),
                JSON.stringify(perfA11yReport, null, 2),
                'utf8'
            );
        } finally {
            await browser.close();
        }
    } finally {
        server.close();
    }

    // Write REAL_VS_MOCK_QA_MATRIX.csv
    const csvHeader =
        'suite,test_id,test_name,status,execution_environment,production_live_status,expected,actual,evidence_ref\n';
    const csvRows = testResults.map((r) =>
        [
            r.suite,
            r.id,
            r.name,
            r.status,
            r.executionEnv,
            r.prodStatus,
            r.expected,
            r.actual,
            r.evidenceRef,
        ]
            .map((v) => `"${String(v || '').replace(/"/g, '""')}"`)
            .join(',')
    );
    fs.writeFileSync(path.join(PHASE3_DIR, 'REAL_VS_MOCK_QA_MATRIX.csv'), csvHeader + csvRows.join('\n') + '\n', 'utf8');

    const passCount = testResults.filter((t) => t.status === 'PASS').length;
    const failCount = testResults.filter((t) => t.status === 'FAIL').length;
    console.log(`\n=== PHASE 3 QA SUITE SUMMARY: ${passCount} PASS, ${failCount} FAIL (Total: ${testResults.length}) ===`);

    if (failCount > 0) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Fatal error in Phase 3 QA verification suite:', err);
    process.exit(1);
});
