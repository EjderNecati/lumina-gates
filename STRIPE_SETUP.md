# Lumina Gates — Stripe checkout setup

This is a step-by-step from "site sits on my desktop" → "real payments accepted".

## 1. Open a Stripe test account

1. Go to https://stripe.com → **Sign up**.
2. Use **luminagates@gmail.com**. You can finish account-activation paperwork later — test mode works immediately.
3. In the dashboard sidebar make sure the **Viewing test data** toggle is ON (it should say "Test mode" at the top).
4. Go to **Developers → API keys**.
5. Copy two keys (you'll need them in step 3):
   - **Publishable key** — starts with `pk_test_…`
   - **Secret key** — starts with `sk_test_…`

## 2. Deploy to Vercel

1. Create a free account at https://vercel.com (Sign in with GitHub).
2. Push this `Lumina Gates` folder to a new GitHub repo (or use Vercel's drag-and-drop deploy on `vercel.com/new`).
3. When importing, Vercel auto-detects the `api/` folder as serverless functions. Leave the framework setting as **Other**.
4. Click **Deploy**.

After the first deploy Vercel gives you a URL like `https://lumina-gates.vercel.app`.

## 3. Add environment variables

In Vercel → your project → **Settings → Environment Variables** add:

| Name                   | Value                                  |
|------------------------|----------------------------------------|
| `STRIPE_SECRET_KEY`    | `sk_test_…` from step 1                |
| `STRIPE_WEBHOOK_SECRET`| (filled in step 4)                     |
| `PUBLIC_SITE_URL`      | `https://lumina-gates.vercel.app`      |

Click **Save** then **Redeploy** the latest deployment so the function picks them up.

## 4. Configure the webhook (so we know when an order is paid)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://lumina-gates.vercel.app/api/webhook`
3. Events to send: `checkout.session.completed`
4. Click **Add endpoint** — Stripe shows a **Signing secret** starting with `whsec_…`.
5. Copy it, paste into Vercel as the `STRIPE_WEBHOOK_SECRET` env var, redeploy.

## 5. Test the checkout

1. Visit `https://lumina-gates.vercel.app/product.html?id=lux`.
2. Configure a width/height/color, click **Checkout securely →**.
3. You'll land on Stripe's hosted checkout page.
4. Use a test card:
   - **Card #:** `4242 4242 4242 4242`
   - **Expiry:** any future date (e.g. `12/30`)
   - **CVC:** any 3 digits (e.g. `123`)
   - **Postal/ZIP:** any 5 digits (e.g. `12345`)
5. Complete the checkout → you land on `/success.html`.
6. In Stripe Dashboard → **Payments** you should see the test charge.
7. In Vercel → your project → **Logs** you should see the webhook log line for the paid order.

## 6. Going live (after the US LLC is opened)

1. Finish Stripe account activation (business address, EIN, bank account).
2. In Stripe, flip **Test mode → Live mode** (top-right toggle).
3. Copy the new **live** keys (`sk_live_…`).
4. In Vercel update `STRIPE_SECRET_KEY` to the live value.
5. Create a new webhook for the **live** endpoint (`/api/webhook` again) → get the new `whsec_…` → update `STRIPE_WEBHOOK_SECRET` in Vercel.
6. Redeploy.

## 7. Adding PayPal later

Once the live US account is approved:

1. Stripe Dashboard → **Settings → Payment methods**.
2. Enable **PayPal**. (Currently most-supported for EU-based merchants; for US-based USD it's rolling out — check availability when you reach this step.)
3. In `api/create-checkout.js`, change the line:
   ```js
   payment_method_types: ['card'],
   ```
   to:
   ```js
   payment_method_types: ['card', 'paypal'],
   ```
4. Redeploy. PayPal will appear as an option on the Stripe Checkout page.

If Stripe's PayPal support isn't enough, we can run a parallel PayPal Smart Button on the same product page using `@paypal/paypal-js`. That's a separate ~80 lines of JS and a separate webhook — let me know when you reach this stage.

## Local development (optional)

If you want to test the API locally before deploying:

```bash
npm install
npm install -g vercel
vercel dev          # runs at http://localhost:3000
```

Then open `http://localhost:3000/index.html`.

For testing the API endpoint without Vercel CLI you can also add this to your browser console before clicking Pay:

```js
window.LUMINA_API_BASE = 'http://localhost:3000';
```
