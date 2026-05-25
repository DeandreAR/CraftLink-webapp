import { defaultLocale, type Locale } from "@/i18n/config";

export type LegalPageKey = "mentionsLegales" | "privacy" | "cookies" | "terms";

/** Slugs URL stables (FR) — utilisés aussi sous /en/… */
export const LEGAL_SLUGS: Record<LegalPageKey, string> = {
  mentionsLegales: "mentions-legales",
  privacy: "confidentialite",
  cookies: "cookies",
  terms: "cgu",
};

const SLUG_TO_PAGE = Object.entries(LEGAL_SLUGS).reduce(
  (acc, [key, slug]) => {
    acc[slug] = key as LegalPageKey;
    return acc;
  },
  {} as Record<string, LegalPageKey>,
);

export function getLegalHref(lang: Locale, page: LegalPageKey): string {
  const slug = LEGAL_SLUGS[page];
  return lang === defaultLocale ? `/${slug}` : `/${lang}/${slug}`;
}

export function resolveLegalPageFromSlug(slug: string): LegalPageKey | null {
  return SLUG_TO_PAGE[slug] ?? null;
}

export const ALL_LEGAL_SLUGS = Object.values(LEGAL_SLUGS);
