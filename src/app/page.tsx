import type { Metadata } from "next";
import { LandingHome } from "@/components/landing/LandingHome";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { buildPageOpenGraph } from "@/lib/seo/siteMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(defaultLocale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { canonical: "/" },
    openGraph: buildPageOpenGraph({
      title: dict.meta.title,
      description: dict.meta.description,
      path: "/",
    }),
  };
}

export default function HomePage() {
  return <LandingHome lang={defaultLocale} />;
}
