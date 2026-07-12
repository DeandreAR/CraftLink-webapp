"use client";

import type { OnboardingProfileDraft } from "@/domain/onboarding";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import type { OnboardingDictionary } from "@/i18n/types";

type ProfileStatsFieldsProps = {
  copy: OnboardingDictionary;
  profile: OnboardingProfileDraft;
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
};

function parseOptionalCount(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.min(9999, parsed);
}

export function ProfileStatsFields({ copy, profile, onChange }: ProfileStatsFieldsProps) {
  const g = copy.general;

  return (
    <fieldset className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
      <legend className="px-1 text-sm font-bold text-black">{g.statsTitle}</legend>
      <p className="text-xs text-neutral-600">{g.statsSubtitle}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="experience-years" className={authLabelClassName}>
            {g.experienceYearsLabel}
          </label>
          <input
            id="experience-years"
            type="number"
            min={1}
            max={99}
            inputMode="numeric"
            value={profile.experienceYears ?? ""}
            onChange={(e) =>
              onChange({ experienceYears: parseOptionalCount(e.target.value) })
            }
            placeholder={g.experienceYearsPlaceholder}
            className={authFieldClassName}
          />
          <p className="mt-1 text-xs text-neutral-500">{g.experienceYearsHint}</p>
        </div>

        <div>
          <label htmlFor="completed-projects" className={authLabelClassName}>
            {g.completedProjectsLabel}
          </label>
          <input
            id="completed-projects"
            type="number"
            min={1}
            max={9999}
            inputMode="numeric"
            value={profile.completedProjectsCount ?? ""}
            onChange={(e) =>
              onChange({ completedProjectsCount: parseOptionalCount(e.target.value) })
            }
            placeholder={g.completedProjectsPlaceholder}
            className={authFieldClassName}
          />
          <p className="mt-1 text-xs text-neutral-500">{g.completedProjectsHint}</p>
        </div>
      </div>
    </fieldset>
  );
}
