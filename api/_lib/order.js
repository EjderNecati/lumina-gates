// Turn a Stripe Checkout Session into a human-readable order summary.
'use strict';

const catalog = require('../../src/catalog.js');

const LABELS = {
  en: { model: 'Model', material: 'Material', width: 'Width', height: 'Height', finish: 'Finish', engraving: 'Engraving', notes: 'Notes', total: 'Total paid', plexi: 'Optical-grade plexiglass', wood: 'Solid wood', ship: 'Ships to' },
  tr: { model: 'Model', material: 'Malzeme', width: 'Genişlik', height: 'Yükseklik', finish: 'Renk', engraving: 'Kazıma', notes: 'Notlar', total: 'Ödenen tutar', plexi: 'Optik kalite pleksiglas', wood: 'Masif ahşap', ship: 'Teslimat' }
};

function money(cents, currency) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: (currency || 'usd').toUpperCase(), maximumFractionDigits: 0 }).format((cents || 0) / 100);
}
function dims(inches) {
  const i = Number(inches) || 0;
  return `${Math.round(i * 10) / 10} in · ${Math.round(i * 2.54)} cm`;
}

/** Human-friendly reference derived from the PaymentIntent (stable across retries). */
function reference(session) {
  const pi = typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent && session.payment_intent.id) || session.id;
  return 'LG-' + pi.replace(/^pi_|^cs_(test_|live_)?/, '').slice(-8).toUpperCase();
}

function summarize(session) {
  const md = session.metadata || {};
  const locale = md.locale === 'tr' ? 'tr' : 'en';
  const L = LABELS[locale];
  const product = catalog.getProduct(md.productId) || { name: md.productId || '—', material: md.material };
  const notesField = (session.custom_fields || []).find(f => f.key === 'notes');
  const notes = notesField && notesField.text && notesField.text.value;
  const ship = session.shipping_details || session.collected_information?.shipping_details || null;
  const addr = ship && ship.address;

  const lines = [
    [L.model, product.name],
    [L.material, product.material === 'plexi' ? L.plexi : L.wood],
    [L.width, dims(md.widthIn)],
    [L.height, dims(md.heightIn)],
    [L.finish, md.colorName || '—'],
    ...(md.engraving ? [[L.engraving, md.engraving]] : []),
    ...(notes ? [[L.notes, notes]] : []),
    [L.total, money(session.amount_total, session.currency)]
  ].map(([label, value]) => ({ label, value }));

  return {
    reference: reference(session),
    sessionId: session.id,
    locale,
    productId: product.id || md.productId,
    productName: product.name,
    amount: (session.amount_total || 0) / 100,
    currency: (session.currency || 'usd').toUpperCase(),
    paymentStatus: session.payment_status,
    lines,
    customer: {
      name: session.customer_details?.name || (ship && ship.name) || '',
      email: session.customer_details?.email || '',
      phone: session.customer_details?.phone || ''
    },
    shipping: addr ? {
      name: ship.name || '',
      line1: addr.line1 || '', line2: addr.line2 || '', city: addr.city || '',
      state: addr.state || '', postal_code: addr.postal_code || '', country: addr.country || ''
    } : null,
    config: { widthIn: md.widthIn, heightIn: md.heightIn, colorId: md.colorId, colorName: md.colorName, engraving: md.engraving || '', originalPrice: md.originalPrice, finalPrice: md.finalPrice }
  };
}

module.exports = { summarize, money, dims, reference };
