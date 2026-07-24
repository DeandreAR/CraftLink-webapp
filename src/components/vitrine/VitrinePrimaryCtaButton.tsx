"use client";

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
  "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ea580c 72%, #dc2626 100%)";

/**
 * CTA devis — le plus visible. Couleur = picker « bouton devis » (theme.primary).
 */
export function VitrinePrimaryCtaButton({
  label,
  freeHint,
  onClick,
  useBrandColor = false,
  onDarkCover = false,
}: VitrinePrimaryCtaButtonProps) {
  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex min-h-[3.75rem] w-full items-center justify-center overflow-hidden rounded-full px-14 text-[15px] font-bold tracking-tight text-white transition duration-200 hover:brightness-[1.04] active:scale-[0.985] sm:min-h-[4rem] sm:text-base"
        style={
          useBrandColor
            ? {
                background: "var(--primary-color)",
                color: "var(--v-primary-fg, #ffffff)",
                boxShadow:
                  "0 12px 32px color-mix(in srgb, var(--primary-color) 42%, transparent), 0 4px 12px rgba(0,0,0,0.12)",
              }
            : {
                background: CTA_GRADIENT,
                boxShadow:
                  "0 12px 32px rgba(234,88,12,0.35), 0 4px 12px rgba(0,0,0,0.12)",
              }
        }
      >
        <span
          className="absolute left-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm sm:left-4"
          style={{ color: useBrandColor ? "var(--primary-color)" : "#ea580c" }}
        >
          <LuQuote className="h-5 w-5" aria-hidden />
        </span>
        <span className="relative text-center">{label}</span>
      </button>
      <p
        className={`mt-2.5 text-center text-[11px] font-medium tracking-wide ${
          onDarkCover ? "text-white/70" : "text-neutral-500"
        }`}
      >
        {freeHint}
      </p>
    </div>
  );
}
