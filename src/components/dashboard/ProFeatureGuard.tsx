"use client";

import type { ReactNode } from "react";
import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton";
import type { ProAccessProfile } from "@/domain/proAccess";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { hasProFeatureAccess } from "@/lib/dashboard/planAccess";

export type ProFeatureKey = "calendar" | "stats" | "partners";

type ProFeatureGuardProps = {
  feature: ProFeatureKey;
  proAccess: ProAccessProfile;
  copy: DashboardDictionary;
  locale: Locale;
  children: ReactNode;
};

function resolveProFeatureCopy(
  feature: ProFeatureKey,
  copy: DashboardDictionary,
): { title: string; description: string } {
  const g = copy.leads.proFeatureGuard;

  if (feature === "calendar") {
    return { title: g.calendar.title, description: g.description };
  }
  if (feature === "stats") {
    return { title: g.stats.title, description: g.description };
  }
  return {
    title: copy.partners.lockedTitle,
    description: copy.partners.lockedBody,
  };
}

/** Overlay paywall CraftLink pour vues réservées au plan Pro. */
export function ProFeatureGuard({
  feature,
  proAccess,
  copy,
  locale,
  children,
}: ProFeatureGuardProps) {
  const g = copy.leads.proFeatureGuard;

  if (hasProFeatureAccess(proAccess)) {
    return <>{children}</>;
  }

  const { title, description } = resolveProFeatureCopy(feature, copy);

  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="pointer-events-none select-none opacity-25" aria-hidden>
        {children}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center bg-white/80 p-4 backdrop-blur-[2px]"
        role="region"
        aria-labelledby={`pro-feature-${feature}-title`}
      >
        <div className="w-full max-w-md rounded-[24px] border border-black/8 bg-white p-6 text-center shadow-[0_8px_28px_rgba(0,0,0,0.06)] sm:p-8">
          <span className="inline-flex items-center rounded-full border border-[#efa188]/30 bg-[#efa188]/12 px-3 py-1 text-xs font-semibold text-[#e08a6f]">
            {g.badge}
          </span>
          <h3
            id={`pro-feature-${feature}-title`}
            className="mt-4 text-lg font-bold tracking-tight text-black md:text-xl"
          >
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">{description}</p>
          <div className="mt-6">
            <StripeCheckoutButton
              priceKey="pro_monthly"
              locale={locale}
              successPath={authPath(locale, "dashboard")}
              className="w-full min-h-[52px] justify-center !rounded-[20px] !border-0 !bg-black !text-white !shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:!bg-zinc-900"
            >
              {g.cta}
            </StripeCheckoutButton>
          </div>
          <p className="mt-3 text-xs text-zinc-500">{g.reassurance}</p>
        </div>
      </div>
    </div>
  );
}
