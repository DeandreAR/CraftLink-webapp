import { type NextRequest } from "next/server";
import { completeAuthCallback } from "@/lib/auth/completeAuthCallback";
import { resetPasswordPath } from "@/lib/auth/paths";

export async function GET(request: NextRequest) {
  return completeAuthCallback(request, resetPasswordPath("en"));
}
