"use client";

import type { CSSProperties } from "react";
import { LuQuote } from "react-icons/lu";

type VitrinePrimaryCtaButtonProps = {
  label: string;
  freeHint: string;
  onClick: () => void;
  /**
   * true = couleur marque (`--primary-color`).
   * false = dégradé orange CraftLink par défaut.
   */
  useBrandColor?: boolean;
  onDarkCover?: boolean;
};

const CTA_GRADIENT =
  "linear-gradient(135deg, #fb923c 0%, #f97316 38%, #ea580c 68%, #dc2626 100%)";

/**
 * CTA devis — grand, dégradé marqué sur la couleur marque.
 */
export function VitrinePrimaryCtaButton({
  label,
  freeHint,
  onClick,
  useBrandColor = false,
  onDarkCover = false,
}: VitrinePrimaryCtaButtonProps) {
  const brandStyle: CSSProperties = {
    background: [
      "linear-gradient(135deg,",
      "color-mix(in srgb, var(--primary-color) 55%, white) 0%,",
      "var(--primary-color) 42%,",
      "color-mix(in srgb, var(--primary-color) 72%, black) 78%,",
      "color-mix(in srgb, var(--primary-color) 55%, black) 100%)",
    ].join(" "),
    color: "var(--v-primary-fg, #ffffff)",
    boxShadow: [
      "0 16px 36px color-mix(in srgb, var(--primary-color) 40%, transparent)",
      "0 6px 14px rgba(0,0,0,0.14)",
      "inset 0 1px 0 rgba(255,255,255,0.28)",
    ].join(", "),
  };

  const fallbackStyle: CSSProperties = {
    background: CTA_GRADIENT,
    boxShadow:
      "0 16px 36px rgba(234,88,12,0.38), 0 6px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",
  };

  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex min-h-[4.55rem] w-full items-center justify-center overflow-hidden rounded-full px-14 text-[17px] font-bold tracking-[-0.02em] text-white transition duration-200 hover:brightness-[1.04] active:scale-[0.985] sm:min-h-[4.75rem] sm:text-[18px]"
        style={useBrandColor ? brandStyle : fallbackStyle}
      >
        <span
          className="absolute left-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md sm:left-4 sm:h-[3.15rem] sm:w-[3.15rem]"
          style={{ color: useBrandColor ? "var(--primary-color)" : "#ea580c" }}
        >
          <LuQuote className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
        </span>
        <span className="relative text-center">{label}</span>
      </button>
      <p
        className={`mt-2.5 text-center text-[11px] font-medium tracking-wide ${
          onDarkCover ? "text-white/75" : "text-neutral-500"
        }`}
      >
        {freeHint}
      </p>
    </div>
  );
}
