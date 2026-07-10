import { NextResponse } from "next/server";
import type { UrgencyClickCaptureInput } from "@/domain/captureLead";
import { createAdminClient } from "@/lib/supabase/admin";
import { captureUrgencyClick } from "@/services/captureLeadService";

export const runtime = "nodejs";

function parseUrgencyClickBody(body: unknown): UrgencyClickCaptureInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  const pageSlug = String(raw.pageSlug ?? "").trim();
  const leadDescription = String(raw.leadDescription ?? "").trim();
  if (!pageSlug || !leadDescription) return null;

  return {
    pageSlug,
    zone: String(raw.zone ?? "").trim() || undefined,
    leadDescription,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseUrgencyClickBody(body);

    if (!input) {
      return NextResponse.json(
        { ok: false, error: "Données invalides." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Service momentanément indisponible." },
        { status: 503 },
      );
    }

    const result = await captureUrgencyClick(supabase, input);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, leadId: result.leadId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Enregistrement impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
