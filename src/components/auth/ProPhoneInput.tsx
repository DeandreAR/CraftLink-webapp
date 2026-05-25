"use client";

import { useMemo, useState } from "react";
import {
  countryFlag,
  countryLabel,
  defaultPhoneCountryIso,
  findPhoneCountry,
  PHONE_COUNTRIES,
} from "@/config/phoneCountries";
import {
  buildFullPhoneNumber,
  normalizeLocalPhoneDigits,
} from "@/lib/phone/formatPhoneNumber";
import type { Locale } from "@/i18n/config";

type ProPhoneInputProps = {
  id: string;
  name: string;
  lang: Locale;
  label: string;
  placeholder: string;
  labelClassName: string;
};

export function ProPhoneInput({
  id,
  name,
  lang,
  label,
  placeholder,
  labelClassName,
}: ProPhoneInputProps) {
  const defaultIso = defaultPhoneCountryIso(lang);
  const [countryIso, setCountryIso] = useState(defaultIso);
  const [localNumber, setLocalNumber] = useState("");

  const country = findPhoneCountry(countryIso);
  const fullNumber = useMemo(
    () => buildFullPhoneNumber(country.dialCode, localNumber),
    [country.dialCode, localNumber],
  );

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <div className="mt-1.5 flex overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
        <div className="relative shrink-0 border-r border-neutral-200">
          <label htmlFor={`${id}-country`} className="sr-only">
            Indicatif pays
          </label>
          <select
            id={`${id}-country`}
            value={countryIso}
            onChange={(event) => setCountryIso(event.target.value)}
            className="h-full min-w-[7.25rem] cursor-pointer appearance-none bg-neutral-50 py-3 pl-3 pr-8 text-sm font-medium text-neutral-900 outline-none"
            aria-label="Indicatif pays"
          >
            {PHONE_COUNTRIES.map((item) => (
              <option key={item.iso} value={item.iso}>
                {countryFlag(item.iso)} {item.dialCode} — {countryLabel(item.iso, lang)}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-neutral-400"
            aria-hidden
          >
            ▾
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
          <span
            className="shrink-0 text-lg leading-none"
            aria-hidden
            title={countryLabel(country.iso, lang)}
          >
            {countryFlag(country.iso)}
          </span>
          <span className="shrink-0 text-sm font-semibold text-neutral-700">
            {country.dialCode}
          </span>
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={localNumber}
            onChange={(event) => {
              const next = event.target.value;
              if (/^[\d\s().-]*$/.test(next)) {
                setLocalNumber(next);
              }
            }}
            onBlur={() => {
              const normalized = normalizeLocalPhoneDigits(localNumber);
              if (!normalized) {
                setLocalNumber("");
                return;
              }
              if (country.iso === "FR" && normalized.length === 9) {
                setLocalNumber(
                  normalized.replace(
                    /(\d)(\d{2})(\d{2})(\d{2})(\d{2})/,
                    "0$1 $2 $3 $4 $5",
                  ),
                );
              }
            }}
            className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <input type="hidden" name={name} value={fullNumber} />
    </div>
  );
}
