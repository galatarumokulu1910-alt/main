/**
 * Import Event Descriptions from galatarumokulu.org
 * 
 * Scrapes detail pages and updates description_tr for existing events.
 * Uses native fetch (Node 18+) and direct REST API calls instead of SDK.
 * Usage: node scripts/import-descriptions.mjs
 */

const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';

const EVENT_URLS = [
    "https://galatarumokulu.org/tr/etkinlik/istanbulda-filantropik-yaklasimlar/",
    "https://galatarumokulu.org/tr/etkinlik/crafting-realms-miseladan-15-yilina-ozel-sergi/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-mezunlar-gecesi-2024/",
    "https://galatarumokulu.org/tr/etkinlik/halic-universitesi-mimarlik-ve-kent-calismalari-programi/",
    "https://galatarumokulu.org/tr/etkinlik/turkiyedeki-suryani-katolik-kilisesi-kitap-tanitimi/",
    "https://galatarumokulu.org/tr/etkinlik/8-uluslararasi-yannis-ritsos-edebiyati-konferanslari/",
    "https://galatarumokulu.org/tr/etkinlik/cloud-revolution-now/",
    "https://galatarumokulu.org/tr/etkinlik/eu-erasmus-narrate-projesi/",
    "https://galatarumokulu.org/tr/etkinlik/esra-gulmen-x-atasay-lansmani/",
    "https://galatarumokulu.org/tr/etkinlik/caudalie-ozel-lansmani-galata-rum-okulunda/",
    "https://galatarumokulu.org/tr/etkinlik/toplu-travmalar-gorunmeyen-ve-radyoaktif-iletimler/",
    "https://galatarumokulu.org/tr/etkinlik/azinlik-haklari-denen-haklar-ve-insan-haklari/",
    "https://galatarumokulu.org/tr/etkinlik/yetimhaneden-ogrenmek-2/",
    "https://galatarumokulu.org/tr/etkinlik/istanbul-adalari-sosyal-ve-kulturel-miras/",
    "https://galatarumokulu.org/tr/etkinlik/dusuncenin-bir-metaforu-olarak-mekan/",
    "https://galatarumokulu.org/tr/etkinlik/yetimhaneden-ogrenmek/",
    "https://galatarumokulu.org/tr/etkinlik/karamanli-rum-ortodoks-bir-askerin-seferberlik-hatiralari/",
    "https://galatarumokulu.org/tr/etkinlik/osmanli-doneminde-adali-rumlar/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-mezunlar-bulusmasi-2018/",
    "https://galatarumokulu.org/tr/etkinlik/base-istanbul/",
    "https://galatarumokulu.org/tr/etkinlik/thrasivoulos-stanitsas-anma-toreni/",
    "https://galatarumokulu.org/tr/etkinlik/yannis-ritsos-siir-okumasi/",
    "https://galatarumokulu.org/tr/etkinlik/en-basa-don-okumalari/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-mezunlar-bulusmasi-2017/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-arsivi-mezunlarini-ariyor/",
    "https://galatarumokulu.org/tr/etkinlik/tadi-damagimda-kaldi/",
    "https://galatarumokulu.org/tr/etkinlik/aleksis-aleksandris/",
    "https://galatarumokulu.org/tr/etkinlik/dusunce-bahcesi-ozge-ersoy/",
    "https://galatarumokulu.org/tr/etkinlik/ayvaliyi-hatirlamak-ayvaliki-yasamak/",
    "https://galatarumokulu.org/tr/etkinlik/dusunce-bahcesi-ali-taptik/",
    "https://galatarumokulu.org/tr/etkinlik/dusunce-bahcesi-camila-rocha/",
    "https://galatarumokulu.org/tr/etkinlik/dusunce-bahcesi-melek-aksoy-sinan-logie/",
    "https://galatarumokulu.org/tr/etkinlik/dusunce-bahcesi-reysi-kamhi/",
    "https://galatarumokulu.org/tr/etkinlik/alacakaranlikta-gunden-gune/",
    "https://galatarumokulu.org/tr/etkinlik/istanbulun-rum-mimarlari/",
    "https://galatarumokulu.org/tr/etkinlik/identitylab-sessions/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-mezunlar-gecesi-2016/",
    "https://galatarumokulu.org/tr/etkinlik/kayip-vatan/",
    "https://galatarumokulu.org/tr/etkinlik/defter-konusmalari/",
    "https://galatarumokulu.org/tr/etkinlik/stefanos-yerasimosun-izinde-istanbul-ve-osmanli-tarihi/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-fatih-ozguven/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-dilek-winchester/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-rita-ender/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-asli-cavusoglu/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-haris-rigas/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-asli-seven/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-pelin-tan/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-deniz-gul/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-irini-dimitriyadis/",
    "https://galatarumokulu.org/tr/etkinlik/adalar-konusuyor-emre-huner/",
    "https://galatarumokulu.org/tr/etkinlik/eksilen-zaman-sergisi-uzerine/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-mezunlar-gecesi-2015/",
    "https://galatarumokulu.org/tr/etkinlik/tsrrf-hackathon/",
    "https://galatarumokulu.org/tr/etkinlik/ikona-yapim-atolyesi/",
    "https://galatarumokulu.org/tr/etkinlik/iki-satir-arasinda-3-seans/",
    "https://galatarumokulu.org/tr/etkinlik/iki-satir-arasinda-2-seans/",
    "https://galatarumokulu.org/tr/etkinlik/bizans-ve-bati-arasinda-el-greco/",
    "https://galatarumokulu.org/tr/etkinlik/iki-satir-arasinda/",
    "https://galatarumokulu.org/tr/etkinlik/galata-rum-okulu-mezunlar-gecesi-2014/",
    "https://galatarumokulu.org/tr/etkinlik/istanbulun-yeni-tarihi-8500-yil-once-yenikapida-yasam/",
    "https://galatarumokulu.org/tr/etkinlik/yine-yeni-dunya-kenti-istanbul-etkinlik-takvimi/",
    "https://galatarumokulu.org/tr/etkinlik/sokrates-simdi/"
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
        .replace(/&#\d+;/g, '');
}

function extractDescription(html) {
    // Remove script/style tags
    let clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Primary: look for "col span_7 text_icerik"
    let contentMatch = clean.match(/class="col\s+span_7\s+text_icerik">([\s\S]*?)<\/div>/i);

    if (!contentMatch) {
        // Fallback: look for span_7 text_icerik with different class ordering
        contentMatch = clean.match(/class="[^"]*text_icerik[^"]*">([\s\S]*?)<\/div>/i);
    }

    if (!contentMatch) {
        // Another fallback: look for entry-content
        contentMatch = clean.match(/class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    }

    if (!contentMatch) return '';

    let content = contentMatch[1];

    // Extract text from paragraphs
    const paragraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = pRegex.exec(content)) !== null) {
        let text = m[1]
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .trim();
        text = decodeHtmlEntities(text);
        if (text && text.length > 5) {
            paragraphs.push(text);
        }
    }

    // If no paragraphs found, try extracting raw text
    if (paragraphs.length === 0) {
        let text = content
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .trim();
        text = decodeHtmlEntities(text);
        if (text.length > 10) return text;
    }

    return paragraphs.join('\n\n');
}

function slugify(text) {
    const map = {
        '\u00e7': 'c', '\u011f': 'g', '\u0131': 'i', '\u00f6': 'o', '\u015f': 's', '\u00fc': 'u',
        '\u00c7': 'c', '\u011e': 'g', '\u0130': 'i', '\u00d6': 'o', '\u015e': 's', '\u00dc': 'u'
    };
    let s = text;
    for (const [from, to] of Object.entries(map)) s = s.split(from).join(to);
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
        .replace(/^-|-$/g, '').substring(0, 100);
}

async function supabaseGet(table, select) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    const res = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
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
    console.log('\uD83D\uDCCB Fetching all events from DB...');
    const events = await supabaseGet('past_events', 'id,title_tr,slug,description_tr');
    console.log(`Found ${events.length} events in DB.`);

    // Build a map: slug from URL -> event URL
    const urlSlugMap = {};
    for (const url of EVENT_URLS) {
        const parts = url.replace(/\/$/, '').split('/');
        const urlSlug = parts[parts.length - 1];
        urlSlugMap[urlSlug] = url;
    }

    let updated = 0, skipped = 0, noMatch = 0, noDesc = 0;

    for (const evt of events) {
        // Skip if already has a description
        if (evt.description_tr && evt.description_tr.trim().length > 10) {
            skipped++;
            continue;
        }

        // Try to match event to a source URL by comparing slugs
        const evtSlug = evt.slug || slugify(evt.title_tr || '');
        let matchedUrl = null;

        // Direct slug match
        if (urlSlugMap[evtSlug]) {
            matchedUrl = urlSlugMap[evtSlug];
        } else {
            // Fuzzy match: check if any URL slug is contained in or contains the event slug
            for (const [urlSlug, url] of Object.entries(urlSlugMap)) {
                if (evtSlug.includes(urlSlug) || urlSlug.includes(evtSlug)) {
                    matchedUrl = url;
                    break;
                }
            }
        }

        if (!matchedUrl) {
            console.log(`  \u26A0\uFE0F  No source URL match for: "${evt.title_tr}" (slug: ${evtSlug})`);
            noMatch++;
            continue;
        }

        try {
            console.log(`  \uD83D\uDD04 Scraping: ${matchedUrl}`);
            const res = await fetch(matchedUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                redirect: 'follow'
            });
            const html = await res.text();
            const description = extractDescription(html);

            if (!description || description.length < 10) {
                console.log(`     \u274C No description found`);
                noDesc++;
                continue;
            }

            await supabaseUpdate('past_events', evt.id, { description_tr: description });
            console.log(`     \u2705 Updated: "${evt.title_tr}" (${description.length} chars)`);
            updated++;
        } catch (err) {
            console.error(`     \u274C Error for ${matchedUrl}:`, err.message);
        }

        // Small delay to be polite to the server
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n\uD83D\uDCCA Summary:`);
    console.log(`   \u2705 Updated: ${updated}`);
    console.log(`   \u23ED\uFE0F  Skipped (already has desc): ${skipped}`);
    console.log(`   \u26A0\uFE0F  No URL match: ${noMatch}`);
    console.log(`   \u274C No description found: ${noDesc}`);
}

main().catch(console.error);
