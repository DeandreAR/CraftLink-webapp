import type { OnboardingProfileDraft, ProImportPlatform } from "@/domain/onboarding";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

export type ProImportResult = {
  profile: Partial<OnboardingProfileDraft>;
};

const MOCK_BY_PLATFORM: Record<
  ProImportPlatform,
  { businessName: string; metierKey: MetierKey; city: string }
> = {
  google: {
    businessName: "Élec Pro Nantes",
    metierKey: "ELECTRICIEN",
    city: "Nantes",
  },
  instagram: {
    businessName: "@elec_pro_44",
    metierKey: "ELECTRICIEN",
    city: "Saint-Herblain",
  },
  facebook: {
    businessName: "Carter Électricité",
    metierKey: "ELECTRICIEN",
    city: "Nantes",
  },
};

export async function simulateProImport(
  platform: ProImportPlatform,
  identifier: string,
): Promise<ProImportResult> {
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const base = MOCK_BY_PLATFORM[platform];
  const trimmed = identifier.trim();

  return {
    profile: {
      businessName: trimmed.length > 2 ? trimmed.replace(/^@/, "") : base.businessName,
      metierKey: base.metierKey,
      city: base.city,
      interventionRadiusKm: 30,
      importPlatform: platform,
      importIdentifier: trimmed,
    },
  };
}
