"use client";

import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { metierSupportsUrgencyCta } from "@/lib/vitrine/metierUrgencySupport";
import { getMetierOptions } from "@/lib/onboarding/metierOptions";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { profileToEditorState } from "@/domain/vitrinePresentation";
import type { Profile } from "@/domain/profile";

type UrgencyMetierSettingProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function UrgencyMetierSetting({ profile, copy, locale }: UrgencyMetierSettingProps) {
  const p = copy.profilePanel;
  const metierKey = profileToEditorState(profile).profileDraft.metierKey as MetierKey | "";
  const supportsUrgency = metierSupportsUrgencyCta(metierKey);
  const metierLabel =
    getMetierOptions(locale).find((option) => option.value === metierKey)?.label ??
    p.metierNotSet;

  if (!metierKey) {
    return (
      <div className="db-card-flat p-6 md:p-8">
        <h3 className="text-base font-black text-[#212129]">{p.urgencyTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6478]">{p.metierNotSetHint}</p>
      </div>
    );
  }

  return (
    <div
      className={`db-card-flat p-6 md:p-8 ${
        supportsUrgency
          ? "border-[#EFA188]/40 bg-gradient-to-br from-[#FFF5F0] to-white"
          : ""
      }`}
    >
      <h3 className="text-base font-black text-[#212129]">{p.urgencyTitle}</h3>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5b6478]">
        {metierLabel}
      </p>

      {supportsUrgency ? (
        <div className="mt-5 space-y-3">
          <span className="inline-flex rounded-full bg-[#EFA188] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#212129]">
            {p.urgencyEnabledBadge}
          </span>
          <p className="text-sm leading-relaxed text-[#212129]">{p.urgencyEnabledBody}</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <span className="inline-flex rounded-full border-2 border-[#212129] bg-[#FDFBF7] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#212129]">
            {p.projectFormBadge}
          </span>
          <p className="text-sm leading-relaxed text-[#5b6478]">{p.urgencyHiddenBody}</p>
        </div>
      )}
    </div>
  );
}
