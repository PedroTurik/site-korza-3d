/** Entry — tiny. Feature-detects WebGL and only then downloads the 3D bundle (three + director). Otherwise the CSS phones stay. */
const supportsGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } };

const boot = async () => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !supportsGL()) { html.classList.add('no-gl'); return; }
  const canvas = document.createElement('canvas'); canvas.className = 'gl'; canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  html.classList.add('has-gl');
  try {
    const [{ Engine }, { Director }, { initScroll }] = await Promise.all([import('./engine'), import('./director'), import('./scroll')]);
    const engine = new Engine(canvas);
    const lenis = matchMedia('(pointer: fine)').matches ? initScroll() : null;
    const director = new Director(engine, lenis);
    engine.start();
    await director.load();
    (window as any).__korza3d = { engine, director, lenis };
  } catch (err) {
    console.error('[korza3d]', err);
    html.classList.remove('has-gl'); html.classList.add('no-gl'); canvas.remove();
  }
};
boot();
