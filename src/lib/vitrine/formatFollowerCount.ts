import type { Locale } from "@/i18n/config";

export function formatFollowerCount(count: number, locale: Locale): string {
  const value = Math.max(0, Math.round(count));
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted =
      millions >= 10
        ? String(Math.round(millions))
        : millions.toFixed(1).replace(/\.0$/, "");
    return `${formatted}M`;
  }
  if (value >= 10_000) {
    return `${Math.round(value / 1000)}k`;
  }
  if (value >= 1_000) {
    const thousands = value / 1000;
    return `${thousands.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return value.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

export function buildFollowersBadgeLabel(
  count: number,
  template: string,
  locale: Locale,
): string {
  return template.replace("{count}", formatFollowerCount(count, locale));
}
