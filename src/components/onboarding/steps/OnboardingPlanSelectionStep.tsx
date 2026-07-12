"use client";

import { PricingGrid } from "@/components/landing/PricingGrid";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import type { ProBillingPeriod } from "@/lib/auth/paths";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type OnboardingPlanSelectionStepProps = {
  model: PricingSectionModel;
  copy: OnboardingDictionary;
  locale: Locale;
  onSelectEssential: () => void;
  onSelectPro: (billing: ProBillingPeriod) => void;
};

export function OnboardingPlanSelectionStep({
  model,
  copy,
  locale,
  onSelectEssential,
  onSelectPro,
}: OnboardingPlanSelectionStepProps) {
  const { copy: pricingCopy } = model;

  return (
    <div>
      <h2 className="lk-display text-2xl md:text-3xl">{copy.plan.title}</h2>
      <p className="lk-lead mt-3 max-w-3xl text-base text-neutral-600 md:text-lg">
        {pricingCopy.pricingLead}
      </p>

      <PricingGrid
        model={model}
        basePath=""
        locale={locale}
        actions={{
          onSelectEssential,
          onSelectPro,
        }}
      />
    </div>
  );
}
