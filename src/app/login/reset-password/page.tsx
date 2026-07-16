import { defaultLocale } from "@/i18n/config";
import { redirectLoginResetSubroute } from "@/lib/auth/redirectLoginSubroute";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordSubroutePage({ searchParams }: Props) {
  redirectLoginResetSubroute(defaultLocale, await searchParams);
}
