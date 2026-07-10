import {
  defaultOnboardingProfile,
  type OnboardingProfileDraft,
  type OnboardingService,
  type ProImportPlatform,
} from "@/domain/onboarding";
import { extractDominantColorFromUrl, FALLBACK_BRAND } from "@/lib/onboarding/extractDominantColor";
import { fetchProImportApi } from "@/lib/onboarding/proImport/fetchProImportApi";
import { mappedImportToProfileDraft } from "@/lib/onboarding/proImport/toProfileDraft";
import type { MappedProImportData, ProImportRunResult } from "@/lib/onboarding/proImport/types";
import { getMissingProRequiredFields } from "@/lib/onboarding/proRequiredFields";

const FALLBACK_BY_PLATFORM: Record<ProImportPlatform, string> = {
  google: "#2563eb",
  instagram: "#ea580c",
  facebook: "#0f766e",
};

export type ProImportPipelineResult = ProImportRunResult & {
  profile: Partial<OnboardingProfileDraft>;
  services: OnboardingService[];
  missingFields: ReturnType<typeof getMissingProRequiredFields>;
  source: "live";
  magicImportSuccessCount?: number;
  magicImportRemaining?: number;
};

export async function extractBrandColorFromAvatar(
  avatarUrl: string,
  platform: ProImportPlatform,
): Promise<string> {
  const fallback = FALLBACK_BY_PLATFORM[platform];
  if (!avatarUrl.trim()) return fallback;
  try {
    const extracted = await extractDominantColorFromUrl(avatarUrl);
    return extracted !== FALLBACK_BRAND ? extracted : fallback;
  } catch {
    return fallback;
  }
}

/** Pipeline : API serveur → mapping → couleur dominante → brouillon profil. */
export async function runProImportPipeline(
  platform: ProImportPlatform,
  identifier: string,
): Promise<ProImportPipelineResult> {
  const { mapped, profile: profilePatch, services, missingFields, source, magicImportSuccessCount, magicImportRemaining } =
    await fetchProImportApi(platform, identifier);

  const brandColor = await extractBrandColorFromAvatar(mapped.avatarUrl, platform);
  const profile = mappedImportToProfileDraft(mapped, brandColor);

  const draft: OnboardingProfileDraft = {
    ...defaultOnboardingProfile("PRO"),
    ...profilePatch,
    ...profile,
    plan: "PRO",
    visual: {
      ...defaultOnboardingProfile("PRO").visual,
      ...profilePatch.visual,
      ...profile.visual,
      accentColor: brandColor,
    },
    social: {
      ...defaultOnboardingProfile("PRO").social,
      ...profilePatch.social,
      ...profile.social,
    },
  };

  return {
    mapped,
    brandColor,
    profile,
    services,
    missingFields: missingFields.length > 0 ? missingFields : getMissingProRequiredFields(draft),
    source,
    magicImportSuccessCount,
    magicImportRemaining,
  };
}
