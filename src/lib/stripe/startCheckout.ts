import type { Locale } from "@/i18n/config";
import type { StripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";

export type StartCheckoutOptions = {
  priceKey: StripeCheckoutPriceKey;
  locale: Locale;
  successPath?: string;
  cancelPath?: string;
};

export type StartCheckoutResult =
  | { ok: true }
  | { ok: false; message: string; loginUrl?: string };

export async function startStripeCheckout(
  options: StartCheckoutOptions,
): Promise<StartCheckoutResult> {
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price_key: options.priceKey,
      locale: options.locale,
      success_path: options.successPath,
      cancel_path: options.cancelPath,
    }),
  });

  const data = (await response.json()) as {
    url?: string;
    error?: string;
    loginUrl?: string;
  };

  if (response.status === 401 && data.loginUrl) {
    window.location.assign(data.loginUrl);
    return { ok: true };
  }

  if (!response.ok || !data.url) {
    return {
      ok: false,
      message: data.error ?? "Impossible de démarrer le paiement.",
      loginUrl: data.loginUrl,
    };
  }

  window.location.assign(data.url);
  return { ok: true };
}
