/** Bars — three monoliths (app · WhatsApp · e-mail) for the "canal de recompra" comparison. */
import { Group, Mesh, BoxGeometry, MeshPhysicalMaterial } from 'three';
import { damp } from './engine';

export class Bars {
  group = new Group(); meshes: Mesh[] = []; private h = [0, 0, 0]; private target = [0, 0, 0];
  values: number[];
  constructor(values: number[], colors = [0x155dfc, 0x3a4150, 0x232834]) {
    this.values = values;
    const geo = new BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
    values.forEach((_, i) => {
      const m = new Mesh(geo, new MeshPhysicalMaterial({ color: colors[i], metalness: 0.15, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.9 }));
      m.castShadow = true; m.receiveShadow = true; this.meshes.push(m); this.group.add(m);
    });
    this.group.visible = false;
  }
  /** cols: world x centers and width; baseY: floor; maxH: height of the tallest bar; progress 0..1 staggered */
  set(cols: { x: number; w: number }[], baseY: number, maxH: number, progress: number, dt: number, depth = 0.7) {
    const max = Math.max(...this.values); let any = false;
    this.meshes.forEach((m, i) => {
      const p = Math.max(0, Math.min(1, (progress - i * 0.12) / 0.6)); const e = 1 - Math.pow(1 - p, 3);
      this.target[i] = (this.values[i] / max) * maxH * e;
      this.h[i] = damp(this.h[i], this.target[i], 8, dt);
      m.position.set(cols[i].x, baseY, -0.2); m.scale.set(cols[i].w, Math.max(0.0001, this.h[i]), depth);
      if (this.h[i] > 0.002) any = true;
    });
    this.group.visible = any;
  }
}
