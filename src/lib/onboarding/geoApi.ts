export type GeoCommune = {
  nom: string;
  code: string;
  codesPostaux: string[];
};

export type CitySelection = {
  name: string;
  code: string;
  postalCode: string;
};

export async function searchCommunes(query: string): Promise<GeoCommune[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const isPostal = /^\d{2,5}$/.test(trimmed);
  const params = new URLSearchParams({
    fields: "nom,code,codesPostaux",
    limit: "8",
    ...(isPostal ? { codePostal: trimmed } : { nom: trimmed }),
  });

  const response = await fetch(`https://geo.api.gouv.fr/communes?${params.toString()}`);
  if (!response.ok) return [];

  const data = (await response.json()) as GeoCommune[];
  return Array.isArray(data) ? data : [];
}

export function formatCommuneLabel(commune: GeoCommune): string {
  const postal = commune.codesPostaux[0] ?? "";
  return postal ? `${commune.nom} (${postal})` : commune.nom;
}

export function communeToSelection(commune: GeoCommune): CitySelection {
  return {
    name: commune.nom,
    code: commune.code,
    postalCode: commune.codesPostaux[0] ?? "",
  };
}
