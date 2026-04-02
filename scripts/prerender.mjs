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
  { path: '/', waitFor: '.review-card, article, section#prices .btn-sm', output: 'index.html' },
  { path: '/services', waitFor: 'section#services h3', output: 'services.html' },
  { path: '/masters', waitFor: 'section#masters h3', output: 'masters.html' },
  { path: '/prices', waitFor: 'section#prices .btn-sm', output: 'prices.html' },
  { path: '/reviews', waitFor: '.review-card, article', output: 'reviews.html' },
];

async function renderPage(browser, baseUrl, route) {
  const page = await browser.newPage();

  // Log console errors for debugging
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('CORS')) {
      console.log(`  [console.error] ${msg.text().substring(0, 120)}`);
    }
  });

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
      console.log(`  [proxy error] ${url}: ${err.message}`);
      await routeObj.abort();
    }
  });

  await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for real data to render (not just skeletons)
  await page.waitForFunction(
    () => {
      // Check for rendered content: h3 (service/master names) or article (reviews) or button.btn-sm (prices)
      const h3s = document.querySelectorAll('main h3');
      const articles = document.querySelectorAll('main article');
      const priceBtns = document.querySelectorAll('main button.btn-sm');
      return h3s.length > 0 || articles.length > 0 || priceBtns.length > 0;
    },
    { timeout: 30000 }
  );

  // Extra settle time for JSON-LD injection
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
