"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { InboxPanel } from "@/components/dashboard/inbox/InboxPanel";
import { OrganizationPanel } from "@/components/dashboard/organize/OrganizationPanel";
import { PartnersPanel } from "@/components/dashboard/partners/PartnersPanel";
import { ArtisanProfilePanel } from "@/components/dashboard/profile/ArtisanProfilePanel";
import { PushNotificationsPrompt } from "@/components/pwa/PushNotificationsPrompt";
import { RegisterServiceWorker } from "@/components/pwa/RegisterServiceWorker";
import type { AudienceMetrics } from "@/domain/analytics";
import { EMPTY_AUDIENCE_METRICS } from "@/domain/analytics";
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
  initialAudienceMetrics?: AudienceMetrics;
  initialTab?: DashboardTab;
  initialLeadId?: string | null;
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
  initialAudienceMetrics = EMPTY_AUDIENCE_METRICS,
  initialTab = "inbox",
  initialLeadId = null,
}: DashboardLayoutProps) {
  const [tab, setTab] = useState<DashboardTab>(initialTab);
  const { profile } = session;
  const home = locale === defaultLocale ? "/" : `/${locale}`;

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div className="dashboard-page relative flex min-h-[100dvh] text-black">
      <RegisterServiceWorker />

      <DashboardSidebar
        active={tab}
        onChange={setTab}
        copy={copy}
        locale={locale}
        businessName={profile.full_name}
      />

      <div className="relative flex min-h-[100dvh] min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/8 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
          <Link href={home} className="inline-flex items-center" aria-label="CraftLink">
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="block h-7 w-auto max-w-none"
              decoding="async"
            />
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              className="min-h-[40px] rounded-[20px] border border-black/10 bg-white px-3.5 py-2 text-[11px] font-semibold text-black transition hover:bg-[#efa188]/10 active:scale-[0.98]"
            >
              {copy.signOut}
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 pb-[5rem] md:p-6 md:pb-8 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {tab === "inbox" ? <PushNotificationsPrompt /> : null}
            <AnimatePresence mode="wait">
              <motion.div key={tab} {...TAB_MOTION}>
                {tab === "inbox" ? (
                  <InboxPanel
                    profile={profile}
                    copy={copy}
                    locale={locale}
                    initialLeads={initialLeads}
                    initialLoadError={initialLoadError}
                    initialSelectedLeadId={initialLeadId}
                  />
                ) : null}
                {tab === "organize" ? (
                  <OrganizationPanel
                    profile={profile}
                    copy={copy}
                    locale={locale}
                    initialLeads={initialLeads}
                    initialLoadError={initialLoadError}
                    initialAudienceMetrics={initialAudienceMetrics}
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
