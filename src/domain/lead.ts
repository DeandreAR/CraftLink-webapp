import type { LeadUrgency } from "@/domain/vitrine";

/** Délai souhaité par le client (affiché comme « Statut » dans le CRM). */
export type LeadDelayStatus = LeadUrgency;

export type LeadWorkflowStatus = "active" | "done" | "archived";

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

/** Lead affiché dans le CRM artisan (tableau de bord). */
export type DashboardLead = {
  id: string;
  /** Numéro de demande affiché (ex. 3801 → « 3801 »). */
  requestNumber: number;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  workType: string;
  zone: string;
  delayStatus: LeadDelayStatus;
  workflowStatus: LeadWorkflowStatus;
  /** Résumé structuré du dossier (description projet, accès, etc.). */
  summary: string;
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
