export const GST_RATE = 0.05;
/** Convenience charge (3.5%), applied on the GST-inclusive amount. */
export const CONVENIENCE_FEE_RATE = 0.035;

/** True for "Delhi", "New Delhi" and editions such as "Delhi NCR". */
export function isDelhiCity(city?: string | null) {
  return /^(new\s+)?delhi\b/i.test(city?.trim() ?? "");
}

/**
 * Name-change ads are billed at 5% GST in every edition. Kept as a helper so
 * the rate stays server-derived and a single place controls it.
 */
export function nameChangeGstRate(city?: string | null) {
  // Every edition is on the 5% slab now; the city argument is kept so callers
  // stay unchanged if edition-specific rates return.
  void city;
  return GST_RATE;
}

export type Pricing = {
  /** Package rate in paise. */
  basePaise: number;
  /** GST in paise. */
  gstPaise: number;
  /** GST rate actually applied (0.05 for every category and edition). */
  gstRate: number;
  /** Convenience charge (3.5%) in paise, charged on base + GST. */
  conveniencePaise: number;
  /** Base + GST + convenience charge, in paise. */
  totalPaise: number;
};

export function calculatePricing(
  rateRupees: number,
  options?: { gstRate?: number },
): Pricing {
  const gstRate = options?.gstRate ?? GST_RATE;
  const basePaise = Math.round(rateRupees * 100);
  const gstPaise = Math.round(basePaise * gstRate);
  // Convenience charge applies on the GST-inclusive amount, not on the base rate alone.
  const conveniencePaise = Math.round(
    (basePaise + gstPaise) * CONVENIENCE_FEE_RATE,
  );

  return {
    basePaise,
    gstPaise,
    gstRate,
    conveniencePaise,
    totalPaise: basePaise + gstPaise + conveniencePaise,
  };
}

export function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
