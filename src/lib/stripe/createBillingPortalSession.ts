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

function isMissingStripeCustomerError(message: string): boolean {
  return /no such customer|resource_missing/i.test(message);
}

async function saveStripeCustomerId(
  userId: string,
  customerId: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      // Ancien abo Test / autre compte : ne pas garder un sub_ invalide en Live.
      stripe_subscription_id: null,
    })
    .eq("id", userId);

  if (error) {
    console.error("[stripe/portal] save customer id:", error.message);
    return "Impossible d’enregistrer le client Stripe.";
  }
  return null;
}

async function createStripeCustomerForUser(
  userId: string,
  email: string,
): Promise<{ customerId: string } | { error: string }> {
  try {
    const stripe = getStripe();
    const customer = await stripe.customers.create({
      email: email.trim(),
      metadata: { supabase_user_id: userId },
    });

    const saveError = await saveStripeCustomerId(userId, customer.id);
    if (saveError) return { error: saveError };

    return { customerId: customer.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Création client Stripe impossible.";
    return { error: message };
  }
}

/**
 * Réutilise le customer en base s’il existe encore sur le compte Stripe courant
 * (Live vs Test). Sinon en crée un nouveau — fréquent après passage test → live.
 */
async function ensureStripeCustomerId(
  userId: string,
  email: string | undefined,
  existingId: string | null | undefined,
): Promise<{ customerId: string } | { error: string }> {
  const trimmed = existingId?.trim();
  const stripe = getStripe();

  if (trimmed) {
    try {
      await stripe.customers.retrieve(trimmed);
      return { customerId: trimmed };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!isMissingStripeCustomerError(message)) {
        return { error: message || "Client Stripe introuvable." };
      }
      // Ancien ID test / autre compte : on recrée en Live.
      console.warn("[stripe/portal] stale customer id, recreating:", trimmed);
    }
  }

  if (!email?.trim()) {
    return {
      error:
        "Aucun client Stripe associé. Passez d’abord au Plan Pro, ou ajoutez un e-mail à votre compte.",
    };
  }

  return createStripeCustomerForUser(userId, email.trim());
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
