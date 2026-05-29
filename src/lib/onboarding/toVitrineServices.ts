import type { OnboardingService } from "@/domain/onboarding";
import type { VitrineService } from "@/domain/vitrine";

type PriceLabels = {
  pricePrefix: string;
  priceSuffixEur: string;
  priceSuffixUsd: string;
  surDevis: string;
};

export function formatOnboardingPriceLabel(
  service: Pick<OnboardingService, "priceMode" | "price" | "currency">,
  labels: PriceLabels,
): string {
  if (service.priceMode === "quote") {
    return labels.surDevis;
  }
  if (service.price == null || service.price <= 0) {
    return labels.surDevis;
  }
  const suffix =
    service.currency === "USD" ? labels.priceSuffixUsd : labels.priceSuffixEur;
  return `${labels.pricePrefix} ${service.price} ${suffix}`.replace(/\s+/g, " ").trim();
}

export function onboardingServicesToVitrine(
  services: OnboardingService[],
  labels: PriceLabels,
): VitrineService[] {
  return services.map((service) => ({
    id: service.id,
    title: service.name,
    priceHtLabel: formatOnboardingPriceLabel(service, labels),
  }));
}
