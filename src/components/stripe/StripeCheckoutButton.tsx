"use client";

import { useCallback, useState } from "react";
import type { Locale } from "@/i18n/config";
import { GlowButton, type GlowButtonVariant } from "@/components/ui/GlowButton";
import type { StripeCheckoutPriceKey } from "@/lib/stripe/checkoutTypes";
import { startStripeCheckout } from "@/lib/stripe/startCheckout";

type StripeCheckoutButtonProps = {
  priceKey: StripeCheckoutPriceKey;
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  variant?: GlowButtonVariant;
  successPath?: string;
  cancelPath?: string;
  disabled?: boolean;
  onBeforeCheckout?: () => Promise<boolean>;
  onError?: (message: string) => void;
};

export function StripeCheckoutButton({
  priceKey,
  locale,
  children,
  className = "",
  variant = "primary",
  successPath,
  cancelPath,
  disabled = false,
  onBeforeCheckout,
  onError,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      if (onBeforeCheckout) {
        const ready = await onBeforeCheckout();
        if (!ready) {
          return;
        }
      }
      const result = await startStripeCheckout({
        priceKey,
        locale,
        successPath,
        cancelPath,
      });
      if (!result.ok) {
        onError?.(result.message);
      }
    } catch {
      onError?.("Impossible de démarrer le paiement.");
    } finally {
      setLoading(false);
    }
  }, [loading, disabled, onBeforeCheckout, priceKey, locale, successPath, cancelPath, onError]);

  return (
    <GlowButton
      type="button"
      variant={variant}
      className={className}
      disabled={disabled || loading}
      onClick={() => void handleClick()}
    >
      {loading ? "Redirection…" : children}
    </GlowButton>
  );
}
