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
import { isCraftlinkPro, resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { PlanTier } from "@/domain/profile";

async function fetchPrimarySubscription(
  stripe: Stripe,
  customerId: string,
): Promise<Stripe.Subscription | null> {
  for (const status of ["active", "trialing", "past_due"] as const) {
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
  customerId: string | null;
  subscriptionId: string | null;
};

/**
 * Répare plan_tier et références Stripe (customer / subscription) depuis l’API prod.
 */
export async function syncProfilePlanFromStripeIfNeeded(
  userId: string,
  currentPlanTier: string | null | undefined,
  stripeCustomerId?: string | null,
): Promise<StripeProfileSyncResult> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("id", userId)
    .maybeSingle();

  const customerId =
    stripeCustomerId?.trim() ||
    profile?.stripe_customer_id?.trim() ||
    null;

  if (!customerId) {
    return { planTier: null, customerId: null, subscriptionId: null };
  }

  try {
    const stripe = getStripe();
    const subscription = await fetchPrimarySubscription(stripe, customerId);

    if (!subscription) {
      if (isCraftlinkPro(resolveCraftlinkPlan(currentPlanTier ?? ""))) {
        const result = await setProfilePlanByUserId(
          userId,
          STRIPE_FREE_PLAN_TIER,
          customerId,
          null,
        );
        if (!result.ok) {
          console.error("[stripe] sync downgrade failed:", result.error);
          return { planTier: null, customerId, subscriptionId: null };
        }
        return { planTier: STRIPE_FREE_PLAN_TIER, customerId, subscriptionId: null };
      }
      return { planTier: null, customerId, subscriptionId: null };
    }

    const subscriptionId = subscription.id;
    const shouldUpgradePlan = !isCraftlinkPro(resolveCraftlinkPlan(currentPlanTier ?? ""));

    if (shouldUpgradePlan) {
      const result = await setProfilePlanByUserId(
        userId,
        STRIPE_PRO_PLAN_TIER,
        customerId,
        subscriptionId,
      );
      if (!result.ok) {
        console.error("[stripe] sync PRO failed:", result.error);
        return { planTier: null, customerId, subscriptionId };
      }
      return { planTier: STRIPE_PRO_PLAN_TIER, customerId, subscriptionId };
    }

    if (profile?.stripe_subscription_id !== subscriptionId) {
      await setProfileStripeSubscriptionByUserId(userId, subscriptionId, customerId);
    }

    return { planTier: null, customerId, subscriptionId };
  } catch (error) {
    console.error("[stripe] sync billing failed:", error);
    return { planTier: null, customerId, subscriptionId: null };
  }
}
