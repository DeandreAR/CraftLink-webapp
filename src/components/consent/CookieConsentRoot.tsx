"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import type { CookieConsentDictionary } from "@/i18n/types";

function localeFromPathname(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return defaultLocale;
}

export function CookieConsentRoot() {
  const pathname = usePathname();
  const lang = localeFromPathname(pathname);
  const [copy, setCopy] = useState<CookieConsentDictionary | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const dict =
        lang === "fr"
          ? (await import("@/i18n/dictionaries/fr.json")).default
          : (await import("@/i18n/dictionaries/en.json")).default;
      if (!cancelled) {
        setCopy(
          (dict as { cookieConsent: CookieConsentDictionary }).cookieConsent,
        );
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (!copy) return null;

  return <CookieConsentBanner lang={lang} copy={copy} />;
}
