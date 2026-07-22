import type { ProAccessProfile } from "@/domain/proAccess";
import { isProUser } from "@/domain/proAccess";

/** Pro : activé par défaut sauf désactivation explicite en base. Essentiel : toujours désactivé. */
export function resolveVoiceCaptureEnabled(
  profile: ProAccessProfile & { voice_capture_enabled?: boolean | null },
): boolean {
  if (!isProUser(profile)) return false;
  return profile.voice_capture_enabled !== false;
}

/** Valeur à persister à l'activation du plan Pro. */
export const VOICE_CAPTURE_DEFAULT_FOR_PRO = true;
