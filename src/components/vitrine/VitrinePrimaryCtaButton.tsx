"use client";

import { LuQuote } from "react-icons/lu";

type VitrinePrimaryCtaButtonProps = {
  label: string;
  onClick: () => void;
};

const CTA_GRADIENT =
  "linear-gradient(90deg, #fb923c 0%, #f97316 45%, #ea580c 70%, #dc2626 100%)";

export function VitrinePrimaryCtaButton({
  label,
  onClick,
}: VitrinePrimaryCtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative mt-7 flex min-h-[3.5rem] w-full items-center justify-center rounded-full px-12 text-[15px] font-extrabold tracking-tight shadow-[0_10px_28px_rgba(234,88,12,0.38)] transition active:scale-[0.98] sm:min-h-[3.65rem] sm:text-base"
      style={{
        background: CTA_GRADIENT,
        color: "#ffffff",
      }}
    >
      <span
        className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white"
        style={{ color: "#ea580c" }}
      >
        <LuQuote className="h-[1.15rem] w-[1.15rem]" aria-hidden />
      </span>
      <span className="text-center">{label}</span>
    </button>
  );
}
