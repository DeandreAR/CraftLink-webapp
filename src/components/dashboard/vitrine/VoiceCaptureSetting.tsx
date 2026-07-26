"use client";

import { useState } from "react";
import { FaLock } from "react-icons/fa6";
import type { Profile } from "@/domain/profile";
import { isProUser } from "@/domain/proAccess";
import { resolveVoiceCaptureEnabled } from "@/lib/dashboard/voiceCaptureDefault";
import { updateVoiceCaptureAction } from "@/app/actions/dashboard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { onboardingPath } from "@/lib/auth/paths";

type VoiceCaptureSettingProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function VoiceCaptureSetting({ profile, copy, locale }: VoiceCaptureSettingProps) {
  const v = copy.vitrine.voiceCapture;
  const pro = isProUser(profile);
  const [enabled, setEnabled] = useState(() => resolveVoiceCaptureEnabled(profile));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    if (!pro || saving) return;
    setSaving(true);
    setError(null);
    const next = !enabled;
    const result = await updateVoiceCaptureAction(next);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setEnabled(next);
  };

  return (
    <div className="border-t border-slate-100 pt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
            {!pro ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                <FaLock className="h-2.5 w-2.5" aria-hidden />
                {v.proBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-500">{v.description}</p>
          <p className="mt-1.5 text-xs text-slate-400">{v.rawAudioNote}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={!pro || saving}
          onClick={() => void toggle()}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            !pro
              ? "cursor-not-allowed bg-slate-200"
              : enabled
                ? "bg-slate-900"
                : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition ${
              enabled ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {!pro ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs leading-relaxed text-slate-500">{v.lockedHint}</p>
          <DashboardButton
            href={onboardingPath(locale, { plan: "pro" })}
            size="sm"
            className="mt-3"
          >
            {v.upgradeCta}
          </DashboardButton>
        </div>
      ) : null}

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
