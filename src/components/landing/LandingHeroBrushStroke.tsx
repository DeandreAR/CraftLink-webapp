import type { CSSProperties } from "react";
import { BRUSH_MASK_STYLE } from "@/lib/landing/brushStrokeMask";

const PEACH = "#EFA188";

type LandingHeroBrushStrokeProps = {
  className?: string;
  style?: CSSProperties;
  opacity?: number;
};

/**
 * Bandeau coup de pinceau via mask-image SVG (silhouette organique, fill plat).
 */
export function LandingHeroBrushStroke({
  className = "",
  style,
  opacity = 1,
}: LandingHeroBrushStrokeProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none bg-[#EFA188] ${className}`.trim()}
      style={{
        ...BRUSH_MASK_STYLE,
        backgroundColor: PEACH,
        opacity,
        ...style,
      }}
    />
  );
}

type BrushPlacement = {
  top: string;
  left: string;
  width: string;
  height: string;
  rotate: string;
  opacity: number;
};

const HERO_BRUSH_PLACEMENTS: BrushPlacement[] = [
  { top: "4%", left: "-6%", width: "112%", height: "clamp(72px, 9vw, 110px)", rotate: "-1.2deg", opacity: 0.92 },
  { top: "16%", left: "-4%", width: "108%", height: "clamp(80px, 10vw, 120px)", rotate: "0.6deg", opacity: 1 },
  { top: "28%", left: "-8%", width: "116%", height: "clamp(68px, 8.5vw, 100px)", rotate: "-0.5deg", opacity: 0.88 },
  { top: "40%", left: "-5%", width: "110%", height: "clamp(76px, 9.5vw, 112px)", rotate: "1deg", opacity: 0.95 },
  { top: "52%", left: "-7%", width: "114%", height: "clamp(64px, 8vw, 96px)", rotate: "-0.8deg", opacity: 0.82 },
  { top: "64%", left: "-3%", width: "106%", height: "clamp(70px, 8.8vw, 104px)", rotate: "0.4deg", opacity: 0.9 },
  { top: "76%", left: "-6%", width: "112%", height: "clamp(60px, 7.5vw, 92px)", rotate: "-1deg", opacity: 0.78 },
  { top: "88%", left: "-4%", width: "108%", height: "clamp(56px, 7vw, 84px)", rotate: "0.7deg", opacity: 0.72 },
];

/** Champ de coups de pinceau — couvre toute la section hero. */
export function LandingHeroBrushField({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      {HERO_BRUSH_PLACEMENTS.map((stroke, i) => (
        <LandingHeroBrushStroke
          key={i}
          className="absolute max-w-none"
          opacity={stroke.opacity}
          style={{
            top: stroke.top,
            left: stroke.left,
            width: stroke.width,
            height: stroke.height,
            transform: `rotate(${stroke.rotate})`,
            transformOrigin: "center center",
          }}
        />
      ))}
    </div>
  );
}
