import type { CraftlinkInstagramConcept } from "./types";

/**
 * Construit l’URL locale `/api/og-image` avec encodeURIComponent
 * sur name / job / text_visuel.
 */
export function buildOgImageUrl(
  concept: CraftlinkInstagramConcept,
  baseUrl = process.env.OG_IMAGE_BASE_URL ?? "http://localhost:3000",
): string {
  const origin = baseUrl.replace(/\/+$/, "");
  return (
    `${origin}/api/og-image` +
    `?name=${encodeURIComponent(concept.name)}` +
    `&job=${encodeURIComponent(concept.job)}` +
    `&text=${encodeURIComponent(concept.text_visuel)}`
  );
}

/**
 * Fetch le PNG généré par la route Edge `/api/og-image`.
 * Prérequis : `npm run dev` (ou le serveur) doit tourner sur baseUrl.
 */
export async function fetchOgImageBuffer(
  concept: CraftlinkInstagramConcept,
  baseUrl?: string,
): Promise<Buffer> {
  const url = buildOgImageUrl(concept, baseUrl);
  console.log(`[instagram-content] OG → ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Échec /api/og-image (${response.status}) : ${body.slice(0, 200) || response.statusText}. ` +
        `Vérifie que Next tourne sur ${baseUrl ?? "http://localhost:3000"}.`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("image/png") && !contentType.includes("octet-stream")) {
    throw new Error(
      `Réponse inattendue de /api/og-image (Content-Type: ${contentType || "inconnu"}).`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
