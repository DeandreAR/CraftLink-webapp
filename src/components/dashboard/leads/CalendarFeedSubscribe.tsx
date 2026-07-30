"use client";

import { useEffect, useState } from "react";
import { FaApple, FaCopy, FaGoogle, FaRotate } from "react-icons/fa6";
import {
  ensureCalendarFeedAction,
  regenerateCalendarFeedAction,
} from "@/app/actions/calendarFeed";
import type { DashboardDictionary } from "@/i18n/types";

type CalendarFeedSubscribeProps = {
  copy: DashboardDictionary;
};

/** Abonnement agenda unique — tous les RDV planifiés se synchronisent automatiquement. */
export function CalendarFeedSubscribe({ copy }: CalendarFeedSubscribeProps) {
  const c = copy.leads.calendar;
  const [httpsUrl, setHttpsUrl] = useState<string | null>(null);
  const [webcalUrl, setWebcalUrl] = useState<string | null>(null);
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [regenBusy, setRegenBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await ensureCalendarFeedAction();
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setHttpsUrl(result.httpsUrl);
      setWebcalUrl(result.webcalUrl);
      setGoogleUrl(result.googleSubscribeUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const copyLink = async () => {
    if (!httpsUrl) return;
    try {
      await navigator.clipboard.writeText(httpsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(c.feedCopyError);
    }
  };

  const regenerate = async () => {
    setRegenBusy(true);
    setError(null);
    const result = await regenerateCalendarFeedAction();
    setRegenBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setHttpsUrl(result.httpsUrl);
    setWebcalUrl(result.webcalUrl);
    setGoogleUrl(result.googleSubscribeUrl);
  };

  return (
    <div
      className="mt-4 rounded-xl border-2 border-[#efa188]/50 bg-white p-4 shadow-sm sm:p-5"
      data-tour="dashboard-calendar-feed"
    >
      <h3 className="text-base font-bold text-slate-900">{c.feedTitle}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.feedHint}</p>

      {loading ? (
        <p className="mt-4 text-sm text-slate-400">{c.feedLoading}</p>
      ) : error && !httpsUrl ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : (
        <>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
            <li>{c.feedStep1}</li>
            <li>{c.feedStep2}</li>
            <li>{c.feedStep3}</li>
          </ol>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {webcalUrl ? (
              <a
                href={webcalUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <FaApple className="h-4 w-4" aria-hidden />
                {c.feedApple}
              </a>
            ) : null}
            {googleUrl ? (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                <FaGoogle className="h-4 w-4" aria-hidden />
                {c.feedGoogle}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => void copyLink()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#efa188] bg-[#efa188]/15 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#efa188]/30"
            >
              <FaCopy className="h-3.5 w-3.5" aria-hidden />
              {copied ? c.feedCopied : c.feedCopy}
            </button>
          </div>

          {httpsUrl ? (
            <p className="mt-3 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-500">
              {httpsUrl}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void regenerate()}
            disabled={regenBusy}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline disabled:opacity-60"
          >
            <FaRotate className="h-3 w-3" aria-hidden />
            {regenBusy ? c.feedRegenBusy : c.feedRegen}
          </button>

          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        </>
      )}
    </div>
  );
}
