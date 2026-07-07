import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { dashboardEn } from "@/i18n/dashboard/en";
import { dashboardFr } from "@/i18n/dashboard/fr";
import { legalEn } from "@/i18n/legal/en";
import { legalFr } from "@/i18n/legal/fr";
import { onboardingEn } from "@/i18n/onboarding/en";
import { onboardingFr } from "@/i18n/onboarding/fr";
import { vitrineEn } from "@/i18n/vitrine/en";
import { vitrineFr } from "@/i18n/vitrine/fr";

export async function getDictionary(lang: Locale): Promise<Dictionary> {
  const base =
    lang === "fr"
      ? ((await import("@/i18n/dictionaries/fr.json")).default as Omit<
          Dictionary,
          "legal" | "vitrine" | "onboarding" | "dashboard"
        >)
      : ((await import("@/i18n/dictionaries/en.json")).default as Omit<
          Dictionary,
          "legal" | "vitrine" | "onboarding" | "dashboard"
        >);

  return {
    ...base,
    legal: lang === "fr" ? legalFr : legalEn,
    vitrine: lang === "fr" ? vitrineFr : vitrineEn,
    onboarding: lang === "fr" ? onboardingFr : onboardingEn,
    dashboard: lang === "fr" ? dashboardFr : dashboardEn,
  };
}
