'use strict';
const { e, tf, href, abs } = require('./helpers.js');
const { productGrid, filterChips, breadcrumbs, breadcrumbLd } = require('./components.js');

/** One collection page: id ∈ all | plexi | wood | cat */
module.exports = function collection(ctx, id) {
  const t = ctx.t;
  const L = ctx.locale;
  const col = ctx.catalog.COLLECTIONS.find(c => c.id === id);
  const products = col.filter ? ctx.catalog.PRODUCTS.filter(col.filter) : ctx.catalog.PRODUCTS;
  const copy = t.collections[id];
  const path = '/' + col.slug;
  const vars = { total: ctx.catalog.PRODUCTS.length, count: products.length };

  const crumbs = id === 'all'
    ? [{ label: t.collections.breadcrumbHome, path: '/' }, { label: copy.h1, path }]
    : [{ label: t.collections.breadcrumbHome, path: '/' }, { label: t.collections.breadcrumbAll, path: '/gates' }, { label: copy.h1, path }];

  const body = `
<section class="block collection">
  ${breadcrumbs(ctx, crumbs)}
  <div class="block-head">
    <div>
      <span class="eyebrow">${tf(t.collections.countLabel, vars)}</span>
      <h1>${e(copy.h1)}</h1>
      <p class="intro">${e(copy.intro)}</p>
    </div>
    ${filterChips(ctx, id)}
  </div>
  ${productGrid(ctx, products, { id: 'productGrid', eagerFirst: true, heading: 'h2' })}
</section>`;

  const firstPhoto = ctx.manifest.products[products[0].id][0];
  const mid = firstPhoto.sizes.find(s => s.w === 800) || firstPhoto.sizes[firstPhoto.sizes.length - 1];

  return {
    path,
    title: copy.title,
    description: tf(copy.description, vars),
    ogImage: abs(`/img/og/${products[0].id}.jpg`),
    ogImageAlt: copy.h1,
    jsonLd: [
      {
        '@type': 'CollectionPage',
        '@id': abs(href(L, path)) + '#webpage',
        url: abs(href(L, path)),
        name: copy.h1,
        description: tf(copy.description, vars),
        isPartOf: { '@id': abs('/') + '#website' },
        inLanguage: ctx.config.locales.tags[L],
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            '@type': 'ListItem', position: i + 1, name: p.name, url: abs(href(L, `/gates/${p.id}`))
          }))
        }
      },
      breadcrumbLd(ctx, crumbs)
    ],
    preloadImage: {
      src: mid.file,
      srcset: firstPhoto.sizes.map(s => `${s.file} ${s.width}w`).join(', '),
      sizes: '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 320px'
    },
    bodyClass: 'page-collection',
    scripts: ['site'],
    body
  };
};
