# Korza — Copy final + Estratégia de SEO

Idioma: pt-BR. Tom: confiante, direto, premium. Sem clichês, sem exclamação de hype.
Todas as afirmações numéricas abaixo estão na lista de provas aprovadas. Não adicionar outras.

Links fixos:
- CTA principal: `https://admin.korza.app/create-account`
- Login: `https://admin.korza.app/select-tenant`
- Instagram: `https://www.instagram.com/korza.br/`
- LinkedIn: `https://www.linkedin.com/company/107659841/`

---

## 1. SEO

### Title / Meta
- `<title>` (58 chars): `Korza | Aplicativo para e-commerce no ar em 14 dias`
- Meta description (152 chars): `Transforme sua loja virtual em app nativo na App Store e Google Play. Mesmo checkout, push ilimitado, +15% de recompra. Sem custo de lançamento. Crie o seu.`
- Canonical: `https://www.korza.com.br/`
- `<html lang="pt-BR">`, `robots: index, follow, max-image-preview:large`

### Open Graph / Twitter
- `og:type`: website
- `og:site_name`: Korza
- `og:title`: `Korza — O app da sua loja, no bolso do seu cliente`
- `og:description`: `Lance o aplicativo nativo do seu e-commerce em até 14 dias úteis. Integrado ao checkout, push ilimitado, sem custo de lançamento. A partir de R$399/mês.`
- `og:image`: 1200×630, fundo preto `#131720`, logo branco, mockup de iPhone com push, texto "O app da sua loja em 14 dias".
- `og:locale`: pt_BR
- `twitter:card`: summary_large_image
- `twitter:title` / `twitter:description`: iguais ao OG.

### Palavras-chave
Primárias (intenção comercial):
- aplicativo para e-commerce
- app para loja virtual
- criar aplicativo para loja virtual
- app para e-commerce shopify
- aplicativo nuvemshop

Secundárias (suporte/long tail):
- push notification e-commerce
- app loja virtual preço
- aplicativo para loja shopify
- app para loja woocommerce
- aplicativo tray / yampi / vtex
- aumentar recompra e-commerce
- canal de recompra
- notificação push para loja online
- app nativo para e-commerce
- quanto custa um aplicativo para loja virtual

Onde usar: H1 (aplicativo / loja), H2 de Como funciona ("app da sua loja"), H2 Planos ("preço"), FAQ (long tails em perguntas), alt de imagens, title/description. Densidade natural, sem repetição mecânica.

### Hierarquia de headings
- **H1** (1 só, hero): ver §3.
- **H2** por seção: Integrações, Canal de recompra, Como funciona, Método AOP, Funcionalidades, Dashboard, Cases, Planos, FAQ, CTA final.
- **H3**: títulos de cards (passos, cards AOP, funcionalidades, cases, nomes de planos, cada pergunta do FAQ).
- Logo wall e footer: sem heading semântico (usar `<p>` ou `aria-label`).

### Anchor IDs
`#hero`, `#integracoes`, `#recompra`, `#como-funciona`, `#metodo-aop`, `#funcionalidades`, `#dashboard`, `#cases`, `#planos`, `#faq`, `#cta`

### Política de alt text
- Descritivo, em pt-BR, ≤ 125 chars, sem "imagem de".
- Mockups: nomear a marca e o que aparece. Ex.: `App da Pé de Algodão com banner de cupom de primeira compra`.
- Logos de clientes: `Logo da Loum`. Logos de plataformas: `Shopify`.
- Ícones decorativos: `alt=""` + `aria-hidden="true"`.
- Badges de loja: `Disponível na App Store`, `Disponível no Google Play`.
- Capturas do dashboard: `Dashboard Korza: composição dos pedidos com 40% de recompras`.

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Korza",
  "legalName": "Korza Apps",
  "url": "https://www.korza.com.br/",
  "logo": "https://www.korza.com.br/logo.png",
  "taxID": "60.603.854/0001-94",
  "description": "Plataforma que transforma e-commerces em aplicativos nativos para iOS e Android, integrados à loja e ao checkout, com notificações push ilimitadas.",
  "sameAs": [
    "https://www.instagram.com/korza.br/",
    "https://www.linkedin.com/company/107659841/"
  ],
  "areaServed": "BR"
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Korza",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "iOS, Android, Web",
  "url": "https://www.korza.com.br/",
  "description": "Crie o aplicativo nativo da sua loja virtual, publicado na App Store e no Google Play, integrado ao seu e-commerce e checkout, com push ilimitado e analytics de recompra.",
  "offers": [
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "399.00",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "url": "https://admin.korza.app/create-account",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "399.00",
        "priceCurrency": "BRL",
        "billingDuration": 1,
        "billingIncrement": 1,
        "unitCode": "MON"
      }
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "799.00",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/PreOrder",
      "url": "https://www.korza.com.br/#planos",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "799.00",
        "priceCurrency": "BRL",
        "billingDuration": 1,
        "billingIncrement": 1,
        "unitCode": "MON"
      }
    }
  ],
  "provider": { "@type": "Organization", "name": "Korza", "url": "https://www.korza.com.br/" }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Em quanto tempo o app da minha loja fica no ar?",
      "acceptedAnswer": { "@type": "Answer", "text": "Em até 14 dias úteis após a coleta de materiais. A construção e a publicação na App Store e no Google Play são feitas pela Korza, sem exigir trabalho técnico da sua equipe." }
    },
    {
      "@type": "Question",
      "name": "Quanto custa lançar o aplicativo?",
      "acceptedAnswer": { "@type": "Answer", "text": "Não há custo de lançamento nem taxa de setup. Você paga apenas a mensalidade do plano, a partir de R$399/mês. A publicação nas duas lojas está inclusa." }
    },
    {
      "@type": "Question",
      "name": "Quais plataformas de e-commerce a Korza integra?",
      "acceptedAnswer": { "@type": "Answer", "text": "Shopify, Nuvemshop, WooCommerce, Tray, Yampi e VTEX. A integração é automática: produtos, estoque, preços e coleções da sua loja aparecem no app sem trabalho manual." }
    },
    {
      "@type": "Question",
      "name": "O app usa o mesmo checkout da minha loja?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sim. O cliente finaliza a compra no checkout que você já usa, com os mesmos meios de pagamento, frete, cupons e regras. Nada muda na sua operação." }
    },
    {
      "@type": "Question",
      "name": "O estoque e os preços são atualizados automaticamente?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sim. Qualquer alteração de estoque, preço, produto ou coleção feita na sua loja é refletida no aplicativo automaticamente." }
    },
    {
      "@type": "Question",
      "name": "As notificações push são realmente ilimitadas?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sim. Você envia quantas campanhas quiser, para toda a base, sem pagar por envio nem por clique. Cada push pode abrir um link específico da sua loja dentro do app." }
    },
    {
      "@type": "Question",
      "name": "Como meus clientes vão baixar o app?",
      "acceptedAnswer": { "@type": "Answer", "text": "A Korza ativa um banner de download no seu site e orienta a aplicação do Método AOP: uma oferta exclusiva no app, como cupom de primeira compra ou frete grátis, para migrar sua base atual." }
    },
    {
      "@type": "Question",
      "name": "Quem opera o dashboard?",
      "acceptedAnswer": { "@type": "Answer", "text": "Você e sua equipe. O dashboard da Korza foi feito para o time de marketing e e-commerce: criar e agendar campanhas de push e acompanhar recompras, migração de canal e faturamento do app." }
    },
    {
      "@type": "Question",
      "name": "Existe fidelidade? Posso cancelar quando quiser?",
      "acceptedAnswer": { "@type": "Answer", "text": "Não há fidelidade. O plano é mensal e pode ser cancelado a qualquer momento, sem multa." }
    },
    {
      "@type": "Question",
      "name": "O que acontece com o app se eu cancelar?",
      "acceptedAnswer": { "@type": "Answer", "text": "O app e o dashboard permanecem ativos até o fim do período já pago. Depois disso, o aplicativo deixa de ser distribuído e as notificações são encerradas. Nosso time orienta você sobre o processo." }
    }
  ]
}
```

---

## 2. Navbar

- Logo: Korza (link para `#hero`)
- Links: `Como funciona` → `#como-funciona` · `Funcionalidades` → `#funcionalidades` · `Cases` → `#cases` · `Planos` → `#planos` · `FAQ` → `#faq`
- Login (ghost): `Entrar` → select-tenant
- CTA (primário): `Criar meu app` → create-account

Mobile: menu com os mesmos links; CTA fixo na base do drawer.

---

## 3. Hero

- Eyebrow/badge: `No ar em até 14 dias úteis · Sem custo de lançamento`
- **H1 opção A** (recomendada): `O app da sua loja. No bolso de quem já compra de você.`
- **H1 opção B**: `Sua loja virtual vira aplicativo nativo em 14 dias.`
- Subheadline (29 palavras): `A Korza publica o aplicativo da sua marca na App Store e no Google Play, integrado ao seu e-commerce e ao seu checkout. Com push ilimitado para transformar sua base em recompra.`
- CTA primário: `Criar meu app`
- CTA secundário: `Ver como funciona` → `#como-funciona`
- Micro-provas (3 itens, linha abaixo dos CTAs):
  - `+60 e-commerces no ar`
  - `Até 14 dias úteis para publicar`
  - `Sem taxa de setup, sem fidelidade`
- Linha de badges: `Publicado na App Store e no Google Play` (badges oficiais, com `alt` conforme política)

---

## 4. Logo wall

- Linha: `Marcas que já vendem pelo próprio app`
- Alternativa (fallback): `Junto com os maiores do e-commerce brasileiro`
- Logos: Loum, Belletonn, Pé de Algodão, Sunkids, Consolatio, Hiven, Midastime, Modernlar, Tabs Perfumes, Dom Perfumes, Isa Leblanc, Compton Streetwear, Yogui, Armazém dos Chinelos, A22 Sneakers, D1 Fitness, Alurra, Cross & Crown, Green is Good, Güm, Mahdri, Betterlife, Dona Rica, Ginga (marquee contínua, 2 fileiras).

---

## 5. Canal de recompra (`#recompra`)

- H2: `E-mail e WhatsApp funcionam. Até certo ponto.`
- Texto: `Eles dependem de caixa de entrada cheia, de clique em link e de duas ou três telas até o produto. Um aplicativo elimina os atritos: a oferta aparece na tela do celular e a compra acontece em um toque, no checkout que o cliente já conhece.`
- Stat cards (3):
  1. `30%` — `maior taxa de abertura` — `Push notification comparado a e-mail e WhatsApp.`
  2. `até 25%` — `mais conversão` — `Compra no app versus canais tradicionais.`
  3. `1 toque` — `até a tela do produto` — `WhatsApp precisa de 2. E-mail, de 2 a 3.`
- Rodapé da seção (pequeno): `Um canal próprio, sem intermediário e sem custo por clique.`

---

## 6. Como funciona (`#como-funciona`)

- Eyebrow: `Como funciona`
- H2: `Três passos até a recompra`
- Passos:
  1. **H3:** `Sincronize sua loja`  
     `Conecte Shopify, Nuvemshop, WooCommerce, Tray, Yampi ou VTEX. Produtos, estoque, preços e checkout entram no app automaticamente.` (20 palavras)
  2. **H3:** `Nós publicamos`  
     `Em até 14 dias úteis, seu app está na App Store e no Google Play, com a estética da sua marca. Sem custo de lançamento.` (24 palavras)
  3. **H3:** `Venda via push`  
     `Convide sua base com uma oferta exclusiva e dispare campanhas ilimitadas direto na tela do celular. Recompra em um toque.` (20 palavras)
- CTA inline: `Criar meu app`

### Roadmap operacional (timeline abaixo dos passos)
- Eyebrow: `Roadmap de lançamento`
- Etapa 1 — `Coleta de materiais` — `Reunimos informações da loja e definimos cores e logo do app.`
- Etapa 2 — `Construção` — tag `até 14 dias úteis` — `Construímos e publicamos para Android e iOS. 100% conosco, sem exigir interação da sua equipe.`
- Etapa 3 — `Aplicativo no ar` — `Você recebe acesso ao dashboard, integra o app à loja e aplica o Método AOP.`

---

## 7. Método AOP (`#metodo-aop`)

- Eyebrow: `Método AOP`
- H2: `O método que faz o app vender`
- Intro: `Desenvolvido pela Korza a partir de dezenas de lançamentos, o Método AOP acelera a adoção do app e transforma download em recompra.`
- Cards:
  1. **H3:** `Aplicativo` — `Sua loja publicada como app nativo na App Store e no Google Play, integrada à plataforma e ao checkout.`
  2. **H3:** `Oferta` — `Um incentivo exclusivo do app, como cupom de primeira compra ou frete grátis, exibido no banner do seu site para migrar a base.`
  3. **H3:** `Push` — `Campanhas ilimitadas na tela do celular, cada uma abrindo um link específico da loja. A recompra a um toque.`
- Callout `Por quê?`: `O cliente precisa de um motivo para baixar o seu app. Sem o incentivo certo, a taxa de download cai muito. Com ele, a base migra e o canal começa a vender.`

---

## 8. Funcionalidades (`#funcionalidades`)

- Eyebrow: `Funcionalidades`
- H2: `Tudo que o seu canal de app precisa`
- Grid (8):
  1. **Push ilimitado** — `Dispare quantas campanhas quiser, sem pagar por envio ou por clique.`
  2. **Integração automática** — `Estoque, preços, produtos e coleções sincronizados com a sua loja, sem trabalho manual.`
  3. **Mesmo checkout** — `O cliente compra no checkout que você já usa, com os mesmos pagamentos, frete e cupons.`
  4. **Sua marca, sua estética** — `Cores, logo e identidade da loja aplicadas ao app. Ninguém percebe que não foi feito sob medida.`
  5. **Banner de download no site** — `Convite ao app exibido na sua loja, com a oferta que migra a base.`
  6. **Analytics de recompra** — `Recompras, migração de canal, primeiro pedido e faturamento do app, em um painel direto ao ponto.`
  7. **Publicação inclusa** — `App Store e Google Play, sem custo de lançamento. Publicação e atualizações por nossa conta.`
  8. **Time ao seu lado** — `Lançamento conduzido pela Korza e suporte para aplicar o Método AOP desde o primeiro dia.`

---

## 9. Dashboard (`#dashboard`)

- Eyebrow: `Seu dashboard`
- H2: `Desempenho do app na ponta do lápis`
- Texto: `Saiba exatamente quanto o app vende, quem está voltando e qual campanha trouxe cada pedido.`
- Bullets:
  - `Recompra no app: clientes que compraram duas ou mais vezes pelo aplicativo`
  - `Migração de canal: quem já comprava no site e passou a comprar no app`
  - `Primeiro pedido: novos clientes conquistados pelo app`
  - `Desempenho por campanha: abertura, cliques e vendas de cada push`
- Labels da UI fake:
  - Sidebar: `Painel`, `Analytics`, `Campanhas`, `Públicos` (badge `Em breve`), `Vendas`, `Personalizar app`
  - Header: `Analytics` · filtro `Últimos 30 dias`
  - Cards: `Número de vendas` `355` · `Recompras` `131` · `Composição dos pedidos` donut `40% recompras`
  - Legenda do donut: `Recompra no app · 30 (R$ 4.976,37)` · `Migração de canal · 141 (R$ 32.207,91)` · `Primeiro pedido · 258 (R$ 63.601,80)`
  - Tela Campanhas: `Campanhas` · `junho de 2026` · botão `Criar campanha` · eventos: `Promo 10% off`, `Lançamento prod.`, `Liquidação de ver.`, `Oferta relâmpago`, `Dia do frete grátis`, `Acesso antecipado`
- Push de exemplo (mockup de lockscreen): `Um mimo para quem já é de casa` — `Quem compra uma vez merece vantagem na segunda. Use o cupom VOLTEI e ganhe 15% OFF.`

---

## 10. Cases (`#cases`)

- Eyebrow: `Cases`
- H2: `Resultados de quem já lançou`
- Cards (4):
  1. **Loum** — tag `Moda feminina` — métrica `42%` — label `de recompra in-app` — `42% dos pedidos feitos no app vieram de clientes que já haviam comprado na loja.`
  2. **Belletonn** — tag `Cosméticos` — métrica `26,6%` — label `de conversão em push não segmentado` — `26% das pessoas que abrem uma notificação push da loja compram.`
  3. **Pé de Algodão** — tag `Calçados` — métrica `+4,98%` — label `de faturamento extra via push` — `Aumento no faturamento total da loja gerado por vendas a partir de notificações.`
  4. **Sunkids** — tag `Óculos infantis` — métrica `R$ 200 mil` — label `de faturamento no 1º mês` — `Projeção de 10% do faturamento de 2026 vindo do app.`
- Linha extra (opcional, abaixo dos cards): `Consolatio: 22,7% da receita via app.`

### Depoimentos (3)
1. `Me surpreendi com os resultados desse novo canal de vendas. Confesso que no início não acreditava muito em aplicativos, mas já no primeiro mês batemos 200k de faturamento. Agora em 2026 estamos projetando que 10% do nosso faturamento virá do app com a Korza. Definitivamente recomendo.`  
   — **Aníbal Riveros**, Founder, Sunkids
2. `A Korza permite que e-commerces lancem seu próprio app de forma rápida e prática, aumentando ticket médio, fidelização e segmentação, com um dashboard completo e um time focado em inovação e excelência.`  
   — **João Soriani**, Consolatio
3. `Desde a implementação, o app da Pé de Algodão já representa até 5% do faturamento, com estrutura estável, intuitiva e ótima experiência para o usuário. Enxergamos o aplicativo como um canal estratégico para crescer até 10% do faturamento e aumentar o LTV com mais recorrência e fidelização.`  
   — **Mateus Tondo**, Pé de Algodão

---

## 11. Planos (`#planos`)

- Eyebrow: `Planos`
- H2: `Um preço. Sem surpresa.`
- Subline: `Mensal, sem taxa de setup, sem fidelidade. A publicação nas duas lojas está inclusa.`

### Starter
- Badge: `Disponível agora`
- Nome: `Starter`
- Preço: `R$ 399` `/mês`
- Descrição: `Tudo para colocar o app no ar e começar a vender por push.`
- Bullets:
  - `App nativo na App Store e no Google Play`
  - `Integração com Shopify, Nuvemshop, WooCommerce, Tray, Yampi e VTEX`
  - `Mesmo checkout da sua loja`
  - `Estética e identidade da sua marca`
  - `Notificações push ilimitadas`
  - `Push com link para qualquer página da loja`
  - `Banner de download do app no site`
  - `Analytics de recompra e campanhas`
  - `Garantia de disponibilidade`
  - `Publicação e atualizações sem custo de lançamento`
- CTA: `Criar meu app` → create-account
- Nota: `Publicação em até 14 dias úteis.`

### Pro
- Badge: `Em breve`
- Nome: `Pro`
- Preço: `R$ 799` `/mês`
- Descrição: `Para quem quer automatizar a recompra e vender mais por cliente.`
- Bullets:
  - `Tudo do Starter`
  - `Recuperação de carrinho abandonado`
  - `Segmentação de público`
  - `AI Smart Push: mensagens otimizadas por IA`
  - `Push agendado e automático`
  - `Novas funcionalidades em primeira mão`
- CTA (secundário): `Comece no Starter` → create-account
- Nota: `Migre para o Pro quando ele for lançado, sem reinstalar nada.`

### Footnotes
`Sem taxa de setup · Sem fidelidade · Cancele quando quiser · Publicação nas lojas inclusa`

---

## 12. FAQ (`#faq`)

- Eyebrow: `Perguntas frequentes`
- H2: `Dúvidas antes de lançar`

1. **Em quanto tempo o app da minha loja fica no ar?**  
   Em até 14 dias úteis após a coleta de materiais. A construção e a publicação na App Store e no Google Play são feitas pela Korza, sem exigir trabalho técnico da sua equipe.
2. **Quanto custa lançar o aplicativo?**  
   Não há custo de lançamento nem taxa de setup. Você paga apenas a mensalidade do plano, a partir de R$399/mês. A publicação nas duas lojas está inclusa.
3. **Quais plataformas de e-commerce a Korza integra?**  
   Shopify, Nuvemshop, WooCommerce, Tray, Yampi e VTEX. A integração é automática: produtos, estoque, preços e coleções da sua loja aparecem no app sem trabalho manual.
4. **O app usa o mesmo checkout da minha loja?**  
   Sim. O cliente finaliza a compra no checkout que você já usa, com os mesmos meios de pagamento, frete, cupons e regras. Nada muda na sua operação.
5. **O estoque e os preços são atualizados automaticamente?**  
   Sim. Qualquer alteração de estoque, preço, produto ou coleção feita na sua loja é refletida no aplicativo automaticamente.
6. **As notificações push são realmente ilimitadas?**  
   Sim. Você envia quantas campanhas quiser, para toda a base, sem pagar por envio nem por clique. Cada push pode abrir um link específico da sua loja dentro do app.
7. **Como meus clientes vão baixar o app?**  
   A Korza ativa um banner de download no seu site e orienta a aplicação do Método AOP: uma oferta exclusiva no app, como cupom de primeira compra ou frete grátis, para migrar sua base atual.
8. **Quem opera o dashboard?**  
   Você e sua equipe. O dashboard da Korza foi feito para o time de marketing e e-commerce: criar e agendar campanhas de push e acompanhar recompras, migração de canal e faturamento do app.
9. **Existe fidelidade? Posso cancelar quando quiser?**  
   Não há fidelidade. O plano é mensal e pode ser cancelado a qualquer momento, sem multa.
10. **O que acontece com o app se eu cancelar?**  
    O app e o dashboard permanecem ativos até o fim do período já pago. Depois disso, o aplicativo deixa de ser distribuído e as notificações são encerradas. Nosso time orienta você sobre o processo.

Nota de cautela: não afirmar quem paga as contas de desenvolvedor Apple/Google. Usar sempre "sem custo adicional de lançamento" / "publicação inclusa".

---

## 13. CTA final (`#cta`)

- H2: `Seu próximo canal de vendas cabe no bolso do cliente`
- Subline: `Crie sua conta agora. Em até 14 dias úteis, sua loja está na App Store e no Google Play.`
- CTA: `Criar meu app`
- Micro-linha: `Sem custo de lançamento · Sem fidelidade · A partir de R$399/mês`

---

## 14. Footer

- Tagline: `O aplicativo da sua loja, integrado ao seu e-commerce.`
- Colunas:
  - **Produto**: Como funciona · Funcionalidades · Cases · Planos · FAQ · Entrar
  - **Empresa**: Sobre a Korza (placeholder) · Instagram · LinkedIn · Contato (placeholder)
  - **Legal**: Termos de uso (placeholder) · Política de privacidade (placeholder) · LGPD (placeholder)
- Linha legal: `Korza Apps · CNPJ 60.603.854/0001-94`
- Social labels (aria): `Korza no Instagram`, `Korza no LinkedIn`
- Copyright: `© 2026 Korza. Todos os direitos reservados.`
- Badges de loja (pequenos): App Store · Google Play

---

## 15. Microcopy

- Botão primário hover: leve elevação; foco visível (`outline` azul 2px, offset 2px). Texto não muda.
- Botão em carregamento (se houver): `Abrindo…`
- Links de âncora: scroll suave, respeitando `prefers-reduced-motion`.
- Nota de cookies/LGPD: o site atual carrega GA4 (`G-8HJQLPS6DE`), o que coleta identificadores e, pela LGPD, pede ao menos aviso e política de privacidade; recomendamos GA4 com `consent mode` default negado + banner mínimo, ou trocar por analytics sem cookies (Plausible/Umami) e dispensar o banner.
- Banner de consentimento (se GA4 for mantido):
  - Texto: `Usamos cookies de analytics para entender como o site é usado.`
  - Botões: `Aceitar` · `Recusar` · link `Política de privacidade`
- Página 404:
  - H1: `Essa página saiu do ar.`
  - Texto: `O app da sua loja, não. Volte para a página inicial ou crie sua conta.`
  - CTAs: `Voltar ao início` · `Criar meu app`
- Skip link: `Pular para o conteúdo`
- Menu mobile aria: `Abrir menu` / `Fechar menu`

---

## Apêndice — Racional de conversão

A página segue o caminho de decisão de um lojista: **prova antes de promessa**. O hero entrega em uma frase o que é, para quem é e o risco zero (14 dias, sem custo), com o CTA de criar conta como ação primária e "Ver como funciona" para quem ainda não está pronto. A logo wall logo abaixo neutraliza a dúvida "isso é sério?" antes de qualquer argumento.

A seção de canal de recompra reenquadra o problema (e-mail e WhatsApp têm atrito) antes de apresentar o produto, então "Como funciona" chega como resposta e não como pitch. O Método AOP diferencia a Korza de um construtor de apps genérico e responde à objeção silenciosa "ninguém vai baixar". Funcionalidades e Dashboard consolidam o que o lojista leva; Cases dão números concretos por segmento, com depoimentos nominais.

Planos aparecem só depois da prova, com o Pro "Em breve" ancorando o valor do Starter. O FAQ remove as últimas objeções (checkout, estoque, cancelamento). O CTA final repete a oferta e as três garantias. O CTA primário é repetido na navbar fixa, após "Como funciona", no Starter e no fechamento: sempre acessível, nunca intrusivo.
