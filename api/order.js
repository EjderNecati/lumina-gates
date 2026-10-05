// GET /api/order?session_id=cs_…  →  order summary for the thank-you page (no addresses / contact data)
'use strict';

const Stripe = require('stripe');
const { summarize } = require('./_lib/order.js');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Not configured' });

  const id = String(req.query?.session_id || '');
  if (!/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(id)) return res.status(400).json({ error: 'Invalid session id' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.payment_status !== 'paid' && session.status !== 'complete') return res.status(404).json({ error: 'Order not found' });
    const o = summarize(session);
    return res.status(200).json({
      reference: o.reference,
      productId: o.productId,
      productName: o.productName,
      amount: o.amount,
      currency: o.currency,
      lines: o.lines
    });
  } catch (err) {
    console.error('order lookup error:', err.message);
    return res.status(404).json({ error: 'Order not found' });
  }
};
