import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
    // Turkish routes (default)
    '/',
    '/tarihce',
    '/arsiv',
    '/mekan-kiralama',
    '/gecmis-etkinlikler',
    '/bize-ulasin',
    '/ammf',
    
    // English routes
    '/en',
    '/en/tarihce',
    '/en/arsiv',
    '/en/mekan-kiralama',
    '/en/gecmis-etkinlikler',
    '/en/bize-ulasin',
    '/en/ammf',
    
    // Greek routes
    '/el',
    '/el/tarihce',
    '/el/arsiv',
    '/el/mekan-kiralama',
    '/el/gecmis-etkinlikler',
    '/el/bize-ulasin',
    '/el/ammf'
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    // Copy the original index.html to app.html to preserve SPA fallback
    const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
    const appHtmlPath = path.join(__dirname, 'dist', 'app.html');
    if (fs.existsSync(indexHtmlPath)) {
        fs.copyFileSync(indexHtmlPath, appHtmlPath);
        console.log('Copied dist/index.html to dist/app.html');
    } else {
        console.error('dist/index.html not found! Cannot copy to app.html');
    }

    console.log('Starting preview server...');
    const server = spawn('npm', ['run', 'preview', '--', '--port', '4173'], {
        stdio: 'pipe',
        cwd: __dirname,
        shell: true
    });

    server.stdout.on('data', (data) => console.log(`[Preview Server]: ${data}`));
    server.stderr.on('data', (data) => console.error(`[Preview Server]: ${data}`));

    console.log('Waiting for preview server to boot...');
    await sleep(6000); // give it time to startup

    try {
        console.log('Launching puppeteer...');
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
        page.on('requestfailed', request => {
            console.error('REQUEST FAILED:', request.url(), request.failure().errorText);
        });

        for (const route of routes) {
            console.log(`Prerendering route: ${route}`);
            await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Allow React components to finish fetching data if any
            await sleep(1500);

            const html = await page.content();
            
            // Determine output path
            let outPath = path.join(__dirname, 'dist', route === '/' ? 'index.html' : route);
            if (route !== '/') {
                if (!fs.existsSync(outPath)) {
                    fs.mkdirSync(outPath, { recursive: true });
                }
                outPath = path.join(outPath, 'index.html');
            }
            
            fs.writeFileSync(outPath, html, 'utf-8');
            console.log(`Saved static HTML to ${outPath}`);
        }

        await browser.close();
    } catch (err) {
        console.error('Error during prerendering:', err);
    } finally {
        server.kill('SIGINT');
        console.log('Preview server stopped.');
        process.exit(0);
    }
}

run();
