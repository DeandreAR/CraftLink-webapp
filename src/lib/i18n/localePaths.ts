import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export function localeHomePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

/** Bascule la locale dans l’URL courante (ex. `/en/login` → `/login`). */
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);

  const rest = segments.length > 0 && isLocale(segments[0]) ? segments.slice(1) : segments;
  const pathWithoutLocale = rest.length > 0 ? `/${rest.join("/")}` : "/";

  if (targetLocale === defaultLocale) {
    return pathWithoutLocale;
  }

  if (pathWithoutLocale === "/") {
    return `/${targetLocale}`;
  }

  return `/${targetLocale}${pathWithoutLocale}`;
}
