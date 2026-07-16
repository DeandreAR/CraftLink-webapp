"use client";

import { FaArrowDown, FaArrowUp, FaSort } from "react-icons/fa6";
import type { DashboardLead } from "@/domain/lead";
import { LeadStatusPicker } from "@/components/dashboard/leads/LeadStatusControls";
import { WhatsAppContactButton } from "@/components/dashboard/leads/WhatsAppContactButton";
import type { LeadsViewBaseProps } from "@/components/dashboard/leads/leadsViewTypes";
import { useResizableColumns } from "@/hooks/useResizableColumns";
import { buildLeadWhatsAppLinks } from "@/lib/leads/buildLeadWhatsAppLink";
import {
  daysSinceInvoiceSent,
  daysSinceQuoteSent,
  formatBillingDaysCount,
} from "@/lib/leads/leadBillingDays";
import type { LeadSortKey, LeadSortState } from "@/lib/leads/sortLeads";
import { toggleLeadSort } from "@/lib/leads/sortLeads";
import { LeadWorkflowBadge } from "@/components/dashboard/leads/LeadWorkflowControls";
import { useLeadAttachmentUpload } from "@/hooks/useLeadAttachmentUpload";
import {
  formatLeadDate,
  formatRequestNumber,
  formatScheduleShort,
  isLeadWorkflowMuted,
  leadRowMutedClass,
} from "@/components/dashboard/leads/leadsViewShared";

type TableColumnKey =
  | "checkbox"
  | "id"
  | "name"
  | "date"
  | "work"
  | "zone"
  | "delay"
  | "calendar"
  | "status"
  | "quoteDays"
  | "invoiceDays"
  | "whatsapp";

const DEFAULT_WIDTHS: Record<TableColumnKey, number> = {
  checkbox: 44,
  id: 72,
  name: 150,
  date: 118,
  work: 180,
  zone: 120,
  delay: 108,
  calendar: 108,
  status: 120,
  quoteDays: 76,
  invoiceDays: 84,
  whatsapp: 56,
};

type LeadsTableViewProps = LeadsViewBaseProps & {
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
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

type LeadTableDataRowProps = {
  lead: DashboardLead;
  copy: LeadsTableViewProps["copy"];
  locale: LeadsTableViewProps["locale"];
  businessName?: string;
  muted: boolean;
  selected: boolean;
  waLinks: ReturnType<typeof buildLeadWhatsAppLinks>;
  onOpenDetail: (leadId: string) => void;
  onToggleSelect: (leadId: string) => void;
  onDelayStatusChange: (leadId: string, status: DashboardLead["delayStatus"]) => void;
  onWhatsAppContact: LeadsTableViewProps["onWhatsAppContact"];
  onLeadUpdated?: (lead: DashboardLead) => void;
};

function LeadTableDataRow({
  lead,
  copy,
  locale,
  muted,
  selected,
  waLinks,
  onOpenDetail,
  onToggleSelect,
  onDelayStatusChange,
  onWhatsAppContact,
  onLeadUpdated,
}: LeadTableDataRowProps) {
  const l = copy.leads;
  const { dragOver, uploading, bindFileDrop } = useLeadAttachmentUpload({
    leadId: lead.id,
    onLeadUpdated: onLeadUpdated ?? (() => {}),
    invalidTypeMessage: l.attachments.invalidType,
  });
  const dropEnabled = Boolean(onLeadUpdated);
  const dropProps = bindFileDrop(dropEnabled);

  return (
    <tr
      {...dropProps}
      onClick={(event) => {
        if (isInteractiveTarget(event.target)) return;
        onOpenDetail(lead.id);
      }}
      className={`cursor-pointer border-b border-neutral-100 last:border-0 ${
        dragOver || uploading
          ? "bg-[#FFF5F2] outline outline-2 outline-[#EFA188]/60"
          : selected
            ? "bg-slate-50"
            : muted
              ? "bg-neutral-50/70"
              : "hover:bg-slate-50/70"
      } ${leadRowMutedClass(muted)}`}
      title={dragOver ? l.attachments.dropHintShort : undefined}
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
          className={`text-left font-medium underline-offset-2 hover:underline ${muted ? "text-neutral-500" : "text-slate-900"}`}
        >
          {lead.clientName}
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
      <td className={`hidden px-3 py-2.5 md:table-cell ${muted ? "text-neutral-400" : ""}`}>
        {lead.schedule?.date ? (
          <span className="text-xs font-medium text-slate-700">
            {formatScheduleShort(lead.schedule.date, locale)}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">{l.calendar.notScheduled}</span>
        )}
      </td>
      <td className={`hidden px-3 py-2.5 sm:table-cell ${muted ? "opacity-70" : ""}`}>
        <LeadWorkflowBadge status={lead.workflowStatus} copy={copy} compact />
      </td>
      <td
        className={`hidden px-3 py-2.5 text-center text-xs font-semibold lg:table-cell ${
          muted ? "text-neutral-400" : "text-slate-700"
        }`}
      >
        {formatBillingDaysCount(
          daysSinceQuoteSent(lead),
          l.billing.notSent,
          l.billing.dayUnit,
        )}
      </td>
      <td
        className={`hidden px-3 py-2.5 text-center text-xs font-semibold lg:table-cell ${
          muted ? "text-neutral-400" : "text-slate-700"
        }`}
      >
        {formatBillingDaysCount(
          daysSinceInvoiceSent(lead),
          l.billing.notSent,
          l.billing.dayUnit,
        )}
      </td>
      <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
        {waLinks ? (
          <WhatsAppContactButton
            label={l.contactWhatsApp}
            onClick={() => onWhatsAppContact(lead.id, waLinks)}
            compact
            iconOnly
          />
        ) : null}
      </td>
    </tr>
  );
}

export function LeadsTableView({
  leads,
  copy,
  locale,
  businessName,
  sort,
  onSortChange,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenDetail,
  onDelayStatusChange,
  onWhatsAppContact,
  onLeadUpdated,
}: LeadsTableViewProps) {
  const l = copy.leads;
  const cols = l.columns;
  const { widths, startResize } = useResizableColumns(DEFAULT_WIDTHS);
  const allSelected = leads.length > 0 && leads.every((lead) => selectedIds.has(lead.id));

  return (
    <div className="scrollbar-soft overflow-x-auto rounded-2xl border border-[#212129]/8 bg-white shadow-[0_12px_32px_rgba(33,33,41,0.06)]">
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
            <SortableHeader
              label={cols.delay}
              sortKey="delay"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.delay}
              onResizeStart={(x) => startResize("delay", x)}
            />
            <SortableHeader
              label={cols.calendar}
              sortKey="calendar"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.calendar}
              onResizeStart={(x) => startResize("calendar", x)}
              className="hidden md:table-cell"
            />
            <SortableHeader
              label={cols.status}
              sortKey="contactStatus"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.status}
              onResizeStart={(x) => startResize("status", x)}
              className="hidden sm:table-cell"
            />
            <SortableHeader
              label={cols.quoteDays}
              sortKey="quoteDays"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.quoteDays}
              onResizeStart={(x) => startResize("quoteDays", x)}
              className="hidden lg:table-cell"
            />
            <SortableHeader
              label={cols.invoiceDays}
              sortKey="invoiceDays"
              sort={sort}
              onSortChange={onSortChange}
              width={widths.invoiceDays}
              onResizeStart={(x) => startResize("invoiceDays", x)}
              className="hidden lg:table-cell"
            />
            <th
              className="relative px-3 py-2.5 text-center"
              style={{ width: widths.whatsapp, minWidth: widths.whatsapp }}
            >
              <span className={HEADER_CLASS}>{cols.whatsapp}</span>
              <ColumnResizeHandle onResizeStart={(x) => startResize("whatsapp", x)} />
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const waLinks = buildLeadWhatsAppLinks(lead, businessName);
            const muted = isLeadWorkflowMuted(lead.workflowStatus);
            const selected = selectedIds.has(lead.id);

            return (
              <LeadTableDataRow
                key={lead.id}
                lead={lead}
                copy={copy}
                locale={locale}
                businessName={businessName}
                muted={muted}
                selected={selected}
                waLinks={waLinks}
                onOpenDetail={onOpenDetail}
                onToggleSelect={onToggleSelect}
                onDelayStatusChange={onDelayStatusChange}
                onWhatsAppContact={onWhatsAppContact}
                onLeadUpdated={onLeadUpdated}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
