import type { HTMLAttributes } from "react";

export type CardTone = "mint" | "lavender" | "peach" | "neutral";

const toneClass: Record<CardTone, string> = {
  mint: "bg-cyan-500/10",
  lavender: "bg-indigo-500/10",
  peach: "bg-rose-500/10",
  neutral: "bg-white/70",
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  interactive?: boolean;
};

export function Card({
  tone = "neutral",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const toneStyles = toneClass[tone];
  const interactiveStyles = interactive
    ? "cursor-pointer transition-all hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    : "";

  return (
    <div
      className={`glass rounded-[28px] ${toneStyles} ${interactiveStyles} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
