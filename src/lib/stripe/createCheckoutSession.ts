import "server-only";

import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";
import {
  getStripeProductId,
  resolveStripePriceId,
  type StripeCheckoutPriceKey,
} from "@/lib/stripe/prices";
import { getStripe } from "@/lib/stripe/server";

export type CreateCheckoutSessionInput = {
  priceKey: StripeCheckoutPriceKey;
  locale: Locale;
  origin: string;
  /** Chemin de retour après succès (ex. /fr/onboarding?plan=pro&stripe=success). */
  successPath: string;
  cancelPath?: string;
};

export type CreateCheckoutSessionResult =
  | { ok: true; url: string }
  | { ok: false; code: "unauthorized"; loginUrl: string }
  | { ok: false; code: "error"; message: string };

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) {
    const loginUrl = `${authPath(input.locale, "login")}?next=${encodeURIComponent(input.successPath)}`;
    return { ok: false, code: "unauthorized", loginUrl };
  }

  let stripeCustomerId: string | null = null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.stripe_customer_id) {
    stripeCustomerId = profile.stripe_customer_id;
  }

  const priceId = resolveStripePriceId(input.priceKey);
  const productId = getStripeProductId();
  const successUrl = `${input.origin}${input.successPath}`;
  const cancelUrl = `${input.origin}${input.cancelPath ?? authPath(input.locale, "onboarding") + "?plan=pro"}`;

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "STRIPE_SECRET_KEY manquante.";
    console.error("[stripe/checkout]", message);
    return { ok: false, code: "error", message };
  }

  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    excluded_payment_method_types: ["klarna"],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        craftlink_plan: "PRO",
        craftlink_price_key: input.priceKey,
        craftlink_product_id: productId,
      },
    },
    metadata: {
      supabase_user_id: user.id,
      craftlink_plan: "PRO",
      craftlink_price_key: input.priceKey,
      craftlink_product_id: productId,
    },
  };

  if (stripeCustomerId) {
    sessionParams.customer = stripeCustomerId;
  } else {
    sessionParams.customer_email = user.email;
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return { ok: false, code: "error", message: "Stripe session URL manquante." };
    }

    return { ok: true, url: session.url };
  } catch (error) {
    const stripeMessage =
      error instanceof Error ? error.message : "Checkout Stripe impossible.";
    console.error("[stripe/checkout]", stripeMessage, { priceId, userId: user.id });

    const invalidCustomer =
      stripeCustomerId &&
      /no such customer|resource_missing/i.test(stripeMessage);

    if (invalidCustomer && stripeCustomerId) {
      try {
        const session = await stripe.checkout.sessions.create({
          ...sessionParams,
          customer: undefined,
          customer_email: user.email,
        });
        if (session.url) {
          return { ok: true, url: session.url };
        }
      } catch (retryError) {
        const retryMessage =
          retryError instanceof Error ? retryError.message : stripeMessage;
        console.error("[stripe/checkout] retry", retryMessage);
        return { ok: false, code: "error", message: retryMessage };
      }
    }

    return { ok: false, code: "error", message: stripeMessage };
  }
}
