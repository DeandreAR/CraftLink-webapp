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
    <div className="landing-page relative min-h-screen overflow-x-clip bg-[#FDFBF7] text-[#212129]">
      {showBrush ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-hidden opacity-45">
          <LandingHeroDiagonalBrush variant="hero" />
        </div>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[#EFA188]/25 bg-[#FDFBF7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <Link href={home} className="inline-flex shrink-0 items-center" aria-label="CraftLink">
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="block h-6 w-auto md:h-7"
              decoding="async"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={home}
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#5b6478] transition hover:text-[#EFA188] sm:inline-flex"
            >
              ← {backToHomeLabel}
            </Link>
            {signOutLabel ? (
              <form action={signOutAction}>
                <input type="hidden" name="locale" value={lang} />
                <button
                  type="submit"
                  className="rounded-lg border border-[#212129]/15 bg-white px-3 py-2 text-sm font-semibold text-[#5b6478] transition hover:border-[#EFA188]/50 hover:text-[#EFA188] md:px-4"
                >
                  {signOutLabel}
                </button>
              </form>
            ) : (
              <LandingCta href={alternateHref} variant="peach" className="px-3 py-2 text-sm md:px-4">
                {alternateLabel}
              </LandingCta>
            )}
          </div>
        </div>
      </header>

      <main className={`relative z-10 mx-auto px-4 py-10 md:px-6 md:py-14 ${contentClassName}`}>
        <div className="rounded-[1.75rem] border-2 border-[#212129]/10 bg-white/95 p-6 shadow-[0_24px_64px_rgba(33,33,41,0.08)] backdrop-blur-sm md:p-8">
          {!hideBrandPill ? (
            <span className="lk-eyebrow">CraftLink</span>
          ) : null}
          {!hideHeading && title ? (
            <h1
              className={`lk-display ${hideBrandPill ? "" : "mt-5"} text-3xl md:text-4xl`}
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
