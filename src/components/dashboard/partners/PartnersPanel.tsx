"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProFeatureGuard } from "@/components/dashboard/ProFeatureGuard";
import { PartnershipRequestDetail } from "@/components/dashboard/partners/PartnershipRequestDetail";
import { PartnersProSelectionCard } from "@/components/dashboard/partners/PartnersProSelectionCard";
import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { Profile } from "@/domain/profile";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { hasProFeatureAccess } from "@/lib/dashboard/planAccess";
import { buildDemoPartnershipRequest } from "@/lib/partnerships/demoPartnershipRequest";
import {
  formatPartnershipDate,
  partnershipStatusBadgeClass,
} from "@/lib/partnerships/partnershipDisplay";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
          <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-medium uppercase tracking-wider text-slate-400">
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
                  className={`cursor-pointer border-b border-slate-100 last:border-0 ${
                    selected ? "bg-slate-50" : "hover:bg-slate-50/80"
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

      <ul className="space-y-2 md:hidden">
        {requests.map((request) => {
          const selected = selectedId === request.id;
          return (
            <li key={request.id}>
              <button
                type="button"
                onClick={() => onSelect(request.id)}
                className={`w-full db-card-flat p-3 text-left ${
                  selected ? "border-slate-300 bg-slate-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{request.companyName}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-600">{request.contactName}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${partnershipStatusBadgeClass(request.workflowStatus)}`}
                  >
                    {p.status[request.workflowStatus]}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[10px] text-slate-500">
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
  const pro = hasProFeatureAccess(profile);
  const p = copy.partners;
  const isDesktopPartners = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);

  const [requests, setRequests] = useState(() => withDemoRequestIfEmpty(initialRequests));
  const [loadError] = useState(initialLoadError);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (!pro) return;
    setSelectedId(id);
  };

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

  const selectedRequest = pro
    ? (visibleRequests.find((request) => request.id === selectedId) ?? null)
    : null;
  const showMobileSheet = Boolean(pro && selectedRequest && !isDesktopPartners);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setRequests(withDemoRequestIfEmpty(initialRequests));
  }, [initialRequests]);

  useEffect(() => {
    if (!pro) {
      setSelectedId(null);
      return;
    }
    if (isDesktopPartners && !selectedId && visibleRequests[0]) {
      setSelectedId(visibleRequests[0].id);
    }
  }, [pro, isDesktopPartners, visibleRequests, selectedId]);

  useEffect(() => {
    if (!showMobileSheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showMobileSheet]);

  const handleUpdated = (updated: DashboardPartnershipRequest) => {
    setRequests((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const content = (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400 max-md:text-xs">
          {p.requestsTitle}
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-md:hidden">{p.requestsHint}</p>
      </div>

      {loadError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {p.loadError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {pendingCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 md:px-3 md:py-1 md:text-xs">
            {p.pendingCount.replace("{count}", String(pendingCount))}
          </span>
        ) : (
          <span />
        )}
        <label className="flex items-center gap-2 text-xs text-slate-600 md:text-sm">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-neutral-300 md:h-4 md:w-4"
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
          onSelect={handleSelect}
        />
        {selectedRequest && isDesktopPartners ? (
          <PartnershipRequestDetail
            request={selectedRequest}
            copy={copy}
            locale={locale}
            onClose={() => setSelectedId(null)}
            onUpdated={handleUpdated}
          />
        ) : null}
      </div>

      <PartnersProSelectionCard profile={profile} copy={copy} />
    </div>
  );

  return (
    <section className="space-y-6">
      <DashboardPageHeader title={p.title} subtitle={p.subtitle} compactOnMobile />

      <ProFeatureGuard
        feature="partners"
        proAccess={profile}
        copy={copy}
        locale={locale}
      >
        {content}
      </ProFeatureGuard>

      {mounted && showMobileSheet && selectedRequest
        ? createPortal(
            <>
              <button
                type="button"
                aria-label={p.detail.close}
                className="db-partners-detail-backdrop"
                onClick={() => setSelectedId(null)}
              />
              <PartnershipRequestDetail
                request={selectedRequest}
                copy={copy}
                locale={locale}
                compact
                onClose={() => setSelectedId(null)}
                onUpdated={handleUpdated}
              />
            </>,
            document.body,
          )
        : null}
    </section>
  );
}
