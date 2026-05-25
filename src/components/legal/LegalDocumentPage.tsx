import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Navbar } from "@/components/landing/Navbar";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getLegalHref } from "@/i18n/legalPaths";
import type { LegalPageKey } from "@/i18n/legalPaths";
import type { Dictionary, LegalSectionJson } from "@/i18n/types";

type LegalDocumentPageProps = {
  lang: Locale;
  pageKey: LegalPageKey;
  dict: Dictionary;
};

function LegalSection({ section }: { section: LegalSectionJson }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold tracking-tight text-black md:text-xl">
        {section.title}
      </h2>
      {section.paragraphs?.map((p) => (
        <p
          key={p.slice(0, 48)}
          className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base"
        >
          {p}
        </p>
      ))}
      {section.list?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700 md:text-base">
          {section.list.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function LegalDocumentPage({
  lang,
  pageKey,
  dict,
}: LegalDocumentPageProps) {
  const page = dict.legal.pages[pageKey];
  const basePath = lang === defaultLocale ? "" : `/${lang}`;
  const homeHref = basePath || "/";

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar basePath={basePath || "/"} labels={dict.nav} />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <Link
          href={homeHref}
          className="text-sm font-semibold text-neutral-600 transition hover:text-black"
        >
          ← {dict.legal.backToHome}
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-black md:text-4xl">
          {page.title}
        </h1>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
          {dict.legal.lastUpdated} : {dict.legal.updatedDate}
        </p>
        {page.intro ? (
          <p className="mt-6 text-base leading-relaxed text-neutral-700 md:text-lg">
            {page.intro}
          </p>
        ) : null}
        <div className="mt-4 border-t border-neutral-200 pt-2">
          {page.sections.map((section) => (
            <LegalSection key={section.title} section={section} />
          ))}
        </div>
        <nav
          className="mt-12 flex flex-wrap gap-3 border-t border-neutral-200 pt-8 text-sm font-semibold"
          aria-label={dict.footer.legalNavLabel}
        >
          <Link href={getLegalHref(lang, "mentionsLegales")} className="text-neutral-600 hover:text-black">
            {dict.footer.links.mentionsLegales}
          </Link>
          <Link href={getLegalHref(lang, "privacy")} className="text-neutral-600 hover:text-black">
            {dict.footer.links.privacy}
          </Link>
          <Link href={getLegalHref(lang, "cookies")} className="text-neutral-600 hover:text-black">
            {dict.footer.links.cookies}
          </Link>
          <Link href={getLegalHref(lang, "terms")} className="text-neutral-600 hover:text-black">
            {dict.footer.links.terms}
          </Link>
        </nav>
      </main>
      <LandingFooter lang={lang} footer={dict.footer} />
    </div>
  );
}
