"use client";

import { useEffect, useMemo } from "react";
import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import { authLabelClassName } from "@/components/auth/authFormStyles";
import { ImageUploadZone } from "@/components/onboarding/ImageUploadZone";
import { OnboardingVitrinePreview } from "@/components/onboarding/OnboardingVitrinePreview";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  buildPublicPageAbsoluteUrl,
  buildPublicPageDisplayUrl,
  publicPageSlugPrefix,
} from "@/lib/onboarding/publicPageUrl";
import { PublicPageUrlWithCopy } from "@/components/ui/PublicPageUrlWithCopy";
import {
  buildOnboardingPreviewProps,
  previewFontFamily,
} from "@/lib/onboarding/buildPreviewPage";
import { applyBrandColorFromImageUrl } from "@/lib/onboarding/applyBrandFromImage";
import {
  buildGoogleFontsHref,
  COLOR_PRESETS,
  normalizeAccentColor,
  ONBOARDING_FONTS,
  type OnboardingFontId,
} from "@/lib/onboarding/onboardingFonts";

type OnboardingVisualStepProps = {
  copy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  locale: Locale;
  profile: OnboardingProfileDraft;
  services: OnboardingService[];
  certifications?: string[];
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
  onCreatePage?: () => void;
  showCreatePageButton?: boolean;
};

export function OnboardingVisualStep({
  copy,
  vitrineCopy,
  locale,
  profile,
  services,
  certifications = [],
  onChange,
  onCreatePage,
  showCreatePageButton = true,
}: OnboardingVisualStepProps) {
  const v = copy.visual;

  useEffect(() => {
    const href = buildGoogleFontsHref(ONBOARDING_FONTS.map((f) => f.id));
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const patchVisual = (patch: Partial<OnboardingProfileDraft["visual"]>) => {
    onChange({ visual: { ...profile.visual, ...patch } });
  };

  const handleAvatarChange = async (url: string | null) => {
    patchVisual({ avatarPreviewUrl: url });
    if (url) {
      const brand = await applyBrandColorFromImageUrl(url);
      patchVisual({
        avatarPreviewUrl: url,
        accentColor: normalizeAccentColor(brand),
      });
    }
  };

  const previewProps = useMemo(
    () =>
      buildOnboardingPreviewProps(profile, profile.plan, services, locale, vitrineCopy, {
        pricePrefix: copy.services.pricePrefix,
        priceSuffixEur: copy.services.priceSuffixEur,
        priceSuffixUsd: copy.services.priceSuffixUsd,
        surDevis: copy.publicServices.surDevis,
        aboutTitle: copy.interventions.aboutLabel,
      }, { certifications }),
    [profile, services, locale, vitrineCopy, copy, certifications],
  );

  return (
    <div
      className="space-y-6"
      style={{ ["--primary-color" as string]: profile.visual.accentColor }}
    >
      <div>
        <h2 className="text-lg font-bold text-black">{v.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">{v.subtitle}</p>
        {profile.pageSlugConfirmed && profile.pageSlug ? (
          <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-center text-sm">
              <span className="text-neutral-500">{publicPageSlugPrefix()}</span>
              <span className="font-bold text-neutral-900">{profile.pageSlug}</span>
            </p>
            <PublicPageUrlWithCopy
              displayUrl={buildPublicPageDisplayUrl(profile.pageSlug)}
              copyText={buildPublicPageAbsoluteUrl(profile.pageSlug)}
              copyAriaLabel={copy.pro.copyPageUrl}
              copiedLabel={copy.pro.pageUrlCopied}
              className="mt-2"
              urlClassName="text-xs text-neutral-500"
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <ImageUploadZone
            label={v.avatarLabel}
            hint={v.uploadHint}
            previewUrl={profile.visual.avatarPreviewUrl}
            errorTypeLabel={v.errorType}
            errorSizeLabel={v.errorSize}
            aspectClass="aspect-square max-h-36"
            onChange={(url) => void handleAvatarChange(url)}
          />

          <ImageUploadZone
            label={v.bannerLabel}
            hint={v.uploadHint}
            previewUrl={profile.visual.bannerPreviewUrl}
            errorTypeLabel={v.errorType}
            errorSizeLabel={v.errorSize}
            aspectClass="aspect-[3/1]"
            onChange={(url) => patchVisual({ bannerPreviewUrl: url })}
          />

          <div>
            <p className={authLabelClassName}>{v.fontLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ONBOARDING_FONTS.map((font) => {
                const selected = profile.visual.fontId === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => patchVisual({ fontId: font.id as OnboardingFontId })}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      selected
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    }`}
                    style={{ fontFamily: font.family }}
                  >
                    {font.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className={authLabelClassName}>{v.colorLabel}</p>
            <p className="mt-0.5 text-xs text-neutral-600">{v.colorHint}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={`devis-${color}`}
                  type="button"
                  aria-label={color}
                  onClick={() => patchVisual({ accentColor: normalizeAccentColor(color) })}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    profile.visual.accentColor === color
                      ? "border-black scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={
                  profile.visual.accentColor.startsWith("#")
                    ? profile.visual.accentColor
                    : "#9a8468"
                }
                onChange={(e) => patchVisual({ accentColor: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded-lg border border-neutral-200"
                aria-label={v.colorPickerLabel}
              />
            </div>
          </div>

          <div>
            <p className={authLabelClassName}>{v.secondaryColorLabel}</p>
            <p className="mt-0.5 text-xs text-neutral-600">{v.secondaryColorHint}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={`secondary-${color}`}
                  type="button"
                  aria-label={color}
                  onClick={() =>
                    patchVisual({ secondaryButtonColor: normalizeAccentColor(color) })
                  }
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    (profile.visual.secondaryButtonColor || profile.visual.accentColor) ===
                    color
                      ? "border-black scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={
                  (profile.visual.secondaryButtonColor || profile.visual.accentColor).startsWith(
                    "#",
                  )
                    ? profile.visual.secondaryButtonColor || profile.visual.accentColor
                    : "#9a8468"
                }
                onChange={(e) => patchVisual({ secondaryButtonColor: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded-lg border border-neutral-200"
                aria-label={v.secondaryColorLabel}
              />
            </div>
          </div>

          <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-600">
            {v.portfolioLaterHint}
          </p>
        </div>

        <OnboardingVitrinePreview
          previewProps={previewProps}
          fontFamily={previewFontFamily(profile.visual.fontId)}
          title={v.previewTitle}
          hint={v.previewHint}
        />
      </div>

      {showCreatePageButton && onCreatePage ? (
        <LandingCta type="button" variant="primary" onClick={onCreatePage} className="w-full justify-center">
          {v.createPage}
        </LandingCta>
      ) : null}
    </div>
  );
}
