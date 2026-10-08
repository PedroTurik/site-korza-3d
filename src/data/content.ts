/** Single source of truth for all page copy (pt-BR). Mirrors docs/copy-seo.md. */
import { site } from './site';

export const seo = {
  title: 'Korza | Aplicativo para e-commerce no ar em 14 dias',
  description:
    'Transforme sua loja virtual em app nativo na App Store e Google Play. Mesmo checkout, push ilimitado, +15% de recompra. Sem custo de lançamento. Crie o seu.',
  ogTitle: 'Korza — O app da sua loja, no bolso do seu cliente',
  ogDescription:
    'Lance o aplicativo nativo do seu e-commerce em até 14 dias úteis. Integrado ao checkout, push ilimitado, sem custo de lançamento. A partir de R$399/mês.',
};

export const hero = {
  badge: 'No ar em até 14 dias úteis · Sem custo de lançamento',
  h1a: 'O app da sua loja.',
  h1b: 'No bolso de quem já compra de você.',
  sub: 'O aplicativo da sua marca na App Store e no Google Play, integrado à sua loja e ao seu checkout. Push ilimitado para transformar base em recompra.',
  ctaSecondary: 'Ver como funciona',
  proofs: ['+60 e-commerces no ar', 'Até 14 dias úteis para publicar', 'Sem taxa de setup, sem fidelidade'],
};

export const logoWall = {
  line: 'Marcas que já vendem pelo próprio app',
};

export const recompra = {
  h2: 'E-mail e WhatsApp funcionam. Até certo ponto.',
  text: 'Dependem de caixa de entrada cheia e de duas ou três telas até o produto. No app, a oferta aparece na tela do celular e a compra acontece em um toque.',
  stats: [
    { value: '30%', label: 'maior taxa de abertura', note: 'Push notification comparado a e-mail e WhatsApp.' },
    { value: 'até 25%', label: 'mais conversão', note: 'Compra no app versus canais tradicionais.' },
    { value: '1 toque', label: 'até a tela do produto', note: 'WhatsApp precisa de 2. E-mail, de 2 a 3.' },
  ],
  foot: 'Um canal próprio, sem intermediário e sem custo por clique.',
  chart: { title: 'Taxa de abertura de campanha por canal', bars: [
    { label: 'App', pct: 100 }, { label: 'WhatsApp', pct: 32 }, { label: 'E-mail', pct: 18 },
  ] },
};

export const launch = {
  eyebrow: 'Lançamento',
  h2a: 'Lançar é simples.',
  h2b: 'Três cliques, poucos dias.',
  sub: 'Crie a conta, clique em Lançar e assine o plano. A Korza constrói e publica. Em poucos dias, sua loja está na App Store e no Google Play.',
  steps: [
    { n: '01', title: 'Crie sua conta', text: 'Conecte sua loja. Produtos, estoque e checkout entram sozinhos.' },
    { n: '02', title: 'Clique em Lançar', text: 'Cores, logo e assinatura do plano. O resto é com a gente.' },
    { n: '03', title: 'App no ar', text: 'Publicado nas duas lojas em poucos dias. Sem custo de lançamento.' },
  ],
};

export const aop = {
  eyebrow: 'Método AOP',
  h2: 'O método que faz o app vender',
  intro: 'Criado em dezenas de lançamentos. Acelera a adoção do app e transforma download em recompra.',
  cards: [
    { letter: 'A', title: 'plicativo', text: 'Sua loja como app nativo, nas duas lojas, com o mesmo checkout.' },
    { letter: 'O', title: 'ferta', text: 'Cupom ou frete grátis exclusivos do app. É o que faz a base migrar.' },
    { letter: 'P', title: 'ush', text: 'Campanhas ilimitadas na tela do celular. Recompra a um toque.' },
  ],
  why: { tag: 'Por quê?', text: 'O cliente precisa de um motivo para baixar o seu app. Sem o incentivo certo, a taxa de download cai muito. Com ele, a base migra e o canal começa a vender.' },
};

export const features = {
  eyebrow: 'Funcionalidades',
  h2a: 'O essencial,',
  h2b: 'incluso.',
  items: [
    { id: 'push', title: 'Push ilimitado', text: 'Sem custo por envio ou por clique.' },
    { id: 'sync', title: 'Integração automática', text: 'Estoque, preço e produtos sempre sincronizados.' },
    { id: 'checkout', title: 'Mesmo checkout', text: 'Pagamentos, frete e cupons que você já usa.' },
    { id: 'brand', title: 'Sua marca', text: 'Cores, logo e identidade da loja.' },
    { id: 'banner', title: 'Banner no site', text: 'O convite ao app, com a oferta certa.' },
    { id: 'analytics', title: 'Analytics de recompra', text: 'Quanto o app vende e quem voltou.' },
  ],
  foot: 'Publicação nas lojas e atualizações inclusas. Time Korza ao seu lado no lançamento.',
};

export const dashboard = {
  eyebrow: 'Seu dashboard',
  h2: 'Desempenho do app na ponta do lápis',
  text: 'Quanto o app vende, quem voltou e qual campanha trouxe cada pedido.',
  bullets: [
    ['Recompra no app', 'quem comprou duas ou mais vezes'],
    ['Migração de canal', 'quem saiu do site e veio para o app'],
    ['Primeiro pedido', 'clientes novos pelo app'],
    ['Por campanha', 'abertura, cliques e vendas de cada push'],
  ],
  ui: {
    sidebar: ['Painel', 'Analytics', 'Campanhas', 'Públicos', 'Vendas', 'Personalizar app'],
    donut: { pct: 40, legend: [
      { label: 'Recompra no app', n: '30', v: 'R$ 4.976,37' },
      { label: 'Migração de canal', n: '141', v: 'R$ 32.207,91' },
      { label: 'Primeiro pedido', n: '258', v: 'R$ 63.601,80' },
    ] },
    kpis: [ { label: 'Número de vendas', v: '355' }, { label: 'Recompras', v: '131' } ],
  },
  push: { title: 'Um mimo para quem já é de casa', body: 'Quem compra uma vez merece vantagem na segunda. Use o cupom VOLTEI e ganhe 15% OFF.' },
};

export const cases = {
  eyebrow: 'Cases',
  h2a: 'Resultados de',
  h2b: 'quem já lançou.',
  items: [
    { brand: 'Loum', tag: 'Moda feminina', metric: '42%', label: 'de recompra in-app', text: '42% dos pedidos feitos no app vieram de clientes que já haviam comprado na loja.', logo: '/clients/loum.webp', screen: '/screens/loum.webp' },
    { brand: 'Belletonn', tag: 'Cosméticos', metric: '26,6%', label: 'de conversão em push não segmentado', text: '26% das pessoas que abrem uma notificação push da loja compram.', logo: '/clients/belletonn.webp', screen: '/screens/belletonn.webp' },
    { brand: 'Pé de Algodão', tag: 'Calçados', metric: '+4,98%', label: 'de faturamento extra via push', text: 'Aumento no faturamento total da loja gerado por vendas a partir de notificações.', logo: '/clients/pe-de-algodao.webp', screen: '/screens/pe-de-algodao.webp' },
    { brand: 'Sunkids', tag: 'Óculos infantis', metric: 'R$ 200 mil', label: 'de faturamento no 1º mês', text: 'Projeção de 10% do faturamento de 2026 vindo do app.', logo: '/clients/sunkids.webp', screen: '/screens/sunkids.webp' },
  ],
  extra: 'Consolatio: 22,7% da receita via app.',
  testimonials: [
    { quote: 'Me surpreendi com os resultados desse novo canal de vendas. Confesso que no início não acreditava muito em aplicativos, mas já no primeiro mês batemos 200k de faturamento. Agora em 2026 estamos projetando que 10% do nosso faturamento virá do app com a Korza. Definitivamente recomendo.', name: 'Aníbal Riveros', role: 'Founder, Sunkids', photo: '/people/person-1.webp', brand: 'Sunkids', wordmark: '/clients/wordmark-sunkids.png' },
    { quote: 'A Korza permite que e-commerces lancem seu próprio app de forma rápida e prática, aumentando ticket médio, fidelização e segmentação, com um dashboard completo e um time focado em inovação e excelência.', name: 'João Soriani', role: 'Consolatio', photo: '/people/person-2.webp', brand: 'Consolatio', wordmark: '/clients/wordmark-consolatio.png' },
    { quote: 'Desde a implementação, o app da Pé de Algodão já representa até 5% do faturamento, com estrutura estável, intuitiva e ótima experiência para o usuário. Enxergamos o aplicativo como um canal estratégico para crescer até 10% do faturamento e aumentar o LTV com mais recorrência e fidelização.', name: 'Mateus Tondo', role: 'Pé de Algodão', photo: '/people/person-3.webp', brand: 'Pé de Algodão', wordmark: '/clients/wordmark-pe-de-algodao.png' },
  ],
};

export const pricing = {
  eyebrow: 'Planos',
  h2a: 'Um preço.',
  h2b: 'Sem surpresa.',
  sub: 'Mensal, sem taxa de setup, sem fidelidade. A publicação nas duas lojas está inclusa.',
  plans: [
    {
      id: 'starter', name: 'Starter', badge: 'Disponível agora', price: '399', soon: false,
      desc: 'Tudo para colocar o app no ar e começar a vender por push.',
      features: [
        'App nativo na App Store e no Google Play',
        'Integração com Shopify, Nuvemshop, WooCommerce, Tray, Yampi e VTEX',
        'Mesmo checkout da sua loja',
        'Estética e identidade da sua marca',
        'Notificações push ilimitadas',
        'Push com link para qualquer página da loja',
        'Banner de download do app no site',
        'Analytics de recompra e campanhas',
        'Garantia de disponibilidade',
        'Publicação e atualizações sem custo de lançamento',
      ],
      cta: site.ctaLabel, ctaHref: site.cta, note: 'Publicação em até 14 dias úteis.',
    },
    {
      id: 'pro', name: 'Pro', badge: 'Em breve', price: '799', soon: true,
      desc: 'Para quem quer automatizar a recompra e vender mais por cliente.',
      features: [
        'Tudo do Starter',
        'Recuperação de carrinho abandonado',
        'Segmentação de público',
        'AI Smart Push: mensagens otimizadas por IA',
        'Push agendado e automático',
        'Novas funcionalidades em primeira mão',
      ],
      cta: 'Comece no Starter', ctaHref: site.cta, note: 'Migre para o Pro quando ele for lançado, sem reinstalar nada.',
    },
  ],
  footnotes: ['Sem taxa de setup', 'Sem fidelidade', 'Cancele quando quiser', 'Publicação nas lojas inclusa'],
};

export const faq = {
  eyebrow: 'Perguntas frequentes',
  h2: 'Dúvidas antes de lançar',
  items: [
    ['Em quanto tempo o app da minha loja fica no ar?', 'Em até 14 dias úteis após a coleta de materiais. A construção e a publicação na App Store e no Google Play são feitas pela Korza, sem exigir trabalho técnico da sua equipe.'],
    ['Quanto custa lançar o aplicativo?', 'Não há custo de lançamento nem taxa de setup. Você paga apenas a mensalidade do plano, a partir de R$399/mês. A publicação nas duas lojas está inclusa.'],
    ['Quais plataformas de e-commerce a Korza integra?', 'Shopify, Nuvemshop, WooCommerce, Tray, Yampi e VTEX. A integração é automática: produtos, estoque, preços e coleções da sua loja aparecem no app sem trabalho manual.'],
    ['O app usa o mesmo checkout da minha loja?', 'Sim. O cliente finaliza a compra no checkout que você já usa, com os mesmos meios de pagamento, frete, cupons e regras. Nada muda na sua operação.'],
    ['O estoque e os preços são atualizados automaticamente?', 'Sim. Qualquer alteração de estoque, preço, produto ou coleção feita na sua loja é refletida no aplicativo automaticamente.'],
    ['As notificações push são realmente ilimitadas?', 'Sim. Você envia quantas campanhas quiser, para toda a base, sem pagar por envio nem por clique. Cada push pode abrir um link específico da sua loja dentro do app.'],
    ['Como meus clientes vão baixar o app?', 'A Korza ativa um banner de download no seu site e orienta a aplicação do Método AOP: uma oferta exclusiva no app, como cupom de primeira compra ou frete grátis, para migrar sua base atual.'],
    ['Quem opera o dashboard?', 'Você e sua equipe. O dashboard da Korza foi feito para o time de marketing e e-commerce: criar e agendar campanhas de push e acompanhar recompras, migração de canal e faturamento do app.'],
    ['Existe fidelidade? Posso cancelar quando quiser?', 'Não há fidelidade. O plano é mensal e pode ser cancelado a qualquer momento, sem multa.'],
    ['O que acontece com o app se eu cancelar?', 'O app e o dashboard permanecem ativos até o fim do período já pago. Depois disso, o aplicativo deixa de ser distribuído e as notificações são encerradas. Nosso time orienta você sobre o processo.'],
  ] as [string, string][],
};

export const ctaBand = {
  h2: 'Seu próximo canal de vendas cabe no bolso do cliente',
  sub: 'Crie sua conta agora. Em até 14 dias úteis, sua loja está na App Store e no Google Play.',
  micro: ['Sem custo de lançamento', 'Sem fidelidade', 'A partir de R$399/mês'],
};

export const footer = {
  tagline: 'O aplicativo da sua loja, integrado ao seu e-commerce.',
  cols: [
    { title: 'Produto', links: [...site.nav, { label: 'Entrar', href: site.login }] },
    { title: 'Empresa', links: [
      { label: 'Instagram', href: site.instagram },
      { label: 'LinkedIn', href: site.linkedin },
      { label: 'Criar conta', href: site.cta },
    ] },
    { title: 'Legal', links: [
      { label: 'Política de privacidade', href: '/privacidade' },
    ] },
  ],
  legal: `${site.legalName} · CNPJ ${site.cnpj}`,
  copyright: `© ${new Date().getFullYear()} Korza. Todos os direitos reservados.`,
};

export const integrations = [
  { name: 'Shopify', file: 'shopify' },
  { name: 'Nuvemshop', file: 'nuvemshop' },
  { name: 'WooCommerce', file: 'woocommerce' },
  { name: 'Tray', file: 'tray' },
  { name: 'Yampi', file: 'yampi' },
  { name: 'VTEX', file: 'vtex' },
];

export const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Korza',
    legalName: 'Korza Apps',
    url: 'https://www.korza.com.br/',
    logo: 'https://www.korza.com.br/brand/korza-logo.png',
    taxID: '60.603.854/0001-94',
    description: 'Plataforma que transforma e-commerces em aplicativos nativos para iOS e Android, integrados à loja e ao checkout, com notificações push ilimitadas.',
    sameAs: [site.instagram, site.linkedin],
    areaServed: 'BR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Korza',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'iOS, Android, Web',
    url: 'https://www.korza.com.br/',
    description: 'Crie o aplicativo nativo da sua loja virtual, publicado na App Store e no Google Play, integrado ao seu e-commerce e checkout, com push ilimitado e analytics de recompra.',
    offers: [
      { '@type': 'Offer', name: 'Starter', price: '399.00', priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: site.cta,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '399.00', priceCurrency: 'BRL', billingDuration: 1, billingIncrement: 1, unitCode: 'MON' } },
      { '@type': 'Offer', name: 'Pro', price: '799.00', priceCurrency: 'BRL', availability: 'https://schema.org/PreOrder', url: 'https://www.korza.com.br/#planos',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '799.00', priceCurrency: 'BRL', billingDuration: 1, billingIncrement: 1, unitCode: 'MON' } },
    ],
    provider: { '@type': 'Organization', name: 'Korza', url: 'https://www.korza.com.br/' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
];
