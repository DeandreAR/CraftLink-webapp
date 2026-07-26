import type { LandingExtendedDictionary } from "@/i18n/landing/types";

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

export type TierCustomJson = {
  name: string;
  pitch: string;
  description: string;
  priceLabel: string;
  bullets: string[];
  cta: string;
  whatsappMessage: string;
};

export type PricingSplitContrastDictionary = {
  eyebrow: string;
  headline: string;
  painPoints: string[];
  payoff: string;
};

export type PricingComparisonDictionary = {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionLead: string;
  splitContrast: PricingSplitContrastDictionary;
  recommendedBadge: string;
  tableCriterion: string;
  tableClassic: string;
  tableCraftlink: string;
  mobileClassicShort: string;
  mobileCraftlinkShort: string;
  comparisonRows: ComparisonRowJson[];
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
  howItWorks: string;
  metiers: string;
  tarifs: string;
  faq: string;
  login: string;
  createAccount: string;
  mySpace: string;
  languageSwitcherLabel: string;
  mobileMenuOpen: string;
  mobileMenuClose: string;
};

export type AuthSignInDictionary = {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  submit: string;
  submitting: string;
  goToSignUp: string;
  forgotPassword: string;
  confirmationError: string;
  confirmationMissing: string;
};

export type AuthForgotPasswordDictionary = {
  title: string;
  subtitle: string;
  email: string;
  submit: string;
  submitting: string;
  success: string;
  backToSignIn: string;
};

export type AuthResetPasswordDictionary = {
  title: string;
  subtitle: string;
  password: string;
  passwordHint: string;
  confirmPassword: string;
  submit: string;
  submitting: string;
  success: string;
  sessionMissing: string;
  requestNewLink: string;
  backToSignIn: string;
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
  confirmationTitle: string;
  confirmationLead: string;
  confirmationSpam: string;
  confirmationAfterClick: string;
  confirmationLoginCta: string;
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

export type DashboardDictionary = {
  loading: string;
  signOut: string;
  export: {
    ariaLabel: string;
    button: string;
    columns: {
      date: string;
      clientName: string;
      phone: string;
      email: string;
      projectType: string;
      status: string;
      description: string;
    };
  };
  tabs: {
    inbox: string;
    organize: string;
    profile: string;
    partners: string;
  };
  tabDescriptions: {
    inbox: string;
    organize: string;
    profile: string;
    partners: string;
  };
  tours: {
    prev: string;
    next: string;
    done: string;
    inbox: {
      steps: Array<{
        element: string;
        title: string;
        description: string;
        descriptionEssential?: string;
        proOnly?: boolean;
      }>;
    };
    organize: {
      steps: Array<{
        element: string;
        title: string;
        description: string;
        descriptionEssential?: string;
        proOnly?: boolean;
      }>;
    };
    profile: {
      steps: Array<{
        element: string;
        title: string;
        description: string;
        descriptionEssential?: string;
        proOnly?: boolean;
      }>;
    };
    partners: {
      steps: Array<{
        element: string;
        title: string;
        description: string;
        descriptionEssential?: string;
        proOnly?: boolean;
      }>;
    };
  };
  inbox: {
    title: string;
    subtitle: string;
    listHeading: string;
    listAriaLabel: string;
    selectLead: string;
    backToList: string;
    emptyNew: string;
    validateAndPlan: string;
    archive: string;
    planHint: string;
    statusNew: string;
  };
  organize: {
    title: string;
    subtitle: string;
    empty: string;
  };
  profilePanel: {
    title: string;
    subtitle: string;
    editorTitle: string;
    editorSubtitle: string;
    urgencyTitle: string;
    urgencyEnabledBadge: string;
    urgencyDisabledBadge: string;
    urgencyEnabledBody: string;
    urgencyHiddenBody: string;
    urgencyOptionalBody: string;
    projectFormBadge: string;
    metierNotSet: string;
    metierNotSetHint: string;
    mobileSections: {
      urgency: string;
      editor: string;
      qr: string;
      billing: string;
      account: string;
    };
    sectionsAriaLabel: string;
  };
  leads: {
    title: string;
    subtitle: string;
    empty: string;
    whatsappQuota: {
      unlimited: string;
      limited: string;
    };
    whatsappError: {
      title: string;
      dismiss: string;
    };
    upgradeModal: {
      eyebrow: string;
      title: string;
      body: string;
      usage: string;
      cta: string;
      dismiss: string;
      proBenefits: string[];
    };
    proFeatureGuard: {
      badge: string;
      description: string;
      cta: string;
      reassurance: string;
      calendar: {
        title: string;
      };
      stats: {
        title: string;
      };
    };
    summary: {
      total: string;
      urgent: string;
      asap: string;
      planned: string;
      info: string;
      done: string;
    };
    bulk: {
      selected: string;
      markDone: string;
      archive: string;
      clear: string;
      selectAll: string;
      selectOne: string;
    };
    pipeline: {
      singleDragHint: string;
    };
    columns: {
      id: string;
      name: string;
      requestDate: string;
      work: string;
      zone: string;
      delay: string;
      calendar: string;
      status: string;
      quoteDays: string;
      invoiceDays: string;
      whatsapp: string;
    };
    billing: {
      notSent: string;
      dayUnit: string;
    };
    filter: {
      label: string;
      calendar: string;
      contact: string;
      all: string;
      scheduled: string;
      unscheduled: string;
      pending: string;
      contacted: string;
    };
    contactStatus: {
      pending: string;
      contacted: string;
    };
    contactWhatsApp: string;
    delayStatus: Record<"urgent" | "asap" | "planned" | "info", string>;
    delayStatusHints: Record<"urgent" | "asap" | "planned" | "info", string>;
    statusLegendTitle: string;
    sort: {
      label: string;
      id: string;
      date: string;
      name: string;
      delay: string;
      status: string;
      calendar: string;
      contactStatus: string;
      quoteDays: string;
      invoiceDays: string;
      showArchived: string;
      hideArchived: string;
    };
    workflow: {
      labels: Record<
        | "A_TRAITER"
        | "DEVIS_A_FAIRE"
        | "DEVIS_ENVOYE"
        | "DEVIS_SIGNE"
        | "FACTURE_A_ENVOYER"
        | "FACTURE_ENVOYEE"
        | "GAGNE_EN_COURS"
        | "ARCHIVE",
        string
      >;
      hints: Record<
        | "A_TRAITER"
        | "DEVIS_A_FAIRE"
        | "DEVIS_ENVOYE"
        | "DEVIS_SIGNE"
        | "FACTURE_A_ENVOYER"
        | "FACTURE_ENVOYEE"
        | "GAGNE_EN_COURS"
        | "ARCHIVE",
        string
      >;
      sectionStatus: string;
      sectionClient: string;
      sectionWork: string;
      sectionAttachments: string;
      sectionPlanning: string;
      markDone: string;
      archive: string;
      reactivate: string;
    };
    detail: {
      title: string;
      close: string;
      phoneLabel: string;
      descriptionLabel: string;
      needNatureLabel: string;
      voiceLabel: string;
      voiceSummaryLabel: string;
      transcriptLabel: string;
      photosLabel: string;
      summaryLabel: string;
      quoteSentOnLabel: string;
      invoiceSentOnLabel: string;
    };
    emptyArchived: string;
    views: {
      ariaLabel: string;
      sectionAriaLabel: string;
      listSection: string;
      calendarSection: string;
      statsSection: string;
      table: string;
      cards: string;
      pipeline: string;
    };
    stats: {
      title: string;
      subtitle: string;
      empty: string;
      periodAriaLabel: string;
      periods: Record<"7d" | "month" | "year", string>;
      audience: {
        title: string;
        hint: string;
        pageViews: string;
        contacts: string;
        materialClicks: string;
      };
      businessTitle: string;
      businessHint: string;
      kpis: {
        total: string;
        conversion: string;
        signedRevenue: string;
        pendingVolume: string;
      };
      timeline: {
        title: string;
        subtitle: string;
        requests: string;
      };
      distribution: {
        title: string;
        subtitle: string;
        buckets: Record<"pending" | "quote_sent" | "signed" | "refused", string>;
      };
      montantHint: string;
    };
    schedule: {
      title: string;
      hint: string;
      dateLabel: string;
      durationLabel: string;
      minutesValueLabel: string;
      hoursValueLabel: string;
      minutesUnit: string;
      hoursUnit: string;
      durationPresets: Record<"minutes" | "hours" | "half_day" | "full_day", string>;
      save: string;
      clear: string;
      savedHint: string;
    };
    calendar: {
      views: Record<"day" | "week" | "month", string>;
      prev: string;
      next: string;
      weekOf: string;
      rangeHint: string;
      emptyDay: string;
      notScheduled: string;
      weekdays: string[];
    };
    catchUp: {
      eyebrow: string;
      ariaLabel: string;
      question: string;
      quoteSent: string;
      lost: string;
      snooze: string;
    };
    copyRequest: {
      label: string;
      copied: string;
    };
    quickReplies: {
      title: string;
      quoteFollowup: string;
      invoiceFollowup: string;
    };
    attachments: {
      title: string;
      dropHint: string;
      dropHintShort: string;
      formats: string;
      uploading: string;
      invalidType: string;
      expiredTitle: string;
      expiredBody: string;
      fileExpired: string;
    };
    mediaRetention: {
      expiredTitle: string;
      expiredBody: string;
    };
  };
  vitrine: {
    title: string;
    subtitle: string;
    editorSections: {
      general: string;
      content: string;
      visual: string;
    };
    subTabs: {
      profile: string;
      capture: string;
      qr: string;
      partners: string;
    };
    fields: {
      businessName: string;
      trade: string;
      description: string;
      city: string;
      phone: string;
      pageUrl: string;
      instagram: string;
      facebook: string;
      google: string;
      certifications: {
        label: string;
        hint: string;
        placeholder: string;
        add: string;
        removeAria: string;
        maxReached: string;
      };
    };
    save: string;
    saving: string;
    saved: string;
    saveError: string;
    viewPage: string;
    copyPageUrl: string;
    pageUrlCopied: string;
    editPage: string;
    voiceCapture: {
      title: string;
      description: string;
      rawAudioNote: string;
      proBadge: string;
      lockedHint: string;
      upgradeCta: string;
    };
    gallery: {
      title: string;
      subtitle: string;
      socialButton: string;
      phoneButton: string;
      fromInstagram: string;
      fromFacebook: string;
      fromGoogle: string;
      fromPhone: string;
      essentialBlocked: string;
      proLimitReached: string;
      directQuota: string;
      empty: string;
      urlPlaceholder: string;
      addLink: string;
      cancel: string;
      remove: string;
      badgeDirect: string;
      externalPreview: string;
      instagramUrlLabel: string;
      facebookUrlLabel: string;
      googleUrlLabel: string;
      invalidInstagramUrl: string;
      invalidFacebookUrl: string;
      invalidGoogleUrl: string;
      invalidImageType: string;
      uploadError: string;
      deleteStorageError: string;
      instagramProfileAlt: string;
      instagramPostAlt: string;
      facebookAlt: string;
      googleAlt: string;
      directAlt: string;
    };
    headerAppearance: {
      title: string;
      layoutTitle: string;
      layoutBanner: string;
      layoutBannerHint: string;
      layoutBrand: string;
      layoutBrandHint: string;
      layoutAvatar: string;
      layoutAvatarHint: string;
      layoutPageBrand: string;
      layoutPageBrandHint: string;
      bgTitle: string;
      bgSolid: string;
      bgGradient: string;
      bgImage: string;
      gradientFrom: string;
      gradientTo: string;
      uploadBanner: string;
      uploading: string;
      avatarBorderLabel: string;
    };
  };
  qr: {
    title: string;
    subtitle: string;
    download: string;
    printHint: string;
  };
  partners: {
    title: string;
    subtitle: string;
    requestsTitle: string;
    requestsHint: string;
    lockedTitle: string;
    lockedBody: string;
    upgradeCta: string;
    empty: string;
    emptyHint: string;
    loadError: string;
    pendingCount: string;
    showArchived: string;
    proSelection: {
      title: string;
      hint: string;
      enabledLabel: string;
      titleLabel: string;
      titlePlaceholder: string;
      add: string;
      edit: string;
      remove: string;
      save: string;
      cancel: string;
      empty: string;
      moveUp: string;
      moveDown: string;
      formTitle: string;
      formDescription: string;
      formDiscount: string;
      formImage: string;
      formUrl: string;
      formActive: string;
      uploading: string;
      saving: string;
      error: string;
      saveSettings: string;
      maxReached: string;
    };
    columns: {
      company: string;
      contact: string;
      type: string;
      date: string;
      status: string;
    };
    types: {
      advertising: string;
      ugc: string;
      product_test: string;
      other: string;
    };
    budgetRanges: {
      under_5k: string;
      from_5k_to_15k: string;
      from_15k_to_50k: string;
      over_50k: string;
      undisclosed: string;
    };
    status: {
      A_TRAITER: string;
      CONTACTE: string;
      ARCHIVE: string;
    };
    detail: {
      title: string;
      company: string;
      contact: string;
      jobTitle: string;
      email: string;
      phone: string;
      type: string;
      budget: string;
      budgetNotProvided: string;
      message: string;
      receivedAt: string;
      markContacted: string;
      markPending: string;
      archive: string;
      close: string;
      contactCta: string;
      contactBySms: string;
      contactByWhatsApp: string;
      contactEmailSubject: string;
      contactMessage: string;
    };
  };
  billing: {
    title: string;
    pageSubtitle: string;
    backToDashboard: string;
    currentPlan: string;
    badgeFree: string;
    badgePro: string;
    badgeTrial: string;
    essential: string;
    essentialPrice: string;
    pro: string;
    trialPrice: string;
    trialEndsOn: string;
    trialUpgradeHint: string;
    proPriceMonthly: string;
    proPriceAnnual: string;
    manageStripe: string;
    manageStripeLoading: string;
    portalSectionTitle: string;
    portalSectionBody: string;
    upgradePro: string;
    portalError: string;
    essentialFeatures: string;
    proFeatures: string;
    plansCompareTitle: string;
    nextBilling: string;
    nextBillingOn: string;
    nextBillingNone: string;
    billingIntervalMonthly: string;
    billingIntervalAnnual: string;
  };
  account: {
    title: string;
    subtitle: string;
    delete: {
      title: string;
      body: string;
      bullets: string[];
      cta: string;
      modalTitle: string;
      modalBody: string;
      confirmLabel: string;
      confirmWord: string;
      confirmCta: string;
      deleting: string;
      cancel: string;
    };
  };
};

export type AuthDictionary = {
  serviceUnavailable: string;
  shell: AuthShellDictionary;
  signIn: AuthSignInDictionary;
  signUp: AuthSignUpDictionary;
  forgotPassword: AuthForgotPasswordDictionary;
  resetPassword: AuthResetPasswordDictionary;
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

export type HeroAsideShowcaseDictionary = {
  url: string;
  instagramHandle: string;
  businessName: string;
  trade: string;
  followers: string;
  posts: string;
  following: string;
  bioLine: string;
  ctaMessage: string;
  ctaQuote: string;
  ctaServices: string;
  flowLabel: string;
  statPosts: string;
  statFollowers: string;
  statFollowing: string;
  follow: string;
  followersOnPage: string;
  portfolioTitle: string;
  linkInBio: string;
  category: string;
  highlightLabels: [string, string, string];
  reelsTab: string;
};

export type HeroDictionary = {
  pill: string;
  titleBefore: string;
  rotatingWords: string[];
  titleAfter: string;
  typingTitle: HeroTypingTitleDictionary;
  asideShowcaseAlt: string;
  asideShowcase: HeroAsideShowcaseDictionary;
  lead: string;
  controlPhrase: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
};

export type LandingFeatureCard = {
  index: string;
  title: string;
  description: string;
};

export type LandingFeaturesDictionary = {
  eyebrow: string;
  title: string;
  lead: string;
  cards: LandingFeatureCard[];
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
  copyrightBefore: string;
  copyrightLink: string;
  copyrightAfter: string;
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
    contactTabLabel: string;
    proSelectionTitle: string;
    proSelectionSearch: string;
    proSelectionEmpty: string;
    proSelectionCta: string;
    reportUrgency: string;
    followersLabel: string;
    urgencyWhatsAppMessage: string;
    urgencyClickLeadDescription: string;
    urgencyWhatsAppUnavailable: string;
    certificationsAriaLabel: string;
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
    email: string;
    emailPlaceholder: string;
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
    needNature: string;
    needNatureOptional: string;
    needNaturePlaceholder: string;
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
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      cta: string;
    };
    stats: {
      artisans: { value: string; label: string };
      engagement: { value: string; label: string };
      opportunities: { value: string; label: string };
    };
    offers: {
      title: string;
      subtitle: string;
      advertising: { title: string; description: string; bullets: string[] };
      ugc: { title: string; description: string; bullets: string[] };
      productTest: { title: string; description: string; bullets: string[] };
    };
    form: {
      title: string;
      subtitle: string;
      companyName: string;
      contactName: string;
      jobTitle: string;
      email: string;
      phone: string;
      partnershipType: string;
      partnershipOptions: {
        advertising: string;
        ugc: string;
        product_test: string;
        other: string;
      };
      budget: string;
      budgetOptional: string;
      budgetOr: string;
      budgetCustom: string;
      budgetCustomPlaceholder: string;
      budgetOptions: {
        under_5k: string;
        from_5k_to_15k: string;
        from_15k_to_50k: string;
        over_50k: string;
        undisclosed: string;
      };
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      errorBody: string;
      successTitle: string;
      successBody: string;
    };
    files: {
      dropHint: string;
      browse: string;
      tooMany: string;
      tooLarge: string;
      invalidType: string;
      invalidVideo: string;
    };
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
  signOut: string;
  accountConfirmed: {
    title: string;
    body: string;
    cta: string;
    hint: string;
  };
  emailConfirmed: {
    title: string;
    message: string;
  };
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
    statsTitle: string;
    statsSubtitle: string;
    experienceYearsLabel: string;
    experienceYearsPlaceholder: string;
    experienceYearsHint: string;
    completedProjectsLabel: string;
    completedProjectsPlaceholder: string;
    completedProjectsHint: string;
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
    googleBusinessShareGuideTitle: string;
    googleBusinessShareSteps: string[];
    googleBusinessPlaceholder: string;
    socialFollowersCountLabel: string;
    socialFollowersPlaceholder: string;
    socialFollowersShowLabel: string;
    googleStatsLoading: string;
    googleStatsFetchError: string;
    googleReviewCountLabel: string;
    googleRatingLabel: string;
    googleReviewCountPlaceholder: string;
    googleRatingPlaceholder: string;
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
    secondaryColorLabel: string;
    secondaryColorHint: string;
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
    platformLabel: string;
    identifierLabel: string;
    placeholderGoogle: string;
    googleImportHint: string;
    placeholderInstagram: string;
    placeholderFacebook: string;
    generate: string;
    generating: string;
    manualLink: string;
    loadingHint: string;
    importError: string;
    importErrorInvalidIdentifier: string;
    importErrorGoogleNotFound: string;
    importErrorInstagramNotFound: string;
    importErrorFacebookNotFound: string;
    importErrorFacebookProvider: string;
    importErrorProvider: string;
    importErrorGeneric: string;
    importQuotaExceeded: string;
    importRemainingHint: string;
    generationsOfferedBadge: string;
    serverConfigError: string;
    quotaFallbackMessage: string;
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
    yourUrl: string;
    cta: string;
    autoRedirect: string;
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
    slugTitle: string;
    slugSubtitle: string;
    slugLabel: string;
    slugPrefix: string;
    slugPlaceholder: string;
    slugHint: string;
    slugChecking: string;
    slugAvailable: string;
    slugConfirm: string;
    slugYourUrl: string;
    slugEditLink: string;
    copyPageUrl: string;
    pageUrlCopied: string;
    slugErrors: {
      empty: string;
      tooShort: string;
      tooLong: string;
      invalidChars: string;
      invalidEdges: string;
      reserved: string;
      taken: string;
    };
    editableFieldsTitle: string;
    editableFieldsList: string[];
  };
};

export type Dictionary = {
  meta: MetaDictionary;
  nav: NavDictionary;
  faqUi: FaqUiDictionary;
  auth: AuthDictionary;
  hero: HeroDictionary;
  features: LandingFeaturesDictionary;
  pourquoi: PourquoiDictionary;
  featuresFlow: FeaturesFlowDictionary;
  pricingComparison: PricingComparisonDictionary;
  footer: FooterDictionary;
  cookieConsent: CookieConsentDictionary;
  legal: LegalBundleDictionary;
  vitrine: VitrineDictionary;
  onboarding: OnboardingDictionary;
  dashboard: DashboardDictionary;
  landing: LandingExtendedDictionary;
};
