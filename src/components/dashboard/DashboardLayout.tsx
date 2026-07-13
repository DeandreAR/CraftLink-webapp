"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { InboxPanel } from "@/components/dashboard/inbox/InboxPanel";
import { OrganizationPanel } from "@/components/dashboard/organize/OrganizationPanel";
import { PartnersPanel } from "@/components/dashboard/partners/PartnersPanel";
import { ArtisanProfilePanel } from "@/components/dashboard/profile/ArtisanProfilePanel";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";

export type DashboardTab = "inbox" | "organize" | "profile" | "partners";

type DashboardLayoutProps = {
  session: WorkspaceSession;
  billing: SubscriptionBillingSnapshot | null;
  copy: DashboardDictionary;
  onboardingCopy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  locale: Locale;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
  initialPartnershipRequests: DashboardPartnershipRequest[];
  initialPartnershipLoadError: string | null;
};

const TAB_MOTION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

export function DashboardLayout({
  session,
  billing,
  copy,
  onboardingCopy,
  vitrineCopy,
  locale,
  initialLeads,
  initialLoadError,
  initialPartnershipRequests,
  initialPartnershipLoadError,
}: DashboardLayoutProps) {
  const [tab, setTab] = useState<DashboardTab>("inbox");
  const { profile } = session;
  const home = locale === defaultLocale ? "/" : `/${locale}`;

  return (
    <div className="dashboard-page relative flex min-h-[100dvh] text-[#212129]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#EFA188]/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#D6BCFA]/12 blur-3xl" />
      </div>

      <DashboardSidebar
        active={tab}
        onChange={setTab}
        copy={copy}
        locale={locale}
        businessName={profile.full_name}
      />

      <div className="relative flex min-h-[100dvh] min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/8 bg-[#1a1d24] px-4 py-3 md:hidden">
          <Link href={home} className="inline-flex items-center" aria-label="CraftLink">
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="block h-6 w-auto max-w-none brightness-0 invert"
              decoding="async"
            />
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              className="rounded-full border border-[#EFA188]/45 bg-[#EFA188]/20 px-3 py-1.5 text-[11px] font-bold text-white transition active:scale-[0.98] hover:bg-[#EFA188]/35"
            >
              {copy.signOut}
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-x-auto p-4 pb-[5rem] md:p-6 md:pb-8 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div key={tab} {...TAB_MOTION}>
                {tab === "inbox" ? (
                  <InboxPanel
                    profile={profile}
                    copy={copy}
                    locale={locale}
                    initialLeads={initialLeads}
                    initialLoadError={initialLoadError}
                  />
                ) : null}
                {tab === "organize" ? (
                  <OrganizationPanel
                    profile={profile}
                    copy={copy}
                    locale={locale}
                    initialLeads={initialLeads}
                    initialLoadError={initialLoadError}
                  />
                ) : null}
                {tab === "profile" ? (
                  <ArtisanProfilePanel
                    profile={profile}
                    billing={billing}
                    copy={copy}
                    onboardingCopy={onboardingCopy}
                    vitrineCopy={vitrineCopy}
                    locale={locale}
                  />
                ) : null}
                {tab === "partners" ? (
                  <PartnersPanel
                    profile={profile}
                    copy={copy}
                    locale={locale}
                    initialRequests={initialPartnershipRequests}
                    initialLoadError={initialPartnershipLoadError}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <DashboardBottomNav active={tab} onChange={setTab} copy={copy} />
      </div>
    </div>
  );
}
