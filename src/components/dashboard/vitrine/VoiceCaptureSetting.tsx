"use client";

import { useState } from "react";
import { FaLock } from "react-icons/fa6";
import { updateVoiceCaptureAction } from "@/app/actions/dashboard";
import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { onboardingPath } from "@/lib/auth/paths";
import { GlowButton } from "@/components/ui/GlowButton";

type VoiceCaptureSettingProps = {
  plan: CraftlinkPlan;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  copy: DashboardDictionary;
  locale: Locale;
};

export function VoiceCaptureSetting({
  plan,
  enabled,
  onEnabledChange,
  copy,
  locale,
}: VoiceCaptureSettingProps) {
  const v = copy.vitrine.voiceCapture;
  const isPro = plan === "PRO";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (!isPro) return;
    const next = !enabled;
    setSaving(true);
    setError(null);
    const result = await updateVoiceCaptureAction(next);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onEnabledChange(next);
  };

  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-4 ${
        !isPro ? "opacity-90" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-black">{v.title}</h3>
            {!isPro ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                <FaLock className="h-2.5 w-2.5" aria-hidden />
                {v.proBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-neutral-600">{v.description}</p>
          <p className="mt-2 text-xs text-neutral-400">{v.rawAudioNote}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isPro && enabled}
          aria-label={v.title}
          disabled={!isPro || saving}
          onClick={() => void handleToggle()}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            !isPro
              ? "cursor-not-allowed bg-neutral-200"
              : enabled
                ? "bg-black"
                : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              isPro && enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {!isPro ? (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-3">
          <p className="text-xs text-neutral-600">{v.lockedHint}</p>
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
