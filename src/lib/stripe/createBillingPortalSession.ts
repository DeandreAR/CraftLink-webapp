import "server-only";

import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

export type CreateBillingPortalResult =
  | { ok: true; url: string }
  | { ok: false; code: "unauthorized" | "no_customer" | "error"; message: string };

export async function createBillingPortalSession(
  locale: Locale,
  origin: string,
): Promise<CreateBillingPortalResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, code: "unauthorized", message: "Connexion requise." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id?.trim();
  if (!customerId) {
    return {
      ok: false,
      code: "no_customer",
      message: "Aucun abonnement Stripe associé à ce compte.",
    };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}${authPath(locale, "dashboard")}`,
    });

    if (!session.url) {
      return { ok: false, code: "error", message: "URL portail Stripe manquante." };
    }

    return { ok: true, url: session.url };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Portail Stripe indisponible.";
    return { ok: false, code: "error", message };
  }
}
