"use client";

import { useState } from "react";
import { FaPen, FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { Profile } from "@/domain/profile";
import { GlowButton } from "@/components/ui/GlowButton";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import {
  buildPublicPageDisplayUrl,
  buildPublicPagePath,
  publicPageSlugPrefix,
} from "@/lib/onboarding/publicPageUrl";

export type VitrineDraft = {
  businessName: string;
  trade: string;
  description: string;
  city: string;
  phone: string;
  instagram: string;
  facebook: string;
  googleBusiness: string;
};

function draftFromProfile(profile: Profile): VitrineDraft {
  return {
    businessName: profile.full_name ?? "",
    trade: "",
    description: "",
    city: "",
    phone: profile.whatsapp_number ?? "",
    instagram: "",
    facebook: "",
    googleBusiness: "",
  };
}

type VitrineProfileFormProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
};

export function VitrineProfileForm({ profile, copy, locale }: VitrineProfileFormProps) {
  const v = copy.vitrine;
  const [draft, setDraft] = useState<VitrineDraft>(() => draftFromProfile(profile));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  const slug = profile.page_slug?.trim() ?? "";
  const publicPath = slug ? buildPublicPagePath(slug, locale) : "";
  const publicUrl = slug ? buildPublicPageDisplayUrl(slug) : "";

  const patch = (key: keyof VitrineDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await updateDashboardProfileAction({
      fullName: draft.businessName,
      phone: draft.phone,
    });
    setSaving(false);
    setFeedback(result.ok ? "saved" : "error");
  };

  return (
    <div className="space-y-4 rounded-[18px] border border-neutral-200 bg-white p-4">
      {slug ? (
        <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
            {v.fields.pageUrl}
          </p>
          <p className="mt-0.5 break-all text-sm font-semibold text-neutral-900">{publicUrl}</p>
          <GlowButton
            href={publicPath}
            external={false}
            variant="secondary"
            className="mt-2 gap-1.5 text-xs"
          >
            <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden />
            {v.viewPage}
          </GlowButton>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={authLabelClassName}>{v.fields.businessName}</span>
          <input
            className={authFieldClassName}
            value={draft.businessName}
            onChange={(e) => patch("businessName", e.target.value)}
          />
        </label>
        <label className="block">
          <span className={authLabelClassName}>{v.fields.trade}</span>
          <input
            className={authFieldClassName}
            value={draft.trade}
            onChange={(e) => patch("trade", e.target.value)}
            placeholder="Électricien"
          />
        </label>
        <label className="block">
          <span className={authLabelClassName}>{v.fields.city}</span>
          <input
            className={authFieldClassName}
            value={draft.city}
            onChange={(e) => patch("city", e.target.value)}
            placeholder="Antony et alentours"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={authLabelClassName}>{v.fields.description}</span>
          <textarea
            className={`${authFieldClassName} min-h-[88px] resize-y`}
            value={draft.description}
            onChange={(e) => patch("description", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={authLabelClassName}>{v.fields.phone}</span>
          <input
            className={authFieldClassName}
            type="tel"
            value={draft.phone}
            onChange={(e) => patch("phone", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={authLabelClassName}>{v.fields.instagram}</span>
          <input
            className={authFieldClassName}
            value={draft.instagram}
            onChange={(e) => patch("instagram", e.target.value)}
            placeholder="https://instagram.com/…"
          />
        </label>
        <label className="block">
          <span className={authLabelClassName}>{v.fields.facebook}</span>
          <input
            className={authFieldClassName}
            value={draft.facebook}
            onChange={(e) => patch("facebook", e.target.value)}
          />
        </label>
        <label className="block">
          <span className={authLabelClassName}>{v.fields.google}</span>
          <input
            className={authFieldClassName}
            value={draft.googleBusiness}
            onChange={(e) => patch("googleBusiness", e.target.value)}
          />
        </label>
      </div>

      {slug ? (
        <p className="text-xs text-neutral-400">
          {publicPageSlugPrefix()}
          <span className="font-mono text-neutral-600">{slug}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <GlowButton
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="gap-1.5 text-sm"
        >
          <FaPen className="h-3 w-3" aria-hidden />
          {saving ? v.saving : v.save}
        </GlowButton>
        {feedback === "saved" ? (
          <span className="text-sm font-medium text-teal-700">{v.saved}</span>
        ) : null}
        {feedback === "error" ? (
          <span className="text-sm font-medium text-red-600">{v.saveError}</span>
        ) : null}
      </div>
    </div>
  );
}
