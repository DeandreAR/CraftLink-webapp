import type {
  OnboardingPlan,
  OnboardingProfileDraft,
  OnboardingService,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { LinkInBioPageProps } from "@/components/vitrine/LinkInBioPage";
import { getMetierLabel } from "@/lib/onboarding/metierOptions";
import { getFontById } from "@/lib/onboarding/onboardingFonts";
import { onboardingSocialToVitrineLinks } from "@/lib/onboarding/socialLinks";
import { onboardingServicesToVitrine } from "@/lib/onboarding/toVitrineServices";
import { resolveTradeLabelFallback } from "@/lib/onboarding/proImport/toProfileDraft";
import type { VitrineDictionary } from "@/i18n/types";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import type {
  PublicPlanTier,
  VitrinePortfolioItem,
  VitrineStatBadge,
} from "@/domain/vitrine";

type PriceLabels = {
  pricePrefix: string;
  priceSuffixEur: string;
  priceSuffixUsd: string;
  surDevis: string;
  aboutTitle: string;
};

function buildStatBadges(profile: OnboardingProfileDraft): VitrineStatBadge[] {
  const hasGoogleBusiness = profile.social.googleBusinessUrl.trim().length > 0;
  const googleRating = profile.importGoogleRating;
  const googleReviews = profile.importGoogleReviewCount;

  if (
    hasGoogleBusiness &&
    googleRating != null &&
    googleReviews != null &&
    profile.importPlatform === "google"
  ) {
    return [
      {
        id: "reviews",
        label: `${googleReviews}+ Avis Google`,
        kind: "google_reviews",
      },
      {
        id: "rating",
        label: String(googleRating),
        kind: "google_rating",
        rating: String(googleRating),
        starCount: 5,
      },
    ];
  }

  if (
    profile.importPlatform === "instagram" &&
    profile.importExperienceYears != null &&
    profile.importExperienceYears > 0
  ) {
    return [
      {
        id: "exp",
        label: `${profile.importExperienceYears}+ ans d'expérience`,
        kind: "default",
      },
    ];
  }

  return [];
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function toVitrinePortfolio(
  items: OnboardingProfileDraft["portfolioItems"],
): VitrinePortfolioItem[] {
  if (!items?.length) return [];
  return items.map((item) => ({
    id: item.id,
    type: item.type,
    embedUrl: item.embedUrl,
    alt: item.alt,
  }));
}

export function buildOnboardingPreviewProps(
  profile: OnboardingProfileDraft,
  plan: OnboardingPlan,
  services: OnboardingService[],
  locale: Locale,
  vitrineCopy: VitrineDictionary,
  priceLabels: PriceLabels,
): LinkInBioPageProps {
  const metierKey = profile.metierKey as MetierKey | "";
  const isInstagramImport = profile.importPlatform === "instagram";
  const planTier: PublicPlanTier = plan === "PRO" ? "PRO" : "ALL_SOURCES";

  const tradeLabelFromMetier =
    metierKey && metierKey.length > 0 ? getMetierLabel(metierKey, locale) : "";
  const tradeLabel =
    tradeLabelFromMetier || resolveTradeLabelFallback(profile, "");

  const vitrineServices =
    services.length > 0
      ? onboardingServicesToVitrine(services, {
          pricePrefix: priceLabels.pricePrefix,
          priceSuffixEur: priceLabels.priceSuffixEur,
          priceSuffixUsd: priceLabels.priceSuffixUsd,
          surDevis: priceLabels.surDevis,
        })
      : [];

  const useBrandBanner =
    isInstagramImport || profile.visual.useBrandGradientBanner === true;

  const bannerUrl = useBrandBanner ? null : profile.visual.bannerPreviewUrl;
  const avatarUrl = profile.visual.avatarPreviewUrl;

  const socialLinks = onboardingSocialToVitrineLinks(profile.social);
  const hasSocial = socialLinks.length > 0;
  const hasGoogleBusiness = profile.social.googleBusinessUrl.trim().length > 0;

  const useInterventions =
    profile.presentationMode === "interventions" && profile.selectedInterventions.length > 0;
  const useAbout =
    profile.presentationMode === "about" && profile.aboutText.trim().length > 0;

  const brandPrimary = profile.visual.accentColor;
  const themeBannerFrom = `color-mix(in srgb, ${brandPrimary} 35%, white)`;
  const themeBannerTo = `color-mix(in srgb, ${brandPrimary} 8%, white)`;

  const statBadges = buildStatBadges(profile);
  const portfolioItems = toVitrinePortfolio(profile.portfolioItems);
  const hasPortfolio = portfolioItems.length > 0;

  const serviceAreaSummary = profile.city.trim()
    ? `Intervient à ${profile.city.trim()} et ${profile.interventionRadiusKm} km alentour`
    : "";

  return {
    artisan: {
      slug: profile.pageSlug.trim() || "apercu",
      businessName: profile.businessName.trim(),
      tradeLabel,
      city: profile.city.trim(),
      metierKey: metierKey || undefined,
      avatarInitials: initialsFromName(profile.businessName),
      interventions: useInterventions ? profile.selectedInterventions : [],
      serviceAreaSummary,
      aboutSection: useAbout
        ? { title: priceLabels.aboutTitle, body: profile.aboutText.trim() }
        : undefined,
      googleBusinessUrl: hasGoogleBusiness ? profile.social.googleBusinessUrl.trim() : null,
      statBadges,
      socialLinks,
      portfolioItems,
      media: {
        bannerUrl,
        bannerGradient: useBrandBanner
          ? { from: themeBannerFrom, to: themeBannerTo }
          : undefined,
        avatarUrl,
        showAvatar: Boolean(avatarUrl),
      },
    },
    services: vitrineServices,
    planTier,
    theme: {
      primary: brandPrimary,
      primaryForeground: "#ffffff",
      accent: profile.visual.accentColor,
      background: "#ffffff",
      surface: "#fafafa",
      text: "#171717",
      textMuted: "#737373",
      bannerFrom: themeBannerFrom,
      bannerTo: themeBannerTo,
    },
    profileSettings: {
      visibility: {
        showSocialLinks: hasSocial,
        showStatBadges: statBadges.length > 0,
        showInterventionTags: useInterventions,
        showCollaborationButton: false,
        showPortfolioGallery: hasPortfolio,
        showServicesOnPresentation: vitrineServices.length > 0,
        contentBlockMode: useAbout ? "about" : "interventions",
      },
      cta: {
        ...(plan === "PRO" ? { primaryQuote: "Besoin d'un devis rapide ?" } : {}),
        secondaryInfo: "Poser une Question",
        secondaryUrgent: "Demander un RDV Urgent",
        collaboration: "Collaboration (Partenaires)",
      },
    },
    copy: vitrineCopy,
  };
}

export function previewFontFamily(fontId: OnboardingProfileDraft["visual"]["fontId"]): string {
  return getFontById(fontId).family;
}
