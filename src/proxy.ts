import { type NextRequest, NextResponse } from "next/server";
import {
  parseInternalVitrinePath,
  parseLegacyVitrinePath,
  resolveRootVitrineSlug,
} from "@/config/reservedSlugs";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Routage vitrine racine :
 * - URL publique : getcraftlink.com/{slug}
 * - Rewrite interne : /v/{slug} (évite le conflit avec /[lang])
 * - Redirections canoniques : /p/{slug} et /v/{slug} → /{slug}
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const legacySlug = parseLegacyVitrinePath(pathname);
  if (legacySlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/${legacySlug}`;
    return NextResponse.redirect(url, 308);
  }

  const internalSlug = parseInternalVitrinePath(pathname);
  if (internalSlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/${internalSlug}`;
    return NextResponse.redirect(url, 308);
  }

  const vitrineSlug = resolveRootVitrineSlug(pathname);
  if (vitrineSlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/v/${vitrineSlug}`;
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
