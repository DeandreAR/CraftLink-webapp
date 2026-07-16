"use client";

import Image from "next/image";
import { GlowButton } from "@/components/ui/GlowButton";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { onboardingPath } from "@/lib/auth/paths";

type AccountConfirmedPageClientProps = {
  lang: Locale;
  copy: OnboardingDictionary;
};

export function AccountConfirmedPageClient({ lang, copy }: AccountConfirmedPageClientProps) {
  const c = copy.accountConfirmed;

  return (
    <AuthPageShell
      lang={lang}
      title=""
      subtitle=""
      alternateHref="/"
      alternateLabel=""
      signOutLabel={copy.signOut}
      backToHomeLabel="Accueil"
      contentClassName="max-w-md"
      hideBrandPill
      hideHeading
      showBrush
    >
      <div className="mx-auto space-y-6 py-8 text-center">
        <Image
          src="/images/onboarding-fireworks.png"
          alt=""
          width={120}
          height={120}
          className="mx-auto"
          priority
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-black md:text-3xl">{c.title}</h1>
          <p className="text-sm leading-relaxed text-neutral-600 md:text-base">{c.body}</p>
        </div>
        <GlowButton href={onboardingPath(lang)} className="w-full justify-center">
          {c.cta}
        </GlowButton>
        <p className="text-xs text-neutral-500">{c.hint}</p>
      </div>
    </AuthPageShell>
  );
}
