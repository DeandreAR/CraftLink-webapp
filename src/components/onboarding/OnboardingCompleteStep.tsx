"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { markOnboardingCompleteAction } from "@/app/actions/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authPath } from "@/lib/auth/paths";

type OnboardingCompleteStepProps = {
  copy: OnboardingDictionary;
  lang: Locale;
  autoRedirectMs?: number;
};

export function OnboardingCompleteStep({
  copy,
  lang,
  autoRedirectMs = 5000,
}: OnboardingCompleteStepProps) {
  const c = copy.complete;
  const router = useRouter();
  const dashboardHref = authPath(lang, "dashboard");

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
    <div className="mx-auto max-w-md space-y-5 py-8 text-center">
      <Image
        src="/images/onboarding-fireworks.png"
        alt=""
        width={120}
        height={120}
        className="mx-auto"
        priority
      />
      <h2 className="text-2xl font-bold text-black md:text-3xl">{c.title}</h2>
    </div>
  );
}
