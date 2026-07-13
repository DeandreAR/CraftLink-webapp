import "server-only";

import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import { getStripe } from "@/lib/stripe/server";
import { setProfileStripeSubscriptionByUserId } from "@/lib/stripe/updateProfilePlan";

type SubscriptionItemWithPeriod = {
  current_period_end?: number;
  price?: {
    recurring?: {
      interval?: string;
    };
  };
};

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  "active",
  "trialing",
  "past_due",
]);

function readBillingFromSubscription(
  subscription: Stripe.Subscription,
  customerId: string | null,
): SubscriptionBillingSnapshot {
  const item = subscription.items.data[0] as SubscriptionItemWithPeriod | undefined;
  const interval = item?.price?.recurring?.interval;
  const legacyPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;
  const periodEnd =
    typeof item?.current_period_end === "number"
      ? item.current_period_end
      : typeof legacyPeriodEnd === "number"
        ? legacyPeriodEnd
        : null;

  const status = subscription.status;
  const normalizedStatus =
    status === "active" ||
    status === "trialing" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "unpaid"
      ? status
      : null;

  return {
    nextBillingDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    interval: interval === "year" ? "year" : interval === "month" ? "month" : null,
    customerId,
    subscriptionId: subscription.id,
    status: normalizedStatus,
  };
}

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

export async function loadSubscriptionBillingForUser(
  userId: string,
): Promise<SubscriptionBillingSnapshot | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("id", userId)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id?.trim();
  if (!customerId) return null;

  try {
    const stripe = getStripe();
    let subscription: Stripe.Subscription | null = null;
    const storedSubscriptionId = profile?.stripe_subscription_id?.trim();

    if (storedSubscriptionId) {
      try {
        const retrieved = await stripe.subscriptions.retrieve(storedSubscriptionId);
        if (ACTIVE_SUBSCRIPTION_STATUSES.has(retrieved.status)) {
          subscription = retrieved;
        }
      } catch {
        subscription = null;
      }
    }

    if (!subscription) {
      subscription = await fetchPrimarySubscription(stripe, customerId);
    }

    if (!subscription) return null;

    if (storedSubscriptionId !== subscription.id) {
      await setProfileStripeSubscriptionByUserId(userId, subscription.id, customerId);
    }

    return readBillingFromSubscription(subscription, customerId);
  } catch {
    return null;
  }
}
