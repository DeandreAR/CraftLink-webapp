import path from "node:path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const projectDir = path.resolve(process.cwd());
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
  "";

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "https://getcraftlink.com";

function supabaseHostname(): string | null {
  if (!supabaseUrl) return null;
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
}

const authLoginRedirects = [
  {
    source: "/login/reset-password",
    destination: "/login",
    permanent: false,
  },
  {
    source: "/:lang/login/reset-password",
    destination: "/:lang/login",
    permanent: false,
  },
] as const;

const supabaseHost = supabaseHostname();

/**
 * Évite l’avertissement « multiple lockfiles » + expose les variables publiques au bundle client.
 */
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: appUrl,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  devIndicators: false,
  turbopack: {
    root: projectDir,
  },
  async redirects() {
    return [...authLoginRedirects];
  },
};

export default nextConfig;
