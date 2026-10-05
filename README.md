# Lumina Gates — storefront

Static, multi-page store for made-to-measure child & pet gates. Pages are pre-rendered at build time
(EN at `/`, TR at `/tr/…`), payments run through Stripe Checkout via Vercel functions.

```
src/
  site.config.js      business facts: legal name, address, contact, shipping countries, lead times, analytics ids
  catalog.js          29 products + pricing engine (single source of truth; used by build, browser and API)
  i18n/en.js, tr.js   every string on the site, incl. policies, FAQ, measuring guide
  templates/          page renderers (layout, home, collection, product, pages)
  css/style.css       one stylesheet, no inline styles (strict CSP)
  js/                 site.js (menu, filters, contact form, analytics), configurator.js, thankyou.js
  public/             copied verbatim: fonts, icons, generated images (img/), favicon
  images.json         generated manifest of product photo renditions
api/
  create-checkout.js  POST → Stripe Checkout session (price recomputed server-side)
  webhook.js          Stripe events → order emails (owner + customer) via Resend
  order.js            GET order summary for the thank-you page
  contact.js          contact form → email
scripts/
  build.js            renders build/ (what Vercel serves)      npm run build
  images.js           assets/products → src/public/img (WebP)  npm run images
  check.js            post-build QA (links, meta, schema, CSP)  npm run check
  serve.js            local preview of build/                  npm run serve
assets/products/      source photos (not deployed)
tools/, dist/         print collateral (catalogue, thank-you cards) — unrelated to the site
```

## Commands

```bash
npm install
npm run images     # only when photos change (needs sharp; writes src/public/img + src/images.json — commit both)
npm run build      # → build/
npm run check      # QA: must pass before deploying
npm run serve      # http://localhost:4321
```

Vercel runs `npm run build` and serves `build/` (see `vercel.json`). Functions in `api/` deploy automatically.

## Environment variables (Vercel → Settings → Environment Variables)

| Name                    | Required | Value |
|-------------------------|----------|-------|
| `STRIPE_SECRET_KEY`     | yes      | `sk_test_…` while testing, `sk_live_…` when live |
| `STRIPE_WEBHOOK_SECRET` | yes      | `whsec_…` from the webhook endpoint (one per mode) |
| `PUBLIC_SITE_URL`       | no       | defaults to `https://www.luminagates.com` |
| `RESEND_API_KEY`        | for emails | from resend.com — verify the `luminagates.com` domain there first |
| `EMAIL_FROM`            | no       | default `Lumina Gates <orders@luminagates.com>` |
| `ORDER_NOTIFY_EMAIL`    | no       | where order / contact notifications go (default: contact email in config) |
| `GA4_ID`                | no       | `G-XXXXXXXXXX` → enables Google Analytics (purchase events included) |
| `ADS_PURCHASE_LABEL`    | no       | `AW-…/…` → fires the Google Ads purchase conversion on the thank-you page |

Without `RESEND_API_KEY` the functions log emails instead of sending them. Stripe can also send its own
receipts (Dashboard → Settings → Emails).

## Stripe

1. Dashboard → **Settings → Payment methods**: enable Cards, Apple Pay, Google Pay, Link, PayPal (PayPal needs
   the account to be activated). Nothing in the code changes — Checkout shows whatever is enabled.
2. **Developers → Webhooks → Add endpoint**: `https://www.luminagates.com/api/webhook`, events
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Test with card `4242 4242 4242 4242` on `/gates/lux`; the order must appear on the thank-you page and
   in Vercel → Logs (and in your inbox once Resend is configured).
4. Go live: swap both keys for live ones, create a live webhook endpoint, redeploy.

## Changing things

* **Prices** — `src/catalog.js` (`PRICE_TIERS`, `GLOBAL_DISCOUNT`, height/oversize fees). Rebuild.
  `site.config.js → commerce.showCompareAt` controls the struck-through "was" price.
* **Business facts** (address, lead time, warranty, shipping countries, policy dates) — `src/site.config.js`.
* **Copy** — `src/i18n/en.js` and `tr.js`. Keys missing in TR fall back to EN with a build warning.
* **New product** — add it to `src/catalog.js` with `folder`/`images` pointing at `assets/products/…`,
  run `npm run images`, commit the generated files, rebuild.
* **Announcement bar** — `i18n → announcement`.

## After deploying

* Google Search Console: add `https://www.luminagates.com`, submit `/sitemap.xml`.
* Test structured data: https://search.google.com/test/rich-results on a product URL.
* If running Google Shopping / Merchant Center: product URLs are `/gates/<id>`, prices are "from" prices for a
  configurable product — use the configurator price range or feed one representative size per product.
