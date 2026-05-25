import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { legalEn } from "@/i18n/legal/en";
import { legalFr } from "@/i18n/legal/fr";

export async function getDictionary(lang: Locale): Promise<Dictionary> {
  const base =
    lang === "fr"
      ? ((await import("@/i18n/dictionaries/fr.json")).default as Omit<
          Dictionary,
          "legal"
        >)
      : ((await import("@/i18n/dictionaries/en.json")).default as Omit<
          Dictionary,
          "legal"
        >);

  return {
    ...base,
    legal: lang === "fr" ? legalFr : legalEn,
  };
}
