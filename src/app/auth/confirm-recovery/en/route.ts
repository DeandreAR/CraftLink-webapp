import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const destination = new URL("/auth/recovery", requestUrl.origin);
  destination.searchParams.set("locale", "en");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  if (tokenHash) {
    destination.searchParams.set("token_hash", tokenHash);
  }
  return NextResponse.redirect(destination);
}
