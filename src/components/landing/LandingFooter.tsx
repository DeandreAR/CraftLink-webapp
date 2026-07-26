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
    <footer className="border-t border-black/8 bg-white">
      <div className="lk-container flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:py-16">
        <div className="max-w-md">
          <img
            src="/images/logo_main.png"
            alt="CraftLink"
            width={1731}
            height={350}
            className="mb-5 block h-7 w-auto"
            decoding="async"
          />
          <p className="text-sm leading-relaxed text-zinc-500">
            {copyrightBefore}
            <Link
              href={getLegalHref(lang, "mentionsLegales")}
              className="font-medium text-black underline decoration-[#efa188]/60 underline-offset-2 transition hover:text-[#efa188]"
            >
              {footer.copyrightLink}
            </Link>
            {footer.copyrightAfter}
          </p>
          <p className="mt-2 text-sm text-zinc-400">{footer.tagline}</p>
        </div>
        <nav className="flex flex-col gap-3" aria-label={footer.legalNavLabel}>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
            {footer.legalNavLabel}
          </p>
          <ul className="flex flex-col gap-2.5 text-sm font-medium">
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
                  className="text-zinc-500 transition hover:text-black"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="min-h-[44px] text-left text-zinc-500 transition hover:text-black md:min-h-0"
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
