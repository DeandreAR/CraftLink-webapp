import type { Locale } from "@/i18n/config";
import { landingEn } from "@/i18n/landing/en";
import { landingFr } from "@/i18n/landing/fr";
import type { LandingExtendedDictionary } from "@/i18n/landing/types";

export function getLandingExtended(lang: Locale): LandingExtendedDictionary {
  return lang === "fr" ? landingFr : landingEn;
}

export type { LandingExtendedDictionary } from "@/i18n/landing/types";
