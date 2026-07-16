"use client";

import type { ReactNode } from "react";
import { FaLock } from "react-icons/fa6";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { GlowButton } from "@/components/ui/GlowButton";
import type { Locale } from "@/i18n/config";
import { onboardingPath } from "@/lib/auth/paths";

type PlanLockedCardProps = {
  title: string;
  body: string;
  ctaLabel: string;
  locale: Locale;
  children?: ReactNode;
};

export function PlanLockedCard({
  title,
  body,
  ctaLabel,
  locale,
  children,
}: PlanLockedCardProps) {
  return (
    <DashboardCard variant="flat" className="relative overflow-hidden">
      {children ? (
        <div className="pointer-events-none select-none opacity-35 blur-[5px]" aria-hidden>
          <div className="p-4">{children}</div>
        </div>
      ) : null}
      <div
        className={
          children
            ? "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 p-6 text-center backdrop-blur-sm"
            : "flex flex-col items-center gap-3 p-8 text-center"
        }
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#212129] text-white shadow-[0_8px_24px_rgba(33,33,41,0.2)]">
          <FaLock className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-sm font-bold text-[#212129]">{title}</p>
        <p className="max-w-xs text-xs leading-relaxed text-[#5b6478]">{body}</p>
        <GlowButton href={onboardingPath(locale, { plan: "pro" })} className="text-xs">
          {ctaLabel}
        </GlowButton>
      </div>
    </DashboardCard>
  );
}
