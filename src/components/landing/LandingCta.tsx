import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type LandingCtaVariant = "primary" | "secondary" | "peach";
export type LandingCtaSize = "default" | "compact";

const sizeClasses: Record<LandingCtaSize, string> = {
  default: "min-h-[52px] px-7 py-3.5 text-[0.9375rem]",
  compact: "min-h-[44px] px-4 py-2.5 text-sm",
};

const base =
  "inline-flex items-center justify-center rounded-[20px] font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efa188]";

/** CLAUDE.md : primary = noir, secondary = blanc, peach = accent. */
const variants: Record<LandingCtaVariant, string> = {
  primary:
    "bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-zinc-900 hover:-translate-y-0.5",
  secondary:
    "border border-black/10 bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[#efa188]/50 hover:bg-[#efa188]/08",
  peach:
    "bg-[#efa188] text-black shadow-[0_8px_24px_rgba(239,161,136,0.35)] hover:brightness-[0.97] hover:-translate-y-0.5",
};

export type LandingCtaProps = {
  variant?: LandingCtaVariant;
  size?: LandingCtaSize;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function LandingCta({
  variant = "primary",
  size = "default",
  href,
  external,
  className = "",
  children,
  type = "button",
  ...rest
}: LandingCtaProps) {
  const classes = `${base} ${sizeClasses[size]} ${variants[variant]} ${className}`.trim();

  if (href) {
    const isExternal =
      external === true || href.startsWith("http://") || href.startsWith("https://");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
