"use client";

import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

export type BentoFeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent?: "indigo" | "cyan" | "rose" | "amber";
  className?: string;
};

export function BentoFeatureCard({
  eyebrow,
  title,
  description,
  icon,
  accent = "indigo",
  className = "",
}: BentoFeatureCardProps) {
  void accent;
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
        className="relative overflow-hidden border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.10)] md:p-7"
      >
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E5E7EB] bg-white text-black shadow-[0_10px_22px_rgba(0,0,0,0.06)]">
            <div className="h-5 w-5">{icon}</div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
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

