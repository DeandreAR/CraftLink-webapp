import "server-only";

import type { StripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";

export type { StripeCheckoutPriceKey };

/**
 * Prix Plan Pro — compte Stripe Live CraftLink (getcraftlink.com).
 * Ce ne sont pas des secrets : on les versionne ici pour ne pas dépendre de Vercel.
 * Mensuel 19 € HT / Annuel 168 € HT — produit prod_UelZklJZtvFYRv.
 */
const PRICE_PRO_MONTHLY = "price_1TsrgTQhay22OyoWBMh5j9gQ";
const PRICE_PRO_ANNUAL = "price_1TsrgTQhay22OyoWupP9Szaz";
const PRODUCT_PRO = "prod_UelZklJZtvFYRv";

export function getStripeProductId(): string {
  return PRODUCT_PRO;
}

export function resolveStripePriceId(priceKey: StripeCheckoutPriceKey): string {
  const map: Record<StripeCheckoutPriceKey, string> = {
    pro_monthly: PRICE_PRO_MONTHLY,
    pro_annual: PRICE_PRO_ANNUAL,
  };
  return map[priceKey];
}

export { isStripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";
