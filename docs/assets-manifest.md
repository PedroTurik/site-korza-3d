# Korza site — assets manifest

Generated 2026-10-08. 66 files, 1097 KB total in `public/`.

## Testimonial ↔ headshot mapping (from Framer HTML order)
- person-1 → Aníbal Ribeiros (spelled "Riveros" in one Framer slide), Sunkids — Founder
- person-2 → João Soriani, Consolatio
- person-3 → Mateus Tondo, Pé de Algodão

## Brand
- Blue: `#155DFC` (favicon/Framer) — PDF uses `#0060FD`. Dark text: `#121212`/`#131720`. Light bg: `#F7F7F7`.
- Fonts: Plus Jakarta Sans (headings) + Inter (body); both shipped as latin woff2 in `fonts/`. Load with `font-display: swap`, `unicode-range` optional.
- Logo geometry: mark height ≈ 0.91× wordmark cap height; gap mark→K ≈ 0.35× mark height (baked into korza-logo.svg).

## Caveats
- Loum/Belletonn/Pé de Algodão screens are cut at the slide bottom (aspect ~1.53). Put them in a phone frame with `object-fit: cover; object-position: top` or use hiven/d1-fitness/sunkids for full-height mockups.
- Client tiles with no background (alurra, gum, modernlar, sunkids, betterlife, dona-rica, gabriela-guth, client-01) are on white; add a subtle border or `bg-white` when shown on grey.
- 9 client icons could not be named (client-01…08, see notes) — the PDF has no captions. Row 5 of the grid (faded/cut) was skipped.
- Nuvemshop/Shopify/WooCommerce/VTEX SVGs are monochrome and inherit `currentColor`; Tray and Yampi keep brand colors (apply `filter: grayscale(1)` if you want a uniform mono strip).

## Files

| file | dims | bytes | description / provenance |
|---|---|---:|---|
| `apple-touch-icon.png` | 180x180 | 3,444 | 180x180, mark on white. |
| `favicon-32.png` | 32x32 | 810 | 32x32 favicon. |
| `favicon.svg` | vb 0 0 64 64 | 1,377 | Mark centered in 64x64 viewBox. |
| `icon-192.png` | 192x192 | 4,619 | PWA/manifest icon 192 (mark on transparent). |
| `icon-512.png` | 512x512 | 13,596 | PWA/manifest icon 512. |
| `og-image.png` | 1200x630 | 28,868 | 1200x630 Open Graph: logo + tagline "Seu e-commerce, no bolso do cliente." + blue bar. |
| `fonts/inter-latin.woff2` |  | 48,256 | Inter variable 400–700, latin subset (Google Fonts v20). Body. |
| `fonts/plus-jakarta-sans-latin.woff2` |  | 27,348 | Plus Jakarta Sans variable 400–800, latin subset (Google Fonts v12). Headings. |
| `clients/a22-sneakers.webp` | 256x256 | 4,158 | A22 Sneakers app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/alurra.webp` | 256x256 | 1,748 | Alurra app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/armazem-dos-chinelos.webp` | 256x256 | 5,452 | Armazem Dos Chinelos app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/belletonn.webp` | 256x256 | 3,896 | Belletonn app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/betterlife.webp` | 256x256 | 2,968 | Betterlife app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/client-01.webp` | 256x256 | 1,724 | unknown brand: navy "a" with orange arrow (no bg) |
| `clients/client-02.webp` | 256x256 | 2,726 | unknown: serif "M" on black |
| `clients/client-03.webp` | 256x256 | 2,538 | unknown: green tile, winged "V" emblem |
| `clients/client-04.webp` | 256x256 | 4,432 | unknown: magenta tile, butterfly |
| `clients/client-05.webp` | 256x256 | 3,988 | unknown: beige tile, shell |
| `clients/client-06.webp` | 256x256 | 2,578 | unknown: black tile, perfume bottle w/ lime heart (maybe Tabs/Dom Perfumes) |
| `clients/client-07.webp` | 256x256 | 4,478 | unknown: green tile, gold leaf swoosh |
| `clients/client-08.webp` | 256x256 | 3,826 | unknown: dark tile, eagle/wave circle |
| `clients/consolatio.webp` | 256x256 | 7,838 | Consolatio app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/cross-crown.webp` | 256x256 | 4,676 | Cross Crown app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/d1-fitness.webp` | 256x256 | 2,108 | D1 Fitness app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/dom.webp` | 256x256 | 3,148 | Dom app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/dona-rica.webp` | 256x256 | 1,910 | Dona Rica app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/gabriela-guth.webp` | 256x256 | 2,920 | "G" Gabriela Guth (no bg) |
| `clients/ginga.webp` | 256x256 | 4,800 | Ginga app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/green-is-good.webp` | 256x256 | 5,038 | Green Is Good app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/gum.webp` | 256x256 | 2,022 | Gum app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/hiven.webp` | 256x256 | 1,968 | Hiven app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/loum.webp` | 256x256 | 3,002 | Loum app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/mahdri.webp` | 256x256 | 3,494 | Mahdri app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/modernlar.webp` | 256x256 | 1,812 | Modernlar app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/pe-de-algodao.webp` | 256x256 | 3,102 | Pe De Algodao app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/sunkids.webp` | 256x256 | 1,810 | Sunkids app icon (PDF p.2 grid; loum/belletonn/pe-de-algodao/hiven from case pages). Square, round corners via CSS. |
| `clients/wordmark-consolatio.png` | 380x63 | 8,708 | Consolatio horizontal wordmark, transparent. |
| `clients/wordmark-pe-de-algodao.png` | 443x62 | 6,602 | Pé de Algodão wordmark, black on transparent (converted from white bg). |
| `clients/wordmark-sunkids.png` | 500x125 | 22,762 | Sunkids horizontal wordmark, transparent. |
| `people/person-1.webp` | 320x320 | 9,654 | Aníbal Ribeiros/Riveros (Sunkids) — young man, dark shirt, speaking on stage, blue LED backdrop. Framer img ncCnywm2… |
| `people/person-2.webp` | 320x320 | 4,060 | João Soriani (Consolatio) — man with mustache, black shirt, dark moody background. Framer img O7VtCItS… |
| `people/person-3.webp` | 320x320 | 6,166 | Mateus Tondo (Pé de Algodão) — smiling man, beard, white shirt, light background. Framer img HfuWYkRQ… |
| `brand/korza-logo-black.svg` | vb 0 0 2411 426 | 14,244 | Same logo, all #121212 (monochrome). |
| `brand/korza-logo-white.svg` | vb 0 0 2411 426 | 14,244 | Same logo, all white — for dark footers/sections. |
| `brand/korza-logo.png` | 2400x425 | 64,108 | Raster fallback of full logo, transparent, 2400px wide. |
| `brand/korza-logo.svg` | vb 0 0 2411 426 | 14,244 | Full horizontal logo, blue mark #155DFC + wordmark #121212. Vector traced (potrace) from PDF p.12 + favicon mark. viewBox 0 0 2411 426 (ratio 5.66:1). Use for header. |
| `brand/korza-mark-512.png` | 512x445 | 15,647 | Raster fallback of mark, transparent, 512px wide. |
| `brand/korza-mark.svg` | vb 0 0 672 583 | 1,611 | Blue mark only (bar + triangle). viewBox 0 0 672 583 (ratio 1.153:1). |
| `brand/korza-wordmark.svg` | vb 610 10 1790 407 | 12,726 | "KORZA" wordmark only, #121212. |
| `brand/wave.webp` | 1600x484 | 37,466 | Blue wavy 3D texture from PDF cover (decorative hero/CTA background). |
| `integrations/nuvemshop.svg` | vb 0 0 160 40 | 9,167 | Official wordmark from nuvemshop.com.br, fill=currentColor. viewBox 0 0 160 40 (4:1). |
| `integrations/shopify.svg` | vb 0 0 24 24 | 1,234 | Simple Icons (monochrome, no fill attr → inherits currentColor via CSS `fill`). viewBox 0 0 24 24. |
| `integrations/tray.svg` | vb 0 0 62 32 | 4,271 | Official logo from tray.com.br (Webflow CSS). Colors #252D69/#43A0D6, uses <mask>. viewBox 0 0 62 32 (1.94:1). |
| `integrations/vtex.svg` | vb 0 0 24 24 | 791 | Simple Icons monochrome. 24x24. |
| `integrations/woocommerce.svg` | vb 0 0 24 24 | 3,574 | Simple Icons monochrome. 24x24. |
| `integrations/yampi.svg` | vb 0 0 161 32 | 1,537 | Official wordmark from yampi.com.br, fill #221D25. viewBox 0 0 161 32 (5:1). |
| `screens/belletonn.webp` | 640x982 | 43,956 | Belletonn app home (PDF p.6). Same cut-off caveat (aspect ~1.53). |
| `screens/d1-fitness.webp` | 780x1615 | 77,790 | D1 Fitness app home, full screen (Framer original 1252x2548). Aspect 2.07. |
| `screens/dashboard-analytics.webp` | 1600x1005 | 56,714 | Korza admin → Analytics page (PDF p.9), screen content only. |
| `screens/dashboard-campanhas.webp` | 1600x1005 | 33,760 | Korza admin → Campanhas calendar (PDF p.10), screen content only. |
| `screens/hiven.webp` | 780x1683 | 80,828 | Hiven app home, FULL screen incl. status bar and tab bar (PDF p.8). Aspect 2.16 — ideal for phone mockup. |
| `screens/loum.webp` | 640x982 | 114,504 | Loum app home (PDF p.5). Phone cut at slide bottom → aspect ~1.53 (not full 9:19.5). Crop top of a phone frame or use object-fit. |
| `screens/pe-de-algodao.webp` | 640x982 | 27,622 | Pé de Algodão app home (PDF p.7). Same cut-off caveat (aspect ~1.53). |
| `screens/push-lockscreen.webp` | 1600x1595 | 80,178 | iPhone lock screen "Central de Notificações" with Belletonn + D1 pushes, bezel included, white bg (Framer 2jmq27…). |
| `screens/push-sunkids.png` | 1110x291 | 37,260 | Single push notification banner "Que saudade de você… ❤️" (Sunkids), black background (Framer TdNxn4…). |
| `screens/sunkids.webp` | 780x1612 | 95,872 | Sunkids app home, full screen (Framer original). Aspect 2.07. |
