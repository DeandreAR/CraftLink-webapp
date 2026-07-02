import type { OnboardingFontId } from "@/lib/onboarding/onboardingFonts";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export type OnboardingPlan = "FREE" | "PRO";

/** Entrée landing : choix Essentiel/Pro ou parcours Pro direct. */
export type OnboardingPlanIntent = "choice" | "pro";

export type ProImportPlatform = "google" | "instagram" | "facebook";

export type OnboardingServicePriceMode = "quote" | "amount";

export type OnboardingCurrency = "EUR" | "USD";

/** Interventions (tags) OU description — pas les deux. */
export type OnboardingPresentationMode = "interventions" | "about";

export type OnboardingSocialDraft = {
  instagram: string;
  facebook: string;
  tiktok: string;
  threads: string;
  snapchat: string;
  googleBusinessUrl: string;
};

export type OnboardingPortfolioItem = {
  id: string;
  type: "instagram_embed" | "instagram_profile_embed";
  embedUrl: string;
  alt?: string;
};

export type OnboardingVisualDraft = {
  fontId: OnboardingFontId;
  /** Couleur dominante (logo) — CTA principal et --primary-color. */
  accentColor: string;
  avatarPreviewUrl: string | null;
  bannerPreviewUrl: string | null;
  /** Bannière CSS (import Instagram — pas d’image en base). */
  useBrandGradientBanner?: boolean;
};

export type OnboardingProfileDraft = {
  plan: OnboardingPlan;
  businessName: string;
  phone: string;
  metierKey: MetierKey | "";
  city: string;
  cityCode: string;
  postalCode: string;
  interventionRadiusKm: number;
  presentationMode: OnboardingPresentationMode | null;
  selectedInterventions: string[];
  aboutText: string;
  social: OnboardingSocialDraft;
  visual: OnboardingVisualDraft;
  importPlatform?: ProImportPlatform;
  importIdentifier?: string;
  /** Avis Google issus de l’import GMB. */
  importGoogleRating?: number;
  importGoogleReviewCount?: number;
  /** Années d’expérience détectées dans la bio (import Instagram). */
  importExperienceYears?: number;
  /** Réalisations récentes via embed Instagram (pas d’images stockées). */
  portfolioItems?: OnboardingPortfolioItem[];
  /** Segment URL publique : getcraftlink.com/{pageSlug} */
  pageSlug: string;
  pageSlugConfirmed: boolean;
};

export type OnboardingService = {
  id: string;
  name: string;
  priceMode: OnboardingServicePriceMode;
  price?: number;
  currency: OnboardingCurrency;
};

export const MAX_ONBOARDING_SERVICES = 15;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

export const defaultSocialDraft = (): OnboardingSocialDraft => ({
  instagram: "",
  facebook: "",
  tiktok: "",
  threads: "",
  snapchat: "",
  googleBusinessUrl: "",
});

export const defaultVisualDraft = (): OnboardingVisualDraft => ({
  fontId: "inter",
  accentColor: "#9a8468",
  avatarPreviewUrl: null,
  bannerPreviewUrl: null,
});

export const defaultOnboardingProfile = (
  plan: OnboardingPlan = "FREE",
): OnboardingProfileDraft => ({
  plan,
  businessName: "",
  phone: "",
  metierKey: "",
  city: "",
  cityCode: "",
  postalCode: "",
  interventionRadiusKm: 30,
  presentationMode: null,
  selectedInterventions: [],
  aboutText: "",
  social: defaultSocialDraft(),
  visual: defaultVisualDraft(),
  pageSlug: "",
  pageSlugConfirmed: false,
});

export type GeneralStepField = "businessName" | "metierKey" | "city" | "phone";

export type GeneralStepErrors = Partial<Record<GeneralStepField, string>>;
