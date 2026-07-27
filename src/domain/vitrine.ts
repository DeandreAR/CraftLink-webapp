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
  /** Police choisie dans l’éditeur Visuel. */
  fontFamily?: string;
  fontId?: string;
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
  /** @deprecated Remplacé par l’onglet « La Sélection Pro » (recommended_items). */
  showAffiliateLinks: boolean;
  /** Onglet « La Sélection Pro » (items recommandés unifiés). */
  showProSelection: boolean;
  /** Titre de l’onglet Sélection Pro. */
  proSelectionTitle: string;
  /**
   * Legacy — toujours `false`.
   * Les prestations s’affichent uniquement dans les formulaires devis / question.
   */
  showServicesOnPresentation: boolean;
  /** Bouton « Signaler une urgence » — dépend du métier (voir `metierSupportsUrgencyCta`). */
  showUrgentButton: boolean;
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
  /** Capture vocale (fichier audio brut) — Pro uniquement, activable depuis le dashboard. */
  voiceCaptureEnabled?: boolean;
};

export type VitrineStatBadgeKind =
  | "default"
  | "google_reviews"
  | "google_rating"
  | "experience"
  | "projects";

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
  /** Bannière dégradée (import Instagram — aucune image stockée). */
  bannerGradient?: { from: string; to: string } | null;
  /** Grille 3 visuels : haut-gauche, bas-gauche, droite (pleine hauteur). */
  bannerCollage?: [string | null, string | null, string | null];
  avatarUrl?: string | null;
  showAvatar: boolean;
  headerLayoutType?: "banner_overlay" | "brand_cover" | "avatar_cover" | "page_brand" | "standard";
  headerBgType?: "solid" | "gradient" | "image";
  /** Couleur unie du header (layout standard / fond solid). */
  headerSolidColor?: string | null;
  /** Contour blanc autour de la photo de profil. */
  headerAvatarBorder?: boolean;
};

export type VitrineRecommendedProduct = {
  id: string;
  title: string;
  description?: string | null;
  /** Image produit / logo (optionnelle). */
  imageUrl: string | null;
  /** Lien marchand, marque ou affiliation. */
  url: string;
  /** Code promo / réduction affiché. */
  discountCode?: string | null;
  /** @deprecated Prefer description */
  brand?: string | null;
  /** @deprecated Prefer url */
  affiliateUrl: string;
  /** @deprecated Prefer discountCode */
  priceHint?: string | null;
};

export type SocialLinkType =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "threads"
  | "snapchat"
  | "google"
  | "website"
  | "whatsapp";

export type VitrineAffiliateLink = {
  id: string;
  label: string;
  href: string;
  discount?: string;
  /** Aperçu image (artisan) pour la carte vitrine / partage. */
  imageUrl?: string;
};

export type VitrineSocialLink = {
  id: string;
  type: SocialLinkType;
  label: string;
  href: string;
  /** Libellé formaté ex. « 12k abonnés » — affiché sous l’icône si défini. */
  followerLabel?: string;
};

import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export type { MetierKey };

import type { PortfolioSourceType } from "@/domain/portfolio";

/** Média portfolio sous les CTA (images ou embed Instagram). */
export type VitrinePortfolioItem = {
  id: string;
  source_type: PortfolioSourceType;
  type: "image" | "instagram_embed" | "instagram_profile_embed" | "external_link";
  /** URL image directe ou vignette. */
  imageUrl?: string;
  /** URL externe (Facebook, Google, Instagram). */
  externalUrl?: string;
  /** URL embed Instagram (blockquote / iframe). */
  embedUrl?: string;
  alt?: string;
};

export type ArtisanVitrineProfile = {
  slug: string;
  businessName: string;
  /** Téléphone pro / WhatsApp de l'artisan (contact urgence). */
  phone?: string;
  tradeLabel: string;
  /** Pilote le formulaire de capture (titres, placeholders, champs optionnels). */
  metierKey?: MetierKey;
  city: string;
  avatarInitials: string;
  media: VitrineMedia;
  statBadges: VitrineStatBadge[];
  interventions: string[];
  serviceAreaSummary: string;
  /** Fiche Google Business (avis + note cliquables). */
  googleBusinessUrl?: string | null;
  socialLinks: VitrineSocialLink[];
  affiliateLinks: VitrineAffiliateLink[];
  recommendedProducts?: VitrineRecommendedProduct[];
  portfolioItems?: VitrinePortfolioItem[];
  aboutSection?: VitrineAboutSection | null;
  certifications?: string[];
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
  email: string;
  urgency: LeadUrgency;
  serviceIds: string[];
  projectDescription?: string;
  dimensions?: string;
  accessNotes?: string;
  voiceNoteAttached?: boolean;
  isCollaborationRequest?: boolean;
  proCompanyName?: string;
  openIntent?: VitrineOpenIntent;
};

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";
