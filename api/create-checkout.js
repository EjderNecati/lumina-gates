// POST /api/create-checkout
//
// Body JSON:
// {
//   productId:   "lux",            // catalog id
//   productName: "Lux",            // display name (sent for UI/Stripe summary)
//   material:    "wood",           // "wood" | "plexi"
//   widthIn:     30,
//   heightIn:    27.5,
//   colorName:   "Jet Black",      // or "Other — RAL 7016 matte"
// }
//
// Returns: { url: "https://checkout.stripe.com/..." }
//
// Required environment variables (set in Vercel dashboard):
//   STRIPE_SECRET_KEY        sk_test_... (test mode) or sk_live_... (live)
//   PUBLIC_SITE_URL          https://your-domain.com  (no trailing slash)

const Stripe = require('stripe');
const { computePrice } = require('./_pricing.js');

module.exports = async function handler(req, res) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      productId, productName, material,
      widthIn, heightIn, colorName
    } = req.body || {};

    if (!productId || !material || !widthIn) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20'
    });

    // ── Re-compute price server-side (never trust client) ──
    const pricing = computePrice(material, widthIn, heightIn);
    const amountCents = Math.round(pricing.final * 100);

    const round1 = n => Math.round(n * 10) / 10;
    const inToCm = i => Math.round(i * 2.54);

    const description =
      `${round1(widthIn)}" × ${round1(heightIn)}" ` +
      `(${inToCm(widthIn)}×${inToCm(heightIn)} cm) · ` +
      `Finish: ${colorName || 'Pure White'}`;

    const siteUrl = process.env.PUBLIC_SITE_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],   // add 'paypal' once enabled in Stripe dashboard
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: amountCents,
          product_data: {
            name: `Lumina Gates — ${productName || productId}`,
            description,
            metadata: {
              productId, material,
              widthIn: String(widthIn),
              heightIn: String(heightIn),
              colorName: colorName || ''
            }
          }
        },
        quantity: 1
      }],
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'IT', 'ES', 'AU', 'TR'] },
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${siteUrl}/product.html?id=${encodeURIComponent(productId)}`,
      metadata: {
        productId,
        material,
        widthIn:  String(widthIn),
        heightIn: String(heightIn),
        colorName: colorName || '',
        originalPrice: String(pricing.original),
        finalPrice:    String(pricing.final)
      }
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
};
