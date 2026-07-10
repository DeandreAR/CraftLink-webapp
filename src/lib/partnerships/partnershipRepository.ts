import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DashboardPartnershipRequest,
  PartnershipWorkflowStatus,
} from "@/domain/partnershipRequest";
import {
  mapPartnershipRowToDashboard,
  type PartnershipRequestRow,
} from "@/lib/partnerships/partnershipMappers";

const SELECT =
  "id, workspace_id, company_name, contact_name, job_title, email, phone, partnership_type, budget_range, budget_approximate, message, workflow_status, created_at, updated_at";

export async function fetchPartnershipRequestsByWorkspace(
  supabase: SupabaseClient,
  workspaceId: string,
): Promise<
  { ok: true; requests: DashboardPartnershipRequest[] } | { ok: false; message: string }
> {
  const { data, error } = await supabase
    .from("partnership_requests")
    .select(SELECT)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    requests: (data as PartnershipRequestRow[]).map(mapPartnershipRowToDashboard),
  };
}

export async function updatePartnershipRequestStatus(
  supabase: SupabaseClient,
  workspaceId: string,
  requestId: string,
  workflowStatus: PartnershipWorkflowStatus,
): Promise<
  { ok: true; request: DashboardPartnershipRequest } | { ok: false; message: string }
> {
  const { data, error } = await supabase
    .from("partnership_requests")
    .update({ workflow_status: workflowStatus })
    .eq("id", requestId)
    .eq("workspace_id", workspaceId)
    .select(SELECT)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Demande introuvable." };
  }

  return { ok: true, request: mapPartnershipRowToDashboard(data as PartnershipRequestRow) };
}
