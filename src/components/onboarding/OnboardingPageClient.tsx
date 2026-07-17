"use client";

import { useCallback, useState } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ArtisanOnboardingWizard } from "@/components/onboarding/ArtisanOnboardingWizard";
import type { OnboardingPlanIntent } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { OnboardingResumeState } from "@/lib/onboarding/loadOnboardingResume";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type OnboardingPageClientProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  pricingModel: PricingSectionModel;
  planIntent?: OnboardingPlanIntent;
  resume?: OnboardingResumeState | null;
};

const buildDefaultShell = (
  copy: OnboardingDictionary,
  pricingModel: PricingSectionModel,
  planIntent: OnboardingPlanIntent,
  resume: OnboardingResumeState | null | undefined,
) => {
  const skipPlan =
    planIntent === "pro" ||
    (resume?.hasProgress && resume.freePhase !== "plan" && resume.wizard === "free") ||
    resume?.wizard === "pro";

  return skipPlan
    ? {
        title: copy.title,
        subtitle: copy.subtitle,
        contentClassName: "max-w-5xl",
      }
    : {
        title: copy.plan.title,
        subtitle: pricingModel.copy.pricingLead,
        contentClassName: "max-w-6xl",
      };
};

export function OnboardingPageClient({
  lang,
  copy,
  vitrineCopy,
  pricingModel,
  planIntent = "choice",
  resume = null,
}: OnboardingPageClientProps) {
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [shell, setShell] = useState(() =>
    buildDefaultShell(copy, pricingModel, planIntent, resume),
  );

  const handleCelebrationChange = useCallback((active: boolean) => {
    setCelebrationActive(active);
  }, []);

  const handleShellChange = useCallback(
    (next: { title: string; subtitle: string; contentClassName: string }) => {
      setShell(next);
    },
    [],
  );

  return (
    <AuthPageShell
      lang={lang}
      title={celebrationActive ? "" : shell.title}
      subtitle={celebrationActive ? "" : shell.subtitle}
      alternateHref="/"
      alternateLabel=""
      signOutLabel={copy.signOut}
      backToHomeLabel="Accueil"
      contentClassName={shell.contentClassName}
      hideBrandPill
      hideHeading={celebrationActive}
      showBrush
    >
      <ArtisanOnboardingWizard
        lang={lang}
        copy={copy}
        vitrineCopy={vitrineCopy}
        pricingModel={pricingModel}
        planIntent={planIntent}
        resume={resume}
        onCelebrationChange={handleCelebrationChange}
        onShellChange={handleShellChange}
      />
    </AuthPageShell>
  );
}
