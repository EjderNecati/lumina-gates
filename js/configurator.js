// Product page — live configurator (i18n-aware)

(function () {
  const L = window.LUMINA;
  const { PRODUCTS, COLORS, computePrice, imagePath } = L;
  const I18N = window.LUMINA_I18N;
  const t = (k) => I18N.t(k);

  // ── Resolve product from URL ─────────────────────────────
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  // ── State ────────────────────────────────────────────────
  const state = {
    widthIn:  30,
    heightIn: L.DEFAULT_HEIGHT_INCH,
    color:    COLORS[1],
    customColor: ''
  };

  const cmToIn = cm => cm / 2.54;
  const inToCm = i  => i * 2.54;
  const round1 = n  => Math.round(n * 10) / 10;
  const fmt$   = n  => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  // Localized colour name
  function colorLabel(c) {
    return t('color.' + c.id);
  }

  function localizedTagline()    { return (I18N.lang === 'tr' && product.tagline_tr)    ? product.tagline_tr    : product.tagline; }
  function localizedDescription(){ return (I18N.lang === 'tr' && product.description_tr) ? product.description_tr : product.description; }

  // ── Build the page shell ─────────────────────────────────
  const root = document.getElementById('product');

  function buildShell() {
    const galleryThumbs = product.images.map((_, i) => `
      <button class="thumb${i === 0 ? ' active' : ''}" data-i="${i}">
        <img src="${imagePath(product, i)}" alt="${product.name} view ${i+1}" loading="lazy" />
      </button>
    `).join('');

    root.innerHTML = `
      <div class="product-gallery">
        <div class="product-media" id="productMedia">
          <img id="mainImg" src="${imagePath(product, 0)}" alt="${product.name}" />
        </div>
        <div class="thumbs" id="thumbs">${galleryThumbs}</div>
      </div>

      <div class="product-info">
        <div class="crumbs">
          <a href="index.html">Lumina</a> · <a href="index.html#shop">${product.material === 'plexi' ? t('filter.plexi') : t('filter.wood')}</a> · <span>${product.name}</span>
        </div>
        <span class="eyebrow">${product.audience === 'cat' ? t('card.cat') : t('card.both')} · ${product.material === 'plexi' ? t('card.plexi') : t('card.wood')}</span>
        <h1 style="margin-top:8px;">${product.name}</h1>
        <p class="tag" id="prodTagline">${localizedTagline()}</p>

        <div class="price-block">
          <div class="price-row">
            <span class="now" id="priceNow">—</span>
            <span class="was" id="priceWas">—</span>
            <span class="save">${t('price.off')}</span>
          </div>
          <div class="price-detail" id="priceDetail"></div>
        </div>

        <p class="description" id="prodDescription">${localizedDescription()}</p>

        <div class="product-section">
          <h4>${t('cfg.width')}</h4>
          <div class="config-row">
            <label for="widthSlider">${t('cfg.choose.width')}</label>
            <input type="number" class="config-input" id="widthInchInput" min="6" max="96" step="0.5" value="30" />
            <span class="config-unit">${t('units.in')}</span>
          </div>
          <div class="config-row" style="margin-top:-6px;">
            <label style="color:var(--ink-3); font-weight:400; font-size:12px;">${t('cfg.or.cm')}</label>
            <input type="number" class="config-input" id="widthCmInput" min="15" max="244" step="1" value="76" />
            <span class="config-unit">${t('units.cm')}</span>
          </div>
          <div class="slider-wrap">
            <input type="range" class="slider" id="widthSlider" min="6" max="96" step="0.5" value="30" />
            <div class="range-meta">
              <span>6 ${t('units.in')} / 15 ${t('units.cm')}</span>
              <span id="widthLabel">30 in · 76 cm</span>
              <span>96 ${t('units.in')} / 244 ${t('units.cm')}</span>
            </div>
          </div>
        </div>

        <div class="product-section">
          <h4>${t('cfg.height')} <span style="text-transform:none; letter-spacing:0; font-family:var(--sans); font-size:11px; color:var(--ink-3); font-weight:400;">${t('cfg.height.sub')}</span></h4>
          <div class="config-row">
            <label for="heightSlider">${t('cfg.choose.height')}</label>
            <input type="number" class="config-input" id="heightInchInput" min="20" max="48" step="0.5" value="27.5" />
            <span class="config-unit">${t('units.in')}</span>
          </div>
          <div class="config-row" style="margin-top:-6px;">
            <label style="color:var(--ink-3); font-weight:400; font-size:12px;">${t('cfg.or.cm')}</label>
            <input type="number" class="config-input" id="heightCmInput" min="50" max="122" step="1" value="70" />
            <span class="config-unit">${t('units.cm')}</span>
          </div>
          <div class="slider-wrap">
            <input type="range" class="slider" id="heightSlider" min="20" max="48" step="0.5" value="27.5" />
            <div class="range-meta">
              <span>20 ${t('units.in')} / 50 ${t('units.cm')}</span>
              <span id="heightLabel">27.5 in · 70 cm</span>
              <span>48 ${t('units.in')} / 122 ${t('units.cm')}</span>
            </div>
          </div>
        </div>

        <div class="product-section">
          <h4>${t('cfg.finish')}</h4>
          <div class="colors" id="colorPicker"></div>
          <input type="text" id="otherColorInput" placeholder="${t('cfg.other.placeholder')}" />
        </div>

        <div class="order-summary" id="orderSummary"></div>

        <button class="btn btn-primary btn-block" id="payBtn">${t('btn.checkout')}</button>
        <button class="btn btn-ghost btn-block" id="customBtn" style="margin-top:10px;">${t('btn.custom')}</button>
        <p style="margin-top:10px; font-size:12px; color:var(--ink-3); line-height:1.6;" id="customNote">
          ${t('btn.custom.body')}
        </p>
        <div id="payError" style="display:none; margin-top:14px; padding:12px 14px; background:#FBE9E2; color:var(--sale); border-radius:var(--radius); font-size:13px;"></div>

        <div class="features">
          <div class="feature"><strong>${t('feat.made')}</strong>${t('feat.made.body')}</div>
          <div class="feature"><strong>${t('feat.lead')}</strong>${t('feat.lead.body')}</div>
          <div class="feature"><strong>${t('feat.ship')}</strong>${t('feat.ship.body')}</div>
          <div class="feature"><strong>${t('feat.warr')}</strong>${t('feat.warr.body')}</div>
        </div>
      </div>
    `;
  }

  buildShell();

  // ── Colour picker ────────────────────────────────────────
  function renderColors() {
    const picker = document.getElementById('colorPicker');
    picker.innerHTML = '';
    COLORS.forEach(c => {
      const opt = document.createElement('div');
      opt.className = 'color-opt' + (c.id === state.color.id ? ' active' : '');
      opt.dataset.color = c.id;
      const swatchStyle = c.id === 'other'
        ? `class="color-swatch color-other-swatch"`
        : `class="color-swatch" style="background:${c.hex};"`;
      opt.innerHTML = `
        <div ${swatchStyle}></div>
        <span class="color-name">${colorLabel(c)}</span>
      `;
      opt.addEventListener('click', () => {
        state.color = c;
        document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const otherInput = document.getElementById('otherColorInput');
        if (c.id === 'other') otherInput.classList.add('visible');
        else { otherInput.classList.remove('visible'); state.customColor = ''; }
        render();
      });
      picker.appendChild(opt);
    });
  }
  renderColors();

  document.getElementById('otherColorInput').addEventListener('input', (e) => {
    state.customColor = e.target.value;
    render();
  });

  // ── Inputs ───────────────────────────────────────────────
  const widthSlider    = document.getElementById('widthSlider');
  const widthInchInput = document.getElementById('widthInchInput');
  const widthCmInput   = document.getElementById('widthCmInput');
  const heightSlider   = document.getElementById('heightSlider');
  const heightInchInput= document.getElementById('heightInchInput');
  const heightCmInput  = document.getElementById('heightCmInput');

  function setWidth(inches, source) {
    inches = Math.max(6, Math.min(96, Number(inches) || 6));
    state.widthIn = inches;
    if (source !== 'slider') widthSlider.value = inches;
    if (source !== 'inch')   widthInchInput.value = round1(inches);
    if (source !== 'cm')     widthCmInput.value = Math.round(inToCm(inches));
    render();
  }
  function setHeight(inches, source) {
    inches = Math.max(20, Math.min(48, Number(inches) || 20));
    state.heightIn = inches;
    if (source !== 'slider') heightSlider.value = inches;
    if (source !== 'inch')   heightInchInput.value = round1(inches);
    if (source !== 'cm')     heightCmInput.value = Math.round(inToCm(inches));
    render();
  }

  widthSlider.addEventListener('input',     e => setWidth(e.target.value, 'slider'));
  widthInchInput.addEventListener('input',  e => setWidth(e.target.value, 'inch'));
  widthCmInput.addEventListener('input',    e => setWidth(cmToIn(e.target.value), 'cm'));
  heightSlider.addEventListener('input',    e => setHeight(e.target.value, 'slider'));
  heightInchInput.addEventListener('input', e => setHeight(e.target.value, 'inch'));
  heightCmInput.addEventListener('input',   e => setHeight(cmToIn(e.target.value), 'cm'));

  // Gallery thumbnail interaction
  document.querySelectorAll('#thumbs .thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#thumbs .thumb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('mainImg').src = imagePath(product, Number(btn.dataset.i));
    });
  });

  // ── Render ───────────────────────────────────────────────
  function render() {
    const p = computePrice(product.material, state.widthIn, state.heightIn);
    document.getElementById('priceNow').textContent = fmt$(p.final);
    document.getElementById('priceWas').textContent = fmt$(p.original);

    // Price detail breakdown
    const detail = document.getElementById('priceDetail');
    const rows = [];
    rows.push(`<div class="row"><span>${t('price.tier')} (${state.widthIn}" ${t('cfg.width').toLowerCase()})</span><span>${fmt$(p.tierPrice)}</span></div>`);
    rows.push(`<div class="row"><span>${t('price.discount')}</span><span style="color:var(--sale);">− ${fmt$(p.tierPrice * 0.5)}</span></div>`);
    if (p.oversize > 0)
      rows.push(`<div class="row"><span>${t('price.oversizeW')}</span><span>+ ${fmt$(p.oversize)}</span></div>`);
    if (p.heightFlat > 0)
      rows.push(`<div class="row"><span>${t('price.heightFlat')}</span><span>+ ${fmt$(p.heightFlat)}</span></div>`);
    if (p.heightOversize > 0)
      rows.push(`<div class="row"><span>${t('price.heightOver')}</span><span>+ ${fmt$(p.heightOversize)}</span></div>`);
    detail.innerHTML = rows.join('');

    // Labels
    document.getElementById('widthLabel').textContent =
      `${round1(state.widthIn)} ${t('units.in')} · ${Math.round(inToCm(state.widthIn))} ${t('units.cm')}`;
    const isStdH = Math.abs(state.heightIn - L.DEFAULT_HEIGHT_INCH) < 0.05;
    document.getElementById('heightLabel').textContent =
      `${round1(state.heightIn)} ${t('units.in')} · ${Math.round(inToCm(state.heightIn))} ${t('units.cm')}${isStdH ? ' (' + t('cfg.standard') + ')' : ''}`;

    // Order summary
    const colorName = state.color.id === 'other'
      ? (state.customColor ? `${t('color.other')}: ${state.customColor}` : t('color.otherPick'))
      : colorLabel(state.color);
    document.getElementById('orderSummary').innerHTML = `
      <div class="row"><span class="label">${t('sum.model')}</span><span class="val">${product.name}</span></div>
      <div class="row"><span class="label">${t('sum.material')}</span><span class="val">${product.material === 'plexi' ? t('sum.material.plexi') : t('sum.material.wood')}</span></div>
      <div class="row"><span class="label">${t('sum.width')}</span><span class="val">${round1(state.widthIn)} ${t('units.in')} · ${Math.round(inToCm(state.widthIn))} ${t('units.cm')}</span></div>
      <div class="row"><span class="label">${t('sum.height')}</span><span class="val">${round1(state.heightIn)} ${t('units.in')} · ${Math.round(inToCm(state.heightIn))} ${t('units.cm')}</span></div>
      <div class="row"><span class="label">${t('sum.finish')}</span><span class="val">${colorName}</span></div>
      <div class="row"><span class="label">${t('sum.total')}</span><span class="val" style="font-size:18px;">${fmt$(p.final)} <span style="color:var(--ink-3); text-decoration:line-through; font-weight:400; font-size:13px; margin-left:6px;">${fmt$(p.original)}</span></span></div>
    `;
  }

  // ── Custom-made wish (mailto) ────────────────────────────
  document.getElementById('customBtn').addEventListener('click', () => {
    window.location.href =
      'mailto:dogukan@luminagates.com' +
      '?subject=' + encodeURIComponent(t('mail.subject')) +
      '&body='   + encodeURIComponent(t('mail.body'));
  });

  // ── Stripe Checkout ──────────────────────────────────────
  const API_BASE = window.LUMINA_API_BASE || '';
  const payBtn   = document.getElementById('payBtn');
  const payError = document.getElementById('payError');

  payBtn.addEventListener('click', async () => {
    payError.style.display = 'none';

    if (state.color.id === 'other' && !state.customColor.trim()) {
      payError.textContent = t('pay.other.empty');
      payError.style.display = 'block';
      return;
    }

    const colorName = state.color.id === 'other'
      ? `Other — ${state.customColor.trim()}`
      : state.color.name;

    const originalLabel = payBtn.textContent;
    payBtn.disabled = true;
    payBtn.textContent = t('pay.redirect');

    try {
      const resp = await fetch(API_BASE + '/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId:   product.id,
          productName: product.name,
          material:    product.material,
          widthIn:     state.widthIn,
          heightIn:    state.heightIn,
          colorName
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || ('HTTP ' + resp.status));
      }

      const data = await resp.json();
      if (!data.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      payError.innerHTML =
        t('pay.error') +
        '<br><small style="opacity:.7;">' + (err.message || err) + '</small>';
      payError.style.display = 'block';
      payBtn.disabled = false;
      payBtn.textContent = originalLabel;
    }
  });

  // ── Initial render + language reactivity ────────────────
  document.title = `${product.name} — Lumina Gates`;
  setWidth(30);
  setHeight(L.DEFAULT_HEIGHT_INCH);

  window.addEventListener('lumina:langchange', () => {
    // Rebuild the entire shell with new translations, preserving state
    const savedState = { ...state };
    buildShell();
    renderColors();
    // Rewire all inputs since the DOM was rebuilt
    location.reload(); // simplest reliable path — preserves URL ?id
    // The reload preserves the URL (?id=...), and i18n picks up the new lang from localStorage.
  });
})();
