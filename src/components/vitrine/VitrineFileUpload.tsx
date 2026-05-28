"use client";

import { useCallback, useRef, useState } from "react";
import type { VitrineDictionary } from "@/i18n/types";

const MAX_FILES = 3;
const MAX_BYTES = 10 * 1024 * 1024;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

type VitrineFileUploadProps = {
  copy: VitrineDictionary;
  label: string;
  onChange: (files: File[]) => void;
};

function isAcceptedFile(file: File): boolean {
  if (file.type.startsWith("video/")) return false;
  return ACCEPTED_TYPES.includes(file.type) || file.type.startsWith("image/");
}

export function VitrineFileUpload({ copy, label, onChange }: VitrineFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const collab = copy.collaboration.files;

  const validateAndSet = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      setError(null);

      for (const file of list) {
        if (file.type.startsWith("video/")) {
          setError(collab.invalidVideo);
          return;
        }
        if (!isAcceptedFile(file)) {
          setError(collab.invalidType);
          return;
        }
        if (file.size > MAX_BYTES) {
          setError(collab.tooLarge);
          return;
        }
      }

      const merged = [...files, ...list].slice(0, MAX_FILES);
      if (files.length + list.length > MAX_FILES) {
        setError(collab.tooMany);
      }

      setFiles(merged);
      onChange(merged);
    },
    [collab, files, onChange],
  );

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange(next);
    setError(null);
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-[var(--v-text)]">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) validateAndSet(e.dataTransfer.files);
        }}
        className={`mt-2 rounded-2xl border-2 border-dashed px-4 py-5 text-center transition ${
          isDragging
            ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_8%,white)]"
            : "border-[var(--v-muted)]/25 bg-[var(--v-surface)]"
        }`}
      >
        <p className="text-xs text-[var(--v-muted)]">{collab.dropHint}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs font-bold text-[var(--primary-color)] underline"
        >
          {collab.browse}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) validateAndSet(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl border border-[var(--v-muted)]/15 bg-[var(--bg-color)] px-3 py-2 text-xs"
            >
              <span className="truncate font-medium text-[var(--v-text)]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 shrink-0 text-[var(--v-muted)] hover:text-red-600"
                aria-label="Retirer"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
