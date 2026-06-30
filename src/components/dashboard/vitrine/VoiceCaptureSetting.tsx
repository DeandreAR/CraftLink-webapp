"use client";

import { useState } from "react";
import { FaLock } from "react-icons/fa6";
import type { Profile } from "@/domain/profile";
import { resolveCraftlinkPlan, isCraftlinkPro } from "@/domain/craftlinkPlan";
import { profileToDashboardUser } from "@/domain/dashboardUser";
import { updateVoiceCaptureAction } from "@/app/actions/dashboard";
import { GlowButton } from "@/components/ui/GlowButton";
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
  const pro = isCraftlinkPro(resolveCraftlinkPlan(profile.plan_tier));
  const user = profileToDashboardUser(profile);
  const [enabled, setEnabled] = useState(user.voiceCaptureEnabled);
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
    <div
      className={`rounded-[18px] border p-4 ${
        pro ? "border-neutral-200 bg-white" : "border-neutral-200 bg-neutral-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-black">{v.title}</h3>
            {!pro ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                <FaLock className="h-2.5 w-2.5" aria-hidden />
                {v.proBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-neutral-600">{v.description}</p>
          <p className="mt-2 text-xs text-neutral-500">{v.rawAudioNote}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={!pro || saving}
          onClick={() => void toggle()}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            !pro
              ? "cursor-not-allowed bg-neutral-200"
              : enabled
                ? "bg-black"
                : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              enabled ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {!pro ? (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white/80 px-3 py-3">
          <p className="text-xs leading-relaxed text-neutral-600">{v.lockedHint}</p>
          <GlowButton
            href={onboardingPath(locale, { plan: "pro" })}
            className="mt-3 text-xs"
          >
            {v.upgradeCta}
          </GlowButton>
        </div>
      ) : null}

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
