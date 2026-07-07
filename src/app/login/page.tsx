import { AuthConnexionPage } from "@/components/auth/AuthConnexionPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const prepared = await prepareAuthPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <AuthConnexionPage
      lang={defaultLocale}
      copy={dict.auth}
      authError={error}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
