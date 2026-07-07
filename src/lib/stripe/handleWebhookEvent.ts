import "server-only";

import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import {
  resolveProfileFromInvoice,
  resolveProfileFromSubscription,
} from "@/lib/stripe/resolveProfileFromEvent";
import {
  setProfilePlanByStripeCustomerId,
  setProfilePlanByUserId,
  STRIPE_FREE_PLAN_TIER,
  STRIPE_PRO_PLAN_TIER,
} from "@/lib/stripe/updateProfilePlan";

async function activatePro(resolved: {
  userId: string | null;
  stripeCustomerId: string | null;
}): Promise<void> {
  if (resolved.userId) {
    const result = await setProfilePlanByUserId(
      resolved.userId,
      STRIPE_PRO_PLAN_TIER,
      resolved.stripeCustomerId,
    );
    if (!result.ok) {
      console.error("[stripe] activate PRO failed:", result.error);
    }
    return;
  }

  if (resolved.stripeCustomerId) {
    const result = await setProfilePlanByStripeCustomerId(
      resolved.stripeCustomerId,
      STRIPE_PRO_PLAN_TIER,
    );
    if (!result.ok) {
      console.error("[stripe] activate PRO by customer failed:", result.error);
    }
  }
}

async function downgradeToFree(resolved: {
  userId: string | null;
  stripeCustomerId: string | null;
}): Promise<void> {
  if (resolved.userId) {
    const result = await setProfilePlanByUserId(
      resolved.userId,
      STRIPE_FREE_PLAN_TIER,
    );
    if (!result.ok) {
      console.error("[stripe] downgrade failed:", result.error);
    }
    return;
  }

  if (resolved.stripeCustomerId) {
    const result = await setProfilePlanByStripeCustomerId(
      resolved.stripeCustomerId,
      STRIPE_FREE_PLAN_TIER,
    );
    if (!result.ok) {
      console.error("[stripe] downgrade by customer failed:", result.error);
    }
  }
}

export async function handleStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.client_reference_id ??
        session.metadata?.supabase_user_id ??
        null;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null;

      if (userId) {
        await activatePro({ userId, stripeCustomerId: customerId });
      }
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      await activatePro(resolveProfileFromSubscription(subscription));
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason === "subscription_create") {
        break;
      }
      const resolved = await resolveProfileFromInvoice(invoice, stripe);
      await activatePro(resolved);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const resolved = await resolveProfileFromInvoice(invoice, stripe);
      await downgradeToFree(resolved);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await downgradeToFree(resolveProfileFromSubscription(subscription));
      break;
    }

    default:
      break;
  }
}
