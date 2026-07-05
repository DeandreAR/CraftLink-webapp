"use client";

import { useCallback, useState } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ArtisanOnboardingWizard } from "@/components/onboarding/ArtisanOnboardingWizard";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";

type OnboardingPageClientProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  loginLabel: string;
  planIntent?: OnboardingPlanIntent;
};

export function OnboardingPageClient({
  lang,
  copy,
  vitrineCopy,
  loginLabel,
  planIntent = "choice",
}: OnboardingPageClientProps) {
  const [celebrationActive, setCelebrationActive] = useState(false);

  const handleCelebrationChange = useCallback((active: boolean) => {
    setCelebrationActive(active);
  }, []);

  return (
    <AuthPageShell
      lang={lang}
      title={celebrationActive ? "" : copy.title}
      subtitle={celebrationActive ? "" : copy.subtitle}
      alternateHref={authPath(lang, "login")}
      alternateLabel={loginLabel}
      backToHomeLabel="Accueil"
      contentClassName="max-w-5xl"
      hideBrandPill
      hideHeading={celebrationActive}
      showBrush
    >
      <ArtisanOnboardingWizard
        lang={lang}
        copy={copy}
        vitrineCopy={vitrineCopy}
        planIntent={planIntent}
        onCelebrationChange={handleCelebrationChange}
      />
    </AuthPageShell>
  );
}
