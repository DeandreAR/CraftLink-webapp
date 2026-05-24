import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

type AuthPageShellProps = {
  lang: Locale;
  title: string;
  subtitle: string;
  children: ReactNode;
  alternateHref: string;
  alternateLabel: string;
};

export function AuthPageShell({
  lang,
  title,
  subtitle,
  children,
  alternateHref,
  alternateLabel,
}: AuthPageShellProps) {
  const home = lang === defaultLocale ? "/" : `/${lang}`;

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4 md:px-6">
          <Link href={home} className="text-sm font-semibold text-neutral-600 hover:text-black">
            ← Accueil
          </Link>
          <Link href={alternateHref} className="text-sm font-semibold text-[#EFA188] hover:underline">
            {alternateLabel}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-base text-neutral-600">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
