/**
 * Phone — a procedural iPhone (height = 1 unit). Titanium body, black glass, a screen that crossfades between
 * textures (real screenshots or procedural canvases) and up to 3 push cards that slide over the screen.
 */
import {
  Group, Mesh, Shape, ExtrudeGeometry, ShapeGeometry, PlaneGeometry, MeshPhysicalMaterial, MeshBasicMaterial, ShaderMaterial,
  Vector2, Texture, DoubleSide, SRGBColorSpace, TextureLoader, Color, CylinderGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { canvasTex, drawPushCard, PUSH_W, PUSH_H, type PushOpts, type ScreenTex } from './screens';
import { damp } from './engine';

export const PH = { W: 0.482, H: 1, D: 0.04, R: 0.088, BEZEL: 0.013 };
const SW = PH.W - PH.BEZEL * 2, SH = PH.H - PH.BEZEL * 2;
export const SCREEN = { W: SW, H: SH };

const roundedRect = (w: number, h: number, r: number) => {
  const s = new Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const screenVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const screenFrag = /* glsl */ `
  uniform sampler2D tA; uniform sampler2D tB; uniform float uMix; uniform vec2 uFitA; uniform vec2 uFitB;
  uniform vec2 uSize; uniform float uRadius; uniform float uBright; uniform float uDim;
  varying vec2 vUv;
  vec2 fit(vec2 uv, vec2 f){ return vec2(uv.x * f.x + (1.0 - f.x) * 0.5, 1.0 - (1.0 - uv.y) * f.y); }
  float rrect(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main(){
    vec3 a = texture2D(tA, fit(vUv, uFitA)).rgb;
    vec3 b = texture2D(tB, fit(vUv, uFitB)).rgb;
    vec3 c = mix(a, b, uMix) * uBright;
    c = mix(c, vec3(0.0), uDim);
    vec2 p = (vUv - 0.5) * uSize; float d = rrect(p, uSize * 0.5, uRadius);
    float aa = fwidth(d) * 1.2; float alpha = 1.0 - smoothstep(-aa, aa, d);
    gl_FragColor = vec4(c, alpha);
    #include <colorspace_fragment>
  }`;

class PushCard {
  mesh: Mesh; tex: Texture; ctx: CanvasRenderingContext2D; mat: MeshBasicMaterial; key = '';
  y = 0; alpha = 0;
  constructor() {
    const { ctx, tex } = canvasTex(PUSH_W, PUSH_H); this.ctx = ctx; this.tex = tex;
    const w = SW * 0.96, h = (w * PUSH_H) / PUSH_W;
    this.mat = new MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, opacity: 0 });
    this.mesh = new Mesh(new PlaneGeometry(w, h), this.mat); this.mesh.visible = false; this.mesh.renderOrder = 5;
  }
  draw(o: PushOpts) { const k = o.brand + '|' + o.text + '|' + (o.icon?.src ?? ''); if (k === this.key) return; this.key = k; drawPushCard(this.ctx, o); this.tex.needsUpdate = true; }
  /** t: 0 = hidden above, 0.12..0.85 = resting, 1 = gone (faded up) */
  set(t: number, yRest: number) {
    const inT = Math.min(1, t / 0.12), outT = Math.max(0, (t - 0.85) / 0.15);
    const ease = (v: number) => 1 - Math.pow(1 - v, 3);
    const y = yRest + (1 - ease(inT)) * 0.22 + ease(outT) * 0.12;
    const a = ease(inT) * (1 - outT);
    this.mesh.position.y = y; this.mat.opacity = a * (t > 0 && t < 1 ? 1 : 0); this.mesh.visible = this.mat.opacity > 0.01;
    this.mesh.scale.setScalar(0.9 + 0.1 * ease(inT));
  }
}

export class Phone {
  group = new Group();
  inner = new Group(); // rotation applied here; group holds position/scale
  screenMat: ShaderMaterial;
  pushes: PushCard[] = [];
  private cur: ScreenTex | null = null; private next: ScreenTex | null = null; private mix = 0; private mixTarget = 0;
  bodyMat: MeshPhysicalMaterial;
  constructor() {
    const { W, H, D, R } = PH;
    // body: rounded slab with beveled edges
    const body = new Mesh(
      new ExtrudeGeometry(roundedRect(W - 0.012, H - 0.012, R - 0.006), { depth: D - 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 5, curveSegments: 18 }),
      (this.bodyMat = new MeshPhysicalMaterial({ color: 0x2b2e37, metalness: 0.9, roughness: 0.34, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 1.1 })),
    );
    body.geometry.translate(0, 0, -(D - 0.012) / 2);
    body.castShadow = true; body.receiveShadow = false;
    this.inner.add(body);

    const glassMat = new MeshPhysicalMaterial({ color: 0x05070c, metalness: 0.1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 });
    const front = new Mesh(new ShapeGeometry(roundedRect(W - 0.016, H - 0.016, R - 0.008), 18), glassMat);
    front.position.z = D / 2 + 0.0004; this.inner.add(front);
    const back = new Mesh(new ShapeGeometry(roundedRect(W - 0.016, H - 0.016, R - 0.008), 18), new MeshPhysicalMaterial({ color: 0x0f1219, metalness: 0.2, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.4 }));
    back.position.z = -D / 2 - 0.0004; back.rotation.y = Math.PI; this.inner.add(back);
    // back: Korza mark, quiet
    new TextureLoader().load('/brand/korza-mark.svg', (t) => {
      t.colorSpace = SRGBColorSpace;
      const m = new Mesh(new PlaneGeometry(0.11, 0.11 * (583 / 672)), new MeshBasicMaterial({ map: t, transparent: true, opacity: 0.22, toneMapped: false, color: new Color(0xffffff) }));
      m.position.set(0, 0.02, -D / 2 - 0.0012); m.rotation.y = Math.PI; this.inner.add(m);
      // camera plateau
      const cx = -W / 2 + 0.1, cy = H / 2 - 0.1;
      const cam = new Mesh(new RoundedBoxGeometry(0.15, 0.15, 0.012, 4, 0.045), new MeshPhysicalMaterial({ color: 0x23262f, metalness: 0.85, roughness: 0.32, clearcoat: 0.6 }));
      cam.position.set(cx, cy, -D / 2 - 0.004); this.inner.add(cam);
      const lensMat = new MeshPhysicalMaterial({ color: 0x05070c, metalness: 0.5, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.8 });
      const ringMat = new MeshPhysicalMaterial({ color: 0x3a3e49, metalness: 0.9, roughness: 0.25 });
      [[-0.033, 0.033], [-0.033, -0.033]].forEach(([ox, oy]) => {
        const ring = new Mesh(new CylinderGeometry(0.03, 0.03, 0.008, 32), ringMat); ring.rotation.x = Math.PI / 2; ring.position.set(cx + ox, cy + oy, -D / 2 - 0.013); this.inner.add(ring);
        const lens = new Mesh(new CylinderGeometry(0.021, 0.021, 0.006, 32), lensMat); lens.rotation.x = Math.PI / 2; lens.position.set(cx + ox, cy + oy, -D / 2 - 0.018); this.inner.add(lens);
      });
      const flash = new Mesh(new CylinderGeometry(0.012, 0.012, 0.004, 24), new MeshPhysicalMaterial({ color: 0xf2e8c8, roughness: 0.4, metalness: 0.1 })); flash.rotation.x = Math.PI / 2; flash.position.set(cx + 0.038, cy + 0.033, -D / 2 - 0.011); this.inner.add(flash);
    });

    // screen
    this.screenMat = new ShaderMaterial({
      vertexShader: screenVert, fragmentShader: screenFrag, transparent: true, depthWrite: false,
      uniforms: { tA: { value: null }, tB: { value: null }, uMix: { value: 0 }, uFitA: { value: new Vector2(1, 1) }, uFitB: { value: new Vector2(1, 1) }, uSize: { value: new Vector2(SW, SH) }, uRadius: { value: R - PH.BEZEL }, uBright: { value: 1 }, uDim: { value: 0 } },
    });
    const screen = new Mesh(new PlaneGeometry(SW, SH), this.screenMat); screen.position.z = D / 2 + 0.0016; screen.renderOrder = 2; this.inner.add(screen);
    // glossy overlay catches the environment on top of the screen
    const glare = new Mesh(new ShapeGeometry(roundedRect(SW, SH, R - PH.BEZEL), 18), new MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.09, metalness: 0, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.2, depthWrite: false, side: DoubleSide }));
    glare.position.z = D / 2 + 0.0028; glare.renderOrder = 3; this.inner.add(glare);
    // dynamic island
    const island = new Mesh(new RoundedBoxGeometry(0.125, 0.036, 0.004, 3, 0.017), new MeshBasicMaterial({ color: 0x000000 }));
    island.position.set(0, SH / 2 - 0.045, D / 2 + 0.0034); island.renderOrder = 4; this.inner.add(island);
    // side buttons
    const btnMat = new MeshPhysicalMaterial({ color: 0x2b2e37, metalness: 0.9, roughness: 0.35 });
    [[0.12, 0.05], [0.26, 0.07], [0.35, 0.07]].forEach(([y, l]) => { const b = new Mesh(new RoundedBoxGeometry(0.008, l, 0.02, 2, 0.003), btnMat); b.position.set(-W / 2 - 0.002, y, 0); this.inner.add(b); });
    const pw = new Mesh(new RoundedBoxGeometry(0.008, 0.11, 0.02, 2, 0.003), btnMat); pw.position.set(W / 2 + 0.002, 0.2, 0); this.inner.add(pw);

    for (let i = 0; i < 3; i++) { const p = new PushCard(); p.mesh.position.z = D / 2 + 0.006 + i * 0.001; this.inner.add(p.mesh); this.pushes.push(p); }

    this.group.add(this.inner);
    this.group.visible = false;
  }

  setScreen(st: ScreenTex | null, instant = false) {
    if (!st) return;
    if (this.cur === st && !this.next) return;
    if (this.next === st) return;
    const u = this.screenMat.uniforms;
    if (!this.cur || instant) { this.cur = st; this.next = null; u.tA.value = st.tex; u.uFitA.value.copy(this.fit(st)); u.uMix.value = 0; this.mix = 0; this.mixTarget = 0; return; }
    if (this.next && this.mix > 0.02) { // mid-crossfade: commit the current B as A
      this.cur = this.next; u.tA.value = this.cur.tex; u.uFitA.value.copy(this.fit(this.cur)); this.mix = 0; u.uMix.value = 0;
    }
    this.next = st; u.tB.value = st.tex; u.uFitB.value.copy(this.fit(st)); this.mix = 0; this.mixTarget = 1;
  }
  private fit(st: ScreenTex) { const sa = SW / SH; return st.aspect > sa ? new Vector2(sa / st.aspect, 1) : new Vector2(1, st.aspect / sa); }
  get screenKey() { return this.next ?? this.cur; }

  update(dt: number) {
    if (this.next) {
      this.mix = damp(this.mix, this.mixTarget, 7, dt);
      this.screenMat.uniforms.uMix.value = this.mix;
      if (this.mix > 0.995) { const u = this.screenMat.uniforms; this.cur = this.next; this.next = null; u.tA.value = this.cur.tex; u.uFitA.value.copy(this.fit(this.cur)); u.uMix.value = 0; this.mix = 0; this.mixTarget = 0; }
    }
  }
  /** push slot i: t in [0,1] (see PushCard.set), rest y near the top of the screen; stacked slots sit lower */
  push(i: number, o: PushOpts | null, t: number, stack = 0) {
    const p = this.pushes[i]; if (!p) return;
    if (o) p.draw(o);
    p.set(o ? t : 0, SH / 2 - 0.145 - stack * 0.105);
  }
  hidePushes() { this.pushes.forEach((p) => p.set(0, 0)); }
}
