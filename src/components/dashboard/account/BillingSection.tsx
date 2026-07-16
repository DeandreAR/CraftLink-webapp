"use client";

import { useState } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton";
import { GlowButton } from "@/components/ui/GlowButton";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { abonnementPath } from "@/lib/auth/paths";
import { isProPlan } from "@/lib/dashboard/planAccess";
import { startStripeBillingPortal } from "@/lib/stripe/startBillingPortal";

type BillingSectionProps = {
  planTier: string;
  billing: SubscriptionBillingSnapshot | null;
  /** Fallback si le snapshot billing est vide (abo annulé, sync en cours…). */
  stripeCustomerId?: string | null;
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

export function BillingSection({
  planTier,
  billing,
  stripeCustomerId,
  copy,
  locale,
}: BillingSectionProps) {
  const b = copy.billing;
  const pro = isProPlan(planTier);
  const hasStripeCustomer = Boolean(
    billing?.customerId?.trim() || stripeCustomerId?.trim(),
  );
  const showPortal = pro || hasStripeCustomer;
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
    <div className="space-y-4">
      <DashboardCard variant="flat" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFA188]/18 text-[#212129] ring-1 ring-[#EFA188]/30">
              <FaCreditCard className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#5b6478]">
                {b.currentPlan}
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#212129]">
                {pro ? b.pro : b.essential}
              </h3>
              <p className="text-sm text-[#5b6478]">
                {pro ? b.proPriceMonthly : b.essentialPrice}
              </p>
            </div>
          </div>
          <span
            className={
              pro
                ? "inline-flex items-center rounded-full bg-[#212129] px-3 py-1 text-xs font-semibold text-white"
                : "inline-flex items-center rounded-full border border-[#EFA188]/40 bg-[#FFF5F2] px-3 py-1 text-xs font-semibold text-[#212129]"
            }
          >
            {pro ? b.badgePro : b.badgeFree}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#5b6478]">
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
        ) : (
          <div className="mt-4">
            <StripeCheckoutButton
              priceKey="pro_monthly"
              locale={locale}
              successPath={abonnementPath(locale)}
              className="w-full justify-center text-sm sm:w-auto"
            >
              {b.upgradePro}
            </StripeCheckoutButton>
          </div>
        )}
      </DashboardCard>

      {showPortal ? (
        <DashboardCard variant="flat" className="p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#212129]">{b.portalSectionTitle}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#5b6478]">{b.portalSectionBody}</p>
          <div className="mt-4">
            <GlowButton
              type="button"
              variant="secondary"
              disabled={portalLoading}
              onClick={() => void handlePortal()}
              className="w-full justify-center text-sm sm:w-auto"
            >
              {portalLoading ? b.manageStripeLoading : b.manageStripe}
            </GlowButton>
          </div>
          {portalError ? (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {portalError}
            </p>
          ) : null}
        </DashboardCard>
      ) : null}
    </div>
  );
}
