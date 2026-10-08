/**
 * Engine — one WebGL renderer for the whole page. Transparent canvas, fixed behind the nav, above the content.
 * Camera is static; the director maps DOM slots to world positions at z = 0.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, AmbientLight, PMREMGenerator, ACESFilmicToneMapping,
  Vector2, Mesh, PlaneGeometry, MeshBasicMaterial, CanvasTexture, Group,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const isMobile = () => matchMedia('(max-width: 63.99em)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export class Engine {
  renderer: WebGLRenderer;
  scene = new Scene();
  camera: PerspectiveCamera;
  canvas: HTMLCanvasElement;
  mobile = isMobile();
  size = new Vector2(1, 1);
  pointer = new Vector2(0, 0); // -1..1, smoothed
  private pointerRaw = new Vector2(0, 0);
  clock0 = performance.now();
  time = 0;
  dt = 0;
  private last = performance.now();
  private tickers: ((dt: number, t: number) => void)[] = [];
  private running = false;
  visH = 1; // visible world height at z=0
  visW = 1;
  /** soft drop shadow for the hero/light sections — follows whatever the director points it at */
  shadowCatcher: Mesh;
  sun: DirectionalLight;
  root = new Group();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const r = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false });
    r.setClearColor(0x000000, 0);
    r.toneMapping = ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    this.renderer = r;

    this.camera = new PerspectiveCamera(26, 1, 0.1, 60);
    this.camera.position.set(0, 0, 11);
    this.camera.lookAt(0, 0, 0);

    const pmrem = new PMREMGenerator(r);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const sun = new DirectionalLight(0xffffff, 2.2);
    sun.position.set(3.5, 6, 7);
    this.scene.add(sun); this.scene.add(sun.target);
    this.sun = sun;
    this.scene.add(new AmbientLight(0xffffff, 0.25));

    // soft contact shadow: a radial-gradient sprite that the director keeps behind the phone
    const sc = document.createElement('canvas'); sc.width = sc.height = 256; const sctx = sc.getContext('2d')!;
    const g = sctx.createRadialGradient(128, 128, 10, 128, 128, 128); g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(0.45, 'rgba(0,0,0,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = g; sctx.fillRect(0, 0, 256, 256);
    const catcher = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: new CanvasTexture(sc), transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false, color: 0x000000 }));
    catcher.renderOrder = -1;
    this.scene.add(catcher);
    this.shadowCatcher = catcher;
    this.scene.add(this.root);

    this.resize();
    addEventListener('resize', () => this.resize(), { passive: true });
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      this.pointerRaw.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.stop(); else this.start(); });
  }

  resize() {
    const w = innerWidth, h = innerHeight;
    this.size.set(w, h);
    // cap the pixel ratio on very large viewports: the transparent full-screen canvas is fill-rate bound
    const cap = w * h > 2.4e6 ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, cap));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.visH = 2 * this.camera.position.z * Math.tan((this.camera.fov * Math.PI) / 360);
    this.visW = this.visH * this.camera.aspect;
  }

  /** DOM rect (px) → world x,y at z=0 and world height */
  rectToWorld(r: { left: number; top: number; width: number; height: number }) {
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const x = ((cx / this.size.x) * 2 - 1) * (this.visW / 2);
    const y = (1 - (cy / this.size.y) * 2) * (this.visH / 2);
    return { x, y, w: (r.width / this.size.x) * this.visW, h: (r.height / this.size.y) * this.visH };
  }
  pxToWorld(px: number) { return (px / this.size.y) * this.visH; }

  onTick(fn: (dt: number, t: number) => void) { this.tickers.push(fn); }

  start() {
    if (this.running) return; this.running = true; this.last = performance.now();
    const loop = () => {
      if (!this.running) return;
      const now = performance.now();
      this.dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      this.time = (now - this.clock0) / 1000;
      this.pointer.lerp(this.pointerRaw, 1 - Math.pow(0.001, this.dt));
      for (const t of this.tickers) t(this.dt, this.time);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  stop() { this.running = false; }
}

/** critically-damped-ish exponential smoothing, frame-rate independent */
export const damp = (cur: number, target: number, lambda: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
