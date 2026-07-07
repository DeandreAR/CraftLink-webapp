import type { OnboardingProfileDraft } from "@/domain/onboarding";
import type { ProOnboardingPhase } from "@/lib/onboarding/proOnboardingReducer";
import { getMissingProRequiredFields } from "@/lib/onboarding/proRequiredFields";

/** Enchaînement : champs manquants → URL publique → aperçu final. */
export function resolveNextPhaseAfterProfileUpdate(
  profile: OnboardingProfileDraft,
): ProOnboardingPhase {
  const missing = getMissingProRequiredFields(profile);
  if (missing.length > 0) return "gap";
  if (!profile.pageSlugConfirmed || !profile.pageSlug.trim()) return "slug";
  return "validate";
}
