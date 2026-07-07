import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PublicLeadCaptureInput,
  PublicLeadCaptureResult,
  UrgencyClickCaptureInput,
  UrgencyClickCaptureResult,
} from "@/domain/captureLead";
import { validateUrgencyClickCaptureInput } from "@/domain/captureLead";
import { validatePublicLeadCaptureInput } from "@/domain/captureLead";
import {
  sendClientAcknowledgmentEmail,
  type ArtisanEmailProfile,
} from "@/lib/email/sendClientAcknowledgmentEmail";
import { mapLeadRowToDashboardLead, type LeadRow } from "@/lib/leads/leadMappers";
import { sanitizePageSlugInput } from "@/lib/onboarding/pageSlug";

const PROFILE_SELECT = "id, workspace_id, full_name";

type ResolvedArtisanProfile = {
  workspaceId: string;
  artisan: ArtisanEmailProfile;
};

async function resolveArtisanByPageSlug(
  supabase: SupabaseClient,
  pageSlug: string,
): Promise<ResolvedArtisanProfile | null> {
  const normalizedSlug = sanitizePageSlugInput(pageSlug);
  if (!normalizedSlug) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("page_slug", normalizedSlug)
    .maybeSingle();

  if (error || !profile) return null;

  const workspaceId = String(profile.workspace_id ?? profile.id);
  const businessName = String(profile.full_name ?? "").trim() || "Votre artisan";

  const { data: authData } = await supabase.auth.admin.getUserById(String(profile.id));
  const artisanEmail = authData?.user?.email?.trim() ?? "";

  return {
    workspaceId,
    artisan: {
      email: artisanEmail,
      businessName,
    },
  };
}

async function insertPublicLead(
  supabase: SupabaseClient,
  workspaceId: string,
  input: PublicLeadCaptureInput,
): Promise<{ ok: true; row: LeadRow } | { ok: false; message: string }> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      workspace_id: workspaceId,
      client_name: input.clientName.trim(),
      client_phone: input.clientPhone.trim(),
      client_email: input.clientEmail.trim().toLowerCase(),
      work_type: input.workType.trim(),
      zone: input.zone.trim(),
      delay_status: input.delayStatus,
      workflow_status: "A_TRAITER",
      contact_status: "pending",
      description: input.description.trim(),
      summary: input.description.trim(),
      photos: [],
    })
    .select(
      "id, workspace_id, request_number, client_name, client_phone, client_email, created_at, updated_at, work_type, zone, delay_status, workflow_status, contact_status, contacted_at, quote_sent_at, invoice_sent_at, description, summary, voice, photos, schedule, attachments",
    )
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Création du dossier impossible." };
  }

  return { ok: true, row: data as LeadRow };
}

/**
 * Capture publique anonyme : insert lead + accusé de réception e-mail.
 * L'échec d'envoi e-mail n'annule pas la création du dossier.
 */
export async function capturePublicLead(
  supabase: SupabaseClient,
  input: PublicLeadCaptureInput,
): Promise<PublicLeadCaptureResult> {
  const validationError = validatePublicLeadCaptureInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const artisanContext = await resolveArtisanByPageSlug(supabase, input.pageSlug);
  if (!artisanContext) {
    return { ok: false, message: "Artisan introuvable pour cette page." };
  }

  const inserted = await insertPublicLead(supabase, artisanContext.workspaceId, input);
  if (!inserted.ok) {
    return { ok: false, message: inserted.message };
  }

  const lead = mapLeadRowToDashboardLead(inserted.row);

  try {
    const emailResult = await sendClientAcknowledgmentEmail(
      {
        id: lead.id,
        requestNumber: lead.requestNumber,
        clientEmail: input.clientEmail,
      },
      artisanContext.artisan,
    );

    if (!emailResult.ok && process.env.NODE_ENV === "development") {
      console.warn("[capturePublicLead] Accusé e-mail non envoyé :", emailResult.error);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[capturePublicLead] Accusé e-mail en erreur :", error);
    }
  }

  return { ok: true, leadId: lead.id };
}

const URGENCY_CLICK_WORK_TYPE = "Urgence WhatsApp — clic direct";

/**
 * Clic urgence WhatsApp : trace minimale dans le CRM (sans coordonnées client).
 */
export async function captureUrgencyClick(
  supabase: SupabaseClient,
  input: UrgencyClickCaptureInput,
): Promise<UrgencyClickCaptureResult> {
  const validationError = validateUrgencyClickCaptureInput(input);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const artisanContext = await resolveArtisanByPageSlug(supabase, input.pageSlug);
  if (!artisanContext) {
    return { ok: false, message: "Artisan introuvable pour cette page." };
  }

  const description = input.leadDescription.trim();
  const zone = input.zone?.trim() ?? "";

  const inserted = await insertPublicLead(supabase, artisanContext.workspaceId, {
    pageSlug: input.pageSlug,
    clientName: "Visiteur (urgence WhatsApp)",
    clientPhone: "Non renseigné",
    clientEmail: "urgence-whatsapp@craftlink.local",
    delayStatus: "urgent",
    description,
    workType: URGENCY_CLICK_WORK_TYPE,
    zone,
    openIntent: "urgent",
  });

  if (!inserted.ok) {
    return { ok: false, message: inserted.message };
  }

  const lead = mapLeadRowToDashboardLead(inserted.row);
  return { ok: true, leadId: lead.id };
}
