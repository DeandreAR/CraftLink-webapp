import { NextResponse } from "next/server";
import type {
  PartnershipBudgetRange,
  PartnershipType,
  PublicPartnershipCaptureInput,
} from "@/domain/partnershipRequest";
import { createAdminClient } from "@/lib/supabase/admin";
import { capturePublicPartnershipRequest } from "@/services/capturePartnershipService";

export const runtime = "nodejs";

const PARTNERSHIP_TYPES = new Set<PartnershipType>([
  "advertising",
  "ugc",
  "product_test",
  "other",
]);

const BUDGET_RANGES = new Set<PartnershipBudgetRange>([
  "under_5k",
  "from_5k_to_15k",
  "from_15k_to_50k",
  "over_50k",
  "undisclosed",
]);

function parseBody(body: unknown): PublicPartnershipCaptureInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  const partnershipType = String(raw.partnershipType ?? "") as PartnershipType;
  if (!PARTNERSHIP_TYPES.has(partnershipType)) return null;

  const budgetRangeRaw = raw.budgetRange ? String(raw.budgetRange) : "";
  const budgetRange =
    budgetRangeRaw && BUDGET_RANGES.has(budgetRangeRaw as PartnershipBudgetRange)
      ? (budgetRangeRaw as PartnershipBudgetRange)
      : null;

  return {
    pageSlug: String(raw.pageSlug ?? ""),
    companyName: String(raw.companyName ?? ""),
    contactName: String(raw.contactName ?? ""),
    jobTitle: String(raw.jobTitle ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    partnershipType,
    budgetRange,
    budgetApproximate: raw.budgetApproximate ? String(raw.budgetApproximate) : null,
    message: String(raw.message ?? ""),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseBody(body);

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

    const result = await capturePublicPartnershipRequest(supabase, input);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, requestId: result.requestId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Soumission impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
