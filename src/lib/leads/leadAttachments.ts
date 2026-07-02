import type { LeadAttachment } from "@/domain/lead";

export const LEAD_DOCUMENTS_BUCKET = "lead-documents";

export const LEAD_ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;

export const LEAD_ATTACHMENT_TOO_LARGE_MESSAGE =
  "Fichier trop volumineux. La taille maximale autorisée pour les devis et factures est de 5 Mo.";

export const LEAD_ATTACHMENT_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/gif",
]);

export function sanitizeLeadFileName(name: string): string {
  const base = name.trim().replace(/[^\w.\-() ]+/g, "_");
  return base.slice(0, 120) || "document";
}

export function buildLeadAttachmentStoragePath(
  workspaceId: string,
  leadId: string,
  fileName: string,
): string {
  return `${workspaceId}/${leadId}/${Date.now()}-${sanitizeLeadFileName(fileName)}`;
}

export function createLeadAttachmentRecord(input: {
  url: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
}): LeadAttachment {
  return {
    id: crypto.randomUUID(),
    url: input.url,
    fileName: input.fileName,
    mimeType: input.mimeType,
    uploadedAt: new Date().toISOString(),
    storagePath: input.storagePath,
  };
}
