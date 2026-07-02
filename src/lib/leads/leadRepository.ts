import type { SupabaseClient } from "@supabase/supabase-js";
import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardLead } from "@/domain/lead";
import {
  mapLeadPatchToRow,
  mapLeadRowToDashboardLead,
  type LeadRow,
} from "@/lib/leads/leadMappers";
import { enrichWorkflowStatusPatch } from "@/lib/leads/workflowStatusPatch";

const LEAD_SELECT = `
  id,
  workspace_id,
  request_number,
  client_name,
  client_phone,
  created_at,
  updated_at,
  work_type,
  zone,
  delay_status,
  workflow_status,
  contact_status,
  contacted_at,
  quote_sent_at,
  invoice_sent_at,
  description,
  summary,
  voice,
  photos,
  schedule,
  attachments
`;

export async function fetchLeadsByWorkspace(
  supabase: SupabaseClient,
  workspaceId: string,
): Promise<{ ok: true; leads: DashboardLead[] } | { ok: false; message: string }> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, message: error.message };
  }

  const leads = (data as LeadRow[]).map(mapLeadRowToDashboardLead);
  return { ok: true, leads };
}

export async function fetchLeadById(
  supabase: SupabaseClient,
  leadId: string,
): Promise<{ ok: true; lead: DashboardLead } | { ok: false; message: string }> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Lead introuvable." };
  }

  return { ok: true, lead: mapLeadRowToDashboardLead(data as LeadRow) };
}

export async function touchLeadUpdatedAt(
  supabase: SupabaseClient,
  leadId: string,
): Promise<{ ok: true; lead: DashboardLead } | { ok: false; message: string }> {
  const { data, error } = await supabase
    .from("leads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", leadId)
    .select(LEAD_SELECT)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Lead introuvable." };
  }

  return { ok: true, lead: mapLeadRowToDashboardLead(data as LeadRow) };
}

export type PublicLeadShareRow = {
  lead: DashboardLead;
  businessName: string;
  ownerPlan: CraftlinkPlan;
};

export async function fetchPublicLeadShare(
  supabase: SupabaseClient,
  leadId: string,
): Promise<PublicLeadShareRow | null> {
  const { data: leadData, error: leadError } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", leadId)
    .maybeSingle();

  if (leadError || !leadData) {
    return null;
  }

  const row = leadData as LeadRow;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("plan_tier, full_name")
    .eq("workspace_id", row.workspace_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    lead: mapLeadRowToDashboardLead(row),
    businessName: (profileData?.full_name as string | null)?.trim() || "Artisan CraftLink",
    ownerPlan: resolveCraftlinkPlan(String(profileData?.plan_tier ?? "")),
  };
}

export async function updateLeadById(
  supabase: SupabaseClient,
  leadId: string,
  patch: Partial<DashboardLead>,
): Promise<{ ok: true; lead: DashboardLead } | { ok: false; message: string }> {
  const existing = await fetchLeadById(supabase, leadId);
  if (!existing.ok) return existing;

  const enrichedPatch = enrichWorkflowStatusPatch(existing.lead, patch);
  const rowPatch = mapLeadPatchToRow(enrichedPatch);
  if (Object.keys(rowPatch).length === 0) {
    return existing;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(rowPatch)
    .eq("id", leadId)
    .select(LEAD_SELECT)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Lead introuvable." };
  }

  return { ok: true, lead: mapLeadRowToDashboardLead(data as LeadRow) };
}
