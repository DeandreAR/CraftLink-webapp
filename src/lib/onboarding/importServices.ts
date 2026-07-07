import type { OnboardingCurrency, OnboardingService } from "@/domain/onboarding";

export function namesToOnboardingServices(
  names: string[],
  currency: OnboardingCurrency = "EUR",
): OnboardingService[] {
  return names.map((name, index) => ({
    id: `import-svc-${index}-${name.toLowerCase().replace(/\s+/g, "-").slice(0, 24)}`,
    name,
    priceMode: "quote" as const,
    currency,
  }));
}
