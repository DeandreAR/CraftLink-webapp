type LandingPaintBackgroundProps = {
  variant?: "hero" | "cta";
};

/** Coup de pinceau corail — signature visuelle forte sur crème. */
export function LandingPaintBackground({ variant = "hero" }: LandingPaintBackgroundProps) {
  if (variant === "cta") {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#FDFBF7]" aria-hidden>
        <svg
          viewBox="0 0 1200 200"
          className="absolute -bottom-6 left-[-5%] w-[110%] max-w-none"
          preserveAspectRatio="none"
        >
          <path
            fill="#EFA188"
            fillOpacity={0.75}
            d="M-20,80 C120,30 280,120 480,65 C680,15 880,110 1080,55 C1180,35 1220,70 1240,90 L1240,200 L-20,200 Z"
          />
          <path
            fill="#EFA188"
            fillOpacity={0.35}
            d="M-20,105 C140,75 300,135 520,90 C740,45 960,125 1240,95 L1240,200 L-20,200 Z"
          />
        </svg>
        <div className="absolute bottom-8 right-[12%] h-32 w-32 rounded-full bg-[#D6BCFA]/30 blur-2xl" />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#FDFBF7]"
      aria-hidden
    >
      <svg
        viewBox="0 0 1400 240"
        className="absolute left-[-6%] top-[16%] w-[112%] max-w-none"
        preserveAspectRatio="none"
      >
        <path
          fill="#EFA188"
          fillOpacity={0.82}
          d="M-30,88 C50,38 160,145 290,78 C420,22 560,168 710,68 C860,12 1010,138 1160,62 C1280,28 1360,75 1450,52 L1450,240 L-30,240 Z"
        />
        <path
          fill="#E08A6F"
          fillOpacity={0.4}
          d="M-30,115 C100,82 220,155 390,98 C560,48 720,148 910,88 C1100,38 1280,128 1450,92 L1450,240 L-30,240 Z"
        />
        <path
          fill="#EFA188"
          fillOpacity={0.55}
          d="M-30,88 L25,68 L52,95 L18,112 Z"
        />
        <path
          fill="#EFA188"
          fillOpacity={0.45}
          d="M1410,52 L1450,38 L1450,68 L1425,78 Z"
        />
      </svg>

      <div className="absolute -left-16 top-[6%] h-64 w-64 rounded-full bg-[#B2F5EA]/35 blur-3xl" />
      <div className="absolute right-[-8%] top-[28%] h-56 w-56 rounded-full bg-[#D6BCFA]/28 blur-3xl" />
    </div>
  );
}
