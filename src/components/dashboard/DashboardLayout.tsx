"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { AccountPanel } from "@/components/dashboard/account/AccountPanel";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { LeadsPanel } from "@/components/dashboard/leads/LeadsPanel";
import { PartnersPanel } from "@/components/dashboard/partners/PartnersPanel";
import { VitrinePanel } from "@/components/dashboard/vitrine/VitrinePanel";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";

export type DashboardTab = "leads" | "vitrine" | "partners" | "account";

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
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
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
  const [tab, setTab] = useState<DashboardTab>("leads");
  const { profile } = session;

  return (
    <div className="flex min-h-screen bg-[#f4f5f7] text-slate-900">
      <DashboardSidebar
        active={tab}
        onChange={setTab}
        copy={copy}
        locale={locale}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              className="rounded-full border border-[#EFA188]/45 bg-[#EFA188]/20 px-3 py-1.5 text-[11px] font-bold text-[#212129] transition active:scale-[0.98] hover:bg-[#EFA188]/35"
            >
              {copy.signOut}
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-x-auto px-4 py-5 pb-[4.5rem] md:px-8 md:py-8 md:pb-8">
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div key={tab} {...TAB_MOTION}>
                {tab === "leads" ? (
                  <LeadsPanel
                    profile={profile}
                    copy={copy}
                    locale={locale}
                    initialLeads={initialLeads}
                    initialLoadError={initialLoadError}
                  />
                ) : null}
                {tab === "vitrine" ? (
                  <VitrinePanel
                    profile={profile}
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
                {tab === "account" ? (
                  <AccountPanel
                    profile={profile}
                    billing={billing}
                    copy={copy}
                    locale={locale}
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
