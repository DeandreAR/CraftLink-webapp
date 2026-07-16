"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import type { LandingMetierCard, LandingMetiersDictionary } from "@/i18n/landing/types";
import { LANDING_METIERS_IMAGE } from "@/lib/landing/landingImages";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { metierSupportsUrgencyCta } from "@/lib/vitrine/metierUrgencySupport";

type LandingMetiersSectionProps = {
  content: LandingMetiersDictionary;
};

const DEFAULT_VISIBLE = 6;

function metierShortLabel(metier: string): string {
  const dash = metier.indexOf(" / ");
  if (dash > 0) return metier.slice(0, dash);
  const slash = metier.indexOf(" & ");
  if (slash > 0) return metier.slice(0, slash);
  return metier.length > 28 ? `${metier.slice(0, 26)}…` : metier;
}

function MetierDetailPanel({
  card,
  content,
}: {
  card: LandingMetierCard;
  content: LandingMetiersDictionary;
}) {
  const supportsUrgency = metierSupportsUrgencyCta(card.metierKey as MetierKey);

  return (
    <div className="flex min-h-[16rem] flex-col p-6 md:min-h-[18rem] md:p-8 lg:p-10">
      <div className="flex flex-wrap items-center gap-2">
        {supportsUrgency ? (
          <span className="rounded-full bg-[#EFA188] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#212129]">
            {content.urgencyBadge}
          </span>
        ) : (
          <span className="rounded-full border-2 border-[#212129] bg-[#FDFBF7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#212129]">
            {content.quoteBadge}
          </span>
        )}
      </div>
      <h3 className="lk-display mt-5 text-2xl md:text-[1.75rem] lg:text-3xl">{card.metier}</h3>
      <p className="mt-4 max-w-prose flex-1 text-base font-medium leading-relaxed text-[#5b6478] md:text-lg">
        {card.angle}
      </p>
    </div>
  );
}

export function LandingMetiersSection({ content }: LandingMetiersSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeKey, setActiveKey] = useState<MetierKey>(
    content.cards[0]?.metierKey ?? "RENOVATION_GENERALE",
  );

  const visibleCards = expanded ? content.cards : content.cards.slice(0, DEFAULT_VISIBLE);
  const hasMore = content.cards.length > DEFAULT_VISIBLE;

  const activeCard = useMemo(
    () => content.cards.find((card) => card.metierKey === activeKey) ?? content.cards[0],
    [activeKey, content.cards],
  );

  return (
    <section
      id="metiers"
      className="landing-metiers lk-section scroll-mt-28"
      aria-labelledby="metiers-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="metiers-heading"
          title={content.header.title}
          lead={content.header.lead}
        />

        <figure className="relative mt-10 overflow-hidden rounded-[1.75rem] md:mt-12">
          <div className="relative aspect-[21/9] min-h-[11rem] w-full sm:aspect-[2.4/1] sm:min-h-[12rem]">
            <Image
              src={LANDING_METIERS_IMAGE}
              alt={content.imageAlt}
              fill
              className="object-cover object-[center_35%]"
              sizes="(max-width: 768px) 100vw, 1152px"
              priority={false}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212129]/60 via-[#212129]/15 to-transparent"
              aria-hidden
            />
          </div>
        </figure>

        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          <nav
            className="flex flex-col gap-1"
            aria-label={content.header.title}
          >
            <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#5b6478] lg:px-3">
              {content.selectMetierHint}
            </p>
            <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {visibleCards.map((card) => {
                const isActive = card.metierKey === activeKey;
                return (
                  <li key={card.metierKey} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => setActiveKey(card.metierKey)}
                      aria-current={isActive ? "true" : undefined}
                      className={`w-full min-w-[9.5rem] cursor-pointer rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition-all duration-200 lg:min-w-0 lg:rounded-2xl lg:px-4 lg:py-3.5 ${
                        isActive
                          ? "border-[#212129] bg-[#212129] text-white shadow-[0_10px_28px_rgba(33,33,41,0.22)]"
                          : "border-transparent bg-white/80 text-[#5b6478] hover:border-[#EFA188]/40 hover:bg-white hover:text-[#212129]"
                      }`}
                    >
                      {metierShortLabel(card.metier)}
                    </button>
                  </li>
                );
              })}
            </ul>

            {hasMore ? (
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                className="mt-3 rounded-full border-2 border-dashed border-[#212129]/25 px-4 py-2.5 text-xs font-bold text-[#212129] transition hover:border-[#EFA188] hover:bg-[#EFA188]/10 lg:mx-1"
                aria-expanded={expanded}
              >
                {expanded ? content.showLessMetiers : content.showAllMetiers}
              </button>
            ) : null}
          </nav>

          <div
            className="min-w-0 rounded-[1.75rem] border-2 border-[#212129]/10 bg-white shadow-[0_24px_64px_rgba(33,33,41,0.08)]"
            role="tabpanel"
            aria-live="polite"
          >
            {activeCard ? (
              <MetierDetailPanel card={activeCard} content={content} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
