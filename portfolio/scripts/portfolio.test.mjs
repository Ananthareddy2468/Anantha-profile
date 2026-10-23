import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import test from 'node:test';
import { evaluatePipeline } from '../src/scripts/pipeline.mjs';

const dist = new URL('../dist/', import.meta.url);
const distPath = decodeURIComponent(dist.pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const baseSetting = process.env.SITE_BASE ?? '/Anantha-profile';
const normalizedBase = baseSetting === '/' ? '' : `/${baseSetting.replace(/^\/+|\/+$/g, '')}`;

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

test('synthetic clean records pass every enabled validation rule', () => {
  const result = evaluatePipeline('clean', { missing: true, duplicate: true, invalid: true });

  assert.equal(result.sourceRows.length, 4);
  assert.equal(result.acceptedRows.length, 4);
  assert.deepEqual(result.flags, { missing: 0, duplicate: 0, invalid: 0 });
  assert.equal(result.rejectedCount, 0);
});

test('the issues sample computes missing, duplicate, and invalid outcomes', () => {
  const result = evaluatePipeline('issues', { missing: true, duplicate: true, invalid: true });

  assert.equal(result.sourceRows.length, 6);
  assert.deepEqual(result.flags, { missing: 1, duplicate: 1, invalid: 1 });
  assert.equal(result.acceptedRows.length, 3);
  assert.equal(result.rejectedCount, 3);
});

test('relaxed rules keep imperfect values visible in transformed output', () => {
  const result = evaluatePipeline('issues', { missing: false, duplicate: false, invalid: false });
  const incomplete = result.acceptedRows.find((row) => row.category === '');
  const nonNumeric = result.acceptedRows.find((row) => row.reading === 'not-a-number');

  assert.equal(result.acceptedRows.length, 6);
  assert.equal(result.rejectedCount, 0);
  assert.equal(incomplete?.normalizedCategory, 'UNKNOWN');
  assert.equal(nonNumeric?.numericReading, null);
  assert.equal(result.acceptedRows.filter((row) => row.eventId === 'EVT-003').length, 2);
});

test('production output contains every direct-load case study route', () => {
  const requiredRoutes = [
    'index.html',
    '404.html',
    'projects/healthcare-data-ai-platform/index.html',
    'projects/financial-ml-feature-pipelines/index.html',
    'projects/public-service-data-api-platform/index.html',
    'projects/industrial-time-series-analytics/index.html',
  ];

  for (const route of requiredRoutes) {
    assert.ok(existsSync(join(distPath, route)), `Expected static route: ${route}`);
  }
});

test('all generated internal links and assets honor the configured base path', () => {
  const files = htmlFiles(distPath);
  assert.ok(files.length >= 6, 'Expected the homepage, 404 page, and four project pages');

  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const values = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const value of values) {
      if (!value.startsWith('/')) continue;
      assert.ok(
        normalizedBase === '' || value === normalizedBase || value.startsWith(`${normalizedBase}/`),
        `Internal path outside the deployment base in ${relative(distPath, file).split(sep).join('/')}`,
      );
    }
  }
});

test('metadata, robots, and sitemap use the configured site URL and base', () => {
  const home = readFileSync(join(distPath, 'index.html'), 'utf8');
  const robots = readFileSync(join(distPath, 'robots.txt'), 'utf8');
  const sitemapIndex = readFileSync(join(distPath, 'sitemap-index.xml'), 'utf8');
  const expectedBase = normalizedBase;
  const expectedSocialImage = `https://ananthareddy2468.github.io${expectedBase}/social-card.svg`;

  assert.match(home, /<title>Anantha Reddy — AI\/ML Engineer<\/title>/);
  assert.match(home, /aria-label="Anantha Reddy — home"/);
  assert.match(home, /<link rel="canonical" href="https:\/\/ananthareddy2468\.github\.io/);
  assert.ok(home.includes(`property="og:image" content="${expectedSocialImage}"`));
  assert.ok(robots.includes(`https://ananthareddy2468.github.io${expectedBase}/sitemap-index.xml`));
  assert.ok(sitemapIndex.includes(`https://ananthareddy2468.github.io${expectedBase}/`));
});

test('primary content and useful links remain in the rendered HTML', () => {
  const home = readFileSync(join(distPath, 'index.html'), 'utf8');

  for (const section of ['top', 'work', 'lab', 'expertise', 'journey', 'contact']) {
    assert.ok(home.includes(`id="${section}"`), `Expected the ${section} section in static HTML`);
  }
  assert.equal((home.match(/class="project-card"/g) ?? []).length, 3);
  assert.match(home, /<h1\b[^>]*>Anantha Reddy<\/h1>/);
  assert.match(home, /Building intelligent systems that turn data into practical decisions\./);
  assert.match(home, /Intelligence Flow/);
  assert.match(home, /I build machine learning applications, AI-powered knowledge systems/);
  assert.match(home, /class="project-flow"/);
  assert.match(home, /<noscript>/);
  assert.match(home, /data-lab-controls hidden/);
  assert.match(home, /class="filter-list"[^>]*hidden/);
  assert.doesNotMatch(home, /<form\b/);
});

test('the olive identity is reflected in shared styles and portfolio artwork', () => {
  const styles = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
  const socialCard = readFileSync(new URL('../public/social-card.svg', import.meta.url), 'utf8');

  for (const token of ['#FAFAF6', '#F0F1E8', '#20251B', '#495638', '#303C25', '#DEE3D2', '#D8DDCF']) {
    assert.ok(styles.includes(token), `Expected the shared stylesheet to use ${token}`);
    assert.ok(favicon.includes(token) || socialCard.includes(token), `Expected portfolio artwork to use ${token}`);
  }
  assert.match(styles, /color-scheme:\s*light/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(styles, /#(?:0b0d10|14181e|8de8c1|b5f4d5)/i);
  assert.doesNotMatch(styles, /box-shadow:\s*[^;]*(?:\d{2,}px|#|rgb)/i);
});

test('the static output has no placeholder links or simulated production claims', () => {
  for (const file of htmlFiles(distPath)) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /href="#"/);
    assert.doesNotMatch(html, /(?:example\.com|TODO|lorem ipsum)/i);
    assert.doesNotMatch(html, /(?:client|patient|tenant)[-_ ](?:id|identifier|name)/i);
  }
});
