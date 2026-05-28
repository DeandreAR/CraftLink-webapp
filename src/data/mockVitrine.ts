import type {
  ArtisanVitrineProfile,
  PublicPlanTier,
  VitrineProfileSettings,
  VitrineService,
  VitrineTheme,
} from "@/domain/vitrine";
import { DEFAULT_VITRINE_THEME } from "@/lib/vitrine/theme";

export type MockVitrinePage = {
  artisan: ArtisanVitrineProfile;
  services: VitrineService[];
  planTier: PublicPlanTier;
  theme: VitrineTheme;
  profileSettings: VitrineProfileSettings;
};

const DEMO_ELECTRICIAN_IMAGE = "/images/vitrine-demo-electrician.png";

const GOOGLE_BUSINESS_URL =
  "https://www.google.com/maps/place/?q=place_id:ChIJdemo";

const MOCK_SERVICES: VitrineService[] = [
  {
    id: "depannage",
    title: "Dépannage électrique",
    priceHtLabel: "À partir de 85€ HT",
    description: "Panne, disjoncteur, prise.",
  },
  {
    id: "tableau",
    title: "Mise aux normes tableau",
    priceHtLabel: "Sur devis",
    description: "Diagnostic + devis sous 48h.",
  },
  {
    id: "installation",
    title: "Installation & rénovation",
    priceHtLabel: "Sur devis",
    description: "Neuf, extension, rénovation complète.",
  },
  {
    id: "domotique",
    title: "Domotique & éclairage",
    priceHtLabel: "Sur devis",
    description: "Scénarios, LED, volets connectés.",
  },
];

const BASE_PROFILE: Omit<ArtisanVitrineProfile, "slug"> = {
  businessName: "John Carter Électricité",
  tradeLabel: "Électricien Spécialisé",
  city: "Nantes",
  avatarInitials: "JC",
  googleBusinessUrl: GOOGLE_BUSINESS_URL,
  media: {
    showAvatar: true,
    bannerUrl: DEMO_ELECTRICIAN_IMAGE,
    avatarUrl: DEMO_ELECTRICIAN_IMAGE,
  },
  statBadges: [
    { id: "exp", label: "10+ Années Exp.", kind: "default" },
    {
      id: "reviews",
      label: "25+ Avis Google",
      kind: "google_reviews",
    },
    {
      id: "rating",
      label: "4.9",
      kind: "google_rating",
      rating: "4.9",
      starCount: 5,
    },
  ],
  interventions: [
    "Dépannage Urgent",
    "Installation Domotique",
    "Rénovation Électrique",
  ],
  serviceAreaSummary: "Intervient à Nantes et 30 km alentour",
  socialLinks: [
    {
      id: "ig",
      type: "instagram",
      label: "Instagram",
      href: "https://instagram.com",
    },
    {
      id: "fb",
      type: "facebook",
      label: "Facebook",
      href: "https://facebook.com",
    },
    {
      id: "li",
      type: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com",
    },
  ],
};

const SETTINGS_ESSENTIAL: VitrineProfileSettings = {
  visibility: {
    showSocialLinks: true,
    showStatBadges: true,
    showInterventionTags: true,
    showCollaborationButton: false,
  },
  cta: {
    secondaryInfo: "Poser une Question",
    secondaryUrgent: "Demander un RDV Urgent",
    collaboration: "Lien Collaboration (Partenaires)",
  },
};

const SETTINGS_PRO: VitrineProfileSettings = {
  visibility: {
    showSocialLinks: true,
    showStatBadges: true,
    showInterventionTags: true,
    showCollaborationButton: true,
  },
  cta: {
    primaryQuote: "Demander un Devis",
    secondaryInfo: "Poser une Question",
    secondaryUrgent: "Demander un RDV Urgent",
    collaboration: "Lien Collaboration (Partenaires)",
  },
};

const THEME_ESSENTIAL: VitrineTheme = {
  ...DEFAULT_VITRINE_THEME,
  primary: "#ea580c",
  primaryForeground: "#ffffff",
  accent: "#f97316",
  background: "#ffffff",
  surface: "#ffffff",
  text: "#171717",
  textMuted: "#737373",
  bannerFrom: "#fdba74",
  bannerTo: "#fed7aa",
};

const THEME_PRO: VitrineTheme = {
  ...DEFAULT_VITRINE_THEME,
  primary: "#ea580c",
  primaryForeground: "#ffffff",
  accent: "#fb923c",
  background: "#ffffff",
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  bannerFrom: "#fdba74",
  bannerTo: "#fed7aa",
};

export const MOCK_VITRINE_ESSENTIAL: MockVitrinePage = {
  planTier: "ALL_SOURCES",
  theme: THEME_ESSENTIAL,
  profileSettings: SETTINGS_ESSENTIAL,
  artisan: {
    ...BASE_PROFILE,
    slug: "demo-essentiel",
  },
  services: MOCK_SERVICES,
};

export const MOCK_VITRINE_PRO: MockVitrinePage = {
  planTier: "PRO",
  theme: THEME_PRO,
  profileSettings: SETTINGS_PRO,
  artisan: {
    ...BASE_PROFILE,
    slug: "demo-pro",
  },
  services: MOCK_SERVICES,
};

export const MOCK_VITRINE_BANNER_ONLY: MockVitrinePage = {
  ...MOCK_VITRINE_PRO,
  artisan: {
    ...MOCK_VITRINE_PRO.artisan,
    slug: "demo-banniere",
    media: {
      showAvatar: false,
      bannerUrl: DEMO_ELECTRICIAN_IMAGE,
      avatarUrl: null,
    },
  },
};

const MOCK_BY_SLUG: Record<string, MockVitrinePage> = {
  "demo-essentiel": MOCK_VITRINE_ESSENTIAL,
  "demo-pro": MOCK_VITRINE_PRO,
  "demo-banniere": MOCK_VITRINE_BANNER_ONLY,
  demo: MOCK_VITRINE_PRO,
};

export function getMockVitrineBySlug(slug: string): MockVitrinePage | null {
  return MOCK_BY_SLUG[slug] ?? null;
}
