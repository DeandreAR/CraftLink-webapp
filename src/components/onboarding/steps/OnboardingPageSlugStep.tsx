"use client";

import { useCallback, useEffect, useState } from "react";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  sanitizePageSlugInput,
  type PageSlugValidationCode,
  validatePageSlug,
} from "@/lib/onboarding/pageSlug";

type OnboardingPageSlugStepProps = {
  copy: OnboardingDictionary;
  locale: Locale;
  profile: OnboardingProfileDraft;
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
  onConfirm: () => void;
};

function slugErrorMessage(
  code: PageSlugValidationCode,
  messages: OnboardingDictionary["pro"]["slugErrors"],
): string {
  switch (code) {
    case "empty":
      return messages.empty;
    case "too_short":
      return messages.tooShort;
    case "too_long":
      return messages.tooLong;
    case "invalid_chars":
      return messages.invalidChars;
    case "invalid_edges":
      return messages.invalidEdges;
    case "reserved":
      return messages.reserved;
    case "taken":
      return messages.taken;
    default:
      return messages.invalidChars;
  }
}

export function OnboardingPageSlugStep({
  copy,
  profile,
  onChange,
  onConfirm,
}: OnboardingPageSlugStepProps) {
  const p = copy.pro;
  const [input, setInput] = useState(profile.pageSlug);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [code, setCode] = useState<PageSlugValidationCode>("empty");

  const syncSlug = useCallback((raw: string) => {
    const normalized = sanitizePageSlugInput(raw);
    setInput(normalized);
    onChange({ pageSlug: normalized, pageSlugConfirmed: false });
  }, [onChange]);

  useEffect(() => {
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
          onChange({ pageSlug: data.normalized });
        }
        setAvailable(data.available);
        setCode(data.code);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [input, onChange]);

  const canConfirm = available === true && validatePageSlug(input).ok;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-black sm:text-2xl">{p.slugTitle}</h2>
        <p className="mt-2 text-sm text-neutral-600">{p.slugSubtitle}</p>
      </div>

      <div className="rounded-[24px] border-2 border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <label htmlFor="page-slug" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {p.slugLabel}
        </label>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <span className="flex shrink-0 items-center rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-medium text-neutral-600">
            {p.slugPrefix}
          </span>
          <input
            id="page-slug"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => syncSlug(e.target.value)}
            placeholder={p.slugPlaceholder}
            className={`${authFieldClassName} mt-0 min-w-0 flex-1 text-base`}
            aria-describedby="page-slug-hint page-slug-error"
          />
        </div>
        <p id="page-slug-hint" className="mt-2 text-xs text-neutral-500">
          {p.slugHint}
        </p>
        {checking ? (
          <p className="mt-2 text-xs text-neutral-500" role="status">
            {p.slugChecking}
          </p>
        ) : null}
        {available === true ? (
          <p className="mt-2 text-xs font-medium text-emerald-700" role="status">
            {p.slugAvailable}
          </p>
        ) : null}
        {available === false && code !== "ok" ? (
          <p id="page-slug-error" className="mt-2 text-xs text-red-600" role="alert">
            {slugErrorMessage(code, p.slugErrors)}
          </p>
        ) : null}
      </div>

      <GlowButton
        type="button"
        disabled={!canConfirm || checking}
        onClick={() => {
          onChange({ pageSlug: input, pageSlugConfirmed: true });
          onConfirm();
        }}
        className="w-full justify-center text-base py-3.5"
      >
        {p.slugConfirm}
      </GlowButton>
    </div>
  );
}
