#!/usr/bin/env node
// Lumina Gates — static site build
//
//   npm run build      → ./build  (what Vercel deploys)
//
// Renders every page for every locale from src/templates, copies static assets with
// content-hashed names for CSS/JS, and writes sitemap.xml / robots.txt / site.webmanifest.

'use strict';
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ROOT   = path.resolve(__dirname, '..');
const OUT    = path.join(ROOT, 'build');
const SRC    = path.join(ROOT, 'src');

const config   = require(path.join(SRC, 'site.config.js'));
const catalog  = require(path.join(SRC, 'catalog.js'));
const manifest = require(path.join(SRC, 'images.json'));
const locales  = { en: require(path.join(SRC, 'i18n', 'en.js')), tr: require(path.join(SRC, 'i18n', 'tr.js')) };

const { layout }     = require(path.join(SRC, 'templates', 'layout.js'));
const home           = require(path.join(SRC, 'templates', 'home.js'));
const collection     = require(path.join(SRC, 'templates', 'collection.js'));
const product        = require(path.join(SRC, 'templates', 'product.js'));
const pages          = require(path.join(SRC, 'templates', 'pages.js'));
const { href, abs, e } = require(path.join(SRC, 'templates', 'helpers.js'));

const t0 = Date.now();

// ───── helpers ─────
function rm(p) { fs.rmSync(p, { recursive: true, force: true }); }
function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }
function write(rel, content) { const f = path.join(OUT, rel); mkdir(path.dirname(f)); fs.writeFileSync(f, content); }
function copyDir(from, to) {
  for (const ent of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, ent.name), d = path.join(to, ent.name);
    if (ent.isDirectory()) { mkdir(d); copyDir(s, d); } else fs.copyFileSync(s, d);
  }
}
function hash(content) { return crypto.createHash('sha256').update(content).digest('hex').slice(0, 10); }
function hashedAsset(srcFile, outDir, ext) {
  const content = fs.readFileSync(srcFile);
  const base = path.basename(srcFile, ext);
  const name = `${base}.${hash(content)}${ext}`;
  write(path.join(outDir, name), content);
  return `/${outDir}/${name}`;
}

/** Warn about keys that exist in EN but not in another locale (falls back to EN at render time). */
function checkLocale(ref, obj, pathStr, code) {
  for (const k of Object.keys(ref)) {
    if (!(k in obj)) { console.warn(`  ! ${code}: missing key ${pathStr}${k} (using EN)`); obj[k] = ref[k]; continue; }
    if (ref[k] && typeof ref[k] === 'object' && !Array.isArray(ref[k])) checkLocale(ref[k], obj[k], `${pathStr}${k}.`, code);
  }
}

// ───── 1. clean + static files ─────
rm(OUT); mkdir(OUT);
copyDir(path.join(SRC, 'public'), OUT);

// ───── 2. CSS (append colour swatches generated from the catalog) + JS, content-hashed ─────
const swatchCss = '\n/* generated from src/catalog.js */\n' + catalog.COLORS
  .filter(c => c.hex !== 'custom')
  .map(c => `.swatch-${c.id}{background:${c.hex};box-shadow:inset 0 0 0 1px ${c.ring}}`).join('\n') + '\n';
const minifyCss = css => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};:,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const cssSrc = minifyCss(fs.readFileSync(path.join(SRC, 'css', 'style.css'), 'utf8') + swatchCss);
const cssName = `style.${hash(cssSrc)}.css`;
write(path.join('css', cssName), cssSrc);

const assets = {
  css: `/css/${cssName}`,
  catalog:      hashedAsset(path.join(SRC, 'catalog.js'), 'js', '.js'),
  site:         hashedAsset(path.join(SRC, 'js', 'site.js'), 'js', '.js'),
  configurator: hashedAsset(path.join(SRC, 'js', 'configurator.js'), 'js', '.js'),
  thankyou:     hashedAsset(path.join(SRC, 'js', 'thankyou.js'), 'js', '.js')
};

// ───── 3. page inventory (locale-independent paths) ─────
const policyPages = [
  ['shipping', '/shipping-policy', t => t.footer.shipping],
  ['refund',   '/returns-and-warranty', t => t.footer.returns],
  ['terms',    '/terms', t => t.footer.terms],
  ['privacy',  '/privacy', t => t.footer.privacy]
];
const allPaths = [
  '/', ...catalog.COLLECTIONS.map(c => '/' + c.slug), ...catalog.PRODUCTS.map(p => `/gates/${p.id}`),
  '/our-story', '/how-to-measure', '/faq', '/contact', ...policyPages.map(p => p[1]), '/order/thank-you'
];
const alternates = {};
for (const p of allPaths) alternates[p] = Object.fromEntries(config.locales.all.map(l => [l, href(l, p)]));

// ───── 4. render ─────
const sitemap = [];   // { path, locale, images }
let pageCount = 0;

for (const L of config.locales.all) {
  const t = locales[L];
  if (L !== 'en') checkLocale(locales.en, t, '', L);
  const ctx = { locale: L, t, config, catalog, manifest, assets, alternates };

  const renders = [
    home(ctx),
    ...catalog.COLLECTIONS.map(c => collection(ctx, c.id)),
    ...catalog.PRODUCTS.map(p => product(ctx, p)),
    pages.story(ctx), pages.measure(ctx), pages.faq(ctx), pages.contact(ctx),
    ...policyPages.map(([key, p, label]) => pages.policy(ctx, key, p, label(t))),
    pages.thankYou(ctx)
  ];

  for (const page of renders) {
    const html = layout(ctx, page);
    const rel = page.path === '/' ? '' : page.path.replace(/^\//, '');
    const prefix = (config.locales.prefix[L] || '').replace(/^\//, '');
    write(path.join(prefix, rel, 'index.html'), html);
    pageCount++;
    if (!/noindex/.test(page.robots || '')) sitemap.push({ path: page.path, locale: L, images: page.images || [] });
  }

  // 404 (served by Vercel for any unknown path; English only at the root)
  if (L === 'en') write('404.html', layout(ctx, pages.notFound(ctx)));
}

// ───── 5. sitemap.xml, robots.txt, manifest ─────
const lastmod = new Date().toISOString().slice(0, 10);
const urlXml = sitemap.map(u => {
  const alts = config.locales.all.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(href(l, u.path))}"/>`).join('\n');
  const xdef = `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(href('en', u.path))}"/>`;
  const imgs = u.images.map(im => `    <image:image><image:loc>${e(im.loc)}</image:loc><image:title>${e(im.title)}</image:title></image:image>`).join('\n');
  const prio = u.path === '/' ? '1.0' : u.path.startsWith('/gates/') ? '0.8' : u.path === '/gates' ? '0.9' : '0.5';
  return `  <url>\n    <loc>${abs(href(u.locale, u.path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${prio}</priority>\n${alts}\n${xdef}${imgs ? '\n' + imgs : ''}\n  </url>`;
}).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlXml}\n</urlset>\n`);

write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /order/\n\nSitemap: ${abs('/sitemap.xml')}\n`);

write('site.webmanifest', JSON.stringify({
  name: config.brand, short_name: 'Lumina', description: config.tagline,
  start_url: '/', display: 'browser', background_color: '#F6F2EA', theme_color: '#F6F2EA',
  icons: [
    { src: '/img/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/img/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
  ]
}, null, 2));

console.log(`✓ built ${pageCount} pages + 404 for ${config.locales.all.join('/')} → build/ in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
