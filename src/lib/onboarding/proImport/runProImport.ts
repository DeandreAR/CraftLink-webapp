import {
  defaultOnboardingProfile,
  type OnboardingProfileDraft,
  type ProImportPlatform,
} from "@/domain/onboarding";
import { extractDominantColorFromUrl, FALLBACK_BRAND } from "@/lib/onboarding/extractDominantColor";
import { fetchProImportApi } from "@/lib/onboarding/proImport/fetchProImportApi";
import { mapProImportApiPayload } from "@/lib/onboarding/proImport/mappers";
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
  missingFields: ReturnType<typeof getMissingProRequiredFields>;
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

/** Pipeline complet : REST simulé → mapping → couleur dominante → brouillon profil. */
export async function runProImportPipeline(
  platform: ProImportPlatform,
  identifier: string,
): Promise<ProImportPipelineResult> {
  const apiPayload = await fetchProImportApi(platform, identifier);
  const mapped: MappedProImportData = mapProImportApiPayload(apiPayload, identifier);
  const brandColor = await extractBrandColorFromAvatar(mapped.avatarUrl, platform);
  const profilePatch = mappedImportToProfileDraft(mapped, brandColor);
  const draft: OnboardingProfileDraft = {
    ...defaultOnboardingProfile("PRO"),
    ...profilePatch,
    visual: {
      ...defaultOnboardingProfile("PRO").visual,
      ...profilePatch.visual,
    },
    social: {
      ...defaultOnboardingProfile("PRO").social,
      ...profilePatch.social,
    },
  };
  const missingFields = getMissingProRequiredFields(draft);

  return { mapped, brandColor, profile: profilePatch, missingFields };
}
