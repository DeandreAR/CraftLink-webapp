"use client";

import type { ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";
import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus, LeadSchedule, LeadWorkflowStatus } from "@/domain/lead";
import { LeadAttachmentUpload } from "@/components/dashboard/leads/LeadAttachmentUpload";
import { LeadCopyRequestButton } from "@/components/dashboard/leads/LeadCopyRequestButton";
import { LeadDetailMedia } from "@/components/dashboard/leads/LeadDetailMedia";
import { LeadQuickReplies } from "@/components/dashboard/leads/LeadQuickReplies";
import { LeadScheduleEditor } from "@/components/dashboard/leads/LeadScheduleEditor";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowPicker } from "@/components/dashboard/leads/LeadWorkflowControls";
import { WhatsAppContactButton } from "@/components/dashboard/leads/WhatsAppContactButton";
import { buildLeadWhatsAppLinks, type LeadWhatsAppLinks } from "@/lib/leads/buildLeadWhatsAppLink";
import {
  formatClientPhone,
  formatLeadDate,
  formatRequestNumber,
  formatScheduleShort,
} from "@/components/dashboard/leads/leadsViewShared";
import {
  daysSinceInvoiceSent,
  daysSinceQuoteSent,
  formatBillingDaysCount,
} from "@/lib/leads/leadBillingDays";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type LeadDetailPanelProps = {
  lead: DashboardLead;
  plan: CraftlinkPlan;
  copy: DashboardDictionary;
  locale: Locale;
  businessName?: string;
  onClose: () => void;
  onLeadUpdated: (lead: DashboardLead) => void;
  onDelayStatusChange: (status: LeadDelayStatus) => void;
  onWorkflowStatusChange: (status: LeadWorkflowStatus) => void;
  onScheduleChange: (schedule: LeadSchedule | null) => void;
  onWhatsAppContact: (leadId: string, links: LeadWhatsAppLinks) => void;
};

type DetailSectionProps = {
  title?: string;
  tone: "quick" | "client" | "work" | "attachments" | "planning" | "actions";
  children: ReactNode;
};

const SECTION_TONES: Record<DetailSectionProps["tone"], string> = {
  quick: "bg-[#FFF5F2] border border-[#EFA188]/20",
  client: "bg-slate-50/90 border border-slate-100",
  work: "bg-[#F0FDFA]/80 border border-teal-100/80",
  attachments: "bg-amber-50/70 border border-amber-100/80",
  planning: "bg-sky-50/70 border border-sky-100/80",
  actions: "bg-white border border-neutral-100",
};

function DetailSection({ title, tone, children }: DetailSectionProps) {
  return (
    <section className={`mt-3 rounded-2xl p-4 ${SECTION_TONES[tone]}`}>
      {title ? (
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">
          {title}
        </h3>
      ) : null}
      <div className={title ? "mt-3" : undefined}>{children}</div>
    </section>
  );
}

export function LeadDetailPanel({
  lead,
  plan,
  copy,
  locale,
  businessName,
  onClose,
  onLeadUpdated,
  onDelayStatusChange,
  onWorkflowStatusChange,
  onScheduleChange,
  onWhatsAppContact,
}: LeadDetailPanelProps) {
  const d = copy.leads.detail;
  const l = copy.leads;
  const w = copy.leads.workflow;
  const waLinks = buildLeadWhatsAppLinks(lead, businessName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-detail-title"
      onClick={onClose}
    >
      <div
        className="scrollbar-soft max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-neutral-200 bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neutral-100 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-5">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              {d.title}
            </p>
            <h2
              id="lead-detail-title"
              className="mt-1 text-lg font-bold leading-snug text-black sm:text-xl"
            >
              {lead.workType}
            </h2>
            {lead.needNature?.trim() ? (
              <p className="mt-1 text-sm font-semibold text-[#c45a3a]">
                {lead.needNature}
              </p>
            ) : null}
            <p className="mt-0.5 text-sm text-neutral-600">
              {lead.clientName} · #{formatRequestNumber(lead.requestNumber)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-black"
            aria-label={d.close}
          >
            <FaXmark className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-0 px-4 pb-6 pt-2 sm:px-5">
          {waLinks ? (
            <DetailSection tone="quick">
              <LeadQuickReplies
                lead={lead}
                copy={copy}
                onWhatsAppContact={onWhatsAppContact}
              />
            </DetailSection>
          ) : null}

          <DetailSection title={w.sectionStatus} tone="client">
            <LeadWorkflowPicker
              value={lead.workflowStatus}
              onChange={onWorkflowStatusChange}
              copy={copy}
            />
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {l.columns.quoteDays}
                </dt>
                <dd className="mt-1 font-semibold text-neutral-900">
                  {formatBillingDaysCount(
                    daysSinceQuoteSent(lead),
                    l.billing.notSent,
                    l.billing.dayUnit,
                  )}
                </dd>
                {lead.quoteSentAt ? (
                  <dd className="mt-0.5 text-xs text-neutral-500">
                    {d.quoteSentOnLabel} {formatLeadDate(lead.quoteSentAt, locale)}
                  </dd>
                ) : null}
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {l.columns.invoiceDays}
                </dt>
                <dd className="mt-1 font-semibold text-neutral-900">
                  {formatBillingDaysCount(
                    daysSinceInvoiceSent(lead),
                    l.billing.notSent,
                    l.billing.dayUnit,
                  )}
                </dd>
                {lead.invoiceSentAt ? (
                  <dd className="mt-0.5 text-xs text-neutral-500">
                    {d.invoiceSentOnLabel} {formatLeadDate(lead.invoiceSentAt, locale)}
                  </dd>
                ) : null}
              </div>
            </dl>
          </DetailSection>

          <DetailSection title={w.sectionClient} tone="client">
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {l.columns.requestDate}
                </dt>
                <dd className="mt-1 font-medium text-neutral-900">
                  {formatLeadDate(lead.createdAt, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {l.columns.zone}
                </dt>
                <dd className="mt-1 text-neutral-800">{lead.zone}</dd>
              </div>
              {lead.needNature?.trim() ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {d.needNatureLabel}
                  </dt>
                  <dd className="mt-1 font-medium text-neutral-900">{lead.needNature}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {d.phoneLabel}
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {lead.clientPhone ? (
                    formatClientPhone(lead.clientPhone, locale)
                  ) : (
                    <span className="font-normal text-neutral-400">—</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {l.columns.delay}
                </dt>
                <dd className="mt-1">
                  <LeadStatusPicker
                    value={lead.delayStatus}
                    onChange={onDelayStatusChange}
                    copy={copy}
                  />
                </dd>
              </div>
            </dl>
          </DetailSection>

          <DetailSection title={w.sectionWork} tone="work">
            <LeadCopyRequestButton lead={lead} copy={copy} locale={locale} />
            <div className="mt-3">
              <LeadDetailMedia lead={lead} plan={plan} copy={copy} embedded />
            </div>
          </DetailSection>

          <DetailSection title={w.sectionAttachments} tone="attachments">
            <LeadAttachmentUpload
              lead={lead}
              plan={plan}
              copy={copy}
              onLeadUpdated={onLeadUpdated}
              embedded
            />
          </DetailSection>

          <DetailSection title={w.sectionPlanning} tone="planning">
            <LeadScheduleEditor
              schedule={lead.schedule}
              onChange={onScheduleChange}
              copy={copy}
            />
            <p className="mt-2 text-xs text-neutral-500">
              {l.columns.calendar} :{" "}
              {lead.schedule?.date
                ? formatScheduleShort(lead.schedule.date, locale)
                : l.calendar.notScheduled}
            </p>
          </DetailSection>

          <DetailSection tone="actions">
            {waLinks ? (
              <WhatsAppContactButton
                label={l.contactWhatsApp}
                onClick={() => onWhatsAppContact(lead.id, waLinks)}
              />
            ) : null}
          </DetailSection>
        </div>
      </div>
    </div>
  );
}
