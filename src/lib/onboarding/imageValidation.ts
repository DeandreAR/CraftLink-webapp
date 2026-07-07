import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/domain/onboarding";

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: "type" | "size" };

export function validateOnboardingImage(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { ok: false, error: "type" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "size" };
  }
  return { ok: true };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}
