import type { OnboardingPortfolioItem } from "@/domain/onboarding";
import type { PortfolioSourceType } from "@/domain/portfolio";

function isSourceType(value: unknown): value is PortfolioSourceType {
  return value === "instagram" || value === "facebook" || value === "google" || value === "direct";
}

function legacyInstagramSourceType(
  type: unknown,
): PortfolioSourceType | null {
  if (type === "instagram_embed" || type === "instagram_profile_embed") {
    return "instagram";
  }
  return null;
}

/** Normalise un item portfolio (nouveau format ou legacy Instagram). */
export function normalizePortfolioItem(raw: unknown): OnboardingPortfolioItem | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;

  const id = typeof row.id === "string" && row.id.trim() ? row.id.trim() : crypto.randomUUID();
  const alt = typeof row.alt === "string" ? row.alt : undefined;
  const externalUrl = typeof row.externalUrl === "string" ? row.externalUrl.trim() : undefined;
  const imageUrl = typeof row.imageUrl === "string" ? row.imageUrl.trim() : undefined;
  const storagePath = typeof row.storagePath === "string" ? row.storagePath.trim() : undefined;
  const embedUrl = typeof row.embedUrl === "string" ? row.embedUrl.trim() : undefined;
  const legacyType =
    row.type === "instagram_embed" || row.type === "instagram_profile_embed"
      ? row.type
      : undefined;

  if (isSourceType(row.source_type)) {
    return {
      id,
      source_type: row.source_type,
      externalUrl,
      imageUrl,
      storagePath,
      alt,
      type: legacyType,
      embedUrl,
    };
  }

  const legacySource = legacyInstagramSourceType(row.type);
  if (legacySource && embedUrl) {
    return {
      id,
      source_type: legacySource,
      externalUrl: externalUrl ?? embedUrl,
      embedUrl,
      type: legacyType,
      alt,
    };
  }

  if (row.type === "image" && imageUrl) {
    return {
      id,
      source_type: "direct",
      imageUrl,
      storagePath,
      alt,
    };
  }

  return null;
}

export function parsePortfolioItems(raw: unknown): OnboardingPortfolioItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizePortfolioItem(item))
    .filter((item): item is OnboardingPortfolioItem => item !== null);
}

export function countDirectPortfolioItems(items: OnboardingPortfolioItem[]): number {
  return items.filter((item) => item.source_type === "direct").length;
}
