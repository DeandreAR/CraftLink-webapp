import { LandingHeroBrushField, LandingHeroBrushStroke } from "@/components/landing/LandingHeroBrushStroke";

type LandingPaintBackgroundProps = {
  variant?: "hero" | "cta";
};

export function LandingPaintBackground({ variant = "hero" }: LandingPaintBackgroundProps) {
  if (variant === "cta") {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#FDFBF7]" aria-hidden>
        <LandingHeroBrushStroke
          className="absolute -bottom-2 left-[-5%] max-w-none"
          style={{ width: "110%", height: "100px", transform: "rotate(-0.6deg)" }}
        />
        <LandingHeroBrushStroke
          className="absolute bottom-6 left-[-3%] max-w-none opacity-80"
          style={{ width: "105%", height: "72px", transform: "rotate(0.8deg)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#FDFBF7]"
      aria-hidden
    >
      <LandingHeroBrushField />
    </div>
  );
}
