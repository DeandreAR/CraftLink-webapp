"use client";

import { FaCommentSms, FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa6";
import { updatePartnershipRequestAction } from "@/app/actions/partnerships";
import { GlowButton } from "@/components/ui/GlowButton";
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
  onClose: () => void;
  onUpdated: (request: DashboardPartnershipRequest) => void;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function PartnershipRequestDetail({
  request,
  copy,
  locale,
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
    "inline-flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:border-neutral-300 hover:bg-neutral-50";

  return (
    <aside className="rounded-[18px] border border-neutral-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{d.title}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-700">{request.companyName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
        >
          {d.close}
        </button>
      </div>

      <span
        className={`mt-3 inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${partnershipStatusBadgeClass(request.workflowStatus)}`}
      >
        {p.status[request.workflowStatus]}
      </span>

      <div className="mt-5 space-y-3">
        <GlowButton
          href={contactLinks.email}
          external
          className="w-full gap-2 text-sm"
          onClick={handleContactOpen}
        >
          <FaEnvelope className="h-4 w-4" aria-hidden />
          {d.contactCta}
        </GlowButton>

        {contactLinks.sms || contactLinks.whatsapp ? (
          <div className="grid grid-cols-2 gap-2">
            {contactLinks.sms ? (
              <a
                href={contactLinks.sms}
                className={channelButtonClass}
                onClick={handleContactOpen}
              >
                <FaCommentSms className="h-3.5 w-3.5" aria-hidden />
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
                <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" aria-hidden />
                {d.contactByWhatsApp}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailRow label={d.company} value={request.companyName} />
        <DetailRow
          label={d.contact}
          value={`${request.contactName}${request.jobTitle ? ` · ${request.jobTitle}` : ""}`}
        />
        <DetailRow label={d.type} value={p.types[request.partnershipType]} />
        <DetailRow
          label={d.budget}
          value={formatPartnershipBudget(copy, request.budgetRange, request.budgetApproximate)}
        />
        <DetailRow label={d.receivedAt} value={formatPartnershipDate(request.createdAt, locale)} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`mailto:${request.email}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-neutral-100"
        >
          <FaEnvelope className="h-3 w-3" aria-hidden />
          {request.email}
        </a>
        {request.phone ? (
          <a
            href={`tel:${request.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-neutral-100"
          >
            <FaPhone className="h-3 w-3" aria-hidden />
            {request.phone}
          </a>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{d.message}</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">
          {request.message}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {request.workflowStatus !== "CONTACTE" ? (
          <GlowButton
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={() => void setStatus("CONTACTE")}
          >
            {d.markContacted}
          </GlowButton>
        ) : (
          <GlowButton
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={() => void setStatus("A_TRAITER")}
          >
            {d.markPending}
          </GlowButton>
        )}
        {request.workflowStatus !== "ARCHIVE" ? (
          <GlowButton
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={() => void setStatus("ARCHIVE")}
          >
            {d.archive}
          </GlowButton>
        ) : (
          <GlowButton
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={() => void setStatus("A_TRAITER")}
          >
            {d.markPending}
          </GlowButton>
        )}
      </div>
    </aside>
  );
}
