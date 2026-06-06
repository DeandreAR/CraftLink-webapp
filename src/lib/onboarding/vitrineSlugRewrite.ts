import { RESERVED_PAGE_SLUGS } from "@/lib/onboarding/pageSlug";

/** Segments racine qui ne doivent pas être réécrits vers une vitrine. */
export const ROOT_PATH_RESERVED = new Set([
  ...RESERVED_PAGE_SLUGS,
  "connexion",
  "inscription",
  "mentions-legales",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function shouldRewriteRootToVitrine(pathname: string): string | null {
  const segment = pathname.replace(/^\/+|\/+$/g, "");
  if (!segment || segment.includes("/")) return null;
  if (ROOT_PATH_RESERVED.has(segment)) return null;
  if (!SLUG_PATTERN.test(segment)) return null;
  return segment;
}
