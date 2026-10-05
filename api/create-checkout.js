// POST /api/create-checkout  →  { url, id }
//
// Body (JSON): { productId, widthIn, heightIn, colorId, colorName?, engraving?, locale? }
// The price is always re-computed server-side from src/catalog.js; the client's numbers are never trusted.
//
// Env: STRIPE_SECRET_KEY   sk_test_… / sk_live_…
//      PUBLIC_SITE_URL     https://www.luminagates.com  (no trailing slash; defaults to site.config siteUrl)
'use strict';

const Stripe  = require('stripe');
const catalog = require('../src/catalog.js');
const config  = require('../src/site.config.js');

const LIMITS = catalog.LIMITS;
const TEXT = {
  en: { notes: 'Order notes (optional)', submit: 'Made to order — we confirm your dimensions by email before production starts.', shipping: 'Shipping is included. Import duties, where applicable, are paid by the recipient.' },
  tr: { notes: 'Sipariş notu (isteğe bağlı)', submit: 'Siparişe özel üretim — üretimden önce ölçülerinizi e-posta ile teyit ederiz.', shipping: 'Kargo dahildir. Varsa gümrük vergileri alıcı tarafından ödenir.' }
};

function siteUrl(req) {
  return (process.env.PUBLIC_SITE_URL || config.siteUrl || `https://${req.headers.host}`).replace(/\/$/, '');
}

function bad(res, msg, code = 400) { return res.status(code).json({ error: msg }); }

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return bad(res, 'Method not allowed', 405); }
  if (!process.env.STRIPE_SECRET_KEY) return bad(res, 'Checkout is not configured (STRIPE_SECRET_KEY missing)', 503);

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return bad(res, 'Invalid JSON'); } }
  body = body || {};

  // ── Validate ──
  const product = catalog.getProduct(String(body.productId || ''));
  if (!product) return bad(res, 'Unknown product');

  const widthIn  = Number(body.widthIn);
  const heightIn = body.heightIn === undefined ? catalog.DEFAULT_HEIGHT_INCH : Number(body.heightIn);
  if (!isFinite(widthIn)  || widthIn  < LIMITS.width.min  || widthIn  > LIMITS.width.max)  return bad(res, `Width must be between ${LIMITS.width.min} and ${LIMITS.width.max} inches`);
  if (!isFinite(heightIn) || heightIn < LIMITS.height.min || heightIn > LIMITS.height.max) return bad(res, `Height must be between ${LIMITS.height.min} and ${LIMITS.height.max} inches`);

  const color = catalog.COLORS.find(c => c.id === body.colorId);
  if (!color) return bad(res, 'Unknown finish');
  let colorName = color.name;
  if (color.id === 'other') {
    const custom = String(body.colorName || '').replace(/^Other\s*[—-]\s*/i, '').trim().slice(0, 80);
    if (!custom) return bad(res, 'Please describe the custom finish');
    colorName = `Other — ${custom}`;
  }

  const engraving = product.engravable ? String(body.engraving || '').trim().slice(0, 40) : '';
  const locale = body.locale === 'tr' ? 'tr' : 'en';
  const T = TEXT[locale];

  // ── Price (server-side) ──
  const pricing = catalog.computePrice(product.material, widthIn, heightIn);
  const amountCents = Math.round(pricing.final * 100);
  if (!(amountCents > 0)) return bad(res, 'Invalid price');

  const r1 = n => Math.round(n * 10) / 10;
  const cm = i => Math.round(i * 2.54);
  const description = `${r1(widthIn)}" × ${r1(heightIn)}" (${cm(widthIn)} × ${cm(heightIn)} cm) · ${colorName}${engraving ? ` · "${engraving}"` : ''}`;

  const base = siteUrl(req);
  const prefix = locale === 'tr' ? '/tr' : '';
  const metadata = {
    productId: product.id, material: product.material,
    widthIn: String(widthIn), heightIn: String(heightIn),
    colorId: color.id, colorName, engraving,
    originalPrice: String(pricing.original), finalPrice: String(pricing.final),
    locale
  };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale,
      // Payment methods (card, Apple Pay, Google Pay, Link, PayPal, …) are managed in
      // Stripe Dashboard → Settings → Payment methods. Nothing to change here.
      line_items: [{
        quantity: 1,
        price_data: {
          currency: config.commerce.currency.toLowerCase(),
          unit_amount: amountCents,
          product_data: {
            name: `${config.brand} — ${product.name}`,
            description,
            images: [`${base}/img/og/${product.id}.jpg`],
            metadata: { productId: product.id }
          }
        }
      }],
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: config.commerce.shippingCountries },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      custom_fields: [{
        key: 'notes',
        label: { type: 'custom', custom: T.notes },
        type: 'text',
        optional: true
      }],
      custom_text: {
        submit: { message: T.submit },
        shipping_address: { message: T.shipping }
      },
      payment_intent_data: {
        description: `${config.brand} ${product.name} · ${description}`,
        metadata
      },
      metadata,
      success_url: `${base}${prefix}/order/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${prefix}/gates/${product.id}`
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout error:', err);
    return bad(res, 'Could not create checkout session', 500);
  }
};
