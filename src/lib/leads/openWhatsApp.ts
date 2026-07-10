import type { LeadWhatsAppLinks } from "@/lib/leads/buildLeadWhatsAppLink";

export function isMobileUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/** URL à ouvrir selon la plateforme. */
export function resolveWhatsAppUrl(links: LeadWhatsAppLinks): string {
  return isMobileUserAgent() ? links.api : links.web;
}

function openViaAnchor(url: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Ouvre WhatsApp pendant le geste utilisateur (clic).
 * Retourne la fenêtre si window.open a réussi (pour pouvoir la fermer si quota refusé).
 */
export function openWhatsAppLinks(links: LeadWhatsAppLinks): Window | null {
  const url = resolveWhatsAppUrl(links);
  if (!url) return null;

  try {
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (popup) return popup;
  } catch {
    // window.open bloqué — repli ci-dessous
  }

  openViaAnchor(url);
  return null;
}

/** @deprecated Utiliser openWhatsAppLinks. Conservé pour compatibilité interne. */
export function openWhatsAppHref(href: string, popup: Window | null = null): boolean {
  if (!href) return false;

  if (popup && !popup.closed) {
    try {
      popup.location.href = href;
      return true;
    } catch {
      popup.close();
    }
  }

  openViaAnchor(href);
  return true;
}

/** @deprecated L’ouverture synchrone via openWhatsAppLinks remplace le pré-onglet. */
export function preOpenWhatsAppTab(): Window | null {
  if (typeof window === "undefined") return null;
  try {
    return window.open("about:blank", "_blank");
  } catch {
    return null;
  }
}
