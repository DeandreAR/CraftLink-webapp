import { NextResponse } from "next/server";
import { isAllowedGooglePhotoUrl } from "@/lib/onboarding/proImport/googlePhotoProxy";

/** Proxy lecture seule pour afficher les photos GMB sans hotlink/CORS côté client. */
export async function GET(request: Request) {
  const urlParam = new URL(request.url).searchParams.get("url")?.trim();
  if (!urlParam || !isAllowedGooglePhotoUrl(urlParam)) {
    return NextResponse.json({ error: "URL invalide" }, { status: 400 });
  }

  try {
    const upstream = await fetch(urlParam, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.google.com/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Image inaccessible" }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image inaccessible" }, { status: 502 });
  }
}
