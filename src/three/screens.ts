/**
 * Screens & textures — everything the phone displays is either a real app screenshot (public/screens)
 * or a procedural screen drawn on a 2D canvas (brand app, App Store page, lock screen, push cards, icon atlases).
 */
import { CanvasTexture, Texture, TextureLoader, SRGBColorSpace, LinearFilter, LinearMipmapLinearFilter } from 'three';

export const FONT = '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif';
export const SCREEN_W = 720, SCREEN_H = 1560;
export const INK = '#0b0f19', BLUE = '#155dfc';

let fontReady: Promise<void> | null = null;
export const loadFont = () => {
  if (!fontReady) fontReady = Promise.all([400, 500, 600].map((w) => document.fonts.load(`${w} 32px "Plus Jakarta Sans Variable"`))).then(() => undefined).catch(() => undefined);
  return fontReady;
};

export const loadImage = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });

const loader = new TextureLoader();
export interface ScreenTex { tex: Texture; aspect: number }
export const screenTexture = (src: string) => new Promise<ScreenTex>((res, rej) => {
  loader.load(src, (t) => { t.colorSpace = SRGBColorSpace; t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter; t.anisotropy = 4; res({ tex: t, aspect: t.image.width / t.image.height }); }, undefined, rej);
});

export const canvasTex = (w: number, h: number) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace; tex.minFilter = LinearMipmapLinearFilter; tex.magFilter = LinearFilter; tex.anisotropy = 4;
  return { c, ctx, tex };
};

export const rr = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
};
export const wrap = (ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines = 2) => {
  const words = text.split(' '); const lines: string[] = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s?\S*$/, '') + '…'; }
  return lines;
};
const hexToRgb = (hex: string) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const mixHex = (a: string, b: string, t: number) => { const A = hexToRgb(a), B = hexToRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
const lum = (hex: string) => { const [r, g, b] = hexToRgb(hex); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };

/* ---------- status bar (shared) ---------- */
const statusBar = (ctx: CanvasRenderingContext2D, dark = false) => {
  ctx.fillStyle = dark ? '#fff' : INK; ctx.font = `600 34px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText('9:41', 64, 62);
  // signal / wifi / battery
  ctx.textAlign = 'right';
  const x = SCREEN_W - 60;
  for (let i = 0; i < 4; i++) { rr(ctx, x - 150 + i * 12, 70 - 8 - i * 5, 8, 8 + i * 5, 2); ctx.fill(); }
  ctx.beginPath(); ctx.arc(x - 70, 68, 16, Math.PI * 1.2, Math.PI * 1.8); ctx.lineWidth = 5; ctx.strokeStyle = ctx.fillStyle as string; ctx.stroke();
  ctx.beginPath(); ctx.arc(x - 70, 68, 9, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
  ctx.beginPath(); ctx.arc(x - 70, 70, 3, 0, Math.PI * 2); ctx.fill();
  rr(ctx, x - 46, 54, 44, 24, 6); ctx.lineWidth = 3; ctx.stroke(); rr(ctx, x - 42, 58, 30, 16, 3); ctx.fill();
};

/* ---------- procedural brand app ---------- */
export interface BrandScreenOpts { color: string; name: string; products: number; initial?: string; offer?: boolean }
export const drawBrandScreen = (ctx: CanvasRenderingContext2D, o: BrandScreenOpts) => {
  const W = SCREEN_W, H = SCREEN_H; const ink = INK;
  const onColor = lum(o.color) > 0.6 ? ink : '#fff';
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  statusBar(ctx);
  // header
  ctx.fillStyle = ink; ctx.font = `600 36px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(o.name.toUpperCase(), 48, 160);
  ctx.lineWidth = 4; ctx.strokeStyle = ink; ctx.lineCap = 'round';
  // search & bag icons
  ctx.beginPath(); ctx.arc(W - 150, 156, 14, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W - 140, 166); ctx.lineTo(W - 128, 178); ctx.stroke();
  rr(ctx, W - 92, 148, 40, 34, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(W - 72, 146, 12, Math.PI, 0); ctx.stroke();
  // hero banner
  const by = 220, bh = 420;
  const g = ctx.createLinearGradient(0, by, W, by + bh); g.addColorStop(0, o.color); g.addColorStop(1, mixHex(o.color, '#000000', 0.35));
  ctx.fillStyle = g; rr(ctx, 40, by, W - 80, bh, 28); ctx.fill();
  // decorative circles
  ctx.save(); rr(ctx, 40, by, W - 80, bh, 28); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.beginPath(); ctx.arc(W - 120, by + 80, 200, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(W - 40, by + 360, 160, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = onColor; ctx.font = `600 22px ${FONT}`; ctx.fillText((o.offer ? 'SÓ NO APP' : 'NOVA COLEÇÃO'), 88, by + 80);
  ctx.font = `500 56px ${FONT}`; ctx.fillText(o.offer ? 'Frete grátis' : 'Lançamento', 86, by + 150); ctx.fillText(o.offer ? 'no primeiro' : 'de temporada', 86, by + 212); if (o.offer) ctx.fillText('pedido', 86, by + 274);
  ctx.fillStyle = onColor; rr(ctx, 88, by + bh - 100, 230, 60, 30); ctx.fill();
  ctx.fillStyle = onColor === '#fff' ? o.color : '#fff'; ctx.font = `600 24px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('Comprar agora', 88 + 115, by + bh - 70); ctx.textAlign = 'left';
  // section title
  ctx.fillStyle = ink; ctx.font = `500 34px ${FONT}`; ctx.fillText('Mais vendidos', 48, 710);
  ctx.fillStyle = o.color; ctx.font = `500 24px ${FONT}`; ctx.textAlign = 'right'; ctx.fillText('Ver tudo', W - 48, 712); ctx.textAlign = 'left';
  // products grid 2 x 3
  const cols = 2, cw = (W - 96 - 24) / cols, ch = 330;
  for (let i = 0; i < 6; i++) {
    const cx = 48 + (i % cols) * (cw + 24), cy = 760 + Math.floor(i / cols) * (ch + 28);
    const shown = i < o.products;
    ctx.save(); ctx.globalAlpha = shown ? 1 : 0.18;
    const gg = ctx.createLinearGradient(cx, cy, cx + cw, cy + 220); gg.addColorStop(0, '#f1f2f5'); gg.addColorStop(1, '#e2e5ec');
    ctx.fillStyle = gg; rr(ctx, cx, cy, cw, 220, 18); ctx.fill();
    if (shown) {
      ctx.fillStyle = mixHex(o.color, '#ffffff', 0.78); ctx.beginPath(); ctx.ellipse(cx + cw / 2, cy + 120, 60 + (i % 3) * 14, 72, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = mixHex(o.color, '#ffffff', 0.45); rr(ctx, cx + cw / 2 - 30, cy + 70, 60 + (i % 2) * 20, 90, 14); ctx.fill();
    }
    ctx.fillStyle = shown ? ink : '#c3c7d1'; ctx.font = `500 22px ${FONT}`; ctx.fillText(['Essencial', 'Clássico', 'Edição app', 'Conforto', 'Premium', 'Básico'][i], cx, cy + 250);
    ctx.fillStyle = shown ? o.color : '#c3c7d1'; ctx.font = `600 24px ${FONT}`; ctx.fillText(['R$ 189,90', 'R$ 249,00', 'R$ 129,90', 'R$ 99,90', 'R$ 329,00', 'R$ 79,90'][i], cx, cy + 288);
    ctx.restore();
  }
  // tab bar
  ctx.fillStyle = '#fff'; ctx.fillRect(0, H - 150, W, 150); ctx.fillStyle = '#e6e8ee'; ctx.fillRect(0, H - 150, W, 2);
  const tabs = ['Início', 'Buscar', 'Sacola', 'Conta'];
  tabs.forEach((t, i) => { const tx = W / 8 + (i * W) / 4; ctx.fillStyle = i === 0 ? o.color : '#9aa0ad'; rr(ctx, tx - 16, H - 120, 32, 32, 8); ctx.fill(); ctx.font = `500 20px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(t, tx, H - 62); });
  ctx.textAlign = 'left';
  ctx.fillStyle = ink; rr(ctx, W / 2 - 90, H - 22, 180, 8, 4); ctx.fill();
};

/* ---------- App Store listing ---------- */
export const drawStoreScreen = (ctx: CanvasRenderingContext2D, o: { color: string; name: string; initial?: string }) => {
  const W = SCREEN_W, H = SCREEN_H; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); statusBar(ctx);
  ctx.fillStyle = BLUE; ctx.font = `500 28px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('‹ Buscar', 48, 150);
  // icon
  const g = ctx.createLinearGradient(48, 220, 288, 460); g.addColorStop(0, o.color); g.addColorStop(1, mixHex(o.color, '#000', 0.3));
  ctx.fillStyle = g; rr(ctx, 48, 220, 240, 240, 54); ctx.fill();
  ctx.fillStyle = lum(o.color) > 0.6 ? INK : '#fff'; ctx.font = `600 120px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText((o.initial ?? o.name[0]).toUpperCase(), 168, 346);
  ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.font = `500 44px ${FONT}`; ctx.fillText(o.name, 320, 262);
  ctx.fillStyle = '#5f6673'; ctx.font = `400 26px ${FONT}`; ctx.fillText(`${o.name} · Compras`, 320, 308);
  ctx.fillStyle = BLUE; rr(ctx, 320, 380, 170, 64, 32); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = `600 26px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('OBTER', 405, 413);
  ctx.textAlign = 'left';
  // stats row
  ctx.fillStyle = '#e6e8ee'; ctx.fillRect(48, 520, W - 96, 2); ctx.fillRect(48, 660, W - 96, 2);
  const stats = [['4,9', '★★★★★'], ['Grátis', 'Compras'], ['4+', 'Idade'], ['Nº 3', 'Compras']];
  stats.forEach((s, i) => { const x = 48 + ((i + 0.5) * (W - 96)) / 4; ctx.textAlign = 'center'; ctx.fillStyle = '#5f6673'; ctx.font = `600 20px ${FONT}`; ctx.fillText(['AVALIAÇÕES', 'PREÇO', 'IDADE', 'CATEGORIA'][i], x, 556); ctx.fillStyle = INK; ctx.font = `500 34px ${FONT}`; ctx.fillText(s[0], x, 600); ctx.fillStyle = '#9aa0ad'; ctx.font = `400 20px ${FONT}`; ctx.fillText(s[1], x, 636); });
  ctx.textAlign = 'left';
  ctx.fillStyle = INK; ctx.font = `500 32px ${FONT}`; ctx.fillText('Prévia', 48, 720);
  for (let i = 0; i < 2; i++) { const x = 48 + i * 330; const gg = ctx.createLinearGradient(x, 770, x + 300, 1380); gg.addColorStop(0, mixHex(o.color, '#fff', 0.1)); gg.addColorStop(1, mixHex(o.color, '#000', 0.4)); ctx.fillStyle = gg; rr(ctx, x, 770, 300, 620, 36); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; rr(ctx, x + 28, 830, 244, 120, 18); ctx.fill(); for (let k = 0; k < 4; k++) { rr(ctx, x + 28 + (k % 2) * 124, 980 + Math.floor(k / 2) * 170, 120, 150, 14); ctx.fill(); } }
  ctx.fillStyle = INK; rr(ctx, W / 2 - 90, H - 22, 180, 8, 4); ctx.fill();
};

/* ---------- lock screen ---------- */
export interface LockOpts { time: string; date: string; push?: { icon?: HTMLImageElement | null; brand: string; title: string; body: string; y?: number; alpha?: number } }
export const drawLockScreen = (ctx: CanvasRenderingContext2D, o: LockOpts) => {
  const W = SCREEN_W, H = SCREEN_H; ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1b2f6b'); g.addColorStop(0.5, '#0f1a3d'); g.addColorStop(1, '#0b0f19');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const rg = ctx.createRadialGradient(W * 0.75, H * 0.2, 10, W * 0.75, H * 0.2, 600); rg.addColorStop(0, 'rgba(21,93,252,0.55)'); rg.addColorStop(1, 'rgba(21,93,252,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  statusBar(ctx, true);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = `500 30px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.date, W / 2, 200);
  ctx.fillStyle = '#fff'; ctx.font = `300 190px ${FONT}`; ctx.fillText(o.time, W / 2, 330);
  if (o.push) {
    const p = o.push; const a = p.alpha ?? 1; const y = 520 + (p.y ?? 0);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; rr(ctx, 40, y, W - 80, 190, 40); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.stroke();
    if (p.icon) { ctx.save(); rr(ctx, 72, y + 44, 100, 100, 24); ctx.clip(); ctx.drawImage(p.icon, 72, y + 44, 100, 100); ctx.restore(); } else { ctx.fillStyle = BLUE; rr(ctx, 72, y + 44, 100, 100, 24); ctx.fill(); }
    ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `600 28px ${FONT}`; ctx.fillText(p.title, 200, y + 62);
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = `400 26px ${FONT}`; wrap(ctx, p.body, W - 300, 3).forEach((l, i) => ctx.fillText(l, 200, y + 104 + i * 32));
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = `400 22px ${FONT}`; ctx.fillText('agora', W - 72, y + 62);
    ctx.restore();
  }
  // flashlight / camera
  ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.arc(100, H - 120, 46, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(W - 100, H - 120, 46, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; rr(ctx, W / 2 - 90, H - 22, 180, 8, 4); ctx.fill();
};

/* ---------- push card (floats over the app screen) ---------- */
export const PUSH_W = 680, PUSH_H = 200;
export interface PushOpts { icon?: HTMLImageElement | null; brand: string; text: string; time?: string }
export const drawPushCard = (ctx: CanvasRenderingContext2D, o: PushOpts) => {
  const W = PUSH_W, H = PUSH_H; ctx.clearRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = 'rgba(11,15,25,0.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
  ctx.fillStyle = 'rgba(255,255,255,0.94)'; rr(ctx, 10, 6, W - 20, H - 34, 38); ctx.fill(); ctx.restore();
  if (o.icon) { ctx.save(); rr(ctx, 44, 40, 96, 96, 22); ctx.clip(); ctx.drawImage(o.icon, 44, 40, 96, 96); ctx.restore(); } else { ctx.fillStyle = BLUE; rr(ctx, 44, 40, 96, 96, 22); ctx.fill(); }
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.font = `600 28px ${FONT}`; ctx.fillText(o.brand, 168, 58);
  ctx.textAlign = 'right'; ctx.fillStyle = '#8a909c'; ctx.font = `400 22px ${FONT}`; ctx.fillText(o.time ?? 'agora', W - 44, 58);
  ctx.textAlign = 'left'; ctx.fillStyle = '#3a4150'; ctx.font = `400 26px ${FONT}`;
  wrap(ctx, o.text, W - 230, 2).forEach((l, i) => ctx.fillText(l, 168, 98 + i * 34));
};

/* ---------- icon atlas ---------- */
export interface Atlas { tex: Texture; cols: number; count: number }
export const buildAtlas = async (files: string[], opts: { size?: number; mode?: 'image' | 'mono'; bg?: string; pad?: number } = {}): Promise<Atlas> => {
  const size = opts.size ?? 256, cols = Math.ceil(Math.sqrt(files.length)), pad = opts.pad ?? 0;
  const { c, ctx, tex } = canvasTex(cols * size, cols * size);
  const imgs = await Promise.all(files.map((f) => loadImage(f).catch(() => null)));
  imgs.forEach((img, i) => {
    const x = (i % cols) * size, y = Math.floor(i / cols) * size;
    ctx.save();
    if (opts.mode === 'mono') {
      // dark tile with a white silhouette of the logo
      ctx.fillStyle = opts.bg ?? '#141927'; rr(ctx, x, y, size, size, size * 0.2); ctx.fill();
      if (img) {
        const t = document.createElement('canvas'); t.width = size; t.height = size; const tc = t.getContext('2d')!;
        const s = Math.min((size - pad * 2) / img.width, (size - pad * 2) / img.height); const w = img.width * s, h = img.height * s;
        tc.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        tc.globalCompositeOperation = 'source-in'; tc.fillStyle = '#fff'; tc.fillRect(0, 0, size, size);
        ctx.drawImage(t, x, y);
      }
    } else {
      ctx.fillStyle = opts.bg ?? '#fff'; ctx.fillRect(x, y, size, size);
      if (img) ctx.drawImage(img, x, y, size, size);
    }
    ctx.restore();
  });
  tex.needsUpdate = true;
  void c;
  return { tex, cols, count: files.length };
};
