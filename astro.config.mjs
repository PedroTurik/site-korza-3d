// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.korza.com.br',
  trailingSlash: 'never',
  compressHTML: true,
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
    assets: '_a',
  },
  image: {
    responsiveStyles: true,
  },
  prefetch: false,
  devToolbar: { enabled: false },
});
