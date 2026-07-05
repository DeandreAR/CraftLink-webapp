import {
  HERO_DIAGONAL_BRUSH_PATH,
  HERO_DIAGONAL_BRUSH_VIEWBOX,
  HERO_PEACH,
  HERO_PEACH_DEEP,
} from "@/lib/landing/heroDiagonalBrush";

/** Coup de pinceau corail en SVG — diagonale, plat, sans image raster. */
export function LandingHeroDiagonalBrush() {
  return (
    <div
      className="landing-hero-brush pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute left-1/2 top-[46%] h-[min(88vw,920px)] w-[min(145vw,1500px)] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-[-22deg]"
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
  );
}
