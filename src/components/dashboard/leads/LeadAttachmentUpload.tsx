"use client";

import { useRef } from "react";
import { FaCloudArrowUp, FaFilePdf, FaImage } from "react-icons/fa6";
import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardLead, LeadAttachment } from "@/domain/lead";
import { checkFileExpiration } from "@/lib/leads/checkFileExpiration";
import type { DashboardDictionary } from "@/i18n/types";
import { useLeadAttachmentUpload } from "@/hooks/useLeadAttachmentUpload";

type LeadAttachmentUploadProps = {
  lead: DashboardLead;
  plan: CraftlinkPlan;
  copy: DashboardDictionary;
  onLeadUpdated: (lead: DashboardLead) => void;
  embedded?: boolean;
};

function attachmentIcon(mimeType: string) {
  if (mimeType === "application/pdf") {
    return <FaFilePdf className="h-4 w-4 text-red-500" aria-hidden />;
  }
  return <FaImage className="h-4 w-4 text-sky-500" aria-hidden />;
}

export function LeadAttachmentUpload({
  lead,
  plan,
  copy,
  onLeadUpdated,
  embedded = false,
}: LeadAttachmentUploadProps) {
  const a = copy.leads.attachments;
  const inputRef = useRef<HTMLInputElement>(null);
  const { dragOver, uploading, error, handleFiles, bindFileDrop } = useLeadAttachmentUpload({
    leadId: lead.id,
    onLeadUpdated,
    invalidTypeMessage: a.invalidType,
  });

  const mediaExpired = checkFileExpiration(new Date(lead.createdAt), plan);
  const attachments = lead.attachments ?? [];
  const dropProps = bindFileDrop(!mediaExpired);

  return (
    <div className={embedded ? undefined : "mt-4 border-t border-neutral-100 pt-4"}>
      {!embedded ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {a.title}
        </p>
      ) : null}

      {mediaExpired ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">{a.expiredTitle}</p>
          <p className="mt-1 text-xs leading-relaxed">{a.expiredBody}</p>
        </div>
      ) : (
        <>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            {...dropProps}
            className={`${embedded ? "" : "mt-2 "}flex min-h-[88px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 text-center transition ${
              dragOver
                ? "border-slate-900 bg-slate-50"
                : "border-neutral-200 bg-white/80 hover:border-neutral-300"
            } disabled:opacity-60`}
          >
            <FaCloudArrowUp className="h-5 w-5 text-neutral-400" aria-hidden />
            <span className="text-sm font-medium text-slate-700">
              {uploading ? a.uploading : a.dropHint}
            </span>
            <span className="text-[11px] text-neutral-400">{a.formats}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </>
      )}

      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}

      {attachments.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {attachments.map((file: LeadAttachment) => {
            const fileExpired = checkFileExpiration(new Date(file.uploadedAt), plan);
            if (fileExpired) {
              return (
                <li
                  key={file.id}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950"
                >
                  {a.fileExpired.replace("{fileName}", file.fileName)}
                </li>
              );
            }
            return (
              <li key={file.id}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-neutral-50"
                >
                  {attachmentIcon(file.mimeType)}
                  <span className="truncate">{file.fileName}</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
