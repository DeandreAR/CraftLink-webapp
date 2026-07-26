"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { signOutAction } from "@/app/actions/auth";
import type { DashboardTab } from "@/components/dashboard/DashboardLayout";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { FaBriefcase, FaChartLine, FaHandshake, FaUserGear } from "react-icons/fa6";

type DashboardSidebarProps = {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  copy: DashboardDictionary;
  locale: Locale;
  businessName?: string | null;
};

const NAV_ITEMS: { id: DashboardTab; icon: typeof FaBriefcase }[] = [
  { id: "inbox", icon: FaBriefcase },
  { id: "organize", icon: FaChartLine },
  { id: "profile", icon: FaUserGear },
  { id: "partners", icon: FaHandshake },
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
  const descriptions = copy.tabDescriptions;

  return (
    <aside className="hidden h-[100dvh] w-[240px] shrink-0 flex-col border-r border-black/8 bg-white md:flex lg:w-[260px]">
      <div className="border-b border-black/8 px-5 py-5">
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
        {businessName ? (
          <p className="mt-3 truncate text-xs font-semibold text-zinc-500">{businessName}</p>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-5" aria-label={copy.inbox.listAriaLabel}>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Espace pro
        </p>
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex w-full cursor-pointer items-start gap-3 rounded-[20px] px-3 py-2.5 text-left transition-colors duration-150 ${
                isActive ? "text-black" : "text-zinc-500 hover:bg-[#efa188]/08 hover:text-black"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? (
                <motion.span
                  layoutId="dashboard-nav-active"
                  className="absolute inset-0 rounded-[20px] bg-[#efa188]/12 ring-1 ring-[#efa188]/25"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] transition-colors duration-150 ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block text-sm font-semibold">{labels[id]}</span>
                <span
                  className={`mt-0.5 block text-[10px] leading-snug ${
                    isActive ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  {descriptions[id]}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-black/8 p-3">
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="w-full min-h-[48px] cursor-pointer rounded-[20px] px-3 py-2.5 text-left text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
          >
            {copy.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
