import {
  HERO_BRUSH_BRISTLE_PATH,
  HERO_BRUSH_FILL_PATH,
  HERO_BRUSH_FILTER_ID,
  HERO_BRUSH_GRADIENT_ID,
  HERO_BRUSH_STROKE_PATH,
  HERO_DIAGONAL_BRUSH_VIEWBOX,
  HERO_PAINT_PEACH,
  HERO_PEACH_LIGHT,
  HERO_PEACH_PAINT_DEEP,
} from "@/lib/landing/heroDiagonalBrushPaint";

type LandingHeroPaintBrushProps = {
  variant?: "hero" | "cta";
};

const VARIANTS = {
  hero: {
    rotate: "-18deg",
    top: "46%",
    width: "230vmin",
    height: "170vmin",
  },
  cta: {
    rotate: "14deg",
    top: "54%",
    width: "220vmin",
    height: "160vmin",
  },
} as const;

/**
 * Variante « vrai coup de pinceau » — conservée pour tests / bascule future.
 * Non montée par défaut : la landing utilise {@link LandingHeroDiagonalBrush}.
 */
export function LandingHeroPaintBrush({ variant = "hero" }: LandingHeroPaintBrushProps) {
  const cfg = VARIANTS[variant];
  const filterId = `${HERO_BRUSH_FILTER_ID}-${variant}`;
  const gradientId = `${HERO_BRUSH_GRADIENT_ID}-${variant}`;

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
          <defs>
            <filter
              id={filterId}
              x="-8%"
              y="-12%"
              width="116%"
              height="124%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035 0.12"
                numOctaves="4"
                seed="8"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <linearGradient id={gradientId} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={HERO_PAINT_PEACH} stopOpacity="0" />
              <stop offset="8%" stopColor={HERO_PAINT_PEACH} stopOpacity="0.55" />
              <stop offset="45%" stopColor={HERO_PAINT_PEACH} stopOpacity="0.92" />
              <stop offset="78%" stopColor={HERO_PEACH_PAINT_DEEP} stopOpacity="0.88" />
              <stop offset="92%" stopColor={HERO_PAINT_PEACH} stopOpacity="0.5" />
              <stop offset="100%" stopColor={HERO_PAINT_PEACH} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={HERO_BRUSH_STROKE_PATH}
            stroke={HERO_PEACH_PAINT_DEEP}
            strokeWidth={118}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.16}
            transform="translate(6 14)"
          />

          <g filter={`url(#${filterId})`}>
            <path
              d={HERO_BRUSH_FILL_PATH}
              fill={`url(#${gradientId})`}
              opacity={0.78}
            />
          </g>

          <path
            d={HERO_BRUSH_STROKE_PATH}
            stroke={HERO_PEACH_PAINT_DEEP}
            strokeWidth={96}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.28}
          />
          <path
            d={HERO_BRUSH_STROKE_PATH}
            stroke={HERO_PAINT_PEACH}
            strokeWidth={72}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.62}
          />
          <path
            d={HERO_BRUSH_BRISTLE_PATH}
            stroke={HERO_PEACH_LIGHT}
            strokeWidth={28}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.35}
            transform="translate(0 -18)"
          />
          <path
            d={HERO_BRUSH_BRISTLE_PATH}
            stroke="white"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.18}
            transform="translate(4 -28)"
          />
        </svg>
      </div>
    </div>
  );
}
