"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  acceptAllCookies,
  readCookieConsent,
  rejectOptionalCookies,
  saveCookieConsent,
} from "@/services/cookieConsentService";
import type { Locale } from "@/i18n/config";
import { getLegalHref } from "@/i18n/legalPaths";
import type { CookieConsentDictionary } from "@/i18n/types";

type CookieConsentBannerProps = {
  lang: Locale;
  copy: CookieConsentDictionary;
};

export function CookieConsentBanner({ lang, copy }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const syncFromStorage = useCallback(() => {
    const stored = readCookieConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    syncFromStorage();
    const onUpdate = () => syncFromStorage();
    window.addEventListener("craftlink:cookie-consent", onUpdate);
    return () => window.removeEventListener("craftlink:cookie-consent", onUpdate);
  }, [syncFromStorage]);

  const close = () => {
    setVisible(false);
    setCustomOpen(false);
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    close();
  };

  const handleRejectOptional = () => {
    rejectOptionalCookies();
    close();
  };

  const handleSave = () => {
    saveCookieConsent({ analytics, marketing });
    close();
  };

  const reopenPreferences = () => {
    const stored = readCookieConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }
    setCustomOpen(true);
    setVisible(true);
  };

  useEffect(() => {
    const handler = () => reopenPreferences();
    window.addEventListener("craftlink:open-cookie-settings", handler);
    return () => window.removeEventListener("craftlink:open-cookie-settings", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] p-4 md:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="mx-auto max-w-2xl rounded-[1.25rem] border border-neutral-200 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-6">
        <h2
          id="cookie-consent-title"
          className="text-base font-bold tracking-tight text-black md:text-lg"
        >
          {copy.title}
        </h2>
        <p
          id="cookie-consent-desc"
          className="mt-2 text-sm leading-relaxed text-neutral-700"
        >
          {copy.description}{" "}
          <Link
            href={getLegalHref(lang, "cookies")}
            className="font-semibold text-black underline underline-offset-2"
          >
            {copy.cookiesPolicyLink}
          </Link>
          {" · "}
          <Link
            href={getLegalHref(lang, "privacy")}
            className="font-semibold text-black underline underline-offset-2"
          >
            {copy.privacyPolicyLink}
          </Link>
        </p>

        {customOpen ? (
          <div className="mt-4 space-y-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-black">{copy.necessaryTitle}</p>
                <p className="mt-1 text-neutral-600">{copy.necessaryDesc}</p>
              </div>
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-neutral-500">
                {copy.alwaysOn}
              </span>
            </div>
            <label className="flex cursor-pointer items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-black">{copy.analyticsTitle}</p>
                <p className="mt-1 text-neutral-600">{copy.analyticsDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-neutral-300"
              />
            </label>
            <label className="flex cursor-pointer items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-black">{copy.marketingTitle}</p>
                <p className="mt-1 text-neutral-600">{copy.marketingDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-neutral-300"
              />
            </label>
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {copy.acceptAll}
          </button>
          <button
            type="button"
            onClick={handleRejectOptional}
            className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:border-neutral-400"
          >
            {copy.rejectOptional}
          </button>
          {customOpen ? (
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-50"
            >
              {copy.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCustomOpen(true)}
              className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              {copy.customize}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
