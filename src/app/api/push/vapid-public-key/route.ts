import { NextResponse } from "next/server";
import { getVapidPublicKey, isWebPushConfigured } from "@/lib/push/pushSubscription";

export const runtime = "nodejs";

/** Clé publique VAPID pour PushManager.subscribe côté navigateur. */
export async function GET() {
  const publicKey = getVapidPublicKey();
  if (!publicKey || !isWebPushConfigured()) {
    return NextResponse.json(
      { configured: false, publicKey: null },
      { status: 200 },
    );
  }

  return NextResponse.json({ configured: true, publicKey });
}
