export type ComparisonRowJson = {
  criterion: string;
  classic: string;
  craftlink: string;
};

export type FeatureMatrixRowJson = {
  label: string;
  labelEssential?: string;
  labelPro?: string;
  essential: boolean;
  pro: boolean;
  showEssential?: boolean;
  showPro?: boolean;
  /** Affiche la ligne Essentiel comme limite (coche neutre, pas barrée). */
  essentialLimit?: boolean;
  /** Met en avant la ligne Pro (gras + icône). */
  highlightPro?: boolean;
};

export type TierPriceLineJson = {
  amount: string;
  footnote?: string;
};

export type TierPricingJson = {
  monthly: TierPriceLineJson;
  annual: TierPriceLineJson;
};

export type TierJson = {
  name: string;
  pitch: string;
  cta: string;
  href: string;
  badge?: string;
  reassurance?: string;
  /** Prix public futur (affiché barré en Bêta). */
  futurePrice?: string;
  pricing: TierPricingJson;
};

export type BillingDictionary = {
  monthly: string;
  annual: string;
  discountBadge: string;
};

export type DemoVideoDictionary = {
  sectionId: string;
  title: string;
  subtitle: string;
  placeholder: string;
  videoSrc?: string;
  posterSrc?: string;
};

export type TierCustomJson = {
  name: string;
  pitch: string;
  description: string;
  priceLabel: string;
  bullets: string[];
  cta: string;
  whatsappMessage: string;
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
  betaPioneerBadge: string;
  featuresColumnTitle: string;
  proAdvantagesTitle: string;
  billing: BillingDictionary;
  tierEssential: TierJson;
  tierPro: TierJson;
  tierCustom: TierCustomJson;
  featureMatrix: FeatureMatrixRowJson[];
  proAdvantages: string[];
};

export type NavDictionary = {
  why: string;
  features: string;
  metiers: string;
  tarifs: string;
  faq: string;
  login: string;
  createAccount: string;
};

export type AuthSignInDictionary = {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  submit: string;
  submitting: string;
  goToSignUp: string;
};

export type AuthSignUpDictionary = {
  title: string;
  subtitle: string;
  fullName: string;
  proPhone: string;
  proPhonePlaceholder: string;
  email: string;
  password: string;
  passwordHint: string;
  confirmPassword: string;
  submit: string;
  submitting: string;
  goToSignIn: string;
  setupVitrineLink: string;
};

export type AuthShellDictionary = {
  backToHome: string;
};

export type AuthDashboardDictionary = {
  title: string;
  welcome: string;
  loading: string;
  email: string;
  workspace: string;
  role: string;
  plan: string;
  name: string;
  signOut: string;
  placeholder: string;
};

export type AuthDictionary = {
  serviceUnavailable: string;
  shell: AuthShellDictionary;
  signIn: AuthSignInDictionary;
  signUp: AuthSignUpDictionary;
  dashboard: AuthDashboardDictionary;
};

export type FaqUiDictionary = {
  title: string;
  lead: string;
  show: string;
  hide: string;
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

export type PourquoiPillarBulletJson = {
  emoji: string;
  text: string;
};

export type PourquoiPillarJson = {
  title: string;
  bullets: PourquoiPillarBulletJson[];
};

export type PourquoiDictionary = {
  pillars: PourquoiPillarJson[];
};

export type HeroDictionary = {
  pill: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  typingTitle: HeroTypingTitleDictionary;
  asideShowcaseAlt: string;
  lead: string;
  controlPhrase: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  preview: HeroPreviewDictionary;
  flow: HeroFlowDictionary;
};

export type LegalSectionJson = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalPageJson = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro?: string;
  sections: LegalSectionJson[];
};

export type FooterDictionary = {
  copyright: string;
  tagline: string;
  legalNavLabel: string;
  manageCookies: string;
  links: {
    mentionsLegales: string;
    privacy: string;
    cookies: string;
    terms: string;
  };
};

export type CookieConsentDictionary = {
  title: string;
  description: string;
  acceptAll: string;
  rejectOptional: string;
  customize: string;
  save: string;
  close: string;
  necessaryTitle: string;
  necessaryDesc: string;
  analyticsTitle: string;
  analyticsDesc: string;
  marketingTitle: string;
  marketingDesc: string;
  alwaysOn: string;
  cookiesPolicyLink: string;
  privacyPolicyLink: string;
};

export type LegalBundleDictionary = {
  backToHome: string;
  lastUpdated: string;
  updatedDate: string;
  pages: {
    mentionsLegales: LegalPageJson;
    privacy: LegalPageJson;
    cookies: LegalPageJson;
    terms: LegalPageJson;
  };
};

export type VitrineDictionary = {
  presentation: {
    quoteFreeHint: string;
    portfolioTitle: string;
  };
  details: {
    back: string;
    servicesTitle: string;
    servicesHint: string;
    servicesOptionalHint: string;
    servicesQuoteHint: string;
    servicesSelected: string;
    captureTitle: string;
    titles: {
      quote: string;
      urgent: string;
      info: string;
      collaboration: string;
    };
    delayLabel: string;
  };
  form: {
    fullName: string;
    fullNamePlaceholder: string;
    partnerCompanyName: string;
    partnerCompanyPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    urgency: string;
    urgencyOptions: {
      urgent: string;
      asap: string;
      planned: string;
      info: string;
    };
    project: string;
    projectPlaceholder: string;
    dimensions: string;
    dimensionsPlaceholder: string;
    access: string;
    accessPlaceholder: string;
    descriptionHint: string;
    needDescriptionOrVoice: string;
    selectDelayPlaceholder: string;
    question: string;
    questionPlaceholder: string;
    collaborationToggle: string;
    proCompanyName: string;
    proCompanyPlaceholder: string;
    proProject: string;
    proProjectPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
    successSmsFollowUp: string;
    selectDelay: string;
  };
  voice: {
    title: string;
    record: string;
    recording: string;
    stop: string;
    added: string;
    replay: string;
    orRecord: string;
    timerLabel: string;
    maxDuration: string;
  };
  photos: {
    title: string;
    dropHint: string;
    browse: string;
    count: string;
    tooMany: string;
    tooLarge: string;
    invalidType: string;
  };
  collaboration: {
    title: string;
    profilePeer: string;
    profileBrand: string;
    companyPeer: string;
    companyBrand: string;
    contactName: string;
    jobTitle: string;
    phone: string;
    email: string;
    activityType: string;
    activityOptions: {
      architect: string;
      project_manager: string;
      artisan: string;
      builder: string;
      real_estate: string;
      other: string;
    };
    needType: string;
    needOptions: {
      subcontracting: string;
      project_offer: string;
      local_partnership: string;
    };
    partnershipType: string;
    partnershipOptions: {
      product_placement: string;
      material_donation: string;
      affiliate_program: string;
      media_campaign: string;
    };
    description: string;
    descriptionPeerPlaceholder: string;
    descriptionBrandPlaceholder: string;
    filesPeerLabel: string;
    filesBrandLabel: string;
    files: {
      dropHint: string;
      browse: string;
      tooMany: string;
      tooLarge: string;
      invalidType: string;
      invalidVideo: string;
    };
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorBody: string;
  };
  services: {
    priceHt: string;
    surDevis: string;
  };
  poweredBy: string;
};

export type OnboardingDictionary = {
  title: string;
  subtitle: string;
  back: string;
  next: string;
  stepLabel: string;
  plan: {
    title: string;
    free: string;
    freeHint: string;
    pro: string;
    proHint: string;
  };
  badge: {
    label: string;
    essential: string;
    pro: string;
  };
  errors: {
    general: {
      businessName: string;
      metierKey: string;
      city: string;
    };
    interventions: {
      metierKey: string;
      presentationRequired: string;
    };
  };
  general: {
    title: string;
    subtitle: string;
    companyLabel: string;
    companyPlaceholder: string;
    metierLabel: string;
    cityLabel: string;
    cityPlaceholder: string;
    cityNoResults: string;
    radiusLabel: string;
  };
  interventions: {
    title: string;
    subtitle: string;
    optionalBadge: string;
    requiredBadge: string;
    tagsLabel: string;
    tagsHint: string;
    customTagPlaceholder: string;
    addCustomTag: string;
    selectedListLabel: string;
    removeTag: string;
    orDivider: string;
    switchToTags: string;
    switchToAbout: string;
    aboutLabel: string;
    aboutHint: string;
    aboutPlaceholder: string;
    selectionCounter: string;
    tagsMaxReached: string;
    selectMetierFirst: string;
    socialTitle: string;
    socialHint: string;
    socialPlaceholder: string;
    googleBusinessLabel: string;
    googleBusinessHint: string;
    googleBusinessPlaceholder: string;
  };
  visual: {
    title: string;
    subtitle: string;
    avatarLabel: string;
    bannerLabel: string;
    uploadHint: string;
    errorType: string;
    errorSize: string;
    fontLabel: string;
    colorLabel: string;
    colorHint: string;
    colorPickerLabel: string;
    previewTitle: string;
    previewHint: string;
    portfolioLaterHint: string;
    createPage: string;
  };
  upsell: {
    title: string;
    subtitle: string;
    essentialName: string;
    essentialPrice: string;
    essentialFeatures: string[];
    proName: string;
    proPrice: string;
    proFeatures: string[];
    chooseEssential: string;
    choosePro: string;
    cancel: string;
    creating: string;
  };
  import: {
    title: string;
    lead: string;
    platformGoogle: string;
    platformInstagram: string;
    platformFacebook: string;
    identifierLabel: string;
    placeholderGoogle: string;
    placeholderInstagram: string;
    placeholderFacebook: string;
    generate: string;
    generating: string;
    manualLink: string;
    loadingHint: string;
    importError: string;
  };
  free: {
    companyLabel: string;
    companyPlaceholder: string;
    metierLabel: string;
    cityLabel: string;
    cityPlaceholder: string;
    radiusLabel: string;
    previewTitle: string;
    previewHint: string;
    defaultBusinessName: string;
    quoteCta: string;
  };
  services: {
    title: string;
    optionalBadge: string;
    subtitle: string;
    skip: string;
    add: string;
    nameLabel: string;
    namePlaceholder: string;
    priceLabel: string;
    pricePrefix: string;
    priceSuffixEur: string;
    priceSuffixUsd: string;
    surDevisOption: string;
    amountOption: string;
    currencyEur: string;
    currencyUsd: string;
    maxReached: string;
    listTitle: string;
    finish: string;
  };
  complete: {
    title: string;
    body: string;
    cta: string;
  };
  publicServices: {
    title: string;
    surDevis: string;
  };
  pro: {
    choiceTitle: string;
    choiceSubtitle: string;
    autoCardTitle: string;
    autoCardHint: string;
    manualCardTitle: string;
    manualCardHint: string;
    manualCardCta: string;
    gapTitle: string;
    gapSubtitle: string;
    gapLeadTemplate: string;
    gapContinue: string;
    fieldLabels: {
      businessName: string;
      phone: string;
      city: string;
      metierKey: string;
    };
    phoneLabel: string;
    phonePlaceholder: string;
    phoneError: string;
    validateBanner: string;
    validateYes: string;
    validateNo: string;
    publishing: string;
    publishError: string;
  };
};

export type Dictionary = {
  meta: MetaDictionary;
  nav: NavDictionary;
  faqUi: FaqUiDictionary;
  auth: AuthDictionary;
  hero: HeroDictionary;
  demoVideo: DemoVideoDictionary;
  pourquoi: PourquoiDictionary;
  featuresFlow: FeaturesFlowDictionary;
  pricingComparison: PricingComparisonDictionary;
  footer: FooterDictionary;
  cookieConsent: CookieConsentDictionary;
  legal: LegalBundleDictionary;
  vitrine: VitrineDictionary;
  onboarding: OnboardingDictionary;
};
