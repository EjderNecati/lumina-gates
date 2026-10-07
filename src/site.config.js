// Lumina Gates — site-wide configuration
// Single place for everything that is "about the business" rather than "about a product".
// Used by the build (scripts/build.js) and by the API functions (api/*).

module.exports = {
  siteUrl: 'https://www.luminagates.com',
  brand: 'Lumina Gates',
  tagline: 'Bespoke gates for children & pets',

  company: {
    legalName: 'Doggo LLC',
    // Mailing address (virtual mailbox provided by the formation service) — the LLC itself is registered in Wyoming.
    address: {
      street: '169 Madison Ave STE 11534 Unit 445',
      city: 'New York',
      region: 'NY',
      postalCode: '10016',
      country: 'US'
    },
    workshop: { city: 'Bursa', country: 'Türkiye', countryCode: 'TR' },
    foundingYear: 2024
  },

  contact: {
    email: 'dogukan@luminagates.com',
    // Where order / contact-form notifications are sent. Falls back to contact.email.
    notifyEmail: process.env.ORDER_NOTIFY_EMAIL || 'dogukan@luminagates.com',
    // "From" identity for transactional email (domain must be verified in Resend).
    fromEmail: process.env.EMAIL_FROM || 'Lumina Gates <orders@luminagates.com>'
  },

  social: {
    // Leave empty to hide. Used in footer + Organization sameAs.
    instagram: '',
    pinterest: '',
    etsy: ''
  },

  locales: {
    default: 'en',
    all: ['en', 'tr'],
    // URL prefix per locale ('' = site root)
    prefix: { en: '', tr: '/tr' },
    // BCP-47 for html lang / og:locale
    tags: { en: 'en-US', tr: 'tr-TR' }
  },

  commerce: {
    currency: 'USD',
    // Countries offered at Stripe Checkout shipping step (ISO 3166-1 alpha-2)
    shippingCountries: ['US', 'CA', 'GB', 'IE', 'DE', 'FR', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IT', 'ES', 'PT', 'AU', 'NZ', 'AE', 'TR'],
    // Production lead time after order confirmation (business days)
    leadTimeBusinessDays: { min: 5, max: 10 },
    // Courier transit time (business days)
    transitBusinessDays: { min: 3, max: 8 },
    warrantyYears: 5,
    // Return window for damaged / defective / not-as-specified items (days after delivery)
    returnWindowDays: 14,
    // Free cancellation window after order (hours) before production starts
    cancellationHours: 24,
    // Shipping is included in the product price (no separate shipping line at checkout)
    shippingIncluded: true,
    // Import duties / taxes paid by recipient (DAP). Set true only if you ship DDP.
    dutiesIncluded: false,
    // Default configuration used for "from" prices and server-rendered product pages
    defaultWidthIn: 30,
    fromWidthIn: 18,
    // Show the struck-through "was" price next to the discounted price (catalog GLOBAL_DISCOUNT).
    // NOTE: a permanent reference price can be challenged under US FTC / EU pricing rules and by
    // Google Merchant Center — review before running ads. Set false to show only the selling price.
    showCompareAt: true
  },

  policies: {
    // Shown as "Last updated" on the policy pages (YYYY-MM-DD)
    updated: '2026-10-06'
  },

  analytics: {
    // Google Analytics 4 measurement id, e.g. 'G-XXXXXXXXXX'. Empty = analytics off.
    ga4Id: process.env.GA4_ID || '',
    // Google Ads conversion label for purchases, e.g. 'AW-123456789/AbC-D_efG-h12_34-567'
    adsPurchaseLabel: process.env.ADS_PURCHASE_LABEL || ''
  }
};
