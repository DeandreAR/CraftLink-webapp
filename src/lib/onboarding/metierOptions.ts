import type { Locale } from "@/i18n/config";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { METIER_CONFIGS } from "@/lib/vitrine/metierConfigs";

const METIER_LABELS: Record<MetierKey, { fr: string; en: string }> = {
  ELECTRICIEN: { fr: "Électricien", en: "Electrician" },
  PLOMBIER: { fr: "Plombier / Chauffagiste", en: "Plumber / Heating" },
  MENUISIER: { fr: "Menuisier", en: "Carpenter" },
  SERRURIER: { fr: "Serrurier", en: "Locksmith" },
  PLAQUISTE: { fr: "Plaquiste / Isolation", en: "Drywall / Insulation" },
  PEINTRE: { fr: "Peintre", en: "Painter" },
  PAYSAGISTE: { fr: "Paysagiste", en: "Landscaper" },
  COUVREUR: { fr: "Couvreur", en: "Roofer" },
  CARRELEUR: { fr: "Carreleur", en: "Tiler" },
  CHARPENTIER: { fr: "Charpentier", en: "Framer" },
  MACON: { fr: "Maçon", en: "Mason" },
  RENOVATION_GENERALE: { fr: "Rénovation générale", en: "General renovation" },
};

const METIER_ICONS: Record<MetierKey, string> = {
  ELECTRICIEN: "⚡",
  PLOMBIER: "🔧",
  MENUISIER: "🪚",
  SERRURIER: "🔑",
  PLAQUISTE: "🧱",
  PEINTRE: "🎨",
  PAYSAGISTE: "🌿",
  COUVREUR: "🏠",
  CARRELEUR: "◻️",
  CHARPENTIER: "🪵",
  MACON: "🧱",
  RENOVATION_GENERALE: "🏗️",
};

export const METIER_KEYS = Object.keys(METIER_CONFIGS) as MetierKey[];

export function getMetierLabel(key: MetierKey, locale: Locale): string {
  return METIER_LABELS[key][locale];
}

export function getMetierIcon(key: MetierKey): string {
  return METIER_ICONS[key];
}

export function getMetierOptions(locale: Locale): { value: MetierKey; label: string; icon: string }[] {
  return METIER_KEYS.map((value) => ({
    value,
    label: getMetierLabel(value, locale),
    icon: getMetierIcon(value),
  }));
}
