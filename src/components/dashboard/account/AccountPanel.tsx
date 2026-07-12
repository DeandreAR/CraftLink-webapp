"use client";

import type { Profile } from "@/domain/profile";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { DeleteAccountSection } from "@/components/dashboard/account/DeleteAccountSection";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type AccountPanelProps = {
  profile: Profile;
  billing: SubscriptionBillingSnapshot | null;
  copy: DashboardDictionary;
  locale: Locale;
};

export function AccountPanel({ profile, billing, copy, locale }: AccountPanelProps) {
  return (
    <section className="space-y-6">
      <DashboardPageHeader
        title={copy.account.title}
        subtitle={copy.account.subtitle}
      />
      <BillingSection
        planTier={profile.plan_tier}
        billing={billing}
        copy={copy}
        locale={locale}
      />
      <DeleteAccountSection copy={copy} locale={locale} />
    </section>
  );
}
