/** Minuscules + suppression des accents pour matching déterministe. */
export function normalizeForJobMatching(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[''`]/g, "'");
}
