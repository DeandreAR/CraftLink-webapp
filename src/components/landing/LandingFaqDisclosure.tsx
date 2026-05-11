"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";

export type FaqItem = { q: string; a: string };

export type FaqBlock = { title: string; items: FaqItem[] };

export function LandingFaqDisclosure({ blocks }: { blocks: FaqBlock[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="faq"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 py-14 md:px-6 md:py-18"
      aria-labelledby="faq-heading"
    >
      <h2
        id="faq-heading"
        className="text-3xl font-bold tracking-tight text-black md:text-4xl"
      >
        Questions fréquentes
      </h2>
      <p className="mt-4 max-w-3xl text-base text-neutral-700 md:text-lg">
        Réponses aux objections courantes — uniquement si vous souhaitez creuser
        le détail.
      </p>

      <div className="mt-8">
        <GlowButton
          type="button"
          variant="primary"
          aria-expanded={open}
          aria-controls="faq-panel"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Masquer la FAQ" : "Afficher les questions fréquentes"}
        </GlowButton>
      </div>

      {open ? (
        <div
          id="faq-panel"
          className="mt-10 space-y-12 border-t border-neutral-200 pt-10"
        >
          {blocks.map((block) => (
            <div key={block.title}>
              <h3 className="text-lg font-bold text-black">{block.title}</h3>
              <div className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                {block.items.map((item) => (
                  <details
                    key={item.q}
                    className="group px-4 py-4 md:px-6 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-medium text-black">
                      <span>{item.q}</span>
                      <span className="mt-0.5 shrink-0 text-neutral-400 transition group-open:rotate-180">
                        ⌄
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
