"use server";

import type { PartnershipWorkflowStatus } from "@/domain/partnershipRequest";
import { requireSessionProfile } from "@/lib/auth/guards";
import { updatePartnershipRequestStatus } from "@/lib/partnerships/partnershipRepository";
import { createClient } from "@/lib/supabase/server";
import { defaultLocale } from "@/i18n/config";

export async function updatePartnershipRequestAction(input: {
  requestId: string;
  workflowStatus: PartnershipWorkflowStatus;
}) {
  const session = await requireSessionProfile(defaultLocale);
  const supabase = await createClient();

  const result = await updatePartnershipRequestStatus(
    supabase,
    session.workspaceId,
    input.requestId,
    input.workflowStatus,
  );

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  return { ok: true as const, request: result.request };
}
