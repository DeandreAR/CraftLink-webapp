"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import { OnboardingVitrinePreview } from "@/components/onboarding/OnboardingVitrinePreview";
import { ProEditableFieldsChecklist } from "@/components/onboarding/pro/ProEditableFieldsChecklist";
import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  proCheckoutCancelPath,
  proCheckoutSuccessPath,
  type ProBillingPeriod,
} from "@/lib/auth/paths";
import type { StripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";
import {
  buildPublicPageDisplayUrl,
  PUBLIC_PAGE_HOST,
} from "@/lib/onboarding/publicPageUrl";
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
  priceKey: StripeCheckoutPriceKey;
  billingPeriod: ProBillingPeriod;
  onCheckoutError: (message: string) => void;
  onBeforeCheckout: () => Promise<boolean>;
  onEdit: () => void;
  onEditSlug: () => void;
};

export function OnboardingProValidateStep({
  copy,
  vitrineCopy,
  locale,
  profile,
  services,
  publishing,
  publishError,
  priceKey,
  billingPeriod,
  onCheckoutError,
  onBeforeCheckout,
  onEdit,
  onEditSlug,
}: OnboardingProValidateStepProps) {
  const p = copy.pro;
  const publicUrl = buildPublicPageDisplayUrl(profile.pageSlug);
  const slugSegment = profile.pageSlug.trim();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex min-h-dvh flex-col bg-neutral-100"
      style={{ ["--primary-color" as string]: profile.visual.accentColor }}
    >
      <header className="shrink-0 border-b-2 border-[#EFA188]/60 bg-gradient-to-b from-[#EFA188]/15 via-white to-white px-4 py-3 sm:px-6">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          {p.slugYourUrl}
        </p>
        <div className="mx-auto mt-2 max-w-xl rounded-[20px] border border-[#EFA188]/40 bg-white px-4 py-3 text-center shadow-[0_8px_28px_rgba(239,161,136,0.18)]">
          <p className="break-all text-base font-extrabold leading-snug tracking-tight text-neutral-900 sm:text-xl">
            <span className="font-semibold text-neutral-400">{PUBLIC_PAGE_HOST}/</span>
            <span className="text-[#c45c3e]">{slugSegment}</span>
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">{publicUrl}</p>
        </div>
        <button
          type="button"
          onClick={onEditSlug}
          className="mx-auto mt-2 block text-sm font-medium text-[#c45c3e] underline-offset-2 hover:underline"
        >
          {p.slugEditLink}
        </button>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-6">
        <OnboardingVitrinePreview
          previewProps={previewProps}
          fontFamily={fontFamily}
          title=""
          variant="compact"
          interactive
          className="mx-auto"
        />
      </main>

      <footer
        className="shrink-0 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] sm:px-6"
        role="region"
        aria-label={p.validateBanner}
      >
        <p className="text-center text-sm font-semibold text-neutral-900">
          {p.validateBanner}
        </p>

        <ProEditableFieldsChecklist copy={copy} className="mx-auto mt-3 max-w-xl" />

        {publishError ? (
          <p className="mx-auto mt-2 max-w-xl text-center text-xs text-red-600" role="alert">
            {publishError}
          </p>
        ) : null}

        <div className="mx-auto mt-3 flex max-w-xl flex-col gap-2 sm:flex-row sm:justify-center">
          <StripeCheckoutButton
            priceKey={priceKey}
            locale={locale}
            successPath={proCheckoutSuccessPath(locale, billingPeriod)}
            cancelPath={proCheckoutCancelPath(locale, billingPeriod)}
            disabled={publishing}
            onBeforeCheckout={onBeforeCheckout}
            onError={onCheckoutError}
            className="w-full justify-center sm:min-w-[200px] sm:flex-1"
          >
            {publishing ? p.publishing : p.validateYes}
          </StripeCheckoutButton>
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
      </footer>
    </div>,
    document.body,
  );
}
