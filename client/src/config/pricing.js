const USD_TO_INR = 84; // Update as needed

export const PRICING = {
  sarvam: {
    name: "Sarvam AI",
    currency: "INR",
    model: "pay-per-use",
    ratePerCharacter: 0.003,
    ratePerWord: 0.018,
    ratePer10kChars: 30,
    monthlyMinimum: 0,
  },

  camb: {
    name: "CAMB AI",
    currency: "INR",
    model: "subscription",
    monthlyFlatFee: 20 * USD_TO_INR,        // ₹1,680/month
    creditsPerMonth: 40000,
    charsPerCredit: 26000,
    totalCharsPerMonth: 1_040_000_000,
    ratePerCharacter: 1680 / 1_040_000_000,
  },

  local: {
    name: "Local",
    currency: "INR",
    model: "per-request",
    minPerRequest: 0.05,                    // ₹0.05 per audio request
    maxPerRequest: 0.10,                    // ₹0.10 per audio request
  },

  breakeven: {
    charsPerMonth: 557000,
    wordsPerMonth: 92833,
  },
};

export function calculateMonthlyCost(charCount, totalRequests) {
  const sarvamINR = (charCount / 10000) * PRICING.sarvam.ratePer10kChars;
  const cambINR = PRICING.camb.monthlyFlatFee;
  const localMin = totalRequests * PRICING.local.minPerRequest;
  const localMax = totalRequests * PRICING.local.maxPerRequest;

  return {
    sarvam: { inr: +sarvamINR.toFixed(2) },
    camb: { inr: +cambINR.toFixed(2) },
    local: { min: +localMin.toFixed(2), max: +localMax.toFixed(2) },
    cheaper: sarvamINR < cambINR ? "sarvam" : "camb",
    breakevenReached: charCount >= PRICING.breakeven.charsPerMonth,
  };
}

export function calculatePerArticleCost(wordsPerArticle, articlesPerMonth) {
  const charsPerArticle = wordsPerArticle * 6;
  const totalChars = charsPerArticle * articlesPerMonth;

  const sarvamINR = (totalChars / 10000) * PRICING.sarvam.ratePer10kChars;
  const cambINR = PRICING.camb.monthlyFlatFee;
  const localMinTotal = articlesPerMonth * PRICING.local.minPerRequest;
  const localMaxTotal = articlesPerMonth * PRICING.local.maxPerRequest;

  return {
    perArticle: {
      sarvam: { inr: +(sarvamINR / articlesPerMonth).toFixed(4) },
      camb: { inr: +(cambINR / articlesPerMonth).toFixed(4) },
      local: { min: +PRICING.local.minPerRequest.toFixed(2), max: +PRICING.local.maxPerRequest.toFixed(2) },
    },
    monthly: {
      sarvam: { inr: +sarvamINR.toFixed(2) },
      camb: { inr: +cambINR.toFixed(2) },
      local: { min: +localMinTotal.toFixed(2), max: +localMaxTotal.toFixed(2) },
    },
    annual: {
      sarvam: { inr: +(sarvamINR * 12).toFixed(2) },
      camb: { inr: +(cambINR * 12).toFixed(2) },
      local: { min: +(localMinTotal * 12).toFixed(2), max: +(localMaxTotal * 12).toFixed(2) },
    },
    cheaper: sarvamINR < cambINR ? "sarvam" : "camb",
  };
}

// Volume tiers for chart generation
export const VOLUME_TIERS = [10, 100, 500, 1000, 5000];

// Default words per article (for initial calculator state)
export const DEFAULT_WORDS_PER_ARTICLE = 500;
export const DEFAULT_ARTICLES_PER_MONTH = 100;