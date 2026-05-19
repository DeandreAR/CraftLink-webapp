import type { HTMLAttributes } from "react";

export type MeshBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  intensity?: "subtle" | "normal";
};

export function MeshBackground({
  intensity = "normal",
  className = "",
  ...rest
}: MeshBackgroundProps) {
  void intensity;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 bg-white ${className}`.trim()}
      {...rest}
    />
  );
}

