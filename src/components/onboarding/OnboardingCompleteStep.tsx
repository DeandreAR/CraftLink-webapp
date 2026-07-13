"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { markOnboardingCompleteAction } from "@/app/actions/onboarding";
import { GlowButton } from "@/components/ui/GlowButton";
import { PublicPageUrlWithCopy } from "@/components/ui/PublicPageUrlWithCopy";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authPath } from "@/lib/auth/paths";
import {
  buildPublicPageAbsoluteUrl,
  buildPublicPageDisplayUrl,
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
  autoRedirectMs = 5000,
}: OnboardingCompleteStepProps) {
  const c = copy.complete;
  const router = useRouter();
  const dashboardHref = authPath(lang, "dashboard");
  const slug = pageSlug?.trim() ?? "";
  const hasPublicUrl = slug.length > 0;

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
    <div className="mx-auto max-w-md space-y-6 py-8 text-center">
      <Image
        src="/images/onboarding-fireworks.png"
        alt=""
        width={120}
        height={120}
        className="mx-auto"
        priority
      />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-black md:text-3xl">{c.title}</h2>
        <p className="text-sm leading-relaxed text-neutral-600 md:text-base">{c.body}</p>
      </div>

      {hasPublicUrl ? (
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-left shadow-sm">
          <PublicPageUrlWithCopy
            label={c.yourUrl}
            displayUrl={buildPublicPageDisplayUrl(slug)}
            copyText={buildPublicPageAbsoluteUrl(slug)}
            copyAriaLabel={copy.pro.copyPageUrl}
            copiedLabel={copy.pro.pageUrlCopied}
            urlClassName="text-sm md:text-base"
          />
        </div>
      ) : null}

      <div className="space-y-3">
        <GlowButton href={dashboardHref} className="w-full justify-center">
          {c.cta}
        </GlowButton>
        <p className="text-xs text-neutral-500">{c.autoRedirect}</p>
      </div>
    </div>
  );
}
