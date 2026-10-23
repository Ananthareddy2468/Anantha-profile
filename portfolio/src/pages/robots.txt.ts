import type { APIRoute } from 'astro';
import { base, site } from '../../portfolio.config.mjs';

export const GET: APIRoute = () => {
  const sitemap = new URL(`${base === '/' ? '' : base}/sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
