"use client";

import { FaDownload, FaQrcode } from "react-icons/fa6";
import { GlowButton } from "@/components/ui/GlowButton";
import type { DashboardDictionary } from "@/i18n/types";
import { buildPublicPageAbsoluteUrl, buildPublicPageDisplayUrl } from "@/lib/onboarding/publicPageUrl";
import { PublicPageUrlWithCopy } from "@/components/ui/PublicPageUrlWithCopy";

type QrCodeVanModuleProps = {
  slug: string | null;
  copy: DashboardDictionary;
};

function buildQrImageUrl(targetUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(targetUrl)}`;
}

export function QrCodeVanModule({ slug, copy }: QrCodeVanModuleProps) {
  const q = copy.qr;
  const pageUrl = slug?.trim() ? buildPublicPageAbsoluteUrl(slug) : "";
  const displayUrl = slug?.trim() ? buildPublicPageDisplayUrl(slug) : "";
  const qrSrc = pageUrl ? buildQrImageUrl(pageUrl) : "";

  if (!slug?.trim()) {
    return (
      <p className="rounded-[18px] border border-dashed border-neutral-200 py-10 text-center text-sm text-neutral-500">
        Publiez votre page pour générer votre QR Code.
      </p>
    );
  }

  return (
    <div className="rounded-[18px] border border-neutral-200 bg-white p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800">
        <FaQrcode className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="mt-3 text-base font-bold text-black">{q.title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{q.subtitle}</p>

      <div className="mx-auto mt-5 inline-block rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt=""
          width={280}
          height={280}
          className="h-auto w-full max-w-[280px]"
        />
      </div>

      <PublicPageUrlWithCopy
        displayUrl={displayUrl}
        copyText={pageUrl}
        copyAriaLabel={copy.vitrine.copyPageUrl}
        copiedLabel={copy.vitrine.pageUrlCopied}
        className="mx-auto mt-3 max-w-sm"
        urlClassName="text-xs text-neutral-500"
      />
      <p className="mt-2 text-xs text-neutral-400">{q.printHint}</p>

      <GlowButton
        href={qrSrc}
        external
        download="craftlink-qr-camion.png"
        className="mt-5 w-full justify-center gap-2 sm:w-auto"
      >
        <FaDownload className="h-4 w-4" aria-hidden />
        {q.download}
      </GlowButton>
    </div>
  );
}
