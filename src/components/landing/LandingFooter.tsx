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
  const copyright = footer.copyright.replace("{year}", String(year));

  return (
    <footer className="landing-footer border-t border-neutral-200 bg-white">
      <div className="landing-footer-inner mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-medium text-neutral-700">{copyright}</p>
            <p className="mt-1 text-sm text-neutral-500">{footer.tagline}</p>
          </div>
          <nav
            className="flex flex-col gap-2"
            aria-label={footer.legalNavLabel}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {footer.legalNavLabel}
            </p>
            <ul className="flex flex-col gap-1.5 text-sm font-medium">
              <li>
                <Link
                  href={getLegalHref(lang, "mentionsLegales")}
                  className="text-neutral-600 transition hover:text-[#EFA188]"
                >
                  {footer.links.mentionsLegales}
                </Link>
              </li>
              <li>
                <Link
                  href={getLegalHref(lang, "privacy")}
                  className="text-neutral-600 transition hover:text-[#EFA188]"
                >
                  {footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={getLegalHref(lang, "cookies")}
                  className="text-neutral-600 transition hover:text-[#EFA188]"
                >
                  {footer.links.cookies}
                </Link>
              </li>
              <li>
                <Link
                  href={getLegalHref(lang, "terms")}
                  className="text-neutral-600 transition hover:text-[#EFA188]"
                >
                  {footer.links.terms}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="text-left text-neutral-600 transition hover:text-[#EFA188]"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("craftlink:open-cookie-settings"),
                    )
                  }
                >
                  {footer.manageCookies}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
