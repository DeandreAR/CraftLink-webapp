import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { isCraftlinkPro, resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import {
  isProUser,
  isSubscribedPro,
  pickProAccess,
  type ProAccessProfile,
} from "@/domain/proAccess";
import type { PlanTier } from "@/domain/profile";

export function resolveCraftlinkPlanFromAccess(profile: ProAccessProfile): CraftlinkPlan {
  return isProUser(profile) ? "PRO" : "ESSENTIEL";
}

/** @deprecated Préférer `isProUser(profile)` ou `resolveCraftlinkPlanFromAccess`. */
export function isProPlan(planTier: PlanTier | string): boolean {
  return isCraftlinkPro(resolveCraftlinkPlan(String(planTier)));
}

export function isEssentialPlan(planTier: PlanTier | string): boolean {
  return !isProPlan(planTier);
}

export function isEssentialCraftlinkPlan(plan: CraftlinkPlan): boolean {
  return plan === "ESSENTIEL";
}

/** Accès Calendrier / Statistiques / Partenariats — essai local ou abonnement Stripe. */
export function hasProFeatureAccess(profile: ProAccessProfile): boolean {
  return isProUser(pickProAccess(profile));
}

export function hasPaidProSubscription(profile: ProAccessProfile): boolean {
  return isSubscribedPro(pickProAccess(profile));
}
