import { OnboardingPageClient } from "@/components/onboarding/OnboardingPageClient";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";

type OnboardingPageProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  planIntent?: OnboardingPlanIntent;
  emailConfirmed?: boolean;
};

export function OnboardingPage({
  lang,
  copy,
  vitrineCopy,
  planIntent = "choice",
  emailConfirmed = false,
}: OnboardingPageProps) {
  return (
    <OnboardingPageClient
      lang={lang}
      copy={copy}
      vitrineCopy={vitrineCopy}
      planIntent={planIntent}
      emailConfirmed={emailConfirmed}
    />
  );
}
