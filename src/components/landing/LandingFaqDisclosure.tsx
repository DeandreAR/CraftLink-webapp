"use client";

import { useState } from "react";
import type { FaqUiDictionary } from "@/i18n/types";

export type FaqItem = { q: string; a: string };

export type FaqBlock = { title: string; items: FaqItem[] };

type LandingFaqDisclosureProps = {
  blocks: FaqBlock[];
  copy: FaqUiDictionary;
};

export function LandingFaqDisclosure({ blocks, copy }: LandingFaqDisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="faq"
      className="lk-section scroll-mt-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <h2 id="faq-heading" className="lk-display text-3xl md:text-4xl">
          {copy.title}
        </h2>
        <p className="lk-lead mt-4 max-w-3xl text-base md:text-lg">{copy.lead}</p>

        <div className="mt-8">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="faq-panel"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-2xl border-2 border-[#212129]/15 bg-white px-6 py-3 text-sm font-bold text-[#212129] transition hover:border-[#EFA188] hover:bg-[#EFA188]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EFA188] md:text-base"
          >
            {open ? copy.hide : copy.show}
          </button>
        </div>

        {open ? (
          <div
            id="faq-panel"
            className="mt-10 space-y-12 border-t border-neutral-100 pt-10"
          >
            {blocks.map((block) => (
              <div key={block.title}>
                <h3 className="text-lg font-bold text-neutral-900">{block.title}</h3>
                <div className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
                  {block.items.map((item) => (
                    <details
                      key={item.q}
                      className="group px-4 py-4 md:px-6 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-medium text-neutral-900">
                        <span>{item.q}</span>
                        <span className="mt-0.5 shrink-0 text-neutral-400 transition group-open:rotate-180">
                          ⌄
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
