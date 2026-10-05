#!/usr/bin/env node
// Post-build QA: links, images, metadata, structured data, CSP hygiene.
//   npm run check     (exit code 1 on any failure)
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'build');
const API_ROUTES = new Set(['/api/create-checkout', '/api/webhook', '/api/order', '/api/contact']);
const problems = [];
let pages = 0, links = 0, imgs = 0;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out); else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}
function exists(urlPath) {
  const clean = urlPath.split('?')[0].split('#')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(OUT, 'index.html'));
  if (API_ROUTES.has(clean)) return true;
  const rel = decodeURIComponent(clean).replace(/^\//, '');
  return fs.existsSync(path.join(OUT, rel)) || fs.existsSync(path.join(OUT, rel, 'index.html')) || fs.existsSync(path.join(OUT, rel + '.html'));
}
function attr(tag, name) { const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, 'i')); return m ? (m[2] ?? m[3]) : null; }

for (const file of walk(OUT)) {
  pages++;
  const rel = '/' + path.relative(OUT, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const fail = msg => problems.push(`${rel}: ${msg}`);

  // ── metadata ──
  const decode = s => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1]);
  if (!title) fail('missing <title>'); else if (title.length > 70) fail(`title too long (${title.length}): ${title}`);
  const desc = decode(attr((html.match(/<meta name="description"[^>]*>/) || [''])[0], 'content'));
  if (!desc) fail('missing meta description'); else if (desc.length > 165) fail(`description too long (${desc.length})`);
  if (!/<link rel="canonical" href="https:\/\/www\.luminagates\.com[^"]*">/.test(html)) fail('missing canonical');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`expected 1 <h1>, found ${h1s}`);
  if (!/<html lang="(en|tr)"/.test(html)) fail('missing html lang');
  if (!/<meta property="og:image" content="https:\/\/[^"]+"/.test(html)) fail('missing og:image');
  const noindex = /name="robots" content="noindex/.test(html);
  if (!noindex && !/hreflang="x-default"/.test(html)) fail('missing hreflang x-default');

  // ── structured data ──
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); if (!j['@context']) fail('JSON-LD without @context'); } catch (e) { fail('JSON-LD does not parse: ' + e.message); }
  }

  // ── CSP hygiene: no inline styles / inline executable scripts ──
  if (/\sstyle="/.test(html)) fail('inline style attribute found (blocked by CSP)');
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    const a = m[1];
    if (!/\ssrc=/.test(a) && !/type="application\/(ld\+json|json)"/.test(a)) fail('inline executable <script> found (blocked by CSP)');
  }

  // ── links & assets ──
  for (const m of html.matchAll(/<(a|link|script|img|source)\b[^>]*>/g)) {
    const tag = m[0];
    const url = attr(tag, 'href') || attr(tag, 'src');
    if (url && url.startsWith('/') && !url.startsWith('//')) { links++; if (!exists(url)) fail(`broken link: ${url}`); }
    for (const key of ['srcset', 'imagesrcset', 'data-srcset']) {
      const ss = attr(tag, key);
      if (ss) for (const part of ss.split(',')) { const u = part.trim().split(/\s+/)[0]; if (u && !exists(u)) fail(`broken ${key} entry: ${u}`); }
    }
    const ds = attr(tag, 'data-src'); if (ds && !exists(ds)) fail(`broken data-src: ${ds}`);
    if (tag.startsWith('<img')) {
      imgs++;
      if (attr(tag, 'alt') === null) fail('img without alt: ' + tag.slice(0, 80));
      if (!attr(tag, 'width') || !attr(tag, 'height')) fail('img without width/height: ' + tag.slice(0, 80));
      if (!/loading="(lazy|eager)"/.test(tag)) fail('img without loading attribute');
    }
  }
}

// ── sitemap ──
const sm = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const loc of locs) {
  const p = loc.replace('https://www.luminagates.com', '');
  if (!exists(p || '/')) problems.push(`sitemap: ${loc} does not exist`);
  if (/\/order\//.test(p)) problems.push(`sitemap: noindex page listed ${loc}`);
}
if (!fs.existsSync(path.join(OUT, 'robots.txt'))) problems.push('robots.txt missing');
if (!fs.existsSync(path.join(OUT, '404.html'))) problems.push('404.html missing');

console.log(`checked ${pages} pages, ${links} internal links, ${imgs} images, ${locs.length} sitemap URLs`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems.slice(0, 80)) console.error('  - ' + p);
  if (problems.length > 80) console.error(`  … and ${problems.length - 80} more`);
  process.exit(1);
}
console.log('✓ all checks passed');
