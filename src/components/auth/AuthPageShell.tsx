import Link from "next/link";
import type { ReactNode } from "react";
import { MeshBackground } from "@/components/landing/MeshBackground";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

type AuthPageShellProps = {
  lang: Locale;
  title: string;
  subtitle: string;
  children: ReactNode;
  alternateHref: string;
  alternateLabel: string;
  backToHomeLabel?: string;
};

export function AuthPageShell({
  lang,
  title,
  subtitle,
  children,
  alternateHref,
  alternateLabel,
  backToHomeLabel = "Accueil",
}: AuthPageShellProps) {
  const home = lang === defaultLocale ? "/" : `/${lang}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <MeshBackground intensity="subtle" />

      <header className="relative z-10 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            href={home}
            className="landing-nav-logo inline-flex shrink-0 items-center text-black"
            aria-label="CraftLink"
          >
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="block h-8 w-auto max-w-none md:h-10"
              decoding="async"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={home}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition hover:text-black sm:inline-flex"
            >
              ← {backToHomeLabel}
            </Link>
            <GlowButton href={alternateHref} variant="secondary" className="text-sm">
              {alternateLabel}
            </GlowButton>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg px-4 py-10 md:px-6 md:py-14">
        <GlassCard
          rounded="2xl"
          className="border border-neutral-200/90 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[#EFA188]/30 bg-[#EFA188]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-900">
            <span className="h-2 w-2 rounded-full bg-[#EFA188]" aria-hidden />
            CraftLink
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-neutral-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </GlassCard>
      </main>
    </div>
  );
}
