import type { OnboardingPortfolioItem } from "@/domain/onboarding";
import type { VitrinePortfolioItem } from "@/domain/vitrine";
import { parseInstagramPublicationUrl } from "@/lib/portfolio/parsePortfolioUrl";

function resolveInstagramEmbed(item: OnboardingPortfolioItem): {
  embedUrl?: string;
  type: VitrinePortfolioItem["type"];
} {
  if (item.embedUrl) {
    return {
      embedUrl: item.embedUrl,
      type: item.type === "instagram_profile_embed" ? "instagram_profile_embed" : "instagram_embed",
    };
  }

  const external = item.externalUrl?.trim();
  if (!external) {
    return { type: "external_link" };
  }

  const parsed = parseInstagramPublicationUrl(external);
  if (!parsed) {
    return { type: "external_link" };
  }

  return {
    embedUrl: parsed.embedUrl,
    type: parsed.kind === "profile" ? "instagram_profile_embed" : "instagram_embed",
  };
}

export function portfolioItemToVitrine(item: OnboardingPortfolioItem): VitrinePortfolioItem {
  if (item.source_type === "direct") {
    return {
      id: item.id,
      source_type: "direct",
      type: "image",
      imageUrl: item.imageUrl,
      alt: item.alt,
    };
  }

  if (item.source_type === "instagram") {
    if (item.imageUrl) {
      return {
        id: item.id,
        source_type: "instagram",
        type: "image",
        imageUrl: item.imageUrl,
        externalUrl: item.externalUrl,
        alt: item.alt,
      };
    }

    const { embedUrl, type } = resolveInstagramEmbed(item);
    return {
      id: item.id,
      source_type: "instagram",
      type,
      embedUrl,
      externalUrl: item.externalUrl,
      alt: item.alt,
    };
  }

  if (item.source_type === "google" && item.imageUrl) {
    return {
      id: item.id,
      source_type: "google",
      type: "image",
      imageUrl: item.imageUrl,
      externalUrl: item.externalUrl,
      alt: item.alt,
    };
  }

  return {
    id: item.id,
    source_type: item.source_type,
    type: "external_link",
    externalUrl: item.externalUrl,
    alt: item.alt,
  };
}

export function portfolioItemsToVitrine(
  items: OnboardingPortfolioItem[] | undefined,
): VitrinePortfolioItem[] {
  if (!items?.length) return [];
  return items.map(portfolioItemToVitrine);
}
