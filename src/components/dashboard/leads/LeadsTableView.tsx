"use client";

import { FaLock, FaWhatsapp } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { LeadStatusSelect } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowActions } from "@/components/dashboard/leads/LeadWorkflowActions";
import { GlowButton } from "@/components/ui/GlowButton";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { buildLeadWhatsAppLink } from "@/lib/leads/buildLeadWhatsAppLink";
import {
  formatLeadDate,
  workflowStatusBadgeClass,
} from "@/components/dashboard/leads/leadsViewShared";

type LeadsTableViewProps = LeadsViewBaseProps;

export function LeadsTableView({
  leads,
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
}: LeadsTableViewProps) {
  const l = copy.leads;
  const cols = l.columns;

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-white">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {cols.name}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {cols.requestDate}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {cols.work}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {cols.zone}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {cols.status}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const locked = isLocked(lead);
            const waHref = buildLeadWhatsAppLink(lead, artisanName);
            const muted = lead.workflowStatus === "done";

            return (
              <tr
                key={lead.id}
                className={`border-b border-neutral-100 last:border-0 ${
                  locked ? "bg-neutral-50/80" : muted ? "bg-neutral-50/40" : "hover:bg-neutral-50/50"
                }`}
              >
                <td
                  className={`px-4 py-3 font-medium text-black ${locked ? "blur-[5px] select-none" : ""} ${muted ? "text-neutral-500" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {lead.clientName}
                    {lead.workflowStatus === "done" ? (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${workflowStatusBadgeClass("done")}`}
                      >
                        {l.workflow.done}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td
                  className={`px-4 py-3 text-neutral-600 ${locked ? "blur-[5px] select-none" : ""}`}
                >
                  {formatLeadDate(lead.createdAt, locale)}
                </td>
                <td className={`max-w-[200px] px-4 py-3 ${locked ? "blur-[5px] select-none" : ""}`}>
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => onOpenDetail(lead.id)}
                    className="truncate text-left font-medium text-neutral-900 underline-offset-2 hover:text-black hover:underline"
                  >
                    {lead.workType}
                  </button>
                </td>
                <td
                  className={`px-4 py-3 text-neutral-600 ${locked ? "blur-[5px] select-none" : ""}`}
                >
                  {lead.zone}
                </td>
                <td className={`px-4 py-3 ${locked ? "blur-[5px] select-none" : ""}`}>
                  {locked ? (
                    <span className="text-xs text-neutral-400">—</span>
                  ) : (
                    <LeadStatusSelect
                      value={lead.delayStatus}
                      onChange={(status) => onDelayStatusChange(lead.id, status)}
                      copy={copy}
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  {locked ? (
                    <GlowButton href={lockedCtaHref} className="gap-1.5 px-3 py-1.5 text-xs">
                      <FaLock className="h-3 w-3" aria-hidden />
                      {l.lockedBadge}
                    </GlowButton>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {waHref ? (
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#20BD5A]"
                          title={l.contactWhatsApp}
                        >
                          <FaWhatsapp className="h-3.5 w-3.5" aria-hidden />
                          WA
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
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
