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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    if (!supportsUrgency || !metierKey || saving) return;
    setSaving(true);
    setError(null);
    const next = !enabled;
    const profileDraft = { ...initial.profileDraft, urgencyCtaEnabled: next };
    const result = await updateDashboardProfileAction({
      fullName: profileDraft.businessName.trim(),
      phone: profileDraft.phone.trim(),
      vitrine: editorStateToStoredConfig(profileDraft, initial.services),
      certifications: profile.certifications ?? [],
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? copy.vitrine.saveError);
      return;
    }
    setEnabled(next);
  };

  if (!metierKey) {
    return (
      <div className="db-profile-section db-profile-section--urgency db-urgency-compact p-4 md:p-8">
        <h3 className="text-sm font-black text-[#212129] md:text-base">{p.urgencyTitle}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#5b6478] md:mt-2 md:text-sm">
          {p.metierNotSetHint}
        </p>
      </div>
    );
  }

  return (
    <div className="db-profile-section db-profile-section--urgency db-urgency-compact p-3 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-[#212129] md:text-base">{p.urgencyTitle}</h3>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5b6478] md:mt-1 md:text-xs">
            {metierLabel}
          </p>
          {supportsUrgency ? (
            <p className="db-urgency-body mt-2 hidden text-sm leading-relaxed text-[#212129] md:block">
              {p.urgencyEnabledBody}
            </p>
          ) : (
            <p className="db-urgency-body mt-2 text-xs leading-relaxed text-[#5b6478] md:text-sm">
              {p.urgencyHiddenBody}
            </p>
          )}
        </div>

        {supportsUrgency ? (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={saving}
            onClick={() => void toggle()}
            className={`relative h-7 w-12 shrink-0 rounded-full transition md:h-8 md:w-14 ${
              enabled ? "bg-[#212129]" : "bg-neutral-300"
            } disabled:opacity-60`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition md:top-1 ${
                enabled ? "left-5 md:left-7" : "left-0.5 md:left-1"
              }`}
            />
          </button>
        ) : (
          <span className="shrink-0 rounded-full border-2 border-[#212129] bg-[#FDFBF7] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#212129] md:px-3 md:py-1.5 md:text-[10px]">
            {p.projectFormBadge}
          </span>
        )}
      </div>

      {supportsUrgency ? (
        <p className="mt-2 text-[10px] font-semibold text-[#c45a3a] md:mt-3 md:text-xs">
          {enabled ? p.urgencyEnabledBadge : p.urgencyDisabledBadge}
        </p>
      ) : null}

      {error ? <p className="mt-1.5 text-[10px] font-medium text-red-600 md:text-xs">{error}</p> : null}
    </div>
  );
}
