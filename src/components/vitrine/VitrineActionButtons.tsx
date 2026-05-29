"use client";

import type { CSSProperties } from "react";
import type {
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineTheme,
} from "@/domain/vitrine";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import { LuCalendarClock, LuInfo, LuShare2 } from "react-icons/lu";

type VitrineActionButtonsProps = {
  planTier: PublicPlanTier;
  profileSettings: VitrineProfileSettings;
  theme: VitrineTheme;
  onAction: (intent: VitrineOpenIntent) => void;
};

const iconClass = "absolute left-5 h-6 w-6 shrink-0";

const secondaryClass =
  "relative flex min-h-[3.45rem] w-full items-center justify-center rounded-full border-2 px-12 text-center text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_3px_10px_rgba(0,0,0,0.12)] transition active:scale-[0.98]";

function secondaryButtonStyle(accent: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 8%, white) 0%, color-mix(in srgb, ${accent} 18%, white) 100%)`,
    borderColor: accent,
    color: `color-mix(in srgb, ${accent} 72%, black)`,
  };
}

export function VitrineActionButtons({
  planTier,
  profileSettings,
  theme,
  onAction,
}: VitrineActionButtonsProps) {
  const { visibility, cta } = profileSettings;
  const isPro = isProPublicPlan(planTier);
  const accent = theme.accent;
  const secondaryStyle = secondaryButtonStyle(accent);

  return (
    <div className="mt-5 space-y-3.5">
      <button
        type="button"
        onClick={() => onAction("info")}
        className={secondaryClass}
        style={secondaryStyle}
      >
        <LuInfo className={iconClass} strokeWidth={2.75} style={{ color: accent }} aria-hidden />
        <span>{cta.secondaryInfo}</span>
      </button>

      <button
        type="button"
        onClick={() => onAction("urgent")}
        className={secondaryClass}
        style={secondaryStyle}
      >
        <LuCalendarClock className={iconClass} strokeWidth={2.75} style={{ color: accent }} aria-hidden />
        <span>{cta.secondaryUrgent}</span>
      </button>

      {isPro && visibility.showCollaborationButton ? (
        <button
          type="button"
          onClick={() => onAction("collaboration")}
          className={secondaryClass}
          style={secondaryStyle}
        >
          <LuShare2 className={iconClass} strokeWidth={2.75} style={{ color: accent }} aria-hidden />
          <span>{cta.collaboration}</span>
        </button>
      ) : null}
    </div>
  );
}
