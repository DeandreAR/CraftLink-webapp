/** Plan par défaut à l’inscription (règle métier CraftLink). */
export const DEFAULT_PLAN_TIER = "ALL_SOURCES";

/**
 * Valeurs essayées à l’insert si l’enum DB ne contient pas encore ALL_SOURCES.
 * Ordre : métier d’abord, puis offres landing / enum courants.
 */
export const SIGNUP_PLAN_TIER_CANDIDATES = [
  "ALL_SOURCES",
  "ESSENTIAL",
  "ESSENTIEL",
  "FREE",
  "STARTER",
  "PRO",
] as const;

export type PlanTierValue = (typeof SIGNUP_PLAN_TIER_CANDIDATES)[number] | string;
