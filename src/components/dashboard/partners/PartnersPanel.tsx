"use client";

import type { Profile } from "@/domain/profile";
import { PartnersSection } from "@/components/dashboard/vitrine/PartnersSection";
import { TeamSection } from "@/components/dashboard/account/TeamSection";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";

type PartnersPanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function PartnersPanel({ profile, copy, locale }: PartnersPanelProps) {
  const pro = resolveCraftlinkPlan(profile.plan_tier) === "PRO";

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
          {copy.tabs.partners}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{copy.partners.subtitle}</p>
      </header>
      <PartnersSection pro={pro} copy={copy} locale={locale} />
      <TeamSection copy={copy} />
    </section>
  );
}
