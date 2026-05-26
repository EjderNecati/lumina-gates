// Lumina Gates — i18n
// Two-language system (EN / TR). Language is stored in localStorage.

const TRANSLATIONS = {
  en: {
    'announcement':        'Summer Collection — 50% Off Site-Wide · Made to Order · Worldwide Shipping',
    'nav.shop':            'Shop',
    'nav.story':           'Our Story',
    'nav.collection':      'Collection',
    'nav.contact':         'Contact',
    'brand.sub':           'Gates Atelier',

    'hero.eyebrow':        'Made to order · Designed in Scandinavia',
    'hero.title.a':        'The gate,',
    'hero.title.b':        'reconsidered.',
    'hero.lead':           'Hand-finished gates for children and pets, in optical-grade plexiglass and solid European oak. Configure the exact width, height and finish for your opening.',
    'hero.cta.shop':       'Explore the Collection →',
    'hero.cta.story':      'Our Story',

    'values.01.eyebrow':   '01 · Material',
    'values.01.title':     'Optical-grade plexiglass',
    'values.01.body':      'Scratch-resistant, edge-polished, and shaped to disappear into the architecture of your home.',
    'values.02.eyebrow':   '02 · Craft',
    'values.02.title':     'Solid European oak',
    'values.02.body':      'Sustainably sourced, finished by hand with natural oils. Mortise-and-tenon joinery.',
    'values.03.eyebrow':   '03 · Fit',
    'values.03.title':     'Configured to the inch',
    'values.03.body':      'Every gate is made to your opening. Tell us width and height — we build the rest.',
    'values.04.eyebrow':   '04 · Safety',
    'values.04.title':     'Engineered for life',
    'values.04.body':      'Double-action latches, rounded corners and pressure-tested mounts. Tested by toddlers and tabby cats.',

    'shop.eyebrow':        'The Collection',
    'shop.title':          'Twenty-nine gates, eleven in plexiglass, eighteen in wood.',
    'filter.all':          'All',
    'filter.plexi':        'Plexiglass',
    'filter.wood':         'Wood',
    'filter.cat':          'Cat',

    'card.from':           'From',
    'card.cat':            'Cat Edition',
    'card.both':           'Child & Pet',
    'card.plexi':          'Plexiglass',
    'card.wood':           'Solid Oak',
    'card.sale':           '50% off',

    'story.eyebrow':       'Our Story',
    'story.title.a':       'A gate should belong',
    'story.title.b':       'to the room it lives in.',
    'story.body':          'Lumina Gates began with a simple frustration: every safety gate on the market looked like it belonged in a warehouse. We make the gate you would have chosen for your home if you weren\'t a parent or a pet owner — and then we engineer it to keep the smallest members of your household safe. Every piece is built to your exact opening, in our workshop, by hand.',

    'footer.shop':         'Shop',
    'footer.atelier':      'Atelier',
    'footer.contact':      'Contact',
    'footer.all':          'All Gates',
    'footer.plexi':        'Plexiglass',
    'footer.wood':         'Wood',
    'footer.cat':          'Cat Edition',
    'footer.tagline':      'Gates atelier. Made to order. Shipped worldwide from our Scandinavian workshop.',
    'footer.copy':         '© 2026 Lumina Gates · All rights reserved',
    'footer.byline':       'Designed in Scandinavia · Shipped worldwide',

    // ── Product page ──
    'crumb.sep':           ' · ',
    'price.off':           '50% off',
    'price.tier':          'Tier price',
    'price.discount':      '50% summer discount',
    'price.oversizeW':     'Width oversize surcharge (beyond 54")',
    'price.heightFlat':    'Custom height fee',
    'price.heightOver':    'Height oversize surcharge ($100 per 6")',

    'cfg.width':           'Width',
    'cfg.choose.width':    'Choose width',
    'cfg.or.cm':           'or enter in cm',
    'cfg.standard':        'standard',
    'cfg.height':          'Height',
    'cfg.height.sub':      '— standard 27.5 in / 70 cm · +$20 if changed, +$100 per 6 in',
    'cfg.choose.height':   'Choose height',
    'cfg.finish':          'Finish',
    'cfg.other.placeholder': "Describe the finish you'd like — e.g. RAL 7016, sage green matte",

    'color.white':         'Pure White',
    'color.black':         'Jet Black',
    'color.anthracite':    'Anthracite',
    'color.natural':       'Natural Oak',
    'color.unfinished':    'Unfinished',
    'color.other':         'Other',
    'color.otherPick':     'Other (please specify)',

    'sum.model':           'Model',
    'sum.material':        'Material',
    'sum.material.plexi':  'Optical-grade plexiglass',
    'sum.material.wood':   'Solid European oak',
    'sum.width':           'Width',
    'sum.height':          'Height',
    'sum.finish':          'Finish',
    'sum.total':           'Total',

    'btn.checkout':        'Checkout →',
    'btn.custom':          'Custom-made wish via email',
    'btn.custom.body':     "Want something different from our standard line? Tell us what you have in mind — a colour, a pattern, a hardware finish — and we'll build it for you.",

    'feat.made':           'Made to order',
    'feat.made.body':      'Built to your exact opening in our atelier.',
    'feat.lead':           'Lead time',
    'feat.lead.body':      '1–2 weeks from order confirmation.',
    'feat.ship':           'Shipping',
    'feat.ship.body':      'Worldwide, white-glove available.',
    'feat.warr':           'Warranty',
    'feat.warr.body':      '5 years on frame & hardware.',

    'pay.redirect':        'Redirecting to checkout…',
    'pay.error':           'Checkout is not configured yet on this preview. (Once deployed to Vercel with Stripe keys, this button will open Stripe Checkout.)',
    'pay.other.empty':     'Please describe the finish you\'d like in the "Other" field.',

    // Custom-wish email
    'mail.subject':        'Custom-made gate inquiry',
    'mail.body':           `Hi Lumina,

I'd love a custom gate that isn't part of your standard collection. Here's what I have in mind:

Style / inspiration:
  (describe the look — slat pattern, lattice, barn, glass, etc.)

Material:
  (wood / plexiglass / mixed)

Approximate dimensions:
  Width:  ___ in / ___ cm
  Height: ___ in / ___ cm

Finish / colour:
  (e.g. matte black, natural oak, RAL 7016, brushed brass hardware)

For (children / cats / dogs):

Anything else we should know:


Thank you,`,

    // Success page
    'succ.announce':       'Thank you · Your bespoke gate is now in production',
    'succ.eyebrow':        'Order confirmed',
    'succ.title.a':        'Thank you for',
    'succ.title.b':        'choosing Lumina.',
    'succ.body':           'Your bespoke gate is being prepared in our atelier. You\'ll receive a confirmation email within minutes, and a production update within 48 hours. Lead time is <strong>1–2 weeks</strong> from confirmation.',
    'succ.back':           'Back to the Collection →',

    // misc
    'units.in':            'in',
    'units.cm':            'cm'
  },

  tr: {
    'announcement':        'Yaz Koleksiyonu — Tüm Site %50 İndirim · Siparişe Özel Üretim · Dünya Çapında Kargo',
    'nav.shop':            'Mağaza',
    'nav.story':           'Hikayemiz',
    'nav.collection':      'Koleksiyon',
    'nav.contact':         'İletişim',
    'brand.sub':           'Kapı Atölyesi',

    'hero.eyebrow':        'Siparişe özel · İskandinav tasarımı',
    'hero.title.a':        'Kapıyı',
    'hero.title.b':        'yeniden tanımladık.',
    'hero.lead':           'Optik kalite pleksiglas ve doğal Avrupa meşesinden, çocuk ve evcil hayvanlar için el işçiliği kapılar. Boşluğunuza tam oturan genişlik, yükseklik ve renk seçeneklerini siz belirleyin.',
    'hero.cta.shop':       'Koleksiyonu Keşfet →',
    'hero.cta.story':      'Hikayemiz',

    'values.01.eyebrow':   '01 · Malzeme',
    'values.01.title':     'Optik kalite pleksiglas',
    'values.01.body':      'Çizilmeye dayanıklı, kenarları cilalı; evinizin mimarisine kusursuz uyum sağlar.',
    'values.02.eyebrow':   '02 · İşçilik',
    'values.02.title':     'Doğal Avrupa meşesi',
    'values.02.body':      'Sürdürülebilir kaynaktan, doğal yağ ile elle cilalanmış. Geleneksel zıvana birleştirme.',
    'values.03.eyebrow':   '03 · Ölçü',
    'values.03.title':     'İnce ayar — santimi santimine',
    'values.03.body':      'Her kapı sizin için yapılır. Genişlik ve yüksekliği söyleyin — gerisini biz hallederiz.',
    'values.04.eyebrow':   '04 · Güvenlik',
    'values.04.title':     'Gerçek hayata göre',
    'values.04.body':      'Çift hareketli mandallar, yuvarlatılmış köşeler ve test edilmiş montaj. Yürümeye yeni başlayanlarla ve tekir kedilerle test edildi.',

    'shop.eyebrow':        'Koleksiyon',
    'shop.title':          'Yirmi dokuz kapı, on biri pleksiglas, on sekizi ahşap.',
    'filter.all':          'Tümü',
    'filter.plexi':        'Pleksiglas',
    'filter.wood':         'Ahşap',
    'filter.cat':          'Kedi',

    'card.from':           'Başlangıç',
    'card.cat':            'Kedi Serisi',
    'card.both':           'Çocuk & Evcil',
    'card.plexi':          'Pleksiglas',
    'card.wood':           'Masif Meşe',
    'card.sale':           '%50 indirim',

    'story.eyebrow':       'Hikayemiz',
    'story.title.a':       'Bir kapı, içinde bulunduğu',
    'story.title.b':       'odaya ait olmalı.',
    'story.body':          'Lumina Gates basit bir hayal kırıklığıyla başladı: piyasadaki her güvenlik kapısı sanki bir depoya aitmiş gibi duruyordu. Biz, ebeveyn veya evcil hayvan sahibi olmasaydınız evinize seçeceğiniz kapıyı yapıyoruz — ve onu evinizin en küçük üyelerini güvende tutacak şekilde tasarlıyoruz. Her parça, atölyemizde, sizin tam ölçünüze göre el ile üretiliyor.',

    'footer.shop':         'Mağaza',
    'footer.atelier':      'Atölye',
    'footer.contact':      'İletişim',
    'footer.all':          'Tüm Kapılar',
    'footer.plexi':        'Pleksiglas',
    'footer.wood':         'Ahşap',
    'footer.cat':          'Kedi Serisi',
    'footer.tagline':      'Kapı atölyesi. Siparişe özel üretim. İskandinav atölyemizden dünyaya gönderiyoruz.',
    'footer.copy':         '© 2026 Lumina Gates · Tüm hakları saklıdır',
    'footer.byline':       'İskandinav tasarımı · Dünyaya gönderim',

    'crumb.sep':           ' · ',
    'price.off':           '%50 indirim',
    'price.tier':          'Kademe fiyatı',
    'price.discount':      '%50 yaz indirimi',
    'price.oversizeW':     'Genişlik ek ücreti (54" üzeri)',
    'price.heightFlat':    'Özel yükseklik ücreti',
    'price.heightOver':    'Yükseklik ek ücreti (her 6" için $100)',

    'cfg.width':           'Genişlik',
    'cfg.choose.width':    'Genişliği seçin',
    'cfg.or.cm':           'veya cm cinsinden girin',
    'cfg.standard':        'standart',
    'cfg.height':          'Yükseklik',
    'cfg.height.sub':      '— standart 27.5 in / 70 cm · değişirse +$20, her 6 in için +$100',
    'cfg.choose.height':   'Yüksekliği seçin',
    'cfg.finish':          'Renk',
    'cfg.other.placeholder': 'İstediğiniz rengi tanımlayın — örn. RAL 7016, adaçayı yeşili mat',

    'color.white':         'Saf Beyaz',
    'color.black':         'Antrasit Siyah',
    'color.anthracite':    'Antrasit',
    'color.natural':       'Doğal Meşe',
    'color.unfinished':    'Cilasız',
    'color.other':         'Diğer',
    'color.otherPick':     'Diğer (lütfen belirtin)',

    'sum.model':           'Model',
    'sum.material':        'Malzeme',
    'sum.material.plexi':  'Optik kalite pleksiglas',
    'sum.material.wood':   'Masif Avrupa meşesi',
    'sum.width':           'Genişlik',
    'sum.height':          'Yükseklik',
    'sum.finish':          'Renk',
    'sum.total':           'Toplam',

    'btn.checkout':        'Ödeme yap →',
    'btn.custom':          'Özel tasarım talebi (e-posta)',
    'btn.custom.body':     'Standart koleksiyonumuzdan farklı bir kapı mı arıyorsunuz? Aklınızdakini bize anlatın — renk, desen, donanım — sizin için üretelim.',

    'feat.made':           'Siparişe özel',
    'feat.made.body':      'Tam ölçünüze göre atölyemizde üretilir.',
    'feat.lead':           'Üretim süresi',
    'feat.lead.body':      'Sipariş onayından itibaren 1–2 hafta.',
    'feat.ship':           'Kargo',
    'feat.ship.body':      'Dünya çapında, beyaz eldiven seçeneği mevcut.',
    'feat.warr':           'Garanti',
    'feat.warr.body':      'Çerçeve ve donanım için 5 yıl.',

    'pay.redirect':        'Ödeme sayfasına yönlendiriliyorsunuz…',
    'pay.error':           'Ödeme bu önizlemede henüz aktif değil. (Vercel\'e Stripe anahtarlarıyla deploy edildiğinde bu buton Stripe ödeme sayfasını açacak.)',
    'pay.other.empty':     'Lütfen "Diğer" alanında istediğiniz rengi tanımlayın.',

    'mail.subject':        'Özel tasarım kapı talebi',
    'mail.body':           `Merhaba Lumina,

Standart koleksiyonunuzda olmayan özel bir kapı istiyorum. Aklımdakiler:

Stil / ilham:
  (görünümü tanımlayın — slat deseni, kafes, ahır, cam, vs.)

Malzeme:
  (ahşap / pleksiglas / karma)

Yaklaşık ölçüler:
  Genişlik: ___ in / ___ cm
  Yükseklik: ___ in / ___ cm

Renk / cila:
  (örn. mat siyah, doğal meşe, RAL 7016, fırçalanmış pirinç donanım)

Kimler için (çocuklar / kediler / köpekler):

Bilmemiz gereken başka şeyler:


Teşekkürler,`,

    'succ.announce':       'Teşekkürler · Özel kapınız üretime alındı',
    'succ.eyebrow':        'Sipariş onaylandı',
    'succ.title.a':        'Lumina\'yı seçtiğiniz',
    'succ.title.b':        'için teşekkürler.',
    'succ.body':           'Özel kapınız atölyemizde hazırlanıyor. Birkaç dakika içinde onay e-postası ve 48 saat içinde üretim güncellemesi alacaksınız. Üretim süresi onaydan itibaren <strong>1–2 hafta</strong>.',
    'succ.back':           'Koleksiyona Dön →',

    'units.in':            'in',
    'units.cm':            'cm'
  }
};

const I18N = {
  lang: 'en',

  init() {
    const stored = (typeof localStorage !== 'undefined') && localStorage.getItem('lumina_lang');
    if (stored === 'tr' || stored === 'en') this.lang = stored;
    document.documentElement.setAttribute('lang', this.lang);
  },

  t(key) {
    const dict = TRANSLATIONS[this.lang] || TRANSLATIONS.en;
    return (key in dict) ? dict[key] : (TRANSLATIONS.en[key] || key);
  },

  set(lang) {
    if (lang !== 'en' && lang !== 'tr') return;
    this.lang = lang;
    try { localStorage.setItem('lumina_lang', lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    this.applyDOM();
    window.dispatchEvent(new CustomEvent('lumina:langchange', { detail: { lang } }));
  },

  toggle() { this.set(this.lang === 'en' ? 'tr' : 'en'); },

  applyDOM(root = document) {
    // [data-i18n="key"] → textContent
    root.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    // [data-i18n-html="key"] → innerHTML (use sparingly, only for known-safe strings)
    root.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
    });
    // [data-i18n-attr="attr|key"] → setAttribute
    root.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split('|').map(s => s.trim());
        if (attr && key) el.setAttribute(attr, this.t(key));
      });
    });
    // Update toggle button label
    document.querySelectorAll('[data-lang-toggle]').forEach(el => {
      el.textContent = this.lang === 'en' ? 'TR' : 'EN';
      el.setAttribute('aria-label', this.lang === 'en' ? 'Switch to Turkish' : 'Switch to English');
    });
    // Document title (page-specific) — pages set window.LUMINA_TITLE_KEY
    if (window.LUMINA_TITLE_KEY) {
      document.title = this.t(window.LUMINA_TITLE_KEY);
    }
  },

  // Localized helpers
  fmt$(n) { return '$' + Math.round(n).toLocaleString(this.lang === 'tr' ? 'tr-TR' : 'en-US'); }
};

// Auto-init on script load
I18N.init();
document.addEventListener('DOMContentLoaded', () => {
  I18N.applyDOM();
  // Wire any [data-lang-toggle] buttons
  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => I18N.toggle());
  });
});

window.LUMINA_I18N = I18N;
window.t = (k) => I18N.t(k);
