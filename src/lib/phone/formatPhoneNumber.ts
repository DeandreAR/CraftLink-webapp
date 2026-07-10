import {
  findPhoneCountry,
  PHONE_COUNTRIES,
  type PhoneCountry,
} from "@/config/phoneCountries";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Numéro local sans le 0 de tête (ex. 06… → 6…). */
export function normalizeLocalPhoneDigits(local: string): string {
  return digitsOnly(local).replace(/^0+/, "");
}

/** Construit un numéro E.164 compact (ex. +33612345678). */
export function buildFullPhoneNumber(
  dialCode: string,
  local: string,
): string {
  const localDigits = normalizeLocalPhoneDigits(local);
  if (!localDigits) {
    return "";
  }

  const dialDigits = digitsOnly(dialCode);
  return `+${dialDigits}${localDigits}`;
}

export type ParsedPhoneNumber = {
  country: PhoneCountry;
  local: string;
};

/** Décompose +33612345678 en pays + partie locale affichable. */
export function parseFullPhoneNumber(
  value: string,
  fallbackIso: string,
): ParsedPhoneNumber {
  const trimmed = value.trim();
  if (!trimmed) {
    return { country: findPhoneCountry(fallbackIso), local: "" };
  }

  const normalized = trimmed.startsWith("+") ? trimmed : `+${digitsOnly(trimmed)}`;
  const allDigits = digitsOnly(normalized);

  const sorted = [...PHONE_COUNTRIES].sort(
    (a, b) => digitsOnly(b.dialCode).length - digitsOnly(a.dialCode).length,
  );

  for (const country of sorted) {
    const dialDigits = digitsOnly(country.dialCode);
    if (allDigits.startsWith(dialDigits)) {
      const localDigits = allDigits.slice(dialDigits.length);
      const local =
        country.iso === "FR" && localDigits.length === 9
          ? `0${localDigits}`
          : localDigits;
      return { country, local };
    }
  }

  return {
    country: findPhoneCountry(fallbackIso),
    local: trimmed.replace(/^\+\d+\s*/, ""),
  };
}
