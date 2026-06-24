"use client";

import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { PlanLockedCard } from "@/components/dashboard/PlanLockedCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type PartnersSectionProps = {
  pro: boolean;
  copy: DashboardDictionary;
  locale: Locale;
};

function PartnersEditor({ copy }: { copy: DashboardDictionary }) {
  const p = copy.partners;
  const [partners, setPartners] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const add = () => {
    const value = input.trim();
    if (!value) return;
    setPartners((prev) => [...prev, value]);
    setInput("");
  };

  return (
    <div className="space-y-4 rounded-[18px] border border-neutral-200 bg-white p-4">
      <div>
        <h3 className="text-base font-bold text-black">{p.title}</h3>
        <p className="mt-1 text-sm text-neutral-600">{p.subtitle}</p>
      </div>

      <div className="flex gap-2">
        <input
          className={authFieldClassName}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={p.placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <GlowButton type="button" onClick={add} className="shrink-0 gap-1 px-4 text-sm">
          <FaPlus className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">{p.add}</span>
        </GlowButton>
      </div>

      {partners.length === 0 ? (
        <p className="text-sm text-neutral-500">{p.empty}</p>
      ) : (
        <ul className="space-y-2">
          {partners.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium"
            >
              {name}
              <button
                type="button"
                onClick={() => setPartners((prev) => prev.filter((_, i) => i !== index))}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-red-600"
                aria-label="Supprimer"
              >
                <FaTrash className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PartnersSection({ pro, copy, locale }: PartnersSectionProps) {
  const p = copy.partners;

  if (!pro) {
    return (
      <PlanLockedCard
        title={p.lockedTitle}
        body={p.lockedBody}
        ctaLabel={p.upgradeCta}
        locale={locale}
      >
        <PartnersEditor copy={copy} />
      </PlanLockedCard>
    );
  }

  return <PartnersEditor copy={copy} />;
}
