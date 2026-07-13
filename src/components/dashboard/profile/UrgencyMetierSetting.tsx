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
      <div className="db-profile-section db-profile-section--urgency p-6 md:p-8">
        <h3 className="text-base font-black text-[#212129]">{p.urgencyTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6478]">{p.metierNotSetHint}</p>
      </div>
    );
  }

  return (
    <div className="db-profile-section db-profile-section--urgency p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black text-[#212129]">{p.urgencyTitle}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5b6478]">
            {metierLabel}
          </p>
          {supportsUrgency ? (
            <p className="mt-3 text-sm leading-relaxed text-[#212129]">{p.urgencyEnabledBody}</p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-[#5b6478]">{p.urgencyHiddenBody}</p>
          )}
        </div>

        {supportsUrgency ? (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={saving}
            onClick={() => void toggle()}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${
              enabled ? "bg-[#212129]" : "bg-neutral-300"
            } disabled:opacity-60`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                enabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        ) : (
          <span className="shrink-0 rounded-full border-2 border-[#212129] bg-[#FDFBF7] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#212129]">
            {p.projectFormBadge}
          </span>
        )}
      </div>

      {supportsUrgency ? (
        <p className="mt-3 text-xs font-semibold text-[#c45a3a]">
          {enabled ? p.urgencyEnabledBadge : p.urgencyDisabledBadge}
        </p>
      ) : null}

      {error ? <p className="mt-2 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
