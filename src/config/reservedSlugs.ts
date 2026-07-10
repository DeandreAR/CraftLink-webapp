import { locales } from "@/i18n/config";

/**
 * Segments URL interdits pour les slugs artisans.
 * Source unique : validation onboarding + proxy racine.
 */
export const APP_RESERVED_SLUGS = new Set<string>([
  // Auth & compte
  "login",
  "register",
  "signup",
  "connexion",
  "inscription",
  "dashboard",
  "onboarding",
  "settings",
  "account",
  "profile",
  "auth",
  // Produit & billing
  "pricing",
  "tarifs",
  "billing",
  "checkout",
  "subscribe",
  // Technique
  "api",
  "webhook",
  "webhooks",
  "share",
  "admin",
  "static",
  "_next",
  "icon",
  "favicon",
  "robots",
  "sitemap",
  // Routes internes vitrine (rewrite / redirection)
  "v",
  "p",
  // Marketing & contenu
  "blog",
  "docs",
  "help",
  "support",
  "contact",
  "status",
  // Légal
  "cgu",
  "cookies",
  "confidentialite",
  "mentions-legales",
  "privacy",
  "terms",
  "legal",
  // Infra / hôtes
  "www",
  "app",
  // Locales i18n (`/fr`, `/en`)
  ...locales,
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isReservedAppSlug(slug: string): boolean {
  return APP_RESERVED_SLUGS.has(slug.trim().toLowerCase());
}

/**
 * Détermine si un chemin racine `/{slug}` doit être réécrit vers la vitrine interne.
 * Retourne le slug normalisé ou null.
 */
export function resolveRootVitrineSlug(pathname: string): string | null {
  const segment = pathname.replace(/^\/+|\/+$/g, "");
  if (!segment || segment.includes("/")) return null;
  if (!SLUG_PATTERN.test(segment)) return null;
  if (isReservedAppSlug(segment)) return null;
  return segment;
}

/** Ancienne URL `/p/{slug}` → segment slug. */
export function parseLegacyVitrinePath(pathname: string): string | null {
  const match = pathname.match(/^\/p\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  return match?.[1] ?? null;
}

/** Accès direct `/v/{slug}` (handler interne) → segment slug. */
export function parseInternalVitrinePath(pathname: string): string | null {
  const match = pathname.match(/^\/v\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  return match?.[1] ?? null;
}
