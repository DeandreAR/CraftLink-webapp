import type {
  PartnershipBudgetRange,
  PartnershipType,
  PublicPartnershipCaptureResult,
} from "@/domain/partnershipRequest";

export type SubmitPartnershipRequestInput = {
  pageSlug: string;
  companyName: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  budgetRange: PartnershipBudgetRange | null;
  budgetApproximate: string | null;
  message: string;
};

export async function submitPartnershipRequest(
  input: SubmitPartnershipRequestInput,
): Promise<PublicPartnershipCaptureResult> {
  const response = await fetch("/api/partnerships/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    ok?: boolean;
    requestId?: string;
    error?: string;
  };

  if (!response.ok || !data.ok || !data.requestId) {
    return { ok: false, message: data.error ?? "Soumission impossible." };
  }

  return { ok: true, requestId: data.requestId };
}
