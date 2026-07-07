import type { Locale } from "@/i18n/config";

export type MetierKey = keyof typeof METIER_CONFIGS;

export type MetierFormFields = {
  showUrgency: boolean;
  showDimensions: boolean;
  showAccess: boolean;
};

type LocalizedString = { fr: string; en: string };

export type MetierConfig = {
  title: LocalizedString;
  placeholder: LocalizedString;
  fields: MetierFormFields;
};

export const METIER_CONFIGS = {
  ELECTRICIEN: {
    title: { fr: "Demande d'intervention Électricité", en: "Electrical Service Request" },
    placeholder: {
      fr: "Ex: Mon tableau disjoncte quand j'allume le four...",
      en: "Ex: My breaker trips when I turn on the oven...",
    },
    fields: { showUrgency: true, showDimensions: false, showAccess: false },
  },
  PLOMBIER: {
    title: { fr: "Demande d'intervention Plomberie / Chauffage", en: "Plumbing & Heating Request" },
    placeholder: {
      fr: "Ex: Fuite d'eau sous le ballon d'eau chaude...",
      en: "Ex: Water leak under the water heater...",
    },
    fields: { showUrgency: true, showDimensions: false, showAccess: false },
  },
  MENUISIER: {
    title: { fr: "Votre projet de Menuiserie", en: "Carpentry Project" },
    placeholder: {
      fr: "Ex: Remplacement de 3 fenêtres en double vitrage...",
      en: "Ex: Replacing 3 double-glazed windows...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: false },
  },
  SERRURIER: {
    title: { fr: "Dépannage Serrurerie", en: "Locksmith Service" },
    placeholder: {
      fr: "Ex: Porte claquée avec les clés à l'intérieur...",
      en: "Ex: Door slammed shut with keys inside...",
    },
    fields: { showUrgency: true, showDimensions: false, showAccess: false },
  },
  PLAQUISTE: {
    title: { fr: "Travaux de Plaquiste / Isolation", en: "Drywall & Insulation" },
    placeholder: {
      fr: "Ex: Création d'une cloison pour séparer une pièce...",
      en: "Ex: Building a partition wall to split a room...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: false },
  },
  PEINTRE: {
    title: { fr: "Projet de Peinture & Finitions", en: "Painting & Finishing" },
    placeholder: {
      fr: "Ex: Peinture complète des murs et plafonds du salon...",
      en: "Ex: Full painting of living room walls and ceilings...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: false },
  },
  PAYSAGISTE: {
    title: { fr: "Aménagement Extérieur & Jardin", en: "Landscaping & Garden" },
    placeholder: {
      fr: "Ex: Création d'une terrasse en bois et engazonnement...",
      en: "Ex: Building a wooden deck and laying turf...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: true },
  },
  COUVREUR: {
    title: { fr: "Intervention Toiture / Couverture", en: "Roofing Service" },
    placeholder: {
      fr: "Ex: Tuiles déplacées suite à la tempête, infiltration...",
      en: "Ex: Displaced tiles after the storm, water leak...",
    },
    fields: { showUrgency: true, showDimensions: false, showAccess: true },
  },
  CARRELEUR: {
    title: { fr: "Pose de Carrelage & Faïence", en: "Tiling & Flooring" },
    placeholder: {
      fr: "Ex: Pose de carrelage grand format dans la cuisine...",
      en: "Ex: Laying large format tiles in the kitchen...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: false },
  },
  CHARPENTIER: {
    title: { fr: "Travaux de Charpente & Ossature", en: "Framing & Carpentry" },
    placeholder: {
      fr: "Ex: Modification de charpente pour aménagement de combles...",
      en: "Ex: Roof truss modification for attic conversion...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: true },
  },
  MACON: {
    title: { fr: "Gros Œuvre & Maçonnerie", en: "Masonry & Brickwork" },
    placeholder: {
      fr: "Ex: Ouverture d'un mur porteur pour pose d'un IPN...",
      en: "Ex: Opening a load-bearing wall to install an IPN beam...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: true },
  },
  RENOVATION_GENERALE: {
    title: { fr: "Projet de Rénovation Générale", en: "General Renovation Project" },
    placeholder: {
      fr: "Ex: Rénovation complète d'un appartement de 80 m²...",
      en: "Ex: Full renovation of an 80 m² apartment...",
    },
    fields: { showUrgency: false, showDimensions: true, showAccess: true },
  },
} as const satisfies Record<string, MetierConfig>;

export type ResolvedMetierFormConfig = {
  title: string;
  placeholder: string;
  fields: MetierFormFields;
};

export function isMetierKey(value: string): value is MetierKey {
  return value in METIER_CONFIGS;
}

export function resolveMetierLocalized(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export function getMetierFormConfig(
  metierKey: string | null | undefined,
  locale: Locale,
): ResolvedMetierFormConfig | null {
  if (!metierKey || !isMetierKey(metierKey)) {
    return null;
  }

  const config = METIER_CONFIGS[metierKey];
  return {
    title: resolveMetierLocalized(config.title, locale),
    placeholder: resolveMetierLocalized(config.placeholder, locale),
    fields: config.fields,
  };
}
