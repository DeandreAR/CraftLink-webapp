import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { METIER_KEYS } from "@/lib/onboarding/metierOptions";

const METIER_KEYWORDS: Record<MetierKey, readonly string[]> = {
  ELECTRICIEN: [
    "électric",
    "electric",
    "domotique",
    "tableau électrique",
    "irve",
    "borne de recharge",
    "photovolta",
    "courant faible",
  ],
  PLOMBIER: ["plomb", "plumb", "chauffag", "sanitaire", "chaudière", "chauffe-eau", "dépannage eau"],
  MENUISIER: ["menuiser", "carpent", "ébénist", "agencement", "parquet", "escalier bois"],
  SERRURIER: ["serrur", "locksmith", "blindage", "porte blindée", "cylindre"],
  PLAQUISTE: ["plaquist", "placo", "drywall", "isolation", "cloison sèche"],
  PEINTRE: ["peint", "paint", "finition", "enduit décoratif", "ravalement"],
  PAYSAGISTE: ["paysag", "landscap", "jardin", "terrasse bois", "engazonnement"],
  COUVREUR: ["couvreur", "roof", "toiture", "tuile", "zinguerie", "gouttière"],
  CARRELEUR: ["carrel", "tiler", "faïence", "mosaïque", "marbre"],
  CHARPENTIER: ["charpent", "ossature bois", "fermette", "comble"],
  MACON: ["maçon", "mason", "gros œuvre", "béton", "mur porteur", "parpaing"],
  RENOVATION_GENERALE: [
    "rénovation",
    "renovation",
    "travaux tous corps",
    "contractant général",
    "réhabilitation",
    "home staging",
  ],
};

export function inferMetierFromBio(bio: string): MetierKey | "" {
  const text = bio.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  if (!text.trim()) return "";

  let best: MetierKey | "" = "";
  let bestScore = 0;

  for (const key of METIER_KEYS) {
    let score = 0;
    for (const keyword of METIER_KEYWORDS[key]) {
      const normalized = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      if (text.includes(normalized)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }

  return bestScore > 0 ? best : "";
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
