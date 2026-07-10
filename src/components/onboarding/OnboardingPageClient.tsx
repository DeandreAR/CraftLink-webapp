"use client";

import { useCallback, useState } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ArtisanOnboardingWizard } from "@/components/onboarding/ArtisanOnboardingWizard";
import { OnboardingEmailConfirmedBanner } from "@/components/onboarding/OnboardingEmailConfirmedBanner";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";

type OnboardingPageClientProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  planIntent?: OnboardingPlanIntent;
  emailConfirmed?: boolean;
};

export function OnboardingPageClient({
  lang,
  copy,
  vitrineCopy,
  planIntent = "choice",
  emailConfirmed = false,
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
      alternateHref="/"
      alternateLabel=""
      signOutLabel={copy.signOut}
      backToHomeLabel="Accueil"
      contentClassName="max-w-5xl"
      hideBrandPill
      hideHeading={celebrationActive}
      showBrush
    >
      {emailConfirmed ? (
        <OnboardingEmailConfirmedBanner
          title={copy.emailConfirmed.title}
          message={copy.emailConfirmed.message}
        />
      ) : null}
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
