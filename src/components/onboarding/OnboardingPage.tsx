import { OnboardingPageClient } from "@/components/onboarding/OnboardingPageClient";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";

type OnboardingPageProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  loginLabel: string;
  planIntent?: OnboardingPlanIntent;
  emailConfirmed?: boolean;
};

export function OnboardingPage({
  lang,
  copy,
  vitrineCopy,
  loginLabel,
  planIntent = "choice",
  emailConfirmed = false,
}: OnboardingPageProps) {
  return (
    <OnboardingPageClient
      lang={lang}
      copy={copy}
      vitrineCopy={vitrineCopy}
      loginLabel={loginLabel}
      planIntent={planIntent}
      emailConfirmed={emailConfirmed}
    />
  );
}
