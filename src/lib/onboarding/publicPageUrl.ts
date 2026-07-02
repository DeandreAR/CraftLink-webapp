import { buildAppUrl, getAppHostname } from "@/config/app";

/** @deprecated Préférer `getAppHostname()` */
export const PUBLIC_PAGE_HOST = getAppHostname();

/**
 * Chemin public court : getcraftlink.com/{slug}
 * (rewrite middleware → route interne /v/{slug})
 */
export function buildPublicPagePath(slug: string, lang?: string): string {
  const base = `/${slug.trim().toLowerCase()}`;
  return lang && lang !== "fr" ? `/${lang}${base}` : base;
}

/** URL affichée sans protocole : getcraftlink.com/{slug} */
export function buildPublicPageDisplayUrl(slug: string): string {
  return `${getAppHostname()}/${slug.trim().toLowerCase()}`;
}

/** URL absolue de la vitrine artisan. */
export function buildPublicPageAbsoluteUrl(slug: string): string {
  return buildAppUrl(buildPublicPagePath(slug));
}

/** Préfixe pour les champs de saisie slug. */
export function publicPageSlugPrefix(): string {
  return `${getAppHostname()}/`;
}
