import "server-only";

import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function readMetadataUserId(
  metadata: Stripe.Metadata | null | undefined,
): string | null {
  if (!metadata) return null;
  const id =
    metadata.supabase_user_id ??
    metadata.user_id ??
    metadata.userId ??
    null;
  return id?.trim() || null;
}

function extractSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const raw = invoice as Stripe.Invoice & {
    subscription?: string | { id?: string } | null;
  };

  const direct = raw.subscription;
  if (typeof direct === "string") return direct;
  if (direct && typeof direct === "object" && direct.id) return direct.id;

  const parentSub = raw.parent?.subscription_details?.subscription;
  if (typeof parentSub === "string") return parentSub;

  for (const line of invoice.lines?.data ?? []) {
    const lineSub = (line as { subscription?: string | { id?: string } }).subscription;
    if (typeof lineSub === "string") return lineSub;
    if (lineSub && typeof lineSub === "object" && lineSub.id) return lineSub.id;
  }

  return null;
}

function customerIdFrom(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  if ("deleted" in customer && customer.deleted) return null;
  return customer.id;
}

export type ResolvedStripeProfile = {
  userId: string | null;
  stripeCustomerId: string | null;
};

export function resolveProfileFromSubscription(
  subscription: Stripe.Subscription,
): ResolvedStripeProfile {
  return {
    userId: readMetadataUserId(subscription.metadata),
    stripeCustomerId: customerIdFrom(subscription.customer),
  };
}

export async function resolveProfileFromInvoice(
  invoice: Stripe.Invoice,
  stripe: Stripe,
): Promise<ResolvedStripeProfile> {
  const userId = readMetadataUserId(invoice.metadata);
  const customerId = customerIdFrom(invoice.customer);

  if (userId) {
    return { userId, stripeCustomerId: customerId };
  }

  const subscriptionId = extractSubscriptionIdFromInvoice(invoice);

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const fromSub = resolveProfileFromSubscription(subscription);
    if (fromSub.userId) {
      return {
        userId: fromSub.userId,
        stripeCustomerId: customerId ?? fromSub.stripeCustomerId,
      };
    }
  }

  if (customerId) {
    const admin = createAdminClient();
    if (admin) {
      const { data } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      if (data?.id) {
        return { userId: data.id, stripeCustomerId: customerId };
      }
    }
  }

  return { userId: null, stripeCustomerId: customerId };
}
