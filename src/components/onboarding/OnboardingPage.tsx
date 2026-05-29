import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ArtisanOnboardingWizard } from "@/components/onboarding/ArtisanOnboardingWizard";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";

type OnboardingPageProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  loginLabel: string;
  planIntent?: OnboardingPlanIntent;
};

export function OnboardingPage({
  lang,
  copy,
  vitrineCopy,
  loginLabel,
  planIntent = "choice",
}: OnboardingPageProps) {
  return (
    <AuthPageShell
      lang={lang}
      title={copy.title}
      subtitle={copy.subtitle}
      alternateHref={authPath(lang, "login")}
      alternateLabel={loginLabel}
      backToHomeLabel="Accueil"
      contentClassName="max-w-5xl"
      hideBrandPill
    >
      <ArtisanOnboardingWizard
        lang={lang}
        copy={copy}
        vitrineCopy={vitrineCopy}
        planIntent={planIntent}
      />
    </AuthPageShell>
  );
}
