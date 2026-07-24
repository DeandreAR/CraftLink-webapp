"use client";

import { FaCommentSms, FaEnvelope, FaPhone, FaWhatsapp, FaXmark } from "react-icons/fa6";
import { updatePartnershipRequestAction } from "@/app/actions/partnerships";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import type { DashboardPartnershipRequest, PartnershipWorkflowStatus } from "@/domain/partnershipRequest";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { buildPartnershipContactLinks } from "@/lib/partnerships/buildPartnershipContactLinks";
import { isDemoPartnershipRequest } from "@/lib/partnerships/demoPartnershipRequest";
import {
  formatPartnershipBudget,
  formatPartnershipDate,
  partnershipStatusBadgeClass,
} from "@/lib/partnerships/partnershipDisplay";

type PartnershipRequestDetailProps = {
  request: DashboardPartnershipRequest;
  copy: DashboardDictionary;
  locale: Locale;
  compact?: boolean;
  onClose: () => void;
  onUpdated: (request: DashboardPartnershipRequest) => void;
};

function DetailRow({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <div>
      <dt
        className={`font-bold uppercase tracking-wide text-[#5b6478] ${
          compact ? "text-[9px]" : "text-[11px]"
        }`}
      >
        {label}
      </dt>
      <dd className={`mt-0.5 font-medium text-[#212129] ${compact ? "text-xs" : "text-sm"}`}>
        {value}
      </dd>
    </div>
  );
}

export function PartnershipRequestDetail({
  request,
  copy,
  locale,
  compact = false,
  onClose,
  onUpdated,
}: PartnershipRequestDetailProps) {
  const p = copy.partners;
  const d = p.detail;

  const setStatus = async (workflowStatus: PartnershipWorkflowStatus) => {
    if (isDemoPartnershipRequest(request.id)) {
      onUpdated({
        ...request,
        workflowStatus,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    const result = await updatePartnershipRequestAction({
      requestId: request.id,
      workflowStatus,
    });
    if (result.ok) {
      onUpdated(result.request);
    }
  };

  const contactLinks = buildPartnershipContactLinks(request, copy);

  const handleContactOpen = () => {
    if (request.workflowStatus !== "CONTACTE") {
      void setStatus("CONTACTE");
    }
  };

  const channelButtonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50 md:px-4 md:py-2.5 md:text-xs";

  const body = (
    <>
      <div className="mt-3 space-y-2 md:mt-4 md:space-y-3">
        <DashboardButton
          href={contactLinks.email}
          external
          className={`w-full ${compact ? "text-xs" : ""}`}
          onClick={handleContactOpen}
        >
          <FaEnvelope className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
          {d.contactCta}
        </DashboardButton>

        {contactLinks.sms || contactLinks.whatsapp ? (
          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            {contactLinks.sms ? (
              <a
                href={contactLinks.sms}
                className={channelButtonClass}
                onClick={handleContactOpen}
              >
                <FaCommentSms className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden />
                {d.contactBySms}
              </a>
            ) : null}
            {contactLinks.whatsapp ? (
              <a
                href={contactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={channelButtonClass}
                onClick={handleContactOpen}
              >
                <FaWhatsapp className="h-3 w-3 text-[#25D366] md:h-3.5 md:w-3.5" aria-hidden />
                {d.contactByWhatsApp}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2 md:mt-4 md:gap-3">
        <DetailRow compact={compact} label={d.company} value={request.companyName} />
        <DetailRow
          compact={compact}
          label={d.contact}
          value={`${request.contactName}${request.jobTitle ? ` · ${request.jobTitle}` : ""}`}
        />
        <DetailRow compact={compact} label={d.type} value={p.types[request.partnershipType]} />
        <DetailRow
          compact={compact}
          label={d.budget}
          value={formatPartnershipBudget(copy, request.budgetRange, request.budgetApproximate)}
        />
        <DetailRow
          compact={compact}
          label={d.receivedAt}
          value={formatPartnershipDate(request.createdAt, locale)}
        />
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
        <a
          href={`mailto:${request.email}`}
          className="inline-flex max-w-full items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-white md:px-3 md:py-1.5 md:text-xs"
        >
          <FaEnvelope className="h-2.5 w-2.5 shrink-0 md:h-3 md:w-3" aria-hidden />
          <span className="truncate">{request.email}</span>
        </a>
        {request.phone ? (
          <a
            href={`tel:${request.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-white md:px-3 md:py-1.5 md:text-xs"
          >
            <FaPhone className="h-2.5 w-2.5 md:h-3 md:w-3" aria-hidden />
            {request.phone}
          </a>
        ) : null}
      </div>

      <div className="mt-3 md:mt-4">
        <p
          className={`font-bold uppercase tracking-wide text-[#5b6478] ${
            compact ? "text-[9px]" : "text-[11px]"
          }`}
        >
          {d.message}
        </p>
        <p
          className={`mt-1.5 whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 leading-relaxed text-slate-900 md:mt-2 md:p-3 ${
            compact ? "p-2.5 text-xs" : "p-3 text-sm"
          }`}
        >
          {request.message}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 pb-1 md:mt-4 md:gap-2 md:pb-0">
        {request.workflowStatus !== "CONTACTE" ? (
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void setStatus("CONTACTE")}
          >
            {d.markContacted}
          </DashboardButton>
        ) : (
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void setStatus("A_TRAITER")}
          >
            {d.markPending}
          </DashboardButton>
        )}
        {request.workflowStatus !== "ARCHIVE" ? (
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void setStatus("ARCHIVE")}
          >
            {d.archive}
          </DashboardButton>
        ) : (
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void setStatus("A_TRAITER")}
          >
            {d.markPending}
          </DashboardButton>
        )}
      </div>
    </>
  );

  if (compact) {
    return (
      <aside className="db-partners-detail-sheet">
        <div className="db-partners-detail-sheet-header shrink-0">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#212129]/15" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#EFA188]">
                {d.title}
              </p>
              <h2 className="mt-0.5 truncate text-base font-black text-[#212129]">
                {request.companyName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={d.close}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <FaXmark className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${partnershipStatusBadgeClass(request.workflowStatus)}`}
          >
            {p.status[request.workflowStatus]}
          </span>
        </div>
        <div className="db-partners-detail-sheet-body scrollbar-soft">{body}</div>
      </aside>
    );
  }

  return (
    <aside className="db-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#212129]">{d.title}</h2>
          <p className="mt-1 text-sm font-semibold text-[#5b6478]">{request.companyName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
        >
          {d.close}
        </button>
      </div>

      <span
        className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${partnershipStatusBadgeClass(request.workflowStatus)}`}
      >
        {p.status[request.workflowStatus]}
      </span>

      {body}
    </aside>
  );
}
