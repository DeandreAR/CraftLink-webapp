import type { Metadata } from "next";
import { LandingHome } from "@/components/landing/LandingHome";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(defaultLocale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default function HomePage() {
  return (
    <div className="landing-page">
      <LandingHome lang={defaultLocale} />
    </div>
  );
}
