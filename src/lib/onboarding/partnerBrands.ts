import type { OnboardingPartnerBrand } from "@/domain/onboarding";

export const MAX_PARTNER_BRANDS = 12;

export function createPartnerBrand(name = ""): OnboardingPartnerBrand {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
  };
}

export function sanitizePartnerBrands(brands: OnboardingPartnerBrand[]): OnboardingPartnerBrand[] {
  return brands
    .map((brand) => ({ ...brand, name: brand.name.trim() }))
    .filter((brand) => brand.name.length > 0)
    .slice(0, MAX_PARTNER_BRANDS);
}
