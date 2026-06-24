"use client";

import { FaWhatsapp } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { LeadStatusSelect } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowActions } from "@/components/dashboard/leads/LeadWorkflowActions";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { buildLeadWhatsAppLink } from "@/lib/leads/buildLeadWhatsAppLink";
import {
  formatLeadDate,
  workflowStatusBadgeClass,
} from "@/components/dashboard/leads/leadsViewShared";

type LeadCardProps = LeadsViewBaseProps & {
  lead: DashboardLead;
  compact?: boolean;
};

export function LeadCard({
  lead,
  isLocked,
  copy,
  locale,
  artisanName,
  lockedCtaHref,
  onOpenDetail,
  onDelayStatusChange,
  onMarkDone,
  onMarkArchived,
  onReactivate,
  compact = false,
}: LeadCardProps) {
  const l = copy.leads;
  const locked = isLocked(lead);
  const dateLabel = formatLeadDate(lead.createdAt, locale);
  const waHref = buildLeadWhatsAppLink(lead, artisanName);
  const muted = lead.workflowStatus === "done";

  const content = (
    <article
      className={`rounded-lg border border-neutral-200 bg-white ${
        compact ? "p-3" : "p-4"
      } ${muted ? "opacity-80" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p
              className={`truncate font-semibold text-black ${compact ? "text-sm" : "text-base"} ${muted ? "text-neutral-500" : ""}`}
            >
              {lead.clientName}
            </p>
            {lead.workflowStatus === "done" ? (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${workflowStatusBadgeClass("done")}`}
              >
                {l.workflow.done}
              </span>
            ) : null}
          </div>
          {!compact ? (
            <p className="mt-0.5 text-xs text-neutral-500">
              {l.columns.requestDate} : {dateLabel}
            </p>
          ) : null}
        </div>
        {!locked ? (
          <LeadStatusSelect
            value={lead.delayStatus}
            onChange={(status) => onDelayStatusChange(lead.id, status)}
            copy={copy}
            className="max-w-[7rem] shrink-0"
          />
        ) : null}
      </div>

      <button
        type="button"
        disabled={locked}
        onClick={() => onOpenDetail(lead.id)}
        className={`mt-2 text-left ${compact ? "text-xs" : "text-sm"} ${
          locked ? "" : "font-medium text-neutral-900 underline-offset-2 hover:underline"
        }`}
      >
        {lead.workType}
      </button>

      {!compact ? (
        <p className="mt-1 text-xs text-neutral-500">{lead.zone}</p>
      ) : null}

      {!locked ? (
        <div className={`flex flex-wrap items-center gap-2 ${compact ? "mt-2" : "mt-3"}`}>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              title={l.contactWhatsApp}
              className="inline-flex items-center justify-center rounded-lg bg-[#25D366] p-2 text-white transition hover:bg-[#20BD5A]"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden />
              <span className="sr-only">{l.contactWhatsApp}</span>
            </a>
          ) : null}
          <LeadWorkflowActions
            workflowStatus={lead.workflowStatus}
            copy={copy}
            onMarkDone={() => onMarkDone(lead.id)}
            onMarkArchived={() => onMarkArchived(lead.id)}
            onReactivate={() => onReactivate(lead.id)}
            compact
          />
        </div>
      ) : null}
    </article>
  );

  if (!locked) return content;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-md" aria-hidden>
        {content}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-white/90 p-3 text-center">
        <span className="rounded-md bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          {l.lockedBadge}
        </span>
        {!compact ? (
          <p className="text-[10px] text-neutral-500">{l.lockedHint}</p>
        ) : null}
        <a
          href={lockedCtaHref}
          className="rounded-md bg-black px-2 py-1 text-[10px] font-bold text-white"
        >
          Pro
        </a>
      </div>
    </div>
  );
}
