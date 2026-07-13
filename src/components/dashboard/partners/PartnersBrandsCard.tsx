"use client";

import { useState } from "react";
import { updateDashboardProfileAction } from "@/app/actions/dashboard";
import { LandingCta } from "@/components/landing/LandingCta";
import type { OnboardingPartnerBrand } from "@/domain/onboarding";
import type { Profile } from "@/domain/profile";
import {
  editorStateToStoredConfig,
  profileToEditorState,
} from "@/domain/vitrinePresentation";
import {
  createPartnerBrand,
  MAX_PARTNER_BRANDS,
  sanitizePartnerBrands,
} from "@/lib/onboarding/partnerBrands";
import type { DashboardDictionary } from "@/i18n/types";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";

type PartnersBrandsCardProps = {
  profile: Profile;
  copy: DashboardDictionary;
};

export function PartnersBrandsCard({ profile, copy }: PartnersBrandsCardProps) {
  const initial = profileToEditorState(profile);
  const b = copy.partners.brands;
  const [brands, setBrands] = useState<OnboardingPartnerBrand[]>(
    initial.profileDraft.partnerBrands ?? [],
  );
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);
  const atMax = brands.length >= MAX_PARTNER_BRANDS;

  const addBrand = () => {
    const name = draft.trim();
    if (!name || atMax) return;
    setBrands((prev) => [...prev, createPartnerBrand(name)]);
    setDraft("");
    setFeedback(null);
  };

  const removeBrand = (id: string) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
    setFeedback(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const sanitized = sanitizePartnerBrands(brands);
    const profileDraft = {
      ...initial.profileDraft,
      partnerBrands: sanitized,
    };
    const result = await updateDashboardProfileAction({
      fullName: profileDraft.businessName.trim(),
      phone: profileDraft.phone.trim(),
      vitrine: editorStateToStoredConfig(profileDraft, initial.services),
      certifications: profile.certifications ?? [],
    });
    setSaving(false);
    if (result.ok) {
      setBrands(sanitized);
      setFeedback("saved");
    } else {
      setFeedback("error");
    }
  };

  return (
    <div className="db-card-flat p-5 md:p-6">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#5b6478]">
        {b.title}
      </h3>
      <p className="mt-1 text-sm text-[#5b6478]">{b.hint}</p>

      {brands.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <li key={brand.id}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#212129]/10 bg-[#FDFBF7] px-3 py-1.5 text-sm font-semibold text-[#212129]">
                {brand.name}
                <button
                  type="button"
                  onClick={() => removeBrand(brand.id)}
                  className="text-[#5b6478] transition hover:text-red-600"
                  aria-label={b.removeAria.replace("{name}", brand.name)}
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-[#EFA188]/35 bg-white/80 px-4 py-6 text-center text-sm text-[#5b6478]">
          {b.empty}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label className={authLabelClassName} htmlFor="partner-brand-input">
            {b.nameLabel}
          </label>
          <input
            id="partner-brand-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addBrand();
              }
            }}
            placeholder={b.namePlaceholder}
            disabled={atMax}
            className={authFieldClassName}
          />
        </div>
        <LandingCta
          type="button"
          variant="secondary"
          disabled={atMax || !draft.trim()}
          onClick={addBrand}
          className="shrink-0"
        >
          {b.add}
        </LandingCta>
      </div>
      {atMax ? <p className="mt-2 text-xs text-[#5b6478]">{b.maxReached}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#212129]/8 pt-4">
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
