"use client";

import Link from "next/link";
import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { AccountPanel } from "@/components/dashboard/account/AccountPanel";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { LeadsPanel } from "@/components/dashboard/leads/LeadsPanel";
import { PartnersPanel } from "@/components/dashboard/partners/PartnersPanel";
import { VitrinePanel } from "@/components/dashboard/vitrine/VitrinePanel";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";

export type DashboardTab = "leads" | "vitrine" | "partners" | "account";

type DashboardLayoutProps = {
  session: WorkspaceSession;
  copy: DashboardDictionary;
  locale: Locale;
  initialLeads: DashboardLead[];
  initialLoadError: string | null;
};

export function DashboardLayout({
  session,
  copy,
  locale,
  initialLeads,
  initialLoadError,
}: DashboardLayoutProps) {
  const [tab, setTab] = useState<DashboardTab>("leads");
  const { profile } = session;
  const home = locale === defaultLocale ? "/" : `/${locale}`;

  return (
    <div className="flex min-h-screen bg-[#f4f5f7] text-slate-900">
      <DashboardSidebar
        active={tab}
        onChange={setTab}
        copy={copy}
        locale={locale}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
          <Link href={home} className="inline-flex shrink-0" aria-label="CraftLink">
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="h-6 w-auto"
              decoding="async"
            />
          </Link>
          <form action={signOutAction}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              className="text-xs font-semibold text-neutral-500"
            >
              {copy.signOut}
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-x-auto px-4 py-5 pb-[4.5rem] md:px-8 md:py-8 md:pb-8">
          <div className="mx-auto w-full max-w-6xl">
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
              <VitrinePanel profile={profile} copy={copy} locale={locale} />
            ) : null}
            {tab === "partners" ? (
              <PartnersPanel profile={profile} copy={copy} locale={locale} />
            ) : null}
            {tab === "account" ? (
              <AccountPanel profile={profile} copy={copy} locale={locale} />
            ) : null}
          </div>
        </main>

        <DashboardBottomNav active={tab} onChange={setTab} copy={copy} />
      </div>
    </div>
  );
}
