import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { redirectLoginResetSubroute } from "@/lib/auth/redirectLoginSubroute";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LangResetPasswordSubroutePage({ params, searchParams }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  redirectLoginResetSubroute(raw as Locale, await searchParams);
}
