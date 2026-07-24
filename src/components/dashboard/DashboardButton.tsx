import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export type DashboardButtonVariant = "primary" | "secondary" | "accent";
export type DashboardButtonSize = "sm" | "md";

const sizeClasses: Record<DashboardButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

const variantClasses: Record<DashboardButtonVariant, string> = {
  primary:
    "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400",
  accent:
    "border border-[#EFA188] bg-[#EFA188] text-slate-900 hover:brightness-95 focus-visible:outline-[#EFA188]",
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold tracking-tight transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type DashboardButtonProps = {
  variant?: DashboardButtonVariant;
  size?: DashboardButtonSize;
  href?: string;
  external?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** CTA dashboard OpenShip — noir / blanc bordé / accent pêche. */
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
