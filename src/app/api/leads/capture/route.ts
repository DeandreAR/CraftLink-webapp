import { NextResponse } from "next/server";
import type { PublicLeadCaptureInput } from "@/domain/captureLead";
import type { LeadDelayStatus } from "@/domain/lead";
import type { VitrineOpenIntent } from "@/domain/vitrine";
import { createAdminClient } from "@/lib/supabase/admin";
import { capturePublicLead } from "@/services/captureLeadService";

export const runtime = "nodejs";

const VALID_DELAY_STATUSES = new Set<LeadDelayStatus>([
  "urgent",
  "asap",
  "planned",
  "info",
]);

function parseCaptureBody(body: unknown): PublicLeadCaptureInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  const delayStatus = String(raw.delayStatus ?? "");
  if (!VALID_DELAY_STATUSES.has(delayStatus as LeadDelayStatus)) return null;

  return {
    pageSlug: String(raw.pageSlug ?? ""),
    clientName: String(raw.clientName ?? ""),
    clientPhone: String(raw.clientPhone ?? ""),
    clientEmail: String(raw.clientEmail ?? ""),
    delayStatus: delayStatus as LeadDelayStatus,
    description: String(raw.description ?? ""),
    workType: String(raw.workType ?? ""),
    zone: String(raw.zone ?? ""),
    needNature: raw.needNature != null ? String(raw.needNature) : null,
    openIntent: raw.openIntent as VitrineOpenIntent | undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseCaptureBody(body);

    if (!input) {
      return NextResponse.json(
        { ok: false, error: "Données de formulaire invalides." },
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

    const result = await capturePublicLead(supabase, input);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, leadId: result.leadId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Soumission impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
