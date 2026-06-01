import type {
  OnboardingCurrency,
  OnboardingPlan,
  OnboardingProfileDraft,
  OnboardingService,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { LinkInBioPageProps } from "@/components/vitrine/LinkInBioPage";
import {
  MOCK_VITRINE_ESSENTIAL,
  MOCK_VITRINE_PRO,
} from "@/data/mockVitrine";
import { getMetierLabel } from "@/lib/onboarding/metierOptions";
import { getFontById } from "@/lib/onboarding/onboardingFonts";
import { onboardingSocialToVitrineLinks } from "@/lib/onboarding/socialLinks";
import { onboardingServicesToVitrine } from "@/lib/onboarding/toVitrineServices";
import type { VitrineDictionary } from "@/i18n/types";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

type PriceLabels = {
  pricePrefix: string;
  priceSuffixEur: string;
  priceSuffixUsd: string;
  surDevis: string;
  aboutTitle: string;
};

export function buildOnboardingPreviewProps(
  profile: OnboardingProfileDraft,
  plan: OnboardingPlan,
  services: OnboardingService[],
  locale: Locale,
  vitrineCopy: VitrineDictionary,
  priceLabels: PriceLabels,
): LinkInBioPageProps {
  const base = plan === "PRO" ? MOCK_VITRINE_PRO : MOCK_VITRINE_ESSENTIAL;
  const metierKey = profile.metierKey as MetierKey | "";
  const tradeLabel =
    metierKey && metierKey.length > 0 ? getMetierLabel(metierKey, locale) : base.artisan.tradeLabel;

  const vitrineServices =
    services.length > 0
      ? onboardingServicesToVitrine(services, {
          pricePrefix: priceLabels.pricePrefix,
          priceSuffixEur: priceLabels.priceSuffixEur,
          priceSuffixUsd: priceLabels.priceSuffixUsd,
          surDevis: priceLabels.surDevis,
        })
      : base.services;

  const bannerUrl = profile.visual.bannerPreviewUrl ?? base.artisan.media.bannerUrl;
  const avatarUrl = profile.visual.avatarPreviewUrl ?? base.artisan.media.avatarUrl;

  const socialLinks = onboardingSocialToVitrineLinks(profile.social);
  const hasSocial = socialLinks.length > 0;
  const hasGoogleBusiness = profile.social.googleBusinessUrl.trim().length > 0;

  const useInterventions =
    profile.presentationMode === "interventions" && profile.selectedInterventions.length > 0;
  const useAbout =
    profile.presentationMode === "about" && profile.aboutText.trim().length > 0;

  const brandPrimary = profile.visual.accentColor;
  const googleRating = profile.importGoogleRating;
  const googleReviews = profile.importGoogleReviewCount;

  const statBadgesFromImport =
    hasGoogleBusiness && googleRating != null && googleReviews != null
      ? [
          { id: "exp", label: "10+ Années Exp.", kind: "default" as const },
          {
            id: "reviews",
            label: `${googleReviews}+ Avis Google`,
            kind: "google_reviews" as const,
          },
          {
            id: "rating",
            label: String(googleRating),
            kind: "google_rating" as const,
            rating: String(googleRating),
            starCount: 5,
          },
        ]
      : null;

  return {
    artisan: {
      ...base.artisan,
      businessName: profile.businessName.trim() || base.artisan.businessName,
      tradeLabel,
      city: profile.city.trim() || base.artisan.city,
      metierKey: metierKey || base.artisan.metierKey,
      interventions: useInterventions
        ? profile.selectedInterventions
        : useAbout
          ? []
          : base.artisan.interventions,
      serviceAreaSummary: profile.city
        ? `Intervient à ${profile.city} et ${profile.interventionRadiusKm} km alentour`
        : base.artisan.serviceAreaSummary,
      aboutSection: useAbout
        ? { title: priceLabels.aboutTitle, body: profile.aboutText.trim() }
        : useInterventions
          ? undefined
          : base.artisan.aboutSection,
      googleBusinessUrl: hasGoogleBusiness
        ? profile.social.googleBusinessUrl.trim()
        : base.artisan.googleBusinessUrl,
      statBadges:
        statBadgesFromImport ??
        (hasGoogleBusiness
          ? base.artisan.statBadges
          : base.artisan.statBadges.filter(
              (b) => b.kind !== "google_reviews" && b.kind !== "google_rating",
            )),
      socialLinks: hasSocial ? socialLinks : base.artisan.socialLinks,
      media: {
        ...base.artisan.media,
        bannerUrl,
        avatarUrl,
        showAvatar: true,
      },
    },
    services: vitrineServices,
    planTier: base.planTier,
    theme: {
      ...base.theme,
      primary: brandPrimary,
      primaryForeground: "#ffffff",
      accent: profile.visual.accentColor,
      bannerFrom: `color-mix(in srgb, ${brandPrimary} 35%, white)`,
      bannerTo: `color-mix(in srgb, ${brandPrimary} 8%, white)`,
    },
    profileSettings: {
      ...base.profileSettings,
      visibility: {
        ...base.profileSettings.visibility,
        contentBlockMode: useAbout
          ? "about"
          : useInterventions
            ? "interventions"
            : base.profileSettings.visibility.contentBlockMode,
        showInterventionTags: useInterventions,
        showSocialLinks: hasSocial || base.profileSettings.visibility.showSocialLinks,
        showStatBadges: hasGoogleBusiness || base.profileSettings.visibility.showStatBadges,
      },
    },
    copy: vitrineCopy,
  };
}

export function previewFontFamily(fontId: OnboardingProfileDraft["visual"]["fontId"]): string {
  return getFontById(fontId).family;
}
