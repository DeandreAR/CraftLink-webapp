import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { isProImportDegradedError } from "@/lib/onboarding/proImport/api/clientErrors";
import { SERVER_CONFIG_ERROR, FACEBOOK_RAPIDAPI_NOT_SUBSCRIBED } from "@/lib/onboarding/proImport/api/constants";

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
  if (raw === SERVER_CONFIG_ERROR) {
    return copy.serverConfigError;
  }

  if (/identifiant invalide|invalid identifier/i.test(raw)) {
    return copy.importErrorInvalidIdentifier;
  }

  if (platform === "google") {
    if (/introuvable|not found|aucune fiche/i.test(raw)) {
      return copy.importErrorGoogleNotFound;
    }
  }

  if (platform === "instagram") {
    if (/introuvable|invalide|not found|expired|username/i.test(raw)) {
      return copy.importErrorInstagramNotFound;
    }
  }

  if (platform === "facebook") {
    if (
      raw === FACEBOOK_RAPIDAPI_NOT_SUBSCRIBED ||
      /not subscribed|subscription/i.test(raw)
    ) {
      return copy.importErrorFacebookProvider;
    }
    if (/introuvable|not found|vérifiez/i.test(raw)) {
      return copy.importErrorFacebookNotFound;
    }
  }

  if (/HTTP 429|quota|rate.?limit|temporarily unavailable/i.test(raw)) {
    return copy.importErrorProvider;
  }

  if (/HTTP 5\d\d|réseau|network|fetch failed/i.test(raw)) {
    return copy.importErrorProvider;
  }

  if (raw && raw.length < 120 && !/HTTP \d+:/.test(raw)) {
    return raw;
  }

  return copy.importErrorGeneric.replace("{platform}", platformLabel(platform, copy));
}
