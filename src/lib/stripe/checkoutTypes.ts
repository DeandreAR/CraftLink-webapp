export type StripeCheckoutPriceKey = "pro_monthly" | "pro_annual";

export function isStripeCheckoutPriceKey(
  value: string,
): value is StripeCheckoutPriceKey {
  return value === "pro_monthly" || value === "pro_annual";
}
