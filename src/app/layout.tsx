import type { Metadata } from "next";
import { Fraunces, Lexend } from "next/font/google";
import { CookieConsentRoot } from "@/components/consent/CookieConsentRoot";
import { buildDefaultSiteMetadata } from "@/lib/seo/siteMetadata";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-landing-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildDefaultSiteMetadata({
  title: {
    default: "CraftLink",
    template: "%s — CraftLink",
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${lexend.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}
        <CookieConsentRoot />
      </body>
    </html>
  );
}
