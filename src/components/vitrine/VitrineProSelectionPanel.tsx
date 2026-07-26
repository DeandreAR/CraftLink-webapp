"use client";

import { useDeferredValue, useMemo, useState, type MouseEvent } from "react";
import { LuSearch } from "react-icons/lu";
import type { VitrineRecommendedProduct } from "@/domain/vitrine";
import { trackVitrineEvent } from "@/lib/analytics/trackVitrineEvent";

type VitrineProSelectionPanelProps = {
  products: VitrineRecommendedProduct[];
  searchPlaceholder: string;
  emptyLabel: string;
  ctaLabel: string;
  pageSlug?: string;
};

export function VitrineProSelectionPanel({
  products,
  searchPlaceholder,
  emptyLabel,
  ctaLabel,
  pageSlug,
}: VitrineProSelectionPanelProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!deferredQuery) return products;
    return products.filter((product) => {
      const haystack = [
        product.title,
        product.description ?? "",
        product.discountCode ?? product.priceHint ?? "",
        product.brand ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(deferredQuery);
    });
  }, [products, deferredQuery]);

  const handleAffiliateClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pageSlug) {
      trackVitrineEvent(pageSlug, "click_affiliate");
    }
    if (!href) {
      event.preventDefault();
    }
  };

  return (
    <div className="px-4 pb-4 pt-3 text-left sm:px-5">
      <label className="relative block">
        <span className="sr-only">{searchPlaceholder}</span>
        <LuSearch
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-neutral-200/90 bg-white py-3 pl-11 pr-4 text-sm font-medium text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)] outline-none placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-neutral-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {filtered.map((product) => {
            const href = product.url || product.affiliateUrl;
            const discount = product.discountCode ?? product.priceHint;
            const image = product.imageUrl?.trim() || null;

            return (
              <li
                key={product.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    className="aspect-square w-full object-cover bg-neutral-100"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-2xl font-bold text-neutral-400">
                    {product.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="text-sm font-semibold leading-snug tracking-tight text-neutral-900">
                    {product.title}
                  </p>
                  {product.description ? (
                    <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500">
                      {product.description}
                    </p>
                  ) : null}
                  {discount ? (
                    <p className="text-xs font-semibold text-[#EFA188]">{discount}</p>
                  ) : null}
                  <a
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleAffiliateClick(e, href)}
                    className="mt-auto inline-flex items-center justify-center rounded-full bg-neutral-950 px-3 py-2.5 text-xs font-semibold tracking-tight text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    {ctaLabel}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
