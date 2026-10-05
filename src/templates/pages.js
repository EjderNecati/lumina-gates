// Content pages: story, measuring guide, FAQ, contact, policies, thank-you, 404.
'use strict';
const { e, tf, href, abs } = require('./helpers.js');
const { breadcrumbs, breadcrumbLd } = require('./components.js');

function vars(ctx) {
  const c = ctx.config;
  return {
    leadMin: c.commerce.leadTimeBusinessDays.min, leadMax: c.commerce.leadTimeBusinessDays.max,
    transitMin: c.commerce.transitBusinessDays.min, transitMax: c.commerce.transitBusinessDays.max,
    years: c.commerce.warrantyYears, returnDays: c.commerce.returnWindowDays,
    cancelHours: c.commerce.cancellationHours, email: c.contact.email,
    legalName: c.company.legalName, date: c.policies.updated
  };
}

/** Replace {email} with a mailto link after escaping everything else. */
function richText(ctx, str) {
  const v = vars(ctx);
  const emailLink = `<a href="mailto:${e(v.email)}">${e(v.email)}</a>`;
  return tf(str, { ...v, email: '\u0000EMAIL\u0000' }).replace(/\u0000EMAIL\u0000/g, emailLink);
}

function pageShell(ctx, crumbs, inner, cls = '') {
  return `
<section class="block page ${cls}">
  ${breadcrumbs(ctx, crumbs)}
  ${inner}
</section>`;
}

function story(ctx) {
  const t = ctx.t.pages.story;
  const L = ctx.locale;
  const crumbs = [{ label: ctx.t.collections.breadcrumbHome, path: '/' }, { label: ctx.t.nav.story, path: '/our-story' }];
  const flagship = ctx.catalog.getProduct('elegant') || ctx.catalog.PRODUCTS[0];
  const { productImg } = require('./components.js');
  const inner = `
  <header class="page-head centered">
    <span class="eyebrow">${e(ctx.t.story.eyebrow)}</span>
    <h1>${e(t.h1A)}<br><em>${e(t.h1B)}</em></h1>
  </header>
  <figure class="page-figure">${productImg(ctx, flagship, 1, { sizes: '(max-width: 920px) 100vw, 760px', loading: 'eager', fetchpriority: 'high' })}</figure>
  <div class="prose">
${t.sections.map(s => `    <h2>${e(s.h)}</h2>\n    <p>${richText(ctx, s.p)}</p>`).join('\n')}
    <p><a class="btn btn-primary" href="${href(L, '/gates')}">${e(t.cta)} <span aria-hidden="true">→</span></a></p>
  </div>`;
  return {
    path: '/our-story', title: t.title, description: t.description,
    ogImage: abs(`/img/og/${flagship.id}.jpg`),
    jsonLd: [{ '@type': 'AboutPage', '@id': abs(href(L, '/our-story')) + '#webpage', url: abs(href(L, '/our-story')), name: t.title, description: t.description, isPartOf: { '@id': abs('/') + '#website' }, about: { '@id': abs('/') + '#organization' }, inLanguage: ctx.config.locales.tags[L] }, breadcrumbLd(ctx, crumbs)],
    bodyClass: 'page-story', body: pageShell(ctx, crumbs, inner, 'story-page')
  };
}

function measureDiagram(alt) {
  return `
<svg class="diagram" viewBox="0 0 520 360" role="img" aria-label="${e(alt)}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="2">
    <rect x="120" y="30" width="280" height="300" rx="2" stroke-opacity=".35"/>
    <line x1="60" y1="330" x2="460" y2="330"/>
    <path d="M120,30 L120,330 M400,30 L400,330" stroke-width="10" stroke-opacity=".2"/>
  </g>
  <g stroke="currentColor" stroke-width="2" marker-start="url(#ah)" marker-end="url(#ah)">
    <line x1="128" y1="300" x2="392" y2="300"/>
    <line x1="128" y1="232" x2="392" y2="232"/>
    <line x1="128" y1="158" x2="392" y2="158"/>
    <line x1="440" y1="330" x2="440" y2="132"/>
  </g>
  <g fill="currentColor" font-family="ui-monospace, monospace" font-size="13">
    <text x="260" y="292" text-anchor="middle">10 cm · 4 in</text>
    <text x="260" y="224" text-anchor="middle">35 cm · 14 in</text>
    <text x="260" y="150" text-anchor="middle">60 cm · 24 in</text>
    <text x="452" y="236" writing-mode="tb">height</text>
  </g>
  <g fill="currentColor" fill-opacity=".08"><rect x="132" y="132" width="256" height="198" rx="2"/></g>
</svg>`;
}

function measure(ctx) {
  const t = ctx.t.pages.measure;
  const L = ctx.locale;
  const crumbs = [{ label: ctx.t.collections.breadcrumbHome, path: '/' }, { label: ctx.t.nav.measure, path: '/how-to-measure' }];
  const inner = `
  <header class="page-head">
    <span class="eyebrow">${e(ctx.t.nav.measure)}</span>
    <h1>${e(t.h1)}</h1>
    <p class="intro">${e(t.intro)}</p>
  </header>
  <div class="two-col measure-grid">
    <div class="prose">
${t.steps.map(s => `      <h2>${e(s.h)}</h2>\n      <p>${richText(ctx, s.p)}</p>`).join('\n')}
    </div>
    <aside class="sticky-aside">
      ${measureDiagram(t.diagramAlt)}
      <h2 class="h4">${e(t.tipsHeading)}</h2>
${t.tips.map(s => `      <details class="faq-item"><summary>${e(s.h)}</summary><p>${richText(ctx, s.p)}</p></details>`).join('\n')}
      <p><a class="btn btn-primary btn-block" href="${href(L, '/gates')}">${e(t.cta)} <span aria-hidden="true">→</span></a></p>
    </aside>
  </div>`;
  const howTo = {
    '@type': 'HowTo',
    name: t.h1,
    description: t.description,
    totalTime: 'PT2M',
    tool: [{ '@type': 'HowToTool', name: 'Tape measure' }],
    step: t.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.h.replace(/^\d+\.\s*/, ''), text: tf(s.p, vars(ctx)) }))
  };
  return {
    path: '/how-to-measure', title: t.title, description: t.description,
    jsonLd: [howTo, breadcrumbLd(ctx, crumbs)],
    bodyClass: 'page-measure', body: pageShell(ctx, crumbs, inner, 'measure-page')
  };
}

function faq(ctx) {
  const t = ctx.t.pages.faq;
  const L = ctx.locale;
  const crumbs = [{ label: ctx.t.collections.breadcrumbHome, path: '/' }, { label: ctx.t.nav.faq, path: '/faq' }];
  const inner = `
  <header class="page-head">
    <span class="eyebrow">${e(ctx.t.nav.faq)}</span>
    <h1>${e(t.h1)}</h1>
    <p class="intro">${richText(ctx, t.intro)}</p>
  </header>
  <div class="faq-groups">
${t.groups.map(g => `    <section class="faq-group">
      <h2>${e(g.h)}</h2>
${g.items.map(it => `      <details class="faq-item"><summary>${e(it.q)}</summary><p>${richText(ctx, it.p || it.a)}</p></details>`).join('\n')}
    </section>`).join('\n')}
  </div>`;
  const faqLd = {
    '@type': 'FAQPage',
    mainEntity: t.groups.flatMap(g => g.items.map(it => ({
      '@type': 'Question', name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: tf(it.a, vars(ctx)) }
    })))
  };
  return {
    path: '/faq', title: t.title, description: t.description,
    jsonLd: [faqLd, breadcrumbLd(ctx, crumbs)],
    bodyClass: 'page-faq', body: pageShell(ctx, crumbs, inner, 'faq-page')
  };
}

function contact(ctx) {
  const t = ctx.t.pages.contact;
  const c = ctx.config;
  const L = ctx.locale;
  const f = t.form;
  const crumbs = [{ label: ctx.t.collections.breadcrumbHome, path: '/' }, { label: ctx.t.nav.contact, path: '/contact' }];
  const inner = `
  <header class="page-head">
    <span class="eyebrow">${e(ctx.t.nav.contact)}</span>
    <h1>${e(t.h1)}</h1>
    <p class="intro">${e(t.intro)}</p>
  </header>
  <div class="two-col contact-grid">
    <div>
      <dl class="contact-list">
        <div><dt>${e(t.emailLabel)}</dt><dd><a href="mailto:${e(c.contact.email)}">${e(c.contact.email)}</a></dd></div>
        <div><dt>${e(t.workshopLabel)}</dt><dd>${e(c.company.workshop.city)}, ${e(c.company.workshop.country)}</dd></div>
        <div><dt>${e(t.hoursLabel)}</dt><dd>${e(t.hoursValue)}</dd></div>
      </dl>
      <h2 class="h4">${e(t.tradeHeading)}</h2>
      <p class="muted">${e(t.tradeBody)}</p>
    </div>
    <form class="contact-form" id="contactForm" action="/api/contact" method="post" novalidate>
      <h2 class="h4">${e(f.heading)}</h2>
      <input type="hidden" name="locale" value="${L}">
      <div class="field"><label for="cf-name">${e(f.name)}</label><input id="cf-name" name="name" type="text" autocomplete="name" required maxlength="120"></div>
      <div class="field"><label for="cf-email">${e(f.email)}</label><input id="cf-email" name="email" type="email" autocomplete="email" required maxlength="160"></div>
      <div class="field"><label for="cf-topic">${e(f.topic)}</label>
        <select id="cf-topic" name="topic">
${Object.entries(f.topics).map(([k, v]) => `          <option value="${k}">${e(v)}</option>`).join('\n')}
        </select>
      </div>
      <div class="field"><label for="cf-message">${e(f.message)}</label><textarea id="cf-message" name="message" rows="6" required maxlength="4000"></textarea></div>
      <div class="field hp" aria-hidden="true"><label for="cf-website">Website</label><input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <button class="btn btn-primary" type="submit" data-sending="${e(f.sending)}">${e(f.submit)}</button>
      <p class="help">${e(f.privacy)}</p>
      <p class="form-status" id="contactStatus" role="status" aria-live="polite" data-success="${e(f.success)}" data-error="${tf(f.error, { email: c.contact.email })}"></p>
    </form>
  </div>`;
  return {
    path: '/contact', title: t.title, description: t.description,
    jsonLd: [{ '@type': 'ContactPage', '@id': abs(href(L, '/contact')) + '#webpage', url: abs(href(L, '/contact')), name: t.title, isPartOf: { '@id': abs('/') + '#website' }, inLanguage: ctx.config.locales.tags[L] }, breadcrumbLd(ctx, crumbs)],
    bodyClass: 'page-contact', body: pageShell(ctx, crumbs, inner, 'contact-page')
  };
}

function policy(ctx, key, path, navLabel) {
  const t = ctx.t.pages[key];
  const L = ctx.locale;
  const crumbs = [{ label: ctx.t.collections.breadcrumbHome, path: '/' }, { label: navLabel, path }];
  const inner = `
  <header class="page-head">
    <span class="eyebrow">${tf(t.updated, vars(ctx))}</span>
    <h1>${e(t.h1)}</h1>
  </header>
  <div class="prose policy">
${t.sections.map(s => `    <h2>${e(s.h)}</h2>\n    <p>${richText(ctx, s.p)}</p>`).join('\n')}
  </div>`;
  return {
    path, title: t.title, description: t.description,
    jsonLd: [{ '@type': 'WebPage', '@id': abs(href(L, path)) + '#webpage', url: abs(href(L, path)), name: t.h1, description: t.description, isPartOf: { '@id': abs('/') + '#website' }, inLanguage: ctx.config.locales.tags[L], dateModified: ctx.config.policies.updated }, breadcrumbLd(ctx, crumbs)],
    bodyClass: 'page-policy', body: pageShell(ctx, crumbs, inner, 'policy-page')
  };
}

function thankYou(ctx) {
  const t = ctx.t.pages.thankYou;
  const L = ctx.locale;
  const body = `
<section class="block centered thankyou">
  <span class="eyebrow">${e(t.eyebrow)}</span>
  <h1 class="display">${e(t.h1A)}<br><em>${e(t.h1B)}</em></h1>
  <p class="intro">${richText(ctx, t.body)}</p>
  <section class="order-summary order-card" id="orderCard" hidden aria-live="polite">
    <h2 class="h4">${e(t.summaryHeading)}</h2>
    <dl id="orderLines"></dl>
  </section>
  <p class="muted" id="orderLoading" data-ref="${e(t.orderRef)}">${e(t.loading)}</p>
  <p><a href="${href(L, '/gates')}" class="btn btn-primary">${e(t.back)} <span aria-hidden="true">→</span></a></p>
  <p class="muted">${richText(ctx, t.help)}</p>
</section>`;
  return {
    path: '/order/thank-you', title: t.title, description: t.body.replace(/\{[^}]+\}/g, '').slice(0, 150),
    robots: 'noindex,nofollow', bodyClass: 'page-thankyou', scripts: ['site', 'thankyou'], body
  };
}

function notFound(ctx) {
  const t = ctx.t.pages.notFound;
  const L = ctx.locale;
  const body = `
<section class="block centered notfound">
  <span class="eyebrow">${e(t.eyebrow)}</span>
  <h1 class="display">${e(t.h1A)}<br><em>${e(t.h1B)}</em></h1>
  <p class="intro">${e(t.body)}</p>
  <p><a href="${href(L, '/gates')}" class="btn btn-primary">${e(t.cta)} <span aria-hidden="true">→</span></a></p>
</section>`;
  return { path: '/404', title: t.title, description: t.body, robots: 'noindex,nofollow', bodyClass: 'page-404', body };
}

module.exports = { story, measure, faq, contact, policy, thankYou, notFound };
