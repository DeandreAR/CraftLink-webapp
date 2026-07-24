import Link from "next/link";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { PricingGrid } from "@/components/landing/PricingGrid";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { authPath } from "@/lib/auth/paths";
import { requireSessionProfile } from "@/lib/auth/guards";
import { loadSubscriptionBillingForUser } from "@/lib/stripe/loadSubscriptionBilling";
import { buildPricingSectionModel } from "@/services/pricingComparisonSection";

export default async function AbonnementPage() {
  const lang = defaultLocale;
  const session = await requireSessionProfile(lang);
  const dict = await getDictionary(lang);
  const billing = await loadSubscriptionBillingForUser(session.user.id);
  const b = dict.dashboard.billing;
  const pricingModel = buildPricingSectionModel(dict.pricingComparison);
  const basePath = "";

  return (
    <main className="dashboard-page relative min-h-[100dvh] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="mb-4">
          <Link
            href={authPath(lang, "dashboard")}
            className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            ← {b.backToDashboard}
          </Link>
        </p>
        <DashboardPageHeader title={b.title} subtitle={b.pageSubtitle} />
        <BillingSection
          proAccess={session.profile}
          billing={billing}
          stripeCustomerId={session.profile.stripe_customer_id}
          copy={dict.dashboard}
          locale={lang}
        />

        <section className="mt-12" aria-labelledby="plans-compare-heading">
          <h2
            id="plans-compare-heading"
            className="text-lg font-bold tracking-tight text-[#212129] md:text-xl"
          >
            {b.plansCompareTitle}
          </h2>
          <PricingGrid
            model={pricingModel}
            basePath={basePath}
            locale={lang}
            layout="grid"
            showCustomTier={false}
            showBetaBadge={false}
          />
        </section>
      </div>
    </main>
  );
}
