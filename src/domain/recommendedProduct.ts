/** Produits / équipements recommandés — « La Sélection Pro ». */
export type RecommendedProduct = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  brand: string | null;
  image_url: string;
  affiliate_url: string;
  price_hint: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
};

export type RecommendedProductInput = {
  title: string;
  description?: string | null;
  brand?: string | null;
  image_url: string;
  affiliate_url: string;
  price_hint?: string | null;
  is_active?: boolean;
};

/** Layout header vitrine. */
export type HeaderLayoutType = "standard" | "banner_overlay";

export type HeaderBgType = "solid" | "gradient" | "image";

export type HeaderGradientValue = {
  from: string;
  to: string;
};

export const DEFAULT_PRO_SELECTION_TITLE = "La Sélection Pro";

export const HEADER_SOLID_PRESETS = ["#FFFFFF", "#000000", "#F4F4F4"] as const;
