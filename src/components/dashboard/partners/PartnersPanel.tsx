"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { PlanLockedCard } from "@/components/dashboard/PlanLockedCard";
import { PartnershipRequestDetail } from "@/components/dashboard/partners/PartnershipRequestDetail";
import { PartnersAffiliateLinksCard } from "@/components/dashboard/partners/PartnersAffiliateLinksCard";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { Profile } from "@/domain/profile";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { buildDemoPartnershipRequest } from "@/lib/partnerships/demoPartnershipRequest";
import {
  formatPartnershipDate,
  partnershipStatusBadgeClass,
} from "@/lib/partnerships/partnershipDisplay";

function withDemoRequestIfEmpty(requests: DashboardPartnershipRequest[]): DashboardPartnershipRequest[] {
  if (requests.length > 0 || process.env.NODE_ENV !== "development") {
    return requests;
  }
  return [buildDemoPartnershipRequest()];
}

type PartnersPanelProps = {
  profile: Profile;
  copy: DashboardDictionary;
  locale: Locale;
  initialRequests: DashboardPartnershipRequest[];
  initialLoadError: string | null;
};

function RequestsTable({
  requests,
  copy,
  locale,
  selectedId,
  onSelect,
}: {
  requests: DashboardPartnershipRequest[];
  copy: DashboardDictionary;
  locale: Locale;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const p = copy.partners;

  if (requests.length === 0) {
    return (
      <div className="db-card-flat px-6 py-12 text-center">
        <p className="text-sm font-semibold text-[#212129]">{p.empty}</p>
        <p className="mt-2 text-sm text-[#5b6478]">{p.emptyHint}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden db-card-flat md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#EFA188]/15 bg-[#FDFBF7] text-[11px] font-bold uppercase tracking-wide text-[#5b6478]">
            <tr>
              <th className="px-4 py-3">{p.columns.company}</th>
              <th className="px-4 py-3">{p.columns.contact}</th>
              <th className="px-4 py-3">{p.columns.type}</th>
              <th className="px-4 py-3">{p.columns.date}</th>
              <th className="px-4 py-3">{p.columns.status}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const selected = selectedId === request.id;
              return (
                <tr
                  key={request.id}
                  className={`cursor-pointer border-b border-[#212129]/6 last:border-0 ${
                    selected ? "bg-[#EFA188]/12" : "hover:bg-[#FDFBF7]"
                  }`}
                  onClick={() => onSelect(request.id)}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">{request.companyName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {request.contactName}
                    {request.jobTitle ? (
                      <span className="block text-xs text-slate-500">{request.jobTitle}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.types[request.partnershipType]}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPartnershipDate(request.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${partnershipStatusBadgeClass(request.workflowStatus)}`}
                    >
                      {p.status[request.workflowStatus]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {requests.map((request) => {
          const selected = selectedId === request.id;
          return (
            <li key={request.id}>
              <button
                type="button"
                onClick={() => onSelect(request.id)}
                className={`w-full db-card-flat p-4 text-left ${
                  selected
                    ? "border-[#EFA188]/50 bg-[#EFA188]/10"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">{request.companyName}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{request.contactName}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${partnershipStatusBadgeClass(request.workflowStatus)}`}
                  >
                    {p.status[request.workflowStatus]}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {p.types[request.partnershipType]} ·{" "}
                  {formatPartnershipDate(request.createdAt, locale)}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function PartnersPanel({
  profile,
  copy,
  locale,
  initialRequests,
  initialLoadError,
}: PartnersPanelProps) {
  const pro = resolveCraftlinkPlan(profile.plan_tier) === "PRO";
  const p = copy.partners;

  const [requests, setRequests] = useState(() => withDemoRequestIfEmpty(initialRequests));
  const [loadError] = useState(initialLoadError);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => withDemoRequestIfEmpty(initialRequests)[0]?.id ?? null,
  );

  const visibleRequests = useMemo(
    () =>
      showArchived
        ? requests
        : requests.filter((request) => request.workflowStatus !== "ARCHIVE"),
    [requests, showArchived],
  );

  const pendingCount = useMemo(
    () => requests.filter((request) => request.workflowStatus === "A_TRAITER").length,
    [requests],
  );

  const selectedRequest = visibleRequests.find((request) => request.id === selectedId) ?? null;

  useEffect(() => {
    setRequests(withDemoRequestIfEmpty(initialRequests));
  }, [initialRequests]);

  const handleUpdated = (updated: DashboardPartnershipRequest) => {
    setRequests((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const content = (
    <div className="space-y-4">
      {loadError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {p.loadError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {pendingCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            {p.pendingCount.replace("{count}", String(pendingCount))}
          </span>
        ) : (
          <span />
        )}
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300"
          />
          {p.showArchived}
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <RequestsTable
          requests={visibleRequests}
          copy={copy}
          locale={locale}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selectedRequest ? (
          <PartnershipRequestDetail
            request={selectedRequest}
            copy={copy}
            locale={locale}
            onClose={() => setSelectedId(null)}
            onUpdated={handleUpdated}
          />
        ) : null}
      </div>

      {pro ? <PartnersAffiliateLinksCard profile={profile} copy={copy} /> : null}
    </div>
  );

  return (
    <section className="space-y-6">
      <DashboardPageHeader title={copy.tabs.partners} subtitle={p.subtitle} />

      {!pro ? (
        <PlanLockedCard
          title={p.lockedTitle}
          body={p.lockedBody}
          ctaLabel={p.upgradeCta}
          locale={locale}
        >
          {content}
        </PlanLockedCard>
      ) : (
        content
      )}
    </section>
  );
}
