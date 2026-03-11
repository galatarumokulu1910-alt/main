/**
 * Event Import Script for Galata Rum Okulu
 * 
 * Scrapes event detail pages, downloads & re-uploads images to Supabase Storage,
 * and inserts events into the past_events table.
 * 
 * Usage: node scripts/import-events.mjs
 */

import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import { Buffer } from 'buffer';
import path from 'path';
import crypto from 'crypto';

// ── Supabase config ──────────────────────────────────────────────
const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_BUCKET = 'event-images';

// ── All event URLs scraped from the listing page ─────────────────
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

// ── Turkish month mapping ────────────────────────────────────────
const TR_MONTHS = {
    'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04',
    'mayıs': '05', 'haziran': '06', 'temmuz': '07', 'ağustos': '08',
    'eylül': '09', 'eylul': '09', 'ekim': '10', 'kasım': '11', 'kasim': '11', 'aralık': '12', 'aralik': '12'
};

/**
 * Parse Turkish date string to ISO format (YYYY-MM-DD)
 */
function parseTurkishDate(dateStr) {
    if (!dateStr) return null;
    // Remove time parts like "18:30"
    const cleaned = dateStr.replace(/,?\s*\d{1,2}[:.]\d{2}.*$/, '').trim();
    // Handle ranges like "24 Kasım 2023 – 10 Aralık 2023" → take first date
    const firstDate = cleaned.split(/\s*[-–]\s*/)[0].trim();

    const match = firstDate.match(/(\d{1,2})\s+([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+(\d{4})/i);
    if (!match) return null;

    const day = match[1].padStart(2, '0');
    const monthName = match[2].toLowerCase();
    const year = match[3];
    const month = TR_MONTHS[monthName];

    if (!month) return null;
    return `${year}-${month}-${day}`;
}

/**
 * Fetch a URL and return the HTML content
 */
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchHTML(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * Download a binary file (image) from URL
 */
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return downloadImage(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

/**
 * Extract event data from a detail page HTML
 */
function parseEventPage(html, url) {
    const result = {
        title_tr: '',
        date: '',
        type_tr: '',
        imageUrl: '',
        allImages: []
    };

    // Extract og:title or <title>
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
        html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i);
    if (ogTitleMatch) {
        result.title_tr = ogTitleMatch[1].replace(/\s*[-–]\s*Galata Rum Okulu.*$/i, '').trim();
    } else {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
            result.title_tr = titleMatch[1].replace(/\s*[-–]\s*Galata Rum Okulu.*$/i, '').trim();
        }
    }

    // Extract og:image for cover image
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
        html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    if (ogImageMatch) {
        result.imageUrl = ogImageMatch[1];
    }

    // Extract date from the page content
    // Look for class patterns like .tarih, .date, or Turkish date patterns in text
    const datePatterns = [
        /class="tarih[^"]*"[^>]*>([^<]+)</i,
        /class="date[^"]*"[^>]*>([^<]+)</i,
        /(\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4})/i
    ];

    for (const pat of datePatterns) {
        const m = html.match(pat);
        if (m) {
            result.date = m[1].trim();
            break;
        }
    }

    // Extract event type/category
    const typeMatch = html.match(/class="tur[^"]*"[^>]*>([^<]+)</i) ||
        html.match(/class="type[^"]*"[^>]*>([^<]+)</i) ||
        html.match(/class="etkinlik-tur[^"]*"[^>]*>([^<]+)</i);
    if (typeMatch) {
        result.type_tr = typeMatch[1].trim();
    }

    // Extract all images from the page content area
    const imgPattern = /<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"[^>]*>/gi;
    let imgMatch;
    while ((imgMatch = imgPattern.exec(html)) !== null) {
        const src = imgMatch[1];
        if (!src.includes('logo') && !src.includes('icon') && !src.includes('favicon')) {
            // Make absolute URL if relative
            let fullUrl = src;
            if (src.startsWith('/')) {
                fullUrl = 'https://galatarumokulu.org' + src;
            }
            result.allImages.push(fullUrl);
        }
    }

    // Also check for lazy-loaded images
    const lazyPattern = /data-nectar-img-src="([^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"/gi;
    while ((imgMatch = lazyPattern.exec(html)) !== null) {
        let fullUrl = imgMatch[1];
        if (fullUrl.startsWith('/')) fullUrl = 'https://galatarumokulu.org' + fullUrl;
        if (!result.allImages.includes(fullUrl)) {
            result.allImages.push(fullUrl);
        }
    }

    // If no og:image, use the first content image
    if (!result.imageUrl && result.allImages.length > 0) {
        result.imageUrl = result.allImages[0];
    }

    return result;
}

/**
 * Upload an image to Supabase Storage
 */
async function uploadImageToSupabase(imageUrl, eventSlug) {
    try {
        const imageBuffer = await downloadImage(imageUrl);
        const ext = path.extname(new URL(imageUrl).pathname).toLowerCase() || '.jpg';
        const hash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
        const fileName = `${eventSlug}-${hash}${ext}`;
        const filePath = `events/${fileName}`;

        const contentType = ext === '.png' ? 'image/png' :
            ext === '.webp' ? 'image/webp' : 'image/jpeg';

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, imageBuffer, {
                contentType,
                upsert: true
            });

        if (error) {
            console.error(`  ⚠ Upload error for ${fileName}:`, error.message);
            // Fallback: use the original URL
            return imageUrl;
        }

        const { data: publicUrlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error(`  ⚠ Failed to upload image ${imageUrl}:`, err.message);
        return imageUrl; // fallback to original URL
    }
}

/**
 * Main import function
 */
async function main() {
    console.log('🚀 Starting Galata Rum Okulu Event Import');
    console.log(`📋 Total events to process: ${EVENT_URLS.length}`);
    console.log('');

    // First, check which events already exist
    const { data: existingEvents, error: fetchError } = await supabase
        .from('past_events')
        .select('title_tr, event_date');

    if (fetchError) {
        console.error('❌ Failed to fetch existing events:', fetchError.message);
        return;
    }

    const existingTitles = new Set(
        (existingEvents || []).map(e => e.title_tr?.toLowerCase().trim())
    );
    console.log(`📊 Existing events in DB: ${existingTitles.size}`);
    console.log('');

    // Try to ensure the storage bucket exists
    const { error: bucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
    });
    if (bucketError && !bucketError.message.includes('already exists')) {
        console.log('ℹ Storage bucket note:', bucketError.message);
    }

    let inserted = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < EVENT_URLS.length; i++) {
        const url = EVENT_URLS[i];
        const slug = url.split('/').filter(Boolean).pop();

        console.log(`\n[${i + 1}/${EVENT_URLS.length}] Processing: ${slug}`);

        try {
            // 1. Fetch the detail page
            const html = await fetchHTML(url);
            const eventData = parseEventPage(html, url);

            if (!eventData.title_tr) {
                console.log(`  ⚠ No title found, skipping`);
                failed++;
                continue;
            }

            console.log(`  📌 Title: ${eventData.title_tr}`);
            console.log(`  📅 Date: ${eventData.date || 'not found'}`);

            // 2. Check for duplicates
            if (existingTitles.has(eventData.title_tr.toLowerCase().trim())) {
                console.log(`  ⏭ DUPLICATE - already exists, skipping`);
                skipped++;
                continue;
            }

            // 3. Parse date
            const isoDate = parseTurkishDate(eventData.date);
            console.log(`  📅 ISO Date: ${isoDate || 'unknown'}`);

            // 4. Upload cover image
            let coverImageUrl = '';
            if (eventData.imageUrl) {
                console.log(`  🖼 Uploading cover image...`);
                coverImageUrl = await uploadImageToSupabase(eventData.imageUrl, slug);
                console.log(`  ✅ Cover: ${coverImageUrl.substring(0, 80)}...`);
            }

            // 5. Upload additional images (max 5 thumbnails)
            const thumbnailUrls = [];
            const extraImages = eventData.allImages
                .filter(img => img !== eventData.imageUrl)
                .slice(0, 5);

            for (const imgUrl of extraImages) {
                console.log(`  🖼 Uploading thumbnail...`);
                const uploadedUrl = await uploadImageToSupabase(imgUrl, slug);
                thumbnailUrls.push(uploadedUrl);
            }

            // 6. Insert into database
            const record = {
                title_tr: eventData.title_tr,
                title_en: eventData.title_tr, // Use Turkish title as fallback
                title_el: eventData.title_tr,
                type_tr: eventData.type_tr || 'Etkinlik',
                type_en: eventData.type_tr || 'Event',
                type_el: eventData.type_tr || 'Εκδήλωση',
                event_date: isoDate || '2020-01-01',
                cover_image_url: coverImageUrl || '',
                thumbnail_images: thumbnailUrls.length > 0 ? thumbnailUrls : (coverImageUrl ? [coverImageUrl] : []),
                status: 'published'
            };

            const { error: insertError } = await supabase
                .from('past_events')
                .insert(record);

            if (insertError) {
                console.error(`  ❌ Insert error: ${insertError.message}`);
                failed++;
            } else {
                console.log(`  ✅ INSERTED successfully`);
                inserted++;
                existingTitles.add(eventData.title_tr.toLowerCase().trim());
            }

        } catch (err) {
            console.error(`  ❌ Error: ${err.message}`);
            failed++;
        }

        // Small delay to be nice to the server
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n' + '═'.repeat(50));
    console.log('📊 IMPORT SUMMARY');
    console.log('═'.repeat(50));
    console.log(`  ✅ Inserted: ${inserted}`);
    console.log(`  ⏭ Skipped (duplicates): ${skipped}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📋 Total processed: ${EVENT_URLS.length}`);
    console.log('═'.repeat(50));
}

main().catch(console.error);
