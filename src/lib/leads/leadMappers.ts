import type {
  DashboardLead,
  LeadAttachment,
  LeadContactStatus,
  LeadDelayStatus,
  LeadPhoto,
  LeadSchedule,
  LeadVoiceNote,
  LeadWorkflowStatus,
} from "@/domain/lead";

export type LeadRow = {
  id: string;
  workspace_id: string;
  request_number: number;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  created_at: string;
  updated_at: string;
  work_type: string;
  zone: string;
  delay_status: string;
  workflow_status: string;
  contact_status: string;
  contacted_at: string | null;
  quote_sent_at: string | null;
  invoice_sent_at: string | null;
  description: string;
  summary: string;
  voice: LeadVoiceNote | null;
  photos: LeadPhoto[] | null;
  schedule: LeadSchedule | null;
  attachments: LeadAttachment[] | null;
};

function parseVoice(raw: unknown): LeadVoiceNote | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Partial<LeadVoiceNote>;
  if (!v.audioUrl?.trim()) return null;
  return {
    audioUrl: v.audioUrl,
    transcript: v.transcript ?? "",
    summary: v.summary ?? "",
  };
}

function parsePhotos(raw: unknown): LeadPhoto[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is LeadPhoto => Boolean(item && typeof item === "object" && "url" in item))
    .map((item) => ({
      url: String(item.url),
      alt: item.alt ? String(item.alt) : undefined,
    }));
}

function parseSchedule(raw: unknown): LeadSchedule | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<LeadSchedule>;
  if (!s.date?.trim() || !s.durationPreset) return null;
  return {
    date: s.date,
    durationPreset: s.durationPreset,
    durationValue: s.durationValue,
  };
}

function parseAttachments(raw: unknown): LeadAttachment[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is LeadAttachment =>
        Boolean(item && typeof item === "object" && "url" in item && "fileName" in item),
    )
    .map((item) => ({
      id: String(item.id ?? item.url),
      url: String(item.url),
      fileName: String(item.fileName),
      mimeType: String(item.mimeType ?? "application/octet-stream"),
      uploadedAt: String(item.uploadedAt ?? new Date().toISOString()),
      storagePath: item.storagePath ? String(item.storagePath) : undefined,
    }));
}

export function mapLeadRowToDashboardLead(row: LeadRow): DashboardLead {
  return {
    id: row.id,
    requestNumber: row.request_number,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
    workType: row.work_type,
    zone: row.zone,
    delayStatus: row.delay_status as LeadDelayStatus,
    workflowStatus: row.workflow_status as LeadWorkflowStatus,
    contactStatus: row.contact_status as LeadContactStatus,
    contactedAt: row.contacted_at,
    quoteSentAt: row.quote_sent_at,
    invoiceSentAt: row.invoice_sent_at,
    description: row.description ?? "",
    summary: row.summary ?? "",
    voice: parseVoice(row.voice),
    photos: parsePhotos(row.photos),
    schedule: parseSchedule(row.schedule),
    attachments: parseAttachments(row.attachments),
  };
}

export function mapLeadPatchToRow(
  patch: Partial<DashboardLead>,
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (patch.clientName !== undefined) row.client_name = patch.clientName;
  if (patch.clientPhone !== undefined) row.client_phone = patch.clientPhone;
  if (patch.clientEmail !== undefined) row.client_email = patch.clientEmail;
  if (patch.workType !== undefined) row.work_type = patch.workType;
  if (patch.zone !== undefined) row.zone = patch.zone;
  if (patch.delayStatus !== undefined) row.delay_status = patch.delayStatus;
  if (patch.workflowStatus !== undefined) row.workflow_status = patch.workflowStatus;
  if (patch.contactStatus !== undefined) row.contact_status = patch.contactStatus;
  if (patch.contactedAt !== undefined) row.contacted_at = patch.contactedAt;
  if (patch.quoteSentAt !== undefined) row.quote_sent_at = patch.quoteSentAt;
  if (patch.invoiceSentAt !== undefined) row.invoice_sent_at = patch.invoiceSentAt;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.summary !== undefined) row.summary = patch.summary;
  if (patch.voice !== undefined) row.voice = patch.voice;
  if (patch.photos !== undefined) row.photos = patch.photos;
  if (patch.schedule !== undefined) row.schedule = patch.schedule;
  if (patch.attachments !== undefined) row.attachments = patch.attachments;

  return row;
}
