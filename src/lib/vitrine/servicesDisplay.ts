import type { VitrineService } from "@/domain/vitrine";

export type ServicesDisplayDensity = "sparse" | "medium" | "compact";

export function getServicesDisplayDensity(count: number): ServicesDisplayDensity {
  if (count <= 5) return "sparse";
  if (count <= 10) return "medium";
  return "compact";
}

export function getServicesListLayoutClass(count: number): string {
  const density = getServicesDisplayDensity(count);
  if (density === "compact") {
    return "grid grid-cols-2 gap-1.5";
  }
  return "grid grid-cols-2 gap-2";
}

export function getServicesItemClass(count: number): string {
  const density = getServicesDisplayDensity(count);
  switch (density) {
    case "sparse":
      return "rounded-2xl border border-[var(--v-muted)]/15 bg-[var(--v-surface)] px-4 py-4 text-base";
    case "medium":
      return "rounded-xl border border-[var(--v-muted)]/15 bg-[var(--v-surface)] px-3 py-2 text-sm";
    case "compact":
      return "rounded-lg border border-[var(--v-muted)]/15 bg-[var(--v-surface)] px-2 py-1 text-xs";
  }
}
