"use client";

import { useEffect, useMemo, useState } from "react";
import { PlanLockedCard } from "@/components/dashboard/PlanLockedCard";
import { PartnershipRequestDetail } from "@/components/dashboard/partners/PartnershipRequestDetail";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { Profile } from "@/domain/profile";
import { resolveCraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import {
  formatPartnershipDate,
  partnershipStatusBadgeClass,
} from "@/lib/partnerships/partnershipDisplay";

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
      <div className="rounded-[18px] border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-semibold text-slate-700">{p.empty}</p>
        <p className="mt-2 text-sm text-slate-500">{p.emptyHint}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[18px] border border-neutral-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
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
                  className={`cursor-pointer border-b border-neutral-100 last:border-0 ${
                    selected ? "bg-[#EFA188]/10" : "hover:bg-neutral-50"
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
                className={`w-full rounded-[18px] border p-4 text-left ${
                  selected
                    ? "border-[#EFA188] bg-[#EFA188]/10"
                    : "border-neutral-200 bg-white"
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

  const [requests, setRequests] = useState(initialRequests);
  const [loadError] = useState(initialLoadError);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRequests[0]?.id ?? null,
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
    setRequests(initialRequests);
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
    </div>
  );

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
          {copy.tabs.partners}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
      </header>

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
