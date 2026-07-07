import type { Locale } from "@/i18n/config";

export type StartBillingPortalResult =
  | { ok: true }
  | { ok: false; message: string };

export async function startStripeBillingPortal(
  locale: Locale,
): Promise<StartBillingPortalResult> {
  const response = await fetch("/api/stripe/create-portal-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale }),
  });

  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    return {
      ok: false,
      message: data.error ?? "Impossible d'ouvrir le portail Stripe.",
    };
  }

  window.location.assign(data.url);
  return { ok: true };
}
