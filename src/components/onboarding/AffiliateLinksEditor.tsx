"use client";

import { FaLink, FaTrash } from "react-icons/fa6";
import { LandingCta } from "@/components/landing/LandingCta";
import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import {
  createAffiliateLink,
  MAX_AFFILIATE_LINKS,
} from "@/lib/onboarding/affiliateLinks";
import {
  authFieldClassName,
  authLabelClassName,
} from "@/components/auth/authFormStyles";

export type AffiliateLinksEditorCopy = {
  title: string;
  hint: string;
  nameLabel: string;
  namePlaceholder: string;
  discountLabel: string;
  discountPlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
  add: string;
  remove: string;
  maxReached: string;
  empty: string;
};

type AffiliateLinksEditorProps = {
  links: OnboardingAffiliateLink[];
  onChange: (links: OnboardingAffiliateLink[]) => void;
  copy: AffiliateLinksEditorCopy;
  optionalBadge?: string;
};

export function AffiliateLinksEditor({
  links,
  onChange,
  copy,
  optionalBadge,
}: AffiliateLinksEditorProps) {
  const atMax = links.length >= MAX_AFFILIATE_LINKS;

  const patchLink = (id: string, patch: Partial<OnboardingAffiliateLink>) => {
    onChange(links.map((link) => (link.id === id ? { ...link, ...patch } : link)));
  };

  const removeLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  const addLink = () => {
    if (atMax) return;
    onChange([...links, createAffiliateLink()]);
  };

  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-4 space-y-4">
      <div>
        <p className="inline-flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-900">
          <FaLink className="h-4 w-4 text-[#EFA188]" aria-hidden />
          {copy.title}
          {optionalBadge ? (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
              {optionalBadge}
            </span>
          ) : null}
        </p>
        <p className="mt-1 text-xs text-neutral-600">{copy.hint}</p>
      </div>

      {links.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-3 text-xs text-neutral-500">
          {copy.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3 sm:grid-cols-[1fr_0.8fr_1.2fr_auto]"
            >
              <div>
                <label className={authLabelClassName} htmlFor={`affiliate-label-${link.id}`}>
                  {copy.nameLabel}
                </label>
                <input
                  id={`affiliate-label-${link.id}`}
                  type="text"
                  value={link.label}
                  onChange={(e) => patchLink(link.id, { label: e.target.value })}
                  placeholder={copy.namePlaceholder}
                  className={authFieldClassName}
                />
              </div>
              <div>
                <label className={authLabelClassName} htmlFor={`affiliate-discount-${link.id}`}>
                  {copy.discountLabel}
                </label>
                <input
                  id={`affiliate-discount-${link.id}`}
                  type="text"
                  value={link.discount ?? ""}
                  onChange={(e) => patchLink(link.id, { discount: e.target.value })}
                  placeholder={copy.discountPlaceholder}
                  className={authFieldClassName}
                />
              </div>
              <div>
                <label className={authLabelClassName} htmlFor={`affiliate-url-${link.id}`}>
                  {copy.urlLabel}
                </label>
                <input
                  id={`affiliate-url-${link.id}`}
                  type="url"
                  value={link.url}
                  onChange={(e) => patchLink(link.id, { url: e.target.value })}
                  placeholder={copy.urlPlaceholder}
                  className={authFieldClassName}
                />
              </div>
              <div className="flex items-end sm:justify-end">
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-600 transition hover:border-red-200 hover:text-red-600"
                  aria-label={copy.remove}
                >
                  <FaTrash className="h-3.5 w-3.5" aria-hidden />
                  {copy.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <LandingCta
        type="button"
        variant="secondary"
        onClick={addLink}
        disabled={atMax}
        className="w-full justify-center disabled:opacity-50"
      >
        {copy.add}
      </LandingCta>
      {atMax ? (
        <p className="text-center text-xs text-neutral-500">{copy.maxReached}</p>
      ) : null}
    </div>
  );
}
