import type { PourquoiPillarJson } from "@/i18n/types";
import type { ReactNode } from "react";

type PillarTint = "peach" | "mint" | "lavender";

const tintStyles: Record<
  PillarTint,
  {
    card: string;
    iconWrap: string;
    iconColor: string;
  }
> = {
  peach: {
    card: "border-[#EFA188]/25 bg-[#EFA188]/[0.12]",
    iconWrap:
      "bg-[#EFA188] text-white shadow-[0_12px_28px_rgba(239,161,136,0.35)]",
    iconColor: "text-white",
  },
  mint: {
    card: "border-[#B2F5EA]/35 bg-[#B2F5EA]/[0.12]",
    iconWrap:
      "bg-[#B2F5EA] text-neutral-900 shadow-[0_12px_28px_rgba(20,184,166,0.2)]",
    iconColor: "text-neutral-900",
  },
  lavender: {
    card: "border-[#D6BCFA]/30 bg-[#D6BCFA]/[0.12]",
    iconWrap:
      "bg-[#D6BCFA] text-neutral-900 shadow-[0_12px_28px_rgba(139,92,246,0.18)]",
    iconColor: "text-neutral-900",
  },
};

type PourquoiPillarCardProps = {
  pillar: PourquoiPillarJson;
  tint: PillarTint;
  icon: ReactNode;
};

export function PourquoiPillarCard({
  pillar,
  tint,
  icon,
}: PourquoiPillarCardProps) {
  const styles = tintStyles[tint];

  return (
    <div className={`rounded-3xl border p-6 md:p-7 ${styles.card}`}>
      <div className="flex items-start gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${styles.iconWrap}`}
        >
          <span className={styles.iconColor}>{icon}</span>
        </span>
        <h3 className="text-lg font-bold leading-snug text-black">
          {pillar.title}
        </h3>
      </div>

      <ul className="mt-5 space-y-2.5">
        {pillar.bullets.map((bullet) => (
          <li
            key={bullet.text}
            className="flex gap-2.5 text-sm leading-relaxed text-neutral-800 md:text-base"
          >
            <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>
              {bullet.emoji}
            </span>
            <span>{bullet.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
