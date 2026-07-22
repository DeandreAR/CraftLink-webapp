"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    return null;
  }
}

async function subscribePush(
  registration: ServiceWorkerRegistration,
): Promise<PushSubscription | null> {
  if (!("PushManager" in window)) return null;

  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  const vapidRes = await fetch("/api/push/vapid-public-key");
  const vapidJson = (await vapidRes.json()) as {
    configured?: boolean;
    publicKey?: string | null;
  };
  if (!vapidJson.configured || !vapidJson.publicKey) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const keyBytes = urlBase64ToUint8Array(vapidJson.publicKey);
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyBytes.buffer.slice(
      keyBytes.byteOffset,
      keyBytes.byteOffset + keyBytes.byteLength,
    ) as ArrayBuffer,
  });
}

async function persistSubscription(subscription: PushSubscription): Promise<boolean> {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  });
  return res.ok;
}

type PushNotificationsPromptProps = {
  /** Libellés FR/EN optionnels. */
  labels?: {
    title: string;
    body: string;
    enable: string;
    later: string;
    enabled: string;
    unsupported: string;
  };
};

const DEFAULT_LABELS = {
  title: "Alertes nouvelles demandes",
  body: "Recevez une notification sur votre téléphone dès qu'un client envoie une demande.",
  enable: "Activer les notifications",
  later: "Plus tard",
  enabled: "Notifications activées sur cet appareil",
  unsupported: "Les notifications push ne sont pas disponibles sur ce navigateur.",
};

/**
 * Enregistre le Service Worker + propose l'abonnement Web Push (PWA / Chrome / Safari iOS 16.4+).
 */
export function PushNotificationsPrompt({ labels = DEFAULT_LABELS }: PushNotificationsPromptProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "enabled" | "denied" | "unsupported" | "hidden"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!("serviceWorker" in navigator) || !("Notification" in window)) {
        if (!cancelled) setStatus("unsupported");
        return;
      }

      const registration = await registerServiceWorker();
      if (!registration) {
        if (!cancelled) setStatus("unsupported");
        return;
      }

      if (Notification.permission === "granted") {
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
          await persistSubscription(sub);
          if (!cancelled) setStatus("enabled");
          return;
        }
      }

      if (Notification.permission === "denied") {
        if (!cancelled) setStatus("denied");
        return;
      }

      const dismissed = window.localStorage.getItem("craftlink_push_prompt_dismissed");
      if (dismissed === "1" && !cancelled) {
        setStatus("hidden");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = async () => {
    setStatus("loading");
    setError(null);
    try {
      const registration = await registerServiceWorker();
      if (!registration) {
        setStatus("unsupported");
        return;
      }

      const subscription = await subscribePush(registration);
      if (!subscription) {
        setStatus(Notification.permission === "denied" ? "denied" : "idle");
        return;
      }

      const ok = await persistSubscription(subscription);
      if (!ok) {
        setError("Impossible d'enregistrer l'abonnement. Réessayez.");
        setStatus("idle");
        return;
      }

      window.localStorage.removeItem("craftlink_push_prompt_dismissed");
      setStatus("enabled");
    } catch {
      setError("Activation impossible sur cet appareil.");
      setStatus("idle");
    }
  };

  const dismiss = () => {
    window.localStorage.setItem("craftlink_push_prompt_dismissed", "1");
    setStatus("hidden");
  };

  if (status === "hidden" || status === "denied") return null;

  if (status === "unsupported") {
    return (
      <p className="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
        {labels.unsupported}
      </p>
    );
  }

  if (status === "enabled") {
    return (
      <p className="mb-4 rounded-2xl border border-[#efa188]/30 bg-[#efa188]/10 px-4 py-3 text-xs font-medium text-[#212129]">
        {labels.enabled}
      </p>
    );
  }

  return (
    <div className="mb-4 rounded-2xl border border-[#efa188]/35 bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      <p className="text-sm font-bold text-[#212129]">{labels.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#5b6478]">{labels.body}</p>
      {error ? (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void enable()}
          disabled={status === "loading"}
          className="rounded-full bg-[#efa188] px-4 py-2 text-xs font-bold text-[#212129] transition hover:brightness-95 disabled:opacity-60"
        >
          {status === "loading" ? "…" : labels.enable}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
        >
          {labels.later}
        </button>
      </div>
    </div>
  );
}
