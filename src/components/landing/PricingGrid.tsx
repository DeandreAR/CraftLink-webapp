"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { getWhatsAppHref } from "@/config/contact";
import { LandingCta } from "@/components/landing/LandingCta";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { onboardingPath } from "@/lib/auth/paths";
import type { FeatureMatrixRowJson, PricingComparisonDictionary } from "@/i18n/types";
import type { PricingSectionModel, TierKey } from "@/services/pricingComparisonSection";

type BillingPeriod = "monthly" | "annual";

type PricingGridActions = {
  onSelectEssential: () => void;
  onSelectPro: (billing: BillingPeriod) => void;
};

type PricingGridProps = {
  model: PricingSectionModel;
  basePath: string;
  locale?: Locale;
  /** Mode onboarding : les CTA Essentiel / Pro déclenchent des callbacks au lieu de naviguer. */
  actions?: PricingGridActions;
  /** `grid` = 3 colonnes landing classique ; `split` = pile verticale pour split-screen tarifs. */
  layout?: "grid" | "split";
};

function isFeatureVisible(row: FeatureMatrixRowJson, tierKey: TierKey): boolean {
  if (tierKey === "essential") return row.showEssential !== false;
  return row.showPro !== false;
}

function getFeatureLabel(row: FeatureMatrixRowJson, tierKey: TierKey): string {
  if (tierKey === "essential" && row.labelEssential) return row.labelEssential;
  if (tierKey === "pro" && row.labelPro) return row.labelPro;
  return row.label;
}

/** Rendu inline `**gras**` depuis les libellés i18n. */
function FeatureLabel({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-inherit">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
}

function isExcludedFeatureLabel(label: string): boolean {
  return label.trimStart().startsWith("❌");
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSparkHighlight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <path d="M8 1.5 8.8 5.2 12.5 6 8.8 6.8 8 10.5 7.2 6.8 3.5 6 7.2 5.2 8 1.5Z" />
    </svg>
  );
}

function FeatureStatusIcon({
  tierKey,
  row,
  included,
}: {
  tierKey: TierKey;
  row: FeatureMatrixRowJson;
  included: boolean;
}) {
  const isLimit = tierKey === "essential" && row.essentialLimit && included;
  const isHighlight = tierKey === "pro" && row.highlightPro && included;

  if (!included) {
    return (
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-neutral-300">
        <IconCross className="h-3.5 w-3.5" />
      </span>
    );
  }

  if (isHighlight) {
    return (
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[#EFA188]">
        <IconSparkHighlight className="h-3.5 w-3.5" />
      </span>
    );
  }

  return (
    <span
      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center ${
        isLimit ? "text-amber-700" : "text-neutral-900"
      }`}
    >
      <IconCheck className="h-3.5 w-3.5" />
    </span>
  );
}

function TierFeatureList({
  tierKey,
  rows,
}: {
  tierKey: TierKey;
  rows: FeatureMatrixRowJson[];
}) {
  return (
    <ul className="mt-4 flex-1 space-y-2.5 text-sm">
      {rows
        .filter((row) => isFeatureVisible(row, tierKey))
        .map((row) => {
          const included = row[tierKey];
          const label = getFeatureLabel(row, tierKey);
          const isLimit =
            tierKey === "essential" && row.essentialLimit && included;
          const isHighlight =
            tierKey === "pro" && row.highlightPro && included;
          const isExcludedLabel = !included && isExcludedFeatureLabel(label);

          return (
            <li
              key={`${tierKey}-${row.label}-${label}`}
              className={`flex gap-2.5 leading-snug ${
                included ? "text-neutral-900" : "text-neutral-400"
              }`}
            >
              {!isExcludedLabel ? (
                <FeatureStatusIcon
                  tierKey={tierKey}
                  row={row}
                  included={included}
                />
              ) : (
                <span className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              )}
              <FeatureLabel
                text={label}
                className={
                  !included
                    ? isExcludedLabel
                      ? "text-neutral-400 line-through decoration-neutral-300/90"
                      : "line-through decoration-neutral-300/90"
                    : isHighlight
                      ? "text-black"
                      : isLimit
                        ? "text-neutral-800"
                        : undefined
                }
              />
            </li>
          );
        })}
    </ul>
  );
}

function ProBillingSwitch({
  copy,
  period,
  onChange,
}: {
  copy: PricingComparisonDictionary["billing"];
  period: BillingPeriod;
  onChange: (p: BillingPeriod) => void;
}) {
  const isAnnual = period === "annual";

  return (
    <div
      className="mt-4 inline-flex w-full max-w-full items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1"
      role="group"
      aria-label={`${copy.monthly} / ${copy.annual}`}
    >
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${
          !isAnnual ? "bg-black text-white" : "text-neutral-600 hover:text-black"
        }`}
        aria-pressed={!isAnnual}
      >
        {copy.monthly}
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${
          isAnnual ? "bg-black text-white" : "text-neutral-600 hover:text-black"
        }`}
        aria-pressed={isAnnual}
      >
        <span>{copy.annual}</span>
        <span className="rounded-full bg-[#EFA188] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
          {copy.discountBadge}
        </span>
      </button>
    </div>
  );
}

export function PricingGrid({
  model,
  basePath,
  locale = defaultLocale,
  actions,
  layout = "grid",
}: PricingGridProps) {
  const { copy } = model;
  const [proPeriod, setProPeriod] = useState<BillingPeriod>("monthly");
  const withBase = (hash: string) => `${basePath}${hash}`;
  const isOnboardingMode = Boolean(actions);

  const essential = model.tiers.find((t) => t.tierKey === "essential");
  const pro = model.tiers.find((t) => t.tierKey === "pro");
  if (!essential || !pro) return null;

  const essentialPrice = copy.tierEssential.pricing.monthly;
  const proPrice = copy.tierPro.pricing[proPeriod];
  const proFuturePrice = copy.tierPro.futurePrice;
  const isSplit = layout === "split";

  const essentialCard = (
    <div
      className={`flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] ${
        isSplit ? "md:p-7" : "md:p-8"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
        {essential.name}
      </p>
      <p className="mt-2 text-base font-medium text-zinc-500">{essential.pitch}</p>
      <p className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
        {essentialPrice.amount}
      </p>
      {essentialPrice.footnote ? (
        <p className="mt-1 text-xs text-neutral-500">{essentialPrice.footnote}</p>
      ) : (
        <p className="mt-1 text-xs text-transparent">&nbsp;</p>
      )}
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {copy.featuresColumnTitle}
      </p>
      <TierFeatureList tierKey="essential" rows={model.featureMatrix} />
      <div className="mt-8">
        {isOnboardingMode && actions ? (
          <LandingCta
            type="button"
            variant="secondary"
            className="w-full justify-center"
            onClick={actions.onSelectEssential}
          >
            {essential.cta}
          </LandingCta>
        ) : (
          <LandingCta
            href={withBase(essential.hrefSuffix)}
            variant="secondary"
            className="w-full justify-center"
          >
            {essential.cta}
          </LandingCta>
        )}
      </div>
    </div>
  );

  const proCard = (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: 0.08 }}
      whileHover={isSplit ? undefined : { y: -4, scale: 1.01 }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] ${
        isSplit
          ? "z-10 -my-2 border-[#efa188]/50 p-6 md:-my-3 md:p-8"
          : "border-[#efa188]/45 p-6 md:p-8 lg:scale-[1.02]"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#efa188]"
        aria-hidden
      />

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
          {pro.name}
        </p>
        <span className="rounded-full border border-[#efa188]/30 bg-[#efa188]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c45c3e]">
          {copy.recommendedBadge}
        </span>
        {pro.badge ? (
          <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
            {pro.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-base font-medium text-neutral-700">{pro.pitch}</p>

      {proFuturePrice ? (
        <p className="mt-4 text-sm text-neutral-400 line-through decoration-neutral-300">
          {proFuturePrice}
        </p>
      ) : null}

      <ProBillingSwitch copy={copy.billing} period={proPeriod} onChange={setProPeriod} />

      <p className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
        {proPrice.amount}
      </p>
      {proPrice.footnote ? (
        <p className="mt-1 text-xs font-medium text-neutral-600">{proPrice.footnote}</p>
      ) : null}

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {copy.featuresColumnTitle}
      </p>
      <TierFeatureList tierKey="pro" rows={model.featureMatrix} />

      <div className="mt-8">
        {isOnboardingMode && actions ? (
          <LandingCta
            type="button"
            className="w-full justify-center"
            onClick={() => actions.onSelectPro(proPeriod)}
          >
            {pro.cta}
          </LandingCta>
        ) : (
          <LandingCta
            href={onboardingPath(locale, { plan: "pro", billing: proPeriod })}
            className="w-full justify-center"
          >
            {pro.cta}
          </LandingCta>
        )}
      </div>
      {copy.tierPro.reassurance ? (
        <p className="mt-3 text-center text-xs leading-relaxed text-neutral-600">
          {copy.tierPro.reassurance}
        </p>
      ) : null}
    </motion.div>
  );

  const customCard = (
    <div
      className={`flex flex-col rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 p-6 ${
        isSplit ? "md:p-7" : "md:p-8"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
        {copy.tierCustom.name}
      </p>
      <p className="mt-2 text-base font-medium text-neutral-700">{copy.tierCustom.pitch}</p>
      <p className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
        {copy.tierCustom.priceLabel}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{copy.tierCustom.description}</p>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {copy.featuresColumnTitle}
      </p>
      <ul className="mt-4 flex-1 space-y-2.5 text-sm">
        {copy.tierCustom.bullets.map((item) => (
          <li key={item} className="flex gap-2.5 leading-snug text-neutral-900">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
              <IconCheck className="h-3.5 w-3.5" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <LandingCta
          href={getWhatsAppHref(copy.tierCustom.whatsappMessage)}
          external
          variant="secondary"
          className="w-full justify-center !border-zinc-900 !text-zinc-900 hover:!border-zinc-900 hover:!bg-zinc-100"
        >
          {copy.tierCustom.cta}
        </LandingCta>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className={`flex justify-center ${isSplit ? "mt-0" : "mt-10"}`}
      >
        <span className="inline-flex max-w-xl items-center justify-center rounded-full border border-[#efa188]/30 bg-[#efa188]/10 px-5 py-2.5 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-zinc-700 sm:text-xs">
          {copy.betaPioneerBadge}
        </span>
      </motion.div>

      {isSplit ? (
        <div className="mt-6 flex flex-col gap-4 md:gap-5">
          {essentialCard}
          {proCard}
          {customCard}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-3 lg:items-stretch">
          {essentialCard}
          {proCard}
          {customCard}
        </div>
      )}

      <div className={`rounded-2xl border border-[#5fecd5]/35 bg-[#5fecd5]/10 p-6 md:p-8 ${isSplit ? "mt-6" : "mt-10"}`}>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-zinc-800">
          {copy.proAdvantagesTitle}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {model.proAdvantages.map((line) => (
            <li key={line} className="flex gap-2 text-sm leading-snug text-neutral-900 md:text-base">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[#0F766E]">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
