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

async function prerender() {
  console.log('🔄 Starting prerender...');

  const { server, port } = await serveStatic();
  const url = `http://127.0.0.1:${port}/`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for main content sections to appear
  await page.waitForSelector('section#services', { timeout: 15000 });
  await page.waitForSelector('section#masters', { timeout: 15000 });
  await page.waitForSelector('section#reviews', { timeout: 15000 });

  // Remove scripts to avoid re-hydration issues, then re-add the module script
  const html = await page.evaluate(() => {
    // Remove Vite module scripts (React will re-hydrate)
    // Keep only the rendered HTML as a static snapshot
    const scripts = document.querySelectorAll('script[type="module"]');
    const scriptSrcs = [];
    scripts.forEach((s) => {
      scriptSrcs.push(s.outerHTML);
      s.remove();
    });

    // Get the rendered HTML
    let fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

    // Re-add scripts at the end of body so the page re-hydrates on the client
    const bodyEnd = fullHtml.lastIndexOf('</body>');
    if (bodyEnd !== -1) {
      fullHtml = fullHtml.slice(0, bodyEnd) + scriptSrcs.join('\n') + '\n' + fullHtml.slice(bodyEnd);
    }

    return fullHtml;
  });

  const indexPath = join(distDir, 'index.html');
  writeFileSync(indexPath, html, 'utf-8');

  await browser.close();
  server.close();

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`✅ Prerendered / → dist/index.html (${sizeKB} KB)`);
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err.message);
  process.exit(1);
});
