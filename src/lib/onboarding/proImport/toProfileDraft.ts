import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import { inferTradeLabelFromBio } from "@/lib/onboarding/proImport/inferFromInstagramBio";
import type { MappedProImportData } from "@/lib/onboarding/proImport/types";

export function mappedImportToProfileDraft(
  mapped: MappedProImportData,
  brandColor: string,
): Partial<OnboardingProfileDraft> {
  const hasDescription = mapped.description.trim().length > 0;
  const trimmedId = mapped.identifier.trim().replace(/^@/, "");

  const socialPatch = {
    instagram:
      mapped.platform === "instagram" && trimmedId
        ? `https://instagram.com/${trimmedId}`
        : "",
    facebook:
      mapped.platform === "facebook" && trimmedId ? mapped.identifier.trim() : "",
    tiktok: "",
    threads: "",
    snapchat: "",
    googleBusinessUrl:
      mapped.platform === "google" && trimmedId
        ? `https://g.page/${encodeURIComponent(trimmedId)}`
        : "",
  };

  const inferredMetier: MetierKey | "" =
    mapped.inferredMetierKey && isMetierKey(mapped.inferredMetierKey)
      ? mapped.inferredMetierKey
      : "";

  const isInstagram = mapped.platform === "instagram";

  return {
    plan: "PRO",
    businessName: mapped.name,
    phone: mapped.phone,
    city: mapped.city,
    metierKey: inferredMetier,
    presentationMode: hasDescription ? "about" : null,
    aboutText: hasDescription ? mapped.description : "",
    selectedInterventions: [],
    social: socialPatch,
    visual: {
      fontId: "inter",
      accentColor: brandColor,
      avatarPreviewUrl: mapped.avatarUrl || null,
      bannerPreviewUrl: isInstagram ? null : mapped.avatarUrl || null,
      useBrandGradientBanner: isInstagram || mapped.useBrandGradientBanner === true,
    },
    importPlatform: mapped.platform,
    importIdentifier: mapped.identifier,
    importGoogleRating: mapped.rating,
    importGoogleReviewCount: mapped.reviews,
    importExperienceYears: mapped.experienceYears ?? undefined,
    portfolioItems: mapped.portfolioItems,
  };
}

export function resolveTradeLabelFallback(
  profile: Pick<OnboardingProfileDraft, "metierKey" | "aboutText" | "importPlatform">,
  defaultLabel: string,
): string {
  if (profile.metierKey) return defaultLabel;
  if (profile.importPlatform === "instagram" && profile.aboutText.trim()) {
    return inferTradeLabelFromBio(profile.aboutText) || defaultLabel;
  }
  return defaultLabel;
}
