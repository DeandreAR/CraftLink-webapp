import { defaultLocale } from "@/i18n/config";
import { completeAuthCallback } from "@/lib/auth/completeAuthCallback";
import { resetPasswordPath } from "@/lib/auth/paths";

export async function GET(request: Request) {
  return completeAuthCallback(request, resetPasswordPath(defaultLocale));
}
