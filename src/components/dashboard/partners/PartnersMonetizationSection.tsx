"use client";

import { useMemo } from "react";
import { FaCopy } from "react-icons/fa6";
import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import type { DashboardDictionary } from "@/i18n/types";
import { profileToEditorState } from "@/domain/vitrinePresentation";
import type { Profile } from "@/domain/profile";

const FEATURED_BRANDS = [
  { id: "leroy", name: "Leroy Merlin", category: "Matériaux", perk: "-8% PRO", accent: "#78BE20" },
  { id: "pointp", name: "Point.P", category: "Gros œuvre", perk: "-5%", accent: "#E30613" },
  { id: "castorama", name: "Castorama", category: "Rénovation", perk: "-6%", accent: "#0072CE" },
  { id: "soprema", name: "Soprema", category: "Étanchéité", perk: "Cashback", accent: "#003DA5" },
] as const;

type PartnersMonetizationSectionProps = {
  profile: Profile;
  copy: DashboardDictionary;
};

function copyToClipboard(text: string) {
  void navigator.clipboard?.writeText(text);
}

export function PartnersMonetizationSection({
  profile,
  copy,
}: PartnersMonetizationSectionProps) {
  const m = copy.partners.monetization;
  const affiliateLinks = useMemo(
    () => profileToEditorState(profile).profileDraft.affiliateLinks,
    [profile],
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#5b6478]">
          {m.brandsTitle}
        </h3>
        <p className="mt-1 text-sm text-[#5b6478]">{m.brandsHint}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURED_BRANDS.map((brand) => (
            <li
              key={brand.id}
              className="db-card-flat flex flex-col gap-3 p-4 transition hover:border-[#EFA188]/40"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-white"
                style={{ backgroundColor: brand.accent }}
                aria-hidden
              >
                {brand.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="font-bold text-[#212129]">{brand.name}</p>
                <p className="mt-0.5 text-xs text-[#5b6478]">{brand.category}</p>
              </div>
              <span className="mt-auto inline-flex w-fit rounded-full bg-[#EFA188]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#c45a3a]">
                {brand.perk}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#5b6478]">
          {m.codesTitle}
        </h3>
        <p className="mt-1 text-sm text-[#5b6478]">{m.codesHint}</p>
        {affiliateLinks.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-[#EFA188]/35 bg-white/80 px-4 py-6 text-center text-sm text-[#5b6478]">
            {m.codesEmpty}
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {affiliateLinks.map((link: OnboardingAffiliateLink) => (
              <li key={link.id} className="db-card-flat flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#212129]">{link.label}</p>
                  <p className="mt-1 truncate text-xs text-[#5b6478]">{link.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(link.url)}
                  className="shrink-0 rounded-lg border border-[#212129]/10 bg-[#FDFBF7] p-2 text-[#5b6478] transition hover:border-[#EFA188]/40 hover:text-[#212129]"
                  aria-label={m.copyCode}
                  title={m.copyCode}
                >
                  <FaCopy className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="db-card-flat p-5">
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#5b6478]">
          {m.trackingTitle}
        </h3>
        <p className="mt-1 text-sm text-[#5b6478]">{m.trackingHint}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[#FDFBF7] px-4 py-3">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478]">
              {m.clicks}
            </dt>
            <dd className="mt-1 text-2xl font-black text-[#212129]">0</dd>
          </div>
          <div className="rounded-xl bg-[#FDFBF7] px-4 py-3">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478]">
              {m.earned}
            </dt>
            <dd className="mt-1 text-2xl font-black text-[#212129]">0 €</dd>
          </div>
          <div className="rounded-xl bg-[#FDFBF7] px-4 py-3">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-[#5b6478]">
              {m.pending}
            </dt>
            <dd className="mt-1 text-2xl font-black text-[#212129]">0 €</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
