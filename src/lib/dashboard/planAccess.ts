import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { isCraftlinkPro, resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { PlanTier } from "@/domain/profile";

/** @deprecated Préférer `resolveCraftlinkPlan` + `isCraftlinkPro`. */
export function isProPlan(planTier: PlanTier | string): boolean {
  return isCraftlinkPro(resolveCraftlinkPlan(String(planTier)));
}

export function isEssentialPlan(planTier: PlanTier | string): boolean {
  return !isProPlan(planTier);
}

export function isEssentialCraftlinkPlan(plan: CraftlinkPlan): boolean {
  return plan === "ESSENTIEL";
}

/** Accès Calendrier / Statistiques — aligné sur `profiles.plan_tier` (source de vérité UI). */
export function hasProFeatureAccess(planTier: PlanTier | string): boolean {
  return isProPlan(planTier);
}
