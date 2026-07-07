"use client";

import type { OnboardingProfileDraft } from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GeoCityAutocomplete } from "@/components/onboarding/GeoCityAutocomplete";
import { LandingCta } from "@/components/landing/LandingCta";
import { getMetierOptions } from "@/lib/onboarding/metierOptions";
import type { ProRequiredFieldKey } from "@/lib/onboarding/proRequiredFields";
import type { CitySelection } from "@/lib/onboarding/geoApi";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

type OnboardingProGapStepProps = {
  copy: OnboardingDictionary;
  locale: Locale;
  profile: OnboardingProfileDraft;
  missingFields: ProRequiredFieldKey[];
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
  onContinue: () => void;
};

export function OnboardingProGapStep({
  copy,
  locale,
  profile,
  missingFields,
  onChange,
  onContinue,
}: OnboardingProGapStepProps) {
  const p = copy.pro;
  const g = copy.general;
  const metierOptions = getMetierOptions(locale);

  const cityValue: CitySelection | null = profile.city
    ? { name: profile.city, code: profile.cityCode, postalCode: profile.postalCode }
    : null;

  const leadFor = (field: ProRequiredFieldKey) =>
    p.gapLeadTemplate.replace("{field}", p.fieldLabels[field]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-black">{p.gapTitle}</h2>
        <p className="mt-1 text-sm text-neutral-600">{p.gapSubtitle}</p>
      </div>

      {missingFields.map((field) => (
        <div
          key={field}
          className="rounded-[20px] border border-amber-200/80 bg-amber-50/50 p-4"
        >
          <p className="text-sm text-neutral-800">{leadFor(field)}</p>

          {field === "businessName" ? (
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
              placeholder={g.companyPlaceholder}
              className={`${authFieldClassName} mt-3`}
            />
          ) : null}

          {field === "phone" ? (
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder={p.phonePlaceholder}
              className={`${authFieldClassName} mt-3`}
            />
          ) : null}

          {field === "city" ? (
            <div className="mt-3">
              <GeoCityAutocomplete
                label={g.cityLabel}
                placeholder={g.cityPlaceholder}
                value={cityValue}
                noResultsLabel={g.cityNoResults}
                onChange={(city) =>
                  onChange({
                    city: city?.name ?? "",
                    cityCode: city?.code ?? "",
                    postalCode: city?.postalCode ?? "",
                  })
                }
              />
            </div>
          ) : null}

          {field === "metierKey" ? (
            <fieldset className="mt-3">
              <legend className="sr-only">{g.metierLabel}</legend>
              <div className="flex flex-wrap gap-2">
                {metierOptions.map(({ value, label, icon }) => {
                  const selected = profile.metierKey === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onChange({ metierKey: value as MetierKey })}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      <span aria-hidden>{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
        </div>
      ))}

      <LandingCta type="button" variant="peach" onClick={onContinue} className="w-full justify-center">
        {p.gapContinue}
      </LandingCta>
    </div>
  );
}
