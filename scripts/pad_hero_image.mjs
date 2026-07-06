/**
 * pad_hero_image.mjs
 * ─────────────────────────────────────────────────────────────
 * Creates a 2560×1440 padded PNG where the building is shifted
 * DOWN by SKY_PAD pixels and filled at the top with the
 * matching night-sky colour.  This compensates for the ~10-15%
 * internal zoom Kling applies when generating the video, so
 * the triangular pediment always stays inside the safe frame.
 * ─────────────────────────────────────────────────────────────
 */
import sharp from 'sharp';
import path  from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.join(__dirname, '..');

const INPUT  = path.join(rootDir, 'src', 'assets', 'Untitled (2560 x 1440 px).png');
const OUTPUT = path.join(rootDir, 'src', 'assets', 'galata_hero_padded.png');

// How many px to push the building DOWN.
// Kling zooms ~10-15 %, so on a 1440-tall frame that's ~145-215 px.
// 180 px gives comfortable headroom without losing too much street.
const SKY_PAD = 180;

// Dark night-sky colour sampled from the top-left of the source image.
const SKY_BG = { r: 14, g: 16, b: 28, alpha: 1 };

async function main() {
    const meta = await sharp(INPUT).metadata();
    const W = meta.width;   // 2560
    const H = meta.height;  // 1440

    console.log(`📐 Source: ${W}×${H}`);
    console.log(`⬆️  Adding ${SKY_PAD}px dark-sky at top, cropping ${SKY_PAD}px from bottom`);

    // 1. Composite: draw building onto a dark-sky canvas, offset down
    //    The canvas stays W × (H + SKY_PAD) temporarily, then we crop.
    const padded = await sharp({
        create: { width: W, height: H + SKY_PAD, channels: 4, background: SKY_BG }
    })
    .composite([{ input: INPUT, top: SKY_PAD, left: 0 }])
    // 2. Crop to original dimensions (removes bottom SKY_PAD px)
    .extract({ left: 0, top: 0, width: W, height: H })
    .png()
    .toFile(OUTPUT);

    console.log(`✅ Saved: src/assets/galata_hero_padded.png  (${W}×${H})`);
    console.log(`   Pediment headroom: ~${55 + SKY_PAD}px from top (was ~55px)`);
}

main().catch(err => { console.error(err); process.exit(1); });
