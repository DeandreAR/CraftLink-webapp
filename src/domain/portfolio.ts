/** Provenance d'un média de la galerie portfolio. */
export type PortfolioSourceType = "instagram" | "facebook" | "google" | "direct";

export const GALLERY_STORAGE_BUCKET = "gallery" as const;

/** Max photos importées depuis le téléphone (plan Pro). */
export const PRO_DIRECT_GALLERY_LIMIT = 12;

export const GALLERY_IMAGE_MAX_WIDTH_PX = 800;
export const GALLERY_WEBP_QUALITY = 0.7;
