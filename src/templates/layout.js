// Document shell: <head> with all SEO/social tags, header, footer, scripts.
'use strict';

const { e, tf, abs, href, jsonLd, jsonData } = require('./helpers.js');

function organizationLd(ctx) {
  const c = ctx.config;
  const addr = c.company.address || {};
  const hasAddr = addr.street || addr.city;
  const sameAs = Object.values(c.social || {}).filter(Boolean);
  return {
    '@type': 'Organization',
    '@id': abs('/') + '#organization',
    name: c.brand,
    legalName: c.company.legalName,
    url: abs('/'),
    logo: { '@type': 'ImageObject', url: abs('/img/icons/icon-512.png'), width: 512, height: 512 },
    email: c.contact.email,
    ...(c.company.foundingYear ? { foundingDate: String(c.company.foundingYear) } : {}),
    ...(hasAddr ? {
      address: {
        '@type': 'PostalAddress',
        ...(addr.street ? { streetAddress: addr.street } : {}),
        ...(addr.city ? { addressLocality: addr.city } : {}),
        ...(addr.region ? { addressRegion: addr.region } : {}),
        ...(addr.postalCode ? { postalCode: addr.postalCode } : {}),
        addressCountry: addr.country || 'US'
      }
    } : {}),
    ...(sameAs.length ? { sameAs } : {})
  };
}

function websiteLd(ctx) {
  return {
    '@type': 'WebSite',
    '@id': abs('/') + '#website',
    url: abs('/'),
    name: ctx.config.brand,
    publisher: { '@id': abs('/') + '#organization' },
    inLanguage: ctx.config.locales.all
  };
}

function header(ctx, page) {
  const t = ctx.t;
  const L = ctx.locale;
  const alt = ctx.alternates[page.path] || {};
  const otherLocale = L === 'en' ? 'tr' : 'en';
  const switchHref = alt[otherLocale] || href(otherLocale, '/');
  const nav = (path, label) => `<a class="nav-link" href="${href(L, path)}"${page.path === path ? ' aria-current="page"' : ''}>${e(label)}</a>`;
  return `
<a class="skip-link" href="#main">${e(t.nav.skip)}</a>
<div class="announcement">${e(t.announcement)}</div>
<header class="site-header">
  <nav class="nav" aria-label="Main">
    <div class="nav-left">
      ${nav('/gates', t.nav.shop)}
      ${nav('/our-story', t.nav.story)}
      ${nav('/faq', t.nav.faq)}
    </div>
    <a href="${href(L, '/')}" class="brand">
      <span class="brand-mark">LUMINA</span>
      <span class="brand-sub">${e(L === 'tr' ? 'Kapı Atölyesi' : 'Gates Atelier')}</span>
    </a>
    <div class="nav-right">
      ${nav('/how-to-measure', t.nav.measure)}
      ${nav('/contact', t.nav.contact)}
      <a class="lang-toggle" href="${switchHref}" hreflang="${otherLocale}" lang="${otherLocale}" aria-label="${e(t.switchAria)}">${e(t.switchLabel)}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="menu-btn-label">${e(t.nav.menu)}</span>
        <span class="menu-btn-icon" aria-hidden="true"></span>
      </button>
    </div>
  </nav>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <a href="${href(L, '/gates')}">${e(t.nav.shop)}</a>
    <a href="${href(L, '/gates/plexiglass')}">${e(t.filters.plexi)}</a>
    <a href="${href(L, '/gates/wood')}">${e(t.filters.wood)}</a>
    <a href="${href(L, '/gates/cat-edition')}">${e(t.filters.cat)}</a>
    <a href="${href(L, '/how-to-measure')}">${e(t.nav.measure)}</a>
    <a href="${href(L, '/our-story')}">${e(t.nav.story)}</a>
    <a href="${href(L, '/faq')}">${e(t.nav.faq)}</a>
    <a href="${href(L, '/contact')}">${e(t.nav.contact)}</a>
    <a href="${switchHref}" hreflang="${otherLocale}" lang="${otherLocale}">${e(t.switchLabel)}</a>
  </div>
</header>`;
}

function footer(ctx) {
  const t = ctx.t;
  const L = ctx.locale;
  const c = ctx.config;
  const a = c.company.address || {};
  const addrLine = [a.street, [a.city, a.region, a.postalCode].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
  const link = (path, label) => `<a href="${href(L, path)}">${e(label)}</a>`;
  return `
<footer class="site-footer" id="contact">
  <div class="col col-brand">
    <span class="brand-mark">LUMINA</span>
    <p class="footer-tagline">${e(t.footer.tagline)}</p>
    <p class="footer-legal">${tf(t.footer.operatedBy, { legalName: c.company.legalName })}${addrLine ? `<br>${e(addrLine)}` : ''}</p>
  </div>
  <div class="col">
    <h2 class="footer-h">${e(t.footer.shop)}</h2>
    ${link('/gates', t.footer.all)}
    ${link('/gates/plexiglass', t.footer.plexi)}
    ${link('/gates/wood', t.footer.wood)}
    ${link('/gates/cat-edition', t.footer.cat)}
  </div>
  <div class="col">
    <h2 class="footer-h">${e(t.footer.help)}</h2>
    ${link('/how-to-measure', t.footer.measure)}
    ${link('/faq', t.footer.faq)}
    ${link('/shipping-policy', t.footer.shipping)}
    ${link('/returns-and-warranty', t.footer.returns)}
    ${link('/terms', t.footer.terms)}
    ${link('/privacy', t.footer.privacy)}
  </div>
  <div class="col">
    <h2 class="footer-h">${e(t.footer.atelier)}</h2>
    ${link('/our-story', t.footer.story)}
    ${link('/contact', t.footer.contact)}
    <a href="mailto:${e(c.contact.email)}">${e(c.contact.email)}</a>
    <p>${e(t.footer.workshop)}: ${e(c.company.workshop.city)}, ${e(c.company.workshop.country)}</p>
  </div>
  <div class="footer-bottom">
    <span>${tf(t.footer.copy, { year: new Date().getFullYear() })}</span>
    <span>${e(t.footer.byline)}</span>
  </div>
</footer>`;
}

/**
 * Render a full HTML document.
 * page: { path, title, description, robots?, ogType?, ogImage?, ogImageAlt?, ogExtra?, jsonLd?, body, bodyClass?, scripts?, pageData?, preloadImage? }
 */
function layout(ctx, page) {
  const L = ctx.locale;
  const c = ctx.config;
  const t = ctx.t;
  const canonical = abs(href(L, page.path));
  const alt = ctx.alternates[page.path] || {};
  const ogImage = page.ogImage || abs('/img/og/default.jpg');
  const noindex = /noindex/.test(page.robots || '');

  const hreflangs = noindex ? '' : [
    ...Object.entries(alt).map(([loc, p]) => `<link rel="alternate" hreflang="${loc}" href="${abs(p)}">`),
    alt.en ? `<link rel="alternate" hreflang="x-default" href="${abs(alt.en)}">` : ''
  ].filter(Boolean).join('\n');

  const graph = [organizationLd(ctx), websiteLd(ctx), ...(page.jsonLd || [])];
  const scripts = (page.scripts || ['site']).map(name => `<script src="${ctx.assets[name]}" defer></script>`).join('\n');
  const title = page.title.length > 60 && page.titleShort ? page.titleShort : page.title;

  return `<!DOCTYPE html>
<html lang="${t.code}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(page.description)}">
<link rel="canonical" href="${canonical}">
${hreflangs}
<meta name="robots" content="${e(page.robots || 'index,follow,max-image-preview:large')}">
<meta property="og:type" content="${e(page.ogType || 'website')}">
<meta property="og:site_name" content="${e(c.brand)}">
<meta property="og:locale" content="${c.locales.tags[L].replace('-', '_')}">
${c.locales.all.filter(l => l !== L).map(l => `<meta property="og:locale:alternate" content="${c.locales.tags[l].replace('-', '_')}">`).join('\n')}
<meta property="og:title" content="${e(page.ogTitle || title)}">
<meta property="og:description" content="${e(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${e(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${e(page.ogImageAlt || page.ogTitle || title)}">
${(page.ogExtra || []).map(([p, v]) => `<meta property="${e(p)}" content="${e(v)}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(page.ogTitle || title)}">
<meta name="twitter:description" content="${e(page.description)}">
<meta name="twitter:image" content="${e(ogImage)}">
<meta name="theme-color" content="#F6F2EA">
<meta name="color-scheme" content="light">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preload" href="/fonts/cormorant-garamond-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${page.preloadImage ? `<link rel="preload" as="image" href="${e(page.preloadImage.src)}" imagesrcset="${e(page.preloadImage.srcset)}" imagesizes="${e(page.preloadImage.sizes)}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="${ctx.assets.css}">
${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}
</head>
<body class="${e(page.bodyClass || '')}"${c.analytics.ga4Id ? ` data-ga4="${e(c.analytics.ga4Id)}"` : ''}${c.analytics.adsPurchaseLabel ? ` data-ads-purchase="${e(c.analytics.adsPurchaseLabel)}"` : ''}>
${header(ctx, page)}
<main id="main" tabindex="-1">
${page.body}
</main>
${footer(ctx)}
${page.pageData ? jsonData('page-data', page.pageData) : ''}
${scripts}
</body>
</html>
`;
}

module.exports = { layout, organizationLd, websiteLd };
