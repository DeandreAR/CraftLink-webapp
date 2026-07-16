import "server-only";

import type { Locale } from "@/i18n/config";
import { abonnementPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

export type CreateBillingPortalResult =
  | { ok: true; url: string }
  | { ok: false; code: "unauthorized" | "no_customer" | "error"; message: string };

function resolvePortalOrigin(requestOrigin: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  return requestOrigin.replace(/\/$/, "");
}

async function ensureStripeCustomerId(
  userId: string,
  email: string | undefined,
  existingId: string | null | undefined,
): Promise<{ customerId: string } | { error: string }> {
  const trimmed = existingId?.trim();
  if (trimmed) return { customerId: trimmed };

  if (!email?.trim()) {
    return {
      error:
        "Aucun client Stripe associé. Passez d’abord au Plan Pro, ou ajoutez un e-mail à votre compte.",
    };
  }

  try {
    const stripe = getStripe();
    const customer = await stripe.customers.create({
      email: email.trim(),
      metadata: { supabase_user_id: userId },
    });

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", userId);

    if (error) {
      console.error("[stripe/portal] save customer id:", error.message);
      return { error: "Impossible d’enregistrer le client Stripe." };
    }

    return { customerId: customer.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Création client Stripe impossible.";
    return { error: message };
  }
}

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

  const ensured = await ensureStripeCustomerId(
    user.id,
    user.email,
    profile?.stripe_customer_id,
  );

  if ("error" in ensured) {
    return { ok: false, code: "no_customer", message: ensured.error };
  }

  try {
    const stripe = getStripe();
    const returnOrigin = resolvePortalOrigin(origin);
    const session = await stripe.billingPortal.sessions.create({
      customer: ensured.customerId,
      return_url: `${returnOrigin}${abonnementPath(locale)}`,
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
