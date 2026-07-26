"use client";

import { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare, FaList, FaPalette, FaPen } from "react-icons/fa6";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { DashboardViewTabs } from "@/components/dashboard/DashboardViewTabs";
import { CertificationTagsField } from "@/components/dashboard/vitrine/CertificationTagsField";
import { PortfolioGalleryEditor } from "@/components/dashboard/vitrine/PortfolioGalleryEditor";
import { HeaderAppearanceEditor } from "@/components/dashboard/vitrine/HeaderAppearanceEditor";
import { OnboardingGeneralStep } from "@/components/onboarding/steps/OnboardingGeneralStep";
import { OnboardingInterventionsStep } from "@/components/onboarding/steps/OnboardingInterventionsStep";
import { OnboardingVisualStep } from "@/components/onboarding/steps/OnboardingVisualStep";
import { OPEN_VITRINE_VISUAL_EVENT } from "@/lib/dashboard/vitrineTourEvents";
import type { OnboardingProfileDraft, OnboardingService } from "@/domain/onboarding";
import type { Profile } from "@/domain/profile";
import {
  editorStateToStoredConfig,
  profileToEditorState,
} from "@/domain/vitrinePresentation";
import {
  buildPublicPageAbsoluteUrl,
  buildPublicPageDisplayUrl,
  buildPublicPagePath,
  publicPageSlugPrefix,
} from "@/lib/onboarding/publicPageUrl";
import { PublicPageUrlWithCopy } from "@/components/ui/PublicPageUrlWithCopy";
import { normalizeCertifications } from "@/lib/profile/normalizeCertifications";
import type { DashboardDictionary, OnboardingDictionary, VitrineDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type EditorSection = "general" | "content" | "visual";

type VitrineEditorProps = {
  profile: Profile;
  copy: DashboardDictionary;
  onboardingCopy: OnboardingDictionary;
  vitrineCopy: VitrineDictionary;
  locale: Locale;
};

export function VitrineEditor({
  profile,
  copy,
  onboardingCopy,
  vitrineCopy,
  locale,
}: VitrineEditorProps) {
  const v = copy.vitrine;
  const initial = profileToEditorState(profile);

  const [section, setSection] = useState<EditorSection>("general");
  const [profileDraft, setProfileDraft] = useState<OnboardingProfileDraft>(initial.profileDraft);
  const [services, setServices] = useState<OnboardingService[]>(initial.services);
  const [certifications, setCertifications] = useState<string[]>(
    () => profile.certifications ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  useEffect(() => {
    const openVisual = () => setSection("visual");
    window.addEventListener(OPEN_VITRINE_VISUAL_EVENT, openVisual);
    return () => window.removeEventListener(OPEN_VITRINE_VISUAL_EVENT, openVisual);
  }, []);

  const slug = profile.page_slug?.trim() ?? "";
  const publicPath = slug ? buildPublicPagePath(slug, locale) : "";
  const publicUrl = slug ? buildPublicPageDisplayUrl(slug) : "";
  const absoluteUrl = slug ? buildPublicPageAbsoluteUrl(slug) : "";

  const patchProfile = (patch: Partial<OnboardingProfileDraft>) => {
    setProfileDraft((prev) => ({ ...prev, ...patch }));
    setFeedback(null);
  };

  const workspaceId = profile.workspace_id || profile.id;

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const result = await updateDashboardProfileAction({
      fullName: profileDraft.businessName.trim(),
      phone: profileDraft.phone.trim(),
      vitrine: editorStateToStoredConfig(profileDraft, services),
      certifications: normalizeCertifications(certifications),
    });

    setSaving(false);
    setFeedback(result.ok ? "saved" : "error");
  };

  const tabs = [
    {
      id: "general" as const,
      label: v.editorSections.general,
      icon: <FaPen className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "content" as const,
      label: v.editorSections.content,
      icon: <FaList className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
    {
      id: "visual" as const,
      label: v.editorSections.visual,
      icon: <FaPalette className="h-3.5 w-3.5 opacity-70" aria-hidden />,
    },
  ];

  return (
    <div className="space-y-5">
      {slug ? (
        <div
          data-tour="profil-link"
          className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"
        >          <PublicPageUrlWithCopy
            label={v.fields.pageUrl}
            displayUrl={publicUrl}
            copyText={absoluteUrl}
            copyAriaLabel={v.copyPageUrl}
            copiedLabel={v.pageUrlCopied}
            urlClassName="text-sm"
          />
          <DashboardButton
            href={publicPath}
            external={false}
            variant="secondary"
            size="sm"
            className="shrink-0"
          >
            <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden />
            {v.viewPage}
          </DashboardButton>
        </div>
      ) : null}

      <DashboardViewTabs
        tabs={tabs}
        active={section}
        onChange={setSection}
        ariaLabel={v.title}
        className="mb-0"
      />

      <div className="pt-1">
        <p className="db-section-label mb-3">
          {section === "general"
            ? v.editorSections.general
            : section === "content"
              ? v.editorSections.content
              : v.editorSections.visual}
        </p>

        {section === "general" ? (
          <div className="space-y-5">
            <OnboardingGeneralStep
              copy={onboardingCopy}
              locale={locale}
              profile={profileDraft}
              errors={{}}
              includePhone
              onChange={patchProfile}
            />
            <CertificationTagsField
              value={certifications}
              onChange={(next) => {
                setCertifications(next);
                setFeedback(null);
              }}
              copy={v.fields.certifications}
            />
          </div>
        ) : null}

        {section === "content" ? (
          <OnboardingInterventionsStep
            copy={onboardingCopy}
            locale={locale}
            profile={profileDraft}
            services={services}
            onProfileChange={patchProfile}
            onServicesChange={setServices}
          />
        ) : null}

        {section === "visual" ? (
          <div className="space-y-6" data-tour="profil-appearance">
            <HeaderAppearanceEditor
              profile={profileDraft}
              workspaceId={workspaceId}
              onChange={patchProfile}
              copy={v.headerAppearance}
            />
            <OnboardingVisualStep
              copy={onboardingCopy}
              vitrineCopy={vitrineCopy}
              locale={locale}
              profile={profileDraft}
              services={services}
              certifications={certifications}
              onChange={patchProfile}
              showCreatePageButton={false}
            />
            <PortfolioGalleryEditor
              items={profileDraft.portfolioItems ?? []}
              plan={profileDraft.plan}
              workspaceId={workspaceId}
              copy={copy.vitrine.gallery}
              onChange={(portfolioItems) => patchProfile({ portfolioItems })}
            />
          </div>
        ) : null}
      </div>

      {slug ? (
        <p className="text-xs text-slate-400">
          {publicPageSlugPrefix()}
          <span className="font-mono text-slate-600">{slug}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <DashboardButton
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          <FaPen className="h-3 w-3" aria-hidden />
          {saving ? v.saving : v.save}
        </DashboardButton>
        {feedback === "saved" ? (
          <span className="text-sm font-medium text-emerald-700">{v.saved}</span>
        ) : null}
        {feedback === "error" ? (
          <span className="text-sm font-medium text-red-600">{v.saveError}</span>
        ) : null}
      </div>
    </div>
  );
}
