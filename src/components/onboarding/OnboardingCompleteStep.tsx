"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { markOnboardingCompleteAction } from "@/app/actions/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { GlowButton } from "@/components/ui/GlowButton";
import { authPath } from "@/lib/auth/paths";
import {
  buildPublicPageDisplayUrl,
  PUBLIC_PAGE_HOST,
} from "@/lib/onboarding/publicPageUrl";

type OnboardingCompleteStepProps = {
  copy: OnboardingDictionary;
  lang: Locale;
  pageSlug?: string;
  autoRedirectMs?: number;
};

export function OnboardingCompleteStep({
  copy,
  lang,
  pageSlug,
  autoRedirectMs = 3000,
}: OnboardingCompleteStepProps) {
  const c = copy.complete;
  const router = useRouter();
  const dashboardHref = authPath(lang, "dashboard");
  const slugSegment = pageSlug?.trim() ?? "";

  useEffect(() => {
    void markOnboardingCompleteAction();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push(dashboardHref);
    }, autoRedirectMs);
    return () => window.clearTimeout(timer);
  }, [router, dashboardHref, autoRedirectMs]);

  return (
    <div className="mx-auto max-w-md space-y-5 py-4 text-center">
      <Image
        src="/images/onboarding-fireworks.png"
        alt=""
        width={120}
        height={120}
        className="mx-auto"
        priority
      />
      <h2 className="text-2xl font-bold text-black">{c.title}</h2>
      {slugSegment ? (
        <div className="rounded-[20px] border border-[#EFA188]/40 bg-[#EFA188]/10 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
            {c.yourUrl}
          </p>
          <p className="mt-1 break-all text-base font-extrabold text-neutral-900">
            <span className="font-semibold text-neutral-400">{PUBLIC_PAGE_HOST}/</span>
            <span className="text-[#c45c3e]">{slugSegment}</span>
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {buildPublicPageDisplayUrl(slugSegment)}
          </p>
        </div>
      ) : null}
      <p className="text-sm leading-relaxed text-neutral-600">{c.body}</p>
      <GlowButton href={dashboardHref} className="w-full justify-center">
        {c.cta}
      </GlowButton>
      <p className="text-xs text-neutral-400">{c.autoRedirect}</p>
    </div>
  );
}
