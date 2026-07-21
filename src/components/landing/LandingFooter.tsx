"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getLegalHref } from "@/i18n/legalPaths";
import type { FooterDictionary } from "@/i18n/types";

type LandingFooterProps = {
  lang: Locale;
  footer: FooterDictionary;
};

export function LandingFooter({ lang, footer }: LandingFooterProps) {
  const year = new Date().getFullYear();
  const copyrightBefore = footer.copyrightBefore.replace("{year}", String(year));

  return (
    <footer className="border-t border-zinc-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-md">
          <img
            src="/images/logo_main.png"
            alt="CraftLink"
            width={1731}
            height={350}
            className="mb-4 block h-6 w-auto"
            decoding="async"
          />
          <p className="text-sm text-zinc-500">
            {copyrightBefore}
            <Link
              href={getLegalHref(lang, "mentionsLegales")}
              className="font-medium text-zinc-700 underline decoration-[#efa188]/50 underline-offset-2 transition hover:text-[#efa188]"
            >
              {footer.copyrightLink}
            </Link>
            {footer.copyrightAfter}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{footer.tagline}</p>
        </div>
        <nav className="flex flex-col gap-2" aria-label={footer.legalNavLabel}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
            {footer.legalNavLabel}
          </p>
          <ul className="flex flex-col gap-1.5 text-sm font-medium">
            {(
              [
                ["mentionsLegales", footer.links.mentionsLegales],
                ["privacy", footer.links.privacy],
                ["cookies", footer.links.cookies],
                ["terms", footer.links.terms],
              ] as const
            ).map(([key, label]) => (
              <li key={key}>
                <Link
                  href={getLegalHref(lang, key)}
                  className="text-zinc-500 transition hover:text-zinc-900"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="text-left text-zinc-500 transition hover:text-zinc-900"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("craftlink:open-cookie-settings"))
                }
              >
                {footer.manageCookies}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
