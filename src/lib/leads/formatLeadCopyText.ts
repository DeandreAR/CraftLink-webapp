import type { DashboardLead } from "@/domain/lead";
import type { Locale } from "@/i18n/config";
import { formatClientPhone } from "@/components/dashboard/leads/leadsViewShared";

function resolveDescription(lead: DashboardLead): string {
  const description = lead.description?.trim();
  if (description) return description;
  return lead.summary?.trim() ?? "";
}

/** Texte brut pour coller dans Obat, Tolteck, Excel, etc. */
export function formatLeadCopyText(lead: DashboardLead, locale: Locale = "fr"): string {
  const lines: string[] = [];

  const clientName = lead.clientName.trim();
  if (clientName) {
    lines.push(`Client : ${clientName}`);
  }

  const phone = lead.clientPhone.trim();
  if (phone) {
    lines.push(`Téléphone : ${formatClientPhone(phone, locale)}`);
  }

  const work = lead.workType.trim();
  if (work) {
    lines.push(`Travaux : ${work}`);
  }

  const needNature = lead.needNature?.trim();
  if (needNature) {
    lines.push(`Nature du besoin : ${needNature}`);
  }

  const zone = lead.zone.trim();
  if (zone) {
    lines.push(`Zone : ${zone}`);
  }

  const description = resolveDescription(lead);
  if (description) {
    lines.push(`Description : ${description}`);
  }

  return lines.join("\n");
}
