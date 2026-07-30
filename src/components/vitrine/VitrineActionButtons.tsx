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
import { trackVitrineEvent } from "@/lib/analytics/trackVitrineEvent";
import { buildUrgencyWhatsAppUrl } from "@/lib/vitrine/buildUrgencyWhatsApp";
import { LuCalendarClock, LuInfo } from "react-icons/lu";

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

/** Style référence : pill pastel, icône à gauche, relief bas — sans cercle blanc. */
const secondaryClass =
  "relative z-10 flex min-h-[3.35rem] w-full items-center justify-center rounded-full px-12 text-center text-[15px] font-semibold tracking-[-0.01em] text-neutral-900 transition duration-150 hover:brightness-[0.99] active:translate-y-px";

/**
 * Fond teinté transparent (couleur picker) + 3D doux comme la référence.
 */
function secondaryButtonStyle(accent: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 14%, white) 0%, color-mix(in srgb, ${accent} 28%, white) 55%, color-mix(in srgb, ${accent} 36%, white) 100%)`,
    color: "#111827",
    border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
    boxShadow: [
      `0 6px 14px color-mix(in srgb, ${accent} 18%, transparent)`,
      "0 1px 2px rgba(0,0,0,0.05)",
      "inset 0 1px 0 rgba(255,255,255,0.75)",
      `inset 0 -3px 6px color-mix(in srgb, ${accent} 16%, transparent)`,
    ].join(", "),
  };
}

const iconClass = "absolute left-5 h-[1.2rem] w-[1.2rem] shrink-0";

export function VitrineActionButtons({
  pageSlug,
  artisanPhone = "",
  serviceZone = "",
  copy,
  profileSettings,
  theme,
  onAction,
}: VitrineActionButtonsProps) {
  const { visibility, cta } = profileSettings;
  const accent = theme.accent?.trim() || "#EFA188";
  const secondaryStyle = secondaryButtonStyle(accent);
  const iconColor = `color-mix(in srgb, ${accent} 75%, #111111)`;

  const handleUrgentClick = () => {
    trackVitrineEvent(pageSlug, "click_whatsapp");

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
        <LuInfo className={iconClass} strokeWidth={2.35} style={{ color: iconColor }} aria-hidden />
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
          <span className="absolute left-5 inline-flex items-center gap-1">
            <LuCalendarClock
              className="h-[1.15rem] w-[1.15rem]"
              strokeWidth={2.35}
              style={{ color: iconColor }}
              aria-hidden
            />
            <span className="text-[15px] leading-none" aria-hidden>
              🚨
            </span>
          </span>
          <span>{cta.secondaryUrgent.replace(/^🚨\s*/, "")}</span>
        </button>
      ) : null}
    </div>
  );
}
