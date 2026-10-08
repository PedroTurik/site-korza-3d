/**
 * Director — reads the DOM (pinned stages, slots), computes each scene's progress and drives the 3D objects.
 * The phone is one continuous object: every scene that owns a slot writes a target pose; the director damps towards it.
 */
import { Vector3 } from 'three';
import { Engine, damp, clamp01, smooth, lerp } from './engine';
import { Phone, SCREEN } from './phone';
import { Tiles } from './tiles';
import { Particles } from './particles';
import { Bars } from './bars';
import { canvasTex, drawBrandScreen, drawStoreScreen, drawLockScreen, screenTexture, loadImage, buildAtlas, loadFont, SCREEN_W, SCREEN_H, type ScreenTex } from './screens';
import type Lenis from 'lenis';

interface Rect { left: number; top: number; width: number; height: number; bottom: number; right: number }
interface Pose { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number }
interface SceneCtx { p: number; vis: number; rect: Rect; dt: number; t: number; own: boolean }
interface Scene { name: string; el: HTMLElement; pin: boolean; slot: HTMLElement | null; update: (c: SceneCtx) => Pose | null; enter?: () => void; leave?: () => void }

const PALETTE = ['#155dfc', '#0b0f19', '#5a3d2b', '#f0a6b9', '#12b76a'];
const APPLE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000" d="M16.4 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1.9-4 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.6-3.9ZM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.8-1.5Z"/></svg>')}`;
const PLAY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000" d="M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l9.2-9.6-9.2-9.6Z"/><path fill="#000" d="m15.9 15.1-3.1-3.1-9.2 9.6c.5.5 1.3.5 2.2 0l10.1-6.5Z"/><path fill="#000" d="m20 9.7-3.1-1.8-3 3.1 3.1 3.1 3-1.8c1.4-.8 1.4-1.9 0-2.6Z"/><path fill="#000" d="M5.8 2.4 15.9 8.9l-3.1 3.1L3.6 2.4c.5-.5 1.3-.5 2.2 0Z"/></svg>')}`;
const CLIENTS = ['loum', 'belletonn', 'pe-de-algodao', 'sunkids', 'consolatio', 'hiven', 'modernlar', 'dom', 'client-02', 'client-04', 'armazem-dos-chinelos', 'client-06', 'a22-sneakers', 'd1-fitness', 'alurra', 'cross-crown', 'green-is-good', 'gum', 'mahdri', 'betterlife', 'dona-rica', 'ginga', 'gabriela-guth', 'client-03'];
const INTEGRATIONS = ['shopify', 'nuvemshop', 'woocommerce', 'tray', 'yampi', 'vtex'];

const TAU = Math.PI * 2;
const nearest = (cur: number, target: number) => { let t = target; while (t - cur > Math.PI) t -= TAU; while (cur - t > Math.PI) t += TAU; return t; };

export class Director {
  phone = new Phone();
  scenes: Scene[] = [];
  pose: Pose = { x: 0, y: -6, z: 0, rx: 0, ry: 0, rz: 0, s: 1 };
  owner: Scene | null = null;
  off = { x: 0, y: 0, z: 0, s: 0 };
  ready = false; readyAt = 0;
  screens: Record<string, ScreenTex> = {};
  icons: Record<string, HTMLImageElement | null> = {};
  brand = canvasTex(SCREEN_W, SCREEN_H); brandTex: ScreenTex; brandState = '';
  store = canvasTex(SCREEN_W, SCREEN_H); storeTex: ScreenTex; storeState = '';
  lock = canvasTex(SCREEN_W, SCREEN_H); lockTex: ScreenTex;
  ring: Tiles | null = null; launchTiles: Tiles | null = null; particles: Particles; bars: Bars;
  userColor: string | null = null; userOffer: boolean | null = null; offerMix = 0.04;
  catcherY = 0; sunTarget = new Vector3();

  constructor(public engine: Engine, public lenis: Lenis | null) {
    this.brandTex = { tex: this.brand.tex, aspect: SCREEN_W / SCREEN_H };
    this.storeTex = { tex: this.store.tex, aspect: SCREEN_W / SCREEN_H };
    this.lockTex = { tex: this.lock.tex, aspect: SCREEN_W / SCREEN_H };
    this.particles = new Particles(engine.mobile ? 1500 : 3400);
    this.bars = new Bars([42, 32, 21]);
    engine.root.add(this.phone.group, this.particles.group, this.bars.group);
    this.collect();
    engine.onTick((dt, t) => this.tick(dt, t));
  }

  /* ---------- assets ---------- */
  async load() {
    await loadFont();
    const [hiven, hivenIcon] = await Promise.all([screenTexture('/screens/hiven.webp'), loadImage('/clients/hiven.webp').catch(() => null)]);
    this.screens.hiven = hiven; this.icons.hiven = hivenIcon;
    this.phone.setScreen(hiven, true);
    this.drawBrand(PALETTE[0], 0, false); this.drawStore(PALETTE[0]);
    drawLockScreen(this.lock.ctx, { time: '14:05', date: 'quarta-feira, 22 de outubro' }); this.lock.tex.needsUpdate = true;
    this.ready = true; this.readyAt = this.engine.time; this.phone.group.visible = true;
    document.documentElement.classList.add('gl-ready');
    // the rest in the background
    const rest = ['sunkids', 'd1-fitness', 'loum', 'belletonn', 'pe-de-algodao'];
    rest.forEach((n) => screenTexture(`/screens/${n}.webp`).then((t) => { this.screens[n] = t; }).catch(() => {}));
    ['sunkids', 'd1-fitness', 'belletonn', 'loum'].forEach((n) => loadImage(`/clients/${n}.webp`).then((i) => { this.icons[n] = i; }).catch(() => { this.icons[n] = null; }));
    buildAtlas(CLIENTS.map((c) => `/clients/${c}.webp`), { size: 192 }).then((a) => { this.ring = new Tiles(a, 48, 0.3, 0.22); this.engine.root.add(this.ring.group); });
    buildAtlas([...INTEGRATIONS.map((c) => `/integrations/${c}.svg`), APPLE_SVG, PLAY_SVG], { size: 192, mode: 'mono', pad: 44, bg: '#1b2030' }).then((a) => { this.launchTiles = new Tiles(a, 8, 0.3, 0.22); this.engine.root.add(this.launchTiles.group); });
  }
  drawBrand(color: string, products: number, offer: boolean) {
    const k = `${color}|${products}|${offer}`; if (k === this.brandState) return; this.brandState = k;
    drawBrandScreen(this.brand.ctx, { color, name: 'Sua loja', products, offer }); this.brand.tex.needsUpdate = true;
  }
  drawStore(color: string) { if (color === this.storeState) return; this.storeState = color; drawStoreScreen(this.store.ctx, { color, name: 'Sua loja' }); this.store.tex.needsUpdate = true; }

  /* ---------- DOM ---------- */
  collect() {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-s3]'));
    for (const el of els) {
      const name = el.dataset.s3!; const slot = el.querySelector<HTMLElement>('[data-slot]');
      const def = (this as any)['scene_' + name] as ((el: HTMLElement, slot: HTMLElement | null) => Partial<Scene>) | undefined;
      if (!def) continue;
      const s = def.call(this, el, slot);
      this.scenes.push({ name, el, pin: el.classList.contains('pin'), slot, update: s.update!, enter: s.enter, leave: s.leave });
    }
    // interactive bits
    document.querySelectorAll<HTMLButtonElement>('[data-swatch]').forEach((b) => b.addEventListener('click', () => { this.userColor = b.dataset.swatch!; }));
    document.querySelectorAll<HTMLButtonElement>('[data-offer]').forEach((b) => b.addEventListener('click', () => { this.userOffer = b.dataset.offer === '1'; }));
  }
  slotPose(slot: HTMLElement, fill = 0.9): Pose & { w: number; h: number } {
    const r = slot.getBoundingClientRect(); const w = this.engine.rectToWorld(r);
    return { x: w.x, y: w.y, z: 0, rx: 0, ry: 0, rz: 0, s: w.h * fill, w: w.w, h: w.h };
  }
  world(el: HTMLElement) { return this.engine.rectToWorld(el.getBoundingClientRect()); }

  /* ---------- scenes ---------- */
  scene_hero(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    const kpis = Array.from(el.querySelectorAll<HTMLElement>('[data-kpi]'));
    const pushes = [
      { n: 'hiven', brand: 'Hiven', text: 'Amanhã é dia 05/05 ✨ Lançamento com frete grátis só no app.' },
      { n: 'sunkids', brand: 'Sunkids', text: 'Que saudade de você ❤️ Preparamos uma surpresa para o seu retorno.' },
      { n: 'd1-fitness', brand: 'D1 Fitness', text: 'Chegou a Linha Sinex 💪 Cupom APP10 vale só até meia-noite.' },
    ];
    // optional drag-to-spin on the slot
    let drag = 0, dragV = 0, down: number | null = null;
    slot?.addEventListener('pointerdown', (e) => { down = e.clientX; slot.setPointerCapture(e.pointerId); });
    slot?.addEventListener('pointermove', (e) => { if (down === null) return; dragV = (e.clientX - down) * 0.012; down = e.clientX; drag += dragV; });
    const up = () => { down = null; }; slot?.addEventListener('pointerup', up); slot?.addEventListener('pointercancel', up);
    return {
      update: ({ p, dt, t, own }) => {
        if (!slot) return null;
        const sp = this.slotPose(slot, this.engine.mobile ? 0.92 : 0.88);
        const idle = this.ready ? smooth(0.6, 4.5, t - this.readyAt) * 0.2 : 0;
        const pv = Math.max(p, idle);
        const intro = this.ready ? smooth(0, 1.6, t - this.readyAt) : 0;
        const e = this.engine;
        if (down === null) { drag = damp(drag, 0, 2.5, dt); }
        const ry = -0.32 + e.pointer.x * 0.14 + p * 0.5 + drag + (1 - intro) * 0.9;
        const rx = -e.pointer.y * 0.1 + Math.sin(t * 0.7) * 0.015;
        const pose: Pose = { x: sp.x, y: sp.y + Math.sin(t * 0.6) * 0.006 * sp.s - (1 - intro) * 1.2 * sp.s, z: 0, rx, ry, rz: -0.07 + p * 0.07, s: sp.s * (0.9 + 0.1 * intro) };
        // pushes
        const seq = [0.04, 0.34, 0.64];
        if (own) {
          pushes.forEach((pu, i) => { const tt = clamp01((pv - seq[i]) / 0.3); this.phone.push(i, { icon: this.icons[pu.n] ?? null, brand: pu.brand, text: pu.text }, tt); });
          const screen = pv > 0.72 ? 'd1-fitness' : pv > 0.42 ? 'sunkids' : 'hiven';
          this.phone.setScreen(this.screens[screen] ?? this.screens.hiven);
        }
        kpis.forEach((k, i) => k.classList.toggle('is-in', pv > [0.14, 0.46][i] && pv < 0.95));
        el.classList.toggle('is-scrolled', p > 0.04);
        return pose;
      },
    };
  }

  scene_brands(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    return {
      update: ({ p, vis, t, own }) => {
        if (!slot) return null;
        const sp = this.slotPose(slot, this.engine.mobile ? 0.6 : 0.86);
        const e = this.engine;
        el.classList.toggle('is-on', p > 0.02);
        const screen = p > 0.68 ? 'pe-de-algodao' : p > 0.36 ? 'belletonn' : 'loum';
        if (own) { if (p > 0.03) this.phone.setScreen(this.screens[screen] ?? this.screens.hiven); this.phone.hidePushes(); }
        if (this.ring) {
          const r = this.ring; r.group.position.set(sp.x, sp.y, 0);
          const R = Math.min(e.visW * 0.36, Math.max(sp.h * 0.7, 1.6)); const n = r.n; const rows = e.mobile ? 2 : 3;
          const a0 = p * TAU * 0.6 + t * 0.05;
          const fade = smooth(0.0, 0.16, p) * (1 - smooth(0.9, 1, p)) * (vis > 0 ? 1 : 0);
          const ts = Math.min(1.9, (sp.h / 3.2) * 1.5) * (e.mobile ? 0.85 : 1);
          r.formation((i) => {
            const row = i % rows; const k = Math.floor(i / rows); const per = Math.ceil(n / rows);
            const a = (k / per) * TAU + a0 + row * (TAU / per) * 0.5 + (row === 1 ? 0.02 : 0);
            const y = (row - (rows - 1) / 2) * sp.h * 0.26 + Math.sin(a * 2 + t * 0.4 + row) * 0.03;
            const z = Math.sin(a) * R * 0.7 - 0.5; const depth = (Math.sin(a) + 1) / 2; // 0 back .. 1 front
            return { x: Math.cos(a) * R * (1 + row * 0.06), y, z, rx: 0, ry: 0, rz: 0, s: (0.6 + depth * 0.5) * ts * (0.3 + 0.7 * fade), a: fade * (0.5 + depth * 0.5) };
          });
        }
        return { x: sp.x, y: sp.y + Math.sin(t * 0.6) * 0.006 * sp.s, z: 0, rx: -e.pointer.y * 0.06 + 0.02, ry: p * TAU + e.pointer.x * 0.1, rz: 0, s: sp.s };
      },
      leave: () => { this.ring?.formation(() => ({ a: 0, s: 0.001 })); },
    };
  }

  scene_launch(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    const swatches = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-swatch]'));
    let lastStep = -1;
    return {
      update: ({ p, t, vis, own }) => {
        if (!slot) return null;
        const sp = this.slotPose(slot, this.engine.mobile ? 0.9 : 0.86); const e = this.engine;
        const step = p < 0.3 ? 0 : p < 0.63 ? 1 : 2;
        if (step !== lastStep) { lastStep = step; el.dataset.active = String(step); if (step !== 1) this.userColor = null; }
        el.style.setProperty('--p', p.toFixed(4));
        // color: auto-cycle during step 2 unless the user picked one
        const autoIdx = Math.min(PALETTE.length - 1, Math.floor(smooth(0.33, 0.58, p) * PALETTE.length));
        const color = step === 1 ? (this.userColor ?? PALETTE[autoIdx]) : step === 2 ? (this.userColor ?? PALETTE[PALETTE.length - 1]) : PALETTE[0];
        swatches.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.swatch === color)));
        const products = Math.round(smooth(0.1, 0.3, p) * 6);
        this.drawBrand(color, products, false);
        if (own) { if (step === 2) { this.drawStore(color); this.phone.setScreen(this.storeTex); } else this.phone.setScreen(this.brandTex); this.phone.hidePushes(); }
        // tiles: integrations converge into the phone (step 1); store badges rise beside it (step 3)
        if (this.launchTiles) {
          const tl = this.launchTiles; tl.group.position.set(sp.x, sp.y, 0);
          const R = sp.h * (this.engine.mobile ? 0.42 : 0.38);
          const inT = smooth(0.0, 0.1, p), conv = smooth(0.14, 0.3, p);
          tl.formation((i) => {
            if (i < 6) {
              const a = (i / 6) * TAU + 0.5 + t * 0.12;
              const r = R * (1 - conv) * inT + 0.001;
              return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.9, z: 0.35 - conv * 0.3, rx: 0, ry: 0, rz: 0, s: (sp.h / 3.2) * 1.1 * inT * (1 - conv), a: inT * (1 - conv) * (vis > 0 ? 1 : 0) };
            }
            const up = smooth(0.66, 0.8, p); const side = i === 6 ? -1 : 1;
            return { x: side * sp.s * 0.44, y: -sp.s * 0.18 + up * sp.s * 0.22 + Math.sin(t * 0.9 + i) * 0.015 * sp.s, z: 0.3, rx: 0, ry: 0, rz: 0, s: (sp.h / 3.2) * 1.3 * up, a: up * (1 - smooth(0.96, 1, p)) };
          });
        }
        const ry = e.pointer.x * 0.12 + (step === 2 ? -0.18 : 0.22 - p * 0.3) + Math.sin(t * 0.6) * 0.03;
        return { x: sp.x, y: sp.y + Math.sin(t * 0.6) * 0.006 * sp.s, z: 0, rx: -e.pointer.y * 0.08 + 0.02, ry, rz: step === 2 ? 0.03 : -0.02, s: sp.s * (step === 2 ? 1.04 : 1) };
      },
      leave: () => { this.launchTiles?.formation(() => ({ a: 0, s: 0.001 })); },
    };
  }

  scene_recompra(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    return {
      update: ({ dt }) => {
        if (!slot) return null;
        const r = slot.getBoundingClientRect(); const w = this.engine.rectToWorld(r); const vh = this.engine.size.y;
        const p = clamp01((vh * 0.92 - r.top) / (vh * 0.55));
        el.classList.toggle('is-on', p > 0.05);
        const cols = [0, 1, 2].map((i) => ({ x: w.x - w.w / 2 + (w.w * (i + 0.5)) / 3, w: (w.w / 3) * 0.78 }));
        this.bars.set(cols, w.y - w.h / 2, w.h * 0.92, p, dt, Math.min(0.9, (w.w / 3) * 0.6));
        return null;
      },
      leave: () => { this.bars.group.visible = false; },
      enter: () => { this.bars.group.visible = true; },
    };
  }

  scene_aop(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    const offerBtns = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-offer]'));
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'));
    let lastStep = -1, laidOut = '';
    return {
      update: ({ p, dt, t, vis, own }) => {
        if (!slot) return null;
        const r = slot.getBoundingClientRect(); const w = this.engine.rectToWorld(r); const e = this.engine; const mob = e.mobile;
        const step = p < 0.3 ? 0 : p < 0.62 ? 1 : 2;
        if (step !== lastStep) { lastStep = step; el.dataset.active = String(step); if (step === 0) this.userOffer = null; cards[step] && (window as any).__kCount?.(cards[step]); }
        const ph = w.h * (mob ? 0.72 : 0.82);
        const px = mob ? w.x + w.w * 0.24 : w.x + w.w * 0.2, py = w.y;
        const key = `${w.w.toFixed(2)}|${w.h.toFixed(2)}|${ph.toFixed(2)}`;
        if (key !== laidOut) { laidOut = key; this.particles.layout({ x: mob ? -w.w * 0.5 : -w.w * 0.5, y: 0, w: mob ? w.w * 0.42 : w.w * 0.4, h: mob ? w.h * 0.5 : w.h * 0.6 }, { x: 0, y: -ph * 0.02, w: SCREEN.W * ph * 0.72, h: SCREEN.H * ph * 0.7 }); }
        this.particles.group.position.set(px, py, 0);
        const offer = this.userOffer ?? step >= 1;
        offerBtns.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.offer === '1') === offer)));
        this.offerMix = damp(this.offerMix, offer ? 0.23 : 0.04, 4, dt);
        const flow = smooth(0.06, 0.55, p);
        const alpha = smooth(0.0, 0.08, p) * (1 - smooth(0.93, 1, p)) * (vis > 0 ? 1 : 0);
        const pulse = smooth(0.7, 0.96, p);
        this.particles.set(flow, this.offerMix, alpha, pulse, t, (e.renderer.getPixelRatio() * e.size.y) / (2 * Math.tan((e.camera.fov * Math.PI) / 360)));
        if (own) {
          this.drawBrand(PALETTE[0], 6, offer);
          this.phone.setScreen(this.brandTex);
          const pt = clamp01((p - 0.66) / 0.3);
          this.phone.push(0, { icon: null, brand: 'Sua loja', text: 'Seu cupom BEMVINDA10 vale só até hoje. Garanta sua primeira compra no app.' }, pt);
          this.phone.push(1, null, 0); this.phone.push(2, null, 0);
        }
        el.style.setProperty('--p', p.toFixed(4));
        return { x: px, y: py + Math.sin(t * 0.6) * 0.006 * ph, z: 0, rx: -e.pointer.y * 0.06, ry: -0.42 + e.pointer.x * 0.1 + step * 0.06, rz: 0.02, s: ph };
      },
      leave: () => { this.particles.set(0, 0.04, 0, 0, 0, 1); },
    };
  }

  scene_dash(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    const panel = el.querySelector<HTMLElement>('[data-hl]');
    const sale = el.querySelector<HTMLElement>('[data-sale]');
    return {
      update: ({ p, t, own }) => {
        if (!slot) return null;
        const sp = this.slotPose(slot, 0.96); const e = this.engine;
        el.classList.toggle('is-on', p > 0.04);
        if (own) {
          this.phone.setScreen(this.lockTex);
          const pt = clamp01((p - 0.28) / 0.5);
          this.phone.push(0, { icon: this.icons.belletonn ?? null, brand: 'Belletonn', text: 'Um mimo para quem já é de casa: use o cupom VOLTEI e ganhe 15% OFF.' }, pt * 0.85, 2.3);
          this.phone.push(1, null, 0); this.phone.push(2, null, 0);
        }
        const hl = p > 0.56; panel?.setAttribute('data-hl', hl ? 'campanha' : ''); sale?.classList.toggle('is-in', hl);
        el.style.setProperty('--p', p.toFixed(4));
        return { x: sp.x, y: sp.y + Math.sin(t * 0.6) * 0.006 * sp.s, z: 0.2, rx: -e.pointer.y * 0.06 + 0.04, ry: 0.42 - p * 0.25 + e.pointer.x * 0.1, rz: -0.08, s: sp.s };
      },
    };
  }

  scene_cases(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-case]'));
    const n = cards.length || 4;
    const cur = el.querySelector<HTMLElement>('[data-current]'); const dots = Array.from(el.querySelectorAll<HTMLElement>('[data-dots] i'));
    const names = cards.map((c) => c.dataset.case!);
    let last = -1; let spin = 0;
    const goTo = (i: number) => { const r = el.getBoundingClientRect(); const top = scrollY + r.top; const len = r.height - this.engine.size.y; const y = top + ((Math.max(0, Math.min(n - 1, i)) + 0.5) / n) * len; this.lenis ? this.lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' }); };
    el.querySelector('[data-prev]')?.addEventListener('click', () => goTo(last - 1));
    el.querySelector('[data-next]')?.addEventListener('click', () => goTo(last + 1));
    return {
      update: ({ p, t, own }) => {
        if (!slot) return null;
        const sp = this.slotPose(slot, this.engine.mobile ? 0.8 : 0.88); const e = this.engine;
        const idx = Math.min(n - 1, Math.floor(p * n)); const local = p * n - idx;
        if (idx !== last) { last = idx; el.dataset.active = String(idx); cards.forEach((c, i) => c.classList.toggle('is-active', i === idx)); if (cur) cur.textContent = String(idx + 1).padStart(2, '0'); dots.forEach((d, i) => d.classList.toggle('is-active', i === idx)); (window as any).__kCount?.(cards[idx]); }
        spin = idx + smooth(0, 0.32, local);
        const screenName = (local > 0.1 || idx === 0) ? names[idx] : names[idx - 1];
        if (own) { this.phone.setScreen(this.screens[screenName] ?? this.screens.loum ?? this.screens.hiven); this.phone.hidePushes(); }
        (el.querySelector('[data-prev]') as HTMLButtonElement | null)?.toggleAttribute('disabled', idx === 0);
        (el.querySelector('[data-next]') as HTMLButtonElement | null)?.toggleAttribute('disabled', idx === n - 1);
        return { x: sp.x, y: sp.y + Math.sin(t * 0.6) * 0.006 * sp.s, z: 0, rx: -e.pointer.y * 0.06, ry: spin * TAU - 0.2 + e.pointer.x * 0.1, rz: -0.03, s: sp.s };
      },
    };
  }

  scene_cta(el: HTMLElement, slot: HTMLElement | null): Partial<Scene> {
    return {
      update: ({ t, vis, own }) => {
        if (!slot) return null;
        const r = slot.getBoundingClientRect(); const vh = this.engine.size.y; const sp = this.slotPose(slot, 0.9); const e = this.engine;
        const pe = clamp01((vh * 0.9 - r.top) / (vh * 0.45));
        if (own) {
          this.phone.setScreen(this.screens.sunkids ?? this.screens.hiven);
          this.phone.push(0, { icon: this.icons.sunkids ?? null, brand: 'Sunkids', text: 'Seu app chegou 🎉 Frete grátis na primeira compra pelo aplicativo.' }, smooth(0.5, 1, pe) * 0.6);
          this.phone.push(1, null, 0); this.phone.push(2, null, 0);
        }
        if (this.ring) {
          const rg = this.ring; rg.group.position.set(sp.x, sp.y, 0); const R = Math.min(e.visW * 0.3, sp.h * 0.8); const nn = rg.n; const a0 = t * 0.09;
          const fade = pe * (vis > 0 ? 1 : 0);
          rg.formation((i) => { const a = (i / nn) * TAU + a0; const z = Math.sin(a) * R * 0.6 - 0.5; const depth = (z + R * 0.6 + 0.5) / (R * 1.2); return { x: Math.cos(a) * R, y: ((i % 3) - 1) * sp.h * 0.21 + Math.sin(a * 3 + t * 0.5) * 0.02, z, rx: 0, ry: 0, rz: 0, s: (0.55 + depth * 0.5) * Math.min(1.7, sp.h / 3.2 * 1.6) * fade, a: fade * (0.4 + depth * 0.6) }; });
        }
        return { x: sp.x, y: sp.y + Math.sin(t * 0.6) * 0.006 * sp.s, z: 0, rx: -e.pointer.y * 0.06 + 0.02, ry: -0.3 + e.pointer.x * 0.12 + Math.sin(t * 0.4) * 0.06, rz: -0.06, s: sp.s };
      },
      leave: () => { this.ring?.formation(() => ({ a: 0, s: 0.001 })); },
    };
  }

  /* ---------- frame ---------- */
  private vis = new Map<Scene, boolean>();
  tick(dt: number, t: number) {
    if (this.lenis) this.lenis.raf(performance.now());
    const vh = this.engine.size.y;
    let best: { s: Scene; pose: Pose; score: number } | null = null;
    for (const s of this.scenes) {
      const rect = s.el.getBoundingClientRect() as Rect;
      const vis = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / vh;
      const wasVis = this.vis.get(s) ?? false; const isVis = rect.bottom > -vh * 0.2 && rect.top < vh * 1.2;
      if (isVis && !wasVis) s.enter?.(); if (!isVis && wasVis) s.leave?.();
      this.vis.set(s, isVis);
      if (!isVis) continue;
      const p = s.pin ? clamp01(-rect.top / Math.max(1, rect.height - vh)) : clamp01((vh - rect.top) / (vh + rect.height));
      const pose = s.update({ p, vis, rect, dt, t, own: s === this.owner || !this.owner });
      if (pose && s.slot) { const score = vis + (s === this.owner ? 0.15 : 0); if (!best || score > best.score) best = { s, pose, score }; }
    }
    const e = this.engine; const ph = this.phone;
    if (best) {
      const tp = best.pose;
      if (best.s !== this.owner) {
        const offscreen = Math.abs(this.pose.y) > e.visH * 0.62 || Math.abs(this.pose.x) > e.visW * 0.62;
        this.owner = best.s;
        if (offscreen) { Object.assign(this.pose, tp); this.off.x = this.off.y = this.off.z = this.off.s = 0; }
        else { this.off.x = this.pose.x - tp.x; this.off.y = this.pose.y - tp.y; this.off.z = this.pose.z - tp.z; this.off.s = this.pose.s - tp.s; }
        this.pose.ry = nearest(tp.ry, this.pose.ry);
      }
      // position/scale lock to the slot (so the phone scrolls exactly with the page); only the hand-off offset is damped
      const lo = 5;
      this.off.x = damp(this.off.x, 0, lo, dt); this.off.y = damp(this.off.y, 0, lo, dt); this.off.z = damp(this.off.z, 0, lo, dt); this.off.s = damp(this.off.s, 0, lo, dt);
      const ty = Math.max(-e.visH * 0.9, Math.min(e.visH * 0.9, tp.y));
      this.pose.x = tp.x + this.off.x; this.pose.y = ty + this.off.y; this.pose.z = tp.z + this.off.z; this.pose.s = tp.s + this.off.s;
      // rotation follows quickly (it changes smoothly with progress anyway)
      const lr = 12;
      this.pose.rx = damp(this.pose.rx, tp.rx, lr, dt); this.pose.ry = damp(this.pose.ry, tp.ry, lr, dt); this.pose.rz = damp(this.pose.rz, tp.rz, lr, dt);
    }
    ph.group.position.set(this.pose.x, this.pose.y, this.pose.z); ph.group.scale.setScalar(this.pose.s);
    ph.inner.rotation.set(this.pose.rx, this.pose.ry, this.pose.rz);
    ph.update(dt);
    const sc = e.shadowCatcher; const ps = this.pose.s;
    sc.position.set(this.pose.x - 0.1 * ps, this.pose.y - 0.16 * ps, this.pose.z - 0.55 * ps);
    sc.scale.set(0.95 * ps, 1.5 * ps, 1); sc.rotation.z = this.pose.rz * 0.6;
    (sc.material as any).opacity = 0.55 * (this.ready ? 1 : 0);
    e.sun.target.position.set(this.pose.x, this.pose.y, 0); e.sun.position.set(this.pose.x + 3.5, this.pose.y + 6, 7);
    this.ring?.update(dt, 5); this.launchTiles?.update(dt, 7);
  }
}
