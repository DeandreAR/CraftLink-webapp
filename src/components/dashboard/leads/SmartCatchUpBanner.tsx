"use client";

import type { DashboardLead } from "@/domain/lead";
import type { CatchUpAction } from "@/lib/leads/smartCatchUp";
import type { DashboardDictionary } from "@/i18n/types";

type SmartCatchUpBannerProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
  onAction: (leadId: string, action: CatchUpAction) => void;
  busy?: boolean;
};

export function SmartCatchUpBanner({
  lead,
  copy,
  onAction,
  busy = false,
}: SmartCatchUpBannerProps) {
  const c = copy.leads.catchUp;
  const question = c.question.replace("{clientName}", lead.clientName);

  return (
    <div
      role="region"
      aria-label={c.ariaLabel}
      className="mb-4 rounded-2xl border border-[#EFA188]/40 bg-gradient-to-r from-[#FFF5F2] to-white p-4 shadow-sm"
    >
      <p className="text-sm font-semibold text-slate-900">{question}</p>
      <p className="mt-1 text-xs text-slate-500">
        {lead.workType} · {lead.zone}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={busy}
          onClick={() => onAction(lead.id, "quote_sent")}
          className="min-h-11 flex-1 rounded-xl bg-black px-3 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {c.quoteSent}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onAction(lead.id, "lost")}
          className="min-h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-neutral-50 disabled:opacity-60"
        >
          {c.lost}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onAction(lead.id, "snooze")}
          className="min-h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-neutral-50 disabled:opacity-60"
        >
          {c.snooze}
        </button>
      </div>
    </div>
  );
}
