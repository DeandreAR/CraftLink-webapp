import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import { fetchPartnershipRequestsByWorkspace } from "@/lib/partnerships/partnershipRepository";
import { createClient } from "@/lib/supabase/server";

export type WorkspacePartnershipRequestsPayload = {
  requests: DashboardPartnershipRequest[];
  loadError: string | null;
};

export async function loadWorkspacePartnershipRequestsForSession(
  session: WorkspaceSession,
): Promise<WorkspacePartnershipRequestsPayload> {
  const supabase = await createClient();
  const result = await fetchPartnershipRequestsByWorkspace(supabase, session.workspaceId);

  if (!result.ok) {
    if (process.env.NODE_ENV === "development") {
      console.error("[loadWorkspacePartnershipRequests]", result.message);
    }
    return { requests: [], loadError: result.message };
  }

  return { requests: result.requests, loadError: null };
}
