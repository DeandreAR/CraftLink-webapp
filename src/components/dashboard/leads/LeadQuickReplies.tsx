"use client";

import type { DashboardLead } from "@/domain/lead";
import type { LeadWhatsAppLinks } from "@/lib/leads/buildLeadWhatsAppLink";
import { buildWhatsAppLinksFromMessage } from "@/lib/leads/buildLeadWhatsAppLink";
import {
  buildQuickReplyMessage,
  QUICK_REPLY_KINDS,
  type QuickReplyKind,
} from "@/lib/leads/quickReplyTemplates";
import type { DashboardDictionary } from "@/i18n/types";

type LeadQuickRepliesProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
  onWhatsAppContact: (leadId: string, links: LeadWhatsAppLinks) => void;
};

export function LeadQuickReplies({
  lead,
  copy,
  onWhatsAppContact,
}: LeadQuickRepliesProps) {
  const q = copy.leads.quickReplies;

  const handleQuickReply = (kind: QuickReplyKind) => {
    const message = buildQuickReplyMessage(kind, lead);
    const links = buildWhatsAppLinksFromMessage(lead.clientPhone, message);
    if (!links) return;
    onWhatsAppContact(lead.id, links);
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {q.title}
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {QUICK_REPLY_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => handleQuickReply(kind)}
            className="min-h-12 rounded-xl border border-[#EFA188]/30 bg-white px-3 py-3 text-left text-sm font-semibold text-slate-800 transition active:scale-[0.98] hover:border-[#25D366]/40 hover:bg-[#25D366]/5"
          >
            {kind === "quote_followup" ? q.quoteFollowup : q.invoiceFollowup}
          </button>
        ))}
      </div>
    </div>
  );
}
