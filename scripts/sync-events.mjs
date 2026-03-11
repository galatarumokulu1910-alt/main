/**
 * Sync Events from galatarumokulu.org
 * 
 * Scrapes ALL events from the source page, checks for duplicates,
 * imports missing ones, and updates sub_tag (badge) for existing events.
 * Also grabs descriptions from detail pages.
 * 
 * Usage: node scripts/sync-events.mjs
 */

const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';

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
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
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
    let contentMatch = clean.match(/class="col\s+span_7\s+text_icerik">([\s\S]*?)<\/div>/i);
    if (!contentMatch) {
        contentMatch = clean.match(/class="[^"]*text_icerik[^"]*">([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) {
        contentMatch = clean.match(/class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) return '';

    let content = contentMatch[1];
    const paragraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = pRegex.exec(content)) !== null) {
        let text = m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        text = decodeHtmlEntities(text);
        if (text && text.length > 5) paragraphs.push(text);
    }
    if (paragraphs.length === 0) {
        let text = content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        text = decodeHtmlEntities(text);
        if (text.length > 10) return text;
    }
    return paragraphs.join('\n\n');
}

function parseDate(dateStr) {
    if (!dateStr) return null;
    const months = {
        'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04',
        'mayıs': '05', 'haziran': '06', 'temmuz': '07', 'ağustos': '08',
        'eylül': '09', 'ekim': '10', 'kasım': '11', 'aralık': '12'
    };
    // Try "DD MonthName YYYY" pattern
    const match = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (match) {
        const month = months[match[2].toLowerCase()];
        if (month) return `${match[3]}-${month}-${match[1].padStart(2, '0')}`;
    }
    // Try range: "DD MonthName YYYY - DD MonthName YYYY" -> use first date
    const rangeMatch = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (rangeMatch) {
        const month = months[rangeMatch[2].toLowerCase()];
        if (month) return `${rangeMatch[3]}-${month}-${rangeMatch[1].padStart(2, '0')}`;
    }
    return null;
}

async function scrapeSourcePage() {
    console.log('🌐 Fetching source page...');
    const res = await fetch('https://galatarumokulu.org/tr/etkinlikler/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    console.log(`   Page size: ${html.length} chars`);

    // Extract all events by parsing H2 (title), H3 (subtitle), H4 (date), H5 (badge), links, images
    const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
    const h3s = html.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || [];
    const h4s = html.match(/<h4[^>]*>[\s\S]*?<\/h4>/gi) || [];
    const h5s = html.match(/<h5[^>]*>[\s\S]*?<\/h5>/gi) || [];

    // Extract event detail links  
    const linkMatches = html.match(/href="(https:\/\/galatarumokulu\.org\/tr\/etkinlik\/[^"]+)"/gi) || [];
    const detailUrls = linkMatches.map(l => l.replace(/^href="/i, '').replace(/"$/, ''));

    // Extract cover images near event cards
    const imgMatches = html.match(/<img[^>]*class="[^"]*portfolio-img[^"]*"[^>]*src="([^"]*)"[^>]*>/gi) || [];
    const images = imgMatches.map(m => {
        const src = m.match(/src="([^"]*)"/i);
        return src ? src[1] : '';
    });

    // Skip the first H2 which is usually the page title "Etkinlikler"
    const offset = h2s.length > 0 && h2s[0].replace(/<[^>]+>/g, '').trim() === 'Etkinlikler' ? 1 : 0;

    const events = [];
    const usedUrls = new Set();

    for (let i = offset; i < h2s.length; i++) {
        const idx = i - offset;
        const title = decodeHtmlEntities(h2s[i].replace(/<[^>]+>/g, '').trim());
        const subtitle = h3s[idx] ? decodeHtmlEntities(h3s[idx].replace(/<[^>]+>/g, '').trim()) : '';
        const dateStr = h4s[idx] ? decodeHtmlEntities(h4s[idx].replace(/<[^>]+>/g, '').trim()) : '';
        const badge = h5s[idx] ? decodeHtmlEntities(h5s[idx].replace(/<[^>]+>/g, '').trim()) : '';
        const image = images[idx] || '';
        const parsedDate = parseDate(dateStr);

        // Match to a detail URL by slug similarity
        const titleSlug = slugify(title);
        let matchedUrl = '';
        for (const url of detailUrls) {
            if (usedUrls.has(url)) continue;
            const urlSlug = url.replace(/\/$/, '').split('/').pop();
            if (titleSlug === urlSlug || titleSlug.includes(urlSlug) || urlSlug.includes(titleSlug)) {
                matchedUrl = url;
                usedUrls.add(url);
                break;
            }
        }
        // If no match, try partial match
        if (!matchedUrl) {
            for (const url of detailUrls) {
                if (usedUrls.has(url)) continue;
                const urlSlug = url.replace(/\/$/, '').split('/').pop();
                const titleWords = titleSlug.split('-').filter(w => w.length > 3);
                const matchCount = titleWords.filter(w => urlSlug.includes(w)).length;
                if (matchCount >= 2) {
                    matchedUrl = url;
                    usedUrls.add(url);
                    break;
                }
            }
        }

        events.push({
            title_tr: title,
            subtitle: subtitle,
            date_str: dateStr,
            event_date: parsedDate,
            sub_tag: badge,
            type_tr: badge,
            cover_image_url: image,
            detail_url: matchedUrl,
            slug: slugify(title)
        });
    }

    console.log(`   Parsed ${events.length} events from source`);
    return events;
}

async function supabaseGet(table, select) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    const res = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
}

async function supabaseInsert(table, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Insert failed: ${res.status} ${await res.text()}`);
    return res.json();
}

async function supabaseUpdate(table, id, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
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

async function main() {
    // 1. Scrape source page
    const sourceEvents = await scrapeSourcePage();

    // 2. Fetch existing events from DB
    console.log('\n📋 Fetching existing events from DB...');
    const dbEvents = await supabaseGet('past_events', 'id,title_tr,slug,sub_tag,type_tr,description_tr');
    console.log(`   Found ${dbEvents.length} events in DB`);

    // Build lookup maps
    const dbSlugMap = {};
    const dbTitleMap = {};
    for (const evt of dbEvents) {
        if (evt.slug) dbSlugMap[evt.slug] = evt;
        if (evt.title_tr) dbTitleMap[slugify(evt.title_tr)] = evt;
    }

    let imported = 0, updatedSubTag = 0, updatedDesc = 0, skippedDup = 0, errors = 0;
    const newEvents = [];

    for (const src of sourceEvents) {
        // Check for duplicate by slug or title similarity
        const existingBySlug = dbSlugMap[src.slug];
        const existingByTitle = dbTitleMap[src.slug];
        const existing = existingBySlug || existingByTitle;

        if (existing) {
            // Update sub_tag if missing
            if (src.sub_tag && (!existing.sub_tag || existing.sub_tag.trim() === '')) {
                try {
                    await supabaseUpdate('past_events', existing.id, { sub_tag: src.sub_tag });
                    console.log(`  🏷️  Updated sub_tag for "${existing.title_tr}" → "${src.sub_tag}"`);
                    updatedSubTag++;
                } catch (e) {
                    console.error(`  ❌ Error updating sub_tag: ${e.message}`);
                    errors++;
                }
            }
            // Update type_tr if missing 
            if (src.type_tr && (!existing.type_tr || existing.type_tr.trim() === '')) {
                try {
                    await supabaseUpdate('past_events', existing.id, { type_tr: src.type_tr });
                } catch (e) { /* ignore */ }
            }
            skippedDup++;
            continue;
        }

        // New event - prepare for insert
        newEvents.push(src);
    }

    // Insert new events
    if (newEvents.length > 0) {
        console.log(`\n🆕 Importing ${newEvents.length} new events...`);
        for (const evt of newEvents) {
            // Ensure unique slug
            let slug = evt.slug;
            let suffix = 2;
            while (dbSlugMap[slug]) {
                slug = `${evt.slug}-${suffix}`;
                suffix++;
            }

            const record = {
                title_tr: evt.title_tr,
                title_en: evt.title_tr,  // Use TR as fallback
                event_date: evt.event_date,
                type_tr: evt.type_tr || evt.sub_tag || '',
                sub_tag: evt.sub_tag || '',
                cover_image_url: evt.cover_image_url || '',
                slug: slug,
                venue_tr: 'Galata Rum Okulu',
                venue_en: 'Galata Greek School'
            };

            try {
                const result = await supabaseInsert('past_events', record);
                dbSlugMap[slug] = result[0] || record;
                console.log(`  ✅ Imported: "${evt.title_tr}" (${evt.sub_tag || 'no badge'})`);
                imported++;
            } catch (e) {
                console.error(`  ❌ Error importing "${evt.title_tr}": ${e.message}`);
                errors++;
            }
        }
    }

    // 3. Scrape descriptions for events that don't have one
    console.log('\n📝 Checking for descriptions to scrape...');
    const allEvents = await supabaseGet('past_events', 'id,title_tr,slug,description_tr');
    const needsDesc = allEvents.filter(e => !e.description_tr || e.description_tr.trim().length < 10);
    console.log(`   ${needsDesc.length} events need descriptions`);

    for (const evt of needsDesc) {
        const evtSlug = evt.slug || slugify(evt.title_tr || '');
        // Find matching source event with detail URL
        const srcMatch = sourceEvents.find(s => s.slug === evtSlug || slugify(s.title_tr) === evtSlug);

        if (!srcMatch || !srcMatch.detail_url) continue;

        try {
            console.log(`  🔄 Scraping desc: ${srcMatch.detail_url}`);
            const res = await fetch(srcMatch.detail_url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                redirect: 'follow'
            });
            const html = await res.text();
            const description = extractDescription(html);

            if (description && description.length > 10) {
                await supabaseUpdate('past_events', evt.id, { description_tr: description });
                console.log(`     ✅ Description added: "${evt.title_tr}" (${description.length} chars)`);
                updatedDesc++;
            }
        } catch (e) {
            console.error(`     ❌ Error: ${e.message}`);
            errors++;
        }

        await new Promise(r => setTimeout(r, 500));
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ New events imported: ${imported}`);
    console.log(`   🏷️  Sub-tags updated: ${updatedSubTag}`);
    console.log(`   📝 Descriptions added: ${updatedDesc}`);
    console.log(`   ⏭️  Duplicates skipped: ${skippedDup}`);
    console.log(`   ❌ Errors: ${errors}`);
}

main().catch(console.error);
