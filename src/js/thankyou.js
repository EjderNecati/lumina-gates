// Lumina Gates - order confirmation page: show the paid order and fire conversion events
(function () {
  'use strict';
  var card = document.getElementById('orderCard');
  var lines = document.getElementById('orderLines');
  var loading = document.getElementById('orderLoading');
  if (!card || !lines) return;

  var sessionId = new URLSearchParams(window.location.search).get('session_id');
  if (!sessionId) { loading.setAttribute('hidden', ''); return; }

  function row(k, v) {
    var div = document.createElement('div'); div.className = 'row';
    var dt = document.createElement('dt'); dt.textContent = k;
    var dd = document.createElement('dd'); dd.textContent = v;
    div.appendChild(dt); div.appendChild(dd); return div;
  }

  fetch('/api/order?session_id=' + encodeURIComponent(sessionId))
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (o) {
      lines.appendChild(row(loading.getAttribute('data-ref') || 'Order reference', o.reference));
      (o.lines || []).forEach(function (l) { lines.appendChild(row(l.label, l.value)); });
      card.removeAttribute('hidden');
      loading.setAttribute('hidden', '');

      // Conversion tracking (only when analytics are configured)
      var purchase = { transaction_id: o.reference, currency: o.currency, value: o.amount, items: [{ item_id: o.productId, item_name: o.productName, price: o.amount, quantity: 1 }] };
      window.luminaTrack && window.luminaTrack('purchase', purchase);
      var adsLabel = document.body.getAttribute('data-ads-purchase');
      if (adsLabel && window.gtag) window.gtag('event', 'conversion', { send_to: adsLabel, value: o.amount, currency: o.currency, transaction_id: o.reference });
    })
    .catch(function () { loading.setAttribute('hidden', ''); });
})();
