import { isCraftlinkPro, resolveCraftlinkPlan } from "@/domain/craftlinkPlan";

export function isProPlanTier(planTier: string | null | undefined): boolean {
  return isCraftlinkPro(resolveCraftlinkPlan(planTier ?? ""));
}

/** Pro : activé par défaut sauf désactivation explicite en base. Essentiel : toujours désactivé. */
export function resolveVoiceCaptureEnabled(
  planTier: string | null | undefined,
  stored: boolean | null | undefined,
): boolean {
  if (!isProPlanTier(planTier)) return false;
  return stored !== false;
}

/** Valeur à persister à l'activation du plan Pro. */
export const VOICE_CAPTURE_DEFAULT_FOR_PRO = true;
