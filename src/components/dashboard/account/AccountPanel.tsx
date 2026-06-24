"use client";

import type { Profile } from "@/domain/profile";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { TeamSection } from "@/components/dashboard/account/TeamSection";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type AccountPanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function AccountPanel({ profile, copy, locale }: AccountPanelProps) {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-black md:text-[1.75rem]">
          {copy.billing.title}
        </h1>
      </header>
      <BillingSection planTier={profile.plan_tier} copy={copy} locale={locale} />
      <TeamSection copy={copy} />
    </section>
  );
}
