"use client";

import type {
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
} from "@/domain/vitrine";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import { LuCalendarClock, LuInfo, LuShare2 } from "react-icons/lu";

type VitrineActionButtonsProps = {
  planTier: PublicPlanTier;
  profileSettings: VitrineProfileSettings;
  onAction: (intent: VitrineOpenIntent) => void;
};

const BORDER = "#9a8468";
const TEXT = "#4a4035";

const secondaryClass =
  "relative flex min-h-[3.45rem] w-full items-center justify-center rounded-full border-2 px-12 text-center text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_3px_10px_rgba(154,132,104,0.22)] transition active:scale-[0.98]";

const iconClass = "absolute left-5 h-6 w-6 shrink-0";

export function VitrineActionButtons({
  planTier,
  profileSettings,
  onAction,
}: VitrineActionButtonsProps) {
  const { visibility, cta } = profileSettings;
  const isPro = isProPublicPlan(planTier);

  const secondaryStyle = {
    background:
      "linear-gradient(180deg, #faf6f0 0%, #f0e6d6 48%, #ebe0cf 100%)",
    borderColor: BORDER,
    color: TEXT,
  };

  return (
    <div className="mt-5 space-y-3.5">
      <button
        type="button"
        onClick={() => onAction("info")}
        className={secondaryClass}
        style={secondaryStyle}
      >
        <LuInfo className={iconClass} strokeWidth={2.75} style={{ color: BORDER }} aria-hidden />
        <span>{cta.secondaryInfo}</span>
      </button>

      <button
        type="button"
        onClick={() => onAction("urgent")}
        className={secondaryClass}
        style={secondaryStyle}
      >
        <LuCalendarClock className={iconClass} strokeWidth={2.75} style={{ color: BORDER }} aria-hidden />
        <span>{cta.secondaryUrgent}</span>
      </button>

      {isPro && visibility.showCollaborationButton ? (
        <button
          type="button"
          onClick={() => onAction("collaboration")}
          className={secondaryClass}
          style={secondaryStyle}
        >
          <LuShare2 className={iconClass} strokeWidth={2.75} style={{ color: BORDER }} aria-hidden />
          <span>{cta.collaboration}</span>
        </button>
      ) : null}
    </div>
  );
}
