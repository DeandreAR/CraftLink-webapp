import type { MockVitrinePage } from "@/data/mockVitrine";
import type { StoredVitrineConfig } from "@/domain/vitrinePresentation";
import type { OnboardingPlan } from "@/domain/onboarding";
import type { PublicPlanTier } from "@/domain/vitrine";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import { buildOnboardingPreviewProps } from "@/lib/onboarding/buildPreviewPage";
import { profileToEditorState } from "@/domain/vitrinePresentation";
import type { Profile } from "@/domain/profile";

type ProfileVitrineRow = {
  full_name: string | null;
  plan_tier: string | null;
  page_slug: string | null;
  voice_capture_enabled: boolean | null;
};

function planFromTier(planTier: PublicPlanTier): OnboardingPlan {
  return planTier === "PRO" ? "PRO" : "FREE";
}

export function mapStoredConfigToVitrinePage(
  row: ProfileVitrineRow,
  config: StoredVitrineConfig,
  planTier: PublicPlanTier,
  locale: Locale,
  vitrineCopy: VitrineDictionary,
  onboardingCopy: OnboardingDictionary,
): MockVitrinePage | null {
  const slug = row.page_slug?.trim();
  if (!slug) return null;

  const pseudoProfile: Profile = {
    id: "",
    workspace_id: "",
    role: "ADMIN",
    plan_tier: planTier === "PRO" ? "PRO" : "ALL_SOURCES",
    full_name: row.full_name,
    whatsapp_number: null,
    page_slug: slug,
    onboarding_completed_at: null,
    vitrine_presentation: config,
  };

  const { profileDraft, services } = profileToEditorState(pseudoProfile);
  const plan = planFromTier(planTier);

  const preview = buildOnboardingPreviewProps(
    profileDraft,
    plan,
    services,
    locale,
    vitrineCopy,
    {
      pricePrefix: onboardingCopy.services.pricePrefix,
      priceSuffixEur: onboardingCopy.services.priceSuffixEur,
      priceSuffixUsd: onboardingCopy.services.priceSuffixUsd,
      surDevis: onboardingCopy.publicServices.surDevis,
      aboutTitle: onboardingCopy.interventions.aboutLabel,
    },
  );

  return {
    artisan: preview.artisan,
    services: preview.services,
    planTier: preview.planTier,
    theme: preview.theme,
    profileSettings: {
      ...preview.profileSettings,
      showCollaborationButton: planTier === "PRO",
      voiceCaptureEnabled: Boolean(row.voice_capture_enabled),
    },
  };
}
