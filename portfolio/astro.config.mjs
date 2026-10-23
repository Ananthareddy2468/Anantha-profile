import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { base, site } from './portfolio.config.mjs';

export default defineConfig({
  site,
  base: base === '/' ? undefined : base,
  output: 'static',
  integrations: [sitemap()],
});
