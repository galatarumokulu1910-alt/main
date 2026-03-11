/**
 * Scrape descriptions for events that don't have one.
 * 
 * Tries multiple URL patterns from galatarumokulu.org:
 *   /tr/etkinlik/{slug}/
 *   /tr/sergi/{slug}/
 *   /tr/konser/{slug}/ etc.
 * 
 * Also scrapes /tr/sergiler/ page for exhibition links.
 * 
 * Extracts text from class="col span_7 text_icerik"
 * 
 * Usage: node scripts/scrape-descriptions.mjs
 */

const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';

const URL_PREFIXES = [
    'etkinlik', 'sergi', 'konser', 'gala', 'performans',
    'tiyatro', 'film', 'konferans', 'atolye', 'bulusma',
    'soylesi', 'okuma', 'konusma',
];

function decodeHtmlEntities(text) {
    return text
        .replace(/&#8211;/g, '\u2013').replace(/&#8212;/g, '\u2014')
        .replace(/&#8216;/g, '\u2018').replace(/&#8217;/g, '\u2019')
        .replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&rsquo;/g, '\u2019')
        .replace(/&lsquo;/g, '\u2018').replace(/&rdquo;/g, '\u201D').replace(/&ldquo;/g, '\u201C')
        .replace(/&ndash;/g, '\u2013').replace(/&mdash;/g, '\u2014').replace(/&nbsp;/g, ' ')
        .replace(/&#\d+;/g, '').replace(/&[a-z]+;/gi, '');
}

function slugify(text) {
    const map = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
        '\u201C': '', '\u201D': '', '\u2018': '', '\u2019': '', '"': '', "'": ''
    };
    let s = text;
    for (const [from, to] of Object.entries(map)) s = s.split(from).join(to);
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
        .replace(/^-|-$/g, '').substring(0, 100);
}

function extractDescription(html) {
    let clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Primary: look for "col span_7 text_icerik"
    let contentMatch = clean.match(/class="col\s+span_7\s+text_icerik">([\s\S]*?)(?:<\/div>\s*<\/div>\s*<\/div>|<div[^>]*class="[^"]*portfolio-pag)/i);
    if (!contentMatch) {
        contentMatch = clean.match(/class="col\s+span_7\s+text_icerik">([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) {
        contentMatch = clean.match(/class="[^"]*text_icerik[^"]*">([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) {
        contentMatch = clean.match(/class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) return '';

    let content = contentMatch[1];
    const paragraphs = [];

    // Try <p> tags first
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = pRegex.exec(content)) !== null) {
        let text = m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        text = decodeHtmlEntities(text);
        if (text && text.length > 5) paragraphs.push(text);
    }

    // If no <p> tags found, try the raw content (strip tags, handle <br>)
    if (paragraphs.length === 0) {
        let text = content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        text = decodeHtmlEntities(text);
        // Split by double newlines into paragraphs
        const rawParas = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 10);
        if (rawParas.length > 0) return rawParas.join('\n\n');
        // Even single block of text
        if (text.length > 10) return text;
    }

    return paragraphs.join('\n\n');
}

async function supabaseGet(select) {
    const url = `${SUPABASE_URL}/rest/v1/past_events?select=${select}&order=event_date.desc`;
    const res = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
}

async function supabaseUpdate(id, data) {
    const url = `${SUPABASE_URL}/rest/v1/past_events?id=eq.${id}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Update failed: ${res.status} ${await res.text()}`);
}

async function scrapeLinksFromPage(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const linkRegex = /href="(https:\/\/galatarumokulu\.org\/tr\/[^"]+)"/gi;
    const links = {};
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
        const u = m[1];
        if (u.endsWith('/etkinlikler/') || u.endsWith('/sergiler/') ||
            u.endsWith('/galata-rum-okulu/') || u.includes('#') ||
            u.endsWith('/tr/')) continue;
        const slug = u.replace(/\/$/, '').split('/').pop();
        if (slug && slug.length > 2) links[slug] = u;
    }
    return links;
}

async function scrapeAllDetailLinks() {
    console.log('🌐 Scraping source pages for all detail links...');
    // Scrape both etkinlikler AND sergiler pages
    const [events, exhibitions] = await Promise.all([
        scrapeLinksFromPage('https://galatarumokulu.org/tr/etkinlikler/'),
        scrapeLinksFromPage('https://galatarumokulu.org/tr/sergiler/')
    ]);
    const all = { ...events, ...exhibitions };
    console.log(`   Events page links: ${Object.keys(events).length}`);
    console.log(`   Sergiler page links: ${Object.keys(exhibitions).length}`);
    console.log(`   Total unique: ${Object.keys(all).length}`);
    return all;
}

// Improved matching: use word-level fuzzy matching
function findMatchingLink(evtTitle, evtSlug, detailLinks) {
    const allSlugs = Object.keys(detailLinks);

    // 1. Exact slug match
    if (allSlugs.includes(evtSlug)) return evtSlug;

    // 2. Slug contains/included
    let match = allSlugs.find(s => evtSlug.includes(s) || s.includes(evtSlug));
    if (match) return match;

    // 3. Key words from title (Turkish-aware)
    const titleSlug = slugify(evtTitle);
    const titleWords = titleSlug.split('-').filter(w => w.length > 3);

    let bestMatch = null, bestScore = 0;
    for (const linkSlug of allSlugs) {
        const linkWords = linkSlug.split('-').filter(w => w.length > 3);
        // Count common significant words
        const overlap = titleWords.filter(w => linkWords.some(lw => lw === w || lw.includes(w) || w.includes(lw))).length;
        // Also check if all link words appear in title
        const reverseOverlap = linkWords.filter(w => titleWords.some(tw => tw === w || tw.includes(w) || w.includes(tw))).length;

        const score = Math.max(overlap, reverseOverlap);
        // At least 2 significant word matches, or link slug has only 1-2 words and they all match
        if (score > bestScore && (score >= 2 || (linkWords.length <= 2 && reverseOverlap === linkWords.length))) {
            bestScore = score;
            bestMatch = linkSlug;
        }
    }

    return bestMatch;
}

async function tryFetchDescription(slug) {
    for (const prefix of URL_PREFIXES) {
        const url = `https://galatarumokulu.org/tr/${prefix}/${slug}/`;
        try {
            const res = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                redirect: 'follow'
            });
            if (res.ok && res.status === 200) {
                const html = await res.text();
                if (html.includes('text_icerik') || html.includes('entry-content')) {
                    const desc = extractDescription(html);
                    if (desc && desc.length > 10) return { desc, url };
                }
            }
        } catch (e) { /* skip */ }
    }
    return null;
}

async function main() {
    const detailLinks = await scrapeAllDetailLinks();

    console.log('\n📋 Fetching events from DB...');
    const allEvents = await supabaseGet('id,title_tr,slug,description_tr');
    const needsDesc = allEvents.filter(e => !e.description_tr || e.description_tr.trim().length < 10);
    const hasDesc = allEvents.filter(e => e.description_tr && e.description_tr.trim().length >= 10);

    console.log(`   Total events: ${allEvents.length}`);
    console.log(`   Already have descriptions: ${hasDesc.length}`);
    console.log(`   Need descriptions: ${needsDesc.length}`);

    let updated = 0, notFound = 0, errors = 0;

    for (const evt of needsDesc) {
        const evtSlug = evt.slug || slugify(evt.title_tr || '');
        let result = null;

        // Try 1: Find matching link from scraped pages
        const matchingSlug = findMatchingLink(evt.title_tr || '', evtSlug, detailLinks);

        if (matchingSlug) {
            const url = detailLinks[matchingSlug];
            try {
                console.log(`  🔄 Fetching: ${url}`);
                const res = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    redirect: 'follow'
                });
                if (res.ok) {
                    const html = await res.text();
                    const desc = extractDescription(html);
                    if (desc && desc.length > 10) result = { desc, url };
                }
            } catch (e) { /* fall through */ }
        }

        // Try 2: Brute-force URL prefixes with DB slug
        if (!result) {
            result = await tryFetchDescription(evtSlug);
        }

        if (result) {
            try {
                await supabaseUpdate(evt.id, { description_tr: result.desc });
                console.log(`  ✅ "${evt.title_tr}" — ${result.desc.length} chars from ${result.url}`);
                updated++;
            } catch (e) {
                console.error(`  ❌ DB error for "${evt.title_tr}": ${e.message}`);
                errors++;
            }
        } else {
            console.log(`  ⏭️  No description found: "${evt.title_tr}"`);
            notFound++;
        }

        await new Promise(r => setTimeout(r, 400));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Descriptions added: ${updated}`);
    console.log(`   ⏭️  No description found: ${notFound}`);
    console.log(`   ❌ Errors: ${errors}`);
}

main().catch(console.error);
