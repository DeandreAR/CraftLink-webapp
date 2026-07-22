import Link from "next/link";
import { notFound } from "next/navigation";
import { BillingSection } from "@/components/dashboard/account/BillingSection";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { PricingGrid } from "@/components/landing/PricingGrid";
import { getDictionary } from "@/i18n/getDictionary";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { requireSessionProfile } from "@/lib/auth/guards";
import { loadSubscriptionBillingForUser } from "@/lib/stripe/loadSubscriptionBilling";
import { buildPricingSectionModel } from "@/services/pricingComparisonSection";

type Props = { params: Promise<{ lang: string }> };

export default async function LangAbonnementPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const session = await requireSessionProfile(lang);
  const dict = await getDictionary(lang);
  const billing = await loadSubscriptionBillingForUser(session.user.id);
  const b = dict.dashboard.billing;
  const pricingModel = buildPricingSectionModel(dict.pricingComparison);
  const basePath = lang === defaultLocale ? "" : `/${lang}`;

  return (
    <main className="dashboard-page relative min-h-[100dvh] px-4 py-8 text-[#212129] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#EFA188]/14 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#D6BCFA]/12 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="mb-4">
          <Link
            href={authPath(lang, "dashboard")}
            className="text-sm font-semibold text-[#5b6478] underline-offset-2 hover:text-[#212129] hover:underline"
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
