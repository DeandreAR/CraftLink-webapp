import type { DashboardLead } from "@/domain/lead";
import type { WorkspaceSession } from "@/lib/auth/sessionContext";
import { fetchLeadsByWorkspace } from "@/lib/leads/leadRepository";
import { createClient } from "@/lib/supabase/server";

export type WorkspaceLeadsPayload = {
  leads: DashboardLead[];
  loadError: string | null;
};

/** Charge les leads côté serveur (session déjà validée sur la page dashboard). */
export async function loadWorkspaceLeadsForSession(
  session: WorkspaceSession,
): Promise<WorkspaceLeadsPayload> {
  const supabase = await createClient();
  const result = await fetchLeadsByWorkspace(supabase, session.workspaceId);

  if (!result.ok) {
    if (process.env.NODE_ENV === "development") {
      console.error("[loadWorkspaceLeads]", result.message);
    }
    return { leads: [], loadError: result.message };
  }

  return { leads: result.leads, loadError: null };
}
