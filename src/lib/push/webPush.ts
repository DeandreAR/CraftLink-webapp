import "server-only";

import webpush from "web-push";
import {
  getVapidPublicKey,
  isWebPushConfigured,
  type BrowserPushSubscription,
} from "@/lib/push/pushSubscription";

export type { BrowserPushSubscription } from "@/lib/push/pushSubscription";
export {
  getVapidPublicKey,
  isValidPushSubscription,
  isWebPushConfigured,
} from "@/lib/push/pushSubscription";

function getVapidPrivateKey(): string | null {
  return process.env.VAPID_PRIVATE_KEY?.trim() || null;
}

function getVapidSubject(): string {
  return (
    process.env.VAPID_SUBJECT?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "mailto:contact@getcraftlink.com"
  );
}

let configured = false;

function ensureWebPushConfigured(): boolean {
  const publicKey = getVapidPublicKey();
  const privateKey = getVapidPrivateKey();
  if (!publicKey || !privateKey) return false;

  if (!configured) {
    webpush.setVapidDetails(getVapidSubject(), publicKey, privateKey);
    configured = true;
  }
  return true;
}

export async function sendWebPushNotification(
  subscription: BrowserPushSubscription,
  payload: {
    title: string;
    body: string;
    url: string;
    leadId: string;
  },
): Promise<{ ok: true } | { ok: false; statusCode?: number; error: string }> {
  if (!ensureWebPushConfigured()) {
    return { ok: false, error: "VAPID keys manquantes" };
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { ok: true };
  } catch (error) {
    const statusCode =
      error && typeof error === "object" && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : undefined;
    const message = error instanceof Error ? error.message : "Échec envoi push";
    return { ok: false, statusCode, error: message };
  }
}

/** @deprecated Utiliser isWebPushConfigured depuis pushSubscription. */
export { isWebPushConfigured as webPushReady };
