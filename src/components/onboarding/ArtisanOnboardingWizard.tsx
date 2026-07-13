"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  defaultOnboardingProfile,
  type GeneralStepErrors,
  type OnboardingPlan,
  type OnboardingProfileDraft,
  type OnboardingPlanIntent,
  type OnboardingService,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import { OnboardingCompleteStep } from "@/components/onboarding/OnboardingCompleteStep";
import { OnboardingPlanBadge } from "@/components/onboarding/OnboardingPlanBadge";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { ProOnboardingWizard } from "@/components/onboarding/ProOnboardingWizard";
import {
  getGeneralStepErrors,
  isGeneralStepValid,
  OnboardingGeneralStep,
} from "@/components/onboarding/steps/OnboardingGeneralStep";
import {
  isInterventionsStepValid,
  OnboardingInterventionsStep,
} from "@/components/onboarding/steps/OnboardingInterventionsStep";
import { OnboardingPageSlugStep } from "@/components/onboarding/steps/OnboardingPageSlugStep";
import { OnboardingPlanSelectionStep } from "@/components/onboarding/steps/OnboardingPlanSelectionStep";
import { OnboardingVisualStep } from "@/components/onboarding/steps/OnboardingVisualStep";
import { LandingCta } from "@/components/landing/LandingCta";
import { authPath, onboardingPath, type ProBillingPeriod } from "@/lib/auth/paths";
import { suggestPageSlugFromName, validatePageSlug } from "@/lib/onboarding/pageSlug";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";
import { publishOnboardingProfile } from "@/lib/onboarding/publishOnboardingProfile";
import type { PricingSectionModel } from "@/services/pricingComparisonSection";

type WizardPhase = "plan" | "general" | "interventions" | "slug" | "visual" | "complete";

const STEPS: WizardPhase[] = ["general", "interventions", "slug", "visual"];

type ArtisanOnboardingWizardProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  pricingModel: PricingSectionModel;
  planIntent?: OnboardingPlanIntent;
  onCelebrationChange?: (active: boolean) => void;
  onShellChange?: (shell: {
    title: string;
    subtitle: string;
    contentClassName: string;
  }) => void;
};

function formatStepLabel(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

export function ArtisanOnboardingWizard({
  lang,
  copy,
  vitrineCopy,
  pricingModel,
  planIntent = "choice",
  onCelebrationChange,
  onShellChange,
}: ArtisanOnboardingWizardProps) {
  const isProIntent = planIntent === "pro";
  const searchParams = useSearchParams();
  const metierFromUrl = searchParams.get("metier");
  const showPlanStep = !isProIntent;
  const [proWizardActive, setProWizardActive] = useState(isProIntent);
  const [phase, setPhase] = useState<WizardPhase>(showPlanStep ? "plan" : "general");
  const [draftPlan, setDraftPlan] = useState<OnboardingPlan>(isProIntent ? "PRO" : "FREE");
  const [profile, setProfile] = useState<OnboardingProfileDraft>(() => {
    const base = defaultOnboardingProfile(isProIntent ? "PRO" : "FREE");
    if (metierFromUrl && isMetierKey(metierFromUrl)) {
      return { ...base, metierKey: metierFromUrl };
    }
    return base;
  });
  const [services, setServices] = useState<OnboardingService[]>([]);
  const [creating, setCreating] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [generalErrors, setGeneralErrors] = useState<GeneralStepErrors>({});
  const [interventionError, setInterventionError] = useState<string | null>(null);
  const [proBillingPeriod, setProBillingPeriod] = useState<ProBillingPeriod>("monthly");

  const patchProfile = useCallback((patch: Partial<OnboardingProfileDraft>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      if (
        patch.businessName &&
        !patch.pageSlug &&
        !prev.pageSlugConfirmed &&
        !prev.pageSlug.trim()
      ) {
        const suggested = suggestPageSlugFromName(patch.businessName);
        if (suggested) next.pageSlug = suggested;
      }
      return next;
    });
    if (patch.businessName !== undefined) {
      setGeneralErrors((e) => ({ ...e, businessName: undefined }));
    }
    if (patch.metierKey !== undefined) {
      setGeneralErrors((e) => ({ ...e, metierKey: undefined }));
      setInterventionError(null);
    }
    if (
      patch.selectedInterventions !== undefined ||
      patch.aboutText !== undefined ||
      patch.presentationMode !== undefined
    ) {
      setInterventionError(null);
    }
    if (patch.city !== undefined) {
      setGeneralErrors((e) => ({ ...e, city: undefined }));
    }
  }, []);

  const stepIndex = STEPS.indexOf(phase as (typeof STEPS)[number]);
  const progressCurrent = stepIndex >= 0 ? stepIndex + 1 : STEPS.length;

  useEffect(() => {
    onCelebrationChange?.(phase === "complete");
  }, [phase, onCelebrationChange]);

  useEffect(() => {
    if (!onShellChange) return;

    if (phase === "plan") {
      onShellChange({
        title: copy.plan.title,
        subtitle: pricingModel.copy.pricingLead,
        contentClassName: "max-w-6xl",
      });
      return;
    }

    onShellChange({
      title: copy.title,
      subtitle: copy.subtitle,
      contentClassName: "max-w-5xl",
    });
  }, [phase, copy, pricingModel.copy.pricingLead, onShellChange]);

  const canGoNext = useMemo(() => {
    if (phase === "general") return isGeneralStepValid(profile);
    if (phase === "interventions") return isInterventionsStepValid(profile);
    return true;
  }, [phase, profile]);

  const selectEssentialPlan = useCallback(() => {
    setDraftPlan("FREE");
    patchProfile({ plan: "FREE" });
    setPhase("general");
  }, [patchProfile]);

  const selectProPlan = useCallback(
    (billing: ProBillingPeriod) => {
      setDraftPlan("PRO");
      setProBillingPeriod(billing);
      patchProfile({ plan: "PRO" });
      if (typeof window !== "undefined") {
        window.history.replaceState(
          null,
          "",
          onboardingPath(lang, { plan: "pro", billing }),
        );
      }
      setProWizardActive(true);
    },
    [lang, patchProfile],
  );

  if (proWizardActive) {
    return (
      <ProOnboardingWizard
        lang={lang}
        copy={copy}
        vitrineCopy={vitrineCopy}
        initialProfile={isProIntent ? undefined : profile}
        initialServices={isProIntent ? undefined : services}
        initialBillingPeriod={proBillingPeriod}
        onCelebrationChange={onCelebrationChange}
      />
    );
  }

  const goBack = () => {
    if (phase === "general" && showPlanStep) setPhase("plan");
    else if (phase === "interventions") setPhase("general");
    else if (phase === "slug") setPhase("interventions");
    else if (phase === "visual") setPhase("slug");
  };

  const goNext = () => {
    if (phase === "general") {
      const errors = getGeneralStepErrors(profile, copy);
      if (Object.keys(errors).length > 0) {
        setGeneralErrors(errors);
        return;
      }
      setGeneralErrors({});
      setPhase("interventions");
      return;
    }
    if (phase === "interventions") {
      if (!isInterventionsStepValid(profile)) {
        if (profile.metierKey === "") {
          setInterventionError(copy.errors.interventions.metierKey);
        } else {
          setInterventionError(copy.errors.interventions.presentationRequired);
        }
        return;
      }
      setInterventionError(null);
      setPhase("slug");
    }
  };

  const finalizePlan = async (plan: OnboardingPlan) => {
    if (!profile.pageSlugConfirmed || !validatePageSlug(profile.pageSlug).ok) {
      setPhase("slug");
      return;
    }

    setCreating(true);
    setPublishError(null);
    patchProfile({ plan });
    setDraftPlan(plan);

    if (plan === "PRO") {
      setCreating(false);
      setProWizardActive(true);
      return;
    }

    const profileToPublish = { ...profile, plan };
    const result = await publishOnboardingProfile(profileToPublish, services);
    setCreating(false);

    if (!result.ok) {
      setPublishError(result.message);
      return;
    }

    setPhase("complete");
  };

  if (phase === "complete") {
    return <OnboardingCompleteStep copy={copy} lang={lang} />;
  }

  if (phase === "plan") {
    return (
      <OnboardingPlanSelectionStep
        model={pricingModel}
        locale={lang}
        onSelectEssential={selectEssentialPlan}
        onSelectPro={selectProPlan}
      />
    );
  }

  if (phase === "slug") {
    return (
      <OnboardingPageSlugStep
        copy={copy}
        locale={lang}
        profile={profile}
        onChange={patchProfile}
        onConfirm={() => setPhase("visual")}
      />
    );
  }

  return (
    <div>
      <OnboardingPlanBadge
        plan={draftPlan}
        copy={copy}
        locked={isProIntent}
        onPlanChange={(next) => {
          if (isProIntent) return;
          if (next === "PRO") {
            setProfile((prev) => ({ ...prev, plan: "PRO" }));
            setDraftPlan("PRO");
            setProBillingPeriod("monthly");
            setProWizardActive(true);
            return;
          }
          setDraftPlan(next);
          patchProfile({ plan: next });
        }}
      />

      <OnboardingProgress
        current={progressCurrent}
        total={STEPS.length}
        label={formatStepLabel(copy.stepLabel, progressCurrent, STEPS.length)}
      />

      {phase === "general" ? (
        <OnboardingGeneralStep
          copy={copy}
          locale={lang}
          profile={profile}
          errors={generalErrors}
          onChange={patchProfile}
        />
      ) : null}

      {phase === "interventions" ? (
        <>
          {interventionError ? (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {interventionError}
            </p>
          ) : null}
          <OnboardingInterventionsStep
            copy={copy}
            locale={lang}
            profile={profile}
            services={services}
            onProfileChange={patchProfile}
            onServicesChange={setServices}
          />
        </>
      ) : null}

      {phase === "visual" ? (
        <>
          {publishError ? (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {publishError}
            </p>
          ) : null}
          <OnboardingVisualStep
            copy={copy}
            vitrineCopy={vitrineCopy}
            locale={lang}
            profile={profile}
            services={services}
            onChange={patchProfile}
            onCreatePage={() => void finalizePlan(draftPlan)}
          />
        </>
      ) : null}

      <div className="mt-6 flex gap-3">
        {phase !== "general" || showPlanStep ? (
          <LandingCta
            type="button"
            variant="secondary"
            onClick={goBack}
            disabled={creating}
            className="flex-1 justify-center disabled:opacity-50"
          >
            {copy.back}
          </LandingCta>
        ) : null}
        {phase !== "visual" ? (
          <LandingCta
            type="button"
            variant="peach"
            onClick={goNext}
            disabled={!canGoNext || creating}
            className="flex-1 justify-center disabled:opacity-50"
          >
            {copy.next}
          </LandingCta>
        ) : null}
      </div>

      {phase === "general" && !showPlanStep ? (
        <p className="mt-6 text-center text-xs text-neutral-400">
          <Link href={authPath(lang, "login")} className="underline-offset-2 hover:underline">
            ← {copy.back}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
