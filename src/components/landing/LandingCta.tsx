import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type LandingCtaVariant = "primary" | "secondary" | "peach";

const base =
  "inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-bold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EFA188] md:text-base";

const variants: Record<LandingCtaVariant, string> = {
  primary:
    "bg-[#212129] text-white shadow-[0_12px_32px_rgba(33,33,41,0.22)] hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_16px_40px_rgba(33,33,41,0.28)]",
  peach:
    "border-2 border-[#212129] bg-[#EFA188] text-[#212129] shadow-[0_10px_28px_rgba(239,161,136,0.35)] hover:-translate-y-0.5 hover:bg-[#E08A6F]",
  secondary:
    "border-2 border-[#212129]/15 bg-white/90 text-[#212129] hover:border-[#EFA188] hover:bg-[#EFA188]/10",
};

export type LandingCtaProps = {
  variant?: LandingCtaVariant;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function LandingCta({
  variant = "primary",
  href,
  external,
  className = "",
  children,
  type = "button",
  ...rest
}: LandingCtaProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

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
