import { defaultLocale, type Locale } from "@/i18n/config";

export type AuthSegment = "login" | "signup" | "dashboard";

export function authPath(
  lang: Locale | undefined,
  segment: AuthSegment,
): string {
  const locale = lang ?? defaultLocale;
  if (locale === defaultLocale) {
    return `/${segment}`;
  }
  return `/${locale}/${segment}`;
}

/** Anciennes routes FR → routes anglaises (SEO / favoris). */
export function legacyAuthRedirect(
  lang: Locale | undefined,
  legacy: "connexion" | "inscription",
): string {
  const segment: AuthSegment = legacy === "connexion" ? "login" : "signup";
  return authPath(lang, segment);
}
