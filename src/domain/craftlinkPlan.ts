/** Plan commercial simplifié pour le dashboard et les restrictions UI. */
export type CraftlinkPlan = "ESSENTIEL" | "PRO";

const PRO_TIERS = new Set(["PRO"]);

/** Mappe `plan_tier` Supabase (ALL_SOURCES, FREE, etc.) vers ESSENTIEL ou PRO. */
export function resolveCraftlinkPlan(planTier: string): CraftlinkPlan {
  return PRO_TIERS.has(String(planTier).toUpperCase()) ? "PRO" : "ESSENTIEL";
}

export function isCraftlinkPro(plan: CraftlinkPlan): boolean {
  return plan === "PRO";
}
