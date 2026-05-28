import type { CSSProperties } from "react";
import type { VitrineTheme } from "@/domain/vitrine";

export const DEFAULT_VITRINE_THEME: VitrineTheme = {
  primary: "#1e3a5f",
  primaryForeground: "#ffffff",
  accent: "#3b82f6",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  bannerFrom: "#93c5fd",
  bannerTo: "#e0f2fe",
};

/** Variables CSS injectées sur le conteneur racine de la vitrine. */
export function vitrineThemeStyle(theme: VitrineTheme): CSSProperties {
  return {
    "--primary-color": theme.primary,
    "--primary-color-light": `color-mix(in srgb, ${theme.primary} 75%, white)`,
    "--primary-color-soft": `color-mix(in srgb, ${theme.primary} 12%, ${theme.background})`,
    "--primary-border": `color-mix(in srgb, ${theme.primary} 32%, transparent)`,
    "--bg-color": theme.background,
    "--v-primary": theme.primary,
    "--v-primary-fg": theme.primaryForeground,
    "--v-accent": theme.accent,
    "--v-bg": theme.background,
    "--v-surface": theme.surface,
    "--v-text": theme.text,
    "--v-muted": theme.textMuted,
    "--v-banner-from": theme.bannerFrom,
    "--v-banner-to": theme.bannerTo,
  } as CSSProperties;
}
