import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type DashboardButtonVariant = "primary" | "secondary" | "accent";
export type DashboardButtonSize = "sm" | "md";

const sizeClasses: Record<DashboardButtonSize, string> = {
  sm: "min-h-[40px] px-3.5 py-2 text-xs",
  md: "min-h-[52px] px-5 py-3 text-sm",
};

const variantClasses: Record<DashboardButtonVariant, string> = {
  primary:
    "border border-black bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:bg-zinc-900 focus-visible:outline-black",
  secondary:
    "border border-black/10 bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[#efa188]/50 hover:bg-[#efa188]/08 focus-visible:outline-[#efa188]",
  accent:
    "border border-[#efa188] bg-[#efa188] text-black shadow-[0_8px_24px_rgba(239,161,136,0.3)] hover:brightness-[0.97] focus-visible:outline-[#efa188]",
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-[20px] font-semibold tracking-tight transition duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type DashboardButtonProps = {
  variant?: DashboardButtonVariant;
  size?: DashboardButtonSize;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** CTA dashboard — aligné landing / CLAUDE.md (noir · blanc · pêche). */
export function DashboardButton({
  variant = "primary",
  size = "md",
  href,
  external,
  className = "",
  children,
  type = "button",
  ...rest
}: DashboardButtonProps) {
  const classes =
    `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();

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
