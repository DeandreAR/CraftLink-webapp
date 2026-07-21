import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type LandingCtaVariant = "primary" | "secondary" | "peach";
export type LandingCtaSize = "default" | "compact";

const sizeClasses: Record<LandingCtaSize, string> = {
  default: "px-6 py-3 text-sm md:text-[0.9375rem]",
  compact: "px-4 py-2 text-sm",
};

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efa188]";

const variants: Record<LandingCtaVariant, string> = {
  primary:
    "bg-zinc-900 text-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:brightness-110",
  peach:
    "bg-[#efa188] text-zinc-950 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:brightness-95 hover:-translate-y-0.5",
  secondary:
    "border border-zinc-200/80 bg-white text-zinc-900 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:border-[#efa188]/40 hover:bg-[#efa188]/10",
};

export type LandingCtaProps = {
  variant?: LandingCtaVariant;
  size?: LandingCtaSize;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function LandingCta({
  variant = "peach",
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
