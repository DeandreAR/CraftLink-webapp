import type {
  OnboardingPlan,
  OnboardingProfileDraft,
  OnboardingService,
} from "@/domain/onboarding";
import { profileToEditorState } from "@/domain/vitrinePresentation";
import type { Profile } from "@/domain/profile";
import type { ProOnboardingPhase } from "@/lib/onboarding/proOnboardingReducer";

export type FreeOnboardingPhase =
  | "plan"
  | "general"
  | "interventions"
  | "slug"
  | "visual"
  | "complete";

export type OnboardingResumeState = {
  profile: OnboardingProfileDraft;
  services: OnboardingService[];
  wizard: "free" | "pro";
  freePhase: FreeOnboardingPhase;
  proPhase: ProOnboardingPhase;
  draftPlan: OnboardingPlan;
  hasProgress: boolean;
};

const FREE_PHASES = new Set<string>([
  "plan",
  "general",
  "interventions",
  "slug",
  "visual",
]);

const PRO_PHASES = new Set<string>([
  "choice",
  "gap",
  "slug",
  "validate",
  "manual-general",
  "manual-interventions",
  "manual-visual",
]);

function hasMeaningfulDraft(profile: OnboardingProfileDraft, services: OnboardingService[]): boolean {
  return Boolean(
    profile.businessName.trim() ||
      profile.phone.trim() ||
      profile.metierKey ||
      profile.city.trim() ||
      profile.aboutText.trim() ||
      profile.selectedInterventions.length > 0 ||
      profile.pageSlug.trim() ||
      services.length > 0,
  );
}

/** Reprend un brouillon onboarding depuis le profil Supabase. */
export function loadOnboardingResume(profile: Profile): OnboardingResumeState | null {
  const { profileDraft, services } = profileToEditorState(profile);
  const progress = profile.vitrine_presentation?.onboardingProgress;
  const meaningful = hasMeaningfulDraft(profileDraft, services);

  if (!meaningful && !progress) {
    return null;
  }

  const wizard: "free" | "pro" =
    progress?.wizard === "pro" || profileDraft.plan === "PRO" ? "pro" : "free";

  let freePhase: FreeOnboardingPhase = "general";
  let proPhase: ProOnboardingPhase = "choice";

  if (progress?.phase) {
    if (wizard === "free" && FREE_PHASES.has(progress.phase)) {
      freePhase = progress.phase as FreeOnboardingPhase;
    }
    if (wizard === "pro" && PRO_PHASES.has(progress.phase)) {
      proPhase = progress.phase as ProOnboardingPhase;
    }
  } else if (meaningful) {
    // Ancien brouillon sans étape : reprendre au plus loin possible.
    if (profileDraft.pageSlugConfirmed) {
      freePhase = "visual";
      proPhase = "validate";
    } else if (
      profileDraft.presentationMode ||
      profileDraft.aboutText.trim() ||
      profileDraft.selectedInterventions.length > 0
    ) {
      freePhase = "slug";
      proPhase = "manual-visual";
    } else if (profileDraft.businessName.trim() || profileDraft.metierKey) {
      freePhase = "interventions";
      proPhase = "manual-interventions";
    }
  }

  const draftPlan: OnboardingPlan =
    progress?.draftPlan === "PRO" || progress?.draftPlan === "FREE"
      ? progress.draftPlan
      : profileDraft.plan;

  return {
    profile: { ...profileDraft, plan: draftPlan },
    services,
    wizard,
    freePhase,
    proPhase,
    draftPlan,
    hasProgress: true,
  };
}
