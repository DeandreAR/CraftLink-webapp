import { NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { createBillingPortalSession } from "@/lib/stripe/createBillingPortalSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };
    const locale: Locale =
      body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
    const origin = new URL(request.url).origin;

    const result = await createBillingPortalSession(locale, origin);

    if (!result.ok) {
      const status =
        result.code === "unauthorized" ? 401 : result.code === "no_customer" ? 404 : 502;
      return NextResponse.json({ error: result.message }, { status });
    }

    return NextResponse.json({ url: result.url });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
