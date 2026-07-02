import type { LeadDelayStatus } from "@/domain/lead";
import type { VitrineOpenIntent } from "@/domain/vitrine";

export type PublicLeadCaptureInput = {
  pageSlug: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  delayStatus: LeadDelayStatus;
  description: string;
  workType: string;
  zone: string;
  openIntent?: VitrineOpenIntent;
};

export type PublicLeadCaptureResult =
  | { ok: true; leadId: string }
  | { ok: false; message: string };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePublicLeadCaptureInput(
  input: PublicLeadCaptureInput,
): string | null {
  if (!input.pageSlug.trim()) return "Page artisan introuvable.";
  if (!input.clientName.trim()) return "Nom client requis.";
  if (!input.clientPhone.trim()) return "Téléphone client requis.";
  if (!input.clientEmail.trim() || !isValidEmail(input.clientEmail)) {
    return "E-mail client invalide.";
  }
  if (!input.description.trim()) return "Description requise.";
  if (!input.workType.trim()) return "Type de travaux requis.";
  return null;
}
