/**
 * Screenshot helper.
 *   node scripts/shot.mjs <distDir> <outDir> [desktop|mobile|all] [#section-id]
 * env: PORT (default 4321) — use a distinct port when running in parallel.
 * With a section id, scrolls it into view, waits for scene animations (2.4s) and shoots only that element
 * (plus a `-mid` frame at 700ms to catch the animation in flight). Without it, shoots the full page with every reveal forced.
 */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
const root = process.argv[2]; const out = process.argv[3]; const which = process.argv[4] ?? 'all'; const section = process.argv[5];
const PORT = Number(process.env.PORT || 4321);
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.json':'application/json', '.xml':'application/xml' };
const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  let f = join(root, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); const b = await readFile(f); res.writeHead(200, { 'content-type': mime[extname(f)] ?? 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => srv.listen(PORT, r));
const exe = process.env.CHROME ?? `${process.env.HOME}/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`;
const browser = await chromium.launch({ executablePath: exe });
const shots = which === 'all' ? ['desktop', 'mobile'] : [which];
for (const kind of shots) {
  const ctx = await browser.newContext(kind === 'mobile' ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.setItem('korza:consent', 'denied'); } catch {} const c = document.getElementById('consent'); if (c) c.hidden = true; });
  if (section) {
    const el = page.locator(section).first();
    await el.scrollIntoViewIfNeeded();
    await page.evaluate((s) => { const n = document.querySelector(s); n && n.scrollIntoView({ block: 'start' }); }, section);
    await page.waitForTimeout(700);
    await el.screenshot({ path: `${out}/${kind}-${section.replace(/[^a-z0-9]/gi, '')}-mid.png` });
    await page.waitForTimeout(2400);
    await el.screenshot({ path: `${out}/${kind}-${section.replace(/[^a-z0-9]/gi, '')}.png` });
    console.log(kind, section, 'errors', errors);
  } else {
    await page.evaluate(async () => {
      document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in'));
      document.querySelectorAll('[data-scene]').forEach(e => e.classList.add('is-on'));
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 2600));
      await Promise.race([Promise.all([...document.images].map(i => i.decode().catch(() => {}))), new Promise(r => setTimeout(r, 4000))]);
    });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${out}/${kind}-full.png`, fullPage: true });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(kind, 'height', h, 'errors', errors);
  }
  await ctx.close();
}
await browser.close(); srv.close();
