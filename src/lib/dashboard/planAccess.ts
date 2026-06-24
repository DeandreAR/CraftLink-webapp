import type { PlanTier } from "@/domain/profile";

/** Limite mensuelle de leads visibles sur le plan Essentiel (grille tarifaire). */
export const ESSENTIAL_MONTHLY_LEAD_LIMIT = 15;

export function isProPlan(planTier: PlanTier | string): boolean {
  return String(planTier).toUpperCase() === "PRO";
}

export function isEssentialPlan(planTier: PlanTier | string): boolean {
  return !isProPlan(planTier);
}

/** Lead verrouillé (flouté) pour les comptes Essentiel au-delà du quota. */
export function isLeadAccessLocked(
  leadIndex: number,
  planTier: PlanTier | string,
): boolean {
  if (isProPlan(planTier)) return false;
  return leadIndex >= ESSENTIAL_MONTHLY_LEAD_LIMIT;
}

export function essentialLeadsRemaining(
  visibleCount: number,
  planTier: PlanTier | string,
): number {
  if (isProPlan(planTier)) return Infinity;
  return Math.max(0, ESSENTIAL_MONTHLY_LEAD_LIMIT - visibleCount);
}
