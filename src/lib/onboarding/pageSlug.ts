/** Segments réservés (routes app, i18n, pages légales). */
export const RESERVED_PAGE_SLUGS = new Set([
  "fr",
  "en",
  "api",
  "p",
  "login",
  "signup",
  "connexion",
  "inscription",
  "onboarding",
  "dashboard",
  "cgu",
  "cookies",
  "confidentialite",
  "mentions-legales",
  "admin",
  "www",
  "app",
  "static",
  "_next",
  "icon",
  "favicon",
  "robots",
  "sitemap",
  "demo",
  "demo-pro",
  "demo-essentiel",
  "demo-banniere",
]);

export type PageSlugValidationCode =
  | "empty"
  | "too_short"
  | "too_long"
  | "invalid_chars"
  | "invalid_edges"
  | "reserved"
  | "taken"
  | "ok";

export type PageSlugValidation = {
  ok: boolean;
  code: PageSlugValidationCode;
  normalized: string;
};

const MIN_LENGTH = 3;
const MAX_LENGTH = 48;

/** Nettoie la saisie utilisateur (sans valider la disponibilité). */
export function sanitizePageSlugInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_LENGTH);
}

export function suggestPageSlugFromName(businessName: string): string {
  const base = sanitizePageSlugInput(businessName);
  if (base.length >= MIN_LENGTH) return base;
  return "";
}

export function validatePageSlug(
  raw: string,
  options?: { taken?: boolean },
): PageSlugValidation {
  const normalized = sanitizePageSlugInput(raw);

  if (!normalized) {
    return { ok: false, code: "empty", normalized: "" };
  }
  if (normalized.length < MIN_LENGTH) {
    return { ok: false, code: "too_short", normalized };
  }
  if (normalized.length > MAX_LENGTH) {
    return { ok: false, code: "too_long", normalized };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return { ok: false, code: "invalid_chars", normalized };
  }
  if (RESERVED_PAGE_SLUGS.has(normalized)) {
    return { ok: false, code: "reserved", normalized };
  }
  if (options?.taken) {
    return { ok: false, code: "taken", normalized };
  }

  return { ok: true, code: "ok", normalized };
}

export { buildPublicPagePath, buildPublicPageDisplayUrl, publicPageSlugPrefix } from "@/lib/onboarding/publicPageUrl";
