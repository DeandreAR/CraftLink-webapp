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
  "relative z-10 flex min-h-[3.15rem] w-full items-center justify-center rounded-full border bg-white px-12 text-center text-[15px] font-medium tracking-[-0.01em] transition duration-150 hover:brightness-[0.98] active:scale-[0.99]";

function secondaryButtonStyle(accent: string): CSSProperties {
  return {
    backgroundColor: "#ffffff",
    color: "#202124",
    borderColor: accent || "#dadce0",
    borderWidth: 1.5,
    boxShadow: "0 1px 2px rgba(60,64,67,0.1), 0 1px 3px rgba(60,64,67,0.08)",
  };
}

const iconClass = "absolute left-5 h-[1.1rem] w-[1.1rem] shrink-0";

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
  const accent = theme.accent?.trim() || "#dadce0";
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
    <div className="mt-3.5 space-y-2.5">
      <button
        type="button"
        onClick={() => onAction("info")}
        className={secondaryClass}
        style={secondaryStyle}
      >
        <LuInfo className={iconClass} strokeWidth={2.25} style={{ color: accent }} aria-hidden />
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
          <LuCalendarClock
            className={iconClass}
            strokeWidth={2.25}
            style={{ color: accent }}
            aria-hidden
          />
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
          <LuShare2
            className={iconClass}
            strokeWidth={2.25}
            style={{ color: accent }}
            aria-hidden
          />
          <span>{cta.collaboration}</span>
        </button>
      ) : null}
    </div>
  );
}
