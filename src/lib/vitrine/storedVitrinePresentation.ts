import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import type { StoredVitrineConfig } from "@/domain/vitrinePresentation";
import { editorStateToStoredConfig } from "@/domain/vitrinePresentation";

/** Snapshot complet depuis le brouillon onboarding à la publication. */
export function buildStoredVitrineFromOnboarding(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
): StoredVitrineConfig {
  return editorStateToStoredConfig(profile, services);
}
