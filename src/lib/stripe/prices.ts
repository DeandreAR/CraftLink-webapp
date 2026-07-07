import "server-only";

import type { StripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";

export type { StripeCheckoutPriceKey };

const DEFAULT_PRICE_PRO_MONTHLY = "price_1TfS2AH0ykOv4lSaN4S0VMsp";
const DEFAULT_PRICE_PRO_ANNUAL = "price_1TfS3JH0ykOv4lSacijEUG48";
const DEFAULT_PRODUCT_PRO = "prod_UelZklJZtvFYRv";

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export function getStripeProductId(): string {
  return readEnv("STRIPE_PRODUCT_PRO", DEFAULT_PRODUCT_PRO);
}

export function resolveStripePriceId(priceKey: StripeCheckoutPriceKey): string {
  const map: Record<StripeCheckoutPriceKey, string> = {
    pro_monthly: readEnv("STRIPE_PRICE_PRO_MONTHLY", DEFAULT_PRICE_PRO_MONTHLY),
    pro_annual: readEnv("STRIPE_PRICE_PRO_ANNUAL", DEFAULT_PRICE_PRO_ANNUAL),
  };
  return map[priceKey];
}

export { isStripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";
