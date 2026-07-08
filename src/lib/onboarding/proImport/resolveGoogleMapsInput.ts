import { providerFetch } from "@/lib/onboarding/proImport/api/providerHttp";
import { parseGoogleIdentifier } from "@/lib/onboarding/proImport/parseGoogleIdentifier";

/**
 * Suit les redirections HTTP des liens courts (goo.gl, maps.app.goo.gl…).
 * Les liens share.google redirigent souvent vers une page Search non exploitable — on garde l’URL d’origine.
 */
export async function resolveGoogleMapsInput(raw: string): Promise<string> {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const parsed = parseGoogleIdentifier(trimmed);
  if (parsed.kind !== "url") {
    return trimmed;
  }

  try {
    const response = await providerFetch(parsed.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CraftLink/1.0; +https://getcraftlink.com)",
      },
    });

    const finalUrl = response.url?.trim();
    if (!finalUrl || finalUrl === parsed.url) {
      return trimmed;
    }

    const finalParsed = parseGoogleIdentifier(finalUrl);
    if (finalParsed.kind === "place_id" || finalParsed.kind === "url") {
      return finalUrl;
    }
  } catch {
    // Lien court non résolu — on tentera SerpApi avec l’identifiant brut.
  }

  return trimmed;
}
