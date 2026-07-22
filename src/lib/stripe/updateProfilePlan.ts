import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { VOICE_CAPTURE_DEFAULT_FOR_PRO } from "@/lib/dashboard/voiceCaptureDefault";

export const STRIPE_PRO_PLAN_TIER = "PRO" as const;
/** Mode dégradé après échec de paiement ou résiliation (offre Essentiel). */
export const STRIPE_FREE_PLAN_TIER = "ALL_SOURCES" as const;

type StripeBillingPatch = {
  planTier: typeof STRIPE_PRO_PLAN_TIER | typeof STRIPE_FREE_PLAN_TIER;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

function buildPlanPatch({
  planTier,
  stripeCustomerId,
  stripeSubscriptionId,
}: StripeBillingPatch): Record<string, string | boolean | null> {
  const patch: Record<string, string | boolean | null> = {
    plan_tier: planTier,
    is_subscribed: planTier === STRIPE_PRO_PLAN_TIER,
    updated_at: new Date().toISOString(),
  };

  if (planTier === STRIPE_PRO_PLAN_TIER) {
    patch.onboarding_completed_at = new Date().toISOString();
    patch.voice_capture_enabled = VOICE_CAPTURE_DEFAULT_FOR_PRO;
  }

  if (planTier === STRIPE_FREE_PLAN_TIER) {
    patch.stripe_subscription_id = null;
    patch.is_subscribed = false;
  }

  if (stripeCustomerId) {
    patch.stripe_customer_id = stripeCustomerId;
  }

  if (stripeSubscriptionId) {
    patch.stripe_subscription_id = stripeSubscriptionId;
  }

  return patch;
}

export async function setProfilePlanByUserId(
  userId: string,
  planTier: typeof STRIPE_PRO_PLAN_TIER | typeof STRIPE_FREE_PLAN_TIER,
  stripeCustomerId?: string | null,
  stripeSubscriptionId?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client unavailable" };
  }

  const patch = buildPlanPatch({ planTier, stripeCustomerId, stripeSubscriptionId });
  const { error } = await admin.from("profiles").update(patch).eq("id", userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function setProfilePlanByStripeCustomerId(
  stripeCustomerId: string,
  planTier: typeof STRIPE_PRO_PLAN_TIER | typeof STRIPE_FREE_PLAN_TIER,
  stripeSubscriptionId?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client unavailable" };
  }

  const patch = buildPlanPatch({
    planTier,
    stripeCustomerId,
    stripeSubscriptionId,
  });

  const { error } = await admin
    .from("profiles")
    .update(patch)
    .eq("stripe_customer_id", stripeCustomerId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function setProfileStripeSubscriptionByUserId(
  userId: string,
  stripeSubscriptionId: string | null,
  stripeCustomerId?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client unavailable" };
  }

  const patch: Record<string, string | null> = {
    stripe_subscription_id: stripeSubscriptionId,
    updated_at: new Date().toISOString(),
  };

  if (stripeCustomerId) {
    patch.stripe_customer_id = stripeCustomerId;
  }

  const { error } = await admin.from("profiles").update(patch).eq("id", userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
