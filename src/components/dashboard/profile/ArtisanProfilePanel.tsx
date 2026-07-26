"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { DeleteAccountSection } from "@/components/dashboard/account/DeleteAccountSection";
import { ProfileMobileNav } from "@/components/dashboard/profile/ProfileMobileNav";
import { UrgencyMetierSetting } from "@/components/dashboard/profile/UrgencyMetierSetting";
import { QrCodeVanModule } from "@/components/dashboard/vitrine/QrCodeVanModule";
import { VitrineEditor } from "@/components/dashboard/vitrine/VitrineEditor";
import { VoiceCaptureSetting } from "@/components/dashboard/vitrine/VoiceCaptureSetting";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { Profile } from "@/domain/profile";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { abonnementPath } from "@/lib/auth/paths";
import { hasProFeatureAccess } from "@/lib/dashboard/planAccess";
import { resolveTourSteps } from "@/lib/dashboard/resolveTourSteps";
import { OPEN_PROFILE_EDITOR_EVENT, OPEN_VITRINE_VISUAL_EVENT } from "@/lib/dashboard/vitrineTourEvents";
import { useOnboardingTour } from "@/hooks/useOnboardingTour";

type ArtisanProfilePanelProps = {
  profile: Profile;
  billing: SubscriptionBillingSnapshot | null;
  copy: DashboardDictionary;
  onboardingCopy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  locale: Locale;
};

export function ArtisanProfilePanel({
  profile,
  billing,
  copy,
  onboardingCopy,
  vitrineCopy,
  locale,
}: ArtisanProfilePanelProps) {
  const p = copy.profilePanel;

  const prepareProfileTour = useCallback(async () => {
    window.dispatchEvent(new CustomEvent(OPEN_PROFILE_EDITOR_EVENT));
    window.dispatchEvent(new CustomEvent(OPEN_VITRINE_VISUAL_EVENT));
    await new Promise((resolve) => setTimeout(resolve, 150));
  }, []);

  const isPro = hasProFeatureAccess(profile);
  const profileTourSteps = useMemo(
    () => resolveTourSteps(copy.tours.profile.steps, isPro),
    [copy.tours.profile.steps, isPro],
  );

  useOnboardingTour("profile", profileTourSteps, {
    prevLabel: copy.tours.prev,
    nextLabel: copy.tours.next,
    doneLabel: copy.tours.done,
    prepare: prepareProfileTour,
  });

  const urgencyBlock = (
    <UrgencyMetierSetting profile={profile} copy={copy} locale={locale} />
  );

  const editorBlock = (
    <div className="db-profile-section db-profile-section--editor p-6 md:p-8">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-semibold text-slate-900 max-md:text-sm">{p.editorTitle}</h3>
        <p className="mt-1 text-sm text-slate-500 max-md:hidden">{p.editorSubtitle}</p>
      </div>
      <div className="mt-4 space-y-4 md:mt-6 md:space-y-6">
        <VitrineEditor
          profile={profile}
          copy={copy}
          onboardingCopy={onboardingCopy}
          vitrineCopy={vitrineCopy}
          locale={locale}
        />
        <VoiceCaptureSetting profile={profile} copy={copy} locale={locale} />
      </div>
    </div>
  );

  const qrBlock = (
    <div className="db-profile-section db-profile-section--qr p-6 md:p-8">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-semibold text-slate-900 max-md:text-sm">
          {copy.vitrine.subTabs.qr}
        </h3>
      </div>
      <div className="mt-3 md:mt-4">
        <QrCodeVanModule slug={profile.page_slug} copy={copy} />
      </div>
    </div>
  );

  const billingBlock = (
    <div className="db-profile-section db-profile-section--billing space-y-3 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <h3 className="text-base font-semibold text-slate-900 max-md:text-sm">
          {p.mobileSections.billing}
        </h3>
        <Link
          href={abonnementPath(locale)}
          className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
        >
          {copy.billing.title} →
        </Link>
      </div>
      <BillingSection
        proAccess={profile}
        billing={billing}
        stripeCustomerId={profile.stripe_customer_id}
        copy={copy}
        locale={locale}
      />
    </div>
  );

  const deleteBlock = (
    <div className="db-profile-section db-profile-section--danger p-6 md:p-8">
      <DeleteAccountSection copy={copy} locale={locale} />
    </div>
  );

  return (
    <section className="space-y-6">
      <DashboardPageHeader
        title={p.title}
        subtitle={p.subtitle}
        compactOnMobile
      />

      <ProfileMobileNav
        ariaLabel={p.sectionsAriaLabel}
        sections={[
          { id: "urgency", label: p.mobileSections.urgency, content: urgencyBlock },
          { id: "editor", label: p.mobileSections.editor, content: editorBlock },
          { id: "qr", label: p.mobileSections.qr, content: qrBlock },
          { id: "billing", label: p.mobileSections.billing, content: billingBlock },
          { id: "account", label: p.mobileSections.account, content: deleteBlock },
        ]}
      />
    </section>
  );
}
