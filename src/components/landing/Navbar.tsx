"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 md:text-base"
          >
            <span className="grid h-8 w-8 place-items-center rounded-2xl bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
              C
            </span>
            <span className="font-semibold">CraftLink</span>
          </Link>

          <nav className="flex items-center gap-2">
            <a
              href="#features"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 md:inline-flex"
            >
              Fonctionnalités
            </a>
            <a
              href="#preview"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 md:inline-flex"
            >
              Aperçu
            </a>
            <GlowButton href="#cta" className="px-4 py-2.5">
              Démarrer
            </GlowButton>
          </nav>
        </div>
      </div>
    </header>
  );
}

