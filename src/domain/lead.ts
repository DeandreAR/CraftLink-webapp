import type { LeadUrgency } from "@/domain/vitrine";

/** Délai souhaité par le client (affiché comme « Statut » dans le CRM). */
export type LeadDelayStatus = LeadUrgency;

export type LeadWorkflowStatus = "active" | "done" | "archived";

/** Suivi du premier contact WhatsApp artisan → client. */
export type LeadContactStatus = "pending" | "contacted";

/** Unité de durée pour la planification d'une réalisation. */
export type LeadDurationPreset = "minutes" | "hours" | "half_day" | "full_day";

/** Planification artisan (date + durée estimée). */
export type LeadSchedule = {
  /** Date prévue (YYYY-MM-DD). */
  date: string;
  durationPreset: LeadDurationPreset;
  /** Valeur numérique pour minutes ou heures. */
  durationValue?: number;
};

/** Message vocal client (Whisper + résumé IA). */
export type LeadVoiceNote = {
  audioUrl: string;
  /** Transcription brute (Whisper). */
  transcript: string;
  /** Résumé structuré (GPT) — alimente aussi la colonne Travaux. */
  summary: string;
};

/** Photo jointe à la demande. */
export type LeadPhoto = {
  url: string;
  alt?: string;
};

/** Lead affiché dans le CRM artisan (tableau de bord). */
export type DashboardLead = {
  id: string;
  /** Numéro de demande affiché (ex. 3801 → « 3801 »). */
  requestNumber: number;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  /** Intitulé court des travaux (résumé IA si vocal). */
  workType: string;
  zone: string;
  delayStatus: LeadDelayStatus;
  workflowStatus: LeadWorkflowStatus;
  contactStatus: LeadContactStatus;
  /** Horodatage ISO du contact WhatsApp. */
  contactedAt?: string | null;
  /** Description textuelle du besoin (formulaire client). */
  description: string;
  /** Notes complémentaires / dossier structuré (legacy). */
  summary: string;
  /** Message vocal + transcription + résumé IA. */
  voice?: LeadVoiceNote | null;
  /** Photos jointes par le client. */
  photos?: LeadPhoto[];
  /** Planification de la réalisation (optionnel). */
  schedule?: LeadSchedule | null;
};

export const LEAD_DELAY_STATUSES: LeadDelayStatus[] = [
  "urgent",
  "asap",
  "planned",
  "info",
];

export const LEAD_WORKFLOW_STATUSES: LeadWorkflowStatus[] = [
  "active",
  "done",
  "archived",
];
