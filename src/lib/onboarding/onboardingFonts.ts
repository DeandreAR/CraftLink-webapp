export type OnboardingFontId =
  | "inter"
  | "poppins"
  | "plus-jakarta"
  | "montserrat"
  | "sora";

export type OnboardingFontOption = {
  id: OnboardingFontId;
  label: string;
  family: string;
  googleQuery: string;
};

export const ONBOARDING_FONTS: OnboardingFontOption[] = [
  {
    id: "inter",
    label: "Inter",
    family: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleQuery: "Inter:wght@400;600;700",
  },
  {
    id: "poppins",
    label: "Poppins",
    family: '"Poppins", ui-sans-serif, system-ui, sans-serif',
    googleQuery: "Poppins:wght@400;600;700",
  },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    family: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    googleQuery: "Plus+Jakarta+Sans:wght@400;600;700",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    family: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
    googleQuery: "Montserrat:wght@400;600;700",
  },
  {
    id: "sora",
    label: "Sora",
    family: '"Sora", ui-sans-serif, system-ui, sans-serif',
    googleQuery: "Sora:wght@400;600;700",
  },
];

export const COLOR_PRESETS: readonly string[] = [
  "#9a8468",
  "#000000",
  "#ea580c",
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#db2777",
  "#EFA188",
  "rgba(234, 88, 12, 0.85)",
  "rgba(37, 99, 235, 0.9)",
  "rgba(5, 150, 105, 0.88)",
  "rgba(124, 58, 237, 0.85)",
  "rgba(239, 161, 136, 0.95)",
  "rgba(15, 23, 42, 0.92)",
  "rgba(154, 132, 104, 0.9)",
];

export function getFontById(id: OnboardingFontId): OnboardingFontOption {
  return ONBOARDING_FONTS.find((f) => f.id === id) ?? ONBOARDING_FONTS[0];
}

export function buildGoogleFontsHref(fontIds: OnboardingFontId[]): string {
  const queries = fontIds.map((id) => getFontById(id).googleQuery).join("&family=");
  return `https://fonts.googleapis.com/css2?family=${queries}&display=swap`;
}

export function normalizeAccentColor(value: string): string {
  return value.trim() || "#9a8468";
}
