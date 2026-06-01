import type { OnboardingProfileDraft } from "@/domain/onboarding";
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

  return {
    plan: "PRO",
    businessName: mapped.name,
    phone: mapped.phone,
    city: mapped.city,
    metierKey: "ELECTRICIEN",
    presentationMode: hasDescription ? "about" : null,
    aboutText: hasDescription ? mapped.description : "",
    selectedInterventions: [],
    social: socialPatch,
    visual: {
      fontId: "inter",
      accentColor: brandColor,
      avatarPreviewUrl: mapped.avatarUrl || null,
      bannerPreviewUrl: null,
    },
    importPlatform: mapped.platform,
    importIdentifier: mapped.identifier,
    importGoogleRating: mapped.rating,
    importGoogleReviewCount: mapped.reviews,
  };
}
