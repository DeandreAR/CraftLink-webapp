import type { Profile } from "@/domain/profile";
import { authPath } from "@/lib/auth/paths";
import type { Locale } from "@/i18n/config";

/** Onboarding terminé lorsque la publication a été confirmée (pas au simple brouillon). */
export function isOnboardingComplete(
  profile: Pick<Profile, "onboarding_completed_at">,
): boolean {
  return Boolean(profile.onboarding_completed_at);
}

export function resolvePostAuthPath(
  lang: Locale | undefined,
  profile: Pick<Profile, "onboarding_completed_at">,
): string {
  return isOnboardingComplete(profile)
    ? authPath(lang, "dashboard")
    : authPath(lang, "onboarding");
}
