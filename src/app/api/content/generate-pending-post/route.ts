import { NextResponse } from "next/server";
import { generateCraftlinkConcept } from "@/lib/content/instagram/geminiCraftlinkPost";
import { fetchOgImageBuffer } from "@/lib/content/instagram/fetchOgImage";
import { savePendingPost } from "@/lib/content/instagram/savePendingPost";

export const runtime = "nodejs";

/**
 * Route de test locale uniquement.
 * POST /api/content/generate-pending-post
 *
 * Gemini → PNG (/api/og-image) → fichiers dans public/pending_posts/.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Route désactivée en production." },
      { status: 403 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const concept = await generateCraftlinkConcept();
    const imageBuffer = await fetchOgImageBuffer(concept, origin);
    const artifacts = await savePendingPost(concept, imageBuffer);

    return NextResponse.json({
      ok: true,
      concept,
      files: {
        image: artifacts.imagePath,
        caption: artifacts.captionPath,
        stamp: artifacts.stamp,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    console.error("[api/content/generate-pending-post]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
