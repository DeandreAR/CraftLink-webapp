"use server";

import { revalidatePath } from "next/cache";
import type { DashboardLead, LeadAttachment } from "@/domain/lead";
import { resolveProfileWorkspaceId } from "@/lib/auth/workspaceId";
import {
  buildLeadAttachmentStoragePath,
  createLeadAttachmentRecord,
  LEAD_ATTACHMENT_MAX_BYTES,
  LEAD_ATTACHMENT_TOO_LARGE_MESSAGE,
  LEAD_ATTACHMENT_MIME_TYPES,
  LEAD_DOCUMENTS_BUCKET,
} from "@/lib/leads/leadAttachments";
import {
  fetchLeadById,
  fetchLeadsByWorkspace,
  touchLeadUpdatedAt,
  updateLeadById,
} from "@/lib/leads/leadRepository";
import type { CatchUpAction } from "@/lib/leads/smartCatchUp";
import { createClient } from "@/lib/supabase/server";

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

function revalidateLeadPaths(leadId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/[lang]/dashboard", "page");
  revalidatePath(`/share/${leadId}`);
}

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
    revalidateLeadPaths(leadId);
  }
  return result;
}

/** Smart Catch-up : devis envoyé, perdu, ou report de relance. */
export async function catchUpLeadAction(
  leadId: string,
  action: CatchUpAction,
): Promise<UpdateLeadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  let result: UpdateLeadResult;

  switch (action) {
    case "quote_sent":
      result = await updateLeadById(supabase, leadId, { workflowStatus: "DEVIS_ENVOYE" });
      break;
    case "lost":
      result = await updateLeadById(supabase, leadId, { workflowStatus: "ARCHIVE" });
      break;
    case "snooze":
      result = await touchLeadUpdatedAt(supabase, leadId);
      break;
    default:
      return { ok: false, message: "Action inconnue." };
  }

  if (result.ok) {
    revalidateLeadPaths(leadId);
  }
  return result;
}

/** Téléverse un devis / une facture sur le lead. */
export async function uploadLeadAttachmentAction(
  leadId: string,
  formData: FormData,
): Promise<UpdateLeadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { ok: false, message: "Connexion requise." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Fichier invalide." };
  }

  if (file.size > LEAD_ATTACHMENT_MAX_BYTES) {
    return { ok: false, message: LEAD_ATTACHMENT_TOO_LARGE_MESSAGE };
  }

  const mimeType = file.type || "application/octet-stream";
  if (!LEAD_ATTACHMENT_MIME_TYPES.has(mimeType)) {
    return { ok: false, message: "Format non supporté (PDF ou image uniquement)." };
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

  const existing = await fetchLeadById(supabase, leadId);
  if (!existing.ok) {
    return existing;
  }

  const storagePath = buildLeadAttachmentStoragePath(workspaceId, leadId, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(LEAD_DOCUMENTS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, message: uploadError.message };
  }

  const { data: publicUrl } = supabase.storage
    .from(LEAD_DOCUMENTS_BUCKET)
    .getPublicUrl(storagePath);

  const attachment = createLeadAttachmentRecord({
    url: publicUrl.publicUrl,
    fileName: file.name,
    mimeType,
    storagePath,
  });

  const nextAttachments: LeadAttachment[] = [
    ...(existing.lead.attachments ?? []),
    attachment,
  ];

  const result = await updateLeadById(supabase, leadId, { attachments: nextAttachments });
  if (result.ok) {
    revalidateLeadPaths(leadId);
  }
  return result;
}
