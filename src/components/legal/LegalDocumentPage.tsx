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
      <h2 className="lk-display text-lg md:text-xl">{section.title}</h2>
      {section.paragraphs?.map((p) => (
        <p
          key={p.slice(0, 48)}
          className="lk-lead mt-3 text-sm md:text-base"
        >
          {p}
        </p>
      ))}
      {section.list?.length ? (
        <ul className="lk-lead mt-3 list-disc space-y-2 pl-5 text-sm md:text-base">
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
    <div className="landing-page min-h-screen bg-[#FDFBF7] text-[#212129]">
      <Navbar lang={lang} labels={dict.nav} />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <Link
          href={homeHref}
          className="text-sm font-semibold text-[#5b6478] transition hover:text-[#EFA188]"
        >
          ← {dict.legal.backToHome}
        </Link>
        <h1 className="lk-display mt-6 text-3xl md:text-4xl">{page.title}</h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5b6478]">
          {dict.legal.lastUpdated} : {dict.legal.updatedDate}
        </p>
        {page.intro ? (
          <p className="lk-lead mt-6 text-base md:text-lg">{page.intro}</p>
        ) : null}
        <div className="mt-4 border-t border-[#EFA188]/20 pt-2">
          {page.sections.map((section) => (
            <LegalSection key={section.title} section={section} />
          ))}
        </div>
        <nav
          className="mt-12 flex flex-wrap gap-3 border-t border-[#EFA188]/20 pt-8 text-sm font-semibold"
          aria-label={dict.footer.legalNavLabel}
        >
          <Link href={getLegalHref(lang, "mentionsLegales")} className="text-[#5b6478] hover:text-[#EFA188]">
            {dict.footer.links.mentionsLegales}
          </Link>
          <Link href={getLegalHref(lang, "privacy")} className="text-[#5b6478] hover:text-[#EFA188]">
            {dict.footer.links.privacy}
          </Link>
          <Link href={getLegalHref(lang, "cookies")} className="text-[#5b6478] hover:text-[#EFA188]">
            {dict.footer.links.cookies}
          </Link>
          <Link href={getLegalHref(lang, "terms")} className="text-[#5b6478] hover:text-[#EFA188]">
            {dict.footer.links.terms}
          </Link>
        </nav>
      </main>
      <LandingFooter lang={lang} footer={dict.footer} />
    </div>
  );
}
