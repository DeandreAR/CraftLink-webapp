"use client";

import { useEffect } from "react";

type AffiliateRedirectClientProps = {
  destinationUrl: string;
  label: string;
  discount?: string;
  businessName: string;
  imageUrl: string | null;
};

/** Soft landing : OG pour les crawlers, redirection rapide pour les humains. */
export function AffiliateRedirectClient({
  destinationUrl,
  label,
  discount,
  businessName,
  imageUrl,
}: AffiliateRedirectClientProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(destinationUrl);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [destinationUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="aspect-[1.91/1] w-full object-cover bg-neutral-100"
          />
        ) : null}
        <div className="space-y-3 p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {businessName}
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">{label}</h1>
          {discount ? (
            <p className="inline-flex rounded-full bg-[#EFA188]/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#c45a3a]">
              {discount}
            </p>
          ) : null}
          <p className="text-sm text-neutral-500">Redirection vers l’offre…</p>
          <a
            href={destinationUrl}
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Continuer
          </a>
        </div>
      </div>
    </main>
  );
}
