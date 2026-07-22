import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { isProImportDegradedError } from "@/lib/onboarding/proImport/api/clientErrors";
import { AI_GENERATION_QUOTA_EXCEEDED } from "@/lib/ai/aiGenerationQuota";
import {
  APIFY_AUTH_ERROR,
  IMPORT_FACEBOOK_NOT_FOUND,
  IMPORT_GOOGLE_NOT_FOUND,
  IMPORT_INSTAGRAM_NOT_FOUND,
  IMPORT_INVALID_IDENTIFIER,
  IMPORT_PROVIDER_ERROR,
  IMPORT_QUOTA_EXCEEDED,
  SERVER_CONFIG_ERROR,
} from "@/lib/onboarding/proImport/api/constants";

function platformLabel(
  platform: ProImportPlatform,
  copy: OnboardingDictionary["import"],
): string {
  if (platform === "google") return copy.platformGoogle;
  if (platform === "instagram") return copy.platformInstagram;
  return copy.platformFacebook;
}

export function resolveImportClientMessage(
  platform: ProImportPlatform,
  error: unknown,
  copy: OnboardingDictionary["import"],
): string {
  if (isProImportDegradedError(error)) {
    return copy.quotaFallbackMessage;
  }

  const raw = error instanceof Error ? error.message : "";

  if (raw === AI_GENERATION_QUOTA_EXCEEDED || raw === IMPORT_QUOTA_EXCEEDED) {
    return copy.importQuotaExceeded;
  }

  if (raw === IMPORT_INVALID_IDENTIFIER) {
    return copy.importErrorInvalidIdentifier;
  }

  if (
    raw === SERVER_CONFIG_ERROR ||
    raw === APIFY_AUTH_ERROR ||
    raw === IMPORT_PROVIDER_ERROR
  ) {
    if (platform === "facebook") {
      return copy.importErrorFacebookProvider;
    }
    return copy.importErrorProvider;
  }

  if (platform === "google") {
    if (raw === IMPORT_GOOGLE_NOT_FOUND) {
      return copy.importErrorGoogleNotFound;
    }
  }

  if (platform === "instagram") {
    if (raw === IMPORT_INSTAGRAM_NOT_FOUND) {
      return copy.importErrorInstagramNotFound;
    }
  }

  if (platform === "facebook") {
    if (raw === IMPORT_FACEBOOK_NOT_FOUND) {
      return copy.importErrorFacebookNotFound;
    }
  }

  return copy.importErrorGeneric.replace("{platform}", platformLabel(platform, copy));
}
