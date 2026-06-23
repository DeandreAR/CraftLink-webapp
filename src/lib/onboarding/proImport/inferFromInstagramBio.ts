import { detectMetierFromImport } from "@/lib/onboarding/jobDetection";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

/** @deprecated Préférer `detectMetierFromImport` — conservé pour les appels legacy bio seule. */
export function inferMetierFromBio(bio: string, businessName = ""): MetierKey | "" {
  const detected = detectMetierFromImport({
    source: "instagram",
    businessName,
    biographyOrDesc: bio,
  });
  return detected ?? "";
}

export function inferCityFromBio(bio: string): string {
  const lines = bio.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.includes("📍")) {
      const city = line.replace(/📍/g, "").trim();
      if (city.length >= 2 && city.length <= 40) return city;
    }
  }

  const based = bio.match(
    /\b(?:à|a|based in|based at|situé[eà]?\s+(?:à|a))\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s\-']{1,28})/i,
  );
  if (based?.[1]) {
    return based[1].trim().replace(/\s*,.*$/, "");
  }

  return "";
}

export function inferExperienceYearsFromBio(bio: string): number | null {
  const yearsMatch = bio.match(
    /(\d{1,2})\s*\+?\s*(?:ans|années|years)(?:\s+d['']expérience|\s+of experience)?/i,
  );
  if (yearsMatch) {
    const years = Number.parseInt(yearsMatch[1], 10);
    return years > 0 && years <= 50 ? years : null;
  }

  const sinceMatch = bio.match(/depuis\s+(\d{4})/i);
  if (sinceMatch) {
    const startYear = Number.parseInt(sinceMatch[1], 10);
    const years = new Date().getFullYear() - startYear;
    return years > 0 && years <= 50 ? years : null;
  }

  return null;
}

export function inferTradeLabelFromBio(bio: string): string {
  const firstLine = bio.split("\n").map((l) => l.trim()).find(Boolean);
  if (!firstLine) return "";
  const cleaned = firstLine.replace(/[|•·]/g, " ").trim();
  return cleaned.length <= 60 ? cleaned : `${cleaned.slice(0, 57)}…`;
}
