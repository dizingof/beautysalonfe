/**
 * Post-build prerender script.
 * Opens dist/index.html in headless Chromium via Playwright,
 * waits for React to render content from the API,
 * and saves the fully rendered HTML back to dist/index.html.
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webmanifest': 'application/manifest+json',
};

// Serve dist/ on a random port
function serveStatic() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);
      if (!existsSync(filePath)) {
        filePath = join(distDir, 'index.html');
      }
      const ext = extname(filePath);
      const mime = mimeTypes[ext] || 'application/octet-stream';
      try {
        const data = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

const routes = [
  { path: '/', waitFor: 'section#services', output: 'index.html' },
  { path: '/services', waitFor: 'section#services', output: 'services.html' },
  { path: '/masters', waitFor: 'section#masters', output: 'masters.html' },
  { path: '/prices', waitFor: 'section#prices', output: 'prices.html' },
  { path: '/reviews', waitFor: 'section#reviews', output: 'reviews.html' },
];

async function renderPage(browser, baseUrl, route) {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' });
  await page.waitForSelector(route.waitFor, { timeout: 15000 });

  const html = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="module"]');
    const scriptSrcs = [];
    scripts.forEach((s) => {
      scriptSrcs.push(s.outerHTML);
      s.remove();
    });

    let fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

    const bodyEnd = fullHtml.lastIndexOf('</body>');
    if (bodyEnd !== -1) {
      fullHtml = fullHtml.slice(0, bodyEnd) + scriptSrcs.join('\n') + '\n' + fullHtml.slice(bodyEnd);
    }
    return fullHtml;
  });

  await page.close();
  return html;
}

async function prerender() {
  console.log('🔄 Starting prerender...');

  const { server, port } = await serveStatic();
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });

  for (const route of routes) {
    const html = await renderPage(browser, baseUrl, route);
    const outPath = join(distDir, route.output);
    writeFileSync(outPath, html, 'utf-8');
    const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
    console.log(`  ✅ ${route.path} → ${route.output} (${sizeKB} KB)`);
  }

  await browser.close();
  server.close();

  console.log(`✅ Prerendered ${routes.length} pages`);
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err.message);
  process.exit(1);
});
