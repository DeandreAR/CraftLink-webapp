"use client";

import type {
  GeneralStepErrors,
  OnboardingProfileDraft,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GeoCityAutocomplete } from "@/components/onboarding/GeoCityAutocomplete";
import { ProfileStatsFields } from "@/components/onboarding/ProfileStatsFields";
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
  includePhone?: boolean;
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
};

export function OnboardingGeneralStep({
  copy,
  locale,
  profile,
  errors,
  includePhone = false,
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

      {includePhone ? (
        <div>
          <label htmlFor="business-phone" className={authLabelClassName}>
            {copy.pro.phoneLabel}
          </label>
          <input
            id="business-phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder={copy.pro.phonePlaceholder}
            aria-invalid={Boolean(errors.phone)}
            className={`${authFieldClassName} ${errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}`}
          />
          {errors.phone ? (
            <p className={fieldErrorClass} role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>
      ) : null}

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
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-[20px] border px-3.5 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-black bg-black text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                    : "border-black/10 bg-white text-zinc-600 hover:border-[#efa188]/50 hover:bg-[#efa188]/08"
                }`}
                aria-pressed={selected}
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

      <ProfileStatsFields copy={copy} profile={profile} onChange={onChange} />
    </div>
  );
}

export function getGeneralStepErrors(
  profile: OnboardingProfileDraft,
  copy: OnboardingDictionary,
  options?: { requirePhone?: boolean },
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
  if (options?.requirePhone && profile.phone.trim().length <= 5) {
    errors.phone = copy.pro.phoneError;
  }
  return errors;
}

export function isGeneralStepValid(
  profile: OnboardingProfileDraft,
  options?: { requirePhone?: boolean },
): boolean {
  const base =
    profile.businessName.trim().length > 1 &&
    profile.metierKey !== "" &&
    profile.city.trim().length > 1;
  if (options?.requirePhone) {
    return base && profile.phone.trim().length > 5;
  }
  return base;
}
