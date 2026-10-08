# Números e textos ilustrativos (v3 — out/2026)

Pedro autorizou números inventados para as visualizações, com correção posterior. Cada item abaixo diz onde está e qual é o valor. Os números **aprovados** (deck) não entram aqui.

| Onde | O que | Valor | Arquivo |
|---|---|---|---|
| Hero | Textos dos pushes (Hiven, Sunkids, D1 Fitness) e chip "+1 pedido" | ver `scenes` | `src/components/Hero.astro` |
| Recompra | Taxa de abertura média por canal | App 42% · WhatsApp 32% · E-mail 21% | `src/components/Recompra.astro` (`openRates`) |
| Recompra | Toques até o produto | App 1 · WhatsApp 2 · E-mail 2 a 3 | `src/components/Recompra.astro` |
| Lançamento | Régua de dias, loja e e-mail do formulário, itens sincronizados | 14 dias, no ar no dia 9 · "Loja Hiven" · ana@hiven.com.br · 1.248 itens | `src/components/Launch.astro` (`ruler`) |
| AOP | Taxa de download da base sem/com oferta | 4% vs 23% | `src/components/Aop.astro` (`why`) |
| Funcionalidades | Envios no mês · produtos sincronizados · total do checkout · vendas pelo app | 12.480 · 1.248 · R$ 223,41 → R$ 189,90 · R$ 100.786 / 131 recompras / 40% | `src/components/Features.astro` (`demo`) |
| Dashboard | KPIs e composição (calibrados pelos prints reais do admin) | 443 downloads · 151 vendas · R$ 67.018,70 · 66 recompras · 44% · 38 (R$ 16.906,06) · 28 (R$ 12.208,31) · Primeiro pedido 85 (R$ 37.904,33) · séries diárias de faturamento e vendas com push no dia 22 | `src/components/Dashboard.astro` (`ui`) |
| Cases | Legendas dos unit charts | "42 de cada 100 pedidos…", "27 de cada 100 pessoas…", "5 de cada 100 reais…" (derivadas dos números aprovados) | `src/components/Cases.astro` |
| CTA final | Texto do push da Sunkids | "Seu app chegou 🎉 Frete grátis na primeira compra pelo aplicativo." | `src/components/CtaBand.astro` (`push`) |

Para corrigir: edite o valor no arquivo indicado (todos estão no frontmatter, marcados `ILUSTRATIVO`). Os count-ups leem o número do atributo `data-count`, gerado a partir desses valores.
