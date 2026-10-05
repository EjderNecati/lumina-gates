#!/usr/bin/env node
// Lumina Gates — image pipeline
//
//   node scripts/images.js            (re)generate everything that is missing/outdated
//   node scripts/images.js --force    regenerate everything
//
// Reads the source photos referenced in src/catalog.js (assets/products/<folder>/<file>)
// and writes responsive WebP renditions + Open Graph JPGs into src/public/img, plus a
// manifest (src/images.json) the build uses for <img width/height/srcset>.
//
// Output layout
//   src/public/img/products/<id>/<id>-<n>-<w>.webp     w ∈ WIDTHS
//   src/public/img/og/<id>.jpg                         1200×630, first photo on brand bg
//   src/public/img/og/default.jpg                      site-wide OG image
//   src/public/img/icons/…                             favicons from src/brand/icon.svg

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');
const catalog = require('../src/catalog.js');

const ROOT     = path.resolve(__dirname, '..');
const SRC_DIR  = path.join(ROOT, 'assets', 'products');
const OUT_DIR  = path.join(ROOT, 'src', 'public', 'img');
const MANIFEST = path.join(ROOT, 'src', 'images.json');
const FORCE    = process.argv.includes('--force');

const WIDTHS   = [400, 600, 800, 1200];
const QUALITY  = 80;
const BG       = { r: 246, g: 242, b: 234, alpha: 1 }; // --bg #F6F2EA
const OG_W = 1200, OG_H = 630;

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function isFresh(out, src) {
  if (FORCE) return false;
  try { return fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs; } catch { return false; }
}

async function renditions(srcFile, id, n) {
  const dir = path.join(OUT_DIR, 'products', id);
  ensureDir(dir);
  const meta = await sharp(srcFile).metadata();
  const srcW = meta.width, srcH = meta.height;
  const out = { n, width: srcW, height: srcH, sizes: [] };

  for (const w of WIDTHS) {
    const target = Math.min(w, srcW);                 // never upscale
    const file   = path.join(dir, `${id}-${n}-${w}.webp`);
    const h      = Math.round(srcH * (target / srcW));
    out.sizes.push({ w, file: `/img/products/${id}/${id}-${n}-${w}.webp`, width: target, height: h });
    if (isFresh(file, srcFile)) continue;
    await sharp(srcFile)
      .flatten({ background: BG })                     // RGBA → opaque on brand background
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(file);
  }
  return out;
}

async function ogImage(srcFile, outFile) {
  if (isFresh(outFile, srcFile)) return;
  ensureDir(path.dirname(outFile));
  // Cover-crop to 1.91:1, letting sharp's attention strategy keep the subject in frame
  await sharp(srcFile)
    .flatten({ background: BG })
    .resize({ width: OG_W, height: OG_H, fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outFile);
}

async function icons() {
  const svg = path.join(ROOT, 'src', 'brand', 'icon.svg');
  if (!fs.existsSync(svg)) return;
  const dir = path.join(OUT_DIR, 'icons');
  ensureDir(dir);
  const targets = [
    ['favicon-32.png', 32], ['favicon-16.png', 16],
    ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]
  ];
  for (const [name, size] of targets) {
    const out = path.join(dir, name);
    if (isFresh(out, svg)) continue;
    await sharp(svg, { density: 384 }).resize(size, size).png().toFile(out);
  }
  // ICO for legacy UAs: a 32px PNG inside an .ico container is accepted by every browser that still asks for it
  const ico = path.join(ROOT, 'src', 'public', 'favicon.ico');
  if (!isFresh(ico, svg)) {
    const png = await sharp(svg, { density: 384 }).resize(32, 32).png().toBuffer();
    fs.writeFileSync(ico, pngToIco(png, 32));
  }
}

// Minimal ICO writer (single PNG entry — supported by all modern browsers and Windows ≥ Vista)
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); entry.writeUInt8(size, 1); entry.writeUInt8(0, 2); entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8); entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

(async () => {
  const t0 = Date.now();
  const manifest = { generated: new Date().toISOString(), widths: WIDTHS, products: {} };
  let count = 0;

  for (const p of catalog.PRODUCTS) {
    const list = [];
    for (let i = 0; i < p.images.length; i++) {
      const srcFile = path.join(SRC_DIR, p.folder, p.images[i]);
      if (!fs.existsSync(srcFile)) { console.warn(`! missing ${p.id}: ${srcFile}`); continue; }
      list.push(await renditions(srcFile, p.id, i + 1));
      count++;
    }
    manifest.products[p.id] = list;
    await ogImage(path.join(SRC_DIR, p.folder, p.images[0]), path.join(OUT_DIR, 'og', `${p.id}.jpg`));
    process.stdout.write(`  ${p.id.padEnd(16)} ${list.length} photos\n`);
  }

  // Site-wide OG image = flagship (Lux) photo
  const flagship = catalog.getProduct('lux') || catalog.PRODUCTS[0];
  await ogImage(path.join(SRC_DIR, flagship.folder, flagship.images[0]), path.join(OUT_DIR, 'og', 'default.jpg'));

  await icons();

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ ${count} source photos → ${count * WIDTHS.length} WebP + ${catalog.PRODUCTS.length + 1} OG in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`  manifest: ${path.relative(ROOT, MANIFEST)}`);
})().catch(err => { console.error(err); process.exit(1); });
