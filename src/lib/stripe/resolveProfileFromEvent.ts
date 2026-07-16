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

function subscriptionIdFrom(
  subscription: string | Stripe.Subscription | null | undefined,
): string | null {
  if (!subscription) return null;
  if (typeof subscription === "string") return subscription;
  return subscription.id ?? null;
}

export type ResolvedStripeProfile = {
  userId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

export function resolveProfileFromSubscription(
  subscription: Stripe.Subscription,
): ResolvedStripeProfile {
  return {
    userId: readMetadataUserId(subscription.metadata),
    stripeCustomerId: customerIdFrom(subscription.customer),
    stripeSubscriptionId: subscription.id,
  };
}

export function resolveProfileFromCheckoutSession(
  session: Stripe.Checkout.Session,
): ResolvedStripeProfile {
  return {
    userId:
      session.client_reference_id?.trim() ||
      session.metadata?.supabase_user_id?.trim() ||
      null,
    stripeCustomerId: customerIdFrom(session.customer),
    stripeSubscriptionId: subscriptionIdFrom(session.subscription),
  };
}

export async function resolveProfileFromInvoice(
  invoice: Stripe.Invoice,
  stripe: Stripe,
): Promise<ResolvedStripeProfile> {
  const userId = readMetadataUserId(invoice.metadata);
  const customerId = customerIdFrom(invoice.customer);
  const subscriptionId = extractSubscriptionIdFromInvoice(invoice);

  if (userId) {
    return {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    };
  }

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const fromSub = resolveProfileFromSubscription(subscription);
    if (fromSub.userId) {
      return {
        userId: fromSub.userId,
        stripeCustomerId: customerId ?? fromSub.stripeCustomerId,
        stripeSubscriptionId: subscriptionId,
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
        return {
          userId: data.id,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        };
      }
    }
  }

  return {
    userId: null,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
  };
}
