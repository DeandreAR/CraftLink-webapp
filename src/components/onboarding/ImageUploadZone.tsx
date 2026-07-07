"use client";

import { useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { authLabelClassName } from "@/components/auth/authFormStyles";
import {
  readFileAsDataUrl,
  validateOnboardingImage,
} from "@/lib/onboarding/imageValidation";

type ImageUploadZoneProps = {
  label: string;
  hint: string;
  previewUrl: string | null;
  errorTypeLabel: string;
  errorSizeLabel: string;
  onChange: (previewUrl: string | null) => void;
  disabled?: boolean;
  aspectClass?: string;
};

export function ImageUploadZone({
  label,
  hint,
  previewUrl,
  errorTypeLabel,
  errorSizeLabel,
  onChange,
  disabled = false,
  aspectClass = "aspect-[3/1]",
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const validation = validateOnboardingImage(file);
    if (!validation.ok) {
      setError(validation.error === "type" ? errorTypeLabel : errorSizeLabel);
      return;
    }
    setError(null);
    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
  };

  return (
    <div>
      <p className={authLabelClassName}>{label}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={`mt-1.5 flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 ${aspectClass}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <LuUpload className="h-6 w-6 text-neutral-400" aria-hidden />
            <span className="text-center text-xs text-neutral-500">{hint}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
