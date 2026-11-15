import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const outDir = path.join(appRoot, 'public', 'img', 'archive-thumbs');
fs.mkdirSync(outDir, { recursive: true });

function parseArtifactSourceMap(tsFilePath) {
    const src = fs.readFileSync(tsFilePath, 'utf8');
    const importMap = new Map();
    for (const m of src.matchAll(/import\s+(\w+)\s+from\s+['"]\.\.\/assets\/images\/([^'"]+)['"]/g)) {
        importMap.set(m[1], path.join(appRoot, 'src', 'assets', 'images', m[2]));
    }
    const items = [];
    const blockRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?title:\s*'((?:\\'|[^'])+)'[\s\S]*?titleTr:\s*'((?:\\'|[^'])+)'[\s\S]*?imageSrc:\s*(\w+)/g;
    for (const m of src.matchAll(blockRegex)) {
        const id = m[1];
        const title = m[2].replace(/\\'/g, "'");
        const titleTr = m[3].replace(/\\'/g, "'");
        const varName = m[4];
        const filePath = importMap.get(varName);
        if (filePath) {
            items.push({ id, title, titleTr, varName, filePath });
        }
    }
    return items;
}

const docItems = parseArtifactSourceMap(path.join(appRoot, 'src', 'data', 'documentsArtifacts.ts'));
const objItems = parseArtifactSourceMap(path.join(appRoot, 'src', 'data', 'objectsArtifacts.ts'));
const allItems = [...docItems, ...objItems];

console.log(`Found ${allItems.length} archival items (${docItems.length} documents, ${objItems.length} objects).`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

const stats = [];

for (const item of allItems) {
    const buf = fs.readFileSync(item.filePath);
    const ext = path.extname(item.filePath).toLowerCase();
    const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
    const dataUrl = `data:${mime};base64,${buf.toString('base64')}`;

    const result = await page.evaluate(
        async ({ dataUrl, maxWidth, quality }) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const origW = img.naturalWidth;
                    const origH = img.naturalHeight;
                    const scale = origW > maxWidth ? maxWidth / origW : 1;
                    const targetW = Math.round(origW * scale);
                    const targetH = Math.round(origH * scale);
                    const canvas = document.createElement('canvas');
                    canvas.width = targetW;
                    canvas.height = targetH;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, targetW, targetH);
                    const webpDataUrl = canvas.toDataURL('image/webp', quality);
                    const base64 = webpDataUrl.split(',')[1];
                    resolve({ origW, origH, targetW, targetH, base64 });
                };
                img.onerror = () => reject(new Error('Image load error'));
                img.src = dataUrl;
            });
        },
        { dataUrl, maxWidth: 560, quality: 0.80 }
    );

    const outBuf = Buffer.from(result.base64, 'base64');
    const outPath = path.join(outDir, `${item.id}.webp`);
    fs.writeFileSync(outPath, outBuf);

    stats.push({
        id: item.id,
        title: item.title,
        titleTr: item.titleTr,
        sourceFile: path.relative(appRoot, item.filePath).replace(/\\/g, '/'),
        thumbUrl: `/img/archive-thumbs/${item.id}.webp`,
        origBytes: buf.length,
        thumbBytes: outBuf.length,
        origDims: `${result.origW}x${result.origH}`,
        thumbDims: `${result.targetW}x${result.targetH}`,
        reductionPct: Number(((1 - outBuf.length / buf.length) * 100).toFixed(1)),
    });
}

await browser.close();

const totalOrigKB = Math.round(stats.reduce((s, x) => s + x.origBytes, 0) / 1024);
const totalThumbKB = Math.round(stats.reduce((s, x) => s + x.thumbBytes, 0) / 1024);
const docOrigKB = Math.round(stats.filter((x) => x.id.startsWith('doc-')).reduce((s, x) => s + x.origBytes, 0) / 1024);
const docThumbKB = Math.round(stats.filter((x) => x.id.startsWith('doc-')).reduce((s, x) => s + x.thumbBytes, 0) / 1024);

fs.writeFileSync(
    'C:/Users/Alexi/.gemini/antigravity/brain/f27e6ef2-43ae-40e2-b78a-de75157e7ac0/scratch/archive-thumb-stats.json',
    JSON.stringify({ totalOrigKB, totalThumbKB, docOrigKB, docThumbKB, items: stats }, null, 2)
);

console.log(`Generated ${stats.length} WebP thumbnails in public/img/archive-thumbs/`);
console.log(`All ${stats.length} items: ${totalOrigKB} KB -> ${totalThumbKB} KB (${((1 - totalThumbKB / totalOrigKB) * 100).toFixed(1)}% reduction)`);
console.log(`First tab (Documents & People, 8 items): ${docOrigKB} KB -> ${docThumbKB} KB (${((1 - docThumbKB / docOrigKB) * 100).toFixed(1)}% reduction)`);
