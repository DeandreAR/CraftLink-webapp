const LEAD_SHARE_HOST =
  process.env.NEXT_PUBLIC_LEAD_SHARE_HOST?.replace(/\/$/, "") ?? "https://craftlink.fr";

/** URL publique unique du dossier lead (partage WhatsApp). */
export function buildLeadShareUrl(leadId: string): string {
  return `${LEAD_SHARE_HOST}/share/${leadId}`;
}
