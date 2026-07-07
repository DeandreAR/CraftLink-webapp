export type UnifiedInstagramPortfolioItem = {
  shortcode: string;
  embedUrl: string;
};

/** Données normalisées renvoyées par les routes `/api/import/*`. */
export type UnifiedImportData = {
  name: string;
  description: string;
  avatarUrl: string;
  phone: string | null;
  city: string | null;
  rating: number | null;
  reviews: number | null;
  /** Import Google uniquement — lien canonique vers la fiche GMB */
  googleBusinessUrl?: string | null;
  /** Noms de prestations importées (Google GMB). */
  importServices?: string[];
  /** Import Instagram uniquement */
  instagramUsername?: string | null;
  inferredMetierKey?: string | null;
  experienceYears?: number | null;
  instagramPortfolio?: UnifiedInstagramPortfolioItem[];
  /** Bannière dégradée (pas d’image stockée) */
  useBrandGradientBanner?: boolean;
};

export type ImportApiSuccessResponse = {
  success: true;
  data: UnifiedImportData;
};

export type ImportApiErrorResponse = {
  error: string;
};

export type ImportApiDegradedResponse = {
  success: false;
  error_type: "PROVIDER_QUOTA_EXHAUSTED";
  message: string;
};

export type ImportApiResponse =
  | ImportApiSuccessResponse
  | ImportApiDegradedResponse
  | ImportApiErrorResponse;
