"use client";

import { PricingGrid } from "@/components/landing/PricingGrid";
import type { Locale } from "@/i18n/config";
import type { ProBillingPeriod } from "@/lib/auth/paths";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type OnboardingPlanSelectionStepProps = {
  model: PricingSectionModel;
  locale: Locale;
  onSelectEssential: () => void;
  onSelectPro: (billing: ProBillingPeriod) => void;
};

export function OnboardingPlanSelectionStep({
  model,
  locale,
  onSelectEssential,
  onSelectPro,
}: OnboardingPlanSelectionStepProps) {
  return (
    <PricingGrid
      model={model}
      basePath=""
      locale={locale}
      actions={{
        onSelectEssential,
        onSelectPro,
      }}
    />
  );
}
