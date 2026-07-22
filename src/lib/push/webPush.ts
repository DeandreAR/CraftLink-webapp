import "server-only";

import webpush from "web-push";

export type BrowserPushSubscription = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export function getVapidPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() || null;
}

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

export function isWebPushConfigured(): boolean {
  return Boolean(getVapidPublicKey() && getVapidPrivateKey());
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

export function isValidPushSubscription(
  value: unknown,
): value is BrowserPushSubscription {
  if (!value || typeof value !== "object") return false;
  const raw = value as Record<string, unknown>;
  if (typeof raw.endpoint !== "string" || !raw.endpoint.trim()) return false;
  const keys = raw.keys;
  if (!keys || typeof keys !== "object") return false;
  const k = keys as Record<string, unknown>;
  return typeof k.p256dh === "string" && typeof k.auth === "string";
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
