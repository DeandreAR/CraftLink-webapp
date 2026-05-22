"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";

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

export function Navbar({ basePath = "", labels }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const L = labels ?? defaultLabels;
  const p = basePath || "";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div
        className={`border-b transition-colors ${
          isScrolled ? "border-neutral-200" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            href={p ? `${p}` : "/"}
            className="landing-nav-logo inline-flex shrink-0 items-center text-black"
            aria-label="CraftLink"
          >
            <img
              src="/images/logo_main.png"
              alt="CraftLink"
              width={1731}
              height={350}
              className="landing-nav-logo-img block h-8 w-auto max-w-none md:h-10"
              decoding="async"
            />
          </Link>

          <nav className="flex items-center gap-2">
            <a
              href={`${p}#pourquoi`}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 lg:inline-flex"
            >
              {L.why}
            </a>
            <a
              href={`${p}#features`}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 md:inline-flex"
            >
              {L.features}
            </a>
            <a
              href={`${p}#metiers`}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 lg:inline-flex"
            >
              {L.metiers}
            </a>
            <a
              href={`${p}#tarifs`}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 md:inline-flex"
            >
              {L.tarifs}
            </a>
            <a
              href={`${p}#faq`}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 lg:inline-flex"
            >
              {L.faq}
            </a>
            <GlowButton
              href={`${p}#connexion`}
              variant="secondary"
              className="px-3 py-2.5 text-sm md:px-4"
            >
              {L.login}
            </GlowButton>
            <GlowButton href={`${p}#cta`} className="px-3 py-2.5 text-sm md:px-4">
              {L.createAccount}
            </GlowButton>
          </nav>
        </div>
      </div>
    </header>
  );
}
