import { defaultLocale } from "@/i18n/config";
import { redirectLoginForgotSubroute } from "@/lib/auth/redirectLoginSubroute";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ForgotPasswordSubroutePage({ searchParams }: Props) {
  redirectLoginForgotSubroute(defaultLocale, await searchParams);
}
