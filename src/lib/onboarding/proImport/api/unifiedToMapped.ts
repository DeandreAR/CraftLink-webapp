import type { OnboardingPortfolioItem, ProImportPlatform } from "@/domain/onboarding";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";
import type { MappedProImportData } from "@/lib/onboarding/proImport/types";

export function unifiedToMappedImportData(
  data: UnifiedImportData,
  platform: ProImportPlatform,
  identifier: string,
): MappedProImportData {
  const inferredMetierKey =
    data.inferredMetierKey && isMetierKey(data.inferredMetierKey)
      ? (data.inferredMetierKey as MetierKey)
      : "";

  const portfolioItems: OnboardingPortfolioItem[] | undefined = data.instagramPortfolio?.map(
    (item) => ({
      id: item.shortcode === "profile" ? "ig-profile-feed" : `ig-${item.shortcode}`,
      type:
        item.shortcode === "profile"
          ? ("instagram_profile_embed" as const)
          : ("instagram_embed" as const),
      embedUrl: item.embedUrl,
      alt:
        item.shortcode === "profile"
          ? "Publications Instagram"
          : `Publication Instagram ${item.shortcode}`,
    }),
  );

  return {
    platform,
    identifier,
    name: data.name,
    description: data.description,
    avatarUrl: data.avatarUrl,
    phone: data.phone ?? "",
    city: data.city ?? "",
    rating: data.rating ?? undefined,
    reviews: data.reviews ?? undefined,
    googleBusinessUrl: data.googleBusinessUrl?.trim() || undefined,
    inferredMetierKey,
    experienceYears: data.experienceYears ?? null,
    portfolioItems,
    useBrandGradientBanner: data.useBrandGradientBanner,
  };
}
