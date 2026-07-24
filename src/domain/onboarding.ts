import type { OnboardingFontId } from "@/lib/onboarding/onboardingFonts";
import type { OnboardingSocialFollowers } from "@/lib/onboarding/socialFollowers";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import type {
  HeaderBgType,
  HeaderLayoutType,
} from "@/domain/recommendedProduct";
import { DEFAULT_PRO_SELECTION_TITLE } from "@/domain/recommendedProduct";

export type OnboardingPlan = "FREE" | "PRO";

/** Entrée landing : choix Essentiel/Pro ou parcours Pro direct. */
export type OnboardingPlanIntent = "choice" | "pro";

export type ProImportPlatform = "google" | "instagram" | "facebook";

export type OnboardingServicePriceMode = "quote" | "amount";

export type OnboardingCurrency = "EUR" | "USD";

/** Interventions (tags) OU description — pas les deux. */
export type OnboardingPresentationMode = "interventions" | "about";

export type OnboardingAffiliateLink = {
  id: string;
  /** Nom affiché (ex. « Code Leroy Merlin », « Affiliation Amazon »). */
  label: string;
  url: string;
  /** Réduction ou avantage à partager (ex. « -10 % », « Livraison offerte »). */
  discount?: string;
  /**
   * Image d’aperçu pour le partage social (prioritaire sur l’og:image du produit).
   * URL publique (upload gallery ou lien externe).
   */
  imageUrl?: string;
};

export type OnboardingPartnerBrand = {
  id: string;
  name: string;
};

export type OnboardingSocialDraft = {
  instagram: string;
  facebook: string;
  tiktok: string;
  threads: string;
  snapchat: string;
  googleBusinessUrl: string;
};

import type { PortfolioSourceType } from "@/domain/portfolio";

export type OnboardingPortfolioItem = {
  id: string;
  source_type: PortfolioSourceType;
  /** URL externe (Instagram, Facebook, Google) — aucun fichier stocké. */
  externalUrl?: string;
  /** URL publique image (import direct uniquement). */
  imageUrl?: string;
  /** Chemin Storage Supabase — suppression si source direct. */
  storagePath?: string;
  alt?: string;
  /** Compat import Instagram historique (embed). */
  type?: "instagram_embed" | "instagram_profile_embed";
  embedUrl?: string;
};

export type OnboardingVisualDraft = {
  fontId: OnboardingFontId;
  /** Couleur du CTA devis (--primary-color). */
  accentColor: string;
  /** Couleur des boutons secondaires (info, urgence, partenariats). */
  secondaryButtonColor: string;
  avatarPreviewUrl: string | null;
  bannerPreviewUrl: string | null;
  /** Bannière CSS (import Instagram — pas d’image en base). */
  useBrandGradientBanner?: boolean;
  /** Layout header : standard (centré) ou bannière + avatar chevauchant. */
  headerLayoutType?: HeaderLayoutType;
  /** Fond header : uni, dégradé ou image. */
  headerBgType?: HeaderBgType;
  /**
   * Valeur fond :
   * - solid → hex `#FFFFFF`
   * - gradient → JSON `{"from":"#…","to":"#…"}` ou legacy dégradé Instagram
   * - image → URL (sinon `bannerPreviewUrl`)
   */
  headerBgValue?: string | null;
  /** Contour blanc autour de la photo (layout avatar_cover / banner_overlay). */
  headerAvatarBorder?: boolean;
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
  affiliateLinks: OnboardingAffiliateLink[];
  partnerBrands: OnboardingPartnerBrand[];
  /** Affiche le bouton urgence sur la vitrine (si le métier le permet). */
  urgencyCtaEnabled?: boolean;
  /** Onglet « La Sélection Pro » sur la vitrine publique. */
  proSelectionEnabled?: boolean;
  /** Titre personnalisable de l’onglet Sélection Pro. */
  proSelectionTitle?: string;
  visual: OnboardingVisualDraft;
  importPlatform?: ProImportPlatform;
  importIdentifier?: string;
  /** Avis Google issus de l’import GMB. */
  importGoogleRating?: number;
  importGoogleReviewCount?: number;
  /** Années d’expérience détectées dans la bio (import Instagram). */
  importExperienceYears?: number;
  /** Années d’expérience affichées sur la vitrine (éditable). */
  experienceYears?: number;
  /** Nombre de réalisations affiché sur la vitrine (éditable). */
  completedProjectsCount?: number;
  /** Abonnés / followers (import Instagram ou Facebook). */
  importFollowerCount?: number;
  /** Abonnés par réseau + visibilité (éditable dashboard). */
  socialFollowers?: OnboardingSocialFollowers;
  /** Imports automatiques réussis (legacy vitrine JSON). */
  magicImportSuccessCount?: number;
  /** Générations IA consommées (profiles.ai_generations_count). */
  aiGenerationsCount?: number;
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
  fontId: "outfit",
  accentColor: "#9a8468",
  secondaryButtonColor: "#9a8468",
  avatarPreviewUrl: null,
  bannerPreviewUrl: null,
  headerLayoutType: "banner_overlay",
  headerBgType: "solid",
  headerBgValue: "#FFFFFF",
  headerAvatarBorder: true,
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
  affiliateLinks: [],
  partnerBrands: [],
  proSelectionEnabled: true,
  proSelectionTitle: DEFAULT_PRO_SELECTION_TITLE,
  visual: defaultVisualDraft(),
  pageSlug: "",
  pageSlugConfirmed: false,
});

export type GeneralStepField = "businessName" | "metierKey" | "city" | "phone";

export type GeneralStepErrors = Partial<Record<GeneralStepField, string>>;
