"use client";

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

  const urgencyBlock = (
    <UrgencyMetierSetting profile={profile} copy={copy} locale={locale} />
  );

  const editorBlock = (
    <div className="db-profile-section db-profile-section--editor p-6 md:p-8">
      <h3 className="text-base font-black text-[#212129] max-md:text-sm">{p.editorTitle}</h3>
      <p className="mt-1 text-sm text-[#5b6478] max-md:hidden">{p.editorSubtitle}</p>
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
      <h3 className="text-base font-black text-[#212129] max-md:text-sm">
        {copy.vitrine.subTabs.qr}
      </h3>
      <div className="mt-3 md:mt-4">
        <QrCodeVanModule slug={profile.page_slug} copy={copy} />
      </div>
    </div>
  );

  const billingBlock = (
    <div className="db-profile-section db-profile-section--billing p-6 md:p-8">
      <BillingSection
        planTier={profile.plan_tier}
        billing={billing}
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
        sections={[
          { id: "urgency", label: p.mobileSections.urgency, content: urgencyBlock },
          { id: "editor", label: p.mobileSections.editor, content: editorBlock },
          { id: "qr", label: p.mobileSections.qr, content: qrBlock },
          { id: "billing", label: p.mobileSections.billing, content: billingBlock },
          { id: "account", label: p.mobileSections.account, content: deleteBlock },
        ]}
      />

      <div className="hidden space-y-6 md:block">
        {urgencyBlock}
        {editorBlock}
        {qrBlock}
        {billingBlock}
        {deleteBlock}
      </div>
    </section>
  );
}
