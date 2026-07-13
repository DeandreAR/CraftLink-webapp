"use client";

import { useCallback, useState } from "react";
import { uploadLeadAttachmentAction } from "@/app/actions/leads";
import type { DashboardLead } from "@/domain/lead";
import {
  LEAD_ATTACHMENT_MAX_BYTES,
  LEAD_ATTACHMENT_MIME_TYPES,
  LEAD_ATTACHMENT_TOO_LARGE_MESSAGE,
} from "@/lib/leads/leadAttachments";

type UseLeadAttachmentUploadOptions = {
  leadId: string;
  onLeadUpdated: (lead: DashboardLead) => void;
  invalidTypeMessage: string;
};

export function isFileDragEvent(event: React.DragEvent) {
  return event.dataTransfer.types.includes("Files");
}

export function useLeadAttachmentUpload({
  leadId,
  onLeadUpdated,
  invalidTypeMessage,
}: UseLeadAttachmentUploadOptions) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadLeadAttachmentAction(leadId, formData);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        onLeadUpdated(result.lead);
      } finally {
        setUploading(false);
      }
    },
    [leadId, onLeadUpdated],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!LEAD_ATTACHMENT_MIME_TYPES.has(file.type)) {
        setError(invalidTypeMessage);
        return;
      }
      if (file.size > LEAD_ATTACHMENT_MAX_BYTES) {
        setError(LEAD_ATTACHMENT_TOO_LARGE_MESSAGE);
        return;
      }
      void uploadFile(file);
    },
    [invalidTypeMessage, uploadFile],
  );

  const bindFileDrop = useCallback(
    (enabled = true) => ({
      onDragOver: (event: React.DragEvent) => {
        if (!enabled || !isFileDragEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
        setDragOver(true);
      },
      onDragLeave: (event: React.DragEvent) => {
        if (!enabled || !isFileDragEvent(event)) return;
        event.stopPropagation();
        setDragOver(false);
      },
      onDrop: (event: React.DragEvent) => {
        if (!enabled || !isFileDragEvent(event)) return;
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);
        handleFiles(event.dataTransfer.files);
      },
    }),
    [handleFiles],
  );

  return {
    dragOver,
    uploading,
    error,
    handleFiles,
    bindFileDrop,
    clearError: () => setError(null),
  };
}
