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
  "hidden rounded-lg px-2.5 py-2 text-xs font-semibold text-[#5b6478] transition-colors hover:text-[#EFA188] md:inline-flex lg:px-3 lg:text-sm";

const mobileNavLink =
  "block rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#212129] transition-colors hover:bg-[#EFA188]/15";

const headerBarScrolled =
  "border-[#EFA188]/30 bg-[#FDFBF7]/92 shadow-[0_12px_40px_rgba(239,161,136,0.12)] backdrop-blur-md";

const headerBarDefault = "border-transparent bg-[#FDFBF7]/80 backdrop-blur-sm";

const mobileMenuBottom = "calc(3.5rem + env(safe-area-inset-bottom))";

const mobileHeaderCtaClass =
  "px-2 py-1 text-[10px] leading-tight shadow-none hover:translate-y-0";

const mobileMenuCtaClass =
  "w-full px-3 py-1.5 text-xs shadow-none hover:translate-y-0";

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
      ? { href: `${basePath}#controle`, label: L.howItWorks, desktopClass: "lg:inline-flex" }
      : null,
    !hidden.has("metiers")
      ? { href: `${basePath}#metiers`, label: L.metiers, desktopClass: "lg:inline-flex" }
      : null,
    { href: `${basePath}#tarifs`, label: L.tarifs, desktopClass: "lg:inline-flex" },
    { href: `${basePath}#faq`, label: L.faq, desktopClass: "lg:inline-flex" },
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  const authCtas = isAuthenticated ? (
    <LandingCta
      href={dashboardHref}
      variant="peach"
      size="compact"
      className="shrink-0 whitespace-nowrap px-3 lg:px-4"
    >
      {L.mySpace}
    </LandingCta>
  ) : (
    <>
      <LandingCta
        href={authPath(lang, "login")}
        variant="secondary"
        size="compact"
        className="shrink-0 whitespace-nowrap px-3 lg:px-4"
      >
        {L.login}
      </LandingCta>
      <LandingCta
        href={authPath(lang, "signup")}
        variant="peach"
        size="compact"
        className="shrink-0 whitespace-nowrap px-3 lg:px-4"
      >
        {L.createAccount}
      </LandingCta>
    </>
  );

  const mobileHeaderAuth = isAuthenticated ? (
    <LandingCta href={dashboardHref} variant="peach" className={mobileHeaderCtaClass}>
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
        variant="peach"
        className={mobileHeaderCtaClass}
      >
        {L.createAccount}
      </LandingCta>
    </>
  );

  const mobileMenuAuth = isAuthenticated ? (
    <LandingCta
      href={dashboardHref}
      variant="peach"
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
        variant="peach"
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
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 md:justify-between md:gap-4 md:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Link href={homeHref} className="inline-flex shrink-0 items-center" aria-label="CraftLink">
                <img
                  src="/images/logo_main.png"
                  alt="CraftLink"
                  width={1731}
                  height={350}
                  className="block h-6 w-auto md:h-7"
                  decoding="async"
                />
              </Link>

              <div className="flex shrink-0 items-center gap-1 md:hidden">{mobileHeaderAuth}</div>
            </div>

            <nav className="hidden shrink-0 items-center gap-1.5 md:flex lg:gap-2.5" aria-label="Navigation principale">
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
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 active:scale-[0.96] ${headerBarScrolled}`}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? L.mobileMenuClose : L.mobileMenuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <HiX className="h-5 w-5 text-[#212129]" aria-hidden />
            ) : (
              <HiMenu className="h-5 w-5 text-[#212129]" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-[#212129]/20 backdrop-blur-[2px] md:hidden"
          aria-label={L.mobileMenuClose}
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id="landing-mobile-menu"
        aria-label="Navigation mobile"
        style={{ bottom: mobileMenuBottom }}
        className={`fixed right-3 z-[58] w-[min(calc(100vw-1.5rem),17rem)] overflow-hidden rounded-2xl border transition-all duration-300 md:hidden ${headerBarScrolled} ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="max-h-[min(62dvh,28rem)] overflow-y-auto p-2.5">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={mobileNavLink} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-2.5 border-t border-[#EFA188]/25 pt-2.5 text-center">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5b6478]">
              {L.languageSwitcherLabel}
            </p>
            <LocaleSwitcher
              currentLocale={lang}
              ariaLabel={L.languageSwitcherLabel}
              className="mx-auto w-fit justify-center"
            />
          </div>

          <div className="mt-2.5 flex flex-col gap-1">{mobileMenuAuth}</div>
        </div>
      </nav>
    </>
  );
}
