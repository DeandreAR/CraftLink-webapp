"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export type BentoTint = "peach" | "mint" | "lavender";

const TINT_STYLES: Record<
  BentoTint,
  { card: string; iconWrap: string; eyebrow: string; accent: string }
> = {
  peach: {
    card: "border-[#EFA188]/35 bg-[#EFA188]/22 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
    iconWrap: "bg-[#EFA188] text-white ring-2 ring-white/80",
    eyebrow: "text-[#212129]/70",
    accent: "bg-[#EFA188]",
  },
  mint: {
    card: "border-[#5EEAD4]/40 bg-[#B2F5EA]/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
    iconWrap: "bg-[#5EEAD4] text-[#212129] ring-2 ring-white/80",
    eyebrow: "text-[#212129]/70",
    accent: "bg-[#B2F5EA]",
  },
  lavender: {
    card: "border-[#C4B5FD]/40 bg-[#D6BCFA]/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
    iconWrap: "bg-[#C4B5FD] text-[#212129] ring-2 ring-white/80",
    eyebrow: "text-[#212129]/70",
    accent: "bg-[#D6BCFA]",
  },
};

export type BentoFeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  tint?: BentoTint;
  className?: string;
};

export function BentoFeatureCard({
  eyebrow,
  title,
  description,
  icon,
  tint = "peach",
  className = "",
}: BentoFeatureCardProps) {
  const styles = TINT_STYLES[tint];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      <div className={`relative overflow-hidden rounded-[1.35rem] border-2 p-6 md:p-7 ${styles.card}`}>
        <div
          className={`absolute left-0 top-0 h-1 w-full ${styles.accent} opacity-80`}
          aria-hidden
        />
        <div className="relative flex items-center gap-3">
          <div className={`grid h-11 w-11 place-items-center rounded-xl ${styles.iconWrap}`}>
            <div className="h-5 w-5 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
          </div>
          <p className={`text-xs font-bold uppercase tracking-[0.18em] ${styles.eyebrow}`}>
            {eyebrow}
          </p>
        </div>
        <h3 className="lk-display relative mt-5 text-xl md:text-2xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6478] md:text-base">{description}</p>
      </div>
    </motion.div>
  );
}
