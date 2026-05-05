import type { HTMLAttributes, ReactNode } from "react";

export type HighlighterProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  color?: string;
  opacity?: number;
};

export function Highlighter({
  children,
  color = "#EFA188",
  opacity = 0.3,
  className = "",
  ...rest
}: HighlighterProps) {
  const clamped = Math.max(0, Math.min(1, opacity));
  const alpha = clamped.toFixed(3);

  return (
    <span className={`relative inline-block ${className}`.trim()} {...rest}>
      {clamped >= 1 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[0.12em] h-[0.22em] rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-1 bottom-0 top-[55%] -rotate-1 rounded-[18px]"
          style={{ backgroundColor: `rgba(239, 161, 136, ${alpha})` }}
        />
      )}
      <span className="relative">{children}</span>
    </span>
  );
}

