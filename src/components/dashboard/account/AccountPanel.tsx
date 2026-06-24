"use client";

import type { Profile } from "@/domain/profile";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { DeleteAccountSection } from "@/components/dashboard/account/DeleteAccountSection";
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
          {copy.account.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{copy.account.subtitle}</p>
      </header>
      <BillingSection planTier={profile.plan_tier} copy={copy} locale={locale} />
      <TeamSection copy={copy} />
      <DeleteAccountSection copy={copy} locale={locale} />
    </section>
  );
}
