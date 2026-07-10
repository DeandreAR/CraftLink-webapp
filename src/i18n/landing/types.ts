/** Types i18n pour le contenu marketing de la landing (hors JSON de base). */

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

export type LandingPourquoiDictionary = {
  header: LandingSectionHeaderCopy;
  badge: string;
  badgeHint: string;
  without: {
    label: string;
    title: string;
    bullets: string[];
  };
  with: {
    label: string;
    title: string;
    bullets: string[];
  };
};

export type LandingFeatureCardCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type LandingFeaturesDictionary = {
  header: LandingSectionHeaderCopy;
  cards: LandingFeatureCardCopy[];
  formBlock: {
    eyebrow: string;
    title: string;
    description: string;
    fields: string[];
  };
};

export type LandingMetierCard = {
  metier: string;
  angle: string;
};

export type LandingMetiersDictionary = {
  header: LandingSectionHeaderCopy;
  cards: LandingMetierCard[];
};

export type LandingExtendedDictionary = {
  faqBlocks: LandingFaqBlock[];
  cta: LandingCtaDictionary;
  /** Contenu marketing étendu (sections landing hors JSON de base). */
  pourquoi: LandingPourquoiDictionary;
  features: LandingFeaturesDictionary;
  metiers: LandingMetiersDictionary;
};
