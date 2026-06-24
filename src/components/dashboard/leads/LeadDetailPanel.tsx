"use client";

import { FaXmark } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus, LeadSchedule } from "@/domain/lead";
import { LeadScheduleEditor } from "@/components/dashboard/leads/LeadScheduleEditor";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowActions } from "@/components/dashboard/leads/LeadWorkflowActions";
import { WhatsAppContactButton } from "@/components/dashboard/leads/WhatsAppContactButton";
import { buildLeadWhatsAppLink } from "@/lib/leads/buildLeadWhatsAppLink";
import { formatLeadDate, formatRequestNumber } from "@/components/dashboard/leads/leadsViewShared";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type LeadDetailPanelProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
  locale: Locale;
  artisanName?: string;
  onClose: () => void;
  onDelayStatusChange: (status: LeadDelayStatus) => void;
  onScheduleChange: (schedule: LeadSchedule | null) => void;
  onMarkDone: () => void;
  onMarkArchived: () => void;
  onReactivate: () => void;
  onWhatsAppContact: (href: string) => void;
};

export function LeadDetailPanel({
  lead,
  copy,
  locale,
  artisanName,
  onClose,
  onDelayStatusChange,
  onScheduleChange,
  onMarkDone,
  onMarkArchived,
  onReactivate,
  onWhatsAppContact,
}: LeadDetailPanelProps) {
  const d = copy.leads.detail;
  const l = copy.leads;
  const waHref = buildLeadWhatsAppLink(lead, artisanName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-neutral-200 bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              {d.title}
            </p>
            <h2 id="lead-detail-title" className="mt-1 text-xl font-bold text-black">
              {lead.workType}
            </h2>
            <p className="mt-0.5 text-sm text-neutral-600">
              {lead.clientName} · #{formatRequestNumber(lead.requestNumber)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-black"
            aria-label={d.close}
          >
            <FaXmark className="h-4 w-4" />
          </button>
        </div>

        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {l.columns.requestDate}
            </dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {formatLeadDate(lead.createdAt, locale)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {l.columns.zone}
            </dt>
            <dd className="mt-0.5 text-neutral-800">{lead.zone}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {l.columns.status}
            </dt>
            <dd className="mt-1">
              <LeadStatusPicker
                value={lead.delayStatus}
                onChange={onDelayStatusChange}
                copy={copy}
              />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {d.summaryLabel}
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap leading-relaxed text-neutral-700">
              {lead.summary}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <LeadScheduleEditor
            schedule={lead.schedule}
            onChange={onScheduleChange}
            copy={copy}
          />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {waHref ? (
            <WhatsAppContactButton
              label={l.contactWhatsApp}
              onClick={() => onWhatsAppContact(waHref)}
            />
          ) : null}
          <LeadWorkflowActions
            workflowStatus={lead.workflowStatus}
            copy={copy}
            onMarkDone={onMarkDone}
            onMarkArchived={onMarkArchived}
            onReactivate={onReactivate}
          />
        </div>
      </div>
    </div>
  );
}
