export type SubmitUrgencyClickInput = {
  pageSlug: string;
  zone?: string;
  leadDescription: string;
};

export type SubmitUrgencyClickResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

/** Enregistre un clic urgence WhatsApp côté CRM (fire-and-forget côté UI). */
export async function submitUrgencyClick(
  input: SubmitUrgencyClickInput,
): Promise<SubmitUrgencyClickResult> {
  const response = await fetch("/api/leads/urgency-click", {
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
      error: payload.error ?? "Enregistrement impossible.",
    };
  }

  return { ok: true, leadId: payload.leadId };
}
