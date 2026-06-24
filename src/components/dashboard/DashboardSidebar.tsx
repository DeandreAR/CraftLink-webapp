"use client";

import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import type { DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { FaBriefcase, FaHandshake, FaUser, FaUsers } from "react-icons/fa6";

type DashboardSidebarProps = {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  copy: DashboardDictionary;
  locale: Locale;
};

const NAV_ITEMS: { id: DashboardTab; icon: typeof FaBriefcase }[] = [
  { id: "leads", icon: FaBriefcase },
  { id: "vitrine", icon: FaUser },
  { id: "partners", icon: FaHandshake },
  { id: "account", icon: FaUsers },
];

export function DashboardSidebar({
  active,
  onChange,
  copy,
  locale,
}: DashboardSidebarProps) {
  const home = locale === defaultLocale ? "/" : `/${locale}`;
  const labels = copy.tabs;

  return (
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-white/5 bg-[#1a1d24] md:flex lg:w-[240px]">
      <div className="border-b border-white/8 px-5 py-5">
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
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-5" aria-label={copy.tabs.leads}>
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isActive ? "bg-[#EFA188]/20 text-[#EFA188]" : "bg-white/5 text-neutral-400"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {labels[id]}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-3">
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-neutral-500 transition hover:bg-white/5 hover:text-neutral-300"
          >
            {copy.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
