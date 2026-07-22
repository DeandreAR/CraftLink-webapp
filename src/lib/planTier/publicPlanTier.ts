import type { PublicPlanTier } from "@/domain/vitrine";
import { isProUser, type ProAccessProfile } from "@/domain/proAccess";

const PRO_DB_TIERS = new Set(["PRO", "EARLY_BIRD", "EARLY BIRD"]);

/** Mappe le `plan_tier` Supabase vers le mode vitrine (gratuit / pro). */
export function normalizePublicPlanTier(dbTier: string | null | undefined): PublicPlanTier {
  const normalized = (dbTier ?? "ALL_SOURCES").trim().toUpperCase();
  if (PRO_DB_TIERS.has(normalized)) {
    return "PRO";
  }
  return "ALL_SOURCES";
}

/** Plan vitrine publique : essai local, abonnement Stripe ou palier PRO legacy. */
export function resolvePublicPlanTier(profile: ProAccessProfile): PublicPlanTier {
  if (isProUser(profile)) {
    return "PRO";
  }
  return normalizePublicPlanTier(profile.plan_tier);
}

export function isProPublicPlan(planTier: PublicPlanTier): boolean {
  return planTier === "PRO";
}
