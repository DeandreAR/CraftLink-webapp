"use client";

import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";

type PublicPageUrlWithCopyProps = {
  displayUrl: string;
  copyText: string;
  label?: string;
  copyAriaLabel: string;
  copiedLabel: string;
  className?: string;
  urlClassName?: string;
};

export function PublicPageUrlWithCopy({
  displayUrl,
  copyText,
  label,
  copyAriaLabel,
  copiedLabel,
  className = "",
  urlClassName = "",
}: PublicPageUrlWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={className}>
      {label ? (
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">{label}</p>
      ) : null}
      <div className={`flex items-center gap-2 ${label ? "mt-0.5" : ""}`}>
        <p className={`min-w-0 flex-1 break-all font-semibold text-neutral-900 ${urlClassName}`}>
          {displayUrl}
        </p>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={copied ? copiedLabel : copyAriaLabel}
          title={copied ? copiedLabel : copyAriaLabel}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
        >
          {copied ? (
            <FaCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
          ) : (
            <FaCopy className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
