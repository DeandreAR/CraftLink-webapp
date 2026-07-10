import { NextResponse } from "next/server";
import { processLeadVoice } from "@/lib/leads/processLeadVoice";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "Fichier audio requis." }, { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const mimeType = audio.type || "audio/webm";
    const result = await processLeadVoice(buffer, mimeType);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Traitement vocal impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
