"use client";

import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

export type BentoTint = "peach" | "mint" | "lavender";

const TINT_STYLES: Record<
  BentoTint,
  { card: string; iconWrap: string; eyebrow: string }
> = {
  peach: {
    card:
      "border-[#EFA188]/25 bg-[#EFA188]/[0.13] shadow-[0_18px_40px_rgba(239,161,136,0.12)]",
    iconWrap:
      "border-[#EFA188]/40 bg-[#EFA188] text-white shadow-[0_10px_22px_rgba(239,161,136,0.35)]",
    eyebrow: "text-neutral-800",
  },
  mint: {
    card:
      "border-[#B2F5EA]/35 bg-[#B2F5EA]/[0.12] shadow-[0_18px_40px_rgba(20,184,166,0.08)]",
    iconWrap:
      "border-[#5EEAD4]/50 bg-[#B2F5EA] text-neutral-900 shadow-[0_10px_22px_rgba(20,184,166,0.2)]",
    eyebrow: "text-neutral-800",
  },
  lavender: {
    card:
      "border-[#D6BCFA]/30 bg-[#D6BCFA]/[0.12] shadow-[0_18px_40px_rgba(167,139,250,0.1)]",
    iconWrap:
      "border-[#C4B5FD]/50 bg-[#D6BCFA] text-neutral-900 shadow-[0_10px_22px_rgba(139,92,246,0.15)]",
    eyebrow: "text-neutral-800",
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      <GlassCard
        rounded="2xl"
        className={`relative overflow-hidden p-6 md:p-7 ${styles.card}`}
      >
      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className={`grid h-10 w-10 place-items-center rounded-2xl border ${styles.iconWrap}`}
          >
            <div className="h-5 w-5 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
          </div>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight text-black md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 md:text-base">
          {description}
        </p>
      </div>
      </GlassCard>
    </motion.div>
  );
}

