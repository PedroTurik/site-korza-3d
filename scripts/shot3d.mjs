/**
 * 3D screenshot helper: node scripts/shot3d.mjs <distDir> <outDir> [desktop|mobile|all]
 * Serves dist, enables software WebGL, scrolls through each scene at several progress points and shoots the viewport.
 */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
const root = process.argv[2]; const out = process.argv[3]; const which = process.argv[4] ?? 'all';
const PORT = Number(process.env.PORT || 4377);
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.json':'application/json', '.xml':'application/xml' };
const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  let f = join(root, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); const b = await readFile(f); res.writeHead(200, { 'content-type': mime[extname(f)] ?? 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => srv.listen(PORT, r));
const exe = process.env.CHROME ?? `${process.env.HOME}/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`;
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const shots = which === 'all' ? ['desktop', 'mobile'] : which === 'nogl' ? ['nogl'] : [which];
// [scene id, progress points]
const plan = [['hero', [0, 0.25, 0.5, 0.8]], ['marcas', [0.15, 0.5, 0.85]], ['como-funciona', [0.1, 0.25, 0.5, 0.75, 0.95]], ['recompra', ['enter']], ['metodo-aop', [0.15, 0.45, 0.8]], ['funcionalidades', ['enter']], ['dashboard', [0.2, 0.7]], ['cases', [0.1, 0.4, 0.65, 0.9]], ['cta', ['enter']]];
for (const kind of shots) {
  const ctx = await browser.newContext(kind === 'mobile' ? { viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  if (kind === 'nogl') { await page.emulateMedia({ reducedMotion: 'reduce' }); }
  const errors = []; page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text().slice(0, 300)); }); page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.setItem('korza:consent', 'denied'); } catch {} const c = document.getElementById('consent'); if (c) c.hidden = true; });
  await page.waitForFunction(() => document.documentElement.classList.contains('gl-ready') || document.documentElement.classList.contains('no-gl'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const cls = await page.evaluate(() => document.documentElement.className);
  console.log(kind, 'html class:', cls);
  if (kind === 'nogl') {
    await page.evaluate(async () => { document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in')); document.querySelectorAll('[data-scene]').forEach(e => e.classList.add('is-on')); document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; }); const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 1500)); });
    await page.screenshot({ path: `${out}/nogl-full.png`, fullPage: true });
    console.log('nogl height', await page.evaluate(() => document.documentElement.scrollHeight), 'errors', errors.slice(0, 8));
    await ctx.close(); continue;
  }
  for (const [id, pts] of plan) {
    for (const pt of pts) {
      await page.evaluate(([id, pt]) => {
        const el = document.getElementById(id); if (!el) return;
        const r = el.getBoundingClientRect(); const top = scrollY + r.top; const vh = innerHeight;
        const y = pt === 'enter' ? top - vh * 0.25 : top + pt * Math.max(0, r.height - vh);
        const k = window.__korza3d; if (k && k.lenis) k.lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      }, [id, pt]);
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${out}/${kind}-${id}-${pt}.png` });
    }
  }
  console.log(kind, 'errors', errors.slice(0, 12));
  await ctx.close();
}
await browser.close(); srv.close();
