"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { changePageSlugAction } from "@/app/actions/dashboard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { PublicPageUrlWithCopy } from "@/components/ui/PublicPageUrlWithCopy";
import type { Profile } from "@/domain/profile";
import {
  getPageSlugChangeQuota,
  MAX_PAGE_SLUG_CHANGES_PER_YEAR,
} from "@/domain/pageSlugQuota";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import {
  buildPublicPageAbsoluteUrl,
  buildPublicPageDisplayUrl,
  buildPublicPagePath,
  publicPageSlugPrefix,
} from "@/lib/onboarding/publicPageUrl";
import {
  sanitizePageSlugInput,
  type PageSlugValidationCode,
  validatePageSlug,
} from "@/lib/onboarding/pageSlug";

type PageSlugEditorProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

function slugErrorMessage(
  code: PageSlugValidationCode,
  messages: DashboardDictionary["vitrine"]["pageSlug"]["errors"],
): string {
  switch (code) {
    case "empty":
      return messages.empty;
    case "too_short":
      return messages.tooShort;
    case "too_long":
      return messages.tooLong;
    case "invalid_chars":
    case "invalid_edges":
      return messages.invalidChars;
    case "reserved":
      return messages.reserved;
    case "taken":
      return messages.taken;
    default:
      return messages.invalidChars;
  }
}

export function PageSlugEditor({ profile, copy, locale }: PageSlugEditorProps) {
  const router = useRouter();
  const s = copy.vitrine.pageSlug;
  const currentSlug = profile.page_slug?.trim() ?? "";
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(currentSlug);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [code, setCode] = useState<PageSlugValidationCode>("ok");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackOk, setFeedbackOk] = useState(false);
  const [localDates, setLocalDates] = useState(
    () => profile.page_slug_change_dates ?? [],
  );

  useEffect(() => {
    setLocalDates(profile.page_slug_change_dates ?? []);
  }, [profile.page_slug_change_dates]);

  useEffect(() => {
    if (!editing) setInput(currentSlug);
  }, [currentSlug, editing]);

  const quota = useMemo(() => getPageSlugChangeQuota(localDates), [localDates]);
  const canChange = quota.remaining > 0;

  const publicPath = currentSlug ? buildPublicPagePath(currentSlug, locale) : "";
  const publicUrl = currentSlug ? buildPublicPageDisplayUrl(currentSlug) : "";
  const absoluteUrl = currentSlug ? buildPublicPageAbsoluteUrl(currentSlug) : "";

  const syncInput = useCallback((raw: string) => {
    const normalized = sanitizePageSlugInput(raw);
    setInput(normalized);
    setFeedback(null);
    setFeedbackOk(false);
  }, []);

  useEffect(() => {
    if (!editing) return;
    if (!input) {
      setAvailable(null);
      setCode("empty");
      return;
    }

    const local = validatePageSlug(input);
    setCode(local.code);
    if (!local.ok) {
      setAvailable(false);
      return;
    }
    if (local.normalized === currentSlug.toLowerCase()) {
      setAvailable(null);
      setCode("ok");
      return;
    }

    const timer = window.setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/onboarding/slug/check?slug=${encodeURIComponent(input)}`,
        );
        const data = (await res.json()) as {
          available: boolean;
          code: PageSlugValidationCode;
          normalized: string;
        };
        if (data.normalized && data.normalized !== input) {
          setInput(data.normalized);
        }
        setAvailable(data.available);
        setCode(data.code);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [editing, input, currentSlug]);

  const handleSave = async () => {
    if (!canChange || !available || saving) return;
    setSaving(true);
    setFeedback(null);
    setFeedbackOk(false);
    const result = await changePageSlugAction(input);
    setSaving(false);

    if (!result.ok) {
      if (result.error === "quota") {
        setFeedback(s.quotaReached);
      } else if (result.error === "taken") {
        setFeedback(s.errors.taken);
      } else if (result.error === "unchanged") {
        setFeedback(s.unchanged);
      } else {
        setFeedback(s.saveError);
      }
      return;
    }

    setLocalDates((prev) => [...prev, new Date().toISOString()]);
    setEditing(false);
    setFeedbackOk(true);
    setFeedback(s.saved.replace("{slug}", result.slug));
    router.refresh();
  };

  const nextAvailableLabel =
    quota.nextAvailableAt &&
    new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(quota.nextAvailableAt));

  if (!currentSlug) return null;

  return (
    <div className="space-y-2 border-b border-slate-100 pb-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <PublicPageUrlWithCopy
          label={copy.vitrine.fields.pageUrl}
          displayUrl={publicUrl}
          copyText={absoluteUrl}
          copyAriaLabel={copy.vitrine.copyPageUrl}
          copiedLabel={copy.vitrine.pageUrlCopied}
          urlClassName="text-sm"
        />
        <div className="flex shrink-0 flex-wrap gap-2">
          <DashboardButton
            href={publicPath}
            external={false}
            variant="secondary"
            size="sm"
          >
            {copy.vitrine.viewPage}
          </DashboardButton>
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canChange && !editing}
            onClick={() => {
              setEditing((v) => !v);
              setFeedback(null);
              setFeedbackOk(false);
            }}
          >
            {editing ? s.cancel : s.edit}
          </DashboardButton>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        {s.quotaHint
          .replace("{remaining}", String(quota.remaining))
          .replace("{max}", String(MAX_PAGE_SLUG_CHANGES_PER_YEAR))}
        {!canChange && nextAvailableLabel
          ? ` ${s.nextAvailable.replace("{date}", nextAvailableLabel)}`
          : null}
      </p>

      {editing ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-xs leading-relaxed text-amber-800">{s.warning}</p>
          <div>
            <label className={authLabelClassName} htmlFor="page-slug-edit">
              {s.inputLabel}
            </label>
            <div className="mt-1 flex items-center gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <span className="shrink-0 border-r border-slate-100 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                {publicPageSlugPrefix()}
              </span>
              <input
                id="page-slug-edit"
                type="text"
                value={input}
                onChange={(e) => syncInput(e.target.value)}
                className={`${authFieldClassName} rounded-none border-0 shadow-none focus:ring-0`}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {checking
                ? s.checking
                : available === true
                  ? s.available
                  : available === false
                    ? slugErrorMessage(code, s.errors)
                    : input.toLowerCase() === currentSlug.toLowerCase()
                      ? s.unchanged
                      : null}
            </p>
          </div>
          <DashboardButton
            type="button"
            variant="primary"
            size="sm"
            disabled={!available || saving || checking}
            onClick={() => void handleSave()}
          >
            {saving ? s.saving : s.confirm}
          </DashboardButton>
        </div>
      ) : null}

      {feedback ? (
        <p
          className={`text-xs font-medium ${
            feedbackOk ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
