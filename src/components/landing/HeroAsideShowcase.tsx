import Image from "next/image";
import type { CSSProperties } from "react";

type HeroAsideShowcaseProps = {
  alt: string;
  className?: string;
};

/**
 * Masque alpha composite : chaque bord utilise un fondu différent.
 * - Gauche / droite : linéaire (profondeurs asymétriques)
 * - Haut : bande linéaire très fine (préserve la flèche)
 * - Bas : voûte radiale
 */
const HERO_EDGE_MASK_LAYERS = [
  "linear-gradient(to right, transparent 0%, #000 5%)",
  "linear-gradient(to left, transparent 0%, #000 2%)",
  "linear-gradient(to bottom, transparent -5%, #000 2%)",
  "radial-gradient(ellipse 120% 50% at 50% 100%, transparent 1%, #000 38%, #000 100%)",
] as const;

const HERO_EDGE_MASK_STYLE: CSSProperties = {
  maskImage: HERO_EDGE_MASK_LAYERS.join(", "),
  WebkitMaskImage: HERO_EDGE_MASK_LAYERS.join(", "),
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in, source-in, source-in",
};

/** Illustration hero : profil social → page CraftLink, tous les bords fondus. */
export function HeroAsideShowcase({ alt, className = "" }: HeroAsideShowcaseProps) {
  return (
    <figure
      className={`landing-hero-aside-figure relative m-0 flex w-full items-center justify-center overflow-visible ${className}`.trim()}
    >
      <div className="landing-hero-aside-frame relative w-full max-w-[min(100%,56rem)] overflow-visible lg:max-w-[58rem]">
        <div className="relative" style={HERO_EDGE_MASK_STYLE}>
          <Image
            src="/images/hero_main_image2.png"
            alt={alt}
            width={2466}
            height={1696}
            className="landing-hero-aside-img mx-auto block h-auto w-full object-contain"
            sizes="(max-width: 1024px) 100vw, 64vw"
            priority
          />
        </div>

        {/* Voile blanc : renforce le fondu vers le fond du site (complète le masque). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-white via-white/35 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-white via-white/30 to-transparent" />
          <div
            className="absolute inset-x-0 top-0 h-[7%]"
            style={{
              background:
                "linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.35) 55%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[16%]"
            style={{
              background:
                "radial-gradient(ellipse 118% 95% at 50% 100%, #fff 0%, rgba(255,255,255,0.5) 45%, transparent 80%)",
            }}
          />
        </div>
      </div>
    </figure>
  );
}
