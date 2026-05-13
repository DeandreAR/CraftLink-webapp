import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

export async function getDictionary(lang: Locale): Promise<Dictionary> {
  if (lang === "fr") {
    return (await import("@/i18n/dictionaries/fr.json")).default as Dictionary;
  }
  return (await import("@/i18n/dictionaries/en.json")).default as Dictionary;
}
