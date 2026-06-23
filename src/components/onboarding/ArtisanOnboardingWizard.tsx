"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { OnboardingVisualStep } from "@/components/onboarding/steps/OnboardingVisualStep";
import { OnboardingUpsellModal } from "@/components/onboarding/OnboardingUpsellModal";
import { GlowButton } from "@/components/ui/GlowButton";
import { authPath } from "@/lib/auth/paths";
import { suggestPageSlugFromName, validatePageSlug } from "@/lib/onboarding/pageSlug";
import { publishOnboardingProfile } from "@/lib/onboarding/publishOnboardingProfile";

type WizardPhase = "general" | "interventions" | "slug" | "visual" | "complete";

const STEPS: WizardPhase[] = ["general", "interventions", "slug", "visual"];

type ArtisanOnboardingWizardProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  planIntent?: OnboardingPlanIntent;
  onCelebrationChange?: (active: boolean) => void;
};

function formatStepLabel(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

export function ArtisanOnboardingWizard({
  lang,
  copy,
  vitrineCopy,
  planIntent = "choice",
  onCelebrationChange,
}: ArtisanOnboardingWizardProps) {
  const isProIntent = planIntent === "pro";
  const [proWizardActive, setProWizardActive] = useState(isProIntent);
  const [phase, setPhase] = useState<WizardPhase>("general");
  const [draftPlan, setDraftPlan] = useState<OnboardingPlan>(isProIntent ? "PRO" : "FREE");
  const [profile, setProfile] = useState<OnboardingProfileDraft>(() =>
    defaultOnboardingProfile(isProIntent ? "PRO" : "FREE"),
  );
  const [services, setServices] = useState<OnboardingService[]>([]);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [generalErrors, setGeneralErrors] = useState<GeneralStepErrors>({});
  const [interventionError, setInterventionError] = useState<string | null>(null);

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

  const stepIndex = STEPS.indexOf(phase);
  const progressCurrent = stepIndex >= 0 ? stepIndex + 1 : STEPS.length;

  useEffect(() => {
    onCelebrationChange?.(phase === "complete");
  }, [phase, onCelebrationChange]);

  const canGoNext = useMemo(() => {
    if (phase === "general") return isGeneralStepValid(profile);
    if (phase === "interventions") return isInterventionsStepValid(profile);
    return true;
  }, [phase, profile]);

  if (proWizardActive) {
    return (
      <ProOnboardingWizard
        lang={lang}
        copy={copy}
        vitrineCopy={vitrineCopy}
        initialProfile={isProIntent ? undefined : profile}
        initialServices={isProIntent ? undefined : services}
        onCelebrationChange={onCelebrationChange}
      />
    );
  }

  const goBack = () => {
    if (phase === "interventions") setPhase("general");
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
      setUpsellOpen(false);
      setPhase("slug");
      return;
    }

    setCreating(true);
    setPublishError(null);
    patchProfile({ plan });
    setDraftPlan(plan);

    if (plan === "PRO") {
      setUpsellOpen(false);
      setCreating(false);
      setProWizardActive(true);
      return;
    }

    const profileToPublish = { ...profile, plan };
    const result = await publishOnboardingProfile(profileToPublish, services);
    setCreating(false);
    setUpsellOpen(false);

    if (!result.ok) {
      setPublishError(result.message);
      return;
    }

    setPhase("complete");
  };

  if (phase === "complete") {
    return <OnboardingCompleteStep copy={copy} lang={lang} />;
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
            onCreatePage={() => setUpsellOpen(true)}
          />
        </>
      ) : null}

      <div className="mt-6 flex gap-3">
        {phase !== "general" ? (
          <GlowButton
            type="button"
            variant="secondary"
            onClick={goBack}
            className="flex-1 justify-center"
          >
            {copy.back}
          </GlowButton>
        ) : null}
        {phase !== "visual" ? (
          <GlowButton
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="flex-1 justify-center disabled:opacity-50"
          >
            {copy.next}
          </GlowButton>
        ) : null}
      </div>

      {phase === "general" ? (
        <p className="mt-6 text-center text-xs text-neutral-400">
          <Link href={authPath(lang, "login")} className="underline-offset-2 hover:underline">
            ← {copy.back}
          </Link>
        </p>
      ) : null}

      <OnboardingUpsellModal
        open={upsellOpen}
        copy={copy}
        loading={creating}
        onClose={() => !creating && setUpsellOpen(false)}
        onChoose={(plan) => void finalizePlan(plan)}
      />
    </div>
  );
}
