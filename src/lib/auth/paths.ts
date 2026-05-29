import { defaultLocale, type Locale } from "@/i18n/config";

export type AuthSegment = "login" | "signup" | "dashboard" | "onboarding";

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

export function onboardingPath(
  lang: Locale | undefined,
  options?: { plan?: "pro" },
): string {
  const base = authPath(lang, "onboarding");
  if (options?.plan === "pro") {
    return `${base}?plan=pro`;
  }
  return base;
}

/** Anciennes routes FR → routes anglaises (SEO / favoris). */
export function legacyAuthRedirect(
  lang: Locale | undefined,
  legacy: "connexion" | "inscription",
): string {
  const segment: AuthSegment = legacy === "connexion" ? "login" : "signup";
  return authPath(lang, segment);
}
