import { NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { isStripeCheckoutPriceKey } from "@/lib/stripe/prices";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      price_key?: string;
      locale?: string;
      success_path?: string;
      cancel_path?: string;
    };

    const priceKey = body.price_key?.trim() ?? "";
    if (!isStripeCheckoutPriceKey(priceKey)) {
      return NextResponse.json(
        { error: "price_key invalide (pro_monthly | pro_annual)." },
        { status: 400 },
      );
    }

    const locale: Locale =
      body.locale && isLocale(body.locale) ? body.locale : defaultLocale;

    const origin = new URL(request.url).origin;
    const successPath =
      body.success_path?.startsWith("/") ? body.success_path : `/${locale}/onboarding?plan=pro&stripe=success`;
    const cancelPath =
      body.cancel_path?.startsWith("/") ? body.cancel_path : undefined;

    const result = await createCheckoutSession({
      priceKey,
      locale,
      origin,
      successPath,
      cancelPath,
    });

    if (!result.ok) {
      if (result.code === "unauthorized") {
        return NextResponse.json(
          { error: "Connexion requise.", loginUrl: result.loginUrl },
          { status: 401 },
        );
      }
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

    return NextResponse.json({ url: result.url });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
