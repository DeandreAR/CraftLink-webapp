import Image from "next/image";
import type { HeroFlowDictionary } from "@/i18n/types";

type HeroFlowSchemaProps = {
  flow: HeroFlowDictionary;
  className?: string;
};

/** Illustration fournie (parcours 4 étapes) — texte alternatif i18n. */
export function HeroFlowSchema({ flow, className = "" }: HeroFlowSchemaProps) {
  return (
    <figure
      className={`m-0 ${className}`.trim()}
      aria-label={flow.figureAlt}
    >
      <Image
        src="/images/new_schema1.png"
        alt={flow.figureAlt}
        width={1699}
        height={926}
        className="landing-hero-schema-img h-auto w-full rounded-2xl object-contain"
        style={{ height: "auto" }}
        sizes="270px"
        priority
      />
    </figure>
  );
}
