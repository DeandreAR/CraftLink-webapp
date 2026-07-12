"use client";

import { useState } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton";
import { GlowButton } from "@/components/ui/GlowButton";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { isProPlan } from "@/lib/dashboard/planAccess";
import { startStripeBillingPortal } from "@/lib/stripe/startBillingPortal";

type BillingSectionProps = {
  planTier: string;
  billing: SubscriptionBillingSnapshot | null;
  copy: DashboardDictionary;
  locale: Locale;
};

function formatBillingDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function BillingSection({ planTier, billing, copy, locale }: BillingSectionProps) {
  const b = copy.billing;
  const pro = isProPlan(planTier);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const nextBillingLabel = billing?.nextBillingDate
    ? b.nextBillingOn.replace("{date}", formatBillingDate(billing.nextBillingDate, locale))
    : b.nextBillingNone;

  const intervalLabel =
    billing?.interval === "year"
      ? b.billingIntervalAnnual
      : billing?.interval === "month"
        ? b.billingIntervalMonthly
        : null;

  const handlePortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    const result = await startStripeBillingPortal(locale);
    setPortalLoading(false);
    if (!result.ok) {
      setPortalError(result.message ?? b.portalError);
    }
  };

  return (
    <DashboardCard variant="flat" className="p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFA188]/18 text-[#212129] ring-1 ring-[#EFA188]/30">
          <FaCreditCard className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[#212129]">{b.title}</h3>
          <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#5b6478]">
            {b.currentPlan}
          </p>
          <p className="mt-2 text-lg font-bold text-[#212129]">
            {pro ? b.pro : b.essential}
          </p>
          <p className="text-sm text-[#5b6478]">
            {pro ? b.proPriceMonthly : b.essentialPrice}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#5b6478]">
            {pro ? b.proFeatures : b.essentialFeatures}
          </p>

          {pro ? (
            <div className="mt-4 rounded-xl border border-[#EFA188]/20 bg-[#FDFBF7] px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#5b6478]">
                {b.nextBilling}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#212129]">{nextBillingLabel}</p>
              {intervalLabel ? (
                <p className="mt-0.5 text-xs text-[#5b6478]">{intervalLabel}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {pro ? (
          <GlowButton
            type="button"
            variant="secondary"
            disabled={portalLoading}
            onClick={() => void handlePortal()}
            className="w-full justify-center text-sm sm:w-auto"
          >
            {portalLoading ? "…" : b.manageStripe}
          </GlowButton>
        ) : (
          <StripeCheckoutButton
            priceKey="pro_monthly"
            locale={locale}
            successPath={authPath(locale, "dashboard")}
            className="w-full justify-center text-sm sm:w-auto"
          >
            {b.upgradePro}
          </StripeCheckoutButton>
        )}
      </div>

      {portalError ? (
        <p className="mt-2 text-sm text-red-600">{portalError}</p>
      ) : null}
    </DashboardCard>
  );
}
