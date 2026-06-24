import type { LeadUrgency } from "@/domain/vitrine";

/** Délai souhaité par le client (affiché comme « Statut » dans le CRM). */
export type LeadDelayStatus = LeadUrgency;

export type LeadWorkflowStatus = "active" | "done" | "archived";

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
