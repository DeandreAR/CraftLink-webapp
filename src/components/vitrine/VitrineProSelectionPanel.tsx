"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { VitrineRecommendedProduct } from "@/domain/vitrine";

type VitrineProSelectionPanelProps = {
  products: VitrineRecommendedProduct[];
  searchPlaceholder: string;
  emptyLabel: string;
  ctaLabel: string;
};

export function VitrineProSelectionPanel({
  products,
  searchPlaceholder,
  emptyLabel,
  ctaLabel,
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

  return (
    <div className="px-4 pb-4 pt-2 text-left sm:px-5">
      <label className="block">
        <span className="sr-only">{searchPlaceholder}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none ring-[#EFA188]/30 placeholder:text-neutral-400 focus:ring-2"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-neutral-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2">
          {filtered.map((product) => {
            const href = product.url || product.affiliateUrl;
            const discount = product.discountCode ?? product.priceHint;
            const image = product.imageUrl?.trim() || null;

            return (
              <li
                key={product.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    className="aspect-square w-full object-cover bg-neutral-100"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-2xl font-black text-neutral-400">
                    {product.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="text-sm font-semibold leading-snug text-neutral-900">
                    {product.title}
                  </p>
                  {product.description ? (
                    <p className="line-clamp-2 text-xs text-neutral-600">
                      {product.description}
                    </p>
                  ) : null}
                  {discount ? (
                    <p className="text-xs font-semibold text-[#EFA188]">{discount}</p>
                  ) : null}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center rounded-full bg-neutral-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
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
