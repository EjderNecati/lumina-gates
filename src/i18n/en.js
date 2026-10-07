// Lumina Gates - English copy (default locale)
// Every user-facing string lives here or in tr.js. Templates never hard-code text.

module.exports = {
  code: 'en',
  dir: 'ltr',
  name: 'English',
  short: 'EN',
  switchLabel: 'Türkçe',
  switchAria: 'Bu sayfayı Türkçe görüntüle',

  meta: {
    siteName: 'Lumina Gates',
    home: {
      title: 'Custom Child & Pet Gates in Wood & Plexiglass | Lumina Gates',
      description: 'Made-to-order child and pet gates in optical-grade plexiglass and solid oak. Configure the exact width, height and finish. Handcrafted in Türkiye, shipped worldwide.'
    }
  },

  announcement: 'Made to order · Handcrafted in Türkiye · Shipped worldwide',

  nav: {
    shop: 'Shop', collection: 'Collection', story: 'Our Story', faq: 'FAQ',
    measure: 'How to Measure', contact: 'Contact', menu: 'Menu', close: 'Close',
    skip: 'Skip to content', home: 'Home', language: 'Language'
  },

  hero: {
    eyebrow: 'Made to order · Handcrafted in Türkiye',
    titleA: 'The gate,', titleB: 'reconsidered.',
    lead: 'Hand-finished gates for children and pets, in optical-grade plexiglass and solid European oak. Configure the exact width, height and finish for your opening.',
    ctaShop: 'Explore the Collection', ctaStory: 'Our Story',
    imageAlt: 'Lux painted-wood lattice gate by Lumina Gates installed in a bright hallway'
  },

  values: [
    { eyebrow: '01 · Material', title: 'Optical-grade plexiglass', body: 'Scratch-resistant, edge-polished, and shaped to disappear into the architecture of your home.' },
    { eyebrow: '02 · Craft',    title: 'Solid European oak',       body: 'Sustainably sourced, finished by hand with natural oils. Mortise-and-tenon joinery.' },
    { eyebrow: '03 · Fit',      title: 'Configured to the inch',   body: 'Every gate is made to your opening. Tell us width and height; we build the rest.' },
    { eyebrow: '04 · Safety',   title: 'Engineered for life',      body: 'Double-action latches, rounded corners and wall-mount hardware tested for years of daily use. Tested by toddlers and tabby cats.' }
  ],

  shop: {
    eyebrow: 'The Collection',
    // {total} {plexi} {wood} are replaced at build time
    title: '{total} gates, {plexi} in plexiglass, {wood} in wood.',
    viewAll: 'View all gates',
    filterLabel: 'Filter the collection'
  },

  filters: { all: 'All', plexi: 'Plexiglass', wood: 'Wood', cat: 'Cat Edition' },

  card: {
    from: 'From', cat: 'Cat Edition', both: 'Child & Pet',
    plexi: 'Plexiglass', wood: 'Solid Wood', sale: '50% off',
    configure: 'Configure'
  },

  howItWorks: {
    eyebrow: 'How it works',
    title: 'Three steps to a gate that fits.',
    steps: [
      { h: 'Measure the opening', p: 'Width at three heights; the smallest number wins. Two minutes with a tape measure.', link: 'Measuring guide' },
      { h: 'Configure online', p: 'Pick a model, enter width and height, choose a finish. The price updates as you go; checkout takes a minute.' },
      { h: 'We build and ship', p: 'Your gate is made by hand in {leadMin}-{leadMax} business days and shipped worldwide by tracked express courier, hardware included.' }
    ]
  },

  story: {
    eyebrow: 'Our Story',
    titleA: 'A gate should belong', titleB: 'to the room it lives in.',
    body: 'Lumina Gates began with a simple frustration: every safety gate on the market looked like it belonged in a warehouse. We make the gate you would have chosen for your home if you weren\'t a parent or a pet owner, and then we engineer it to keep the smallest members of your household safe. Every piece is built to your exact opening, in our workshop, by hand.',
    readMore: 'Read our story'
  },

  footer: {
    shop: 'Shop', atelier: 'Atelier', help: 'Help', contact: 'Contact',
    all: 'All Gates', plexi: 'Plexiglass', wood: 'Wood', cat: 'Cat Edition',
    story: 'Our Story', faq: 'FAQ', measure: 'How to Measure', shipping: 'Shipping',
    returns: 'Returns & Warranty', terms: 'Terms of Service', privacy: 'Privacy Policy',
    tagline: 'Gates atelier. Made to order. Shipped worldwide from our workshop in Bursa, Türkiye.',
    operatedBy: 'Lumina Gates is a brand of {legalName}',
    copy: '© {year} Lumina Gates · All rights reserved',
    byline: 'Handcrafted in Türkiye · Shipped worldwide',
    email: 'Email us', workshop: 'Workshop'
  },

  collections: {
    all: {
      title: 'All Gates - Custom child & pet gates | Lumina Gates',
      description: 'Browse all {total} made-to-order gates in plexiglass and solid wood. Every gate is built to your exact width and height, with your choice of finish.',
      h1: 'The Collection',
      intro: 'Every gate is made to order in our workshop and configured to your opening: width, height and finish are yours to choose.'
    },
    plexi: {
      title: 'Plexiglass Gates - Clear acrylic baby & pet gates | Lumina Gates',
      description: 'Clear plexiglass child and pet gates in slim wood frames. Optical-grade acrylic, edge-polished, made to your exact measurements.',
      h1: 'Plexiglass Gates',
      intro: 'Optical-grade acrylic panels in slim painted or oak frames. The gate that disappears into the room, and still keeps toddlers and pets exactly where they should be.'
    },
    wood: {
      title: 'Wooden Gates - Solid oak & painted wood baby gates | Lumina Gates',
      description: 'Solid European oak and painted-wood child and pet gates: lattice, slat, barn and sliding designs, all made to measure.',
      h1: 'Wooden Gates',
      intro: 'Lattice, slat, barn and sliding designs in solid European oak or hand-painted wood. Joinery that looks like it was built with the house.'
    },
    cat: {
      title: 'Cat Edition - Gates with a built-in cat door | Lumina Gates',
      description: 'Child and dog gates with a discreet cat passage, so cats come and go while the gate stays closed. Made to measure in wood or oak.',
      h1: 'Cat Edition',
      intro: 'A gate that keeps toddlers and dogs on one side while the cat strolls through. Each Cat Edition has a discreet passage cut into the lower panel.'
    },
    countLabel: '{count} gates',
    breadcrumbHome: 'Home', breadcrumbAll: 'All Gates'
  },

  product: {
    titleSuffix: ' - Custom {material} gate | Lumina Gates',
    materialNoun: { plexi: 'plexiglass', wood: 'wood' },
    // description template: {tagline} {material}
    descriptionTemplate: '{tagline} Made to order to your width and height, in your choice of finish. Handcrafted in Türkiye, ships worldwide.',
    imageAlt: '{name} {material} gate for children and pets by Lumina Gates, photo {n}',
    galleryLabel: 'Product photos', thumbLabel: 'Show photo {n}',

    priceOff: '50% off', priceTier: 'Tier price', priceDiscount: 'Introductory discount',
    priceOversizeW: 'Width oversize surcharge (beyond 54")',
    priceHeightFlat: 'Custom height fee',
    priceHeightOver: 'Height oversize surcharge ($100 per 6")',
    priceNote: 'Price updates as you configure. Shipping included.',

    cfgWidth: 'Width', cfgChooseWidth: 'Width in inches', cfgOrCm: 'or in centimetres',
    cfgStandard: 'standard', cfgHeight: 'Height',
    cfgHeightSub: 'standard 27.5 in / 70 cm · +$20 if changed, +$100 per 6 in',
    cfgChooseHeight: 'Height in inches', cfgFinish: 'Finish',
    cfgOtherPlaceholder: 'Describe the finish you\'d like, e.g. RAL 7016, sage green matte',
    cfgEngraving: 'Engraving', cfgEngravingPlaceholder: 'The name, word or date to engrave',
    cfgEngravingHelp: 'Up to 40 characters. Leave empty for a plain panel.',
    cfgMeasureHelp: 'Enter the width of the opening itself; we account for hardware and clearance.',
    cfgMeasureLink: 'How to measure',

    colors: { white: 'Pure White', black: 'Jet Black', anthracite: 'Anthracite', natural: 'Natural Oak', unfinished: 'Unfinished', other: 'Other', otherPick: 'Other (please specify)' },

    sumModel: 'Model', sumMaterial: 'Material', sumMaterialPlexi: 'Optical-grade plexiglass',
    sumMaterialWood: 'Solid European oak', sumWidth: 'Width', sumHeight: 'Height',
    sumFinish: 'Finish', sumEngraving: 'Engraving', sumTotal: 'Total', sumSummary: 'Your configuration',

    btnCheckout: 'Checkout securely', btnCustom: 'Request a custom design',
    btnCustomBody: 'Want something different from our standard line? Tell us what you have in mind (a colour, a pattern, a hardware finish) and we\'ll build it for you.',
    paymentMethods: 'Card · Apple Pay · Google Pay · PayPal',
    secureNote: 'Payments are processed by Stripe. We never see your card details.',

    featMade: 'Made to order', featMadeBody: 'Built to your exact opening in our workshop.',
    featLead: 'Lead time', featLeadBody: '{leadMin}-{leadMax} business days from order confirmation.',
    featShip: 'Shipping', featShipBody: 'Worldwide, tracked express courier, included in the price.',
    featWarr: 'Warranty', featWarrBody: '{years} years on frame & hardware.',

    payRedirect: 'Redirecting to checkout…',
    payError: 'We couldn\'t start the checkout. Please try again or email us at {email}.',
    payOtherEmpty: 'Please describe the finish you\'d like in the "Other" field.',

    mailSubject: 'Custom-made gate inquiry',
    mailBody: 'Hi Lumina,\n\nI\'d love a custom gate that isn\'t part of your standard collection. Here\'s what I have in mind:\n\nStyle / inspiration:\n  (describe the look: slat pattern, lattice, barn, glass, etc.)\n\nMaterial:\n  (wood / plexiglass / mixed)\n\nApproximate dimensions:\n  Width:  ___ in / ___ cm\n  Height: ___ in / ___ cm\n\nFinish / colour:\n  (e.g. matte black, natural oak, RAL 7016, brushed brass hardware)\n\nFor (children / cats / dogs):\n\nAnything else we should know:\n\n\nThank you,',

    detailsHeading: 'Details',
    specs: {
      material: 'Material',
      materialPlexi: 'Optical-grade plexiglass panel, edge-polished and scratch-resistant, in a solid-wood frame (painted or natural oak, as pictured)',
      materialWood: 'Solid European oak or hand-painted solid wood, as pictured',
      finish: 'Finish', finishValue: 'Pure White, Jet Black, Anthracite, Natural Oak, Unfinished, or any RAL colour on request',
      height: 'Height', heightValue: '27.5 in / 70 cm standard · 20-48 in available',
      width: 'Width', widthValue: '6-96 in / 15-244 cm · built to your opening',
      hardware: 'Hardware', hardwareValue: 'Wall-mount fittings and double-action latch included',
      engraving: 'Personalisation', engravingValue: 'Hand-engraved name, word or date (up to 40 characters)',
      catDoor: 'Cat passage', catDoorValue: 'Built-in passage in the lower panel: cats pass, toddlers and dogs don\'t',
      lead: 'Lead time', leadValue: '{leadMin}-{leadMax} business days, then {transitMin}-{transitMax} business days in transit',
      warranty: 'Warranty', warrantyValue: '{years} years on frame and hardware',
      madeIn: 'Made in', madeInValue: 'Bursa, Türkiye'
    },
    faqHeading: 'Good to know',
    faq: [
      { q: 'How do I measure my opening?', a: 'Measure the width of the opening at the height where the gate will sit, at the narrowest point. Enter that number; we account for hinges, latch and clearance. See our measuring guide for photos and edge cases.' },
      { q: 'Is the gate wall-mounted or pressure-fit?', a: 'Every Lumina gate is hardware-mounted to the wall or door frame for a secure, rattle-free fit. Mounting hardware is included.' },
      { q: 'Can I get a colour that isn\'t listed?', a: 'Yes. Choose "Other" in the finish picker and describe the colour (a RAL code is ideal). We\'ll confirm it by email before production starts.' }
    ],
    relatedHeading: 'You may also like',
    backToCollection: 'Back to the collection'
  },

  pages: {
    story: {
      title: 'Our Story | Lumina Gates',
      description: 'Why we started making child and pet gates that belong in beautiful homes, and how each one is built by hand in our workshop in Bursa, Türkiye.',
      h1A: 'A gate should belong', h1B: 'to the room it lives in.',
      sections: [
        { h: 'The frustration', p: 'Lumina Gates began with a simple frustration: every safety gate on the market looked like it belonged in a warehouse. Plastic, pressure-fit, beige. Nothing that a parent or a pet owner would have chosen for the hallway they had spent years getting right.' },
        { h: 'The workshop', p: 'So we started building our own. Our workshop in Bursa, Türkiye works in two materials, optical-grade plexiglass and solid European oak, with the kind of joinery usually reserved for furniture: mortise-and-tenon frames, edge-polished panels, hand-applied oils and paints.' },
        { h: 'Made to your opening', p: 'No two homes have the same doorway, so no two Lumina gates are the same. Each one is built to the width and height you give us, in the finish you choose, and ships with the hardware to mount it securely. Then it is tested the only way that matters: by toddlers and tabby cats.' },
        { h: 'The promise', p: 'We engineer every gate to keep the smallest members of your household safe, back it with a five-year warranty on the frame and hardware, and ship it anywhere in the world.' }
      ],
      cta: 'Explore the Collection'
    },

    measure: {
      title: 'How to Measure for a Custom Gate | Lumina Gates',
      description: 'A two-minute guide to measuring your doorway, hallway or stair opening for a made-to-measure child or pet gate. What to measure, where, and what to tell us.',
      h1: 'How to measure',
      intro: 'You need a tape measure and two minutes. Give us the opening; we handle hinges, latch and clearance.',
      diagramAlt: 'Diagram of a doorway showing the width measured at three heights and the gate height measured from the floor',
      steps: [
        { h: '1. Decide where the gate will sit', p: 'Pick the exact spot: inside the door frame, between two walls of a hallway, or at the top or bottom of the stairs. Both sides need a solid surface to screw into: a wall, a door frame or a stair post. Skirting boards (baseboards) are fine; tell us about them in the order notes.' },
        { h: '2. Measure the width at three heights', p: 'Measure the opening from surface to surface at roughly 10 cm (4 in), 35 cm (14 in) and 60 cm (24 in) from the floor. Walls are rarely perfectly parallel. Use the smallest of the three numbers.' },
        { h: '3. Enter the opening width, not a gate width', p: 'Type the smallest measurement into the configurator in inches or centimetres. Do not subtract anything: we build the gate narrower than the opening to fit the hinges and latch, and we confirm the final dimensions by email before production.' },
        { h: '4. Choose the height', p: 'Our standard height is 27.5 in (70 cm), which suits most toddlers and small-to-medium dogs. For larger dogs, confident climbers or the top of a staircase, consider 30-36 in. Heights from 20 to 48 in are available.' },
        { h: '5. Check for obstacles', p: 'Radiators, door handles, light switches and skirting boards that stick out can affect where the gate swings. Mention anything within 10 cm (4 in) of the opening in the order notes, or email us a photo; we are happy to check it with you.' }
      ],
      tipsHeading: 'Edge cases',
      tips: [
        { h: 'Top of the stairs', p: 'Gates at the top of a staircase must be hardware-mounted (ours always are) and should open away from the stairs. Tell us which side the stairs are on.' },
        { h: 'Very wide openings', p: 'Openings beyond 54 in (137 cm) are built as wider single gates or as bifold / multi-panel designs such as Stappa and Bifold Glass. Widths up to 96 in (244 cm) can be configured; larger spans on request.' },
        { h: 'Uneven floors', p: 'If the floor slopes, measure the height at both sides and tell us the difference. We allow enough floor clearance for the gate to swing freely.' },
        { h: 'Not sure?', p: 'Email a photo of the opening with the measurements written on it to {email}. We reply within one business day.' }
      ],
      cta: 'Choose your gate'
    },

    faq: {
      title: 'FAQ - Custom child & pet gates | Lumina Gates',
      description: 'Answers about measuring, materials, finishes, lead times, shipping, duties, returns and the five-year warranty on Lumina Gates.',
      h1: 'Frequently asked questions',
      intro: 'Everything people ask before ordering a made-to-measure gate. Anything missing? Email {email}.',
      groups: [
        { h: 'Ordering & measuring', items: [
          { q: 'How do I know what width to order?', a: 'Measure the opening itself at three heights and give us the smallest number. We build the gate narrower than the opening to fit the hinges and latch; you never need to subtract anything. The full guide is on our How to Measure page.' },
          { q: 'What if I measure wrong?', a: 'We confirm the final dimensions by email before production starts, which catches most mistakes. If a gate still arrives and does not fit, contact us: in most cases we can adjust it or remake it at a reduced cost.' },
          { q: 'Can I order a colour that is not in the list?', a: 'Yes. Choose "Other" in the finish picker and describe the colour. A RAL or NCS code is ideal; a photo also works. We confirm the exact shade by email before production.' },
          { q: 'Can I have a completely custom design?', a: 'Often, yes. Use the "Request a custom design" button on any product page or email us with a sketch or inspiration photo. We quote within two business days.' },
          { q: 'Do you offer trade pricing for architects and designers?', a: 'Yes, we work with residential architects, interior designers and builders. Email {email} with the project details for trade terms and a PDF catalogue.' }
        ] },
        { h: 'Materials & safety', items: [
          { q: 'What is "optical-grade plexiglass"?', a: 'A cast acrylic sheet with the clarity of glass at a fraction of the weight, and far higher impact resistance. The edges are polished and the surface is scratch-resistant. It does not yellow in normal indoor use.' },
          { q: 'Is the wood solid?', a: 'Yes. Oak models are solid European oak with mortise-and-tenon joints; painted models are solid wood with a hand-applied finish. We do not use MDF or veneers in frames.' },
          { q: 'Are the gates safe for children?', a: 'Lumina gates are hardware-mounted, use a double-action latch and have rounded edges with no finger-trap gaps. Like every safety gate, they are an aid, not a substitute for adult supervision. Always follow the installation instructions and check the hardware periodically.' },
          { q: 'Will it hold a large dog?', a: 'Hardware-mounted solid-wood gates at 30-36 in are suitable for most large dogs. For very strong or determined dogs, choose a wood model with a taller height; email us if you would like a recommendation for your breed.' },
          { q: 'How does the cat passage work?', a: 'Cat Edition gates have an opening cut into the lower panel that is sized for a cat and too small for toddlers or most dogs. The rest of the gate works exactly like the standard version.' }
        ] },
        { h: 'Production, shipping & duties', items: [
          { q: 'How long does it take?', a: 'Production takes {leadMin}-{leadMax} business days from order confirmation. Shipping by tracked express courier then takes {transitMin}-{transitMax} business days to the US, Canada, UK and most of Europe.' },
          { q: 'Where do you ship?', a: 'Worldwide. At checkout you can choose from the United States, Canada, the United Kingdom, the EU, Switzerland, Norway, Australia, New Zealand, the UAE and Türkiye. For other countries, email us first.' },
          { q: 'How much is shipping?', a: 'Shipping is included in the price you see. There is no separate shipping line at checkout.' },
          { q: 'Will I pay import duties or taxes?', a: 'Orders ship from Türkiye, so the destination country may charge import duties, customs fees or VAT on arrival. These are set by your government, are not included in our prices, and are paid by the recipient to the courier. Our Shipping Policy has the details.' },
          { q: 'How is the gate packed?', a: 'Flat, in a reinforced double-wall carton with corner protection and the hardware in a separate labelled bag. Installation instructions are included.' }
        ] },
        { h: 'Returns & warranty', items: [
          { q: 'Can I return a gate?', a: 'Each gate is made to your measurements, so we cannot accept returns for change of mind. If a gate arrives damaged, defective or different from what you configured, tell us within {returnDays} days of delivery and we will repair, remake or refund it, including return shipping.' },
          { q: 'Can I cancel an order?', a: 'Yes, free of charge within {cancelHours} hours of ordering. After that your gate is in production and the order can no longer be cancelled.' },
          { q: 'What does the warranty cover?', a: 'Five years on the frame and hardware against manufacturing defects. It does not cover damage from misuse, modification, incorrect installation or normal wear of the finish.' }
        ] }
      ]
    },

    contact: {
      title: 'Contact | Lumina Gates',
      description: 'Questions about a gate, your order, a custom design or trade pricing? Email Lumina Gates or use the contact form. We reply within one business day.',
      h1: 'Get in touch',
      intro: 'A question about measuring, a custom colour, an order in progress or a trade project: write to us and a person from the workshop will answer within one business day.',
      emailLabel: 'Email', workshopLabel: 'Workshop', hoursLabel: 'Hours',
      hoursValue: 'Monday-Friday, 09:00-18:00 (GMT+3)',
      tradeHeading: 'Architects, designers & builders',
      tradeBody: 'We supply made-to-measure gates for residential projects and offer trade terms, a PDF catalogue and finish samples. Mention the project in your message.',
      form: {
        heading: 'Send a message',
        name: 'Your name', email: 'Email address', topic: 'Topic',
        topics: { general: 'General question', order: 'Existing order', custom: 'Custom design', trade: 'Trade / project enquiry' },
        message: 'Message', submit: 'Send message', sending: 'Sending…',
        success: 'Thank you, your message is on its way. We reply within one business day.',
        error: 'The message could not be sent. Please email us directly at {email}.',
        privacy: 'We only use your details to answer your message. See our Privacy Policy.'
      }
    },

    shipping: {
      title: 'Shipping Policy | Lumina Gates',
      description: 'Production lead times, worldwide express shipping, tracking, packaging, import duties and what happens if a gate arrives damaged.',
      h1: 'Shipping Policy',
      updated: 'Last updated: {date}',
      sections: [
        { h: 'Made to order', p: 'Every gate is built after you order it. Production takes {leadMin}-{leadMax} business days from the moment we confirm your dimensions and finish by email. Custom colours and oversized gates can take a few days longer; we tell you if so.' },
        { h: 'Where we ship', p: 'We ship worldwide from our workshop in Bursa, Türkiye. The countries available at checkout are the United States, Canada, the United Kingdom, Ireland, Germany, France, the Netherlands, Belgium, Austria, Switzerland, Sweden, Norway, Denmark, Finland, Italy, Spain, Portugal, Australia, New Zealand, the United Arab Emirates and Türkiye. For any other destination, email {email} before ordering.' },
        { h: 'Cost and transit time', p: 'Shipping is included in the product price. Gates travel by tracked express courier (DHL, UPS or FedEx, depending on destination) and typically arrive {transitMin}-{transitMax} business days after dispatch. You receive the tracking number by email the day the gate leaves the workshop.' },
        { h: 'Import duties and taxes', p: 'Because your gate ships from Türkiye, the destination country may apply import duties, customs processing fees or VAT / sales tax on arrival. These charges are set by your government, are not included in our prices and are payable by the recipient, usually to the courier before or at delivery. We declare the true value of every shipment; we cannot mark parcels as gifts or lower the declared value.' },
        { h: 'Packaging', p: 'Gates are packed flat in a reinforced double-wall carton with corner protection. Hardware ships in a separate labelled bag inside the carton, together with installation instructions.' },
        { h: 'Damage in transit', p: 'Please inspect the carton and the gate on delivery. If anything is damaged, photograph the packaging and the damage and email us within 48 hours. We will repair, remake or refund the gate; there is no cost to you and you do not need to deal with the courier.' },
        { h: 'Address accuracy and failed deliveries', p: 'Please double-check your shipping address and phone number at checkout; couriers use the phone number to arrange delivery. If a parcel is returned to us because of an incorrect address or because it was not collected, we will contact you about re-shipping; the cost of the second shipment is charged at cost.' }
      ]
    },

    refund: {
      title: 'Returns, Refunds & Warranty | Lumina Gates',
      description: 'Our cancellation window, what we do when a made-to-measure gate arrives damaged or wrong, how refunds are paid, and the five-year warranty.',
      h1: 'Returns, Refunds & Warranty',
      updated: 'Last updated: {date}',
      sections: [
        { h: 'Cancellation', p: 'You can cancel an order free of charge within {cancelHours} hours of placing it: email {email} with your order number. After {cancelHours} hours your gate enters production and the order can no longer be cancelled.' },
        { h: 'Made-to-measure goods', p: 'Every Lumina gate is manufactured to the dimensions and finish you choose, so it cannot be resold. For that reason we do not accept returns for change of mind or for measuring errors. We always confirm the final dimensions by email before production starts, so please check that email carefully.' },
        { h: 'Damaged, defective or not as ordered', p: 'If your gate arrives damaged, has a manufacturing defect, or differs from the configuration you ordered, contact us within {returnDays} days of delivery with photos. We will, at your choice and where practical, repair it, remake it or refund it in full. Return shipping, if needed, is arranged and paid by us.' },
        { h: 'If it does not fit', p: 'If a gate does not fit because the opening was measured incorrectly, it is not covered by the return policy, but we will help. Many gates can be adjusted, and we remake gates for customers at a reduced price. Email us with photos and the actual measurements.' },
        { h: 'Refunds', p: 'Refunds are issued to the original payment method within 5-10 business days of our confirmation. Card issuers and PayPal may take a few further days to show the credit.' },
        { h: 'Warranty', p: 'Every gate carries a {years}-year warranty on the frame and hardware against defects in materials and workmanship, starting on the delivery date. The warranty does not cover damage caused by misuse, modification, incorrect installation, exposure to the elements, or normal wear of painted and oiled finishes. To make a claim, email {email} with your order number and photos; we repair or replace the affected part.' },
        { h: 'Your statutory rights', p: 'Nothing in this policy limits the rights you have under the consumer-protection laws of your country.' }
      ]
    },

    terms: {
      title: 'Terms of Service | Lumina Gates',
      description: 'The terms that apply when you order a made-to-measure gate from Lumina Gates, a brand of Doggo LLC.',
      h1: 'Terms of Service',
      updated: 'Last updated: {date}',
      sections: [
        { h: '1. Who we are', p: 'This website and the Lumina Gates brand are operated by {legalName}, a limited liability company registered in Wyoming, United States ("Lumina", "we", "us"). Products are manufactured in our workshop in Bursa, Türkiye. You can reach us at {email}.' },
        { h: '2. Products', p: 'All gates are made to order to the dimensions, finish and options you select. Photographs show representative examples; wood grain, hand-applied finishes and engraving vary slightly from piece to piece. Colours on screen may differ from the physical finish.' },
        { h: '3. Your measurements', p: 'You are responsible for measuring your opening and for the information you enter in the configurator and at checkout. We confirm the final dimensions by email before production; production begins once that confirmation is sent or 24 hours after the order, whichever is later. Our Returns policy explains what happens if a gate does not fit.' },
        { h: '4. Orders and acceptance', p: 'Your order is an offer to buy. We accept it when we send the production confirmation. We may decline or cancel an order (for example if a product is unavailable, if we cannot ship to your address, or if there is a pricing or configuration error), in which case we refund you in full.' },
        { h: '5. Prices and payment', p: 'Prices are shown in US dollars and include shipping to the countries offered at checkout. They do not include import duties, customs fees or taxes charged by the destination country (see Shipping Policy). Payment is taken in full at checkout and processed by Stripe; we accept major cards, Apple Pay, Google Pay and, where offered, PayPal. We do not store card details.' },
        { h: '6. Delivery', p: 'Lead times and transit times are estimates and are set out in our Shipping Policy. Risk in the goods passes to you on delivery. Please inspect the goods on delivery and report damage within 48 hours.' },
        { h: '7. Cancellations, returns and warranty', p: 'Our Returns, Refunds & Warranty policy forms part of these terms.' },
        { h: '8. Safe use', p: 'Safety gates help restrict the movement of small children and pets; they are not a substitute for adult supervision. Install the gate according to the instructions supplied, using the hardware supplied, into a sound wall or frame. Check the fixings and latch regularly. Do not use a gate as a climbing frame or at a height or location it was not configured for.' },
        { h: '9. Intellectual property', p: 'The Lumina Gates name, designs, photographs and website content belong to {legalName} or its licensors and may not be copied or used commercially without written permission.' },
        { h: '10. Liability', p: 'To the fullest extent permitted by law, our liability for any claim relating to an order is limited to the amount you paid for that order. Nothing in these terms excludes liability that cannot be excluded by law, including for death or personal injury caused by negligence, or your statutory consumer rights.' },
        { h: '11. Governing law', p: 'These terms are governed by the laws of the State of Wyoming, United States, without affecting any mandatory consumer-protection rules of the country in which you live.' },
        { h: '12. Changes', p: 'We may update these terms from time to time. The version in force when you place an order applies to that order.' }
      ]
    },

    privacy: {
      title: 'Privacy Policy | Lumina Gates',
      description: 'What personal data Lumina Gates collects when you browse or order, how it is used, who processes it (Stripe, couriers, email), and your rights.',
      h1: 'Privacy Policy',
      updated: 'Last updated: {date}',
      sections: [
        { h: 'Who is responsible', p: 'The data controller for this website is {legalName}, operating as Lumina Gates. Questions about this policy go to {email}.' },
        { h: 'What we collect and why', p: 'When you order: your name, email address, phone number, shipping and billing address, the gate configuration you chose, and your payment status. We use these to manufacture and deliver your gate, send order and shipping emails, handle warranty claims and keep accounting records. When you contact us: your name, email address and the content of your message, used only to reply. When you browse: standard server logs (IP address, browser, pages requested) kept briefly for security, and, only if analytics are enabled on this site, anonymised usage statistics.' },
        { h: 'Payments', p: 'Payments are processed by Stripe, Inc. Your card or wallet details are entered on Stripe\'s secure checkout page and never reach our servers. Stripe\'s privacy policy applies to that processing.' },
        { h: 'Who we share data with', p: 'Only the services needed to fulfil your order: Stripe (payment), our courier (name, address and phone number for delivery), our email provider (order and shipping notifications) and our hosting provider. We do not sell or rent personal data.' },
        { h: 'Cookies and analytics', p: 'This site works without tracking cookies. Stripe sets cookies on its own checkout page for fraud prevention. If Google Analytics is enabled, it uses cookies to measure visits in aggregate; you can block them in your browser without affecting your order.' },
        { h: 'International transfers', p: 'We are a US company with a workshop in Türkiye, so order data is processed in both countries and by the providers named above. We only share what is needed to deliver your gate.' },
        { h: 'Retention', p: 'Order records are kept for as long as required for warranty claims and tax law (typically seven years). Contact-form messages are deleted once resolved.' },
        { h: 'Your rights', p: 'You can ask us to access, correct or delete your personal data, or object to its processing, by emailing {email}. Residents of the EU, UK and California have additional rights under their local laws, which we honour.' },
        { h: 'Children', p: 'This site is intended for adults. We do not knowingly collect personal data from anyone under 16.' },
        { h: 'Changes', p: 'We will post any changes to this policy on this page with a new "last updated" date.' }
      ]
    },

    thankYou: {
      title: 'Order received | Lumina Gates',
      announce: 'Thank you · Your bespoke gate is now in production',
      eyebrow: 'Order confirmed',
      h1A: 'Thank you for', h1B: 'choosing Lumina.',
      body: 'Your bespoke gate is being prepared in our workshop. You will receive a confirmation email within minutes and a production update within 48 hours. Lead time is {leadMin}-{leadMax} business days from confirmation.',
      summaryHeading: 'Order summary', orderRef: 'Order reference', loading: 'Loading your order…',
      back: 'Back to the Collection', help: 'Questions? Reply to the confirmation email or write to {email}.'
    },

    notFound: {
      title: 'Page not found | Lumina Gates',
      eyebrow: '404', h1A: 'Nothing behind', h1B: 'this gate.',
      body: 'The page you are looking for has moved or never existed.',
      cta: 'Browse the Collection'
    }
  },

  units: { in: 'in', cm: 'cm' },
  misc: { and: 'and', more: 'More', business_days: 'business days' }
};
