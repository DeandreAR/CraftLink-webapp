/** Champs profil nécessaires pour déterminer l'accès Pro (essai local ou abonnement Stripe). */
export type ProAccessProfile = {
  is_subscribed?: boolean | null;
  trial_ends_at?: string | null;
  /** Conservé pour rétrocompatibilité admin / scripts. */
  plan_tier?: string | null;
};

export const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export function computeTrialEndsAt(from: Date = new Date()): string {
  return new Date(from.getTime() + TRIAL_DURATION_MS).toISOString();
}

export function isTrialActive(
  trialEndsAt: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!trialEndsAt) return false;
  const end = new Date(trialEndsAt);
  return !Number.isNaN(end.getTime()) && end > now;
}

/**
 * Pro si abonnement Stripe actif, essai local encore valide, ou palier PRO
 * posé manuellement / legacy en base (`plan_tier`).
 */
export function isProUser(profile: ProAccessProfile): boolean {
  if (profile.is_subscribed === true) return true;
  if (isTrialActive(profile.trial_ends_at)) return true;
  const tier = String(profile.plan_tier ?? "").trim().toUpperCase();
  return tier === "PRO" || tier === "EARLY_BIRD" || tier === "EARLY BIRD";
}

export function isSubscribedPro(profile: ProAccessProfile): boolean {
  return profile.is_subscribed === true;
}

export function pickProAccess(profile: ProAccessProfile): ProAccessProfile {
  return {
    is_subscribed: profile.is_subscribed ?? false,
    trial_ends_at: profile.trial_ends_at ?? null,
    plan_tier: profile.plan_tier ?? null,
  };
}
