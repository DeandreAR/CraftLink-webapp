"use client";

import { useState, useTransition } from "react";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { ProSelectionManager } from "@/components/dashboard/partners/ProSelectionManager";
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
  const [autoSaving, startAutoSave] = useTransition();
  const c = copy.partners.proSelection;
  const workspaceId = profile.workspace_id || profile.id;

  const persistDraft = async (next: OnboardingProfileDraft) => {
    const result = await updateDashboardProfileAction({
      fullName: next.businessName.trim(),
      phone: next.phone.trim(),
      vitrine: editorStateToStoredConfig(next, initial.services),
      certifications: profile.certifications ?? [],
    });
    return result.ok;
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setFeedback(null);
    const ok = await persistDraft(draft);
    setSaving(false);
    setFeedback(ok ? "saved" : "error");
  };

  const handleProfileChange = (patch: Partial<OnboardingProfileDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if ("proSelectionEnabled" in patch) {
      startAutoSave(() => {
        void persistDraft(next).then((ok) => {
          setFeedback(ok ? "saved" : "error");
        });
      });
      return;
    }
    setFeedback(null);
  };

  return (
    <div className="space-y-3">
      <ProSelectionManager
        profileDraft={draft}
        workspaceId={workspaceId}
        onProfileChange={handleProfileChange}
        copy={c}
      />
      <div className="flex flex-wrap items-center gap-3">
        <DashboardButton
          type="button"
          variant="primary"
          disabled={saving || autoSaving}
          onClick={() => void handleSaveSettings()}
        >
          {saving || autoSaving ? copy.vitrine.saving : c.saveSettings}
        </DashboardButton>
        {feedback === "saved" ? (
          <span className="text-sm font-medium text-emerald-700">{copy.vitrine.saved}</span>
        ) : null}
        {feedback === "error" ? (
          <span className="text-sm font-medium text-red-600">{copy.vitrine.saveError}</span>
        ) : null}
      </div>
    </div>
  );
}
