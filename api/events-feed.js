/**
 * Public, aggressively CDN-cached Events Feed for third-party cultural apps,
 * map platforms (e.g., ROTA Kültür Sanat), press, RSS readers, and calendars.
 *
 * Rewritten via vercel.json:
 *   - GET /events.json -> /api/events-feed?format=json
 *   - GET /events.xml  -> /api/events-feed?format=xml
 *   - GET /events.ics  -> /api/events-feed?format=ics
 *
 * Caching policy:
 *   - 24-hour Vercel Edge CDN cache (s-maxage=86400)
 *   - 7-day stale-while-revalidate (604800)
 *   -> Keeps Supabase load near zero (~1 lightweight read/day max per region)
 *      while automatically reflecting new published events from Admin without redeploy.
 */

const PRODUCTION_SITE_ORIGIN = 'https://galatarumokulu.org';
const DEFAULT_OG_IMAGE = `${PRODUCTION_SITE_ORIGIN}/og-image.jpg`;
const SUPABASE_MEDIA_PREFIX =
    /^https?:\/\/tvloakrlqazcadokliaf\.supabase\.co\/storage\/v1\/object\/public\/media\//i;

const CACHE_TTL_SECONDS = 86400; // 24 hours CDN cache
const STALE_TTL_SECONDS = 604800; // 7 days stale-while-revalidate

const STABILIZED_EVENT_SLUGS = {
    '41dea564-3256-4bf8-88c7-b7cba4f784d3': 'toz-sergisi',
    'ea2aa434-164a-4b0d-82a8-662393a1cb78': 'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri',
    '7393d6fb-db07-4685-af62-10cc035a0ca2': 'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko',
    'f9d2422d-d955-4d80-8828-94eaf2ef2ad9': '212-photography-istanbul-festivali-viviane-sassen-afisi',
    'bb82fa65-e8ec-45ec-8117-d5bb949923bc': '212-photography-istanbul-festivali-ebru-yildiz-afisi',
    'c258c4a7-8c4d-47e7-88cb-919e116b4135': 'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi',
    'be2395b4-6335-4d04-9766-26981adc4945': 'ustad-thrasivoulos-stanitsas-1910-1987-anisina-duzenlenen-dini-musiki-konseri',
    'd011faf7-00d9-444f-b537-7deb4689ea8e': 'aleksis-aleksandris',
    'd46eb8b7-1e2b-40db-b156-2aa1780f69b3': 'cagri-sarayin-eksilen-zaman-adli-sergisi',
    'f9c5d523-452d-4876-9a4c-e69626593e33': 'ceren-oykutun-konstantiniye-ve-ayasofya-defterleri-adli-sergisi',
    '3fca592d-f02a-4d04-bbae-6cef46ec430b': '2-istanbul-tasarim-bienali-gelecek-artik-eskisi-gibi-degil',
    '35031159-3d9a-43c2-8d26-5b5a2585f712': 'galata-rum-okulunda-duzenlenen-ikona-yapim-atolyesi',
    '2e9caf22-1aa9-452e-b057-061634e1e159': '206-odali-sessizlik-buyukada-rum-yetimhanesi-uzerine-etudler-sergisi',
    'b6bbe178-ae6c-468a-9d25-69d3dfc85f44': 'alacakaranlikta-gunden-gune',
    '33424163-c303-4d19-a866-75fbe6b13905': 'dusunce-bahcesi-melek-aksoy-sinan-logie',
    '7fc2757e-e8f3-48d9-b856-5f0076c792b9': 'en-basa-don-okumalari',
    '66f6f1d2-e769-478c-b10e-e407e23f74ff': 'stefanos-yerasimosun-izinde-istanbul-ve-osmanli-tarihi',
};

const VENUE_METADATA = {
    name: {
        tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi',
        en: 'Galata Greek School Foundation - Cultural Center',
        el: 'Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο',
    },
    website: PRODUCTION_SITE_ORIGIN,
    email: 'info@galatarumokulu.org',
    telephone: '+90 212 244 86 36',
    maps_url: 'https://maps.app.goo.gl/PjFPYqEuqGoSXb178',
    social: {
        instagram: 'https://www.instagram.com/galatarumokulukulturmerkezi/',
        youtube: 'https://www.youtube.com/@GalataRumOkulu',
        facebook: 'https://www.facebook.com/galatarumokulu/',
        x: 'https://x.com/GalataRum',
    },
    address: {
        street: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25',
        district: 'Karaköy, Beyoğlu',
        city: 'İstanbul',
        postal_code: '34425',
        country: 'TR',
        formatted: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / İstanbul',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / Istanbul',
            el: 'Kemankeş Karamustafa Paşa, Οδός Kemeraltı αρ. 25, 34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
    },
    geo: {
        latitude: 41.0258954,
        longitude: 28.9781318,
    },
    visiting: {
        open_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        closed_days: ['Sunday', 'Monday'],
        hours_note: {
            tr: 'Salı–Cumartesi ziyarete açıktır; Pazar ve Pazartesi kapalıdır. Ziyaret saatleri sergi ve etkinlik takvimine göre değişmektedir; lütfen web sitesi veya telefon üzerinden teyit edin.',
            en: 'Open to visitors Tuesday–Saturday; closed on Sunday and Monday. Visiting hours vary by exhibition schedule; please confirm via website or telephone.',
            el: 'Ανοιχτά Τρίτη–Σάββατο· κλειστά Κυριακή και Δευτέρα. Οι ώρες επίσκεψης διαμορφώνονται ανάλογα με το πρόγραμμα των εκθέσεων.',
        },
    },
};

function decodeBasicEntities(text) {
    return String(text || '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&#(\d+);/g, (_, num) => {
            const code = Number(num);
            return Number.isFinite(code) ? String.fromCodePoint(code) : '';
        });
}

function cleanText(raw, maxLength = 420) {
    if (!raw) return '';
    const stripped = decodeBasicEntities(String(raw).replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
    if (!maxLength || stripped.length <= maxLength) return stripped;
    return `${stripped.slice(0, maxLength - 1).replace(/\s+\S*$/, '').trim()}…`;
}

function normalizeMediaUrl(rawUrl) {
    if (!rawUrl) return DEFAULT_OG_IMAGE;
    const trimmed = String(rawUrl).trim();
    if (!trimmed) return DEFAULT_OG_IMAGE;
    if (SUPABASE_MEDIA_PREFIX.test(trimmed)) {
        return trimmed.replace(SUPABASE_MEDIA_PREFIX, `${PRODUCTION_SITE_ORIGIN}/supabase-media/`);
    }
    if (/^https?:\/\/(www\.)?galatarumokulu\.org\/img\//i.test(trimmed)) {
        return trimmed.replace(/^https?:\/\/(www\.)?galatarumokulu\.org/i, PRODUCTION_SITE_ORIGIN);
    }
    if (trimmed.startsWith('/')) {
        return `${PRODUCTION_SITE_ORIGIN}${trimmed}`;
    }
    return trimmed;
}

function resolveSlug(row) {
    if (row.slug && String(row.slug).trim().length > 0) {
        return String(row.slug).trim();
    }
    return STABILIZED_EVENT_SLUGS[row.id] || String(row.id);
}

function normalizeDateOnly(dateStr) {
    if (!dateStr) return null;
    const str = String(dateStr).trim();
    const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
    const parsed = new Date(str);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
}

function getIstanbulTodayIso() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formatter.format(new Date());
}

function escapeXml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function escapeIcs(value) {
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/\r?\n/g, '\\n')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,');
}

function addOneDayYmd(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + 1));
    return dt.toISOString().slice(0, 10).replace(/-/g, '');
}

async function fetchPublishedEvents() {
    const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials are not configured in environment.');
    }

    const columns = [
        'id',
        'slug',
        'title_tr',
        'title_en',
        'title_el',
        'description_tr',
        'description_en',
        'description_el',
        'event_date',
        'type_tr',
        'type_en',
        'type_el',
        'sub_tag',
        'cover_image_url',
    ].join(',');

    const endpoint = `${supabaseUrl}/rest/v1/past_events?select=${encodeURIComponent(columns)}&status=eq.published&order=event_date.desc.nullslast`;

    const response = await fetch(endpoint, {
        headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Supabase query failed with HTTP ${response.status}`);
    }

    const rows = await response.json();
    const todayIstanbul = getIstanbulTodayIso();

    return (Array.isArray(rows) ? rows : []).map((row) => {
        const slug = resolveSlug(row);
        const dateOnly = normalizeDateOnly(row.event_date);
        const status = dateOnly && dateOnly >= todayIstanbul ? 'upcoming' : 'past';
        const titleTr = cleanText(row.title_tr || row.title_en || 'Galata Rum Okulu Etkinliği', 200);
        const titleEn = cleanText(row.title_en || row.title_tr || 'Galata Greek School Event', 200);
        const titleEl = cleanText(row.title_el || row.title_en || row.title_tr || titleTr, 200);

        const summaryTr = cleanText(row.description_tr || row.description_en || '', 420);
        const summaryEn = cleanText(row.description_en || row.description_tr || '', 420);
        const summaryEl = cleanText(row.description_el || row.description_en || row.description_tr || '', 420);

        const categoryTr = cleanText(row.sub_tag || row.type_tr || '', 120);
        const categoryEn = cleanText(row.type_en || row.sub_tag || row.type_tr || '', 120);
        const categoryEl = cleanText(row.type_el || row.type_en || row.sub_tag || row.type_tr || '', 120);

        return {
            id: String(row.id),
            slug,
            status,
            date: dateOnly,
            category: {
                tr: categoryTr || null,
                en: categoryEn || null,
                el: categoryEl || null,
            },
            title: {
                tr: titleTr,
                en: titleEn,
                el: titleEl,
            },
            summary: {
                tr: summaryTr || null,
                en: summaryEn || null,
                el: summaryEl || null,
            },
            image: normalizeMediaUrl(row.cover_image_url),
            url: {
                tr: `${PRODUCTION_SITE_ORIGIN}/gecmis-etkinlikler/${encodeURIComponent(slug)}`,
                en: `${PRODUCTION_SITE_ORIGIN}/en/gecmis-etkinlikler/${encodeURIComponent(slug)}`,
                el: `${PRODUCTION_SITE_ORIGIN}/el/gecmis-etkinlikler/${encodeURIComponent(slug)}`,
            },
        };
    });
}

function buildJsonFeed(events, generatedAt) {
    const upcomingEvents = events.filter((e) => e.status === 'upcoming');
    const pastEvents = events.filter((e) => e.status === 'past');
    const latestDate = events.find((e) => e.date)?.date || null;

    return JSON.stringify(
        {
            schema_version: '1.0',
            generated_at: generatedAt,
            cache_ttl_seconds: CACHE_TTL_SECONDS,
            feeds: {
                json: `${PRODUCTION_SITE_ORIGIN}/events.json`,
                rss: `${PRODUCTION_SITE_ORIGIN}/events.xml`,
                ical: `${PRODUCTION_SITE_ORIGIN}/events.ics`,
            },
            venue: VENUE_METADATA,
            summary: {
                total_published: events.length,
                upcoming_count: upcomingEvents.length,
                past_count: pastEvents.length,
                latest_event_date: latestDate,
            },
            upcoming_events: upcomingEvents,
            events,
        },
        null,
        2
    );
}

function buildRssFeed(events, generatedAt) {
    const lastBuildDate = new Date(generatedAt).toUTCString();
    const itemsXml = events
        .map((event) => {
            const pubDate = event.date
                ? new Date(`${event.date}T09:00:00Z`).toUTCString()
                : lastBuildDate;
            const description =
                event.summary.tr ||
                event.summary.en ||
                `${event.title.tr} — Galata Rum Okulu Vakfı - Kültür Merkezi`;
            const categoryTag = event.category.tr
                ? `\n      <category>${escapeXml(event.category.tr)}</category>`
                : '';
            const imageTag = event.image
                ? `\n      <media:content url="${escapeXml(event.image)}" medium="image" />`
                : '';

            return [
                '    <item>',
                `      <title>${escapeXml(event.title.tr)}</title>`,
                `      <link>${escapeXml(event.url.tr)}</link>`,
                `      <guid isPermaLink="true">${escapeXml(event.url.tr)}</guid>`,
                `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
                `      <description>${escapeXml(description)}</description>${categoryTag}${imageTag}`,
                '    </item>',
            ].join('\n');
        })
        .join('\n');

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
        '  <channel>',
        `    <title>${escapeXml(VENUE_METADATA.name.tr)} — Etkinlikler ve Sergiler</title>`,
        `    <link>${PRODUCTION_SITE_ORIGIN}/gecmis-etkinlikler</link>`,
        `    <description>${escapeXml('Galata Rum Okulu Vakfı - Kültür Merkezi güncel ve geçmiş sergiler, konserler, bienaller, konferanslar ve kültürel programlar.')}</description>`,
        '    <language>tr</language>',
        `    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>`,
        `    <ttl>${Math.round(CACHE_TTL_SECONDS / 60)}</ttl>`,
        `    <atom:link href="${PRODUCTION_SITE_ORIGIN}/events.xml" rel="self" type="application/rss+xml" />`,
        itemsXml,
        '  </channel>',
        '</rss>',
        '',
    ].join('\n');
}

function buildIcalFeed(events, generatedAt) {
    const dtStamp = new Date(generatedAt)
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}Z$/, 'Z');
    const location = escapeIcs(
        `${VENUE_METADATA.name.tr}, ${VENUE_METADATA.address.formatted.tr}`
    );

    const vevents = events
        .filter((event) => Boolean(event.date))
        .map((event) => {
            const startYmd = event.date.replace(/-/g, '');
            const endYmd = addOneDayYmd(event.date);
            const descParts = [
                event.summary.tr || event.summary.en || '',
                `Detaylar: ${event.url.tr}`,
            ].filter(Boolean);

            const lines = [
                'BEGIN:VEVENT',
                `UID:${escapeIcs(event.id)}@galatarumokulu.org`,
                `DTSTAMP:${dtStamp}`,
                `DTSTART;VALUE=DATE:${startYmd}`,
                `DTEND;VALUE=DATE:${endYmd}`,
                `SUMMARY:${escapeIcs(event.title.tr)}`,
                `DESCRIPTION:${escapeIcs(descParts.join('\n\n'))}`,
                `LOCATION:${location}`,
                `GEO:${VENUE_METADATA.geo.latitude};${VENUE_METADATA.geo.longitude}`,
                `URL:${event.url.tr}`,
            ];

            if (event.category.tr) {
                lines.push(`CATEGORIES:${escapeIcs(event.category.tr)}`);
            }

            lines.push('END:VEVENT');
            return lines.join('\r\n');
        })
        .join('\r\n');

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Galata Rum Okulu Vakfi//Events Feed 1.0//TR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${escapeIcs(VENUE_METADATA.name.tr)} — Etkinlikler`,
        'X-WR-TIMEZONE:Europe/Istanbul',
        'REFRESH-INTERVAL;VALUE=DURATION:P1D',
        'X-PUBLISHED-TTL:P1D',
        vevents,
        'END:VCALENDAR',
        '',
    ].join('\r\n');
}

function buildCommonHeaders(contentType, extra = {}) {
    return {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Cache-Control': `public, max-age=3600, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${STALE_TTL_SECONDS}`,
        'CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}, stale-while-revalidate=${STALE_TTL_SECONDS}`,
        'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}, stale-while-revalidate=${STALE_TTL_SECONDS}`,
        ...extra,
    };
}

function resolveFormat(request) {
    const url = new URL(request.url);
    const param = (url.searchParams.get('format') || '').toLowerCase();
    if (param === 'xml' || param === 'rss') return 'xml';
    if (param === 'ics' || param === 'ical') return 'ics';
    if (param === 'json') return 'json';

    const path = url.pathname.toLowerCase();
    if (path.endsWith('.xml') || path.endsWith('.rss')) return 'xml';
    if (path.endsWith('.ics')) return 'ics';
    return 'json';
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Max-Age': '86400',
        },
    });
}

async function handleRequest(request, headOnly = false) {
    const format = resolveFormat(request);

    try {
        const events = await fetchPublishedEvents();
        const generatedAt = new Date().toISOString();

        if (format === 'xml') {
            const headers = buildCommonHeaders('application/rss+xml; charset=utf-8');
            return new Response(headOnly ? null : buildRssFeed(events, generatedAt), {
                status: 200,
                headers,
            });
        }

        if (format === 'ics') {
            const headers = buildCommonHeaders('text/calendar; charset=utf-8', {
                'Content-Disposition': 'inline; filename="galata-rum-okulu-events.ics"',
            });
            return new Response(headOnly ? null : buildIcalFeed(events, generatedAt), {
                status: 200,
                headers,
            });
        }

        const headers = buildCommonHeaders('application/json; charset=utf-8');
        return new Response(headOnly ? null : buildJsonFeed(events, generatedAt), {
            status: 200,
            headers,
        });
    } catch (error) {
        return new Response(
            headOnly
                ? null
                : JSON.stringify({
                      error: 'Events feed is temporarily unavailable.',
                      detail: error instanceof Error ? error.message : 'Unknown error',
                  }),
            {
                status: 503,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'no-store',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}

export async function GET(request) {
    return handleRequest(request, false);
}

export async function HEAD(request) {
    return handleRequest(request, true);
}
