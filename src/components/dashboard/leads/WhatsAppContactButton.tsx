"use client";

import { FaWhatsapp } from "react-icons/fa6";

type WhatsAppContactButtonProps = {
  label: string;
  onClick: () => void;
  compact?: boolean;
  iconOnly?: boolean;
};

export function WhatsAppContactButton({
  label,
  onClick,
  compact = false,
  iconOnly = false,
}: WhatsAppContactButtonProps) {
  if (iconOnly || compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={label}
        className="inline-flex items-center justify-center rounded-lg bg-[#25D366] p-2 text-white transition hover:bg-[#20BD5A]"
      >
        <FaWhatsapp className="h-4 w-4" aria-hidden />
        <span className="sr-only">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#20BD5A]"
    >
      <FaWhatsapp className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
