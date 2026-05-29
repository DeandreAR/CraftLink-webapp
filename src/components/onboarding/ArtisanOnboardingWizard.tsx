"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { OnboardingPlanBadge } from "@/components/onboarding/OnboardingPlanBadge";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import {
  getGeneralStepErrors,
  isGeneralStepValid,
  OnboardingGeneralStep,
} from "@/components/onboarding/steps/OnboardingGeneralStep";
import { OnboardingInterventionsStep, isInterventionsStepValid } from "@/components/onboarding/steps/OnboardingInterventionsStep";
import { OnboardingProImportStep } from "@/components/onboarding/steps/OnboardingProImportStep";
import { OnboardingVisualStep } from "@/components/onboarding/steps/OnboardingVisualStep";
import { OnboardingUpsellModal } from "@/components/onboarding/OnboardingUpsellModal";
import { GlowButton } from "@/components/ui/GlowButton";
import { authPath } from "@/lib/auth/paths";

type WizardPhase = "general" | "interventions" | "visual" | "pro-import" | "complete";

const STEPS: WizardPhase[] = ["general", "interventions", "visual"];

type ArtisanOnboardingWizardProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  planIntent?: OnboardingPlanIntent;
};

function formatStepLabel(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

export function ArtisanOnboardingWizard({
  lang,
  copy,
  vitrineCopy,
  planIntent = "choice",
}: ArtisanOnboardingWizardProps) {
  const isProIntent = planIntent === "pro";
  const [phase, setPhase] = useState<WizardPhase>("general");
  const [draftPlan, setDraftPlan] = useState<OnboardingPlan>(isProIntent ? "PRO" : "FREE");
  const [profile, setProfile] = useState<OnboardingProfileDraft>(() =>
    defaultOnboardingProfile(isProIntent ? "PRO" : "FREE"),
  );
  const [services, setServices] = useState<OnboardingService[]>([]);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [generalErrors, setGeneralErrors] = useState<GeneralStepErrors>({});
  const [interventionError, setInterventionError] = useState<string | null>(null);

  const patchProfile = (patch: Partial<OnboardingProfileDraft>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
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
  };

  const stepIndex = STEPS.indexOf(phase as (typeof STEPS)[number]);
  const progressCurrent = stepIndex >= 0 ? stepIndex + 1 : STEPS.length;

  const canGoNext = useMemo(() => {
    if (phase === "general") return isGeneralStepValid(profile);
    if (phase === "interventions") return isInterventionsStepValid(profile);
    return true;
  }, [phase, profile]);

  const goBack = () => {
    if (phase === "interventions") setPhase("general");
    else if (phase === "visual") setPhase("interventions");
    else if (phase === "pro-import") setPhase("visual");
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
      setPhase("visual");
    }
  };

  const finalizePlan = async (plan: OnboardingPlan) => {
    setCreating(true);
    patchProfile({ plan });
    setDraftPlan(plan);
    await new Promise((r) => setTimeout(r, 800));
    setUpsellOpen(false);
    setCreating(false);
    if (plan === "PRO") {
      setPhase("pro-import");
    } else {
      setPhase("complete");
    }
  };

  if (phase === "complete") {
    return (
      <div className="space-y-5 text-center">
        <p className="text-4xl" aria-hidden>
          ✓
        </p>
        <h2 className="text-xl font-bold text-black">{copy.complete.title}</h2>
        <p className="text-sm text-neutral-600">{copy.complete.body}</p>
        <GlowButton href={authPath(lang, "dashboard")} className="w-full justify-center">
          {copy.complete.cta}
        </GlowButton>
      </div>
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
          setDraftPlan(next);
          patchProfile({ plan: next });
        }}
      />

      {STEPS.includes(phase as (typeof STEPS)[number]) ? (
        <OnboardingProgress
          current={progressCurrent}
          total={STEPS.length}
          label={formatStepLabel(copy.stepLabel, progressCurrent, STEPS.length)}
        />
      ) : null}

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
        <OnboardingVisualStep
          copy={copy}
          vitrineCopy={vitrineCopy}
          locale={lang}
          plan={draftPlan}
          profile={profile}
          services={services}
          onChange={patchProfile}
          onCreatePage={() => {
            if (isProIntent) {
              void finalizePlan("PRO");
            } else {
              setUpsellOpen(true);
            }
          }}
        />
      ) : null}

      {phase === "pro-import" ? (
        <OnboardingProImportStep
          copy={copy}
          profile={{ ...profile, plan: "PRO" }}
          onImported={(patch) => {
            patchProfile(patch);
            setPhase("complete");
          }}
          onManual={() => setPhase("complete")}
        />
      ) : null}

      {STEPS.includes(phase as (typeof STEPS)[number]) ? (
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
      ) : null}

      {phase === "general" ? (
        <p className="mt-6 text-center text-xs text-neutral-400">
          <Link href={authPath(lang, "signup")} className="underline-offset-2 hover:underline">
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
