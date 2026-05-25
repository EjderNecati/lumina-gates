// Product page — live configurator

(function () {
  const L = window.LUMINA;
  const { PRODUCTS, COLORS, computePrice, imagePath } = L;

  // ── Resolve product from URL ─────────────────────────────
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  // ── State ────────────────────────────────────────────────
  const state = {
    widthIn:  30,           // default width inches
    heightIn: L.DEFAULT_HEIGHT_INCH,
    color:    COLORS[1],    // jet black default
    customColor: ''
  };

  const cmToIn = cm => cm / 2.54;
  const inToCm = i  => i * 2.54;
  const round1 = n  => Math.round(n * 10) / 10;
  const fmt$   = n  => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  // ── Render shell ─────────────────────────────────────────
  const root = document.getElementById('product');
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
        <a href="index.html">Lumina</a> · <a href="index.html#shop">${product.collection}</a> · <span>${product.name}</span>
      </div>
      <span class="eyebrow">${product.audience === 'cat' ? 'Cat Edition' : 'Child & Pet'} · ${product.material === 'plexi' ? 'Plexiglass' : 'Solid Oak'}</span>
      <h1 style="margin-top:8px;">${product.name}</h1>
      <p class="tag">${product.tagline}</p>

      <div class="price-block">
        <div class="price-row">
          <span class="now" id="priceNow">—</span>
          <span class="was" id="priceWas">—</span>
          <span class="save">50% off</span>
        </div>
        <div class="price-detail" id="priceDetail"></div>
      </div>

      <p class="description">${product.description}</p>

      <div class="product-section">
        <h4>Width</h4>
        <div class="config-row">
          <label for="widthSlider">Choose width</label>
          <input type="number" class="config-input" id="widthInchInput" min="6" max="96" step="0.5" value="30" />
          <span class="config-unit">in</span>
        </div>
        <div class="config-row" style="margin-top:-6px;">
          <label style="color:var(--ink-3); font-weight:400; font-size:12px;">or enter in cm</label>
          <input type="number" class="config-input" id="widthCmInput" min="15" max="244" step="1" value="76" />
          <span class="config-unit">cm</span>
        </div>
        <div class="slider-wrap">
          <input type="range" class="slider" id="widthSlider" min="6" max="96" step="0.5" value="30" />
          <div class="range-meta">
            <span>6 in / 15 cm</span>
            <span id="widthLabel">30 in · 76 cm</span>
            <span>96 in / 244 cm</span>
          </div>
        </div>
      </div>

      <div class="product-section">
        <h4>Height <span style="text-transform:none; letter-spacing:0; font-family:var(--sans); font-size:11px; color:var(--ink-3); font-weight:400;">— standard 27.5 in / 70 cm · +$20 if changed, +$100 per 6 in</span></h4>
        <div class="config-row">
          <label for="heightSlider">Choose height</label>
          <input type="number" class="config-input" id="heightInchInput" min="20" max="48" step="0.5" value="27.5" />
          <span class="config-unit">in</span>
        </div>
        <div class="config-row" style="margin-top:-6px;">
          <label style="color:var(--ink-3); font-weight:400; font-size:12px;">or enter in cm</label>
          <input type="number" class="config-input" id="heightCmInput" min="50" max="122" step="1" value="70" />
          <span class="config-unit">cm</span>
        </div>
        <div class="slider-wrap">
          <input type="range" class="slider" id="heightSlider" min="20" max="48" step="0.5" value="27.5" />
          <div class="range-meta">
            <span>20 in / 50 cm</span>
            <span id="heightLabel">27.5 in · 70 cm (standard)</span>
            <span>48 in / 122 cm</span>
          </div>
        </div>
      </div>

      <div class="product-section">
        <h4>Finish</h4>
        <div class="colors" id="colorPicker"></div>
        <input type="text" id="otherColorInput" placeholder="Describe the finish you'd like — e.g. RAL 7016, sage green matte" />
      </div>

      <div class="order-summary" id="orderSummary"></div>

      <button class="btn btn-primary btn-block" id="payBtn">Checkout →</button>
      <button class="btn btn-ghost btn-block" id="customBtn" style="margin-top:10px;">Custom-made wish via email</button>
      <p style="margin-top:10px; font-size:12px; color:var(--ink-3); line-height:1.6;">
        Want something different from our standard line? Tell us what you have in mind — a colour, a pattern, a hardware finish — and we'll build it for you.
      </p>
      <div id="payError" style="display:none; margin-top:14px; padding:12px 14px; background:#FBE9E2; color:var(--sale); border-radius:var(--radius); font-size:13px;"></div>

      <div class="features">
        <div class="feature"><strong>Made to order</strong>Built to your exact opening in our atelier.</div>
        <div class="feature"><strong>Lead time</strong>1–2 weeks from order confirmation.</div>
        <div class="feature"><strong>Shipping</strong>Worldwide, white-glove available.</div>
        <div class="feature"><strong>Warranty</strong>5 years on frame & hardware.</div>
      </div>
    </div>
  `;

  // ── Color picker ─────────────────────────────────────────
  const picker = document.getElementById('colorPicker');
  COLORS.forEach(c => {
    const opt = document.createElement('div');
    opt.className = 'color-opt';
    opt.dataset.color = c.id;
    const swatchStyle = c.id === 'other'
      ? `class="color-swatch color-other-swatch"`
      : `class="color-swatch" style="background:${c.hex};"`;
    opt.innerHTML = `
      <div ${swatchStyle}></div>
      <span class="color-name">${c.name}</span>
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
  // activate default
  picker.querySelector(`[data-color="${state.color.id}"]`).classList.add('active');

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

  // ── Render ───────────────────────────────────────────────
  // Gallery thumbnail interaction
  document.querySelectorAll('#thumbs .thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#thumbs .thumb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('mainImg').src = imagePath(product, Number(btn.dataset.i));
    });
  });

  function render() {
    // Pricing
    const p = computePrice(product.material, state.widthIn, state.heightIn);
    document.getElementById('priceNow').textContent = fmt$(p.final);
    document.getElementById('priceWas').textContent = fmt$(p.original);

    // Price detail breakdown
    const detail = document.getElementById('priceDetail');
    const rows = [];
    rows.push(`<div class="row"><span>Tier price (${state.widthIn}" width)</span><span>${fmt$(p.tierPrice)}</span></div>`);
    rows.push(`<div class="row"><span>50% summer discount</span><span style="color:var(--sale);">− ${fmt$(p.tierPrice * 0.5)}</span></div>`);
    if (p.oversize > 0)
      rows.push(`<div class="row"><span>Width oversize surcharge (beyond 54")</span><span>+ ${fmt$(p.oversize)}</span></div>`);
    if (p.heightFlat > 0)
      rows.push(`<div class="row"><span>Custom height fee</span><span>+ ${fmt$(p.heightFlat)}</span></div>`);
    if (p.heightOversize > 0)
      rows.push(`<div class="row"><span>Height oversize surcharge ($100 per 6")</span><span>+ ${fmt$(p.heightOversize)}</span></div>`);
    detail.innerHTML = rows.join('');

    // Labels
    document.getElementById('widthLabel').textContent =
      `${round1(state.widthIn)} in · ${Math.round(inToCm(state.widthIn))} cm`;
    const isStdH = Math.abs(state.heightIn - L.DEFAULT_HEIGHT_INCH) < 0.05;
    document.getElementById('heightLabel').textContent =
      `${round1(state.heightIn)} in · ${Math.round(inToCm(state.heightIn))} cm${isStdH ? ' (standard)' : ''}`;

    // Order summary
    const colorName = state.color.id === 'other'
      ? (state.customColor ? `Other: ${state.customColor}` : 'Other (please specify)')
      : state.color.name;
    document.getElementById('orderSummary').innerHTML = `
      <div class="row"><span class="label">Model</span><span class="val">${product.name}</span></div>
      <div class="row"><span class="label">Material</span><span class="val">${product.material === 'plexi' ? 'Optical-grade plexiglass' : 'Solid European oak'}</span></div>
      <div class="row"><span class="label">Width</span><span class="val">${round1(state.widthIn)} in · ${Math.round(inToCm(state.widthIn))} cm</span></div>
      <div class="row"><span class="label">Height</span><span class="val">${round1(state.heightIn)} in · ${Math.round(inToCm(state.heightIn))} cm</span></div>
      <div class="row"><span class="label">Finish</span><span class="val">${colorName}</span></div>
      <div class="row"><span class="label">Total</span><span class="val" style="font-size:18px;">${fmt$(p.final)} <span style="color:var(--ink-3); text-decoration:line-through; font-weight:400; font-size:13px; margin-left:6px;">${fmt$(p.original)}</span></span></div>
    `;
  }

  // ── Custom-made wish (for designs outside our standard catalog) ──
  document.getElementById('customBtn').addEventListener('click', () => {
    const body =
`Hi Lumina,

I'd love a custom gate that isn't part of your standard collection. Here's what I have in mind:

Style / inspiration:
  (describe the look — slat pattern, lattice, barn, glass, etc.)

Material:
  (wood / plexiglass / mixed)

Approximate dimensions:
  Width:  ___ in / ___ cm
  Height: ___ in / ___ cm

Finish / colour:
  (e.g. matte black, natural oak, RAL 7016, brushed brass hardware)

For (children / cats / dogs):

Anything else we should know:


Thank you,`;
    window.location.href =
      'mailto:luminagates@gmail.com' +
      '?subject=' + encodeURIComponent('Custom-made gate inquiry') +
      '&body='   + encodeURIComponent(body);
  });

  // ── Stripe Checkout ──────────────────────────────────────
  // API endpoint — when running on Vercel this is just /api/create-checkout.
  // For local file:// testing you can set window.LUMINA_API_BASE to e.g. http://localhost:3000
  const API_BASE = window.LUMINA_API_BASE || '';
  const payBtn   = document.getElementById('payBtn');
  const payError = document.getElementById('payError');

  payBtn.addEventListener('click', async () => {
    payError.style.display = 'none';

    // Block "Other" color without a description
    if (state.color.id === 'other' && !state.customColor.trim()) {
      payError.textContent = 'Please describe the finish you\'d like in the "Other" field.';
      payError.style.display = 'block';
      return;
    }

    const colorName = state.color.id === 'other'
      ? `Other — ${state.customColor.trim()}`
      : state.color.name;

    const originalLabel = payBtn.textContent;
    payBtn.disabled = true;
    payBtn.textContent = 'Redirecting to checkout…';

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
        'Checkout is not configured yet on this preview. ' +
        '(Once deployed to Vercel with Stripe keys, this button will open Stripe Checkout.) ' +
        '<br><small style="opacity:.7;">' + (err.message || err) + '</small>';
      payError.style.display = 'block';
      payBtn.disabled = false;
      payBtn.textContent = originalLabel;
    }
  });

  // ── Initial render ───────────────────────────────────────
  document.title = `${product.name} — Lumina Gates`;
  setWidth(30);
  setHeight(L.DEFAULT_HEIGHT_INCH);
})();
