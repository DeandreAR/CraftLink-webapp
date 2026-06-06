import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export const STRIPE_PRO_PLAN_TIER = "PRO" as const;
/** Mode dégradé après échec de paiement ou résiliation (offre Essentiel). */
export const STRIPE_FREE_PLAN_TIER = "ALL_SOURCES" as const;

export async function setProfilePlanByUserId(
  userId: string,
  planTier: typeof STRIPE_PRO_PLAN_TIER | typeof STRIPE_FREE_PLAN_TIER,
  stripeCustomerId?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client unavailable" };
  }

  const patch: Record<string, string> = {
    plan_tier: planTier,
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

export async function setProfilePlanByStripeCustomerId(
  stripeCustomerId: string,
  planTier: typeof STRIPE_PRO_PLAN_TIER | typeof STRIPE_FREE_PLAN_TIER,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client unavailable" };
  }

  const { error } = await admin
    .from("profiles")
    .update({
      plan_tier: planTier,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", stripeCustomerId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
