import { NextResponse } from "next/server";
import { defaultLocale } from "@/i18n/config";

/** Compat anciens e-mails : /auth/confirm-recovery → /auth/recovery */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const destination = new URL("/auth/recovery", requestUrl.origin);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  if (tokenHash) {
    destination.searchParams.set("token_hash", tokenHash);
  }
  return NextResponse.redirect(destination);
}
