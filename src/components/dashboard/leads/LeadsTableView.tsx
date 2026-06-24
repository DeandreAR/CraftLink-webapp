"use client";

import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
} from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowActions } from "@/components/dashboard/leads/LeadWorkflowActions";
import { WhatsAppContactButton } from "@/components/dashboard/leads/WhatsAppContactButton";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { buildLeadWhatsAppLink } from "@/lib/leads/buildLeadWhatsAppLink";
import type { LeadSortKey, LeadSortState } from "@/lib/leads/sortLeads";
import { toggleLeadSort } from "@/lib/leads/sortLeads";
import {
  formatLeadDate,
  formatRequestNumber,
  isLeadWorkflowMuted,
  leadRowMutedClass,
  workflowStatusBadgeClass,
} from "@/components/dashboard/leads/leadsViewShared";

export type LeadsTableColumnId = "name" | "date" | "zone";

type LeadsTableViewProps = LeadsViewBaseProps & {
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
  archivedCount: number;
  selectedIds: Set<string>;
  onToggleSelect: (leadId: string) => void;
  onToggleSelectAll: () => void;
};

const HEADER_CLASS =
  "text-[11px] font-semibold uppercase tracking-wider text-slate-500";

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) return <FaSort className="h-3 w-3 opacity-35" aria-hidden />;
  return direction === "asc" ? (
    <FaArrowUp className="h-3 w-3 text-slate-600" aria-hidden />
  ) : (
    <FaArrowDown className="h-3 w-3 text-slate-600" aria-hidden />
  );
}

function SortableTh({
  label,
  sortKey,
  sort,
  onSortChange,
  collapsed,
  onToggleCollapse,
  className = "",
}: {
  label: string;
  sortKey: LeadSortKey;
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}) {
  const active = sort.key === sortKey;

  if (collapsed) {
    return (
      <th className={`w-8 px-1 py-2.5 ${className}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          title={label}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <FaChevronRight className="h-3 w-3" aria-hidden />
        </button>
      </th>
    );
  }

  return (
    <th className={`px-3 py-2.5 ${className}`}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSortChange(toggleLeadSort(sort, sortKey))}
          className={`inline-flex items-center gap-1 transition hover:text-slate-700 ${HEADER_CLASS} ${
            active ? "text-slate-700" : ""
          }`}
        >
          {label}
          <SortIcon active={active} direction={sort.direction} />
        </button>
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="ml-0.5 rounded p-0.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
            aria-label={`Réduire ${label}`}
          >
            <FaChevronLeft className="h-2.5 w-2.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </th>
  );
}

export function LeadsTableView({
  leads,
  copy,
  locale,
  artisanName,
  sort,
  onSortChange,
  showArchived,
  onShowArchivedChange,
  archivedCount,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenDetail,
  onDelayStatusChange,
  onMarkDone,
  onMarkArchived,
  onReactivate,
  onWhatsAppContact,
}: LeadsTableViewProps) {
  const l = copy.leads;
  const cols = l.columns;
  const s = l.sort;
  const [collapsed, setCollapsed] = useState<Set<LeadsTableColumnId>>(new Set());

  const toggleColumn = (id: LeadsTableColumnId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isCollapsed = (id: LeadsTableColumnId) => collapsed.has(id);
  const allSelected = leads.length > 0 && leads.every((lead) => selectedIds.has(lead.id));

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-100">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-slate-50/90">
            <th className="w-10 px-3 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-neutral-300 accent-black"
                aria-label={l.bulk.selectAll}
              />
            </th>
            <th className={`px-3 py-2.5 ${HEADER_CLASS}`}>{cols.id}</th>
            <SortableTh
              label={cols.name}
              sortKey="name"
              sort={sort}
              onSortChange={onSortChange}
              collapsed={isCollapsed("name")}
              onToggleCollapse={() => toggleColumn("name")}
            />
            <SortableTh
              label={cols.requestDate}
              sortKey="date"
              sort={sort}
              onSortChange={onSortChange}
              collapsed={isCollapsed("date")}
              onToggleCollapse={() => toggleColumn("date")}
            />
            <th className={`px-3 py-2.5 ${HEADER_CLASS}`}>{cols.work}</th>
            <th className={`hidden px-3 py-2.5 sm:table-cell ${isCollapsed("zone") ? "w-8" : ""}`}>
              {isCollapsed("zone") ? (
                <button
                  type="button"
                  onClick={() => toggleColumn("zone")}
                  title={cols.zone}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
                >
                  <FaChevronRight className="h-3 w-3" aria-hidden />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <span className={HEADER_CLASS}>{cols.zone}</span>
                  <button
                    type="button"
                    onClick={() => toggleColumn("zone")}
                    className="rounded p-0.5 text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                    aria-label={`Réduire ${cols.zone}`}
                  >
                    <FaChevronLeft className="h-2.5 w-2.5" aria-hidden />
                  </button>
                </div>
              )}
            </th>
            <th className={`px-3 py-2.5 ${HEADER_CLASS}`}>
              <button
                type="button"
                onClick={() => onSortChange(toggleLeadSort(sort, "status"))}
                className={`inline-flex items-center gap-1 transition hover:text-slate-700 ${
                  sort.key === "status" ? "text-slate-700" : ""
                }`}
              >
                {cols.status}
                <SortIcon active={sort.key === "status"} direction={sort.direction} />
              </button>
            </th>
            <th className="px-3 py-2.5 text-right">
              {archivedCount > 0 ? (
                <button
                  type="button"
                  onClick={() => onShowArchivedChange(!showArchived)}
                  className={`text-[10px] font-semibold uppercase tracking-wide transition ${
                    showArchived
                      ? "text-slate-800 underline"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {showArchived
                    ? s.hideArchived
                    : s.showArchived.replace("{count}", String(archivedCount))}
                </button>
              ) : null}
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              copy={copy}
              locale={locale}
              artisanName={artisanName}
              selected={selectedIds.has(lead.id)}
              collapsed={collapsed}
              onToggleSelect={onToggleSelect}
              onOpenDetail={onOpenDetail}
              onDelayStatusChange={onDelayStatusChange}
              onMarkDone={onMarkDone}
              onMarkArchived={onMarkArchived}
              onReactivate={onReactivate}
              onWhatsAppContact={onWhatsAppContact}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type LeadTableRowProps = {
  lead: DashboardLead;
  selected: boolean;
  collapsed: Set<LeadsTableColumnId>;
  onToggleSelect: (leadId: string) => void;
} & Pick<
  LeadsTableViewProps,
  | "copy"
  | "locale"
  | "artisanName"
  | "onOpenDetail"
  | "onDelayStatusChange"
  | "onMarkDone"
  | "onMarkArchived"
  | "onReactivate"
  | "onWhatsAppContact"
>;

function LeadTableRow({
  lead,
  copy,
  locale,
  artisanName,
  selected,
  collapsed,
  onToggleSelect,
  onOpenDetail,
  onDelayStatusChange,
  onMarkDone,
  onMarkArchived,
  onReactivate,
  onWhatsAppContact,
}: LeadTableRowProps) {
  const l = copy.leads;
  const waHref = buildLeadWhatsAppLink(lead, artisanName);
  const muted = isLeadWorkflowMuted(lead.workflowStatus);
  const isCollapsed = (id: LeadsTableColumnId) => collapsed.has(id);

  return (
    <tr
      className={`border-b border-neutral-100 last:border-0 ${
        selected ? "bg-slate-50" : muted ? "bg-neutral-50/70" : "hover:bg-slate-50/70"
      } ${leadRowMutedClass(muted)}`}
    >
      <td className="px-3 py-2.5">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(lead.id)}
          className="h-4 w-4 rounded border-neutral-300 accent-black"
          aria-label={l.bulk.selectOne.replace("{name}", lead.clientName)}
        />
      </td>
      <td className={`px-3 py-2.5 font-mono text-xs font-medium ${muted ? "text-neutral-400" : "text-slate-600"}`}>
        {formatRequestNumber(lead.requestNumber)}
      </td>
      {isCollapsed("name") ? (
        <td className="w-8 px-1" />
      ) : (
        <td className="px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`font-medium ${muted ? "text-neutral-500" : "text-slate-900"}`}>
              {lead.clientName}
            </span>
            {lead.workflowStatus === "done" ? (
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${workflowStatusBadgeClass("done")}`}>
                {l.workflow.done}
              </span>
            ) : null}
            {lead.workflowStatus === "archived" ? (
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${workflowStatusBadgeClass("archived")}`}>
                {l.workflow.archived}
              </span>
            ) : null}
          </div>
        </td>
      )}
      {isCollapsed("date") ? (
        <td className="w-8 px-1" />
      ) : (
        <td className={`px-3 py-2.5 text-slate-600 ${muted ? "text-neutral-400" : ""}`}>
          {formatLeadDate(lead.createdAt, locale)}
        </td>
      )}
      <td className="max-w-[160px] px-3 py-2.5">
        <button
          type="button"
          onClick={() => onOpenDetail(lead.id)}
          title={lead.workType}
          className={`block w-full truncate text-left font-medium underline-offset-2 hover:underline ${muted ? "text-neutral-500" : "text-slate-800 hover:text-black"}`}
        >
          {lead.workType}
        </button>
      </td>
      {isCollapsed("zone") ? (
        <td className="hidden w-8 px-1 sm:table-cell" />
      ) : (
        <td className={`hidden px-3 py-2.5 text-slate-600 sm:table-cell ${muted ? "text-neutral-400" : ""}`}>
          {lead.zone}
        </td>
      )}
      <td className="px-3 py-2.5">
        <LeadStatusPicker
          value={lead.delayStatus}
          onChange={(status) => onDelayStatusChange(lead.id, status)}
          copy={copy}
          compact
        />
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1.5">
          {waHref ? (
            <WhatsAppContactButton
              label={l.contactWhatsApp}
              onClick={() => onWhatsAppContact(waHref)}
              compact
              iconOnly
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
      </td>
    </tr>
  );
}
