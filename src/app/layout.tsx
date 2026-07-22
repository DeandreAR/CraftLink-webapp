import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { CookieConsentRoot } from "@/components/consent/CookieConsentRoot";
import { buildDefaultSiteMetadata } from "@/lib/seo/siteMetadata";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
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
  return (
    <html lang="fr" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <MicrosoftClarity />
        {children}
        <CookieConsentRoot />
      </body>
    </html>
  );
}
