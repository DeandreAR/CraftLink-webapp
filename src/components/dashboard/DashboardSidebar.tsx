"use client";

import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import type { DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { FaBriefcase, FaUser, FaUsers } from "react-icons/fa6";

type DashboardSidebarProps = {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  copy: DashboardDictionary;
  locale: Locale;
};

const NAV_ITEMS: { id: DashboardTab; icon: typeof FaBriefcase }[] = [
  { id: "leads", icon: FaBriefcase },
  { id: "vitrine", icon: FaUser },
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
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-neutral-200 bg-white md:flex lg:w-[240px]">
      <div className="border-b border-neutral-100 px-5 py-4">
        <Link
          href={home}
          className="landing-nav-logo inline-flex items-center text-black"
          aria-label="CraftLink"
        >
          <img
            src="/images/logo_main.png"
            alt="CraftLink"
            width={1731}
            height={350}
            className="landing-nav-logo-img block h-6 w-auto max-w-none"
            decoding="async"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label={copy.tabs.leads}>
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-neutral-100 text-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {labels[id]}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-neutral-100 p-3">
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-black"
          >
            {copy.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
