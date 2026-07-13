"use client";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { DeleteAccountSection } from "@/components/dashboard/account/DeleteAccountSection";
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

  return (
    <section className="space-y-6">
      <DashboardPageHeader title={p.title} subtitle={p.subtitle} />

      <UrgencyMetierSetting profile={profile} copy={copy} locale={locale} />

      <div className="db-profile-section db-profile-section--editor p-6 md:p-8">
        <h3 className="text-base font-black text-[#212129]">{p.editorTitle}</h3>
        <p className="mt-1 text-sm text-[#5b6478]">{p.editorSubtitle}</p>
        <div className="mt-6 space-y-6">
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

      <div className="db-profile-section db-profile-section--qr p-6 md:p-8">
        <h3 className="text-base font-black text-[#212129]">{copy.vitrine.subTabs.qr}</h3>
        <div className="mt-4">
          <QrCodeVanModule slug={profile.page_slug} copy={copy} />
        </div>
      </div>

      <div className="db-profile-section db-profile-section--billing p-6 md:p-8">
        <BillingSection
          planTier={profile.plan_tier}
          billing={billing}
          copy={copy}
          locale={locale}
        />
      </div>

      <div className="db-profile-section db-profile-section--danger p-6 md:p-8">
        <DeleteAccountSection copy={copy} locale={locale} />
      </div>
    </section>
  );
}
