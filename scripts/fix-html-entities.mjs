const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';

function decodeHtmlEntities(str) {
    if (!str) return str;
    return str
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&amp;#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
        .replace(/&amp;#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&ndash;/g, '\u2013')
        .replace(/&mdash;/g, '\u2014')
        .replace(/&nbsp;/g, ' ')
        .replace(/&laquo;/g, '\u00AB')
        .replace(/&raquo;/g, '\u00BB')
        .replace(/&hellip;/g, '\u2026')
        .replace(/&rsquo;/g, '\u2019')
        .replace(/&lsquo;/g, '\u2018')
        .replace(/&rdquo;/g, '\u201D')
        .replace(/&ldquo;/g, '\u201C')
        // Remove " – Galata Rum Okulu" suffix
        .replace(/\s*[\u2013\u2014-]\s*Galata Rum Okulu\s*$/i, '')
        .trim();
}

async function fetchEvents() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/past_events?select=id,title_tr`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
    });
    return res.json();
}

async function updateEvent(id, newTitle) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/past_events?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ title_tr: newTitle }),
    });
    return res.ok;
}

async function main() {
    console.log('Fetching all events...');
    const events = await fetchEvents();
    console.log(`Found ${events.length} events. Checking for HTML entities...`);

    let fixedCount = 0;
    for (const event of events) {
        const original = event.title_tr;
        const cleaned = decodeHtmlEntities(original);
        if (original !== cleaned) {
            console.log(`\nFIXING: "${original}"`);
            console.log(`    TO: "${cleaned}"`);
            const ok = await updateEvent(event.id, cleaned);
            if (ok) fixedCount++;
            else console.error(`  ERROR updating event ${event.id}`);
        }
    }

    console.log(`\nDone! Fixed ${fixedCount} events out of ${events.length} total.`);
}

main();
