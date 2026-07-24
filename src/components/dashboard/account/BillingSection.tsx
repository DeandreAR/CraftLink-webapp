"use client";

import { useState } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton";
import type { SubscriptionBillingSnapshot } from "@/domain/billing";
import { isProUser, isSubscribedPro, isTrialActive } from "@/domain/proAccess";
import type { ProAccessProfile } from "@/domain/proAccess";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { abonnementPath } from "@/lib/auth/paths";
import { startStripeBillingPortal } from "@/lib/stripe/startBillingPortal";

type BillingSectionProps = {
  proAccess: ProAccessProfile;
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
  proAccess,
  billing,
  stripeCustomerId,
  copy,
  locale,
}: BillingSectionProps) {
  const b = copy.billing;
  const pro = isProUser(proAccess);
  const subscribed = isSubscribedPro(proAccess);
  const trialActive = isTrialActive(proAccess.trial_ends_at) && !subscribed;
  const hasStripeCustomer = Boolean(
    billing?.customerId?.trim() || stripeCustomerId?.trim(),
  );
  const showPortal = subscribed || hasStripeCustomer;
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
              <FaCreditCard className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {b.currentPlan}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {trialActive ? `${b.pro} (${b.badgeTrial})` : pro ? b.pro : b.essential}
              </h3>
              <p className="text-sm text-slate-500">
                {subscribed
                  ? b.proPriceMonthly
                  : trialActive
                    ? b.trialPrice
                    : pro
                      ? b.pro
                      : b.essentialPrice}
              </p>
              {trialActive && proAccess.trial_ends_at ? (
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {b.trialEndsOn.replace(
                    "{date}",
                    formatBillingDate(proAccess.trial_ends_at, locale),
                  )}
                </p>
              ) : null}
            </div>
          </div>
          <span
            className={
              trialActive
                ? "inline-flex items-center rounded-lg border border-[#EFA188]/50 bg-[#EFA188]/15 px-3 py-1 text-xs font-semibold text-slate-900"
                : pro
                  ? "inline-flex items-center rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  : "inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
            }
          >
            {trialActive ? b.badgeTrial : pro ? b.badgePro : b.badgeFree}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          {pro ? b.proFeatures : b.essentialFeatures}
        </p>

        {subscribed ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {b.nextBilling}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{nextBillingLabel}</p>
            {intervalLabel ? (
              <p className="mt-0.5 text-xs text-slate-500">{intervalLabel}</p>
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
            {trialActive ? (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{b.trialUpgradeHint}</p>
            ) : null}
          </div>
        )}
      </DashboardCard>

      {showPortal ? (
        <DashboardCard variant="flat" className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-slate-900">{b.portalSectionTitle}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{b.portalSectionBody}</p>
          <div className="mt-4">
            <DashboardButton
              type="button"
              variant="secondary"
              disabled={portalLoading}
              onClick={() => void handlePortal()}
            >
              {portalLoading ? b.manageStripeLoading : b.manageStripe}
            </DashboardButton>
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
