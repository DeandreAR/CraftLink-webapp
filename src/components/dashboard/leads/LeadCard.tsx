"use client";

import { FaGripVertical } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowActions } from "@/components/dashboard/leads/LeadWorkflowActions";
import { WhatsAppContactButton } from "@/components/dashboard/leads/WhatsAppContactButton";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { buildLeadWhatsAppLink } from "@/lib/leads/buildLeadWhatsAppLink";
import {
  formatLeadDate,
  formatRequestNumber,
  isLeadWorkflowMuted,
  leadRowMutedClass,
  workflowStatusBadgeClass,
} from "@/components/dashboard/leads/leadsViewShared";

type LeadCardProps = LeadsViewBaseProps & {
  lead: DashboardLead;
  compact?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
};

export function LeadCard({
  lead,
  copy,
  locale,
  artisanName,
  onOpenDetail,
  onDelayStatusChange,
  onMarkDone,
  onMarkArchived,
  onReactivate,
  onWhatsAppContact,
  compact = false,
  draggable = false,
  selectable = false,
  selected = false,
  onToggleSelect,
}: LeadCardProps) {
  const l = copy.leads;
  const dateLabel = formatLeadDate(lead.createdAt, locale);
  const waHref = buildLeadWhatsAppLink(lead, artisanName);
  const muted = isLeadWorkflowMuted(lead.workflowStatus);

  return (
    <article
      className={`rounded-xl border bg-white ${
        compact ? "p-2.5" : "p-4"
      } ${selected ? "border-slate-400 ring-1 ring-slate-200" : "border-neutral-200"} ${leadRowMutedClass(muted)} ${muted ? "bg-neutral-50/60" : ""}`}
    >
      <div className="flex items-start gap-2">
        {selectable ? (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 accent-black"
            aria-label={l.bulk.selectOne.replace("{name}", lead.clientName)}
          />
        ) : null}
        {draggable ? (
          <span className="mt-0.5 shrink-0 text-neutral-300" aria-hidden>
            <FaGripVertical className="h-3.5 w-3.5" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] text-slate-400">
                {formatRequestNumber(lead.requestNumber)}
              </span>
              <p
                className={`truncate font-semibold ${compact ? "text-sm" : "text-base"} ${muted ? "text-neutral-500" : "text-black"}`}
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
              {lead.workflowStatus === "archived" ? (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${workflowStatusBadgeClass("archived")}`}
                >
                  {l.workflow.archived}
                </span>
              ) : null}
            </div>
            <LeadStatusPicker
              value={lead.delayStatus}
              onChange={(status) => onDelayStatusChange(lead.id, status)}
              copy={copy}
              compact
              className="shrink-0"
            />
          </div>
          {!compact ? (
            <p className="mt-0.5 text-xs text-neutral-500">
              {l.columns.requestDate} : {dateLabel}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenDetail(lead.id)}
        title={lead.workType}
        className={`mt-1.5 block w-full truncate text-left ${compact ? "text-xs" : "text-sm"} font-medium underline-offset-2 hover:underline ${muted ? "text-neutral-500" : "text-neutral-900"}`}
      >
        {lead.workType}
      </button>

      {!compact ? (
        <p className={`mt-1 text-xs ${muted ? "text-neutral-400" : "text-neutral-500"}`}>
          {lead.zone}
        </p>
      ) : (
        <p className={`mt-0.5 text-[10px] ${muted ? "text-neutral-400" : "text-neutral-500"}`}>
          {lead.zone}
        </p>
      )}

      <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "mt-2" : "mt-3"}`}>
        {waHref ? (
          <WhatsAppContactButton
            label={l.contactWhatsApp}
            onClick={() => onWhatsAppContact(waHref)}
            compact
            iconOnly={compact}
          />
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
    </article>
  );
}
