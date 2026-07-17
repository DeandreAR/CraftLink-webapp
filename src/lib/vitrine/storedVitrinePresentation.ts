import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import type { StoredVitrineConfig } from "@/domain/vitrinePresentation";
import { editorStateToStoredConfig } from "@/domain/vitrinePresentation";

export type OnboardingProgressSnapshot = NonNullable<
  StoredVitrineConfig["onboardingProgress"]
>;

/** Snapshot complet depuis le brouillon onboarding. */
export function buildStoredVitrineFromOnboarding(
  profile: OnboardingProfileDraft,
  services: OnboardingService[],
  onboardingProgress?: OnboardingProgressSnapshot | null,
): StoredVitrineConfig {
  const config = editorStateToStoredConfig(
    profile,
    services,
    onboardingProgress ?? undefined,
  );
  // Publication finale : on retire le marqueur de progression.
  if (onboardingProgress === null) {
    delete config.onboardingProgress;
  }
  return config;
}
