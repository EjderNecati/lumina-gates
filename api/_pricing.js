// Shared pricing logic for backend (Vercel functions).
// Kept in sync with /js/products.js — change both when adjusting prices.

const PRICE_TIERS = {
  plexi: [
    { minW: 0,  maxW: 12, price: 100  },
    { minW: 12, maxW: 18, price: 300  },
    { minW: 18, maxW: 24, price: 400  },
    { minW: 24, maxW: 30, price: 500  },
    { minW: 30, maxW: 36, price: 600  },
    { minW: 36, maxW: 42, price: 700  },
    { minW: 42, maxW: 48, price: 900  },
    { minW: 48, maxW: 54, price: 1100 }
  ],
  wood: [
    { minW: 0,  maxW: 12, price: 100  },
    { minW: 12, maxW: 18, price: 200  },
    { minW: 18, maxW: 24, price: 300  },
    { minW: 24, maxW: 30, price: 400  },
    { minW: 30, maxW: 36, price: 500  },
    { minW: 36, maxW: 42, price: 600  },
    { minW: 42, maxW: 48, price: 800  },
    { minW: 48, maxW: 54, price: 1000 }
  ]
};

const DEFAULT_HEIGHT_INCH  = 27.5;
const HEIGHT_DEVIATION_FEE = 20;
const OVERSIZE_THRESHOLD   = 54;
const OVERSIZE_BLOCK       = 6;
const OVERSIZE_FEE         = 100;
const GLOBAL_DISCOUNT      = 0.5;

function computePrice(material, widthInches, heightInches) {
  const width  = Math.max(0, Number(widthInches)  || 0);
  const height = Number(heightInches) || DEFAULT_HEIGHT_INCH;

  const tiers   = PRICE_TIERS[material];
  if (!tiers) throw new Error('Unknown material: ' + material);
  const cappedW = Math.min(width, OVERSIZE_THRESHOLD);

  let tierPrice = tiers[0].price;
  for (const t of tiers) {
    if (cappedW > t.minW && cappedW <= t.maxW) { tierPrice = t.price; break; }
    if (cappedW === 0) { tierPrice = tiers[0].price; break; }
  }
  const discountedTier = tierPrice * GLOBAL_DISCOUNT;

  let oversize = 0;
  if (width > OVERSIZE_THRESHOLD) {
    oversize = Math.ceil((width - OVERSIZE_THRESHOLD) / OVERSIZE_BLOCK) * OVERSIZE_FEE;
  }

  let heightFlat = 0, heightOversize = 0;
  const heightDeviation = Math.abs(height - DEFAULT_HEIGHT_INCH);
  if (heightDeviation > 0.05) {
    heightFlat     = HEIGHT_DEVIATION_FEE;
    heightOversize = Math.ceil(heightDeviation / OVERSIZE_BLOCK) * OVERSIZE_FEE;
  }
  const heightFee = heightFlat + heightOversize;

  return {
    tierPrice,
    discountedTier,
    oversize,
    heightFlat,
    heightOversize,
    heightFee,
    original: tierPrice + oversize + heightFee,
    final:    discountedTier + oversize + heightFee
  };
}

module.exports = { computePrice };
