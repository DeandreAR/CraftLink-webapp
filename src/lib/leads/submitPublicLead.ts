import type { PublicLeadCaptureInput } from "@/domain/captureLead";

export type SubmitPublicLeadResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

export async function submitPublicLead(
  input: PublicLeadCaptureInput,
): Promise<SubmitPublicLeadResult> {
  const response = await fetch("/api/leads/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as {
    ok?: boolean;
    leadId?: string;
    error?: string;
  };

  if (!response.ok || !payload.ok || !payload.leadId) {
    return {
      ok: false,
      error: payload.error ?? "Soumission impossible. Réessayez dans un instant.",
    };
  }

  return { ok: true, leadId: payload.leadId };
}
