export type PhoneCountry = {
  iso: string;
  dialCode: string;
};

/** Indicatifs prioritaires pour les artisans CraftLink (FR + voisins + diaspora). */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "FR", dialCode: "+33" },
  { iso: "BE", dialCode: "+32" },
  { iso: "CH", dialCode: "+41" },
  { iso: "LU", dialCode: "+352" },
  { iso: "MC", dialCode: "+377" },
  { iso: "CA", dialCode: "+1" },
  { iso: "GB", dialCode: "+44" },
  { iso: "US", dialCode: "+1" },
  { iso: "DE", dialCode: "+49" },
  { iso: "ES", dialCode: "+34" },
  { iso: "IT", dialCode: "+39" },
  { iso: "PT", dialCode: "+351" },
  { iso: "NL", dialCode: "+31" },
  { iso: "MA", dialCode: "+212" },
  { iso: "DZ", dialCode: "+213" },
  { iso: "TN", dialCode: "+216" },
  { iso: "SN", dialCode: "+221" },
  { iso: "CI", dialCode: "+225" },
  { iso: "MG", dialCode: "+261" },
  { iso: "RE", dialCode: "+262" },
  { iso: "GP", dialCode: "+590" },
  { iso: "MQ", dialCode: "+596" },
];

export function countryFlag(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}

export function defaultPhoneCountryIso(locale: string): string {
  return locale === "en" ? "GB" : "FR";
}

export function findPhoneCountry(iso: string): PhoneCountry {
  return (
    PHONE_COUNTRIES.find((country) => country.iso === iso) ?? PHONE_COUNTRIES[0]
  );
}

export function countryLabel(iso: string, locale: string): string {
  try {
    const display = new Intl.DisplayNames([locale], { type: "region" });
    return display.of(iso) ?? iso;
  } catch {
    return iso;
  }
}
