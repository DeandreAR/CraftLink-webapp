const FALLBACK_BRAND = "#1e3a5f";

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function isNearWhite(r: number, g: number, b: number): boolean {
  return r > 240 && g > 240 && b > 240;
}

function isNearBlack(r: number, g: number, b: number): boolean {
  return r < 20 && g < 20 && b < 20;
}

/**
 * Extrait une couleur dominante depuis une image (canvas).
 * Retourne une couleur de repli si l’image est absente ou illisible.
 */
export async function extractDominantColorFromUrl(
  imageUrl: string | null | undefined,
): Promise<string> {
  if (!imageUrl?.trim()) return FALLBACK_BRAND;

  if (typeof window === "undefined") return FALLBACK_BRAND;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(FALLBACK_BRAND);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 128) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (isNearWhite(r, g, b) || isNearBlack(r, g, b)) continue;
          rSum += r;
          gSum += g;
          bSum += b;
          count += 1;
        }
        if (count === 0) {
          resolve(FALLBACK_BRAND);
          return;
        }
        resolve(rgbToHex(rSum / count, gSum / count, bSum / count));
      } catch {
        resolve(FALLBACK_BRAND);
      }
    };

    img.onerror = () => resolve(FALLBACK_BRAND);
    img.src = imageUrl;
  });
}

export { FALLBACK_BRAND };
