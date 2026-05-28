/** Niveau d’abonnement simplifié pour la vitrine publique. */
export type PublicPlanTier = "ALL_SOURCES" | "PRO";

/** État d’interaction client sur la vitrine. */
export type VitrineInteractionState = "INITIAL" | "DETAILS_VISIBLE";

/** Intention à l’ouverture du funnel de capture. */
export type VitrineOpenIntent = "quote" | "info" | "urgent" | "collaboration";

/** Palette personnalisable de la page artisan. */
export type VitrineTheme = {
  primary: string;
  primaryForeground: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  bannerFrom: string;
  bannerTo: string;
};

/** Bloc sous les badges : liste d’interventions ou texte « À propos ». */
export type VitrineContentBlockMode = "interventions" | "about";

export type VitrineAboutSection = {
  title: string;
  body: string;
};

export type VitrineVisibilitySettings = {
  showSocialLinks: boolean;
  showStatBadges: boolean;
  showInterventionTags: boolean;
  showCollaborationButton: boolean;
  showPortfolioGallery: boolean;
  contentBlockMode: VitrineContentBlockMode;
};

export type VitrineCtaLabels = {
  /** Personnalisable en offre PRO — libellé du CTA principal devis. */
  primaryQuote?: string;
  secondaryInfo: string;
  secondaryUrgent: string;
  collaboration: string;
};

export type VitrineProfileSettings = {
  visibility: VitrineVisibilitySettings;
  cta: VitrineCtaLabels;
};

export type VitrineStatBadgeKind =
  | "default"
  | "google_reviews"
  | "google_rating";

export type VitrineStatBadge = {
  id: string;
  label: string;
  kind?: VitrineStatBadgeKind;
  href?: string;
  /** Note affichée (ex. 4.9) — utilisé avec kind google_rating. */
  rating?: string;
  starCount?: number;
};

export type VitrineMedia = {
  /** Bannière pleine largeur (si pas de collage). */
  bannerUrl?: string | null;
  /** Grille 3 visuels : haut-gauche, bas-gauche, droite (pleine hauteur). */
  bannerCollage?: [string | null, string | null, string | null];
  avatarUrl?: string | null;
  showAvatar: boolean;
};

export type SocialLinkType =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "google"
  | "website"
  | "whatsapp";

export type VitrineSocialLink = {
  id: string;
  type: SocialLinkType;
  label: string;
  href: string;
};

/** Média portfolio sous les CTA (images ou embed Instagram). */
export type VitrinePortfolioItem = {
  id: string;
  type: "image" | "instagram_embed";
  /** URL image directe ou vignette. */
  imageUrl?: string;
  /** URL embed Instagram (blockquote / iframe). */
  embedUrl?: string;
  alt?: string;
};

export type ArtisanVitrineProfile = {
  slug: string;
  businessName: string;
  tradeLabel: string;
  city: string;
  avatarInitials: string;
  media: VitrineMedia;
  statBadges: VitrineStatBadge[];
  interventions: string[];
  serviceAreaSummary: string;
  /** Fiche Google Business (avis + note cliquables). */
  googleBusinessUrl?: string | null;
  socialLinks: VitrineSocialLink[];
  portfolioItems?: VitrinePortfolioItem[];
  aboutSection?: VitrineAboutSection | null;
};

export type VitrineService = {
  id: string;
  title: string;
  priceHtLabel: string;
  description?: string;
};

/** Délai souhaité pour la demande (4 niveaux). */
export type LeadUrgency = "urgent" | "asap" | "planned" | "info";

export type LeadCapturePayload = {
  fullName: string;
  phone: string;
  urgency: LeadUrgency;
  serviceIds: string[];
  projectDescription?: string;
  voiceNoteAttached?: boolean;
  isCollaborationRequest?: boolean;
  proCompanyName?: string;
  openIntent?: VitrineOpenIntent;
};

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";
