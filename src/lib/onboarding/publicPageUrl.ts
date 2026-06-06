/** Domaine affiché dans l’UI (sans protocole). */
export const PUBLIC_PAGE_HOST = "craftlink.app";

/**
 * Chemin public court : craftlink.app/{slug}
 * (rewrite middleware → route interne /p/{slug})
 */
export function buildPublicPagePath(slug: string, lang?: string): string {
  const base = `/${slug}`;
  return lang && lang !== "fr" ? `/${lang}${base}` : base;
}

export function buildPublicPageDisplayUrl(slug: string): string {
  return `${PUBLIC_PAGE_HOST}/${slug}`;
}

/** Préfixe pour les champs de saisie slug. */
export function publicPageSlugPrefix(): string {
  return `${PUBLIC_PAGE_HOST}/`;
}
