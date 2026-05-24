"use client";

import { useState } from "react";
import { getWhatsAppHref } from "@/config/contact";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FeatureMatrixRowJson, PricingComparisonDictionary } from "@/i18n/types";
import type { PricingSectionModel, TierKey } from "@/services/pricingComparisonSection";

type BillingPeriod = "monthly" | "annual";

type PricingGridProps = {
  model: PricingSectionModel;
  basePath: string;
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

          return (
            <li
              key={`${tierKey}-${label}`}
              className={`flex gap-2.5 leading-snug ${
                included ? "text-neutral-900" : "text-neutral-400"
              }`}
            >
              <FeatureStatusIcon
                tierKey={tierKey}
                row={row}
                included={included}
              />
              <span
                className={
                  !included
                    ? "line-through decoration-neutral-300/90"
                    : isHighlight
                      ? "font-semibold text-black"
                      : isLimit
                        ? "text-neutral-800"
                        : undefined
                }
              >
                {label}
              </span>
            </li>
          );
        })}
    </ul>
  );
}

function BillingSwitch({
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
    <div className="flex flex-col items-center gap-4">
      <div
        className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 shadow-sm"
        role="group"
        aria-label={`${copy.monthly} / ${copy.annual}`}
      >
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !isAnnual
              ? "bg-black text-white"
              : "text-neutral-600 hover:text-black"
          }`}
          aria-pressed={!isAnnual}
        >
          {copy.monthly}
        </button>
        <button
          type="button"
          onClick={() => onChange("annual")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            isAnnual
              ? "bg-black text-white"
              : "text-neutral-600 hover:text-black"
          }`}
          aria-pressed={isAnnual}
        >
          {copy.annual}
          <span className="badge-discount rounded-full bg-[#EFA188] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
            {copy.discountBadge}
          </span>
        </button>
      </div>
    </div>
  );
}

export function PricingGrid({ model, basePath }: PricingGridProps) {
  const { copy } = model;
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const withBase = (hash: string) => `${basePath}${hash}`;

  const essential = model.tiers.find((t) => t.tierKey === "essential");
  const pro = model.tiers.find((t) => t.tierKey === "pro");
  if (!essential || !pro) return null;

  const essentialPrice = copy.tierEssential.pricing[period];
  const proPrice = copy.tierPro.pricing[period];

  return (
    <>
      <BillingSwitch
        copy={copy.billing}
        period={period}
        onChange={setPeriod}
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <GlassCard
          rounded="2xl"
          className="flex flex-col border border-neutral-200 bg-white p-6 md:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600">
            {essential.name}
          </p>
          <p className="mt-2 text-base font-medium text-neutral-700">
            {essential.pitch}
          </p>
          <p className="mt-5 text-3xl font-bold tracking-tight text-black md:text-4xl">
            {essentialPrice.amount}
          </p>
          {essentialPrice.footnote ? (
            <p className="mt-1 text-xs text-neutral-500">{essentialPrice.footnote}</p>
          ) : (
            <p className="mt-1 text-xs text-neutral-400">&nbsp;</p>
          )}
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {copy.featuresColumnTitle}
          </p>
          <TierFeatureList tierKey="essential" rows={model.featureMatrix} />
          <div className="mt-8">
            <GlowButton
              href={withBase(essential.hrefSuffix)}
              variant="secondary"
              className="w-full justify-center"
            >
              {essential.cta}
            </GlowButton>
          </div>
        </GlassCard>

        <div className="flex flex-col rounded-[28px] border-2 border-black bg-white p-6 shadow-[0_22px_52px_rgba(0,0,0,0.14)] md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600">
              {pro.name}
            </p>
            {pro.badge ? (
              <span className="rounded-full bg-[#EFA188]/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                {pro.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-base font-medium text-neutral-700">{pro.pitch}</p>
          <p className="mt-5 text-3xl font-bold tracking-tight text-black md:text-4xl">
            {proPrice.amount}
          </p>
          {proPrice.footnote ? (
            <p className="mt-1 text-xs font-medium text-neutral-600">
              {proPrice.footnote}
            </p>
          ) : null}
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {copy.featuresColumnTitle}
          </p>
          <TierFeatureList tierKey="pro" rows={model.featureMatrix} />
          <div className="mt-8">
            <GlowButton
              href={withBase(pro.hrefSuffix)}
              variant="primary"
              className="w-full justify-center border-2 border-black bg-black text-white shadow-none hover:scale-[1.02]"
            >
              {pro.cta}
            </GlowButton>
          </div>
          {copy.tierPro.reassurance ? (
            <p className="mt-3 text-center text-xs leading-relaxed text-neutral-600">
              {copy.tierPro.reassurance}
            </p>
          ) : null}
        </div>

        <GlassCard
          rounded="2xl"
          className="flex flex-col border border-dashed border-neutral-300 bg-neutral-50/80 p-6 md:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600">
            {copy.tierCustom.name}
          </p>
          <p className="mt-2 text-base font-medium text-neutral-700">
            {copy.tierCustom.pitch}
          </p>
          <p className="mt-5 text-3xl font-bold tracking-tight text-black md:text-4xl">
            {copy.tierCustom.priceLabel}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            {copy.tierCustom.description}
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {copy.featuresColumnTitle}
          </p>
          <ul className="mt-4 flex-1 space-y-2.5 text-sm">
            {copy.tierCustom.bullets.map((item) => (
              <li key={item} className="flex gap-2.5 leading-snug text-neutral-900">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-neutral-900">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <GlowButton
              href={getWhatsAppHref(copy.tierCustom.whatsappMessage)}
              external
              className="w-full justify-center bg-[#25D366] text-white hover:bg-[#20BD5A]"
            >
              {copy.tierCustom.cta}
            </GlowButton>
          </div>
        </GlassCard>
      </div>

      <div className="mt-10 rounded-2xl border border-[#B2F5EA]/40 bg-[#B2F5EA]/[0.12] p-6 md:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800">
          {copy.proAdvantagesTitle}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {model.proAdvantages.map((line) => (
            <li
              key={line}
              className="flex gap-2 text-sm leading-snug text-neutral-900 md:text-base"
            >
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