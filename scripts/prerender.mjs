/**
 * Post-build prerender script.
 * Opens built pages in headless Chromium via Playwright,
 * waits for React to render content from the API,
 * and saves the fully rendered HTML.
 *
 * Graceful: if Playwright or Chromium is unavailable, the build
 * continues with the original SPA HTML (no prerender).
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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
      resolve({ server, port: server.address().port });
    });
  });
}

const routes = [
  { path: '/', output: 'index.html' },
  { path: '/services', output: 'services.html' },
  { path: '/masters', output: 'masters.html' },
  { path: '/prices', output: 'prices.html' },
  { path: '/reviews', output: 'reviews.html' },
];

async function renderPage(browser, baseUrl, route) {
  const page = await browser.newPage();

  // Bypass CORS by intercepting API requests and fetching server-side
  await page.route('https://beautysalon-api.fly.dev/**', async (routeObj) => {
    const url = routeObj.request().url();
    try {
      const response = await fetch(url);
      const body = await response.text();
      await routeObj.fulfill({
        status: response.status,
        contentType: response.headers.get('content-type') || 'application/json',
        body,
      });
    } catch (err) {
      console.log(`  ⚠ proxy error ${url}: ${err.message}`);
      await routeObj.abort();
    }
  });

  await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for real data to render (not just skeletons)
  await page.waitForFunction(
    () => {
      const h3s = document.querySelectorAll('main h3');
      const articles = document.querySelectorAll('main article');
      const priceBtns = document.querySelectorAll('main button.btn-sm');
      return h3s.length > 0 || articles.length > 0 || priceBtns.length > 0;
    },
    { timeout: 30000 }
  );

  // Settle time for JSON-LD injection
  await page.waitForTimeout(2000);

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
  // Ensure Chromium is installed
  console.log('🔄 Ensuring Chromium is available...');
  try {
    execSync('npx playwright install chromium', { stdio: 'inherit' });
  } catch {
    console.warn('⚠ Could not install Chromium. Skipping prerender.');
    return;
  }

  const { chromium } = await import('playwright');

  console.log('🔄 Starting prerender...');
  const { server, port } = await serveStatic();
  const baseUrl = `http://127.0.0.1:${port}`;

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.warn(`⚠ Could not launch Chromium: ${err.message}. Skipping prerender.`);
    server.close();
    return;
  }

  for (const route of routes) {
    try {
      const html = await renderPage(browser, baseUrl, route);
      const outPath = join(distDir, route.output);
      writeFileSync(outPath, html, 'utf-8');
      const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
      console.log(`  ✅ ${route.path} → ${route.output} (${sizeKB} KB)`);
    } catch (err) {
      console.warn(`  ⚠ Failed to prerender ${route.path}: ${err.message}`);
    }
  }

  await browser.close();
  server.close();
  console.log('✅ Prerender complete');
}

// Graceful: never fail the build
prerender().catch((err) => {
  console.warn(`⚠ Prerender skipped: ${err.message}`);
});
