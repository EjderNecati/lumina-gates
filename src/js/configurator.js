// Lumina Gates — product configurator (hydrates the server-rendered form)
// Depends on: window.LUMINA (catalog.js) and <script type="application/json" id="page-data">.
(function () {
  'use strict';
  var dataEl = document.getElementById('page-data');
  var root = document.getElementById('configurator');
  if (!dataEl || !root || !window.LUMINA) return;

  var L = window.LUMINA;
  var page = JSON.parse(dataEl.textContent);
  var S = page.strings;
  var product = page.product;
  var locale = page.locale;

  var state = { widthIn: page.defaults.widthIn, heightIn: page.defaults.heightIn, color: page.defaults.color, customColor: '', engraving: '' };

  var $ = function (id) { return document.getElementById(id); };
  var cmToIn = function (cm) { return cm / 2.54; };
  var inToCm = function (i) { return Math.round(i * 2.54); };
  var round1 = function (n) { return Math.round(n * 10) / 10; };
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US'); };
  var clamp = function (v, lim) { v = Number(v); if (!isFinite(v)) v = lim.min; return Math.max(lim.min, Math.min(lim.max, v)); };

  // ── Elements ─────────────────────────────────────────────
  var widthSlider = $('widthSlider'), widthIn = $('widthInchInput'), widthCm = $('widthCmInput'), widthLabel = $('widthLabel');
  var heightSlider = $('heightSlider'), heightIn = $('heightInchInput'), heightCm = $('heightCmInput'), heightLabel = $('heightLabel');
  var otherInput = $('otherColorInput'), engravingInput = $('engravingInput');
  var priceNow = $('priceNow'), priceWas = $('priceWas'), priceDetail = $('priceDetail');
  var sumWidth = $('sumWidth'), sumHeight = $('sumHeight'), sumFinish = $('sumFinish'), sumTotal = $('sumTotal'), sumWas = $('sumWas');
  var sumEngravingRow = $('sumEngravingRow'), sumEngraving = $('sumEngraving');
  var payBtn = $('payBtn'), payError = $('payError');

  function colorName() {
    if (state.color === 'other') return state.customColor ? (S.colors.other + ': ' + state.customColor) : S.colors.otherPick;
    return S.colors[state.color] || state.color;
  }

  function row(label, value, cls) {
    return '<div class="row"><dt>' + label + '</dt><dd' + (cls ? ' class="' + cls + '"' : '') + '>' + value + '</dd></div>';
  }

  function render() {
    var p = L.computePrice(product.material, state.widthIn, state.heightIn);
    priceNow.textContent = fmt(p.final);
    if (priceWas) priceWas.textContent = fmt(p.original);

    var rows = [row(S.priceTier + ' (' + round1(state.widthIn) + '")', fmt(p.tierPrice))];
    if (page.showCompareAt) rows.push(row(S.priceDiscount, '− ' + fmt(p.tierPrice - p.discountedTier), 'neg'));
    if (p.oversize > 0) rows.push(row(S.priceOversizeW, '+ ' + fmt(p.oversize)));
    if (p.heightFlat > 0) rows.push(row(S.priceHeightFlat, '+ ' + fmt(p.heightFlat)));
    if (p.heightOversize > 0) rows.push(row(S.priceHeightOver, '+ ' + fmt(p.heightOversize)));
    priceDetail.innerHTML = rows.join('');

    var w = round1(state.widthIn) + ' ' + S.units.in + ' · ' + inToCm(state.widthIn) + ' ' + S.units.cm;
    var isStd = Math.abs(state.heightIn - L.DEFAULT_HEIGHT_INCH) < 0.05;
    var h = round1(state.heightIn) + ' ' + S.units.in + ' · ' + inToCm(state.heightIn) + ' ' + S.units.cm + (isStd ? ' (' + S.standard + ')' : '');
    widthLabel.textContent = w; heightLabel.textContent = h;
    sumWidth.textContent = w; sumHeight.textContent = h.replace(/ \(.*\)$/, '');
    sumFinish.textContent = colorName();
    sumTotal.textContent = fmt(p.final);
    if (sumWas) sumWas.textContent = fmt(p.original);
    if (sumEngravingRow) {
      if (state.engraving) { sumEngraving.textContent = state.engraving; sumEngravingRow.removeAttribute('hidden'); }
      else sumEngravingRow.setAttribute('hidden', '');
    }
  }

  function setWidth(inches, source) {
    inches = clamp(inches, L.LIMITS.width);
    state.widthIn = inches;
    if (source !== 'slider') widthSlider.value = inches;
    if (source !== 'inch') widthIn.value = round1(inches);
    if (source !== 'cm') widthCm.value = inToCm(inches);
    render();
  }
  function setHeight(inches, source) {
    inches = clamp(inches, L.LIMITS.height);
    state.heightIn = inches;
    if (source !== 'slider') heightSlider.value = inches;
    if (source !== 'inch') heightIn.value = round1(inches);
    if (source !== 'cm') heightCm.value = inToCm(inches);
    render();
  }

  widthSlider.addEventListener('input', function (e) { setWidth(e.target.value, 'slider'); });
  widthIn.addEventListener('input', function (e) { if (e.target.value !== '') setWidth(e.target.value, 'inch'); });
  widthIn.addEventListener('change', function (e) { setWidth(e.target.value, 'slider'); });
  widthCm.addEventListener('input', function (e) { if (e.target.value !== '') setWidth(cmToIn(e.target.value), 'cm'); });
  widthCm.addEventListener('change', function () { setWidth(state.widthIn); });
  heightSlider.addEventListener('input', function (e) { setHeight(e.target.value, 'slider'); });
  heightIn.addEventListener('input', function (e) { if (e.target.value !== '') setHeight(e.target.value, 'inch'); });
  heightIn.addEventListener('change', function (e) { setHeight(e.target.value, 'slider'); });
  heightCm.addEventListener('input', function (e) { if (e.target.value !== '') setHeight(cmToIn(e.target.value), 'cm'); });
  heightCm.addEventListener('change', function () { setHeight(state.heightIn); });

  // ── Finish ───────────────────────────────────────────────
  root.querySelectorAll('input[name="color"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      state.color = radio.value;
      if (state.color === 'other') { otherInput.removeAttribute('hidden'); otherInput.focus(); }
      else { otherInput.setAttribute('hidden', ''); state.customColor = ''; otherInput.value = ''; }
      render();
    });
  });
  otherInput.addEventListener('input', function (e) { state.customColor = e.target.value.trim(); render(); });
  if (engravingInput) engravingInput.addEventListener('input', function (e) { state.engraving = e.target.value.trim(); render(); });

  // ── Gallery ──────────────────────────────────────────────
  var mainImg = $('mainImg');
  var thumbs = document.querySelectorAll('#thumbs .thumb');
  thumbs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      thumbs.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      mainImg.srcset = btn.getAttribute('data-srcset');
      mainImg.src = btn.getAttribute('data-src');
      mainImg.width = Number(btn.getAttribute('data-width'));
      mainImg.height = Number(btn.getAttribute('data-height'));
    });
  });

  // ── Checkout ─────────────────────────────────────────────
  function showError(msg) { payError.textContent = msg; payError.removeAttribute('hidden'); }
  root.addEventListener('submit', function (ev) {
    ev.preventDefault();
    payError.setAttribute('hidden', '');
    if (state.color === 'other' && !state.customColor) { showError(S.payOtherEmpty); otherInput.focus(); return; }

    var colorLabel = state.color === 'other' ? 'Other — ' + state.customColor : (L.COLORS.filter(function (c) { return c.id === state.color; })[0] || {}).name;
    var label = payBtn.textContent;
    payBtn.disabled = true; payBtn.textContent = S.payRedirect;

    var payload = {
      productId: product.id,
      widthIn: state.widthIn,
      heightIn: state.heightIn,
      colorId: state.color,
      colorName: colorLabel,
      engraving: state.engraving || '',
      locale: locale
    };
    window.luminaTrack && window.luminaTrack('begin_checkout', { currency: 'USD', value: L.computePrice(product.material, state.widthIn, state.heightIn).final, items: [{ item_id: product.id, item_name: product.name }] });

    fetch((window.LUMINA_API_BASE || '') + '/api/create-checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.url) throw new Error(j.error || ('HTTP ' + r.status)); return j; }); })
      .then(function (j) { window.location.href = j.url; })
      .catch(function (err) {
        showError(S.payError + (err && err.message ? ' (' + err.message + ')' : ''));
        payBtn.disabled = false; payBtn.textContent = label;
      });
  });

  render();
})();
