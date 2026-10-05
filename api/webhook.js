// POST /api/webhook — Stripe events.
//
// Stripe Dashboard → Developers → Webhooks → endpoint https://www.luminagates.com/api/webhook
// Events: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.async_payment_failed
//
// Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (whsec_…), RESEND_API_KEY, ORDER_NOTIFY_EMAIL, EMAIL_FROM
'use strict';

const Stripe = require('stripe');
const config = require('../src/site.config.js');
const { summarize } = require('./_lib/order.js');
const { sendEmail, template, textVersion } = require('./_lib/email.js');

module.exports.config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

const COPY = {
  en: {
    subject: ref => `Order ${ref} received — Lumina Gates`,
    title: 'Thank you — your gate is in production.',
    intro: ref => `We have received your order ${ref}. Here is what you configured:`,
    next: [
      'What happens next: within 48 hours we will email you to confirm the final dimensions and finish. Please read that email carefully — production starts once it is confirmed.',
      `Production takes ${config.commerce.leadTimeBusinessDays.min}–${config.commerce.leadTimeBusinessDays.max} business days. Your gate then ships by tracked express courier (${config.commerce.transitBusinessDays.min}–${config.commerce.transitBusinessDays.max} business days); you will receive the tracking number on the day it leaves the workshop.`,
      `Shipping is included. Import duties or taxes, where your country applies them, are paid by the recipient on delivery.`,
      `Questions? Just reply to this email or write to ${config.contact.email}.`
    ],
    shipTo: 'Shipping to'
  },
  tr: {
    subject: ref => `${ref} numaralı siparişiniz alındı — Lumina Gates`,
    title: 'Teşekkürler — kapınız üretime alındı.',
    intro: ref => `${ref} numaralı siparişinizi aldık. Yapılandırmanız:`,
    next: [
      'Sırada ne var: 48 saat içinde son ölçüleri ve rengi teyit etmek için size e-posta göndereceğiz. Lütfen o e-postayı dikkatle okuyun — üretim teyitten sonra başlar.',
      `Üretim ${config.commerce.leadTimeBusinessDays.min}–${config.commerce.leadTimeBusinessDays.max} iş günü sürer. Ardından kapınız takipli ekspres kuryeyle gönderilir (${config.commerce.transitBusinessDays.min}–${config.commerce.transitBusinessDays.max} iş günü); atölyeden çıktığı gün takip numarasını alırsınız.`,
      'Kargo dahildir. Varsa gümrük vergileri teslimatta alıcı tarafından ödenir.',
      `Sorunuz mu var? Bu e-postayı yanıtlayın veya ${config.contact.email} adresine yazın.`
    ],
    shipTo: 'Teslimat adresi'
  }
};

function addressLine(s) {
  if (!s) return '';
  return [s.name, s.line1, s.line2, [s.postal_code, s.city].filter(Boolean).join(' '), s.state, s.country].filter(Boolean).join(', ');
}

async function notifyPaid(session) {
  const o = summarize(session);
  const C = COPY[o.locale];
  const rows = o.lines.map(l => [l.label, l.value]);
  if (o.shipping) rows.push([C.shipTo, addressLine(o.shipping)]);

  // 1) Owner notification — everything needed to start production
  const ownerRows = [
    ['Reference', o.reference],
    ['Customer', `${o.customer.name} · ${o.customer.email} · ${o.customer.phone}`],
    ...rows,
    ['Stripe session', o.sessionId],
    ['Locale', o.locale]
  ];
  const ownerMsg = { title: `New order ${o.reference} — ${o.productName} ${o.config.widthIn}" × ${o.config.heightIn}"`, intro: `${o.customer.name} paid ${o.currency} ${o.amount}.`, rows: ownerRows, paragraphs: ['Reply to this email to reach the customer directly.'] };
  await sendEmail({
    to: config.contact.notifyEmail,
    replyTo: o.customer.email || undefined,
    subject: `🛠 New order ${o.reference}: ${o.productName} ${o.config.widthIn}×${o.config.heightIn} in — ${o.currency} ${o.amount}`,
    html: template(ownerMsg), text: textVersion(ownerMsg),
    tags: [{ name: 'type', value: 'order_owner' }]
  });

  // 2) Customer confirmation
  if (o.customer.email) {
    const msg = { title: C.title, intro: C.intro(o.reference), rows, paragraphs: C.next };
    await sendEmail({
      to: o.customer.email,
      replyTo: config.contact.email,
      subject: C.subject(o.reference),
      html: template(msg), text: textVersion(msg),
      tags: [{ name: 'type', value: 'order_customer' }]
    });
  }
  console.log('✅ Paid order', o.reference, o.productId, o.amount, o.currency, o.customer.email);
}

async function notifyFailed(session) {
  const o = summarize(session);
  const msg = { title: `Payment failed for ${o.reference}`, intro: `${o.customer.name || 'A customer'} (${o.customer.email}) started an order but the asynchronous payment failed.`, rows: o.lines.map(l => [l.label, l.value]) };
  await sendEmail({ to: config.contact.notifyEmail, subject: `⚠️ Payment failed — ${o.reference}`, html: template(msg), text: textVersion(msg) });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send('Webhook not configured');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const session = event.data.object;
    switch (event.type) {
      case 'checkout.session.completed':
        // Synchronous methods (cards, wallets, PayPal) are paid here; delayed methods arrive via async_payment_succeeded
        if (session.payment_status === 'paid') await notifyPaid(session);
        break;
      case 'checkout.session.async_payment_succeeded':
        await notifyPaid(session);
        break;
      case 'checkout.session.async_payment_failed':
        await notifyFailed(session);
        break;
      default:
        break;
    }
  } catch (err) {
    // Never fail the webhook because an email failed — Stripe would keep retrying.
    console.error('Webhook handler error:', err);
  }
  return res.status(200).json({ received: true });
};
