// POST /api/webhook  — Stripe sends payment events here.
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET   whsec_...  (copy from Stripe Dashboard → Developers → Webhooks)
//
// Vercel needs the raw body to verify the signature, hence the config below.

const Stripe = require('stripe');

module.exports.config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const md = session.metadata || {};

    // TODO: persist to your database / email yourself.
    //       For now we just log so it shows up in Vercel logs.
    console.log('✅ Paid order:', {
      sessionId: session.id,
      amount:    session.amount_total / 100,
      currency:  session.currency,
      email:     session.customer_details?.email,
      name:      session.customer_details?.name,
      phone:     session.customer_details?.phone,
      shipping:  session.shipping_details,
      product:   md.productId,
      material:  md.material,
      width:     md.widthIn,
      height:    md.heightIn,
      color:     md.colorName
    });
  }

  return res.status(200).json({ received: true });
};
