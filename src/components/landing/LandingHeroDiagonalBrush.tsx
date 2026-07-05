import {
  HERO_DIAGONAL_BRUSH_PATH,
  HERO_DIAGONAL_BRUSH_VIEWBOX,
  HERO_PEACH,
  HERO_PEACH_DEEP,
} from "@/lib/landing/heroDiagonalBrush";

type LandingHeroDiagonalBrushProps = {
  variant?: "hero" | "cta";
};

const VARIANTS = {
  hero: {
    rotate: "-22deg",
    top: "48%",
    width: "220vmin",
    height: "160vmin",
  },
  cta: {
    rotate: "16deg",
    top: "52%",
    width: "210vmin",
    height: "150vmin",
  },
} as const;

/** Coup de pinceau corail en SVG — déborde la section pour rester invisible aux bords (ultra-wide / zoom). */
export function LandingHeroDiagonalBrush({
  variant = "hero",
}: LandingHeroDiagonalBrushProps) {
  const cfg = VARIANTS[variant];

  return (
    <div
      className="landing-hero-brush pointer-events-none absolute inset-0 z-[1] overflow-visible"
      aria-hidden
    >
      <div
        className="absolute left-1/2 max-w-none"
        style={{
          top: cfg.top,
          width: cfg.width,
          height: cfg.height,
          transform: `translate(-50%, -50%) rotate(${cfg.rotate})`,
        }}
      >
        <svg
          className="h-full w-full"
          viewBox={HERO_DIAGONAL_BRUSH_VIEWBOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={HERO_DIAGONAL_BRUSH_PATH}
            fill={HERO_PEACH_DEEP}
            opacity={0.22}
            transform="translate(8 10)"
          />
          <path d={HERO_DIAGONAL_BRUSH_PATH} fill={HERO_PEACH} />
          <ellipse cx="210" cy="168" rx="52" ry="38" fill="white" opacity={0.14} />
          <ellipse cx="980" cy="228" rx="64" ry="44" fill="white" opacity={0.1} />
        </svg>
      </div>
    </div>
  );
}
