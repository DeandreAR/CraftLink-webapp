import type { OnboardingPortfolioItem, OnboardingService, ProImportPlatform } from "@/domain/onboarding";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";
import type { MappedProImportData } from "@/lib/onboarding/proImport/types";
import { namesToOnboardingServices } from "@/lib/onboarding/importServices";

export function unifiedToMappedImportData(
  data: UnifiedImportData,
  platform: ProImportPlatform,
  identifier: string,
): MappedProImportData {
  const inferredMetierKey =
    data.inferredMetierKey && isMetierKey(data.inferredMetierKey)
      ? (data.inferredMetierKey as MetierKey)
      : "";

  const portfolioItems: OnboardingPortfolioItem[] | undefined =
    platform === "google" && data.googlePortfolio?.length
      ? data.googlePortfolio.map((photo, index) => ({
          id: `google-${index}`,
          source_type: "google" as const,
          imageUrl: photo.imageUrl,
          externalUrl: data.googleBusinessUrl?.trim() || undefined,
          alt: photo.title,
        }))
      : data.instagramPortfolio?.map((item) => ({
          id: item.shortcode === "profile" ? "ig-profile-feed" : `ig-${item.shortcode}`,
          source_type: "instagram" as const,
          ...(item.imageUrl
            ? {
                imageUrl: item.imageUrl,
                externalUrl: `https://www.instagram.com/p/${item.shortcode}/`,
                alt: `Publication Instagram ${item.shortcode}`,
              }
            : {
                type:
                  item.shortcode === "profile"
                    ? ("instagram_profile_embed" as const)
                    : ("instagram_embed" as const),
                embedUrl: item.embedUrl,
                externalUrl:
                  item.shortcode === "profile"
                    ? item.embedUrl.replace(/\/embed\/?$/, "/")
                    : `https://www.instagram.com/p/${item.shortcode}/`,
                alt:
                  item.shortcode === "profile"
                    ? "Publications Instagram"
                    : `Publication Instagram ${item.shortcode}`,
              }),
        }));

  return {
    platform,
    identifier,
    name: data.name,
    description: data.description,
    avatarUrl: data.avatarUrl,
    phone: data.phone ?? "",
    city: data.city ?? "",
    ...(data.postalCode ? { postalCode: data.postalCode } : {}),
    rating: data.rating ?? undefined,
    reviews: data.reviews ?? undefined,
    googleBusinessUrl: data.googleBusinessUrl?.trim() || undefined,
    importServices: data.importServices,
    services:
      data.importServices && data.importServices.length > 0
        ? namesToOnboardingServices(data.importServices)
        : undefined,
    inferredMetierKey,
    experienceYears: data.experienceYears ?? null,
    followerCount: data.followerCount ?? null,
    portfolioItems,
    useBrandGradientBanner: data.useBrandGradientBanner,
  };
}
