import type { DashboardLead } from "@/domain/lead";

export type QuickReplyKind = "quote_followup" | "invoice_followup";

export const QUICK_REPLY_KINDS: QuickReplyKind[] = ["quote_followup", "invoice_followup"];

/** Messages de relance anonymisés (sans nom client) — sans LLM. */
export function buildQuickReplyMessage(kind: QuickReplyKind, lead: DashboardLead): string {
  const work = lead.workType.trim() || "votre projet";

  if (kind === "quote_followup") {
    return [
      "Bonjour,",
      "",
      "Je revérifiais mes dossiers. Avez-vous pu jeter un œil au devis pour :",
      work,
      "?",
      "",
      "Je reste disponible pour toute question.",
      "",
      "Bien cordialement",
    ].join("\n");
  }

  return [
    "Bonjour,",
    "",
    "Je me permets de revenir vers vous concernant la facture pour :",
    work,
    ".",
    "",
    "N'hésitez pas à me confirmer la réception ou à me signaler toute question.",
    "",
    "Merci et bonne journée",
  ].join("\n");
}
