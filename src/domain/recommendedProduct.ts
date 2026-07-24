/** Item unifié « La Sélection Pro » (marque, produit, lien affilié). */
export type RecommendedItem = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  discount_code: string | null;
  url: string;
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
