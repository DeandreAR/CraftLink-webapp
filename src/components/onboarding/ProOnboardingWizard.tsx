"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useReducer, useState, type Dispatch } from "react";
import {
  defaultOnboardingProfile,
  defaultVisualDraft,
  type OnboardingProfileDraft,
  type OnboardingService,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import { OnboardingCompleteStep } from "@/components/onboarding/OnboardingCompleteStep";
import { OnboardingPlanBadge } from "@/components/onboarding/OnboardingPlanBadge";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import {
  getGeneralStepErrors,
  isGeneralStepValid,
  OnboardingGeneralStep,
} from "@/components/onboarding/steps/OnboardingGeneralStep";
import {
  isInterventionsStepValid,
  OnboardingInterventionsStep,
} from "@/components/onboarding/steps/OnboardingInterventionsStep";
import { OnboardingProChoiceStep } from "@/components/onboarding/steps/OnboardingProChoiceStep";
import { OnboardingPageSlugStep } from "@/components/onboarding/steps/OnboardingPageSlugStep";
import { OnboardingProGapStep } from "@/components/onboarding/steps/OnboardingProGapStep";
import { OnboardingProValidateStep } from "@/components/onboarding/steps/OnboardingProValidateStep";
import { OnboardingVisualStep } from "@/components/onboarding/steps/OnboardingVisualStep";
import { GlowButton } from "@/components/ui/GlowButton";
import { authPath } from "@/lib/auth/paths";
import { resolveNextPhaseAfterProfileUpdate } from "@/lib/onboarding/proOnboardingFlow";
import {
  createProOnboardingState,
  MANUAL_PRO_PHASES,
  proOnboardingReducer,
  type ProOnboardingPhase,
} from "@/lib/onboarding/proOnboardingReducer";
import {
  getMissingProRequiredFields,
  isProProfilePublishable,
} from "@/lib/onboarding/proRequiredFields";
import { suggestPageSlugFromName, validatePageSlug } from "@/lib/onboarding/pageSlug";
import { saveOnboardingDraft } from "@/lib/onboarding/publishOnboardingProfile";
import {
  runProImportPipeline,
  type ProImportPipelineResult,
} from "@/lib/onboarding/proImport/runProImport";
import type { GeneralStepErrors } from "@/domain/onboarding";

type ProOnboardingWizardProps = {
  lang: Locale;
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  initialProfile?: OnboardingProfileDraft;
  initialServices?: OnboardingService[];
  /** Démarre directement sur le choix auto/manuel (défaut) ou sur l’édition manuelle. */
  startPhase?: ProOnboardingPhase;
};

function formatStepLabel(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

function goToNextProPhase(
  profile: OnboardingProfileDraft,
  dispatch: Dispatch<Parameters<typeof proOnboardingReducer>[1]>,
) {
  const next = resolveNextPhaseAfterProfileUpdate(profile);
  if (next === "gap") {
    dispatch({
      type: "SET_GAP_FIELDS",
      fields: getMissingProRequiredFields(profile),
    });
  }
  dispatch({ type: "SET_PHASE", phase: next });
}

export function ProOnboardingWizard({
  lang,
  copy,
  vitrineCopy,
  initialProfile,
  initialServices,
  startPhase = "choice",
}: ProOnboardingWizardProps) {
  const searchParams = useSearchParams();
  const stripeCheckoutSuccess = searchParams.get("stripe") === "success";
  const billingPeriod = searchParams.get("billing") === "annual" ? "annual" : "monthly";
  const checkoutPriceKey = billingPeriod === "annual" ? "pro_annual" : "pro_monthly";

  const [state, dispatch] = useReducer(
    proOnboardingReducer,
    undefined,
    () =>
      createProOnboardingState({
        profile: initialProfile,
        services: initialServices,
        phase: stripeCheckoutSuccess ? "complete" : startPhase,
      }),
  );

  const [generalErrors, setGeneralErrors] = useState<GeneralStepErrors>({});
  const [interventionError, setInterventionError] = useState<string | null>(null);

  const { phase, profile, services } = state;

  const patchProfile = useCallback(
    (patch: Partial<OnboardingProfileDraft>) => {
      const nextPatch = { ...patch };
      if (
        patch.businessName &&
        !patch.pageSlug &&
        !profile.pageSlugConfirmed &&
        !profile.pageSlug.trim()
      ) {
        const suggested = suggestPageSlugFromName(patch.businessName);
        if (suggested) nextPatch.pageSlug = suggested;
      }
      dispatch({ type: "PATCH_PROFILE", patch: nextPatch });
    },
    [profile.pageSlug, profile.pageSlugConfirmed],
  );

  const manualStepIndex = MANUAL_PRO_PHASES.indexOf(phase);
  const showManualProgress = manualStepIndex >= 0;

  const handleImportSuccess = (result: ProImportPipelineResult) => {
    dispatch({ type: "SET_IMPORT_ERROR", error: null });
    dispatch({
      type: "SET_MAPPED_IMPORT",
      mapped: result.mapped,
      brandColor: result.brandColor,
    });
    const merged: OnboardingProfileDraft = {
      ...defaultOnboardingProfile("PRO"),
      ...profile,
      ...result.profile,
      plan: "PRO",
      visual: {
        ...defaultVisualDraft(),
        ...profile.visual,
        ...(result.profile.visual ?? {}),
        accentColor: result.brandColor,
      },
    };
    dispatch({ type: "PATCH_PROFILE", patch: merged });
    if (result.services.length > 0) {
      dispatch({ type: "SET_SERVICES", services: result.services });
    }
    dispatch({ type: "SET_GAP_FIELDS", fields: result.missingFields });
    goToNextProPhase(merged, dispatch);
  };

  const handleGapContinue = () => {
    if (!isProProfilePublishable(profile)) {
      dispatch({
        type: "SET_GAP_FIELDS",
        fields: getMissingProRequiredFields(profile),
      });
      return;
    }
    goToNextProPhase(profile, dispatch);
  };

  const handleBeforeCheckout = async () => {
    if (!profile.pageSlugConfirmed || !validatePageSlug(profile.pageSlug).ok) {
      dispatch({ type: "SET_PHASE", phase: "slug" });
      return false;
    }
    dispatch({ type: "SET_PUBLISHING", publishing: true });
    dispatch({ type: "SET_PUBLISH_ERROR", error: null });
    const result = await saveOnboardingDraft(profile, services);
    dispatch({ type: "SET_PUBLISHING", publishing: false });
    if (!result.ok) {
      dispatch({ type: "SET_PUBLISH_ERROR", error: result.message });
      return false;
    }
    return true;
  };

  const goManualNext = () => {
    if (phase === "manual-general") {
      const errors = getGeneralStepErrors(profile, copy, { requirePhone: true });
      if (Object.keys(errors).length > 0) {
        setGeneralErrors(errors);
        return;
      }
      setGeneralErrors({});
      dispatch({ type: "SET_PHASE", phase: "manual-interventions" });
      return;
    }
    if (phase === "manual-interventions") {
      if (!isInterventionsStepValid(profile)) {
        setInterventionError(copy.errors.interventions.presentationRequired);
        return;
      }
      setInterventionError(null);
      dispatch({ type: "SET_PHASE", phase: "manual-visual" });
    }
  };

  const goManualBack = () => {
    if (phase === "manual-interventions") dispatch({ type: "SET_PHASE", phase: "manual-general" });
    else if (phase === "manual-visual") dispatch({ type: "SET_PHASE", phase: "manual-interventions" });
  };

  if (phase === "complete") {
    return (
      <OnboardingCompleteStep copy={copy} lang={lang} pageSlug={profile.pageSlug} />
    );
  }

  if (phase === "slug") {
    return (
      <OnboardingPageSlugStep
        copy={copy}
        locale={lang}
        profile={profile}
        onChange={patchProfile}
        onConfirm={() => dispatch({ type: "SET_PHASE", phase: "validate" })}
      />
    );
  }

  if (phase === "validate") {
    return (
      <OnboardingProValidateStep
        copy={copy}
        vitrineCopy={vitrineCopy}
        locale={lang}
        profile={profile}
        services={services}
        publishing={state.publishing}
        publishError={state.publishError}
        priceKey={checkoutPriceKey}
        billingPeriod={billingPeriod}
        onBeforeCheckout={handleBeforeCheckout}
        onCheckoutError={(message) =>
          dispatch({ type: "SET_PUBLISH_ERROR", error: message })
        }
        onEdit={() => dispatch({ type: "SET_PHASE", phase: "manual-general" })}
        onEditSlug={() => {
          dispatch({
            type: "PATCH_PROFILE",
            patch: { pageSlugConfirmed: false },
          });
          dispatch({ type: "SET_PHASE", phase: "slug" });
        }}
      />
    );
  }

  return (
    <div style={{ ["--primary-color" as string]: profile.visual.accentColor }}>
      <OnboardingPlanBadge plan="PRO" copy={copy} locked onPlanChange={() => {}} />

      {state.importNotice && showManualProgress ? (
        <div
          role="status"
          className="mb-4 rounded-[20px] border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950"
        >
          {state.importNotice}
        </div>
      ) : null}

      {showManualProgress ? (
        <OnboardingProgress
          current={manualStepIndex + 1}
          total={MANUAL_PRO_PHASES.length}
          label={formatStepLabel(copy.stepLabel, manualStepIndex + 1, MANUAL_PRO_PHASES.length)}
        />
      ) : null}

      {phase === "choice" ? (
        <>
          {state.importError ? (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {state.importError}
            </p>
          ) : null}
          <OnboardingProChoiceStep
            copy={copy}
            onStartManual={() => {
              dispatch({ type: "SET_IMPORT_NOTICE", notice: null });
              dispatch({
                type: "SET_MAPPED_IMPORT",
                mapped: null,
                brandColor: null,
              });
              dispatch({ type: "SET_PHASE", phase: "manual-general" });
            }}
            onImportSuccess={handleImportSuccess}
            onImportError={(message) => {
              dispatch({ type: "SET_IMPORT_ERROR", error: message });
            }}
            onImportFallbackToManual={() => {
              dispatch({ type: "SET_IMPORT_ERROR", error: null });
              dispatch({
                type: "SET_IMPORT_NOTICE",
                notice: copy.import.quotaFallbackMessage,
              });
              dispatch({
                type: "SET_MAPPED_IMPORT",
                mapped: null,
                brandColor: null,
              });
              dispatch({ type: "SET_PHASE", phase: "manual-general" });
            }}
          />
        </>
      ) : null}

      {phase === "gap" ? (
        <OnboardingProGapStep
          copy={copy}
          locale={lang}
          profile={profile}
          missingFields={state.gapFields}
          onChange={patchProfile}
          onContinue={handleGapContinue}
        />
      ) : null}

      {phase === "manual-general" ? (
        <OnboardingGeneralStep
          copy={copy}
          locale={lang}
          profile={profile}
          errors={generalErrors}
          includePhone
          onChange={patchProfile}
        />
      ) : null}

      {phase === "manual-interventions" ? (
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
            onServicesChange={(next) => dispatch({ type: "SET_SERVICES", services: next })}
          />
        </>
      ) : null}

      {phase === "manual-visual" ? (
        <OnboardingVisualStep
          copy={copy}
          vitrineCopy={vitrineCopy}
          locale={lang}
          profile={profile}
          services={services}
          onChange={patchProfile}
          onCreatePage={() => goToNextProPhase(profile, dispatch)}
        />
      ) : null}

      {showManualProgress && phase !== "manual-visual" ? (
        <div className="mt-6 flex gap-3">
          {phase !== "manual-general" ? (
            <GlowButton
              type="button"
              variant="secondary"
              onClick={goManualBack}
              className="flex-1 justify-center"
            >
              {copy.back}
            </GlowButton>
          ) : (
            <Link
              href={authPath(lang, "login")}
              className="flex flex-1 items-center justify-center text-sm text-neutral-500 underline-offset-2 hover:underline"
            >
              ← {copy.back}
            </Link>
          )}
          <GlowButton type="button" onClick={goManualNext} className="flex-1 justify-center">
            {copy.next}
          </GlowButton>
        </div>
      ) : null}
    </div>
  );
}
