"use client";

import { useMemo } from "react";
import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import { LinkInBioPage } from "@/components/vitrine/LinkInBioPage";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  buildOnboardingPreviewProps,
  previewFontFamily,
} from "@/lib/onboarding/buildPreviewPage";

type OnboardingProValidateStepProps = {
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  locale: Locale;
  profile: OnboardingProfileDraft;
  services: OnboardingService[];
  publishing: boolean;
  publishError: string | null;
  onPublish: () => void;
  onEdit: () => void;
};

export function OnboardingProValidateStep({
  copy,
  vitrineCopy,
  locale,
  profile,
  services,
  publishing,
  publishError,
  onPublish,
  onEdit,
}: OnboardingProValidateStepProps) {
  const p = copy.pro;

  const previewProps = useMemo(
    () =>
      buildOnboardingPreviewProps(profile, "PRO", services, locale, vitrineCopy, {
        pricePrefix: copy.services.pricePrefix,
        priceSuffixEur: copy.services.priceSuffixEur,
        priceSuffixUsd: copy.services.priceSuffixUsd,
        surDevis: copy.publicServices.surDevis,
        aboutTitle: copy.interventions.aboutLabel,
      }),
    [profile, services, locale, vitrineCopy, copy],
  );

  const fontFamily = previewFontFamily(profile.visual.fontId);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-neutral-200">
      <div className="flex-1 overflow-y-auto pb-36 pt-4">
        <div
          className="mx-auto w-full max-w-md px-2"
          style={{ fontFamily, ["--primary-color" as string]: profile.visual.accentColor }}
        >
          <LinkInBioPage {...previewProps} embedded />
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-6"
        role="region"
        aria-label={p.validateBanner}
      >
        <p className="text-center text-sm font-semibold text-neutral-900 sm:text-base">
          {p.validateBanner}
        </p>
        {publishError ? (
          <p className="mt-2 text-center text-xs text-red-600" role="alert">
            {publishError}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <GlowButton
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className="w-full justify-center sm:min-w-[200px] sm:flex-1"
          >
            {publishing ? p.publishing : p.validateYes}
          </GlowButton>
          <GlowButton
            type="button"
            variant="secondary"
            onClick={onEdit}
            disabled={publishing}
            className="w-full justify-center sm:min-w-[160px] sm:flex-1"
          >
            {p.validateNo}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
