"use client";

import { useState } from "react";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import { AffiliateLinksEditor } from "@/components/onboarding/AffiliateLinksEditor";
import { LandingCta } from "@/components/landing/LandingCta";
import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import type { Profile } from "@/domain/profile";
import {
  editorStateToStoredConfig,
  profileToEditorState,
} from "@/domain/vitrinePresentation";
import { sanitizeAffiliateLinks } from "@/lib/onboarding/affiliateLinks";
import type { DashboardDictionary } from "@/i18n/types";

type PartnersAffiliateLinksCardProps = {
  profile: Profile;
  copy: DashboardDictionary;
};

export function PartnersAffiliateLinksCard({ profile, copy }: PartnersAffiliateLinksCardProps) {
  const initial = profileToEditorState(profile);
  const [links, setLinks] = useState<OnboardingAffiliateLink[]>(
    initial.profileDraft.affiliateLinks,
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);
  const c = copy.partners.affiliateLinks;

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const sanitized = sanitizeAffiliateLinks(links);
    const profileDraft = {
      ...initial.profileDraft,
      affiliateLinks: sanitized,
    };

    const result = await updateDashboardProfileAction({
      fullName: profileDraft.businessName.trim(),
      phone: profileDraft.phone.trim(),
      vitrine: editorStateToStoredConfig(profileDraft, initial.services),
      certifications: profile.certifications ?? [],
    });

    setSaving(false);
    if (result.ok) {
      setLinks(sanitized);
      setFeedback("saved");
    } else {
      setFeedback("error");
    }
  };

  return (
    <div className="rounded-[18px] border border-neutral-200 bg-white p-4 md:p-5">
      <AffiliateLinksEditor
        links={links}
        onChange={(next) => {
          setLinks(next);
          setFeedback(null);
        }}
        copy={c}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
        <LandingCta
          type="button"
          variant="peach"
          disabled={saving}
          onClick={() => void handleSave()}
          className="text-sm"
        >
          {saving ? copy.vitrine.saving : copy.vitrine.save}
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
