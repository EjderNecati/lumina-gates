'use strict';
const { e, tf, href, abs, numberWords, capitalize } = require('./helpers.js');
const { productImg, productGrid, filterChips, sectionHead } = require('./components.js');

module.exports = function home(ctx) {
  const t = ctx.t;
  const L = ctx.locale;
  const c = ctx.config;
  const products = ctx.catalog.PRODUCTS;
  const counts = {
    total: products.length,
    plexi: products.filter(p => p.material === 'plexi').length,
    wood:  products.filter(p => p.material === 'wood').length
  };
  const flagship = ctx.catalog.getProduct('lux') || products[0];
  const heroPhoto = ctx.manifest.products[flagship.id][0];
  const lead = { leadMin: c.commerce.leadTimeBusinessDays.min, leadMax: c.commerce.leadTimeBusinessDays.max };

  const body = `
<section class="hero">
  <div class="hero-text">
    <span class="eyebrow">${e(t.hero.eyebrow)}</span>
    <h1>${e(t.hero.titleA)} <em>${e(t.hero.titleB)}</em></h1>
    <p class="lead">${e(t.hero.lead)}</p>
    <div class="hero-actions">
      <a href="${href(L, '/gates')}" class="btn btn-primary">${e(t.hero.ctaShop)} <span aria-hidden="true">→</span></a>
      <a href="${href(L, '/our-story')}" class="btn btn-ghost">${e(t.hero.ctaStory)}</a>
    </div>
  </div>
  <a class="hero-visual" href="${href(L, '/gates/' + flagship.id)}" aria-label="${e(flagship.name)}">
    ${productImg(ctx, flagship, 1, { loading: 'eager', fetchpriority: 'high', decoding: 'sync', sizes: '(max-width: 920px) 100vw, 45vw', alt: t.hero.imageAlt })}
  </a>
</section>

<section class="values" aria-label="${e(t.values.map(v => v.title).join(', '))}">
  <div class="values-inner">
${t.values.map(v => `    <div>
      <span class="eyebrow">${e(v.eyebrow)}</span>
      <h2 class="v-title">${e(v.title)}</h2>
      <p class="v-body">${e(v.body)}</p>
    </div>`).join('\n')}
  </div>
</section>

<section class="block" id="shop">
  ${sectionHead(t.shop.eyebrow, tf(t.shop.title, { total: capitalize(numberWords(counts.total, L)), plexi: numberWords(counts.plexi, L), wood: numberWords(counts.wood, L) }), filterChips(ctx, 'all'))}
  ${productGrid(ctx, products, { id: 'productGrid', eagerFirst: false })}
</section>

<section class="block how" id="how-it-works">
  ${sectionHead(t.howItWorks.eyebrow, e(t.howItWorks.title))}
  <ol class="steps">
${t.howItWorks.steps.map((s, i) => `    <li class="step">
      <span class="step-n" aria-hidden="true">0${i + 1}</span>
      <h3>${e(s.h)}</h3>
      <p>${tf(s.p, lead)}${s.link ? ` <a href="${href(L, '/how-to-measure')}">${e(s.link)} →</a>` : ''}</p>
    </li>`).join('\n')}
  </ol>
</section>

<section class="block story-teaser" id="story">
  <div class="story-inner">
    <span class="eyebrow">${e(t.story.eyebrow)}</span>
    <h2>${e(t.story.titleA)}<br><em>${e(t.story.titleB)}</em></h2>
    <p>${e(t.story.body)}</p>
    <a href="${href(L, '/our-story')}" class="btn btn-ghost">${e(t.story.readMore)}</a>
  </div>
</section>`;

  const mid = heroPhoto.sizes.find(s => s.w === 800) || heroPhoto.sizes[heroPhoto.sizes.length - 1];
  return {
    path: '/',
    title: t.meta.home.title,
    description: t.meta.home.description,
    ogType: 'website',
    ogImage: abs('/img/og/default.jpg'),
    ogImageAlt: t.hero.imageAlt,
    jsonLd: [{
      '@type': 'WebPage',
      '@id': abs(href(L, '/')) + '#webpage',
      url: abs(href(L, '/')),
      name: t.meta.home.title,
      description: t.meta.home.description,
      isPartOf: { '@id': abs('/') + '#website' },
      about: { '@id': abs('/') + '#organization' },
      inLanguage: c.locales.tags[L],
      primaryImageOfPage: { '@type': 'ImageObject', url: abs('/img/og/default.jpg') }
    }],
    preloadImage: {
      src: mid.file,
      srcset: heroPhoto.sizes.map(s => `${s.file} ${s.width}w`).join(', '),
      sizes: '(max-width: 920px) 100vw, 45vw'
    },
    bodyClass: 'page-home',
    scripts: ['site'],
    body
  };
};
