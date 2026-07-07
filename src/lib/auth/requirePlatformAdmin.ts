import { notFound, redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";

function parseAdminEmailAllowlist(): string[] {
  const raw =
    process.env.ADMIN_ANALYTICS_EMAILS?.trim() ??
    process.env.ADMIN_DATA_DASHBOARD?.trim() ??
    "";

  if (!raw) return [];

  return raw
    .split(/[,;]/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = parseAdminEmailAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

/** Accès réservé plateforme — redirection login ou 404. */
export async function requirePlatformAdmin(): Promise<{ email: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(authPath(defaultLocale, "login"));
  }

  if (!isPlatformAdminEmail(user.email)) {
    notFound();
  }

  return { email: user.email! };
}
