export type GeoCommune = {
  nom: string;
  code: string;
  codesPostaux: string[];
};

export type GeoDepartement = {
  nom: string;
  code: string;
};

export type CitySelection = {
  name: string;
  code: string;
  postalCode: string;
};

export type GeoSearchResult =
  | { kind: "departement"; departement: GeoDepartement }
  | { kind: "commune"; commune: GeoCommune };

/** Affiche le département (2 premiers chiffres du code postal, ou code DOM). */
export function formatPostalDepartment(postalCode: string): string {
  const trimmed = postalCode.trim();
  if (!trimmed) return "";
  if (/^\d{5}$/.test(trimmed)) {
    if (trimmed.startsWith("97") || trimmed.startsWith("98")) {
      return trimmed.slice(0, 3);
    }
    return trimmed.slice(0, 2);
  }
  return trimmed;
}

export function formatCommuneLabel(commune: GeoCommune): string {
  const postal = commune.codesPostaux[0] ?? "";
  const dept = formatPostalDepartment(postal);
  return dept ? `${commune.nom} (${dept})` : commune.nom;
}

export function formatDepartementLabel(departement: GeoDepartement): string {
  return `${departement.nom} (${departement.code})`;
}

export function formatCitySelectionLabel(city: CitySelection): string {
  const dept = formatPostalDepartment(city.postalCode);
  return dept ? `${city.name} (${dept})` : city.name;
}

export async function searchDepartements(query: string): Promise<GeoDepartement[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const isCode = /^(\d{2}|2[AB])$/i.test(trimmed);
  const params = new URLSearchParams({
    fields: "nom,code",
    limit: "5",
    ...(isCode ? { code: trimmed.toUpperCase() } : { nom: trimmed }),
  });

  const response = await fetch(`https://geo.api.gouv.fr/departements?${params.toString()}`);
  if (!response.ok) return [];

  const data = (await response.json()) as GeoDepartement[];
  return Array.isArray(data) ? data : [];
}

export async function searchCommunes(query: string): Promise<GeoCommune[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const isDeptCode = /^(\d{2}|2[AB])$/i.test(trimmed);
  const isPostal = /^\d{3,5}$/.test(trimmed);
  const params = new URLSearchParams({
    fields: "nom,code,codesPostaux",
    limit: "8",
    ...(isDeptCode
      ? { codeDepartement: trimmed.toUpperCase() }
      : isPostal
        ? { codePostal: trimmed }
        : { nom: trimmed }),
  });

  const response = await fetch(`https://geo.api.gouv.fr/communes?${params.toString()}`);
  if (!response.ok) return [];

  const data = (await response.json()) as GeoCommune[];
  return Array.isArray(data) ? data : [];
}

export async function searchGeoLocations(query: string): Promise<GeoSearchResult[]> {
  const [departements, communes] = await Promise.all([
    searchDepartements(query),
    searchCommunes(query),
  ]);

  const results: GeoSearchResult[] = [
    ...departements.map((departement) => ({ kind: "departement" as const, departement })),
    ...communes.map((commune) => ({ kind: "commune" as const, commune })),
  ];

  return results;
}

export function communeToSelection(commune: GeoCommune): CitySelection {
  const postal = commune.codesPostaux[0] ?? "";
  return {
    name: commune.nom,
    code: commune.code,
    postalCode: postal,
  };
}

export function departementToSelection(departement: GeoDepartement): CitySelection {
  return {
    name: departement.nom,
    code: departement.code,
    postalCode: departement.code,
  };
}
