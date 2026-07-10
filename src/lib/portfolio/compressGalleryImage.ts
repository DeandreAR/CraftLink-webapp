import {
  GALLERY_IMAGE_MAX_WIDTH_PX,
  GALLERY_WEBP_QUALITY,
} from "@/domain/portfolio";

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire l'image."));
    };
    img.src = url;
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header?.match(/data:(.*?);/)?.[1] ?? "image/webp";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Compresse une photo (max 800px, WebP 70%) avant upload Storage.
 * Utilise Canvas + toDataURL comme spécifié.
 */
export async function compressGalleryImage(file: File): Promise<Blob> {
  const image = await loadImageFromFile(file);
  const scale = Math.min(1, GALLERY_IMAGE_MAX_WIDTH_PX / image.width);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Compression impossible dans ce navigateur.");
  }

  ctx.drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/webp", GALLERY_WEBP_QUALITY);
  return dataUrlToBlob(dataUrl);
}
