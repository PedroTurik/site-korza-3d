# Korza — site 3D (Astro + Three.js)

Rebuild do site institucional com um iPhone 3D contínuo que atravessa a página, dirigido pelo scroll.
Mesma tipografia (Plus Jakarta Sans), mesmos tokens (`#155DFC`, `#0B0F19`, `#10296E`), mesma copy de `src/data/content.ts`.

## Rodar
```
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ (estático, deploy na Vercel como o site atual)
node scripts/shot3d.mjs dist <pasta-de-saida> [desktop|mobile|all|nogl]   # screenshots por cena (WebGL por software)
```

## Como o 3D funciona (`src/three/`)
| arquivo | papel |
|---|---|
| `main.ts` | entrada mínima: detecta WebGL / `prefers-reduced-motion` e só então baixa o bundle 3D (`import()`); sem WebGL fica o fallback CSS (`html.no-gl`) |
| `engine.ts` | um único `WebGLRenderer` transparente, fixo atrás da nav e acima do conteúdo (`.gl`, z-index 10, `pointer-events: none`). Câmera parada; `rectToWorld()` mapeia qualquer retângulo DOM para coordenadas de mundo em z = 0 |
| `phone.ts` | iPhone procedural (altura 1 unidade): corpo extrudado com chanfro, vidro frontal/traseiro com clearcoat, tela com shader (crossfade entre duas texturas + máscara de cantos), ilha dinâmica, câmeras, até 3 cards de push |
| `screens.ts` | texturas: screenshots reais (`public/screens`), telas procedurais desenhadas em canvas (app da "Sua loja" com cor de marca, página da App Store, tela de bloqueio), cards de push e atlas de ícones |
| `tiles.ts` | tiles instanciados (ícones de clientes / integrações) com formações alvo + damping |
| `particles.ts` | a base de clientes: pontos que migram do "site" para dentro do telefone (4% → 23%) |
| `bars.ts` | monólitos 3D do comparativo App · WhatsApp · E-mail |
| `scroll.ts` | Lenis (só em `pointer: fine`) + âncoras |
| `director.ts` | lê `[data-s3]` no DOM, calcula o progresso de cada cena (pinada: `-top / (altura - vh)`), pede a pose do telefone à cena dona do slot `[data-slot]` e faz damping. Cada cena só escreve na tela do telefone quando é a dona (`own`) |

### Contrato DOM
- Seção com cena: `<section data-s3="hero|brands|launch|recompra|aop|dash|cases|cta">`.
- Pinada: classe `pin` + `--len` (quantas alturas de viewport) + um filho `.pin__stage` (sticky, 100svh). `pin--desk` pina só no desktop.
- Slot do telefone: `[data-slot="phone"]` (o telefone ocupa ~90% da altura do slot). AOP usa `[data-slot="aop"]`; Recompra, `[data-slot="bars"]`.
- Fallback sem WebGL: `.slot__fb` com `Phone.astro` dentro do slot; oculto em `html.has-gl`.
- Interações lidas pelo diretor: `[data-swatch]` (cor do app no Lançamento), `[data-offer]` (com/sem oferta no AOP), `[data-prev]/[data-next]` (Cases).
- O diretor escreve `data-active` (passo/card/case atual), `--p` (progresso) e `.is-on` (dispara count-ups e animações CSS existentes).

## Cenas
1. **Hero** (pin 2.1): pushes da Hiven, Sunkids e D1 chegam no telefone conforme o scroll; arrastar o telefone gira ele.
2. **Marcas** (pin 2.2): o telefone dá uma volta completa enquanto 24 ícones de clientes orbitam; a tela troca de marca.
3. **Lançamento** (pin 3.4, escuro): integrações convergem para o telefone → escolha de cor (clicável) repinta o app → página da App Store com os selos Apple/Play.
4. **Recompra** (escuro): barras monolíticas crescem ao entrar.
5. **AOP** (pin 3): partículas da base migram para o app; toggle 4% / 23%; push final acende a base migrada.
6. **Funcionalidades**: HTML (bento) do site atual.
7. **Dashboard** (pin desktop): telefone com tela de bloqueio recebe o push e a venda aparece no mock.
8. **Cases** (pin 4): o telefone gira 360° a cada case e troca de app; métricas contam.
9. **Depoimentos / Planos / FAQ**: HTML do site atual.
10. **CTA**: push "Seu app chegou" + órbita de clientes.

Números ilustrativos continuam listados em `docs/numeros-ilustrativos.md`.
