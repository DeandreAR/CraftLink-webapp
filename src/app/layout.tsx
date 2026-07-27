import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { CookieConsentRoot } from "@/components/consent/CookieConsentRoot";
import { getResourcePreconnectOrigins } from "@/lib/seo/preconnectOrigins";
import { buildDefaultSiteMetadata } from "@/lib/seo/siteMetadata";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = buildDefaultSiteMetadata({
  title: "CraftLink | Le site vitrine et outil de contact pour les artisans",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const preconnectOrigins = getResourcePreconnectOrigins();

  return (
    <html lang="fr" className={`${lexend.variable} h-full antialiased`}>
      <head>
        {preconnectOrigins.map((origin) => (
          <link key={origin} rel="preconnect" href={origin} crossOrigin="anonymous" />
        ))}
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
      </head>
      <body className="min-h-full font-sans">
        {children}
        <MicrosoftClarity />
        <CookieConsentRoot />
      </body>
    </html>
  );
}
