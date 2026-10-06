#!/usr/bin/env node
// Turn build/ into a relative-URL copy that can be hosted as a static preview (no server, no backend).
//   node scripts/preview-artifact.js   → preview/  +  preview/_files.json (list of files to upload)
//
// - every root-relative URL becomes relative to the page (../../css/… from gates/lux/index.html)
// - page links get an explicit index.html (static hosts without directory indexes)
// - only the 400/800 image renditions are kept to stay under file-count limits; srcset is trimmed to match
// - the root page is stripped to body content (preview hosts wrap it in their own document skeleton)
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const OUT = path.join(ROOT, 'preview');
const KEEP_WIDTHS = new Set(['400', '800']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }
function write(rel, content) { const f = path.join(OUT, rel); mkdir(path.dirname(f)); fs.writeFileSync(f, content); }

function keepImage(rel) {
  if (!rel.startsWith('img/')) return true;
  if (rel.startsWith('img/og/')) return false;
  const m = rel.match(/-(\d+)\.webp$/);
  return !m || KEEP_WIDTHS.has(m[1]);
}

function rewriteUrl(url, prefix) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  if (url.startsWith('/api/')) return url;                       // no backend in a static preview
  const [p, hash] = url.split('#');
  const isPage = !/\.[a-z0-9]+$/i.test(p);
  let out;
  if (p === '/') out = prefix + 'index.html';
  else if (isPage) out = prefix + p.slice(1) + '/index.html';
  else out = prefix + p.slice(1);
  return hash ? `${out}#${hash}` : out;
}

function rewriteSrcset(list, prefix) {
  return list.split(',').map(s => s.trim()).filter(Boolean)
    .filter(c => keepImage(c.split(/\s+/)[0].replace(/^\//, '')))
    .map(c => { const [u, d] = c.split(/\s+/); return `${rewriteUrl(u, prefix)}${d ? ' ' + d : ''}`; })
    .join(', ');
}

function rewriteHtml(html, depth) {
  const prefix = '../'.repeat(depth);
  html = html.replace(/\s(href|src|data-src|action)="(\/[^"]*)"/g, (m, a, u) => ` ${a}="${rewriteUrl(u, prefix)}"`);
  html = html.replace(/\s(srcset|data-srcset|imagesrcset)="([^"]*)"/g, (m, a, l) => ` ${a}="${rewriteSrcset(l, prefix)}"`);
  html = html.replace(/<link rel="sitemap"[^>]*>\n?/, '');
  html = html.replace(/<link rel="manifest"[^>]*>\n?/, '');
  // Prefer the kept 800 rendition as src if the original pointed at a dropped size
  html = html.replace(/\s(src|data-src)="([^"]*-(600|1200)\.webp)"/g, (m, a, u) => ` ${a}="${u.replace(/-(600|1200)\.webp$/, '-800.webp')}"`);
  return html;
}

fs.rmSync(OUT, { recursive: true, force: true });
const files = [];
for (const abs of walk(BUILD)) {
  const rel = path.relative(BUILD, abs).replace(/\\/g, '/');
  if (rel === 'sitemap.xml' || rel === 'robots.txt' || rel === '404.html' || rel === 'site.webmanifest') continue;
  if (!keepImage(rel)) continue;

  if (rel.endsWith('.html')) {
    const depth = rel.split('/').length - 1;
    let html = rewriteHtml(fs.readFileSync(abs, 'utf8'), depth);
    if (rel === 'index.html') {
      // Root page: body content + the head bits that matter (title, stylesheet); host supplies the skeleton
      const title = (html.match(/<title>[^<]*<\/title>/) || [''])[0];
      const links = (html.match(/<link rel="(stylesheet|icon|apple-touch-icon|preload)"[^>]*>/g) || []).join('\n');
      const ld = (html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/) || [''])[0];
      const body = html.replace(/[\s\S]*<body[^>]*>/, '').replace(/<\/body>\s*<\/html>\s*$/, '');
      html = `${title}\n${links}\n<style>.site-header{top:env(safe-area-inset-top,0px)}</style>\n${ld}\n${body}`;
    }
    write(rel, html);
  } else if (rel.startsWith('css/')) {
    write(rel, fs.readFileSync(abs, 'utf8').replace(/url\(\/fonts\//g, 'url(../fonts/'));
  } else {
    write(rel, fs.readFileSync(abs));
  }
  files.push(rel);
}
fs.writeFileSync(path.join(OUT, '_files.json'), JSON.stringify(files, null, 1));
const bytes = files.reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`preview/: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB`);
