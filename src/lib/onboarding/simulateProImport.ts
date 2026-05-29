import type { OnboardingProfileDraft, ProImportPlatform } from "@/domain/onboarding";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { extractDominantColorFromUrl, FALLBACK_BRAND } from "@/lib/onboarding/extractDominantColor";
import { getMissingProRequiredFields } from "@/lib/onboarding/proRequiredFields";

export type ProImportResult = {
  profile: Partial<OnboardingProfileDraft>;
  logoUrl: string | null;
  brandColor: string;
  missingFields: ReturnType<typeof getMissingProRequiredFields>;
};

const MOCK_BY_PLATFORM: Record<
  ProImportPlatform,
  {
    businessName: string;
    metierKey: MetierKey;
    city: string;
    phone?: string;
    logoUrl: string;
    fallbackBrand: string;
    interventions: string[];
    aboutText?: string;
  }
> = {
  google: {
    businessName: "Élec Pro Nantes",
    metierKey: "ELECTRICIEN",
    city: "Nantes",
    logoUrl: "/images/portfolio/tableau-electrique.png",
    fallbackBrand: "#2563eb",
    interventions: ["Dépannage urgent", "Mise aux normes", "Domotique"],
  },
  instagram: {
    businessName: "elec_pro_44",
    metierKey: "ELECTRICIEN",
    city: "",
    logoUrl: "/images/portfolio/borne-recharge.png",
    fallbackBrand: "#ea580c",
    interventions: ["Rénovation électrique", "Borne de recharge"],
    aboutText: "Électricien sur Nantes et agglo — devis sous 48h.",
  },
  facebook: {
    businessName: "Carter Électricité",
    metierKey: "ELECTRICIEN",
    city: "Saint-Herblain",
    phone: "06 12 34 56 78",
    logoUrl: "/images/portfolio/electricite-renovation.png",
    fallbackBrand: "#0f766e",
    interventions: ["Tableau électrique", "Dépannage"],
  },
};

export async function simulateProImport(
  platform: ProImportPlatform,
  identifier: string,
): Promise<ProImportResult> {
  await new Promise((resolve) => setTimeout(resolve, 2400));

  const base = MOCK_BY_PLATFORM[platform];
  const trimmed = identifier.trim();
  const businessName =
    trimmed.length > 2 ? trimmed.replace(/^@/, "") : base.businessName;

  let brandColor = base.fallbackBrand;
  try {
    const extracted = await extractDominantColorFromUrl(base.logoUrl);
    brandColor = extracted !== FALLBACK_BRAND ? extracted : base.fallbackBrand;
  } catch {
    brandColor = base.fallbackBrand;
  }

  const draft: OnboardingProfileDraft = {
    plan: "PRO",
    businessName,
    phone: base.phone ?? "",
    metierKey: base.metierKey,
    city: base.city,
    cityCode: "",
    postalCode: "",
    interventionRadiusKm: 30,
    presentationMode: base.aboutText
      ? "about"
      : base.interventions.length > 0
        ? "interventions"
        : null,
    selectedInterventions: base.aboutText ? [] : base.interventions,
    aboutText: base.aboutText ?? "",
    social: {
      instagram: platform === "instagram" && trimmed ? `https://instagram.com/${trimmed.replace(/^@/, "")}` : "",
      facebook: platform === "facebook" && trimmed ? trimmed : "",
      tiktok: "",
      threads: "",
      snapchat: "",
      googleBusinessUrl: platform === "google" && trimmed ? `https://g.page/${trimmed}` : "",
    },
    visual: {
      fontId: "inter",
      accentColor: brandColor,
      avatarPreviewUrl: base.logoUrl,
      bannerPreviewUrl: null,
    },
    importPlatform: platform,
    importIdentifier: trimmed,
  };

  const missingFields = getMissingProRequiredFields(draft);

  return {
    profile: draft,
    logoUrl: base.logoUrl,
    brandColor,
    missingFields,
  };
}
