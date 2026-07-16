"use client";

import type { DashboardLead } from "@/domain/lead";
import type { CatchUpAction } from "@/lib/leads/smartCatchUp";
import type { DashboardDictionary } from "@/i18n/types";

type SmartCatchUpBannerProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
  onAction: (leadId: string, action: CatchUpAction) => void;
  busy?: boolean;
  error?: string | null;
  onDismissError?: () => void;
};

export function SmartCatchUpBanner({
  lead,
  copy,
  onAction,
  busy = false,
  error = null,
  onDismissError,
}: SmartCatchUpBannerProps) {
  const c = copy.leads.catchUp;
  const question = c.question.replace("{clientName}", lead.clientName);

  return (
    <div
      role="region"
      aria-label={c.ariaLabel}
      className="mb-5 overflow-hidden rounded-2xl border-2 border-[#EFA188]/50 bg-gradient-to-br from-[#FFF5F2] via-white to-[#FDFBF7] shadow-[0_12px_32px_rgba(239,161,136,0.15)]"
    >
      <div className="border-b border-[#EFA188]/25 bg-[#EFA188]/10 px-4 py-2">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#c45a3a]">
          {c.eyebrow}
        </p>
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-[#212129]">{question}</p>
        <p className="mt-1 text-xs text-[#5b6478]">
          {lead.workType} · {lead.zone}
        </p>
        {error ? (
          <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
            {error}
            {onDismissError ? (
              <button
                type="button"
                onClick={onDismissError}
                className="ml-2 font-bold underline"
              >
                OK
              </button>
            ) : null}
          </p>
        ) : null}
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
    </div>
  );
}
