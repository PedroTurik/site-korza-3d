/** Smooth scroll (Lenis) + anchor handling. The engine drives lenis.raf each frame. */
import Lenis from 'lenis';

export const initScroll = () => {
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
  document.documentElement.classList.add('lenis');
  const navH = () => (document.querySelector<HTMLElement>('[data-nav]')?.offsetHeight ?? 72);
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.hash.length < 2) return;
    const el = document.querySelector<HTMLElement>(a.hash); if (!el) return;
    e.preventDefault();
    history.replaceState(null, '', a.hash);
    lenis.scrollTo(el, { offset: -navH() + 1, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });
  return lenis;
};
export type { Lenis };
