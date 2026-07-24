"use client";

import { useState } from "react";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import { ProSelectionManager } from "@/components/dashboard/partners/ProSelectionManager";
import { LandingCta } from "@/components/landing/LandingCta";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import type { Profile } from "@/domain/profile";
import {
  editorStateToStoredConfig,
  profileToEditorState,
} from "@/domain/vitrinePresentation";
import type { DashboardDictionary } from "@/i18n/types";

type PartnersProSelectionCardProps = {
  profile: Profile;
  copy: DashboardDictionary;
};

export function PartnersProSelectionCard({ profile, copy }: PartnersProSelectionCardProps) {
  const initial = profileToEditorState(profile);
  const [draft, setDraft] = useState<OnboardingProfileDraft>(initial.profileDraft);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);
  const c = copy.partners.proSelection;
  const workspaceId = profile.workspace_id || profile.id;

  const handleSaveSettings = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await updateDashboardProfileAction({
      fullName: draft.businessName.trim(),
      phone: draft.phone.trim(),
      vitrine: editorStateToStoredConfig(draft, initial.services),
      certifications: profile.certifications ?? [],
    });
    setSaving(false);
    setFeedback(result.ok ? "saved" : "error");
  };

  return (
    <div className="space-y-3">
      <ProSelectionManager
        profileDraft={draft}
        workspaceId={workspaceId}
        onProfileChange={(patch) => {
          setDraft((prev) => ({ ...prev, ...patch }));
          setFeedback(null);
        }}
        copy={c}
      />
      <div className="flex flex-wrap items-center gap-3 px-1">
        <LandingCta
          type="button"
          variant="peach"
          disabled={saving}
          onClick={() => void handleSaveSettings()}
          className="text-sm"
        >
          {saving ? copy.vitrine.saving : c.saveSettings}
        </LandingCta>
        {feedback === "saved" ? (
          <span className="text-sm font-medium text-teal-700">{copy.vitrine.saved}</span>
        ) : null}
        {feedback === "error" ? (
          <span className="text-sm font-medium text-red-600">{copy.vitrine.saveError}</span>
        ) : null}
      </div>
    </div>
  );
}
