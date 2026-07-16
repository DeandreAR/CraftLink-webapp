"use client";

import type { ReactNode } from "react";
import { FaCloudArrowUp } from "react-icons/fa6";
import type { DashboardDictionary } from "@/i18n/types";
import { useLeadAttachmentUpload } from "@/hooks/useLeadAttachmentUpload";
import type { DashboardLead } from "@/domain/lead";

type LeadFileDropTargetProps = {
  leadId: string;
  enabled?: boolean;
  copy: DashboardDictionary;
  onLeadUpdated: (lead: DashboardLead) => void;
  children: ReactNode;
  className?: string;
};

export function LeadFileDropTarget({
  leadId,
  enabled = true,
  copy,
  onLeadUpdated,
  children,
  className = "",
}: LeadFileDropTargetProps) {
  const a = copy.leads.attachments;
  const { dragOver, uploading, error, bindFileDrop } = useLeadAttachmentUpload({
    leadId,
    onLeadUpdated,
    invalidTypeMessage: a.invalidType,
  });

  const dropProps = bindFileDrop(enabled);

  return (
    <div className={`relative ${className}`.trim()} {...dropProps}>
      {children}
      {enabled && (dragOver || uploading) ? (
        <div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 rounded-[inherit] border-2 border-dashed border-[#EFA188] bg-[#FFF5F2]/95 px-2 text-center backdrop-blur-[1px]"
          aria-live="polite"
        >
          <FaCloudArrowUp className="h-4 w-4 text-[#c45a3a]" aria-hidden />
          <span className="text-[10px] font-bold text-[#212129]">
            {uploading ? a.uploading : a.dropHintShort}
          </span>
        </div>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="absolute bottom-1 left-1 right-1 z-20 truncate rounded bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
