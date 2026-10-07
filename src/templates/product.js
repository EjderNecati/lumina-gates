'use strict';
const { e, tf, href, abs, money, inToCm, round1, plain } = require('./helpers.js');
const { productImg, productImageUrls, fromPrice, productGrid, breadcrumbs, breadcrumbLd } = require('./components.js');

module.exports = function product(ctx, p) {
  const t = ctx.t;
  const L = ctx.locale;
  const c = ctx.config;
  const cat = ctx.catalog;
  const path = `/gates/${p.id}`;
  const url = abs(href(L, path));
  const photos = ctx.manifest.products[p.id] || [];

  const tagline = L === 'tr' && p.tagline_tr ? p.tagline_tr : p.tagline;
  const description = L === 'tr' && p.description_tr ? p.description_tr : p.description;
  const materialNoun = t.product.materialNoun[p.material];
  const title = `${p.name}${tf(t.product.titleSuffix, { material: materialNoun })}`;
  const metaDesc = plain(tf(t.product.descriptionTemplate, { tagline }).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'), 158);

  // Default configuration (server-rendered price; JS re-computes on change)
  const def = { widthIn: c.commerce.defaultWidthIn, heightIn: cat.DEFAULT_HEIGHT_INCH, color: 'black' };
  const price = cat.computePrice(p.material, def.widthIn, def.heightIn);
  const from = fromPrice(ctx, p);
  const range = cat.priceRange(p.material, c.commerce.fromWidthIn);
  const vars = {
    leadMin: c.commerce.leadTimeBusinessDays.min, leadMax: c.commerce.leadTimeBusinessDays.max,
    transitMin: c.commerce.transitBusinessDays.min, transitMax: c.commerce.transitBusinessDays.max,
    years: c.commerce.warrantyYears, email: c.contact.email
  };

  const collectionId = p.material === 'plexi' ? 'plexi' : 'wood';
  const collection = cat.COLLECTIONS.find(x => x.id === collectionId);
  const crumbs = [
    { label: t.collections.breadcrumbHome, path: '/' },
    { label: t.collections[collectionId].h1, path: '/' + collection.slug },
    { label: p.name, path }
  ];

  // Related: same material first, then same audience, never self
  const related = cat.PRODUCTS
    .filter(x => x.id !== p.id)
    .sort((a, b) => (b.material === p.material) - (a.material === p.material) || (b.audience === p.audience) - (a.audience === p.audience))
    .slice(0, 4);

  const mainSizes = '(max-width: 920px) 100vw, 55vw';
  const thumbs = photos.map((ph, i) => {
    const seen = new Set();
    const sizes = ph.sizes.filter(s => { if (seen.has(s.width)) return false; seen.add(s.width); return true; });
    const mid = sizes.find(s => s.w === 800) || sizes[sizes.length - 1];
    const srcset = sizes.map(s => `${s.file} ${s.width}w`).join(', ');
    return `<button class="thumb${i === 0 ? ' active' : ''}" type="button" data-index="${i + 1}" data-src="${e(mid.file)}" data-srcset="${e(srcset)}" data-width="${mid.width}" data-height="${mid.height}" aria-label="${tf(t.product.thumbLabel, { n: i + 1 })}" aria-pressed="${i === 0 ? 'true' : 'false'}">
      ${productImg(ctx, p, i + 1, { sizes: '72px', className: 'thumb-img', alt: '' })}
    </button>`;
  }).join('\n');

  const colorOptions = cat.COLORS.map(col => `
      <label class="color-opt">
        <input class="visually-hidden" type="radio" name="color" value="${col.id}"${col.id === def.color ? ' checked' : ''}>
        <span class="color-swatch swatch-${col.id}" aria-hidden="true"></span>
        <span class="color-name">${e(t.product.colors[col.id])}</span>
      </label>`).join('');

  const specRows = [
    [t.product.specs.material, p.material === 'plexi' ? t.product.specs.materialPlexi : t.product.specs.materialWood],
    [t.product.specs.finish, t.product.specs.finishValue],
    [t.product.specs.width, t.product.specs.widthValue],
    [t.product.specs.height, t.product.specs.heightValue],
    [t.product.specs.hardware, t.product.specs.hardwareValue],
    ...(p.engravable ? [[t.product.specs.engraving, t.product.specs.engravingValue]] : []),
    ...(p.audience === 'cat' ? [[t.product.specs.catDoor, t.product.specs.catDoorValue]] : []),
    [t.product.specs.lead, tf(t.product.specs.leadValue, vars)],
    [t.product.specs.warranty, tf(t.product.specs.warrantyValue, vars)],
    [t.product.specs.madeIn, t.product.specs.madeInValue]
  ];

  const mailto = `mailto:${encodeURIComponent(c.contact.email)}?subject=${encodeURIComponent(t.product.mailSubject + ': ' + p.name)}&body=${encodeURIComponent(t.product.mailBody)}`;
  const L_ = { min: cat.LIMITS.width.min, max: cat.LIMITS.width.max };
  const H_ = { min: cat.LIMITS.height.min, max: cat.LIMITS.height.max };

  const body = `
<article class="product" data-product="${p.id}">
  <div class="product-gallery">
    <figure class="product-media">
      ${productImg(ctx, p, 1, { loading: 'eager', fetchpriority: 'high', decoding: 'sync', sizes: mainSizes, className: 'main-img', extra: 'id="mainImg"' })}
    </figure>
    ${photos.length > 1 ? `<div class="thumbs" role="group" aria-label="${e(t.product.galleryLabel)}" id="thumbs">${thumbs}</div>` : ''}
  </div>

  <div class="product-info">
    ${breadcrumbs(ctx, crumbs)}
    <p class="eyebrow product-eyebrow">${e(p.audience === 'cat' ? t.card.cat : t.card.both)} · ${e(p.material === 'plexi' ? t.card.plexi : t.card.wood)}</p>
    <h1>${e(p.name)}</h1>
    <p class="tag">${e(tagline)}</p>

    <div class="price-block" aria-live="polite">
      <p class="price-row">
        <span class="now" id="priceNow">${money(price.final, L)}</span>
        ${c.commerce.showCompareAt ? `<s class="was" id="priceWas">${money(price.original, L)}</s><span class="save">${e(t.product.priceOff)}</span>` : ''}
      </p>
      <dl class="price-detail" id="priceDetail">
        <div class="row"><dt>${e(t.product.priceTier)} (${def.widthIn}")</dt><dd>${money(price.tierPrice, L)}</dd></div>
        ${c.commerce.showCompareAt ? `<div class="row"><dt>${e(t.product.priceDiscount)}</dt><dd class="neg">− ${money(price.tierPrice - price.discountedTier, L)}</dd></div>` : ''}
      </dl>
      <p class="price-note">${e(t.product.priceNote)}</p>
    </div>

    <p class="description">${e(description)}</p>

    <form class="configurator" id="configurator" action="${href(L, path)}" method="get" novalidate>
      <fieldset class="product-section">
        <legend class="h4">${e(t.product.cfgWidth)}</legend>
        <div class="config-row">
          <label for="widthInchInput">${e(t.product.cfgChooseWidth)}</label>
          <input type="number" inputmode="decimal" class="config-input" id="widthInchInput" name="w" min="${L_.min}" max="${L_.max}" step="0.5" value="${def.widthIn}">
          <span class="config-unit">${e(t.units.in)}</span>
        </div>
        <div class="config-row config-row-alt">
          <label for="widthCmInput">${e(t.product.cfgOrCm)}</label>
          <input type="number" inputmode="numeric" class="config-input" id="widthCmInput" min="${inToCm(L_.min)}" max="${inToCm(L_.max)}" step="1" value="${inToCm(def.widthIn)}">
          <span class="config-unit">${e(t.units.cm)}</span>
        </div>
        <div class="slider-wrap">
          <label class="visually-hidden" for="widthSlider">${e(t.product.cfgWidth)}</label>
          <input type="range" class="slider" id="widthSlider" min="${L_.min}" max="${L_.max}" step="0.5" value="${def.widthIn}">
          <div class="range-meta">
            <span>${L_.min} ${e(t.units.in)} / ${inToCm(L_.min)} ${e(t.units.cm)}</span>
            <output id="widthLabel" for="widthSlider">${def.widthIn} ${e(t.units.in)} · ${inToCm(def.widthIn)} ${e(t.units.cm)}</output>
            <span>${L_.max} ${e(t.units.in)} / ${inToCm(L_.max)} ${e(t.units.cm)}</span>
          </div>
        </div>
        <p class="help">${e(t.product.cfgMeasureHelp)} <a href="${href(L, '/how-to-measure')}">${e(t.product.cfgMeasureLink)} →</a></p>
      </fieldset>

      <fieldset class="product-section">
        <legend class="h4">${e(t.product.cfgHeight)} <small>${e(t.product.cfgHeightSub)}</small></legend>
        <div class="config-row">
          <label for="heightInchInput">${e(t.product.cfgChooseHeight)}</label>
          <input type="number" inputmode="decimal" class="config-input" id="heightInchInput" name="h" min="${H_.min}" max="${H_.max}" step="0.5" value="${def.heightIn}">
          <span class="config-unit">${e(t.units.in)}</span>
        </div>
        <div class="config-row config-row-alt">
          <label for="heightCmInput">${e(t.product.cfgOrCm)}</label>
          <input type="number" inputmode="numeric" class="config-input" id="heightCmInput" min="${inToCm(H_.min)}" max="${inToCm(H_.max)}" step="1" value="${inToCm(def.heightIn)}">
          <span class="config-unit">${e(t.units.cm)}</span>
        </div>
        <div class="slider-wrap">
          <label class="visually-hidden" for="heightSlider">${e(t.product.cfgHeight)}</label>
          <input type="range" class="slider" id="heightSlider" min="${H_.min}" max="${H_.max}" step="0.5" value="${def.heightIn}">
          <div class="range-meta">
            <span>${H_.min} ${e(t.units.in)} / ${inToCm(H_.min)} ${e(t.units.cm)}</span>
            <output id="heightLabel" for="heightSlider">${def.heightIn} ${e(t.units.in)} · ${inToCm(def.heightIn)} ${e(t.units.cm)} (${e(t.product.cfgStandard)})</output>
            <span>${H_.max} ${e(t.units.in)} / ${inToCm(H_.max)} ${e(t.units.cm)}</span>
          </div>
        </div>
      </fieldset>

      <fieldset class="product-section">
        <legend class="h4">${e(t.product.cfgFinish)}</legend>
        <div class="colors" id="colorPicker">${colorOptions}
        </div>
        <label class="visually-hidden" for="otherColorInput">${e(t.product.colors.otherPick)}</label>
        <input type="text" id="otherColorInput" class="other-input" name="finish" maxlength="80" placeholder="${e(t.product.cfgOtherPlaceholder)}" hidden>
      </fieldset>
${p.engravable ? `
      <fieldset class="product-section">
        <legend class="h4">${e(t.product.cfgEngraving)}</legend>
        <label class="visually-hidden" for="engravingInput">${e(t.product.cfgEngraving)}</label>
        <input type="text" id="engravingInput" class="text-input" name="engraving" maxlength="40" placeholder="${e(t.product.cfgEngravingPlaceholder)}" autocomplete="off">
        <p class="help">${e(t.product.cfgEngravingHelp)}</p>
      </fieldset>` : ''}

      <section class="order-summary" id="orderSummary" aria-live="polite">
        <h2 class="h4">${e(t.product.sumSummary)}</h2>
        <dl>
          <div class="row"><dt>${e(t.product.sumModel)}</dt><dd>${e(p.name)}</dd></div>
          <div class="row"><dt>${e(t.product.sumMaterial)}</dt><dd>${e(p.material === 'plexi' ? t.product.sumMaterialPlexi : t.product.sumMaterialWood)}</dd></div>
          <div class="row"><dt>${e(t.product.sumWidth)}</dt><dd id="sumWidth">${def.widthIn} ${e(t.units.in)} · ${inToCm(def.widthIn)} ${e(t.units.cm)}</dd></div>
          <div class="row"><dt>${e(t.product.sumHeight)}</dt><dd id="sumHeight">${def.heightIn} ${e(t.units.in)} · ${inToCm(def.heightIn)} ${e(t.units.cm)}</dd></div>
          <div class="row"><dt>${e(t.product.sumFinish)}</dt><dd id="sumFinish">${e(t.product.colors[def.color])}</dd></div>
          ${p.engravable ? `<div class="row" id="sumEngravingRow" hidden><dt>${e(t.product.sumEngraving)}</dt><dd id="sumEngraving"></dd></div>` : ''}
          <div class="row total"><dt>${e(t.product.sumTotal)}</dt><dd><span id="sumTotal">${money(price.final, L)}</span>${c.commerce.showCompareAt ? ` <s id="sumWas">${money(price.original, L)}</s>` : ''}</dd></div>
        </dl>
      </section>

      <button type="submit" class="btn btn-primary btn-block" id="payBtn">${e(t.product.btnCheckout)} <span aria-hidden="true">→</span></button>
      <p class="pay-methods">${e(t.product.paymentMethods)}</p>
      <p class="secure-note">${e(t.product.secureNote)}</p>
      <div id="payError" class="pay-error" role="alert" hidden></div>
    </form>

    <a class="btn btn-ghost btn-block custom-btn" href="${mailto}">${e(t.product.btnCustom)}</a>
    <p class="custom-note">${e(t.product.btnCustomBody)}</p>

    <ul class="features">
      <li class="feature"><strong>${e(t.product.featMade)}</strong>${e(t.product.featMadeBody)}</li>
      <li class="feature"><strong>${e(t.product.featLead)}</strong>${tf(t.product.featLeadBody, vars)}</li>
      <li class="feature"><strong>${e(t.product.featShip)}</strong>${e(t.product.featShipBody)}</li>
      <li class="feature"><strong>${e(t.product.featWarr)}</strong>${tf(t.product.featWarrBody, vars)}</li>
    </ul>
  </div>
</article>

<section class="block product-details">
  <div class="two-col">
    <div>
      <h2>${e(t.product.detailsHeading)}</h2>
      <dl class="specs">
${specRows.map(([k, v]) => `        <div class="spec"><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('\n')}
      </dl>
    </div>
    <div>
      <h2>${e(t.product.faqHeading)}</h2>
${t.product.faq.map(f => `      <details class="faq-item"><summary>${e(f.q)}</summary><p>${e(f.a)}</p></details>`).join('\n')}
      <p class="more-link"><a href="${href(L, '/faq')}">${e(t.nav.faq)} →</a> · <a href="${href(L, '/how-to-measure')}">${e(t.nav.measure)} →</a></p>
    </div>
  </div>
</section>

<section class="block related">
  <div class="block-head"><div><h2>${e(t.product.relatedHeading)}</h2></div><a class="btn btn-ghost" href="${href(L, '/gates')}">${e(t.product.backToCollection)}</a></div>
  ${productGrid(ctx, related)}
</section>`;

  const images = productImageUrls(ctx, p);
  const shippingCountries = c.commerce.shippingCountries;

  const productLd = {
    '@type': 'Product',
    '@id': url + '#product',
    name: p.name,
    sku: p.id.toUpperCase(),
    brand: { '@type': 'Brand', name: c.brand },
    description: metaDesc,
    image: images,
    url,
    category: 'Baby & Toddler > Baby Safety > Baby Safety Gates & Barriers',
    material: p.material === 'plexi' ? 'Acrylic (PMMA) panel, solid wood frame' : 'Solid wood',
    audience: { '@type': 'PeopleAudience', audienceType: p.audience === 'cat' ? 'Households with cats' : 'Parents and pet owners' },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Standard height', value: '27.5', unitCode: 'INH' },
      { '@type': 'PropertyValue', name: 'Width range', value: `${cat.LIMITS.width.min}-${cat.LIMITS.width.max}`, unitCode: 'INH' },
      { '@type': 'PropertyValue', name: 'Mounting', value: 'Hardware-mounted' },
      { '@type': 'PropertyValue', name: 'Made to order', value: 'Yes' }
    ],
    countryOfOrigin: 'TR',
    offers: {
      '@type': 'AggregateOffer',
      url,
      priceCurrency: c.commerce.currency,
      lowPrice: String(Math.round(range.low.final)),
      highPrice: String(Math.round(range.high.final)),
      offerCount: cat.PRICE_TIERS[p.material].length,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': abs('/') + '#organization' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: c.commerce.shippingIncluded ? '0' : '0', currency: c.commerce.currency },
        shippingDestination: shippingCountries.map(cc => ({ '@type': 'DefinedRegion', addressCountry: cc })),
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: c.commerce.leadTimeBusinessDays.min, maxValue: c.commerce.leadTimeBusinessDays.max, unitCode: 'DAY' },
          transitTime:  { '@type': 'QuantitativeValue', minValue: c.commerce.transitBusinessDays.min, maxValue: c.commerce.transitBusinessDays.max, unitCode: 'DAY' }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: shippingCountries,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: c.commerce.returnWindowDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        itemCondition: 'https://schema.org/DamagedCondition',
        merchantReturnLink: abs(href(L, '/returns-and-warranty'))
      }
    }
  };

  const mainPhoto = photos[0];
  const mid = mainPhoto.sizes.find(s => s.w === 800) || mainPhoto.sizes[mainPhoto.sizes.length - 1];

  return {
    path,
    title,
    titleShort: `${p.name} - Custom ${materialNoun} gate | Lumina Gates`,
    description: metaDesc,
    ogType: 'product',
    ogTitle: `${p.name}: ${tagline}`,
    ogImage: abs(`/img/og/${p.id}.jpg`),
    ogImageAlt: tf(t.product.imageAlt, { name: p.name, material: materialNoun, n: 1 }),
    ogExtra: [
      ['product:price:amount', String(Math.round(from.final))],
      ['product:price:currency', c.commerce.currency],
      ['product:availability', 'in stock'],
      ['product:condition', 'new'],
      ['product:retailer_item_id', p.id]
    ],
    jsonLd: [productLd, breadcrumbLd(ctx, crumbs)],
    preloadImage: { src: mid.file, srcset: mainPhoto.sizes.map(s => `${s.file} ${s.width}w`).join(', '), sizes: mainSizes },
    bodyClass: 'page-product',
    scripts: ['catalog', 'configurator', 'site'],
    pageData: {
      locale: L,
      product: { id: p.id, name: p.name, material: p.material, engravable: !!p.engravable },
      defaults: def,
      showCompareAt: !!c.commerce.showCompareAt,
      strings: {
        units: t.units,
        colors: t.product.colors,
        standard: t.product.cfgStandard,
        priceTier: t.product.priceTier, priceDiscount: t.product.priceDiscount,
        priceOversizeW: t.product.priceOversizeW, priceHeightFlat: t.product.priceHeightFlat, priceHeightOver: t.product.priceHeightOver,
        width: t.product.cfgWidth,
        payRedirect: t.product.payRedirect, payError: tf(t.product.payError, { email: c.contact.email }), payOtherEmpty: t.product.payOtherEmpty,
        checkout: t.product.btnCheckout
      }
    },
    body,
    // used by sitemap for <image:image>
    images: images.map((u, i) => ({ loc: u, title: `${p.name}: ${tf(t.product.imageAlt, { name: p.name, material: materialNoun, n: i + 1 })}` }))
  };
};
