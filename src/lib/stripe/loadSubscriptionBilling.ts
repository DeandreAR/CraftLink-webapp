import "server-only";

import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import { getStripe } from "@/lib/stripe/server";

type SubscriptionItemWithPeriod = {
  current_period_end?: number;
  price?: {
    recurring?: {
      interval?: string;
    };
  };
};

function readBillingFromSubscription(subscription: Stripe.Subscription): SubscriptionBillingSnapshot {
  const item = subscription.items.data[0] as SubscriptionItemWithPeriod | undefined;
  const interval = item?.price?.recurring?.interval;
  const legacyPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;
  const periodEnd =
    typeof item?.current_period_end === "number"
      ? item.current_period_end
      : typeof legacyPeriodEnd === "number"
        ? legacyPeriodEnd
        : null;

  return {
    nextBillingDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    interval: interval === "year" ? "year" : interval === "month" ? "month" : null,
  };
}

export async function loadSubscriptionBillingForUser(
  userId: string,
): Promise<SubscriptionBillingSnapshot | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, plan_tier")
    .eq("id", userId)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id?.trim();
  if (!customerId) return null;

  try {
    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const subscription = subscriptions.data[0];
    if (!subscription) return null;

    return readBillingFromSubscription(subscription);
  } catch {
    return null;
  }
}
