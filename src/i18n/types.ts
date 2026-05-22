export type ComparisonRowJson = {
  criterion: string;
  classic: string;
  craftlink: string;
};

export type FeatureMatrixRowJson = {
  label: string;
  essential: boolean;
  pro: boolean;
  options: boolean;
};

export type TierJson = {
  name: string;
  pitch: string;
  cta: string;
  href: string;
  badge?: string;
};

export type PricingComparisonDictionary = {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionLead: string;
  trustNoCode: string;
  trustLiveFast: string;
  zeroCommission: string;
  replacementTitle: string;
  replacementLead: string;
  replacementBullets: string[];
  compareTitle: string;
  compareLead: string;
  tableCriterion: string;
  tableClassic: string;
  tableCraftlink: string;
  mobileClassicShort: string;
  mobileCraftlinkShort: string;
  comparisonRows: ComparisonRowJson[];
  pricingEyebrow: string;
  pricingTitle: string;
  pricingLead: string;
  featuresColumnTitle: string;
  proAdvantagesTitle: string;
  optionsFootnote: string;
  tierEssential: TierJson;
  tierPro: TierJson;
  tierOptions: TierJson;
  featureMatrix: FeatureMatrixRowJson[];
  proAdvantages: string[];
};

export type NavDictionary = {
  why: string;
  features: string;
  metiers: string;
  tarifs: string;
  faq: string;
  demo: string;
};

export type MetaDictionary = {
  title: string;
  description: string;
};

export type HeroPreviewDictionary = {
  eyebrow: string;
  title: string;
  about: string;
  tags: string[];
  stats: { label: string; value: string }[];
  savoirFaire: string;
  dixPlusAns: string;
  materiaux: string;
  mesPrestations: string;
  craftlinkDemo: string;
  inCity: string;
};

export type HeroFlowDictionary = {
  figureAlt: string;
};

export type FeaturesFlowContactRow = {
  name: string;
  phone: string;
  source: string;
  last: string;
};

export type FeaturesFlowDictionary = {
  figureAlt: string;
  arrowHints: [string, string, string];
  step1: { label: string };
  step2: { label: string; bioLink: string; vocal: string; text: string };
  step3: {
    label: string;
    contactsTitle: string;
    addContact: string;
    colName: string;
    colPhone: string;
    colSource: string;
    colLast: string;
    pagination: string;
  };
  step4: { label: string; folder: string };
  contactRows: FeaturesFlowContactRow[];
};

export type HeroTypingChannel = {
  label: string;
  color: string;
};

export type HeroTypingTitleDictionary = {
  intro: string;
  channels: HeroTypingChannel[];
};

export type HeroDictionary = {
  pill: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  typingTitle: HeroTypingTitleDictionary;
  asideShowcaseAlt: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  preview: HeroPreviewDictionary;
  flow: HeroFlowDictionary;
};

export type Dictionary = {
  meta: MetaDictionary;
  nav: NavDictionary;
  hero: HeroDictionary;
  featuresFlow: FeaturesFlowDictionary;
  pricingComparison: PricingComparisonDictionary;
};
