import { type NextRequest, NextResponse } from "next/server";
import { shouldRewriteRootToVitrine } from "@/lib/onboarding/vitrineSlugRewrite";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const vitrineSlug = shouldRewriteRootToVitrine(request.nextUrl.pathname);
  if (vitrineSlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/p/${vitrineSlug}`;
    const rewrite = NextResponse.rewrite(url);
    return updateSession(request, rewrite);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
