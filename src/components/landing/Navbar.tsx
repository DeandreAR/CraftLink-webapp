"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LandingCta } from "@/components/landing/LandingCta";
import { authPath } from "@/lib/auth/paths";
import { defaultLocale } from "@/i18n/config";

export type NavbarLabels = {
  why: string;
  features: string;
  metiers: string;
  tarifs: string;
  faq: string;
  login: string;
  createAccount: string;
};

const defaultLabels: NavbarLabels = {
  why: "Pourquoi",
  features: "Fonctions",
  metiers: "Métiers",
  tarifs: "Tarifs",
  faq: "FAQ",
  login: "Connexion",
  createAccount: "Créer mon compte",
};

type NavbarProps = {
  basePath?: string;
  labels?: NavbarLabels;
};

const navLink =
  "hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#5b6478] transition-colors hover:text-[#EFA188] md:inline-flex";

export function Navbar({ basePath = "", labels }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const L = labels ?? defaultLabels;
  const p = basePath || "";
  const locale = p === "/en" ? "en" : defaultLocale;

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showScrolled = hydrated && isScrolled;

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b transition-all duration-300 ${
          showScrolled
            ? "border-[#EFA188]/25 bg-[#FDFBF7]/95 shadow-[0_8px_32px_rgba(239,161,136,0.08)] backdrop-blur-md"
            : "border-transparent bg-[#FDFBF7]/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <Link href={p ? `${p}` : "/"} className="inline-flex shrink-0 items-center" aria-label="CraftLink">
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="block h-6 w-auto md:h-7"
              decoding="async"
            />
          </Link>

          <nav className="flex items-center gap-2 md:gap-2.5">
            <a href={`${p}#pourquoi`} className={`${navLink} lg:inline-flex`}>{L.why}</a>
            <a href={`${p}#features`} className={navLink}>{L.features}</a>
            <a href={`${p}#metiers`} className={`${navLink} lg:inline-flex`}>{L.metiers}</a>
            <a href={`${p}#tarifs`} className={`${navLink} lg:inline-flex`}>{L.tarifs}</a>
            <a href={`${p}#faq`} className={`${navLink} lg:inline-flex`}>{L.faq}</a>
            <LandingCta href={authPath(locale, "login")} variant="secondary" className="px-3 py-2 text-sm md:px-4">
              {L.login}
            </LandingCta>
            <LandingCta href={authPath(locale, "signup")} variant="peach" className="px-3 py-2 text-sm md:px-4">
              {L.createAccount}
            </LandingCta>
          </nav>
        </div>
      </div>
    </header>
  );
}
