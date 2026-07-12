"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  businessName?: string | null;
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
  businessName,
}: DashboardSidebarProps) {
  const home = locale === defaultLocale ? "/" : `/${locale}`;
  const labels = copy.tabs;

  return (
    <aside className="hidden h-[100dvh] w-[240px] shrink-0 flex-col border-r border-white/5 bg-[#1a1d24] md:flex lg:w-[260px]">
      <div className="border-b border-white/8 px-5 py-5">
        <Link href={home} className="inline-flex items-center" aria-label="CraftLink">
          <img
            src="/images/logo_main.png"
            alt="CraftLink"
            width={1731}
            height={350}
            className="block h-7 w-auto max-w-none brightness-0 invert"
            decoding="async"
          />
        </Link>
        {businessName ? (
          <p className="mt-3 truncate text-xs font-semibold text-neutral-400">{businessName}</p>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5" aria-label={copy.tabs.leads}>
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
          Menu
        </p>
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${
                isActive ? "text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? (
                <motion.span
                  layoutId="dashboard-nav-active"
                  className="absolute inset-0 rounded-xl bg-white/10 shadow-sm ring-1 ring-[#EFA188]/35"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-[#EFA188]/25 text-[#EFA188]"
                    : "bg-white/5 text-neutral-400"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="relative">{labels[id]}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-3">
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-medium text-neutral-500 transition hover:bg-white/5 hover:text-neutral-300"
          >
            {copy.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
