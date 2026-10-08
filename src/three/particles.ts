/** Particles — the customer base. A grid of people on the "site" that migrates into the phone when there's an offer. */
import { Points, BufferGeometry, BufferAttribute, ShaderMaterial, Group, Color, AdditiveBlending, NormalBlending } from 'three';

const vert = /* glsl */ `
  attribute vec3 aStart; attribute vec3 aEnd; attribute float aRand; attribute float aDelay; attribute float aSize;
  uniform float uProgress; uniform float uFrac; uniform float uTime; uniform float uPx; uniform float uPulse;
  varying float vMig; varying float vLit; varying float vRand;
  void main(){
    float mig = step(aRand, uFrac);
    float t = smoothstep(aDelay, aDelay + 0.5, uProgress) * mig;
    vec3 p = mix(aStart, aEnd, t);
    float arc = sin(t * 3.14159);
    p.y += arc * (0.35 + aRand * 0.5) * sign(aRand - 0.5);
    p.z += arc * (0.6 + aRand * 0.8);
    p += 0.014 * vec3(sin(uTime * 1.3 + aRand * 60.0), cos(uTime * 1.1 + aRand * 37.0), 0.0) * (1.0 - t * 0.6);
    // when a push lands, the migrated base lights up in a wave from the top of the screen
    float wave = clamp(1.0 - abs((aEnd.y + 0.5) - uPulse * 1.4) * 6.0, 0.0, 1.0) * step(0.99, t) * step(0.001, uPulse);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / -mv.z * (1.0 + wave * 1.4);
    gl_Position = projectionMatrix * mv;
    vMig = mig; vLit = t + wave; vRand = aRand;
  }`;
const frag = /* glsl */ `
  uniform vec3 uGray; uniform vec3 uBlue; uniform float uAlpha;
  varying float vMig; varying float vLit; varying float vRand;
  void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.3, d);
    vec3 col = mix(uGray, uBlue, clamp(vLit, 0.0, 1.0));
    gl_FragColor = vec4(col, a * uAlpha * (0.6 + 0.4 * vMig));
    #include <colorspace_fragment> }`;

export class Particles {
  group = new Group(); points: Points; mat: ShaderMaterial; n: number;
  private geo = new BufferGeometry();
  constructor(n: number) {
    this.n = n;
    const g = this.geo;
    g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('aStart', new BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('aEnd', new BufferAttribute(new Float32Array(n * 3), 3));
    const rand = new Float32Array(n), delay = new Float32Array(n), size = new Float32Array(n);
    for (let i = 0; i < n; i++) { rand[i] = Math.random(); delay[i] = Math.random() * 0.5; size[i] = 0.018 + Math.random() * 0.014; }
    g.setAttribute('aRand', new BufferAttribute(rand, 1)); g.setAttribute('aDelay', new BufferAttribute(delay, 1)); g.setAttribute('aSize', new BufferAttribute(size, 1));
    this.mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, depthTest: false, blending: NormalBlending,
      uniforms: { uProgress: { value: 0 }, uFrac: { value: 0.04 }, uTime: { value: 0 }, uPx: { value: 1000 }, uPulse: { value: 0 }, uGray: { value: new Color('#9aa0ad') }, uBlue: { value: new Color('#155dfc') }, uAlpha: { value: 0 } } });
    this.points = new Points(g, this.mat); this.points.frustumCulled = false; this.points.renderOrder = 0;
    this.group.add(this.points); this.group.visible = false;
    void AdditiveBlending;
  }
  /** site: a rectangle (local coords) where the base lives · screen: rectangle inside the phone where migrated people land */
  layout(site: { x: number; y: number; w: number; h: number }, screen: { x: number; y: number; w: number; h: number }) {
    const s = this.geo.getAttribute('aStart') as BufferAttribute, e = this.geo.getAttribute('aEnd') as BufferAttribute;
    const cols = Math.ceil(Math.sqrt(this.n * (site.w / site.h))), rows = Math.ceil(this.n / cols);
    for (let i = 0; i < this.n; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      s.setXYZ(i, site.x - site.w / 2 + ((c + 0.5) / cols) * site.w + (Math.random() - 0.5) * 0.02, site.y + site.h / 2 - ((r + 0.5) / rows) * site.h + (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.1);
      e.setXYZ(i, screen.x + (Math.random() - 0.5) * screen.w, screen.y + (Math.random() - 0.5) * screen.h, 0.04 + Math.random() * 0.02);
    }
    s.needsUpdate = true; e.needsUpdate = true;
  }
  set(progress: number, frac: number, alpha: number, pulse: number, time: number, px: number) {
    const u = this.mat.uniforms; u.uProgress.value = progress; u.uFrac.value = frac; u.uAlpha.value = alpha; u.uPulse.value = pulse; u.uTime.value = time; u.uPx.value = px;
    this.group.visible = alpha > 0.005;
  }
}
