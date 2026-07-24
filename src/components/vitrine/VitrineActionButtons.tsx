"use client";

import type { CSSProperties } from "react";
import type {
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineTheme,
} from "@/domain/vitrine";
import type { VitrineDictionary } from "@/i18n/types";
import { submitUrgencyClick } from "@/lib/leads/submitUrgencyClick";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import { buildUrgencyWhatsAppUrl } from "@/lib/vitrine/buildUrgencyWhatsApp";
import { LuCalendarClock, LuInfo, LuShare2 } from "react-icons/lu";

type VitrineActionButtonsProps = {
  pageSlug: string;
  artisanPhone?: string;
  serviceZone?: string;
  copy: VitrineDictionary;
  planTier: PublicPlanTier;
  profileSettings: VitrineProfileSettings;
  theme: VitrineTheme;
  onAction: (intent: VitrineOpenIntent) => void;
};

const secondaryClass =
  "relative flex min-h-[3.25rem] w-full items-center justify-center rounded-full border-2 px-12 text-center text-sm font-semibold tracking-tight shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition duration-200 hover:brightness-[0.99] active:scale-[0.985]";

function secondaryButtonStyle(accent: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 10%, white) 0%, color-mix(in srgb, ${accent} 22%, white) 100%)`,
    borderColor: accent,
    color: `color-mix(in srgb, ${accent} 78%, black)`,
  };
}

const iconClass = "absolute left-5 h-[1.15rem] w-[1.15rem] shrink-0";

export function VitrineActionButtons({
  pageSlug,
  artisanPhone = "",
  serviceZone = "",
  copy,
  planTier,
  profileSettings,
  theme,
  onAction,
}: VitrineActionButtonsProps) {
  const { visibility, cta } = profileSettings;
  const isPro = isProPublicPlan(planTier);
  const accent = theme.accent;
  const secondaryStyle = secondaryButtonStyle(accent);

  const handleUrgentClick = () => {
    const whatsappUrl = buildUrgencyWhatsAppUrl(
      artisanPhone,
      copy.presentation.urgencyWhatsAppMessage,
    );

    if (!whatsappUrl) {
      onAction("urgent");
      return;
    }

    void submitUrgencyClick({
      pageSlug,
      zone: serviceZone,
      leadDescription: copy.presentation.urgencyClickLeadDescription,
    }).catch(() => {
      /* La redirection WhatsApp prime ; l'échec CRM ne bloque pas le client. */
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-4 space-y-2.5">
      <button
        type="button"
        onClick={() => onAction("info")}
        className={secondaryClass}
        style={secondaryStyle}
      >
        <LuInfo className={iconClass} strokeWidth={2.5} style={{ color: accent }} aria-hidden />
        <span>{cta.secondaryInfo}</span>
      </button>

      {visibility.showUrgentButton ? (
        <button
          type="button"
          onClick={handleUrgentClick}
          className={secondaryClass}
          style={secondaryStyle}
          aria-label={cta.secondaryUrgent}
        >
          <LuCalendarClock className={iconClass} strokeWidth={2.5} style={{ color: accent }} aria-hidden />
          <span>{cta.secondaryUrgent}</span>
        </button>
      ) : null}

      {isPro && visibility.showCollaborationButton ? (
        <button
          type="button"
          onClick={() => onAction("collaboration")}
          className={secondaryClass}
          style={secondaryStyle}
        >
          <LuShare2 className={iconClass} strokeWidth={2.5} style={{ color: accent }} aria-hidden />
          <span>{cta.collaboration}</span>
        </button>
      ) : null}
    </div>
  );
}
