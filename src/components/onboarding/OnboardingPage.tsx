import { OnboardingPageClient } from "@/components/onboarding/OnboardingPageClient";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { OnboardingResumeState } from "@/lib/onboarding/loadOnboardingResume";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type OnboardingPageProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  pricingModel: PricingSectionModel;
  planIntent?: OnboardingPlanIntent;
  resume?: OnboardingResumeState | null;
};

export function OnboardingPage({
  lang,
  copy,
  vitrineCopy,
  pricingModel,
  planIntent = "choice",
  resume = null,
}: OnboardingPageProps) {
  return (
    <OnboardingPageClient
      lang={lang}
      copy={copy}
      vitrineCopy={vitrineCopy}
      pricingModel={pricingModel}
      planIntent={planIntent}
      resume={resume}
    />
  );
}
