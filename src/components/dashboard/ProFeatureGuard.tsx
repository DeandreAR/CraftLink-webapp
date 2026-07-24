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
    <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="pointer-events-none select-none opacity-30" aria-hidden>
        {children}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center bg-slate-50/80 p-4"
        role="region"
        aria-labelledby={`pro-feature-${feature}-title`}
      >
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <span className="db-section-label inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 normal-case tracking-normal text-slate-500">
            {g.badge}
          </span>
          <h3
            id={`pro-feature-${feature}-title`}
            className="mt-4 text-lg font-semibold tracking-tight text-slate-900 md:text-xl"
          >
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
          <div className="mt-6">
            <StripeCheckoutButton
              priceKey="pro_monthly"
              locale={locale}
              successPath={authPath(locale, "dashboard")}
              className="w-full justify-center !rounded-lg !border-0 !bg-slate-900 !text-white !shadow-none hover:!bg-slate-800"
            >
              {g.cta}
            </StripeCheckoutButton>
          </div>
          <p className="mt-3 text-xs text-slate-500">{g.reassurance}</p>
        </div>
      </div>
    </div>
  );
}
