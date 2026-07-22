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
import {
  buildAffiliateShareAbsoluteUrl,
  sanitizeAffiliateLinks,
} from "@/lib/onboarding/affiliateLinks";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const c = copy.partners.affiliateLinks;
  const pageSlug = profile.page_slug?.trim() ?? "";

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

  const copyShareLink = async (linkId: string) => {
    if (!pageSlug) return;
    const url = buildAffiliateShareAbsoluteUrl(pageSlug, linkId);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(linkId);
      window.setTimeout(() => setCopiedId((current) => (current === linkId ? null : current)), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-[18px] border border-neutral-200 bg-white p-4 md:p-5">
      <AffiliateLinksEditor
        links={links}
        workspaceId={profile.workspace_id}
        onChange={(next) => {
          setLinks(next);
          setFeedback(null);
        }}
        copy={c}
      />

      {pageSlug && links.some((l) => l.label.trim() && l.url.trim()) ? (
        <div className="mt-4 space-y-2 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3">
          <p className="text-xs font-semibold text-neutral-700">{c.shareTitle}</p>
          <p className="text-[11px] text-neutral-500">{c.shareHint}</p>
          <ul className="space-y-2">
            {sanitizeAffiliateLinks(links).map((link) => (
              <li
                key={link.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">{link.label}</p>
                  <p className="truncate text-[11px] text-neutral-500">
                    {buildAffiliateShareAbsoluteUrl(pageSlug, link.id)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyShareLink(link.id)}
                  className="shrink-0 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:border-[#EFA188]/50"
                >
                  {copiedId === link.id ? c.shareCopied : c.shareCopy}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
