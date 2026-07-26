"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { LandingCta } from "@/components/landing/LandingCta";
import { authPath } from "@/lib/auth/paths";
import { defaultLocale, type Locale } from "@/i18n/config";
import { localeHomePath } from "@/lib/i18n/localePaths";
import { createClient } from "@/lib/supabase/client";

export type NavbarLabels = {
  howItWorks: string;
  metiers: string;
  tarifs: string;
  faq: string;
  login: string;
  createAccount: string;
  mySpace: string;
  languageSwitcherLabel: string;
  mobileMenuOpen: string;
  mobileMenuClose: string;
};

const defaultLabels: NavbarLabels = {
  howItWorks: "Comment ça marche",
  metiers: "Métiers",
  tarifs: "Tarifs",
  faq: "FAQ",
  login: "Connexion",
  createAccount: "Créer mon compte",
  mySpace: "Mon espace",
  languageSwitcherLabel: "Choisir la langue",
  mobileMenuOpen: "Ouvrir le menu",
  mobileMenuClose: "Fermer le menu",
};

type NavbarProps = {
  lang: Locale;
  labels?: NavbarLabels;
  /** Anchors nav masqués (sections commentées sur la landing). */
  hiddenSections?: Array<"howItWorks" | "metiers">;
};

const desktopNavLink =
  "hidden rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-black md:inline-flex";

const mobileNavLink =
  "flex min-h-[48px] items-center rounded-xl px-3.5 py-3 text-[0.95rem] font-semibold text-black transition-colors hover:bg-[#efa188]/12";

const headerBarScrolled =
  "border-black/8 bg-white/92 shadow-[0_4px_24px_rgba(0,0,0,0.05)] backdrop-blur-md";

const headerBarDefault = "border-transparent bg-white/80 backdrop-blur-sm";

const mobileMenuBottom = "calc(3.75rem + env(safe-area-inset-bottom))";

const mobileHeaderCtaClass =
  "min-h-[36px] px-2.5 py-1.5 text-[11px] leading-tight shadow-none hover:translate-y-0";

const mobileMenuCtaClass =
  "w-full min-h-[52px] px-4 py-3 text-sm shadow-none hover:translate-y-0";

export function Navbar({ lang, labels, hiddenSections = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const L = labels ?? defaultLabels;
  const homeHref = localeHomePath(lang);
  const basePath = lang === defaultLocale ? "" : `/${lang}`;
  const hidden = new Set(hiddenSections);
  const dashboardHref = authPath(lang, "dashboard");

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = createClient();
      void supabase.auth.getUser().then(({ data }) => {
        if (!cancelled) setIsAuthenticated(Boolean(data.user));
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) setIsAuthenticated(Boolean(session?.user));
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch {
      if (!cancelled) setIsAuthenticated(false);
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const showScrolled = hydrated && isScrolled;
  const headerBarClass = showScrolled ? headerBarScrolled : headerBarDefault;

  const navItems = [
    !hidden.has("howItWorks")
      ? { href: `${basePath}#features`, label: L.howItWorks, desktopClass: "lg:inline-flex" }
      : null,
    !hidden.has("metiers")
      ? { href: `${basePath}#metiers`, label: L.metiers, desktopClass: "lg:inline-flex" }
      : null,
    { href: `${basePath}#tarifs`, label: L.tarifs, desktopClass: "lg:inline-flex" },
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  const authCtas = isAuthenticated ? (
    <LandingCta
      href={dashboardHref}
      variant="primary"
      size="compact"
      className="shrink-0 whitespace-nowrap px-4"
    >
      {L.mySpace}
    </LandingCta>
  ) : (
    <>
      <LandingCta
        href={authPath(lang, "login")}
        variant="secondary"
        size="compact"
        className="shrink-0 whitespace-nowrap px-4"
      >
        {L.login}
      </LandingCta>
      <LandingCta
        href={authPath(lang, "signup")}
        variant="primary"
        size="compact"
        className="shrink-0 whitespace-nowrap px-4"
      >
        {L.createAccount}
      </LandingCta>
    </>
  );

  const mobileHeaderAuth = isAuthenticated ? (
    <LandingCta href={dashboardHref} variant="primary" className={mobileHeaderCtaClass}>
      {L.mySpace}
    </LandingCta>
  ) : (
    <>
      <LandingCta
        href={authPath(lang, "login")}
        variant="secondary"
        className={mobileHeaderCtaClass}
      >
        {L.login}
      </LandingCta>
      <LandingCta
        href={authPath(lang, "signup")}
        variant="primary"
        className={mobileHeaderCtaClass}
      >
        {L.createAccount}
      </LandingCta>
    </>
  );

  const mobileMenuAuth = isAuthenticated ? (
    <LandingCta
      href={dashboardHref}
      variant="primary"
      className={mobileMenuCtaClass}
      onClick={closeMenu}
    >
      {L.mySpace}
    </LandingCta>
  ) : (
    <>
      <LandingCta
        href={authPath(lang, "login")}
        variant="secondary"
        className={mobileMenuCtaClass}
        onClick={closeMenu}
      >
        {L.login}
      </LandingCta>
      <LandingCta
        href={authPath(lang, "signup")}
        variant="primary"
        className={mobileMenuCtaClass}
        onClick={closeMenu}
      >
        {L.createAccount}
      </LandingCta>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className={`border-b transition-all duration-300 ${headerBarClass}`}>
          <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center gap-2 px-4 md:justify-between md:gap-4 md:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Link href={homeHref} className="inline-flex shrink-0 items-center" aria-label="CraftLink">
                <img
                  src="/images/logo_main.png"
                  alt="CraftLink"
                  width={1731}
                  height={350}
                  className="block h-7 w-auto md:h-8"
                  decoding="async"
                />
              </Link>

              <div className="flex shrink-0 items-center gap-1.5 md:hidden">{mobileHeaderAuth}</div>
            </div>

            <nav className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3" aria-label="Navigation principale">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`${desktopNavLink} ${item.desktopClass}`.trim()}
                >
                  {item.label}
                </a>
              ))}
              <LocaleSwitcher currentLocale={lang} ariaLabel={L.languageSwitcherLabel} />
              {authCtas}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile : burger fixe en bas à droite */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end md:hidden">
        <div className="pointer-events-auto px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2">
          <button
            type="button"
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 active:scale-[0.96] ${headerBarScrolled}`}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? L.mobileMenuClose : L.mobileMenuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <HiX className="h-5 w-5 text-zinc-900" aria-hidden />
            ) : (
              <HiMenu className="h-5 w-5 text-zinc-900" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-zinc-900/20 backdrop-blur-[2px] md:hidden"
          aria-label={L.mobileMenuClose}
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id="landing-mobile-menu"
        aria-label="Navigation mobile"
        style={{ bottom: mobileMenuBottom }}
        className={`fixed right-3 z-[58] w-[min(calc(100vw-1.5rem),18rem)] overflow-hidden rounded-[24px] border transition-all duration-300 md:hidden ${headerBarScrolled} ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="max-h-[min(68dvh,32rem)] overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={mobileNavLink} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-black/8 pt-3 text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {L.languageSwitcherLabel}
            </p>
            <LocaleSwitcher
              currentLocale={lang}
              ariaLabel={L.languageSwitcherLabel}
              className="mx-auto w-fit justify-center"
            />
          </div>

          <div className="mt-3 flex flex-col gap-2">{mobileMenuAuth}</div>
        </div>
      </nav>
    </>
  );
}
