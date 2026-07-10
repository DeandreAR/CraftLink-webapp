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

export type ProBillingPeriod = "monthly" | "annual";

export function onboardingPath(
  lang: Locale | undefined,
  options?: { plan?: "pro"; billing?: ProBillingPeriod },
): string {
  const base = authPath(lang, "onboarding");
  const params = new URLSearchParams();
  if (options?.plan === "pro") {
    params.set("plan", "pro");
  }
  if (options?.billing === "annual") {
    params.set("billing", "annual");
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function proCheckoutSuccessPath(
  lang: Locale | undefined,
  billing: ProBillingPeriod = "monthly",
): string {
  return `${onboardingPath(lang, { plan: "pro", billing })}&stripe=success`;
}

export function proCheckoutCancelPath(
  lang: Locale | undefined,
  billing: ProBillingPeriod = "monthly",
): string {
  return onboardingPath(lang, { plan: "pro", billing });
}

/** Anciennes routes FR → routes anglaises (SEO / favoris). */
export function legacyAuthRedirect(
  lang: Locale | undefined,
  legacy: "connexion" | "inscription",
): string {
  const segment: AuthSegment = legacy === "connexion" ? "login" : "signup";
  return authPath(lang, segment);
}
