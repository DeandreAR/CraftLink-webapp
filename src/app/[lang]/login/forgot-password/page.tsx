import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { redirectLoginForgotSubroute } from "@/lib/auth/redirectLoginSubroute";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LangForgotPasswordSubroutePage({ params, searchParams }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  redirectLoginForgotSubroute(raw as Locale, await searchParams);
}
