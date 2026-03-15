/**
 * Fix broken event images by re-downloading from galatarumokulu.org
 * and uploading to Supabase Storage, then updating DB records.
 */
import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import { Buffer } from 'buffer';
import path from 'path';
import crypto from 'crypto';

const SUPABASE_URL = 'https://tvloakrlqazcadokliaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bG9ha3JscWF6Y2Fkb2tsaWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMwODcsImV4cCI6MjA4ODUyOTA4N30.yU2-aCCeVG9nuSAYQba04LZjVBIHsL64Mae0HckzZRo';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const STORAGE_BUCKET = 'event-images';

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

async function main() {
    console.log('🔍 Finding events with broken image URLs...\n');

    // Fetch all events
    const { data: events, error } = await supabase
        .from('past_events')
        .select('id, title_tr, cover_image_url, slug');

    if (error) {
        console.error('❌ Failed to fetch events:', error.message);
        return;
    }

    // Find events where cover_image_url points to galatarumokulu.org (not uploaded to Supabase)
    const brokenEvents = events.filter(e =>
        e.cover_image_url &&
        (e.cover_image_url.includes('galatarumokulu.org') || 
         (!e.cover_image_url.includes('supabase.co') && !e.cover_image_url.startsWith('/')))
    );

    console.log(`📊 Total events: ${events.length}`);
    console.log(`🔴 Broken image events: ${brokenEvents.length}\n`);

    if (brokenEvents.length === 0) {
        console.log('✅ No broken images found!');
        return;
    }

    // Also check for broken Supabase URLs (file might have been deleted)
    const supabaseEvents = events.filter(e =>
        e.cover_image_url && e.cover_image_url.includes('supabase.co')
    );
    console.log(`📦 Events with Supabase URLs: ${supabaseEvents.length}`);

    let fixed = 0;
    let failed = 0;

    for (const evt of brokenEvents) {
        const slug = evt.slug || evt.id;
        console.log(`\n[${fixed + failed + 1}/${brokenEvents.length}] ${evt.title_tr}`);
        console.log(`  🔗 Current URL: ${evt.cover_image_url}`);

        try {
            // Download the image from the original URL
            console.log(`  ⬇ Downloading...`);
            const imageBuffer = await downloadImage(evt.cover_image_url);
            console.log(`  ✅ Downloaded (${(imageBuffer.length / 1024).toFixed(1)} KB)`);

            // Determine file extension and content type
            const ext = path.extname(new URL(evt.cover_image_url).pathname).toLowerCase() || '.jpg';
            const hash = crypto.createHash('md5').update(evt.cover_image_url).digest('hex').substring(0, 8);
            const fileName = `${slug}-${hash}${ext}`;
            const filePath = `events/${fileName}`;
            const contentType = ext === '.png' ? 'image/png' :
                ext === '.webp' ? 'image/webp' : 'image/jpeg';

            // Upload to Supabase Storage
            console.log(`  ⬆ Uploading to Supabase Storage...`);
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, imageBuffer, { contentType, upsert: true });

            if (uploadError) {
                console.error(`  ❌ Upload error: ${uploadError.message}`);
                failed++;
                continue;
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);
            const newUrl = publicUrlData.publicUrl;

            // Update database record
            const { error: updateError } = await supabase
                .from('past_events')
                .update({ cover_image_url: newUrl })
                .eq('id', evt.id);

            if (updateError) {
                console.error(`  ❌ DB update error: ${updateError.message}`);
                failed++;
                continue;
            }

            console.log(`  ✅ Fixed → ${newUrl}`);
            fixed++;
        } catch (err) {
            console.error(`  ❌ Error: ${err.message}`);
            failed++;
        }

        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n' + '═'.repeat(50));
    console.log('📊 FIX SUMMARY');
    console.log('═'.repeat(50));
    console.log(`  ✅ Fixed: ${fixed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log('═'.repeat(50));
}

main().catch(console.error);
