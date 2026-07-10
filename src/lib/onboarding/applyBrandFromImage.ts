import { extractDominantColorFromUrl } from "@/lib/onboarding/extractDominantColor";

/** Met à jour la couleur de marque à partir d’un logo / avatar. */
export async function applyBrandColorFromImageUrl(
  imageUrl: string | null,
): Promise<string> {
  return extractDominantColorFromUrl(imageUrl);
}
