import type { OnboardingProfileDraft, OnboardingService, ProImportPlatform } from "@/domain/onboarding";
import { AI_GENERATION_QUOTA_EXCEEDED } from "@/lib/ai/aiGenerationQuota";
import {
  IMPORT_PROVIDER_ERROR,
  IMPORT_QUOTA_EXCEEDED,
  PROVIDER_QUOTA_EXHAUSTED,
  SERVER_CONFIG_ERROR,
} from "@/lib/onboarding/proImport/api/constants";
import { sanitizeImportErrorForClient } from "@/lib/onboarding/proImport/api/importErrorCodes";
import { ProImportDegradedError } from "@/lib/onboarding/proImport/api/clientErrors";
import type { ImportApiResponse } from "@/lib/onboarding/proImport/api/unifiedImportData";
import { unifiedToMappedImportData } from "@/lib/onboarding/proImport/api/unifiedToMapped";
import type { ProRequiredFieldKey } from "@/lib/onboarding/proRequiredFields";
import { mappedImportToProfileDraft } from "@/lib/onboarding/proImport/toProfileDraft";
import type { MappedProImportData } from "@/lib/onboarding/proImport/types";
import { getMissingProRequiredFields } from "@/lib/onboarding/proRequiredFields";

const IMPORT_ROUTES: Record<ProImportPlatform, string> = {
  google: "/api/import/google",
  instagram: "/api/import/instagram",
  facebook: "/api/import/facebook",
};

export type ClientProImportApiResult = {
  mapped: MappedProImportData;
  profile: Partial<OnboardingProfileDraft>;
  services: OnboardingService[];
  missingFields: ProRequiredFieldKey[];
  source: "live";
  magicImportSuccessCount?: number;
  magicImportRemaining?: number;
  aiGenerationsCount?: number;
  aiGenerationsRemaining?: number | null;
  unlimited?: boolean;
};

function buildMissingFields(profile: Partial<OnboardingProfileDraft>): ProRequiredFieldKey[] {
  const draftForValidation = {
    plan: "PRO" as const,
    businessName: profile.businessName ?? "",
    phone: profile.phone ?? "",
    city: profile.city ?? "",
    metierKey: profile.metierKey ?? "",
    cityCode: "",
    postalCode: "",
    interventionRadiusKm: 30,
    presentationMode: profile.presentationMode ?? null,
    selectedInterventions: profile.selectedInterventions ?? [],
    aboutText: profile.aboutText ?? "",
    social: {
      instagram: "",
      facebook: "",
      tiktok: "",
      threads: "",
      snapchat: "",
      googleBusinessUrl: "",
      ...profile.social,
    },
    affiliateLinks: profile.affiliateLinks ?? [],
    partnerBrands: profile.partnerBrands ?? [],
    visual: {
      fontId: "inter" as const,
      accentColor: "#9a8468",
      avatarPreviewUrl: null,
      bannerPreviewUrl: null,
      ...profile.visual,
    },
    pageSlug: profile.pageSlug ?? "",
    pageSlugConfirmed: profile.pageSlugConfirmed ?? false,
  };

  return getMissingProRequiredFields(draftForValidation);
}

function isDegradedResponse(
  json: ImportApiResponse,
): json is Extract<ImportApiResponse, { success: false; error_type: string }> {
  return (
    "success" in json &&
    json.success === false &&
    "error_type" in json &&
    json.error_type === PROVIDER_QUOTA_EXHAUSTED
  );
}

/**
 * Appelle la route API Next.js dédiée à la plateforme (clés secrètes côté serveur).
 * @throws {ProImportDegradedError} quota épuisé ou panne réseau (mode dégradé)
 */
export async function fetchProImportApi(
  platform: ProImportPlatform,
  identifier: string,
): Promise<ClientProImportApiResult> {
  const response = await fetch(IMPORT_ROUTES[platform], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });

  const json = (await response.json()) as ImportApiResponse;

  if (response.ok && isDegradedResponse(json)) {
    throw new ProImportDegradedError(json.message);
  }

  if (!response.ok) {
    const message =
      "error" in json && typeof json.error === "string" ? json.error : IMPORT_PROVIDER_ERROR;
    if (
      (response.status === 403 || response.status === 429) &&
      (message === AI_GENERATION_QUOTA_EXCEEDED || message === IMPORT_QUOTA_EXCEEDED)
    ) {
      throw new Error(AI_GENERATION_QUOTA_EXCEEDED);
    }
    throw new Error(
      message === SERVER_CONFIG_ERROR
        ? IMPORT_PROVIDER_ERROR
        : sanitizeImportErrorForClient(message),
    );
  }

  if (!("success" in json) || json.success !== true || !json.data) {
    throw new Error(IMPORT_PROVIDER_ERROR);
  }

  const mapped = unifiedToMappedImportData(json.data, platform, identifier);
  const profile = mappedImportToProfileDraft(mapped, "#9a8468");
  const missingFields = buildMissingFields(profile);

  const aiGenerationsCount =
    "aiGenerationsCount" in json && typeof json.aiGenerationsCount === "number"
      ? json.aiGenerationsCount
      : "magicImportSuccessCount" in json && typeof json.magicImportSuccessCount === "number"
        ? json.magicImportSuccessCount
        : undefined;
  const aiGenerationsRemaining =
    "aiGenerationsRemaining" in json && (typeof json.aiGenerationsRemaining === "number" || json.aiGenerationsRemaining === null)
      ? json.aiGenerationsRemaining
      : "magicImportRemaining" in json && typeof json.magicImportRemaining === "number"
        ? json.magicImportRemaining
        : undefined;

  return {
    mapped,
    profile,
    services: mapped.services ?? [],
    missingFields,
    source: "live",
    aiGenerationsCount,
    aiGenerationsRemaining,
    unlimited: "unlimited" in json && json.unlimited === true,
    magicImportSuccessCount: aiGenerationsCount,
    magicImportRemaining:
      typeof aiGenerationsRemaining === "number" ? aiGenerationsRemaining : undefined,
  };
}
