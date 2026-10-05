// Reusable fragments: responsive images, product cards, breadcrumbs, filter chips.
'use strict';

const { e, tf, cx, href, money, abs } = require('./helpers.js');

/**
 * Responsive <img> for a product photo.
 * @param ctx   build context (manifest, catalog, locale, t)
 * @param p     product
 * @param n     1-based photo index
 * @param opts  { sizes, loading, fetchpriority, className, alt, decoding, deferred }
 */
function productImg(ctx, p, n, opts = {}) {
  const photos = ctx.manifest.products[p.id] || [];
  const photo = photos[Math.min(n, photos.length) - 1];
  if (!photo) return '';
  // De-duplicate renditions that were capped at the source width
  const seen = new Set();
  const sizes = photo.sizes.filter(s => { if (seen.has(s.width)) return false; seen.add(s.width); return true; });
  const mid = sizes.find(s => s.w === 800) || sizes[sizes.length - 1];
  const srcset = sizes.map(s => `${s.file} ${s.width}w`).join(', ');
  const alt = opts.alt ?? tf(ctx.t.product.imageAlt, { name: p.name, material: ctx.t.product.materialNoun[p.material], n });
  const attrs = [
    opts.deferred ? `data-src="${e(mid.file)}" data-srcset="${e(srcset)}"` : `src="${e(mid.file)}" srcset="${e(srcset)}"`,
    `sizes="${e(opts.sizes || '(max-width: 640px) 100vw, 400px')}"`,
    `width="${mid.width}" height="${mid.height}"`,
    `alt="${e(alt)}"`,
    `loading="${opts.loading || 'lazy'}"`,
    `decoding="${opts.decoding || 'async'}"`,
    opts.fetchpriority ? `fetchpriority="${opts.fetchpriority}"` : '',
    opts.className ? `class="${e(opts.className)}"` : '',
    opts.extra || ''
  ].filter(Boolean).join(' ');
  return `<img ${attrs}>`;
}

/** Absolute URLs of all renditions at the largest width — for schema.org / sitemap. */
function productImageUrls(ctx, p) {
  return (ctx.manifest.products[p.id] || []).map(ph => abs(ph.sizes[ph.sizes.length - 1].file));
}

/** "From" price for a product (lowest standard tier used by the storefront). */
function fromPrice(ctx, p) {
  return ctx.catalog.computePrice(p.material, ctx.config.commerce.fromWidthIn, ctx.catalog.DEFAULT_HEIGHT_INCH);
}

function productCard(ctx, p, opts = {}) {
  const t = ctx.t;
  const url = href(ctx.locale, `/gates/${p.id}`);
  const price = fromPrice(ctx, p);
  const tagline = ctx.locale === 'tr' && p.tagline_tr ? p.tagline_tr : p.tagline;
  const audience = p.audience === 'cat' ? t.card.cat : t.card.both;
  const material = p.material === 'plexi' ? t.card.plexi : t.card.wood;
  const badge = p.material === 'plexi' ? t.filters.plexi : t.filters.wood;
  const hasSecond = (ctx.manifest.products[p.id] || []).length > 1;

  return `
<article class="card" data-material="${p.material}" data-audience="${p.audience}">
  <a class="card-link" href="${url}">
    <div class="card-media">
      <span class="card-badge">${e(badge)}</span>
      ${ctx.config.commerce.showCompareAt ? `<span class="card-sale sale-pill">${e(t.card.sale)}</span>` : ''}
      ${productImg(ctx, p, 1, { className: 'card-img card-img-a', sizes: opts.sizes || '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 320px', loading: opts.eager ? 'eager' : 'lazy' })}
      ${hasSecond ? productImg(ctx, p, 2, { className: 'card-img card-img-b', sizes: opts.sizes || '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 320px', deferred: true, alt: '', extra: 'aria-hidden="true"' }) : ''}
    </div>
    <div class="card-body">
      <p class="card-meta"><span class="eyebrow">${e(audience)}</span><span class="dot" aria-hidden="true"></span><span class="eyebrow">${e(material)}</span></p>
      <${opts.heading || 'h3'} class="card-title">${e(p.name)}</${opts.heading || 'h3'}>
      <p class="card-tagline">${e(tagline)}</p>
      <p class="card-price">
        <span class="from">${e(t.card.from)}</span>
        ${ctx.config.commerce.showCompareAt ? `<s class="was">${money(price.original, ctx.locale)}</s>` : ''}
        <span class="now">${money(price.final, ctx.locale)}</span>
      </p>
    </div>
  </a>
</article>`;
}

function productGrid(ctx, products, opts = {}) {
  return `<div class="grid" ${opts.id ? `id="${opts.id}"` : ''} data-product-grid>
${products.map((p, i) => productCard(ctx, p, { eager: opts.eagerFirst && i < 2, heading: opts.heading })).join('\n')}
</div>`;
}

/** Filter chips as real links; data-filter lets JS filter in place where a grid is present. */
function filterChips(ctx, active) {
  const t = ctx.t;
  const items = [
    ['all',   t.filters.all,   '/gates'],
    ['plexi', t.filters.plexi, '/gates/plexiglass'],
    ['wood',  t.filters.wood,  '/gates/wood'],
    ['cat',   t.filters.cat,   '/gates/cat-edition']
  ];
  return `<nav class="filters" aria-label="${e(t.shop.filterLabel)}">
${items.map(([id, label, path]) => `  <a class="${cx('chip', id === active && 'active')}" href="${href(ctx.locale, path)}" data-filter="${id}"${id === active ? ' aria-current="page"' : ''}>${e(label)}</a>`).join('\n')}
</nav>`;
}

function breadcrumbs(ctx, items) {
  // items: [{ label, path }] — last item is current page
  const lis = items.map((it, i) => {
    const last = i === items.length - 1;
    return last
      ? `<li aria-current="page">${e(it.label)}</li>`
      : `<li><a href="${href(ctx.locale, it.path)}">${e(it.label)}</a></li>`;
  });
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${lis.join('<li class="sep" aria-hidden="true">·</li>')}</ol></nav>`;
}

function breadcrumbLd(ctx, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.label,
      ...(i < items.length - 1 ? { item: abs(href(ctx.locale, it.path)) } : {})
    }))
  };
}

function sectionHead(eyebrow, title, extra = '') {
  return `<div class="block-head"><div>${eyebrow ? `<span class="eyebrow">${e(eyebrow)}</span>` : ''}<h2>${title}</h2></div>${extra}</div>`;
}

module.exports = { productImg, productImageUrls, fromPrice, productCard, productGrid, filterChips, breadcrumbs, breadcrumbLd, sectionHead };
