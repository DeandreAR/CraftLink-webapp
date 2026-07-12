"use client";

import Image from "next/image";
import { useState } from "react";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import type { LandingMetiersDictionary } from "@/i18n/landing/types";
import { LANDING_METIERS_IMAGE } from "@/lib/landing/landingImages";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { metierSupportsUrgencyCta } from "@/lib/vitrine/metierUrgencySupport";

type LandingMetiersSectionProps = {
  content: LandingMetiersDictionary;
};

const DEFAULT_VISIBLE = 6;

export function LandingMetiersSection({ content }: LandingMetiersSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCards = expanded ? content.cards : content.cards.slice(0, DEFAULT_VISIBLE);
  const hasMore = content.cards.length > DEFAULT_VISIBLE;

  return (
    <section
      id="metiers"
      className="landing-metiers lk-section scroll-mt-28"
      aria-labelledby="metiers-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <LandingSectionHeader
          index={content.header.index}
          eyebrow={content.header.eyebrow}
          id="metiers-heading"
          title={content.header.title}
          lead={content.header.lead}
        />

        <figure className="relative mt-10 overflow-hidden rounded-[1.75rem] md:mt-12">
          <div className="relative aspect-[21/9] min-h-[12rem] w-full sm:aspect-[2.4/1]">
            <Image
              src={LANDING_METIERS_IMAGE}
              alt={content.imageAlt}
              fill
              className="object-cover object-[center_35%]"
              sizes="(max-width: 768px) 100vw, 1152px"
              priority={false}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212129]/55 via-[#212129]/10 to-transparent"
              aria-hidden
            />
          </div>
        </figure>

        <ul className="relative z-10 -mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(33,33,41,0.08)] md:-mt-10">
          {visibleCards.map((card) => {
            const supportsUrgency = metierSupportsUrgencyCta(card.metierKey as MetierKey);
            return (
              <li key={card.metierKey} className="px-4 py-4 md:px-6 md:py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-[#212129] md:text-lg">{card.metier}</h3>
                  {supportsUrgency ? (
                    <span className="rounded-full bg-[#EFA188]/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#212129]">
                      {content.urgencyBadge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5b6478]">{card.angle}</p>
              </li>
            );
          })}
        </ul>

        {hasMore ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className="rounded-full border-2 border-[#212129] bg-white px-6 py-2.5 text-sm font-bold text-[#212129] transition hover:bg-neutral-50"
              aria-expanded={expanded}
            >
              {expanded ? content.showLessMetiers : content.showAllMetiers}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
