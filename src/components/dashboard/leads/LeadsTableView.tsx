"use client";

import { FaArrowDown, FaArrowUp, FaSort } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { LeadWorkflowActions } from "@/components/dashboard/leads/LeadWorkflowActions";
import { WhatsAppContactButton } from "@/components/dashboard/leads/WhatsAppContactButton";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { useResizableColumns } from "@/hooks/useResizableColumns";
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

type TableColumnKey =
  | "checkbox"
  | "id"
  | "name"
  | "date"
  | "work"
  | "zone"
  | "status"
  | "actions";

const DEFAULT_WIDTHS: Record<TableColumnKey, number> = {
  checkbox: 44,
  id: 72,
  name: 150,
  date: 118,
  work: 200,
  zone: 130,
  status: 112,
  actions: 108,
};

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

function ColumnResizeHandle({
  onResizeStart,
}: {
  onResizeStart: (clientX: number) => void;
}) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onResizeStart(event.clientX);
      }}
      className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize hover:bg-slate-300/80"
    />
  );
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSortChange,
  width,
  onResizeStart,
  className = "",
}: {
  label: string;
  sortKey: LeadSortKey;
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
  width: number;
  onResizeStart: (clientX: number) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;

  return (
    <th
      className={`relative select-none px-3 py-2.5 ${className}`}
      style={{ width, minWidth: width, maxWidth: width }}
    >
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
      <ColumnResizeHandle onResizeStart={onResizeStart} />
    </th>
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('button, input, select, a, [role="listbox"], [role="option"]'),
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
  const { widths, startResize } = useResizableColumns(DEFAULT_WIDTHS);
  const allSelected = leads.length > 0 && leads.every((lead) => selectedIds.has(lead.id));

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-100">
      <table className="w-full border-collapse text-left text-sm" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {(Object.keys(DEFAULT_WIDTHS) as TableColumnKey[]).map((key) => (
            <col key={key} style={{ width: widths[key] }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-neutral-200 bg-slate-50/90">
            <th
              className="relative px-3 py-2.5"
              style={{ width: widths.checkbox, minWidth: widths.checkbox }}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-neutral-300 accent-black"
                aria-label={l.bulk.selectAll}
              />
              <ColumnResizeHandle onResizeStart={(x) => startResize("checkbox", x)} />
            </th>
            <SortableHeader
              label={cols.id}
              sortKey="id"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.id}
              onResizeStart={(x) => startResize("id", x)}
            />
            <SortableHeader
              label={cols.name}
              sortKey="name"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.name}
              onResizeStart={(x) => startResize("name", x)}
            />
            <SortableHeader
              label={cols.requestDate}
              sortKey="date"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.date}
              onResizeStart={(x) => startResize("date", x)}
            />
            <th
              className="relative px-3 py-2.5"
              style={{ width: widths.work, minWidth: widths.work }}
            >
              <span className={HEADER_CLASS}>{cols.work}</span>
              <ColumnResizeHandle onResizeStart={(x) => startResize("work", x)} />
            </th>
            <th
              className="relative hidden px-3 py-2.5 sm:table-cell"
              style={{ width: widths.zone, minWidth: widths.zone }}
            >
              <span className={HEADER_CLASS}>{cols.zone}</span>
              <ColumnResizeHandle onResizeStart={(x) => startResize("zone", x)} />
            </th>
            <th
              className="relative px-3 py-2.5"
              style={{ width: widths.status, minWidth: widths.status }}
            >
              <button
                type="button"
                onClick={() => onSortChange(toggleLeadSort(sort, "status"))}
                className={`inline-flex items-center gap-1 transition hover:text-slate-700 ${HEADER_CLASS} ${
                  sort.key === "status" ? "text-slate-700" : ""
                }`}
              >
                {cols.status}
                <SortIcon active={sort.key === "status"} direction={sort.direction} />
              </button>
              <ColumnResizeHandle onResizeStart={(x) => startResize("status", x)} />
            </th>
            <th
              className="relative px-3 py-2.5 text-right"
              style={{ width: widths.actions, minWidth: widths.actions }}
            >
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
              <ColumnResizeHandle onResizeStart={(x) => startResize("actions", x)} />
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const waHref = buildLeadWhatsAppLink(lead, artisanName);
            const muted = isLeadWorkflowMuted(lead.workflowStatus);
            const selected = selectedIds.has(lead.id);

            return (
              <tr
                key={lead.id}
                onClick={(event) => {
                  if (isInteractiveTarget(event.target)) return;
                  onOpenDetail(lead.id);
                }}
                className={`cursor-pointer border-b border-neutral-100 last:border-0 ${
                  selected ? "bg-slate-50" : muted ? "bg-neutral-50/70" : "hover:bg-slate-50/70"
                } ${leadRowMutedClass(muted)}`}
              >
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(lead.id)}
                    className="h-4 w-4 rounded border-neutral-300 accent-black"
                    aria-label={l.bulk.selectOne.replace("{name}", lead.clientName)}
                  />
                </td>
                <td
                  className={`px-3 py-2.5 font-mono text-xs font-medium ${muted ? "text-neutral-400" : "text-slate-600"}`}
                >
                  {formatRequestNumber(lead.requestNumber)}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(lead.id)}
                    className="text-left"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`font-medium underline-offset-2 hover:underline ${muted ? "text-neutral-500" : "text-slate-900"}`}
                      >
                        {lead.clientName}
                      </span>
                      {lead.workflowStatus === "done" ? (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${workflowStatusBadgeClass("done")}`}
                        >
                          {l.workflow.done}
                        </span>
                      ) : null}
                      {lead.workflowStatus === "archived" ? (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${workflowStatusBadgeClass("archived")}`}
                        >
                          {l.workflow.archived}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </td>
                <td className={`px-3 py-2.5 text-slate-600 ${muted ? "text-neutral-400" : ""}`}>
                  {formatLeadDate(lead.createdAt, locale)}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    title={lead.workType}
                    className={`block truncate font-medium ${muted ? "text-neutral-500" : "text-slate-800"}`}
                  >
                    {lead.workType}
                  </span>
                </td>
                <td
                  className={`hidden px-3 py-2.5 text-slate-600 sm:table-cell ${muted ? "text-neutral-400" : ""}`}
                >
                  <span className="block truncate">{lead.zone}</span>
                </td>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <LeadStatusPicker
                    value={lead.delayStatus}
                    onChange={(status) => onDelayStatusChange(lead.id, status)}
                    copy={copy}
                    compact
                  />
                </td>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
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
          })}
        </tbody>
      </table>
    </div>
  );
}
