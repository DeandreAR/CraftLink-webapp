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

/**
 * Évite l’avertissement « multiple lockfiles » + expose les variables publiques au bundle client.
 */
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: appUrl,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
  devIndicators: false,
  turbopack: {
    root: projectDir,
  },
};

export default nextConfig;
