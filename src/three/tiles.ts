/** Tiles — instanced app-icon tiles sampled from an atlas. Used for the brand ring (hero exit / CTA) and the integration logos (launch). */
import { InstancedMesh, InstancedBufferAttribute, PlaneGeometry, ShaderMaterial, Object3D, Group, Matrix4, Quaternion, Vector3, Euler, DoubleSide } from 'three';
import type { Atlas } from './screens';
import { damp } from './engine';

const vert = /* glsl */ `
  attribute float aIdx; attribute float aAlpha; uniform float uCols;
  varying vec2 vUv; varying float vAlpha; varying vec2 vTile;
  void main(){ vUv = uv; vAlpha = aAlpha; vTile = vec2(mod(aIdx, uCols), floor(aIdx / uCols));
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const frag = /* glsl */ `
  uniform sampler2D tAtlas; uniform float uCols; uniform float uRadius;
  varying vec2 vUv; varying float vAlpha; varying vec2 vTile;
  float rrect(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main(){
    vec2 uv = vec2((vTile.x + vUv.x) / uCols, (uCols - vTile.y - 1.0 + vUv.y) / uCols);
    vec4 c = texture2D(tAtlas, uv);
    float d = rrect(vUv - 0.5, vec2(0.5), uRadius); float aa = fwidth(d) * 1.5;
    float a = (1.0 - smoothstep(-aa, aa, d)) * vAlpha;
    // hairline edge so white tiles read on white paper
    float edge = 1.0 - smoothstep(-aa * 3.0, 0.0, d);
    c.rgb = mix(c.rgb, vec3(0.86, 0.87, 0.9), (1.0 - edge) * 0.9);
    gl_FragColor = vec4(c.rgb, a);
    #include <colorspace_fragment>
  }`;

export interface TileState { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; a: number }
export class Tiles {
  group = new Group(); mesh: InstancedMesh; n: number;
  cur: TileState[] = []; tgt: TileState[] = []; alphaAttr: InstancedBufferAttribute;
  private dummy = new Object3D();
  constructor(atlas: Atlas, n: number, size = 0.3, radius = 0.22) {
    this.n = n;
    const geo = new PlaneGeometry(size, size);
    const idx = new Float32Array(n), al = new Float32Array(n);
    for (let i = 0; i < n; i++) { idx[i] = i % atlas.count; al[i] = 0; }
    geo.setAttribute('aIdx', new InstancedBufferAttribute(idx, 1));
    this.alphaAttr = new InstancedBufferAttribute(al, 1); this.alphaAttr.setUsage(35048 /* DynamicDraw */);
    geo.setAttribute('aAlpha', this.alphaAttr);
    const mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, side: DoubleSide, uniforms: { tAtlas: { value: atlas.tex }, uCols: { value: atlas.cols }, uRadius: { value: radius } } });
    this.mesh = new InstancedMesh(geo, mat, n); this.mesh.frustumCulled = false; this.mesh.renderOrder = 1;
    for (let i = 0; i < n; i++) { this.cur.push({ x: 0, y: 0, z: -2, rx: 0, ry: 0, rz: 0, s: 0.001, a: 0 }); this.tgt.push({ x: 0, y: 0, z: -2, rx: 0, ry: 0, rz: 0, s: 0.001, a: 0 }); }
    this.group.add(this.mesh); this.group.visible = false;
  }
  setIndex(i: number, atlasIdx: number) { (this.mesh.geometry.getAttribute('aIdx') as InstancedBufferAttribute).setX(i, atlasIdx); (this.mesh.geometry.getAttribute('aIdx') as InstancedBufferAttribute).needsUpdate = true; }
  /** write targets with a formation function */
  formation(fn: (i: number, n: number) => Partial<TileState>) { for (let i = 0; i < this.n; i++) Object.assign(this.tgt[i], fn(i, this.n)); }
  snap() { for (let i = 0; i < this.n; i++) Object.assign(this.cur[i], this.tgt[i]); }
  update(dt: number, lambda = 6) {
    let any = false;
    for (let i = 0; i < this.n; i++) {
      const c = this.cur[i], t = this.tgt[i];
      c.x = damp(c.x, t.x, lambda, dt); c.y = damp(c.y, t.y, lambda, dt); c.z = damp(c.z, t.z, lambda, dt);
      c.rx = damp(c.rx, t.rx, lambda, dt); c.ry = damp(c.ry, t.ry, lambda, dt); c.rz = damp(c.rz, t.rz, lambda, dt);
      c.s = damp(c.s, t.s, lambda, dt); c.a = damp(c.a, t.a, lambda * 1.5, dt);
      this.dummy.position.set(c.x, c.y, c.z); this.dummy.rotation.set(c.rx, c.ry, c.rz); this.dummy.scale.setScalar(Math.max(0.0001, c.s)); this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix); this.alphaAttr.setX(i, c.a); if (c.a > 0.005) any = true;
    }
    this.mesh.instanceMatrix.needsUpdate = true; this.alphaAttr.needsUpdate = true;
    this.group.visible = any;
  }
}
export const _m = new Matrix4(); export const _q = new Quaternion(); export const _v = new Vector3(); export const _e = new Euler();
