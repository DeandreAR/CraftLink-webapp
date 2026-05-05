import type { HTMLAttributes } from "react";

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: "2xl";
  elevated?: boolean;
};

export function GlassCard({
  rounded = "2xl",
  elevated = true,
  className = "",
  children,
  ...rest
}: GlassCardProps) {
  const r = "rounded-2xl";
  const elevation = elevated ? "surface" : "border border-[#E5E7EB] bg-white";

  return (
    <div
      className={`${r} ${elevation} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

