/**
 * Add description_tr and slug columns to past_events table,
 * then generate slugs for all existing events.
 */

const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';

const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

function slugify(text) {
    const turkishMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    let slug = text;
    for (const [from, to] of Object.entries(turkishMap)) {
        slug = slug.split(from).join(to);
    }
    return slug
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
}

async function main() {
    // 1. Fetch all events
    console.log('📋 Fetching all events...');
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/past_events?select=id,title_tr,slug,description_tr&order=event_date.desc`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
    );

    if (!res.ok) {
        const text = await res.text();
        console.error('❌ Fetch failed:', res.status, text);
        // If columns don't exist yet, the select will still work — Supabase ignores unknown select fields
        // But let's try without the new columns
        const res2 = await fetch(
            `${SUPABASE_URL}/rest/v1/past_events?select=id,title_tr&order=event_date.desc`,
            { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        if (!res2.ok) {
            console.error('❌ Still failed:', await res2.text());
            return;
        }
    }

    const events = await res.json();
    console.log(`📊 Found ${events.length} events`);

    // 2. Generate and update slugs
    const usedSlugs = new Set();
    let updated = 0;

    for (const event of events) {
        if (event.slug) {
            usedSlugs.add(event.slug);
            continue; // Already has a slug
        }

        let baseSlug = slugify(event.title_tr || 'event');
        let slug = baseSlug;
        let counter = 1;
        while (usedSlugs.has(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        usedSlugs.add(slug);

        // Update the event
        const updateRes = await fetch(
            `${SUPABASE_URL}/rest/v1/past_events?id=eq.${event.id}`,
            {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ slug })
            }
        );

        if (updateRes.ok) {
            console.log(`  ✅ ${event.title_tr} → ${slug}`);
            updated++;
        } else {
            const errText = await updateRes.text();
            if (errText.includes('slug')) {
                console.log(`  ⚠ Column "slug" does not exist yet. Please add it in Supabase Dashboard.`);
                console.log(`     SQL: ALTER TABLE past_events ADD COLUMN slug TEXT;`);
                console.log(`     SQL: ALTER TABLE past_events ADD COLUMN description_tr TEXT;`);
                return;
            }
            console.error(`  ❌ Failed to update ${event.title_tr}:`, errText);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n✅ Updated ${updated} events with slugs`);
}

main().catch(console.error);
