# Korza — direção de arte v2 ("Editorial claro, monolitos azuis")

Referências: deck institucional (slides 2, 3, 5-7, 9) e site atual (tipografia leve, botões retos, painel azul do dashboard, footer navy).

## Princípios
1. **Poucas palavras, muita evidência.** Cada seção tem um título (≤ 7 palavras), no máximo uma linha de apoio e um objeto visual dominante (iPhone, UI do admin, número gigante). Texto corrido só no FAQ.
2. **Geometria reta.** Painéis e cards com `border-radius: 0` (ou `--radius-xs` 2px). Botões 4px. Só UI mock interna (cards de dashboard, notificações) e os iPhones têm cantos arredondados.
3. **Monolitos.** Blocos sólidos azul `#155DFC`, preto `#0B0F19` e navy `#10296E` ocupando a largura do container (ou full-bleed), com iPhones sangrando para fora do bloco (cortados pela borda do painel, como nos slides de cases).
4. **Tipografia leve e enorme.** Plus Jakarta Sans. Display/H1/H2 em **500**, tracking **-0.04em**, line-height 1.0–1.05. Números gigantes em 500. Corpo 400 em `--ink-600`. Nunca 700 em texto; 600 só em labels pequenos/uppercase.
5. **Azul inline.** Palavras-chave do título em `color: var(--blue)` (`<span class="accent">`), nunca marca-texto.
6. **Respiro.** `--section-y` grande (6–9rem). Hairlines `1px var(--line)` em vez de bordas de card. Sem sombras em cards; sombra só em iPhones e UI flutuante.
7. **Movimento sutil.** Reveal em 700ms, parallax zero, nada pulsando. `prefers-reduced-motion` respeitado.

## Tokens (src/styles/global.css)
`--blue #155DFC · --blue-700 #0B41BB · --navy #10296E · --ink #0B0F19 · --ink-600 #3A4150 · --ink-500 #5F6673 · --paper #FFF · --paper-2 #F5F5F7 · --line #E6E8EE`
Classes: `.display` (clamp 3–6rem, 500), `.h1`, `.h2`, `.h3`, `.lead`, `.eyebrow` (12px, 600, uppercase, azul, sem traço), `.num` (número gigante 500), `.accent`, `.btn .btn--primary|--ink|--ghost|--white|--outline-white`, `.panel .panel--blue|--ink|--navy|--soft`, `.hairline`.

## Componentes (src/components)
Nav · Hero · LogoWall · Recompra · Launch (novo, substitui HowItWorks) · Aop · Features (bento visual) · Dashboard · Cases (carrossel de painéis) · Testimonials (novo) · Pricing · Faq · CtaBand · Footer

## Mock de UI (padrão compartilhado)
Classe `.ui` = janela branca, radius 10px, `box-shadow: var(--shadow-lg)`, fonte 0.72rem, hairlines internas, sidebar "KORZA" com itens Painel/Analytics/Campanhas/Públicos/Vendas/Personalizar app, botão primário azul 4px. iPhone = componente `Phone.astro` (slot com `<img>`).

## Movimento v3 ("dados que acontecem")
Intensidade aprovada: **Mix** — entrada animada uma vez em tudo; scroll-driven só em Dashboard, Lançamento e AOP. Zero vídeo, zero biblioteca. Referência a superar: kobe.io (Framer + 6 vídeos).

Primitivos em `src/styles/global.css` + runtime em `src/layouts/Base.astro` (~1.5KB):
- `[data-scene]` → o observer adiciona `.is-on` uma vez (≥35% visível). Sem estilo próprio; filhos usam `.is-on .x`.
- `[data-count="355"]` (+ `data-dec`, `data-delay`, `data-dur`) → conta de 0 ao valor SSR em pt-BR, tabular-nums, largura reservada (sem CLS). Dispara sozinho ao entrar ou junto com a cena que o contém.
- `.clip > span` → reveal de linha por máscara (H1, títulos). `--d` para cadência.
- `.draw` (path com `pathLength="1"`) → o traço se desenha. `.grow` → barra sobe. `.pop` → chip/ponto aparece. `.slide-in` → push desce.
- Regras: duração 0.9–1.4s, `--ease` (expo-out), cadência 60–120ms entre irmãos, nada em loop infinito (exceções: hero loop 8–9s, marquee, fluxo lento do tile sync). `prefers-reduced-motion` mostra o estado final. `.no-js` idem.
- Números ilustrativos ficam marcados `ILUSTRATIVO` no frontmatter/`content.ts` para correção posterior.

## Movimento v4 ("o app como objeto contínuo") — site-tree-js
Decisões aprovadas (out/2026): um iPhone 3D real (Three.js) persiste ao longo da página e se transforma com o scroll; base clara com cenas escuras/azuis full-bleed; scroll cinematográfico com seções pinadas (Lenis no desktop); Astro + Three.js vanilla. Texto sempre em HTML, nunca dentro do canvas. Sem WebGL ou com `prefers-reduced-motion`, a página vira fluxo normal com os telefones em CSS (`Phone.astro`). Ver README.
