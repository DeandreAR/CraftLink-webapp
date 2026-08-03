/** Types i18n pour le contenu marketing de la landing (hors JSON de base). */

import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export type LandingFaqItem = {
  q: string;
  a: string;
};

export type LandingFaqBlock = {
  title: string;
  items: LandingFaqItem[];
};

export type LandingCtaDictionary = {
  title: string;
  titleHighlight: string;
  lead: string;
  button: string;
};

export type LandingSectionHeaderCopy = {
  index: string;
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  lead: string;
};

export type LandingControlStep = {
  index: string;
  title: string;
  lead: string;
};

export type LandingControlCompareSide = {
  label: string;
  title: string;
  example: string;
  items: string[];
};

export type LandingControlDictionary = {
  header: LandingSectionHeaderCopy;
  imageAlt: string;
  compare: {
    eyebrow: string;
    without: LandingControlCompareSide;
    with: LandingControlCompareSide;
  };
  steps: LandingControlStep[];
};

export type LandingMetierCard = {
  metierKey: MetierKey;
  metier: string;
  angle: string;
};

export type LandingMetiersDictionary = {
  header: LandingSectionHeaderCopy;
  imageAlt: string;
  cards: LandingMetierCard[];
  showAllMetiers: string;
  showLessMetiers: string;
  urgencyBadge: string;
  quoteBadge: string;
  selectMetierHint: string;
};

export type LandingExtendedDictionary = {
  faqBlocks: LandingFaqBlock[];
  cta: LandingCtaDictionary;
  /** Parcours client en 3 étapes (ex- Pourquoi + Comment ça marche). */
  control: LandingControlDictionary;
  metiers: LandingMetiersDictionary;
};
