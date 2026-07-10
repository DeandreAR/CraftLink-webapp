import type { PourquoiPillarJson } from "@/i18n/types";
import type { ReactNode } from "react";

type PillarTint = "peach" | "mint" | "lavender";

const tintStyles: Record<
  PillarTint,
  { card: string; iconWrap: string; iconColor: string; stripe: string }
> = {
  peach: {
    card: "border-2 border-[#EFA188]/40 bg-[#EFA188]/18",
    iconWrap: "bg-[#EFA188] ring-2 ring-white/70",
    iconColor: "text-white",
    stripe: "bg-[#EFA188]",
  },
  mint: {
    card: "border-2 border-[#5EEAD4]/45 bg-[#B2F5EA]/22",
    iconWrap: "bg-[#5EEAD4] ring-2 ring-white/70",
    iconColor: "text-[#212129]",
    stripe: "bg-[#B2F5EA]",
  },
  lavender: {
    card: "border-2 border-[#C4B5FD]/45 bg-[#D6BCFA]/20",
    iconWrap: "bg-[#C4B5FD] ring-2 ring-white/70",
    iconColor: "text-[#212129]",
    stripe: "bg-[#D6BCFA]",
  },
};

type PourquoiPillarCardProps = {
  pillar: PourquoiPillarJson;
  tint: PillarTint;
  icon: ReactNode;
};

export function PourquoiPillarCard({ pillar, tint, icon }: PourquoiPillarCardProps) {
  const styles = tintStyles[tint];

  return (
    <div className={`relative overflow-hidden rounded-[1.35rem] p-6 md:p-7 ${styles.card}`}>
      <div className={`absolute bottom-0 left-0 top-0 w-1.5 ${styles.stripe}`} aria-hidden />
      <div className="flex items-start gap-3 pl-2">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${styles.iconWrap}`}>
          <span className={styles.iconColor}>{icon}</span>
        </span>
        <h3 className="lk-display text-lg leading-snug md:text-xl">{pillar.title}</h3>
      </div>

      <ul className="mt-5 space-y-2.5 pl-2">
        {pillar.bullets.map((bullet) => (
          <li
            key={bullet.text}
            className="flex gap-2.5 text-sm leading-relaxed text-[#5b6478] md:text-base"
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
