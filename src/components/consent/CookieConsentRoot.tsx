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

/** Diffère le banner cookies après le premier paint (LCP). */
function scheduleIdle(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(callback, { timeout: 2500 });
    return () => w.cancelIdleCallback?.(id);
  }

  const id = globalThis.setTimeout(callback, 1200);
  return () => globalThis.clearTimeout(id);
}

export function CookieConsentRoot() {
  const pathname = usePathname();
  const lang = localeFromPathname(pathname);
  const [ready, setReady] = useState(false);
  const [copy, setCopy] = useState<CookieConsentDictionary | null>(null);

  useEffect(() => {
    return scheduleIdle(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
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
  }, [lang, ready]);

  if (!ready || !copy) return null;

  return <CookieConsentBanner lang={lang} copy={copy} />;
}
