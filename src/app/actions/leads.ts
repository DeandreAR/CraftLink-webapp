"use server";

import { revalidatePath } from "next/cache";
import type { DashboardLead } from "@/domain/lead";
import { resolveProfileWorkspaceId } from "@/lib/auth/workspaceId";
import { createClient } from "@/lib/supabase/server";
import {
  fetchLeadsByWorkspace,
  updateLeadById,
} from "@/lib/leads/leadRepository";

export type GetWorkspaceLeadsResult =
  | { ok: true; leads: DashboardLead[] }
  | { ok: false; message: string };

/** Charge les leads du workspace de l'utilisateur connecté (ignore le param client). */
export async function getWorkspaceLeadsAction(
  _workspaceId?: string,
): Promise<GetWorkspaceLeadsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", user.id)
    .maybeSingle();

  const workspaceId = resolveProfileWorkspaceId(
    user.id,
    profile?.workspace_id as string | null | undefined,
  );

  return fetchLeadsByWorkspace(supabase, workspaceId);
}

export type UpdateLeadResult =
  | { ok: true; lead: DashboardLead }
  | { ok: false; message: string };

export async function updateLeadAction(
  leadId: string,
  patch: Partial<DashboardLead>,
): Promise<UpdateLeadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const result = await updateLeadById(supabase, leadId, patch);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/[lang]/dashboard", "page");
    revalidatePath(`/share/${leadId}`);
  }
  return result;
}
