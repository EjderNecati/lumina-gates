// Lumina Gates - site-wide progressive enhancement (no dependencies, CSP-safe: no inline code)
(function () {
  'use strict';

  // ── Mobile menu ─────────────────────────────────────────
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (open) menu.setAttribute('hidden', ''); else menu.removeAttribute('hidden');
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { menuBtn.click(); menuBtn.focus(); }
    });
  }

  // ── Card hover image: load the second photo only when needed ──
  function loadAlt(card) {
    var img = card.querySelector('.card-img-b[data-src]');
    if (!img) return;
    img.srcset = img.getAttribute('data-srcset') || '';
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src'); img.removeAttribute('data-srcset');
    var done = function () { card.classList.add('has-alt'); };
    if (img.complete) done(); else img.addEventListener('load', done, { once: true });
  }
  var hoverable = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (hoverable) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mouseenter', function () { loadAlt(card); }, { once: true });
      card.addEventListener('focusin', function () { loadAlt(card); }, { once: true });
    });
  }

  // ── Home page: filter the grid in place (chips stay real links for crawlers / no-JS) ──
  var grid = document.querySelector('.page-home [data-product-grid]');
  if (grid) {
    var chips = document.querySelectorAll('.page-home .filters .chip');
    var cards = grid.querySelectorAll('.card');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function (ev) {
        ev.preventDefault();
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); c.removeAttribute('aria-current'); });
        cards.forEach(function (card) {
          var show = f === 'all' || (f === 'cat' ? card.getAttribute('data-audience') === 'cat' : card.getAttribute('data-material') === f);
          if (show) card.removeAttribute('hidden'); else card.setAttribute('hidden', '');
        });
      });
    });
  }

  // ── Contact form ────────────────────────────────────────
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('contactStatus');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = btn.getAttribute('data-sending') || label;
      status.textContent = ''; status.className = 'form-status';
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function () { status.textContent = status.getAttribute('data-success'); status.classList.add('ok'); form.reset(); })
        .catch(function () { status.textContent = status.getAttribute('data-error'); status.classList.add('err'); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  // ── Analytics (GA4 / Google Ads) - only when configured on <body data-ga4> ──
  var ga4 = document.body.getAttribute('data-ga4');
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (ga4) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ga4, { anonymize_ip: true });
  }
  window.luminaTrack = function (name, params) { try { if (ga4) gtag('event', name, params || {}); } catch (e) { /* noop */ } };
})();
