import { buildAppUrl } from "@/config/app";

/** URL publique unique du dossier lead (partage client). */
export function buildLeadShareUrl(leadId: string): string {
  return buildAppUrl(`/share/${leadId}`);
}
