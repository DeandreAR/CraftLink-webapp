"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/lib/i18n/localePaths";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

type LocaleSwitcherProps = {
  currentLocale: Locale;
  ariaLabel: string;
  className?: string;
};

export function LocaleSwitcher({
  currentLocale,
  ariaLabel,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname() ?? "/";

  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-lg border border-[#212129]/10 bg-white p-0.5 ${className ?? ""}`}
      role="group"
      aria-label={ariaLabel}
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            className={`min-w-[2.25rem] rounded-md px-2 py-1.5 text-center text-xs font-bold transition ${
              active
                ? "bg-[#212129] text-white"
                : "text-[#5b6478] hover:text-[#EFA188]"
            }`}
            aria-current={active ? "true" : undefined}
            lang={locale}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
