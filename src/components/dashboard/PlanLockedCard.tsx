"use client";

import type { ReactNode } from "react";
import { FaLock } from "react-icons/fa6";
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
    <div className="relative overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-50">
      {children ? (
        <div className="pointer-events-none select-none blur-[6px] opacity-40" aria-hidden>
          {children}
        </div>
      ) : null}
      <div
        className={
          children
            ? "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/75 p-6 text-center backdrop-blur-[2px]"
            : "flex flex-col items-center gap-3 p-8 text-center"
        }
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
          <FaLock className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="max-w-xs text-xs leading-relaxed text-neutral-600">{body}</p>
        <GlowButton
          href={onboardingPath(locale, { plan: "pro" })}
          className="text-xs"
        >
          {ctaLabel}
        </GlowButton>
      </div>
    </div>
  );
}
