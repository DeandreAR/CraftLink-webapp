import "server-only";

import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import {
  setProfilePlanByUserId,
  setProfileStripeSubscriptionByUserId,
  STRIPE_FREE_PLAN_TIER,
  STRIPE_PRO_PLAN_TIER,
} from "@/lib/stripe/updateProfilePlan";
import type { PlanTier } from "@/domain/profile";

async function fetchPrimarySubscription(
  stripe: Stripe,
  customerId: string,
): Promise<Stripe.Subscription | null> {
  for (const status of ["active", "past_due"] as const) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status,
      limit: 1,
    });
    if (subscriptions.data[0]) {
      return subscriptions.data[0];
    }
  }
  return null;
}

export type StripeProfileSyncResult = {
  planTier: PlanTier | null;
  isSubscribed: boolean | null;
  customerId: string | null;
  subscriptionId: string | null;
};

/**
 * Répare is_subscribed et références Stripe (customer / subscription) depuis l’API prod.
 * L'essai Pro local (trial_ends_at) n'est pas géré par Stripe.
 * Ne downgrade pas un Pro posé manuellement (sans stripe_subscription_id en base).
 */
export async function syncProfilePlanFromStripeIfNeeded(
  userId: string,
  _currentPlanTier: string | null | undefined,
  stripeCustomerId?: string | null,
  currentIsSubscribed?: boolean | null,
): Promise<StripeProfileSyncResult> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, stripe_subscription_id, is_subscribed")
    .eq("id", userId)
    .maybeSingle();

  const customerId =
    stripeCustomerId?.trim() ||
    profile?.stripe_customer_id?.trim() ||
    null;

  if (!customerId) {
    return { planTier: null, isSubscribed: null, customerId: null, subscriptionId: null };
  }

  try {
    const stripe = getStripe();
    const subscription = await fetchPrimarySubscription(stripe, customerId);
    const wasSubscribed =
      currentIsSubscribed === true || profile?.is_subscribed === true;
    const hadRecordedSubscription = Boolean(profile?.stripe_subscription_id?.trim());

    if (!subscription) {
      // Uniquement si un vrai abonnement Stripe était enregistré — évite d’écraser un Pro manuel.
      if (wasSubscribed && hadRecordedSubscription) {
        const result = await setProfilePlanByUserId(
          userId,
          STRIPE_FREE_PLAN_TIER,
          customerId,
          null,
        );
        if (!result.ok) {
          console.error("[stripe] sync downgrade failed:", result.error);
          return { planTier: null, isSubscribed: null, customerId, subscriptionId: null };
        }
        return {
          planTier: STRIPE_FREE_PLAN_TIER,
          isSubscribed: false,
          customerId,
          subscriptionId: null,
        };
      }
      return { planTier: null, isSubscribed: null, customerId, subscriptionId: null };
    }

    const subscriptionId = subscription.id;
    const shouldActivate = !wasSubscribed;

    if (shouldActivate) {
      const result = await setProfilePlanByUserId(
        userId,
        STRIPE_PRO_PLAN_TIER,
        customerId,
        subscriptionId,
      );
      if (!result.ok) {
        console.error("[stripe] sync PRO failed:", result.error);
        return { planTier: null, isSubscribed: true, customerId, subscriptionId };
      }
      return {
        planTier: STRIPE_PRO_PLAN_TIER,
        isSubscribed: true,
        customerId,
        subscriptionId,
      };
    }

    if (profile?.stripe_subscription_id !== subscriptionId) {
      await setProfileStripeSubscriptionByUserId(userId, subscriptionId, customerId);
    }

    return { planTier: null, isSubscribed: true, customerId, subscriptionId };
  } catch (error) {
    console.error("[stripe] sync billing failed:", error);
    return { planTier: null, isSubscribed: null, customerId, subscriptionId: null };
  }
}
