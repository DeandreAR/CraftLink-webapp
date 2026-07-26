import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/actions/auth";
import { LandingHeroDiagonalBrush } from "@/components/landing/LandingHeroDiagonalBrush";
import { LandingCta } from "@/components/landing/LandingCta";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

type AuthPageShellProps = {
  lang: Locale;
  title: string;
  subtitle: string;
  children: ReactNode;
  alternateHref: string;
  alternateLabel: string;
  signOutLabel?: string;
  backToHomeLabel?: string;
  contentClassName?: string;
  hideBrandPill?: boolean;
  hideHeading?: boolean;
  showBrush?: boolean;
};

export function AuthPageShell({
  lang,
  title,
  subtitle,
  children,
  alternateHref,
  alternateLabel,
  signOutLabel,
  backToHomeLabel = "Accueil",
  contentClassName = "max-w-lg",
  hideBrandPill = false,
  hideHeading = false,
  showBrush = false,
}: AuthPageShellProps) {
  const home = lang === defaultLocale ? "/" : `/${lang}`;

  return (
    <div className="landing-page relative min-h-screen overflow-x-clip bg-white text-black">
      {showBrush ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-hidden opacity-40">
          <LandingHeroDiagonalBrush variant="hero" />
        </div>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <Link href={home} className="inline-flex shrink-0 items-center" aria-label="CraftLink">
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="block h-7 w-auto md:h-8"
              decoding="async"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={home}
              className="hidden rounded-[20px] px-3 py-2 text-sm font-semibold text-zinc-500 transition hover:text-[#efa188] sm:inline-flex"
            >
              ← {backToHomeLabel}
            </Link>
            {signOutLabel ? (
              <form action={signOutAction}>
                <input type="hidden" name="locale" value={lang} />
                <button
                  type="submit"
                  className="min-h-[44px] rounded-[20px] border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black transition hover:border-[#efa188]/50 hover:bg-[#efa188]/10 active:scale-[0.98]"
                >
                  {signOutLabel}
                </button>
              </form>
            ) : (
              <LandingCta href={alternateHref} variant="primary" size="compact">
                {alternateLabel}
              </LandingCta>
            )}
          </div>
        </div>
      </header>

      <main className={`relative z-10 mx-auto px-4 py-10 md:px-6 md:py-14 ${contentClassName}`}>
        <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] md:p-8">
          {!hideBrandPill ? <span className="lk-eyebrow">CraftLink</span> : null}
          {!hideHeading && title ? (
            <h1
              className={`lk-display ${hideBrandPill ? "" : "mt-5"} text-[1.85rem] md:text-3xl lg:text-4xl`}
            >
              {title}
            </h1>
          ) : null}
          {!hideHeading && subtitle ? (
            <p className="lk-lead mt-3 text-base md:text-lg">{subtitle}</p>
          ) : null}
          <div className={hideHeading ? "mt-0" : "mt-8"}>{children}</div>
        </div>
      </main>
    </div>
  );
}
