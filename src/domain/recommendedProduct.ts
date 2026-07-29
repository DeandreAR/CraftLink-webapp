/** Type de lien Sélection Pro (Amazon distinct de l’affiliation générique). */
export type RecommendedLinkKind = "amazon" | "affiliate" | "other";

export const RECOMMENDED_LINK_KINDS: RecommendedLinkKind[] = [
  "amazon",
  "affiliate",
  "other",
];

export function isRecommendedLinkKind(value: unknown): value is RecommendedLinkKind {
  return value === "amazon" || value === "affiliate" || value === "other";
}

/** Détecte Amazon depuis l’URL (fallback si link_kind non renseigné). */
export function detectRecommendedLinkKind(url: string): RecommendedLinkKind {
  try {
    const host = new URL(url.trim()).hostname.toLowerCase();
    if (
      host.includes("amazon.") ||
      host.includes("amzn.") ||
      host === "a.co" ||
      host.endsWith(".a.co")
    ) {
      return "amazon";
    }
  } catch {
    // ignore
  }
  return "other";
}

export function normalizeRecommendedLinkKind(
  value: unknown,
  url?: string,
): RecommendedLinkKind {
  if (isRecommendedLinkKind(value)) return value;
  if (url?.trim()) return detectRecommendedLinkKind(url);
  return "other";
}

/** Item unifié « La Sélection Pro » (marque, produit, Amazon, affiliation). */
export type RecommendedItem = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  discount_code: string | null;
  url: string;
  /** Amazon | affiliation | autre (marque, boutique…). */
  link_kind: RecommendedLinkKind;
  image_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};

export type RecommendedItemInput = {
  title: string;
  description?: string | null;
  discount_code?: string | null;
  url: string;
  link_kind?: RecommendedLinkKind;
  image_url?: string | null;
  is_active?: boolean;
};

export const DEFAULT_PRO_SELECTION_TITLE = "La Sélection Pro";
export const MAX_RECOMMENDED_ITEMS = 24;

/** @deprecated Alias — préférer RecommendedItem. */
export type RecommendedProduct = RecommendedItem;
/** @deprecated Alias — préférer RecommendedItemInput. */
export type RecommendedProductInput = RecommendedItemInput;

export type HeaderLayoutType =
  | "banner_overlay"
  | "brand_cover"
  | "avatar_cover"
  | "page_brand"
  | "standard";

export type HeaderBgType = "solid" | "gradient" | "image";

export type HeaderGradientValue = {
  from: string;
  to: string;
};

export const HEADER_SOLID_PRESETS = ["#FFFFFF", "#000000", "#F4F4F4", "#EFA188"] as const;

export function normalizeHeaderLayoutType(
  value: string | null | undefined,
): Exclude<HeaderLayoutType, "standard"> {
  if (value === "brand_cover") return "brand_cover";
  if (value === "page_brand") return "page_brand";
  if (value === "avatar_cover" || value === "standard") return "avatar_cover";
  return "banner_overlay";
}
