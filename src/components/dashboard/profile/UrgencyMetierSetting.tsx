"use client";

import { useState } from "react";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { metierSupportsUrgencyCta } from "@/lib/vitrine/metierUrgencySupport";
import { getMetierOptions } from "@/lib/onboarding/metierOptions";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import {
  editorStateToStoredConfig,
  profileToEditorState,
} from "@/domain/vitrinePresentation";
import type { Profile } from "@/domain/profile";

type UrgencyContactMode = "whatsapp" | "form";

type UrgencyMetierSettingProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function UrgencyMetierSetting({ profile, copy, locale }: UrgencyMetierSettingProps) {
  const p = copy.profilePanel;
  const initial = profileToEditorState(profile);
  const metierKey = initial.profileDraft.metierKey as MetierKey | "";
  const supportsUrgency = metierSupportsUrgencyCta(metierKey);
  const metierLabel =
    getMetierOptions(locale).find((option) => option.value === metierKey)?.label ??
    p.metierNotSet;

  const [enabled, setEnabled] = useState(
    () => initial.profileDraft.urgencyCtaEnabled ?? supportsUrgency,
  );
  const [contactMode, setContactMode] = useState<UrgencyContactMode>(
    () =>
      initial.profileDraft.urgencyContactMode === "form" ? "form" : "whatsapp",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = async (next: {
    urgencyCtaEnabled: boolean;
    urgencyContactMode: UrgencyContactMode;
  }) => {
    setSaving(true);
    setError(null);
    const profileDraft = {
      ...initial.profileDraft,
      urgencyCtaEnabled: next.urgencyCtaEnabled,
      urgencyContactMode: next.urgencyContactMode,
    };
    const result = await updateDashboardProfileAction({
      fullName: profileDraft.businessName.trim(),
      phone: profileDraft.phone.trim(),
      vitrine: editorStateToStoredConfig(profileDraft, initial.services),
      certifications: profile.certifications ?? [],
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? copy.vitrine.saveError);
      return false;
    }
    setEnabled(next.urgencyCtaEnabled);
    setContactMode(next.urgencyContactMode);
    return true;
  };

  const toggle = async () => {
    if (!metierKey || saving) return;
    await persist({
      urgencyCtaEnabled: !enabled,
      urgencyContactMode: contactMode,
    });
  };

  const changeMode = async (mode: UrgencyContactMode) => {
    if (!metierKey || saving || mode === contactMode) return;
    await persist({
      urgencyCtaEnabled: enabled,
      urgencyContactMode: mode,
    });
  };

  if (!metierKey) {
    return (
      <div className="db-profile-section db-profile-section--urgency db-urgency-compact p-4 md:p-8">
        <h3 className="text-sm font-semibold text-slate-900 md:text-base">{p.urgencyTitle}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 md:mt-2 md:text-sm">
          {p.metierNotSetHint}
        </p>
      </div>
    );
  }

  const bodyCopy = enabled
    ? p.urgencyEnabledBody
    : supportsUrgency
      ? p.urgencyHiddenBody
      : p.urgencyOptionalBody;

  return (
    <div className="db-profile-section db-profile-section--urgency db-urgency-compact p-3 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900 md:text-base">{p.urgencyTitle}</h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 md:mt-1">
            {metierLabel}
          </p>
          <p className="db-urgency-body mt-2 text-xs leading-relaxed text-slate-500 md:text-sm">
            {bodyCopy}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={saving}
          onClick={() => void toggle()}
          className={`relative h-7 w-12 shrink-0 rounded-full transition md:h-8 md:w-14 ${
            enabled ? "bg-slate-900" : "bg-slate-300"
          } disabled:opacity-60`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition md:top-1 ${
              enabled ? "left-5 md:left-7" : "left-0.5 md:left-1"
            }`}
          />
        </button>
      </div>

      <p className="mt-2 text-[10px] font-semibold text-[#c45a3a] md:mt-3 md:text-xs">
        {enabled ? p.urgencyEnabledBadge : p.urgencyDisabledBadge}
      </p>

      {enabled ? (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-800">{p.urgencyModeTitle}</p>
          <p className="text-[11px] leading-relaxed text-slate-500 md:text-xs">
            {p.urgencyModeHint}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void changeMode("whatsapp")}
              className={`rounded-xl border px-3 py-2.5 text-left text-xs transition disabled:opacity-60 ${
                contactMode === "whatsapp"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="block font-semibold">{p.urgencyModeWhatsApp}</span>
              <span
                className={`mt-0.5 block leading-snug ${
                  contactMode === "whatsapp" ? "text-white/75" : "text-slate-500"
                }`}
              >
                {p.urgencyModeWhatsAppHint}
              </span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void changeMode("form")}
              className={`rounded-xl border px-3 py-2.5 text-left text-xs transition disabled:opacity-60 ${
                contactMode === "form"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="block font-semibold">{p.urgencyModeForm}</span>
              <span
                className={`mt-0.5 block leading-snug ${
                  contactMode === "form" ? "text-white/75" : "text-slate-500"
                }`}
              >
                {p.urgencyModeFormHint}
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-1.5 text-[10px] font-medium text-red-600 md:text-xs">{error}</p> : null}
    </div>
  );
}
