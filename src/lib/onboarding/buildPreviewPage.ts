import type {
  OnboardingPlan,
  OnboardingProfileDraft,
  OnboardingService,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import { buildFollowersBadgeLabel } from "@/lib/vitrine/formatFollowerCount";
import type { LinkInBioPageProps } from "@/components/vitrine/LinkInBioPage";
import { getMetierLabel } from "@/lib/onboarding/metierOptions";
import { getFontById } from "@/lib/onboarding/onboardingFonts";
import { onboardingSocialToVitrineLinks } from "@/lib/onboarding/socialLinks";
import { onboardingAffiliateToVitrineLinks } from "@/lib/onboarding/affiliateLinks";
import { onboardingServicesToVitrine } from "@/lib/onboarding/toVitrineServices";
import { resolveTradeLabelFallback } from "@/lib/onboarding/proImport/toProfileDraft";
import type { VitrineDictionary } from "@/i18n/types";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { portfolioItemsToVitrine } from "@/lib/portfolio/portfolioToVitrine";
import type {
  PublicPlanTier,
  VitrineStatBadge,
} from "@/domain/vitrine";

type PriceLabels = {
  pricePrefix: string;
  priceSuffixEur: string;
  priceSuffixUsd: string;
  surDevis: string;
  aboutTitle: string;
};

function buildStatBadges(
  profile: OnboardingProfileDraft,
  vitrineCopy: VitrineDictionary,
  locale: Locale,
): VitrineStatBadge[] {
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

  const badges: VitrineStatBadge[] = [];

  const followerCount = profile.importFollowerCount;
  if (followerCount != null && followerCount > 0) {
    const socialHref =
      profile.importPlatform === "instagram"
        ? profile.social.instagram.trim() || undefined
        : profile.importPlatform === "facebook"
          ? profile.social.facebook.trim() || undefined
          : undefined;

    badges.push({
      id: "followers",
      label: buildFollowersBadgeLabel(
        followerCount,
        vitrineCopy.presentation.followersLabel,
        locale,
      ),
      kind: "default",
      href: socialHref,
    });
  }

  if (
    profile.importPlatform === "instagram" &&
    profile.importExperienceYears != null &&
    profile.importExperienceYears > 0
  ) {
    badges.push({
      id: "exp",
      label: `${profile.importExperienceYears}+ ans d'expérience`,
      kind: "default",
    });
  }

  return badges;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function toVitrinePortfolio(
  items: OnboardingProfileDraft["portfolioItems"],
): ReturnType<typeof portfolioItemsToVitrine> {
  return portfolioItemsToVitrine(items);
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
  const affiliateLinks = onboardingAffiliateToVitrineLinks(profile.affiliateLinks ?? []);
  const hasSocial = socialLinks.length > 0;
  const hasAffiliateLinks = affiliateLinks.length > 0 && plan === "PRO";
  const hasGoogleBusiness = profile.social.googleBusinessUrl.trim().length > 0;

  const useInterventions =
    profile.presentationMode === "interventions" && profile.selectedInterventions.length > 0;
  const useAbout =
    profile.presentationMode === "about" && profile.aboutText.trim().length > 0;

  const brandPrimary = profile.visual.accentColor;
  const themeBannerFrom = `color-mix(in srgb, ${brandPrimary} 35%, white)`;
  const themeBannerTo = `color-mix(in srgb, ${brandPrimary} 8%, white)`;

  const statBadges = buildStatBadges(profile, vitrineCopy, locale);
  const portfolioItems = toVitrinePortfolio(profile.portfolioItems);
  const hasPortfolio = portfolioItems.length > 0;

  const serviceAreaSummary = profile.city.trim()
    ? `Intervient à ${profile.city.trim()} et ${profile.interventionRadiusKm} km alentour`
    : "";

  return {
    artisan: {
      slug: profile.pageSlug.trim() || "apercu",
      businessName: profile.businessName.trim(),
      phone: profile.phone.trim() || undefined,
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
      affiliateLinks,
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
        showAffiliateLinks: hasAffiliateLinks,
        showPortfolioGallery: hasPortfolio,
        showServicesOnPresentation: vitrineServices.length > 0,
        contentBlockMode: useAbout ? "about" : "interventions",
      },
      cta: {
        ...(plan === "PRO" ? { primaryQuote: "Besoin d'un devis rapide ?" } : {}),
        secondaryInfo: "Poser une Question",
        secondaryUrgent: vitrineCopy.presentation.reportUrgency,
        collaboration: "Partenariats & Marques",
      },
      voiceCaptureEnabled: plan === "PRO",
    },
    copy: vitrineCopy,
  };
}

export function previewFontFamily(fontId: OnboardingProfileDraft["visual"]["fontId"]): string {
  return getFontById(fontId).family;
}
