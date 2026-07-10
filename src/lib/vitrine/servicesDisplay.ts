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
    return "grid grid-cols-2 gap-1";
  }
  return "grid grid-cols-2 gap-1.5";
}

export function getServicesItemClass(count: number): string {
  const density = getServicesDisplayDensity(count);
  switch (density) {
    case "sparse":
      return "rounded-xl border border-[var(--v-muted)]/15 bg-[var(--v-surface)] px-3 py-2.5 text-sm";
    case "medium":
      return "rounded-lg border border-[var(--v-muted)]/15 bg-[var(--v-surface)] px-2.5 py-1.5 text-xs";
    case "compact":
      return "rounded-md border border-[var(--v-muted)]/15 bg-[var(--v-surface)] px-2 py-1 text-[11px]";
  }
}
