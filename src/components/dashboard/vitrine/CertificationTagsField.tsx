"use client";

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import {
  MAX_CERTIFICATION_LABEL_LENGTH,
  MAX_PROFILE_CERTIFICATIONS,
  normalizeCertifications,
} from "@/lib/profile/normalizeCertifications";

export type CertificationTagsFieldCopy = {
  label: string;
  hint: string;
  placeholder: string;
  add: string;
  removeAria: string;
  maxReached: string;
};

type CertificationTagsFieldProps = {
  value: string[];
  onChange: (next: string[]) => void;
  copy: CertificationTagsFieldCopy;
};

export function CertificationTagsField({ value, onChange, copy }: CertificationTagsFieldProps) {
  const [draft, setDraft] = useState("");
  const tags = normalizeCertifications(value);
  const atMax = tags.length >= MAX_PROFILE_CERTIFICATIONS;

  const addTag = () => {
    const next = normalizeCertifications([...tags, draft]);
    if (next.length === tags.length) {
      setDraft("");
      return;
    }
    onChange(next);
    setDraft("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 rounded-[20px] border border-neutral-200 bg-white p-4">
      <div>
        <label htmlFor="certification-tag-input" className={authLabelClassName}>
          {copy.label}
        </label>
        <p className="mt-0.5 text-xs text-neutral-600">{copy.hint}</p>
      </div>

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label={copy.label}>
          {tags.map((tag, index) => (
            <li key={`${tag}-${index}`}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EFA188]/45 bg-[#EFA188]/12 px-3 py-1.5 text-xs font-semibold text-[#212129]">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="rounded-full p-0.5 text-neutral-500 transition hover:bg-white/80 hover:text-neutral-900"
                  aria-label={`${copy.removeAria} ${tag}`}
                >
                  <FaXmark className="h-3 w-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <input
          id="certification-tag-input"
          type="text"
          value={draft}
          maxLength={MAX_CERTIFICATION_LABEL_LENGTH}
          disabled={atMax}
          placeholder={copy.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className={`${authFieldClassName} sm:flex-1`}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={atMax || draft.trim().length === 0}
          className="shrink-0 rounded-full border-2 border-[#212129] bg-[#212129] px-4 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copy.add}
        </button>
      </div>

      {atMax ? <p className="text-xs text-neutral-500">{copy.maxReached}</p> : null}
    </div>
  );
}
