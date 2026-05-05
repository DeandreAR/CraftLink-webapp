import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

export const buttonBaseClass =
  "glow-hover inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold tracking-tight transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 md:text-base";

export type ButtonVariant = "mint" | "lavender" | "peach" | "outline";

const variantClass: Record<ButtonVariant, string> = {
  mint: "bg-cyan-500/15 text-neutral-900 shadow-[0_18px_55px_rgba(15,23,42,0.14)] hover:bg-cyan-500/20",
  lavender:
    "bg-indigo-500/15 text-neutral-900 shadow-[0_18px_55px_rgba(15,23,42,0.14)] hover:bg-indigo-500/20",
  peach: "bg-rose-500/15 text-neutral-900 shadow-[0_18px_55px_rgba(15,23,42,0.14)] hover:bg-rose-500/20",
  outline:
    "glass text-neutral-900 shadow-[0_18px_55px_rgba(15,23,42,0.12)] hover:bg-white/80",
};

export type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button({
  variant = "mint",
  href,
  external,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const variantStyles = variantClass[variant];
  const classes = `${buttonBaseClass} ${variantStyles} ${className}`.trim();

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
