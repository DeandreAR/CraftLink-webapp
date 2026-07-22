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

/** Overlay paywall OpenShip pour vues réservées au plan Pro. */
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
    <div className="relative min-h-[280px] overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none opacity-40 blur-sm" aria-hidden>
        {children}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center bg-white/50 p-4 backdrop-blur-md"
        role="region"
        aria-labelledby={`pro-feature-${feature}-title`}
      >
        <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 text-center shadow-[0_16px_48px_rgba(33,33,41,0.08)] sm:p-8">
          <span className="inline-flex items-center rounded-full bg-[#efa188]/10 px-3 py-1 text-xs font-semibold text-[#efa188]">
            {g.badge}
          </span>
          <h3
            id={`pro-feature-${feature}-title`}
            className="mt-4 text-lg font-bold tracking-tight text-[#212129] md:text-xl"
          >
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#5b6478]">{description}</p>
          <div className="mt-6">
            <StripeCheckoutButton
              priceKey="pro_monthly"
              locale={locale}
              successPath={authPath(locale, "dashboard")}
              className="w-full justify-center !border-0 !bg-[#efa188] !text-zinc-950 !shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:!brightness-95"
            >
              {g.cta}
            </StripeCheckoutButton>
          </div>
          <p className="mt-3 text-xs text-[#5b6478]">{g.reassurance}</p>
        </div>
      </div>
    </div>
  );
}
