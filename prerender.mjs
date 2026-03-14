import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
    '/',
    '/tarihce',
    '/arsiv',
    '/mekan-kiralama',
    '/gecmis-etkinlikler',
    '/bize-ulasin'
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log('Starting preview server...');
    const server = spawn('npm', ['run', 'preview', '--', '--port', '4173'], {
        stdio: 'pipe',
        cwd: __dirname,
        shell: true
    });

    server.stdout.on('data', (data) => console.log(`[Preview Server]: ${data}`));
    server.stderr.on('data', (data) => console.error(`[Preview Server]: ${data}`));

    console.log('Waiting for preview server to boot...');
    await sleep(3000); // give it time to startup

    try {
        console.log('Launching puppeteer...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        for (const route of routes) {
            console.log(`Prerendering route: ${route}`);
            await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Allow React components to finish fetching data if any
            await sleep(1000);

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
