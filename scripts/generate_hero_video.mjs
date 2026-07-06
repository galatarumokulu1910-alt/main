/**
 * generate_hero_video.mjs
 * 
 * Generates the hero background video for the Galata Greek School website
 * using the fal.ai Kling Video model (image-to-video).
 * 
 * Usage: node scripts/generate_hero_video.mjs
 * Requires: FAL_KEY in .env
 */

import * as fal from '@fal-ai/serverless-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';
import http from 'http';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
    console.error('❌ FAL_KEY not found in .env file');
    process.exit(1);
}

// Configure fal.ai client
fal.config({ credentials: FAL_KEY });

// Source image path
const SOURCE_IMAGE = path.join(rootDir, 'src', 'assets', 'galata_hero_padded.png');
const OUTPUT_DIR = path.join(rootDir, 'public', 'videos');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'hero_background.mp4');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created public/videos directory');
}

// Check source image exists
if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`❌ Source image not found: ${SOURCE_IMAGE}`);
    process.exit(1);
}

/**
 * Download a file from a URL to a local path
 */
async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(destPath);
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirect
                file.close();
                downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(destPath, () => {});
                reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => {
                fs.unlink(destPath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

/**
 * Upload local image to fal.ai storage
 */
async function uploadImageToFal() {
    console.log('📤 Uploading source image to fal.ai storage...');
    
    const imageBuffer = fs.readFileSync(SOURCE_IMAGE);
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    const file = new File([blob], 'galata_hero_padded.png', { type: 'image/png' });
    
    const imageUrl = await fal.storage.upload(file);
    console.log(`✅ Image uploaded: ${imageUrl}`);
    return imageUrl;
}

/**
 * Main entry point
 */
async function main() {
    console.log('🎬 Galata Greek School — Hero Video Generator');
    console.log('━'.repeat(50));
    console.log(`📁 Source: src/assets/galata_hero_padded.png`);
    console.log(`🎯 Output: public/videos/hero_background.mp4`);
    console.log(`🤖 Model:  fal-ai/kling-video/o3/standard/image-to-video`);
    console.log(`⏱️  Duration: 10 seconds`);
    console.log('━'.repeat(50));
    
    try {
        // Step 1: Upload source image
        const imageUrl = await uploadImageToFal();
        
        // Step 2: Submit video generation job
        console.log('\n🚀 Submitting video generation request...');
        console.log('⏳ This may take 5-12 minutes (10s video)...\n');
        
        const result = await fal.subscribe('fal-ai/kling-video/o3/standard/image-to-video', {
            input: {
                image_url: imageUrl,
                prompt: "Perfectly stable tripod camera. The entire historical building must remain fully visible in the frame from start to finish. NO camera movement, NO zoom, NO panning. Only extremely subtle, slow, and realistic atmospheric changes (like soft glowing lights of the building and very slow night sky). High architectural fidelity, smooth, cinematic.",
                negative_prompt: "shaking, flickering, morphing, architectural distortion, camera movement, zoom, fast motion, blur, low quality, unnatural changes, warping, melting, dissolving, unstable",
                duration: "10",
                aspect_ratio: "16:9",
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_QUEUE') {
                    console.log(`⏳ Position in queue: ${update.queue_position ?? 'calculating...'}`);
                } else if (update.status === 'IN_PROGRESS') {
                    if (update.logs?.length > 0) {
                        const lastLog = update.logs[update.logs.length - 1];
                        process.stdout.write(`\r🎞️  ${lastLog.message}                    `);
                    }
                } else if (update.status === 'COMPLETED') {
                    console.log('\n✅ Generation complete!');
                }
            },
        });
        
        // Step 3: Get video URL from result
        const videoUrl = result?.video?.url || result?.videos?.[0]?.url;
        
        if (!videoUrl) {
            console.error('\n❌ No video URL in result:', JSON.stringify(result, null, 2));
            process.exit(1);
        }
        
        console.log(`\n🔗 Video URL: ${videoUrl}`);
        
        // Step 4: Download the video
        console.log('\n📥 Downloading video to public/videos/hero_background.mp4...');
        await downloadFile(videoUrl, OUTPUT_FILE);
        
        const stats = fs.statSync(OUTPUT_FILE);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
        
        console.log(`✅ Video saved: public/videos/hero_background.mp4 (${sizeMB} MB)`);
        console.log('\n🎉 Hero video generation complete!');
        console.log('━'.repeat(50));
        console.log('Next steps:');
        console.log('  1. Run: npm run dev');
        console.log('  2. Visit the homepage to see the video hero');
        console.log('━'.repeat(50));
        
    } catch (err) {
        console.error('\n❌ Video generation failed:', err.message || err);
        if (err.body) {
            console.error('   API response:', JSON.stringify(err.body, null, 2));
        }
        process.exit(1);
    }
}

main();
