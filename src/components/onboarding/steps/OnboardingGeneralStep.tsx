"use client";

import type {
  GeneralStepErrors,
  OnboardingProfileDraft,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GeoCityAutocomplete } from "@/components/onboarding/GeoCityAutocomplete";
import { getMetierOptions } from "@/lib/onboarding/metierOptions";
import { INTERVENTION_RADIUS_OPTIONS } from "@/lib/onboarding/interventionTags";
import type { CitySelection } from "@/lib/onboarding/geoApi";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

const fieldErrorClass = "mt-1 text-xs font-medium text-red-600";

type OnboardingGeneralStepProps = {
  copy: OnboardingDictionary;
  locale: Locale;
  profile: OnboardingProfileDraft;
  errors: GeneralStepErrors;
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
};

export function OnboardingGeneralStep({
  copy,
  locale,
  profile,
  errors,
  onChange,
}: OnboardingGeneralStepProps) {
  const g = copy.general;
  const metierOptions = getMetierOptions(locale);

  const cityValue: CitySelection | null = profile.city
    ? {
        name: profile.city,
        code: profile.cityCode,
        postalCode: profile.postalCode,
      }
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-black">{g.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">{g.subtitle}</p>
      </div>

      <div>
        <label htmlFor="business-name" className={authLabelClassName}>
          {g.companyLabel}
        </label>
        <input
          id="business-name"
          type="text"
          value={profile.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
          placeholder={g.companyPlaceholder}
          aria-invalid={Boolean(errors.businessName)}
          className={`${authFieldClassName} ${errors.businessName ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
        />
        {errors.businessName ? (
          <p className={fieldErrorClass} role="alert">
            {errors.businessName}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className={authLabelClassName}>{g.metierLabel}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {metierOptions.map(({ value, label, icon }) => {
            const selected = profile.metierKey === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  onChange({
                    metierKey: value as MetierKey,
                    selectedInterventions: [],
                    presentationMode: null,
                    aboutText: "",
                  })
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                <span aria-hidden>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>
        {errors.metierKey ? (
          <p className={fieldErrorClass} role="alert">
            {errors.metierKey}
          </p>
        ) : null}
      </fieldset>

      <div>
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
        {errors.city ? (
          <p className={fieldErrorClass} role="alert">
            {errors.city}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="radius" className={authLabelClassName}>
          {g.radiusLabel}
        </label>
        <select
          id="radius"
          value={profile.interventionRadiusKm}
          onChange={(e) =>
            onChange({ interventionRadiusKm: Number.parseInt(e.target.value, 10) })
          }
          className={authFieldClassName}
        >
          {INTERVENTION_RADIUS_OPTIONS.map((km) => (
            <option key={km} value={km}>
              {km} km
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function getGeneralStepErrors(
  profile: OnboardingProfileDraft,
  copy: OnboardingDictionary,
): GeneralStepErrors {
  const e = copy.errors.general;
  const errors: GeneralStepErrors = {};
  if (profile.businessName.trim().length <= 1) {
    errors.businessName = e.businessName;
  }
  if (profile.metierKey === "") {
    errors.metierKey = e.metierKey;
  }
  if (profile.city.trim().length <= 1) {
    errors.city = e.city;
  }
  return errors;
}

export function isGeneralStepValid(profile: OnboardingProfileDraft): boolean {
  return (
    profile.businessName.trim().length > 1 &&
    profile.metierKey !== "" &&
    profile.city.trim().length > 1
  );
}
