import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type GlowButtonVariant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold tracking-tight transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:text-base";

const variants: Record<GlowButtonVariant, string> = {
  primary:
    "bg-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:scale-[1.05] hover:shadow-[0_22px_48px_rgba(0,0,0,0.22)]",
  secondary:
    "border border-black bg-transparent text-black shadow-[0_12px_26px_rgba(0,0,0,0.08)] hover:scale-[1.03]",
};

export type GlowButtonProps = {
  variant?: GlowButtonVariant;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function GlowButton({
  variant = "primary",
  href,
  external,
  className = "",
  children,
  type = "button",
  ...rest
}: GlowButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    const isExternal =
      external === true ||
      href.startsWith("http://") ||
      href.startsWith("https://");

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

