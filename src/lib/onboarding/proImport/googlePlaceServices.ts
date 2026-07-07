import { MAX_ONBOARDING_SERVICES } from "@/domain/onboarding";

type SerpServiceEntry = string | { name?: string; title?: string; description?: string };

type MenuItem = { title?: string; name?: string; description?: string };
type MenuSection = { title?: string; items?: MenuItem[] };
type SerpMenu = {
  categories?: MenuSection[];
  sections?: MenuSection[];
  items?: MenuItem[];
};

export type SerpPlaceWithServices = {
  services?: SerpServiceEntry[];
  offerings?: SerpServiceEntry[];
  extensions?: Record<string, string[]>[];
  unsupported_extensions?: Record<string, string[]>[];
  menu?: SerpMenu;
  type?: string | string[];
};

function pushServiceName(names: string[], entry: SerpServiceEntry): void {
  if (typeof entry === "string") {
    const trimmed = entry.trim();
    if (trimmed) names.push(trimmed);
    return;
  }
  const label = entry.name?.trim() || entry.title?.trim();
  if (label) names.push(label);
}

function pushMenuItems(names: string[], items: MenuItem[] | undefined): void {
  for (const item of items ?? []) {
    const label = item.title?.trim() || item.name?.trim();
    if (label) names.push(label);
  }
}

function pushExtensionServices(
  names: string[],
  extensions: Record<string, string[]>[] | undefined,
): void {
  for (const extension of extensions ?? []) {
    for (const [key, values] of Object.entries(extension)) {
      if (!/service|offering|prestation|menu/i.test(key) || !Array.isArray(values)) continue;
      for (const value of values) {
        if (typeof value === "string" && value.trim()) {
          names.push(value.trim());
        }
      }
    }
  }
}

function pushMenuCategories(names: string[], menu: SerpMenu | undefined): void {
  if (!menu) return;

  pushMenuItems(names, menu.items);

  for (const section of [...(menu.categories ?? []), ...(menu.sections ?? [])]) {
    pushMenuItems(names, section.items);
  }
}

/** Extrait les prestations listées sur une fiche Google (services GMB, menu, extensions). */
export function extractGooglePlaceServices(place: SerpPlaceWithServices): string[] {
  const names: string[] = [];

  for (const entry of place.services ?? []) {
    pushServiceName(names, entry);
  }
  for (const entry of place.offerings ?? []) {
    pushServiceName(names, entry);
  }

  pushExtensionServices(names, place.extensions);
  pushExtensionServices(names, place.unsupported_extensions);
  pushMenuCategories(names, place.menu);

  const unique = [...new Set(names)];
  return unique.slice(0, MAX_ONBOARDING_SERVICES);
}
