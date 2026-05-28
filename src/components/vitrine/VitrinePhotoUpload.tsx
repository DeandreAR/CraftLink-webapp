"use client";

import { useCallback, useRef, useState } from "react";
import type { VitrineDictionary } from "@/i18n/types";

const MAX_PHOTOS = 3;
const MAX_BYTES = 10 * 1024 * 1024;

type VitrinePhotoUploadProps = {
  copy: VitrineDictionary;
  onChange: (files: File[]) => void;
};

export function VitrinePhotoUpload({ copy, onChange }: VitrinePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSet = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      setError(null);

      for (const file of list) {
        if (!file.type.startsWith("image/")) {
          setError(copy.photos.invalidType);
          return;
        }
        if (file.size > MAX_BYTES) {
          setError(copy.photos.tooLarge);
          return;
        }
      }

      const merged = [...files, ...list].slice(0, MAX_PHOTOS);
      if (files.length + list.length > MAX_PHOTOS) {
        setError(copy.photos.tooMany);
      }

      setFiles(merged);
      onChange(merged);
    },
    [copy.photos, files, onChange],
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      validateAndSet(event.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange(next);
    setError(null);
  };

  return (
    <div className="mt-5">
      <p className="text-sm font-bold text-[var(--v-text)]">{copy.photos.title}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`mt-2.5 rounded-2xl border-2 border-dashed px-4 py-5 text-center transition ${
          isDragging
            ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_8%,white)]"
            : "border-[var(--v-muted)]/25 bg-[var(--v-surface)]"
        }`}
      >
        <p className="text-xs text-[var(--v-muted)]">{copy.photos.dropHint}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs font-bold text-[var(--primary-color)] underline"
        >
          {copy.photos.browse}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) validateAndSet(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 ? (
        <p className="mt-2 text-xs text-[var(--v-muted)]">
          {files.length} {copy.photos.count}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white"
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
