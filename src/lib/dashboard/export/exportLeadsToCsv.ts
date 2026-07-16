import type { DashboardLead, LeadWorkflowStatus } from "@/domain/lead";
import type { Locale } from "@/i18n/config";

export type LeadCsvColumnLabels = {
  date: string;
  clientName: string;
  phone: string;
  email: string;
  projectType: string;
  status: string;
  description: string;
};

export type LeadCsvStatusLabels = Record<LeadWorkflowStatus, string>;

function csvSeparator(locale: Locale): string {
  return locale === "fr" ? ";" : ",";
}

function escapeCsvCell(value: string, separator: string): string {
  if (/["\n\r]/.test(value) || value.includes(separator)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatLeadDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function leadDescription(lead: DashboardLead): string {
  return lead.description?.trim() || lead.summary?.trim() || "";
}

function leadToRow(
  lead: DashboardLead,
  statusLabels: LeadCsvStatusLabels,
  locale: Locale,
): string[] {
  return [
    formatLeadDate(lead.createdAt, locale),
    lead.clientName.trim(),
    lead.clientPhone.trim(),
    lead.clientEmail?.trim() ?? "",
    lead.workType.trim(),
    statusLabels[lead.workflowStatus] ?? lead.workflowStatus,
    leadDescription(lead),
  ];
}

/** Convertit les demandes actives en CSV (Excel / Google Sheets). */
export function leadsToCsv(
  leads: DashboardLead[],
  columns: LeadCsvColumnLabels,
  statusLabels: LeadCsvStatusLabels,
  locale: Locale,
): string {
  const separator = csvSeparator(locale);
  const header = [
    columns.date,
    columns.clientName,
    columns.phone,
    columns.email,
    columns.projectType,
    columns.status,
    columns.description,
  ];

  const rows = leads.map((lead) => leadToRow(lead, statusLabels, locale));
  return [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell, separator)).join(separator))
    .join("\r\n");
}

export function buildLeadsCsvFilename(locale: Locale): string {
  const day = new Date().toISOString().slice(0, 10);
  return locale === "fr" ? `craftlink-demandes-${day}.csv` : `craftlink-requests-${day}.csv`;
}

/** Génère le CSV et déclenche le téléchargement dans le navigateur. */
export function downloadLeadsCsv(
  leads: DashboardLead[],
  columns: LeadCsvColumnLabels,
  statusLabels: LeadCsvStatusLabels,
  locale: Locale,
): void {
  const csv = `\uFEFF${leadsToCsv(leads, columns, statusLabels, locale)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = buildLeadsCsvFilename(locale);
  anchor.click();
  URL.revokeObjectURL(url);
}
